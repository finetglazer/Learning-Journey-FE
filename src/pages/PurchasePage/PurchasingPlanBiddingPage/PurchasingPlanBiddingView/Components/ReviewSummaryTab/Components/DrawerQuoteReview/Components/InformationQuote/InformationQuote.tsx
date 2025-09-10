import {
  JPY_CURRENCY_UNIT,
  numberConstants,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { isEqual, round } from "lodash";
import TablePricesQuote from "pages/PurchasePage/PurchasingPlanPage/Components/TablePricesQuote/TablePricesQuote";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TableGoodsServices, {
  calculateTotal,
  convertSummaryDataInfo,
} from "../TableGoodsServices/TableGoodsServices";
import { Quotation } from "models/PurchasingPlan/PurchasingPlanBidder";

const ZERO_FIX_NUMBER = 0;
const FOUR_NUMBER_FIX = 4;

export interface InformationQuoteProps {
  quotation: Quotation;
}

export const InformationQuote = ({ quotation }: InformationQuoteProps) => {
  const [translate] = useTranslation();

  const priceOfferExchangeRate =
    quotation?.quotationInfo?.[numberConstants.ZERO]?.exchangeRate ||
    numberConstants.ZERO;

  const currencyMoney = quotation?.currency?.code || null;

  const isIntegerCurrency = useMemo(
    () =>
      currencyMoney &&
      [JPY_CURRENCY_UNIT, VND_CURRENCY_UNIT].includes(currencyMoney),
    [currencyMoney]
  );

  const convertDataByCategory = useMemo(
    () =>
      convertSummaryDataInfo(
        quotation?.quotationInfo || [],
        currencyMoney,
        priceOfferExchangeRate
      ),
    [currencyMoney, priceOfferExchangeRate, quotation?.quotationInfo]
  );

  const DataPricesQuote = useMemo(
    () => [
      {
        key: "1",
        label: `${translate("PL.price_before_tax_label")}`,
        primaryText: round(
          calculateTotal(convertDataByCategory, "amountBeforeTax"),
          isIntegerCurrency ? ZERO_FIX_NUMBER : FOUR_NUMBER_FIX
        ),
        secondaryText: isIntegerCurrency
          ? undefined
          : round(
              calculateTotal(convertDataByCategory, "amountBeforeTax") *
                priceOfferExchangeRate
            ),
        primarySubText: currencyMoney,
        secondarySubText: VND_CURRENCY_UNIT,
      },
      {
        key: "2",
        label: `${translate("PL.tax_label")}:`,
        primaryText: round(
          calculateTotal(convertDataByCategory, "totalTax"),
          isIntegerCurrency ? ZERO_FIX_NUMBER : FOUR_NUMBER_FIX
        ),
        secondaryText: isIntegerCurrency
          ? undefined
          : round(
              calculateTotal(convertDataByCategory, "totalTax") *
                priceOfferExchangeRate
            ),
        primarySubText: currencyMoney,
        secondarySubText: VND_CURRENCY_UNIT,
      },
      {
        key: "3",
        label: `${translate("PL.total_amount_label")}:`,
        primaryText: round(
          calculateTotal(convertDataByCategory, "totalAmount"),
          isIntegerCurrency ? ZERO_FIX_NUMBER : FOUR_NUMBER_FIX
        ),
        secondaryText: isIntegerCurrency
          ? undefined
          : round(
              calculateTotal(convertDataByCategory, "totalAmount") *
                priceOfferExchangeRate
            ),
        primarySubText: currencyMoney,
        secondarySubText: VND_CURRENCY_UNIT,
      },
    ],
    [
      translate,
      convertDataByCategory,
      isIntegerCurrency,
      priceOfferExchangeRate,
      currencyMoney,
    ]
  );

  return (
    <div>
      <TablePricesQuote data={DataPricesQuote} />
      <div className="mt-3">
        <TableGoodsServices quotation={quotation} />
      </div>
    </div>
  );
};
