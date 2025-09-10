import type { ColumnProps } from "antd/es/table";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_1000,
  WIDTH_400,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { tableService } from "core/services/page-services/table-service";
import { AcceptancePersonRequest } from "models/Acceptance";
import { GoodsReceiptModel } from "models/Acceptance/GoodsReceipt";
import DeliveryReceiptFilter from "pages/PurchasePage/Acceptance/Components/DeliveryReceiptModal/DeliveryReceiptFilter/DeliveryReceiptFilter";
import { useEffect, useMemo } from "react";
import {
  LayoutCell,
  Modal,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useDeliveryReceiptModalHooks } from "./DeliveryReceiptModalHooks";

enum ColumnsKey {
  CODE = "code",
  RECEIPT_PERSON = "receiptPerson",
  RECEIPT_ORGANIZATION = "receiptOrganization",
  RECEIPT_DEPARTMENT_NAME = "receiptDepartmentName",
  RECEIPT_DATE = "receiptDate",
}

interface DeliveryReceiptModalProps {
  onClose: () => void;
  onSelect: (params: { listSelected: GoodsReceiptModel[] }) => void;
  deliveryReceiptSelected: string[];
  goodItemSelectCurrent?: string[];
  selectedItems?: string[];
}

export const DeliveryReceiptModal = ({
  deliveryReceiptSelected,
  onClose,
  onSelect,
  goodItemSelectCurrent,
  selectedItems,
}: DeliveryReceiptModalProps) => {
  const {
    list,
    count,
    loadingList,
    modelFilter,
    rowSelection,
    translate,
    selectedRowKeys,
    dispatchFilter,
    handleLoadList,
    setSelectedRowKeys,
    handleSelected,
  } = useDeliveryReceiptModalHooks({
    onSelect,
    goodItemSelectCurrent,
    selectedItems,
  });

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  useEffect(() => {
    setSelectedRowKeys([...deliveryReceiptSelected, ...selectedRowKeys]);
  }, [deliveryReceiptSelected, list]);

  const columns: ColumnProps<AcceptancePersonRequest>[] = useMemo(
    () => [
      {
        title: translate("AC.txt_receipt_code"),
        dataIndex: ColumnsKey.CODE,
        key: ColumnsKey.CODE,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_receiver_and_in_charge"),
        key: ColumnsKey.RECEIPT_PERSON,
        dataIndex: ColumnsKey.RECEIPT_PERSON,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_receiving_unit_and_in_charge"),
        key: ColumnsKey.RECEIPT_ORGANIZATION,
        dataIndex: ColumnsKey.RECEIPT_ORGANIZATION,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_branch_received"),
        key: ColumnsKey.RECEIPT_DEPARTMENT_NAME,
        dataIndex: ColumnsKey.RECEIPT_DEPARTMENT_NAME,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_actual_receiving_date"),
        key: ColumnsKey.RECEIPT_DATE,
        dataIndex: ColumnsKey.RECEIPT_DATE,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  value,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, modelFilter]
  );

  return (
    <Modal
      open
      title={translate("AC.txt_select_receiving_note")}
      isShowIconBack={false}
      size={WIDTH_1000}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("CM.txt_select")}
      handleCancel={onClose}
      handleSave={handleSelected}
      closeIcon
    >
      <DeliveryReceiptFilter
        modelFilter={modelFilter}
        dispatchFilter={dispatchFilter}
        handleLoadList={handleLoadList}
      />
      <div className="page-master__table">
        <StandardTable
          loading={loadingList}
          rowKey={TABLE_ROW_KEY}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={list}
          scroll={{ y: WIDTH_400 }}
        />
        <div className="page-master__pagination">
          <Pagination
            pageIndex={modelFilter.pageIndex}
            pageSize={modelFilter.pageSize}
            total={count}
            onChange={handlePagination}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>
      </div>
    </Modal>
  );
};
