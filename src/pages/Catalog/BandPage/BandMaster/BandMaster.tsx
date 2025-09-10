import { EmptyData } from "components";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, lte } from "lodash";

import { organizationManagementBaseBreadcrumb } from "pages/Catalog/constants";
import { Button } from "react-components-design-system";
import BandDetail from "../BandDetail/BandDetail";
import BandPreview from "../BandPreview/BandPreview";
import { BandMasterAction } from "./BandMasterAction";
import { BandMasterContext, useBandMasterHooks } from "./BandMasterHook";
import { BandMasterTable } from "./BandMasterTable";
import { BandModalDelete } from "./ModalDelete/BandModalDelete";

export const BandMaster = () => {
  const { translate, ...context } = useBandMasterHooks();

  const { validAction } = context;

  const _renderPageHeader = () => {
    const title = translate("bands.title");
    const breadcrumbs = [
      ...organizationManagementBaseBreadcrumb,
      {
        name: title,
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
    <BandMasterContext.Provider value={context}>
      <div className="page-content">
        {/* Page Header */}
        {_renderPageHeader()}
        {/* Action */}

        {getEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("bands.message_empty_data") +
                    translate("bands.let_add_new")
                  }`
                : translate("bands.message_empty_data")
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
              <BandMasterAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <BandMasterTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>
      <BandDetail />
      <BandModalDelete />
      <BandPreview />
    </BandMasterContext.Provider>
  );
};
