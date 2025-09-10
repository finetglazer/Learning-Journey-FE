/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { listProposalStatusEnum } from "config/const";
import { RepoStateDetail } from "models/Payment";
import { ETabKeys, ProposalCreateModel } from "models/Proposal";
import React from "react";
import { Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";

import { isNil } from "lodash";
import {
  ProposalCreateHookContext,
  useProposalCreateHook,
} from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { ProposalConfirmModal } from "pages/PurchasePage/ProposalPage/ProposalMaster/ProposalConfirmModal/ProposalConfirmModal";
import GroupActionDetailAdjust from "./GroupActionDetailAdjust/GroupActionDetailAdjust";

const ProposalAdjustView = () => {
  // const [translate] = useTranslation();
  const {
    tabRepositories,
    modelSelected,
    handleApplyButtonInConfirmModal,
    breadcrumbs,
    loading,
    isLoadingModal,
    activeTabKey,
    title,
    setActiveTabKey,
    ...contextValue
  } = useProposalCreateHook({
    isDetail: true,
    isAdjust: true,
  });

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
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
    return (
      <Tag
        value={getTitleStatus()?.name}
        className="m-l--2xs"
        size="sm"
        isShowBorder
        status={getTitleStatus()?.code}
        isShowDot={false}
      />
    );
  };

  const getTitleStatus = () => {
    return listProposalStatusEnum.find(
      (item) => item.id === contextValue?.model?.status
    );
  };

  return (
    <>
      <ProposalCreateHookContext.Provider
        value={contextValue as ProposalCreateModel}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={title}
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderStatusDetail()}
            hasTabs={true}
          >
            <GroupActionDetailAdjust />
          </PageHeader>
          <div className="tab__master">
            <Tabs
              className="payment_custom_form"
              tabPosition="top"
              mode="line"
              items={tabItems}
              destroyInactiveTabPane={true}
              activeKey={activeTabKey}
              onChange={(activeKey: string) =>
                setActiveTabKey(activeKey as ETabKeys)
              }
            />
          </div>
        </div>
        {loading && <LoadingCM />}
      </ProposalCreateHookContext.Provider>
      {!isNil(modelSelected) ? (
        <ProposalConfirmModal
          type={modelSelected?.type}
          model={modelSelected?.model}
          errorMessage={modelSelected?.errorMessage}
          isLoading={isLoadingModal}
          onApply={handleApplyButtonInConfirmModal}
          onCancel={() => contextValue.setModelSelected(null)}
        />
      ) : null}
    </>
  );
};

export default ProposalAdjustView;
