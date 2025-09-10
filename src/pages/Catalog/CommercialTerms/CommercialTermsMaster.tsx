import { isEmpty, isEqual, isUndefined, lte } from "lodash";

import { EmptyData, LayoutMaster, PageHeader } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { Button } from "react-components-design-system";
import { DeleteRecordModal } from "../DeleteRecord/DeleteRecordModal";
import { CommercialTermsDetail } from "./CommercialTermsDetail/CommercialTermsDetail";
import {
  CommercialTermsContext,
  ConfirmModalType,
  useCommercialTermsMasterHook,
} from "./CommercialTermsMasterHooks";
import { CommercialTermsView } from "./CommercialTermsView/CommercialTermsView";
import { CommercialTermsAction } from "./Components/CommercialTermsAction";
import { CommercialTermsTable } from "./Components/CommercialTermsTable";

export const CommercialTermsMaster = () => {
  const {
    translate,
    breadcrumb,
    modalType,
    isLoadingModal,
    handleDeleteRecord,
    ...contextValue
  } = useCommercialTermsMasterHook();
  const isEmptyData = () => {
    if (isEmpty(contextValue?.modelFilter?.search)) {
      return (
        isEmpty(contextValue?.list) &&
        lte(contextValue?.countFilter, numberConstants.ZERO)
      );
    }

    return false;
  };

  const handleAddNew = () =>
    contextValue.setModalType({ type: ConfirmModalType.CREATE });

  return (
    <CommercialTermsContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_catalog_commercial_terms")}
          breadcrumbs={breadcrumb}
          hasTabs={false}
        />

        {isEmptyData() ? (
          <EmptyData message={translate("CM.message_empty_data")}>
            <Button
              iconPlace="right"
              type="primary"
              size="lg"
              onClick={handleAddNew}
            >
              {translate("BG.btn_add")}
            </Button>
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <CommercialTermsAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <CommercialTermsTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>

      {/* View Modal */}
      {modalType.type === ConfirmModalType.DETAIL ? (
        <CommercialTermsView
          commercialTermsId={modalType.id}
          dismiss={() =>
            contextValue.setModalType({
              type: ConfirmModalType.NONE,
              id: undefined,
            })
          }
        />
      ) : null}

      {/* Detail Modal */}
      {modalType.type === ConfirmModalType.CREATE ||
      modalType.type === ConfirmModalType.EDIT ? (
        <CommercialTermsDetail
          commercialTermsId={modalType?.id}
          dismiss={(shouldReloadList?: boolean) => {
            if (
              !isUndefined(shouldReloadList) &&
              isEqual(shouldReloadList, true)
            ) {
              contextValue.handleLoadList();
            }
            contextValue.setModalType({
              type: ConfirmModalType.NONE,
              id: undefined,
            });
          }}
        />
      ) : null}

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
          title={translate("CCT.txt_delete_title")}
          content={translate("CCT.txt_delete_content")}
        />
      ) : null}
    </CommercialTermsContext.Provider>
  );
};
