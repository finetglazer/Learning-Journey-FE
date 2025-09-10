import { useContext } from "react";
import { FormItem, InputText } from "react-components-design-system";
import { utilService } from "core/services/common-services/util-service";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";
import { useAppSelector } from "rtk/useRedux";
import { Profile } from "models/Profile";
import { Col, Row } from "antd";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";

const PurchasePlanBiddingGenerationInfo = () => {
  const { translate, handleChangeSingleField, model } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );
  const profile: Profile = useAppSelector((state) => state.profile);

  return (
    <div>
      <Row gutter={12}>
        <Col span={16}>
          <FormItem validateObject={utilService.getValidateObj(model, "name")}>
            <InputText
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
        </Col>
        <Col span={8}>
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
        </Col>
      </Row>

      <Row className="pt-2">
        <Col span={24}>
          <FormItem validateObject={utilService.getValidateObj(model, "note")}>
            <InputText
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
        </Col>
      </Row>

      <Row gutter={12} className="pt-2">
        <Col span={8}>
          <FormItem>
            <InputText
              label={translate("PL.purchasing_plan_creator")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              regexInput={NOT_TAB_ENTER_REGEX}
              value={profile?.account?.email + " - " + profile?.account?.name}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem>
            <InputText
              label={translate("PL.purchasing_plan_creator_unit")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              regexInput={NOT_TAB_ENTER_REGEX}
              value={profile?.organization?.name}
            />
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem>
            <InputText
              label={translate("PL.purchasing_plan_title")}
              allowClear={false}
              readOnly={true}
              isSmall={false}
              regexInput={NOT_TAB_ENTER_REGEX}
              value={profile?.position?.name}
            />
          </FormItem>
        </Col>
      </Row>
    </div>
  );
};

export default PurchasePlanBiddingGenerationInfo;
