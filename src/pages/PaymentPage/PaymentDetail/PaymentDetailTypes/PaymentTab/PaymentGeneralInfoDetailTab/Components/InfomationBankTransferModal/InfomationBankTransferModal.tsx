import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION, numberConstant } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { isEqual } from "lodash";
import { DEFAULT_MODAL_TYPE, TransferDetail } from "models/Payment";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";

const MODAL_WIDTH = 1100;
const ITEMS_PER_PAGE = 10;

const InformationBankTransferModal = () => {
  const { model, translate, modal, setModalType } = useContext(
    PaymentDetailHookContext
  );

  const [pageIndex, setPageIndex] = useState<number>(numberConstant.ONE);
  const [pageSize, setPageSize] = useState<number>(ITEMS_PER_PAGE);

  const transferInfos = useMemo(
    () =>
      model?.paymentDetailInfomation?.paymentInformation?.transferInfos || [],
    [model?.paymentDetailInfomation?.paymentInformation?.transferInfos]
  );

  const total = transferInfos.length;

  const startIndex = (pageIndex - numberConstant.ONE) * pageSize;
  const endIndex = startIndex + pageSize;

  const slicedData = transferInfos.slice(startIndex, endIndex);

  const [listData, setListData] = useState<TransferDetail[]>([]);

  useEffect(() => {
    if (slicedData) {
      const data = slicedData.map((item: any, index: number) => {
        return {
          id: startIndex + index + 1,
          ...item,
        };
      });
      setListData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, transferInfos]);

  const handlePagination = (page: number, size: number) => {
    setPageSize(size);
    setPageIndex(page);
  };

  const columns: ColumnProps<TransferDetail>[] = useMemo(
    () => [
      {
        title: translate("PM.numerical_order"),
        dataIndex: "id",
        key: "id",
        width: 44,
        render(index) {
          return (
            <LayoutCell>
              <OneLineText value={index} />
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
        title: <div className="text-right">{translate("PM.amount")}</div>,
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
          total={total}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </Modal>
  );
};

export default InformationBankTransferModal;
