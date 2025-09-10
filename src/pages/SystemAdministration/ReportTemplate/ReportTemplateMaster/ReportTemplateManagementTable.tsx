import React, { useCallback, useContext, useMemo } from "react";
import {
  ReportTemplateManagementContext,
  ReportTemplateManagementContextProps,
} from "pages/SystemAdministration/ReportTemplate/ReportTemplateManagementHook";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { CurrencyEmptySearchData } from "pages/Catalog/CurrencyPage/CurrencyMaster/CurrencyEmptySearchData";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { ColumnProps } from "antd/lib/table";
import { ListOverflowMenu } from "pages/Catalog/CurrencyPage/CurrencyMaster/CurrencyMasterTable";
import { tableService } from "core/services/page-services/table-service";
import { ReportTemplate } from "models/ReportTemplate";
import { gt, isEmpty } from "lodash";

export const ReportTemplateManagementTable = () => {
  const reportsTemplateMaster =
    useContext<ReportTemplateManagementContextProps>(
      ReportTemplateManagementContext
    );
  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    countFilter,
    selectedRowKeys,
    setSelectedRowKeys,
    rowSelection,
    handleOpenModal,
    handleOpenModalDelete,
    handleDownloadFile,
  } = reportsTemplateMaster;

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (item: ReportTemplate) => {
      const list: ListOverflowMenu[] = [
        // preview
        {
          title: translate("generalActions.preview"),
          action: () => handleOpenModal(item?.id, "preview"),
          isShow: true,
        },
        // Edit
        {
          title: translate("generalActions.edit"),
          action: () => handleOpenModal(item?.id, "detail"),
          isShow: true,
        },
        // Delete
        {
          title: translate("generalActions.delete"),
          action: () => handleOpenModalDelete(item),
          isShow: true,
        },
        {
          title: translate("reportTemplates.download"),
          action: () => handleDownloadFile(item),
          isShow: true,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [translate, handleOpenModal, handleOpenModalDelete, handleDownloadFile]
  );

  const columns: ColumnProps<ReportTemplate>[] = useMemo(
    () => [
      {
        title: translate("reportTemplates.code"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        render(...params: [string, ReportTemplate, number]) {
          return (
            <LayoutCell>
              <div
                className="w-100"
                onClick={() => handleOpenModal(params[1]?.id, "preview")}
              >
                <OneLineText
                  className="text-table-content-primary"
                  value={params[0]}
                  useTooltip
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("reportTemplates.name"),
        key: "name",
        dataIndex: "name",
        sorter: true,
        render(...params: [string, ReportTemplate, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("reportTemplates.status"),
        key: "status",
        dataIndex: "status",
        sorter: true,
        width: "200px",
        render(status: boolean) {
          const value = status
            ? translate("reportTemplates.active")
            : translate("reportTemplates.inactive");
          const statusValue = status ? "SUCCESS" : "DEFAULT";

          return (
            <LayoutCell>
              <Tag
                size="md"
                value={value}
                status={statusValue}
                isShowDot={false}
                isShowBorder={true}
              />
            </LayoutCell>
          );
        },
      },
      {
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: 40,
        align: "center",
        render(id: number, record: any) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {menu(record)}
            </div>
          );
        },
      },
    ],
    [handleOpenModal, menu, translate]
  );
  return (
    <>
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => handleOpenModalDelete(undefined)}
        >
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>
      <div className="page-master__table">
        <StandardTable
          rowKey="id"
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 326px)" }}
          locale={{
            emptyText: <CurrencyEmptySearchData />,
          }}
        />

        {isEmpty(list) &&
        (!isEmpty(modelFilter.search) || gt(countFilter, 0)) ? null : (
          <div className="page-master__pagination">
            <Pagination
              pageIndex={modelFilter.pageIndex}
              pageSize={modelFilter.pageSize}
              total={count}
              onChange={handlePagination}
              pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
            />
          </div>
        )}
      </div>
    </>
  );
};
