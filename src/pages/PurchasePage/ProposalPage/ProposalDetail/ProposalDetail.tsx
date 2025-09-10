/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM, ModalSubmitError } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { listProposalStatusEnum } from "config/const";
import { RepoStateDetail } from "models/Payment";
import { ETabKeys, ProposalCreateModel } from "models/Proposal";
import React, { useEffect, useState } from "react";
import { Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useTranslation } from "react-i18next";
import {
  ProposalCreateHookContext,
  useProposalCreateHook,
} from "../ProposalCreate/ProposalCreateHook";
import GroupActionDetail from "./GroupAction/GroupActionDetail";
import { isEqual, isNil } from "lodash";
import { ProposalConfirmModal } from "../ProposalMaster/ProposalConfirmModal/ProposalConfirmModal";

const ProposalDetail = () => {
  const [translate] = useTranslation();
  const {
    tabRepositories,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    breadcrumbs,
    loading,
    isLoadingModal,
    activeTabKey,
    setActiveTabKey,
    errorsModal,
    setErrorsModal,
    ...contextValue
  } = useProposalCreateHook({
    isDetail: true,
  });
  const [codeProposal, setCodeProposal] = useState("");

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

  useEffect(() => {
    if (contextValue?.model?.code) {
      setCodeProposal(contextValue.model.code);
    }
  }, [contextValue]);

  return (
    <>
      <ProposalCreateHookContext.Provider
        value={{ ...contextValue, setModelSelected } as ProposalCreateModel}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={`${translate("PP.proposal")} - ${codeProposal}`}
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderStatusDetail()}
            hasTabs={true}
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
          onCancel={() => setModelSelected(null)}
        />
      ) : null}

      {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
        <ModalSubmitError
          errors={errorsModal?.errors}
          onClose={() => setErrorsModal({ type: "NONE" })}
        />
      )}
    </>
  );
};

export default ProposalDetail;
