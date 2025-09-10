import { useDebounceFn } from "ahooks";
import { useContext, useRef } from "react";
import {
  Button,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { trimText } from "core/helpers/text";
import { FilterActionEnum } from "core/services/service-types";

import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/images";
import { FilterIcon } from "assets/images/FilterIcon";
import { gt } from "lodash";
import {
  ReceivingGoodsContext,
  ReceivingGoodsContextType,
} from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMaster/context";
import { ReceivingGoodsAdvancedFilter } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsMasterTab/ReceivedTab/ReceivedGoodsAdvancedFilter";

const ICON_SIZE = 16;

const ReceivedGoodsTabAction = () => {
  const {
    modelFilter,
    calculatedFilterCount,
    receivingTabsFilterRepository,
    dispatchFilter,
    handleLoadList,
    handleResetList,
  } = useContext<ReceivingGoodsContextType>(ReceivingGoodsContext);

  const [translate] = useTranslation();
  const filterButtonRef = useRef(null);

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

  const handleChangeTabFilter = (value: string) => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        tab: value,
        pageIndex: numberConstants.ONE,
      },
    });
    handleLoadList({
      tab: value,
      pageIndex: numberConstants.ONE,
    });
  };

  return (
    <>
      <div className="flex-1 page-master__filter-action-search d-flex align-items-center">
        <div>
          <TagFilter
            listTag={receivingTabsFilterRepository}
            onClick={handleChangeTabFilter}
            value={modelFilter?.tab ?? receivingTabsFilterRepository[0]?.value}
          />
        </div>
      </div>
      <div className="page-master__actions d-flex align-items-center justify-content-end gap-x--xs">
        {gt(calculatedFilterCount, numberConstants.ZERO) ? (
          <Tag
            value={translate("CM.tag_filter", { count: calculatedFilterCount })}
            action={handleResetList}
            backgroundColor="#FFD4BC"
            color="#0c2042"
            className="tag__container m-r--xs"
            isShowDot={false}
          />
        ) : null}

        <div className="w-300px">
          <InputText
            prefix={
              <img src={IcSearchSVG} alt="Search Icon" width={ICON_SIZE} />
            }
            placeHolder={translate("RG.txt_search_received_goods")}
            type={numberConstants.ONE}
            isSmall
            value={modelFilter?.search}
            onChange={run}
          />
        </div>
        <Dropdown
          dropdownRender={() => (
            <ReceivingGoodsAdvancedFilter
              setVisible={() => {
                filterButtonRef.current.click();
              }}
            />
          )}
          destroyPopupOnHide
          trigger={["click"]}
        >
          <div ref={filterButtonRef}>
            <Button
              type="tertiary"
              size="lg"
              icon={<FilterIcon />}
              isUseStrokeSvg
              iconPlace="left"
            >
              {translate("CM.btn_filter")}
            </Button>
          </div>
        </Dropdown>
      </div>
    </>
  );
};

export default ReceivedGoodsTabAction;
