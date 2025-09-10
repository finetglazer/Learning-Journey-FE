import { useContext, useMemo } from "react";
import { type CollapseProps } from "antd";
import { useTranslation } from "react-i18next";

import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import {
  ColumnKey,
  GoodsPrice,
  InformationSectionKey,
  PurchasePlanGoodsServicesModel,
} from "models/PurchasingPlan";

import { AdvancedCollapseView } from "components";
import CommercialTermsSection from "./Components/CommercialTermsSection/CommercialTermsSection";
import GuaranteesSection from "./Components/GuaranteesSection/GuaranteesSection";
import WarrantiesSection from "./Components/WarrantiesSection/WarrantiesSection";
import ExchangeRateTableSection from "./Components/ExchangeRateTableSection/ExchangeRateTableSection";
import GoodServicesSection from "./Components/GoodServices/GoodServices";
import SelectInformationSection from "./Components/SelectInformationSection/SelectInformationSection";
import DetailSupplierSection from "./Components/DetailSupplierSection/DetailSupplierSection";
import styles from "./SelectSupplierTab.module.scss";
import { ContractTerm, Guarantee, Warranty } from "models/Contract";
import { sumWithFixed } from "core/helpers/calculator";
import { VND_CURRENCY_UNIT } from "core/config/consts";
import { IExchangeRateTable } from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";

type Props = {
  isDetail?: boolean;
};

const SelectSupplierTab = ({ isDetail = true }: Props) => {
  const contextValue = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const [translate] = useTranslation();
  const { model, stepChooseSupplier } = contextValue;

  const getDataInGoodItems = (
    data: GoodsPrice[],
    fieldName = ColumnKey.AMOUNT_BEFORE_TAX
  ) => {
    return sumWithFixed(
      data?.map((el: GoodsPrice) =>
        el?.goodsItems
          ? sumWithFixed(
              el.goodsItems?.map((el2: GoodsPrice) => el2[fieldName])
            )
          : el[fieldName]
      )
    );
  };

  const collapseItems: CollapseProps["items"] = useMemo(() => {
    const dataCollapse = [];
    if (
      !!stepChooseSupplier &&
      model?.selectSupplier?.exchangeRates?.length > 0
    ) {
      const dataSupplier = [...model.selectSupplier.exchangeRates]
        ?.filter((el) => Boolean(el?.currency)) //Todo: el.currency !== VND_CURRENCY_UNIT
        ?.map((item) => {
          const supplierContractTerms =
            model.selectSupplier.supplierContractTerms?.filter(
              (el: ContractTerm) => el.supplierId === item.supplierId
            );
          const supplierGuarantees =
            model.selectSupplier.supplierGuarantees?.filter(
              (el: Guarantee) => el.supplierId === item.supplierId
            );

          const supplierWarranties =
            model.selectSupplier.supplierWarranties?.filter(
              (el: Warranty) => el.supplierId === item.supplierId
            );

          const exchangeRates = model.selectSupplier.exchangeRates?.filter(
            (el: GoodsPrice) => el.supplierId === item.supplierId
          );

          const goodsItems = model.selectSupplier.supplierGoodsItems
            ?.map((el: GoodsPrice) => el.goodsItems)
            ?.flat()
            ?.filter((el: GoodsPrice) => el.supplier?.id === item.supplierId);

          const supplier = model.supplierPurchasePlans?.find(
            (el: Warranty) => el.id === item.supplierId
          );

          const amountBeforeTax = getDataInGoodItems(
            goodsItems,
            ColumnKey.AMOUNT_BEFORE_TAX
          );
          const tax = getDataInGoodItems(goodsItems, ColumnKey.TAX_AMOUNT);
          const totalAmount = getDataInGoodItems(
            goodsItems,
            ColumnKey.TOTAL_AMOUNT
          );
          const totalConvertedAmount = getDataInGoodItems(
            goodsItems,
            ColumnKey.TOTAL_CONVERT_AMOUNT
          );

          return {
            ...item,
            ...supplier,
            closingRate: item.closingRate,
            supplier,
            amountBeforeTax,
            tax,
            totalAmount,
            totalConvertedAmount,
            goodsItems,
            supplierContractTerms,
            supplierGuarantees,
            supplierWarranties,
            exchangeRates,
          };
        });

      if (dataSupplier?.length > 1) {
        dataCollapse.push({
          key: InformationSectionKey.SELECT_SUPPLIER_INFORMATION,
          label: translate("PL.select_supplier.title.select_information"),
          children: (
            <SelectInformationSection
              contextValue={contextValue}
              data={dataSupplier || []}
            />
          ),
        });
      }

      dataSupplier.forEach((el, index) => {
        dataCollapse.push({
          key: `${InformationSectionKey.DETAIL_SUPPLIER + index}`,
          label: el.supplierName,
          children: (
            <DetailSupplierSection
              contextValue={contextValue}
              data={el}
              isDetailTicket={true}
            />
          ),
        });
      });

      return dataCollapse;
    }

    const isExchangeRateHaveOtherVNDCurrency =
      model?.selectSupplier?.exchangeRates?.some(
        (el: IExchangeRateTable) => el.currency !== VND_CURRENCY_UNIT
      );

    return [
      {
        key: InformationSectionKey.GOOD_SERVICES,
        label: translate("PL.filter_service_goods"),
        children: (
          <GoodServicesSection
            contextValue={contextValue}
            dataGoodsItems={model?.selectSupplier?.supplierGoodsItems}
            dataExchangeRate={model?.selectSupplier?.exchangeRates}
          />
        ),
      },
      isExchangeRateHaveOtherVNDCurrency && {
        key: InformationSectionKey.EXCHANGE_RATE_TABLE,
        label: translate("PL.select_supplier.exchange_rate.table"),
        children: (
          <ExchangeRateTableSection
            contextValue={contextValue}
            data={model?.selectSupplier?.exchangeRates || []}
          />
        ),
      },
      {
        key: InformationSectionKey.COMMERCIAL_TERMS,
        label: translate("PL.purchasing_plan_commercial_terms"),
        children: (
          <CommercialTermsSection
            contextValue={contextValue}
            data={model?.selectSupplier?.supplierContractTerms || []}
          />
        ),
      },
      {
        key: InformationSectionKey.GUARANTIES_SECTION,
        label: translate("PL.purchasing_plan_guarantees_information"),
        children: (
          <GuaranteesSection
            contextValue={contextValue}
            data={model?.selectSupplier?.supplierGuarantees || []}
          />
        ),
      },
      {
        key: InformationSectionKey.WARRANTIES_SECTION,
        label: translate("PL.purchasing_plan_warranties_information"),
        children: (
          <WarrantiesSection
            contextValue={contextValue}
            data={model?.selectSupplier?.supplierWarranties || []}
          />
        ),
      },
    ]?.filter((el) => Boolean(el));
  }, [
    contextValue,
    model.selectSupplier.exchangeRates,
    model.selectSupplier.supplierContractTerms,
    model.selectSupplier.supplierGoodsItems,
    model.selectSupplier.supplierGuarantees,
    model.selectSupplier.supplierWarranties,
    model.supplierPurchasePlans,
    stepChooseSupplier,
    translate,
  ]);

  return (
    <div>
      <AdvancedCollapseView
        items={collapseItems}
        showAll={stepChooseSupplier}
        defaultActiveKey={[
          InformationSectionKey.GOOD_SERVICES,
          InformationSectionKey.SELECT_SUPPLIER_INFORMATION,
        ]}
        rootClassName={styles["select_supplier"]}
      />
    </div>
  );
};

export default SelectSupplierTab;
