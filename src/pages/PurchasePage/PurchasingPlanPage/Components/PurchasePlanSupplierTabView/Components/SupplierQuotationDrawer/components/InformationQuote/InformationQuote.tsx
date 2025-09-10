import { detectIntegerCurrency } from "core/helpers/currency";
import { isEqual, round } from "lodash";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import { useContext, useMemo } from "react";
import TablePricesQuote from "../../../../../TablePricesQuote/TablePricesQuote";
import TableGoodsServices, {
  calculateTotal,
  convertSummaryDataInfo,
  FOUR_NUMBER_FIX,
} from "./components/TableGoodsServices/TableGoodsServices";

const DEFAULT_CURRENCY = "VND";
const ZERO_FIX_NUMBER = 0;

const InformationQuote = () => {
  const { translate, model } = useContext<PurchasingPlanModel>(
    PurchasingPlanDetailHookContext
  );
  const biddingExchangeRate =
    model?.drawerQuotationDetail?.goodsItems?.[0]?.exchangeRate || 0;

  const currencyMoney =
    model?.drawerQuotationDetail?.supplierPurchasePlans?.[0]
      ?.quotationRoundDetail?.quotations?.[0]?.currency || null;

  const isVNDCurrency = useMemo(
    () => isEqual(currencyMoney, DEFAULT_CURRENCY),
    [currencyMoney]
  );

  const convertDataByCategory = useMemo(
    () =>
      convertSummaryDataInfo(
        model?.drawerQuotationDetail?.goodsItems || [],
        currencyMoney,
        biddingExchangeRate
      ),
    [model?.goodPrices, currencyMoney, biddingExchangeRate]
  );

  const DataPricesQuote = useMemo(
    () => [
      {
        key: "1",
        label: `${translate("PL.price_before_tax_label")}`,
        primaryText: round(
          calculateTotal(convertDataByCategory, "amount"),
          detectIntegerCurrency(currencyMoney)
            ? ZERO_FIX_NUMBER
            : FOUR_NUMBER_FIX
        ),
        secondaryText: isVNDCurrency
          ? undefined
          : round(
              calculateTotal(convertDataByCategory, "amount") *
                biddingExchangeRate
            ),
        primarySubText: currencyMoney,
        secondarySubText: DEFAULT_CURRENCY,
      },
      {
        key: "2",
        label: `${translate("PL.tax_label")}:`,
        primaryText: round(
          calculateTotal(convertDataByCategory, "totalTax"),
          isVNDCurrency ? ZERO_FIX_NUMBER : FOUR_NUMBER_FIX
        ),
        secondaryText: isVNDCurrency
          ? undefined
          : round(
              calculateTotal(convertDataByCategory, "totalTax") *
                biddingExchangeRate
            ),
        primarySubText: currencyMoney,
        secondarySubText: DEFAULT_CURRENCY,
      },
      {
        key: "3",
        label: `${translate("PL.total_amount_label")}:`,
        primaryText: round(
          calculateTotal(convertDataByCategory, "totalAmount"),
          detectIntegerCurrency(currencyMoney)
            ? ZERO_FIX_NUMBER
            : FOUR_NUMBER_FIX
        ),
        secondaryText: isVNDCurrency
          ? undefined
          : round(
              calculateTotal(convertDataByCategory, "totalAmount") *
                biddingExchangeRate
            ),
        primarySubText: currencyMoney,
        secondarySubText: DEFAULT_CURRENCY,
      },
    ],
    [translate, model, currencyMoney]
  );

  return (
    <div className="recipient-information">
      <TablePricesQuote data={DataPricesQuote} />
      <div className="mt-3">
        <TableGoodsServices />
      </div>
    </div>
  );
};

export default InformationQuote;
