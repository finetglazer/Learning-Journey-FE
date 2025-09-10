import { Dropdown } from "antd";
import React, { useContext, useRef } from "react";
import {
  Button,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useDebounceFn } from "ahooks";
import isEmpty from "lodash/isEmpty";

import { FilterActionEnum } from "core/services/service-types";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { trimText } from "core/helpers/text";
import { ContractMasterAdvancedFilter } from "./ContractMasterAdvancedFilter";
import { ContractMaster, ContractMasterContext } from "../ContractMasterHook";

import CaretDown from "assets/images/CaretDown.png";
import { IcSearchSVG } from "assets/images";
import { FilterIcon } from "assets/images/FilterIcon";
import { ContractAddType } from "models/Contract";
import { authorizationService } from "core/services/common-services/authorization-service";

const ICON_SIZE = 16;

const ContractMasterAction = () => {
  const {
    list,
    modelFilter,
    calculatedFilterCount,
    contractTabsFilterRepository,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleAddContract,
  } = useContext<ContractMaster>(ContractMasterContext);

  const { validAction: validActionContract } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "Contract");

  const { validAction: validActionOrder } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "Order");

  const { validAction: validActionOrderHDNT } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "OrderHDNT");

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
            listTag={contractTabsFilterRepository}
            onClick={handleChangeTabFilter}
            value={modelFilter.tab ?? contractTabsFilterRepository[0]?.value}
          />
        </div>
      </div>
      <div className="page-master__actions d-flex align-items-center justify-content-end  gap-x--xs">
        {calculatedFilterCount > 0 && (
          <Tag
            value={translate("CM.tag_filter", { count: calculatedFilterCount })}
            action={handleResetList}
            className="page-master__filter-tag"
            backgroundColor="#FFD4BC"
          />
        )}
        <div className="w-300px">
          <InputText
            prefix={
              <img src={IcSearchSVG} alt="Search Icon" width={ICON_SIZE} />
            }
            placeHolder={translate("CT.placeholder_quickly_search")}
            type={numberConstants.ONE}
            isSmall
            value={modelFilter.search}
            onChange={run}
          />
        </div>

        {/* Advanced Filter */}
        <Dropdown
          dropdownRender={() => (
            <ContractMasterAdvancedFilter
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
        {isEmpty(list) && calculatedFilterCount === 0 ? (
          <></>
        ) : (
          (validActionContract("CREATE") ||
            validActionOrder("CREATE") ||
            validActionOrderHDNT("CREATE")) && (
            <Dropdown
              dropdownRender={() => {
                return (
                  <div className="dropdown__content__create">
                    {validActionContract("CREATE") && (
                      <div
                        onClick={() =>
                          handleAddContract(ContractAddType.Contract)
                        }
                        className="dropdown-item"
                      >
                        {translate("CT.txt_contract")}
                      </div>
                    )}
                    {validActionOrder("CREATE") && (
                      <div
                        onClick={() =>
                          handleAddContract(ContractAddType.PurchaseOrder)
                        }
                        className="dropdown-item"
                      >
                        {translate("CT.txt_purchase_order")}
                      </div>
                    )}

                    {validActionOrderHDNT("CREATE") && (
                      <div
                        onClick={() =>
                          handleAddContract(
                            ContractAddType.PurchaseOrderContractPrinciples
                          )
                        }
                        className="dropdown-item"
                      >
                        {translate("CT.txt_purchase_order_contract_principles")}
                      </div>
                    )}
                  </div>
                );
              }}
              trigger={["click"]}
            >
              <div ref={addButtonRef}>
                <Button
                  icon={<img src={CaretDown} alt="img" />}
                  iconPlace="right"
                  type="primary"
                  size="lg"
                >
                  {translate("BG.btn_add")}
                </Button>
              </div>
            </Dropdown>
          )
        )}
      </div>
    </>
  );
};

export default ContractMasterAction;
