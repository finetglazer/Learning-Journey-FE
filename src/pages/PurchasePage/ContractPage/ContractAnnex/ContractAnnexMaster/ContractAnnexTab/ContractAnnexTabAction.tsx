import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/images";
import CaretDown from "assets/images/CaretDown.png";
import { FilterIcon } from "assets/images/FilterIcon";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { ICON_SIZE_SMALL } from "core/config/icon-size";
import { trimText } from "core/helpers/text";
import { FilterActionEnum } from "core/services/service-types";
import { gt, isEmpty, isEqual } from "lodash";
import ModalSelectionContractAnnex from "pages/PurchasePage/ContractPage/ContractAnnex/Components/Modal/ModalSelectionContractAnnex/ModalSelectionContractAnnex";
import { ContractAnnexModal } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { useContext, useRef } from "react";
import {
  Button,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ContractAnnexMaster, ContractAnnexMasterContext } from "../context";
import { ContractAnnexAdvancedFilter } from "./ContractAnnexAdvancedFilter";
import { authorizationService } from "core/services/common-services/authorization-service";

const ContractAnnexTabAction = () => {
  const {
    list,
    modelFilter,
    calculatedFilterCount,
    tabFilterRepository,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    modal,
    handleModal,
  } = useContext<ContractAnnexMaster>(ContractAnnexMasterContext);

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
            isSmall
            value={modelFilter.search}
            onChange={run}
          />
        </div>
        {/* Advanced Filter */}
        <Dropdown
          dropdownRender={() => (
            <ContractAnnexAdvancedFilter
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
        {(validActionContract("CREATE") ||
          validActionOrder("CREATE") ||
          validActionOrderHDNT("CREATE")) && (
          <div ref={addButtonRef}>
            <Button
              icon={<img src={CaretDown} alt="img" />}
              type="primary"
              size="lg"
              onClick={() =>
                handleModal(ContractAnnexModal.SelectionSettlementContract)
              }
              disabled={isEmpty(list)}
            >
              {translate("BG.btn_add")}
            </Button>
          </div>
        )}

        {isEqual(modal, ContractAnnexModal.SelectionSettlementContract) && (
          <ModalSelectionContractAnnex onClose={() => handleModal(null)} />
        )}
      </div>
    </>
  );
};

export default ContractAnnexTabAction;
