export const iconKeys = ["home", "groups", "activity", "calendar", "more"] as const;
export type IconKey = (typeof iconKeys)[number];
