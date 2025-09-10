import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { isEqual } from "lodash";
import {
  DEFAULT_MODAL_TYPE,
  PaymentCreateModel,
  TransferDetail,
} from "models/Payment";
import { useContext, useMemo, useState } from "react";
import {
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";

const MODAL_WIDTH = 1100;
const ITEMS_PER_PAGE = 10;

const InformationBankTransferModal = () => {
  const { translate, modal, listInformationTransfer, setModalType } =
    useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(ITEMS_PER_PAGE);

  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const slicedData = listInformationTransfer.slice(startIndex, endIndex);
  const [listData, setListData] = useState<TransferDetail[]>(slicedData);

  const handlePagination = (page: number, size: number) => {
    const newStartIndex = (page - 1) * size;
    const newEndIndex = newStartIndex + size;

    const newListData = listInformationTransfer.slice(
      newStartIndex,
      newEndIndex
    );
    setPageSize(size);
    setListData(newListData);
    setPageIndex(page);
  };

  const columns: ColumnProps<TransferDetail>[] = useMemo(
    () => [
      {
        title: translate("PM.numerical_order"),
        dataIndex: "id",
        key: "id",
        width: 44,
        render(id) {
          return (
            <LayoutCell>
              <OneLineText value={id + 1} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PM.account_number"),
        key: "accountNumber",
        dataIndex: "accountNumber",
        ellipsis: true,
        width: "15%",
        render(accountNumber: string) {
          return (
            <LayoutCell>
              <OneLineText value={accountNumber} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PM.account_name"),
        key: "accountName",
        dataIndex: "accountName",
        width: "16%",
        ellipsis: true,
        render(accountName: string) {
          return (
            <LayoutCell>
              <OneLineText value={accountName} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PM.bank_name"),
        key: "bankName",
        dataIndex: "bankName",
        ellipsis: true,
        render(bankName: string) {
          return (
            <LayoutCell>
              <OneLineText value={bankName} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PM.transfer_content"),
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        render(description: string) {
          return (
            <LayoutCell>
              <OneLineText value={description} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-right">
            <div className="payment-font-14">{translate("PM.amount")}</div>
            <div className="payment-second-line">
              {translate("PM.payment_currency_unit")}
            </div>
          </div>
        ),
        key: "transferAmount",
        dataIndex: "transferAmount",
        ellipsis: true,
        width: 145,
        render(transferAmount: number) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(transferAmount)} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const onDismiss = () => {
    setModalType(DEFAULT_MODAL_TYPE);
    setPageIndex(1);
  };

  return (
    <Modal
      className="payment_bank_transfer_modal"
      title={translate("PM.table_transfer_information")}
      open={isEqual(modal, "OPEN")}
      size={MODAL_WIDTH}
      isShowIconBack={false}
      visibleFooter={false}
      handleCancel={onDismiss}
    >
      <StandardTable
        className="tab__budget"
        rowKey={"id"}
        columns={columns}
        dataSource={listData}
        isDragable={true}
        scroll={{ y: "calc(100vh - 360px)" }}
        idContainer="table-id"
      />
      <div className="page-master__pagination">
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          total={listInformationTransfer?.length}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </Modal>
  );
};

export default InformationBankTransferModal;
