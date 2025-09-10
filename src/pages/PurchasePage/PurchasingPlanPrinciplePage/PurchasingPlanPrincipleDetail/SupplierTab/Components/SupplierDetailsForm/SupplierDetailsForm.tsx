import { Col, Row } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import { useContext, useEffect, useRef } from "react";
import {
  FormItem,
  InputNumber,
  InputText,
} from "react-components-design-system";
import { PurchasingPlanPrincipleDetailHookContext } from "../../../PurchasingPlanPrincipleDetailHook";
import { NUMBER_MAX_13 } from "config/const";
import { VND_CURRENCY } from "models/Payment";
import { ConfigField } from "core/services/service-types";
import { CONTRACT_PRINCIPLE_VIEW_ROUTE } from "config/route-const";
import { MAX_LENGTH_255, EMAIL_REGEX } from "core/config/consts";

import styles from "./SupplierDetailsForm.module.scss";

interface SupplierDetailsFormProps {
  modelDetailSupplier?: SupplierModel;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
}

const SupplierDetailsForm = ({
  modelDetailSupplier,
  handleChangeSingleField,
}: SupplierDetailsFormProps) => {
  const { translate } = useContext<PurchasingPlanModel>(
    PurchasingPlanPrincipleDetailHookContext
  );
  const principleContractCodeRef = useRef(null);

  const currencyCode = modelDetailSupplier?.currency || VND_CURRENCY;
  const isShowExchangeRateField = currencyCode !== VND_CURRENCY;

  useEffect(() => {
    const navigateToPrincipleContractView = () => {
      if (!modelDetailSupplier?.contractId) return;
      window.open(
        `${CONTRACT_PRINCIPLE_VIEW_ROUTE}/${modelDetailSupplier?.contractId}`,
        "_blank"
      );
    };
    const principleContractCodeEl = principleContractCodeRef?.current;

    if (principleContractCodeEl) {
      principleContractCodeEl.addEventListener(
        "click",
        navigateToPrincipleContractView
      );

      return () =>
        principleContractCodeEl.removeEventListener(
          "click",
          navigateToPrincipleContractView
        );
    }
  }, [modelDetailSupplier?.contractId]);

  return (
    <div>
      <Row gutter={12}>
        <Col lg={12}>
          <InputText
            readOnly
            label={translate("PL.principle_contract_code")}
            value={modelDetailSupplier?.code}
            isSmall={false}
            className={styles["primary-text"]}
            ref={principleContractCodeRef}
          />
        </Col>
        <Col lg={12}>
          <InputText
            readOnly
            label={translate("PL.principle_contract_name")}
            value={modelDetailSupplier?.contractName}
            isSmall={false}
          />
        </Col>
      </Row>
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={12}>
            <InputText
              readOnly
              label={translate("PL.drawer_type_currency_table")}
              value={modelDetailSupplier?.currency}
              isSmall={false}
            />
          </Col>
          {isShowExchangeRateField && (
            <Col lg={12}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  modelDetailSupplier,
                  "exchangeRate"
                )}
              >
                <InputNumber
                  isSmall={false}
                  isRequired
                  translate={translate}
                  label={translate("PL.exchange_rate_label")}
                  placeHolder={translate("PL.enter_exchange_rate")}
                  numberType={
                    currencyCode !== VND_CURRENCY ? "DECIMAL" : "NUMBER"
                  }
                  max={
                    currencyCode !== VND_CURRENCY ? NUMBER_MAX_13 : undefined
                  }
                  min={0}
                  value={modelDetailSupplier?.exchangeRate}
                  onChange={handleChangeSingleField({
                    fieldName: "exchangeRate",
                  })}
                />
              </FormItem>
            </Col>
          )}
        </Row>
      </div>
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={12}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_tax_code_supplier_label")}
              value={modelDetailSupplier?.supplier?.taxCode}
              isSmall={false}
            />
          </Col>
          <Col lg={12}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_supplier_name")}
              value={modelDetailSupplier?.supplier?.name}
              isSmall={false}
            />
          </Col>
        </Row>
      </div>
      <div className="p-t--sm">
        <Row gutter={12}>
          <Col lg={12}>
            <FormItem
              validateObject={utilService.getValidateObj(
                modelDetailSupplier,
                "contactPerson"
              )}
            >
              <InputText
                isRequired
                maxLength={MAX_LENGTH_255}
                regexInput={EMAIL_REGEX}
                translate={translate}
                label={translate("CM.contact_person")}
                placeHolder={translate("PL.purchasing_plan_email_placeholder")}
                isSmall={false}
                allowClear={true}
                value={modelDetailSupplier?.contactPerson}
                onChange={handleChangeSingleField({
                  fieldName: "contactPerson",
                })}
              />
            </FormItem>
          </Col>
          <Col lg={12}>
            <InputText
              readOnly
              label={translate("PL.purchasing_plan_supplier_address")}
              value={modelDetailSupplier?.address}
              isSmall={false}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SupplierDetailsForm;
