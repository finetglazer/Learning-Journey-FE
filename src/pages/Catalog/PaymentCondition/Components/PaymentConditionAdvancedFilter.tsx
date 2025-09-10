import { Col, Row } from "antd";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { IdFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";

import CommonFilter from "models/CommonFilter";
import { PaymentConditionFilter } from "models/PaymentCondition";
import {
  PaymentConditionContext,
  PaymentConditionContextProps,
} from "../PaymentConditionMaster/PaymentConditionMasterHook";

import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { listStatus } from "../../constants";
import paymentConditionRepository from "../PaymentConditionRepository";

interface PaymentConditionAdvancedFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const PaymentConditionAdvancedFilter = ({
  setVisible,
}: PaymentConditionAdvancedFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<PaymentConditionContextProps>(PaymentConditionContext);
  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: PaymentConditionFilter,
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
    >
      {/* Checkbox status */}
      <FilterPanel.Left lg={6}>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listStatus}
          values={modelFilter?.statusId || []}
          onChange={handleChangeCheckboxFilter({
            fieldName: "status",
          })}
        />
      </FilterPanel.Left>

      <FilterPanel.Right lg={18}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.codesValue || []}
              label={translate("PC.txt_payment_condition_code")}
              placeHolder={translate("PC.placeholder_payment_condition_code")}
              getList={paymentConditionRepository.getListCode}
              classFilter={CommonFilter}
              isSmall={false}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "codes",
                classFilter: IdFilter,
              })}
            />
          </Col>

          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("PC.txt_payment_condition_name")}
              placeHolder={translate("PC.placeholder_payment_condition_name")}
              value={modelFilter?.name}
              isSmall={false}
              onChange={handleChangeInputFilter({
                fieldName: "name",
              })}
            />
          </Col>

          {/* Description */}
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("PC.txt_payment_condition_description")}
              placeHolder={translate(
                "PC.placeholder_payment_condition_description"
              )}
              value={modelFilter?.description}
              onChange={handleChangeInputFilter({
                fieldName: "description",
              })}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
