import { isEmpty } from "lodash";
import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import {
  ModalContext,
  ModalHooksProps,
  useModalHooks,
} from "./ModalSelectContactPOHook";
import { ModalSelectContactPOTable } from "./ModalSelectContactPOTable";

const MODAL_SIZE = 1100;

export const ModalSelectContactPO = ({
  setModal,
  isShowModel,
  callback,
  selectedKey,
  title,
  pageUsed,
}: ModalHooksProps) => {
  const [translate] = useTranslation();

  const { ...context } = useModalHooks({
    setModal,
    callback,
    selectedKey,
    pageUsed,
  });

  return (
    <ModalContext.Provider value={context}>
      <Modal
        open={isShowModel}
        isShowIconBack={false}
        destroyOnClose
        maskClosable={true}
        onClose={() => setModal(false)}
        disableButtonApply={isEmpty(context.selectedRowKeys)}
        title={
          isEmpty(title) ? translate("settlement.select_settlement_txt") : title
        }
        size={MODAL_SIZE}
        titleButtonApply={translate("PL.save_btn")}
        titleButtonCancel={translate("CM.txt_status_close")}
        handleSave={context.onSave}
        handleCancel={context.onCancel}
      >
        <Header />
        <ModalSelectContactPOTable />
      </Modal>
    </ModalContext.Provider>
  );
};
