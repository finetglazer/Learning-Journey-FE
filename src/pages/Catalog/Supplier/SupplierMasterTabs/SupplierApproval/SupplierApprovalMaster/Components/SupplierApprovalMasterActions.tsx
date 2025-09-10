import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import { numberConstants } from "core/config/consts";
import { trimText } from "core/helpers/text";
import { FilterActionEnum } from "core/services/service-types";
import { gt } from "lodash";
import { useContext, useRef } from "react";
import {
  Button,
  DEBOUNCE_TIME_300,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { SupplierApprovalMasterContext } from "../SupplierApprovalMasterHooks";
import { SupplierApprovalMasterAdvanceFilter } from "./SupplierApprovalMasterAdvanceFilter";

const ICON_SIZE = 16;

export const SupplierApprovalMasterActions = () => {
  const {
    modelFilter,
    countFilter,
    tabItems,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleChangeTab,
  } = useContext(SupplierApprovalMasterContext);

  const [translate] = useTranslation();
  const filterContainerRef = useRef<HTMLDivElement>(null);

  const { run } = useDebounceFn(
    (search: string) => {
      const trimmedText = trimText(search);
      const payload = {
        search: trimmedText,
        pageIndex: numberConstants.ONE,
        pageSize: modelFilter?.pageSize,
      };

      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload,
      });
      handleLoadList(payload);
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  return (
    <div className="supplier-approval__action">
      <div className="supplier-approval__action__left">
        <TagFilter
          listTag={tabItems}
          value={modelFilter?.tabKey || tabItems?.[numberConstants.ZERO].value}
          onClick={handleChangeTab}
        />
      </div>
      <div className="supplier-approval__action__right">
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
            value={modelFilter.search}
            prefix={<img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE} />}
            placeHolder={translate("generalActions.placeholder.search")}
            type={numberConstants.ONE}
            onChange={run}
            isSmall
          />
        </div>
        <Dropdown
          dropdownRender={() => (
            <SupplierApprovalMasterAdvanceFilter
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
    </div>
  );
};
