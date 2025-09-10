import TrashSvg from "assets/icons/CostLine/ic_trash.svg";
import { useContext } from "react";
import { ModalConfirm } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  GLAccountMasterContext,
  GLAccountMasterContextModel,
} from "../GLAccountMasterHook";

export const GLAccountModalDelete = () => {
  const {
    isOpenModalDelete,
    handleCloseModalDelete,
    deleteType,
    selectedRowKeys,
    handleDelete,
    handleBulkDelete,
  } = useContext<GLAccountMasterContextModel>(GLAccountMasterContext);
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
          ? translate("glAccounts.deleteTitle")
          : `${translate("glAccounts.bulkDeleteTitle1")} ${
              selectedRowKeys?.length || 0
            } ${translate("glAccounts.bulkDeleteTitle2")}`
      }
      content={translate("glAccounts.deleteContent")}
    />
  );
};
