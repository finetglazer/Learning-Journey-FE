import { ModalConfirm } from "react-components-design-system";

interface ModalConfirmDeleteProps {
  open: boolean;
  icon: string;
  title: string;
  content: string;
  titleButtonCancel: string;
  titleButtonApply: string;
  handleSave: () => void;
  handleCancel: () => void;
}

const ModalConfirmDelete = ({
  open,
  icon,
  title,
  content,
  titleButtonCancel,
  titleButtonApply,
  handleSave,
  handleCancel,
  ...props
}: ModalConfirmDeleteProps) => {
  return (
    <ModalConfirm
      open={open}
      icon={<img src={icon} alt="icon" width={72} height={72} />}
      title={title}
      content={content}
      titleButtonCancel={titleButtonCancel}
      titleButtonApply={titleButtonApply}
      handleSave={handleSave}
      handleCancel={handleCancel}
      {...props}
    />
  );
};

export default ModalConfirmDelete;
