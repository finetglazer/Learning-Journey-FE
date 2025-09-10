import PageHeader from "components/PageHeader/PageHeader";
import {
  ReportTemplateManagementContext,
  useReportTemplateManagementHooks,
} from "pages/SystemAdministration/ReportTemplate/ReportTemplateManagementHook";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { ReportTemplateManagementTable } from "pages/SystemAdministration/ReportTemplate/ReportTemplateMaster/ReportTemplateManagementTable";
import { ReportTemplateManagementAction } from "pages/SystemAdministration/ReportTemplate/ReportTemplateMaster/ReportTemplateManagementAction";
import ReportTemplateDetail from "pages/SystemAdministration/ReportTemplate/ReportTemplateDetail/ReportTemplateDetail";
import ReportTemplatePreview from "pages/SystemAdministration/ReportTemplate/ReportTemplatePreview/ReportTemplatePreview";
import ReportTemplateModalDelete from "pages/SystemAdministration/ReportTemplate/ReportTemplateMaster/ReportTemplateModalDelete";
import { isEmpty, lte } from "lodash";
import { Button } from "react-components-design-system";
import { EmptyData } from "components";

const ReportTemplateManagement = () => {
  const { translate, breadcrumbs, ...context } =
    useReportTemplateManagementHooks();

  function getEmptyData(): boolean {
    if (isEmpty(context?.modelFilter?.search)) {
      return isEmpty(context?.list) && lte(context.countFilter, 0);
    } else {
      return false;
    }
  }

  return (
    <>
      <ReportTemplateManagementContext.Provider value={context}>
        <div className="page-content">
          <PageHeader
            title={translate("CM.menu_title_report_template_management")}
            breadcrumbs={breadcrumbs}
            hasTabs={false}
          />
          {getEmptyData() ? (
            <EmptyData
              message={`${
                translate("ranks.message_empty_data") +
                translate("ranks.let_add_new")
              }`}
            >
              <Button
                iconPlace="right"
                type="primary"
                size="lg"
                onClick={() => context.handleOpenModal(null, "detail")}
              >
                {translate("CM.btn_add")}
              </Button>
            </EmptyData>
          ) : (
            <LayoutMaster>
              <LayoutMasterActions>
                <ReportTemplateManagementAction />
              </LayoutMasterActions>
              <LayoutMasterContent>
                <ReportTemplateManagementTable />
              </LayoutMasterContent>
            </LayoutMaster>
          )}
          <ReportTemplatePreview />
          <ReportTemplateDetail />
          <ReportTemplateModalDelete />
        </div>
      </ReportTemplateManagementContext.Provider>
    </>
  );
};

export default ReportTemplateManagement;
