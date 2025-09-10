import { Dropdown } from "antd";
import { useContext, useRef } from "react";
import {
  Button,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import MasterAdvanceFilter from "./BudgetMasterTabAdvanceFilter";

import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/images";
import CaretDown from "assets/images/CaretDown.png";
import { FilterIcon } from "assets/images/FilterIcon";
import { FilterActionEnum } from "core/services/service-types";
import { isEmpty, isEqual } from "lodash";
import {
  BudgetAddType,
  BudgetMaster,
  BudgetMasterContext,
} from "../BudgetMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

const BudgetMasterAction = () => {
  const appUserMaster = useContext<BudgetMaster>(BudgetMasterContext);
  const {
    list,
    modelFilter,
    countFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    tabItems,
    handlePressAdd,
  } = appUserMaster;

  const [translate] = useTranslation();
  const buttonRef = useRef(null);
  const addButtonRef = useRef(null);

  const { validAction: validActionRequest } =
    authorizationService.useAuthorizedAction("PKG_REQUEST", "Plan");

  const { validAction: validActionAdjust } =
    authorizationService.useAuthorizedAction("PKG_REQUEST", "Adjustment");

  const { validAction: validActionReassignment } =
    authorizationService.useAuthorizedAction("PKG_REQUEST", "Reassignment");

  const { validAction: validActionSettlement } =
    authorizationService.useAuthorizedAction("PKG_REQUEST", "Settlement");

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

  const onPressAdd = (type = BudgetAddType.Request) => {
    buttonRef.current.click();
    handlePressAdd(type);
  };

  function getEmptyData(): boolean {
    if (isEmpty(modelFilter.search)) {
      return (
        isEmpty(list) && countFilter === 0 && isEqual(modelFilter.tabKey, 0)
      );
    } else {
      return false;
    }
  }

  const onPressTabFilter = (value: string) => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        tabKey: value,
        pageIndex: 1,
      },
    });
    handleLoadList({ tabKey: value, pageIndex: 1 });
  };

  return (
    <div className="tab-action__container">
      <div className="flex-1 page-master__filter-action-search d-flex align-items-center">
        {/* Tabs */}
        <div>
          <TagFilter
            listTag={tabItems}
            value={modelFilter.tabKey || tabItems[0].value}
            onClick={onPressTabFilter}
          />
        </div>
      </div>
      <div className="page-master__actions d-flex align-items-center gap-16">
        {countFilter > 0 && (
          <Tag
            value={translate("CM.tag_filter", { count: countFilter })}
            action={handleResetList}
            backgroundColor="#FFD4BC"
            color="#0C2042"
            className="tag__container"
            isShowDot={false}
          />
        )}
        <div className="w-300px">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
            value={modelFilter.search}
            placeHolder={translate("BG.plh_search_coupon")}
            onChange={run}
            type={1}
            isSmall
          />
        </div>
        {/* Advance Filter */}
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

        {/* Add Button */}
        {getEmptyData() ||
        (!validActionRequest("CREATE") &&
          !validActionAdjust("CREATE") &&
          !validActionReassignment("CREATE") &&
          !validActionSettlement("CREATE")) ? (
          <></>
        ) : (
          <Dropdown
            dropdownRender={() => {
              return (
                <div className="dropdown__content__create">
                  {validActionRequest("CREATE") ? (
                    <div onClick={() => onPressAdd()} className="dropdown-item">
                      {translate("BG.txt_create_budget")}
                    </div>
                  ) : null}
                  {validActionAdjust("CREATE") ||
                  validActionReassignment("CREATE") ? (
                    <div
                      onClick={() => onPressAdd(BudgetAddType.Adjust)}
                      className="dropdown-item"
                    >
                      {translate("BG.txt_create_adjust")}
                    </div>
                  ) : null}
                  {validActionSettlement("CREATE") ? (
                    <div
                      onClick={() => onPressAdd(BudgetAddType.Settlement)}
                      className="dropdown-item"
                    >
                      {translate("BG.txt_create_finalization")}
                    </div>
                  ) : null}
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
        )}
      </div>
    </div>
  );
};

export default BudgetMasterAction;
