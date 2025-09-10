import { isEmpty, isEqual, isUndefined, lte } from "lodash";

import { EmptyData, LayoutMaster, PageHeader } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants } from "core/config/consts";
import { Button } from "react-components-design-system";
import { DeleteRecordModal } from "../DeleteRecord/DeleteRecordModal";
import { GuaranteeTypeAction } from "./Components/GuaranteeTypeAction";
import { GuaranteeTypeTable } from "./Components/GuaranteeTypeTable";
import { GuaranteeTypeDetail } from "./GuaranteeTypeDetail/GuaranteeTypeDetail";
import {
  ConfirmModalType,
  GuaranteeTypeContext,
  useGuaranteeTypeMasterHook,
} from "./GuaranteeTypeMasterHooks";
import { GuaranteeTypeView } from "./GuaranteeTypeView/GuaranteeTypeView";

export const GuaranteeTypeMaster = () => {
  const {
    translate,
    breadcrumb,
    modalType,
    isLoadingModal,
    handleDeleteRecord,
    ...contextValue
  } = useGuaranteeTypeMasterHook();

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

  const handleAddNew = () =>
    contextValue.setModalType({ type: ConfirmModalType.CREATE });

  return (
    <GuaranteeTypeContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_catalog_guarantee_type")}
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
                onClick={handleAddNew}
              >
                {translate("BG.btn_add")}
              </Button>
            )}
          </EmptyData>
        ) : (
          <LayoutMaster>
            <LayoutMasterActions>
              <GuaranteeTypeAction />
            </LayoutMasterActions>
            <LayoutMasterContent>
              <GuaranteeTypeTable />
            </LayoutMasterContent>
          </LayoutMaster>
        )}
      </div>

      {/* View Modal */}
      {modalType.type === ConfirmModalType.DETAIL ? (
        <GuaranteeTypeView
          guaranteeTypeId={modalType.id}
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
        <GuaranteeTypeDetail
          guaranteeTypeId={modalType?.id}
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
          title={translate("GT.txt_delete_title")}
          content={translate("GT.txt_delete_content")}
        />
      ) : null}
    </GuaranteeTypeContext.Provider>
  );
};
