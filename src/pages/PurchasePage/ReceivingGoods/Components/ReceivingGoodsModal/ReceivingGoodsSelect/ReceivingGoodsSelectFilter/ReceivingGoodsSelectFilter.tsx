import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { trimText } from "core/helpers/text";
import { goodsServicesCategoryRepository } from "core/repositories/GoodsServicesCategory";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { useContext } from "react";
import {
  Checkbox,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ReceivingGoodsSelectHooksContext } from "../ReceivingGoodsSelectHooks";
import styles from "./ReceivingGoodsSelectFilter.module.scss";

export const ReceivingGoodsSelectFilter = () => {
  const [translate] = useTranslation();
  const { modelFilter, dispatchFilter, handleLoadList } = useContext(
    ReceivingGoodsSelectHooksContext
  );
  const { handleChangeInputFilter, handleChangeMultipleSelectFilter } =
    filterService.useFilter(modelFilter, dispatchFilter);

  const { run } = useDebounceFn(
    (search: string) => {
      const trimmedText = trimText(search);
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: trimmedText,
          pageIndex: numberConstants.ONE,
        },
      });
      handleLoadList({ search: trimmedText, pageIndex: numberConstants.ONE });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  return (
    <div className={styles["delivery-filter"]}>
      <InputText
        value={modelFilter.search}
        prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
        placeHolder={translate("RG.txt_search_goods_services")}
        className={styles["search"]}
        onChange={run}
      />
      <MultipleSelect
        values={modelFilter?.categoryValue || []}
        placeHolder={translate("RG.txt_purchase_category")}
        getList={goodsServicesCategoryRepository.getDropdown}
        className={styles["multiple-select"]}
        classFilter={CommonFilter}
        onChange={handleChangeMultipleSelectFilter({
          fieldName: "category",
        })}
        searchProperty="name"
        isEnumerable={false}
      />
      <div className={styles["checkbox"]}>
        <Checkbox
          checked={modelFilter?.isFullyReceived}
          label={translate("RG.txt_quantity_received")}
          onChange={
            handleChangeInputFilter({
              fieldName: "isFullyReceived",
            }) as () => (value: boolean) => void
          }
        />
      </div>
    </div>
  );
};
