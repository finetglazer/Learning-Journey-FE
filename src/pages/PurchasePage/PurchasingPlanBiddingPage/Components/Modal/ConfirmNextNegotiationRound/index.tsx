import { WIDTH_1000 } from "core/config/consts";
import { DatePicker, FormItem, Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import SupplierInformationTable from "./Components/SupplierInformationTable";
import styles from "./ConfirmNextNegotiationRound.module.scss";

interface IProps {
  onCancel: () => void;
  onConfirm: () => void;
  onSelectSupplier: () => void;
  isLoading: boolean;
}

export default function ConfirmNextNegotiationRound({
  onCancel,
  onConfirm,
  onSelectSupplier,
  isLoading,
}: IProps) {
  const [translate] = useTranslation();

  return (
    <Modal
      title={translate("PL.txt_confirm_adding_negotiation_round")}
      size={WIDTH_1000}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("PL.confirm")}
      handleCancel={onCancel}
      handleSave={onConfirm}
      isShowIconBack={false}
      loading={isLoading}
      closeIcon
      open
    >
      <div className={styles["modal-wrapper"]}>
        <div className={styles["form-container"]}>
          <div className={styles["form-item"]}>
            <FormItem>
              <DatePicker
                label={translate("PPA.bidding_start_time")}
                placeholder={translate("PL.txt_enter_time")}
                isSmall={false}
                isRequired
                disabled
              />
            </FormItem>
          </div>
          <div className={styles["form-item"]}>
            <FormItem>
              <DatePicker
                label={translate("PPA.bidding_end_time")}
                placeholder={translate("PL.txt_enter_time")}
                isSmall={false}
                isRequired
              />
            </FormItem>
          </div>
        </div>
        <h6>{translate("PL.txt_suppliers_required_to_resubmit_quotation")}</h6>
        <SupplierInformationTable onSelectSupplier={onSelectSupplier} />
      </div>
    </Modal>
  );
}
