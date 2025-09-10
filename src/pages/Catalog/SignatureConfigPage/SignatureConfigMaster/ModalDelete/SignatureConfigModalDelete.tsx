import TrashSvg from "assets/icons/CostLine/ic_trash.svg";
import { useContext } from "react";
import { ModalConfirm } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  SignatureConfigMasterContext,
  SignatureConfigMasterContextModel,
} from "../SignatureConfigMasterHook";

export const SignatureConfigModalDelete = () => {
  const {
    isOpenModalDelete,
    handleCloseModalDelete,
    deleteType,
    selectedRowKeys,
    handleDelete,
    handleBulkDelete,
  } = useContext<SignatureConfigMasterContextModel>(
    SignatureConfigMasterContext
  );
  const [translate] = useTranslation();

  return (
    <ModalConfirm
      centered
      open={isOpenModalDelete}
      titleButtonApply={translate("generalActions.delete")}
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={handleCloseModalDelete}
      handleSave={deleteType === "Single" ? handleDelete : handleBulkDelete}
      icon={<img src={TrashSvg} alt="" width={72} height={72} />}
      title={
        deleteType === "Single"
          ? translate("signatureConfigs.deleteTitle")
          : `${translate("signatureConfigs.bulkDeleteTitle1")} ${
              selectedRowKeys?.length || 0
            } ${translate("signatureConfigs.bulkDeleteTitle2")}`
      }
      content={translate("signatureConfigs.deleteContent")}
    />
  );
};
