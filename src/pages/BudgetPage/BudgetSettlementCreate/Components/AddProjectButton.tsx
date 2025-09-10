import { Import } from "assets/icons";
import { Button } from "react-components-design-system";

interface AddProjectButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export const AddProjectButton = ({
  disabled = true,
  onClick = null,
}: AddProjectButtonProps) => {
  return (
    <Button
      className="w-100"
      size="lg"
      type="secondary"
      icon={<Import />}
      iconPlace="left"
      disabled={disabled}
      onClick={onClick}
    >
      Thêm dự án/ hạng mục ngân sách
    </Button>
  );
};
