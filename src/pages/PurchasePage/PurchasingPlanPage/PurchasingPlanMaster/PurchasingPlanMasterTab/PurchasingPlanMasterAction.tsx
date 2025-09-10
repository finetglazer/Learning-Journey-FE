import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import { FilterActionEnum } from "core/services/service-types";
import React, { useContext } from "react";
import {
  Button,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  PurchasingPlanMaster,
  PurchasingPlanMasterContext,
} from "../PurchasingPlanMasterHook";
import MasterAdvanceFilter from "./PurchasingPlanMasterAdvanceFilter";
import { authorizationService } from "core/services/common-services/authorization-service";

const PurchasingPlanMasterAction = () => {
  const appUserMaster = useContext<PurchasingPlanMaster>(
    PurchasingPlanMasterContext
  );
  const { validAction } =
    authorizationService.useAuthorizedAction("PURCHASE_PLAN");
  const {
    countFilter,
    tabFilterRepository,
    dispatchFilter,
    modelFilter,
    handleLoadList,
    handleResetList,
    getEmptyData,
    handleModal,
  } = appUserMaster;
  const [translate] = useTranslation();
  const buttonRef = React.useRef(null);

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

  return (
    <>
      <div className="flex-1 page-master__filter-action-search d-flex align-items-center">
        <div>
          {!getEmptyData() && (
            <TagFilter
              listTag={tabFilterRepository}
              onClick={onPressTabFilter}
              value={modelFilter.tab ?? tabFilterRepository[0]?.value}
            />
          )}
        </div>
      </div>
      <div className="page-master__purchasing-plan d-flex align-items-center justify-content-end  gap-x--xs">
        {!!countFilter && (
          <Tag
            value={translate("CM.tag_filter", { count: countFilter })}
            action={handleResetList}
            className="page-master__purchasing-plan_filter-tag"
            backgroundColor="var(--palette-brand-2)"
            color="var(--color-text)"
            isShowDot={false}
          />
        )}
        <>
          {!getEmptyData() && (
            <>
              <div className="w-300px">
                <InputText
                  prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
                  value={modelFilter.search}
                  onChange={run}
                  placeHolder={translate("PL.plh_search")}
                  type={1}
                  isSmall
                />
              </div>
              <Dropdown
                dropdownRender={() => (
                  <MasterAdvanceFilter
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
                <Button onClick={() => handleModal()} type="primary" size="lg">
                  {translate("CM.btn_add")}
                </Button>
              )}
            </>
          )}
        </>
      </div>
    </>
  );
};

export default PurchasingPlanMasterAction;
