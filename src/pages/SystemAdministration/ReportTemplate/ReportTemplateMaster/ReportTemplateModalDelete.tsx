import React, { useContext } from "react";
import { ModalConfirm } from "react-components-design-system";
import TrashSvg from "assets/icons/CostLine/ic_trash.svg";
import {
  ReportTemplateManagementContext,
  ReportTemplateManagementContextProps,
} from "pages/SystemAdministration/ReportTemplate/ReportTemplateManagementHook";
import { useTranslation } from "react-i18next";

const ReportTemplateModalDelete = () => {
  const {
    isOpenModalDelete,
    handleCloseModalDelete,
    deleteType,
    selectedRowKeys,
    handleDelete,
    handleBulkDelete,
  } = useContext<ReportTemplateManagementContextProps>(
    ReportTemplateManagementContext
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
          ? translate("reportTemplates.deleteTitle")
          : `${translate("reportTemplates.bulkDeleteTitle1")} ${
              selectedRowKeys?.length || 0
            } ${translate("reportTemplates.bulkDeleteTitle2")}`
      }
      content={translate("reportTemplates.deleteContent")}
    />
  );
};

export default ReportTemplateModalDelete;
