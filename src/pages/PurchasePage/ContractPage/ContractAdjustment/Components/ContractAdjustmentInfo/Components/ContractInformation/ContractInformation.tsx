import { Col, Row } from "antd";
import { Gutter } from "antd/lib/grid/row";
import { fieldType, NUMBER_MAX_13 } from "config/const";
import {
  NUMBER_TYPE_INPUT,
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import { isEqual, isNil } from "lodash";
import CommonFilter from "models/CommonFilter";
import { BaseModel } from "models/ProjectSettlement";
import { ContractAdjustmentContext } from "pages/PurchasePage/ContractPage/ContractAdjustment/ContractAdjustmentDetail/ContractAdjustmentDetailHook";
import { useCalculatorContract } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/hooks/useCaculatorContract";
import { combineText } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";
import { useContext, useMemo } from "react";
import styles from "./ContractInformation.module.scss";
import {
  Checkbox,
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { formatCurrency } from "core/helpers/number";
import { CONTRACT_ORDER } from "config/route-const";

const SPACING = {
  gutter: [16, 12] as [Gutter, Gutter],
  span_4: 4,
  span_8: 8,
  span_16: 16,
  span_24: 24,
};

export const ContractInformation = () => {
  const { model, handleChangeAllField } = useContext(ContractAdjustmentContext);

  const [translate] = useTranslation();

  const { contractValue } = useCalculatorContract({
    contractValueOrigin: model?.contractInfo?.contractValue,
    goodServices: model?.contractAppendixGoodsItems,
  });

  const data = useMemo(() => {
    if (isNil(model?.contract)) return null;
    const {
      contractNo,
      code,
      name,
      currency,
      rate,
      effectiveDate,
      endDate,
      contractType,
      isContractTermination,
      totalAmount,
      contractForm,
    } = model.contract;

    return {
      contractNo,
      name,
      contractValue,
      currency,
      rate,
      effectiveDate,
      endDate,
      contractType,
      code,
      isContractTermination,
      totalAmount,
      contractForm,
    };
  }, [model]);

  const type = useMemo(() => {
    let key = "CA.txt_contract";
    if (model?.contract?.contractRequestType === numberConstants.ONE) {
      key = "CA.txt_order";
    }

    return translate(key);
  }, [model?.contract?.contractRequestType, translate]);

  const handleChangeManagerOrganization = (id: number, select: BaseModel) => {
    handleChangeAllField({
      ...model,
      managerOrganizationBranch: select?.businessBranch?.name,
      managerOrganizationUnit: select?.businessUnit?.name,
      managerOrganization: {
        id: select?.id,
        name: select.name,
      },
      managerPerson: undefined,
    });
  };

  const handleChangeManagerPerson = (id: number, select: BaseModel) => {
    updateModel("managerPerson", {
      id,
      name: select?.name,
      email: select?.email,
    });
  };

  const updateModel = (fieldName: string, value: unknown) => {
    handleChangeAllField({
      ...model,
      [fieldName]: value,
    });
  };

  const makeFirstRow = () => {
    return (
      <>
        {/*code*/}
        <Col span={SPACING.span_8}>
          <FormItem>
            <div
              className="w-100"
              onClick={() => {
                window.open(
                  `${window.location.origin}${CONTRACT_ORDER}/${model?.contract?.contractId}`,
                  "_blank"
                );
              }}
            >
              <InputText
                readOnly
                isSmall={false}
                label={translate("contractAdjustment.txt_contract_code", {
                  type,
                })}
                value={data?.code}
                className={`${styles["contract-code"]} w-100`}
              />
            </div>
          </FormItem>
        </Col>
        {/* No */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              readOnly
              isSmall={false}
              label={translate("CA.txt_contract_number", { type })}
              value={data?.contractNo}
            />
          </FormItem>
        </Col>
        {/* Name */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              readOnly
              isSmall={false}
              label={translate("CA.txt_contract_name", { type })}
              value={data?.name}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  const makeSecondRow = () => {
    return (
      <>
        {/* Value including tax */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <InputText
              readOnly
              isSmall={false}
              label={translate("CA.txt_contract_value_including_tax", { type })}
              value={formatCurrency({
                value: model?.totalAmount,
                code: data?.currency,
              })}
            />
          </FormItem>
        </Col>
        {/* Currency type */}
        <Col span={SPACING.span_4}>
          <FormItem>
            <InputText
              readOnly
              isSmall={false}
              label={translate("CA.txt_currency_type")}
              value={data?.currency}
            />
          </FormItem>
        </Col>
        {/* Exchange rate */}
        <Col span={SPACING.span_4}>
          <FormItem>
            <InputNumber
              readOnly
              isSmall={false}
              label={translate("CA.txt_exchange_rate")}
              type={NUMBER_TYPE_INPUT}
              min={-NUMBER_MAX_13}
              max={NUMBER_MAX_13}
              value={data?.rate}
            />
          </FormItem>
        </Col>
        {/* Effective date */}
        <Col span={SPACING.span_4}>
          <FormItem>
            <InputText
              readOnly
              isSmall={false}
              label={translate("CA.txt_effective_date")}
              value={formatDate(
                data?.effectiveDate,
                STANDARD_DATE_FORMAT_SLASH
              )}
            />
          </FormItem>
        </Col>
        {/* End date */}
        <Col span={SPACING.span_4}>
          <FormItem
            validateObject={utilService.getValidateObj(model, "endDate")}
          >
            <DatePicker
              isSmall={false}
              readOnly
              label={translate("CA.txt_end_date")}
              format={STANDARD_DATE_FORMAT_SLASH}
              value={dayjs(data?.endDate)}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  const makeThirdRow = () => {
    return (
      <>
        {/* Form */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <Select
              readOnly
              isSmall={false}
              label={translate("CA.txt_contract_form", { type })}
              classFilter={CommonFilter}
              value={data?.contractForm}
              render={(item) => item?.name}
              placeHolder={translate("CA.txt_contract_form", { type })}
            />
          </FormItem>
        </Col>
        {/* Type */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <Select
              readOnly
              isSmall={false}
              label={translate("CA.txt_contract_type", { type })}
              classFilter={CommonFilter}
              value={data?.contractType}
              render={(item) => item?.name}
              placeHolder={translate("CA.txt_contract_type", { type })}
            />
          </FormItem>
        </Col>
        {/* Allowed payment exceed percentage  */}
        <Col span={SPACING.span_4}>
          <FormItem>
            <InputNumber
              readOnly
              isSmall={false}
              label={translate("CA.txt_allowed_payment_exceed_percentage")}
              value={data?.contractType?.maxOverpaymentPercentage}
              numberType={fieldType.DECIMAL}
              suffix="%"
            />
          </FormItem>
        </Col>
        {/* Allowed exceed value */}
        <Col span={SPACING.span_4}>
          <FormItem>
            <InputNumber
              readOnly
              isSmall={false}
              label={translate("CA.txt_allowed_exceed_value")}
              numberType={
                !isEqual(model?.contract?.currency, VND_CURRENCY_UNIT)
                  ? fieldType.DECIMAL
                  : fieldType.LONG
              }
              value={data?.contractType?.maxOverpaymentAmount}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  const makeFourthRow = () => {
    return (
      <>
        {/* Management unit */}
        <Col span={SPACING.span_8}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "managerOrganizationId"
            )}
          >
            <Select
              isRequired
              appendToBody
              isSearch
              isSmall={false}
              isEnumerable={false}
              classFilter={undefined}
              valueFilter={{
                name: "",
              }}
              searchType=""
              getList={contractAnnexRepository.getIncludeSegment}
              label={translate("CA.txt_contract_management_unit", { type })}
              render={(item) => item?.name}
              value={model?.managerOrganization}
              onChange={handleChangeManagerOrganization}
            />
          </FormItem>
        </Col>
        {/* Manager */}
        <Col span={SPACING.span_8}>
          <FormItem>
            <Select
              isRequired
              appendToBody
              isSearch
              isSmall={false}
              isEnumerable={false}
              classFilter={CommonFilter}
              label={translate("CA.txt_contract_manager", { type })}
              placeHolder={translate("CA.placeholder_contract_manager", {
                type,
              })}
              getList={(value) => {
                return contractAnnexRepository.getManagerPersonList({
                  name: value?.name?.contain,
                  organizationId: model?.managerOrganization?.id,
                });
              }}
              render={(item) => combineText(item?.email, item?.name)}
              value={model?.managerPerson}
              onChange={handleChangeManagerPerson}
            />
          </FormItem>
        </Col>
        {/* Department */}
        <Col span={SPACING.span_4}>
          <FormItem>
            <InputText
              readOnly
              isSmall={false}
              label={translate("CA.txt_contract_department", { type })}
              value={model?.managerOrganizationUnit || "---"}
            />
          </FormItem>
        </Col>
        {/* Branch */}
        <Col span={SPACING.span_4}>
          <FormItem>
            <InputText
              readOnly
              isSmall={false}
              label={translate("CA.txt_branch_contract_management", { type })}
              value={model?.managerOrganizationBranch || "---"}
            />
          </FormItem>
        </Col>
      </>
    );
  };

  return (
    <Row gutter={SPACING.gutter} className={styles["contract-information"]}>
      {/* Check box */}
      <Col span={SPACING.span_24}>
        <Checkbox
          disabled={true}
          checked={data?.isContractTermination}
          label={translate("CA.txt_contract_type_must_be_liquidated", { type })}
        />
      </Col>
      {/* Include: No, Name */}
      {makeFirstRow()}
      {/* Include: Value including tax, currency type, exchange rate, effective/end date  */}
      {makeSecondRow()}
      {/* Include: Form, contract type, allowed payment exceed percentage/value */}
      {makeThirdRow()}
      {/* Include: Management unit, manager, department, branch */}
      {makeFourthRow()}
    </Row>
  );
};
