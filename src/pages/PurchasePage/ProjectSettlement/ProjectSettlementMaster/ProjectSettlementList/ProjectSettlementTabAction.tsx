import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import { numberConstants } from "core/config/consts";
import { ICON_SIZE_SMALL } from "core/config/icon-size";
import { trimText } from "core/helpers/text";
import { FilterActionEnum } from "core/services/service-types";
import {
  ProjectSettlementMasterContext,
  ProjectSettlementMasterType,
} from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/context";
import { ProjectSettlementAdvancedFilter } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/ProjectSettlementList/ProjectSettlementAdvancedFilter";
import { useContext, useRef } from "react";
import {
  Button,
  DEBOUNCE_TIME_300,
  InputText,
  Tag,
  TagFilter,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../ProjectSettlement.module.scss";
import { gt } from "lodash";
import { ProjectSettlementModal } from "../../Components/constant";
import { authorizationService } from "core/services/common-services/authorization-service";

const ProjectSettlementTabAction = () => {
  const {
    modelFilter,
    projectSettlementTabsFilterRepository,
    dispatchFilter,
    handleLoadList,
    handleModal,
    handleResetList,
    calculatedFilterCount,
  } = useContext<ProjectSettlementMasterType>(ProjectSettlementMasterContext);

  const { validAction } = authorizationService.useAuthorizedAction(
    "PURCHASE_PROJECT_SETTLEMENT"
  );

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

  const handleChangeTabFilter = (value: string) => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        tab: value,
        pageIndex: numberConstants.ONE,
      },
    });
    handleLoadList({
      tab: value,
      pageIndex: numberConstants.ONE,
    });
  };
  return (
    <div className={styles["tab-action-project-settlement__container"]}>
      <div className="flex-1 page-master__filter-action-search d-flex align-items-center">
        <div>
          <TagFilter
            listTag={projectSettlementTabsFilterRepository}
            onClick={handleChangeTabFilter}
            value={
              modelFilter?.tab ??
              projectSettlementTabsFilterRepository[0]?.value
            }
          />
        </div>
      </div>
      <div className="page-master__actions d-flex align-items-center justify-content-end gap-x--xs">
        {gt(calculatedFilterCount, numberConstants.ZERO) ? (
          <Tag
            value={translate("CM.tag_filter", { count: calculatedFilterCount })}
            action={handleResetList}
            backgroundColor="#FFD4BC"
            color="#0c2042"
            className="tag__container m-r--xs"
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
            placeHolder={translate("PS.txt_search")}
            type={numberConstants.ONE}
            isSmall
            onChange={run}
          />
        </div>
        <Dropdown
          dropdownRender={() => (
            <ProjectSettlementAdvancedFilter
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
        {validAction("CREATE") && (
          <Button
            iconPlace="right"
            type="primary"
            size="lg"
            onClick={() =>
              handleModal(ProjectSettlementModal.SelectionSettlementPolicy)
            }
          >
            {translate("CM.btn_add")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectSettlementTabAction;
