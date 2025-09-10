import {
  CalculationValue,
  listPaymentMilestoneType,
  listPaymentTimeType,
  listTypeSuggestion,
  NUMBER_MAX_13,
  PaymentTimeType,
} from "config/const";
import {
  MAX_LENGTH_255,
  MAX_LENGTH_500,
  MODAL_WIDTH_800,
} from "core/config/consts";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { utilService } from "core/services/common-services/util-service";
import { ConfigField } from "core/services/service-types";
import { isEqual, isNumber } from "lodash";
import CommonFilter from "models/CommonFilter";
import { PaymentSchedules } from "models/Contract";
import {
  generateDays,
  generateMonths,
} from "pages/PurchasePage/ContractPage/ContractDetail/Components/PaymentSchedulesTab/Components/PaymentScheduleModal/helper";
import { useMemo } from "react";
import { Model } from "react-3layer-common";
import {
  FormItem,
  InputNumber,
  InputText,
  Modal,
  MultipleSelect,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import styles from "./PaymentScheduleModal.module.scss";
import { toFixedByCurrency } from "core/helpers/calculator";

interface PaymentScheduleModalProps {
  model: PaymentSchedules;
  currency: string;
  contractValue: number | undefined;
  calculationValue: CalculationValue | undefined;
  onClose: () => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeMultipleSelectField: (
    config: ConfigField
  ) => (values: Model[]) => void;
  onAddPaymentSchedule: () => void;
}

export default function PaymentScheduleModal({
  model,
  currency,
  contractValue,
  calculationValue,
  onClose,
  handleChangeSingleField,
  handleChangeSelectField,
  handleChangeMultipleSelectField,
  onAddPaymentSchedule,
}: PaymentScheduleModalProps) {
  const [translate] = useTranslation();

  const paymentTimeType = useMemo(() => {
    const value = model?.paymentTimeType;
    if (isNumber(value)) {
      return listPaymentTimeType.find(({ id }) => isEqual(id, value));
    }

    return value;
  }, [model?.paymentTimeType]);

  return (
    <Modal
      title={translate("CT.add_payment_schedule")}
      size={MODAL_WIDTH_800}
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.txt_add")}
      handleCancel={onClose}
      handleSave={onAddPaymentSchedule}
      isShowIconBack={false}
      open
      closeIcon
    >
      <div className={styles["form-group"]}>
        <FormItem
          validateObject={utilService.getValidateObj(model, "paymentBatch")}
        >
          <InputText
            label={translate("CT.payment_period")}
            placeHolder={translate("CT.input_payment_period")}
            value={model?.paymentBatch}
            maxLength={MAX_LENGTH_255}
            translate={translate}
            onChange={handleChangeSingleField({
              fieldName: "paymentBatch",
            })}
            isSmall={false}
            isRequired
          />
        </FormItem>
        <div className="d-flex gap-2">
          <div className={styles["w-one-third"]}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "suggestionType"
              )}
            >
              <Select
                classFilter={undefined}
                valueFilter={{
                  name: "",
                }}
                label={translate("CT.proposal_type")}
                placeHolder={translate("CT.select_proposal_type")}
                value={model?.suggestionType}
                getList={() => of(listTypeSuggestion)}
                onChange={handleChangeSelectField({
                  fieldName: "suggestionType",
                })}
                isSmall={false}
                isSearch={false}
                isRequired
              />
            </FormItem>
          </div>
          {calculationValue === CalculationValue.PERCENTAGE_RATE && (
            <div className={styles["w-one-third"]}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "percent")}
              >
                <InputNumber
                  label={translate("CT.percentage_rate")}
                  placeHolder="0"
                  value={model?.percent}
                  suffix="%"
                  numberType="DECIMAL"
                  translate={translate}
                  onChange={(percent) => {
                    const amount = toFixedByCurrency(
                      (contractValue * (percent || 0)) / 100,
                      currency
                    );
                    handleChangeSingleField({
                      fieldName: "percent",
                    })(percent);
                    handleChangeSingleField({
                      fieldName: "amount",
                    })(amount);
                  }}
                  max={100}
                  isSmall={false}
                  isRequired
                />
              </FormItem>
            </div>
          )}
          {calculationValue === CalculationValue.PAYMENT_TERM && (
            <div className={styles["w-one-third"]}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "paymentTerm"
                )}
              >
                <InputText
                  label={translate("CT.payment_term")}
                  placeHolder={translate("CT.placeholder_payment_term")}
                  value={model?.paymentTerm}
                  maxLength={MAX_LENGTH_255}
                  translate={translate}
                  onChange={handleChangeSingleField({
                    fieldName: "paymentTerm",
                  })}
                  isSmall={false}
                  isRequired
                />
              </FormItem>
            </div>
          )}
          <div className="flex-1">
            <FormItem
              validateObject={utilService.getValidateObj(model, "amount")}
            >
              <InputNumber
                label={translate("CT.amount")}
                placeHolder="0"
                value={model?.amount}
                translate={translate}
                max={NUMBER_MAX_13}
                min={-NUMBER_MAX_13}
                numberType={getNumberTypeByCurrency(currency)}
                onChange={handleChangeSingleField({
                  fieldName: "amount",
                })}
                suffix={currency}
                isSmall={false}
                isRequired
                allowNegative
              />
            </FormItem>
          </div>
        </div>

        <div className="d-flex gap-2">
          <div className="flex-1">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "paymentTimeType"
              )}
            >
              <Select
                label={translate("CT.reminder_type")}
                placeHolder={translate("CT.select_reminder_type")}
                value={paymentTimeType}
                classFilter={undefined}
                valueFilter={{
                  name: "",
                }}
                onChange={handleChangeSelectField({
                  fieldName: "paymentTimeType",
                })}
                getList={() => of(listPaymentTimeType)}
                isSmall={false}
                isSearch={false}
                isRequired
              />
            </FormItem>
          </div>
          {paymentTimeType?.id === PaymentTimeType.DAYS && (
            <>
              <div className={styles["w-one-third"]}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "paymentDay"
                  )}
                >
                  <InputNumber
                    label={translate("CT.payment_reminder")}
                    placeHolder={translate("CT.enter_days")}
                    value={Number(model?.paymentDay)}
                    min={0}
                    max={NUMBER_MAX_13}
                    onChange={handleChangeSingleField({
                      fieldName: "paymentDay",
                    })}
                    translate={translate}
                    isSmall={false}
                    isRequired
                  />
                </FormItem>
              </div>
              <div className={styles["w-one-third"]}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "paymentMilestoneType"
                  )}
                >
                  <Select
                    valueFilter={{
                      name: "",
                    }}
                    label={translate("CT.payment_reminder")}
                    className={styles["invisible-label"]}
                    classFilter={undefined}
                    placeHolder={translate("CT.select_milestone")}
                    value={model?.paymentMilestoneType}
                    getList={() => of(listPaymentMilestoneType)}
                    onChange={handleChangeSelectField({
                      fieldName: "paymentMilestoneType",
                    })}
                    isSmall={false}
                    isRequired
                  />
                </FormItem>
              </div>
            </>
          )}
          {paymentTimeType?.id === PaymentTimeType.DATE && (
            <>
              <div className={styles["w-one-third"]}>
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    "paymentDay"
                  )}
                >
                  <Select
                    valueFilter={{
                      name: "",
                    }}
                    classFilter={undefined}
                    label={translate("CT.payment_reminder")}
                    placeHolder={translate("CT.select_day")}
                    value={model?.paymentDay}
                    getList={() => of(generateDays(31))}
                    onChange={handleChangeSelectField({
                      fieldName: "paymentDay",
                    })}
                    isSmall={false}
                    isRequired
                  />
                </FormItem>
              </div>
              <div className={styles["w-one-third"]}>
                <FormItem
                  validateObject={utilService.getValidateObj(model, "months")}
                >
                  <MultipleSelect
                    valueFilter={{
                      name: "",
                    }}
                    className={styles["invisible-label"]}
                    label={translate("CT.payment_reminder")}
                    values={model?.months || []}
                    placeHolder={translate("CT.select_month")}
                    onChange={handleChangeMultipleSelectField({
                      fieldName: "months",
                    })}
                    getList={() => of(generateMonths())}
                    classFilter={CommonFilter}
                    isSmall={false}
                    isRequired
                  />
                </FormItem>
              </div>
            </>
          )}
        </div>
        <FormItem
          validateObject={utilService.getValidateObj(model, "paymentCondition")}
        >
          <InputText
            label={translate("CT.payment_condition")}
            placeHolder={translate("CT.input_payment_condition")}
            onChange={handleChangeSingleField({
              fieldName: "paymentCondition",
            })}
            value={model?.paymentCondition}
            maxLength={MAX_LENGTH_500}
            translate={translate}
            isSmall={false}
          />
        </FormItem>
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            "referenceDocument"
          )}
        >
          <TextArea
            label={translate("CT.payment_documents")}
            placeHolder={translate("CT.input_payment_documents")}
            value={model?.referenceDocument}
            maxLength={MAX_LENGTH_500}
            translate={translate}
            resize="none"
            onChange={handleChangeSingleField({
              fieldName: "referenceDocument",
            })}
            showCount
            isRequired
          />
        </FormItem>
        <FormItem
          validateObject={utilService.getValidateObj(model, "description")}
        >
          <TextArea
            label={translate("CT.note")}
            placeHolder={translate("CT.input_note")}
            maxLength={MAX_LENGTH_500}
            translate={translate}
            value={model?.description}
            resize="none"
            onChange={handleChangeSingleField({
              fieldName: "description",
            })}
            showCount
          />
        </FormItem>
      </div>
    </Modal>
  );
}
