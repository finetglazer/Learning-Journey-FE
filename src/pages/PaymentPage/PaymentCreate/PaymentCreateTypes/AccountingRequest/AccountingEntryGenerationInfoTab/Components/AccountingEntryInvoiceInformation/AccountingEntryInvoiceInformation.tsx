import { NUMBER_MAX_13 } from "config/const";
import { NAME_BANK_REGEX } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { PaymentCreateModel } from "models/Payment";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext } from "react";
import {
  BORDER_TYPE,
  FormItem,
  InputNumber,
  InputText,
} from "react-components-design-system";

const AccountingEntryInvoiceInformation = () => {
  const { translate, model, handleChangeSingleField } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);
  return (
    <div>
      <form
        className="payment-custom_grid_9"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* payment request type */}
        <div className="payment-custom_grid_9-col_3">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "outputInvoice.name"
            )}
          >
            <InputText
              label={translate("PM.payment_buyer_name_people_input_label")}
              value={model.outputInvoice?.name}
              placeHolder={translate(
                "PM.payment_buyer_name_people_place_holder"
              )}
              onChange={(value) => {
                handleChangeSingleField({
                  fieldName: "outputInvoice",
                  errorName: "outputInvoice.name",
                })({
                  ...model?.outputInvoice,
                  name: value,
                });
              }}
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              maxLength={150}
              regexInput={NAME_BANK_REGEX}
            />
          </FormItem>
        </div>
        <div className="payment-custom_grid_9-col_3">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "outputInvoice.taxCode"
            )}
          >
            <InputText
              label={translate("PM.payment_buyer_invoice_input_label")}
              value={model.outputInvoice?.taxCode}
              placeHolder={translate("PM.payment_buyer_invoice_place_holder")}
              onChange={(value) => {
                handleChangeSingleField({
                  fieldName: "outputInvoice",
                  errorName: "outputInvoice.taxCode",
                })({
                  ...model?.outputInvoice,
                  taxCode: value,
                });
              }}
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              maxLength={150}
              regexInput={NAME_BANK_REGEX}
            />
          </FormItem>
        </div>
        <div className="payment-custom_grid_9-col_3">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "outputInvoice.address"
            )}
          >
            <InputText
              label={translate("PM.payment_buyer_address_input_label")}
              value={model.outputInvoice?.address}
              placeHolder={translate("PM.payment_buyer_address_place_holder")}
              onChange={(value) => {
                handleChangeSingleField({
                  fieldName: "outputInvoice",
                  errorName: "outputInvoice.address",
                })({
                  ...model?.outputInvoice,
                  address: value,
                });
              }}
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              maxLength={150}
              regexInput={NAME_BANK_REGEX}
            />
          </FormItem>
        </div>
        <div className="payment-custom_grid_9-col_3">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "outputInvoice.amount"
            )}
          >
            <InputNumber
              label={translate("PM.payment_buyer_amount_input_label")}
              className="payment-custom_input"
              placeHolder={translate("PM.payment_buyer_amount_place_holder")}
              isSmall={false}
              onChange={(value) => {
                handleChangeSingleField({
                  fieldName: "outputInvoice",
                  errorName: "outputInvoice.amount",
                })({
                  ...model?.outputInvoice,
                  amount: value,
                });
              }}
              value={model.outputInvoice?.amount}
              isReverseSymb
              allowNegative
              max={NUMBER_MAX_13}
              min={-NUMBER_MAX_13}
            />
          </FormItem>
        </div>
        <div className="payment-custom_grid_9-col_6">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "outputInvoice.description"
            )}
          >
            <InputText
              label={translate("PM.payment_buyer_content_input_label")}
              value={model.outputInvoice?.description}
              placeHolder={translate("PM.payment_buyer_content_place_holder")}
              onChange={(value) => {
                handleChangeSingleField({
                  fieldName: "outputInvoice",
                  errorName: "outputInvoice.description",
                })({
                  ...model?.outputInvoice,
                  description: value,
                });
              }}
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              maxLength={150}
              regexInput={NAME_BANK_REGEX}
            />
          </FormItem>
        </div>
      </form>
    </div>
  );
};

export default AccountingEntryInvoiceInformation;
