import { ColumnProps } from "antd/lib/table";
import { TABLE_ROW_KEY } from "core/config/consts";
import { isEqual } from "lodash";
import { useAcceptanceDetailContext } from "pages/PurchasePage/Acceptance/AcceptanceDetail/AcceptanceDetailContext";
import { useAcceptanceViewContext } from "pages/PurchasePage/Acceptance/AcceptanceView/AcceptanceViewContext";
import { useAcceptanceActions } from "pages/PurchasePage/Acceptance/Components/hooks/useAcceptanceActions";
import { useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "./SummarySupplier.module.scss";
import { RECEIVING_GOODS_DETAIL_ROUTE } from "config/route-const";

enum ColumnKey {
  CODE_RECEIVED = "code",
  CONSIGNEE = "consignee",
  DEPARTMENT_RECEIVED = "receiptOrganization",
  TRANSACTION_RECEIVED = "businessUnitCode",
  BLOCK_RECEIVED = "businessUnitCode",
  SUMMARY_RECEIVED = "supplierEvaluationConclusion",
}

const columnsWidth = {
  codeReceived: 120,
  departmentReceived: 200,
  transactionReceived: 200,
  summaryReceived: 250,
};
const SummarySupplier = () => {
  const [translate] = useTranslation();

  // list data of the received information section
  const { model } = useAcceptanceDetailContext();
  const { model: modelView } = useAcceptanceViewContext();
  const { state } = useAcceptanceActions();

  const dataSource =
    isEqual(state, "EDIT") || isEqual(state, "CREATE")
      ? model?.goodsReceiptRequests
      : modelView?.goodsReceiptRequests;

  const makeTitle = (key: string) => (
    <div className="p-b--xs">{translate(key)}</div>
  );

  const receiptId =
    model?.goodsReceiptRequests?.map((item) => item?.id).filter(Boolean)?.[0] ||
    modelView?.goodsReceiptRequests
      ?.map((item) => item?.id)
      .filter(Boolean)?.[0];

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        title: makeTitle("RG.tab_label_code_received"),
        key: ColumnKey.CODE_RECEIVED,
        dataIndex: ColumnKey.CODE_RECEIVED,
        ellipsis: true,
        width: columnsWidth.codeReceived,
        render(code: string) {
          return (
            <LayoutCell>
              <Link
                target="_blank"
                className="hyperlink"
                to={`${RECEIVING_GOODS_DETAIL_ROUTE}/${receiptId}`}
              >
                <OneLineText
                  className="text-table-content-primary"
                  value={code}
                />
              </Link>
            </LayoutCell>
          );
        },
      },
      {
        title: makeTitle("RG.txt_received_by"),
        key: ColumnKey.CONSIGNEE,
        dataIndex: ColumnKey.CONSIGNEE,
        ellipsis: true,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${record?.receiptPerson} - ${record?.receiptPersonName}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: makeTitle("RG.txt_consignee"),
        key: ColumnKey.DEPARTMENT_RECEIVED,
        dataIndex: ColumnKey.DEPARTMENT_RECEIVED,
        width: columnsWidth.departmentReceived,
        ellipsis: true,
        render(receiptDepartmentName: string) {
          return (
            <LayoutCell>
              <OneLineText value={receiptDepartmentName} />
            </LayoutCell>
          );
        },
      },
      {
        title: makeTitle("AC.txt_transaction_received_goods"),
        key: ColumnKey.TRANSACTION_RECEIVED,
        dataIndex: ColumnKey.TRANSACTION_RECEIVED,
        width: columnsWidth.transactionReceived,
        ellipsis: true,
        render(_, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${record?.businessBranchCode} - ${record?.businessBranchName}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: makeTitle("AC.txt_receiving_block"),
        key: ColumnKey.BLOCK_RECEIVED,
        dataIndex: ColumnKey.BLOCK_RECEIVED,
        ellipsis: true,
        render(value: string, record) {
          return (
            <LayoutCell>
              <OneLineText value={`${value} - ${record?.businessUnitName}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: makeTitle("AC.txt_summary_evaluation_supplier"),
        key: ColumnKey.SUMMARY_RECEIVED,
        dataIndex: ColumnKey.SUMMARY_RECEIVED,
        ellipsis: true,
        width: columnsWidth.summaryReceived,
        render(supplierEvaluationConclusion: string) {
          return (
            <LayoutCell>
              <OneLineText value={supplierEvaluationConclusion} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <div className={styles["summary-rating__container"]}>
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: "calc(100vh - 360px)" }}
        isDragable
      />
    </div>
  );
};

export default SummarySupplier;
