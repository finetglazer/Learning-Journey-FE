import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import classNames from "classnames";
import { addNumbers, formatNumber } from "core/helpers/number";
import { get } from "lodash";
import { AccountingEntryModel } from "models/Payment";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import React, { useContext } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";

const AccountingEntriesTable = () => {
  const { model, translate, formatNumberToCurrency } = useContext(
    PaymentDetailHookContext
  );

  const columns: ColumnProps<AccountingEntryModel>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_cn_pgd")}
            </label>
          </div>
        ),
        key: "businessBranchId",
        dataIndex: "businessBranchId",
        render: (_text_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell>
                <label className="amount-title_accounting">
                  {translate("PM.total")}
                </label>
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <OneLineText
                className="data-column"
                useTooltip
                value={`${record?.businessBranchDTO?.code} - ${record?.businessBranchDTO?.name}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_nhcd")}
            </label>
          </div>
        ),
        key: "businessUnitId",
        dataIndex: "businessUnitId",
        render: (_text_, record) => {
          if (record?.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="data-column"
                useTooltip
                value={`${record?.businessUnitDTO?.code} - ${record?.businessUnitDTO?.name}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_tt_pb")}
            </label>
          </div>
        ),
        key: "businessDepartmentId",
        dataIndex: "businessDepartmentId",
        render: (_text_, record) => {
          if (record?.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="data-column"
                useTooltip
                value={`${record?.businessDepartmentDTO?.code} - ${record?.businessDepartmentDTO?.name}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_accounting_account")}
            </label>
          </div>
        ),
        key: "accountEntry",
        dataIndex: "accountEntry",
        render: (_text_, record) => {
          if (record?.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="data-column"
                useTooltip
                value={`${record?.accountEntryDTO?.code} - ${record?.accountEntryDTO?.name}`}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_accounting_interpretation")}
            </label>
          </div>
        ),
        key: "description",
        dataIndex: "description",
        render: (_text_, record) => {
          if (record.isTotal) return null;
          return (
            <LayoutCell>
              <OneLineText
                className="data-column"
                useTooltip
                value={record?.description}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_debit_amount")}
            </label>
          </div>
        ),
        key: "debitAmount",
        dataIndex: "debitAmount",
        sorter: false,
        align: "right",
        width: 160,
        render: (_text_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-title"
                  useTooltip
                  value={formatNumber(
                    model?.paymentDetailInfomation?.journalEntries?.reduce(
                      (total: number, item: { debitAmount: number }) =>
                        addNumbers(total || 0, Number(item?.debitAmount) || 0),
                      0
                    )
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className="data-column"
                useTooltip
                value={formatNumberToCurrency(record?.debitAmount)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_credit_amount")}
            </label>
          </div>
        ),
        key: "creditAmount",
        dataIndex: "creditAmount",
        sorter: false,
        align: "right",
        width: 160,
        render: (_text_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  className="amount-title"
                  useTooltip
                  value={formatNumber(
                    model?.paymentDetailInfomation?.journalEntries?.reduce(
                      (total: number, item: { creditAmount: number }) =>
                        addNumbers(total || 0, Number(item?.creditAmount) || 0),
                      0
                    )
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className="data-column"
                useTooltip
                value={formatNumberToCurrency(record?.creditAmount)}
              />
            </LayoutCell>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model, translate]
  );

  return (
    <div className="page-master__table">
      <StandardTable
        rowKey={"id"}
        columns={columns}
        dataSource={[
          ...get(model, "paymentDetailInfomation.journalEntries", []),
          {
            isTotal: true,
          },
        ]}
        isDragable={true}
        idContainer="table-id"
        rowClassName="payment-row"
        scroll={{ y: 400 }}
        className="payment-custom_row_table"
        locale={{
          emptyText: (
            <EmptyDataCM
              message={translate("CM.txt_search_no_data")}
              isFilter
              icon={IcEmptySearchSvg}
              height={500}
            />
          ),
        }}
      />
    </div>
  );
};

export default AccountingEntriesTable;
