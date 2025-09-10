import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { ColumnProps } from "antd/lib/table";

import { TABLE_ROW_KEY } from "core/config/consts";

import { WaitingReceipt } from "models/Contract";
import { useWaitForReceiveGoodsTableHook } from "./WaitForReceiveGoodsTableHook";
import WaitForReceiveGoodsModal from "./WaitForReceiveGoodsModal/WaitForReceiveGoodsModal";

enum ColumnKey {
  EMAIL = "email",
  NAME = "name",
  PHONE_NUMBER = "phoneNumber",
  ORGANIZATION_NAME = "organizationName",
  BUSSINESS_BRANCH = "orgBusinessBranchCode",
  BUSSINESS_UNIT = "orgBusinessDepartmentCode",
}

const columnsWidth = {
  email: 320,
  name: 220,
  phoneNumber: 160,
};

const WaitForReceiveGoodsTable = () => {
  const {
    translate,
    waitForReceiveGoodsList,
    handleOpenWaitForReceiveGoodsModal,
  } = useWaitForReceiveGoodsTableHook();

  const waitForReceiveGoodsColumns: ColumnProps<WaitingReceipt>[] = useMemo(
    () => [
      {
        title: translate("CT.receiver_email"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        ellipsis: true,
        width: columnsWidth.email,
        render(_, rowData: WaitingReceipt) {
          return (
            <LayoutCell>
              <div
                onClick={() =>
                  handleOpenWaitForReceiveGoodsModal(rowData?.email)
                }
              >
                <OneLineText
                  className="text-table-content-primary"
                  value={rowData?.email}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.fullname"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render(_, rowData: WaitingReceipt) {
          return (
            <LayoutCell>
              <OneLineText value={rowData?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.phone_number"),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        ellipsis: true,
        width: columnsWidth.phoneNumber,
        render(_, rowData: WaitingReceipt) {
          return (
            <LayoutCell>
              <OneLineText value={rowData?.phoneNumber} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.received_organization"),
        key: ColumnKey.ORGANIZATION_NAME,
        dataIndex: ColumnKey.ORGANIZATION_NAME,
        ellipsis: true,
        render(_, rowData: WaitingReceipt) {
          return (
            <LayoutCell>
              <OneLineText value={rowData?.organizationName} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("CT.branch_office"),
        key: ColumnKey.BUSSINESS_BRANCH,
        dataIndex: ColumnKey.BUSSINESS_BRANCH,
        ellipsis: true,
        render(_, rowData: WaitingReceipt) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${rowData?.orgBusinessBranchCode} - ${rowData?.orgBusinessBranchName}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.specialized_bank"),
        key: ColumnKey.BUSSINESS_UNIT,
        dataIndex: ColumnKey.BUSSINESS_UNIT,
        ellipsis: true,
        render(_, rowData: WaitingReceipt) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${rowData?.orgBusinessUnitCode} - ${rowData?.orgBusinessUnitName}`}
              />
            </LayoutCell>
          );
        },
      },
    ],
    [handleOpenWaitForReceiveGoodsModal, translate]
  );

  return (
    <>
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        isDragable
        columns={waitForReceiveGoodsColumns}
        dataSource={waitForReceiveGoodsList}
        scroll={{ y: "calc(100vh - 640px)" }}
      />
      <WaitForReceiveGoodsModal />
    </>
  );
};

export default WaitForReceiveGoodsTable;
