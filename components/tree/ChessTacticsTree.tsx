'use client';

import React, { useState, useEffect } from 'react';

// Node with position and parent connections
interface TreeNode {
  id: string;
  label: string;
  x: number;
  y: number;
  parents: string[];
  tier: TierKey;
  description?: string;
}

type TierKey = 'ultimate' | 'outcomes' | 'mechanisms' | 'enablers' | 'forcing';

// Hardcoded tree structure for visual design iteration
// Data will be plugged in later from theme-hierarchy.ts
function buildTreeData() {
  const WIDTH = 1000;

  // Helper to distribute nodes evenly
  const distributeX = (count: number, index: number, padding = 100) => {
    if (count === 1) return WIDTH / 2;
    const usableWidth = WIDTH - padding * 2;
    return padding + (usableWidth / (count - 1)) * index;
  };

  // ULTIMATE GOAL - Checkmate alone at top
  const ultimateNodes: TreeNode[] = [
    {
      id: 'checkmate',
      label: 'Checkmate',
      x: WIDTH / 2,
      y: 30,  // Moved up to create more space for visible lines
      parents: [],
      tier: 'ultimate',
      description: 'The ultimate goal - trap the king',
    },
  ];

  // SECONDARY OUTCOMES - flow into Checkmate
  const outcomeLabels = [
    { id: 'endgame', label: 'Endgame', desc: 'Convert advantage to win', parents: ['checkmate'] },
    { id: 'matePatterns', label: 'Mate Patterns', desc: 'Checkmate sequences', parents: ['checkmate'] },
    { id: 'winMaterial', label: 'Win Material', desc: 'Gain pieces/pawns', parents: ['checkmate', 'endgame'] },
  ];
  const outcomeNodes: TreeNode[] = outcomeLabels.map((item, i) => ({
    id: item.id,
    label: item.label,
    x: distributeX(outcomeLabels.length, i, 150),
    y: 140,
    parents: item.parents,
    tier: 'outcomes' as TierKey,
    description: item.desc,
  }));

  // MECHANISMS - tactical patterns (removed exposedKing)
  const mechanismLabels = [
    { id: 'fork', label: 'Fork', desc: 'Attack two pieces at once' },
    { id: 'pin', label: 'Pin', desc: 'Piece shields more valuable piece' },
    { id: 'skewer', label: 'Skewer', desc: 'Attack through to piece behind' },
    { id: 'discovery', label: 'Discovered Attack', desc: 'Reveal hidden attacker' },
    { id: 'doubleCheck', label: 'Double Check', desc: 'Two pieces give check' },
  ];
  const mechanismNodes: TreeNode[] = mechanismLabels.map((item, i) => ({
    id: item.id,
    label: item.label,
    x: distributeX(mechanismLabels.length, i, 80),
    y: 260,
    // Mechanisms lead to outcomes - material, endgame, or mate
    parents: (() => {
      switch (item.id) {
        case 'fork': return ['winMaterial', 'endgame']; // Forks common in endgames
        case 'pin': return ['winMaterial', 'endgame']; // Pins win material or simplify to endgame
        case 'skewer': return ['winMaterial', 'endgame']; // Skewers common in R+K endgames
        case 'discovery': return ['winMaterial', 'matePatterns', 'endgame'];
        case 'doubleCheck': return ['matePatterns'];
        default: return ['winMaterial'];
      }
    })(),
    tier: 'mechanisms' as TierKey,
    description: item.desc,
  }));

  // ENABLERS - setup moves (more spread out)
  // Some enablers go through mechanisms, others can bypass directly to outcomes
  const enablerLabels = [
    { id: 'attraction', label: 'Attraction', desc: 'Lure piece to bad square' },
    { id: 'deflection', label: 'Deflection', desc: 'Pull defender away' },
    { id: 'clearance', label: 'Clearance', desc: 'Open a line or square' },
    { id: 'removal', label: 'Remove Defender', desc: 'Capture the protector' },
    { id: 'interference', label: 'Interference', desc: 'Block defensive line' },
    { id: 'overload', label: 'Overloading', desc: 'Too many jobs for one piece' },
  ];
  const enablerNodes: TreeNode[] = enablerLabels.map((item, i) => ({
    id: item.id,
    label: item.label,
    x: distributeX(enablerLabels.length, i, 60),
    y: 400,
    parents: (() => {
      // Enablers connect to mechanisms AND can bypass directly to outcomes
      switch (item.id) {
        case 'attraction':
          // Attraction sets up forks/pins/skewers, but can also directly enable mate
          return ['fork', 'pin', 'skewer', 'matePatterns'];
        case 'deflection':
          // Deflection sets up tactics, but can directly win hanging material
          return ['fork', 'pin', 'winMaterial'];
        case 'clearance':
          // Clearance enables discoveries, but can directly open mating lines
          return ['discovery', 'skewer', 'matePatterns'];
        case 'removal':
          // Remove defender often directly wins material (no mechanism needed)
          return ['winMaterial', 'fork'];
        case 'interference':
          // Interference can directly win material or enable pins
          return ['pin', 'winMaterial'];
        case 'overload':
          // Overloaded pieces lose material directly when exploited
          return ['fork', 'winMaterial'];
        default: return ['fork'];
      }
    })(),
    tier: 'enablers' as TierKey,
    description: item.desc,
  }));

  // FORCING MOVES - can go to enablers, mechanisms, or even outcomes directly
  const forcingLabels = [
    { id: 'check', label: 'Check', desc: 'Attack the king' },
    { id: 'capture', label: 'Capture', desc: 'Take a piece' },
    { id: 'threat', label: 'Threat', desc: 'Threaten something valuable' },
  ];
  const forcingNodes: TreeNode[] = forcingLabels.map((item, i) => ({
    id: item.id,
    label: item.label,
    x: distributeX(forcingLabels.length, i, 250),
    y: 540,
    parents: (() => {
      // Forcing moves have flexible connections
      switch (item.id) {
        case 'check':
          return ['attraction', 'deflection', 'clearance', 'fork', 'doubleCheck']; // Can go to enablers OR mechanisms
        case 'capture':
          return ['attraction', 'deflection', 'removal', 'winMaterial']; // Can even go to outcomes!
        case 'threat':
          return ['deflection', 'overload', 'winMaterial']; // Simple threats can win material directly
        default: return ['attraction'];
      }
    })(),
    tier: 'forcing' as TierKey,
    description: item.desc,
  }));

  return {
    ultimate: ultimateNodes,
    outcomes: outcomeNodes,
    mechanisms: mechanismNodes,
    enablers: enablerNodes,
    forcing: forcingNodes,
  };
}

