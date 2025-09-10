import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";
import { supplierManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import { SupplierEvaluationConfigModalDelete } from "./ModalDelete/SupplierEvaluationConfigDelete";
import { SupplierEvaluationConfigMasterAction } from "./SupplierEvaluationConfigMasterAction";
import {
  SupplierEvaluationConfigMasterContext,
  useSupplierEvaluationConfigMasterHooks,
} from "./SupplierEvaluationConfigMasterHook";
import { SupplierEvaluationConfigMasterTable } from "./SupplierEvaluationConfigMasterTable";

export const SupplierEvaluationConfigMaster = () => {
  const { translate, ...context } = useSupplierEvaluationConfigMasterHooks();

  const { validAction } = context;

  const _renderPageHeader = () => {
    const title = translate("supplierEvaluationConfigs.title");
    const breadcrumbs = [
      ...supplierManagementBreadcrumb,
      {
        name: translate(
          "supplierEvaluationConfigs.breadcrumbs.supplierEvaluationConfig"
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
    <SupplierEvaluationConfigMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("supplierEvaluationConfigs.message_empty_data") +
                    translate("supplierEvaluationConfigs.let_add_new")
                  }`
                : translate("supplierEvaluationConfigs.message_empty_data")
            }
          >
            {validAction("CREATE") && (
              <Button
                iconPlace="right"
                type="primary"
                size="lg"
                onClick={() => context.handleGoDetail()}
              >
                {translate("CM.btn_add")}
              </Button>
            )}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <SupplierEvaluationConfigMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <SupplierEvaluationConfigMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <SupplierEvaluationConfigModalDelete />
    </SupplierEvaluationConfigMasterContext.Provider>
  );
};
