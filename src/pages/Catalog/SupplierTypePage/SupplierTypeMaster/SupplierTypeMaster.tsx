import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { supplierManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import SupplierTypeDetail from "../SupplierTypeDetail/SupplierDetail";
import SupplierTypePreview from "../SupplierTypeReview/SupplierTypePreview";
import { SupplierTypeModalDelete } from "./ModalDelete/SupplierTypeModalDelete";
import { SupplierTypeMasterAction } from "./SupplierTypeMasterAction";
import {
  SupplierTypeMasterContext,
  useSupplierTypeMasterHooks,
} from "./SupplierTypeMasterHook";
import { SupplierTypeMasterTable } from "./SupplierTypeMasterTable";

export const SupplierTypeMaster = () => {
  const { translate, ...context } = useSupplierTypeMasterHooks();

  const { validAction } = context;

  const _renderPageHeader = () => {
    const title = translate("supplierType.title");
    const breadcrumbs = [
      ...supplierManagementBreadcrumb,
      {
        name: translate("supplierType.breadcrumbs.supplierType"),
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
    <SupplierTypeMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("supplierType.message_empty_data") +
                    translate("supplierType.let_add_new")
                  }`
                : translate("supplierType.message_empty_data")
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
              <SupplierTypeMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <SupplierTypeMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <SupplierTypeDetail />
      <SupplierTypeModalDelete />
      <SupplierTypePreview />
    </SupplierTypeMasterContext.Provider>
  );
};
