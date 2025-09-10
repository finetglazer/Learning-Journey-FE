import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { tableService } from "core/services/page-services/table-service";
import { Dayjs } from "dayjs";
import { gt, isEmpty, isEqual } from "lodash";
import { BusinessDepartment } from "models/BusinessDepartment";
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

import { BusinessDepartmentEmptySearchData } from "./BusinessDepartmentEmptySearchData";
import "./BusinessDepartmentMaster.scss";
import {
  BusinessDepartmentMasterContext,
  BusinessDepartmentMasterContextModel,
} from "./BusinessDepartmentMasterHook";

export interface ListOverflowMenu {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (params?: any) => void;
  isShow: boolean;
}
export const BusinessDepartmentMasterTable = () => {
  const businessDepartmentMaster =
    useContext<BusinessDepartmentMasterContextModel>(
      BusinessDepartmentMasterContext
    );

  // const history = useHistory();

  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleLoadList,
    countFilter,
    handleOpenModal,
    handleOpenModalDelete,
    validAction,
  } = businessDepartmentMaster;

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const menu = useCallback(
    (item: BusinessDepartment) => {
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

  const columns: ColumnProps<BusinessDepartment>[] = useMemo(
    () => [
      {
        title: translate("businessDepartments.code"),
        key: "code",
        dataIndex: "code",
        sorter: true,
        render(...params: [string, BusinessDepartment, number]) {
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
        title: translate("businessDepartments.name"),
        key: "name",
        dataIndex: "name",
        sorter: true,
        render(...params: [string, BusinessDepartment, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("businessDepartments.businessUnit"),
        key: "businessUnitName",
        dataIndex: "businessUnitName",
        sorter: true,
        render(...params: [string, BusinessDepartment, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={`${params[1]?.businessUnitCode}-${params[1]?.businessUnitName}`}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("businessDepartments.startDate"),
        key: "startDate",
        dataIndex: "startDate",
        sorter: true,
        render(...params: [Dayjs, BusinessDepartment, number]) {
          return (
            <LayoutCell>
              <OneLineText value={formatDate(params[0])} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("businessDepartments.endDate"),
        key: "endDate",
        dataIndex: "endDate",
        sorter: true,
        render(...params: [Dayjs, BusinessDepartment, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={params[0] ? formatDate(params[0]) : ""}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("businessDepartments.status"),
        key: "isActive",
        dataIndex: "isActive",
        sorter: true,
        width: "200px",
        render(isActive: boolean) {
          const value = isEqual(isActive, true)
            ? translate("businessDepartments.active")
            : translate("businessDepartments.inactive");
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
        render(id: number, record: BusinessDepartment) {
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
            emptyText: <BusinessDepartmentEmptySearchData />,
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
