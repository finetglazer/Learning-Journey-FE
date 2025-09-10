import { ColumnProps } from "antd/lib/table";
import { useContext, useMemo } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";

import { EmptyData } from "components";
import {
  UseElectronicInvoice,
  UseElectronicInvoiceFilter,
} from "models/UseElectronicInvoice";
import {
  UseElectronicInvoiceContext,
  UseElectronicInvoiceContextProps,
} from "../UseElectronicInvoiceMaster/UseElectronicInvoiceMasterHook";

import { UserPlusIcon } from "assets/icons";
import styles from "./UseElectronicInvoice.module.scss";

const WIDTH_400 = 400;
enum ColumnKey {
  SELLER_NAME = "sellerName",
  NO = "no",
  DATE = "date",
  TOTAL_AMOUNT = "totalAmount",
  STATUS_E_PRO = "statusEPro",
  CONTRACT_NO = "contractNo",
  PO_NO = "poNo",
  FROM_EMAIL = "fromEmail",
  SUBSTITUTE_PERSON = "substitutePerson",
}

const columnsWidth = {
  sellerName: 300,
  no: 140,
  date: 140,
  totalAmount: 160,
  statusEPro: 140,
  contractNo: 140,
  poNo: 140,
  fromEmail: 200,
  substitutePerson: 200,
  overflowMenu: 40,
};

