import {
  ApproveIcon,
  DeleteIcon,
  EditIcon,
  RejectIcon,
  ReturnIcon,
  SaveIcon,
  SendIcon,
} from "assets/icons";
import { CONTRACT_PRINCIPLE_APPENDIX_EDIT_ROUTE } from "config/route-const";
import { ConfirmModalType } from "core/helpers/enum";
import { isEqual, isNil, isUndefined } from "lodash";
import { ContractAnnex } from "models/ContractAnnex";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { useCallback, useEffect, useMemo } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { useAppSelector } from "rtk/useRedux";
import {
  PageState,
  useCheckPageState,
} from "../../../Components/hooks/useCheckPageState";
import { CPAModalType } from "../../../constants";
import { ContractPrincipleAppendixStatus } from "../../constants";
import { CPAConfirmModal } from "../ConfirmModal/CPAConfirmModal";
import { useContractPrincipleAppendixActions } from "../hooks/useContractPrincipleAppendixActions";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";

interface GroupActionsProps {
  model?: ContractAnnex;
  onSave?: (params: { isDraft: boolean }) => void;
  onClickButton?: (type: CPAModalType) => void;
}

enum ApprovalType {
  RETURN = "0",
  REJECT = "1",
}
const ROUTE_APPROVAL_TYPE = "approveType";

export const GroupActions = ({
  model,
  onSave,
  onClickButton,
}: GroupActionsProps) => {
  const [translate] = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const profile = useAppSelector((state) => state.profile);

  const isUserCreator = useMemo(() => {
    return profile?.account?.email?.toLowerCase();
  }, [profile.account.email]);

  const { state: pageAction } = useCheckPageState();
  // Get approve type
  const approveType = new URLSearchParams(location.search).get(
    ROUTE_APPROVAL_TYPE
  );

  const isViewMode = useCallback(() => {
    type Params = { isView?: boolean };
    const isView = location?.state as Params;

    if (!isNil(isView?.isView)) {
      return isView?.isView;
    }

    return false;
  }, [location]);

  const {
    isLoadingModal,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
  } = useContractPrincipleAppendixActions();

  useEffect(() => {
    if (isEqual(approveType, ApprovalType.RETURN)) {
      setModelSelected({
        type: ConfirmModalType.RETURN,
        model,
      });
    }
    if (isEqual(approveType, ApprovalType.REJECT)) {
      setModelSelected({
        type: ConfirmModalType.REJECT,
        model,
      });
    }
  }, []);

  const buttonActions = useMemo(() => {
    const isDetail = isEqual("DETAIL", pageAction);

    const buttons = [];

    // Delete button
    if (model?.canDelete && isDetail) {
      buttons.push({
        icon: DeleteIcon,
        type: "secondary" as const,
        content: translate("CM.txt_delete"),
        onClick: () =>
          setModelSelected({
            type: ConfirmModalType.DELETE,
            model,
          }),
      });
    }

    // Cancel button
    if (model?.canCancel && isDetail) {
      buttons.push({
        icon: RejectIcon,
        type: "secondary" as const,
        content: translate("CM.txt_cancel"),
        onClick: () =>
          setModelSelected({
            type: ConfirmModalType.CANCEL,
            model,
          }),
      });
    }

    // Edit button
    if (model?.canEdit && isDetail) {
      buttons.push({
        icon: EditIcon,
        type: "primary" as const,
        content: translate("CM.txt_update"),
        onClick: () =>
          history.push(
            `${CONTRACT_PRINCIPLE_APPENDIX_EDIT_ROUTE}/${model?.id}`
          ),
      });
    }

    if (["EDIT", "CREATE"].includes(pageAction)) {
      buttons.push({
        icon: SaveIcon,
        type: "secondary" as const,
        content: translate("CM.btn_save_draft"),
        onClick: () => onSave({ isDraft: true }),
      });

      buttons.push({
        icon: SendIcon,
        type: "primary" as const,
        content: translate("CM.btn_send_approval"),
        onClick: () => onSave({ isDraft: false }),
      });
    }

    // Return button
    if (isDetail && model?.canReturn && isUserCreator) {
      buttons.push({
        icon: ReturnIcon,
        type: "secondary" as const,
        content: translate("CM.btn_return"),
        onClick: () =>
          setModelSelected({
            type: ConfirmModalType.RETURN,
            model,
          }),
      });
    }

    // Reject button
    if (isDetail && model?.canDecline && isUserCreator) {
      buttons.push({
        icon: RejectIcon,
        type: "secondary" as const,
        content: translate("BG.btn_reject"),
        onClick: () =>
          setModelSelected({
            type: ConfirmModalType.REJECT,
            model,
          }),
      });
    }

    if (
      isDetail &&
      !isNil(model?.canApprove) &&
      isUserCreator &&
      !isViewMode() &&
      isEqual(
        model?.status,
        ContractPrincipleAppendixStatus.WAITING_FOR_APPROVAL
      ) &&
      isEqual(model?.canApprove, true)
    ) {
      buttons.push({
        icon: ApproveIcon,
        type: "primary" as const,
        content: translate("CM.txt_approve"),
        onClick: () => onClickButton(CPAModalType.Approve),
        disable: !model?.canApprove,
      });
    }

    return buttons;
  }, [
    history,
    isUserCreator,
    isViewMode,
    model,
    onClickButton,
    onSave,
    pageAction,
    setModelSelected,
    translate,
  ]);

  const { hasFeedBack } = useOpinionFeedbackHooks();

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  const makeOverflowMenu = () => {
    const list: ListOverflowMenu[] = [
      {
        title: translate("CM.txt_cancel"),
        action: () =>
          setModelSelected({
            type: ConfirmModalType.CANCEL,
            model,
          }),
        isShow: isEqual(model?.canCancel, true),
      },
      {
        title: translate("CM.txt_delete"),
        action: () =>
          setModelSelected({
            type: ConfirmModalType.DELETE,
            model,
          }),
        isShow: isEqual(model?.canDelete, true),
      },
    ];

    return <OverflowMenu isActionRowTable={false} list={list} />;
  };

  return (
    <>
      <div className="group-action">
        {isEqual(PageState.EDIT, pageAction) ? makeOverflowMenu() : null}
        {buttonActions.map(({ icon, content, ...props }, index) => {
          return (
            <Button
              key={index}
              iconPlace={isUndefined(icon) ? undefined : "left"}
              icon={<img src={icon} alt="" />}
              size="lg"
              disabled={props.disable}
              {...props}
            >
              {content}
            </Button>
          );
        })}
      </div>
      {Boolean(modelSelected) && (
        <CPAConfirmModal
          type={modelSelected.type}
          model={modelSelected.model}
          errorMessage={modelSelected.errorMessage}
          onApply={handleApplyButtonInConfirmModal}
          onCancel={() => setModelSelected(null)}
          isLoading={isLoadingModal}
        />
      )}
    </>
  );
};
