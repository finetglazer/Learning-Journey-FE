import { utilService } from "core/services/common-services/util-service";
import { isEqual } from "lodash";
import { ContractDetailModel, ModelConfirmType } from "models/Contract";

import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { getObjectModalConfirm } from "pages/PurchasePage/ContractPage/ContractDetail/Components/GroupAction/helper";

import { useContext, useMemo } from "react";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans } from "react-i18next";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { useHistory } from "react-router";
import { CONTRACT_ROUTE_MASTER } from "config/route-const";
import { AxiosError } from "axios";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";

const ModalActionContract = () => {
  const [translate] = useTranslationContract();
  const history = useHistory();

  const {
    model,
    modalConfirm,
    handleChangeSingleField,
    handleUpdateTypeModal,
    contractId,
    notifyToast,
    handleChangeAllField,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const onDismiss = () => {
    handleUpdateTypeModal(null);
    handleChangeSingleField({
      fieldName: "reason",
    })(null);
  };

  const onConfirm = () => {
    contractRepository
      .actionContract(contractId, modalConfirm, { reason: model?.reason })
      .subscribe({
        next: (response) => {
          if (response) {
            onDismiss();
            history.push(CONTRACT_ROUTE_MASTER);
          }
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...convertDataToHaveIndexBeforeValidate(model, [], model),
              errors: error.response?.data?.errors,
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  };

  const openModal = useMemo(() => {
    return (
      isEqual(modalConfirm, ModelConfirmType.CLOSE) ||
      isEqual(modalConfirm, ModelConfirmType.DELETE) ||
      isEqual(modalConfirm, ModelConfirmType.CANCEL)
    );
  }, [modalConfirm]);

  const isShowReason = useMemo(() => {
    return (
      !isEqual(modalConfirm, ModelConfirmType.CLOSE) &&
      !isEqual(modalConfirm, ModelConfirmType.APPROVE)
    );
  }, [modalConfirm]);

  return (
    <ModalConfirm
      centered
      open={openModal}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleCancel={onDismiss}
      handleSave={onConfirm}
      icon={
        <img
          src={getObjectModalConfirm(modalConfirm).icon}
          alt=""
          width={72}
          height={72}
        />
      }
      title={translate(getObjectModalConfirm(modalConfirm).title)}
      content={
        <Trans
          i18nKey={`${translate(getObjectModalConfirm(modalConfirm).warning)} ${
            model?.code
          }`}
          values={{ code: model?.code }}
        />
      }
    >
      {isShowReason && (
        <FormItem validateObject={utilService.getValidateObj(model, "reason")}>
          <TextArea
            showCount
            isRequired
            label={translate(getObjectModalConfirm(modalConfirm).label)}
            placeHolder={translate("BG.input_reason")}
            maxLength={500}
            onChange={handleChangeSingleField({
              fieldName: "reason",
            })}
            value={model?.reason}
            className="m-t--lg"
            resize="none"
          />
        </FormItem>
      )}
    </ModalConfirm>
  );
};

export default ModalActionContract;
