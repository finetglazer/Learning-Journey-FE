import {
  DeleteIcon,
  EditIcon,
  RejectIcon,
  SaveIcon,
  SendIcon,
} from "assets/icons";
import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import {
  SETTLEMENT_DETAIL_ROUTE,
  SETTLEMENT_MASTER_ROUTE,
} from "config/route-const";
import { isEmpty, isEqual } from "lodash";
import { SettlementHookModel, SettlementModel } from "models/Settlement";
import { ConfirmModalType } from "models/Settlement/Settlement";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { settlementRepository } from "pages/SettlementPage/SettlementRepository";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { useSignFormHook } from "pages/SignProcess/useSignFormHook";
import { useContext, useEffect, useState } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useHistory, useLocation } from "react-router-dom";
import { SettlementHookContext } from "../../SettlementDetail/SettlementDetailHook";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

type props = {
  isView?: boolean;
};

enum Approve_Type {
  RETURN,
  DECLINED,
  APPROVE,
}

const APPROVE_TYPE = "approveType";
const GroupAction = ({ isView }: props) => {
  const {
    model,
    setModelSelected,
    handleSave,
    translate,
    loading,
    handleChangeSingleField,
  } = useContext<SettlementHookModel>(SettlementHookContext);
  const history = useHistory();
  const handleGoToEdit = () => {
    history.push(`${SETTLEMENT_DETAIL_ROUTE}/${model?.id}`);
  };

  const handleOpenModalCancel = (dataModel: SettlementModel) => {
    setModelSelected({
      type: ConfirmModalType.CANCEL,
      model: dataModel,
    });
  };
  const handleOpenModalDelete = (dataModel: SettlementModel) => {
    setModelSelected({
      type: ConfirmModalType.DELETE,
      model: dataModel,
    });
  };
  const handleOpenModalReject = (dataModel: SettlementModel) => {
    setModelSelected({
      type: ConfirmModalType.REJECT,
      model: dataModel,
    });
  };
  const handleOpenModalReturn = (dataModel: SettlementModel) => {
    setModelSelected({
      type: ConfirmModalType.RETURN,
      model: dataModel,
    });
  };
  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useSignFormHook();

  const handleSendRequest = () => {
    handleSave(false, null);
  };

  // Hàm lấy các action có thể hiển thị
  const getAction = (model: SettlementModel) => ({
    canSaveDraft: {
      isShow: !isView,
      icon: <img src={SaveIcon} alt="img" />,
      label: translate("PL.purchasing_plan_btn_save_draft"),
      type: "secondary",
      onClick: () => handleSave(true, null),
    },
    canSave: {
      isShow: !isView,
      icon: <img src={SendIcon} alt="img" />,
      label: translate("CM.send_approve"),
      type: "primary",
      onClick: () => handleSave(true, handleOpenSigningForm),
    },
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
    // canReturn: {
    //     isShow: isView && model?.canReturn,
    //     icon: <img src={ReturnIcon} alt="img" />,
    //     label: translate("CM.btn_return"),
    //     type: "secondary",
    //     onClick: () => handleOpenModalReturn(model),
    // },
    // canDecline: {
    //     isShow: isView && model?.canDecline,
    //     icon: <img src={RejectIcon} alt="img" />,
    //     label: translate("PL.purchasing_plan_status_declined"),
    //     type: "secondary",
    //     onClick: () => handleOpenModalReject(model),
    // },

    // canApprove: {
    //     isShow: isView && model?.canApprove,
    //     icon: <img src={ApproveIcon} alt="img" />,
    //     label: translate("CM.btn_approve"),
    //     type: "primary",
    //     onClick: () => handleApprove(model?.id),
    // },
  });

  const [filteredActions, setFilteredActions] = useState<
    ReturnType<typeof getAction>[keyof ReturnType<typeof getAction>][]
  >([]);

  useEffect(() => {
    const allActionsObj = getAction(model);
    const filtered = Object.values(allActionsObj).filter((item) => item.isShow);
    setFilteredActions(filtered);
  }, [model, translate]);

  const numberOfActions = filteredActions.length;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const approveType = queryParams.get(APPROVE_TYPE);

  useEffect(() => {
    if (approveType == Approve_Type.RETURN.toString() && !isEmpty(model?.id)) {
      handleOpenModalReturn(model);
    }
    if (
      approveType == Approve_Type.DECLINED.toString() &&
      !isEmpty(model?.id)
    ) {
      handleOpenModalReject(model);
    }
  }, [approveType, model?.id, model?.canDeclined, model?.canRefuse, model]);

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
      const firstThree = filteredActions.slice(0, 2);
      const restActions = filteredActions.slice(2);

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
          {firstThree.map((action, idx) => (
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

  const handleGoMaster = () => {
    history.push(SETTLEMENT_MASTER_ROUTE);
  };

  const { hasFeedBack } = useOpinionFeedbackHooks();

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  return (
    <div className="group-action">
      <div className="d-flex gap-2">{renderButtonActions()}</div>
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={settlementRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_temporary_import_asset")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />
      {model?.id && (
        <SignProcessModal
          isOpen={openSigningForm}
          loadingSend={loading}
          onCancel={handleCancelSigningForm}
          sendRequest={handleSendRequest}
          requestId={model?.id}
          requestField={"id"}
          repository={settlementRepository}
          tempateType={SIGN_PROCESS_TYPE.CONTRACT_REQUEST_SETTLEMENT}
        />
      )}
    </div>
  );
};

export default GroupAction;
