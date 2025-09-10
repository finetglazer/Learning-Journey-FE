import { Button } from "react-components-design-system";
import "./EmptyDataSection.scss";

interface EmptyDataSectionProperties {
  icon?: string;
  iconButton?: JSX.Element;
  title?: string;
  titleButton?: string;
  disabledButtonOpinion?: boolean;
  handleClick?: () => void;
}

export const EmptyDataSection = ({
  icon,
  iconButton,
  title,
  titleButton,
  disabledButtonOpinion,
  handleClick,
}: EmptyDataSectionProperties) => {
  return (
    <div className="empty_data_section">
      <img src={icon} alt="Icon" />
      <div className="body">
        <span>{title}</span>
        <Button
          size="lg"
          className="btn-opinion"
          type="secondary"
          icon={iconButton}
          iconPlace="left"
          onClick={handleClick}
          disabled={disabledButtonOpinion}
        >
          {titleButton}
        </Button>
      </div>
    </div>
  );
};
