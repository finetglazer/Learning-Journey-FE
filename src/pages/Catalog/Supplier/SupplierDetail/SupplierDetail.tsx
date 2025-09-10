import {
  SupplierApprovalModal,
  SupplierDetailContext,
  useSupplierDetailHooks,
} from "./SupplierDetailHook";
import { LoadingCM, PageHeader } from "components";
import { Button, Tag } from "react-components-design-system";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { SUPPLIER_MASTER_ROUTE } from "config/route-const";
import { useMemo } from "react";
import "./SupplierDetail.scss";
import CollapseView from "components/Collapse/CollapseView";
import { GeneralInformation } from "./Component/GeneralInformation/GeneralInformation";
import { AddressInformation } from "./Component/AddressInformation/AddressInformation";
import { SupplierContactModal } from "./Component/ContentModal/SupplierContactModal";
import { ContactInformation } from "./Component/ContactInformation/ContactInformation";
import { PaymentInformation } from "./Component/PaymentInformation/PaymentInformation";
import { SupplierPaymentModal } from "./Component/ContentModal/SupplierPaymentModal";
import InformationAuthorization from "./Component/InformationAuthorization/InformationAuthorization";
import ProductCatalog from "./Component/ProductCatalog/ProductCatalog";
import BusinessRegister from "./Component/BusinessRegister/BusinessRegister";
import AttachmentOther from "./Component/AttachmentOther/AttachmentOther";
import { isEqual } from "lodash";
import { SupplierApprovalApprove } from "./Component/SupplierApprovalModal/SupplierApprovalApprove";
import { SupplierApprovalReject } from "./Component/SupplierApprovalModal/SupplierApprovalReject";
import { supplierManagementBreadcrumb } from "pages/Catalog/constants";
import {
  SupplierApprovalStatus,
  SupplierApprovalStatusColor,
  SupplierApprovalStatusI18n,
} from "models/Supplier/Supplier";
import { ApproveIcon, RejectIcon, SaveIcon } from "assets/icons";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

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

export const SupplierDetail = () => {
  const {
    isApprove,
    modal,
    handleActionSupplierApproval,
    existMessage,
    handleCloseModal,
    handleApprove,
    handleReject,
    ...context
  } = useSupplierDetailHooks();

  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_MANAGE_SUPPLIER
  );

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
        label: (
          <>
            {translate("SL.txt_register_business")}{" "}
            <span className="required">*</span>
          </>
        ),
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
    <SupplierDetailContext.Provider value={context}>
      <div className={classNames("page-content supplier-detail")}>
        <PageHeader
          title={
            isApprove ? (
              <>
                <div className="d-flex align-items-center">
                  <span>{translate("SL.supplierSupDetail")}</span>
                  <Tag
                    className="m-l--xs"
                    size="md"
                    value={translate(
                      `SL.status_${
                        SupplierApprovalStatusI18n[
                          SupplierApprovalStatus[
                            context?.model?.manageStatus
                          ] as keyof typeof SupplierApprovalStatusI18n
                        ]
                      }`
                    )}
                    status={
                      SupplierApprovalStatusColor[
                        SupplierApprovalStatus[
                          context?.model?.manageStatus
                        ] as keyof typeof SupplierApprovalStatusColor
                      ]
                    }
                    isShowDot={false}
                    isShowBorder={true}
                  />
                </div>
              </>
            ) : !context.model?.id ? (
              translate("SL.create")
            ) : (
              translate("SL.update")
            )
          }
          breadcrumbs={breadcrumb}
          className="page-header"
          isShowBackButton
        >
          <div className="d-flex">
            {isApprove && isEqual(context?.model?.manageStatus, 1) ? (
              <>
                {(validAction("CREATE") || validAction("UPDATE")) && (
                  <Button
                    type="secondary"
                    size="lg"
                    className="m-r--xs"
                    onClick={() => context.handleSave()}
                    icon={<img src={SaveIcon} alt="img" />}
                    iconPlace="left"
                  >
                    {translate("generalActions.saveDraft")}
                  </Button>
                )}

                <Button
                  className="m-r--xs"
                  type="secondary"
                  size="lg"
                  onClick={() =>
                    handleActionSupplierApproval(SupplierApprovalModal.REJECT)
                  }
                  icon={<img src={RejectIcon} alt="img" />}
                  iconPlace="left"
                >
                  {translate("CM.txt_rejected")}
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    handleActionSupplierApproval(SupplierApprovalModal.APPROVE)
                  }
                  icon={<img src={ApproveIcon} alt="img" />}
                  iconPlace="left"
                >
                  {translate("CM.txt_approve")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="secondary"
                  className="m-r--xs"
                  onClick={() => window.history.back()}
                >
                  {translate("generalActions.close")}
                </Button>

                {(validAction("CREATE") || validAction("UPDATE")) && (
                  <Button
                    type="primary"
                    size="lg"
                    onClick={() => context.handleSave()}
                  >
                    {translate("generalActions.save")}
                  </Button>
                )}
              </>
            )}
          </div>
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
      {context.loading && <LoadingCM />}
      <SupplierContactModal />
      <SupplierPaymentModal />

      {isEqual(modal, SupplierApprovalModal.APPROVE) ? (
        <SupplierApprovalApprove
          onCancel={handleCloseModal}
          onApprove={handleApprove}
          existMessage={existMessage}
        />
      ) : null}
      {isEqual(modal, SupplierApprovalModal.REJECT) ? (
        <SupplierApprovalReject
          onCancel={handleCloseModal}
          onChangeSingleField={context.handleChangeSingleField}
          onReject={handleReject}
          model={context.model}
        />
      ) : null}
    </SupplierDetailContext.Provider>
  );
};
