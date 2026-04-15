import { Loader } from "lucide-react";
export default function Spinner({
  size = 16,
  color = "rgba(255,255,255,0.9)",
}) {
  return (
    <Loader
      size={size}
      color={color}
      className="spin"
      style={{ animation: "spin 1s linear infinite", display: "inline-block" }}
    />
  );
}
