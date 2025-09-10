/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import { listStatusEnum } from "config/const";
import { t } from "i18next";
import { isEmpty, isNull } from "lodash";
import {
  ContractTerminationContextModel,
  TYPE_PAGE,
} from "models/ContractTermination";
import { RepoStateDetail } from "models/Payment";
import React from "react";
import { Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import GroupAction from "../Components/GroupAction/GroupAction";
import ModalActionConfirm from "../Components/ModalActionConfirm/ModalActionConfirm";
import {
  ContractTerminationDetailHookContext,
  useContractTerminationDetailHook,
} from "../ContractTerminationDetail/ContractTerminationDetailHook";
import "./ContractTerminationView.scss";

const ContractTerminationView = () => {
  const { loading, breadcrumbs, tabRepositories, ...contextValue } =
    useContractTerminationDetailHook(TYPE_PAGE.VIEW);
  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories &&
      tabRepositories.length > 0 &&
      tabRepositories.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
          forceRender: true,
          destroyInactiveTabPane: true,
        };
      })
    );
  }, [tabRepositories]);

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
          value={isEmpty(item) ? t("CM.txt_create") : item?.name}
          status={item?.code}
          isShowDot={false}
          isShowBorder={true}
        />
      </div>
    );
  };

  return (
    <ContractTerminationDetailHookContext.Provider
      value={{ ...contextValue } as unknown as ContractTerminationContextModel}
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
          isLoading={loading}
          loadingButton={contextValue?.loadingButtonConfirm}
          errorMessage={contextValue?.modelSelected?.errorMessage}
          onApply={contextValue?.handleApplyButtonInConfirmModal}
          onCancel={() => contextValue?.setModelSelected(null)}
        />
      ) : null}
    </ContractTerminationDetailHookContext.Provider>
  );
};

export default ContractTerminationView;
