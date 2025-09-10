import { useUpdateEffect } from "ahooks";
import { Col, Row } from "antd";
import {
  CalculationValue,
  listPaymentMilestoneType,
  listPaymentTimeType,
  listTypeSuggestion,
  NUMBER_MAX_13,
  PaymentTimeType,
} from "config/const";
import { JPY_CURRENCY_UNIT } from "core/config/consts";
import { roundTo } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isEmpty, isEqual, isNil } from "lodash";
import CommonFilter from "models/CommonFilter";
import { ContractDetailModel, PaymentSchedules } from "models/Contract";
import { VND_CURRENCY } from "models/Payment";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useContext } from "react";
import { ModelFilter } from "react-3layer-common";
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
import { generateDays, generateMonths } from "./helper";
import "./PaymentScheduleModal.scss";

type Props = {
  open: boolean;
  handleCancel: () => void;
};

const MAX_PERCENT = 100;
const MIN_PERCENT = 0;

const PaymentScheduleModal = ({ open, handleCancel }: Props) => {
  const [translate] = useTranslation();

  const {
    model: modelDetail,
    handleChangeSingleField: handleChangeSingleFieldMaster,
    recordEditPaymentSchedule,
    inputNumberType,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const { model, dispatch } = detailService.useModel<PaymentSchedules>(
    PaymentSchedules,
    recordEditPaymentSchedule || {
      ...new PaymentSchedules(),
    }
  );

  const {
    handleChangeAllField,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeMultipleSelectField,
  } = fieldService.useField(model, dispatch);

  const isPercentageRate =
    modelDetail?.calculationValue?.id == CalculationValue.PERCENTAGE_RATE;
  const isPaymentTerm =
    modelDetail?.calculationValue?.id == CalculationValue.PAYMENT_TERM;
  const isVND = isEqual(modelDetail?.currency, VND_CURRENCY);
  const isJPY = isEqual(modelDetail?.currency, JPY_CURRENCY_UNIT);
  const originalCurrencyContractValue =
    modelDetail?.totalAmountContractGoodsServicesList || 0;

  useUpdateEffect(() => {
    if (isPercentageRate) {
      let newAmount =
        ((model.percent || 0) * originalCurrencyContractValue) / 100;
      newAmount =
        isVND || isJPY ? Math.round(newAmount) : roundTo(newAmount, 2);
      handleChangeSingleField({
        fieldName: "amount",
      })(newAmount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.percent, isPercentageRate]);

  const getListMonths = (filter: ModelFilter) => {
    if (!filter?.name) {
      return generateMonths();
    }
    return generateMonths().filter((t) => {
      return t?.name
        ?.toLowerCase()
        .includes(filter?.name?.toLowerCase()?.trim());
    });
  };

  const handleAddPaymentSchedule = () => {
    if (!validate()) {
      return;
    }
    const updatedPaymentSchedules = recordEditPaymentSchedule
      ? modelDetail?.paymentSchedules?.map((item: PaymentSchedules) =>
          item.id === recordEditPaymentSchedule.id ? model : item
        )
      : [
          ...(modelDetail?.paymentSchedules || []),
          {
            ...model,
            id: Date.now(),
          },
        ];
    handleChangeSingleFieldMaster({
      fieldName: "paymentSchedules",
    })(updatedPaymentSchedules);
    handleCancel();
  };

  const validate = () => {
    const requiredFields = [
      "suggestionType",
      "paymentBatch",
      "referenceDocument",
      "amount",
      "paymentTimeType",
    ];
    if (!isEmpty(model?.paymentTimeType)) {
      requiredFields.push("paymentDay");
    }
    if (isPercentageRate) {
      requiredFields.push("percent");
    }
    if (isPaymentTerm) {
      requiredFields.push("paymentTerm");
    }
    if (model?.paymentTimeType?.id === PaymentTimeType.DATE) {
      requiredFields.push("months");
    }
    if (model?.paymentTimeType?.id === PaymentTimeType.DAYS) {
      requiredFields.push("paymentMilestoneType");
    }
    const errors = requiredFields.reduce(
      (acc: { [key: string]: string }, field) => {
        if (
          isNil(model?.[field]) ||
          (field === "percent" && !model?.[field]) ||
          (field === "months" && isEmpty(model?.[field]))
        ) {
          acc[field] = translate("CM.input_require_validation");
        }
        return acc;
      },
      {}
    );
    if (Object.keys(errors).length > 0) {
      handleChangeAllField({
        ...model,
        errors: {
          ...model?.errors,
          ...errors,
        },
      });
      return false;
    }
    const maxLengthFields = [
      {
        name: "paymentCondition",
        length: 500,
      },
      { name: "referenceDocument", length: 500 },
      { name: "note", length: 500 },
      { name: "paymentBatch", length: 255 },
    ];
    if (isPaymentTerm) {
      maxLengthFields.push({ name: "paymentTerm", length: 255 });
    }
    for (const field of maxLengthFields) {
      if (model[field.name]?.length > field.length) {
        return false;
      }
    }
    return true;
  };

  const renderPaymentTimeType = () => {
    switch (model?.paymentTimeType?.id) {
      case PaymentTimeType.DAYS:
        return (
          <>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "paymentDay")}
              >
                <InputNumber
                  isRequired
                  isSmall={false}
                  label={translate("CT.payment_reminder")}
                  placeHolder={translate("CT.enter_days")}
                  value={Number(model?.paymentDay)}
                  onChange={handleChangeSingleField({
                    fieldName: "paymentDay",
                  })}
                  min={0}
                  max={NUMBER_MAX_13}
                  translate={translate}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "paymentMilestoneType"
                )}
              >
                <Select
                  isSmall={false}
                  valueFilter={{
                    name: "",
                  }}
                  classFilter={undefined}
                  getList={() => of(listPaymentMilestoneType)}
                  onChange={handleChangeSelectField({
                    fieldName: "paymentMilestoneType",
                  })}
                  placeHolder={translate("CT.select_milestone")}
                  value={model?.paymentMilestoneType}
                  label="ㅤ"
                />
              </FormItem>
            </Col>
          </>
        );
      case PaymentTimeType.DATE:
        return (
          <>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "paymentDay")}
              >
                <Select
                  isRequired
                  isSmall={false}
                  valueFilter={{
                    name: "",
                  }}
                  classFilter={undefined}
                  getList={() => of(generateDays(31))}
                  onChange={handleChangeSelectField({
                    fieldName: "paymentDay",
                  })}
                  label={translate("CT.payment_reminder")}
                  placeHolder={translate("CT.select_day")}
                  value={model?.paymentDay}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "months")}
              >
                <MultipleSelect
                  isSmall={false}
                  valueFilter={{
                    name: "",
                  }}
                  values={model.months || []}
                  getList={(search) => of(getListMonths(search))}
                  onChange={handleChangeMultipleSelectField({
                    fieldName: "months",
                  })}
                  placeHolder={translate("CT.select_month")}
                  searchType=""
                  searchProperty="name"
                  classFilter={CommonFilter}
                  label="ㅤ"
                />
              </FormItem>
            </Col>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      title={translate("CT.add_payment_schedule")}
      size={800}
      closeIcon={true}
      className="payment-minHeight-500"
      handleSave={handleAddPaymentSchedule}
      handleCancel={handleCancel}
      isShowIconBack={false}
      titleButtonCancel={translate(
        "PM.payment_modal_cancle_supplier_button_label"
      )}
      titleButtonApply={translate("PR.btn_choice")}
    >
      <div className="payment_schedule_modal">
        <Row gutter={16}>
          <Col span={24}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "paymentBatch")}
            >
              <InputText
                isSmall={false}
                isRequired
                label={translate("CT.payment_period")}
                placeHolder={translate("CT.input_payment_period")}
                onChange={handleChangeSingleField({
                  fieldName: "paymentBatch",
                })}
                value={model?.paymentBatch}
                maxLength={255}
                translate={translate}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "suggestionType"
              )}
            >
              <Select
                isRequired
                isSmall={false}
                classFilter={undefined}
                isSearch={false}
                valueFilter={{
                  name: "",
                }}
                getList={() => of(listTypeSuggestion)}
                onChange={handleChangeSelectField({
                  fieldName: "suggestionType",
                })}
                label={translate("CT.proposal_type")}
                placeHolder={translate("CT.select_proposal_type")}
                value={model?.suggestionType}
              />
            </FormItem>
          </Col>
          {isPercentageRate && (
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "percent")}
              >
                <InputNumber
                  isSmall={false}
                  isRequired
                  label={translate("CT.percentage_rate")}
                  placeHolder={"0"}
                  value={model?.percent}
                  onChange={handleChangeSingleField({
                    fieldName: "percent",
                  })}
                  suffix="%"
                  numberType="DECIMAL"
                  max={MAX_PERCENT}
                  min={MIN_PERCENT}
                  translate={translate}
                />
              </FormItem>
            </Col>
          )}
          {isPaymentTerm && (
            <Col span={8}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "paymentTerm"
                )}
              >
                <InputText
                  isRequired
                  isSmall={false}
                  label={translate("CT.payment_term")}
                  placeHolder={translate("CT.payment_term")}
                  onChange={handleChangeSingleField({
                    fieldName: "paymentTerm",
                  })}
                  value={model?.paymentTerm}
                  maxLength={255}
                  translate={translate}
                />
              </FormItem>
            </Col>
          )}
          <Col span={isPercentageRate || isPaymentTerm ? 8 : 16}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "amount")}
            >
              <InputNumber
                isSmall={false}
                isRequired
                label={translate("CT.amount")}
                placeHolder={"0"}
                value={model?.amount}
                onChange={handleChangeSingleField({
                  fieldName: "amount",
                })}
                translate={translate}
                suffix={modelDetail?.currency}
                numberType={inputNumberType}
                max={NUMBER_MAX_13}
                min={-NUMBER_MAX_13}
                allowNegative
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "paymentTimeType"
              )}
            >
              <Select
                isRequired
                isSmall={false}
                classFilter={undefined}
                isSearch={false}
                valueFilter={{
                  name: "",
                }}
                getList={() => of(listPaymentTimeType)}
                onChange={(_, value) => {
                  handleChangeAllField({
                    ...model,
                    paymentTimeType: value,
                    paymentDay: undefined,
                    paymentMilestoneType: undefined,
                    months: undefined,
                    errors: {
                      ...model?.errors,
                      paymentTimeType: undefined,
                    },
                  });
                }}
                label={translate("CT.reminder_type")}
                placeHolder={translate("CT.select_reminder_type")}
                value={model?.paymentTimeType}
              />
            </FormItem>
          </Col>
          {renderPaymentTimeType()}
        </Row>
        <Col span={24}>
          <InputText
            isSmall={false}
            label={translate("CT.payment_condition")}
            placeHolder={translate("CT.input_payment_condition")}
            onChange={handleChangeSingleField({
              fieldName: "paymentCondition",
            })}
            value={model?.paymentCondition}
            maxLength={500}
            translate={translate}
          />
        </Col>
        <Col span={24}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "referenceDocument"
            )}
          >
            <TextArea
              isRequired
              label={translate("CT.payment_documents")}
              placeHolder={translate("CT.input_payment_documents")}
              onChange={handleChangeSingleField({
                fieldName: "referenceDocument",
              })}
              value={model?.referenceDocument}
              maxLength={500}
              translate={translate}
              showCount
              resize="none"
            />
          </FormItem>
        </Col>
        <Col span={24}>
          <TextArea
            label={translate("CT.note")}
            placeHolder={translate("CT.input_note")}
            onChange={handleChangeSingleField({
              fieldName: "description",
            })}
            maxLength={500}
            translate={translate}
            showCount
            value={model?.description}
            resize="none"
          />
        </Col>
      </div>
    </Modal>
  );
};

export default PaymentScheduleModal;
