import { NUMBER_MAX_13 } from "config/const";
import { NAME_BANK_REGEX, NOT_TAB_ENTER_REGEX } from "core/config/consts";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import { isEqual, isNil, size } from "lodash";
import {
  CODE_TYPE_PAYMENT_REQUEST_PER,
  COST_PERIODS_ENUM,
  CostAllocation,
  CurrencyModel,
  PAYMENT_INHERITANCE_TYPE_SUBMIT,
  PAYMENT_METHOD_TYPES,
  PaymentCreateModel,
  PaymentModel,
  SHOPPING_PURPOSES,
  TYPE_OF_INVOICES,
  TypeOfInvoice,
  VND_CURRENCY,
} from "models/Payment";
import { useContext, useEffect, useState } from "react";
import {
  BORDER_TYPE,
  Checkbox,
  DatePicker,
  DateRangePicker,
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import { map, of } from "rxjs";
import { paymentRepository } from "../../../PaymentRepository";
import { getPurposeOfPurchaseOptions } from "../../Helper/Helper";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";
import { getPaymentRequestTypeName } from "../../PaymentUtils";

const ProposalContent = () => {
  const {
    translate,
    model,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeSingleField,
    dispatchModel,
    typeGroup,
    formatNumberToCurrency,
    getBankExchangeRate,
    getForeignCurrencyAmount,
    handleChangeAllField,
    setInitSearchInvoiceParams,
    inheritanceType,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const getShowFieldStartAllocation = () => {
    const start =
      model.service_usage_time?.[0] &&
      dayjs(model.service_usage_time[0])?.isValid()
        ? model.service_usage_time[0]
        : null;
    const end =
      model.service_usage_time?.[1] &&
      dayjs(model.service_usage_time[1])?.isValid()
        ? model.service_usage_time[1]
        : null;
    if (start && end) {
      const currentMonth = dayjs().month() + 1;
      const endMonth = end.month() + 1;
      const currentYear = dayjs().year();
      const endYear = dayjs(end).year();
      if (endYear > currentYear) {
        return true;
      } else if (endYear < currentYear) {
        return false;
      } else {
        return endMonth > currentMonth;
      }
    }
    return false;
  };

  const [isShowAllocationDate, setIsShowAllocationDate] = useState(false);

  useEffect(() => {
    const isShowAllocation = getShowFieldStartAllocation();
    handleChangeSingleField({
      fieldName: "isShowAllocation",
    })(isShowAllocation);

    setIsShowAllocationDate(isShowAllocation);
  }, [model?.service_usage_time]);

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
      handleChangeAllField({
        ...model,
        isExchangeRate: true,
      });
    }
  }, [model?.currency?.code]);

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
  }, [model?.rateInfo, model?.amount]);

  useEffect(() => {
    if (model.paymentRequestType?.code !== CODE_TYPE_PAYMENT_REQUEST_PER) {
      dispatchModel({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          isCheckImport: false,
        },
      });
    }
  }, [model.paymentRequestType]);

  const [isDisablePaymentFields, setIsDisablePaymentFields] = useState({
    isDisablePaymentRequestTypeSelect: false,
    isDisableInvoiceTypeSelect: false,
  });

  useEffect(() => {
    if (
      model?.advancePaymentList?.length > 0 ||
      model?.depositApplicationList?.length > 0 ||
      model?.expenseApplicationList?.length > 0 ||
      model?.invoices?.length > 0
    ) {
      setIsDisablePaymentFields((pre) => {
        return { ...pre, isDisablePaymentRequestTypeSelect: true };
      });
    } else {
      setIsDisablePaymentFields((pre) => {
        return { ...pre, isDisablePaymentRequestTypeSelect: false };
      });
    }
    if (
      model?.invoices?.length > 0 ||
      model?.invoicesOtherDocument?.length > 0
    ) {
      setIsDisablePaymentFields((pre) => {
        return { ...pre, isDisableInvoiceTypeSelect: true };
      });
    } else {
      setIsDisablePaymentFields((pre) => {
        return { ...pre, isDisableInvoiceTypeSelect: false };
      });
    }
  }, [
    model?.advancePaymentList,
    model?.depositApplicationList,
    model?.expenseApplicationList,
    model?.invoices,
    model?.costAllocation,
  ]);

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
                supplier: isEqual(object?.code, CODE_TYPE_PAYMENT_REQUEST_PER)
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
              isDisablePaymentFields.isDisablePaymentRequestTypeSelect ||
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
            value={model.costType}
            readOnly={model.isDetail}
            allowClear={false}
            render={(costType) => {
              return costType?.id
                ? `${costType?.code} - ${costType?.name}`
                : null;
            }}
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
      {/*Type of Payment Invoice*/}
      <div className="payment-custom_grid_9-col_3">
        <div className="d-flex gap-12">
          <div className="w-50">
            <FormItem
              validateObject={utilService.getValidateObj(model, "invoiceType")}
            >
              <Select
                label={translate("PM.payment_invoice_type_label")}
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
                  of(TYPE_OF_INVOICES).pipe(
                    map((items) => {
                      if (!isNil(inheritanceType)) {
                        return items;
                      }
                      return items.filter((item) => {
                        return item.id === TypeOfInvoice.NEW_INVOICE;
                      });
                    })
                  )
                }
                onChange={(value, object) => {
                  if (isEqual(value, TypeOfInvoice.OLD_INVOICE)) {
                    handleChangeAllField({
                      ...model,
                      costAllocation: [],
                      invoiceTypeId: value,
                      invoiceType: object,
                    });
                  } else {
                    handleChangeSelectField({
                      fieldName: "invoiceType",
                    })(value, object);
                  }
                  setInitSearchInvoiceParams((prevState) => ({
                    ...prevState,
                    isNew: isEqual(value, TypeOfInvoice.NEW_INVOICE),
                  }));
                }}
                isEnumerable={false}
                render={(t) => t?.name}
                value={model.invoiceType}
                readOnly={model.isDetail}
                allowClear={false}
                disabled={isDisablePaymentFields?.isDisableInvoiceTypeSelect}
              />
            </FormItem>
          </div>
          <div className="w-50">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "paymentDueDate"
              )}
            >
              <DatePicker
                className="payment-custom_datepicker"
                label={translate("PM.payment_due_date_input_label")}
                value={model.paymentDueDate}
                placeholder={"dd/mm/yyyy"}
                isSmall={false}
                size={"middle"}
                onChange={handleChangeDateField({
                  fieldName: "paymentDueDate",
                })}
                minDate={dayjs()}
              />
            </FormItem>
          </div>
        </div>
      </div>
      {/*Cost Period and Allocation Time*/}
      <div className="payment-custom_grid_9-col_3">
        <div className="d-flex gap-2">
          <FormItem
            validateObject={utilService.getValidateObj(model, "costPeriod")}
          >
            <Select
              label={translate("PM.payment_cost_period_input_label")}
              isRequired
              searchProperty="name"
              searchType=""
              type={BORDER_TYPE.BORDERED}
              isSearch={true}
              valueFilter={{
                name: "",
              }}
              isSmall={false}
              classFilter={undefined}
              getList={paymentRepository.getListCostPeriods}
              onChange={handleChangeSelectField({
                fieldName: "costPeriod",
              })}
              isEnumerable={false}
              render={(t) => t?.name}
              value={model.costPeriod}
              readOnly={model.isDetail}
              allowClear={false}
            />
          </FormItem>
          {isShowAllocationDate &&
            model?.costPeriod?.id !== COST_PERIODS_ENUM.ONCE && (
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "allocationDate"
                )}
              >
                <DatePicker
                  className="payment-custom_datepicker"
                  label={translate(
                    "PM.payment_allocation_time_start_date_input_label"
                  )}
                  value={model.allocationDate}
                  placeholder={"dd/mm/yyyy"}
                  isRequired={true}
                  isSmall={false}
                  size={"middle"}
                  onChange={handleChangeDateField({
                    fieldName: "allocationDate",
                  })}
                  minDate={dayjs().startOf("month")}
                />
              </FormItem>
            )}
        </div>
      </div>
      {/*Service Usage Time*/}
      <div className="payment-custom_grid_9-col_3">
        {model.costPeriod?.id.toString() !== "0" ? (
          <FormItem
            validateObject={utilService.getValidateObj(model, "startPeriod")}
          >
            <DateRangePicker
              value={model.service_usage_time || [null, null]}
              onChange={handleChangeDateField({
                fieldName: "service_usage_time",
                errorName: "startPeriod",
              })}
              className="payment-custom_datepicker"
              label={translate("PM.payment_service_usage_time_input_label")}
              dateFormat={["DD/MM/YYYY", "DD/MM/YYYY"]}
              isSmall={false}
              isRequired={true}
              placeholder={[
                translate("PM.payment_date_from_input_label"),
                translate("PM.payment_date_to_input_label"),
              ]}
            />
          </FormItem>
        ) : (
          <div></div>
        )}
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
            isRequired
            searchType=""
            type={BORDER_TYPE.BORDERED}
            valueFilter={{
              name: "",
            }}
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
            getList={() => of(PAYMENT_METHOD_TYPES)}
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
                  value={model.rateInfo?.rate}
                  isReverseSymb
                  numberType={"DECIMAL"}
                  allowNegative
                  max={NUMBER_MAX_13}
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
                  value={
                    model.rateInfo?.date ? dayjs(model.rateInfo?.date) : null
                  }
                  translate={translate as TFunction}
                  placeholder={"dd/mm/yyyy"}
                  readOnly={model.isExchangeRate}
                  isRequired={true}
                  isSmall={false}
                  size={"middle"}
                  maxDate={dayjs()}
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
      {/*end Exchange rate*/}

      {/*Proposal Explanation*/}
      <div className="payment-custom_grid_9-col_9">
        <FormItem
          validateObject={utilService.getValidateObj(model, "description")}
        >
          <InputText
            className="payment-custom_textArea"
            type={BORDER_TYPE.BORDERED}
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
            isByteCheck
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
                disabled={!isNil(inheritanceType)}
                translate={translate as TFunction}
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

export default ProposalContent;
