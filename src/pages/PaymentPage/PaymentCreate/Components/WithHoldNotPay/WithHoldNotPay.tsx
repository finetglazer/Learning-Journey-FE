import { utilService } from "core/services/common-services/util-service";
import { PaymentCreateModel } from "models/Payment";
import { useContext } from "react";
import {
  BORDER_TYPE,
  FormItem,
  InputNumber,
  InputText,
} from "react-components-design-system";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";
// eslint-disable-next-line import/named
import { TFunction } from "i18next";
import { NUMBER_MAX_13 } from "config/const";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";

function WithHoldNotPay() {
  const { translate, model, handleChangeSingleField } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);

  return (
    <div>
      <form className="payment-custom_grid_9">
        {/*Withheld amount*/}
        <div className="payment-custom_grid_9-col_3">
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "retentionAmount"
            )}
          >
            <InputNumber
              label={translate("PM.payment_bank_with_hold_not_pay_input_label")}
              className="payment-custom_input"
              isSmall={false}
              onChange={handleChangeSingleField({
                fieldName: "retentionAmount",
              })}
              value={model?.retentionAmount}
              isReverseSymb
              allowNegative
              numberType={model.currency?.code != "VND" ? "DECIMAL" : null}
              max={NUMBER_MAX_13}
              min={-NUMBER_MAX_13}
              readOnly={true}
            />
          </FormItem>
        </div>
        {/*note*/}
        <div className="payment-custom_grid_9-col_6">
          <FormItem
            validateObject={utilService.getValidateObj(model, "retentionNote")}
          >
            <InputText
              label={translate(
                "PM.payment_proposed_purpose_of_purchase_note_input_label"
              )}
              value={model.retentionNote}
              placeHolder={translate(
                "PM.payment_proposed_purpose_of_purchase_note_input_label_placeholder"
              )}
              onChange={handleChangeSingleField({
                fieldName: "retentionNote",
              })}
              type={BORDER_TYPE.BORDERED}
              maxLength={500}
              isSmall={false}
              translate={translate as TFunction}
              regexInput={NOT_TAB_ENTER_REGEX}
            />
          </FormItem>
        </div>
      </form>
    </div>
  );
}

export default WithHoldNotPay;
