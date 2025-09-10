/* eslint-disable import/no-unresolved */
import { Tag } from "react-components-design-system";
import React from "react";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { RepoStateDetail } from "models/Payment";
import { isEmpty, isNull } from "lodash";
import { LoadingCM } from "components";
import { listStatusEnum } from "config/const";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import "./SettlementView.scss";
import {
  SettlementHookContext,
  useSettlementDetailHook,
} from "../SettlementDetail/SettlementDetailHook";
import GroupAction from "../Components/GroupAction/GroupAction";
import { SettlementHookModel, TYPE_PAGE } from "models/Settlement";
import ModalActionConfirm from "../SettlementMaster/SettlementMasterTab/components/ModalActionConfirm";

const SettlementView = () => {
  const { loading, breadcrumbs, tabRepositoriesView, ...contextValue } =
    useSettlementDetailHook(TYPE_PAGE.VIEW);

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositoriesView &&
      tabRepositoriesView.length > 0 &&
      tabRepositoriesView.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
          forceRender: true,
          destroyInactiveTabPane: true,
        };
      })
    );
  }, [tabRepositoriesView]);

  const renderTag = () => {
    let status = -1;
    if (isEmpty(contextValue?.model?.status)) {
      status = contextValue?.model?.status;
    }
    const item = listStatusEnum.find((type) => type.id === status);
    return (
      <div className="d-flex align-center m-l--2xs">
        <Tag
          size="sm"
          value={
            isEmpty(item) ? contextValue.translate("CM.txt_create") : item?.name
          }
          status={item?.code}
          isShowDot={false}
          isShowBorder={true}
        />
      </div>
    );
  };

  return (
    <SettlementHookContext.Provider
      value={{ ...contextValue } as unknown as SettlementHookModel}
    >
      <LayoutViewDetail
        title={breadcrumbs[breadcrumbs.length - 1]?.name}
        breadcrumbs={breadcrumbs}
        tabItems={tabItems}
        rightComponentTitle={renderTag()}
        hasTabs={true}
        containerClassName="layout-bidding-view"
        childrenPageHeader={<GroupAction isView={true} />}
      />
      {loading && <LoadingCM />}

      {!isNull(contextValue?.modelSelected) ? (
        <ModalActionConfirm
          type={contextValue?.modelSelected?.type}
          model={contextValue?.modelSelected?.model}
          loadingButton={contextValue?.loadingButtonConfirm}
          isLoading={contextValue?.loadingModal}
          errorMessage={contextValue?.modelSelected?.errorMessage}
          onApply={contextValue?.handleApplyButtonInConfirmModal}
          onCancel={() => contextValue?.setModelSelected(null)}
        />
      ) : null}
    </SettlementHookContext.Provider>
  );
};

export default SettlementView;
