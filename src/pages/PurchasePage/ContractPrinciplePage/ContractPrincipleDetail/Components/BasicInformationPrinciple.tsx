import { Col, Row } from "antd";
import {
  MAX_LENGTH_255,
  MAX_LENGTH_500,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { getDateToVietnam } from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import CommonFilter from "models/CommonFilter";
import { ContractDetailModel } from "models/Contract";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { useContext } from "react";
import { Model } from "react-3layer-common";
import {
  DatePicker,
  FormItem,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

const BasicInformationPrinciple = () => {
  const [translate] = useTranslation();

  const {
    model,
    canSetContractTerms,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeSingleField,
    getBusinessUnitByOrganization,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  return (
    <div className="contract_basic_info_wrapper">
      <CollapseCard title={translate("CT.create_contract.general_information")}>
        <div className="body">
          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "contractNo")}
              >
                <InputText
                  label={translate("CT.contract_number_principle")}
                  placeHolder={translate("CT.input_contract_number_principle")}
                  isSmall={false}
                  isRequired
                  onChange={handleChangeSingleField({
                    fieldName: "contractNo",
                  })}
                  value={model?.contractNo}
                  maxLength={MAX_LENGTH_255}
                  translate={translate}
                />
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "name")}
              >
                <InputText
                  label={translate("CT.contract_name_principle")}
                  placeHolder={translate("CT.input_contract_name_principle")}
                  isRequired
                  isSmall={false}
                  onChange={handleChangeSingleField({
                    fieldName: "name",
                  })}
                  value={model?.name}
                  maxLength={MAX_LENGTH_500}
                  translate={translate}
                />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "contractTypeId"
                )}
              >
                <Select
                  value={model?.contractType}
                  label={translate("CT.principle_contract_type")}
                  placeHolder={translate("CT.select_principle_contract_type")}
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
                  "effectiveDate"
                )}
              >
                <DatePicker
                  label={translate("CT.txt_valid_date")}
                  placeholder={STANDARD_DATE_FORMAT_SLASH}
                  isRequired
                  isSmall={false}
                  value={
                    model?.effectiveDate
                      ? getDateToVietnam(model.effectiveDate)
                      : undefined
                  }
                  onChange={handleChangeDateField({
                    fieldName: "effectiveDate",
                  })}
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
                  minDate={dayjs(model?.effectiveDate)}
                />
              </FormItem>
            </Col>
            <Col span={8}>
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
                  label={translate("CT.label_management_units")}
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
                    contractRepository.getListOrganization({
                      ...filter,
                      pageSize: 30,
                    })
                  }
                  isEnumerable={false}
                  onChange={(id, value) => {
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
                  label={translate("CT.txt_manager")}
                  placeHolder={translate("CT.placeholder_manager")}
                  isRequired
                  isSmall={false}
                  isSearch
                  classFilter={CommonFilter}
                  searchProperty="name"
                  searchType=""
                  valueFilter={{
                    name: "",
                    organizationId: model?.organizationId,
                    isActive: true,
                  }}
                  getList={contractRepository.listCreateUserModal}
                  render={(item) =>
                    item ? `${item.email} - ${item.fullName || item.name}` : ""
                  }
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
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "applicableOrganizationId"
                )}
              >
                <Select
                  value={model?.applicableOrganization}
                  label={translate("CT.applicable_unit")}
                  placeHolder={translate("CT.select_applicable_unit")}
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
                    contractRepository.getListOrganization({
                      ...filter,
                      pageSize: 30,
                    })
                  }
                  isEnumerable={false}
                  onChange={handleChangeSelectField({
                    fieldName: "applicableOrganization",
                    errorName: "applicableOrganizationId",
                  })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "applicableBranchId"
                )}
              >
                <Select
                  value={model?.applicableBranch}
                  label={translate("CT.applicable_branch")}
                  placeHolder={translate("CT.select_applicable_branch")}
                  isRequired
                  isSmall={false}
                  isSearch
                  classFilter={CommonFilter}
                  searchType=""
                  valueFilter={{
                    name: "",
                  }}
                  render={(item) =>
                    item ? `${item?.code} - ${item?.name}` : ""
                  }
                  getList={contractRepository.getListApplicableBranch}
                  isEnumerable={false}
                  onChange={handleChangeSelectField({
                    fieldName: "applicableBranch",
                    errorName: "applicableBranchId",
                  })}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "applicableUnitId"
                )}
              >
                <Select
                  value={model?.applicableUnit}
                  label={translate("CT.applicable_division")}
                  placeHolder={translate("CT.select_applicable_division")}
                  isRequired
                  isSmall={false}
                  isSearch
                  classFilter={CommonFilter}
                  searchType=""
                  valueFilter={{
                    name: "",
                  }}
                  render={(item) =>
                    item ? `${item?.code} - ${item?.name}` : ""
                  }
                  getList={contractRepository.getListApplicableUnit}
                  isEnumerable={false}
                  onChange={handleChangeSelectField({
                    fieldName: "applicableUnit",
                    errorName: "applicableUnitId",
                  })}
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
                  value={
                    !isEmpty(model.user)
                      ? `${model.user?.email} - ${model.user?.name}`
                      : "---"
                  }
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <InputText
                label={translate("CT.label_create_unit")}
                placeHolder={translate("CT.label_create_unit")}
                isSmall={false}
                readOnly
                value={model?.createdOrganization?.name}
              />
            </Col>
            <Col span={8}>
              <InputText
                label={translate("PP.position")}
                placeHolder={translate("PP.position")}
                isSmall={false}
                readOnly
                value={model?.position?.name}
              />
            </Col>
          </Row>
        </div>
      </CollapseCard>
    </div>
  );
};

export default BasicInformationPrinciple;
