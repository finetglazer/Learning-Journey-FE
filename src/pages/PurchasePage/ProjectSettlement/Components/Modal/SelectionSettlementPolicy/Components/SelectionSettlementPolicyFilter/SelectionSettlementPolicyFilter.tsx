import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { NUMBER_MAX_13 } from "config/const";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { ICON_SIZE_SMALL } from "core/config/icon-size";
import { trimText } from "core/helpers/text";
import { SettlementPolicyFilter } from "models/SettlementPolicy/SettlementPolicyFilter";
import { filterService } from "core/services/page-services/filter-service";
import { FilterAction, FilterActionEnum } from "core/services/service-types";
import { Dispatch } from "react";
import {
  DateRangePicker,
  InputNumber,
  InputText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./SelectionSettlementPolicyFilter.module.scss";
import { isEmpty, isNumber } from "lodash";

interface SelectionSettlementPolicyFilterProps {
  modelFilter: SettlementPolicyFilter;
  dispatchFilter: Dispatch<FilterAction<SettlementPolicyFilter>>;
  handleLoadList: (
    filterParam?: SettlementPolicyFilter,
    isOverrideFilter?: boolean
  ) => void;
}

function SelectionSettlementPolicyFilter({
  modelFilter,
  dispatchFilter,
  handleLoadList,
}: SelectionSettlementPolicyFilterProps) {
  const [translate] = useTranslation();
  const { handleChangeDateFilter } = filterService.useFilter(
    modelFilter,
    dispatchFilter
  );

  const { run } = useDebounceFn(
    ({ fieldName, value }: { fieldName: string; value: string | number }) => {
      const trimmedValue = isNumber(value)
        ? value
        : isEmpty(value)
        ? undefined
        : trimText(value);
      const filter = {
        [fieldName]: trimmedValue,
        pageIndex: numberConstants.ONE,
      } as SettlementPolicyFilter;

      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: filter,
      });
      handleLoadList(filter);
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  return (
    <div className={styles["filter-container"]}>
      <InputText
        value={modelFilter.code}
        prefix={<img src={IcSearchSVG} alt="" width={ICON_SIZE_SMALL} />}
        placeHolder={translate("PS.modal.settlement_policy_selection.search")}
        label={translate("CM.btn_search")}
        className={styles["search"]}
        onChange={(value) => run({ fieldName: "search", value })}
        isSmall={false}
      />
      <div className="form-item d-flex align-items-end gap-1 flex-1">
        <InputNumber
          label={translate("CT.label_total_amount")}
          placeHolder={translate("AUC.placeholder_from_area")}
          value={modelFilter?.totalRangeFrom}
          onChange={(value) => run({ fieldName: "totalRangeFrom", value })}
          numberType="DECIMAL"
          max={NUMBER_MAX_13}
          isSmall={false}
        />
        <span className={styles["connect"]}>-</span>
        <InputNumber
          placeHolder={translate("AUC.placeholder_to_area")}
          value={modelFilter?.totalRangeTo}
          onChange={(value) => run({ fieldName: "totalRangeTo", value })}
          numberType="DECIMAL"
          max={NUMBER_MAX_13}
          isSmall={false}
        />
      </div>
      <DateRangePicker
        label={translate("BG.label_date_creadted")}
        onChange={handleChangeDateFilter({
          fieldName: "createdDateRange",
          fieldType: ["from", "to"],
        })}
        value={[
          modelFilter?.createdDateRange?.from,
          modelFilter?.createdDateRange?.to,
        ]}
        placeholder={[
          translate("BG.plh_date_from"),
          translate("BG.plh_date__to"),
        ]}
        className={styles["form-date"]}
        isSmall={false}
      />
    </div>
  );
}

export default SelectionSettlementPolicyFilter;
