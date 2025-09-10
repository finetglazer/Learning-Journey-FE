import { DeleteIcon, EditIcon, RejectIcon } from "assets/icons";
import { AxiosError } from "axios";
import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import {
  CONTRACT_PRINCIPLE_DETAIL_ROUTE,
  CONTRACT_PRINCIPLE_MASTER_ROUTE,
} from "config/route-const";
import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { utilService } from "core/services/common-services/util-service";
import { ContractDetailModel, ModelConfirmType } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import React, { useContext } from "react";
import {
  Button,
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { contractPrincipleRepository } from "../../ContractPrincipleRepository";
import {
  getContentModalConfirm,
  getIconModal,
  getLabelInputReason,
  getTitleModalConfirm,
} from "./helper";
import { isEqual } from "lodash";

const GroupActionDetail = () => {
  const history = useHistory();
  const [translate] = useTranslation();

  const {
    model,
    modalConfirm,
    handleUpdateTypeModal,
    handleChangeSingleField,
    handleChangeAllField,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const { canDelete, canEdit, canCancel, canCloseRequest } = model;

  const { notifyToast } = appMessageService.useCRUDMessage();

  const handlePressEdit = () => {
    return history.push(`${CONTRACT_PRINCIPLE_DETAIL_ROUTE}/${model?.id}`);
  };

  const onDismiss = () => {
    handleUpdateTypeModal(null);
    handleChangeSingleField({
      fieldName: "reason",
    })(null);
  };

  const onConfirm = () => {
    contractRepository
      .actionContract(model?.id, modalConfirm, { reason: model?.reason })
      .subscribe({
        next: (response) => {
          if (response) {
            notifyToast();
            onDismiss();
            history.push(CONTRACT_PRINCIPLE_MASTER_ROUTE);
          }
        },
        error: (error: AxiosError) =>
          handleError({
            model,
            error,
            handleChangeAllField,
          }),
      });
  };

  const handleGoMaster = React.useCallback(() => {
    history.push(CONTRACT_PRINCIPLE_MASTER_ROUTE);
  }, [history]);

  return (
    <div className="group-action">
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={contractPrincipleRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_title_contract_principle")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />
      {canDelete && (
        <Button
          icon={<img src={DeleteIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() => handleUpdateTypeModal(ModelConfirmType.DELETE)}
        >
          {translate("PR.btn_delete")}
        </Button>
      )}
      {canCancel && (
        <Button
          icon={<img src={RejectIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() => handleUpdateTypeModal(ModelConfirmType.CANCEL)}
        >
          {translate("PR.btn_cancel")}
        </Button>
      )}

      {canEdit && (
        <Button
          icon={<img src={EditIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={handlePressEdit}
        >
          {translate("PR.btn_edit")}
        </Button>
      )}

      {canCloseRequest && (
        <Button
          icon={<img src={RejectIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() => handleUpdateTypeModal(ModelConfirmType.CLOSE)}
        >
          {translate("LE.btn_close_contract")}
        </Button>
      )}
      <ModalConfirm
        centered
        open={[
          ModelConfirmType.DELETE,
          ModelConfirmType.CANCEL,
          ModelConfirmType.CLOSE,
        ].includes(modalConfirm)}
        titleButtonApply={translate("CM.btn_confirm")}
        titleButtonCancel={translate("CM.btn_close")}
        handleCancel={onDismiss}
        handleSave={onConfirm}
        icon={
          <img src={getIconModal(modalConfirm)} alt="" width={72} height={72} />
        }
        title={translate(getTitleModalConfirm(modalConfirm), {
          contractType: translate("CT.txt_contract_principles"),
        })}
        content={
          <Trans
            i18nKey={getContentModalConfirm(modalConfirm)}
            values={{
              contractType: translate("CT.txt_contract_principles"),
              code: model?.code,
            }}
          />
        }
      >
        {![ModelConfirmType.CLOSE, ModelConfirmType.APPROVE].includes(
          modalConfirm
        ) && (
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

export default GroupActionDetail;
