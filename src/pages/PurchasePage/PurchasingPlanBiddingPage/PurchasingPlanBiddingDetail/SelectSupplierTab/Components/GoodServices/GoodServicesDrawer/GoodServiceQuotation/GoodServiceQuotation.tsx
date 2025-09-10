import { Col, Row } from "antd";
import styles from "../GoodServicesDrawer.module.scss";
import { PropsWithChildren, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ConvertibleGoodsItems,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import { sumWithFixed } from "core/helpers/calculator";
import CONSTANT_NUMBER from "config/number";
import { formatCurrency } from "core/helpers/number";

interface BlockContainerProps extends PropsWithChildren {
  title?: string;
  className?: string;
}

const BlockContainer = (props: BlockContainerProps) => {
  const { title = "", className = "", children } = props;
  return (
    <Row className={styles["container"]} gutter={24} align="top">
      {title && (
        <Col offset={0} span={9} className={styles["title"]}>
          {title}
        </Col>
      )}
      {children && (
        <Col span={14} className={styles["data"]}>
          {children}
        </Col>
      )}
    </Row>
  );
};

interface Props {
  contextValue?: PurchasingPlanModel;
}

const GoodServiceQuotation = (props: Props) => {
  const { contextValue } = props;
  const { model } = contextValue;

  const [translate] = useTranslation();

  const currency = useMemo(() => {
    return model?.selectSupplier?.exchangeRates?.[0]?.currency;
  }, [model?.selectSupplier?.exchangeRates]);

  const supplierSelectModel = useMemo(() => {
    const dataSelectSupplier = model?.currentSelectSupplier;

    if (dataSelectSupplier?.convertibleGoodsItems?.length > 0) {
      dataSelectSupplier.totalClosingAmountBeforeTax = sumWithFixed(
        dataSelectSupplier.convertibleGoodsItems.map(
          (el: ConvertibleGoodsItems) => el.totalAmountBeforeTax
        ),
        CONSTANT_NUMBER.FOUR_NUMBER_FIX
      );
      dataSelectSupplier.totalClosingTaxAmount = sumWithFixed(
        dataSelectSupplier.convertibleGoodsItems.map(
          (el: ConvertibleGoodsItems) => el.taxAmount
        ),
        CONSTANT_NUMBER.FOUR_NUMBER_FIX
      );
      dataSelectSupplier.totalClosingTotalAmount = sumWithFixed(
        dataSelectSupplier.convertibleGoodsItems.map(
          (el: ConvertibleGoodsItems) => el.totalAmount
        ),
        CONSTANT_NUMBER.FOUR_NUMBER_FIX
      );
    }
    return dataSelectSupplier;
  }, [model?.currentSelectSupplier]);

  const dataSourceLeft = [
    {
      title: translate("PL.purchasing_plan_code_goods"),
      children: supplierSelectModel?.code,
    },
    {
      title: translate("PL.purchasing_plan_name_goods"),
      children: supplierSelectModel?.name,
    },
    {
      title: translate("PL.purchasing_plan_unit_of_measure"),
      children: supplierSelectModel?.unit?.name,
    },
    {
      title: translate("PL.purchasing_plan_manufacturer"),
      children: supplierSelectModel?.branch?.name,
    },
    {
      title: translate("PL.purchase_quantity_label"),
      children: supplierSelectModel?.quantity,
    },
    {
      title: translate("PL.txt_total_price_before_tax"),
      children: `${formatCurrency({
        value: supplierSelectModel?.totalAmountBeforeTax,
        shouldRoundTwoNumber: false,
        code: currency,
      })} ${currency}`,
    },
    {
      title: translate("PL.txt_quotation_tax"),
      children: `${formatCurrency({
        value: supplierSelectModel?.taxAmount,
        shouldRoundTwoNumber: false,
        code: currency,
      })} ${currency}`,
    },
    {
      title: translate("PL.txt_total_quote_price"),
      children: `${formatCurrency({
        value: supplierSelectModel?.totalAmount,
        shouldRoundTwoNumber: false,
        code: currency,
      })} ${currency}`,
    },
  ];

  const dataSourceRight = [
    {
      title: translate("PL.txt_total_price_before_closing_tax"),
      children: `${
        supplierSelectModel?.totalClosingAmountBeforeTax
          ? formatCurrency({
              value: supplierSelectModel.totalClosingAmountBeforeTax,
              shouldRoundTwoNumber: false,
              code: currency,
            })
          : 0
      } ${currency}`,
    },
    {
      title: translate("PL.txt_quotation_closing_tax"),
      children: `${
        supplierSelectModel?.totalClosingTaxAmount
          ? formatCurrency({
              value: supplierSelectModel.totalClosingTaxAmount,
              shouldRoundTwoNumber: false,
              code: currency,
            })
          : 0
      } ${currency}`,
    },
    {
      title: translate("PL.txt_total_quote_closing_price"),
      children: `${
        supplierSelectModel?.totalClosingTotalAmount
          ? formatCurrency({
              value: supplierSelectModel.totalClosingTotalAmount,
              shouldRoundTwoNumber: false,
              code: currency,
            })
          : 0
      } ${currency}`,
    },
    {
      title: translate("PL.description_goods_service_header_table"),
      children: supplierSelectModel?.description,
    },
    {
      title: translate("PL.drawer_quotation_notes_table"),
      children: supplierSelectModel?.note,
    },
  ];

  return (
    <Row>
      <Col span={12}>
        {dataSourceLeft?.map((el, index) => (
          <BlockContainer key={`${el.title}-${index}`} title={el.title}>
            {el.children}
          </BlockContainer>
        ))}
      </Col>
      <Col span={12}>
        {dataSourceRight?.map((el, index) => (
          <BlockContainer key={`${el.title}-${index}`} title={el.title}>
            {el.children}
          </BlockContainer>
        ))}
      </Col>
    </Row>
  );
};

export default GoodServiceQuotation;
