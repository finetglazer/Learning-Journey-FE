import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
  PlanGoodsServicesModalContext,
  useGoodsServicesModalHooks,
} from "./PlanGoodsServicesModalHook";
import Header from "./PlanGoodsServicesHeader";
import { Modal } from "react-components-design-system";
import { isEmpty } from "lodash";
import { PlanGoodsServicesModelTable } from "./PlanGoodsServicesModelTable";
import {
  PurchasePlanGoodsServicesModel,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan/PurchasingPlan";

const MODAL_SIZE = 1100;

interface GoodsServicesModalProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  callback: (data: PurchasePlanGoodsServicesModel[]) => void;
  id: string;
  isShowModalGoodsServices: boolean;
  setIsShowModalGoodsServices: Dispatch<SetStateAction<boolean>>;
  selectedKeys: string[];
  selectRowsModal?: PurchasePlanGoodsServicesModel[];
  purchasePlanId?: string;
  model?: PurchasingPlanTypeModel;
  isPurchasingPlanCompetitiveOfferPage?: boolean;
}

const PlanGoodsServicesModal = ({
  setModal,
  callback,
  id,
  isShowModalGoodsServices,
  setIsShowModalGoodsServices,
  selectedKeys,
  selectRowsModal,
  purchasePlanId,
  model,
  isPurchasingPlanCompetitiveOfferPage = false,
}: GoodsServicesModalProps) => {
  const [translate] = useTranslation();

  const { ...context } = useGoodsServicesModalHooks({
    setModal,
    callback,
    id,
    selectedKeys,
    selectRowsModal,
    purchasePlanId,
    model,
    isPurchasingPlanCompetitiveOfferPage,
  });

  return (
    <PlanGoodsServicesModalContext.Provider value={context}>
      <Modal
        open={isShowModalGoodsServices}
        isShowIconBack={false}
        destroyOnClose
        onClose={() => setIsShowModalGoodsServices(false)}
        disableButtonApply={isEmpty(context.selectedRowKeys)}
        size={MODAL_SIZE}
        title={translate("PL.purchasing_plan_select_goods_services")}
        titleButtonApply={translate("PL.save_btn")}
        titleButtonCancel={translate("CM.txt_status_close")}
        handleSave={context.onSave}
        handleCancel={context.onCancel}
      >
        <Header />
        <PlanGoodsServicesModelTable />
      </Modal>
    </PlanGoodsServicesModalContext.Provider>
  );
};

export default PlanGoodsServicesModal;
