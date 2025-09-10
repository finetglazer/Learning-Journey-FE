import { ColumnProps } from "antd/lib/table";
import { EmptyData } from "components";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import { isEqual } from "lodash";
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

import { LegalEntityFilter } from "models/LegalEntity/LegalEntityFilter";
import { Status } from "models/Status";
import {
  ConfirmModalType,
  LegalEntityContext,
  LegalEntityHooks,
  LegalEntityModel,
} from "../LegalEntityMaster/LegalEntityMasterHooks";
import { CircleStatus } from "./CircleStatus";

const TABLE_ROW_KEY = "id";
const WIDTH_400 = 400;

interface ListOverflowMenu {
  title: string;
  action: (params?: ConfirmModalType) => void;
  isShow: boolean;
}

export const LegalEntityTable = () => {
  const {
    list,
    count,
    loadingList,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    dispatchFilter,
    handleLoadList,
    setModalType,
    handleEdit,
    handleView,
    validAction,
  } = useContext<LegalEntityHooks>(LegalEntityContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<LegalEntityModel>[] = useMemo(
    () => [
      {
        title: translate("LE.txt_legal_entity_code"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: 100,
        sorter: true,
        sortOrder: getAntOrderType<LegalEntityModel, LegalEntityFilter>(
          modelFilter,
          "code"
        ),
        render(code: string, row: LegalEntityModel) {
          return (
            <LayoutCell>
              <div
                className="w-full"
                onClick={() =>
                  handleView(row, ConfirmModalType.VIEW_FROM_MASTER)
                }
              >
                <OneLineText
                  value={row?.code}
                  className="text-table-content-primary"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("LE.txt_legal_entity_name"),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: 150,
        sorter: true,
        sortOrder: getAntOrderType<LegalEntityModel, LegalEntityFilter>(
          modelFilter,
          "name"
        ),
        render(name: string, row: LegalEntityModel) {
          return (
            <LayoutCell>
              <OneLineText value={row?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("LE.txt_legal_entity_tax_code"),
        key: "taxCode",
        dataIndex: "taxCode",
        ellipsis: true,
        width: 150,
        sorter: true,
        sortOrder: getAntOrderType<LegalEntityModel, LegalEntityFilter>(
          modelFilter,
          "taxCode"
        ),
        render(taxCode: string, row: LegalEntityModel) {
          return (
            <LayoutCell>
              <OneLineText value={row?.taxCode} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("LE.txt_legal_entity_address"),
        key: "address",
        dataIndex: "address",
        ellipsis: true,
        width: 180,
        sorter: true,
        sortOrder: getAntOrderType<LegalEntityModel, LegalEntityFilter>(
          modelFilter,
          "address"
        ),
        render(address: string, row: LegalEntityModel) {
          return (
            <LayoutCell>
              <OneLineText value={row?.address} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("LE.txt_legal_entity_representative"),
        key: "representativeName",
        dataIndex: "representativeName",
        ellipsis: true,
        width: 100,
        sorter: true,
        sortOrder: getAntOrderType<LegalEntityModel, LegalEntityFilter>(
          modelFilter,
          "representativeName"
        ),
        render(representativeName: string, row: LegalEntityModel) {
          return (
            <LayoutCell>
              <OneLineText value={row?.representative?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("LE.txt_default_legal_entity"),
        key: "isDefaultLegalEntity",
        dataIndex: "isDefaultLegalEntity",
        ellipsis: true,
        width: 150,
        align: "center",
        render(status: Status) {
          return (
            <LayoutCell>
              <CircleStatus active={isEqual(status, true)} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("LE.txt_legal_entity_representative_position"),
        key: "representativePosition",
        dataIndex: "representativePosition",
        ellipsis: true,
        width: 140,
        sorter: true,
        sortOrder: getAntOrderType<LegalEntityModel, LegalEntityFilter>(
          modelFilter,
          "representativePosition"
        ),
        render(representativePosition: string, row: LegalEntityModel) {
          return (
            <LayoutCell>
              <OneLineText value={row?.representativePosition} />
            </LayoutCell>
          );
        },
      },

      // Overflow menu container
      {
        title: "",
        width: 40,
        render(_, row: LegalEntityModel) {
          const items: ListOverflowMenu[] = [
            {
              title: translate("CM.txt_view"),
              action: () => handleView(row, ConfirmModalType.DETAIL),
              isShow: true,
            },
            {
              title: translate("CM.txt_editable"),
              action: () => handleEdit(row, ConfirmModalType.EDIT),
              isShow: validAction("UPDATE"),
            },
            {
              title: translate("CM.txt_delete"),
              action: () =>
                setModalType({ type: ConfirmModalType.DELETE, id: row?.id }),
              isShow: row?.isUsed || !validAction("DELETE") ? false : true,
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
    [handleEdit, handleView, modelFilter, setModalType, translate, validAction]
  );

  const handleBulkDelete = useCallback(() => {
    setModalType({ type: ConfirmModalType.DELETE });
  }, [setModalType]);

  return (
    <>
      {/* Action control */}
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button type="secondary" size="sm" onClick={handleBulkDelete}>
          {translate("CM.txt_delete")}
        </Button>
      </ActionBarComponent>
      <div className="page-master__table">
        {/* Table */}
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          isDragable={true}
          loading={loadingList}
          columns={columns}
          dataSource={list}
          rowSelection={validAction("DELETE") ? rowSelection : null}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 326px)" }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
              />
            ),
          }}
        />
        {/* Pagination */}
        <Pagination
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={count}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </>
  );
};
