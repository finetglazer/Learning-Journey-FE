import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { EXCHANGE_RATE_MASTER_ROUTE } from "config/route-const";
import { isEmpty, lte } from "lodash";

import { financialInformationManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import ExchangeRateDetail from "../ExchangeRateDetail/ExchangeRateDetail";
import ExchangeRatePreview from "../ExchangeRatePreview/ExchangeRatePreview";
import { ExchangeRateMasterAction } from "./ExchangeRateMasterAction";
import {
  ExchangeRateMasterContext,
  useExchangeRateMasterHooks,
} from "./ExchangeRateMasterHook";
import { ExchangeRateMasterTable } from "./ExchangeRateMasterTable";
import { ExchangeRateModalDelete } from "./ModalDelete/ExchangeRateModalDelete";

export const ExchangeRateMaster = () => {
  const { translate, ...context } = useExchangeRateMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("exchangeRates.title");
    const breadcrumbs = [
      ...financialInformationManagementBreadcrumb,
      {
        name: translate("exchangeRates.breadcrumbs.exchangeRate"),
        path: EXCHANGE_RATE_MASTER_ROUTE,
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
    <ExchangeRateMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("exchangeRates.message_empty_data") +
                    translate("exchangeRates.let_add_new")
                  }`
                : translate("exchangeRates.message_empty_data")
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
              <ExchangeRateMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <ExchangeRateMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <ExchangeRateDetail />
      <ExchangeRateModalDelete />
      <ExchangeRatePreview />
    </ExchangeRateMasterContext.Provider>
  );
};
