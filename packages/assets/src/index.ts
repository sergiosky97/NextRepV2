export { iconKeys } from "./icons/icon-keys";
export type { IconKey } from "./icons/icon-keys";

export const icons = {
  logo: "icons/svg/logo.svg",
  home: "icons/svg/home.svg",
  groups: "icons/svg/groups.svg",
  activity: "icons/svg/activity.svg",
  calendar: "icons/svg/calendar.svg",
  more: "icons/svg/more.svg"
} as const;

export const fonts = {
  interRegular: "fonts/Inter-Regular.ttf"
} as const;

export const images = {
  onboarding: "images/onboarding.png"
} as const;

export const navIconGlyph: Record<string, string> = {
  home: "⌂",
  groups: "◉",
  activity: "∿",
  calendar: "▦",
  more: "⋯"
};
