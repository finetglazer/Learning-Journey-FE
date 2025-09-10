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
  PROJECT_SETTLEMENT_EDIT_ROUTE,
  PROJECT_SETTLEMENT_MASTER_ROUTE,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
import { projectSettlementRepository } from "core/repositories/ProjectSettlementRepository";
import { ConfigField } from "core/services/service-types";
import { includes, isEqual, isUndefined } from "lodash";
import { ProjectSettlementProposal } from "models/ProjectSettlement";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { useSignFormHook } from "pages/SignProcess/useSignFormHook";
import { useEffect, useMemo } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { ProjectSettlementModal } from "../constant";
import { useCheckState } from "../hooks/useCheckState";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const ROUTE_APPROVAL_TYPE = "approveType";

enum ApprovalType {
  RETURN = "0",
  REJECT = "1",
}

interface GroupActionsProps {
  model: ProjectSettlementProposal;
  onSave?: (isDraft: boolean, callbackFc: () => void) => void;
  onClickButton?: (type: ProjectSettlementModal) => void;
  loading?: boolean;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
}

export const GroupActions = ({
  model,
  onSave,
  onClickButton,
  loading,
  handleChangeSingleField,
}: GroupActionsProps) => {
  const [translate] = useTranslation();
  const history = useHistory();
  // const profile = useAppSelector((state) => state.profile);

  // const isUserCreator = useMemo(() => {
  //     return profile?.account?.email?.toLowerCase();
  // }, [profile.account.email]);

  const { state: pageAction } = useCheckState();
  const location = useLocation();
  // Get approve type
  const approveType = new URLSearchParams(location.search).get(
    ROUTE_APPROVAL_TYPE
  );
  const { hasFeedBack } = useOpinionFeedbackHooks();

  useEffect(() => {
    if (isEqual(approveType, ApprovalType.RETURN)) {
      onClickButton(ProjectSettlementModal.Return);
    }
    if (isEqual(approveType, ApprovalType.REJECT)) {
      onClickButton(ProjectSettlementModal.Reject);
    }
  }, []);

  // const isViewMode = useCallback(() => {
  //     type Params = { isView?: boolean };
  //     const isView = location?.state as Params;

  //     if (!isNil(isView?.isView)) {
  //         return isView?.isView;
  //     }

  //     return false;
  // }, [location]);

  const handleGoMaster = () => {
    history.push(PROJECT_SETTLEMENT_MASTER_ROUTE);
  };

  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useSignFormHook();

  const handleSendRequest = () => {
    onSave(false, null);
  };

  const buttonActions = useMemo(() => {
    const isDetail = isEqual("DETAIL", pageAction);

    const buttons = [];

    // Delete button
    if (model?.canDelete && isDetail) {
      buttons.push({
        icon: DeleteIcon,
        type: "secondary" as const,
        content: translate("CM.txt_delete"),
        onClick: () => onClickButton(ProjectSettlementModal.Delete),
      });
    }

    // Cancel button
    if (model?.canCancel && isDetail) {
      buttons.push({
        icon: RejectIcon,
        type: "secondary" as const,
        content: translate("CM.txt_cancel"),
        onClick: () => onClickButton(ProjectSettlementModal.Cancel),
      });
    }

    // Edit button
    if (model?.canEdit && isDetail) {
      buttons.push({
        icon: EditIcon,
        type: "primary" as const,
        content: translate("CM.txt_update"),
        onClick: () =>
          history.push(`${PROJECT_SETTLEMENT_EDIT_ROUTE}/${model?.id}`),
      });
    }

    if (["EDIT", "CREATE"].includes(pageAction)) {
      buttons.push({
        icon: SaveIcon,
        type: "secondary" as const,
        content: translate("CM.btn_save_draft"),
        onClick: () => onSave(true, null),
      });

      buttons.push({
        icon: SendIcon,
        type: "primary" as const,
        content: translate("CM.btn_send_approval"),
        onClick: () => onSave(true, handleOpenSigningForm),
      });
    }

    // // Return button
    // if (isDetail && model?.canReturn && isUserCreator) {
    //     buttons.push({
    //         icon: ReturnIcon,
    //         type: "secondary" as const,
    //         content: translate("CM.btn_return"),
    //         onClick: () => onClickButton(ProjectSettlementModal.Return),
    //     });
    // }

    // // Reject button
    // if (isDetail && model?.canDecline && isUserCreator) {
    //     buttons.push({
    //         icon: RejectIcon,
    //         type: "secondary" as const,
    //         content: translate("BG.btn_reject"),
    //         onClick: () => onClickButton(ProjectSettlementModal.Reject),
    //     });
    // }

    // // Approve button
    // if (model?.canApprove) {
    //     buttons.push({
    //         icon: ApproveIcon,
    //         type: "primary" as const,
    //         content: translate("CM.txt_approve"),
    //         onClick: () => onClickButton(ProjectSettlementModal.Approve),
    //     });
    // }

    return buttons;
  }, [
    handleOpenSigningForm,
    history,
    model?.canCancel,
    model?.canDelete,
    model?.canEdit,
    model?.id,
    onClickButton,
    onSave,
    pageAction,
    translate,
  ]);

  const makeOverflowMenu = () => {
    const list: ListOverflowMenu[] = [
      {
        title: translate("CM.txt_cancel"),
        action: () => {
          onClickButton(ProjectSettlementModal.Cancel);
        },
        isShow: isEqual(model?.canCancel, true),
      },
      {
        title: translate("CM.txt_delete"),
        action: () => {
          onClickButton(ProjectSettlementModal.Delete);
        },
        isShow: isEqual(model?.canDelete, true),
      },
    ];

    return <OverflowMenu isActionRowTable={false} list={list} />;
  };

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  return (
    <div className="group-action">
      {includes(["DETAIL", "CREATE"], pageAction) ||
      isEqual(model?.status, numberConstants.ONE)
        ? null
        : makeOverflowMenu()}
      {buttonActions.map(({ icon, content, ...props }, index) => {
        return (
          <Button
            key={index}
            iconPlace={isUndefined(icon) ? undefined : "left"}
            icon={<img src={icon} alt="" />}
            size="lg"
            {...props}
          >
            {content}
          </Button>
        );
      })}
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={projectSettlementRepository.actions}
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
          repository={projectSettlementRepository}
          tempateType={SIGN_PROCESS_TYPE.PROJECT_SETTLEMENT}
        />
      )}
    </div>
  );
};
