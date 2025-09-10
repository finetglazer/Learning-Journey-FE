import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { signatureManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import SignatureSupplierDetail from "../SignatureSupplierDetail/SignatureSupplierDetail";
import SignatureSupplierPreview from "../SignatureSupplierPreview/SignatureSupplierPreview";
import { SignatureSupplierModalDelete } from "./ModalDelete/SignatureSupplierModalDelete";
import { SignatureSupplierMasterAction } from "./SignatureSupplierMasterAction";
import {
  SignatureSupplierMasterContext,
  useSignatureSupplierMasterHooks,
} from "./SignatureSupplierMasterHook";
import { SignatureSupplierMasterTable } from "./SignatureSupplierMasterTable";

export const SignatureSupplierMaster = () => {
  const { translate, ...context } = useSignatureSupplierMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("signatureSuppliers.title");
    const breadcrumbs = [
      ...signatureManagementBreadcrumb,
      {
        name: title,
      },
    ];

    return <PageHeader title={title} breadcrumbs={breadcrumbs}></PageHeader>;
  };

  function getEmptyData(): boolean {
    if (isEmpty(context?.modelFilter?.search)) {
      return isEmpty(context?.list) && lte(context.countFilter, 0);
    } else {
      return false;
    }
  }

  return (
    <SignatureSupplierMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("signatureSuppliers.message_empty_data") +
                    translate("signatureSuppliers.let_add_new")
                  }`
                : translate("signatureSuppliers.message_empty_data")
            }
          >
            {validAction("CREATE") && (
              <Button
                iconPlace="right"
                type="primary"
                size="lg"
                onClick={() => context.handleOpenModal(null, "detail")}
              >
                {translate("CM.btn_add")}
              </Button>
            )}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <SignatureSupplierMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <SignatureSupplierMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <SignatureSupplierDetail />
      <SignatureSupplierModalDelete />
      <SignatureSupplierPreview />
    </SignatureSupplierMasterContext.Provider>
  );
};
