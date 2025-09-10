import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/images";
import { FilterIcon } from "assets/images/FilterIcon";
import { FilterActionEnum } from "core/services/service-types";
import { gt } from "lodash";
import { useContext, useState } from "react";
import { Button, InputText, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CostItemGoodsServicesMasterContextModel,
  CostItemGoodsServicesMasterContext,
} from "./CostItemGoodsServicesMasterHook";
import { CostItemGoodsServicesMasterAdvanceFilter } from "./CostItemGoodsServicesAdvanceFilter";

export const CostItemGoodsServicesMasterAction = () => {
  const costItem = useContext<CostItemGoodsServicesMasterContextModel>(
    CostItemGoodsServicesMasterContext
  );
  const {
    modelFilter,
    countFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleGoDetail,
    validAction,
  } = costItem;

  const [translate] = useTranslation();

  const [visible, setVisible] = useState<boolean>(false);

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: search,
          pageIndex: 1,
          // pageSize: 10,
        },
      });
      handleLoadList({ search: search, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  return (
    <>
      <div className="page-master__filter-action-search d-flex align-items-center mt-4 ms-1"></div>
      <div className="page-master__actions d-flex align-items-center mt-4 me-1">
        {gt(countFilter, 0) ? (
          <Tag
            value={translate("CM.tag_filter", { count: countFilter })}
            className="page-master__filter-tag m-r--2xs"
            backgroundColor="#FFD4BC"
            action={handleResetList}
          />
        ) : null}

        <div className="w-300px m-r--xs">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
            value={modelFilter.search}
            placeHolder={translate("generalActions.placeholder.search")}
            onChange={run}
            type={1}
            isSmall
          />
        </div>
        {/* Dropdown */}
        <Dropdown
          dropdownRender={() => (
            <CostItemGoodsServicesMasterAdvanceFilter
              setVisible={() => {
                setVisible(false);
              }}
            />
          )}
          open={visible}
          trigger={["click"]}
          onOpenChange={(flag) => {
            if (gt(countFilter, 0)) return;
            setVisible(flag);
          }}
        >
          <div onClick={() => setVisible(true)}>
            <Button
              type="tertiary"
              size="lg"
              icon={<FilterIcon />}
              isUseStrokeSvg
              iconPlace="left"
              className="m-r--xs"
            >
              {translate("costItems.advanceFilter")}
            </Button>
          </div>
        </Dropdown>

        {validAction("CREATE") && (
          <Button
            iconPlace="right"
            type="primary"
            size="lg"
            onClick={() => handleGoDetail(null)}
          >
            {translate("CM.btn_add")}
          </Button>
        )}
      </div>
    </>
  );
};
