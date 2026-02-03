'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

// Theme categories for coloring
const THEME_COLORS: Record<string, string> = {
  // Outcomes (green)
  checkmate: '#58CC02',
  pureCheckmate: '#FFD700',
  queen_win: '#7ED957',
  major_win: '#98E067',
  minor_win: '#B2E77A',
  pawn_win: '#CCF08D',
  positional: '#4CAF50',

  // Mechanisms (blue)
  fork: '#1CB0F6',
  pin: '#4FC3F7',
  skewer: '#29B6F6',
  discoveredAttack: '#03A9F4',
  doubleCheck: '#00BCD4',

  // Enablers (orange)
  attraction: '#FF9600',
  deflection: '#FFB74D',
  clearance: '#FFA726',
  sacrifice: '#FF8A65',
  interference: '#FFCC80',

  // Forcing (purple)
  check: '#A560E8',
  capture: '#BA68C8',
  quiet: '#9575CD',
  tactical: '#7E57C2',
};

const THEME_LABELS: Record<string, string> = {
  checkmate: 'Checkmate',
  pureCheckmate: 'Pure Mate Puzzles',
  queen_win: 'Win Queen',
  major_win: 'Win Major Piece',
  minor_win: 'Win Minor Piece',
  pawn_win: 'Win Pawn',
  positional: 'Positional',
  fork: 'Fork',
  pin: 'Pin',
  skewer: 'Skewer',
  discoveredAttack: 'Discovered Attack',
  doubleCheck: 'Double Check',
  attraction: 'Attraction',
  deflection: 'Deflection',
  clearance: 'Clearance',
  sacrifice: 'Sacrifice',
  interference: 'Interference',
  check: 'Check',
  capture: 'Capture',
  quiet: 'Quiet Move',
  tactical: 'Tactical',
};

const LEVEL_OPTIONS = [
  { value: '400-800', label: '400-800 ELO', color: '#58CC02' },
  { value: '800-1200', label: '800-1200 ELO', color: '#1CB0F6' },
  { value: '1200-1600', label: '1200-1600 ELO', color: '#FF9600' },
];

interface FlowData {
  flow: string;
  count: number;
}

interface Stats {
  total: number;
  combinations: {
    percent: number;
    topFlows: FlowData[];
    allFlows?: FlowData[];
  };
  primaryThemes: Record<string, number>;
  outcomes: Record<string, number>;
}


