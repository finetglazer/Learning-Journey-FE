import { utilService } from "core/services/common-services/util-service";
import CommonFilter from "models/CommonFilter";
import { FormItem, ModalConfirm, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { IcApproveBig } from "assets/icons";
import {
  PurchasingPlanModel,
  SearchingFilterModel,
} from "models/PurchasingPlan";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";

type ModalProps = {
  onCancel?: () => void;
  onSave?: () => void;
  currentContext?: PurchasingPlanModel;
};

export const EvaluationConfirmModal = ({
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
      loadingButton={currentContext?.loading}
    >
      <FormItem
        validateObject={utilService.getValidateObj(model, "evaluationCriteria")}
      >
        <Select
          isSmall={false}
          isRequired
          classFilter={SearchingFilterModel}
          getList={(TModelFilter) => {
            return purchasingPlanRepository.listMasterUser({
              pageIndex: 1,
              pageSize: 30,
              searchText: TModelFilter?.searchText,
              isActive: true,
              isSupplier: false,
            } as SearchingFilterModel);
          }}
          onChange={handleChangeSelectField({
            fieldName: "approveUserId",
          })}
          isSearch
          searchProperty="searchText"
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
