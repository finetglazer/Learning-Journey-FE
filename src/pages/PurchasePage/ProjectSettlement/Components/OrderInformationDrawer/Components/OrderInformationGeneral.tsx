import { NUMBER_MAX_13 } from "config/const";
import {
  DATE_PLACEHOLDER,
  MAX_LENGTH_1000,
  NUMBER_TYPE_INPUT,
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_INVERSE,
  STANDARD_DATE_FORMAT_SLASH,
  STANDARD_TIME_FORMAT,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { has, isEqual, isObject, isUndefined } from "lodash";
import { OptionBaseModel } from "models/Common/Common";
import { useOrderInformationContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/context/OrderInformationContext";
import { Model } from "react-3layer-common";
import {
  DatePicker,
  FormItem,
  InputNumber,
  InputText,
  STANDARD_DATE_FORMAT,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../OrderInformationDrawer.module.scss";

const DATE_FORMAT = [
  STANDARD_DATE_FORMAT_SLASH,
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_INVERSE,
];

interface OrderInformationGeneralProps {
  isDepreciationEditable?: boolean;
  runAsset: () => void;
}

const OrderInformationGeneral = ({
  isDepreciationEditable,
  runAsset,
}: OrderInformationGeneralProps) => {
  const [translate] = useTranslation();
  const { assetItemSelected: data, setAssetItemSelected } =
    useOrderInformationContext();

  const handleUpdateField = (
    value: number | string | OptionBaseModel | null | dayjs.Dayjs,
    fieldName: string
  ) => {
    const errors: Model.Errors<Model> = {
      ...data.errors,
      [fieldName]: undefined,
    };

    let formattedValue = value;

    if (value instanceof dayjs) {
      formattedValue = value
        .endOf("day")
        .format(`${STANDARD_DATE_FORMAT}T${STANDARD_TIME_FORMAT}`);
    }

    if (fieldName === "originalCost") {
      runAsset();
    }
    const updatedData = {
      ...data,
      [fieldName]: formattedValue,
      errors,
    };

    if (
      isEqual(fieldName, "typeValue") &&
      formattedValue &&
      isObject(formattedValue) &&
      has(formattedValue, "code")
    ) {
      updatedData.type = formattedValue.code;
    }

    setAssetItemSelected(updatedData);
  };

  const renderOriginPrice = () => {
    return (
      <div className={styles["form-item__width"]}>
        <FormItem
          validateObject={utilService.getValidateObj(data, "originalCost")}
        >
          <InputNumber
            label={translate("RG.txt_original_price")}
            placeHolder={translate("PS.txt_asset_placeholder_origin_price")}
            value={data?.originalCost}
            onChange={(value) => handleUpdateField(value, "originalCost")}
            suffix={VND_CURRENCY_UNIT}
            isSmall={false}
            max={NUMBER_MAX_13}
            min={-NUMBER_MAX_13}
            numberType={NUMBER_TYPE_INPUT}
            isRequired
          />
        </FormItem>
      </div>
    );
  };

  const renderMain = () => {
    return (
      <>
        <div className={styles["form-item__width"]}>
          <FormItem
            validateObject={utilService.getValidateObj(data, "classify")}
          >
            <InputText
              label={translate("PM.payment_supplier_table_type_placeholder")}
              placeHolder={translate("PS.txt_asset_placeholder_change_type")}
              value={data?.classify}
              onChange={(value) => handleUpdateField(value, "classify")}
              isSmall={false}
              readOnly
            />
          </FormItem>
        </div>
        <div className={styles["form-item__width"]}>
          <FormItem
            validateObject={utilService.getValidateObj(
              data,
              "depreciationMonths"
            )}
          >
            <InputNumber
              label={translate("PS.txt_table_asset_depreciation_calculation")}
              placeHolder={translate(
                "PS.txt_asset_placeholder_depreciation_calculation"
              )}
              value={data?.depreciationMonths}
              onChange={(value) =>
                handleUpdateField(value, "depreciationMonths")
              }
              isSmall={false}
              max={NUMBER_MAX_13}
              isRequired
              readOnly={!isDepreciationEditable}
            />
          </FormItem>
        </div>
      </>
    );
  };

  return (
    <div className={styles["form-container"]}>
      <>
        {renderOriginPrice()}
        {renderMain()}
      </>

      <div className={styles["form-item__width"]}>
        <FormItem validateObject={utilService.getValidateObj(data, "quantity")}>
          <InputNumber
            isRequired
            label={translate("settlement.settlement_quantity")}
            placeHolder={translate("settlement.placeholder_quantity")}
            value={data?.quantity}
            onChange={(value) => handleUpdateField(value, "quantity")}
            isSmall={false}
            max={NUMBER_MAX_13}
            numberType={"LONG"}
          />
        </FormItem>
      </div>

      <div className={styles["form-item__width"]}>
        <FormItem
          validateObject={utilService.getValidateObj(data, "usageStartDate")}
        >
          <DatePicker
            label={translate("PS.txt_table_asset_date_use")}
            placeholder={DATE_PLACEHOLDER}
            value={
              data?.usageStartDate ? dayjs(data.usageStartDate) : undefined
            }
            onChange={(value) => handleUpdateField(value, "usageStartDate")}
            dateFormat={DATE_FORMAT}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
      <div className={styles["form-item__width"]}>
        <FormItem
          validateObject={utilService.getValidateObj(
            data,
            "depreciationStartDate"
          )}
        >
          <DatePicker
            label={translate("PS.txt_table_asset_depreciation_start_date")}
            placeholder={DATE_PLACEHOLDER}
            value={
              data?.depreciationStartDate
                ? dayjs(data.depreciationStartDate)
                : undefined
            }
            onChange={(value) =>
              handleUpdateField(value, "depreciationStartDate")
            }
            dateFormat={DATE_FORMAT}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
      <FormItem validateObject={utilService.getValidateObj(data, "note")}>
        <TextArea
          showCount
          label={translate("PS.txt_asset_note")}
          placeHolder={translate("PS.txt_asset_placeholder_note")}
          value={data?.note}
          onChange={(value) => handleUpdateField(value, "note")}
          maxLength={MAX_LENGTH_1000}
          resize="none"
        />
      </FormItem>
    </div>
  );
};

export default OrderInformationGeneral;
