import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { FilterActionEnum } from "core/services/service-types";
import { gt } from "lodash";
import { useContext, useRef } from "react";
import { Button, InputText, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { CostDriverMasterContext } from "../CostDriverMasterHooks";
import { CostDriverAdvanceFilter } from "./CostDriverAdvanceFilter";

const ICON_SIZE = 16;

export const CostDriverActions = () => {
  const {
    modelFilter,
    countFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
  } = useContext(CostDriverMasterContext);

  const [translate] = useTranslation();

  const filterContainerRef = useRef<HTMLDivElement>(null);

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
    <div className="cost-driver__action">
      {gt(countFilter, numberConstants.ZERO) ? (
        <Tag
          isShowDot={false}
          backgroundColor="#FFD4BC"
          color="#0C2042"
          value={translate("CM.tag_filter", { count: countFilter })}
          action={handleResetList}
          className="tag__container"
        />
      ) : null}
      <div className="w-300px">
        <InputText
          prefix={<img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE} />}
          value={modelFilter.search}
          placeHolder={translate("CD.placeholder_quickly_search")}
          onChange={run}
          type={numberConstants.ONE}
          isSmall
        />
      </div>
      <Dropdown
        dropdownRender={() => (
          <CostDriverAdvanceFilter
            setVisible={() => filterContainerRef.current?.click()}
          />
        )}
        trigger={["click"]}
      >
        <div ref={filterContainerRef}>
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
  );
};
