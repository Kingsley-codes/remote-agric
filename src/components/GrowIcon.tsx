interface GrowIconProps {
  rayColor?: string; // Color of the rays
  centerColor?: string; // Color of the center circle
  size?: number | string; // Size of the SVG (width & height)
}

export const GrowIcon: React.FC<GrowIconProps> = ({
  rayColor = "currentColor",
  centerColor = "currentColor",
  size = 48, // default 48px
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-60 -60 120 120" // keeps the proportions correct
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <path
          id="ray"
          d="
            M -3 -12
            L  3 -12
            L  3 -50
            Q  3 -52   1 -52
            L -1 -52
            Q -3 -52  -3 -50
            Z
          "
        />
      </defs>

      {/* Rays */}
      <g fill={rayColor}>
        {Array.from({ length: 16 }).map((_, i) => (
          <use key={i} href="#ray" transform={`rotate(${i * 22.5})`} />
        ))}
      </g>

      {/* Center circle */}
      <circle cx="0" cy="0" r="12" fill={centerColor} />
    </svg>
  );
};
