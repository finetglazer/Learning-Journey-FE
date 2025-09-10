import { ConfigField, FieldValue } from "core/services/service-types";
import {
  ConvertibleGoodsItems,
  GoodsItem,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan";
import styles from "../GoodServices.module.scss";
import { Col, Row } from "antd";
import {
  FormItem,
  InputNumber,
  InputText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import { round } from "lodash";
import { JPY_CURRENCY_UNIT, VND_CURRENCY_UNIT } from "core/config/consts";
import CONSTANT_NUMBER from "config/number";

type Props = {
  model?: PurchasingPlanTypeModel;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  isDetail?: boolean;
};

interface changeItemProps {
  value: number;
  id?: string;
  indexBeforeValidate?: number;
}

const ExchangeRateFollowCurrency = (props: Props) => {
  const { model, handleChangeSingleField, isDetail = false } = props;
  const [translate] = useTranslation();

  const exchangeRateData = useMemo(() => {
    return model?.selectSupplier?.exchangeRates?.[0];
  }, [model?.selectSupplier?.exchangeRates]);

  const checkIsSameVNDOrJPY = useMemo(() => {
    return (
      exchangeRateData?.currency === VND_CURRENCY_UNIT ||
      exchangeRateData?.currency === JPY_CURRENCY_UNIT
    );
  }, [exchangeRateData?.currency]);

  const handleChangeExchangeRate = useCallback(
    (props: changeItemProps) => {
      const { value, id } = props;
      const validValue = value || 0;
      const checkModelIsExist =
        model?.selectSupplier?.supplierSelectedGoodsItems?.length > 0;
      if (!checkModelIsExist) return;

      exchangeRateData.exchangeRate = value;

      const editSelectedGoods = [
        ...model.selectSupplier.supplierSelectedGoodsItems,
      ].map((item: GoodServiceByCategory) => {
        if (!item) return null;

        const convertedAmountBeforeTax = item.totalAmountBeforeTax * validValue;
        const taxConvertedAmount = item.taxAmount * validValue;
        const convertTotalAmount = item.totalAmount * validValue;
        const convertibleGoodsItems = item.convertibleGoodsItems?.map(
          (el: ConvertibleGoodsItems) => {
            const convertTotalAmountEl = round(
              round(
                el.totalAmount,
                checkIsSameVNDOrJPY
                  ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                  : CONSTANT_NUMBER.FOUR_NUMBER_FIX
              ) * value,
              CONSTANT_NUMBER.ZERO_FIX_NUMBER
            );
            return {
              ...el,
              convertTotalAmount: convertTotalAmountEl,
            };
          }
        );

        return {
          ...item,
          taxConvertedAmount,
          convertTotalAmount,
          convertedAmountBeforeTax,
          convertibleGoodsItems,
        };
      });

      handleChangeSingleField({ fieldName: "selectSupplier" })({
        ...model.selectSupplier,
        supplierSelectedGoodsItems: editSelectedGoods,
      });
    },
    [
      checkIsSameVNDOrJPY,
      exchangeRateData,
      handleChangeSingleField,
      model.selectSupplier,
    ]
  );

  return (
    <Row className={styles["exchange-rate-follow-currency"]} gutter={24}>
      <Col>
        <InputText
          label={translate("PL.txt_quote_currency")}
          value={exchangeRateData?.currency}
          className={styles["input-label-horizontal"]}
          disabled
        />
      </Col>
      <Col className={styles["col-exchange-rate"]}>
        <FormItem>
          <InputNumber
            value={exchangeRateData?.exchangeRate}
            label={translate("PL.exchange_rate_label")}
            className={styles["input-label-horizontal"]}
            isRequired
            onChange={(value) =>
              handleChangeExchangeRate({
                value,
              })
            }
            disabled={isDetail}
          />
        </FormItem>
      </Col>
    </Row>
  );
};

export default ExchangeRateFollowCurrency;
