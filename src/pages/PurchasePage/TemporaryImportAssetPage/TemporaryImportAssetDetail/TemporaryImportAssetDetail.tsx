import { TabsProps } from "antd/lib";
import classNames from "classnames";
import { LoadingCM, ModalSubmitError } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { listPurchasingPlanStatusEnum } from "config/const";
import { isEmpty, isEqual, isUndefined } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { TemporaryImportAssetModel } from "models/TemporaryImportAsset/TemporaryImportAsset";
import { useMemo } from "react";
import { Tabs, Tag } from "react-components-design-system";
import GroupAction from "./Components/GroupAction/GroupAction";
import {
  TemporaryImportAssetDetailHookContext,
  useTemporaryImportAssetDetailHook,
} from "./TemporaryImportAssetDetailHook";
import TemporaryImportAssetGenerationInfoTab from "./TemporaryImportAssetGenerationInfoTab/TemporaryImportAssetGenerationInfoTab";

const TemporaryImportAssetDetail = () => {
  const {
    loading,
    breadcrumbs,
    errorsModal,
    setErrorsModal,
    tabRepositories,
    ...contextValue
  } = useTemporaryImportAssetDetailHook();

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

  const renderTag = () => {
    const status = contextValue?.model?.status;
    const item = listPurchasingPlanStatusEnum.find(
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
      <TemporaryImportAssetDetailHookContext.Provider
        value={{ ...contextValue } as TemporaryImportAssetModel}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={
              isEmpty(contextValue?.idDetail)
                ? contextValue.translate(
                    "TIA.temporary_import_asset_create_title"
                  )
                : `${contextValue.translate(
                    "TIA.temporary_import_asset_title_View"
                  )} ${contextValue?.model?.code}`
            }
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderTag()}
            hasTabs={true}
          >
            <GroupAction />
          </PageHeader>
          <div className="tab__master">
            {isUndefined(contextValue?.idDetail) ? (
              <TemporaryImportAssetGenerationInfoTab />
            ) : (
              <Tabs
                tabPosition="top"
                mode="line"
                size="small"
                items={tabItems}
                destroyInactiveTabPane={true}
              />
            )}
          </div>
        </div>
        {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
          <ModalSubmitError
            errors={errorsModal?.errors}
            onClose={() => setErrorsModal({ type: "NONE" })}
          />
        )}
        {loading && <LoadingCM />}
      </TemporaryImportAssetDetailHookContext.Provider>
    </>
  );
};

export default TemporaryImportAssetDetail;
