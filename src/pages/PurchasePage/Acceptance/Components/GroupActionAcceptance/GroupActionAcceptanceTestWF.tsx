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
  ACCEPTANCE_EDIT_ROUTE,
  ACCEPTANCE_ROUTE_MASTER,
} from "config/route-const";
import { numberConstants } from "core/config/consts";
import { ConfirmModalType } from "core/helpers/enum";
import { acceptanceRepository } from "core/repositories/AcceptanceRepository";
import { includes, isEqual, isNull } from "lodash";
import { AcceptanceModel } from "models/Acceptance/Acceptance";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { useAcceptanceDetailContext } from "pages/PurchasePage/Acceptance/AcceptanceDetail/AcceptanceDetailContext";
import { useAcceptanceViewContext } from "pages/PurchasePage/Acceptance/AcceptanceView/AcceptanceViewContext";
import { AcceptanceConfirmModal } from "pages/PurchasePage/Acceptance/Components/AcceptanceConfirmModal/AcceptanceConfirmModal";
import { useAcceptanceActions } from "pages/PurchasePage/Acceptance/Components/hooks/useAcceptanceActions";
import { LOCAL_STORAGE_ACCEPTANCE } from "pages/PurchasePage/constants";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { useSignFormHook } from "pages/SignProcess/useSignFormHook";
import { useEffect } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";

enum ApprovalType {
  RETURN = "0",
  REJECT = "1",
}

const ROUTE_APPROVAL_TYPE = "approveType";
interface ButtonType {
  icon?: string;
  type: "secondary" | "primary";
  label: string;
  isDisabled?: boolean;
  onClick?: () => void;
}

