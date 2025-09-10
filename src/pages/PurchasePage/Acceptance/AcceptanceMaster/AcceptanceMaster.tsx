import PageHeader from "components/PageHeader/PageHeader";
import { useMemo } from "react";

import { LoadingCM } from "components";
import { APP_OVERVIEW } from "config/route-const";
import { isEmpty } from "lodash";
import { Tabs } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useAcceptanceMasterHook } from "./AcceptanceMasterHook";
import { AcceptanceMasterContext } from "./AcceptanceMasterTab/context";

const AcceptanceMaster = () => {
  const { translate, tabRepositories, handleChangeTab, ...contextValue } =
    useAcceptanceMasterHook();
  const { loadingList, repo } = contextValue;

  const tabItems: TabsProps["items"] = useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories &&
      !isEmpty(tabRepositories) &&
      tabRepositories.map((tab) => {
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
      <div className="page-content">
        <PageHeader
          title={translate("AC.txt_acceptance")}
          breadcrumbs={[
            {
              name: translate("AC.txt_menu_title_home"),
              path: APP_OVERVIEW,
            },
            {
              name: translate("AC.txt_menu_title_shopping"),
            },
            {
              name: translate("AC.txt_acceptance"),
            },
          ]}
          hasTabs={false}
        />
        <AcceptanceMasterContext.Provider value={contextValue}>
          <div className="tab__master">
            <Tabs
              tabPosition="top"
              mode="line"
              onTabClick={handleChangeTab}
              activeKey={repo.tabKey}
              items={tabItems}
              destroyInactiveTabPane
            />
          </div>
        </AcceptanceMasterContext.Provider>
      </div>
      {loadingList && <LoadingCM />}
    </>
  );
};

export default AcceptanceMaster;
