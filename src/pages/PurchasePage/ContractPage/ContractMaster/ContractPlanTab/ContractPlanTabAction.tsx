import { Dropdown } from "antd";
import { useContext, useRef } from "react";
import { Button, InputText, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import ContractPlanTabAdvanceFilter from "./ContractPlanTabAdvanceFilter";

import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/images";
import { FilterActionEnum } from "core/services/service-types";
import { ContractMaster, ContractMasterContext } from "../ContractMasterHook";
import { FilterIcon } from "assets/images/FilterIcon";
import { DEBOUNCE_TIME_300, numberConstants } from "core/config/consts";
import { trimText } from "core/helpers/text";

interface ContractPlanAction {
  isEmptyData: () => boolean;
}

const ContractPlanTabAction = (props: ContractPlanAction) => {
  const {
    modelFilter,
    countFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
  } = useContext<ContractMaster>(ContractMasterContext);

  const { isEmptyData } = props;
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

  return (
    <>
      <div className="flex-1 page-master__filter-action-search d-flex align-items-center"></div>
      <div className="page-master__actions d-flex align-items-center justify-content-end  gap-x--xs">
        {countFilter > 0 && (
          <Tag
            value={translate("CM.tag_filter", { count: countFilter })}
            action={handleResetList}
            className="page-master__filter-tag"
            backgroundColor="#FFD4BC"
          />
        )}
        {!isEmptyData() && (
          <div className="w-300px">
            <InputText
              prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
              value={modelFilter.search}
              placeHolder={translate(
                "CT.contract_plan.placeholder.search_list"
              )}
              onChange={run}
              type={1}
              isSmall
            />
          </div>
        )}

        {/* Advanced Filter */}
        {!isEmptyData() && (
          <Dropdown
            dropdownRender={() => (
              <ContractPlanTabAdvanceFilter
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
        )}
      </div>
    </>
  );
};

export default ContractPlanTabAction;
