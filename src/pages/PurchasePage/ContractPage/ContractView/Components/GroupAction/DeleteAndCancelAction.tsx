import { DeleteIcon, RejectIcon } from "assets/icons";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { ContractDetailModel, ModelConfirmType } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";

const ContractViewDeleteAndCancelAction = () => {
  const { model, handleUpdateTypeModal } = useContext<ContractDetailModel>(
    ContractDetailHookContext
  );

  const { canCancel, canDelete } = model;
  const [translate] = useTranslationContract();

  const onDeleteContract = () => {
    handleUpdateTypeModal(ModelConfirmType.DELETE);
  };

  const onCancelContract = () => {
    handleUpdateTypeModal(ModelConfirmType.CANCEL);
  };

  return (
    <>
      {canCancel && (
        <Button
          icon={<img src={RejectIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={onCancelContract}
        >
          {translate("CM.txt_cancel")}
        </Button>
      )}
      {canDelete && (
        <Button
          icon={<img src={DeleteIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={onDeleteContract}
        >
          {translate("CM.txt_delete")}
        </Button>
      )}
    </>
  );
};

export default ContractViewDeleteAndCancelAction;
