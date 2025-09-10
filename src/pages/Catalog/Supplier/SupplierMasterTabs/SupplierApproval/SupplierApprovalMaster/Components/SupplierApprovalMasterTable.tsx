import { ColumnProps } from "antd/lib/table";
import { DEFAULT_PAGE_SIZE_OPTION, TABLE_ROW_KEY } from "core/config/consts";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import {
  SUPPLIER_APPROVE_ROUTE,
  SUPPLIER_DETAIL_ROUTE,
  SUPPLIER_VIEW_ROUTE,
} from "config/route-const";
import { isEqual } from "lodash";
import {
  Supplier,
  SupplierApprovalStatus,
  SupplierApprovalStatusColor,
  SupplierApprovalStatusI18n,
  SupplierType,
} from "models/Supplier/Supplier";

import { useHistory } from "react-router-dom";
import { SupplierApprovalMasterContext } from "../SupplierApprovalMasterHooks";
import { ListOverflowMenu } from "pages/DashboardPage/DashboardPage";

import { SupplierFilter } from "models/Supplier/SupplierFilter";

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  ADDRESS = "address",
  PROVINCE = "provinceName",
  NATION = "nationName",
  TYPE = "supplierType",
  ACCOUNT = "hasAccount",
  STATUS = "isActive",
  MANAGE_STATUS = "manageStatus",
  ACTION = "action",
}

const columnsWidth = {
  action: 40,
  supplierType: 188,
  code: 150,
  email: 200,
  createdDate: 110,
  manageStatus: 110,
};

export const SupplierApprovalMasterTable = () => {
  const {
    count,
    list,
    loadingList,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    setModalType,
    validAction,
  } = useContext(SupplierApprovalMasterContext);

  const [translate] = useTranslation();
  const history = useHistory();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const handleView = ({ id }: Pick<Supplier, "id">) => {
    history.push(SUPPLIER_VIEW_ROUTE + `/${id}`);
  };

  const handleEdit = ({ id }: Pick<Supplier, "id">) => {
    history.push(SUPPLIER_DETAIL_ROUTE + `/${id}`);
  };

  const handleApprove = ({ id }: Pick<Supplier, "id">) => {
    history.push(SUPPLIER_APPROVE_ROUTE + `/${id}`);
  };

  const columns: ColumnProps<Supplier>[] = useMemo(
    () => [
      {
        title: translate("SL.txt_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          "code"
        ),
        ellipsis: true,
        width: columnsWidth.code,
        render(code: string, { id }) {
          return (
            <LayoutCell>
              <div className="w-full" onClick={() => handleView({ id })}>
                <OneLineText
                  value={code}
                  className="text-table-content-primary"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.txt_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          "name"
        ),
        ellipsis: true,
        render(name: string) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.txt_address"),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          "type"
        ),
        ellipsis: true,
        render(address: string) {
          return (
            <LayoutCell>
              <OneLineText value={address} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.txt_city"),
        key: ColumnKey.PROVINCE,
        dataIndex: ColumnKey.PROVINCE,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          ColumnKey.PROVINCE
        ),
        ellipsis: true,
        width: columnsWidth.supplierType,
        render(provinceName: string) {
          return (
            <LayoutCell>
              <OneLineText value={provinceName} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.txt_nation"),
        key: ColumnKey.NATION,
        dataIndex: ColumnKey.NATION,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          ColumnKey.NATION
        ),
        ellipsis: true,
        width: columnsWidth.supplierType,
        render(nation: string) {
          return (
            <LayoutCell>
              <OneLineText value={nation} useTooltip />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("SL.txt_type"),
        key: ColumnKey.TYPE,
        dataIndex: ColumnKey.TYPE,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          ColumnKey.STATUS
        ),
        ellipsis: true,
        width: columnsWidth.supplierType,
        render(type: SupplierType) {
          return (
            <LayoutCell>
              <OneLineText value={type?.name} />
            </LayoutCell>
          );
        },
      },

      // Account
      {
        title: translate("SL.txt_account"),
        key: ColumnKey.ACCOUNT,
        dataIndex: ColumnKey.ACCOUNT,
        sorter: true,
        sortOrder: getAntOrderType<Supplier, SupplierFilter>(
          modelFilter,
          ColumnKey.ACCOUNT
        ),
        ellipsis: true,
        width: columnsWidth.supplierType,
        render(hasAccount: boolean) {
          const value = translate(
            `SL.${
              hasAccount ? "txt_have_been_account" : "txt_have_not_account"
            }`
          );
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("CM.txt_status"),
        key: ColumnKey.MANAGE_STATUS,
        dataIndex: ColumnKey.MANAGE_STATUS,
        width: columnsWidth.manageStatus,
        render(status: SupplierApprovalStatus) {
          return (
            <LayoutCell>
              <Tag
                size="md"
                value={translate(
                  `SL.status_${
                    SupplierApprovalStatusI18n[
                      SupplierApprovalStatus[
                        status
                      ] as keyof typeof SupplierApprovalStatusI18n
                    ]
                  }`
                )}
                status={
                  SupplierApprovalStatusColor[
                    SupplierApprovalStatus[
                      status
                    ] as keyof typeof SupplierApprovalStatusColor
                  ]
                }
                isShowDot={false}
                isShowBorder={true}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: ColumnKey.ACTION,
        dataIndex: ColumnKey.ACTION,
        width: columnsWidth.action,
        render(_, supplierApproval: Supplier) {
          const items: ListOverflowMenu[] = [
            {
              title: translate("generalActions.preview"),
              action: () => handleView({ id: supplierApproval.id }),
              isShow: true,
            },
            {
              title: translate("generalActions.edit"),
              action: () => handleEdit({ id: supplierApproval.id }),
              isShow: validAction("CREATE") || validAction("UPDATE"),
            },
            {
              title: translate("generalActions.approve"),
              action: () => handleApprove({ id: supplierApproval.id }),
              isShow:
                isEqual(
                  supplierApproval.manageStatus,
                  SupplierApprovalStatus.WaitingApproval
                ) &&
                (validAction("CREATE") || validAction("UPDATE")),
            },
          ];
          return (
            <LayoutCell>
              <OverflowMenu list={items} />
            </LayoutCell>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, setModalType]
  );

  return (
    <div className="page-master__table">
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        loading={loadingList}
        columns={columns}
        dataSource={list}
        onChange={handleTableChange}
        scroll={{ y: "calc(100vh - 387px)" }}
        locale={{
          emptyText: <></>,
        }}
        isDragable
      />
      <Pagination
        pageIndex={modelFilter.pageIndex}
        pageSize={modelFilter.pageSize}
        total={count}
        onChange={handlePagination}
        pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
      />
    </div>
  );
};
