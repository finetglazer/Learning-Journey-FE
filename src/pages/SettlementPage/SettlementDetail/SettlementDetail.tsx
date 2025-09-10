/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import PageHeader from "components/PageHeader/PageHeader";
import { listStatusEnum } from "config/const";
import { isEmpty, isEqual, isNull } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useHistory, useParams } from "react-router-dom";
import {
  SettlementHookContext,
  useSettlementDetailHook,
} from "./SettlementDetailHook";
import GroupAction from "../Components/GroupAction/GroupAction";
import { SettlementHookModel, TYPE_PAGE } from "models/Settlement";
import React, { useMemo } from "react";
import ModalActionConfirm from "../SettlementMaster/SettlementMasterTab/components/ModalActionConfirm";

const SettlementDetail = () => {
  const { id: idDetail } = useParams<{ id: string }>();

  const {
    loading,
    breadcrumbs,
    tabRepositories,
    errorsModal,
    setErrorsModal,
    setTabKey,
    tabKey,
    ...contextValue
  } = useSettlementDetailHook(isEmpty(idDetail) ? undefined : TYPE_PAGE?.EDIT);
  const history = useHistory();

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
    let status = -1; //is init status
    const isNotInit = isEmpty(contextValue?.model?.status);
    if (isNotInit) {
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

  const handleChangeTabs = (key: string) => {
    setTabKey(key);
    const url = history.location.pathname + `?tabKey=${key}`;
    history.replace(url, contextValue?.model);
  };

  return (
    <>
      <SettlementHookContext.Provider
        value={{ ...contextValue } as unknown as SettlementHookModel}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={breadcrumbs[breadcrumbs.length - 1]?.name}
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderTag()}
            hasTabs={true}
          >
            <GroupAction />
          </PageHeader>
          <div className="tab__master">
            <Tabs
              className=""
              tabPosition="top"
              mode="line"
              items={tabItems}
              destroyInactiveTabPane={true}
              onChange={(key) => handleChangeTabs(key)}
              activeKey={tabKey}
            />
          </div>
          {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
            <ModalSubmitError
              errors={errorsModal?.errors}
              onClose={() => setErrorsModal({ type: "NONE" })}
            />
          )}
        </div>
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
    </>
  );
};

export default SettlementDetail;
