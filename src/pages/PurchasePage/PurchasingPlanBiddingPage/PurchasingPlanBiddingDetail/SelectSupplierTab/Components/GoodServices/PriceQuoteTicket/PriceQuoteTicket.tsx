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

interface Props extends SelectSupplierTabDefaultProps {
  className?: string;
  dataGoodsItems: GoodsPrice[];
  dataExchangeRate: IExchangeRateTable[];
  isHaveFourColumn?: boolean;
  isDetailTicket?: boolean;
}

const PriceQuoteTicket = (props: Props) => {
  const {
    contextValue,
    className = "",
    dataGoodsItems,
    dataExchangeRate,
    isHaveFourColumn = false,
    isDetailTicket = false,
  } = props;

  const { model, stepChooseSupplier } = contextValue;

  const [translate] = useTranslation();

  const checkFirstItemIsDifferentVND = useMemo(() => {
    const firstCurrency = dataExchangeRate?.[0]?.currency;
    return firstCurrency !== VND_CURRENCY_UNIT;
  }, [dataExchangeRate]);

  const checkIsRoundZeroOrFourNumber = useMemo(() => {
    return dataExchangeRate?.[0]?.currency === VND_CURRENCY_UNIT ||
      dataExchangeRate?.[0]?.currency === JPY_CURRENCY_UNIT
      ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
      : CONSTANT_NUMBER.FOUR_NUMBER_FIX;
  }, [dataExchangeRate]);

  const getSumDataByField = useCallback(
    (
      fieldName = ColumnKey.TOTAL_AMOUNT_BEFORE_TAX,
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
      sumAmountBeforeTax = getSumDataByField(ColumnKey.TOTAL_AMOUNT_BEFORE_TAX);
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
        ColumnKey.CONVERT_TOTAL_AMOUNT,
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

  const primarySubText = dataExchangeRate?.[0]?.currency;

  const dataPricesQuote = useMemo(
    () =>
      [
        {
          key: "1",
          label: `${translate("PL.drawer_tax_before_money")}:`,
          primaryText: round(
            calculatedPrice().sumAmountBeforeTax,
            checkIsRoundZeroOrFourNumber
          ),
          primarySubText,
        },
        {
          key: "2",
          label: `${translate("PL.drawer_tax_money")}:`,
          primaryText: round(
            calculatedPrice().sumAmountTax,
            checkIsRoundZeroOrFourNumber
          ),
          primarySubText,
        },
        {
          key: "3",
          label: `${translate("PL.drawer_total_money")}:`,
          primaryText: round(
            calculatedPrice().sumTotalAmount,
            checkIsRoundZeroOrFourNumber
          ),
          primarySubText,
        },
        isHaveFourColumn && {
          key: "4",
          label: `${translate("PL.total_converted_amount_label")}:`,
          primaryText: round(
            calculatedPrice().sumTotalAmountConvert,
            CONSTANT_NUMBER.ZERO_FIX_NUMBER
          ),
          primarySubText: VND_CURRENCY_UNIT,
        },
      ]?.filter((el) => Boolean(el)),
    [
      calculatedPrice,
      checkIsRoundZeroOrFourNumber,
      isHaveFourColumn,
      primarySubText,
      translate,
    ]
  );

  return <TablePricesQuote data={dataPricesQuote} className={className} />;
};

export default PriceQuoteTicket;
