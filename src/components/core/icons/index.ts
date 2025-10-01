import GoogleIcon from "./google";
import LeftArrow from "./left-arrow";
import StackIcon from "./stack";
import AtIcon from "./at";
import SandClock from "./sand-clock";
import SuccessIcon from "./success-icon";
import InfoCircle from "./info-circle";

export const iconCollection = {
    GoogleIcon,
    LeftArrow,
    StackIcon,
    AtIcon,
    SandClock,
    SuccessIcon,
    InfoCircle,
};

export type IconName = keyof typeof iconCollection;