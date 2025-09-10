import { isEmpty } from "lodash";
import { EntitySelection, PurchaseProposal } from "models/PurchaseRequest";
import { Dispatch, SetStateAction } from "react";
import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import {
  ProposalModalContext,
  useProposalModalHooks,
} from "./ProposalModalHook";
import { ProposalModalTable } from "./ProposalModalTable";

const MODAL_SIZE = 1100;

interface ProjectModalProps {
  isShowModel: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  addedProposal: string;
  callback: (data: PurchaseProposal) => void;
  entitySelection?: EntitySelection;
}

export const ProposalModal = ({
  setModal,
  isShowModel,
  addedProposal,
  callback,
  entitySelection = EntitySelection.YCMS,
}: ProjectModalProps) => {
  const [translate] = useTranslation();

  const { loading, ...context } = useProposalModalHooks({
    setModal,
    callback,
    addedProposal,
    entitySelection,
  });

  return (
    <ProposalModalContext.Provider value={context}>
      <Modal
        open={isShowModel}
        isShowIconBack={false}
        destroyOnClose
        onClose={() => setModal(false)}
        disableButtonApply={isEmpty(context.selectedRowKeys)}
        title={translate("PR.select_proposal")}
        size={MODAL_SIZE}
        titleButtonApply={translate(
          "PM.payment_modal_select_supplier_button_label"
        )}
        titleButtonCancel={translate(
          "PM.payment_modal_cancle_supplier_button_label"
        )}
        handleSave={context.onSave}
        handleCancel={context.onCancel}
        loading={loading}
      >
        <Header />
        <ProposalModalTable />
      </Modal>
    </ProposalModalContext.Provider>
  );
};
