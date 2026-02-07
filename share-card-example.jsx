import { useState } from "react";

const ShareCardExample = () => {
  const [showCard, setShowCard] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulated daily challenge results
  const results = {
    date: "Feb 6, 2026",
    score: 5,
    total: 6,
    rating: 1847,
    ratingChange: +12,
    streak: 14,
    timeUsed: "3:42",
    puzzles: [
      { name: "Fork", solved: true, moves: 2 },
      { name: "Pin", solved: true, moves: 1 },
      { name: "Discovery", solved: true, moves: 3 },
      { name: "Skewer", solved: false, moves: 0 },
      { name: "Deflection", solved: true, moves: 2 },
      { name: "Back Rank", solved: true, moves: 1 },
    ],
  };

  const generateTextShare = () => {
    const boxes = results.puzzles.map((p) => (p.solved ? "\u2658" : "\u2659")).join(" ");
    return `\u265A The Chess Path \u2014 The Daily Rook\n${results.date}\n\n${boxes}\n\nScore: ${results.score}/${results.total} \u00B7 Rating: ${results.rating} (+${results.ratingChange})\n\ud83d\udd25 ${results.streak}-day streak\n\nhttps://chesspath.app/daily-challenge`;
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        color: "#e2e8f0",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        gap: "32px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <h2 style={{ fontSize: 18, color: "#94a3b8", fontWeight: 400, margin: 0 }}>
          After a player finishes the daily challenge, they see:
        </h2>
      </div>

      {/* Results Screen */}
      <div
        style={{
          background: "#1a1d2e",
          borderRadius: 16,
          padding: "32px 28px",
          maxWidth: 380,
          width: "100%",
          border: "1px solid #2a2d3e",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>
            The Daily Rook \u00B7 {results.date}
          </div>
          <div style={{ fontSize: 48, fontWeight: 700, color: "#22c55e", lineHeight: 1.1 }}>
            {results.score}/{results.total}
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>
            in {results.timeUsed} \u00B7 \ud83d\udd25 {results.streak}-day streak
          </div>
        </div>

        {/* Puzzle Results Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {results.puzzles.map((puzzle, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: puzzle.solved ? "#166534" : "#991b1b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  margin: "0 auto 4px",
                  border: `2px solid ${puzzle.solved ? "#22c55e" : "#ef4444"}`,
                }}
              >
                {puzzle.solved ? "\u2658" : "\u2659"}
              </div>
              <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.2 }}>
                {puzzle.name}
              </div>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div
          style={{
            background: "#0f1117",
            borderRadius: 10,
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Tactics Rating</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{results.rating}</div>
          </div>
          <div
            style={{
              background: "#166534",
              color: "#22c55e",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            +{results.ratingChange}
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={() => setShowCard(!showCard)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>{showCard ? "\u2715" : "\u2197"}</span>
          {showCard ? "Hide Share Preview" : "Share Your Results"}
        </button>
      </div>

      {/* Share Preview */}
      {showCard && (
        <div
          style={{
            maxWidth: 500,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 14, color: "#64748b", textAlign: "center" }}>
            This is what people see when the link is shared on Twitter, Discord, iMessage, etc:
          </div>

          {/* Simulated Social Card / OG Preview */}
          <div
            style={{
              maxWidth: 500,
              width: "100%",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid #2a2d3e",
              background: "#1a1d2e",
            }}
          >
            {/* OG Image Preview */}
            <div
              style={{
                background: "linear-gradient(135deg, #0f1117 0%, #1a1d2e 50%, #1e1b3a 100%)",
                padding: "36px 32px",
                position: "relative",
                aspectRatio: "1200/630",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Decorative chess board pattern */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "40%",
                  height: "100%",
                  opacity: 0.05,
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gridTemplateRows: "repeat(4, 1fr)",
                }}
              >
                {Array(16)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      style={{
                        background:
                          (Math.floor(i / 4) + (i % 4)) % 2 === 0 ? "#fff" : "transparent",
                      }}
                    />
                  ))}
              </div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <span style={{ fontSize: 28 }}>\u265A</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#94a3b8" }}>
                    THE CHESS PATH
                  </span>
                </div>

                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
                  The Daily Rook \u2014 {results.date}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    margin: "20px 0",
                  }}
                >
                  {results.puzzles.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        background: p.solved ? "#166534" : "#991b1b",
                        border: `2px solid ${p.solved ? "#22c55e" : "#ef4444"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                      }}
                    >
                      {p.solved ? "\u2658" : "\u2659"}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 24,
                    fontSize: 16,
                    color: "#94a3b8",
                    marginTop: 12,
                  }}
                >
                  <span>
                    Score: <strong style={{ color: "#22c55e" }}>{results.score}/{results.total}</strong>
                  </span>
                  <span>
                    Rating: <strong style={{ color: "#e2e8f0" }}>{results.rating}</strong>{" "}
                    <span style={{ color: "#22c55e" }}>(+{results.ratingChange})</span>
                  </span>
                  <span>
                    \ud83d\udd25 <strong style={{ color: "#e2e8f0" }}>{results.streak}</strong> day streak
                  </span>
                </div>
              </div>
            </div>

            {/* Link Preview Footer */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #2a2d3e" }}>
              <div style={{ fontSize: 12, color: "#64748b" }}>chesspath.app</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>
                I scored {results.score}/{results.total} on today's Daily Rook!
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
                The shortest path to chess improvement. Train tactics daily.
              </div>
            </div>
          </div>

          {/* Text share version */}
          <div style={{ width: "100%", maxWidth: 500 }}>
            <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8, textAlign: "center" }}>
              Or copy as text (like Wordle does):
            </div>
            <div
              style={{
                background: "#0f1117",
                borderRadius: 10,
                padding: 16,
                fontFamily: "monospace",
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                border: "1px solid #2a2d3e",
              }}
            >
              {generateTextShare()}
            </div>
            <button
              onClick={handleCopy}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "10px",
                borderRadius: 8,
                border: "1px solid #3b82f6",
                background: "transparent",
                color: "#3b82f6",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {copied ? "\u2713 Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareCardExample;
