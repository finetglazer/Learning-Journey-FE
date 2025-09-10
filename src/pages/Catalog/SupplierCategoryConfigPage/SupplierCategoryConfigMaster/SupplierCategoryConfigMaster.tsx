import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { supplierManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import { SupplierCategoryConfigModalDelete } from "./ModalDelete/SupplierCategoryConfigModalDelete";
import { SupplierCategoryConfigMasterAction } from "./SupplierCategoryConfigMasterAction";
import {
  SupplierCategoryConfigMasterContext,
  useSupplierCategoryConfigMasterHooks,
} from "./SupplierCategoryConfigMasterHook";
import { SupplierCategoryConfigMasterTable } from "./SupplierCategoryConfigMasterTable";
import SupplierCategoryConfigDetail from "../SupplierCategoryConfigDetail/SupplierCategoryConfigDetail";
import SupplierCategoryConfigPreview from "../SupplierCategoryConfigReview/SupplierCategoryConfigPreview";

export const SupplierCategoryConfigMaster = () => {
  const { translate, ...context } = useSupplierCategoryConfigMasterHooks();

  const { validAction } = context;

  const _renderPageHeader = () => {
    const title = translate("supplierCategoryConfigs.title");
    const breadcrumbs = [
      ...supplierManagementBreadcrumb,
      {
        name: translate(
          "supplierCategoryConfigs.breadcrumbs.supplierCategoryConfig"
        ),
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
    <SupplierCategoryConfigMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("supplierCategoryConfigs.message_empty_data") +
                    translate("supplierCategoryConfigs.let_add_new")
                  }`
                : translate("supplierCategoryConfigs.message_empty_data")
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
              <SupplierCategoryConfigMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <SupplierCategoryConfigMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <SupplierCategoryConfigDetail />
      <SupplierCategoryConfigModalDelete />
      <SupplierCategoryConfigPreview />
    </SupplierCategoryConfigMasterContext.Provider>
  );
};
