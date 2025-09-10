import type { TableColumnsType } from "antd";
import { ArrowSquareOutIcon, IcEmptySearchSvg } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  TABLE_ROW_KEY,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { isEmpty } from "lodash";
import {
  Button,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import useReport from "../hooks/useReport";
import styles from "./ResultReport.module.scss";
import { LoadingCM } from "components";
import { useEffect, useState } from "react";

interface ResultReportProps<T>
  extends Pick<
    ReturnType<typeof useReport>,
    "loadingList" | "modelFilter" | "isShowResult"
  > {
  columns: TableColumnsType<T>;
  dataSource: T[];
  bordered?: boolean;
  total: number;
  isShowUnit?: boolean;
  onExport: () => void;
  loadingExport?: boolean;
  onChangePagination: (pageIndex: number, pageSize: number) => void;
  isEmptyError?: boolean;
}

export default function ResultReport<T>({
  columns,
  bordered,
  total,
  loadingList,
  dataSource,
  modelFilter,
  isShowResult,
  isShowUnit,
  onExport,
  onChangePagination,
  loadingExport,
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
            {!isEmpty(dataSource) && (
              <Button
                loading={loadingExport}
                type="secondary"
                iconPlace="left"
                icon={
                  <img src={ArrowSquareOutIcon} alt="" height={16} width={16} />
                }
                onClick={onExport}
              >
                {translate("report.txt_export")}
              </Button>
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
                columns={columns}
                dataSource={dataSource}
                scroll={{ y: "428px" }}
                tableLayout="fixed"
                bordered={bordered}
              />
              <div className="page-master__pagination pb-4">
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
