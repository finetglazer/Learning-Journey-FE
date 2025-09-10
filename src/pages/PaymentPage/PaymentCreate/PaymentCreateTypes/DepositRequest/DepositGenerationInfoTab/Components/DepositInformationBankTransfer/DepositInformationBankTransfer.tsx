import { ACCOUNT_BANK_REGEX, NAME_BANK_REGEX } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { PaymentCreateModel, VND_CURRENCY } from "models/Payment";
import React, { useContext, useEffect } from "react";
import {
  BORDER_TYPE,
  Button,
  FormItem,
  InputNumber,
  InputText,
  Select,
} from "react-components-design-system";
// eslint-disable-next-line import/named
import { TFunction } from "i18next";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { isEmpty } from "lodash";
import { IcArrowsCounterClockwise } from "assets/icons";

function DepositInformationBankTransfer() {
  const {
    translate,
    model,
    handleChangeSelectField,
    handleChangeSingleField,
    handleGetTransferInfo,
    checkInternalAccount,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const value = event.currentTarget.value;
      if (isEmpty(value)) return;
      handleGetTransferInfo(value, model?.receivingBank?.id?.toString());
    }
  };
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        if (typeof onEnter === "function") {
          onEnter(event);
        }
      }
    },
    [onEnter]
  );

  useEffect(() => {
    handleChangeSingleField({
      fieldName: "paymentBankAmount",
    })(model?.amount);
  }, [model?.amount]);

  const isShowButtonCheckAccountNumber =
    model?.receivingBank?.isInternal &&
    !isEmpty(model?.bankAccountNumber) &&
    !isEmpty(model?.nameAccountBank);

  return (
    <div>
      {/*Bank Transfer*/}
      <form className="payment-custom_grid_9">
        {/* Transfer amount */}
        <div className="payment-custom_grid_9-col_3">
          <FormItem>
            <InputNumber
              readOnly={true}
              label={translate("PM.payment_bank_amount_input_label")}
              className="payment-custom_input"
              placeHolder={"0"}
              isSmall={false}
              value={Math.max(model?.paymentBankAmount, 0)}
              numberType={"DECIMAL"}
              isReverseSymb
            />
          </FormItem>
        </div>
        <div className="payment-custom_grid_9-col_3"></div>
        {isShowButtonCheckAccountNumber && (
          <div className="payment-custom_grid_9-col_3 d-flex align-items-center pt-4">
            <Button
              type={"text"}
              className="px-1"
              icon={
                <img
                  src={IcArrowsCounterClockwise}
                  alt=""
                  width={16}
                  height={16}
                />
              }
              iconPlace={"left"}
              onClick={() => {
                checkInternalAccount(
                  model?.bankAccountNumber,
                  model?.nameAccountBank
                );
              }}
            >
              {translate("PM.check_account_information")}
            </Button>
          </div>
        )}
        {/*Beneficiary Bank*/}
        <div className="payment-custom_grid_9-col_9 payment-custom_grid_9">
          {/*Beneficiary bank Name Bank*/}
          <div className="payment-custom_grid_9-col_3">
            {model?.currency?.code?.toLowerCase().toString() ===
            VND_CURRENCY.toLowerCase().toString() ? (
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "paymentInformation.bankId"
                )}
              >
                <Select
                  label={translate(
                    "PM.payment_bank_transfer_beneficiary_bank_input_label"
                  )}
                  translate={translate as TFunction}
                  isRequired
                  placeHolder={translate(
                    "PM.payment_bank_transfer_beneficiary_bank_placeholder"
                  )}
                  searchProperty="name"
                  searchType=""
                  type={1}
                  valueFilter={{
                    name: "",
                  }}
                  isSmall={false}
                  classFilter={undefined}
                  isSearch
                  getList={paymentRepository.getReceivingBankList}
                  onChange={handleChangeSelectField({
                    fieldName: "receivingBank",
                    errorName: "paymentInformation.bankId",
                  })}
                  isEnumerable={false}
                  render={(t) => t?.name}
                  value={model.receivingBank}
                  readOnly={model.isDetail}
                  allowClear={false}
                />
              </FormItem>
            ) : (
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "paymentInformation.bankName"
                )}
              >
                <InputText
                  isRequired
                  label={translate(
                    "PM.payment_bank_transfer_beneficiary_bank_input_label"
                  )}
                  translate={translate as TFunction}
                  value={model.bankName}
                  placeHolder={translate(
                    "PM.payment_bank_transfer_beneficiary_bank_placeholder"
                  )}
                  onChange={handleChangeSingleField({
                    fieldName: "bankName",
                    errorName: "paymentInformation.bankName",
                  })}
                  type={BORDER_TYPE.BORDERED}
                  maxLength={150}
                  isSmall={false}
                  regexInput={NAME_BANK_REGEX}
                />
              </FormItem>
            )}
          </div>
          {/*Beneficiary bank account number and name */}
          <div className="payment-custom_grid_9-col_6 d-flex payment-gap-12">
            {/*number bank*/}
            <div className="w-100">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "paymentInformation.accountNumber"
                )}
              >
                <InputText
                  label={translate(
                    "PM.payment_bank_transfer_account_number_input_label"
                  )}
                  className="payment-custom_input"
                  placeHolder={translate(
                    "PM.payment_bank_transfer_account_number_input_placeholder"
                  )}
                  isRequired
                  isSmall={false}
                  onChange={handleChangeSingleField({
                    fieldName: "bankAccountNumber",
                    errorName: "paymentInformation.accountNumber",
                  })}
                  onKeyDown={(event) =>
                    handleKeyDown(
                      event as React.KeyboardEvent<HTMLInputElement>
                    )
                  }
                  value={model.bankAccountNumber}
                  maxLength={150}
                  regexInput={ACCOUNT_BANK_REGEX}
                  translate={translate as TFunction}
                />
              </FormItem>
            </div>
            {/*name number*/}
            <div className="w-100">
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  "paymentInformation.accountName"
                )}
              >
                <InputText
                  label={translate(
                    "PM.payment_bank_transfer_account_name_input_label"
                  )}
                  className="payment-custom_input"
                  placeHolder={translate(
                    "PM.payment_bank_transfer_account_name_input_placeholder"
                  )}
                  isRequired
                  isSmall={false}
                  onChange={handleChangeSingleField({
                    fieldName: "nameAccountBank",
                    errorName: "paymentInformation.accountName",
                  })}
                  value={model.nameAccountBank}
                  maxLength={150}
                  isByteCheck
                  translate={translate as TFunction}
                />
              </FormItem>
            </div>
          </div>
          {/*Transfer Content*/}
          <div className="payment-custom_grid_9-col_9">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "paymentInformation.description"
              )}
            >
              <InputText
                label={translate(
                  "PM.payment_bank_transfer_content_input_label"
                )}
                isByteCheck
                value={model.transferContent}
                placeHolder={translate(
                  "PM.payment_bank_transfer_content_input_placeholder"
                )}
                onChange={handleChangeSingleField({
                  fieldName: "transferContent",
                  errorName: "paymentInformation.description",
                })}
                type={BORDER_TYPE.BORDERED}
                isSmall={false}
                maxLength={150}
                regexInput={NAME_BANK_REGEX}
                translate={translate as TFunction}
              />
            </FormItem>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DepositInformationBankTransfer;
