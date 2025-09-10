import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { listProjectSettlementStatus } from "pages/PurchasePage/constants";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
} from "react";
import {
  CheckboxGroup,
  DateRangePicker,
  FormItem,
  InputNumber,
  InputText,
  MultipleSelect,
  ValidateStatus,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./ProjectSettlementAdvancedFilter.module.scss";

const SIZE_ROW = 16;
const SIZE_COL = 8;
const SIZE_COL_16 = 16;
const SIZE_FILTER_LEFT = 3;
const SIZE_FILTER_RIGHT = 21;

import { NUMBER_MAX_13 } from "config/const";
import {
  datePickerPopupClassName,
  NUMBER_TYPE_INPUT,
} from "core/config/consts";
import { trimText } from "core/helpers/text";
import { organizationRepository } from "core/repositories/OrganizationRepository";
import { gt, isEmpty, values } from "lodash";
import CommonFilter from "models/CommonFilter";
import { ProjectSettlementModel } from "models/ProjectSettlement";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import {
  ProjectSettlementMasterContext,
  ProjectSettlementMasterType,
} from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/context";
import { NumberFilter } from "react-3layer-advance-filters";
import appMessageService from "core/services/common-services/app-message-service";

interface ProjectSettlementAdvancedFilterProps {
  setVisible?: Dispatch<SetStateAction<boolean>>;
}

export const ProjectSettlementAdvancedFilter = ({
  setVisible,
}: ProjectSettlementAdvancedFilterProps) => {
  const [translate] = useTranslation();

  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<ProjectSettlementMasterType>(ProjectSettlementMasterContext);
  const { notifyToast } = appMessageService.useCRUDMessage();
  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ProjectSettlementModel,
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

  const [errorInputRange, setErrorInputRange] = React.useState<string>(null);

  const handleSaveModelFilter = useCallback(() => {
    if (
      gt(
        modelFilter?.projectSettlementFrom?.equal,
        modelFilter?.projectSettlementTo?.equal
      )
    ) {
      setErrorInputRange(translate("PL.warning_total_range_filter_message"));
      return;
    }

    handleApplyFilter();
    setErrorInputRange(null);
  }, [
    modelFilter?.projectSettlementFrom?.equal,
    modelFilter?.projectSettlementTo?.equal,
    handleApplyFilter,
    translate,
  ]);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <div className="ProjectSettlementFilter">
      <FilterPanel
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        modelFilter={modelFilter}
        handleApplyFilter={handleSaveModelFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        handleClickOutside={handleClickOutside}
        className={styles["project-settlement-filter-panel"]}
        exceptNodeIds={values(datePickerPopupClassName)}
      >
        <FilterPanel.Left lg={SIZE_FILTER_LEFT}>
          <div className="d-flex flex-column gap-y--md">
            <CheckboxGroup
              label={translate("CM.txt_status")}
              dataOptions={listProjectSettlementStatus()}
              values={modelFilter?.statusesId || []}
              onChange={handleChangeCheckboxFilter({
                fieldName: "statuses",
              })}
            />
          </div>
        </FilterPanel.Left>
        <FilterPanel.Right lg={SIZE_FILTER_RIGHT}>
          <Row gutter={SIZE_ROW}>
            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("PS.txt_code_settlement")}
                placeHolder={translate("PS.placeholder_code_settlement")}
                value={modelFilter?.code}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "code",
                  })(trimmedText);
                }}
              />
            </Col>
            <Col lg={SIZE_COL_16} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("PS.txt_description_settlement")}
                placeHolder={translate("PS.placeholder_description_settlement")}
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
                label={translate("PS.txt_table_code_policy")}
                placeHolder={translate("PS.placeholder_code_policy")}
                value={modelFilter?.purchaseProposalCode}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "purchaseProposalCode",
                  })(trimmedText);
                }}
              />
            </Col>
            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("PS.txt_table_name_policy")}
                placeHolder={translate("PS.placeholder_name_policy")}
                value={modelFilter?.purchaseProposalName}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "purchaseProposalName",
                  })(trimmedText);
                }}
              />
            </Col>
            <Col lg={SIZE_COL} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("PS.txt_table_code_project")}
                placeHolder={translate("PS.placeholder_code_project")}
                value={modelFilter?.projectCode}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "projectCode",
                  })(trimmedText);
                }}
              />
            </Col>
            <Col lg={SIZE_COL_16} className="m-b--md">
              <FormItem
                message={errorInputRange}
                validateStatus={errorInputRange ? ValidateStatus.error : null}
              >
                <div className="d-flex align-items-end w-100 h-100 flex-grow">
                  <InputNumber
                    value={modelFilter?.projectSettlementFrom?.equal}
                    label={translate("PS.txt_table_settlement_value")}
                    placeHolder={translate("CM.placeholder_from")}
                    isSmall={false}
                    onChange={(nb) => {
                      handleChangeInputFilter({
                        fieldName: "projectSettlementFrom",
                        fieldType: "equal",
                      })(nb);
                      if (nb < modelFilter?.projectSettlementTo?.equal) {
                        setErrorInputRange(null);
                      }
                    }}
                    max={NUMBER_MAX_13}
                    min={-NUMBER_MAX_13}
                    numberType={NUMBER_TYPE_INPUT}
                  />
                  <div className={styles["project-settlement-filter__dash"]}>
                    -
                  </div>
                  <InputNumber
                    value={modelFilter?.projectSettlementTo?.equal}
                    label={undefined}
                    placeHolder={translate("CM.placeholder_to")}
                    isSmall={false}
                    onChange={(nb) => {
                      handleChangeInputFilter({
                        fieldName: "projectSettlementTo",
                        fieldType: "equal",
                        classFilter: NumberFilter,
                      })(nb);
                      if (nb >= modelFilter?.projectSettlementFrom?.equal) {
                        setErrorInputRange(null);
                      }
                    }}
                    max={NUMBER_MAX_13}
                    min={-NUMBER_MAX_13}
                    numberType={NUMBER_TYPE_INPUT}
                  />
                </div>
              </FormItem>
            </Col>

            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.createdUsersValue || []}
                label={translate("PS.txt_table_person_create")}
                placeHolder={translate("PS.placeholder_person_create")}
                render={(item) => `${item?.email} - ${item?.name}`}
                getList={contractRepository.getListUser}
                classFilter={CommonFilter}
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "createdUsers",
                })}
                appendToBody
              />
            </Col>
            <Col lg={SIZE_COL} className="m-b--md">
              <DateRangePicker
                label={translate("PS.txt_table_date_create")}
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
                popupClassName={datePickerPopupClassName.second}
              />
            </Col>
            <Col lg={SIZE_COL} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.organizationsValue || []}
                label={translate("PS.txt_unit_create")}
                placeHolder={translate("PS.placeholder_unit_create")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={organizationRepository.getListOrganization}
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
                appendToBody
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};
