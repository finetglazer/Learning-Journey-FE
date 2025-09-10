import { MODAL_WIDTH_800 } from "core/config/consts";
import { AcceptancePersonRequest } from "models/Acceptance";
import { Modal } from "react-components-design-system";
import styles from "./AcceptanceSelect.module.scss";
import { useAcceptanceSelectHooks } from "pages/PurchasePage/Acceptance/Components/AcceptanceMasterModal/AcceptanceSelect/AcceptanceSelectHook";
import { AcceptanceSelectHooksContext } from "pages/PurchasePage/Acceptance/Components/AcceptanceMasterModal/AcceptanceSelect/context";
import AcceptanceModalFilter from "pages/PurchasePage/Acceptance/Components/AcceptanceMasterModal/AcceptanceModalFilter/AcceptanceModalFilter";
import AcceptanceTableModal from "pages/PurchasePage/Acceptance/Components/AcceptanceMasterModal/AcceptanceTableModal/AcceptanceTableModal";

interface AcceptanceSelectModalProps {
  open?: boolean;
  receivedId?: string;
  handleCancel?: () => void;
  handleApply?: ({
    acceptanceSelects,
  }: {
    acceptanceSelects: AcceptancePersonRequest[];
  }) => void;
  goodItemSelectCurrent?: string[];
  selectedItems?: string[];
}

export const AcceptanceSelectModal = ({
  open,
  receivedId,
  goodItemSelectCurrent,
  handleCancel,
  handleApply,
  selectedItems,
}: AcceptanceSelectModalProps) => {
  const { translate, ...contextValue } = useAcceptanceSelectHooks({
    receivedId,
    goodItemSelectCurrent,
    selectedItems,
  });

  const { selectedRowKeys, list } = contextValue;

  const handleSelectAcceptance = () => {
    const selectedList = list.filter((item) =>
      selectedRowKeys.includes(item.id)
    );
    handleApply({
      acceptanceSelects: selectedList,
    });
  };

  return (
    <Modal
      open={open}
      title={translate("AC.txt_title_select_tester")}
      size={MODAL_WIDTH_800}
      isShowIconBack={false}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={handleCancel}
      handleSave={handleSelectAcceptance}
      closeIcon
    >
      <div className={styles["received-container"]}>
        <AcceptanceSelectHooksContext.Provider value={contextValue}>
          <AcceptanceModalFilter />
          <AcceptanceTableModal />
        </AcceptanceSelectHooksContext.Provider>
      </div>
    </Modal>
  );
};
