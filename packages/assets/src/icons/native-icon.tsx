import { IconKey } from "./icon-keys";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export function NativeIcon({
  name,
  size = 20,
  color = "currentColor"
}: {
  name: IconKey;
  size?: number;
  color?: string;
}) {
  if (name === "home") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 10.5L12 3L21 10.5V21H14V14H10V21H3V10.5Z"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  if (name === "groups") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="8" cy="8" r="3" stroke={color} strokeWidth={1.8} />
        <Circle cx="16" cy="7.5" r="2.5" stroke={color} strokeWidth={1.8} />
        <Path d="M3.5 19C3.5 16.7909 5.29086 15 7.5 15H8.5C10.7091 15 12.5 16.7909 12.5 19" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M12 19C12 17.3431 13.3431 16 15 16H17C18.6569 16 20 17.3431 20 19" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  }
  if (name === "activity") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 12H7L10 6L14 18L17 12H21"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  if (name === "calendar") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="4" y="5" width="16" height="15" rx="2" stroke={color} strokeWidth={1.8} />
        <Path d="M8 3V7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M16 3V7" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M4 10H20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="6" cy="12" r="1.8" fill={color} />
      <Circle cx="12" cy="12" r="1.8" fill={color} />
      <Circle cx="18" cy="12" r="1.8" fill={color} />
    </Svg>
  );
}
