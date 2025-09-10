import { EditIcon, RejectIcon } from "assets/icons";
import { useCallback, useContext } from "react";
import { Button } from "react-components-design-system";
import {
  ActionRowType,
  ContractDetailModel,
  ModelConfirmType,
} from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useHistory } from "react-router";

import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";

const ContractViewDraftAction = () => {
  const {
    model,
    contractId,
    handleUpdateTypeModal,
    getLinkRouter,
    currentContractRequestType,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const { canCloseRequest, canEdit } = model;
  const history = useHistory();
  const [translate] = useTranslationContract();

  const onEditContract = useCallback(() => {
    const router = getLinkRouter(
      currentContractRequestType,
      ActionRowType.EDIT
    );
    history.push(`${router}/${contractId}`);
  }, [contractId, currentContractRequestType, getLinkRouter, history]);

  const onCloseContract = () => {
    handleUpdateTypeModal(ModelConfirmType.CLOSE);
  };

  return (
    <>
      {canCloseRequest && (
        <Button
          icon={<img src={RejectIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={onCloseContract}
        >
          {translate("CT.contract_view.title.close_contract")}
        </Button>
      )}
      {canEdit && (
        <Button
          icon={<img src={EditIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={onEditContract}
        >
          {translate("CM.txt_editable")}
        </Button>
      )}
    </>
  );
};

export default ContractViewDraftAction;
