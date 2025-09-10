import { EvaluationResult } from "models/PurchasingPlan";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./DrawerQuoteReview.scss";
import { useContext, useMemo } from "react";
import { AdvancedCollapseView } from "components";
import { InformationQuote } from "./Components/InformationQuote/InformationQuote";
import AttachedDocument from "./Components/AttachedDocument/AttachedDocument";
import InformationSupplier from "./Components/InformationSupplier/InformationSupplier";
import TermOfTrade from "./Components/TermOfTrade/TermOfTrade";
import GuaranteeInformation from "./Components/GuaranteeInformation/GuaranteeInformation";
import WarrantyInformation from "./Components/WarrantyInformation/WarrantyInformation";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";

enum TabKeyQuote {
  InformationSupplier = "InformationSupplier",
  InformationQuote = "InformationQuote",
  TermOfTrade = "TermOfTrade",
  GuaranteeInformation = "GuaranteeInformation",
  WarrantyInformation = "WarrantyInformation",
  Attachment = "Attachment",
}

type Props = {
  visible?: boolean;
  onPressClose?: () => void;
};

const DrawerQuoteReview = ({ onPressClose }: Props) => {
  const [translate] = useTranslation();
  const { model, selectedEvaluationResult } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const quotation = selectedEvaluationResult?.quotation;

  const itemCollapses = useMemo(() => {
    return [
      {
        key: TabKeyQuote.InformationSupplier,
        label: translate("PPA.supplier_info"),
        children: <InformationSupplier data={quotation} />,
      },
      {
        key: TabKeyQuote.InformationQuote,
        label: translate("PL.information_quote"),
        children: <InformationQuote quotation={quotation} />,
      },
      {
        key: TabKeyQuote.TermOfTrade,
        label: translate("PPA.txt_term_of_contract"),
        children: <TermOfTrade data={quotation?.contractTerms} />,
      },
      {
        key: TabKeyQuote.GuaranteeInformation,
        label: translate("CA.txt_guarantee_information"),
        children: (
          <GuaranteeInformation
            data={quotation?.guarantees}
            currency={quotation?.currency?.code || ""}
          />
        ),
      },
      {
        key: TabKeyQuote.WarrantyInformation,
        label: translate("CA.txt_warranty_information"),
        children: <WarrantyInformation data={quotation?.warranties} />,
      },
      {
        key: TabKeyQuote.Attachment,
        label: translate("CM.txt_attachment_files"),
        children: <AttachedDocument files={quotation?.quotationDocuments} />,
      },
    ];
  }, [quotation, translate]);

  return (
    <div className="drawer-quote-review-wrapper">
      <Drawer
        size={"xl"}
        loading={false}
        visible={true}
        titleButtonCancel={translate("PR.drawer_btn_delete_goods")}
        titleButtonApply={translate("PR.drawer_btn_save")}
        handleClose={onPressClose}
        isHaveCloseIcon={true}
        shouldCloseWhenClickOutSide={false}
        hasOverlay={true}
        visibleFooter={false}
        className="detail_review_drawer"
        title={
          <div className="fw-bold drawer__header-text_title">
            <span>
              {" "}
              {translate("PL.drawer_quote_title", {
                supplierForm: quotation?.code,
                supplierTo: model?.code,
              })}
            </span>
          </div>
        }
      >
        <AdvancedCollapseView
          items={itemCollapses}
          className="content__collapse"
        />
      </Drawer>
    </div>
  );
};

export default DrawerQuoteReview;
