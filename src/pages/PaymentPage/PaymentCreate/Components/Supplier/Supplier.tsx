import { ChevronDown } from "@carbon/icons-react";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import {
  PAYMENT_INHERITANCE_TYPE_SUBMIT,
  PaymentCreateModel,
  SupplierModel,
} from "models/Payment";
import { useContext, useEffect, useState } from "react";
import {
  BORDER_TYPE,
  FormItem,
  InputText,
} from "react-components-design-system";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";
import ModalListSuppliers from "../ModalListSuppliers/ModalListSuppliers";
import classNames from "classnames";
import { isEqual } from "lodash";

const Supplier = () => {
  const { translate, model, dispatchModel, inheritanceType } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);
  const [openModalSupplier, setOpenModalSupplier] = useState(false);
  const handleOpenModalSupplier = () => {
    if (
      isDisablePaymentFields.isDisableSupplider ||
      isEqual(
        inheritanceType,
        PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
      )
    ) {
      return;
    }
    setOpenModalSupplier(true);
  };
  const handleCancelModalSupplier = () => {
    setOpenModalSupplier(false);
  };
  const handleApplySupplier = (dataSupplier: SupplierModel) => {
    dispatchModel({
      type: GeneralActionEnum.SET,
      payload: {
        ...model,
        supplier: dataSupplier,
        errors: {
          ...model.errors,
          supplierId: null,
        },
      },
    });
    handleCancelModalSupplier();
  };

  const [isDisablePaymentFields, setIsDisablePaymentFields] = useState({
    isDisableSupplider: false,
  });

  useEffect(() => {
    if (
      model?.advancePaymentList?.length > 0 ||
      model?.depositApplicationList?.length > 0 ||
      model?.expenseApplicationList?.length > 0 ||
      model?.invoices?.length > 0
    ) {
      setIsDisablePaymentFields((pre) => {
        return { ...pre, isDisableSupplider: true };
      });
    } else {
      setIsDisablePaymentFields((pre) => {
        return { ...pre, isDisableSupplider: false };
      });
    }
  }, [
    model?.advancePaymentList,
    model?.depositApplicationList,
    model?.expenseApplicationList,
    model?.invoices,
  ]);

  return (
    <div>
      <div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="payment-custom_grid_9"
        >
          <div
            className={classNames("payment-custom_grid_9-col_3", {
              "payment-supplier-read-only":
                !isDisablePaymentFields.isDisableSupplider &&
                !isEqual(
                  inheritanceType,
                  PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
                ),
            })}
            onClick={handleOpenModalSupplier}
          >
            <FormItem
              validateObject={utilService.getValidateObj(model, "supplierId")}
            >
              <InputText
                label={translate("PM.mst_cccd_cmnd")}
                placeHolder={translate("PM.payment_supplier_placeholder_label")}
                isRequired
                type={BORDER_TYPE.BORDERED}
                isSmall={false}
                value={model.supplier?.taxCode}
                autoFocusInput={false}
                suffix={<ChevronDown />}
                readOnly={!isDisablePaymentFields.isDisableSupplider}
                className={classNames({
                  "payment-custom_input--disabled":
                    !isDisablePaymentFields.isDisableSupplider &&
                    !isEqual(
                      inheritanceType,
                      PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
                    ),
                })}
                disabled={
                  isDisablePaymentFields.isDisableSupplider ||
                  isEqual(
                    inheritanceType,
                    PAYMENT_INHERITANCE_TYPE_SUBMIT.INHERITED_FROM_PO
                  )
                }
              />
            </FormItem>
          </div>
          <div className="payment-custom_grid_9-col_3">
            <FormItem>
              <InputText
                label={translate("PM.payment_supplier_name_input_label")}
                className="payment-custom_input"
                isSmall={false}
                readOnly={true}
                value={model.supplier?.name}
              />
            </FormItem>
          </div>
          <div className="payment-custom_grid_9-col_3">
            <div className="d-flex payment-gap-12">
              <div>
                <FormItem>
                  <InputText
                    label={translate("PM.payment_supplier_code_input_label")}
                    className="payment-custom_input"
                    isSmall={false}
                    readOnly={true}
                    value={model.supplier?.code}
                  />
                </FormItem>
              </div>
              <div>
                <FormItem>
                  <InputText
                    label={translate("PM.payment_supplier_type_input_label")}
                    className="payment-custom_input"
                    isSmall={false}
                    readOnly={true}
                    value={model.supplier?.type?.toString()}
                  />
                </FormItem>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ModalListSuppliers
        open={openModalSupplier}
        handleCancelModalSupplier={handleCancelModalSupplier}
        handleApplySupplier={handleApplySupplier}
      />
    </div>
  );
};

export default Supplier;
