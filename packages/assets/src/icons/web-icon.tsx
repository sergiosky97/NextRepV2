import ActivitySvg from "./svg/activity.svg";
import CalendarSvg from "./svg/calendar.svg";
import GroupsSvg from "./svg/groups.svg";
import HomeSvg from "./svg/home.svg";
import MoreSvg from "./svg/more.svg";
import { IconKey } from "./icon-keys";

const map = {
  home: HomeSvg,
  groups: GroupsSvg,
  activity: ActivitySvg,
  calendar: CalendarSvg,
  more: MoreSvg
} as const;

export function WebIcon({
  name,
  size = 18
}: {
  name: IconKey;
  size?: number;
}) {
  const Icon = map[name];
  return <Icon width={size} height={size} />;
}
