import type { PaginationProps, TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import AssetEmpty from "components/EmptyTable/AssetEmpty";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { isEmpty } from "lodash";
import { ReactNode } from "react";
import { Model } from "react-3layer-common";
import {
  FormItem,
  Pagination,
  StandardTable,
} from "react-components-design-system";

type TableWithEmptyProps<T> = Omit<
  TableProps,
  "showSorterTooltip" | "columns" | "rowSelection"
> &
  Omit<PaginationProps, "onChange"> & {
    list: T[];
    showSorterTooltip?: boolean;
    columns?: ColumnsType<T>;
    rowSelection?: TableRowSelection<T>;

    // Property Pagination
    hasPagination?: boolean;
    pageIndex?: number;
    pageSize?: number;
    pageSizeOptions?: number[];
    onChangePage?: (pageIndex: number, pageSize: number) => void;
    changePageSize?: boolean;
    recordPerPageTitle?: string;
    showCurrentRecordsNumber?: boolean;
    currentRecordNumberPosition?: "left" | "right";
    idContainer?: string;
    isDragable?: boolean;
    emptyExtra?: ReactNode;
    actionBarComponent?: ReactNode;
    fieldValidate?: string;
    modelValidate?: Model;
  };

export default function TableWithEmpty<T>({
  list,
  loading,
  rowKey = TABLE_ROW_KEY,
  scroll = { y: WIDTH_400 },

  // Property Pagination
  hasPagination,
  pageIndex,
  pageSize,
  total,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTION,
  changePageSize,
  recordPerPageTitle,
  showCurrentRecordsNumber,
  currentRecordNumberPosition,
  emptyExtra,
  actionBarComponent,
  onChangePage,
  idContainer,
  isDragable,
  fieldValidate = "",
  modelValidate,
  ...props
}: TableWithEmptyProps<T>) {
  const paginationProps = {
    pageIndex,
    total,
    pageSize,
    pageSizeOptions,
    changePageSize,
    recordPerPageTitle,
    showCurrentRecordsNumber,
    currentRecordNumberPosition,
    onChangePage,
  };

  return (
    <>
      {isEmpty(list) && !loading ? (
        <>
          <FormItem
            validateObject={utilService.getValidateObj(
              modelValidate,
              fieldValidate
            )}
          >
            {emptyExtra || <AssetEmpty />}
          </FormItem>
        </>
      ) : (
        <>
          {actionBarComponent}
          <StandardTable
            loading={loading}
            rowKey={rowKey}
            dataSource={list}
            idContainer={idContainer}
            isDragable={isDragable}
            scroll={scroll}
            {...props}
          />
          {hasPagination && <Pagination {...paginationProps} />}
        </>
      )}
    </>
  );
}
