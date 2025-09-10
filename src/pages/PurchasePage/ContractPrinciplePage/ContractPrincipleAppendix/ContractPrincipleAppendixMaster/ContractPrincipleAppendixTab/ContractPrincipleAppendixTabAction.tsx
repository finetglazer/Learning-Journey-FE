import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import CaretDown from "assets/images/CaretDown.png";
import { FilterIcon } from "assets/images/FilterIcon";
import { numberConstants } from "core/config/consts";
import { ICON_SIZE_SMALL } from "core/config/icon-size";
import { trimText } from "core/helpers/text";
import { authorizationService } from "core/services/common-services/authorization-service";
import { FilterActionEnum } from "core/services/service-types";
import { gt } from "lodash";
import { CPAModalType } from "pages/PurchasePage/ContractPrinciplePage/constants";
import {
  ContractPrincipleAppendixMaster,
  ContractPrincipleAppendixMasterContext,
} from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/context";
import { ContractPrincipleAppenndixAdvancedFilter } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/ContractPrincipleAppendixTab/ContractPrincipleAppendixAdvancedFilter";
import { useContext, useRef } from "react";
import {
  Button,
  DEBOUNCE_TIME_300,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

const ContractPrincipleAppendixTabAction = () => {
  const {
    modelFilter,
    calculatedFilterCount,
    tabFilterRepository,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleModal,
  } = useContext<ContractPrincipleAppendixMaster>(
    ContractPrincipleAppendixMasterContext
  );

  const { validAction } = authorizationService.useAuthorizedAction(
    "PURCHASE_PRINCIPLE_CONTRACT"
  );

  const [translate] = useTranslation();
  const filterButtonRef = useRef(null);
  const addButtonRef = useRef(null);

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
            listTag={tabFilterRepository}
            onClick={handleChangeTabFilter}
            value={
              modelFilter.tab ??
              tabFilterRepository[numberConstants.ZERO]?.value
            }
          />
        </div>
      </div>

      <div className="page-master__actions d-flex align-items-center justify-content-end  gap-x--xs">
        {gt(calculatedFilterCount, numberConstants.ZERO) ? (
          <Tag
            value={translate("CM.tag_filter", {
              count: calculatedFilterCount,
            })}
            action={handleResetList}
            className="page-master__filter-tag"
            backgroundColor={"var(--palette-brand-2)"}
            color={"var(--palette-base-neutral-10)"}
            isShowDot={false}
          />
        ) : null}

        <div className="w-300px">
          <InputText
            prefix={
              <img
                src={IcSearchSVG}
                alt="Search Icon"
                width={ICON_SIZE_SMALL}
              />
            }
            placeHolder={translate("CA.list.placeholder.quickly_search")}
            type={numberConstants.ONE}
            value={modelFilter.search}
            onChange={run}
            isSmall
          />
        </div>
        {/* Advanced Filter */}
        <Dropdown
          dropdownRender={() => (
            <ContractPrincipleAppenndixAdvancedFilter
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
        <div ref={addButtonRef}>
          {validAction("CREATE") && (
            <Button
              icon={<img src={CaretDown} alt="img" />}
              type="primary"
              size="lg"
              onClick={() =>
                handleModal(CPAModalType.SelectionContractPrincipleAppendix)
              }
            >
              {translate("BG.btn_add")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ContractPrincipleAppendixTabAction;
