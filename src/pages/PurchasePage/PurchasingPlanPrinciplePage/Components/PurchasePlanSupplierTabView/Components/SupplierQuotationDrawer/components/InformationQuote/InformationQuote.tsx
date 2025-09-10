import TablePricesQuote from "../../../../../TablePricesQuote/TablePricesQuote";
import TableGoodsServices, {
  calculateTotal,
  convertSummaryDataInfo,
} from "./components/TableGoodsServices/TableGoodsServices";
import { useContext, useMemo } from "react";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import { isEqual } from "lodash";

const DEFAULT_CURRENCY = "VND";

const InformationQuote = () => {
  const { translate, model } = useContext<PurchasingPlanModel>(
    PurchasingPlanDetailHookContext
  );
  const biddingExchangeRate =
    model?.drawerQuotationDetail?.goodsItems?.[0]?.exchangeRate || 0;

  const CurrencyMoney =
    model?.drawerQuotationDetail?.supplierPurchasePlans?.[0]
      ?.quotationRoundDetail?.quotations?.[0]?.currency || null;

  const isVNDCurrency = useMemo(
    () => isEqual(CurrencyMoney, DEFAULT_CURRENCY),
    [CurrencyMoney]
  );

  const convertDataByCategory = useMemo(
    () =>
      convertSummaryDataInfo(
        model?.drawerQuotationDetail?.goodsItems || [],
        CurrencyMoney,
        biddingExchangeRate
      ),
    [model?.goodPrices, CurrencyMoney, biddingExchangeRate]
  );

  const DataPricesQuote = useMemo(
    () => [
      {
        key: "1",
        label: `${translate("PL.price_before_tax_label")}`,
        primaryText: calculateTotal(convertDataByCategory, "amount"),
        secondaryText: isVNDCurrency
          ? undefined
          : calculateTotal(convertDataByCategory, "amount") *
            biddingExchangeRate,
        primarySubText: CurrencyMoney,
        secondarySubText: DEFAULT_CURRENCY,
      },
      {
        key: "2",
        label: `${translate("PL.tax_label")}:`,
        primaryText: calculateTotal(convertDataByCategory, "totalTax"),
        secondaryText: isVNDCurrency
          ? undefined
          : calculateTotal(convertDataByCategory, "totalTax") *
            biddingExchangeRate,
        primarySubText: CurrencyMoney,
        secondarySubText: DEFAULT_CURRENCY,
      },
      {
        key: "3",
        label: `${translate("PL.other_cost_label")}:`,
        primaryText: calculateTotal(convertDataByCategory, "totalOtherCost"),
        secondaryText: isVNDCurrency
          ? undefined
          : calculateTotal(convertDataByCategory, "totalOtherCost") *
            biddingExchangeRate,
        primarySubText: CurrencyMoney,
        secondarySubText: DEFAULT_CURRENCY,
      },
      {
        key: "4",
        label: `${translate("PL.total_amount_label")}:`,
        primaryText: calculateTotal(convertDataByCategory, "totalAmount"),
        secondaryText: isVNDCurrency
          ? undefined
          : calculateTotal(convertDataByCategory, "totalAmount") *
            biddingExchangeRate,
        primarySubText: CurrencyMoney,
        secondarySubText: DEFAULT_CURRENCY,
      },
    ],
    [translate, model, CurrencyMoney]
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
