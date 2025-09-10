import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/images";
import { FilterIcon } from "assets/images/FilterIcon";
import { FilterActionEnum } from "core/services/service-types";
import { gt } from "lodash";
import { useContext, useState } from "react";
import { Button, InputText, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { CostLineMasterAdvanceFilter } from "./CostLineMasterAdvanceFilter";
import { CostLineMaster, CostLineMasterContext } from "./CostLineMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

export const CostLineMasterAction = () => {
  const costLineMaster = useContext<CostLineMaster>(CostLineMasterContext);
  const {
    modelFilter,
    countFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    setModalType,
  } = costLineMaster;

  const [translate] = useTranslation();

  const [visible, setVisible] = useState<boolean>(false);

  const { validAction } =
    authorizationService.useAuthorizedAction("CATALOG_COSTLINE");

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: search,
          pageIndex: 1,
          // pageSize: 10,
        },
      });
      handleLoadList({ search: search, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  return (
    <>
      <div className="page-master__filter-action-search d-flex align-items-center mt-4 ms-1"></div>
      <div className="page-master__actions d-flex align-items-center mt-4 me-1">
        {gt(countFilter, 0) ? (
          <Tag
            value={translate("CM.tag_filter", { count: countFilter })}
            className="page-master__filter-tag m-r--2xs"
            backgroundColor="#FFD4BC"
            action={handleResetList}
          />
        ) : null}
        <div className="w-300px m-r--xs">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
            value={modelFilter.search}
            placeHolder={translate("CL.placeholder_search_bar")}
            onChange={run}
            type={1}
            isSmall
          />
        </div>

        {/* Dropdown */}
        <Dropdown
          dropdownRender={() => (
            <CostLineMasterAdvanceFilter
              setVisible={() => {
                setVisible(false);
              }}
            />
          )}
          open={visible}
          trigger={["click"]}
          onOpenChange={(flag) => {
            if (gt(countFilter, 0)) return;
            setVisible(flag);
          }}
        >
          <div onClick={() => setVisible(true)}>
            <Button
              type="tertiary"
              size="lg"
              icon={<FilterIcon />}
              isUseStrokeSvg
              iconPlace="left"
            >
              {translate("CL.advance_filter_button")}
            </Button>
          </div>
        </Dropdown>
        {validAction("CREATE") && (
          <Button
            iconPlace="right"
            type="primary"
            size="lg"
            onClick={() => setModalType({ type: "CREATE" })}
            className="m-l--xs"
          >
            {translate("CM.btn_add")}
          </Button>
        )}
      </div>
    </>
  );
};
