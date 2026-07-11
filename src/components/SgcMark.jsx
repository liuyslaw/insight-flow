// The SGC interlocking-triangle mark, isolated from the full Type 2 lockup
// (logo + "SynerGrowth Consulting" wordmark) for use as a small app icon.
// viewBox is tightly cropped to the mark's actual bounding box — measured
// by rendering the full logo and finding the non-transparent pixel extent,
// not eyeballed — so it fills an icon-sized frame cleanly instead of
// floating in a mostly-empty square.

export default function SgcMark({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="14.5 15 85 90"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(52,58) scale(0.411) translate(-247.371,-234.212)">
        <g transform="matrix(0.8883944049215298 0 0 0.8883944049215298 247.37108465847314 234.211732739387)">
          <g>
            {/* GOLD triangles */}
            <g transform="matrix(1 0 0 1 -23.665 -23.835)">
              <polygon fill="#FAA819" points="-23.435,-23.545 -23.435,23.545 23.435,-0.005" />
            </g>
            <g transform="matrix(1 0 0 1 -70.87 -23.835)">
              <polygon fill="#FAA819" points="-23.44,-0.005 23.44,23.545 23.44,-23.545" />
            </g>
            <g transform="matrix(1 0 0 1 -70.87 0.045)">
              <polygon fill="#FAA819" points="-23.44,-23.545 -23.44,23.545 23.44,0.005" />
            </g>
            <g transform="matrix(1 0 0 1 -70.87 23.935)">
              <polygon fill="#FAA819" points="-23.44,-0.005 23.44,23.545 23.44,-23.545" />
            </g>
            <g transform="matrix(1 0 0 1 -23.665 23.935)">
              <polygon fill="#FAA819" points="-23.435,-23.545 -23.435,23.545 23.435,-0.005" />
            </g>
            <g transform="matrix(1 0 0 1 -23.665 47.815)">
              <polygon fill="#FAA819" points="-23.435,0.005 23.435,23.545 23.435,-23.545" />
            </g>
            <g transform="matrix(1 0 0 1 23.545 47.815)">
              <polygon fill="#FAA819" points="-23.435,-23.545 -23.435,23.545 23.435,0.005" />
            </g>
            <g transform="matrix(1 0 0 1 23.545 71.705)">
              <polygon fill="#FAA819" points="-23.435,-0.005 23.435,23.545 23.435,-23.545" />
            </g>
            {/* MAGENTA / BERRY triangles */}
            <g transform="matrix(1 0 0 1 23.670 23.840)">
              <polygon fill="#B84480" points="-23.44,0 23.44,23.55 23.44,-23.55" />
            </g>
            <g transform="matrix(1 0 0 1 70.87 23.840)">
              <polygon fill="#A0366D" points="-23.44,-23.55 -23.44,23.55 23.44,0" />
            </g>
            <g transform="matrix(1 0 0 1 70.87 -0.045)">
              <polygon fill="#B84480" points="-23.44,-0.005 23.44,23.545 23.44,-23.545" />
            </g>
            <g transform="matrix(1 0 0 1 70.87 -23.930)">
              <polygon fill="#A0366D" points="-23.44,-23.55 -23.44,23.55 23.44,0" />
            </g>
            <g transform="matrix(1 0 0 1 23.670 -23.930)">
              <polygon fill="#B84480" points="-23.44,0 23.44,23.55 23.44,-23.55" />
            </g>
            <g transform="matrix(1 0 0 1 23.670 -47.815)">
              <polygon fill="#A0366D" points="-23.44,-23.545 -23.44,23.545 23.44,-0.005" />
            </g>
            <g transform="matrix(1 0 0 1 -23.555 -47.815)">
              <polygon fill="#B84480" points="-23.435,-0.005 23.435,23.545 23.435,-23.545" />
            </g>
            <g transform="matrix(1 0 0 1 -23.555 -71.7)">
              <polygon fill="#A0366D" points="-23.435,-23.55 -23.435,23.55 23.435,0" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
