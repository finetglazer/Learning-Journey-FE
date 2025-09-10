import {
  DeleteIcon,
  EditIcon,
  RejectIcon,
  SaveIcon,
  SendIcon,
} from "assets/icons";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import {
  CONTRACT_ADJUSTMENT_DETAIL_ROUTE,
  CONTRACT_ROUTE_MASTER,
} from "config/route-const";
import { ConfirmModalType } from "core/helpers/enum";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { isEqual, isNull } from "lodash";
import {
  ContractAdjustmentContextModel,
  ContractAdjustmentModel,
  ContractRequestType,
} from "models/ContractAdjustment";
import { ContractAdjustmentContext } from "../../ContractAdjustmentDetail/ContractAdjustmentDetailHook";
import ModalActionConfirm from "../../ContractAdjustmentMaster/ContractAdjustmentTab/Components/ModalActionConfirm/ModalActionConfirm";
import CommandGroupComponent from "../../../../../../components/CommandGroupComponent/CommandGroupComponent";
import { contractAdjustmentRepository } from "../../ContractAdjustmentRepository";

type props = {
  isView?: boolean;
  handleOpenSigningForm?: () => void;
};

const GroupAction = ({ isView, handleOpenSigningForm }: props) => {
  const {
    model,
    setModelSelected,
    handleSave,
    handleApplyButtonInConfirmModal,
    modelSelected,
    loadingModal,
    loadingButtonConfirm,
    handleChangeSingleField,
  } = useContext<ContractAdjustmentContextModel>(ContractAdjustmentContext);

  const onPressSave = (isDraft: boolean) => {
    handleSave({
      isDraft: isDraft,
      callbackFc: handleOpenSigningForm,
    });
  };

  const handleApply = (model: any, reason?: string) => {
    handleApplyButtonInConfirmModal(model, reason);
  };

  const [translate] = useTranslation();
  const history = useHistory();
  const handleGoToEdit = () => {
    history.push(`${CONTRACT_ADJUSTMENT_DETAIL_ROUTE}/${model?.idDetail}`);
  };

  const handleOpenModalCancel = (dataModel: ContractAdjustmentModel) => {
    setModelSelected({
      type: ConfirmModalType.CANCEL,
      model: dataModel,
    });
  };
  const handleOpenModalDelete = (dataModel: ContractAdjustmentModel) => {
    setModelSelected({
      type: ConfirmModalType.DELETE,
      model: dataModel,
    });
  };
  // Hàm lấy các action có thể hiển thị
  const getAction = (model: ContractAdjustmentModel) => ({
    canCancel: {
      isShow: (isView || model?.isEdit) && model?.canCancel,
      icon: <img src={RejectIcon} alt="img" />,
      label: translate("PR.btn_cancel"),
      type: "secondary",
      onClick: () => handleOpenModalCancel(model),
    },
    canDelete: {
      isShow: (isView || model?.isEdit) && model?.canDelete,
      icon: <img src={DeleteIcon} alt="img" />,
      label: translate("PR.btn_delete"),
      type: "secondary",
      onClick: () => handleOpenModalDelete(model),
    },
    canEdit: {
      isShow: isView && model?.canEdit,
      icon: <img src={EditIcon} alt="img" />,
      label: translate("CM.txt_editable"),
      type: "primary",
      onClick: () => handleGoToEdit(),
    },
    canSaveDraft: {
      isShow: !isView,
      icon: <img src={SaveIcon} alt="img" />,
      label: translate("PL.purchasing_plan_btn_save_draft"),
      type: "secondary",
      onClick: () =>
        handleSave({
          isDraft: true,
        }),
    },
    canSave: {
      isShow: !isView,
      icon: <img src={SendIcon} alt="img" />,
      label: translate("CM.send_approve"),
      type: "primary",
      onClick: () => onPressSave(true),
    },
  });

  const [filteredActions, setFilteredActions] = useState<
    ReturnType<typeof getAction>[keyof ReturnType<typeof getAction>][]
  >([]);

  useEffect(() => {
    const allActionsObj = getAction(model);
    const filtered = Object.values(allActionsObj).filter((item) => item.isShow);

    // Handle reordering for view mode
    if (isView) {
      const canDeleteAction = filtered.find(
        (action) => action.label === translate("PR.btn_delete")
      );
      if (canDeleteAction) {
        const actionsWithoutDelete = filtered.filter(
          (action) => action.label !== translate("PR.btn_delete")
        );
        setFilteredActions([canDeleteAction, ...actionsWithoutDelete]);
      } else {
        setFilteredActions(filtered);
      }
    } else {
      setFilteredActions(filtered);
    }
  }, [model, translate, isView]);

  const contractTypeTitle = useMemo(() => {
    switch (model?.contract?.contractRequestType) {
      case ContractRequestType.Contract:
        return translate("CT.contract_pls");
      case ContractRequestType.PurchaseOrder:
        return translate("CT.purchase_order_pls");
      default:
        return translate("CT.contract_pls");
    }
  }, [model?.contract?.contractRequestType]);

  const numberOfActions = filteredActions.length;
  const renderButtonActions = () => {
    if (numberOfActions < 4) {
      return filteredActions.map((action, idx) => (
        <Button
          key={idx}
          icon={action.icon}
          iconPlace="left"
          type={action.type as any}
          size="lg"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ));
    } else {
      const lastThree = filteredActions.slice(-2);
      const restActions = filteredActions.slice(0, -2);

      const list: ListOverflowMenu[] = restActions.map((item) => ({
        title: item.label,
        action: item.onClick,
        isShow: true,
      }));

      return (
        <>
          {/* Nút OverflowMenu */}
          {list.length > 0 && (
            <OverflowMenu isActionRowTable={false} list={list} />
          )}
          {lastThree.map((action, idx) => (
            <Button
              key={idx}
              icon={action.icon}
              iconPlace="left"
              type={action.type as any}
              size="lg"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </>
      );
    }
  };

  const { hasFeedBack } = useOpinionFeedbackHooks();

  const handleGoMaster = useCallback(() => {
    history.push(`${CONTRACT_ROUTE_MASTER}?pageIndex=1&pageSize=10&tabKey=3`);
  }, [history]);

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  return (
    <div className="group-action">
      {!model?.isViewWaitingApprove ? (
        <div className="d-flex gap-2">{renderButtonActions()}</div>
      ) : (
        <CommandGroupComponent
          model={model}
          handleChangeSingleField={handleChangeSingleField}
          handleActions={contractAdjustmentRepository.actions}
          repository={contractAdjustmentRepository}
          handleGoMaster={handleGoMaster}
          menu={translate("CT.adjustment_title_pls", {
            contractType: contractTypeTitle,
          })}
          hideButtonApprove={false}
        />
      )}

      {!isNull(modelSelected) ? (
        <ModalActionConfirm
          type={modelSelected?.type}
          onApply={handleApply}
          model={model}
          loadingButton={loadingButtonConfirm}
          isLoading={loadingModal}
          errorMessage={modelSelected?.errorMessage}
          // onApply={handleApplyButtonInConfirmModal}
          onCancel={() => setModelSelected(null)}
        />
      ) : null}
    </div>
  );
};

export default GroupAction;
