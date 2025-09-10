import { PlusIcon } from "assets/icons";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface AddFileButtonProps {
  title?: string;
  onClick?: () => void;
}

export const AddFileButton = ({ title, onClick }: AddFileButtonProps) => {
  const [translate] = useTranslation();

  return (
    <Button
      type="secondary"
      iconPlace="left"
      icon={<img src={PlusIcon} alt="" />}
      onClick={onClick}
    >
      {title || translate("AC.btn_add_new_document")}
    </Button>
  );
};
