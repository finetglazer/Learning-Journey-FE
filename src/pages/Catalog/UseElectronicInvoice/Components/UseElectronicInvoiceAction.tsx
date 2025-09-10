import { useContext, useRef } from "react";
import { Button, InputText, Tag } from "react-components-design-system";
import { gt } from "lodash";
import { useTranslation } from "react-i18next";
import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";

import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { FilterActionEnum } from "core/services/service-types";

import {
  UseElectronicInvoiceContext,
  UseElectronicInvoiceContextProps,
} from "../UseElectronicInvoiceMaster/UseElectronicInvoiceMasterHook";
import { UseElectronicInvoiceAdvancedFilter } from "./UseElectronicInvoiceAdvancedFilter";

import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";

const ICON_SIZE = 16;

export const UseElectronicInvoiceAction = () => {
  const {
    modelFilter,
    calculatedFilterCount,
    dispatchFilter,
    handleLoadList,
    handleResetList,
  } = useContext<UseElectronicInvoiceContextProps>(UseElectronicInvoiceContext);
  const [translate] = useTranslation();
  const filterButtonContainerRef = useRef<HTMLDivElement>(null);

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: search,
          pageIndex: numberConstants.ONE,
        },
      });
      handleLoadList({ search: search, pageIndex: numberConstants.ONE });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  return (
    <div className="d-flex flex-1 align-items-center page-master__filter-action-search mt-3 ms-1 mb-12px">
      <div className="page-master__actions d-flex align-items-center gap-12 w-full justify-content-flex-end">
        {/* Count filter tag view */}
        {gt(calculatedFilterCount, numberConstants.ZERO) ? (
          <Tag
            isShowDot={false}
            backgroundColor="#FFD4BC"
            color="#0C2042"
            value={translate("CM.tag_filter", { count: calculatedFilterCount })}
            action={handleResetList}
            className="tag__container"
          />
        ) : null}

        {/* Search box */}
        <div className="w-300px">
          <InputText
            prefix={<img src={IcSearchSVG} alt="search" width={ICON_SIZE} />}
            value={modelFilter.search}
            placeHolder={translate("UEI.placeholder_quickly_search")}
            onChange={run}
            type={numberConstants.ONE}
            isSmall
          />
        </div>

        {/* Advanced filter */}
        <Dropdown
          dropdownRender={() => (
            <UseElectronicInvoiceAdvancedFilter
              setVisible={() => filterButtonContainerRef.current?.click()}
            />
          )}
          trigger={["click"]}
        >
          <div ref={filterButtonContainerRef}>
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
    </div>
  );
};
