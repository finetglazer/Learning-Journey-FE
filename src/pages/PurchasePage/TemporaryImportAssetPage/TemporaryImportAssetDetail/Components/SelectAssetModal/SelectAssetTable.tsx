import { useContext } from "react";
import { t } from "i18next";
import {
  ActionBarComponent,
  Button,
  Pagination,
  StandardTable,
} from "react-components-design-system";

import { IcEmptySearchSvg } from "assets/icons";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import EmptyDataCM from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/component/EmptyDataCM";
import { tableService } from "core/services/page-services/table-service";

import ColumnsAssets from "./SelectAssetColumns";
import {
  AssetBudget,
  AssetTableContext,
  HEIGHT_EMPTY,
} from "./SelectAssetHook";

const AssetTable = () => {
  const {
    list,
    loadingList,
    rowSelection,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    count,
    selectedRowKeys,
    setSelectedRowKeys,
  } = useContext<AssetBudget>(AssetTableContext);

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  return (
    <div className="asset-table__wrapper">
      <div className="d-flex gap-2 align-items-center">
        <ActionBarComponent
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        >
          <Button
            type="secondary"
            size="sm"
            onClick={() => setSelectedRowKeys([])}
          >
            {t("CM.txt_delete")}
          </Button>
        </ActionBarComponent>
      </div>
      <div className="page-asset__table">
        <StandardTable
          className="asset-custom_table"
          idContainer="asset-status"
          rowKey="id"
          dataSource={list}
          scroll={{ y: "calc(100vh - 470px)" }}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          columns={ColumnsAssets()}
          loading={loadingList}
          locale={{
            emptyText: (
              <EmptyDataCM
                message={t("CM.txt_search_no_data")}
                icon={IcEmptySearchSvg}
                height={HEIGHT_EMPTY}
                isFilter
              />
            ),
          }}
        />
        <div className="page-master__pagination">
          <Pagination
            total={count}
            pageIndex={modelFilter.pageIndex}
            pageSize={modelFilter.pageSize}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
            onChange={handlePagination}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetTable;
