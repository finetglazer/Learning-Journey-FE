import { Col, Row } from "antd";
import { OneLineText } from "react-components-design-system";

import { CONTRACT_PRINCIPLE_VIEW_ROUTE } from "config/route-const";
import { formatNumber } from "core/helpers/number";
import { SupplierModel } from "models/PurchasingPlan";

import { useTranslation } from "react-i18next";
import styles from "./SupplierDetailsFormView.module.scss";

interface SupplierDetailsFormProps {
  modelDetailSupplier?: SupplierModel;
}

const SupplierDetailsFormView = ({
  modelDetailSupplier,
}: SupplierDetailsFormProps) => {
  const [translate] = useTranslation();

  const navigateToPrincipleContractView = (principleContractId: string) => {
    if (!principleContractId) return;

    window.open(
      `${CONTRACT_PRINCIPLE_VIEW_ROUTE}/${principleContractId}`,
      "_blank"
    );
  };

  return (
    <div className={styles["supplier-details-form-view"]}>
      <div className="purchase_plan_generation_info_View-rounded-4 purchase_plan_generation_info_View-border pl">
        <Row>
          <Col span={8}>
            <div
              className={`p--sm purchase-plan-principle__table-item ${styles["bg_grey"]}`}
            >
              <div className="purchase_plan_generation_info_View-text_sm">
                {translate("PL.principle_contract_code")}
              </div>
              <div
                onClick={() =>
                  navigateToPrincipleContractView(
                    modelDetailSupplier?.contractId
                  )
                }
              >
                <OneLineText
                  className={`fw-medium mt-1 ${styles["primary-text"]}`}
                  value={modelDetailSupplier?.code}
                />
              </div>
            </div>
          </Col>
          <Col
            span={16}
            className="purchase_plan_generation_info_View-border-l"
          >
            <div
              className={`p--sm purchase-plan-principle__table-item ${styles["bg_grey"]}`}
            >
              <div className="purchase_plan_generation_info_View-text_sm">
                {translate("PL.principle_contract_name")}
              </div>

              <div
                onClick={() =>
                  navigateToPrincipleContractView(
                    modelDetailSupplier?.contractId
                  )
                }
              >
                <OneLineText
                  className={`fw-medium mt-1 ${styles["primary-text"]}`}
                  value={modelDetailSupplier?.contractName}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row className="border_top">
          <Col span={8}>
            <div className="p--sm purchase-plan-principle__table-item">
              <div className="purchase_plan_generation_info_View-text_sm">
                {translate("PL.drawer_type_currency_table")}
              </div>
              <OneLineText
                className="fw-medium mt-1"
                value={modelDetailSupplier?.currency}
              ></OneLineText>
            </div>
          </Col>
          <Col
            span={16}
            className="purchase_plan_generation_info_View-border-l"
          >
            <Row>
              <Col span={12}>
                <div className="p--sm purchase-plan-principle__table-item">
                  <div className="purchase_plan_generation_info_View-text_sm">
                    {translate("PL.exchange_rate_label")}
                  </div>
                  <OneLineText
                    className="fw-medium mt-1"
                    value={formatNumber(modelDetailSupplier?.exchangeRate)}
                  ></OneLineText>
                </div>
              </Col>
              <Col
                span={12}
                className="purchase_plan_generation_info_View-border-l"
              >
                <div className="p--sm purchase-plan-principle__table-item">
                  <div className="purchase_plan_generation_info_View-text_sm">
                    {translate("CM.contact_person")}
                  </div>
                  <OneLineText
                    className="fw-medium mt-1"
                    value={modelDetailSupplier?.contactPerson}
                  ></OneLineText>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="border_top">
          <Col span={8}>
            <div className="p--sm purchase-plan-principle__table-item">
              <div className="purchase_plan_generation_info_View-text_sm">
                {translate("PL.purchasing_plan_supplier_name")}
              </div>
              <OneLineText
                className="fw-medium mt-1"
                value={modelDetailSupplier?.supplier?.name}
              ></OneLineText>
            </div>
          </Col>
          <Col
            span={16}
            className="purchase_plan_generation_info_View-border-l"
          >
            <Row>
              <Col span={12}>
                <div className="p--sm purchase-plan-principle__table-item">
                  <div className="purchase_plan_generation_info_View-text_sm">
                    {translate("PL.purchasing_plan_tax_code_supplier_label")}
                  </div>
                  <OneLineText
                    className="fw-medium mt-1"
                    value={modelDetailSupplier?.supplier?.taxCode}
                  ></OneLineText>
                </div>
              </Col>
              <Col
                span={12}
                className="purchase_plan_generation_info_View-border-l"
              >
                <div className="p--sm purchase-plan-principle__table-item">
                  <div className="purchase_plan_generation_info_View-text_sm">
                    {translate("PL.purchasing_plan_supplier_address")}
                  </div>
                  <OneLineText
                    className="fw-medium mt-1"
                    value={modelDetailSupplier?.address}
                  ></OneLineText>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SupplierDetailsFormView;
