import { useContext, useRef } from "react";
import {
  Button,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import {
  TemporaryImportAssetMaster,
  TemporaryImportAssetMasterContext,
} from "../TemporaryImportAssetMasterHook";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import { useDebounceFn } from "ahooks";
import { FilterActionEnum } from "core/services/service-types";
import { useTranslation } from "react-i18next";
import TemporaryImportAssetMasterTabAdvanceFilter from "./TemporaryImportAssetMasterTabAdvanceFilter";
import { authorizationService } from "core/services/common-services/authorization-service";

const TemporaryImportAssetMasterAction = () => {
  const appUserMaster = useContext<TemporaryImportAssetMaster>(
    TemporaryImportAssetMasterContext
  );
  const {
    countFilter,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    tabFilterRepositories,
  } = appUserMaster;

  const [translate] = useTranslation();
  const buttonRef = useRef(null);

  const { validAction } = authorizationService.useAuthorizedAction(
    "PURCHASE_TEMP_RECEIPT"
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

  const onPressAdd = () => {
    buttonRef.current.click();
    appUserMaster?.handlePressAdd();
  };

  return (
    <div className="d-flex justify-content-between w-100 mt-3">
      <div className="d-flex align-items-center">
        {/* Tabs */}
        <div>
          <TagFilter
            listTag={tabFilterRepositories}
            value={modelFilter.tab ?? tabFilterRepositories[0].value}
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
            placeHolder={translate("TIA.plh_search")}
            onChange={run}
            type={1}
            isSmall
          />
        </div>
        <Dropdown
          dropdownRender={() => (
            <TemporaryImportAssetMasterTabAdvanceFilter
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
          <Button onClick={onPressAdd} type="primary" size="lg">
            {translate("TIA.btn_create")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TemporaryImportAssetMasterAction;
