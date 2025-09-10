import { PageHeader } from "components";
import { RepoState } from "core/services/page-services/master-service";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import { Tabs } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useReceivingGoodsHooks } from "./ReceivingGoodsHooks";
import { ReceivingGoodsContext } from "./context";

export const ReceivingGoodsMaster = () => {
  const {
    translate,
    breadcrumbs,
    handleChangeTab,
    tabRepositories,
    ...contextValue
  } = useReceivingGoodsHooks();

  const tabItems: TabsProps["items"] = useMemo<TabsProps["items"]>(() => {
    return !isEmpty(tabRepositories)
      ? tabRepositories.map((tab: RepoState) => ({
          ...tab,
          key: tab.tabKey,
          label: tab.tabTitle,
        }))
      : [];
  }, [tabRepositories]);

  return (
    <ReceivingGoodsContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_receiving_goods")}
          breadcrumbs={breadcrumbs}
        />
        <div className="tab__master">
          <Tabs
            tabPosition="top"
            mode="line"
            activeKey={contextValue.repo.tabKey}
            items={tabItems}
            destroyInactiveTabPane={true}
            onTabClick={handleChangeTab}
          />
        </div>
      </div>
    </ReceivingGoodsContext.Provider>
  );
};
