import { ColumnProps } from "antd/lib/table";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_TIME_FORMAT_MM_YYYY,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { tableService } from "core/services/page-services/table-service";
import { ProjectFilter } from "models/Project/ProjectFilter";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ProjectModal.scss";
import { ProjectModalEmptySearchData } from "./ProjectModalEmptySearchData";
import { ProjectBudget, ProjectBudgetContext } from "./ProjectModalHooks";

export const ProjectModalTable = () => {
  const {
    list,
    loadingList,
    rowSelection,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    count,
  } = useContext<ProjectBudget>(ProjectBudgetContext);
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<ProjectFilter>[] = useMemo(
    () => [
      {
        title: translate("BG.table_budget_project_name"),
        key: "name",
        dataIndex: "name",
        sorter: false,
        render(item, row) {
          return (
            <LayoutCell>
              <TwoLineText
                classNameFirstLine="text-first__style"
                classNameSecondLine="text-second__style"
                valueLine1={row?.name}
                valueLine2={row?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("BG.table_budget_nhcd_owner"),
        key: "businessUnit",
        dataIndex: "businessUnit",
        sorter: false,
        render(item) {
          return (
            <LayoutCell>
              <TwoLineText
                classNameFirstLine="text-first__style"
                classNameSecondLine="text-second__style"
                valueLine1={item?.name}
                valueLine2={item?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("BG.table_budget_cn_pgd_owner"),
        key: "businessBranch",
        dataIndex: "businessBranch",
        sorter: false,
        render(item) {
          return (
            <LayoutCell>
              <TwoLineText
                classNameFirstLine="text-first__style"
                classNameSecondLine="text-second__style"
                valueLine1={item?.name}
                valueLine2={item?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("BG.table_budget_tt_pb_owner"),
        key: "businessDepartment",
        dataIndex: "businessDepartment",
        sorter: false,
        render(item) {
          return (
            <LayoutCell>
              <TwoLineText
                classNameFirstLine="text-first__style"
                classNameSecondLine="text-second__style"
                valueLine1={item?.name}
                valueLine2={item?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("BG.table_budget_start_period"),
        key: "startTime",
        dataIndex: "startTime",
        sorter: false,
        width: "100px",
        render(item) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(item, STANDARD_TIME_FORMAT_MM_YYYY)?.replace(
                  "/",
                  "-"
                )}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("BG.table_budget_end_period"),
        key: "endTime",
        dataIndex: "endTime",
        sorter: false,
        width: "100px",
        render(item, row) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(item, STANDARD_TIME_FORMAT_MM_YYYY)?.replace(
                  "/",
                  "-"
                )}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <>
      <div>
        <StandardTable
          rowKey="id"
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 546px)" }}
          rowSelection={rowSelection}
          locale={{
            emptyText: <ProjectModalEmptySearchData />,
          }}
        />
      </div>
      {/* Paging */}
      <div>
        <Pagination
          total={count}
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          onChange={handlePagination}
        />
      </div>
    </>
  );
};
