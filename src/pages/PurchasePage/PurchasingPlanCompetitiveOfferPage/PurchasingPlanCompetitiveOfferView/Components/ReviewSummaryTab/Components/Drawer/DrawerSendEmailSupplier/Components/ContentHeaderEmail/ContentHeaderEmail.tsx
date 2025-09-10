import { commentRepository } from "components/Comment/CommentRepository";
import { DESCRIPTION_REGEX } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { SupplierGenerals } from "models/PurchasingPlan";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { useContext, useMemo } from "react";
import {
  FormItem,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import "./ContentHeaderEmail.scss";

const ContentHeaderEmail = () => {
  const {
    translate,
    model,
    handleChangeMultipleSelectField,
    handleChangeSingleField,
  } = useContext(PurchasingPlanCompetitiveOfferDetailHookContext);

  const dataSupplier = useMemo(() => {
    // model.supplierGenerals?.[0]?.supplier?.name;
    return model?.supplierGenerals
      ?.map((item: SupplierGenerals) => item?.supplier?.name)
      .join(", ");
  }, [model.supplierGenerals]);

  return (
    <div>
      <div className="p-b--xs">
        <InputText
          isSmall={false}
          label={translate("PL.purchasing_plan_supplier_tab")}
          readOnly
          value={dataSupplier}
        />
      </div>
      <div className="p-b--xs">
        <MultipleSelect
          isSmall={false}
          label={translate("PL.purchasing_plan_email_cc")}
          className="select-email"
          values={model?.emailCC || []}
          placeHolder={translate("PL.purchasing_plan_email_cc_placeholder")}
          render={(item) => `${item?.email} - ${item?.name}`}
          getList={commentRepository.listMasterUser}
          classFilter={DemoFilter}
          onChange={handleChangeMultipleSelectField({
            fieldName: "emailCC",
          })}
        />
      </div>
      <div>
        <FormItem validateObject={utilService.getValidateObj(model, "subject")}>
          <InputText
            isRequired
            isSmall={false}
            label={translate("PL.purchasing_plan_title_email")}
            placeHolder={translate(
              "PL.purchasing_plan_title_email_placeholder"
            )}
            onChange={handleChangeSingleField({
              fieldName: "subject",
            })}
            value={model.subject}
            regexInput={DESCRIPTION_REGEX}
            maxLength={255}
            translate={translate}
          />
        </FormItem>
      </div>
    </div>
  );
};

export default ContentHeaderEmail;
