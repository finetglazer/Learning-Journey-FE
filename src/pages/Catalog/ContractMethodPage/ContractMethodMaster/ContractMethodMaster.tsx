import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { Button } from "react-components-design-system";
import { ContractMethodMasterAction } from "./ContractMethodMasterAction";
import {
  ContractMethodMasterContext,
  useContractMethodMasterHooks,
} from "./ContractMethodMasterHook";
import { ContractMethodMasterTable } from "./ContractMethodMasterTable";

import { contractManagementBreadcrumb } from "pages/Catalog/constants";
import ContractMethodDetail from "../ContractMethodDetail/ContractMethodDetail";
import ContractMethodPreview from "../ContractMethodPreview/ContractMethodPreview";
import { ContractMethodModalDelete } from "./ModalDelete/ContractMethodModalDelete";

export const ContractMethodMaster = () => {
  const { translate, ...context } = useContractMethodMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("contractMethods.title");
    const breadcrumbs = [
      ...contractManagementBreadcrumb,
      {
        name: translate("contractMethods.breadcrumbs.contractMethod"),
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
    <ContractMethodMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("contractMethods.message_empty_data") +
                    translate("contractMethods.let_add_new")
                  }`
                : translate("contractMethods.message_empty_data")
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
              <ContractMethodMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <ContractMethodMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <ContractMethodDetail />
      <ContractMethodModalDelete />
      <ContractMethodPreview />
    </ContractMethodMasterContext.Provider>
  );
};
