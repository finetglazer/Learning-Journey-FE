import { LoadingCM, ModalSubmitError } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import isEqual from "lodash/isEqual";
import { ActiveTabKeys } from "models/Contract";
import { RepoStateDetail } from "models/Payment";
import { listContractStatus } from "pages/PurchasePage/constants";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { useSignFormHook } from "pages/SignProcess/useSignFormHook";
import React, { useMemo } from "react";
import { Tabs, Tag } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import {
  ContractDetailHookContext,
  useContractDetailHook,
} from "../ContractDetailHook";
import { contractRepository } from "../ContractRepository";
import useTranslationContract from "../useTranslationContract";
import ContractDetailGroupAction from "./Components/GroupAction/GroupAction";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const ContractDetail = () => {
  const [translate] = useTranslationContract();
  const {
    loading,
    tabRepositories,
    breadcrumbs,
    titlePageHeader,
    errorsModal,
    activeTabKey,
    setActiveTabKey,
    ...contextValue
  } = useContractDetailHook({
    isDetail: false,
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

  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useSignFormHook();

  const handleSendRequest = React.useCallback(() => {
    contextValue.handleSave({ isDraft: false });
  }, [contextValue]);

  return (
    <ContractDetailHookContext.Provider value={contextValue}>
      <div className="page-content contract-wrapper">
        <PageHeader
          title={titlePageHeader}
          breadcrumbs={breadcrumbs}
          rightComponentTitle={renderStatusDetail()}
          isShowBackButton
          hasTabs
        >
          <ContractDetailGroupAction
            handleOpenSigningForm={handleOpenSigningForm}
          />
        </PageHeader>
        {isEqual(errorsModal.type, "SUBMIT_FAIL") &&
          errorsModal?.errors?.length && (
            <ModalSubmitError
              errors={errorsModal.errors}
              onClose={() => contextValue.setErrorsModal({ type: "NONE" })}
              title={translate("CT.create_contract.title.cant_create_form")}
            />
          )}
        <div className="tab__master">
          <Tabs
            className="payment_custom_form"
            tabPosition="top"
            mode="line"
            items={tabItems}
            destroyInactiveTabPane={true}
            activeKey={activeTabKey}
            onChange={(activeKey: string) =>
              setActiveTabKey(activeKey as ActiveTabKeys)
            }
          />
        </div>
      </div>
      {contextValue.model?.id && (
        <SignProcessModal
          isOpen={openSigningForm}
          loadingSend={loading}
          onCancel={handleCancelSigningForm}
          sendRequest={handleSendRequest}
          requestId={contextValue.model?.id}
          requestField="id"
          repository={contractRepository}
          tempateType={SIGN_PROCESS_TYPE.CONTRACT}
        />
      )}
      {loading && <LoadingCM />}
    </ContractDetailHookContext.Provider>
  );
};

export default ContractDetail;