export const GroupActionAcceptanceTestWF = () => {
  const location = useLocation();
  const [translate] = useTranslation();

  const { model, handleChangeSingleField } = useAcceptanceViewContext();
  const {
    model: modelDetail,
    handleCreate,
    loading,
  } = useAcceptanceDetailContext();

  const {
    state,
    isLoadingModal,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
  } = useAcceptanceActions();

  // const profile = useAppSelector((state) => state.profile);
  const history = useHistory();

  // const isUserCreator = useMemo(() => {
  //   return profile?.account?.email?.toLowerCase();
  // }, [profile.account.email]);

  // Get approve type
  const approveType = new URLSearchParams(location.search).get(
    ROUTE_APPROVAL_TYPE
  );

  // Set model selected for confirm modal to email
  useEffect(() => {
    if (isEqual(approveType, ApprovalType.RETURN)) {
      const acceptanceGood = {
        id: model?.id,
        code: model?.code,
        type: model?.type,
      };
      setModelSelected({
        type: ConfirmModalType.RETURN,
        model: acceptanceGood,
      });
    }
    if (isEqual(approveType, ApprovalType.REJECT)) {
      const acceptanceGood = {
        id: model?.id,
        code: model?.code,
        type: model?.type,
      };
      setModelSelected({
        type: ConfirmModalType.REJECT,
        model: acceptanceGood,
      });
    }
  }, [
    approveType,
    model?.code,
    model?.id,
    model?.type,
    modelDetail,
    setModelSelected,
  ]);

  // Fix hard for route and api detail
  const navigateToEdit = () => {
    history.push(`${ACCEPTANCE_EDIT_ROUTE}/${model?.id}`);
    localStorage.setItem(LOCAL_STORAGE_ACCEPTANCE, "EDIT");
  };

  const handleGoMaster = () => {
    history.push(`${ACCEPTANCE_ROUTE_MASTER}`);
  };

  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useSignFormHook();

  const handleSendRequest = () => {
    handleCreate({
      isDraft: false,
      isEdit: isEqual(state, "EDIT"),
      callbackFc: null,
    });
  };

  const getButtonByState = () => {
    const buttons: ButtonType[] = [];

    const acceptanceGood: AcceptanceModel = {
      id: model?.id,
      code: model?.code,
      type: model?.type,
    };

    if (model?.canDelete) {
      // append button delete
      buttons.push({
        icon: DeleteIcon,
        type: "secondary",
        label: translate("CM.txt_delete"),
        onClick: () => {
          // handle delete
          setModelSelected({
            type: ConfirmModalType.DELETE,
            model: acceptanceGood,
          });
        },
      });
    }

    if (model?.canCancel && !model?.canDelete && !model?.canEdit) {
      buttons.push({
        type: "primary",
        label: translate("CM.txt_cancel"),
        onClick: () => {
          // handle cancel
          setModelSelected({
            type: ConfirmModalType.CANCEL,
            model: acceptanceGood,
          });
        },
      });
    } else if (model?.canCancel) {
      buttons.push({
        icon: RejectIcon,
        type: "secondary",
        label: translate("CM.txt_cancel"),
        onClick: () => {
          // handle cancel
          setModelSelected({
            type: ConfirmModalType.CANCEL,
            model: acceptanceGood,
          });
        },
      });
    }

    if (model?.canEdit) {
      // append edit button
      buttons.push({
        icon: EditIcon,
        type: "primary",
        label: translate("CM.txt_update"),
        onClick: navigateToEdit,
      });
    }

    if (isEqual(state, "CREATE")) {
      // append save button
      buttons.push({
        icon: SaveIcon,
        type: "secondary",
        label: translate("CM.btn_save_draft"),
        onClick: () =>
          handleCreate({ isDraft: true, isEdit: false, callbackFc: null }),
      });

      // append send button
      buttons.push({
        icon: SendIcon,
        type: "primary",
        label: translate("CM.send_approve"),
        onClick: () =>
          handleCreate({
            isDraft: true,
            isEdit: false,
            callbackFc: handleOpenSigningForm,
          }),
      });
    }

    if (isEqual(state, "EDIT")) {
      // append save button
      buttons.push({
        icon: SaveIcon,
        type: "secondary",
        label: translate("CM.btn_save_draft"),
        onClick: () =>
          handleCreate({ isDraft: true, isEdit: true, callbackFc: null }),
      });

      // append send button
      buttons.push({
        icon: SendIcon,
        type: "primary",
        label: translate("CM.btn_send_approval"),
        onClick: () =>
          handleCreate({
            isDraft: true,
            isEdit: true,
            callbackFc: handleOpenSigningForm,
          }),
      });
    }

    // if (model?.canReturn && isUserCreator && !isEqual(state, "CREATE")) {
    //   // append return button
    //   buttons.push({
    //     icon: ReturnIcon,
    //     type: "secondary",
    //     label: translate("BG.btn_return"),
    //     onClick: () => {
    //       setModelSelected({
    //         type: ConfirmModalType.RETURN,
    //         model: acceptanceGood,
    //       });
    //     },
    //   });
    // }

    // if (model?.canDecline && isUserCreator && !isEqual(state, "CREATE")) {
    //   // append reject button
    //   buttons.push({
    //     icon: RejectIcon,
    //     type: "secondary",
    //     label: translate("BG.btn_reject"),
    //     onClick: () => {
    //       setModelSelected({
    //         type: ConfirmModalType.REJECT,
    //         model: acceptanceGood,
    //       });
    //     },
    //   });
    // }

    // if (model?.canApprove) {
    //   buttons.push({
    //     icon: ApproveIcon,
    //     type: "primary",
    //     label: translate("BG.btn_approve"),
    //     onClick: handleApproval,
    //   });
    // }

    return buttons;
  };

  // Show action feedback
  const { hasFeedBack } = useOpinionFeedbackHooks();

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  const makeOverflowMenu = () => {
    const acceptanceGood: AcceptanceModel = {
      id: modelDetail?.id,
      code: modelDetail?.code,
      type: modelDetail?.type,
    };
    const list: ListOverflowMenu[] = [
      {
        title: translate("AC.txt_cancel_acceptance"),
        action: () => {
          setModelSelected({
            type: ConfirmModalType.CANCEL,
            model: acceptanceGood,
          });
        },
        isShow: isEqual(modelDetail?.canCancel, true),
      },
      {
        title: translate("AC.txt_delete_acceptance"),
        action: () => {
          setModelSelected({
            type: ConfirmModalType.DELETE,
            model: acceptanceGood,
          });
        },
        isShow: isEqual(modelDetail?.canDelete, true),
      },
    ];

    return <OverflowMenu isActionRowTable={false} list={list} />;
  };

  return (
    <div className="group-action">
      {includes(["DETAIL", "CREATE"], state) ||
      isEqual(model?.status, numberConstants.ONE)
        ? null
        : makeOverflowMenu()}
      {getButtonByState().map((button, index) => {
        return (
          <Button
            key={index}
            {...(button.icon && { icon: <img src={button.icon} alt="" /> })}
            iconPlace="left"
            type={button.type}
            size="lg"
            onClick={button.onClick}
            disabled={button.isDisabled}
          >
            {button.label}
          </Button>
        );
      })}
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={acceptanceRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_title_acceptance")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />

      {!isNull(modelSelected) ? (
        <AcceptanceConfirmModal
          type={modelSelected.type}
          model={modelSelected.model}
          errorMessage={modelSelected.errorMessage}
          onApply={handleApplyButtonInConfirmModal}
          onCancel={() => setModelSelected(null)}
          isLoading={isLoadingModal}
        />
      ) : null}
      {modelDetail?.id && (
        <SignProcessModal
          isOpen={openSigningForm}
          loadingSend={loading}
          onCancel={handleCancelSigningForm}
          sendRequest={handleSendRequest}
          requestId={modelDetail?.id}
          requestField={"id"}
          repository={acceptanceRepository}
          tempateType={SIGN_PROCESS_TYPE.ACCEPTANCE}
        />
      )}
    </div>
  );
};
