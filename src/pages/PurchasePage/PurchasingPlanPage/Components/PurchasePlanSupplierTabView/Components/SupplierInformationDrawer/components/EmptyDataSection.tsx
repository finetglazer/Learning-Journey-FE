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
  title,
}: EmptyDataSectionProperties) => {
  return (
    <div className="empty_data_section">
      <img src={icon} alt="Icon" />
      <div className="body">
        <span>{title}</span>
      </div>
    </div>
  );
};
