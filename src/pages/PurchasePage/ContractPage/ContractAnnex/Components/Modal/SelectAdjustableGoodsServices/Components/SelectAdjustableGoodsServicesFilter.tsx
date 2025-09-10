import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { ICON_SIZE_SMALL } from "core/config/icon-size";
import { trimText } from "core/helpers/text";
import { goodsServicesCategoryRepository } from "core/repositories/GoodsServicesCategory";
import { FilterAction, FilterActionEnum } from "core/services/service-types";
import { OptionBaseModel } from "models/Common/Common";
import CommonFilter from "models/CommonFilter";
import { Dispatch } from "react";
import { ModelFilter } from "react-3layer-common";
import {
  DEBOUNCE_TIME_300,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./SelectAdjustableGoodsServicesFilter.module.scss";

interface AddContractAppendixFilterProps {
  modelFilter: ModelFilter;
  dispatchFilter: Dispatch<FilterAction<ModelFilter>>;
  handleLoadList: (
    filterParam?: ModelFilter,
    isOverrideFilter?: boolean
  ) => void;
}

export default function SelectAdjustableGoodsServicesFilter({
  modelFilter,
  dispatchFilter,
  handleLoadList,
}: AddContractAppendixFilterProps) {
  const [translate] = useTranslation();

  const { run } = useDebounceFn(
    (value: string) => {
      const trimmedValue = trimText(value);
      const filter = {
        search: trimmedValue,
        pageIndex: 1,
      };

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

  const handleSelectCategory = (value: OptionBaseModel) => {
    const filter = {
      category: value,
      categoryId: value?.id,
      pageIndex: 1,
    };
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: filter,
    });
  };

  return (
    <div className={styles["filter-container"]}>
      <InputText
        value={modelFilter.code}
        prefix={<img src={IcSearchSVG} alt="" width={ICON_SIZE_SMALL} />}
        placeHolder={translate("RG.txt_search_goods_services")}
        className={styles["search"]}
        onChange={run}
        isSmall={false}
      />
      <Select
        value={modelFilter?.category}
        placeHolder={translate("RG.txt_purchase_category")}
        getList={goodsServicesCategoryRepository.getDropdown}
        className={styles["multiple-select"]}
        classFilter={CommonFilter}
        onChange={(_, value) => handleSelectCategory(value)}
        isEnumerable={false}
        searchProperty="name"
        isSmall={false}
        isSearch
      />
    </div>
  );
}
