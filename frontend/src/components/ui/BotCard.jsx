import { useState } from "react";
import { ChevronDown, Bot } from "lucide-react";
import GlassCard from "./GlassCard";

/**
 * BotCard - Collapsible card component
 * Shows collapsed summary with expand button, expands to show full details
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to show when expanded
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Subtitle/goal
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.color - Color scheme (hex color for icon/text)
 * @param {string} props.description - Short description for collapsed view
 * @param {boolean} props.isLoading - Loading state
 */
export default function BotCard({
  children,
  title,
  subtitle,
  icon: Icon = Bot,
  color = "#a78bfa",
  description = "",
  isLoading = false,
}) {
  const [expanded, setExpanded] = useState(false);

  const collapsedStyle = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    cursor: "pointer",
    userSelect: "none",
    transition: "all 0.2s ease",
  };

  const iconBoxStyle = {
    width: 48,
    height: 48,
    borderRadius: 14,
    background: `${color}15`,
    border: `1.5px solid ${color}30`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle = {
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    margin: 0,
    marginBottom: 4,
  };

  const subtitleStyle = {
    color: color,
    fontSize: 12,
    fontWeight: 700,
    margin: 0,
    marginBottom: 6,
  };

  const descStyle = {
    color: "rgba(107,114,128,1)",
    fontSize: 12,
    lineHeight: 1.5,
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const chevronStyle = {
    width: 24,
    height: 24,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(156,163,175,1)",
    transition: "all 0.3s ease",
    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
    flexShrink: 0,
  };

  const expandedContentStyle = {
    marginTop: 16,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    animation: "slideDown 0.3s ease",
  };

  return (
    <GlassCard
      style={{
        padding: expanded ? 20 : 16,
        display: "flex",
        flexDirection: "column",
      }}
      hover={true}
    >
      {/* Collapsed View - Click to Expand */}
      <div style={collapsedStyle} onClick={() => setExpanded(!expanded)}>
        <div style={iconBoxStyle}>
          <Icon size={20} color={color} />
        </div>

        <div style={contentStyle}>
          <h3 style={titleStyle}>{title}</h3>
          {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
          {description && !expanded && <p style={descStyle}>{description}</p>}
        </div>

        <div style={chevronStyle}>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Expanded View - Full Details */}
      {expanded && (
        <div style={expandedContentStyle} className="botcard-expanded">
          {isLoading ? (
            <div
              style={{ color: "rgba(107,114,128,1)", fontSize: 12, padding: 8 }}
            >
              Loading...
            </div>
          ) : (
            children
          )}
        </div>
      )}

      {/* CSS for animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .botcard-expanded {
          animation: slideDown 0.3s ease;
        }
      `}</style>
    </GlassCard>
  );
}
