import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <svg
      width="64"
      height="64"
      viewBox="-60 -60 120 120"
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

      <g fill="#6b911b">
        {Array.from({ length: 16 }).map((_, i) => (
          <use key={i} href="#ray" transform={`rotate(${i * 22.5})`} />
        ))}
      </g>

      <circle cx="0" cy="0" r="12" fill="#ffffff" />
    </svg>,
    {
      width: 64,
      height: 64,
    },
  );
}
