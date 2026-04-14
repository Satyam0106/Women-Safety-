import React, { useMemo } from "react";

/**
 * RiskVitalSign Component
 * Renders a dynamic, pulsing waveform that changes behavior based on risk score.
 * 🟢 Safe (0-3): Stable, low amplitude, slow green.
 * 🟡 Moderate (4-6): Increasing frequency/amplitude, yellow pulse.
 * 🔴 High (7-10): Rapid, high-amplitude, red alert pulse.
 */
const RiskVitalSign = ({ score = 0, isActive = false }) => {
  // Normalize score to 0-1 range for easy interpolation
  const intensity = Math.min(Math.max(score / 10, 0), 1);

  // Dynamic values based on risk intensity
  const color = useMemo(() => {
    if (intensity < 0.35) return "#10b981"; // Safe Green
    if (intensity < 0.7) return "#f59e0b";  // Caution Yellow
    return "#f43f5e"; // Danger Red
  }, [intensity]);

  const animationDuration = useMemo(() => {
    if (!isActive) return "0s";
    // 2s (Safe) -> 0.4s (Danger)
    return `${2 - (intensity * 1.6)}s`;
  }, [intensity, isActive]);

  const amplitude = useMemo(() => {
    // 5px (Safe) -> 25px (Danger)
    return 5 + (intensity * 20);
  }, [intensity]);

  // SVG Path logic: a simple repetitive pulse
  // We'll use a CSS animation to slide the dash-offset for the "moving" effect
  return (
    <div className={`risk-vital-sign ${isActive ? 'active' : ''}`} style={{ "--vital-color": color }}>
      <div className="vital-header">
        <span className="vital-label">Live Signal</span>
        <span className="vital-value" style={{ color }}>{score.toFixed(1)}</span>
      </div>
      
      <div className="vital-graph-wrap">
        <svg viewBox="0 0 400 60" className="vital-svg">
          <path
            className="vital-path-bg"
            d="M 0 30 Q 10 30, 20 30 T 40 30 T 60 30 T 80 30 T 100 30 T 120 30 T 140 30 T 160 30 T 180 30 T 200 30 T 220 30 T 240 30 T 260 30 T 280 30 T 300 30 T 320 30 T 340 30 T 360 30 T 380 30 T 400 30"
          />
          <path
            className="vital-path"
            style={{ 
              animationDuration: animationDuration,
              stroke: color,
              strokeWidth: 2 + (intensity * 1.5)
            }}
            d={`M 0 30 
                Q 25 30, 50 ${30 - amplitude} 
                T 100 30 
                T 150 ${30 + amplitude} 
                T 200 30 
                T 250 ${30 - amplitude} 
                T 300 30 
                T 350 ${30 + amplitude}
                T 400 30`}
          />
        </svg>
        
        {/* Glow effect */}
        <div className="vital-glow" style={{ background: color, opacity: 0.1 + (intensity * 0.2) }} />
      </div>
      
      <div className="vital-status-text" style={{ color }}>
         {intensity < 0.35 ? "SECURE SIGNAL" : intensity < 0.7 ? "MODERATE INTERVENTION" : "CRITICAL RISK DETECTED"}
      </div>
    </div>
  );
};

export default RiskVitalSign;
