import { Collapse } from "antd";
import { CollapseProps } from "antd/lib";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
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
import {
  CODE_TYPE_PAYMENT_REQUEST_PER,
  PaymentCreateModel,
  PaymentModel,
  SHOPPING_PURPOSES,
} from "models/Payment";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext, useEffect } from "react";
import {
  BORDER_TYPE,
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
import { of } from "rxjs";
import { paymentRepository } from "../../../../../../PaymentRepository";
import AccountingEntryInvoiceInformation from "../AccountingEntryInvoiceInformation/AccountingEntryInvoiceInformation";
import { getPurposeOfPurchaseOptions } from "pages/PaymentPage/PaymentCreate/Helper/Helper";
import { getPaymentRequestTypeName } from "pages/PaymentPage/PaymentCreate/PaymentUtils";

enum ItemsOfGeneralInformationSectionKey {
  REQUEST_TYPE,
  EXPENSE,
  FINANCIAL_INVOICE_INFORMATION,
}

const AccountingEntryProposalContent = () => {
  const {
    translate,
    model,
    handleChangeSelectField,
    handleChangeDateField,
    handleChangeSingleField,
    dispatchModel,
    typeGroup,
    formatNumberToCurrency,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);

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

  const renderPaymentRequestType = () => {
    return (
      <div className="payment-custom_grid_9 w-100">
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
              disabled={true}
              searchType=""
              type={BORDER_TYPE.BORDERED}
              valueFilter={{
                name: "typeGroup",
              }}
              isSmall={false}
              classFilter={undefined}
              getList={() => paymentRepository.getRequestsTypeList(typeGroup)}
              onChange={handleChangeSelectField({
                fieldName: "paymentRequestType",
              })}
              isEnumerable={false}
              render={(t) => getPaymentRequestTypeName(t?.name)}
              value={model.paymentRequestType}
              readOnly={model.isDetail}
              allowClear={false}
            />
          </FormItem>
        </div>
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
      </div>
    );
  };

  const renderExpensePayment = () => {
    return (
      <div className="payment-custom_grid_9-col_9">
        <div>
          <div className="payment-custom_grid_9">
            {/*Proposed Amount*/}
            <div className="payment-custom_grid_9-col_3">
              <FormItem
                validateObject={utilService.getValidateObj(model, "amount")}
              >
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
            {/*Currency Type*/}
            <div className="payment-custom_grid_9-col_3 position-relative">
              <FormItem
                validateObject={utilService.getValidateObj(model, "currencyId")}
              >
                <Select
                  label={translate(
                    "PM.payment_proposed_amount_input_unit_label"
                  )}
                  isRequired
                  disabled
                  searchType=""
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
                    return curency?.id
                      ? `${curency?.code} - ${curency?.name}`
                      : null;
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
                  label={translate("PM.payment_accounting_period_title")}
                  value={model.actionDate}
                  placeholder={"dd/mm/yyyy"}
                  isRequired={true}
                  isSmall={false}
                  size={"middle"}
                  onChange={handleChangeDateField({
                    fieldName: "actionDate",
                  })}
                  maxDate={dayjs(
                    formatDate(new Date()),
                    DEFAULT_DATETIME_VALUE
                  )}
                />
              </FormItem>
            </div>
          </div>
        </div>
        {/*Proposal Explanation*/}
        <div className="payment-custom_grid_9-col_9 my-3">
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
              validateObject={utilService.getValidateObj(
                model,
                "paymentPurpose"
              )}
            >
              <Select
                label={translate(
                  "PM.payment_proposed_purpose_of_purchase_input_label"
                )}
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
                  render={(t) =>
                    t?.code ? `${t?.code} - ${t?.name}` : t?.name
                  }
                  value={model.project}
                  readOnly={model.isDetail}
                  placeHolder={translate(
                    "PM.payment_project_input_placeholder"
                  )}
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
                    label={translate(
                      "PM.payment_promo_code_bugget_input_label"
                    )}
                    value={
                      model.promoCode?.budget
                        ? formatNumberToCurrency(
                            Number(model.promoCode?.budget)
                          )
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
      </div>
    );
  };

  const collapseItemsInGeneral: CollapseProps["items"] = [
    {
      key: ItemsOfGeneralInformationSectionKey.REQUEST_TYPE,
      label: (
        <div className="fw-semibold">{translate("PM.payment_type_txt")}</div>
      ),
      children: renderPaymentRequestType(),
    },
    {
      key: ItemsOfGeneralInformationSectionKey.EXPENSE,
      label: (
        <div className="fw-semibold">
          {translate("PM.payment_expense_title")}
        </div>
      ),
      children: renderExpensePayment(),
    },
    {
      key: ItemsOfGeneralInformationSectionKey.FINANCIAL_INVOICE_INFORMATION,
      label: (
        <div className="fw-semibold">
          {translate("PM.payment_financial_invoice_issuance_information_title")}
        </div>
      ),
      children: <AccountingEntryInvoiceInformation />,
    },
  ].filter(Boolean);

  return (
    <div className="payment-custom_grid_9">
      {/*payment cost type*/}
      <div className="payment-custom_grid_9-col_9 payment-title_collage payment-title_collage_accounting payment-title_collage">
        <Collapse
          ghost
          className="collage_custom collage_custom_border collage_custom_border_accounting"
          items={collapseItemsInGeneral}
          defaultActiveKey={[
            ItemsOfGeneralInformationSectionKey.REQUEST_TYPE,
            ItemsOfGeneralInformationSectionKey.EXPENSE,
            ItemsOfGeneralInformationSectionKey.FINANCIAL_INVOICE_INFORMATION,
          ]}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <div>
              <img
                src={IcArrowDown}
                className={classNames(
                  "invoice-transition",
                  isActive && "invoice-transition_expand"
                )}
                alt=""
              />
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default AccountingEntryProposalContent;
