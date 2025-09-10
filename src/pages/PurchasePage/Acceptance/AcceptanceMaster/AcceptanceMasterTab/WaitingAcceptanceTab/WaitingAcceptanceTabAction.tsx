import React, { useContext } from "react";
import { gt, isEmpty } from "lodash";
import { Dropdown } from "antd";
import { FilterIcon } from "assets/images/FilterIcon";
import { IcSearchSVG } from "assets/images";
import { useDebounceFn } from "ahooks";
import { useTranslation } from "react-i18next";
import { FilterActionEnum } from "core/services/service-types";
import { AcceptanceMaster, AcceptanceMasterContext } from "../context";
import { Tag, Button, InputText } from "react-components-design-system";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { trimText } from "core/helpers/text";
import { WaitingAcceptanceAdvancedFilter } from "./WaitingAcceptanceAdvancedFilter";

const ICON_SIZE = 16;

const WaitingAcceptanceTabAction = () => {
  const appUserMaster = useContext<AcceptanceMaster>(AcceptanceMasterContext);
  const {
    modelFilter,
    calculatedFilterCount,
    dispatchFilter,
    handleLoadList,
    handleResetList,
  } = appUserMaster;
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
      handleLoadList({ search: search, pageIndex: numberConstants.ONE });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  return (
    <>
      <div className="flex-1 page-master__filter-action-search d-flex align-items-center" />

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
            placeHolder={translate("AC.placeholder_txt_search_waiting")}
            onChange={run}
            type={numberConstants.ONE}
            isSmall
          />
        </div>
        <Dropdown
          dropdownRender={() => (
            <>
              <WaitingAcceptanceAdvancedFilter
                setVisible={() => {
                  buttonRef.current.click();
                }}
              />
            </>
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

export default WaitingAcceptanceTabAction;
