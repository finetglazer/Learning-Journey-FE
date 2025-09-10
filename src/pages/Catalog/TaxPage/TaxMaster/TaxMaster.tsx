import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { Button } from "react-components-design-system";
import { TaxMasterAction } from "./TaxMasterAction";
import { TaxMasterContext, useTaxMasterHooks } from "./TaxMasterHook";
import { TaxMasterTable } from "./TaxMasterTable";

import { financialInformationManagementBreadcrumb } from "pages/Catalog/constants";
import TaxDetail from "../TaxDetail/TaxDetail";
import TaxPreview from "../TaxPreview/TaxPreview";
import { TaxModalDelete } from "./ModalDelete/TaxModalDelete";

export const TaxMaster = () => {
  const { translate, ...context } = useTaxMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("taxs.title");
    const breadcrumbs = [
      ...financialInformationManagementBreadcrumb,
      {
        name: translate("taxs.breadcrumbs.tax"),
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
    <TaxMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("taxs.message_empty_data") +
                    translate("taxs.let_add_new")
                  }`
                : translate("taxs.message_empty_data")
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
              <TaxMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <TaxMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <TaxDetail />
      <TaxModalDelete />
      <TaxPreview />
    </TaxMasterContext.Provider>
  );
};
