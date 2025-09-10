import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { Button } from "react-components-design-system";
import { CurrencyMasterAction } from "./CurrencyMasterAction";
import {
  CurrencyMasterContext,
  useCurrencyMasterHooks,
} from "./CurrencyMasterHook";
import { CurrencyMasterTable } from "./CurrencyMasterTable";

import { financialInformationManagementBreadcrumb } from "pages/Catalog/constants";
import CurrencyDetail from "../CurrencyDetail/CurrencyDetail";
import CurrencyPreview from "../CurrencyPreview/CurrencyPreview";
import { CurrencyModalDelete } from "./ModalDelete/CurrencyModalDelete";

export const CurrencyMaster = () => {
  const { translate, ...context } = useCurrencyMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("currencies.title");
    const breadcrumbs = [
      ...financialInformationManagementBreadcrumb,
      {
        name: translate("currencies.breadcrumbs.currency"),
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
    <CurrencyMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("currencies.message_empty_data") +
                    translate("currencies.let_add_new")
                  }`
                : translate("currencies.message_empty_data")
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
              <CurrencyMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <CurrencyMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <CurrencyDetail />
      <CurrencyModalDelete />
      <CurrencyPreview />
    </CurrencyMasterContext.Provider>
  );
};
