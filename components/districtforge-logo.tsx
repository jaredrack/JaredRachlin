import Svg, { Path, Polygon } from "react-native-svg";

type DistrictForgeLogoProps = {
  size?: number;
  color?: string;
};

/** Official DistrictForge logo supplied by the product owner. */
export function DistrictForgeLogo({ size = 32, color = "#0649B4" }: DistrictForgeLogoProps) {
  return (
    <Svg
      accessibilityLabel="DistrictForge logo"
      height={size}
      viewBox="0 0 1029.58 1188.84"
      width={size * (1029.58 / 1188.84)}
    >
      <Path
        d="M514.79,0L0,297.21v594.42l514.79,297.21,514.79-297.21V297.21L514.79,0ZM959.58,851.22l-417.54,241.06-27.25,15.73-191.47-110.54-253.32-146.25V337.62L514.79,80.83l444.79,256.79v513.6Z"
        fill={color}
      />
      <Polygon fill={color} points="542.04 482.58 542.04 402.94 605.04 439.32 605.04 506.55 837.79 595.1 837.79 503.9 514.79 317.42 191.79 503.9 191.79 590.09 542.04 482.58" />
      <Polygon fill={color} points="260.32 635.53 191.79 655.03 191.79 961.94 260.32 1001.51 260.32 635.53" />
      <Polygon fill={color} points="605.04 578.1 605.04 1096.32 837.79 961.94 837.79 662.25 605.04 578.1" />
      <Polygon fill={color} points="542.04 555.33 542.04 1092.28 514.79 1108.01 323.32 997.47 323.32 617.59 542.04 555.33" />
    </Svg>
  );
}
