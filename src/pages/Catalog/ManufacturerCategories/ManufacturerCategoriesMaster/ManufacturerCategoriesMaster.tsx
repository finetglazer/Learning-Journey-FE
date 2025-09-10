import { Button } from "react-components-design-system";
import { isEqual, isUndefined } from "lodash";

import {
  useManufacturerCategoriesMasterHook,
  ManufacturerCategoriesContext,
} from "./ManufacturerCategoriesMasterHook";

import { LayoutMaster, PageHeader, EmptyData } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { ManufacturerCategoriesAction } from "../Components/ManufacturerCategoriesAction";
import { ManufacturerCategoriesTable } from "../Components/ManufacturerCategoriesTable";
import { ManufacturerCategoriesDetail } from "../ManufacturerCategoriesDetail/ManufacturerCategoriesDetail";
import ManufacturerCategoriesView from "../ManufacturerCategoriesView/ManufacturerCategoriesView";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";

export const ManufacturerCategoriesMaster = () => {
  const {
    translate,
    breadcrumb,
    modalType,
    isLoadingModal,
    handleDeleteRecord,
    isEmptyData,
    ...contextValue
  } = useManufacturerCategoriesMasterHook();
  const { validAction } = contextValue;
  return (
    <ManufacturerCategoriesContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_catalog_manufacturer_categories")}
          breadcrumbs={breadcrumb}
          hasTabs={false}
        />

        {isEmptyData() ? (
          <EmptyData
            message={
              validAction("CREATE")
                ? `${
                    translate("CM.message_empty_data") +
                    translate("CM.let_add_new")
                  }`
                : translate("CM.message_empty_data")
            }
          >
            {validAction("CREATE") && (
              <Button
                iconPlace="right"
                type="primary"
                size="lg"
                onClick={contextValue.handleAddNew}
              >
                {translate("BG.btn_add")}
              </Button>
            )}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <ManufacturerCategoriesAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <ManufacturerCategoriesTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>

      {/* View Modal */}
      {modalType.type === "DETAIL" ? (
        <ManufacturerCategoriesView
          manufacturerCategoryId={modalType.id}
          dismiss={() => contextValue.handleCloseModal()}
        />
      ) : null}

      {/* Detail Modal */}
      {modalType.type === "CREATE" || modalType.type === "EDIT" ? (
        <ManufacturerCategoriesDetail
          manufacturerCategoryId={modalType?.id}
          dismiss={(shouldReloadList?: boolean) => {
            if (
              !isUndefined(shouldReloadList) &&
              isEqual(shouldReloadList, true)
            ) {
              contextValue.handleLoadList();
            }
            contextValue.handleCloseModal();
          }}
        />
      ) : null}

      {/* Confirm delete modal */}
      {modalType.type === "DELETE" ? (
        <DeleteRecordModal
          open
          loading={isLoadingModal}
          title={translate("MC.txt_delete_title")}
          content={translate("MC.txt_delete_content")}
          handleConfirm={handleDeleteRecord}
          handleCancel={() => contextValue.handleCloseModal()}
        />
      ) : null}
    </ManufacturerCategoriesContext.Provider>
  );
};
