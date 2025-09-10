/* eslint-disable import/no-unresolved */
import { SaveIcon, SendIcon } from "assets/icons";
import classNames from "classnames";
import { LoadingCM, ModalImportFileError, ModalSubmitError } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { listProposalStatusEnum } from "config/const";
import { isEqual } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { ProposalCreateModel } from "models/Proposal";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import React from "react";
import { Button, Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useTranslation } from "react-i18next";
import { proposalRepository } from "../ProposalRepository";
import {
  ProposalCreateHookContext,
  useProposalCreateHook,
} from "./ProposalCreateHook";
import { useProposalSignFormHook } from "./ProposalSignFormHook";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const ProposalCreate = () => {
  const [translate] = useTranslation();
  const {
    tabRepositories,
    //contextValue
    breadcrumbs,
    loading,
    errorModalImport,
    errorsModal,
    title,
    setErrorsModal,
    setErrorModalImport,
    ...contextValue
  } = useProposalCreateHook({
    isDetail: false,
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
    setErrorsModal
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
          forceRender: true,
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
    // if (contextValue?.model?.isSignform) {
    handleOpenSigningForm();
    // }
    // else contextValue.handleSave({});
  };

  return (
    <>
      <ProposalCreateHookContext.Provider
        value={{ ...contextValue } as ProposalCreateModel}
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
        {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
          <ModalSubmitError
            errors={errorsModal?.errors}
            onClose={() => setErrorsModal({ type: "NONE" })}
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
            haveDigitalSigining
            tempateType={SIGN_PROCESS_TYPE.PURCHASE_PROPOSAL}
          />
        )}
      </ProposalCreateHookContext.Provider>
    </>
  );
};

export default ProposalCreate;
