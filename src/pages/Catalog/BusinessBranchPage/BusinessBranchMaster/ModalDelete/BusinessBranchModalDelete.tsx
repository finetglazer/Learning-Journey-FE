import TrashSvg from "assets/icons/CostLine/ic_trash.svg";
import { useContext } from "react";
import { ModalConfirm } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  BusinessBranchMasterContext,
  BusinessBranchMasterContextModel,
} from "../BusinessBranchMasterHook";

export const BusinessBranchModalDelete = () => {
  const {
    isOpenModalDelete,
    handleCloseModalDelete,
    deleteType,
    selectedRowKeys,
    handleDelete,
    handleBulkDelete,
  } = useContext<BusinessBranchMasterContextModel>(BusinessBranchMasterContext);
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
          ? translate("businessBranchs.deleteTitle")
          : `${translate("businessBranchs.bulkDeleteTitle1")} ${
              selectedRowKeys?.length || 0
            } ${translate("businessBranchs.bulkDeleteTitle2")}`
      }
      content={translate("businessBranchs.deleteContent")}
    />
  );
};