export const UseElectronicInvoiceTable = () => {
  const {
    loadingList,
    list,
    count,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    dispatchFilter,
    handleLoadList,
    handleChangeSingleSubstitute,
    handleDisplayChangeSubstituteModal,
    navigateToDetail,
    validAction,
  } = useContext<UseElectronicInvoiceContextProps>(UseElectronicInvoiceContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<UseElectronicInvoice>[] = useMemo(
    () => [
      {
        title: translate("UEI.txt_use_electronic_invoice_seller_name"),
        key: ColumnKey.SELLER_NAME,
        dataIndex: ColumnKey.SELLER_NAME,
        sorter: true,
        sortOrder: getAntOrderType<
          UseElectronicInvoice,
          UseElectronicInvoiceFilter
        >(modelFilter, ColumnKey.SELLER_NAME),
        ellipsis: true,
        width: columnsWidth.sellerName,
        render(sellerName: string, { id }) {
          return (
            <LayoutCell>
              <div
                className={`w-full ${styles["invoice-seller-name"]}`}
                onClick={() => navigateToDetail(id)}
              >
                <OneLineText value={sellerName} />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("UEI.txt_use_electronic_invoice_no"),
        key: ColumnKey.NO,
        dataIndex: ColumnKey.NO,
        sorter: true,
        sortOrder: getAntOrderType<
          UseElectronicInvoice,
          UseElectronicInvoiceFilter
        >(modelFilter, ColumnKey.NO),
        ellipsis: true,
        width: columnsWidth.no,
        render(no: string) {
          return (
            <LayoutCell>
              <OneLineText value={no} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("UEI.txt_use_electronic_invoice_date"),
        key: ColumnKey.DATE,
        dataIndex: ColumnKey.DATE,
        sorter: true,
        sortOrder: getAntOrderType<
          UseElectronicInvoice,
          UseElectronicInvoiceFilter
        >(modelFilter, ColumnKey.DATE),
        ellipsis: true,
        width: columnsWidth.date,
        render(date: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(date, STANDARD_DATE_FORMAT_SLASH)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className={`${styles["title-wrapper"]}`}>
            {translate("UEI.txt_use_electronic_invoice_total_amount")}
            <span className={styles["sub-title"]}>VND</span>
          </div>
        ),
        key: ColumnKey.TOTAL_AMOUNT,
        dataIndex: ColumnKey.TOTAL_AMOUNT,
        sorter: true,
        sortOrder: getAntOrderType<
          UseElectronicInvoice,
          UseElectronicInvoiceFilter
        >(modelFilter, ColumnKey.TOTAL_AMOUNT),
        ellipsis: true,
        width: columnsWidth.totalAmount,
        render(totalAmount: string) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(totalAmount)} />
            </LayoutCell>
          );
        },
      },
      // {
      //   title: translate("UEI.txt_use_electronic_invoice_status_e_pro"),
      //   key: ColumnKey.STATUS_E_PRO,
      //   dataIndex: ColumnKey.STATUS_E_PRO,
      //   sorter: true,
      //   sortOrder: getAntOrderType<
      //     UseElectronicInvoice,
      //     UseElectronicInvoiceFilter
      //   >(modelFilter, ColumnKey.STATUS_E_PRO),
      //   ellipsis: true,
      //   width: columnsWidth.statusEPro,
      //   render(statusEPro: number) {
      //     const item = listStatusEPro.find(
      //       (statusType) => statusType.id === statusEPro
      //     );

      //     return (
      //       <LayoutCell>
      //         {item && (
      //           <Tag
      //             size="md"
      //             value={item?.name}
      //             status={item?.code}
      //             isShowDot={false}
      //             isShowBorder
      //           />
      //         )}
      //       </LayoutCell>
      //     );
      //   },
      // },
      // {
      //   title: translate("UEI.txt_use_electronic_invoice_status_contract_no"),
      //   key: ColumnKey.CONTRACT_NO,
      //   dataIndex: ColumnKey.CONTRACT_NO,
      //   sorter: true,
      //   sortOrder: getAntOrderType<
      //     UseElectronicInvoice,
      //     UseElectronicInvoiceFilter
      //   >(modelFilter, ColumnKey.CONTRACT_NO),
      //   ellipsis: true,
      //   width: columnsWidth.no,
      //   render(contractNo: string) {
      //     return (
      //       <LayoutCell>
      //         <OneLineText value={contractNo} />
      //       </LayoutCell>
      //     );
      //   },
      // },
      // {
      //   title: translate("UEI.label_use_electronic_invoice_po_no"),
      //   key: ColumnKey.PO_NO,
      //   dataIndex: ColumnKey.PO_NO,
      //   sorter: true,
      //   sortOrder: getAntOrderType<
      //     UseElectronicInvoice,
      //     UseElectronicInvoiceFilter
      //   >(modelFilter, ColumnKey.PO_NO),
      //   ellipsis: true,
      //   width: columnsWidth.no,
      //   render(poNo: string) {
      //     return (
      //       <LayoutCell>
      //         <OneLineText value={poNo} />
      //       </LayoutCell>
      //     );
      //   },
      // },
      {
        title: translate("UEI.txt_use_electronic_invoice_status_from_email"),
        key: ColumnKey.FROM_EMAIL,
        dataIndex: ColumnKey.FROM_EMAIL,
        sorter: true,
        sortOrder: getAntOrderType<
          UseElectronicInvoice,
          UseElectronicInvoiceFilter
        >(modelFilter, ColumnKey.FROM_EMAIL),
        ellipsis: true,
        width: columnsWidth.fromEmail,
        render(fromEmail: string) {
          return (
            <LayoutCell>
              <OneLineText value={fromEmail} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate(
          "UEI.txt_use_electronic_invoice_status_substitute_person"
        ),
        key: ColumnKey.SUBSTITUTE_PERSON,
        dataIndex: ColumnKey.SUBSTITUTE_PERSON,
        sorter: true,
        sortOrder: getAntOrderType<
          UseElectronicInvoice,
          UseElectronicInvoiceFilter
        >(modelFilter, ColumnKey.SUBSTITUTE_PERSON),
        ellipsis: true,
        width: columnsWidth.substitutePerson,
        render(substitutePerson: string) {
          return (
            <LayoutCell>
              <OneLineText value={substitutePerson} />
            </LayoutCell>
          );
        },
      },

      // Overflow menu container
      {
        title: "",
        width: columnsWidth.overflowMenu,
        fixed: "right",
        render(_, row: UseElectronicInvoice) {
          return (
            <LayoutCell>
              {validAction("UPDATE") && (
                <button
                  className={styles["change-substitute-person"]}
                  onClick={() => handleChangeSingleSubstitute(row?.id)}
                >
                  <img src={UserPlusIcon} alt="plus user" />
                </button>
              )}
            </LayoutCell>
          );
        },
      },
    ],
    [
      translate,
      modelFilter,
      navigateToDetail,
      validAction,
      handleChangeSingleSubstitute,
    ]
  );

  return (
    <>
      {/* Action control */}
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={handleDisplayChangeSubstituteModal}
        >
          {translate("UEI.txt_change_substitute_person")}
        </Button>
      </ActionBarComponent>

      <div className="page-master__table">
        {/* Table */}
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          rowSelection={validAction("UPDATE") ? rowSelection : null}
          scroll={{ y: "calc(100vh - 326px)" }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
              />
            ),
          }}
          onChange={handleTableChange}
        />
        {/* Pagination */}
        <Pagination
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={count}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          onChange={handlePagination}
        />
      </div>
    </>
  );
};