const tierColors: Record<TierKey, { bg: string; glow: string; border: string }> = {
  ultimate: { bg: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)', border: '#FFEC8B' }, // Gold for checkmate
  outcomes: { bg: '#58CC02', glow: 'rgba(88, 204, 2, 0.4)', border: '#8EE53F' },
  mechanisms: { bg: '#1CB0F6', glow: 'rgba(28, 176, 246, 0.4)', border: '#67D4FF' },
  enablers: { bg: '#FF9600', glow: 'rgba(255, 150, 0, 0.4)', border: '#FFB84D' },
  forcing: { bg: '#A560E8', glow: 'rgba(165, 96, 232, 0.4)', border: '#C9A0F0' },
};

const tierLabels: { label: string; y: number; tier: TierKey }[] = [
  { label: 'ULTIMATE GOAL', y: 30, tier: 'ultimate' },
  { label: 'OUTCOMES', y: 140, tier: 'outcomes' },
  { label: 'MECHANISMS', y: 260, tier: 'mechanisms' },
  { label: 'ENABLERS', y: 400, tier: 'enablers' },
  { label: 'FORCING MOVES', y: 540, tier: 'forcing' },
];

interface ChessTacticsTreeProps {
  width?: number;
  height?: number;
  showHeader?: boolean;
  onNodeClick?: (node: TreeNode) => void;
  themeStats?: Record<string, number>; // theme id -> percentage
  levelColor?: string;
}

// Map node IDs to Lichess theme names for stats lookup
const nodeToTheme: Record<string, string> = {
  fork: 'fork',
  pin: 'pin',
  skewer: 'skewer',
  discovery: 'discoveredAttack',
  doubleCheck: 'doubleCheck',
  attraction: 'attraction',
  deflection: 'deflection',
  clearance: 'clearance',
  removal: 'capturingDefender',
  interference: 'interference',
  overload: 'overloading',
  endgame: 'endgame',
  matePatterns: 'backRankMate', // Use backRankMate as proxy for mate patterns
  winMaterial: 'crushing', // Use crushing as proxy for winning material
};

