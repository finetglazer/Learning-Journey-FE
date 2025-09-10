import { PlusIcon } from "assets/icons";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface AddFileButtonProps {
  onClick?: () => void;
}

export const AddFileButton = ({ onClick }: AddFileButtonProps) => {
  const [translate] = useTranslation();

  return (
    <Button
      type="secondary"
      iconPlace="left"
      icon={<img src={PlusIcon} alt="" />}
      onClick={onClick}
    >
      {translate("AC.btn_add_new_document")}
    </Button>
  );
};
