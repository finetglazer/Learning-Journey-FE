import FilterPanel from "components/FilterPanel/FilterPanel";
import { numberConstants } from "core/config/consts";

import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { t } from "i18next";
import CommonFilter from "models/CommonFilter";

import { Dispatch, SetStateAction, useContext } from "react";
import { NumberFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { SupplierApprovalMasterContext } from "../SupplierApprovalMasterHooks";
import supplierRepository from "pages/Catalog/Supplier/SupplierRepository";
import { SupplierFilter } from "models/Supplier/SupplierFilter";

interface SupplierApprovalAdvanceFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const listStatus = () => [
  {
    id: numberConstants.ONE,
    code: "ACTIVE",
    name: t("CM.txt_waiting"),
  },
  {
    id: numberConstants.THREE,
    code: "DEACTIVATE",
    name: t("CM.txt_approved"),
  },
  {
    id: numberConstants.TWO,
    code: "REJECTED",
    name: t("CM.txt_rejected"),
  },
];

export const SupplierApprovalMasterAdvanceFilter = ({
  setVisible,
}: SupplierApprovalAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext(SupplierApprovalMasterContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: SupplierFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeMultipleSelectFilter,
    handleChangeDateRangeFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  return (
    <FilterPanel
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.btn_apply")}
      modelFilter={modelFilter}
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      handleClickOutside={handleClickOutside}
    >
      <div className="supplier-approval-advance-filter">
        <div className="form-item-status">
          <CheckboxGroup
            label={translate("CM.txt_status")}
            dataOptions={listStatus()}
            values={modelFilter?.manageSupplierStatusesId || []}
            onChange={handleChangeCheckboxFilter({
              fieldName: "manageSupplierStatuses",
            })}
          />
        </div>
        <div className="d-flex gap-3 flex-wrap">
          <InputText
            label={translate("SL.txt_name")}
            placeHolder={translate("SL.placeholder_name_search")}
            value={modelFilter?.name}
            onChange={(value) => {
              const trimmedText = (value || "").trim();
              handleChangeInputFilter({
                fieldName: "name",
              })(trimmedText);
            }}
            className="form-item"
            isSmall={false}
          />
          <InputText
            label={translate("SL.txt_code")}
            placeHolder={translate("SL.placeholder_code_search")}
            value={modelFilter?.code}
            onChange={(value) => {
              const trimmedText = (value || "").trim();
              handleChangeInputFilter({
                fieldName: "code",
              })(trimmedText);
            }}
            className="form-item"
            isSmall={false}
          />
          <MultipleSelect
            values={modelFilter?.typesValue || []}
            label={translate("SL.txt_supplier_approval_type")}
            placeHolder={translate("SL.placeholder_supplier_approval_type")}
            classFilter={CommonFilter}
            getList={supplierRepository.getDropdownSupplierType}
            onChange={handleChangeMultipleSelectFilter({
              fieldName: "types",
            })}
            className="form-item"
            isSmall={false}
            searchProperty="name"
            appendToBody
          />
          <InputText
            label={translate("SL.txt_email")}
            placeHolder={translate("SL.placeholder_email_input")}
            value={modelFilter?.email}
            onChange={(value) => {
              const trimmedText = (value || "").trim();
              handleChangeInputFilter({
                fieldName: "email",
              })(trimmedText);
            }}
            className="form-item"
            isSmall={false}
          />
          <InputText
            label={translate("SL.txt_phone")}
            placeHolder={translate("SL.placeholder_phone_input")}
            value={modelFilter?.phone}
            onChange={(value) => {
              const trimmedText = (value || "").trim();
              handleChangeInputFilter({
                fieldName: "phone",
              })(trimmedText);
            }}
            className="form-item"
            isSmall={false}
          />
          <DateRangePicker
            label={translate("SL.txt_supplier_approval_date")}
            className="form-item"
            onChange={handleChangeDateRangeFilter({
              fieldName: "createdDateRange",
              fieldType: ["greaterEqual", "lessEqual"],
            })}
            value={[
              modelFilter?.createdDateRange?.greaterEqual,
              modelFilter?.createdDateRange?.lessEqual,
            ]}
            placeholder={[
              translate("CM.placeholder_from"),
              translate("CM.placeholder_to"),
            ]}
            isSmall={false}
          />
        </div>
      </div>
    </FilterPanel>
  );
};