export default function ChessTacticsTree({
  width = 1100,
  height = 640,
  showHeader = true,
  onNodeClick,
  themeStats,
  levelColor,
}: ChessTacticsTreeProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [treeData, setTreeData] = useState<ReturnType<typeof buildTreeData> | null>(null);

  useEffect(() => {
    setTreeData(buildTreeData());
    const timer = setTimeout(() => setAnimationComplete(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!treeData) return null;

  // Build flat node map for connection lookup
  const allNodes: Record<string, TreeNode> = {};
  Object.values(treeData).flat().forEach(node => {
    allNodes[node.id] = node;
  });

  // Generate connections
  interface Connection {
    id: string;
    from: TreeNode;
    to: TreeNode;
    fromTier: TierKey;
    toTier: TierKey;
  }

  const connections: Connection[] = [];
  Object.values(treeData).flat().forEach(node => {
    if (node.parents) {
      node.parents.forEach(parentId => {
        const parent = allNodes[parentId];
        if (parent) {
          connections.push({
            id: `${parentId}-${node.id}`,
            from: parent,
            to: node,
            fromTier: parent.tier,
            toTier: node.tier,
          });
        }
      });
    }
  });

  const isNodeHighlighted = (nodeId: string) => {
    if (!hoveredNode) return false;
    if (nodeId === hoveredNode) return true;

    return connections.some(
      conn =>
        (conn.from.id === hoveredNode && conn.to.id === nodeId) ||
        (conn.to.id === hoveredNode && conn.from.id === nodeId)
    );
  };

  const isConnectionHighlighted = (conn: Connection) => {
    if (!hoveredNode) return false;
    return conn.from.id === hoveredNode || conn.to.id === hoveredNode;
  };

  return (
    <div
      style={{
        minHeight: showHeader ? '100vh' : 'auto',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #131F24 50%, #1A2C35 100%)',
        padding: showHeader ? '40px 20px' : '20px',
        fontFamily: "'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background effects */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(88, 204, 2, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(165, 96, 232, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      {showHeader && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-2px',
              margin: 0,
              textShadow: '0 0 60px rgba(88, 204, 2, 0.3)',
            }}
          >
            Chess Tactics Tree
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '16px',
              marginTop: '12px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Theme Hierarchy & Prerequisites
          </p>
        </div>
      )}

      {/* Main tree container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: `${width}px`,
          margin: '0 auto',
          height: `${height}px`,
        }}
      >
        {/* Tier labels */}
        {tierLabels.map(tier => (
          <div
            key={tier.label}
            style={{
              position: 'absolute',
              left: '-10px',
              top: tier.y - 8,
              transform: 'translateY(-50%)',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: tierColors[tier.tier].bg,
              opacity: 0.7,
            }}
          >
            {tier.label}
          </div>
        ))}

        {/* SVG for connections */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <defs>
            {/* Gradients for each tier combination */}
            <linearGradient id="grad-ultimate-outcomes" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={tierColors.outcomes.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.ultimate.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-outcomes-ultimate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={tierColors.outcomes.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.ultimate.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-outcomes-mechanisms" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={tierColors.mechanisms.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.outcomes.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-mechanisms-outcomes" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={tierColors.mechanisms.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.outcomes.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-mechanisms-enablers" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={tierColors.enablers.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.mechanisms.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-enablers-mechanisms" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={tierColors.enablers.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.mechanisms.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-enablers-outcomes" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={tierColors.enablers.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.outcomes.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-outcomes-enablers" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={tierColors.enablers.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.outcomes.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-enablers-forcing" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={tierColors.forcing.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.enablers.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-forcing-enablers" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={tierColors.forcing.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.enablers.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-forcing-mechanisms" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={tierColors.forcing.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.mechanisms.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-forcing-outcomes" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={tierColors.forcing.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.outcomes.bg} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-forcing-forcing" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={tierColors.forcing.bg} stopOpacity="0.6" />
              <stop offset="100%" stopColor={tierColors.forcing.bg} stopOpacity="0.6" />
            </linearGradient>
            {/* Fallback gradient for any missing combinations */}
            <linearGradient id="grad-fallback" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.4" />
            </linearGradient>
            {/* Special green gradient for connections to checkmate */}
            <linearGradient id="grad-to-checkmate" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#58CC02" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Draw connections */}
          {connections.map((conn, i) => {
            const highlighted = isConnectionHighlighted(conn);
            // Use special green gradient for connections to checkmate
            const isToCheckmate = conn.from.id === 'checkmate';
            const gradientId = isToCheckmate
              ? 'grad-to-checkmate'
              : `grad-${conn.fromTier}-${conn.toTier}`;

            // Create curved path with bezier
            const startX = conn.from.x;
            const startY = conn.from.y + 20;
            const endX = conn.to.x;
            const endY = conn.to.y - 20;
            const midY = (startY + endY) / 2;

            const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

            return (
              <g key={conn.id}>
                <path
                  d={path}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth={highlighted ? 3 : 1.5}
                  opacity={hoveredNode ? (highlighted ? 1 : 0.15) : 0.6}
                  filter={highlighted ? 'url(#glow)' : undefined}
                  style={{
                    transition: 'all 0.3s ease',
                    animation: animationComplete
                      ? 'none'
                      : `drawLine 1.5s ease-out ${i * 0.02}s forwards`,
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Render nodes by tier */}
        {(Object.entries(treeData) as [TierKey, TreeNode[]][]).map(([tier, nodes]) =>
          nodes.map((node, i) => {
            const colors = tierColors[tier];
            const highlighted = isNodeHighlighted(node.id);
            const isHovered = hoveredNode === node.id;

            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onNodeClick?.(node)}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: isHovered
                    ? colors.bg
                    : `linear-gradient(135deg, ${colors.bg}20 0%, ${colors.bg}40 100%)`,
                  border: `1.5px solid ${isHovered ? colors.border : colors.bg}60`,
                  boxShadow: isHovered
                    ? `0 0 30px ${colors.glow}, 0 4px 20px rgba(0,0,0,0.4)`
                    : `0 2px 10px rgba(0,0,0,0.3)`,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: hoveredNode ? (highlighted ? 1 : 0.3) : 1,
                  zIndex: isHovered ? 100 : 10,
                  animation: `fadeInUp 0.6s ease-out ${
                    i * 0.05 +
                    (tier === 'ultimate'
                      ? 0
                      : tier === 'outcomes'
                      ? 0.2
                      : tier === 'mechanisms'
                      ? 0.4
                      : tier === 'enablers'
                      ? 0.6
                      : 0.9)
                  }s both`,
                }}
              >
                {/* Crown icon for checkmate */}
                {node.id === 'checkmate' && (
                  <span style={{ marginRight: '6px', fontSize: '16px' }}>♔</span>
                )}
                <span
                  style={{
                    color: isHovered ? '#fff' : colors.border,
                    fontSize: tier === 'ultimate' ? '15px' : '13px',
                    fontWeight: tier === 'ultimate' ? 700 : 600,
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.3px',
                  }}
                >
                  {node.label}
                </span>
                {/* Theme percentage badge */}
                {themeStats && nodeToTheme[node.id] && themeStats[nodeToTheme[node.id]] !== undefined && (
                  <span
                    style={{
                      marginLeft: '8px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: levelColor ? levelColor + '30' : 'rgba(255,255,255,0.15)',
                      color: levelColor || '#fff',
                      opacity: isHovered ? 1 : 0.8,
                    }}
                  >
                    {themeStats[nodeToTheme[node.id]]}%
                  </span>
                )}

                {/* Tooltip on hover */}
                {isHovered && node.description && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginTop: '8px',
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.9)',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.8)',
                      whiteSpace: 'nowrap',
                      zIndex: 200,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    }}
                  >
                    {node.description}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '50px',
          flexWrap: 'wrap',
        }}
      >
        {(Object.entries(tierColors) as [TierKey, typeof tierColors.outcomes][]).map(
          ([tier, colors]) => (
            <div
              key={tier}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '4px',
                  background: colors.bg,
                  boxShadow: `0 0 12px ${colors.glow}`,
                }}
              />
              <span
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '12px',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  letterSpacing: '0.5px',
                }}
              >
                {tier === 'ultimate' ? 'Checkmate' : tier}
              </span>
            </div>
          )
        )}
      </div>

      {/* Flow explanation */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '12px',
        }}
      >
        <span style={{ color: tierColors.forcing.border }}>Forcing Moves</span>
        {' → '}
        <span style={{ color: tierColors.enablers.border }}>Enablers</span>
        {' → '}
        <span style={{ color: tierColors.mechanisms.border }}>Mechanisms</span>
        {' → '}
        <span style={{ color: tierColors.outcomes.border }}>Outcomes</span>
        {' → '}
        <span style={{ color: tierColors.ultimate.border }}>Checkmate</span>
        <br />
        <span style={{ marginTop: '4px', display: 'inline-block', opacity: 0.7 }}>
          (Some paths skip layers — simple tactics need fewer steps)
        </span>
      </div>

      {/* Interaction hint */}
      {showHeader && (
        <p
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '13px',
            marginTop: '24px',
          }}
        >
          Hover over any theme to see its connections
        </p>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        @keyframes drawLine {
          from {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
