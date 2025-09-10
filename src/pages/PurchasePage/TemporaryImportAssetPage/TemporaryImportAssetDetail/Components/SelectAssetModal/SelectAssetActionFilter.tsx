import { useContext, useCallback } from "react";
import { InputText, MultipleSelect } from "react-components-design-system";
import { Model, ModelFilter } from "react-3layer-common";
import { t } from "i18next";
import { useDebounceFn } from "ahooks";
import { map } from "rxjs";

import { IcSearchSVG } from "assets/icons";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { AssetBudget, AssetTableContext, ICON_SIZE } from "./SelectAssetHook";
import { trimText } from "core/helpers/text";

import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { temporaryImportAssetRepository } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetRepository";

const ActionFilter = ({ contractId }: { contractId: string }) => {
  const { dispatchFilter, handleLoadList, modelFilter } =
    useContext<AssetBudget>(AssetTableContext);

  const handleChangeMultipleSelectFilter = useCallback(
    (fieldName: string) => {
      return (selectedList: Model) => {
        dispatchFilter({
          type: FilterActionEnum.UPDATE,
          payload: {
            [fieldName]: selectedList,
            pageIndex: 1,
          },
        });
        handleLoadList({
          [fieldName]: selectedList,
        });
      };
    },
    [dispatchFilter, handleLoadList]
  );

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
    <div className="action__filter">
      <div className="d-flex gap-3">
        <div className="input w-full">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE} />}
            value={modelFilter.search}
            placeHolder={t("TIA.txt_enter_code")}
            onChange={run}
            type={numberConstants.ONE}
          />
        </div>
        <div className="form-item">
          <MultipleSelect
            appendToBody
            values={modelFilter?.goodsIds || []}
            isSmall={false}
            placeHolder={t("TIA.plh_goods_service")}
            getList={(filter: ModelFilter) =>
              temporaryImportAssetRepository
                .getGoodServicesListByContractId(contractId, {
                  ...filter,
                  search: filter?.name?.contain?.trim(),
                })
                .pipe(
                  map((response): any[] =>
                    Array.isArray(response?.data) ? response?.data : []
                  )
                )
            }
            render={(item) => item.code + " - " + item.name}
            classFilter={CommonFilter}
            onChange={handleChangeMultipleSelectFilter("goodsIds")}
          />
        </div>
        <div className="form-item">
          <MultipleSelect
            appendToBody
            className="form-item"
            values={modelFilter?.receiveIds || []}
            placeHolder={t("TIA.txt_receiver_and_in_charge")}
            render={(item) => item?.email + " - " + item?.name}
            getList={(filter: ModelFilter) =>
              temporaryImportAssetRepository
                .getAssetOwnerList(contractId, {
                  ...filter,
                  search: filter?.name?.contain?.trim(),
                })
                .pipe(
                  map((response): any[] =>
                    Array.isArray(response?.data) ? response?.data : []
                  )
                )
            }
            classFilter={CommonFilter}
            onChange={handleChangeMultipleSelectFilter("receiveIds")}
            isSmall={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ActionFilter;
