import { isEmpty } from "lodash";
import { Dispatch, SetStateAction } from "react";
import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import {
  ProposalModalContext,
  useProposalModalHooks,
} from "./ModalSelectPurchaseRequestHook";
import { ModalSelectPurchaseRequestTable } from "./ModalSelectPurchaseRequestTable";
import { PurchaseProposalModel } from "models/PurchasingPlan";

const MODAL_SIZE = 1100;

interface ProjectModalProps {
  isShowModel: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  callback: (data: PurchaseProposalModel) => void;
  selectedKey?: string;
  isPurchaseRequestAdjustment?: boolean;
  purchasePlanId?: string;
}

export const ModalSelectPurchaseRequest = ({
  setModal,
  isShowModel,
  callback,
  selectedKey,
  isPurchaseRequestAdjustment,
  purchasePlanId,
}: ProjectModalProps) => {
  const [translate] = useTranslation();

  const { loading, ...context } = useProposalModalHooks({
    setModal,
    callback,
    selectedKey,
    isPurchaseRequestAdjustment,
    purchasePlanId,
  });

  return (
    <ProposalModalContext.Provider value={context}>
      <Modal
        open={isShowModel}
        isShowIconBack={false}
        destroyOnClose
        onClose={() => setModal(false)}
        disableButtonApply={
          isEmpty(context.selectedRowKeys) ||
          context.selectedRowKeys.includes(selectedKey)
        }
        title={translate("PL.purchasing_plan_select_procurement_request")}
        size={MODAL_SIZE}
        titleButtonApply={translate("PL.save_btn")}
        titleButtonCancel={translate("CM.txt_status_close")}
        handleSave={context.onSave}
        handleCancel={context.onCancel}
        loading={loading}
      >
        <Header />
        <ModalSelectPurchaseRequestTable />
      </Modal>
    </ProposalModalContext.Provider>
  );
};
