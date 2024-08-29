interface LogoProps {
  width?: number;
  height?: number;
}
export function Logo({ width = 24, height = 24 }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 175 165"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="72.5"
        width="174"
        height="92"
        fill="#DDA15E"
        stroke="#283618"
      />
      <path
        d="M1.05842 71.5L37.2362 27.5H137.764L173.942 71.5H1.05842Z"
        fill="#DDA15E"
        stroke="#283618"
      />
      <path
        d="M68.0324 47.1333L61.0205 41.4387L97.4732 2.1198L119.248 22.3075L96.5848 47.1333L81.5 47.1333L68.0324 47.1333Z"
        fill="white"
        stroke="#283618"
        stroke-width="3"
      />
      <circle cx="87" cy="118" r="27" stroke="#283618" stroke-width="2" />
      <line
        x1="76.1289"
        y1="119.012"
        x2="83.1289"
        y2="127.012"
        stroke="#283618"
        stroke-width="3"
      />
      <line
        x1="81.0705"
        y1="126.823"
        x2="103.657"
        y2="108.991"
        stroke="#283618"
        stroke-width="3"
      />
      <line
        x1="51"
        y1="47.5"
        x2="124"
        y2="47.5"
        stroke="#283618"
        stroke-width="3"
      />
    </svg>
  );
}
