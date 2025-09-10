import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import { numberConstants } from "core/config/consts";
import { FilterActionEnum } from "core/services/service-types";
import { gt } from "lodash";
import { useContext, useRef } from "react";
import {
  Button,
  DEBOUNCE_TIME_300,
  InputText,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  ContractClassificationMasterContext,
  ContractClassificationModal,
} from "../ContractClassificationMasterHooks";
import { ContractClassificationAdvanceFilter } from "./ContractClassificationAdvanceFilter";

const ICON_SIZE = 16;

export const ContractClassificationActions = () => {
  const {
    modelFilter,
    countFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleActionContractClassification,
    validAction,
  } = useContext(ContractClassificationMasterContext);

  const [translate] = useTranslation();
  const addContainerRef = useRef<HTMLDivElement>(null);

  const filterContainerRef = useRef<HTMLDivElement>(null);

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

  const handleAddNew = () =>
    handleActionContractClassification({
      modal: ContractClassificationModal.CREATE,
      id: null,
    });

  return (
    <div className="contract-classification__action">
      <div className="contract-classification__action__right">
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
            placeHolder={translate("CC.placeholder_quick_search")}
            type={numberConstants.ONE}
            onChange={run}
            isSmall
          />
        </div>
        <Dropdown
          dropdownRender={() => (
            <ContractClassificationAdvanceFilter
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
        {validAction("CREATE") && (
          <div ref={addContainerRef}>
            <Button
              iconPlace="right"
              type="primary"
              size="lg"
              onClick={handleAddNew}
            >
              {translate("BG.btn_add")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
