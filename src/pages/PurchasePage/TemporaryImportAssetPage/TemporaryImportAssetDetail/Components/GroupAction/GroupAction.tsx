import { RejectIcon, SaveIcon, SendIcon } from "assets/icons";
import { useContext, useEffect, useState } from "react";
import { Button, OverflowMenu } from "react-components-design-system";

import { isNull } from "lodash";
import {
  ConfirmModalType,
  TemporaryImportAssetModel,
  TemporaryImportAssetTypeModel,
} from "models/TemporaryImportAsset/TemporaryImportAsset";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import ModalActionConfirm from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetMaster/TemporaryImportAssetMasterTab/components/ModalActionConfirm";
import { temporaryImportAssetRepository } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetRepository";
import { useParams } from "react-router-dom";
import SignProcessModal from "../../../../../SignProcess/SignProcessMaster";
import { useSignFormHook } from "../../../../../SignProcess/useSignFormHook";
import { TemporaryImportAssetDetailHookContext } from "../../TemporaryImportAssetDetailHook";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const GroupAction = () => {
  const {
    model,
    translate,
    handleSave,
    handleUpdate,
    modelSelected,
    setModelSelected,
    loadingModal,
    loadingButtonConfirm,
    handleApplyButtonInConfirmModal,
    loading,
  } = useContext<TemporaryImportAssetModel>(
    TemporaryImportAssetDetailHookContext
  );
  const { id: idDetail } = useParams<{ id: string }>();

  const handleOpenModalCancel = (dataModel: TemporaryImportAssetTypeModel) => {
    setModelSelected({
      type: ConfirmModalType.CANCEL,
      model: dataModel,
    });
  };
  const handleOpenModalDelete = (dataModel: TemporaryImportAssetTypeModel) => {
    setModelSelected({
      type: ConfirmModalType.DELETE,
      model: dataModel,
    });
  };

  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useSignFormHook();

  const handleSendRequest = () => {
    handleUpdate(false, null);
  };

  const getAction = (model: TemporaryImportAssetTypeModel) => ({
    canSaveDraft: {
      isShow: true,
      icon: <img src={SaveIcon} alt="img" />,
      label: translate("CM.btn_save_draft"),
      type: "secondary",
      onClick: () => handleUpdate(true, null),
    },
    canWaitingForApprove: {
      isShow: true,
      icon: <img src={SendIcon} alt="img" />,
      label: translate("CM.send_approve"),

      type: "primary",
      onClick: () => handleUpdate(true, handleOpenSigningForm),
    },
    canCancel: {
      isShow: model?.canCancel,
      icon: <img src={RejectIcon} alt="img" />,
      label: translate("PR.btn_cancel"),
      type: "secondary",
      onClick: () => handleOpenModalCancel(model),
    },
    canDelete: {
      isShow: model?.canDelete,
      icon: <img src={RejectIcon} alt="img" />,
      label: translate("CM.txt_delete"),
      type: "secondary",
      onClick: () => handleOpenModalDelete(model),
    },
  });

  const [filteredActions, setFilteredActions] = useState<
    ReturnType<typeof getAction>[keyof ReturnType<typeof getAction>][]
  >([]);

  useEffect(() => {
    const allActionsObj = getAction(model);
    const filtered = Object.values(allActionsObj).filter((item) => item.isShow);
    setFilteredActions(filtered);
  }, [model, translate]);

  const numberOfActions = filteredActions.length;

  const renderButtonActions = () => {
    if (numberOfActions < 4) {
      const sortedActions = filteredActions.sort((a, b) => {
        if (
          a.label === translate("PR.btn_cancel") ||
          a.label === translate("CM.txt_delete")
        )
          return -1;
        if (
          b.label === translate("PR.btn_cancel") ||
          b.label === translate("CM.txt_delete")
        )
          return 1;
        return 0;
      });

      return sortedActions.map((action, idx) => (
        <Button
          key={idx}
          icon={action.icon}
          iconPlace="left"
          type={action.type as any}
          size="lg"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ));
    } else {
      const firstThree = filteredActions.slice(0, 2);
      const restActions = filteredActions.slice(2);

      const list: ListOverflowMenu[] = restActions.map((item) => ({
        title: item.label,
        action: item.onClick,
        isShow: true,
      }));

      return (
        <>
          {/* Nút OverflowMenu */}
          {list.length > 0 && (
            <OverflowMenu isActionRowTable={false} list={list} />
          )}
          {firstThree.map((action, idx) => (
            <Button
              key={idx}
              icon={action.icon}
              iconPlace="left"
              type={action.type as any}
              size="lg"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </>
      );
    }
  };

  return (
    <div className="group-action">
      {!idDetail ? (
        <div className="d-flex gap-2">
          <Button
            icon={<img src={SaveIcon} alt="img" />}
            iconPlace="left"
            type="secondary"
            size="lg"
            onClick={() => handleSave(true, null)}
          >
            {translate("CM.btn_save_draft")}
          </Button>
          <Button
            icon={<img src={SendIcon} alt="img" />}
            iconPlace="left"
            type="primary"
            size="lg"
            onClick={() => handleSave(true, handleOpenSigningForm)}
          >
            {translate("CM.send_approve")}
          </Button>
        </div>
      ) : (
        <div className="d-flex gap-2">{renderButtonActions()}</div>
      )}

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
      {(model?.id || idDetail) && (
        <SignProcessModal
          isOpen={openSigningForm}
          loadingSend={loading}
          onCancel={handleCancelSigningForm}
          sendRequest={handleSendRequest}
          requestId={model?.id}
          requestField={"id"}
          repository={temporaryImportAssetRepository}
          tempateType={SIGN_PROCESS_TYPE.TEM_RECEIPT}
        />
      )}
    </div>
  );
};

export default GroupAction;
