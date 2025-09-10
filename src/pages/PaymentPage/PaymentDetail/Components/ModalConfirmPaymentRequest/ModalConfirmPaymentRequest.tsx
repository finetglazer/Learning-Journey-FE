import { utilService } from "core/services/common-services/util-service";
import { useContext, useMemo } from "react";
import {
  FormItem,
  ModalConfirm,
  TextArea,
} from "react-components-design-system";
import { Trans } from "react-i18next";
import { PaymentDetailHookContext } from "../../PaymentDetailHook";
import {
  getContentModalConfirm,
  getIconModal,
  getLabelInputReason,
  getTitleModalConfirm,
} from "./helpers";

export enum EConfirmType {
  RETURN = "RETURN",
  REJECT = "REJECT",
  DELETE = "DELETE",
  CANCEL = "CANCEL",
}

interface ModalConfirmPaymentRequestProperties {
  confirmType: EConfirmType;
}

const MODAL_ICON_SIZE = 72;
const REASON_MAX_LENGTH = 500;

const ModalConfirmPaymentRequest = ({
  confirmType,
}: ModalConfirmPaymentRequestProperties) => {
  const {
    model,
    translate,
    setModalType,
    handleChangeSingleField,
    handleRejectPaymentRequest,
    handleReturnPaymentRequest,
    handleDeletePaymentRequest,
    handleCancelPaymentRequest,
  } = useContext(PaymentDetailHookContext);

  const paymentName = useMemo(
    () => model?.paymentDetailInfomation?.paymentRequestType?.name,
    [model?.paymentDetailInfomation?.paymentRequestType?.name]
  );

  const handleCloseModal = () => {
    setModalType("NONE");
    handleChangeSingleField({ fieldName: "reason" })("");
  };

  const handleSubmit = () => {
    switch (confirmType) {
      case EConfirmType.REJECT:
        return handleRejectPaymentRequest();
      case EConfirmType.RETURN:
        return handleReturnPaymentRequest();
      case EConfirmType.CANCEL:
        return handleCancelPaymentRequest();
      case EConfirmType.DELETE:
        return handleDeletePaymentRequest();
      default:
        return;
    }
  };

  return (
    <ModalConfirm
      centered
      open
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleCancel={handleCloseModal}
      handleSave={handleSubmit}
      icon={
        <img
          src={getIconModal(confirmType)}
          alt=""
          width={MODAL_ICON_SIZE}
          height={MODAL_ICON_SIZE}
        />
      }
      title={translate(getTitleModalConfirm(confirmType), {
        paymentName,
      })}
      content={
        <Trans
          i18nKey={getContentModalConfirm(confirmType)}
          values={{ paymentName, code: model?.paymentDetailInfomation?.code }}
        />
      }
    >
      <FormItem validateObject={utilService.getValidateObj(model, "reason")}>
        <TextArea
          showCount
          isRequired
          label={translate(getLabelInputReason(confirmType))}
          placeHolder={translate("BG.input_reason")}
          maxLength={REASON_MAX_LENGTH}
          onChange={handleChangeSingleField({
            fieldName: "reason",
          })}
          value={model?.confirmReason}
          className="m-t--lg"
          resize="none"
        />
      </FormItem>
    </ModalConfirm>
  );
};

export default ModalConfirmPaymentRequest;
