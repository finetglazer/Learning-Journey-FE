import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { organizationManagementBaseBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import BusinessDepartmentDetail from "../BusinessDepartmentDetail/BusinessDepartmentDetail";
import BusinessDepartmentPreview from "../BusinessDepartmentPreview/BusinessDepartmentPreview";
import { BusinessDepartmentMasterAction } from "./BusinessDepartmentMasterAction";
import {
  BusinessDepartmentMasterContext,
  useBusinessDepartmentMasterHooks,
} from "./BusinessDepartmentMasterHook";
import { BusinessDepartmentMasterTable } from "./BusinessDepartmentMasterTable";
import { BusinessDepartmentModalDelete } from "./ModalDelete/BusinessDepartmentModalDelete";

export const BusinessDepartmentMaster = () => {
  const { translate, ...context } = useBusinessDepartmentMasterHooks();

  const { validAction } = context;

  const _renderPageHeader = () => {
    const title = translate("businessDepartments.title");
    const breadcrumbs = [
      ...organizationManagementBaseBreadcrumb,
      {
        name: translate("businessDepartments.breadcrumbs.businessDepartment"),
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
    <BusinessDepartmentMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("businessDepartments.message_empty_data") +
                    translate("businessDepartments.let_add_new")
                  }`
                : translate("businessDepartments.message_empty_data")
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
              <BusinessDepartmentMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <BusinessDepartmentMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <BusinessDepartmentDetail />
      <BusinessDepartmentModalDelete />
      <BusinessDepartmentPreview />
    </BusinessDepartmentMasterContext.Provider>
  );
};
