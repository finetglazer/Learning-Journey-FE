/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import PageHeader from "components/PageHeader/PageHeader";
import { RepoStateDetail } from "models/Payment";
import React, { useMemo } from "react";
import { Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";

import { LoadingCM, ModalSubmitError } from "components";
import { isNil } from "lodash";
import isEqual from "lodash/isEqual";
import { listContractStatus } from "pages/PurchasePage/constants";
import {
  ContractDetailHookContext,
  useContractDetailHook,
} from "pages/PurchasePage/ContractPage/ContractDetailHook";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import { ContractPrincipleConfirmModal } from "../ContractPrincipleMaster/ContractPrincipleConfirmModal/ContractPrincipleConfirmModal";
import GroupAction from "./Components/GroupAction";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { useSignFormHook } from "pages/SignProcess/useSignFormHook";
import { contractPrincipleRepository } from "../ContractPrincipleRepository";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const ContractPrincipleDetail = () => {
  const [translate] = useTranslationContract();
  const {
    loading,
    tabRepositories,
    breadcrumbs,
    errorsModal,
    principleTitle,
    ...contextValue
  } = useContractDetailHook({
    isDetail: false,
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

  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useSignFormHook();

  const handleSendRequest = React.useCallback(() => {
    contextValue.handleSave({ isDraft: false });
  }, [contextValue]);

  return (
    <ContractDetailHookContext.Provider value={contextValue}>
      <div className={classNames("page-content")}>
        <PageHeader
          title={principleTitle}
          breadcrumbs={breadcrumbs}
          hasTabs={true}
          rightComponentTitle={renderStatusDetail()}
          isShowBackButton
        >
          <GroupAction handleOpenSigningForm={handleOpenSigningForm} />
        </PageHeader>
        {isEqual(errorsModal.type, "SUBMIT_FAIL") &&
          errorsModal?.errors?.length && (
            <ModalSubmitError
              errors={errorsModal.errors}
              onClose={() => contextValue.setErrorsModal({ type: "NONE" })}
              title={translate(
                "CT.create_contract.title.cant_create_form_principle"
              )}
            />
          )}
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

      {/* Modal */}
      {!isNil(contextValue.selectedModal?.model) ? (
        <ContractPrincipleConfirmModal
          model={contextValue.selectedModal.model}
          type={contextValue.selectedModal.type}
          isLoading={contextValue?.loadingModal}
          errorMessage={contextValue.selectedModal?.errorMessage}
          onApply={contextValue.handleApplyButtonInConfirmModal}
          onCancel={() => contextValue.setSelectedModal(null)}
        />
      ) : null}
      {contextValue.model?.id && (
        <SignProcessModal
          isOpen={openSigningForm}
          loadingSend={loading}
          onCancel={handleCancelSigningForm}
          sendRequest={handleSendRequest}
          requestId={contextValue.model?.id}
          requestField={"id"}
          repository={contractPrincipleRepository}
          tempateType={SIGN_PROCESS_TYPE.PRINCIPLE_CONTRACT}
        />
      )}
    </ContractDetailHookContext.Provider>
  );
};

export default ContractPrincipleDetail;
