import { useContext, useMemo } from "react";
import "./PurchasePlanGenerationInfoView.scss";
// eslint-disable-next-line import/named
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { isEmpty } from "lodash";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import { Col, Row } from "antd";
import { OneLineText } from "react-components-design-system";
const PurchasePlanGenerationInfoView = () => {
  const { translate, model } = useContext(PurchasingPlanDetailHookContext);
  const reasonView = useMemo(() => {
    return model.reason;
  }, [model.name]);

  return (
    <div className="purchase_plan_generation_info_View-rounded-4 purchase_plan_generation_info_View-border pl">
      <Row className="purchase_plan_generation_info_View-bg">
        <Col span={16}>
          <div className="p--sm">
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
          <div className="p--sm">
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
          <div className="p--sm">
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
          <div className="p--sm">
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
              <div className="p--sm">
                <div className="purchase_plan_generation_info_View-text_sm">
                  {translate("PL.purchasing_plan_supplier_reason")}
                </div>
                <OneLineText
                  className="fw-medium mt-1"
                  value={reasonView}
                ></OneLineText>
              </div>
            </Col>
            <Col
              span={12}
              className="purchase_plan_generation_info_View-border-l"
            >
              <div className="p--sm">
                <div className="purchase_plan_generation_info_View-text_sm">
                  {translate("PL.purchasing_plan_bidding_start_time")}
                </div>
                <OneLineText
                  className="fw-medium mt-1"
                  value={formatDate(
                    model?.startDate,
                    STANDARD_DATE_FORMAT_SLASH
                  )}
                ></OneLineText>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={8} className="purchase_plan_generation_info_View-border-l">
          <div className="p--sm">
            <div className="purchase_plan_generation_info_View-text_sm">
              {translate("PL.purchasing_plan_bidding_end_time")}
            </div>
            <OneLineText
              className="fw-medium mt-1"
              value={formatDate(model?.endDate, STANDARD_DATE_FORMAT_SLASH)}
            ></OneLineText>
          </div>
        </Col>
      </Row>

      <Row className="border_top">
        <Col span={16}>
          <Row>
            <Col span={12}>
              <div className="p--sm">
                <div className="purchase_plan_generation_info_Vieww-text_sm">
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
              <div className="p--sm">
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
          <div className="p--sm">
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

export default PurchasePlanGenerationInfoView;
