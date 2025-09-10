import type { TableColumnsType } from "antd";
import { IcEmptySearchSvg } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  TABLE_ROW_KEY,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { isEmpty } from "lodash";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { LoadingCM } from "components";
import styles from "./ResultReport.module.scss";
import useReport from "../hooks/useReport";
import { formatNumber } from "core/helpers/number";
import { NOT_AVAILABLE } from "config/const";

interface ResultReportProps<T>
  extends Pick<
    ReturnType<typeof useReport>,
    "loadingList" | "modelFilter" | "isShowResult"
  > {
  columns: TableColumnsType<T>;
  dataSource: any;
  bordered?: boolean;
  total: number;
  isShowUnit?: boolean;
  onChangePagination: (pageIndex: number, pageSize: number) => void;
  isEmptyError?: boolean;
}

export default function DetailTableReport<T>({
  columns,
  bordered,
  total,
  loadingList,
  dataSource,
  modelFilter,
  isShowResult,
  isShowUnit,
  onChangePagination,
  isEmptyError = true,
}: ResultReportProps<T>) {
  const [pagination, setPagination] = useState({
    pageIndex: modelFilter?.pageIndex,
    pageSize: modelFilter?.pageSize,
  });

  useEffect(() => {
    setPagination({
      pageIndex: modelFilter?.pageIndex,
      pageSize: modelFilter?.pageSize,
    });
  }, [modelFilter]);

  const [translate] = useTranslation();

  const paginationProps = {
    ...pagination,
    total,
    onChange: onChangePagination,
    pageSizeOptions: DEFAULT_PAGE_SIZE_OPTION,
  };

  const summaryData = columns?.map((col) => {
    if (!("dataIndex" in col)) return;
    const dataIndex = col?.dataIndex as string;

    switch (dataIndex) {
      case "code":
        return (
          <div className="px-2">
            {translate("report.purchase.purchase_plan_detail.table.txt_total")}
          </div>
        );

      case "quantity": {
        const quantityTotal = dataSource?.reduce(
          (acc: number, item: { [key: string]: number }) =>
            acc + (item[dataIndex] || 0),
          0
        );
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(quantityTotal)} />
          </LayoutCell>
        );
      }

      case "taxAmount": {
        const total = dataSource?.reduce(
          (acc: number, item: { [key: string]: number }) =>
            acc + (item[dataIndex] || 0),
          0
        );
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(total)} />
          </LayoutCell>
        );
      }

      case "totalAmount": {
        const total = dataSource?.reduce(
          (acc: number, item: { [key: string]: number }) =>
            acc + (item[dataIndex] || 0),
          0
        );
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(total)} />
          </LayoutCell>
        );
      }

      case "amountBeforeTax": {
        const total = dataSource?.reduce(
          (acc: number, item: { [key: string]: number }) =>
            acc + (item[dataIndex] || 0),
          0
        );
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(total)} />
          </LayoutCell>
        );
      }

      default:
        return undefined;
    }
  });

  return (
    <>
      {isShowResult && (
        <div className={styles["result-report"]}>
          <div className="d-flex justify-content-between align-items-center">
            {isEmptyError && (
              <h6 className={styles["title"]}>
                {translate("report.txt_result")}
              </h6>
            )}
          </div>

          {isEmpty(dataSource) ? (
            <EmptyItemTable
              content={translate("CM.txt_search_no_data")}
              containerClassName="flex-column border-0 bg-white"
              icon={
                <img src={IcEmptySearchSvg} alt="" width={200} height={200} />
              }
            />
          ) : (
            <>
              {isShowUnit && (
                <span className={styles["unit"]}>
                  {translate("report.txt_currency", {
                    currency: VND_CURRENCY_UNIT,
                  })}
                </span>
              )}
              <StandardTable
                className={styles["table"]}
                rowKey={TABLE_ROW_KEY}
                columns={columns?.map((col, index) => ({
                  render: (value, _, rowIndex) => {
                    return rowIndex === 0 ? (
                      <strong>{summaryData[index]}</strong>
                    ) : (
                      <LayoutCell
                        position={
                          [
                            "quantity",
                            "amountBeforeTax",
                            "taxAmount",
                            "numberOfRounds",
                            "totalAmount",
                            "unitPrice",
                          ]?.includes(
                            "dataIndex" in col ? String(col?.dataIndex) : ""
                          )
                            ? "right"
                            : "left"
                        }
                      >
                        <OneLineText
                          value={
                            [
                              "unitPrice",
                              "amountBeforeTax",
                              "taxAmount",
                              "totalAmount",
                            ]?.includes(
                              "dataIndex" in col ? String(col?.dataIndex) : ""
                            )
                              ? formatNumber(value)
                              : value || NOT_AVAILABLE
                          }
                        />
                      </LayoutCell>
                    );
                  },
                  ...col,
                }))}
                scroll={{ x: 425 }}
                dataSource={[{}, ...dataSource]}
                tableLayout="fixed"
                bordered={bordered}
              />
              <div className="page-master__pagination">
                <Pagination {...paginationProps} />
              </div>
            </>
          )}
        </div>
      )}
      {loadingList && <LoadingCM />}
    </>
  );
}
