import { useContext } from "react";
import { FormItem, InputText } from "react-components-design-system";
import { utilService } from "core/services/common-services/util-service";
// eslint-disable-next-line import/named
import { TFunction } from "i18next";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";
import { useAppSelector } from "rtk/useRedux";
import { Profile } from "models/Profile";
import { Row } from "antd";
import { PurchasingPlanPrincipleDetailHookContext } from "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";

const PurchasePlanPrincipleGenerationInfo = () => {
  const { translate, handleChangeSingleField, model } = useContext(
    PurchasingPlanPrincipleDetailHookContext
  );
  const profile: Profile = useAppSelector((state) => state.profile);

  return (
    <div>
      <div className="pl-grid-12">
        <div className="pl-col_8">
          <div>
            <FormItem
              validateObject={utilService.getValidateObj(model, "name")}
            >
              <InputText
                translate={translate as TFunction}
                isRequired
                label={translate("PL.purchasing_plan_name")}
                placeHolder={translate("PL.purchasing_plan_name_placeholder")}
                isSmall={false}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
                regexInput={NOT_TAB_ENTER_REGEX}
                maxLength={255}
                value={model?.name}
              />
            </FormItem>
          </div>
        </div>
        <div className="pl-col_4">
          <div>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "purchasePlanType"
              )}
            >
              <InputText
                label={translate("PL.purchasing_plan_purchase_form")}
                isSmall={false}
                readOnly={true}
                value={model?.purchasePlanType?.name}
              />
            </FormItem>
          </div>
        </div>
      </div>

      <Row className="pl-grid-12 pt-2">
        <div className="pl-col_8">
          <FormItem validateObject={utilService.getValidateObj(model, "note")}>
            <InputText
              translate={translate as TFunction}
              label={translate("PL.purchasing_plan_description")}
              placeHolder={translate(
                "PL.purchasing_plan_description_placeholder"
              )}
              isSmall={false}
              onChange={handleChangeSingleField({
                fieldName: "note",
              })}
              maxLength={500}
              regexInput={NOT_TAB_ENTER_REGEX}
              value={model?.note}
            />
          </FormItem>
        </div>
        <div className="pl-col_4">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "estimatedDelivery"
            )}
          >
            <InputText
              translate={translate as TFunction}
              label={translate("PL.purchasing_plan_expected_delivery_date")}
              placeHolder={translate(
                "PL.purchasing_plan_expected_delivery_date_placeholder"
              )}
              isSmall={false}
              onChange={handleChangeSingleField({
                fieldName: "estimatedDelivery",
              })}
              maxLength={500}
              regexInput={NOT_TAB_ENTER_REGEX}
              value={model?.estimatedDelivery}
            />
          </FormItem>
        </div>
      </Row>

      <div className="pl-grid-12 pt-2">
        <div className="pl-col_4">
          <FormItem>
            <InputText
              translate={translate as TFunction}
              label={translate("PL.purchasing_plan_creator")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              regexInput={NOT_TAB_ENTER_REGEX}
              value={profile?.account?.email + " - " + profile?.account?.name}
            />
          </FormItem>
        </div>
        <div className="pl-col_4">
          <FormItem>
            <InputText
              translate={translate as TFunction}
              label={translate("PL.purchasing_plan_creator_unit")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              regexInput={NOT_TAB_ENTER_REGEX}
              value={profile?.organization?.name}
            />
          </FormItem>
        </div>
        <div className="pl-col_4">
          <FormItem>
            <InputText
              translate={translate as TFunction}
              label={translate("PL.purchasing_plan_title")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              regexInput={NOT_TAB_ENTER_REGEX}
              value={profile?.position?.name}
            />
          </FormItem>
        </div>
      </div>
    </div>
  );
};

export default PurchasePlanPrincipleGenerationInfo;
