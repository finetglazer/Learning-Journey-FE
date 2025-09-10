import { utilService } from "core/services/common-services/util-service";
import CommonFilter from "models/CommonFilter";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { FormItem, ModalConfirm, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { IcApproveBig } from "assets/icons";
import { PurchasingPlanModel } from "models/PurchasingPlan";

type ModalProps = {
  onCancel?: () => void;
  onSave?: () => void;
  currentContext?: PurchasingPlanModel;
};

export const ConfirmApproveModal = ({
  onCancel,
  onSave,
  currentContext,
}: ModalProps) => {
  const { model, handleChangeSelectField } = currentContext;
  const [translate] = useTranslation();
  return (
    <ModalConfirm
      open
      title={translate("PL.txt_warning_send_approve_title")}
      icon={<img src={IcApproveBig} alt="" width={72} height={72} />}
      content={translate("PL.txt_warning_send_approve_content")}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleCancel={onCancel}
      handleSave={onSave}
      className="text-break-line"
      loadingButton={currentContext.loading}
    >
      <FormItem
        validateObject={utilService.getValidateObj(model, "approveUserId")}
      >
        <Select
          isSmall={false}
          isRequired
          classFilter={CommonFilter}
          getList={contractRepository.getListUser}
          onChange={handleChangeSelectField({
            fieldName: "approveUserId",
          })}
          isSearch
          searchProperty="name"
          isEnumerable={false}
          placeHolder={translate("PL.plh_select_approver")}
          value={model?.approveUserId}
          label={translate("PL.txt_select_approver")}
          className="pt-4"
        />
      </FormItem>
    </ModalConfirm>
  );
};
