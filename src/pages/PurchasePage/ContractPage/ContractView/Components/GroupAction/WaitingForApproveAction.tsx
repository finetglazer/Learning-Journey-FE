import { ApproveIcon, RejectIcon, ReturnIcon } from "assets/icons";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ContractDetailModel, ModelConfirmType } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";

const ContractViewWaitingForApproveAction = () => {
  const { model, handleUpdateTypeModal } = useContext<ContractDetailModel>(
    ContractDetailHookContext
  );

  const { canApprove, canReturn, canDecline } = model;

  const [translate] = useTranslation();

  const onApproveContract = () => {
    handleUpdateTypeModal(ModelConfirmType.APPROVE);
  };

  const onReturnContract = () => {
    handleUpdateTypeModal(ModelConfirmType.RETURN);
  };

  const onRejectContract = () => {
    handleUpdateTypeModal(ModelConfirmType.REJECT);
  };

  return (
    <>
      {canReturn && (
        <Button
          icon={<img src={ReturnIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={onReturnContract}
        >
          {translate("CM.btn_return")}
        </Button>
      )}
      {canDecline && (
        <Button
          icon={<img src={RejectIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={onRejectContract}
        >
          {translate("CM.txt_rejected")}
        </Button>
      )}
      {canApprove && (
        <Button
          icon={<img src={ApproveIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={onApproveContract}
        >
          {translate("CM.btn_approve")}
        </Button>
      )}
    </>
  );
};

export default ContractViewWaitingForApproveAction;
