import { Col, Row } from "antd";
import { fieldType, NUMBER_MAX_13 } from "config/const";
import {
  NOT_TAB_ENTER_REGEX,
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { detectIntegerCurrency } from "core/helpers/currency";
import { getDateToVietnam } from "core/helpers/date-time";
import { calculateSumArray, formatNumber } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import CommonFilter from "models/CommonFilter";
import { ContractDetailModel } from "models/Contract";
import { VND_CURRENCY } from "models/Payment";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import BasicInformationPrinciple from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleDetail/Components/BasicInformationPrinciple";
import { formatNumberToCurrency } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import { useContext, useMemo, useRef } from "react";
import { Model } from "react-3layer-common";
import {
  Checkbox,
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import "./BasicInformation.scss";
import { contractAnnexRepository } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexRepository";

const ContractDetailBasicInformation = () => {
  const {
    model,
    dispatchModel,
    canSetContractTerms,
    translate,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeSingleField,
    handleChangeBoolField,
    handleChangeAllField,
    getBusinessUnitByOrganization,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);
  const refDisableTranslate = useRef([]);

  const isShowExChangeRate = useMemo(() => {
    return model?.currency && model.currency !== VND_CURRENCY;
  }, [model?.currency]);

  const contractTotalValue = useMemo(() => {
    if (model && model.contractGoodsItems?.length <= 0) return `0`;

    return formatNumberToCurrency(
      calculateSumArray(
        model?.contractGoodsItems?.map((item) => item.totalAmount)
      ),
      detectIntegerCurrency(model?.currency) ? 0 : 4
    );
  }, [model]);

  const handleUpdateStringContractSupplier = (
    value: string | Model,
    property = "contractNo"
  ) => {
    if (!refDisableTranslate.current.includes(property)) {
      refDisableTranslate.current = [...refDisableTranslate.current, property];
    }
    dispatchModel({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        [property]: value,
        errors: {
          ...model?.errors,
          [property]: null,
        },
      },
    });
  };

  const getTranslate = (value: string) => {
    return !refDisableTranslate?.current?.includes(value)
      ? undefined
      : translate;
  };

  if (model?.isPrinciple) return <BasicInformationPrinciple />;

  return (
    <div className="contract_basic_info_wrapper">
      <CollapseCard title={translate("CT.create_contract.general_information")}>
        <div className="body">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "isContractTermination"
            )}
          >
            <Checkbox
              label={translate(
                "CT.create_contract.contract_must_be_terminated"
              )}
              checked={model?.isContractTermination}
              onChange={handleChangeBoolField({
                fieldName: "isContractTermination",
              })}
            />
          </FormItem>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "contractNo")}
              >
                <InputText
                  label={translate("CT.create_contract.title.contract_number")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.contract_number"
                  )}
                  isSmall={false}
                  isRequired
                  onChange={(val) =>
                    handleUpdateStringContractSupplier(val, "contractNo")
                  }
                  value={model?.contractNo}
                  translate={getTranslate("contractNo")}
                  maxLength={255}
                  regexInput={NOT_TAB_ENTER_REGEX}
                />
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "name")}
              >
                <InputText
                  label={translate("CT.create_contract.title.contract_name")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.contract_name"
                  )}
                  isRequired
                  isSmall={false}
                  onChange={(val) =>
                    handleUpdateStringContractSupplier(val, "name")
                  }
                  maxLength={500}
                  value={model?.name}
                  translate={getTranslate("name")}
                  regexInput={NOT_TAB_ENTER_REGEX}
                />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "totalValue")}
              >
                <InputText
                  label={translate(
                    "CT.create_contract.title.contract_total_value"
                  )}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.number"
                  )}
                  disabled
                  isSmall={false}
                  onChange={handleChangeSingleField({
                    fieldName: "totalValue",
                  })}
                  value={contractTotalValue}
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "currency")}
              >
                <InputText
                  label={translate("CT.create_contract.title.currency_type")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.string"
                  )}
                  isSmall={false}
                  onChange={handleChangeSingleField({
                    fieldName: "currency",
                  })}
                  readOnly
                  value={model?.currency}
                  allowClear={false}
                />
              </FormItem>
            </Col>
            <Col span={4}>
              {isShowExChangeRate ? (
                <FormItem
                  validateObject={utilService.getValidateObj(model, "rate")}
                >
                  <InputNumber
                    label={translate("CT.create_contract.title.exchange_rate")}
                    placeHolder={translate(
                      "CT.create_contract.placeholder.string"
                    )}
                    isSmall={false}
                    numberType={fieldType.DECIMAL}
                    isRequired
                    onChange={handleChangeSingleField({
                      fieldName: "rate",
                    })}
                    translate={getTranslate("rate")}
                    max={NUMBER_MAX_13}
                    value={model?.rate}
                  />
                </FormItem>
              ) : (
                ""
              )}
            </Col>
            <Col span={4}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "effectiveDate"
                )}
              >
                <DatePicker
                  label={translate("CT.txt_valid_date")}
                  placeholder={STANDARD_DATE_FORMAT_SLASH}
                  value={
                    model?.effectiveDate
                      ? getDateToVietnam(model.effectiveDate)
                      : undefined
                  }
                  onChange={handleChangeDateField({
                    fieldName: "effectiveDate",
                  })}
                  translate="yes"
                  isSmall={false}
                  isRequired
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "endDate")}
              >
                <DatePicker
                  label={translate("CT.txt_end_date")}
                  placeholder={STANDARD_DATE_FORMAT_SLASH}
                  isSmall={false}
                  isRequired
                  value={
                    model?.endDate ? getDateToVietnam(model.endDate) : undefined
                  }
                  onChange={handleChangeDateField({
                    fieldName: "endDate",
                  })}
                  translate={"yes"}
                  minDate={dayjs(model?.effectiveDate)}
                />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractFormId"
                )}
              >
                <Select
                  value={model?.contractForm}
                  label={translate("CT.create_contract.title.contract_form")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.contract_form"
                  )}
                  isRequired
                  isSmall={false}
                  isSearch
                  classFilter={CommonFilter}
                  searchProperty="name"
                  searchType=""
                  valueFilter={{
                    name: "",
                  }}
                  getList={(filter) =>
                    contractRepository.listContractMethodShowPercentage({
                      ...filter,
                      status: numberConstants.ONE,
                    })
                  }
                  render={(item) => {
                    return item ? `${item?.name}` : "";
                  }}
                  appendToBody
                  isEnumerable={false}
                  onChange={handleChangeSelectField({
                    fieldName: "contractForm",
                    errorName: "contractFormId",
                  })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractTypeId"
                )}
              >
                <Select
                  value={model?.contractType}
                  label={translate("CT.create_contract.title.contract_type")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.contract_type"
                  )}
                  isRequired
                  isSmall={false}
                  isSearch
                  classFilter={CommonFilter}
                  searchProperty="name"
                  searchType=""
                  valueFilter={{
                    name: "",
                  }}
                  getList={contractRepository.listContractTypeShowPercentage}
                  render={(item) => {
                    return item ? `${item?.name}` : "";
                  }}
                  appendToBody
                  isEnumerable={false}
                  onChange={(id: number, value: Model) => {
                    canSetContractTerms.current = true;
                    handleChangeSelectField({
                      fieldName: "contractType",
                      errorName: "contractTypeId",
                    })(id, value);
                  }}
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "percentage_overpayment"
                )}
              >
                <InputText
                  label={translate(
                    "CT.create_contract.title.percentage_overpayment"
                  )}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.number"
                  )}
                  isSmall={false}
                  disabled
                  onChange={handleChangeSingleField({
                    fieldName: "percentage_overpayment",
                  })}
                  suffix="%"
                  value={model?.contractType?.maxOverpaymentPercentage}
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "value_overpayment"
                )}
              >
                <InputText
                  label={translate(
                    "CT.create_contract.title.value_overpayment"
                  )}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.number"
                  )}
                  disabled
                  isSmall={false}
                  onChange={handleChangeSingleField({
                    fieldName: "value_overpayment",
                  })}
                  value={formatNumber(
                    model?.contractType?.maxOverpaymentAmount
                  )}
                />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "organizationId"
                )}
              >
                <Select
                  value={model?.organization}
                  label={translate("CT.create_contract.title.management_units")}
                  placeHolder={translate("CT.placeholder_management_units")}
                  isRequired
                  isSmall={false}
                  isSearch
                  classFilter={CommonFilter}
                  valueFilter={{
                    name: "",
                  }}
                  searchType=""
                  searchProperty="name"
                  getList={(filter) =>
                    contractAnnexRepository.getIncludeSegment({
                      ...filter,
                      isActive: true,
                    })
                  }
                  render={(item) => {
                    return item ? `${item?.name}` : "";
                  }}
                  appendToBody
                  isEnumerable={false}
                  onChange={(id, value) => {
                    handleChangeAllField({
                      ...model,
                      managerObj: null,
                      orgBusinessDepartment: value?.businessDepartment,
                      orgBusinessBranch: value?.businessBranch,
                    });
                    handleChangeSelectField({
                      fieldName: "organization",
                      errorName: "organizationId",
                    })(id, value);
                    getBusinessUnitByOrganization(`${id}`);
                  }}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "manager")}
              >
                <Select
                  value={model?.managerObj}
                  label={translate("CT.create_contract.title.contract_manager")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.contract_manager"
                  )}
                  isRequired
                  isSmall={false}
                  isSearch
                  classFilter={CommonFilter}
                  searchProperty="search"
                  searchType=""
                  valueFilter={{
                    organizationId: model?.organization?.id,
                    isActive: true,
                    isSupplier: false,
                  }}
                  getList={contractRepository.listUser}
                  render={(item) =>
                    item ? `${item.email} - ${item.fullName || item.name}` : ""
                  }
                  appendToBody
                  isEnumerable={false}
                  onChange={handleChangeSelectField({
                    fieldName: "managerObj",
                    errorName: "manager",
                  })}
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "orgBusinessDepartment"
                )}
              >
                <InputText
                  label={translate("CT.create_contract.title.management_block")}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.string"
                  )}
                  isSmall={false}
                  readOnly
                  onChange={handleChangeSingleField({
                    fieldName: "orgBusinessDepartment",
                  })}
                  value={model?.orgBusinessDepartment?.businessUnitName}
                />
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "orgBusinessBranch"
                )}
              >
                <InputText
                  label={translate(
                    "CT.create_contract.title.management_branch"
                  )}
                  placeHolder={translate(
                    "CT.create_contract.placeholder.string"
                  )}
                  isSmall={false}
                  readOnly
                  onChange={handleChangeSingleField({
                    fieldName: "orgBusinessBranch",
                  })}
                  value={model?.orgBusinessBranch?.name}
                />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "email")}
              >
                <InputText
                  label={translate("CT.label_create_user")}
                  placeHolder={translate("CT.label_create_user")}
                  isSmall={false}
                  readOnly
                  onChange={handleChangeSingleField({
                    fieldName: "email",
                  })}
                  value={
                    !isEmpty(model.user)
                      ? `${model.user?.email} - ${model.user?.name}`
                      : "---"
                  }
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "createdOrganization"
                )}
              >
                <InputText
                  label={translate("CT.label_create_unit")}
                  placeHolder={translate("CT.label_create_unit")}
                  isSmall={false}
                  readOnly
                  onChange={handleChangeSingleField({
                    fieldName: "createdOrganization",
                  })}
                  value={model?.createdOrganization?.name}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "positionId")}
              >
                <InputText
                  label={translate("PP.position")}
                  placeHolder={translate("PP.position")}
                  isSmall={false}
                  readOnly
                  onChange={handleChangeSingleField({
                    fieldName: "position",
                    errorName: "positionId",
                  })}
                  value={model?.position?.name}
                />
              </FormItem>
            </Col>
          </Row>
        </div>
      </CollapseCard>
    </div>
  );
};

export default ContractDetailBasicInformation;
