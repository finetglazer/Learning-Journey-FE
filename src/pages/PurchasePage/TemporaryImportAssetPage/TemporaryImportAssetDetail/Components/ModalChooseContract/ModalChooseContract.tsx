import { Dispatch, SetStateAction } from "react";
import { Modal } from "react-components-design-system";
import ModalChooseContractHeader from "./Components/ModalChooseContractHeader";
import ModalChooseContractTable from "./Components/ModalChooseContractTable";
import { useTranslation } from "react-i18next";
import { Contract } from "models/Contract";
import {
  ContractModalContext,
  useChooseContractModalHooks,
} from "./ModalChooseContractHooks";
import { isEmpty } from "lodash";
import { ContractTempReceiptModel } from "models/TemporaryImportAsset/TemporaryImportAsset";

const WIDTH_SIZE = 1100;

interface ProjectModalProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  callback?: (value: ContractTempReceiptModel) => void;
  contractId: string;
  selectedKey: ContractTempReceiptModel;
}

const ModalChooseContract = ({
  setModal,
  callback,
  contractId,
  selectedKey,
}: ProjectModalProps): JSX.Element => {
  const [translate] = useTranslation();
  const { ...context } = useChooseContractModalHooks({
    setModal,
    callback,
    contractId,
    selectedKey,
  });

  return (
    <ContractModalContext.Provider value={context}>
      <Modal
        open
        isShowIconBack={false}
        destroyOnClose
        onClose={() => setModal(false)}
        titleButtonApply={translate("TIA.btn_apply")}
        titleButtonCancel={translate("TIA.btn_close")}
        title={translate("TIA.modal_title_choose_contract")}
        size={WIDTH_SIZE}
        disableButtonApply={isEmpty(context.selectedRowKeys)}
        handleSave={context.onSave}
        handleCancel={context.onCancel}
      >
        <ModalChooseContractHeader />
        <ModalChooseContractTable />
      </Modal>
    </ContractModalContext.Provider>
  );
};

export default ModalChooseContract;
