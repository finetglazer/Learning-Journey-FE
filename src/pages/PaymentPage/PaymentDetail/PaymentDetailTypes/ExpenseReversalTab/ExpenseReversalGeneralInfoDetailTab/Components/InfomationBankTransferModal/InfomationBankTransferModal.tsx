import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { isEqual } from "lodash";
import { DEFAULT_MODAL_TYPE, TransferDetail } from "models/Payment";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";

const MODAL_WIDTH = 1100;
const ITEMS_PER_PAGE = 10;

const InformationBankTransferModal = () => {
  const { model, translate, modal, setModalType } = useContext(
    PaymentDetailHookContext
  );

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(0);
  const startIndex = (pageIndex - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const slicedData =
    model?.paymentDetailInfomation?.paymentInformation?.transferInfos.slice(
      startIndex,
      endIndex
    );
  const [listData, setListData] = useState<TransferDetail[]>();

  useEffect(() => {
    if (slicedData) {
      const data = slicedData.map((item: any, index: number) => {
        return {
          id: index,
          ...item,
        };
      });
      setListData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.paymentDetailInfomation]);

  const handlePagination = (page: number, size: number) => {
    const listData =
      model?.paymentDetailInfomation?.paymentInformation?.transferInfos.slice(
        (page - 1) * size,
        page * size
      );
    const data = listData.map((item: any, index: number) => {
      return {
        id: index,
        ...item,
      };
    });
    setPageSize(size);
    setListData(data);
    setPageIndex(page);
  };

  const columns: ColumnProps<TransferDetail>[] = useMemo(
    () => [
      {
        title: translate("PM.numerical_order"),
        dataIndex: "id",
        key: "id",
        width: "6%",
        render(index) {
          return (
            <LayoutCell>
              <OneLineText value={index + 1} />
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
        width: "130px",
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
          total={listData?.length}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </Modal>
  );
};

export default InformationBankTransferModal;
