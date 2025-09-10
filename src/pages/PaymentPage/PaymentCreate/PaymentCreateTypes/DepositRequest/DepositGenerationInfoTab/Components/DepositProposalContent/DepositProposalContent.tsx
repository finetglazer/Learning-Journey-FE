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
  PAYMENT_INHERITANCE_TYPE_SUBMIT,
  PAYMENT_METHOD_TYPES,
  PaymentCreateModel,
  PaymentModel,
  SHOPPING_PURPOSES,
} from "models/Payment";
import { getPurposeOfPurchaseOptions } from "pages/PaymentPage/PaymentCreate/Helper/Helper";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { getPaymentRequestTypeName } from "pages/PaymentPage/PaymentCreate/PaymentUtils";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
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

const DepositProposalContent = () => {
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
            onChange={handleChangeSelectField({
              fieldName: "paymentRequestType",
            })}
            isEnumerable={false}
            render={(t) => getPaymentRequestTypeName(t?.name)}
            value={model.paymentRequestType}
            readOnly={model.isDetail}
            allowClear={false}
            disabled={true}
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
          <Select
            label={translate("PM.payment_proposed_amount_input_unit_label")}
            isRequired
            searchType=""
            type={BORDER_TYPE.BORDERED}
            valueFilter={{
              name: "",
            }}
            isSearch={true}
            disabled={true}
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
      <div className="payment-custom_grid_9-col_3 position-relative">
        <FormItem
          validateObject={utilService.getValidateObj(model, "actionDate")}
        >
          <DatePicker
            className="payment-custom_datepicker"
            label={translate("PM.payment_date_refund_of_deposit_input_label")}
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
                model?.paymentInheritanceType ===
                PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
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
                  PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
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
                  PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
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
                  PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
                }
                label={translate("PM.payment_promo_code_input_label")}
                isRequired
                placeHolder={translate(
                  "PM.payment_promo_code_enter_input_label"
                )}
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
                  model?.paymentInheritanceType ===
                  PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
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

export default DepositProposalContent;
