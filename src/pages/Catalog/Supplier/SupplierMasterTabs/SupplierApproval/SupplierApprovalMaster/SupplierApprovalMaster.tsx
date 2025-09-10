import { LayoutMaster, LoadingCM } from "components";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { SupplierApprovalRejectCommon } from "../../../SupplierDetail/Component/SupplierApprovalModal/SupplierApprovalRejectCommon";
import { SupplierApprovalMasterActions } from "./Components/SupplierApprovalMasterActions";
import { SupplierApprovalMasterTable } from "./Components/SupplierApprovalMasterTable";
import "./SupplierApprovalMaster.scss";
import {
  SupplierApprovalMasterContext,
  useSupplierApprovalMasterHooks,
} from "./SupplierApprovalMasterHooks";

export const SupplierApprovalMasterTab = () => {
  const { modalType, loadingModal, handleReject, ...contextValue } =
    useSupplierApprovalMasterHooks();

  const { loadingList } = contextValue;

  return (
    <>
      <SupplierApprovalMasterContext.Provider value={contextValue}>
        <LayoutMaster>
          <SupplierApprovalMasterActions />
          <LayoutMasterContent>
            <SupplierApprovalMasterTable />
          </LayoutMasterContent>
        </LayoutMaster>
      </SupplierApprovalMasterContext.Provider>
      {modalType.type === "REJECT" ? (
        <SupplierApprovalRejectCommon
          loading={loadingModal}
          errorMessage={modalType?.errorMessage}
          onCancel={() =>
            contextValue.setModalType({ type: "NONE", id: undefined })
          }
          onReject={handleReject}
        />
      ) : null}
      {loadingList ? <LoadingCM /> : null}
    </>
  );
};
