import GoogleIcon from "./google";
import LeftArrow from "./left-arrow";
import StackIcon from "./stack";
import AtIcon from "./at";

export const iconCollection = {
    GoogleIcon,
    LeftArrow,
    StackIcon,
    AtIcon,
};

export type IconName = keyof typeof iconCollection;