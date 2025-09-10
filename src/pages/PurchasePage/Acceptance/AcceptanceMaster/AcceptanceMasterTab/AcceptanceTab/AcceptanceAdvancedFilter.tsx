import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { NUMBER_MAX_13 } from "config/const";
import {
  datePickerPopupClassName,
  NUMBER_TYPE_INPUT,
} from "core/config/consts";
import { trimText } from "core/helpers/text";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { isNumber, values } from "lodash";
import { AcceptanceFilter } from "models/Acceptance";
import CommonFilter from "models/CommonFilter";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { listAcceptanceStatus } from "pages/PurchasePage/constants";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import {
  CheckboxGroup,
  DateRangePicker,
  FormItem,
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { map } from "rxjs";
import { AcceptanceMaster, AcceptanceMasterContext } from "../context";
import styles from "./AcceptanceAdvancedFilter.module.scss";
import { contractTypeRepository } from "core/repositories/ContractRepository";
import { utilService } from "core/services/common-services/util-service";

const SIZE_COL = 8;
const SIZE_COL_16 = 16;
const SIZE_FILTER_LEFT = 3;
const SIZE_FILTER_RIGHT = 21;

interface AcceptanceAdvancedFilterProps {
  setVisible?: Dispatch<SetStateAction<boolean>>;
}

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const DEFAULT_ERROR: { errors: { contractValue: null | string } } = {
  errors: {
    contractValue: null,
  },
};

export const AcceptanceAdvancedFilter = ({
  setVisible,
}: AcceptanceAdvancedFilterProps) => {
  const [translate] = useTranslation();

  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<AcceptanceMaster>(AcceptanceMasterContext);

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: AcceptanceFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeCheckboxFilter,
    handleChangeInputFilter,
    handleChangeMultipleSelectFilter,
    handleChangeDateFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  const [errors, setErrors] = useState(DEFAULT_ERROR);

  const hasErrorContractValue = (contractFrom: number, contractTo: number) => {
    let error = DEFAULT_ERROR;
    const hasError =
      isNumber(Number(contractFrom)) &&
      isNumber(Number(contractTo)) &&
      contractFrom > contractTo;

    if (hasError) {
      error = {
        errors: {
          contractValue: translate("CM.message_validate_from_to_number"),
        },
      };
    }
    setErrors(error);

    return hasError;
  };

  const handleFilter = () => {
    const contractFrom = modelFilter?.contractFrom?.equal;
    const contractTo = modelFilter?.contractTo?.equal;
    const hasError = hasErrorContractValue(contractFrom, contractTo);
    if (hasError) {
      return;
    }

    handleApplyFilter();
  };

  return (
    <div className="AcceptanceFilter">
      <FilterPanel
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        modelFilter={modelFilter}
        handleApplyFilter={handleFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        handleClickOutside={handleClickOutside}
        className={styles["acceptance-filter-panel"]}
        exceptNodeIds={values(datePickerPopupClassName)}
      >
        <FilterPanel.Left lg={SIZE_FILTER_LEFT}>
          <div className="d-flex flex-column gap-y--md">
            <CheckboxGroup
              label={translate("CM.txt_status")}
              dataOptions={listAcceptanceStatus()}
              values={modelFilter?.statusesId || []}
              onChange={handleChangeCheckboxFilter({
                fieldName: "statuses",
              })}
            />
          </div>
        </FilterPanel.Left>

        <FilterPanel.Right lg={SIZE_FILTER_RIGHT}>
          <Row gutter={SIZE_COL_16}>
            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("AC.txt_table_code")}
                placeHolder={translate("AC.placeholder_code_acceptance")}
                value={modelFilter?.code}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "code",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("AC.txt_acceptance_description")}
                placeHolder={translate("AC.placeholder_description")}
                value={modelFilter?.description}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "description",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("AC.txt_table_contract_code")}
                placeHolder={translate("AC.placeholder_contract_code")}
                value={modelFilter?.contractCode}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "contractCode",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("AC.txt_contract_number")}
                placeHolder={translate("AC.placeholder_contract_no")}
                value={modelFilter?.contractNo}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "contractNo",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("AC.txt_contract_name")}
                placeHolder={translate("AC.placeholder_contract_name")}
                value={modelFilter?.contractName}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "contractName",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.contractTypeValue || []}
                label={translate("AC.txt_contract_type")}
                placeHolder={translate("AC.placeholder_contract_type")}
                render={(item) => `${item?.name}`}
                getList={contractTypeRepository.getListContractType}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "contractType",
                })}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.suppliersValue || []}
                label={translate("AC.txt_supplier")}
                placeHolder={translate("AC.placeholder_supplier")}
                render={(item) => `${item?.taxCode} - ${item?.name}`}
                getList={paymentRepository.listSupplier}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "suppliers",
                })}
              />
            </Col>

            <Col lg={SIZE_COL_16} className="m-b--md">
              <FormItem
                validateObject={utilService.getValidateObj(
                  errors,
                  "contractValue"
                )}
              >
                <div className="d-flex align-items-end flex-1 h-100 flex-grow">
                  <InputNumber
                    value={modelFilter?.contractFrom?.equal}
                    label={translate("AC.txt_contract_value")}
                    placeHolder={translate("CM.placeholder_from")}
                    isSmall={false}
                    onChange={(value) => {
                      hasErrorContractValue(
                        value,
                        modelFilter?.contractTo?.equal
                      );
                      handleChangeInputFilter({
                        fieldName: "contractFrom",
                        fieldType: "equal",
                        classFilter: NumberFilter,
                      })(value);
                    }}
                    max={NUMBER_MAX_13}
                    min={-NUMBER_MAX_13}
                    numberType={NUMBER_TYPE_INPUT}
                  />
                  <div className={styles["acceptance-filter__dash"]}> -</div>
                  <InputNumber
                    value={modelFilter?.contractTo?.equal}
                    label={undefined}
                    placeHolder={translate("CM.placeholder_to")}
                    isSmall={false}
                    onChange={(value) => {
                      hasErrorContractValue(
                        modelFilter?.contractFrom?.equal,
                        value
                      );
                      handleChangeInputFilter({
                        fieldName: "contractTo",
                        fieldType: "equal",
                        classFilter: NumberFilter,
                      })(value);
                    }}
                    max={NUMBER_MAX_13}
                    min={-NUMBER_MAX_13}
                    numberType={NUMBER_TYPE_INPUT}
                  />
                </div>
              </FormItem>
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <DateRangePicker
                label={translate("AC.txt_commissioning_date")}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
                value={[
                  modelFilter?.applyDate?.greaterEqual,
                  modelFilter?.applyDate?.lessEqual,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "applyDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                popupClassName={datePickerPopupClassName.first}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                isSmall={false}
                values={modelFilter?.goodsServicesValue || []}
                label={translate("AC.txt_product")}
                placeHolder={translate("AC.placeholder_product")}
                getList={(filter: ModelFilter) => {
                  return proposalRepository
                    .getGoodServicesList({
                      ...filter,
                      search: filter?.name?.contain,
                    })
                    .pipe(
                      map((response) => {
                        if (Array.isArray(response?.data?.items)) {
                          return response?.data?.items;
                        }

                        return [];
                      })
                    );
                }}
                classFilter={DemoFilter}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "goodsServices",
                })}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <DateRangePicker
                label={translate("AC.txt_created_date")}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
                value={[
                  modelFilter?.createdDate?.greaterEqual,
                  modelFilter?.createdDate?.lessEqual,
                ]}
                onChange={handleChangeDateFilter({
                  fieldName: "createdDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                popupClassName={datePickerPopupClassName.first}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.createdUsersValue || []}
                label={translate("AC.txt_creator")}
                placeHolder={translate("AC.placeholder_txt_creator")}
                render={(item) => `${item?.email} - ${item?.name}`}
                getList={contractRepository.getListUser}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "createdUsers",
                })}
              />
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.organizationsValue || []}
                label={translate("AC.txt_creator_unit")}
                placeHolder={translate("AC.placeholder_txt_creator_unit")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={contractRepository.getListOrganization}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "organizations",
                })}
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};
