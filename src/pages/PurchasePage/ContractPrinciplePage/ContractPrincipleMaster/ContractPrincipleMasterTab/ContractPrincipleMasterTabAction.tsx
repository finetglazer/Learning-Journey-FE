import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import isEmpty from "lodash/isEmpty";
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

import { IcSearchSVG } from "assets/images";
import { FilterIcon } from "assets/images/FilterIcon";
import {
  ContractPrincipleMaster,
  ContractPrincipleMasterContext,
} from "../ContractPrincipleMasterHook";
import { ContractPrincipleMasterAdvancedFilter } from "./ContractPrincipleMasterAdvancedFilter";
import { authorizationService } from "core/services/common-services/authorization-service";

const ICON_SIZE = 16;

const ContractPrincipleMasterAction = () => {
  const {
    list,
    modelFilter,
    countFilter,
    contractTabsFilterRepository,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleAddNew,
  } = useContext<ContractPrincipleMaster>(ContractPrincipleMasterContext);

  const { validAction } = authorizationService.useAuthorizedAction(
    "PURCHASE_PRINCIPLE_CONTRACT"
  );

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
    handleLoadList({ tab: value, pageIndex: numberConstants.ONE });
  };

  return (
    <>
      <div className="flex-1 page-master__filter-action-search d-flex align-items-center">
        <div>
          <TagFilter
            listTag={contractTabsFilterRepository}
            onClick={handleChangeTabFilter}
            value={modelFilter.tab ?? contractTabsFilterRepository[0]?.value}
          />
        </div>
      </div>
      <div className="page-master__actions d-flex align-items-center justify-content-end  gap-x--xs">
        {countFilter > 0 && (
          <Tag
            value={translate("CM.tag_filter", { count: countFilter })}
            action={handleResetList}
            className="page-master__filter-tag"
            backgroundColor={"var(--palette-brand-2)"}
            color={"var(--palette-base-neutral-10)"}
            isShowDot={false}
          />
        )}
        <div className="w-300px">
          <InputText
            prefix={
              <img src={IcSearchSVG} alt="Search Icon" width={ICON_SIZE} />
            }
            placeHolder={translate(
              "CT.placeholder_quickly_search_contract_principles"
            )}
            type={numberConstants.ONE}
            isSmall
            value={modelFilter.search}
            onChange={run}
          />
        </div>

        {/* Advanced Filter */}
        <Dropdown
          dropdownRender={() => (
            <ContractPrincipleMasterAdvancedFilter
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

        {/* Add Button */}
        {isEmpty(list) && countFilter === 0 ? (
          <></>
        ) : (
          <div>
            {validAction("CREATE") && (
              <Button
                iconPlace="right"
                type="primary"
                size="lg"
                onClick={handleAddNew}
              >
                {translate("BG.btn_add")}
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ContractPrincipleMasterAction;
