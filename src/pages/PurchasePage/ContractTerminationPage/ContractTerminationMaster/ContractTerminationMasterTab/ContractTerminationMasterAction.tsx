import { useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FilterActionEnum } from "core/services/service-types";
import { useDebounceFn } from "ahooks";
import {
  Button,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import { Dropdown } from "antd";

import ContractTerminationMasterTabAdvance from "./ContractTerminationMasterTabAdvance";
import { CONTRACT_TERMINATION_DETAIL_ROUTE } from "config/route-const";
import { useHistory } from "react-router-dom";
import {
  ContractTerminationMaster,
  ContractTerminationMasterHookContext,
} from "../ContractTerminationMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

const ContractTerminationMasterAction = () => {
  const appUserMaster = useContext<ContractTerminationMaster>(
    ContractTerminationMasterHookContext
  );

  const {
    countFilter,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    tabFilterRepositories,
  } = appUserMaster;

  const { validAction } = authorizationService.useAuthorizedAction(
    "PURCHASE_CONTRACT_LIQUIDATION"
  );

  const [translate] = useTranslation();
  const buttonRef = useRef(null);

  const onPressTabFilter = (value: string) => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        tab: value,
        pageIndex: 1,
      },
    });
    handleLoadList({ tab: value, pageIndex: 1 });
  };

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: search,
          pageIndex: 1,
        },
      });
      handleLoadList({ search: search, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  const history = useHistory();
  const handleCreate = () => {
    history.push(CONTRACT_TERMINATION_DETAIL_ROUTE);
  };

  return (
    <div className="d-flex justify-content-between w-100">
      <div className="d-flex align-items-center">
        {/* Tabs */}
        <div>
          <TagFilter
            listTag={tabFilterRepositories}
            value={modelFilter?.tab ?? tabFilterRepositories[0]?.value}
            onClick={onPressTabFilter}
          />
        </div>
      </div>
      <div className="page-master__actions d-flex justify-content-between align-items-center gap-12">
        {!!countFilter && (
          <Tag
            value={translate("CM.tag_filter", { count: countFilter })}
            action={handleResetList}
            backgroundColor="var(--palette-brand-2)"
            color="var(--color-text)"
            className="tag__container"
            isShowDot={false}
          />
        )}
        <div className="w-300px">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
            value={modelFilter.search}
            placeHolder={translate("CLQ.plh_search")}
            onChange={run}
            type={1}
            isSmall
          />
        </div>
        <Dropdown
          dropdownRender={() => (
            <ContractTerminationMasterTabAdvance
              setVisible={() => {
                buttonRef.current.click();
              }}
            />
          )}
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
        {validAction("CREATE") && (
          <Button onClick={handleCreate} type="primary" size="lg">
            {translate("TIA.btn_create")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContractTerminationMasterAction;
