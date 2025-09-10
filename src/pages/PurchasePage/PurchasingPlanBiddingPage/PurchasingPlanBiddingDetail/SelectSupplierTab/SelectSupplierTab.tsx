import { useContext, useMemo } from "react";
import { type CollapseProps } from "antd";
import { useTranslation } from "react-i18next";

import { InformationSectionKey } from "models/PurchasingPlan";

import { AdvancedCollapseView } from "components";
import CommercialTermsSection from "./Components/CommercialTermsSection/CommercialTermsSection";
import GuaranteesSection from "./Components/GuaranteesSection/GuaranteesSection";
import WarrantiesSection from "./Components/WarrantiesSection/WarrantiesSection";
import GoodServicesSection from "./Components/GoodServices/GoodServices";
import styles from "./SelectSupplierTab.module.scss";
import { PurchasingPlanBiddingDetailHookContext } from "../PurchasingPlanBiddingDetailHook";
import { PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS } from "config/const";

type Props = {
  isDetail?: boolean;
};

const SelectSupplierTab = ({ isDetail = true }: Props) => {
  const contextValue = useContext(PurchasingPlanBiddingDetailHookContext);
  const [translate] = useTranslation();
  const { model, stepChooseSupplier } = contextValue;
  const isShowEditData =
    model?.status === PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.SELECT_SUPPLIER;

  const collapseItems: CollapseProps["items"] = useMemo(() => {
    return [
      {
        key: InformationSectionKey.GOOD_SERVICES,
        label: translate("PL.filter_service_goods"),
        children: (
          <GoodServicesSection
            contextValue={contextValue}
            dataGoodsItems={model?.selectSupplier?.supplierSelectedGoodsItems}
            dataExchangeRate={model?.selectSupplier?.exchangeRates}
            isHaveFourColumn={true}
            isDetail={!isShowEditData}
          />
        ),
      },
      {
        key: InformationSectionKey.COMMERCIAL_TERMS,
        label: translate("CA.tab_terms"),
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
  }, [contextValue, model, translate]);

  return (
    <div className={styles["content-container"]}>
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
