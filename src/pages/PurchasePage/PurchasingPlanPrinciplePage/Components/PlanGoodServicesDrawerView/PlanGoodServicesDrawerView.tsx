import { Drawer, OneLineText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Col, Row } from "antd";
import { GoodServiceByCategory } from "models/PurchaseRequest";

import styles from "./PlanGoodServicesDrawerView.module.scss";
import { formatNumber } from "core/helpers/number";

interface Props {
  visible: boolean;
  handleClose: () => void;
  handleSave: () => void;
  recordGoodServices: GoodServiceByCategory;
}

const PlanGoodServicesDrawerView = ({
  visible,
  handleClose,
  handleSave,
  recordGoodServices,
}: Props) => {
  const [translate] = useTranslation();

  return (
    <Drawer
      numberButton={"2"}
      visible={visible}
      size={"2xl"}
      loading={false}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_save")}
      handleCancel={handleClose}
      handleClose={handleClose}
      handleSave={handleSave}
      isHaveCloseIcon={true}
      isShowButtonApply={false}
      visibleFooter={false}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={false}
      title={
        <div className="fw-bold">
          <span>{translate("PL.detail_info_of_goods")}</span>
        </div>
      }
    >
      <div
        className={styles["purchasing-plan-principle-goods-services-drawer"]}
      >
        <div className="purchase_plan_generation_info_View-rounded-4 purchase_plan_generation_info_View-border pl">
          <Row>
            <Col span={8}>
              <div className={`p--sm ${styles["bg_grey"]}`}>
                <div className="purchase_plan_generation_info_View-text_sm">
                  {translate("PL.purchasing_plan_code_goods")}
                </div>
                <OneLineText
                  className="fw-medium mt-1"
                  value={recordGoodServices?.code}
                ></OneLineText>
              </div>
            </Col>
            <Col
              span={16}
              className="purchase_plan_generation_info_View-border-l"
            >
              <div className={`p--sm ${styles["bg_grey"]}`}>
                <div className="purchase_plan_generation_info_View-text_sm">
                  {translate("PL.purchasing_plan_name_goods")}
                </div>
                <OneLineText
                  className="fw-medium mt-1"
                  value={recordGoodServices?.name}
                ></OneLineText>
              </div>
            </Col>
          </Row>
          <Row className="border_top">
            <Col span={8}>
              <div className="p--sm">
                <div className="purchase_plan_generation_info_View-text_sm">
                  {translate("PL.purchasing_plan_unit")}
                </div>
                <OneLineText
                  className="fw-medium mt-1"
                  value={recordGoodServices?.unit?.name}
                ></OneLineText>
              </div>
            </Col>
            <Col
              span={16}
              className="purchase_plan_generation_info_View-border-l"
            >
              <Row>
                <Col span={12}>
                  <div className="p--sm">
                    <div className="purchase_plan_generation_info_View-text_sm">
                      {translate("PL.purchasing_plan_purchase_quantity")}
                    </div>
                    <OneLineText
                      className="fw-medium mt-1"
                      value={formatNumber(
                        recordGoodServices?.remainingRequestQuantity
                      )}
                    ></OneLineText>
                  </div>
                </Col>
                <Col
                  span={12}
                  className="purchase_plan_generation_info_View-border-l"
                >
                  <div className="p--sm">
                    <div className="purchase_plan_generation_info_View-text_sm">
                      {translate("PL.purchasing_plan_manufacturer")}
                    </div>
                    <OneLineText
                      className="fw-medium mt-1"
                      value={recordGoodServices?.manufacturer?.name}
                    ></OneLineText>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="border_top">
            <Col>
              <div className="p--sm">
                <div className="purchase_plan_generation_info_View-text_sm">
                  {translate("PL.purchasing_plan_note")}
                </div>
                <div className="fw-medium mt-1 text-wrap text-break">
                  {recordGoodServices?.note}
                </div>
              </div>
            </Col>
          </Row>
          <Row className="border_top">
            <Col>
              <div className="p--sm">
                <div className="purchase_plan_generation_info_View-text_sm">
                  {translate("PL.description_goods_services")}
                </div>
                <div className="fw-medium mt-1 text-wrap text-break">
                  {recordGoodServices?.description}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Drawer>
  );
};

export default PlanGoodServicesDrawerView;
