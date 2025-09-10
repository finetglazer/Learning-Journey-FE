import { useTranslation } from "react-i18next";
import TablePricesQuote from "pages/PurchasePage/PurchasingPlanPage/Components/TablePricesQuote/TablePricesQuote";
import { useCallback, useMemo } from "react";
import { round } from "lodash";
import { JPY_CURRENCY_UNIT, VND_CURRENCY_UNIT } from "core/config/consts";
import CONSTANT_NUMBER from "config/number";
import {
  IExchangeRateTable,
  SelectSupplierTabDefaultProps,
} from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import { sumWithFixed } from "core/helpers/calculator";
import { GoodItemsModel } from "models/Acceptance";
import { ColumnKey, GoodsPrice } from "models/PurchasingPlan";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";

interface Props extends SelectSupplierTabDefaultProps {
  className?: string;
  dataGoodsItems: GoodsPrice[];
  dataExchangeRate: IExchangeRateTable[];
  isHaveFourColumn?: boolean;
  isShowSecondaryTextPrice?: boolean;
  isDetailTicket?: boolean;
}

const PriceQuoteTicket = (props: Props) => {
  // Thay đổi USD_Currency_Unit bằng code của PAMS hiện tại là đc
  const {
    contextValue,
    className = "",
    dataGoodsItems,
    dataExchangeRate,
    isHaveFourColumn = false,
    isShowSecondaryTextPrice = true,
    isDetailTicket = false,
  } = props;

  const { model, stepChooseSupplier } = contextValue;

  const [translate] = useTranslation();

  const checkFirstItemIsDifferentVND = useMemo(() => {
    const firstCurrency = dataExchangeRate[0]?.currency;
    return firstCurrency !== VND_CURRENCY_UNIT;
  }, [dataExchangeRate]);

  const checkIsRoundZeroOrFourNumber = useMemo(() => {
    return dataExchangeRate[0]?.currency === VND_CURRENCY_UNIT ||
      dataExchangeRate[0]?.currency === JPY_CURRENCY_UNIT
      ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
      : CONSTANT_NUMBER.FOUR_NUMBER_FIX;
  }, [dataExchangeRate]);

  const checkIsSameCurrency = useMemo(() => {
    const firstCurrency = dataExchangeRate[0]?.currency;
    const isDifferentCurrency = dataExchangeRate
      ?.map((item: IExchangeRateTable) => item?.currency)
      ?.every((item: string) => item === firstCurrency);
    return checkFirstItemIsDifferentVND && isDifferentCurrency;
  }, [checkFirstItemIsDifferentVND, dataExchangeRate]);

  const checkAllIsSameVNDCurrency = useMemo(() => {
    const isSameVND = dataExchangeRate
      ?.map((item: IExchangeRateTable) => item?.currency)
      ?.every((item: string) => item === VND_CURRENCY_UNIT);
    return isSameVND;
  }, [dataExchangeRate]);

  const getSumDataByField = useCallback(
    (
      fieldName = ColumnKey.AMOUNT_BEFORE_TAX,
      numberFixed = CONSTANT_NUMBER.FOUR_NUMBER_FIX
    ) => {
      const dataSum = dataGoodsItems.map((item: GoodItemsModel) => {
        return item?.goodsItems
          ? sumWithFixed(
              item.goodsItems
                ?.map((el: GoodItemsModel) => {
                  return el?.[fieldName]
                    ? el[fieldName]
                    : sumWithFixed(
                        el?.goodsItems?.map(
                          (el2: GoodItemsModel) => el2?.[fieldName]
                        ),
                        numberFixed
                      );
                })
                .filter((el: GoodItemsModel) => Boolean(el)),
              numberFixed
            )
          : item[fieldName];
      });

      return sumWithFixed(dataSum, numberFixed);
    },
    [dataGoodsItems]
  );

  const calculatedPrice = useCallback(() => {
    let sumAmountBeforeTax = 0;
    let sumAmountTax = 0;
    let sumTotalAmount = 0;
    let sumAmountBeforeTaxConvert = 0;
    let sumAmountTaxConvert = 0;
    let sumTotalAmountConvert = 0;

    if (dataGoodsItems?.length > 0) {
      sumAmountBeforeTax = getSumDataByField(ColumnKey.AMOUNT_BEFORE_TAX);
      sumAmountTax = getSumDataByField(ColumnKey.TAX_AMOUNT);
      sumTotalAmount = getSumDataByField(ColumnKey.TOTAL_AMOUNT);
      sumAmountBeforeTaxConvert = getSumDataByField(
        ColumnKey.CONVERT_AMOUNT_BEFORE_TAX,
        CONSTANT_NUMBER.ZERO_FIX_NUMBER
      );
      sumAmountTaxConvert = getSumDataByField(
        ColumnKey.TAX_CONVERT_AMOUNT,
        CONSTANT_NUMBER.ZERO_FIX_NUMBER
      );
      sumTotalAmountConvert = getSumDataByField(
        ColumnKey.TOTAL_CONVERT_AMOUNT,
        CONSTANT_NUMBER.ZERO_FIX_NUMBER
      );
    }

    return {
      sumAmountBeforeTax,
      sumAmountTax,
      sumTotalAmount,
      sumAmountBeforeTaxConvert,
      sumAmountTaxConvert,
      sumTotalAmountConvert,
    };
  }, [dataGoodsItems?.length, getSumDataByField]);

  const isSelectSupplierTicket =
    isDetailTicket ||
    checkIsSameCurrency ||
    checkAllIsSameVNDCurrency ||
    (!stepChooseSupplier &&
      checkIsSameCurrency &&
      model?.status === PURCHASING_PLAN_STATUS.SELECT_SUPPLIER);

  const primarySubText = checkIsSameCurrency
    ? dataExchangeRate[0]?.currency
    : VND_CURRENCY_UNIT;

  const DataPricesQuote = useMemo(
    () =>
      [
        {
          key: "1",
          label: isSelectSupplierTicket
            ? `${translate("PL.drawer_tax_before_money")}:`
            : `${translate("PL.drawer_tax_before_money_exchange")}:`,
          primaryText: round(
            isSelectSupplierTicket
              ? calculatedPrice().sumAmountBeforeTax
              : calculatedPrice().sumAmountBeforeTaxConvert,
            isSelectSupplierTicket
              ? checkIsRoundZeroOrFourNumber
              : CONSTANT_NUMBER.ZERO_FIX_NUMBER
          ),
          primarySubText,
          secondaryText:
            isShowSecondaryTextPrice && checkIsSameCurrency
              ? round(
                  calculatedPrice().sumAmountBeforeTaxConvert,
                  CONSTANT_NUMBER.ZERO_FIX_NUMBER
                )
              : null,
          secondarySubText: VND_CURRENCY_UNIT,
        },
        {
          key: "2",
          label: isSelectSupplierTicket
            ? `${translate("PL.drawer_tax_money")}:`
            : `${translate("PL.drawer_tax_money_exchange")}:`,
          primaryText: round(
            isSelectSupplierTicket
              ? calculatedPrice().sumAmountTax
              : calculatedPrice().sumAmountTaxConvert,
            isSelectSupplierTicket
              ? checkIsRoundZeroOrFourNumber
              : CONSTANT_NUMBER.ZERO_FIX_NUMBER
          ),
          primarySubText,
          secondaryText:
            isShowSecondaryTextPrice && checkIsSameCurrency
              ? round(
                  calculatedPrice().sumAmountTaxConvert,
                  CONSTANT_NUMBER.ZERO_FIX_NUMBER
                )
              : null,
          secondarySubText: VND_CURRENCY_UNIT,
        },
        {
          key: "3",
          label: isSelectSupplierTicket
            ? `${translate("PL.drawer_total_money")}:`
            : `${translate("PL.drawer_exchange_total")}:`,
          primaryText: round(
            isSelectSupplierTicket
              ? calculatedPrice().sumTotalAmount
              : calculatedPrice().sumTotalAmountConvert,
            isSelectSupplierTicket
              ? checkIsRoundZeroOrFourNumber
              : CONSTANT_NUMBER.ZERO_FIX_NUMBER
          ),
          primarySubText,
          secondaryText:
            isShowSecondaryTextPrice && checkIsSameCurrency
              ? round(
                  calculatedPrice().sumTotalAmountConvert,
                  CONSTANT_NUMBER.ZERO_FIX_NUMBER
                )
              : null,
          secondarySubText: VND_CURRENCY_UNIT,
        },
        isHaveFourColumn &&
          isSelectSupplierTicket && {
            key: "4",
            label: `${translate("PL.total_converted_amount_label")}:`,
            primaryText: round(
              calculatedPrice().sumTotalAmountConvert,
              CONSTANT_NUMBER.ZERO_FIX_NUMBER
            ),
            primarySubText: VND_CURRENCY_UNIT,
            secondaryText:
              isShowSecondaryTextPrice && checkIsSameCurrency
                ? round(
                    calculatedPrice().sumTotalAmountConvert,
                    CONSTANT_NUMBER.ZERO_FIX_NUMBER
                  )
                : null,
            secondarySubText: VND_CURRENCY_UNIT,
          },
      ]?.filter((el) => Boolean(el)),
    [
      calculatedPrice,
      checkIsRoundZeroOrFourNumber,
      checkIsSameCurrency,
      isHaveFourColumn,
      isSelectSupplierTicket,
      isShowSecondaryTextPrice,
      primarySubText,
      translate,
    ]
  );

  return <TablePricesQuote data={DataPricesQuote} className={className} />;
};

export default PriceQuoteTicket;
