import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { organizationManagementBaseBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import BusinessBranchDetail from "../BusinessBranchDetail/BusinessBranchDetail";
import BusinessBranchPreview from "../BusinessBranchPreview/BusinessBranchPreview";
import { BusinessBranchMasterAction } from "./BusinessBranchMasterAction";
import {
  BusinessBranchMasterContext,
  useBusinessBranchMasterHooks,
} from "./BusinessBranchMasterHook";
import { BusinessBranchMasterTable } from "./BusinessBranchMasterTable";
import { BusinessBranchModalDelete } from "./ModalDelete/BusinessBranchModalDelete";

export const BusinessBranchMaster = () => {
  const { translate, ...context } = useBusinessBranchMasterHooks();

  const { validAction } = context;

  const _renderPageHeader = () => {
    const title = translate("businessBranchs.title");
    const breadcrumbs = [
      ...organizationManagementBaseBreadcrumb,
      {
        name: translate("businessBranchs.breadcrumbs.businessBranch"),
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
    <BusinessBranchMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("businessBranchs.message_empty_data") +
                    translate("businessBranchs.let_add_new")
                  }`
                : translate("businessBranchs.message_empty_data")
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
              <BusinessBranchMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <BusinessBranchMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <BusinessBranchDetail />

      <BusinessBranchPreview />
      <BusinessBranchModalDelete />
    </BusinessBranchMasterContext.Provider>
  );
};
