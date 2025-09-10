import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/images";
import { FilterIcon } from "assets/images/FilterIcon";
import { FilterActionEnum } from "core/services/service-types";
import { gt } from "lodash";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AcceptanceMaster, AcceptanceMasterContext } from "../context";

import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { trimText } from "core/helpers/text";
import {
  Button,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { AcceptanceAdvancedFilter } from "./AcceptanceAdvancedFilter";

const ICON_SIZE = 16;

const AcceptanceTabAction = () => {
  const {
    modelFilter,
    calculatedFilterCount,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    tabFilterRepository,
  } = useContext<AcceptanceMaster>(AcceptanceMasterContext);

  const [translate] = useTranslation();
  const buttonRef = React.useRef(null);

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

  const onPressTabFilter = (value: string) => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        tab: value,
        pageIndex: numberConstants.ONE,
      },
    });
    handleLoadList({ tab: value, pageIndex: numberConstants.ONE });
  };

  return (
    <>
      <div className="flex-1 page-master__filter-action-search d-flex align-items-center">
        <div>
          <TagFilter
            listTag={tabFilterRepository}
            onClick={onPressTabFilter}
            value={modelFilter?.tab ?? tabFilterRepository[0]?.value}
          />
        </div>
      </div>

      <div className="page-master__actions d-flex align-items-center justify-content-end gap-x--xs">
        {gt(calculatedFilterCount, numberConstants.ZERO) ? (
          <Tag
            value={translate("CM.tag_filter", { count: calculatedFilterCount })}
            action={handleResetList}
            className="page-master__filter-tag"
            backgroundColor={"var(--palette-brand-2)"}
            color={"var(--palette-base-neutral-10)"}
            isShowDot={false}
          />
        ) : null}
        <div className="w-300px">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE} />}
            value={modelFilter?.search}
            placeHolder={translate("AC.placeholder_txt_search")}
            onChange={run}
            type={numberConstants.ONE}
            isSmall
          />
        </div>
        <Dropdown
          dropdownRender={() => (
            <AcceptanceAdvancedFilter
              setVisible={() => {
                buttonRef.current.click();
              }}
            />
          )}
          destroyPopupOnHide
          trigger={["click"]}
        >
          <div ref={buttonRef}>
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

export default AcceptanceTabAction;
