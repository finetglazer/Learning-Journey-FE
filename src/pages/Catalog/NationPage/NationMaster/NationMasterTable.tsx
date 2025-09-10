import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import { gt, isEmpty, isEqual } from "lodash";
import { Nation } from "models/Nation";
import { useCallback, useContext, useMemo } from "react";
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

import "./NationMaster.scss";

import { NationEmptySearchData } from "./NationEmptySearchData";
import {
  NationMasterContext,
  NationMasterContextModel,
} from "./NationMasterHook";

export interface ListOverflowMenu {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  isShow: boolean;
}
export const NationMasterTable = () => {
  const nationMaster =
    useContext<NationMasterContextModel>(NationMasterContext);

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
  } = nationMaster;

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (item: Nation) => {
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

  const columns: ColumnProps<Nation>[] = useMemo(
    () => [
      {
        title: translate("nations.code"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        width: "150px",
        render(...params: [string, Nation, number]) {
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
        title: translate("nations.name"),
        key: "name",
        dataIndex: "name",
        sorter: true,
        width: "300px",
        render(...params: [string, Nation, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("nations.description"),
        key: "description",
        dataIndex: "description",
        sorter: true,

        render(...params: [string, Nation, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("nations.status"),
        key: "isActive",
        dataIndex: "isActive",
        sorter: true,
        width: "200px",
        render(isActive: boolean) {
          const value = isEqual(isActive, true)
            ? translate("nations.active")
            : translate("nations.inactive");
          const statusValue = isEqual(isActive, true) ? "SUCCESS" : "DEFAULT";

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
        render(id: number, record: Nation) {
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
            emptyText: <NationEmptySearchData />,
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
