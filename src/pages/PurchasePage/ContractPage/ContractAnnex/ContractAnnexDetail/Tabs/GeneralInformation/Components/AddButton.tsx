import { PlusIcon } from "assets/icons";
import { Button } from "react-components-design-system";

interface AddButtonProps {
  title: string;
  onClick?: () => void;
}

export const AddButton = ({ title, onClick }: AddButtonProps) => {
  return (
    <Button
      type="secondary"
      iconPlace="left"
      icon={<img src={PlusIcon} alt="" />}
      onClick={onClick}
    >
      {title}
    </Button>
  );
};
