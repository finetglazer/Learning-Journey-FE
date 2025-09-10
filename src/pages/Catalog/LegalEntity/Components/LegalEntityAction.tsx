import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { FilterActionEnum } from "core/services/service-types";
import { useContext, useEffect, useRef } from "react";
import { Button, InputText, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import {
  LegalEntityContext,
  LegalEntityHooks,
} from "../LegalEntityMaster/LegalEntityMasterHooks";
import { LegalEntityAdvanceFilter } from "./LegalEntityAdvanceFilter";

const ICON_SIZE = 16;

export const LegalEntityAction = () => {
  const {
    modelFilter,
    countFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handlePressAdd,
    validAction,
  } = useContext<LegalEntityHooks>(LegalEntityContext);
  const [translate] = useTranslation();
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const addContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (modelFilter.isDefaultLegalEntity) {
      const updatedFilter = {
        ...modelFilter,
        isDefaultLegalEntity: (!!modelFilter.isDefaultLegalEntity).toString(),
      };
      dispatchFilter({
        type: FilterActionEnum.SET,
        payload: updatedFilter,
      });
    }
  }, [modelFilter.isDefaultLegalEntity, dispatchFilter, modelFilter]);

  return (
    <div className="d-flex flex-1 align-items-center page-master__filter-action-search mt-3 ms-1 mb-12px">
      <div className="page-master__actions d-flex align-items-center gap-12 w-full justify-content-flex-end">
        {/* Count filter tag view */}
        {countFilter ? (
          <Tag
            isShowDot={false}
            backgroundColor="#FFD4BC"
            color="#0C2042"
            value={translate("CM.tag_filter", { count: countFilter })}
            action={handleResetList}
            className="tag__container"
          />
        ) : null}

        {/* Search box */}
        <div className="w-300px">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE} />}
            value={modelFilter.search}
            placeHolder={translate("LE.placeholder_quickly_search")}
            onChange={run}
            type={numberConstants.ONE}
            isSmall
          />
        </div>

        {/* Advance filter */}
        <Dropdown
          dropdownRender={() => (
            <LegalEntityAdvanceFilter
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

        {/* Add Button */}
        {validAction("CREATE") && (
          <div ref={addContainerRef}>
            <Button
              iconPlace="right"
              type="primary"
              size="lg"
              onClick={handlePressAdd}
            >
              {translate("BG.btn_add")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
