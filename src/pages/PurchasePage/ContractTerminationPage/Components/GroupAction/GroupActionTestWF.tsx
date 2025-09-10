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
  CONTRACT_TERMINATION_DETAIL_ROUTE,
  CONTRACT_TERMINATION_MASTER_ROUTE,
} from "config/route-const";
import { ConfirmModalType } from "core/helpers/enum";
import { isEmpty, isEqual } from "lodash";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { useContext, useEffect, useState } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { ContractTerminationDetailHookContext } from "../../ContractTerminationDetail/ContractTerminationDetailHook";

import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import {
  ContractTerminationContextModel,
  ContractTerminationModel,
} from "models/ContractTermination/ContractTerminationModel";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { useSignFormHook } from "pages/SignProcess/useSignFormHook";
import { contractTerminationRepository } from "../../ContractTerminationRepository";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

type props = {
  isView?: boolean;
};

const RETURN_PARAM = "isReturn";
const DECLINE_PARAM = "isDecline";
const GroupActionTestWF = ({ isView }: props) => {
  const {
    model,
    setModelSelected,
    handleSave,
    handleChangeSingleField,
    loading,
  } = useContext<ContractTerminationContextModel>(
    ContractTerminationDetailHookContext
  );

  const [translate] = useTranslation();
  const history = useHistory();
  const handleGoToEdit = () => {
    history.push(`${CONTRACT_TERMINATION_DETAIL_ROUTE}/${model?.idDetail}`);
  };

  const handleOpenModalCancel = (dataModel: ContractTerminationModel) => {
    setModelSelected({
      type: ConfirmModalType.CANCEL,
      model: dataModel,
    });
  };
  const handleOpenModalDelete = (dataModel: ContractTerminationModel) => {
    setModelSelected({
      type: ConfirmModalType.DELETE,
      model: dataModel,
    });
  };
  const handleOpenModalReject = (dataModel: ContractTerminationModel) => {
    setModelSelected({
      type: ConfirmModalType.REJECT,
      model: dataModel,
    });
  };
  const handleOpenModalReturn = (dataModel: ContractTerminationModel) => {
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
  const getAction = (model: ContractTerminationModel) => ({
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
    canEdit: {
      isShow: isView && model?.canEdit,
      icon: <img src={EditIcon} alt="img" />,
      label: translate("CM.txt_editable"),
      type: "primary",
      onClick: () => handleGoToEdit(),
    },
    // canApprove: {
    //     isShow: isView && model?.canApprove,
    //     icon: <img src={ApproveIcon} alt="img" />,
    //     label: translate("CM.btn_approve"),
    //     type: "primary",
    //     onClick: () => handleApprove(model?.id),
    // },
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

  const isReturn = queryParams.get(RETURN_PARAM);
  const isDecline = queryParams.get(DECLINE_PARAM);

  useEffect(() => {
    if (isReturn && !isEmpty(model?.id) && isView) {
      handleOpenModalReturn(model);
    }
    if (isDecline && !isEmpty(model?.id) && isView) {
      handleOpenModalReject(model);
    }
  }, [
    isReturn,
    isDecline,
    model?.id,
    model?.canDeclined,
    model?.canRefuse,
    model,
  ]);

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

  const handleGoMaster = () => {
    history.push(CONTRACT_TERMINATION_MASTER_ROUTE);
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
        handleActions={contractTerminationRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_title_contract_liquidation")}
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
          repository={contractTerminationRepository}
          tempateType={SIGN_PROCESS_TYPE.CONTRACT_LIQUIDATION}
        />
      )}
    </div>
  );
};

export default GroupActionTestWF;
