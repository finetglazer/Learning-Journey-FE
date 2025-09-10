import {
  SupplierContext,
  SupplierContextType,
} from "pages/Catalog/Supplier/context";
import { useContext } from "react";
import { ModalConfirm } from "react-components-design-system";
import { useTranslation } from "react-i18next";

export const AccountModal = () => {
  const [translate] = useTranslation();

  const {
    visibleAccountModal,
    handleCloseAccountModal,
    handleSaveAccountModal,
    actionWithAccount,
  } = useContext<SupplierContextType>(SupplierContext);

  return (
    <ModalConfirm
      open={visibleAccountModal}
      title={
        actionWithAccount === "CREATE"
          ? translate("SL.txt_add_account")
          : translate("SL.txt_recover_account")
      }
      content={
        actionWithAccount === "CREATE"
          ? translate("SL.message_create_account")
          : translate("SL.message_recover_account")
      }
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleCancel={handleCloseAccountModal}
      handleSave={handleSaveAccountModal}
    />
  );
};
