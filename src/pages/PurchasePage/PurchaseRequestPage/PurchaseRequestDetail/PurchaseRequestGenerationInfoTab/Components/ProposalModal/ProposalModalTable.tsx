import { ColumnProps } from "antd/lib/table";
import { IcEmptySearchSvg } from "assets/icons";
import { EmptyData } from "components";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";
import { PurchaseProposal } from "models/PurchaseRequest";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ProposalModal.scss";
import { ProposalModal, ProposalModalContext } from "./ProposalModalHook";

export const ProposalModalTable = () => {
  const {
    list,
    loadingList,
    rowSelection,
    modelFilter,
    dispatchFilter,
    handleLoadList,
    count,
  } = useContext<ProposalModal>(ProposalModalContext);
  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<PurchaseProposal>[] = useMemo(
    () => [
      {
        title: translate("PR.table_proposal_code"),
        key: "code",
        dataIndex: "code",
        width: 180,
        sorter: false,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText value={item?.code} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.table_name"),
        key: "name",
        dataIndex: "name",
        sorter: false,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText value={item?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <div className="text-right">{translate("PR.table_total_value")}</div>
        ),
        key: "total",
        dataIndex: "total",
        sorter: false,
        width: 145,
        render(_, item) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(item?.total)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.table_create_date"),
        key: "createdDate",
        dataIndex: "createdDate",
        width: 100,
        sorter: false,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeToVietnamTimezone(
                  item?.createdDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.table_user_create"),
        key: "createUser",
        dataIndex: "createUser",
        sorter: false,
        width: 200,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText value={item?.createUser} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PR.creating_unit"),
        key: "organization",
        dataIndex: "organization",
        sorter: false,
        width: 200,
        render(_, item) {
          return (
            <LayoutCell>
              <OneLineText value={item?.organization?.name} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <>
      <div className="m-t--xs">
        <StandardTable
          rowKey="id"
          isDragable
          loading={loadingList}
          columns={columns}
          dataSource={list}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 320px)" }}
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
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          onChange={handlePagination}
        />
      </div>
    </>
  );
};
