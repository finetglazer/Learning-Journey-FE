import { isEmpty, lte } from "lodash";

import { EmptyData, LayoutMaster, PageHeader } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";
import { Button } from "react-components-design-system";
import { LegalEntityAction } from "../Components/LegalEntityAction";
import { LegalEntityTable } from "../Components/LegalEntityTable";
import {
  ConfirmModalType,
  LegalEntityContext,
  useLegalEntityMasterHook,
} from "./LegalEntityMasterHooks";

export const LegalEntityMaster = () => {
  const {
    translate,
    breadcrumb,
    modalType,
    isLoadingModal,
    handleDeleteRecord,
    ...contextValue
  } = useLegalEntityMasterHook();
  const { validAction } = contextValue;
  const isEmptyData = () => {
    if (isEmpty(contextValue?.modelFilter?.search)) {
      return (
        isEmpty(contextValue?.list) &&
        lte(contextValue?.countFilter, numberConstants.ZERO)
      );
    }

    return false;
  };

  return (
    <LegalEntityContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_catalog_legal_entity")}
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
                onClick={contextValue.handlePressAdd}
              >
                {translate("BG.btn_add")}
              </Button>
            )}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <LegalEntityAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <LegalEntityTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>

      {/* Confirm delete modal */}
      {modalType.type === ConfirmModalType.DELETE ? (
        <DeleteRecordModal
          open
          loading={isLoadingModal}
          handleConfirm={handleDeleteRecord}
          handleCancel={() =>
            contextValue.setModalType({
              type: ConfirmModalType.NONE,
              id: undefined,
            })
          }
          title={translate("CG.txt_delete_title")}
          content={translate("CG.txt_delete_content")}
        />
      ) : null}
    </LegalEntityContext.Provider>
  );
};
