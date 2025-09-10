import { IcPlay } from "assets/icons";
import classNames from "classnames";
import { NUMBER_MAX_13 } from "config/const";
import { NAME_BANK_REGEX } from "core/config/consts";
import {
  detectIntegerCurrency,
  getNumberTypeByCurrency,
} from "core/helpers/currency";
import { formatNumber } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import dayjs, { Dayjs } from "dayjs";
import type { TFunction } from "i18next";
import {
  COST_DRIVER_TYPE,
  PaymentCreateModel,
  VND_CURRENCY,
} from "models/Payment";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { Dispatch, Key, SetStateAction, useContext, useEffect } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PaymentCreateHookContext } from "../../../../../PaymentCreateHook";
import ChargeableUnitDocumentTable from "../ChargeableUnitDocumentTable/ChargeableUnitDocumentTable";

interface Props {
  selectedRowKeys: Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
}

const AllocationAcreage = ({ selectedRowKeys, setSelectedRowKeys }: Props) => {
  const [translate] = useTranslation();
  const {
    model,
    paymentInheritanceInformation,
    handleChangeSelectField,
    handleChangeSingleField,
    handleChangeDateField,
    handleGetListCostCenterByAllocationMonth,
    dispatchModel,
    handleChangeAllField,
    formatNumberToCurrency,
    modalCostAllocation,
    isDisableAllocationMonth,
    setIsDisableAllocationMonth,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const getDisabledDate = (current: Dayjs | null) => {
    // Disable dates after the current month
    return current && current > dayjs().endOf("month");
  };

  useEffect(() => {
    handleChangeAllField({
      ...model,
      businessDepartmentId: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.businessUnitId]);

  useEffect(() => {
    let totalTaxAmount;
    let totalAmountBeforeTax;
    if (model?.invoices?.length > 0) {
      const amountBeforeTax = model?.invoices?.reduce(
        (total, item) => total + (item.amountBeforeTax || 0),
        0
      );
      const taxAmount = model?.invoices?.reduce(
        (total, item) => total + (item.taxAmount || 0),
        0
      );
      totalTaxAmount = formatNumberToCurrency(taxAmount);
      totalAmountBeforeTax = formatNumberToCurrency(amountBeforeTax);
    }
    if (model?.invoicesOtherDocument?.length > 0) {
      const amountBeforeTax = model?.invoicesOtherDocument?.reduce(
        (total, item) => total + (item.netAmount || 0),
        0
      );
      const taxAmount = model?.invoicesOtherDocument?.reduce(
        (total, item) => total + (item.taxAmount || 0),
        0
      );
      totalTaxAmount = formatNumberToCurrency(taxAmount);
      totalAmountBeforeTax = formatNumberToCurrency(amountBeforeTax);
    }
    if (model.invoicesOtherDocument?.length > 0 && model.invoices?.length > 0) {
      const amountBeforeTax1 = model?.invoices?.reduce(
        (total, item) => total + (item.amountBeforeTax || 0),
        0
      );
      const taxAmount1 = model?.invoices?.reduce(
        (total, item) => total + (item.taxAmount || 0),
        0
      );

      const amountBeforeTax2 = model?.invoicesOtherDocument?.reduce(
        (total, item) => total + (item.netAmount || 0),
        0
      );
      const taxAmount2 = model?.invoicesOtherDocument?.reduce(
        (total, item) => total + (item.taxAmount || 0),
        0
      );
      totalTaxAmount = formatNumberToCurrency(taxAmount1 + taxAmount2);
      totalAmountBeforeTax = formatNumberToCurrency(
        amountBeforeTax1 + amountBeforeTax2
      );
    }

    if (
      model.invoicesOtherDocument?.length === 0 &&
      model.invoices?.length === 0
    ) {
      totalTaxAmount = model?.taxToTalAmount
        ? formatNumber(model?.taxToTalAmount)
        : "0";
      totalAmountBeforeTax = model?.preTaxToTalAmount
        ? formatNumber(model?.preTaxToTalAmount)
        : "0";
    }

    if (totalAmountBeforeTax || totalTaxAmount) {
      dispatchModel({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          taxToTalAmount: detectIntegerCurrency(model?.currency?.code)
            ? totalTaxAmount?.replaceAll(".", "")
            : totalTaxAmount?.replaceAll(".", "")?.replaceAll(",", "."),
          preTaxToTalAmount: detectIntegerCurrency(model?.currency?.code)
            ? totalAmountBeforeTax?.replaceAll(".", "")
            : totalAmountBeforeTax?.replaceAll(".", "")?.replaceAll(",", "."),
        },
      });
    }

    if (!totalTaxAmount) {
      dispatchModel({
        type: GeneralActionEnum.SET,
        payload: {
          ...model,
          taxToTalAmount: model.taxToTalAmount || 0,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.invoices, model.invoicesOtherDocument, modalCostAllocation]);

  useEffect(() => {
    if (model.autoCostAllocationDocumentsAttach?.length == 0) {
      setIsDisableAllocationMonth(false);
    }
  }, [model.autoCostAllocationDocumentsAttach]);

  return (
    <div>
      {model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_QUANTITY ? (
        <div className="payment-custom_grid_9 payment-align_items_end payment-gap-12">
          <div className="payment-custom_grid_9-col_6">
            <Select
              isRequired
              isSmall={false}
              label={translate("PM.payment_cost_allocation_label")}
              value={model.costDriver}
              classFilter={undefined}
              render={(t) => t?.name}
              readOnly
            />
          </div>
          <div className="payment-custom_grid_9-col_3">
            <div className="p-y--2xs">
              <Checkbox
                label={translate("PM.payment_just_one_unit_price_label")}
                checked={model.isPriceExcludingTax}
                onChange={
                  handleChangeSingleField({
                    fieldName: "isPriceExcludingTax",
                  }) as () => (value: boolean) => void
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="payment-custom_grid_9 payment-gap-12">
          <div
            className={classNames(
              model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_AREA
                ? "payment-custom_grid_9-col_3"
                : "payment-custom_grid_9-col_6"
            )}
          >
            <Select
              isRequired
              isSmall={false}
              label={translate("PM.payment_cost_allocation_label")}
              value={model.costDriver}
              classFilter={undefined}
              render={(t) => t?.name}
              readOnly
            />
          </div>
          {(model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_AREA ||
            model.costDriver?.code ===
              COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY) && (
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "allocationMonth"
                )}
              >
                <DatePicker
                  disabled={
                    isDisableAllocationMonth &&
                    model.autoCostAllocationDocumentsAttach?.length > 0
                  }
                  className="payment-custom_datepicker"
                  label={translate("PM.payment_month_of_allocation_label")}
                  placeholder={"MM-YYYY"}
                  isRequired
                  isSmall={false}
                  picker="month"
                  dateFormat={["MM-YYYY"]}
                  value={model.allocationMonth}
                  onChange={handleChangeDateField({
                    fieldName: "allocationMonth",
                  })}
                  disabledDate={getDisabledDate}
                />
              </FormItem>
            </div>
          )}
          {/* Chi tiết khoản chi */}
          {(model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_AREA ||
            model.costDriver?.code ===
              COST_DRIVER_TYPE.COST_DRIVER_PERCENTAGE) && (
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "expenseDetail"
                )}
              >
                <InputText
                  label={translate("PM.payment_expense_detail_label")}
                  placeHolder={translate(
                    "PM.payment_expense_detail_placeholder"
                  )}
                  isSmall={false}
                  value={model.expenseDetail}
                  onChange={handleChangeSingleField({
                    fieldName: "expenseDetail",
                  })}
                  isByteCheck
                  maxLength={240}
                  regexInput={NAME_BANK_REGEX}
                  translate={translate as TFunction}
                />
              </FormItem>
            </div>
          )}
        </div>
      )}

      {model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_QUANTITY && (
        <div className="payment-custom_grid_9 payment-gap-12 m-t--sm">
          {/* Chi tiết khoản chi */}
          <div
            className={classNames(
              model.isPriceExcludingTax == true
                ? "payment-custom_grid_9-col_3"
                : "payment-custom_grid_9-col_6"
            )}
          >
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "expenseDetail"
              )}
            >
              <InputText
                label={translate("PM.payment_expense_detail_label")}
                placeHolder={translate("PM.payment_expense_detail_placeholder")}
                isSmall={false}
                value={model.expenseDetail}
                onChange={handleChangeSingleField({
                  fieldName: "expenseDetail",
                })}
                isByteCheck
                maxLength={240}
                regexInput={NAME_BANK_REGEX}
                translate={translate as TFunction}
              />
            </FormItem>
          </div>
          {model.isPriceExcludingTax &&
            model.costDriver?.code ===
              COST_DRIVER_TYPE.COST_DRIVER_QUANTITY && (
              <div className="payment-custom_grid_9-col_3">
                <FormItem
                  validateObject={utilService.getValidateObj(
                    model,
                    `preTaxUnitPrice`
                  )}
                >
                  <InputNumber
                    isRequired
                    label={translate("PM.payment_price_excluding_tax")}
                    placeHolder={translate(
                      "PM.payment_price_excluding_tax_placeholder"
                    )}
                    isSmall={false}
                    value={model.preTaxUnitPrice}
                    onChange={handleChangeSingleField({
                      fieldName: "preTaxUnitPrice",
                    })}
                    isReverseSymb
                    numberType={
                      model.currency?.code != VND_CURRENCY ? "DECIMAL" : null
                    }
                    allowNegative
                    max={NUMBER_MAX_13}
                    min={-NUMBER_MAX_13}
                  />
                </FormItem>
              </div>
            )}
          {/* Loại thuế */}
          <div className="payment-custom_grid_9-col_3">
            <Select
              isSmall={false}
              label={translate("PM.payment_tax_type_label")}
              placeHolder={translate("PM.payment_tax_type_placeholder")}
              searchProperty="name"
              searchType=""
              type={1}
              valueFilter={{
                name: "",
                taxType: model.taxTypeEnum,
              }}
              classFilter={undefined}
              isSearch
              onChange={handleChangeSelectField({
                fieldName: "taxId",
              })}
              value={model.taxId}
              getList={paymentRepository.taxType}
              render={(tax) => (tax?.id ? `${tax?.code} - ${tax?.name}` : null)}
              isEnumerable={false}
            />
          </div>
        </div>
      )}
      {model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_AREA && (
        <div className="payment-custom_grid_9 payment-gap-12 m-t--sm">
          <>
            {/* Tổng số tiền chưa thuế cần phân bổ */}
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "preTaxToTalAmount"
                )}
              >
                <InputNumber
                  label={translate(
                    "PM.payment_total_pre_tax_amount_allocation_label"
                  )}
                  isRequired
                  placeHolder={translate("PM.payment_total_amount_placeholder")}
                  isSmall={false}
                  value={model.preTaxToTalAmount}
                  onChange={handleChangeSingleField({
                    fieldName: "preTaxToTalAmount",
                  })}
                  isReverseSymb
                  numberType={getNumberTypeByCurrency(model?.currency?.code)}
                  allowNegative
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  translate={translate as TFunction}
                />
              </FormItem>
            </div>
            {/* Loại thuế */}
            <div className="payment-custom_grid_9-col_3">
              <Select
                isSmall={false}
                label={translate("PM.payment_tax_type_label")}
                placeHolder={translate("PM.payment_tax_type_placeholder")}
                searchProperty="name"
                searchType=""
                type={1}
                valueFilter={{
                  name: "",
                  taxType: model.taxTypeEnum,
                }}
                classFilter={undefined}
                isSearch
                onChange={handleChangeSelectField({
                  fieldName: "taxId",
                })}
                value={model.taxId}
                getList={paymentRepository.taxType}
                isEnumerable={false}
                render={(tax) =>
                  tax?.id ? `${tax?.code} - ${tax?.name}` : null
                }
              />
            </div>
            {/* Tổng số tiền thuế cần phân bổ */}
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "taxToTalAmount"
                )}
              >
                <InputNumber
                  isRequired
                  label={translate(
                    "PM.payment_total_tax_amount_allocation_label"
                  )}
                  placeHolder={translate("PM.payment_total_amount_placeholder")}
                  isSmall={false}
                  value={model.taxToTalAmount}
                  onChange={handleChangeSingleField({
                    fieldName: "taxToTalAmount",
                  })}
                  isReverseSymb
                  numberType={getNumberTypeByCurrency(model?.currency?.code)}
                  allowNegative
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  translate={translate}
                />
              </FormItem>
            </div>
          </>
        </div>
      )}

      {model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_PERCENTAGE && (
        <div className="payment-custom_grid_9 payment-gap-12 m-t--sm">
          <>
            {/* Tổng số tiền chưa thuế cần phân bổ */}
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "preTaxToTalAmount"
                )}
              >
                <InputNumber
                  label={translate(
                    "PM.payment_total_pre_tax_amount_allocation_label"
                  )}
                  isRequired
                  placeHolder={translate("PM.payment_total_amount_placeholder")}
                  isSmall={false}
                  value={model.preTaxToTalAmount}
                  onChange={handleChangeSingleField({
                    fieldName: "preTaxToTalAmount",
                  })}
                  isReverseSymb
                  numberType={getNumberTypeByCurrency(model?.currency?.code)}
                  allowNegative
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  translate={translate as TFunction}
                />
              </FormItem>
            </div>
            {/* Loại thuế */}
            <div className="payment-custom_grid_9-col_3">
              <Select
                isSmall={false}
                label={translate("PM.payment_tax_type_label")}
                placeHolder={translate("PM.payment_tax_type_placeholder")}
                searchProperty="name"
                searchType=""
                type={1}
                valueFilter={{
                  name: "",
                  taxType: model.taxTypeEnum,
                }}
                classFilter={undefined}
                isSearch
                onChange={handleChangeSelectField({
                  fieldName: "taxId",
                })}
                value={model.taxId}
                getList={paymentRepository.taxType}
                isEnumerable={false}
                render={(tax) =>
                  tax?.id ? `${tax?.code} - ${tax?.name}` : null
                }
              />
            </div>
            {/* Tổng số tiền thuế cần phân bổ */}
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "taxToTalAmount"
                )}
              >
                <InputNumber
                  isRequired
                  label={translate(
                    "PM.payment_total_tax_amount_allocation_label"
                  )}
                  placeHolder={translate("PM.payment_total_amount_placeholder")}
                  isSmall={false}
                  value={model.taxToTalAmount || 0}
                  onChange={handleChangeSingleField({
                    fieldName: "taxToTalAmount",
                  })}
                  isReverseSymb
                  numberType={getNumberTypeByCurrency(model?.currency?.code)}
                  allowNegative
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                />
              </FormItem>
            </div>
          </>
        </div>
      )}

      {model.costDriver?.code ===
        COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY && (
        <>
          <div className="payment-custom_grid_9 payment-gap-12 m-t--sm">
            {/* Chi tiết khoản chi */}
            <div className="payment-custom_grid_9-col_6">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "expenseDetail"
                )}
              >
                <InputText
                  label={translate("PM.payment_expense_detail_label")}
                  placeHolder={translate(
                    "PM.payment_expense_detail_placeholder"
                  )}
                  isSmall={false}
                  value={model.expenseDetail}
                  onChange={handleChangeSingleField({
                    fieldName: "expenseDetail",
                  })}
                  isByteCheck
                  maxLength={240}
                  regexInput={NAME_BANK_REGEX}
                  translate={translate as TFunction}
                />
              </FormItem>
            </div>
            {/* Tổng số tiền chưa thuế cần phân bổ */}
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "preTaxToTalAmount"
                )}
              >
                <InputNumber
                  label={translate(
                    "PM.payment_total_pre_tax_amount_allocation_label"
                  )}
                  isRequired
                  placeHolder={translate("PM.payment_total_amount_placeholder")}
                  isSmall={false}
                  value={model.preTaxToTalAmount}
                  onChange={handleChangeSingleField({
                    fieldName: "preTaxToTalAmount",
                  })}
                  isReverseSymb
                  numberType={getNumberTypeByCurrency(model?.currency?.code)}
                  allowNegative
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                  translate={translate as TFunction}
                />
              </FormItem>
            </div>
          </div>
          <div className="payment-custom_grid_9 payment-gap-12 m-t--sm">
            {/* Loại thuế */}
            <div className="payment-custom_grid_9-col_6">
              <Select
                isSmall={false}
                label={translate("PM.payment_tax_type_label")}
                placeHolder={translate("PM.payment_tax_type_placeholder")}
                searchProperty="name"
                searchType=""
                type={1}
                valueFilter={{
                  name: "",
                  taxType: model.taxTypeEnum,
                }}
                classFilter={undefined}
                isSearch
                onChange={handleChangeSelectField({
                  fieldName: "taxId",
                })}
                value={model.taxId}
                getList={paymentRepository.taxType}
                isEnumerable={false}
                render={(tax) =>
                  tax?.id ? `${tax?.code} - ${tax?.name}` : null
                }
              />
            </div>
            {/* Tổng số tiền thuế cần phân bổ */}
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "taxToTalAmount"
                )}
              >
                <InputNumber
                  isRequired
                  label={translate(
                    "PM.payment_total_tax_amount_allocation_label"
                  )}
                  placeHolder={translate("PM.payment_total_amount_placeholder")}
                  isSmall={false}
                  value={model.taxToTalAmount || 0}
                  onChange={handleChangeSingleField({
                    fieldName: "taxToTalAmount",
                  })}
                  isReverseSymb
                  numberType={getNumberTypeByCurrency(model?.currency?.code)}
                  allowNegative
                  max={NUMBER_MAX_13}
                  min={-NUMBER_MAX_13}
                />
              </FormItem>
            </div>
          </div>
        </>
      )}

      <div className="fs-8 fw-semibold m-t--lg m-b--2xs">
        {translate("PM.payment_list_of_units_subject_to_charges")}
      </div>
      {(model.costDriver?.code === COST_DRIVER_TYPE.COST_DRIVER_AREA ||
        model.costDriver?.code ===
          COST_DRIVER_TYPE.COST_DRIVER_EMPLOYEE_QUANTITY) && (
        <div className="payment-custom_grid_12 payment-custom_grid_12-align-end">
          {/* Btn Lấy đơn vị chịu phí từ cấu hình */}
          <div className="payment-custom_grid_12-col_3">
            <Button
              icon={<img src={IcPlay} alt="icon" width={11} height={13} />}
              size="lg"
              iconPlace="left"
              type="secondary"
              disabled={!model.allocationMonth}
              onClick={handleGetListCostCenterByAllocationMonth}
            >
              {translate("PM.payment_get_chargeable_unit_from_the_config_btn")}
            </Button>
          </div>
          {/* CN/PGD */}
          <div className="payment-custom_grid_12-col_3">
            <Select
              placeHolder={translate("PM.payment_cn_pgd")}
              classFilter={undefined}
              searchProperty="name"
              searchType=""
              isSearch={true}
              valueFilter={{
                name: "",
                ...paymentInheritanceInformation,
              }}
              getList={paymentRepository.listBusinessBranchId}
              onChange={handleChangeSelectField({
                fieldName: "businessBranchId",
              })}
              isEnumerable={false}
              render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
              value={model.businessBranchId}
              readOnly={model.isDetail}
            />
          </div>
          {/* NHCD/Khối */}
          <div className="payment-custom_grid_12-col_3">
            <Select
              placeHolder={translate("PM.payment_nhcd")}
              classFilter={undefined}
              searchProperty="name"
              searchType=""
              isSearch={true}
              valueFilter={{
                name: "",
                ...paymentInheritanceInformation,
              }}
              onChange={handleChangeSelectField({
                fieldName: "businessUnitId",
              })}
              getList={budgetRepository.costOwnerList}
              isEnumerable={false}
              render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
              value={model.businessUnitId}
              readOnly={model.isDetail}
            />
          </div>
          {/* TT/PB */}
          <div className="payment-custom_grid_12-col_3">
            <Select
              disabled={!model.businessUnitId}
              placeHolder={translate("PM.payment_tt_pb")}
              classFilter={undefined}
              searchProperty="name"
              searchType=""
              isSearch={true}
              valueFilter={{
                name: "",
                businessUnitId: model.businessUnitId?.id || "",
                ...paymentInheritanceInformation,
              }}
              getList={paymentRepository.businessDepartment}
              onChange={handleChangeSelectField({
                fieldName: "businessDepartmentId",
              })}
              isEnumerable={false}
              render={(t) => (t ? `${t?.code} - ${t?.name}` : "")}
              value={model.businessDepartmentId}
              readOnly={model.isDetail}
            />
          </div>
        </div>
      )}
      <div>
        <ChargeableUnitDocumentTable
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </div>
    </div>
  );
};

export default AllocationAcreage;
