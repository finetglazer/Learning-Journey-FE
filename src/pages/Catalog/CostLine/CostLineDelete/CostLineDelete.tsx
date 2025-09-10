import TrashSvg from "assets/icons/CostLine/ic_trash.svg";
import { isEmpty, isEqual, lte } from "lodash";
import { useContext, useMemo } from "react";
import { ModalConfirm } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CostLineMaster,
  CostLineMasterContext,
  DEFAULT_MODAL_TYPE,
} from "../CostLineMaster/CostLineMasterHook";

export const CostLineDelete = () => {
  const { modal, selectedRowKeys, setModalType, deleteCostLine } =
    useContext<CostLineMaster>(CostLineMasterContext);
  const [translate] = useTranslation();

  const description = useMemo(() => {
    const isSingleDelete = !isEmpty(modal?.id);
    if (isSingleDelete) {
      return translate("CL.confirm_delete_title", {
        total: 0,
      })
        .replace("0", "")
        .replace("1", "");
    }

    const shouldReplace = lte(selectedRowKeys.length, 1);
    const textTranslated = translate("CL.confirm_delete_title", {
      total: selectedRowKeys.length,
    });

    if (shouldReplace) {
      return textTranslated.replace("0", "").replace("1", "");
    }
    return textTranslated.trim();
  }, [modal?.id, selectedRowKeys.length, translate]);

  const onDismiss = () => setModalType(DEFAULT_MODAL_TYPE);

  return (
    <ModalConfirm
      centered
      open={isEqual(modal.type, "DELETE")}
      titleButtonApply={translate("CL.delete_btn")}
      titleButtonCancel={translate("CL.close_btn")}
      handleCancel={onDismiss}
      handleSave={deleteCostLine}
      icon={<img src={TrashSvg} alt="" width={72} height={72} />}
      title={description}
      content={translate("CL.confirm_delete_message")}
    />
  );
};
