import { NUMBER_MAX_13 } from "config/const";
import {
  DEFAULT_DATETIME_VALUE,
  NAME_BANK_REGEX,
  NOT_TAB_ENTER_REGEX,
} from "core/config/consts";
import { getNumberTypeByCurrency } from "core/helpers/currency";
import { formatDate } from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import { isEqual } from "lodash";
import {
  CODE_TYPE_EXPENSE_DCCN,
  COST_PERIODS_ENUM,
  PAYMENT_INHERITANCE_TYPE_SUBMIT,
  PaymentCreateModel,
  PaymentModel,
  SHOPPING_PURPOSES,
  TYPE_OF_INVOICES,
  TypeOfInvoice,
} from "models/Payment";
import { getPurposeOfPurchaseOptions } from "pages/PaymentPage/PaymentCreate/Helper/Helper";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext, useEffect, useState } from "react";
import {
  BORDER_TYPE,
  DatePicker,
  DateRangePicker,
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import { of } from "rxjs";
import { paymentRepository } from "../../../../../../PaymentRepository";
import { getPaymentRequestTypeName } from "pages/PaymentPage/PaymentCreate/PaymentUtils";

const ExpenseProposalContent = () => {
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
    inheritanceType,
    setInitSearchInvoiceParams,
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
      model?.costAllocation?.length > 0 ||
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
              name: "name",
            }}
            isSmall={false}
            classFilter={undefined}
            getList={() => paymentRepository.getRequestsTypeList(typeGroup)}
            onChange={(value, object) => {
              handleChangeAllField({
                ...model,
                paymentRequestType: object,
                supplier: isEqual(object?.code, CODE_TYPE_EXPENSE_DCCN)
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
              isDisablePaymentFields?.isDisablePaymentRequestTypeSelect ||
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
      {/*Type of Payment Invoice*/}
      <div className="payment-custom_grid_9-col_3">
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
            getList={() => of(TYPE_OF_INVOICES)}
            onChange={(value, object) => {
              handleChangeSelectField({
                fieldName: "invoiceType",
              })(value, object);
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
            translate={translate as TFunction}
            isRequired
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
      {/*date*/}
      <div className="payment-custom_grid_9-col_3 position-relative">
        <FormItem
          validateObject={utilService.getValidateObj(model, "currencyId")}
        >
          <Select
            label={translate("PM.payment_proposed_amount_input_unit_label")}
            isRequired
            searchType=""
            disabled={true}
            type={BORDER_TYPE.BORDERED}
            valueFilter={{
              name: "",
            }}
            isSearch={true}
            isSmall={false}
            classFilter={undefined}
            getList={paymentRepository.getCurrencyTypeList}
            onChange={handleChangeSelectField({
              fieldName: "currency",
            })}
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

      <div className="payment-custom_grid_9-col_3 position-relative">
        <FormItem
          validateObject={utilService.getValidateObj(model, "actionDate")}
        >
          <DatePicker
            className="payment-custom_datepicker"
            label={translate("PM.payment_schedule_reimbursed_title")}
            value={model.actionDate}
            placeholder={"dd/mm/yyyy"}
            isRequired={true}
            isSmall={false}
            size={"middle"}
            onChange={handleChangeDateField({
              fieldName: "actionDate",
            })}
            minDate={dayjs(formatDate(new Date()), DEFAULT_DATETIME_VALUE)}
          />
        </FormItem>
      </div>

      {/*Proposal Explanation*/}
      <div className="payment-custom_grid_9-col_9">
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
                model.costAllocation?.length > 0 ||
                model?.paymentInheritanceType ===
                  PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO ||
                model?.paymentInheritanceType ===
                  PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PROPOSAL
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
              onChange={handleChangeSelectField({
                fieldName: "purposeOfPurchase",
              })}
              isEnumerable={false}
              render={(t) => t?.name}
              value={model.purposeOfPurchase}
              readOnly={model.isDetail}
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
                disabled={
                  model?.paymentInheritanceType ===
                    PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO ||
                  model?.paymentInheritanceType ===
                    PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PROPOSAL
                }
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
                disabled={
                  model?.paymentInheritanceType ===
                    PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO ||
                  model?.paymentInheritanceType ===
                    PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PROPOSAL
                }
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
                disabled={
                  model?.paymentInheritanceType ===
                    PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO ||
                  model?.paymentInheritanceType ===
                    PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PROPOSAL
                }
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
                readOnly={model.isDetail}
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
                  model.costAllocation?.length > 0 ||
                  model?.paymentInheritanceType ===
                    PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO ||
                  model?.paymentInheritanceType ===
                    PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PROPOSAL
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
                onChange={handleChangeSelectField({
                  fieldName: "project",
                  errorName: "paymentPurpose.projectId",
                })}
                isEnumerable={false}
                render={(t) => (t?.code ? `${t?.code} - ${t?.name}` : t?.name)}
                value={model.project}
                readOnly={model.isDetail}
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

export default ExpenseProposalContent;
