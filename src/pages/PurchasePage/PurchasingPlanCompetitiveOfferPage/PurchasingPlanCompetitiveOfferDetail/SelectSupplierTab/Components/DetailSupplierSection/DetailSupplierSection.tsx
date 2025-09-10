import { InformationSectionKey } from "models/PurchasingPlan";
import { SelectSupplierTabDefaultProps } from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CommercialTermsSection from "../CommercialTermsSection/CommercialTermsSection";
import GuaranteesSection from "../GuaranteesSection/GuaranteesSection";
import WarrantiesSection from "../WarrantiesSection/WarrantiesSection";
import { AdvancedCollapseView } from "components";
import GoodServicesSection from "../GoodServices/GoodServices";
import styles from "./DetailSupplierSection.module.scss";
import { VND_CURRENCY_UNIT } from "core/config/consts";

const DetailSupplierSection = (props: SelectSupplierTabDefaultProps) => {
  const [translate] = useTranslation();
  const { contextValue, data, isDetailTicket } = props;
  const collapseItems = useMemo(() => {
    return [
      {
        key: InformationSectionKey.GOOD_SERVICES,
        label: translate("PL.select_supplier.title.approval_information"),
        children: (
          <GoodServicesSection
            contextValue={contextValue}
            isHaveSupplier={false}
            dataSupplier={[data]}
            dataGoodsItems={data?.goodsItems}
            dataExchangeRate={data?.exchangeRates}
            isShowSecondaryTextPrice={false}
            isDetailTicket={isDetailTicket}
            isHaveFourColumn={
              isDetailTicket && data?.currency !== VND_CURRENCY_UNIT
            }
          />
        ),
      },
      {
        key: InformationSectionKey.COMMERCIAL_TERMS,
        label: translate("PL.purchasing_plan_commercial_terms"),
        children: (
          <CommercialTermsSection
            contextValue={contextValue}
            isHaveSupplier={false}
            data={data?.supplierContractTerms}
          />
        ),
      },
      {
        key: InformationSectionKey.GUARANTIES_SECTION,
        label: translate("PL.purchasing_plan_guarantees_information"),
        children: (
          <GuaranteesSection
            contextValue={contextValue}
            data={data?.supplierGuarantees}
            isHaveSupplier={false}
          />
        ),
      },
      {
        key: InformationSectionKey.WARRANTIES_SECTION,
        label: translate("PL.purchasing_plan_warranties_information"),
        children: (
          <WarrantiesSection
            contextValue={contextValue}
            data={data?.supplierWarranties}
            isHaveSupplier={false}
          />
        ),
      },
    ];
  }, [contextValue, data, isDetailTicket, translate]);

  return (
    <AdvancedCollapseView
      items={collapseItems}
      showAll={false}
      defaultActiveKey={[InformationSectionKey.GOOD_SERVICES]}
      rootClassName={styles["detail_supplier"]}
    />
  );
};

export default DetailSupplierSection;
