/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM, ModalImportFileError } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { RepoStateDetail } from "models/Payment";
import React from "react";
import { Button, Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";

import { listProposalStatusEnum } from "config/const";
import { ProposalCreateModel } from "models/Proposal";

import {
  ProposalCreateHookContext,
  useProposalCreateHook,
} from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { useTranslation } from "react-i18next";
import { SaveIcon, SendIcon } from "assets/icons";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { useProposalSignFormHook } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalSignFormHook";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const ProposalAdjustDetail = () => {
  const [translate] = useTranslation();
  const {
    tabRepositories,
    //contextValue
    breadcrumbs,
    loading,
    errorModalImport,
    title,
    setErrorModalImport,

    ...contextValue
  } = useProposalCreateHook({
    isDetail: false,
    isAdjust: true,
  });

  const {
    openSigningForm,
    handleCancelSigningForm,
    handleOpenSigningForm,
    handleSendRequest,
  } = useProposalSignFormHook(
    contextValue.model,
    contextValue.handleChangeAllField,
    proposalRepository.save,
    contextValue.handleConvertRequestBodyProposal,
    contextValue.handleGoMaster,
    contextValue.setLoading,
    contextValue.setErrorsModal
  );

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
    const status = contextValue.model?.status;
    const item = listProposalStatusEnum.find((type) => type.id === status);
    return (
      <Tag
        value={item?.name || translate("BG.newly_created")}
        className="m-l--2xs"
        size="sm"
        isShowBorder
        isShowDot={false}
      />
    );
  };

  const onPressSaveDraft = () => {
    contextValue.handleSave({
      isDraft: true,
    });
  };

  const onPressSave = () => {
    handleOpenSigningForm();
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
            <div className="group-action">
              <Button
                icon={<img src={SaveIcon} alt="img" />}
                iconPlace="left"
                type="secondary"
                size="lg"
                onClick={onPressSaveDraft}
              >
                {translate("BG.save_draft")}
              </Button>
              <Button
                icon={<img src={SendIcon} alt="img" />}
                iconPlace="left"
                type="primary"
                size="lg"
                onClick={onPressSave}
              >
                {translate("PP.submit_for_approval")}
              </Button>
            </div>
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
        {errorModalImport?.show && (
          <ModalImportFileError
            errors={errorModalImport?.message}
            onClose={() => setErrorModalImport({ show: false })}
          />
        )}

        {contextValue.model?.id != null && contextValue.model?.id && (
          <SignProcessModal
            isOpen={openSigningForm}
            loadingSend={loading}
            onCancel={handleCancelSigningForm}
            sendRequest={handleSendRequest}
            requestId={contextValue.model?.id}
            requestField={"id"}
            repository={proposalRepository}
            tempateType={SIGN_PROCESS_TYPE.PURCHASE_PROPOSAL_ADJUSTMENT}
          />
        )}
      </ProposalCreateHookContext.Provider>
    </>
  );
};

export default ProposalAdjustDetail;
