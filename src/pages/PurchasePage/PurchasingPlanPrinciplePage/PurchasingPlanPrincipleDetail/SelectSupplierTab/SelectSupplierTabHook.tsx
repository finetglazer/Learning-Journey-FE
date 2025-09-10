import { numberConstants } from "core/config/consts";
import { ConfigField } from "core/services/service-types";
import { type TFunction } from "i18next";
import { isEmpty, isEqual } from "lodash";
import {
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
  QuotationRound,
  QuotationSupplier,
} from "models/PurchasingPlan";
import { useCallback, useContext, useMemo } from "react";
import { Model } from "react-3layer-common";
import { Observable, of } from "rxjs";
import {
  calculateTotal,
  groupDataByCategory,
} from "./Components/SelectSupplierSection/Components/GoodsServiceTable/helpers";
import { VIETNAMESE_CURRENCY } from "./Components/SelectSupplierSection/SelectSupplierSection";
import { PurchasingPlanPrincipleDetailHookContext } from "../PurchasingPlanPrincipleDetailHook";

export interface SelectSupplierTabHook {
  model: PurchasingPlanTypeModel;
  translate: TFunction<"translation", undefined>;
  priceQuotesData: IPriceQuotesData[];
  getListSupplier: () => Observable<QuotationSupplier[]>;
  getQuotationBiddingRounds: () => Observable<QuotationRound[]>;
  handleChangeBiddingSupplier: (
    idValue: number,
    value?: QuotationSupplier
  ) => void;
  handleChangeBiddingRound: (idValue: number, value?: QuotationRound) => void;
  handleChangeSelectField: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
}

export interface IPriceQuotesData {
  key: string;
  label: React.ReactNode;
  primaryText?: string | number;
  secondaryText?: string | number;
  primarySubText?: string;
  secondarySubText: string;
}

export const useSelectSupplierTab = (): SelectSupplierTabHook => {
  const { model, translate, handleChangeSelectField, handleChangeSingleField } =
    useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);

  const biddingExchangeRate = model?.biddingExchangeRate || 1;

  const currencyCode =
    model?.currentBiddingRound?.quotations?.currency?.code ||
    VIETNAMESE_CURRENCY;

  const isVNDCurrency = useMemo(
    () => isEqual(currencyCode, VIETNAMESE_CURRENCY),
    [currencyCode]
  );

  const convertDataByCategory = useMemo(
    () =>
      groupDataByCategory(
        model?.goodPrices || [],
        currencyCode,
        biddingExchangeRate
      ),
    [model?.goodPrices, currencyCode, biddingExchangeRate]
  );

  const priceQuotesData: IPriceQuotesData[] = useMemo(
    () => [
      {
        key: "1",
        label: translate("PL.price_before_tax_label"),
        primaryText: calculateTotal(convertDataByCategory, "amount"),
        secondaryText: isVNDCurrency
          ? undefined
          : calculateTotal(convertDataByCategory, "amount") *
            biddingExchangeRate,
        primarySubText: currencyCode,
        secondarySubText: VIETNAMESE_CURRENCY,
      },
      {
        key: "2",
        label: `${translate("PL.other_cost_label")}:`,
        primaryText: calculateTotal(convertDataByCategory, "totalOtherCost"),
        secondaryText: isVNDCurrency
          ? undefined
          : calculateTotal(convertDataByCategory, "totalOtherCost") *
            biddingExchangeRate,
        primarySubText: currencyCode,
        secondarySubText: VIETNAMESE_CURRENCY,
      },
      {
        key: "3",
        label: `${translate("PL.tax_label")}:`,
        primaryText: calculateTotal(convertDataByCategory, "totalTax"),
        secondaryText: isVNDCurrency
          ? undefined
          : calculateTotal(convertDataByCategory, "totalTax") *
            biddingExchangeRate,
        primarySubText: currencyCode,
        secondarySubText: VIETNAMESE_CURRENCY,
      },
      {
        key: "4",
        label: `${translate("PL.total_amount_label")}:`,
        primaryText: calculateTotal(convertDataByCategory, "totalAmount"),
        secondaryText: isVNDCurrency
          ? undefined
          : calculateTotal(convertDataByCategory, "totalAmount") *
            biddingExchangeRate,
        primarySubText: currencyCode,
        secondarySubText: VIETNAMESE_CURRENCY,
      },
    ],
    [
      biddingExchangeRate,
      convertDataByCategory,
      currencyCode,
      isVNDCurrency,
      translate,
    ]
  );

  const getListSupplier = useCallback(
    () =>
      of(
        !isEmpty(model?.quotationSupplier)
          ? model?.quotationSupplier.map((supplier: QuotationSupplier) => ({
              ...supplier,
              id: supplier?.supplierId,
            }))
          : []
      ),
    [model?.quotationSupplier]
  );

  const getQuotationBiddingRounds = useCallback(
    () =>
      of(
        !isEmpty(model?.quotationBiddingRounds)
          ? model?.quotationBiddingRounds?.map(
              (quotationRound: QuotationRound) => ({
                ...quotationRound,
                id: quotationRound?.quotationRoundId,
                name: quotationRound?.quotationRoundName,
              })
            )
          : []
      ),
    [model?.quotationBiddingRounds]
  );

  const handleChangeBiddingSupplier = useCallback(
    (idValue: number, value?: QuotationSupplier) => {
      const newBiddingRound = !isEmpty(value?.quotationRounds)
        ? {
            ...value?.quotationRounds[numberConstants.ZERO],
            id: value?.quotationRounds[numberConstants.ZERO]?.quotationRoundId,
            name: value?.quotationRounds[numberConstants.ZERO]
              ?.quotationRoundName,
          }
        : null;

      handleChangeSingleField({ fieldName: "quotationBiddingRounds" })(
        value?.quotationRounds || []
      );
      handleChangeSingleField({ fieldName: "currentBiddingRound" })(
        newBiddingRound
      );
      handleChangeSingleField({ fieldName: "goodPrices" })(
        newBiddingRound?.quotations?.goodsPrices || []
      );

      handleChangeSelectField({ fieldName: "biddingSupplier" })(idValue, value);
    },
    [handleChangeSelectField, handleChangeSingleField]
  );

  const handleChangeBiddingRound = useCallback(
    (idValue: number, value?: QuotationRound) => {
      handleChangeSingleField({ fieldName: "biddingExchangeRate" })(
        value?.quotations?.exchangeRate
      );
      handleChangeSingleField({ fieldName: "goodPrices" })(
        value?.quotations?.goodsPrices
      );
      handleChangeSelectField({
        fieldName: "currentBiddingRound",
      })(idValue, value);
    },
    [handleChangeSelectField, handleChangeSingleField]
  );

  return {
    model,
    translate,
    priceQuotesData,
    getListSupplier,
    getQuotationBiddingRounds,
    handleChangeBiddingSupplier,
    handleChangeBiddingRound,
    handleChangeSelectField,
    handleChangeSingleField,
  };
};
