import {
  DeleteIcon,
  EditIcon,
  RejectIcon,
  SaveIcon,
  SendIcon,
} from "assets/icons";
import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import {
  CONTRACT_ANNEX_EDIT_ROUTE,
  CONTRACT_ROUTE_MASTER,
} from "config/route-const";
import { ConfirmModalType } from "core/helpers/enum";
import { ConfigField, FieldValue } from "core/services/service-types";
import { isEqual, isUndefined } from "lodash";
import { ContractAnnex } from "models/ContractAnnex";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import React, { useEffect, useMemo } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { ContractAnnexModal } from "../../constants";
import { ContractAnnexConfirmModal } from "../Modal/ContractAnnexConfirmModal/ContractAnnexConfirmModal";
import { useCheckStateContractAnnex } from "../hooks/useCheckStateContractAnnex";
import { useContractAnnexActions } from "../hooks/useContractAnnexActions";

interface GroupActionsProps {
  model?: ContractAnnex;
  onSave?: (params: { isDraft: boolean; callbackFc?: () => void }) => void;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  onClickButton?: (type: ContractAnnexModal) => void;
  handleOpenSigningForm?: () => void;
}

enum ApprovalType {
  RETURN = "0",
  REJECT = "1",
}

const ROUTE_APPROVAL_TYPE = "approveType";

export const GroupActions = ({
  model,
  onSave,
  handleChangeSingleField,
  handleOpenSigningForm,
}: GroupActionsProps) => {
  const [translate] = useTranslation();
  const history = useHistory();
  const location = useLocation();
  // const profile = useAppSelector((state) => state.profile);

  // const isUserCreator = useMemo(() => {
  //   return profile?.account?.email?.toLowerCase();
  // }, [profile.account.email]);

  const { state: pageAction } = useCheckStateContractAnnex();

  // const isViewMode = useCallback(() => {
  //   type Params = { isView?: boolean };
  //   const isView = location?.state as Params;

  //   if (!isNil(isView?.isView)) {
  //     return isView?.isView;
  //   }

  //   return false;
  // }, [location]);

  // Get approve type
  const approveType = new URLSearchParams(location.search).get(
    ROUTE_APPROVAL_TYPE
  );

  const {
    isLoadingModal,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
  } = useContractAnnexActions();

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
          history.push(`${CONTRACT_ANNEX_EDIT_ROUTE}/${model?.id}`),
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
        onClick: () =>
          onSave({ isDraft: true, callbackFc: handleOpenSigningForm }),
      });
    }

    // // Return button
    // if (isDetail && model?.canReturn && isUserCreator) {
    //   buttons.push({
    //     icon: ReturnIcon,
    //     type: "secondary" as const,
    //     content: translate("CM.btn_return"),
    //     onClick: () =>
    //       setModelSelected({
    //         type: ConfirmModalType.RETURN,
    //         model,
    //       }),
    //   });
    // }

    // // Reject button
    // if (isDetail && model?.canDecline && isUserCreator) {
    //   buttons.push({
    //     icon: RejectIcon,
    //     type: "secondary" as const,
    //     content: translate("BG.btn_reject"),
    //     onClick: () =>
    //       setModelSelected({
    //         type: ConfirmModalType.REJECT,
    //         model,
    //       }),
    //   });
    // }

    // if (model?.canApprove) {
    //   buttons.push({
    //     icon: ApproveIcon,
    //     type: "primary" as const,
    //     content: translate("CM.txt_approve"),
    //     onClick: () => onClickButton(ContractAnnexModal.Approve),
    //   });
    // }

    return buttons;
  }, [
    handleOpenSigningForm,
    history,
    model,
    onSave,
    pageAction,
    setModelSelected,
    translate,
  ]);

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

  const handleGoMaster = React.useCallback(() => {
    history.push(`${CONTRACT_ROUTE_MASTER}?tabKey=2`);
  }, [history]);

  return (
    <>
      <div className="group-action">
        {"EDIT" === pageAction && makeOverflowMenu()}
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
          handleActions={contractAnnexRepository.actions}
          handleGoMaster={handleGoMaster}
          menu={translate("CM.menu_title_contract")}
          hideButtonApprove={isEqual(model?.isOpinionValid, false)}
        />
      </div>
      {Boolean(modelSelected) && (
        <ContractAnnexConfirmModal
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
