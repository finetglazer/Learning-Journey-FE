import { PageHeader } from "components";
import { Tabs } from "react-components-design-system";
import { useSupplierMasterHooks } from "./SupplierMasterHooks";
import { SupplierContext } from "./context";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useMemo } from "react";
import { RepoState } from "core/services/page-services/master-service";

export const SupplierMaster = () => {
  const {
    translate,
    breadcrumb,
    tabRepositories,
    handleChangeTab,
    repo,
    ...contextValue
  } = useSupplierMasterHooks();

  const tabItems: TabsProps["items"] = useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories &&
      tabRepositories.length > 0 &&
      tabRepositories.map((tab: RepoState) => {
        return tab.tabKey === "2"
          ? {}
          : {
              ...tab,
              key: tab.tabKey,
              label: tab.tabTitle,
            };
      })
    );
  }, [tabRepositories]);

  return (
    <SupplierContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_supplier")}
          breadcrumbs={breadcrumb}
          hasTabs={false}
        />
        {/* {isEmptyData() ? (
          <EmptyData message={translate("CM.message_empty_data")}>
            <Button
              iconPlace="right"
              type="primary"
              size="lg"
              onClick={() => contextValue.handleGoDetail(null)}
            >
              {translate("BG.btn_add")}
            </Button>
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <SupplierAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <SupplierTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )} */}

        <div className="tab__master">
          <Tabs
            tabPosition="top"
            mode="line"
            onTabClick={handleChangeTab}
            activeKey={repo.tabKey === "2" ? "1" : repo.tabKey}
            items={tabItems}
            destroyInactiveTabPane={true}
          />
        </div>
      </div>
    </SupplierContext.Provider>
  );
};
