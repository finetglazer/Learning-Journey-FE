import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { ActiveTabKeys } from "models/Contract";
import { RepoStateDetail } from "models/Payment";
import { listContractStatus } from "pages/PurchasePage/constants";
import { useMemo } from "react";
import { Tabs, Tag } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useHistory } from "react-router";
import {
  ContractDetailHookContext,
  useContractDetailHook,
} from "../ContractDetailHook";
import GroupAction from "./Components/GroupAction/GroupAction";

const ContractView = () => {
  const history = useHistory();
  const {
    titlePageHeader,
    tabRepositories,
    breadcrumbs,
    loading,
    translate,
    activeTabKey,
    setActiveTabKey,
    ...contextValue
  } = useContractDetailHook({
    isDetail: true,
  });

  const handleChangeTabs = (key: string) => {
    setActiveTabKey(key as ActiveTabKeys);
    const searchParams = new URLSearchParams(history.location.search);

    searchParams.set("tabKey", key);

    const url = `${history.location.pathname}?${searchParams.toString()}`;

    history.replace(url);
  };

  const tabItems: TabsProps["items"] = useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories &&
      tabRepositories.length > 0 &&
      tabRepositories.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
        };
      })
    );
  }, [tabRepositories]);

  const renderStatusDetail = () => {
    const status = contextValue.model?.status;
    const item = listContractStatus.find((type) => type.id === status);
    const nameValue = item?.name || translate("BG.newly_created");

    return (
      <Tag
        value={nameValue}
        status={item?.code}
        className="m-l--2xs"
        size="sm"
        isShowBorder
        isShowDot={false}
      />
    );
  };

  return (
    <>
      <ContractDetailHookContext.Provider value={contextValue}>
        <div className="page-content contract-wrapper">
          <PageHeader
            title={titlePageHeader}
            breadcrumbs={breadcrumbs}
            hasTabs={true}
            rightComponentTitle={renderStatusDetail()}
            isShowBackButton
          >
            <GroupAction />
          </PageHeader>
          <div className="tab__master">
            <Tabs
              className="payment_custom_form"
              tabPosition="top"
              mode="line"
              items={tabItems}
              destroyInactiveTabPane={true}
              activeKey={activeTabKey}
              onChange={handleChangeTabs}
            />
          </div>
        </div>
        {loading && <LoadingCM />}
      </ContractDetailHookContext.Provider>
    </>
  );
};

export default ContractView;
