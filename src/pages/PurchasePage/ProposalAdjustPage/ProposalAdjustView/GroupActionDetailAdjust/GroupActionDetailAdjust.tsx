import { DeleteIcon, EditIcon, RejectIcon } from "assets/icons";
import {
  PROPOSAL_ADJUST_DETAIL_ROUTE,
  PROPOSAL_CREATE_ROUTE,
} from "config/route-const";
import { isEqual } from "lodash";
import { Profile } from "models/Profile";
import { ProposalCreateModel } from "models/Proposal";
import { ConfirmModalType } from "pages/PurchasePage/ProposalPage/ProposalMaster/ProposalConfirmModal/ProposalConfirmModal";
import { useContext, useMemo } from "react";
import {
  Button,
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useAppSelector } from "rtk/useRedux";

import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { utilService } from "core/services/common-services/util-service";
import { MODEL_CONFIRM_TYPE } from "pages/BudgetPage/BudgetCreate/BudgetCreateHook";
import {
  getContentModalConfirm,
  getIconModal,
  getLabelInputReason,
  getTitleModalConfirm,
} from "./helper";
import { authorizationService } from "core/services/common-services/authorization-service";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";

const GroupActionDetailAdjust = () => {
  const {
    model,
    handleChangeSingleField,
    setModelSelected,
    handleGoMaster,
    modalConfirm,
    handleUpdateTypeModal,
    handleCloseProposal,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const { validAction } = authorizationService.useAuthorizedAction(
    "PURCHASE_PROPOSAL",
    "Adjustment"
  );

  const [translate] = useTranslation();

  const history = useHistory();
  const profile: Profile = useAppSelector((state) => state.profile);
  const isUserCreator = useMemo(() => {
    return isEqual(
      profile?.account?.email?.toLowerCase(),
      model?.user?.email.toLowerCase()
    );
  }, [model?.user?.email, profile.account.email]);

  const onPressEdit = () => {
    const routerPath = model.isAdjust
      ? PROPOSAL_ADJUST_DETAIL_ROUTE
      : PROPOSAL_CREATE_ROUTE;
    history.push(`${routerPath}/${model.id}`);
  };

  const { canDelete, canEdit, canCancel, canCloseRequest } = model;

  const onPressClose = () => {
    handleUpdateTypeModal(MODEL_CONFIRM_TYPE.CLOSE);
  };

  const onConfirm = () => {
    switch (modalConfirm) {
      case MODEL_CONFIRM_TYPE.CLOSE:
        handleCloseProposal();
        break;
      default:
        break;
    }
  };

  const onDismiss = () => {
    handleUpdateTypeModal(null);
    handleChangeSingleField({
      fieldName: "reason",
    })(null);
  };

  return (
    <div className="group-action">
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={proposalRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_title_proposal")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />

      {canDelete && isUserCreator && validAction("DELETE") && (
        <Button
          icon={<img src={DeleteIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() =>
            setModelSelected({ type: ConfirmModalType.DELETE, model: model })
          }
        >
          {translate("PR.btn_delete")}
        </Button>
      )}
      {canCancel && isUserCreator && validAction("DELETE") && (
        <Button
          icon={<img src={RejectIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() =>
            setModelSelected({ type: ConfirmModalType.CANCEL, model: model })
          }
        >
          {translate("PR.btn_cancel")}
        </Button>
      )}

      {canEdit && isUserCreator && (
        <Button
          icon={<img src={EditIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={onPressEdit}
        >
          {translate("PR.btn_edit")}
        </Button>
      )}

      <ModalConfirm
        centered
        open={isEqual(modalConfirm, MODEL_CONFIRM_TYPE.CLOSE)}
        titleButtonApply={translate("CM.btn_confirm")}
        titleButtonCancel={translate("CM.btn_close")}
        handleCancel={onDismiss}
        handleSave={onConfirm}
        icon={
          <img src={getIconModal(modalConfirm)} alt="" width={72} height={72} />
        }
        title={translate(getTitleModalConfirm(modalConfirm, model?.isAdjust))}
        content={
          <Trans
            i18nKey={getContentModalConfirm(modalConfirm, model?.isAdjust)}
            values={{ code: model?.code }}
          />
        }
      >
        {!isEqual(modalConfirm, MODEL_CONFIRM_TYPE.CLOSE) && (
          <FormItem
            validateObject={utilService.getValidateObj(model, "reason")}
          >
            <TextArea
              showCount
              isRequired
              label={translate(getLabelInputReason(modalConfirm))}
              placeHolder={translate("BG.input_reason")}
              maxLength={500}
              onChange={handleChangeSingleField({
                fieldName: "reason",
              })}
              value={model.reason}
              className="m-t--lg"
              resize="none"
            />
          </FormItem>
        )}
      </ModalConfirm>
    </div>
  );
};

export default GroupActionDetailAdjust;
