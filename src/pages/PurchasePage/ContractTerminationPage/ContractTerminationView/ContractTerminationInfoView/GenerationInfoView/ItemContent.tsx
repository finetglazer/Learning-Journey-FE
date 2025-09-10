interface IProps {
  label: string;
  content: string;
  className?: string;
}

const ItemContent = ({ label, content, className }: IProps) => {
  return (
    <div className={`flex start g-4 item-content-box ${className}`}>
      <div className="label-box">{label}</div>
      <div className="content-box bold">{content}</div>
    </div>
  );
};

export default ItemContent;
