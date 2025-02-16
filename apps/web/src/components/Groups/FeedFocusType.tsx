import cn from "@hey/ui/cn";
import type { Dispatch, FC, SetStateAction } from "react";
import { GroupsTabFocus } from ".";

interface FeedLinkProps {
  focus?: GroupsTabFocus;
  name: string;
  setFocus: Dispatch<SetStateAction<GroupsTabFocus>>;
  type: GroupsTabFocus;
}

const FeedLink: FC<FeedLinkProps> = ({ focus, name, setFocus, type }) => (
  <button
    aria-label={name}
    className={cn(
      focus === type ? "bg-black text-white" : "bg-gray-100 dark:bg-gray-800",
      "rounded-full px-3 py-1.5 text-xs sm:px-4",
      "border border-gray-300 dark:border-gray-500"
    )}
    onClick={() => setFocus(type)}
    type="button"
  >
    {name}
  </button>
);

interface FeedFocusTypeProps {
  focus?: GroupsTabFocus;
  setFocus: Dispatch<SetStateAction<GroupsTabFocus>>;
}

const FeedFocusType: FC<FeedFocusTypeProps> = ({ focus, setFocus }) => (
  <div className="mx-5 my-5 flex flex-wrap gap-3 sm:mx-0">
    <FeedLink
      focus={focus}
      name="Your groups"
      setFocus={setFocus}
      type={GroupsTabFocus.Member}
    />
    <FeedLink
      focus={focus}
      name="Managed groups"
      setFocus={setFocus}
      type={GroupsTabFocus.Managed}
    />
  </div>
);

export default FeedFocusType;
