import { DeleteIcon, EditIcon, RejectIcon } from "assets/icons";
import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { authorizationService } from "core/services/common-services/authorization-service";
import { isEqual, isNull } from "lodash";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { PurchaseRequestDetailHookContext } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestDetail/PurchaseRequestDetailHook";
import {
  ConfirmModalType,
  PurchaseRequestConfirmModal,
} from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestMaster/PurchaseRequestConfirmModal/PurchaseRequestConfirmModal";
import { purchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";

const GroupAction = () => {
  const {
    model,
    handlePressEdit,
    loadingModal,
    modelSelected,
    setModelSelected,
    handleApplyButtonInConfirmModal,
    ...contextValue
  } = useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  const [translate] = useTranslation();

  const { validAction } =
    authorizationService.useAuthorizedAction("PURCHASE_REQUEST");

  const { canDelete, canEdit, canCancel } = model;

  return (
    <div className="group-action">
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={contextValue?.handleChangeSingleField}
        handleActions={purchaseRequestRepository.actions}
        handleGoMaster={contextValue?.handleGoMaster}
        menu={translate("CM.menu_title_purchase_request")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />

      {canDelete && validAction("DELETE") && (
        <Button
          icon={<img src={DeleteIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() =>
            setModelSelected({ type: ConfirmModalType.DELETE, model: model })
          }
        >
          {translate("PR.btn_delete")}
        </Button>
      )}
      {canCancel && validAction("DELETE") && (
        <Button
          icon={<img src={RejectIcon} alt="img" />}
          iconPlace="left"
          type="secondary"
          size="lg"
          onClick={() =>
            setModelSelected({ type: ConfirmModalType.CANCEL, model: model })
          }
        >
          {translate("PR.btn_cancel")}
        </Button>
      )}

      {canEdit && (
        <Button
          icon={<img src={EditIcon} alt="img" />}
          iconPlace="left"
          type="primary"
          size="lg"
          onClick={handlePressEdit}
        >
          {translate("PR.btn_edit")}
        </Button>
      )}

      {!isNull(modelSelected) ? (
        <PurchaseRequestConfirmModal
          type={modelSelected.type}
          model={modelSelected.model}
          errorMessage={modelSelected.errorMessage}
          onApply={handleApplyButtonInConfirmModal}
          onCancel={() => setModelSelected(null)}
          isLoading={loadingModal}
        />
      ) : null}
    </div>
  );
};

export default GroupAction;
