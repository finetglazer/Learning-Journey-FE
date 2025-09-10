import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { ContractDetailModel, ModelConfirmType } from "models/Contract";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import ModalActionContract from "pages/PurchasePage/ContractPage/ContractDetail/Components/GroupAction/ModalActionContract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import React, { useCallback, useContext, useMemo } from "react";
import { OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import ContractViewDeleteAndCancelAction from "./DeleteAndCancelAction";
import ContractViewDraftAction from "./DraftAction";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { useHistory } from "react-router";
import { CONTRACT_ROUTE_MASTER } from "config/route-const";
import { isEqual } from "lodash";

const ContractViewGroupAction = () => {
  const { model, handleUpdateTypeModal, handleChangeSingleField } =
    useContext<ContractDetailModel>(ContractDetailHookContext);
  const history = useHistory();

  const [translate] = useTranslation();
  const { canDelete, canCancel, canEdit, canCloseRequest } = model;

  const onDeleteContract = useCallback(() => {
    handleUpdateTypeModal(ModelConfirmType.DELETE);
  }, [handleUpdateTypeModal]);

  const onCancelContract = useCallback(() => {
    handleUpdateTypeModal(ModelConfirmType.CANCEL);
  }, [handleUpdateTypeModal]);

  const listActionDraft: ListOverflowMenu[] = useMemo(() => {
    const listInit = [];

    if (canDelete) {
      listInit.push({
        title: translate("CM.txt_delete"),
        action: () => onDeleteContract(),
        isShow: true,
      });
    }

    if (canCancel) {
      listInit.push({
        title: translate("CM.txt_cancel"),
        action: () => onCancelContract(),
        isShow: true,
      });
    }

    return listInit;
  }, [canCancel, canDelete, onCancelContract, onDeleteContract, translate]);

  const countTotalFunctionCanShow = useMemo(() => {
    const arrayAllFunction = [canDelete, canCancel, canEdit, canCloseRequest];
    return arrayAllFunction.filter(Boolean).length;
  }, [canCancel, canCloseRequest, canDelete, canEdit]);

  const handleGoMaster = React.useCallback(() => {
    history.push(CONTRACT_ROUTE_MASTER);
  }, [history]);

  return (
    <div className="group-action">
      {listActionDraft.length > 0 && countTotalFunctionCanShow >= 4 && (
        <OverflowMenu
          size="md"
          isActionRowTable={false}
          list={listActionDraft}
          appendToBody
        />
      )}
      {countTotalFunctionCanShow < 4 && <ContractViewDeleteAndCancelAction />}
      <ContractViewDraftAction />
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={contractRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_title_contract")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />
      <ModalActionContract />
    </div>
  );
};

export default ContractViewGroupAction;
