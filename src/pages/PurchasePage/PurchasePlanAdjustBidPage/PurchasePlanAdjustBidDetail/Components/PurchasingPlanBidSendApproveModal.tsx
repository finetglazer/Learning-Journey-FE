import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { SendApproveAdjust } from "models/PurchasingPlan";
import { ModelSelect } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/PurchasingPlanMasterHook";
import { useContext, useEffect } from "react";
import {
  FormItem,
  Modal,
  ModalConfirm,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { proposalRepository } from "../../../ProposalPage/ProposalRepository";
import { PurchasePlanAdjustBidDetailHookContext } from "../PurchasePlanAdjustBidDetailHook";

const MAX_LENGTH_REASON = 500;

export enum ConfirmModalType {
  DELETE,
  CANCEL,
  RETURN,
  REJECT,
  SEND_APPROVE,
  SEND_RESULT,
}

interface PurchasePlanConfirmModalProps {
  isLoading: boolean;
  errorMessage?: { [key: string]: string };
  onApply?: () => void;
  onCancel?: () => void;
  setModelSelected?: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  loadingButton?: boolean;
}

export interface DataForm {
  email?: string;
  reasonForAdjustment?: string;
}

export const PurchasingPlanBidSendApproveModal = ({
  onApply,
  onCancel,
}: PurchasePlanConfirmModalProps) => {
  const [translate] = useTranslation();
  const {
    model: modelMaster,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext(PurchasePlanAdjustBidDetailHookContext);

  const { model, dispatch } = detailService.useModel<SendApproveAdjust>(
    SendApproveAdjust,
    {
      ...new SendApproveAdjust(),
    }
  );

  const {
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatch);

  const validate = () => {
    const requiredFields = ["user", "reasonForAdjustment"];
    const errors = requiredFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (!model?.[field]) {
          acc[field] = translate("CM.input_require_validation");
        }

        if (field === "reasonForAdjustment" && model?.[field]?.length > 500) {
          acc[field] = translate("CM.input_length_validation", {
            maxLength: 500,
          });
        }
        return acc;
      },
      {}
    );

    if (Object.keys(errors).length > 0) {
      handleChangeAllField({
        ...model,
        errors: {
          ...model?.errors,
          ...errors,
        },
      });
      return false;
    }
    return true;
  };

  const handleOnApprove = () => {
    if (!validate()) {
      return;
    }

    modelMaster.reasonForAdjustment = model.reasonForAdjustment;
    modelMaster.approveUser = model.user;
    onApply();
    modelMaster.reasonForAdjustment = "";
    onCancel();
  };

  useEffect(() => {
    if (modelMaster.approveUser?.id) {
      handleChangeSelectField({
        fieldName: "user",
      })(modelMaster.approveUser?.id, modelMaster.approveUser);
    }
    handleChangeSingleField({ fieldName: "reasonForAdjustment" })(
      modelMaster.reasonForAdjustment
    );
  }, []);

  const userListOptions = (
    <div className="">
      <div className="col-lg-12 p-0">
        <FormItem validateObject={utilService.getValidateObj(model, "user")}>
          <Select
            isRequired
            label={translate("PL.txt_approver")}
            value={model?.user}
            placeHolder={translate("PL.plh_approver")}
            isSearch
            isSmall={false}
            onChange={handleChangeSelectField({
              fieldName: "user",
            })}
            valueFilter={{
              name: "",
            }}
            readOnly={!!modelMaster.approveUser?.id}
            getList={proposalRepository.listMasterUser}
            classFilter={undefined}
          />
        </FormItem>
      </div>
      <div className="col-lg-12 p-0 mt-4">
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            "reasonForAdjustment"
          )}
        >
          <TextArea
            isRequired
            showCount
            maxLength={MAX_LENGTH_REASON}
            label={translate("PL.txt_purchasing_plan_reason_for_adjustment")}
            placeHolder={translate(
              "PL.plh_purchasing_plan_reason_for_adjustment"
            )}
            value={model.reasonForAdjustment}
            onChange={handleChangeSingleField({
              fieldName: "reasonForAdjustment",
            })}
            resize="none"
          />
        </FormItem>
      </div>
    </div>
  );

  return (
    <Modal
      open
      title={translate("PL.bidding.title.approve_adjustments")}
      titleButtonApply={translate("PL.bidding.button.send_for_approval")}
      titleButtonCancel={translate("CM.btn_close")}
      className="modal-confirm_purchase-plan"
      handleSave={handleOnApprove}
      handleCancel={onCancel}
      maskClosable={false}
      size={600}
      isShowIconBack={false}
    >
      {userListOptions}
    </Modal>
  );
};
