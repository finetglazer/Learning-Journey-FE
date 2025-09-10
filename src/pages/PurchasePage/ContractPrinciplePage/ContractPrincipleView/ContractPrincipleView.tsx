/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { RepoStateDetail } from "models/Payment";
import { listContractStatus } from "pages/PurchasePage/constants";
import {
  ContractDetailHookContext,
  useContractDetailHook,
} from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useMemo } from "react";
import { Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useTranslation } from "react-i18next";
import GroupActionDetail from "./Components/GroupActionDetail";

const ContractPrincipleView = () => {
  const [translate] = useTranslation();
  const { tabRepositories, breadcrumbs, loading, ...contextValue } =
    useContractDetailHook({
      isDetail: true,
      isPrinciple: true,
    });

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

  const title = `${translate("CT.txt_contract_principles")} ${
    contextValue?.model?.code
  }`;

  return (
    <>
      <ContractDetailHookContext.Provider value={contextValue}>
        <div className={classNames("page-content")}>
          <PageHeader
            title={title}
            breadcrumbs={breadcrumbs}
            hasTabs={true}
            rightComponentTitle={renderStatusDetail()}
            isShowBackButton
          >
            <GroupActionDetail />
          </PageHeader>
          <div className="tab__master">
            <Tabs
              className="payment_custom_form"
              tabPosition="top"
              mode="line"
              items={tabItems}
              destroyInactiveTabPane={true}
            />
          </div>
        </div>
        {loading && <LoadingCM />}
      </ContractDetailHookContext.Provider>
    </>
  );
};

export default ContractPrincipleView;
