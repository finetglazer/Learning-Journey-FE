import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { EmptyData } from "components";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { tableService } from "core/services/page-services/table-service";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  ContractModal,
  ContractModalContext,
} from "../ModalChooseContractHooks";
import dayjs from "dayjs";
import { ContractTempReceiptModel } from "models/TemporaryImportAsset/TemporaryImportAsset";
import { Tooltip } from "antd";
import { addZStringToDate } from "core/helpers/date-time";

const ModalChooseContractTable = () => {
  const {
    list,
    loadingList,
    rowSelection,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    count,
  } = useContext<ContractModal>(ContractModalContext);
  const [translate] = useTranslation();
  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<ContractTempReceiptModel>[] = useMemo(
    () => [
      {
        title: translate("TIA.modal_table_contract_code"),
        key: "code",
        dataIndex: "code",
        width: 140,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.modal_table_contract_number"),
        key: "contractNo",
        dataIndex: "contractNo",
        width: 180,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.modal_table_contract_name"),
        key: "name",
        dataIndex: "name",
        render(value) {
          return (
            <LayoutCell position="left">
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.modal_table_effective_date"),
        key: "effectiveDate",
        dataIndex: "effectiveDate",
        width: 120,
        render(value) {
          const date = addZStringToDate(value);
          return (
            <LayoutCell>
              <OneLineText value={dayjs(date).format("DD/MM/YYYY")} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.modal_table_manager"),
        key: "managerEmail",
        dataIndex: "managerEmail",
        width: 180,
        render(value, row) {
          return (
            <LayoutCell>
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={`${value} ${
                  row?.managerName ? "- " + row?.managerName : ""
                }`}
              >
                <div className="d-inline-block text-in-table-cell text-truncate">
                  {value}
                </div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("TIA.modal_table_unit_manager"),
        key: "organizationName",
        dataIndex: "organizationName",
        width: 180,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
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
          className="mt-2"
          rowKey={"id"}
          isDragable
          columns={columns}
          loading={loadingList}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: 390 }}
          rowSelection={rowSelection}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                icon={IcEmptySearchSvg}
                height={576}
              >
                <></>
              </EmptyData>
            ),
          }}
        />
      </div>
      <div>
        <Pagination
          total={count}
          pageIndex={modelFilter?.pageIndex}
          pageSize={modelFilter?.pageSize}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          onChange={handlePagination}
        />
      </div>
    </>
  );
};

export default ModalChooseContractTable;
