import classNames from "classnames";
import { PageHeader } from "components";
import CollapseView from "components/Collapse/CollapseView";
import { SUPPLIER_MASTER_ROUTE } from "config/route-const";
import { supplierManagementBreadcrumb } from "pages/Catalog/constants";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AddressInformation } from "./Component/AddressInformation/AddressInformation";
import AttachmentOther from "./Component/AttachmentOther/AttachmentOther";
import BusinessRegister from "./Component/BusinessRegister/BusinessRegister";
import { ContactInformation } from "./Component/ContactInformation/ContactInformation";
import { GeneralInformation } from "./Component/GeneralInformation/GeneralInformation";
import InformationAuthorization from "./Component/InformationAuthorization/InformationAuthorization";
import { PaymentInformation } from "./Component/PaymentInformation/PaymentInformation";
import ProductCatalog from "./Component/ProductCatalog/ProductCatalog";
import "./SupplierView.scss";
import { SupplierViewContext, useSupplierViewHooks } from "./SupplierViewHook";

enum KeyTab {
  GENERAL = "general",
  ADDRESS = "address",
  CONTACT = "contact",
  PAYMENT = "payment",
  AUTHORIZATION = "authorization",
  CATALOG = "catalog",
  REGISTER_BUSINESS = "resgister_business",
  ATTACHMENT_OTHER = "attachment_other",
}

export const SupplierView = () => {
  const { ...context } = useSupplierViewHooks();

  const [translate] = useTranslation();

  const breadcrumb = useMemo(() => {
    return [
      ...supplierManagementBreadcrumb,
      {
        name: translate("CM.menu_title_supplier"),
        path: SUPPLIER_MASTER_ROUTE,
      },
    ];
  }, [translate]);

  const items = useMemo(
    () => [
      {
        key: KeyTab.GENERAL,
        label: translate("SL.tab_general_information"),
        children: <GeneralInformation />,
      },
      {
        key: KeyTab.ADDRESS,
        label: translate("SL.tab_address_information"),
        children: <AddressInformation />,
      },
      {
        key: KeyTab.CONTACT,
        label: translate("SL.tab_contact_information"),
        children: <ContactInformation />,
      },
      {
        key: KeyTab.PAYMENT,
        label: translate("SL.tab_payment_information"),
        children: <PaymentInformation />,
      },
      {
        key: KeyTab.AUTHORIZATION,
        label: translate("SL.txt_authorization_information"),
        children: <InformationAuthorization />,
      },
      {
        key: KeyTab.CATALOG,
        label: translate("SL.tab_product_service_catalog"),
        children: <ProductCatalog />,
      },
      {
        key: KeyTab.REGISTER_BUSINESS,
        label: translate("SL.txt_register_business"),
        children: <BusinessRegister />,
      },
      {
        key: KeyTab.ATTACHMENT_OTHER,
        label: translate("SL.txt_attachment_other"),
        children: <AttachmentOther />,
      },
    ],
    [translate]
  );

  return (
    <SupplierViewContext.Provider value={context}>
      <div className={classNames("page-content supplier-view")}>
        <PageHeader
          title={translate("SL.update")}
          breadcrumbs={breadcrumb}
          isShowBackButton
        >
          {/* <div className="d-flex">
            <>
              <Button
                type="secondary"
                className="m-r--xs"
                onClick={() => window.history.back()}
              >
                {translate("generalActions.close")}
              </Button>
            </>
          </div> */}
        </PageHeader>
        <div className="content-scroll">
          <div className="mx-3">
            <CollapseView
              items={items}
              defaultActiveKey={Object.values(KeyTab)}
              className="collapse__container--not-border"
            />
          </div>
        </div>
      </div>
    </SupplierViewContext.Provider>
  );
};
