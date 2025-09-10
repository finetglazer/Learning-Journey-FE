import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { financialInformationManagementBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import BankDetail from "../BankDetail/BankDetail";
import BankPreview from "../BankPreview/BankPreview";
import { BankMasterAction } from "./BankMasterAction";
import { BankMasterContext, useBankMasterHooks } from "./BankMasterHook";
import { BankMasterTable } from "./BankMasterTable";
import { BankModalDelete } from "./ModalDelete/BankModalDelete";

export const BankMaster = () => {
  const { translate, ...context } = useBankMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("banks.title");
    const breadcrumbs = [
      ...financialInformationManagementBreadcrumb,
      {
        name: translate("banks.breadcrumbs.bank"),
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
    <BankMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("banks.message_empty_data") +
                    translate("banks.let_add_new")
                  }`
                : translate("banks.message_empty_data")
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
              <BankMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <BankMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <BankDetail />
      <BankModalDelete />
      <BankPreview />
    </BankMasterContext.Provider>
  );
};
