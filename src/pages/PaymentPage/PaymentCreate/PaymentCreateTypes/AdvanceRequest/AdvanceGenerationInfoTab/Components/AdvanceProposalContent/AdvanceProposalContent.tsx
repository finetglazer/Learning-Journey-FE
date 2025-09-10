import { NUMBER_MAX_13 } from "config/const";
import {
  DEFAULT_DATETIME_VALUE,
  NAME_BANK_REGEX,
  NOT_TAB_ENTER_REGEX,
} from "core/config/consts";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { formatDate } from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import { isEqual, isNil, size } from "lodash";
import {
  CODE_TYPE_ADVANCE_TUCN,
  CostAllocation,
  CurrencyModel,
  PAYMENT_INHERITANCE_TYPE_SUBMIT,
  PAYMENT_METHOD_TYPES,
  PaymentCreateModel,
  PaymentModel,
  SHOPPING_PURPOSES,
  VND_CURRENCY,
} from "models/Payment";
import { getPurposeOfPurchaseOptions } from "pages/PaymentPage/PaymentCreate/Helper/Helper";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { getPaymentRequestTypeName } from "pages/PaymentPage/PaymentCreate/PaymentUtils";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { useContext, useEffect, useState } from "react";
import {
  BORDER_TYPE,
  Checkbox,
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import { of } from "rxjs";

const AdvanceProposalContent = () => {
  const {
    translate,
    model,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeSingleField,
    handleChangeAllField,
    dispatchModel,
    typeGroup,
    formatNumberToCurrency,
    getBankExchangeRate,
    getForeignCurrencyAmount,
    inheritanceType,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const getShowSystemExchangeRate = (value: string) => {
    if (!value) return true;
    return value?.toLowerCase() !== VND_CURRENCY.toLowerCase();
  };
  const [isShowSystemExchangeRate, setIsShowSystemExchangeRate] =
    useState(false);

  useEffect(() => {
    const isBoolean = getShowSystemExchangeRate(model.currency?.code);
    setIsShowSystemExchangeRate(isBoolean);
    if (!isBoolean) {
      handleChangeSingleField({
        fieldName: "isExchangeRate",
      })(true);
    }
  }, [model.currency?.code]);

  useEffect(() => {
    if (model.costType?.id) {
      const isHasCostGroup =
        model?.costType?.costGroups?.findIndex(
          (item: PaymentModel) => item.id === model.costGroup?.id
        ) !== -1;
      if (!isHasCostGroup) {
        handleChangeSingleField({
          fieldName: "costGroup",
        })(null);
      }
    }
  }, [model?.costType]);

  useEffect(() => {
    getForeignCurrencyAmount(model);
  }, [model.rateInfo, model.amount]);

  useEffect(() => {
    if (model.paymentRequestType?.code !== CODE_TYPE_ADVANCE_TUCN) {
      dispatchModel({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          isCheckImport: false,
        },
      });
    }
  }, [model.paymentRequestType]);
  const [
    isDisablePaymentRequestTypeSelect,
    setIsDisablePaymentRequestTypeSelect,
  ] = useState(false);

  useEffect(() => {
    if (model?.invoices?.length > 0) {
      setIsDisablePaymentRequestTypeSelect(true);
    } else {
      setIsDisablePaymentRequestTypeSelect(false);
    }
  }, [model?.invoices]);

  const handleChangePurposeOfPurchase = (value: any) => {
    handleChangeAllField({
      ...model,
      purposeOfPurchase: value,
      projectName: null,
      costLineId: null,
    });

    if (model?.costAllocation?.length > 0) {
      const costAllocation = model?.costAllocation?.map(
        (item: CostAllocation) => {
          return {
            ...item,
            projectId: null,
            costLineId: null,
          };
        }
      );
      handleChangeSingleField({
        fieldName: "costAllocation",
      })(costAllocation);
    }
  };

  return (
    <form className="payment-custom_grid_9">
      {/* payment request type */}
      <div className="payment-custom_grid_9-col_3">
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            "paymentRequestType"
          )}
        >
          <Select
            label={translate("PM.payment_request_type_input_label")}
            isRequired
            searchProperty="name"
            searchType=""
            type={BORDER_TYPE.BORDERED}
            valueFilter={{
              name: "typeGroup",
            }}
            isSmall={false}
            classFilter={undefined}
            getList={() => paymentRepository.getRequestsTypeList(typeGroup)}
            onChange={(value, object) => {
              handleChangeAllField({
                ...model,
                paymentRequestType: object,
                supplier: isEqual(object?.code, CODE_TYPE_ADVANCE_TUCN)
                  ? null
                  : model.supplier,
              });
            }}
            isEnumerable={false}
            render={(t) => getPaymentRequestTypeName(t?.name)}
            value={model.paymentRequestType}
            readOnly={model.isDetail}
            allowClear={false}
            disabled={
              isDisablePaymentRequestTypeSelect ||
              isEqual(
                inheritanceType,
                PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
              )
            }
          />
        </FormItem>
      </div>
      {/*payment cost type*/}
      <div className="payment-custom_grid_9-col_3">
        <FormItem
          validateObject={utilService.getValidateObj(model, "costTypeId")}
        >
          <Select
            label={translate("PM.payment_cost_type_input_label")}
            isRequired
            searchType=""
            placeHolder={translate("PM.payment_cost_type_input_placeholder")}
            type={BORDER_TYPE.BORDERED}
            valueFilter={{
              name: "",
            }}
            isSearch={true}
            isSmall={false}
            classFilter={undefined}
            getList={paymentRepository.getCostTypeList}
            onChange={handleChangeSelectField({
              fieldName: "costType",
              errorName: "costTypeId",
            })}
            isEnumerable={false}
            render={(costType) => {
              return costType?.id
                ? `${costType?.code} - ${costType?.name}`
                : null;
            }}
            value={model.costType}
            readOnly={model.isDetail}
            allowClear={false}
          />
        </FormItem>
      </div>
      {/*payment cost item*/}
      <div className="payment-custom_grid_9-col_3">
        <FormItem
          validateObject={utilService.getValidateObj(model, "costGroupId")}
        >
          <Select
            label={translate("PM.payment_cost_item_input_label")}
            isRequired
            searchProperty="name"
            placeHolder={translate("PM.payment_cost_item_input_placeholder")}
            searchType=""
            disabled={!model.costType?.id}
            type={BORDER_TYPE.BORDERED}
            valueFilter={{
              name: "",
              costTypeId: model.costType?.id,
            }}
            isSmall={false}
            classFilter={undefined}
            isSearch
            getList={paymentRepository.getCostTypeGroupList}
            onChange={handleChangeSelectField({
              fieldName: "costGroup",
              errorName: "costGroupId",
            })}
            isEnumerable={false}
            render={(t) => t?.name}
            value={model.costGroup}
            readOnly={model.isDetail}
            allowClear={false}
          />
        </FormItem>
      </div>
      {/*Proposed Amount*/}
      <div className="payment-custom_grid_9-col_3">
        <FormItem validateObject={utilService.getValidateObj(model, "amount")}>
          <InputNumber
            label={translate("PM.payment_proposed_amount_input_label")}
            isRequired
            translate={translate as TFunction}
            className="payment-custom_input"
            placeHolder={translate(
              "PM.payment_proposed_amount_input_placeholder"
            )}
            isSmall={false}
            onChange={handleChangeSingleField({
              fieldName: "amount",
            })}
            value={model.amount}
            isReverseSymb
            numberType={getNumberTypeByCurrency(model?.currency?.code)}
            allowNegative
            max={NUMBER_MAX_13}
            min={-NUMBER_MAX_13}
          />
        </FormItem>
      </div>
      {/*Currency Type*/}
      <div className="payment-custom_grid_9-col_3 position-relative">
        <FormItem
          validateObject={utilService.getValidateObj(model, "currencyId")}
        >
          {isShowSystemExchangeRate && (
            <div className="position-absolute payment-right_0">
              <Checkbox
                label={translate("PM.payment_exchange_system_rate_input_label")}
                checked={model.isExchangeRate}
                onChange={(value) => {
                  getBankExchangeRate(model?.currency, model, value);
                }}
              />
            </div>
          )}
          <Select
            label={translate("PM.payment_proposed_amount_input_unit_label")}
            disabled={
              size(model?.costAllocation) > 0 ||
              size(model?.invoices) > 0 ||
              size(model?.invoicesOtherDocument) > 0 ||
              size(model?.advancePaymentList) > 0 ||
              size(model?.depositApplicationList) > 0 ||
              size(model?.expenseApplicationList) > 0 ||
              isEqual(
                inheritanceType,
                PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
              )
            }
            isRequired
            searchType=""
            type={BORDER_TYPE.BORDERED}
            valueFilter={{
              name: "",
            }}
            isSearch={true}
            isSmall={false}
            classFilter={undefined}
            getList={paymentRepository.getCurrencyTypeList}
            onChange={(id, object) => {
              const objectT = object as CurrencyModel;
              getBankExchangeRate(objectT, model);
            }}
            isEnumerable={false}
            render={(curency) => {
              return curency?.id ? `${curency?.code} - ${curency?.name}` : null;
            }}
            value={model.currency}
            readOnly={model.isDetail}
            allowClear={false}
          />
        </FormItem>
      </div>
      {/*Payment Method*/}
      <div className="payment-custom_grid_9-col_3">
        <FormItem
          validateObject={utilService.getValidateObj(model, "paymentMethod")}
        >
          <Select
            label={translate("PM.payment_proposed_payment_method_input_label")}
            isRequired
            searchProperty="name"
            searchType=""
            type={BORDER_TYPE.BORDERED}
            valueFilter={{
              name: "",
            }}
            isSmall={false}
            classFilter={undefined}
            getList={() => of([PAYMENT_METHOD_TYPES[0]])}
            onChange={handleChangeSelectField({
              fieldName: "paymentMethod",
            })}
            isEnumerable={false}
            render={(t) => t?.name}
            value={model.paymentMethod}
            readOnly={model.isDetail}
            allowClear={false}
          />
        </FormItem>
      </div>

      {/*start Exchange rate*/}
      {!model.currency?.code ||
      model.currency?.code?.toLowerCase() === VND_CURRENCY.toLowerCase() ? (
        ""
      ) : (
        <div className="payment-custom_grid_9-col_9 payment-custom_grid_9">
          <div className="payment-custom_grid_9-col_3">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "foreignCurrencyAmount"
              )}
            >
              <InputText
                isRequired={true}
                label={translate(
                  "PM.payment_amount_convert_vnd_include_tax_input_label"
                )}
                className="payment-custom_input"
                readOnly={true}
                isSmall={false}
                onChange={handleChangeSingleField({
                  fieldName: "foreignCurrencyAmount",
                })}
                value={formatNumberToCurrency(
                  model.foreignCurrencyAmount,
                  true,
                  VND_CURRENCY
                )}
              />
            </FormItem>
          </div>
          <div className="payment-custom_grid_9-col_3 d-flex gap-2">
            <div className="w-100">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "rateInfo.rate"
                )}
              >
                <InputNumber
                  translate={translate as TFunction}
                  label={translate("PM.payment_exchange_rate_input_label")}
                  className="payment-custom_input"
                  isRequired={true}
                  readOnly={model.isExchangeRate}
                  isSmall={false}
                  onChange={(value) => {
                    handleChangeSingleField({
                      fieldName: "rateInfo",
                      errorName: "rateInfo.rate",
                    })({ ...model?.rateInfo, rate: value });
                  }}
                  value={model?.rateInfo?.rate}
                  isReverseSymb
                  numberType={"DECIMAL"}
                  allowNegative
                  max={10000000000000}
                />
              </FormItem>
            </div>
            <div className="w-100">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "rateInfo.date"
                )}
              >
                <DatePicker
                  className="payment-custom_datepicker"
                  label={translate("PM.payment_exchange_rate_date_input_label")}
                  translate={translate}
                  value={
                    model.rateInfo?.date ? dayjs(model.rateInfo?.date) : null
                  }
                  maxDate={dayjs()}
                  placeholder={"dd/mm/yyyy"}
                  readOnly={model.isExchangeRate}
                  isRequired={true}
                  isSmall={false}
                  size={"middle"}
                  onChange={(value) => {
                    handleChangeSingleField({
                      fieldName: "rateInfo",
                      errorName: "rateInfo.date",
                    })({ ...model?.rateInfo, date: value });
                  }}
                />
              </FormItem>
            </div>
          </div>
          <div className="payment-custom_grid_9-col_3">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "rateInfo.source"
              )}
            >
              <InputText
                translate={translate as TFunction}
                isRequired={true}
                label={translate("PM.payment_exchange_rate_source_input_label")}
                className="payment-custom_input"
                isSmall={false}
                readOnly={model.isExchangeRate}
                onChange={(value) => {
                  handleChangeSingleField({
                    fieldName: "rateInfo",
                    errorName: "rateInfo.source",
                  })({ ...model?.rateInfo, source: value });
                }}
                maxLength={255}
                value={model.rateInfo?.source}
              />
            </FormItem>
          </div>
        </div>
      )}
      <div className="payment-custom_grid_9-col_3 position-relative">
        <FormItem
          validateObject={utilService.getValidateObj(model, "actionDate")}
        >
          <DatePicker
            className="payment-custom_datepicker"
            label={translate("PM.payment_refund_due_date_input_label")}
            value={model.actionDate}
            placeholder={"dd/mm/yyyy"}
            isRequired={true}
            isSmall={false}
            size={"middle"}
            onChange={handleChangeDateField({
              fieldName: "actionDate",
            })}
            minDate={dayjs(formatDate(new Date()), DEFAULT_DATETIME_VALUE)}
            maxDate={dayjs(formatDate(new Date()), DEFAULT_DATETIME_VALUE).add(
              45,
              "day"
            )}
          />
        </FormItem>
      </div>
      {/*Proposal Explanation*/}
      <div className="payment-custom_grid_9-col_6">
        <FormItem
          validateObject={utilService.getValidateObj(model, "description")}
        >
          <InputText
            className="payment-custom_textArea"
            type={BORDER_TYPE.BORDERED}
            isByteCheck
            label={translate("PM.payment_proposed_explanation_input_label")}
            placeHolder={translate(
              "PM.payment_proposed_explanation_input_placeholder"
            )}
            onChange={handleChangeSingleField({
              fieldName: "proposalExplanation",
              errorName: "description",
            })}
            value={model.proposalExplanation}
            maxLength={240}
            isRequired={true}
            isSmall={false}
            translate={translate as TFunction}
            regexInput={NAME_BANK_REGEX}
            // showCount={true}
          />
        </FormItem>
      </div>
      {/*Purpose of Purchase and note*/}
      <div className="payment-custom_grid_9-col_9 payment-custom_grid_9">
        {/*Purpose*/}
        <div className="payment-custom_grid_9-col_3">
          <FormItem
            validateObject={utilService.getValidateObj(model, "paymentPurpose")}
          >
            <Select
              label={translate(
                "PM.payment_proposed_purpose_of_purchase_input_label"
              )}
              disabled={
                model.costAllocation?.length > 0 || !isNil(inheritanceType)
              }
              isRequired
              searchProperty="name"
              searchType=""
              type={BORDER_TYPE.BORDERED}
              valueFilter={{
                name: "",
              }}
              isSmall={false}
              classFilter={undefined}
              getList={() =>
                of(getPurposeOfPurchaseOptions(model?.paymentInheritanceType))
              }
              onChange={(value, obj) => handleChangePurposeOfPurchase(obj)}
              isEnumerable={false}
              render={(t) => t?.name}
              value={model.purposeOfPurchase}
              allowClear={false}
            />
          </FormItem>
        </div>
        {/*NOTE Purchase*/}
        {[
          SHOPPING_PURPOSES.NORMAL_SHOPPING,
          SHOPPING_PURPOSES.OTHER,
          SHOPPING_PURPOSES.STORAGE_PURCHASING,
          SHOPPING_PURPOSES.FINANCIAL_LEASE,
          SHOPPING_PURPOSES.OPERATING_LEASE,
          SHOPPING_PURPOSES.SOFTWARE_LEASE,
          SHOPPING_PURPOSES.NOT_PROMOTIONAL_PURCHASING,
          SHOPPING_PURPOSES.UNIFORM_PURCHASING,
        ].includes(Number(model.purposeOfPurchase?.id)) && (
          <div className="payment-custom_grid_9-col_6">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "paymentPurpose.note"
              )}
            >
              <InputText
                maxLength={500}
                label={translate(
                  "PM.payment_proposed_purpose_of_purchase_note_input_label"
                )}
                value={model.purposeOfPurchaseNote}
                placeHolder={translate(
                  "PM.payment_proposed_purpose_of_purchase_note_input_label_placeholder"
                )}
                onChange={handleChangeSingleField({
                  fieldName: "purposeOfPurchaseNote",
                  errorName: "paymentPurpose.note",
                })}
                type={BORDER_TYPE.BORDERED}
                isSmall={false}
                translate={translate as TFunction}
                disabled={!isNil(inheritanceType)}
                regexInput={NOT_TAB_ENTER_REGEX}
              />
            </FormItem>
          </div>
        )}

        {SHOPPING_PURPOSES.REPAIR_MAINTENANCE ===
          Number(model.purposeOfPurchase?.id) && (
          <div className="payment-custom_grid_9-col_6">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "paymentPurpose.assetCode"
              )}
            >
              <InputText
                label={translate("PM.payment_asset_code_input_label")}
                value={model.assetCode}
                isRequired={true}
                placeHolder={translate(
                  "PM.payment_asset_name_input_placeholder"
                )}
                onChange={handleChangeSingleField({
                  fieldName: "assetCode",
                  errorName: "paymentPurpose.assetCode",
                })}
                type={BORDER_TYPE.BORDERED}
                isSmall={false}
                maxLength={255}
                regexInput={NAME_BANK_REGEX}
                translate={translate as TFunction}
                disabled={!isNil(inheritanceType)}
              />
            </FormItem>
          </div>
        )}

        {SHOPPING_PURPOSES.PROMOTION_PROGRAM ===
          Number(model.purposeOfPurchase?.id) && (
          <div className="payment-custom_grid_9-col_6">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "paymentPurpose.promotionId"
              )}
            >
              <Select
                label={translate("PM.payment_promo_code_input_label")}
                placeHolder={translate(
                  "PM.payment_promo_code_enter_input_label"
                )}
                isRequired
                searchProperty="name"
                searchType=""
                isSearch={true}
                type={BORDER_TYPE.BORDERED}
                valueFilter={{
                  name: "",
                }}
                isSmall={false}
                classFilter={undefined}
                getList={paymentRepository.getPromotionList}
                onChange={handleChangeSelectField({
                  fieldName: "promoCode",
                  errorName: "paymentPurpose.promotionId",
                })}
                isEnumerable={false}
                render={(t) => t?.code}
                value={model.promoCode}
                disabled={model.isDetail || !isNil(inheritanceType)}
                allowClear={false}
              />
            </FormItem>
          </div>
        )}
        {SHOPPING_PURPOSES.ACCORDING_PROJECT ===
          Number(model.purposeOfPurchase?.id) && (
          <div className="payment-custom_grid_9-col_6">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "paymentPurpose.projectId"
              )}
            >
              <Select
                disabled={
                  model.costAllocation?.length > 0 || !isNil(inheritanceType)
                }
                label={translate("PM.payment_project_input_label")}
                isRequired
                searchProperty="name"
                searchType=""
                type={BORDER_TYPE.BORDERED}
                valueFilter={{
                  name: "",
                  isProject:
                    SHOPPING_PURPOSES.ACCORDING_PROJECT ===
                    Number(model.purposeOfPurchase?.id),
                }}
                isSmall={false}
                classFilter={undefined}
                isSearch={true}
                getList={paymentRepository.getProjectList}
                onChange={(id, value) => {
                  const arrayCostAllocation =
                    model?.costAllocation &&
                    model.costAllocation?.map((item) => {
                      return {
                        ...item,
                        projectId: null,
                        costLineId: null,
                      };
                    });
                  dispatchModel({
                    type: GeneralActionEnum.SET,
                    payload: {
                      ...model,
                      costAllocation: arrayCostAllocation,
                      projectName: value,
                      costLineId: value?.costLines?.[0],
                    },
                  });
                  handleChangeSelectField({
                    fieldName: "project",
                    errorName: "paymentPurpose.projectId",
                  })(id, value);
                }}
                isEnumerable={false}
                render={(t) => (t?.code ? `${t?.code} - ${t?.name}` : t?.name)}
                value={model.project}
                placeHolder={translate("PM.payment_project_input_placeholder")}
                allowClear={false}
              />
            </FormItem>
          </div>
        )}
        {SHOPPING_PURPOSES.PROMOTION_PROGRAM ===
          Number(model.purposeOfPurchase?.id) && (
          <div className="payment-custom_grid_9-col_9 payment-custom_grid_9">
            <div className="payment-custom_grid_9-col_3">
              <FormItem>
                <InputText
                  label={translate("PM.payment_promo_code_name_input_label")}
                  value={model.promoCode?.name}
                  type={BORDER_TYPE.BORDERED}
                  isSmall={false}
                  placeHolder={translate("---")}
                  readOnly={true}
                />
              </FormItem>
            </div>
            <div className="payment-custom_grid_9-col_3">
              <FormItem>
                <InputText
                  label={translate("PM.payment_promo_code_bugget_input_label")}
                  value={
                    model.promoCode?.budget
                      ? formatNumberToCurrency(Number(model.promoCode?.budget))
                      : ""
                  }
                  type={BORDER_TYPE.BORDERED}
                  isSmall={false}
                  readOnly={true}
                  placeHolder={translate("---")}
                />
              </FormItem>
            </div>
            <div className="payment-custom_grid_9-col_3">
              <FormItem>
                <InputText
                  label={translate(
                    "PM.payment_promo_code_time_implementation_input_label"
                  )}
                  value={
                    model.promoCode?.startDate
                      ? `${dayjs(model.promoCode?.startDate).format(
                          "DD/MM/YYYY"
                        )} - ${dayjs(model.promoCode?.endDate).format(
                          "DD/MM/YYYY"
                        )}`
                      : ""
                  }
                  type={BORDER_TYPE.BORDERED}
                  isSmall={false}
                  readOnly={true}
                  placeHolder={translate("---")}
                />
              </FormItem>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default AdvanceProposalContent;
