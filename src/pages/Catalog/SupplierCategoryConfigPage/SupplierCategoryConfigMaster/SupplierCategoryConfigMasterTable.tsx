import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import { gt, isEmpty } from "lodash";
import { SupplierCategoryConfig } from "models/SupplierCategoryConfig";
import { useCallback, useContext, useMemo } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import "./SupplierCategoryConfigMaster.scss";

import { SupplierCategoryConfigEmptySearchData } from "./SupplierCategoryConfigEmptySearchData";
import {
  SupplierCategoryConfigMasterContext,
  SupplierCategoryConfigMasterContextModel,
} from "./SupplierCategoryConfigMasterHook";
import { formatNumber } from "core/helpers/number";

export interface ListOverflowMenu {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  isShow: boolean;
}
export const SupplierCategoryConfigMasterTable = () => {
  const bankMaster = useContext<SupplierCategoryConfigMasterContextModel>(
    SupplierCategoryConfigMasterContext
  );

  // const history = useHistory();

  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    countFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleOpenModal,
    handleOpenModalDelete,
    validAction,
  } = bankMaster;

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (item: SupplierCategoryConfig) => {
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
          isShow: validAction("UPDATE"),
        },
        // Delete
        {
          title: translate("generalActions.delete"),
          action: () => handleOpenModalDelete(item),
          isShow: item?.isUsed || !validAction("DELETE") ? false : true,
        },
      ];

      return <OverflowMenu list={list} />;
    },
    [translate, validAction, handleOpenModal, handleOpenModalDelete]
  );

  const columns: ColumnProps<SupplierCategoryConfig>[] = useMemo(
    () => [
      {
        title: translate("supplierCategoryConfigs.code"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        render(...params: [string, SupplierCategoryConfig, number]) {
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
        title: translate("supplierCategoryConfigs.name"),
        key: "name",
        dataIndex: "name",
        sorter: true,
        render(...params: [string, SupplierCategoryConfig, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierCategoryConfigs.fromScore"),
        key: "minScore",
        dataIndex: "minScore",
        sorter: true,
        render(...params: [number, SupplierCategoryConfig, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierCategoryConfigs.toScore"),
        key: "maxScore",
        dataIndex: "maxScore",
        sorter: true,
        render(...params: [number, SupplierCategoryConfig, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatNumber(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("supplierCategoryConfigs.description"),
        key: "description",
        dataIndex: "description",
        sorter: true,
        render(...params: [string, SupplierCategoryConfig, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
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
        render(id: number, record: SupplierCategoryConfig) {
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
      {/* List view */}
      <div className="page-master__table">
        <StandardTable
          rowKey="id"
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          onChange={handleTableChange}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          scroll={{ y: "calc(100vh - 326px)" }}
          locale={{
            emptyText: <SupplierCategoryConfigEmptySearchData />,
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
