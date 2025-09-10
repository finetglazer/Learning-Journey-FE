import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { CostDriverFilter } from "models/CostDriver/CostDriverFilter";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { InputText, MultipleSelect } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import CommonFilter from "models/CommonFilter";
import { CostDriverMasterContext } from "../CostDriverMasterHooks";
import costDriverRepository from "../CostDriverRepository";

interface CostDriverAdvanceFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const CostDriverAdvanceFilter = ({
  setVisible,
}: CostDriverAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext(CostDriverMasterContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: CostDriverFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const { handleChangeInputFilter, handleChangeMultipleSelectFilter } =
    filterService.useFilter(modelFilter, dispatchFilter);

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
      <div className="cost-driver-advance-filter">
        <MultipleSelect
          values={modelFilter?.codesValue || []}
          label={translate("CD.txt_cost_driver_code")}
          placeHolder={translate("CD.placeholder_search_by_cost_driver_code")}
          render={(item) => item?.code}
          getList={costDriverRepository.getCodeCostDriver}
          classFilter={CommonFilter}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "codes",
          })}
          className="form-item"
          isSmall={false}
          searchProperty="code"
          isEnumerable={false}
          appendToBody
        />
        <InputText
          label={translate("CD.txt_cost_driver_name")}
          placeHolder={translate("CD.placeholder_search_by_cost_driver_name")}
          value={modelFilter?.name}
          onChange={handleChangeInputFilter({
            fieldName: "name",
          })}
          isSmall={false}
          className="form-item"
        />
        <InputText
          label={translate("CD.txt_cost_driver_description")}
          placeHolder={translate(
            "CD.placeholder_search_by_cost_driver_description"
          )}
          value={modelFilter?.description}
          onChange={handleChangeInputFilter({
            fieldName: "description",
          })}
          isSmall={false}
          className="form-item form-item--full"
        />
      </div>
    </FilterPanel>
  );
};
