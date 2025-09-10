import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { listStatusEnum } from "config/const";
import { isNil } from "lodash";
import { Tag } from "react-components-design-system";
import { BudgetConfirmModal } from "../BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { FileImportErrorModal } from "../FileImportErrorModal/FileImportErrorModal";
import "./BudgetCreate.scss";
import { CreateBudgetContext, useBudgetCreateHook } from "./BudgetCreateHook";
import GeneralInformation from "./Components/GeneralInformation/GeneralInformation";
import GroupAction from "./Components/GroupAction/GroupAction";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { useBudgetSignFormHook } from "./BudgetSignFormHook";
import React from "react";
import { budgetRepository } from "../BudgetRepository";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const BudgetCreate = () => {
  const {
    breadcrumbs,
    translate,
    isEditable,
    isLoadingModal,
    importErrorModal,
    title,
    setImportErrorModal,
    ...contextValue
  } = useBudgetCreateHook({});

  const renderStatusDetail = () => {
    const status = contextValue.model?.status;

    const item = listStatusEnum.find((type) => type.id === status);
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

  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useBudgetSignFormHook();

  const handleSendRequest = React.useCallback(() => {
    contextValue.handleSave({
      isDraft: false,
      callbackFc: null,
      isSend: true,
    });
  }, [contextValue]);

  return (
    <>
      <CreateBudgetContext.Provider value={contextValue as any}>
        <div className={classNames("page-content-create", "page-content")}>
          <PageHeader
            title={title}
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderStatusDetail()}
          >
            <GroupAction
              isEditable={isEditable.current}
              handleOpenSigningForm={handleOpenSigningForm}
            />
          </PageHeader>
          <div className="tab__master">
            <GeneralInformation />
          </div>
          {contextValue.loading && <LoadingCM />}
        </div>
      </CreateBudgetContext.Provider>
      {/* Modal */}
      {!isNil(contextValue.modelSelected?.model) ? (
        <BudgetConfirmModal
          model={contextValue.modelSelected.model}
          type={contextValue.modelSelected.type}
          isLoading={isLoadingModal}
          errorMessage={contextValue.modelSelected?.errorMessage}
          onApply={contextValue.handleApplyButtonInConfirmModal}
          onCancel={() => contextValue.setModelSelected(null)}
        />
      ) : null}
      {importErrorModal.open ? (
        <FileImportErrorModal
          sheetErrors={importErrorModal?.value}
          onDismiss={() =>
            setImportErrorModal({ open: false, value: undefined })
          }
        />
      ) : null}
      {contextValue.model?.id && (
        <SignProcessModal
          isOpen={openSigningForm}
          loadingSend={contextValue.loading}
          onCancel={handleCancelSigningForm}
          sendRequest={handleSendRequest}
          requestId={contextValue.model?.id}
          requestField={"id"}
          repository={budgetRepository}
          tempateType={SIGN_PROCESS_TYPE.BUDGET}
        />
      )}
    </>
  );
};

export default BudgetCreate;
