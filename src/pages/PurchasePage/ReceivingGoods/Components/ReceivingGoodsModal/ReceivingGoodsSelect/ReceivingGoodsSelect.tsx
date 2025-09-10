import { MODAL_WIDTH_1100 } from "core/config/consts";
import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { Modal } from "react-components-design-system";
import { ReceivingGoodsSelectTable } from "./ReceivingGoodsSelecTable/ReceivingGoodsSelectTable";
import { ReceivingGoodsSelectFilter } from "./ReceivingGoodsSelectFilter/ReceivingGoodsSelectFilter";
import {
  ReceivingGoodsSelectHooksContext,
  useReceivingGoodsSelectHooks,
} from "./ReceivingGoodsSelectHooks";
import styles from "./ReceivingGoodsSelectModal.module.scss";
interface ReceivingGoodsSelectModalProps {
  open: boolean;
  contractId: string;
  handleCancel: () => void;
  handleApply: ({
    goodsReceiptSelects,
  }: {
    goodsReceiptSelects: GoodsReceiptRequestItem[];
  }) => void;
  goodItemSelectCurrent: string[];
  selectedItems: string[];
}

export const ReceivingGoodsSelectModal = ({
  open,
  contractId,
  goodItemSelectCurrent,
  handleCancel,
  handleApply,
  selectedItems,
}: ReceivingGoodsSelectModalProps) => {
  const { translate, ...contextValue } = useReceivingGoodsSelectHooks({
    contractId,
    goodItemSelectCurrent,
    selectedItems,
  });

  const { selectedRowKeys, list } = contextValue;

  const handleSelectGoodsReceipt = () => {
    const selectedList = list.filter((item) =>
      selectedRowKeys.includes(item.id)
    );
    handleApply({
      goodsReceiptSelects: selectedList,
    });
  };

  return (
    <Modal
      open={open}
      title={translate("RG.txt_select_goods_services")}
      size={MODAL_WIDTH_1100}
      isShowIconBack={false}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={handleCancel}
      handleSave={handleSelectGoodsReceipt}
      closeIcon
    >
      <div className={styles["delivery-container"]}>
        <ReceivingGoodsSelectHooksContext.Provider value={contextValue as any}>
          <ReceivingGoodsSelectFilter />
          <ReceivingGoodsSelectTable />
        </ReceivingGoodsSelectHooksContext.Provider>
      </div>
    </Modal>
  );
};
