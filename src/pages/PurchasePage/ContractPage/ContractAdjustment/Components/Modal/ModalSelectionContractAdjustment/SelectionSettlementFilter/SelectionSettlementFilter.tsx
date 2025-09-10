import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { NUMBER_MAX_13 } from "config/const";
import {
  DEBOUNCE_TIME_300,
  NUMBER_TYPE_INPUT,
  numberConstants,
} from "core/config/consts";
import { ICON_SIZE_SMALL } from "core/config/icon-size";
import { trimText } from "core/helpers/text";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { isEmpty, isNumber } from "lodash";
import { ContractAppendixSettlementFilter } from "models/ContractAnnex";
import {
  DateRangePicker,
  FormItem,
  InputNumber,
  InputText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useSelectionSettlementContractAdjustmentModalHooks } from "../useSelectionSettlementContractAdjustmentModalHooks";
import styles from "./SelectionSettlementFilter.module.scss";
import { utilService } from "core/services/common-services/util-service";

type SelectionSettlementFilterProps = Pick<
  ReturnType<typeof useSelectionSettlementContractAdjustmentModalHooks>,
  "error" | "modelFilter" | "dispatchFilter" | "handleLoadList"
>;

function SelectionSettlementFilter({
  modelFilter,
  error,
  dispatchFilter,
  handleLoadList,
}: SelectionSettlementFilterProps) {
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
      } as ContractAppendixSettlementFilter;

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
        placeHolder={translate("CA.txt_placeholder_search")}
        label={translate("CM.btn_search")}
        className={styles["search"]}
        onChange={(value) => run({ fieldName: "search", value })}
        isSmall={false}
      />
      <FormItem
        validateObject={utilService.getValidateObj(
          {
            errors: { totalRange: (error as any)?.data?.message },
          },
          "totalRange"
        )}
      >
        <div className="form-item d-flex align-items-end gap-1 flex-1">
          <InputNumber
            label={translate("CT.label_total_amount")}
            placeHolder={translate("AUC.placeholder_from_area")}
            value={modelFilter?.contractValueFrom}
            onChange={(value) => run({ fieldName: "contractValueFrom", value })}
            max={NUMBER_MAX_13}
            min={-NUMBER_MAX_13}
            numberType={NUMBER_TYPE_INPUT}
            isSmall={false}
          />
          <span className={styles["connect"]}>-</span>
          <InputNumber
            placeHolder={translate("AUC.placeholder_to_area")}
            value={modelFilter?.contractValueTo}
            onChange={(value) => run({ fieldName: "contractValueTo", value })}
            max={NUMBER_MAX_13}
            min={-NUMBER_MAX_13}
            numberType={NUMBER_TYPE_INPUT}
            isSmall={false}
          />
        </div>
      </FormItem>
      <DateRangePicker
        label={translate("contractAdjustment.table_grounds_created_date")}
        onChange={handleChangeDateFilter({
          fieldName: "createDate",
          fieldType: ["greaterEqual", "lessEqual"],
        })}
        value={[
          modelFilter?.createDate?.greaterEqual,
          modelFilter?.createDate?.lessEqual,
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

export default SelectionSettlementFilter;
