import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterActionEnum } from "core/services/service-types";
import { useContext, useRef } from "react";
import { Button, InputText, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  OpinitionCollectorList,
  OpinitionCollectorListContext,
} from "../OpinitionCollectorListHook";

import { FilterIcon } from "assets/images/FilterIcon";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { gt } from "lodash";
import OpinitionCollectorListTabAdvanceFilter from "./OpinitionCollectorListTabAdvanceFilter";

const ICON_SIZE = 16;

const OpinitionCollectorListAction = () => {
  const opinitionCollectorList = useContext<OpinitionCollectorList>(
    OpinitionCollectorListContext
  );
  const [translate] = useTranslation();
  const buttonRef = useRef(null);
  const {
    modelFilter,
    countFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
  } = opinitionCollectorList;
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
    <div className="opinion-list-action">
      {gt(countFilter, numberConstants.ZERO) && (
        <Tag
          value={translate("CM.tag_filter", { count: countFilter })}
          action={handleResetList}
          className="flex-shrink-0"
          backgroundColor="#FFD4BC"
        />
      )}
      <InputText
        prefix={<img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE} />}
        value={modelFilter.search}
        placeHolder={translate("OC.placehoder_search")}
        onChange={run}
        className="opinion-list-action__search"
      />
      <Dropdown
        dropdownRender={() => (
          <OpinitionCollectorListTabAdvanceFilter
            setVisible={() => {
              buttonRef.current.click();
            }}
          />
        )}
        trigger={["click"]}
      >
        <div ref={buttonRef}>
          <Button
            type="tertiary"
            size="lg"
            icon={<FilterIcon />}
            iconPlace="left"
            isUseStrokeSvg
          >
            {translate("CM.btn_filter")}
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default OpinitionCollectorListAction;
