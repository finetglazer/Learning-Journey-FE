import { WIDTH_1000 } from "core/config/consts";
import { SupplierModel } from "models/PurchasingPlan";
import { DatePicker, FormItem, Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./AddNextRoundSupplierConfirmation.module.scss";
import SupplierInformationTable from "./Components/SupplierInformationTable";
import { useAddNextRoundSupplierConfirmationHook } from "./useAddNextRoundSupplierConfirmationHook";
import { useEffect } from "react";
import dayjs from "dayjs";

interface IProps {
  onCancel: () => void;
  onConfirm: () => void;
  onSelectSupplier: () => void;
  open: boolean;
  isLoading: boolean;
  suppliers: SupplierModel[];
}

export default function AddNextRoundSupplierConfirmation({
  onCancel,
  onConfirm,
  onSelectSupplier,
  open,
  isLoading,
  suppliers,
}: IProps) {
  const [translate] = useTranslation();

  const { model, handleChangeDateField, handleChangeListField } =
    useAddNextRoundSupplierConfirmationHook();

  useEffect(() => {
    if (open) {
      const currentDate = dayjs();
      handleChangeDateField({ fieldName: "releaseDate" })(currentDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Modal
      title={translate("PL.txt_next_bidding_opening_time")}
      size={WIDTH_1000}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("PL.confirm")}
      handleCancel={onCancel}
      handleSave={onConfirm}
      isShowIconBack={false}
      loading={isLoading}
      open={open}
      closeIcon
    >
      <div className={styles["modal-wrapper"]}>
        <div className={styles["form-container"]}>
          <div className={styles["form-item"]}>
            <FormItem>
              <DatePicker
                label={translate("PPA.release_time")}
                isSmall={false}
                value={model?.releaseDate}
                isRequired
                readOnly
              />
            </FormItem>
          </div>
          <div className={styles["form-item"]}>
            <FormItem>
              <DatePicker
                label={translate("PPA.bidding_start_time")}
                placeholder={translate("PL.txt_enter_time")}
                isSmall={false}
                value={model?.roundStartDate}
                onChange={handleChangeDateField({
                  fieldName: "roundStartDate",
                })}
                isRequired
              />
            </FormItem>
          </div>
          <div className={styles["form-item"]}>
            <FormItem>
              <DatePicker
                label={translate("PPA.bidding_end_time")}
                placeholder={translate("PL.txt_enter_time")}
                value={model?.roundEndDate}
                onChange={handleChangeDateField({ fieldName: "roundEndDate" })}
                isSmall={false}
                isRequired
              />
            </FormItem>
          </div>
          <div className={styles["form-item"]}>
            <FormItem>
              <DatePicker
                label={translate("PPA.document_opening_time")}
                placeholder={translate("PL.txt_enter_time")}
                value={model?.roundOpenDate}
                onChange={handleChangeDateField({ fieldName: "roundOpenDate" })}
                isSmall={false}
                isRequired
              />
            </FormItem>
          </div>
          <div className={styles["form-item"]}>
            <FormItem>
              <DatePicker
                label={translate("PPA.bid_evaluation_start_time")}
                placeholder={translate("PL.txt_enter_time")}
                value={model?.evaluateStartDate}
                onChange={handleChangeDateField({
                  fieldName: "evaluateStartDate",
                })}
                isSmall={false}
                isRequired
              />
            </FormItem>
          </div>
          <div className={styles["form-item"]}>
            <FormItem>
              <DatePicker
                label={translate("PPA.bid_evaluation_end_time")}
                placeholder={translate("PL.txt_enter_time")}
                value={model?.evaluateEndDate}
                onChange={handleChangeDateField({
                  fieldName: "evaluateEndDate",
                })}
                isSmall={false}
                isRequired
              />
            </FormItem>
          </div>
        </div>
        <h6>{translate("PL.invited_supplier_list_for_next_round")}</h6>
        <SupplierInformationTable
          suppliers={suppliers}
          onSelectSupplier={onSelectSupplier}
          onSelectedSupplier={handleChangeListField({ fieldName: "suppliers" })}
        />
      </div>
    </Modal>
  );
}
