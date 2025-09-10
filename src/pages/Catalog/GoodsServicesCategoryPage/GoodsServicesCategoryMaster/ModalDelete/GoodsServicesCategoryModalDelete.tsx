import TrashSvg from "assets/icons/CostLine/ic_trash.svg";
import { useContext } from "react";
import { ModalConfirm } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  GoodsServicesCategoryMasterContext,
  GoodsServicesCategoryMasterContextModel,
} from "../GoodsServicesCategoryMasterHook";

export const GoodsServicesCategoryModalDelete = () => {
  const { isOpenModalDelete, handleCloseModalDelete, handleDelete } =
    useContext<GoodsServicesCategoryMasterContextModel>(
      GoodsServicesCategoryMasterContext
    );
  const [translate] = useTranslation();

  return (
    <ModalConfirm
      centered
      open={isOpenModalDelete}
      titleButtonApply={translate("generalActions.delete")}
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={handleCloseModalDelete}
      handleSave={handleDelete}
      icon={<img src={TrashSvg} alt="" width={72} height={72} />}
      title={translate("goodsServiceCategories.deleteTitle")}
      content={translate("goodsServiceCategories.deleteContent")}
    />
  );
};
