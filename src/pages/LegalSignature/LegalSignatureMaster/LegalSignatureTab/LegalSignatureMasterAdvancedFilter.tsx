import React, { useContext } from "react";
import { Col, Row } from "antd";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
  MultipleSelect,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterService } from "core/services/page-services/filter-service";
import { trimText } from "core/helpers/text";
import CommonFilter from "models/CommonFilter";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import styles from "./LegalSignatureTab.module.scss";
import { LegalSignatureMaster, LegalSignatureMasterContext } from "../context";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { listLegalStatus, listTicketType } from "../../constants";
import { of } from "rxjs";
import { NumberFilter } from "react-3layer-advance-filters";
import { CostLineModelFilter } from "../../../Catalog/CostLine/CostLineMaster/CostLineMasterAdvanceFilter";
import { LegalSignatureFilter } from "models/LegalSignature/LegalSignatureFilter";

interface ContractMasterAdvancedFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LegalSignatureMasterAdvancedFilter = (
  props: ContractMasterAdvancedFilterProps
) => {
  const { setVisible } = props;
  const [translate] = useTranslation();

  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<LegalSignatureMaster>(LegalSignatureMasterContext);

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: LegalSignatureFilter,
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
    handleChangeSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  return (
    <div>
      <FilterPanel
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        modelFilter={modelFilter}
        handleApplyFilter={handleApplyFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        handleClickOutside={handleClickOutside}
        className={styles["legal_filter"]}
        exceptNodeIds={[
          "date-range-picker-1",
          "date-range-picker-2",
          "date-range-picker-3",
        ]}
      >
        <FilterPanel.Left lg={4}>
          <div className="d-flex flex-column gap-y--md">
            <CheckboxGroup
              label={translate("CM.txt_status")}
              dataOptions={listLegalStatus()}
              values={modelFilter?.signatureStatusesValue?.map((item: any) =>
                Number(item.id)
              )}
              onChange={handleChangeCheckboxFilter({
                fieldName: "signatureStatuses",
              })}
            />
          </div>
        </FilterPanel.Left>
        <FilterPanel.Right lg={20}>
          <Row gutter={16}>
            <Col lg={8} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("PM.table_coupon_code")}
                placeHolder={translate("RM.placeholder_coupon_code")}
                value={modelFilter?.code}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "code",
                  })(trimmedText);
                }}
              />
            </Col>

            <Col lg={8} className="m-b--md">
              <InputText
                isSmall={false}
                label={translate("legalSignature.voucher_name_description")}
                placeHolder={translate(
                  "legalSignature.placeholder.voucher_name_description"
                )}
                value={modelFilter?.name}
                onChange={(value) => {
                  const trimmedText = trimText(value);
                  handleChangeInputFilter({
                    fieldName: "name",
                  })(trimmedText);
                }}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <Select
                label={translate("AC.txt_ticket_type")}
                placeHolder={translate(
                  "legalSignature.placeholder.select_ticket_type"
                )}
                getList={() => of(listTicketType)}
                value={modelFilter.requestTypeValue}
                classFilter={CostLineModelFilter}
                onChange={handleChangeSelectFilter({
                  fieldName: "requestType",
                  fieldType: "in",
                  classFilter: NumberFilter,
                })}
                isSmall={false}
                allowClear={!!modelFilter?.requestType}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.organizationValue || []}
                label={translate("CT.label_create_unit")}
                placeHolder={translate("CT.placeholder_create_unit")}
                render={(item) => `${item?.code} - ${item?.name}`}
                getList={contractRepository.getListOrganization}
                classFilter={CommonFilter}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                isEnumerable={false}
                isSmall={false}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "organization",
                })}
              />
            </Col>
            <Col lg={8} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.createdUsersValue || []}
                label={translate("CT.label_create_user")}
                placeHolder={translate("CT.placeholder_create_user")}
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
            <Col lg={8} className="m-b--md">
              <DateRangePicker
                label={translate("PR.table_create_date")}
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
                popupClassName="date-range-picker-3"
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};
