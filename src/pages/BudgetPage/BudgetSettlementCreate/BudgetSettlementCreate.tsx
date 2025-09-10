import TrashSvg from "assets/icons/CostLine/ic_trash.svg";
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { listStatusEnum } from "config/const";
import { GeneralActionEnum } from "core/services/service-types";
import _, { isNil, lte } from "lodash";
import React, { useMemo } from "react";
import { ModalConfirm, Tag } from "react-components-design-system";
import { BudgetConfirmModal } from "../BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import "./BudgetSettlementCreate.scss";
import {
  BudgetSettlementContext,
  useBudgetSettlementCreateHook,
} from "./BudgetSettlementCreateHook";
import { GeneralInformation, GroupAction } from "./Components";
import { ProjectModal } from "./Components/ProjectModal/ProjectModal";
import { useSignFormHook } from "pages/SignProcess/useSignFormHook";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { budgetSettlementRepository } from "./BudgetSettlementRepository";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const BudgetSettlementCreate = () => {
  const {
    breadcrumbs,
    translate,
    title,
    deleteProject,
    isEditable,
    isLoadingModal,
    ...contextValue
  } = useBudgetSettlementCreateHook();

  const description = useMemo(() => {
    const isSingleDelete = !isNil(contextValue.modalType?.id);
    if (isSingleDelete) {
      return translate("BG.title_confirm_delete_project", {
        total: 0,
      })
        .replace("0", "")
        .replace("1", "");
    }

    const shouldReplace = lte(contextValue.selectedRowKeys.length, 1);
    const textTranslated = translate("BG.title_confirm_delete_project", {
      total: contextValue.selectedRowKeys.length,
    });

    if (shouldReplace) {
      return textTranslated.replace("0", "").replace("1", "");
    }
    return textTranslated.trim();
  }, [
    contextValue.modalType?.id,
    contextValue.selectedRowKeys.length,
    translate,
  ]);

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
    useSignFormHook();

  const handleSendRequest = React.useCallback(() => {
    contextValue.saveAndSend(false, null);
  }, [contextValue]);

  return (
    <>
      <BudgetSettlementContext.Provider value={contextValue}>
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
        {contextValue.modalType.type === "ADD_PROJECT" ? (
          <ProjectModal
            type={contextValue.model.budgetSettlementTypeValue?.id}
            setModal={contextValue.setModalType}
            showModal={true}
            addedProjectIds={contextValue.model.budgetIds?.map(
              (item) => item.id as string
            )}
            callback={(list) =>
              contextValue.dispatchModel({
                type: GeneralActionEnum.UPDATE,
                payload: {
                  ...contextValue.model,
                  budgetIds: _.uniqBy(
                    [...(contextValue.model?.budgetIds || []), ...list],
                    "id"
                  ),
                },
              })
            }
          />
        ) : null}
        <ModalConfirm
          open={contextValue.modalType.type === "DELETE"}
          centered
          title={description}
          titleButtonApply={translate("CL.yes_txt")}
          titleButtonCancel={translate("CL.no_txt")}
          icon={<img src={TrashSvg} alt="" width={72} height={72} />}
          content={translate("BG.message_delete_project")}
          handleCancel={() =>
            contextValue.setModalType({ type: "NONE", id: null })
          }
          handleSave={deleteProject}
        />
      </BudgetSettlementContext.Provider>
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
      {contextValue.model?.id && (
        <SignProcessModal
          isOpen={openSigningForm}
          loadingSend={contextValue.loading}
          onCancel={handleCancelSigningForm}
          sendRequest={handleSendRequest}
          requestId={contextValue.model?.id}
          requestField={"id"}
          repository={budgetSettlementRepository}
          tempateType={SIGN_PROCESS_TYPE.BUDGET_SETTLEMENT}
        />
      )}
    </>
  );
};

export default BudgetSettlementCreate;
