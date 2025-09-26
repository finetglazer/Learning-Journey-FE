import { IconName } from "../icons";

export interface IconProps extends React.HTMLAttributes<SVGSVGElement> {
    name: IconName;
}