import { SaveIcon, SendIcon } from "assets/icons";
import { useContext } from "react";
import { Button, OverflowMenu } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../PurchaseRequestDetailHook";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { purchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";
import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { isEqual } from "lodash";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { usePurchaseRequestSignFormHook } from "../../PurchaseRequestSignFormHook";
import { ListOverflowMenu } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/constants";

enum ConfirmModalType {
  DELETE = "DELETE",
  CANCEL = "CANCEL",
}

const GroupAction = () => {
  const {
    model,
    handleSave,
    setModelSelected,
    handleChangeSingleField,
    ...contextValue
  } = useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);
  const [translate] = useTranslation();

  const {
    openSigningForm,
    handleCancelSigningForm,
    handleOpenSigningForm,
    handleSendRequest,
  } = usePurchaseRequestSignFormHook(
    model,
    contextValue.handleChangeAllField,
    purchaseRequestRepository.save,
    contextValue.convertPurchaseRequestBody,
    contextValue.handleGoMaster,
    contextValue.setLoading,
    contextValue.setErrorsModal
  );

  const onPressSave = () => {
    handleOpenSigningForm();
  };

  const onPressSaveDraft = () => {
    handleSave({
      isDraft: true,
    });
  };

  const list: ListOverflowMenu[] = [
    // Cancel
    {
      title: translate("BG.txt_cancel_vote"),
      action: () =>
        setModelSelected({
          type: ConfirmModalType.CANCEL,
          model: model,
        }),
      isShow: model?.canCancel,
    },
    // Delete
    {
      title: translate("BG.txt_delete_vote"),
      action: () =>
        setModelSelected({
          type: ConfirmModalType.DELETE,
          model: model,
        }),
      isShow: model?.canDelete,
    },
  ];

  return (
    <div className="group-action">
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={purchaseRequestRepository.actions}
        handleGoMaster={contextValue.handleGoMaster}
        menu={translate("CM.menu_title_proposal")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />

      {(model?.canCancel || model?.canDelete) && (
        <OverflowMenu isActionRowTable={false} list={list} />
      )}

      <Button
        icon={<img src={SaveIcon} alt="img" />}
        iconPlace="left"
        type="secondary"
        size="lg"
        onClick={onPressSaveDraft}
        disabled={model?.loadingFileBudget}
      >
        {translate("BG.save_draft")}
      </Button>
      <Button
        icon={<img src={SendIcon} alt="img" />}
        iconPlace="left"
        type="primary"
        size="lg"
        onClick={onPressSave}
        disabled={model?.loadingFileBudget}
      >
        {translate("PP.submit_for_approval")}
      </Button>

      {model?.id != null && model?.id && (
        <SignProcessModal
          isOpen={openSigningForm}
          loadingSend={model?.loading}
          onCancel={handleCancelSigningForm}
          sendRequest={handleSendRequest}
          requestId={model?.id}
          requestField={"id"}
          repository={purchaseRequestRepository}
          haveDigitalSigining
          tempateType={
            model.isAdjust
              ? SIGN_PROCESS_TYPE.PURCHASE_REQUEST_ADJUSTMENT
              : SIGN_PROCESS_TYPE.PURCHASE_REQUEST
          }
        />
      )}
    </div>
  );
};

export default GroupAction;
