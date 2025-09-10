/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { listTemporaryImportAssetStatusEnum } from "config/const";
import { isEmpty } from "lodash";
import { RepoStateDetail } from "models/Payment";
import React from "react";
import { Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import GroupActionView from "./Components/GroupActionView/GroupActionView";
import {
  TemporaryImportAssetViewHookContext,
  useTemporaryImportAssetViewHook,
} from "./TemporaryImportAssetViewHook";

const TemporaryImportAssetDetail = () => {
  const contextValue = useTemporaryImportAssetViewHook();

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      contextValue?.tabRepositoriesView &&
      contextValue?.tabRepositoriesView.length > 0 &&
      contextValue?.tabRepositoriesView.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
        };
      })
    );
  }, [contextValue?.tabRepositoriesView]);

  const renderTag = () => {
    let status = -1;
    if (isEmpty(contextValue?.model?.status)) {
      status = contextValue?.model?.status;
    }
    const item = listTemporaryImportAssetStatusEnum.find(
      (type) => type.id === status
    );
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
    <>
      <TemporaryImportAssetViewHookContext.Provider
        value={{ ...contextValue } as any}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={
              isEmpty(contextValue?.model?.id)
                ? contextValue.translate(
                    "TIA.temporary_import_asset_create_title"
                  )
                : `${contextValue.translate(
                    "TIA.title_temporary_import_asset_view",
                    { code: contextValue?.model?.code }
                  )}`
            }
            breadcrumbs={contextValue?.breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderTag()}
            hasTabs={true}
          >
            <GroupActionView />
          </PageHeader>
          <div className="tab__master">
            <Tabs
              className=""
              tabPosition="top"
              mode="line"
              size={"small"}
              items={tabItems}
              destroyInactiveTabPane={true}
            />
          </div>
        </div>
        {contextValue?.loading && <LoadingCM />}
      </TemporaryImportAssetViewHookContext.Provider>
    </>
  );
};

export default TemporaryImportAssetDetail;
