import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import { Dayjs } from "dayjs";
import { LogTrackingFilterModel, LogTrackingModel } from "models/LogTracking";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import {
  LogTrackingContext,
  LogTrackingContextType,
} from "pages/LogTrackingPage/LogTrackingHook";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { DATE_TIME_FORMAT } from "./LogAdvanceFilter";
import "./LogTrackingMasterContent.scss";

const EMPTY_SEARCH_ICON_SIZE = 376;
const TABLE_SCROLL_HEIGHT = "calc(100vh - 332px)";

export enum ETableField {
  TIMESTAMP = "timestamp",
  REQUEST_KEY = "requestKey",
  SERVICE = "service",
  LEVEL = "level",
  ENVIRONMENT = "environment",
  MESSAGE = "message",
}

const LogTrackingTable = () => {
  const {
    translate,
    logList,
    loadingList,
    totalLogs,
    modelFilter,
    dispatchFilter,
    handleLoadList,
  } = useContext<LogTrackingContextType>(LogTrackingContext);

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<LogTrackingModel>[] = useMemo(
    () => [
      {
        title: (
          <OneLineText className="header_table" value="Timestamp" useTooltip />
        ),
        key: ETableField.TIMESTAMP,
        dataIndex: ETableField.TIMESTAMP,
        sorter: true,
        sortOrder: getAntOrderType<LogTrackingModel, LogTrackingFilterModel>(
          modelFilter,
          ETableField.TIMESTAMP
        ),
        ellipsis: true,
        width: 180,
        render: (timestamp: Dayjs) => (
          <LayoutCell>
            <OneLineText
              className="text_table_content_primary"
              value={formatDate(timestamp, DATE_TIME_FORMAT)}
              useTooltip
            />
          </LayoutCell>
        ),
      },
      {
        title: "Request Key",
        key: ETableField.REQUEST_KEY,
        dataIndex: ETableField.REQUEST_KEY,
        ellipsis: true,
        width: 300,
        render: (requestKey: string) => (
          <LayoutCell>
            <OneLineText
              className="text_table_content_primary"
              value={requestKey}
              useTooltip
            />
          </LayoutCell>
        ),
      },
      {
        title: "Service",
        key: ETableField.SERVICE,
        dataIndex: ETableField.SERVICE,
        ellipsis: true,
        render: (service: string) => (
          <LayoutCell>
            <OneLineText
              className="text_table_content_primary"
              value={service}
              useTooltip
            />
          </LayoutCell>
        ),
      },
      {
        title: "Level",
        key: ETableField.LEVEL,
        dataIndex: ETableField.LEVEL,
        ellipsis: true,
        render: (level: string) => (
          <LayoutCell>
            <OneLineText
              className="text_table_content_primary"
              value={level}
              useTooltip
            />
          </LayoutCell>
        ),
      },
      {
        title: (
          <OneLineText
            className="header_table"
            value="Environment"
            useTooltip
          />
        ),
        key: ETableField.ENVIRONMENT,
        dataIndex: ETableField.ENVIRONMENT,
        ellipsis: true,
        render: (environment: string) => (
          <LayoutCell>
            <OneLineText
              className="text_table_content_primary"
              value={environment}
              useTooltip
            />
          </LayoutCell>
        ),
      },
      {
        title: "Message",
        key: ETableField.MESSAGE,
        dataIndex: ETableField.MESSAGE,
        ellipsis: true,
        width: 400,
        render: (message: string) => (
          <LayoutCell>
            <OneLineText
              className="text_table_content_primary"
              value={message}
              useTooltip
            />
          </LayoutCell>
        ),
      },
    ],
    [modelFilter]
  );

  return (
    <div className="page-master__table">
      <StandardTable
        rowKey={"id"}
        columns={columns}
        dataSource={logList}
        isDragable={true}
        loading={loadingList}
        onChange={handleTableChange}
        scroll={{ y: TABLE_SCROLL_HEIGHT }}
        idContainer="table-id"
        locale={{
          emptyText: (
            <EmptyDataCM
              message={translate("CM.txt_search_no_data")}
              isFilter
              icon={IcEmptySearchSvg}
              height={EMPTY_SEARCH_ICON_SIZE}
            />
          ),
        }}
      />
      <div className="page-master__pagination">
        <Pagination
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={totalLogs}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </div>
  );
};

export default LogTrackingTable;
