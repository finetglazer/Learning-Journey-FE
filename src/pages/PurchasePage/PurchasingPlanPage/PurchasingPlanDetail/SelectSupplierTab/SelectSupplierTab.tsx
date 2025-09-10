import { emptyIcon } from "assets/icons";
import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";
import dayjs from "dayjs";
import {
  PurchasingPlanModel,
  SupplierPurchasingPlanDetails,
} from "models/PurchasingPlan";
import { Fragment, useContext, useMemo } from "react";
import SupplierInformationDrawer from "../../Components/PurchasePlanSupplierTabView/Components/SupplierInformationDrawer/SupplierInformationDrawer";
import SupplierInformationTable from "../../Components/PurchasePlanSupplierTabView/Components/SupplierInformationTable/SupplierInformationTable";
import SupplierQuotationDrawer from "../../Components/PurchasePlanSupplierTabView/Components/SupplierQuotationDrawer/SupplierQuotationDrawer";
import EmptyTable from "../../Components/PurchasePlanSupplierTabView/Components/SupplierQuoteTable/EmptyTable/EmptyTable";
import SupplierQuoteTable from "../../Components/PurchasePlanSupplierTabView/Components/SupplierQuoteTable/SupplierQuoteTable";
import { PurchasingPlanDetailHookContext } from "../PurchasingPlanDetailHook";
import CommercialTermsSection from "./Components/CommercialTermsSection/CommercialTermsSection";
import GuaranteesSection from "./Components/GuaranteesSection/GuaranteesSection";
import SelectSupplierSection from "./Components/SelectSupplierSection/SelectSupplierSection";
import WarrantiesSection from "./Components/WarrantiesSection/WarrantiesSection";
import "./SelectSupplierTab.scss";

enum SelectSupplierTabKey {
  SELECT_SUPPLIER,
  COMMERCIAL_TERMS,
  GUARANTEES,
  WARRANTIES,
}

const SelectSupplierTab = ({ isView }: { isView?: boolean }) => {
  const {
    model,
    translate,
    isDrawerSupplier,
    isDrawerQuote,

    handleClickDrawerQuote,
    setIsDrawerSupplier,
    handleOpenSupplierDrawerByRecord,
  } = useContext<PurchasingPlanModel>(PurchasingPlanDetailHookContext);

  const supplierGeneralInformationCollapseItems: CollapseItem[] = useMemo(
    () => [
      {
        key: SelectSupplierTabKey.SELECT_SUPPLIER.toString(),
        label: translate("PL.select_supplier_choice_text"),
        children: <SelectSupplierSection isView={isView} />,
      },
      {
        key: SelectSupplierTabKey.COMMERCIAL_TERMS.toString(),
        label: translate("PL.purchasing_plan_commercial_terms"),
        children: (
          <CommercialTermsSection
            commercialTerms={
              model?.currentBiddingRound?.quotations?.commercialTerms
            }
          />
        ),
      },
      {
        key: SelectSupplierTabKey.GUARANTEES.toString(),
        label: translate("PL.purchasing_plan_guarantees_information"),
        children: (
          <GuaranteesSection
            guarantees={model?.currentBiddingRound?.quotations?.guarantees}
            currency={model?.currentBiddingRound?.quotations?.currency?.code}
          />
        ),
      },
      {
        key: SelectSupplierTabKey.WARRANTIES.toString(),
        label: translate("PL.purchasing_plan_warranties_information"),
        children: (
          <WarrantiesSection
            warranties={model?.currentBiddingRound?.quotations?.warranties}
          />
        ),
      },
    ],
    [
      isView,
      model?.currentBiddingRound?.quotations?.commercialTerms,
      model?.currentBiddingRound?.quotations?.currency?.code,
      model?.currentBiddingRound?.quotations?.guarantees,
      model?.currentBiddingRound?.quotations?.warranties,
      translate,
    ]
  );

  const items = (supplier: SupplierPurchasingPlanDetails, index: number) => [
    {
      key: `${index + 1}`,
      label: `${translate("PL.purchasing_plan_round")} ${
        supplier?.quotationRoundDetail?.roundNumber
      }: ${supplier?.name} ${translate("PL.purchasing_plan_from")} 
        ${dayjs(supplier?.quotationRoundDetail?.startDate).format(
          "DD/MM/YYYY"
        )} ${translate("PL.purchasing_plan_to")} 
        ${dayjs(supplier?.quotationRoundDetail?.endDate).format("DD/MM/YYYY")}`,
      children: (
        <div className="d-flex flex-column gap-3">
          <SupplierInformationTable
            supplier={[supplier]}
            handleOpenSupplierDrawerByRecord={handleOpenSupplierDrawerByRecord}
          />
          {!supplier?.quotationRoundDetail?.quotations ? (
            <Fragment>
              <div className="fs-6 fw-semibold">
                {translate("PL.purchasing_plan_supplier_quotes_title")}
              </div>
              <EmptyTable
                icon={<img src={emptyIcon} alt="" />}
                content={
                  <div>{translate("PL.purchasing_plan_no_quote_yet")}</div>
                }
              />
            </Fragment>
          ) : (
            <SupplierQuoteTable
              quotationRound={supplier.quotationRoundDetail?.quotations}
            />
          )}
        </div>
      ),
    },
  ];

  const defaultActiveKeys = [
    SelectSupplierTabKey.SELECT_SUPPLIER,
    SelectSupplierTabKey.COMMERCIAL_TERMS,
    SelectSupplierTabKey.GUARANTEES,
    SelectSupplierTabKey.WARRANTIES,
  ];

  return (
    <div className="select_supplier_tab">
      <div className="select_supplier_tab__general_information">
        <CollapseView
          items={supplierGeneralInformationCollapseItems}
          defaultActiveKey={defaultActiveKeys}
          className="select_supplier_collapse"
        />
      </div>
      {model.supplierPurchasePlans?.map(
        (supplier: SupplierPurchasingPlanDetails, index: number) => (
          <div
            className="select_supplier_tab__bidding_rounds"
            key={supplier.id}
          >
            <CollapseView
              items={items(supplier, index)}
              defaultActiveKey={[`${index + 1}`]}
              className="select_supplier_collapse"
            />
          </div>
        )
      )}

      <SupplierInformationDrawer
        visible={isDrawerSupplier}
        handleClose={() => setIsDrawerSupplier(false)}
        values={model?.supplierDrawerDetail}
      />
      <SupplierQuotationDrawer
        visible={isDrawerQuote}
        handleClose={handleClickDrawerQuote}
      />
    </div>
  );
};

export default SelectSupplierTab;