export default function TestThemeSankey() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedLevel, setSelectedLevel] = useState('400-800');
  const [flowData, setFlowData] = useState<FlowData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [minCount, setMinCount] = useState(100);
  const [error, setError] = useState<string | null>(null);

  const levelColor = LEVEL_OPTIONS.find(l => l.value === selectedLevel)?.color || '#58CC02';

  // Fetch flow data
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/puzzles/analyzed?level=${selectedLevel}&limit=1`)
      .then(res => res.json())
      .then((data) => {
        if (data.stats) {
          setStats(data.stats);
          setFlowData(data.stats.combinations.allFlows || data.stats.combinations.topFlows || []);
        } else if (data.error) {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedLevel]);

  // Build and render Sankey
  useEffect(() => {
    if (!svgRef.current || loading) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 900;
    const height = 600;
    const margin = { top: 20, right: 150, bottom: 20, left: 150 };

    if (flowData.length === 0 || !stats) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.5)')
        .attr('font-size', '14px')
        .text(error || 'No flow data available.');
      return;
    }

    // Parse flows into nodes and links
    const nodeNames = new Set<string>();
    const linkMap = new Map<string, number>();

    // Filter flows by minimum count
    const filteredFlows = flowData.filter(f => f.count >= minCount);

    // Outcomes are the final targets
    const OUTCOMES = new Set(['checkmate', 'queen_win', 'major_win', 'minor_win', 'pawn_win', 'positional']);

    // Simplify flows: first theme → final outcome
    // This avoids cycles from intermediate mechanism→mechanism links
    filteredFlows.forEach(({ flow, count }) => {
      const parts = flow.split(' → ').map(p => p.trim());

      if (parts.length < 2) return;

      // Find the first non-outcome theme (the initiating tactic)
      const source = parts[0];

      // Find the last part (should be the outcome)
      const target = parts[parts.length - 1];

      // Skip if source equals target or if source is already an outcome
      if (source === target) return;
      if (OUTCOMES.has(source)) return;

      nodeNames.add(source);
      nodeNames.add(target);

      const key = `${source}|||${target}`;
      linkMap.set(key, (linkMap.get(key) || 0) + count);
    });

    console.log('Simplified nodes:', Array.from(nodeNames));
    console.log('Simplified links:', Array.from(linkMap.entries()));

    // NOTE: We only use actual combination flow data from chain analysis
    // Single-theme puzzles (fork→material, etc.) aren't tracked with flow data
    // so we don't estimate them - this keeps the Sankey accurate to real data

    if (nodeNames.size === 0 || linkMap.size === 0) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.5)')
        .attr('font-size', '14px')
        .text('No flows meet the minimum count. Try lowering the filter.');
      return;
    }

    // Build nodes array with indices
    const nodeList = Array.from(nodeNames);
    const nodeIndexMap = new Map(nodeList.map((name, i) => [name, i]));
    const nodes = nodeList.map(name => ({ name }));

    // Build links array using numerical indices
    // IMPORTANT: Filter out self-loops (source === target) which cause "circular link" errors
    const links: { source: number; target: number; value: number }[] = [];
    linkMap.forEach((value, key) => {
      const [source, target] = key.split('|||');
      // Skip self-referential links
      if (source === target) return;

      const sourceIdx = nodeIndexMap.get(source);
      const targetIdx = nodeIndexMap.get(target);
      if (sourceIdx !== undefined && targetIdx !== undefined && sourceIdx !== targetIdx) {
        links.push({ source: sourceIdx, target: targetIdx, value });
      }
    });

    if (links.length === 0) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.5)')
        .text('No valid links found.');
      return;
    }

    // Type definitions for sankey
    interface SankeyNodeType {
      name: string;
      x0?: number;
      y0?: number;
      x1?: number;
      y1?: number;
      value?: number;
    }

    interface SankeyLinkType {
      source: number | SankeyNodeType;
      target: number | SankeyNodeType;
      value: number;
      width?: number;
    }

    // Create Sankey generator
    const sankeyGenerator = sankey<SankeyNodeType, SankeyLinkType>()
      .nodeWidth(20)
      .nodePadding(12)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    // Generate layout
    let graph: { nodes: SankeyNodeType[]; links: SankeyLinkType[] };
    try {
      const result = sankeyGenerator({
        nodes: nodes.map(n => ({ ...n })) as SankeyNodeType[],
        links: links.map(l => ({ ...l })) as SankeyLinkType[],
      });
      graph = {
        nodes: result.nodes as SankeyNodeType[],
        links: result.links as SankeyLinkType[],
      };
    } catch (err) {
      console.error('Sankey error:', err);
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(255,255,255,0.5)')
        .text('Error generating Sankey diagram. Check console.');
      return;
    }

    // After sankey processing, source/target become node objects
    type GraphNode = SankeyNodeType;
    type GraphLink = { source: GraphNode; target: GraphNode; value: number; width?: number };

    const graphNodes = graph.nodes as GraphNode[];
    const graphLinks = graph.links as GraphLink[];

    // Draw links
    svg.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(graphLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d) => THEME_COLORS[d.source.name] || '#666')
      .attr('stroke-width', (d) => Math.max(1, d.width || 1))
      .attr('stroke-opacity', 0.5)
      .style('mix-blend-mode', 'screen')
      .on('mouseenter', function() {
        d3.select(this).attr('stroke-opacity', 0.8);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('stroke-opacity', 0.5);
      })
      .append('title')
      .text((d) => `${THEME_LABELS[d.source.name] || d.source.name} → ${THEME_LABELS[d.target.name] || d.target.name}\n${d.value.toLocaleString()} puzzles`);

    // Draw nodes
    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(graphNodes)
      .join('g');

    nodeGroup.append('rect')
      .attr('x', (d) => d.x0 || 0)
      .attr('y', (d) => d.y0 || 0)
      .attr('height', (d) => Math.max(1, (d.y1 || 0) - (d.y0 || 0)))
      .attr('width', (d) => (d.x1 || 0) - (d.x0 || 0))
      .attr('fill', (d) => THEME_COLORS[d.name] || '#666')
      .attr('rx', 3)
      .attr('stroke', 'rgba(255,255,255,0.3)')
      .attr('stroke-width', 1);

    // Node labels
    nodeGroup.append('text')
      .attr('x', (d) => ((d.x0 || 0) < width / 2) ? (d.x1 || 0) + 8 : (d.x0 || 0) - 8)
      .attr('y', (d) => ((d.y0 || 0) + (d.y1 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => ((d.x0 || 0) < width / 2) ? 'start' : 'end')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', 500)
      .text((d) => THEME_LABELS[d.name] || d.name);

    // Value labels
    nodeGroup.append('text')
      .attr('x', (d) => ((d.x0 || 0) < width / 2) ? (d.x1 || 0) + 8 : (d.x0 || 0) - 8)
      .attr('y', (d) => ((d.y0 || 0) + (d.y1 || 0)) / 2 + 14)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => ((d.x0 || 0) < width / 2) ? 'start' : 'end')
      .attr('fill', 'rgba(255,255,255,0.5)')
      .attr('font-size', '10px')
      .text((d) => d.value ? d.value.toLocaleString() : '');

  }, [flowData, stats, minCount, loading, error]);

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-white/60 hover:text-white">
            <ChevronLeft />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">Theme Flow Sankey</h1>
            <p className="text-xs text-white/50">
              How puzzles flow from tactics to outcomes (based on chain analysis)
            </p>
          </div>

          {/* Level Selector */}
          <div className="flex gap-2">
            {LEVEL_OPTIONS.map((level) => (
              <button
                key={level.value}
                onClick={() => setSelectedLevel(level.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedLevel === level.value
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                }`}
                style={{
                  backgroundColor: selectedLevel === level.value
                    ? level.color + '30'
                    : 'transparent',
                  borderColor: selectedLevel === level.value
                    ? level.color
                    : 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              >
                {level.label}
              </button>
            ))}
          </div>

          {/* Min count filter */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/20">
            <span className="text-xs text-white/40">Min puzzles:</span>
            <select
              value={minCount}
              onChange={(e) => setMinCount(Number(e.target.value))}
              className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs"
            >
              <option value={10}>10+</option>
              <option value={50}>50+</option>
              <option value={100}>100+</option>
              <option value={500}>500+</option>
              <option value={1000}>1,000+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      {stats && (
        <div
          className="border-b border-white/10 px-4 py-2"
          style={{ backgroundColor: levelColor + '10' }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-white/50">Total puzzles: </span>
                <span className="text-white font-medium">{stats.total.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-white/50">Combinations: </span>
                <span className="text-white font-medium">{stats.combinations.percent}%</span>
              </div>
            </div>
            <div className="text-xs text-white/40">
              Showing flows with {minCount}+ puzzles
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-white/50">Loading flow data...</div>
          </div>
        ) : (
          <div className="bg-[#0D1A1F] rounded-xl p-6 border border-white/10">
            <svg
              ref={svgRef}
              width="900"
              height="600"
              style={{ display: 'block', margin: '0 auto' }}
            />
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-[#1A2C35] rounded-xl p-4 border border-white/10">
          <h3 className="text-sm font-semibold text-white/70 mb-3">Theme Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="text-xs text-[#58CC02] font-semibold mb-2">OUTCOMES</h4>
              <div className="space-y-1">
                {['checkmate', 'queen_win', 'major_win', 'minor_win'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-white/60">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: THEME_COLORS[t] }} />
                    {THEME_LABELS[t]}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs text-[#1CB0F6] font-semibold mb-2">MECHANISMS</h4>
              <div className="space-y-1">
                {['fork', 'pin', 'skewer', 'discoveredAttack'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-white/60">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: THEME_COLORS[t] }} />
                    {THEME_LABELS[t]}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs text-[#FF9600] font-semibold mb-2">ENABLERS</h4>
              <div className="space-y-1">
                {['attraction', 'deflection', 'clearance', 'sacrifice'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-white/60">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: THEME_COLORS[t] }} />
                    {THEME_LABELS[t]}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs text-[#A560E8] font-semibold mb-2">FORCING</h4>
              <div className="space-y-1">
                {['check', 'capture', 'quiet'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-white/60">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: THEME_COLORS[t] }} />
                    {THEME_LABELS[t]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Flow breakdown table */}
        {flowData.length > 0 && (
          <div className="mt-6 bg-[#1A2C35] rounded-xl p-4 border border-white/10">
            <h3 className="text-sm font-semibold text-white/70 mb-3">Top Combination Flows</h3>
            <div className="space-y-2">
              {flowData
                .filter(f => f.count >= minCount)
                .slice(0, 15)
                .map((flow, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 w-6">{i + 1}.</span>
                      <span className="text-white font-mono text-xs">{flow.flow}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.min(200, flow.count / 50)}px`,
                          backgroundColor: levelColor,
                          opacity: 0.6,
                        }}
                      />
                      <span className="text-white/60 text-xs w-16 text-right">
                        {flow.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
