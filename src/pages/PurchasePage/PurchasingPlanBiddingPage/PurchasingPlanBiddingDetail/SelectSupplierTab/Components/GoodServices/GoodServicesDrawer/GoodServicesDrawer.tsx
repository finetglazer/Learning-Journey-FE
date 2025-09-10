import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import {
  ColumnKey,
  ConvertibleGoodsItems,
  InformationSectionKey,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import { useCallback, useMemo } from "react";
import { isEmpty, isEqual, isNil } from "lodash";
import { AdvancedCollapseView } from "components";
import GoodServiceQuotation from "./GoodServiceQuotation/GoodServiceQuotation";
import styles from "./GoodServicesDrawer.module.scss";
import GoodServiceInfoConvertedTable from "./GoodServiceInfoConvertedTable/GoodServiceInfoConvertedTable";
import { FieldValue } from "core/services/service-types";
import { v4 as uuidv4 } from "uuid";
import appMessageService from "core/services/common-services/app-message-service";
import { childText } from "models/PurchasingPlan/PurchasingPlanConstant";

interface Props {
  visible: boolean;
  handleClose: () => void;
  recordGoodServices?: GoodServiceByCategory;
  contextValue?: PurchasingPlanModel;
  isDetail?: boolean;
}

export interface changeItemGoodServiceDrawerProps {
  value: FieldValue;
  fieldName: string;
  indexBeforeValidate: string | number;
  objectFieldChangeFollow?: object;
  isInput?: boolean;
  errorField?: string;
}

const GoodServicesDrawer = ({
  visible,
  handleClose,
  recordGoodServices,
  contextValue,
  isDetail = false,
}: Props) => {
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const { handleChangeAllField, handleChangeSingleField, model } = contextValue;

  const currentItem = useMemo(() => {
    return model?.currentSelectSupplier;
  }, [model?.currentSelectSupplier]);

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
      isValidateId?: boolean;
    }[] = [
      // Hãng chủng loại
      { field: ColumnKey.BRANCH, required: true, isValidateId: true },
      //Đơn vị tính
      { field: ColumnKey.UNIT, required: true, isValidateId: true },
      // Đơn giá
      { field: ColumnKey.PRICE, required: true },
      // Số lượng mua
      {
        field: ColumnKey.QUANTITY,
        required: true,
        isCheckQuantity: true,
      },
      // Diễn giải hàng hóa
      {
        field: ColumnKey.DESCRIPTION,
        maxLength: 500,
      },
      {
        field: ColumnKey.NOTE,
        maxLength: 500,
      },
    ];

    let errors = fieldConfigs.reduce(
      (acc, { field, maxLength, required, isCheckQuantity, isValidateId }) => {
        currentItem?.convertibleGoodsItems?.forEach(
          (item: ConvertibleGoodsItems, index: number) => {
            const value = item?.[field];
            let error = null;
            const remainingRequestQuantity =
              recordGoodServices?.remainingRequestQuantity;
            if (
              (isNil(value) && required) ||
              (isValidateId && value?.id.includes("00000000-0000") && required)
            ) {
              error = translate("CM.input_require_validation");
            } else if (maxLength && String(value).length > maxLength) {
              error = translate("CM.input_length_validation", { maxLength });
            } else if (isCheckQuantity && !isNil(value)) {
              error = checkQuantity(
                Number(currentItem?.quantity),
                Number(remainingRequestQuantity)
              );
            }

            if (error) acc[`convertibleGoodsItems[${index}].${field}`] = error;
          }
        );

        return acc;
      },
      { ...currentItem?.errors }
    );

    const checkTotalAmountEqualTotalClosingAmount = isEqual(
      currentItem?.totalAmount,
      currentItem?.totalClosingTotalAmount
    );

    const hasGeneralErrors = Object.values(errors).some(
      (error) => !isEmpty(error)
    );

    if (hasGeneralErrors) {
      handleChangeAllField({
        ...model,
        errors,
      });
      return false;
    }

    if (!checkTotalAmountEqualTotalClosingAmount) {
      errors = {
        ...errors,
        convertibleGoodsItems: translate("PL.txt_error_total_closing_amount"),
      };
      notifyToast({
        message: translate("PL.txt_error_total_closing_amount"),
        type: "error",
      });
      return false;
    }

    return true;
  };

  const onSave = () => {
    if (validate()) {
      if (!model?.selectSupplier?.supplierSelectedGoodsItems) return;
      const dataGoodItems = [
        ...model.selectSupplier.supplierSelectedGoodsItems,
      ]?.map((item: GoodServiceByCategory) => {
        if (item.id === currentItem.id) {
          return currentItem;
        }
        return item;
      });
      handleChangeAllField({
        ...model,
        selectSupplier: {
          ...model.selectSupplier,
          supplierSelectedGoodsItems: dataGoodItems,
        },
        errors: {
          ...model.errors,
          convertibleGoodsItems: undefined,
        },
      });
      handleClose();
    }
  };

  const handleChangeConvertibleGoodItems = useCallback(
    (value: FieldValue, errorField?: string) => {
      handleChangeSingleField({
        fieldName: "currentSelectSupplier",
        errorName: errorField,
      })({
        ...currentItem,
        convertibleGoodsItems: value,
      });
    },
    [handleChangeSingleField, currentItem]
  );

  const handleAddNewDataTable = useCallback(
    (data: ConvertibleGoodsItems) => {
      if (!currentItem?.convertibleGoodsItems) return;

      const oldData = [...currentItem.convertibleGoodsItems];
      const dataMapping = data.map(
        (item: ConvertibleGoodsItems, index: number) => {
          return {
            ...item,
            id: item.id && item.goodsId ? item.id : `${uuidv4()}${childText}`,
            goodsId: item.goodsId ? item.goodsId : item.id,
            tax: item?.tax
              ? item.tax
              : oldData[index]?.tax
              ? oldData[index].tax
              : currentItem?.tax,
            unit: item?.unit || item?.unitOfMeasure,
            unitId: item?.unitOfMeasure?.id,
            branch: item?.branch || item?.manufacturer,
            branchId: item?.manufacturer?.id,
          };
        }
      );

      handleChangeConvertibleGoodItems(dataMapping);
    },
    [
      currentItem?.convertibleGoodsItems,
      currentItem?.tax,
      handleChangeConvertibleGoodItems,
    ]
  );

  const handleChangeDataTable = useCallback(
    ({
      value,
      fieldName,
      indexBeforeValidate,
      objectFieldChangeFollow,
      isInput,
      errorField,
    }: changeItemGoodServiceDrawerProps) => {
      if (!currentItem?.convertibleGoodsItems) return;
      const itemFind = [...currentItem.convertibleGoodsItems]?.find(
        (item: ConvertibleGoodsItems, index) => {
          return index === indexBeforeValidate;
        }
      );

      const newData = [...currentItem.convertibleGoodsItems]?.map(
        (item: ConvertibleGoodsItems, index) => {
          if (index === indexBeforeValidate) {
            return {
              ...item,
              [fieldName]: value,
              ...objectFieldChangeFollow,
            };
          }
          return item;
        }
      );

      if (isInput) {
        itemFind[fieldName] = value;
        model.errors[errorField] = undefined;
        return;
      }

      handleChangeConvertibleGoodItems(
        newData,
        errorField
          ? errorField
          : `convertibleGoodsItems[${indexBeforeValidate}].${fieldName}`
      );
    },
    [
      handleChangeConvertibleGoodItems,
      currentItem?.convertibleGoodsItems,
      model.errors,
    ]
  );

  const itemsCollapse = useMemo(
    () => [
      {
        key: InformationSectionKey.GOOD_SERVICE_QUOTATION,
        label: translate("PPA.goods_and_services_quotation"),
        children: <GoodServiceQuotation contextValue={contextValue} />,
      },
      {
        key: InformationSectionKey.GOOD_SERVICE_INFO_CONVERTED,
        label: translate("PPA.info_converted_goods_and_services"),
        children: (
          <GoodServiceInfoConvertedTable
            data={currentItem?.convertibleGoodsItems || []}
            handleAddNewDataTable={handleAddNewDataTable}
            handleChangeDataTable={handleChangeDataTable}
            isDetail={isDetail}
            contextValue={contextValue}
          />
        ),
      },
    ],
    [
      contextValue,
      currentItem?.convertibleGoodsItems,
      handleAddNewDataTable,
      handleChangeDataTable,
      isDetail,
      translate,
    ]
  );

  return (
    <Drawer
      className={styles["drawer_good_service_quotation"]}
      numberButton={"2"}
      visible={visible}
      size={"max"}
      loading={false}
      isShowButtonApply={!isDetail}
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
      <AdvancedCollapseView
        className={styles["drawer-collapse-view"]}
        items={itemsCollapse}
        showAll={false}
        defaultActiveKey={[
          InformationSectionKey.GOOD_SERVICE_QUOTATION,
          InformationSectionKey.GOOD_SERVICE_INFO_CONVERTED,
        ]}
      />
    </Drawer>
  );
};

export default GoodServicesDrawer;
