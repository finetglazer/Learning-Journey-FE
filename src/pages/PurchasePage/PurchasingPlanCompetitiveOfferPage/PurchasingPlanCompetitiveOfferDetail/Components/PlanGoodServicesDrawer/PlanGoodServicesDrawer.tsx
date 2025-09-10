import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import PlanGoodServicesInformationDrawer from "../PlanGoodServicesInformationDrawer/PlanGoodServicesInformationDrawer";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { useEffect } from "react";
import { isEmpty, isNil } from "lodash";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";

interface Props {
  visible: boolean;
  handleClose: () => void;
  handleSave: (currentItem: GoodServiceByCategory) => void;
  recordGoodServices: GoodServiceByCategory;
  contextValue?: PurchasingPlanModel;
}

const PlanGoodServicesDrawer = ({
  visible,
  handleClose,
  handleSave,
  recordGoodServices,
  contextValue,
}: Props) => {
  const [translate] = useTranslation();

  const { model: currentItem, dispatch: dispatchGoodsService } =
    detailService.useModel<GoodServiceByCategory>(GoodServiceByCategory);

  const {
    handleChangeAllField: handleChangeAllFieldGoodServices,
    handleChangeSelectField: handleChangeSelectFieldGoodServices,
    handleChangeSingleField: handleChangeSingleFieldGoodServices,
  } = fieldService.useField(currentItem, dispatchGoodsService);

  useEffect(() => {
    if (visible) {
      handleChangeAllFieldGoodServices(recordGoodServices);
    }
  }, [visible, recordGoodServices]);

  const checkQuantity = (
    originalQuantity: number,
    remainingRequestQuantity: number
  ) => {
    if (originalQuantity <= 0) {
      return translate("PL.txt_purchasing_plan_quantity_validation_than_0");
    }
    if (originalQuantity > remainingRequestQuantity) {
      return translate("PL.txt_purchasing_plan_quantity_validation");
    }
    return null;
  };

  const validate = () => {
    const fieldConfigs: {
      field: string;
      maxLength?: number;
      required?: boolean;
      isCheckQuantity?: boolean;
    }[] = [
      { field: "manufacturer", required: true },
      {
        field: "quantity",
        required: true,
        isCheckQuantity: true,
      },
      {
        field: "description",
        maxLength: 500,
      },
      {
        field: "note",
        maxLength: 500,
      },
    ];

    const errors = fieldConfigs.reduce(
      (acc, { field, maxLength, required, isCheckQuantity }) => {
        const value = currentItem?.[field];
        let error = null;
        const remainingRequestQuantity =
          recordGoodServices?.remainingRequestQuantity;
        if (isNil(value) && required) {
          error = translate("CM.input_require_validation");
        } else if (maxLength && String(value).length > maxLength) {
          error = translate("CM.input_length_validation", { maxLength });
        } else if (isCheckQuantity && !isNil(value)) {
          error = checkQuantity(
            Number(currentItem?.quantity),
            Number(remainingRequestQuantity)
          );
        }
        if (error) acc[field] = error;
        return acc;
      },
      { ...currentItem?.errors }
    );
    const hasGeneralErrors = Object.values(errors).some(
      (error) => !isEmpty(error)
    );
    if (hasGeneralErrors) {
      handleChangeAllFieldGoodServices({
        ...currentItem,
        errors,
      });
      return false;
    }
    return true;
  };

  const onSave = () => {
    if (validate()) {
      handleSave(currentItem);
      handleClose();
    }
  };

  return (
    <Drawer
      numberButton={"2"}
      visible={visible}
      size={"2xl"}
      loading={false}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_save")}
      handleCancel={handleClose}
      handleClose={handleClose}
      handleSave={onSave}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={true}
      title={
        <div className="fw-bold">
          <span>
            {translate("PL.purchasing_plan_details_of_goods_and_services")}
          </span>
        </div>
      }
    >
      <PlanGoodServicesInformationDrawer
        handleChangeSelectFieldGoodServices={
          handleChangeSelectFieldGoodServices
        }
        handleChangeSingleFieldGoodServices={
          handleChangeSingleFieldGoodServices
        }
        currentItem={currentItem}
      />
    </Drawer>
  );
};

export default PlanGoodServicesDrawer;
