import EmptyIcon from "../../assets/icons/CostLine/ic_empty.svg";
import "./EmptyData.scss";

const ICON_SIZE = 200;

interface CostLineEmptyDataProps {
  message: string;
  children?: JSX.Element;
  height?: number;
  icon?: string;
}

const EmptyData = ({
  message,
  children,
  height = 172,
  icon,
}: CostLineEmptyDataProps) => {
  return (
    <div
      className="cost-line__empty-container"
      style={{ "--container-height": `${height}px` } as React.CSSProperties}
    >
      {/* Image */}
      <img
        src={icon ? icon : EmptyIcon}
        alt=""
        width={ICON_SIZE}
        height={ICON_SIZE}
      />
      {/* Message */}
      <span className="body-text--lg">{message}</span>
      {/* Children */}
      {children}
    </div>
  );
};

export default EmptyData;
