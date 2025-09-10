import { Collapse } from "antd";
import { CollapseProps } from "antd/lib";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import { useContext, useMemo } from "react";
import { Drawer } from "react-components-design-system";
import AttachedFileView from "../../../PurchasePlanGenerationInfoTabView/Components/AttachedFileView/AttachedFileView";
import InformationQuote from "./components/InformationQuote/InformationQuote";
import TableCommercialTerms from "./components/InformationQuote/TableCommercialTerms/TableCommercialTerms";
import SupplierInformationTable from "./components/SupplierInformationTable/SupplierQuoteInformationTable";
import TableGuaranteeInformation from "./components/TableGuaranteeInformation/TableGuaranteeInformation";
import TableWarrantyInformation from "./components/TableWarrantyInformation/TableWarrantyInformation";
import "./SupplierQuotationDrawer.scss";

interface Props {
  visible: boolean;
  handleClose?: () => void;
}

enum EGeneralInformationSectionKey {
  SUPPLIER_INFORMATION,
  QUOTE_INFORMATION,
  COMMERCIAL_TERMS,
  GUARANTEE_INFORMATION,
  WARRANTY_INFORMATION,
  ATTACHED_DOCUMENT,
}

const SupplierQuotationDrawer = ({ visible, handleClose }: Props) => {
  const { translate, model } = useContext<PurchasingPlanModel>(
    PurchasingPlanDetailHookContext
  );

  const supplierForm =
    model?.drawerQuotationDetail?.supplierPurchasePlans?.[0]
      ?.quotationRoundDetail?.quotations?.[0]?.code;
  const supplierTo = model?.code;
  const collapseItems: CollapseProps["items"] = useMemo(
    () => [
      {
        key: EGeneralInformationSectionKey.SUPPLIER_INFORMATION,
        label: (
          <div className="invoice-title">
            {translate("PL.drawer_info_supplier")}
          </div>
        ),
        children: (
          <div className="mb-4">
            <SupplierInformationTable
              values={
                model?.drawerQuotationDetail?.supplierPurchasePlans?.[0] || []
              }
            />
          </div>
        ),
      },
      {
        key: EGeneralInformationSectionKey.QUOTE_INFORMATION,
        label: (
          <div className="invoice-title">
            {translate("PL.drawer_information_quote")}
          </div>
        ),
        children: (
          <div className="mb-4">
            <InformationQuote />
          </div>
        ),
      },
      {
        key: EGeneralInformationSectionKey.COMMERCIAL_TERMS,
        label: (
          <div className="invoice-title">
            {translate("PL.drawer_commercial_terms")}
          </div>
        ),
        children: (
          <div className="mb-4">
            <TableCommercialTerms
              values={
                model?.drawerQuotationDetail?.contractPurchasePlan
                  ?.contractTerms || []
              }
            />
          </div>
        ),
      },
      {
        key: EGeneralInformationSectionKey.GUARANTEE_INFORMATION,
        label: (
          <div className="invoice-title">
            {translate("PL.drawer_guarantee_information")}
          </div>
        ),
        children: (
          <div className="mb-4">
            <TableGuaranteeInformation
              values={
                model?.drawerQuotationDetail?.contractPurchasePlan
                  ?.guarantees || []
              }
              currency={
                model?.drawerQuotationDetail?.supplierPurchasePlans?.[0]
                  ?.quotationRoundDetail?.quotations?.[0]?.currency || null
              }
            />
          </div>
        ),
      },
      {
        key: EGeneralInformationSectionKey.WARRANTY_INFORMATION,
        label: (
          <div className="invoice-title">
            {translate("PL.drawer_warranty_information")}
          </div>
        ),
        children: (
          <div className="mb-4">
            <TableWarrantyInformation
              values={
                model?.drawerQuotationDetail?.contractPurchasePlan
                  ?.warranties || []
              }
            />
          </div>
        ),
      },
      {
        key: EGeneralInformationSectionKey.ATTACHED_DOCUMENT,
        label: (
          <div className="invoice-title">
            {translate("PL.drawer_attached_document")}
          </div>
        ),
        children: (
          <div className="mb-4">
            <AttachedFileView
              files={model?.drawerQuotationDetail?.attachments || []}
            />
          </div>
        ),
      },
    ],
    [translate, model]
  );

  return (
    <div className="supplier-quotation">
      <Drawer
        numberButton={"1"}
        visible={visible}
        size={"2xl"}
        loading={false}
        isShowButtonApply={false}
        titleButtonCancel={translate("CM.btn_close")}
        handleCancel={handleClose}
        handleClose={handleClose}
        isHaveCloseIcon={true}
        hasOverlay={false}
        title={
          <div className="fw-bold drawer__header-text_title">
            <span>
              {translate("PL.drawer_quote_title", {
                supplierForm,
                supplierTo,
              })}
            </span>
          </div>
        }
        className="supplier-quotation_drawer"
      >
        <Collapse
          ghost
          items={collapseItems}
          defaultActiveKey={Object.keys(EGeneralInformationSectionKey).map(
            Number
          )}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <div>
              <img
                src={IcArrowDown}
                className={classNames(
                  "invoice-transition",
                  isActive && "invoice-transition_expand"
                )}
                alt={IcArrowDown}
              />
            </div>
          )}
        />
      </Drawer>
    </div>
  );
};

export default SupplierQuotationDrawer;
