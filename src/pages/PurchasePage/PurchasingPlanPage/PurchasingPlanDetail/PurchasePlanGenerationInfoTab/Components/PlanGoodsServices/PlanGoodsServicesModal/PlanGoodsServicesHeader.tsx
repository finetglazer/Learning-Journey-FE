import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { FilterActionEnum } from "core/services/service-types";
import { GoodsServicesCategory } from "models/PurchaseRequest";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import React, { useContext } from "react";
import { InputText, MultipleSelect } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  GoodsServicesModal,
  PlanGoodsServicesModalContext,
} from "./PlanGoodsServicesModalHook";

const PlanGoodsServicesHeader = () => {
  const [translate] = useTranslation();

  const { modelFilter, dispatchFilter, handleLoadList } =
    useContext<GoodsServicesModal>(PlanGoodsServicesModalContext);

  const { run } = useDebounceFn(
    (search: string) => {
      const trimmedText = (search || "").replace(/\s+/g, " ").trim();
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: trimmedText,
          pageIndex: 1,
        },
      });
      handleLoadList({ search: trimmedText, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  const handleChangeSelectFilter = React.useCallback(
    (value: GoodsServicesCategory[]) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          categoryIds: value,
          pageIndex: 1,
        },
      });

      handleLoadList({
        ...modelFilter,
        categoryIds: value,
        pageIndex: 1,
      });
    },
    [dispatchFilter, handleLoadList, modelFilter]
  );

  return (
    <div className="search-bar-proposal d-flex w-100 gap-3">
      <div className="flex-1">
        <InputText
          label={translate("PR.search")}
          prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
          value={modelFilter.search}
          placeHolder={translate(
            "PL.purchasing_plan_enter_goods_services_code_or_name"
          )}
          isSmall={false}
          onChange={run}
        />
      </div>
      <div className="pl-w-210">
        <MultipleSelect
          label={translate("PL.purchasing_plan_goods_services_category_label")}
          searchType=""
          placeHolder={translate("PL.purchasing_plan_select_category")}
          valueFilter={{
            name: "",
            status: 1,
          }}
          isSmall={false}
          values={modelFilter?.categoryIds || []}
          getList={purchasingPlanRepository.goodsServiceCategory}
          classFilter={undefined}
          onChange={(values) => {
            handleChangeSelectFilter(values as GoodsServicesCategory[]);
          }}
        />
      </div>
    </div>
  );
};

export default PlanGoodsServicesHeader;
