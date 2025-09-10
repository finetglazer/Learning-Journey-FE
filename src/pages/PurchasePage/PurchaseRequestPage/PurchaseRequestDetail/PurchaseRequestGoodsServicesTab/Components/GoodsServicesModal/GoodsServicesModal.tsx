import {
  GoodsServices,
  PurchaseRequestDetailModel,
} from "models/PurchaseRequest";
import { Dispatch, SetStateAction, useContext } from "react";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import {
  GoodsServicesModalContext,
  useGoodsServicesModalHooks,
} from "./GoodsServicesModalHook";
import Header from "./Header";
import { Modal } from "react-components-design-system";
import { isEmpty } from "lodash";
import { GoodsServicesModelTable } from "./GoodsServicesModelTable";

const MODAL_SIZE = 1100;

interface GoodsServicesModalProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  addedGoodsServices: GoodsServices[];
  callback: (data: GoodsServices[]) => void;
}

const GoodsServicesModal = ({
  setModal,
  addedGoodsServices,
  callback,
}: GoodsServicesModalProps) => {
  const [translate] = useTranslation();

  const { model, setIsShowModalGoodsServices, isShowModalGoodsServices } =
    useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  const { ...context } = useGoodsServicesModalHooks({
    setModal,
    callback,
    addedGoodsServices,
    id: model.purchaseProposalId?.id,
  });

  return (
    <GoodsServicesModalContext.Provider value={context}>
      <Modal
        open={isShowModalGoodsServices}
        isShowIconBack={false}
        destroyOnClose
        onClose={() => setIsShowModalGoodsServices(false)}
        disableButtonApply={isEmpty(context.selectedRowKeys)}
        title={translate("PR.select_goods_services_by_policy", {
          name: model.purchaseProposalId?.code,
        })}
        size={MODAL_SIZE}
        titleButtonApply={translate("PR.btn_choice")}
        titleButtonCancel={translate("PR.close_btn")}
        handleSave={context.onSave}
        handleCancel={context.onCancel}
      >
        <Header />
        <GoodsServicesModelTable />
      </Modal>
    </GoodsServicesModalContext.Provider>
  );
};

export default GoodsServicesModal;
