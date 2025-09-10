import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { EmptyData } from "components";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import {
  getAntOrderType,
  tableService,
} from "core/services/page-services/table-service";
import { CostDriver } from "models/CostDriver/CostDriver";
import { CostDriverFilter } from "models/CostDriver/CostDriverFilter";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CostDriverMasterContext,
  CostDriverModal,
} from "../CostDriverMasterHooks";

const TABLE_ROW_KEY = "id";

enum ColumnKey {
  CODE = "code",
  NAME = "name",
  DESCRIPTION = "description",
}

const columnsWidth = {
  code: 200,
  name: 400,
};

const WIDTH_400 = 400;

export const CostDriverTable = () => {
  const {
    count,
    list,
    loadingList,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    handleActionCostDriver,
  } = useContext(CostDriverMasterContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<CostDriver>[] = useMemo(
    () => [
      {
        title: translate("CD.txt_cost_driver_code"),
        key: ColumnKey.CODE,
        dataIndex: ColumnKey.CODE,
        ellipsis: true,
        sorter: true,
        sortOrder: getAntOrderType<CostDriver, CostDriverFilter>(
          modelFilter,
          ColumnKey.CODE
        ),
        width: columnsWidth.code,
        render(code: string, { id }) {
          return (
            <LayoutCell>
              <div
                className="w-full"
                onClick={() =>
                  handleActionCostDriver({
                    modal: CostDriverModal.DETAIL,
                    id,
                  })
                }
              >
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
        title: translate("CD.txt_cost_driver_name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        width: columnsWidth.name,
        sorter: true,
        sortOrder: getAntOrderType<CostDriver, CostDriverFilter>(
          modelFilter,
          ColumnKey.NAME
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
        title: translate("CD.txt_cost_driver_description"),
        key: ColumnKey.DESCRIPTION,
        dataIndex: ColumnKey.DESCRIPTION,
        ellipsis: true,
        render(description: string) {
          return (
            <LayoutCell>
              <Tooltip
                placement="top"
                rootClassName="text-break-line"
                className="text-break-line line-clamp-1"
                title={description}
              >
                {description}
              </Tooltip>
            </LayoutCell>
          );
        },
      },
    ],
    [translate, modelFilter]
  );

  return (
    <div className="page-master__table">
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        isDragable
        loading={loadingList}
        columns={columns}
        dataSource={list}
        onChange={handleTableChange}
        scroll={{ y: "calc(100vh - 316px)" }}
        locale={{
          emptyText: (
            <EmptyData
              message={translate("CM.txt_search_no_data")}
              height={WIDTH_400}
            />
          ),
        }}
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
