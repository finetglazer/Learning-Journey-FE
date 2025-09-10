import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { ICON_SIZE_SMALL } from "core/config/icon-size";
import { trimText } from "core/helpers/text";
import { filterService } from "core/services/page-services/filter-service";
import { FilterAction, FilterActionEnum } from "core/services/service-types";
import { isEmpty, isNumber } from "lodash";
import { ContractNeedAdjustFilter } from "models/ContractPrincipleAppendix";
import { Dispatch } from "react";
import { DateRangePicker, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./ModalContractPrincipleAppendixFilter.module.scss";

interface ModalContractPrincipleAppendixFilterProps {
  modelFilter: ContractNeedAdjustFilter;
  dispatchFilter: Dispatch<FilterAction<ContractNeedAdjustFilter>>;
  handleLoadList: (
    filterParam?: ContractNeedAdjustFilter,
    isOverrideFilter?: boolean
  ) => void;
}

function ModalContractPrincipleAppendixFilter({
  modelFilter,
  dispatchFilter,
  handleLoadList,
}: ModalContractPrincipleAppendixFilterProps) {
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
      } as ContractNeedAdjustFilter;

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
        placeHolder={translate("CPA.modal.search_placeholder")}
        label={translate("CM.btn_search")}
        className={styles["search"]}
        onChange={(value) => run({ fieldName: "search", value })}
        isSmall={false}
      />
      <DateRangePicker
        label={translate("CPA.modal.created_date")}
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

export default ModalContractPrincipleAppendixFilter;
