import { DeleteIcon, EditIcon, RejectIcon } from "assets/icons";
import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import {
  TEMPORARY_IMPORT_ASSET_DETAIL_ROUTE,
  TEMPORARY_IMPORT_ASSET_MASTER_ROUTE,
} from "config/route-const";
import { isEqual, isNull } from "lodash";
import {
  ConfirmModalType,
  TemporaryImportAssetViewModel,
} from "models/TemporaryImportAsset/TemporaryImportAsset";
import ModalActionConfirm from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetMaster/TemporaryImportAssetMasterTab/components/ModalActionConfirm";
import { temporaryImportAssetRepository } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetRepository";
import { useContext, useEffect } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { TemporaryImportAssetViewHookContext } from "../../TemporaryImportAssetViewHook";

export enum Approve_Type {
  RETURN,
  DECLINED,
  APPROVE,
}

const APPROVE_TYPE = "approveType";
const GroupActionView = () => {
  const history = useHistory();
  const [translate] = useTranslation();

  const {
    model,
    loadingModal,
    modelSelected,
    setModelSelected,
    loadingButtonConfirm,
    handleApplyButtonInConfirmModal,
    handleChangeSingleField,
  } = useContext<TemporaryImportAssetViewModel>(
    TemporaryImportAssetViewHookContext
  );

  const { hasFeedBack } = useOpinionFeedbackHooks();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const approveType = queryParams.get(APPROVE_TYPE);

  useEffect(() => {
    switch (approveType) {
      case model?.canApprove && Approve_Type.RETURN.toString():
        setModelSelected({
          type: ConfirmModalType.RETURN,
          model: model,
        });
        break;
      case model?.canApprove && Approve_Type.DECLINED.toString():
        setModelSelected({
          type: ConfirmModalType.REJECT,
          model: model,
        });
        break;
      case Approve_Type.APPROVE.toString():
        break;
    }
  }, [approveType, model?.id, model?.canDeclined, model?.canRefuse, model]);

  if (hasFeedBack) {
    return <ButtonOpinion />;
  }

  const { canDelete, canEdit, canReturn, canCancel } = model;

  const handleGoMaster = () => {
    history.push(TEMPORARY_IMPORT_ASSET_MASTER_ROUTE);
  };

  return (
    <div className="group-action">
      {canDelete && (
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
      {canCancel && (
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
          onClick={() =>
            history.push(TEMPORARY_IMPORT_ASSET_DETAIL_ROUTE + `/${model?.id}`)
          }
        >
          {translate("PR.btn_edit")}
        </Button>
      )}
      <CommandGroupComponent
        model={model}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={temporaryImportAssetRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_temporary_import_asset")}
        hideButtonApprove={isEqual(model?.isOpinionValid, false)}
      />

      {!isNull(modelSelected) ? (
        <ModalActionConfirm
          type={modelSelected?.type}
          model={modelSelected?.model}
          loadingButton={loadingButtonConfirm}
          isLoading={loadingModal}
          errorMessage={modelSelected?.errorMessage}
          onApply={handleApplyButtonInConfirmModal}
          onCancel={() => setModelSelected(null)}
        />
      ) : null}
    </div>
  );
};

export default GroupActionView;
