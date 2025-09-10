import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { Button } from "react-components-design-system";
import { ContractTermMasterAction } from "./ContractTermMasterAction";
import {
  ContractTermMasterContext,
  useContractTermMasterHooks,
} from "./ContractTermMasterHook";
import { ContractTermMasterTable } from "./ContractTermMasterTable";

import { contractManagementBreadcrumb } from "pages/Catalog/constants";
import ContractTermDetail from "../ContractTermDetail/ContractTermDetail";
import ContractTermPreview from "../ContractTermPreview/ContractTermPreview";
import { ContractTermModalDelete } from "./ModalDelete/ContractTermModalDelete";

export const ContractTermMaster = () => {
  const { translate, ...context } = useContractTermMasterHooks();
  const { validAction } = context;
  const _renderPageHeader = () => {
    const title = translate("contractTerms.title");
    const breadcrumbs = [
      ...contractManagementBreadcrumb,
      {
        name: translate("contractTerms.breadcrumbs.contractTerm"),
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
    <ContractTermMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("contractTerms.message_empty_data") +
                    translate("contractTerms.let_add_new")
                  }`
                : translate("contractTerms.message_empty_data")
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
              <ContractTermMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <ContractTermMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <ContractTermDetail />
      <ContractTermModalDelete />
      <ContractTermPreview />
    </ContractTermMasterContext.Provider>
  );
};
