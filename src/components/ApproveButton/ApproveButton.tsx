import { ApproveIcon } from "assets/icons";
import { ButtonHTMLAttributes } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface ApproveButtonProperties<T> {
  isShow?: boolean;
  handleSubmitApprove?: T;
  disabled?: boolean;
}

const ApproveButton = <
  T extends ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
>({
  isShow,
  handleSubmitApprove,
  disabled,
}: ApproveButtonProperties<T>) => {
  const [translate] = useTranslation();

  return isShow ? (
    <Button
      icon={<img src={ApproveIcon} alt="img" />}
      iconPlace="left"
      type="primary"
      disabled={disabled}
      size="lg"
      onClick={handleSubmitApprove}
    >
      {translate("CM.btn_approve")}
    </Button>
  ) : null;
};

export default ApproveButton;
