import { Dropdown } from "antd";
import React, { useContext } from "react";
import {
  Button,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import MasterAdvanceFilter from "./PurchaseRequestMasterTabAdvanceFilter";

import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/images";
import { FilterIcon } from "assets/images/FilterIcon";
import { FilterActionEnum } from "core/services/service-types";
import { isEmpty, isEqual } from "lodash";
import {
  PurchaseRequestMaster,
  PurchaseRequestMasterContext,
} from "../PurchaseRequestMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

const PurchaseRequestMasterAction = () => {
  const appUserMaster = useContext<PurchaseRequestMaster>(
    PurchaseRequestMasterContext
  );

  const { validAction } =
    authorizationService.useAuthorizedAction("PURCHASE_REQUEST");
  const {
    modelFilter,
    countFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    tabFilterRepository,
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

  const onPressAdd = () => {
    buttonRef.current.click();
    appUserMaster?.handlePressAdd();
  };

  return (
    <>
      <div className="flex-1 page-master__filter-action-search d-flex align-items-center">
        <div>
          <TagFilter
            listTag={tabFilterRepository}
            onClick={onPressTabFilter}
            value={modelFilter.tab ?? tabFilterRepository[0].value}
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
            prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
            value={modelFilter.search}
            placeHolder={translate("PR.plh_search")}
            onChange={run}
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
          destroyPopupOnHide
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

        {isEmpty(appUserMaster?.list) &&
        appUserMaster?.countFilter === 0 &&
        isEqual(appUserMaster?.modelFilter?.tab, 0) ? null : (
          <>
            {validAction("CREATE") && (
              <Button onClick={onPressAdd} type="primary" size="lg">
                {translate("BG.btn_add")}
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PurchaseRequestMasterAction;
