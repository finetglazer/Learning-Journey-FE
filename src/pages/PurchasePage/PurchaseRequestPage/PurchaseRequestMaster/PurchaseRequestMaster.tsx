import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { APP_OVERVIEW } from "config/route-const";
import { RepoState } from "core/services/page-services/master-service";
import React from "react";
import { Tabs } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import "./PurchaseRequest.scss";
import {
  PurchaseRequestMasterContext,
  usePurchaseRequestMasterHook,
} from "./PurchaseRequestMasterHook";

const PurchaseRequestMaster = () => {
  const { translate, tabRepositories, handleChangeTab, ...contextValue } =
    usePurchaseRequestMasterHook();

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories &&
      tabRepositories.length > 0 &&
      tabRepositories.map((tab: RepoState) => {
        return {
          ...tab,
          key: tab.tabKey,
          label: tab.tabTitle,
        };
      })
    );
  }, [tabRepositories]);

  return (
    <>
      <PurchaseRequestMasterContext.Provider value={contextValue}>
        <div className="page-content">
          <PageHeader
            title={translate("PR.purchase_request")}
            breadcrumbs={[
              {
                name: translate("CM.menu_title_home"),
                path: APP_OVERVIEW,
              },
              {
                name: translate("CM.menu_title_procurement"),
              },
              {
                name: translate("PR.purchase_request"),
              },
            ]}
            hasTabs={true}
          ></PageHeader>
          <div className="tab__master">
            <Tabs
              tabPosition="top"
              mode="line"
              onTabClick={handleChangeTab}
              activeKey={contextValue.repo.tabKey}
              items={tabItems}
              destroyInactiveTabPane={true}
            />
          </div>
        </div>
        {contextValue.isLoading && <LoadingCM />}
      </PurchaseRequestMasterContext.Provider>
    </>
  );
};

export default PurchaseRequestMaster;
