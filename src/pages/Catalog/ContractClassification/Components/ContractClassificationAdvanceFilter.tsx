import FilterPanel from "components/FilterPanel/FilterPanel";
import { NUMBER_MAX_13 } from "config/const";
import { numberConstants } from "core/config/consts";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { ContractClassificationFilter } from "models/ContractClassification/ContractClassificationFilter";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { NumberFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ContractClassificationMasterContext } from "../ContractClassificationMasterHooks";
import { contractClassificationRepository } from "../ContractClassificationRepository";

interface ContractClassificationAdvanceFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const listStatus = () => [
  {
    id: numberConstants.ONE,
    code: "ACTIVE",
    name: t("CM.txt_status_active"),
  },
  {
    id: numberConstants.ZERO,
    code: "DEACTIVATE",
    name: t("CM.txt_status_deactivate"),
  },
];

export const ContractClassificationAdvanceFilter = ({
  setVisible,
}: ContractClassificationAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext(ContractClassificationMasterContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ContractClassificationFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeMultipleSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <FilterPanel
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.btn_apply")}
      modelFilter={modelFilter}
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      handleClickOutside={handleClickOutside}
      className="contract-classification-advance-filter__container"
    >
      <div className="contract-classification-advance-filter">
        <div className="form-item-status">
          <CheckboxGroup
            label={translate("CM.txt_status")}
            dataOptions={listStatus()}
            values={modelFilter?.statusesId || []}
            onChange={handleChangeCheckboxFilter({
              fieldName: "statuses",
            })}
          />
        </div>
        <div className="d-flex gap-3 flex-column">
          <div className="d-flex gap-3 form-item">
            <MultipleSelect
              values={modelFilter?.codesValue || []}
              label={translate("CC.txt_config_code")}
              placeHolder={translate("CC.placeholder_select_config_code")}
              render={(item) => item?.code}
              getList={
                contractClassificationRepository.getCodeContractClassification
              }
              classFilter={undefined}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "codes",
              })}
              searchType=""
              type={1}
              valueFilter={{
                code: "",
              }}
              className="form-item form-item--half"
              searchProperty="code"
              isSmall={false}
              isEnumerable={false}
              appendToBody
            />
            <InputText
              label={translate("CC.txt_config_name")}
              placeHolder={translate("CC.placeholder_select_config_name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
              })}
              className="form-item form-item--half"
              isSmall={false}
            />
          </div>
          <InputText
            label={translate("CC.txt_config_description")}
            placeHolder={translate("CC.placeholder_select_config_description")}
            value={modelFilter?.description}
            onChange={handleChangeInputFilter({
              fieldName: "description",
            })}
            className="form-item"
            isSmall={false}
          />
          <div className="d-flex align-items-end gap-1 form-item">
            <InputNumber
              label={translate("CC.txt_config_maximum_payment")}
              placeHolder={translate("CM.placeholder_from")}
              value={modelFilter?.maxOverpaymentAmountFrom?.equal}
              onChange={handleChangeInputFilter({
                fieldName: "maxOverpaymentAmountFrom",
                fieldType: "equal",
                classFilter: NumberFilter,
              })}
              className="form-item form-item--half"
              isSmall={false}
              max={NUMBER_MAX_13}
              numberType="DECIMAL"
            />
            <span className="form-item__connect">-</span>
            <InputNumber
              placeHolder={translate("CM.placeholder_to")}
              value={modelFilter?.maxOverpaymentAmountTo?.equal}
              onChange={handleChangeInputFilter({
                fieldName: "maxOverpaymentAmountTo",
                fieldType: "equal",
                classFilter: NumberFilter,
              })}
              className="form-item form-item--half"
              isSmall={false}
              max={NUMBER_MAX_13}
              numberType="DECIMAL"
            />
          </div>
          <div className="d-flex align-items-end gap-1 form-item">
            <InputNumber
              label={translate("CC.txt_config_percentage")}
              placeHolder={translate("CM.placeholder_from")}
              value={modelFilter?.maxOverpaymentPercentageFrom?.equal}
              onChange={handleChangeInputFilter({
                fieldName: "maxOverpaymentPercentageFrom",
                fieldType: "equal",
                classFilter: NumberFilter,
              })}
              className="form-item form-item--half"
              isSmall={false}
              max={100}
              numberType="DECIMAL"
            />
            <span className="form-item__connect">-</span>
            <InputNumber
              placeHolder={translate("CM.placeholder_to")}
              value={modelFilter?.maxOverpaymentPercentageTo?.equal}
              onChange={handleChangeInputFilter({
                fieldName: "maxOverpaymentPercentageTo",
                fieldType: "equal",
                classFilter: NumberFilter,
              })}
              className="form-item form-item--half"
              isSmall={false}
              max={100}
              numberType="DECIMAL"
            />
          </div>
        </div>
      </div>
    </FilterPanel>
  );
};
