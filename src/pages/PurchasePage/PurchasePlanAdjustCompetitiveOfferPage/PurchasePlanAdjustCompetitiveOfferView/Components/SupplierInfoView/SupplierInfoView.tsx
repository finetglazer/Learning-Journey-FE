import { useContext } from "react";
import { Col, Row } from "antd";
import { OneLineText } from "react-components-design-system";

import { PurchasePlanAdjustCompetitiveOfferDetailHookContext } from "../../../PurchasePlanAdjustCompetitiveOfferDetail/PurchasePlanAdjustCompetitiveOfferDetailHook";
import { SupplierModel } from "models/PurchasingPlan";

import styles from "./SupplierInfoView.module.scss";

const SupplierInfoView = () => {
  const { model, translate } = useContext(
    PurchasePlanAdjustCompetitiveOfferDetailHookContext
  );

  return (
    <div className={styles["supplier-info-wrapper"]}>
      <div className="PurchaseInformationData-body mt-0 flex-1">
        <div className="purchase_proposal_data_wrapper">
          <Row className="item_row">
            <Col
              span={24}
              className={`item_col bg_grey purchase-plan-principle__table-item justify-content-center align-items-center ${styles["table-cell"]}`}
            >
              <span className="value">
                <OneLineText
                  value={translate("PPA.old_supplier")}
                  className="fw-semibold"
                />
              </span>
            </Col>
          </Row>
          <Row className="item_row">
            <Col
              span={12}
              className={`item_col bg_grey purchase-plan-principle__table-item justify-content-center ${styles["table-cell"]}`}
            >
              <span className="value">
                <OneLineText
                  value={translate("PL.purchasing_plan_supplier_name")}
                  className="fw-semibold"
                />
              </span>
            </Col>

            <Col
              span={12}
              className={`item_col bg_grey purchase-plan-principle__table-item justify-content-center ${styles["table-cell"]}`}
            >
              <span className="value">
                <OneLineText
                  value={translate("PPA.person_in_charge")}
                  className="fw-semibold"
                />
              </span>
            </Col>
          </Row>

          {model?.supplierGeneralOlds?.map((item: SupplierModel) => {
            return (
              <Row key={item?.id} className="item_row">
                <Col
                  span={12}
                  className={`item_col purchase-plan-principle__table-item ${styles["table-cell--large"]}`}
                >
                  <span className="value text_blue text-truncate">
                    {item?.supplier?.name || "---"}
                  </span>
                  <span className={styles["sub-value"]}>
                    {item?.supplier?.taxCode || "---"}
                  </span>
                </Col>

                <Col
                  span={12}
                  className={`item_col purchase-plan-principle__table-item ${styles["table-cell--large"]}`}
                >
                  <span className="text-truncate">
                    {item?.personInChargeInfos?.[0]?.pic?.name || "---"}
                  </span>
                  <span className={styles["sub-value"]}>
                    {item?.personInChargeInfos?.[0]?.pic?.email || "---"}
                  </span>
                </Col>
              </Row>
            );
          })}
        </div>
      </div>

      <div className="PurchaseInformationData-body mt-0 flex-1">
        <div className="purchase_proposal_data_wrapper">
          <Row className="item_row">
            <Col
              span={24}
              className={`item_col bg_grey purchase-plan-principle__table-item justify-content-center align-items-center ${styles["table-cell"]}`}
            >
              <span className="value">
                <OneLineText
                  value={translate("PPA.adjustment_supplier")}
                  className="fw-semibold"
                />
              </span>
            </Col>
          </Row>
          <Row className="item_row">
            <Col
              span={12}
              className={`item_col bg_grey purchase-plan-principle__table-item justify-content-center ${styles["table-cell"]}`}
            >
              <span className="value">
                <OneLineText
                  value={translate("PL.purchasing_plan_supplier_name")}
                  className="fw-semibold"
                />
              </span>
            </Col>

            <Col
              span={12}
              className={`item_col bg_grey purchase-plan-principle__table-item justify-content-center ${styles["table-cell"]}`}
            >
              <span className="value">
                <OneLineText
                  value={translate("PPA.person_in_charge")}
                  className="fw-semibold"
                />
              </span>
            </Col>
          </Row>

          {model?.supplierGenerals?.map((item: SupplierModel) => {
            return (
              <Row key={item?.id} className="item_row">
                <Col
                  span={12}
                  className={`item_col purchase-plan-principle__table-item ${styles["table-cell--large"]}`}
                >
                  <span className="value text_blue text-truncate">
                    {item?.supplier?.name || "---"}
                  </span>
                  <span className={styles["sub-value"]}>
                    {item?.supplier?.taxCode || "---"}
                  </span>
                </Col>

                <Col
                  span={12}
                  className={`item_col purchase-plan-principle__table-item ${styles["table-cell--large"]}`}
                >
                  <span className="text-truncate">
                    {item?.personInChargeInfos?.[0]?.pic?.name || "---"}
                  </span>
                  <span className={styles["sub-value"]}>
                    {item?.personInChargeInfos?.[0]?.pic?.email || "---"}
                  </span>
                </Col>
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SupplierInfoView;
