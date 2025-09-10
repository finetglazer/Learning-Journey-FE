import { useContext } from "react";
import "./GenerationInfoView.scss";
import { isEmpty } from "lodash";
import { Col, Row } from "antd";
import { OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchasingPlanPrincipleDetailHookContext } from "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";

const PurchasePlanPrincipleGenerationInfoView = () => {
  const [translate] = useTranslation();
  const { model } = useContext(PurchasingPlanPrincipleDetailHookContext);

  return (
    <div className="purchase_plan_generation_info_View-rounded-4 purchase_plan_generation_info_View-border pl">
      <Row className="purchase_plan_generation_info_View-bg">
        <Col span={16}>
          <div className="p--sm purchase-plan-principle__table-item">
            <div className="purchase_plan_generation_info_View-text_sm">
              {translate("PL.filter_purchase_plan_name")}
            </div>
            <OneLineText
              className="fw-medium mt-1"
              value={model?.name}
            ></OneLineText>
          </div>
        </Col>
        <Col span={8} className="purchase_plan_generation_info_View-border-l">
          <div className="p--sm purchase-plan-principle__table-item">
            <div className="purchase_plan_generation_info_View-text_sm">
              {translate("PL.purchasing_plan_purchase_form")}
            </div>
            <OneLineText
              className="fw-medium mt-1"
              value={model?.purchasePlanType?.name}
            ></OneLineText>
          </div>
        </Col>
      </Row>
      <Row className="border_top">
        <Col span={16}>
          <div className="p--sm purchase-plan-principle__table-item">
            <div className="purchase_plan_generation_info_View-text_sm">
              {translate("PL.filter_purchase_plan_description")}
            </div>
            <OneLineText
              className="fw-medium mt-1"
              value={model?.note}
            ></OneLineText>
          </div>
        </Col>
        <Col span={8} className="purchase_plan_generation_info_View-border-l">
          <div className="p--sm purchase-plan-principle__table-item">
            <div className="purchase_plan_generation_info_View-text_sm">
              {translate("PL.purchasing_plan_expected_delivery_date")}
            </div>
            <OneLineText
              className="fw-medium mt-1"
              value={model?.estimatedDelivery}
            ></OneLineText>
          </div>
        </Col>
      </Row>
      <Row className="border_top">
        <Col span={16}>
          <Row>
            <Col span={12}>
              <div className="p--sm purchase-plan-principle__table-item">
                <div className="purchase_plan_generation_info_View-text_sm">
                  {translate("PL.purchasing_plan_creator")}
                </div>
                <OneLineText
                  className="fw-medium mt-1"
                  value={`${model?.user?.email} - ${model?.user?.name}`}
                ></OneLineText>
              </div>
            </Col>
            <Col
              span={12}
              className="purchase_plan_generation_info_View-border-l"
            >
              <div className="p--sm purchase-plan-principle__table-item">
                <div className="purchase_plan_generation_info_View-text_sm">
                  {translate("PL.purchasing_plan_creator_unit")}
                </div>
                <OneLineText
                  className="fw-medium mt-1"
                  value={
                    isEmpty(model?.userOrganization)
                      ? ""
                      : model?.userOrganization[0]?.name
                  }
                ></OneLineText>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8} className="purchase_plan_generation_info_View-border-l">
          <div className="p--sm purchase-plan-principle__table-item">
            <div className="purchase_plan_generation_info_View-text_sm">
              {translate("PL.purchasing_plan_title")}
            </div>
            <OneLineText
              className="fw-medium mt-1"
              value={model?.userPosition?.name}
            ></OneLineText>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PurchasePlanPrincipleGenerationInfoView;
