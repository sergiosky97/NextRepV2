import { IconKey } from "@nextrep/assets";
import { iconStrokePaths } from "@nextrep/assets/icons/icon-paths";
import Svg, { Circle, Path } from "react-native-svg";

export function NavIcon({
  name,
  color
}: {
  name: IconKey;
  color: string;
}) {
  if (name === "more") {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Circle cx="6" cy="12" r="1.8" fill={color} />
        <Circle cx="12" cy="12" r="1.8" fill={color} />
        <Circle cx="18" cy="12" r="1.8" fill={color} />
      </Svg>
    );
  }

  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      {iconStrokePaths[name].map((d, index) => (
        <Path
          key={`${name}-${index}`}
          d={d}
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}
