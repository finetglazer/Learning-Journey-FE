import { ColumnProps } from "antd/lib/table";
import { EmptyData, TicketCode } from "components";
import { ACCEPTANCE_CREATE_ROUTE } from "config/route-const";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { tableService } from "core/services/page-services/table-service";
import { isNil } from "lodash";
import {
  AcceptanceWaitingModel,
  OriginalPurchaseRequest,
} from "models/Acceptance";
import { LOCAL_STORAGE_ACCEPTANCE } from "pages/PurchasePage/constants";
import React, { useCallback, useContext } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ActionRowType } from "../../AcceptanceMasterHook";
import { AcceptanceMaster, AcceptanceMasterContext } from "../context";
import { authorizationService } from "core/services/common-services/authorization-service";

const WaitingAcceptanceTabTable = () => {
  const appUserMaster = useContext<AcceptanceMaster>(AcceptanceMasterContext);

  const {
    modelFilter,
    dispatchFilter,
    list,
    count,
    loadingList,
    handleLoadList,
    handleOnClickRow,
    getLinkClickRow,
  } = appUserMaster;
  const [translate] = useTranslation();
  const history = useHistory();

  const { validAction } = authorizationService.useAuthorizedAction(
    "PURCHASE_ACCEPTANCE"
  );

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const goToAcceptances = useCallback(
    (id?: string) => {
      if (isNil(id)) return;
      localStorage.setItem(LOCAL_STORAGE_ACCEPTANCE, "CREATE");
      history.push(`${ACCEPTANCE_CREATE_ROUTE}/${id}`);
    },
    [history]
  );

  const columns: ColumnProps<AcceptanceWaitingModel>[] = React.useMemo(
    () => [
      {
        title: translate("AC.txt_table_contract_code"),
        key: "code",
        dataIndex: "code",
        ellipsis: true,
        width: "12%",
        render(code: string, record) {
          return (
            <LayoutCell>
              <TicketCode
                content={code}
                href={getLinkClickRow(
                  record,
                  ActionRowType.VIEW_CONTRACT_WAITING
                )}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_table_purchase_request"),
        key: "originalPurchaseRequest",
        dataIndex: "originalPurchaseRequest",
        ellipsis: true,
        width: "12%",
        render(originalPurchaseRequest: OriginalPurchaseRequest, record) {
          return (
            <LayoutCell>
              <TicketCode
                content={originalPurchaseRequest?.code}
                href={getLinkClickRow(
                  record,
                  ActionRowType.VIEW_PURCHASE_REQUEST
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_supplier"),
        key: "supplier",
        dataIndex: "supplier",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_table_manager"),
        key: "manager",
        dataIndex: "manager",
        ellipsis: true,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_table_effective_date"),
        key: "effectiveDate",
        dataIndex: "effectiveDate",
        ellipsis: true,
        render(endDate: string) {
          const dateOnly = formatDateTimeToVietnamTimezone(
            endDate,
            STANDARD_DATE_FORMAT_SLASH
          );

          return (
            <LayoutCell>
              <OneLineText value={dateOnly} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_contract_type"),
        key: "contractType",
        dataIndex: "contractType",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_contract_number"),
        key: "contractNo",
        dataIndex: "contractNo",
        ellipsis: true,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("AC.txt_contract_name"),
        key: "contractName",
        dataIndex: "name",
        ellipsis: true,
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },

      {
        title: "",
        width: 110,
        render(_, row) {
          return (
            <LayoutCell>
              {validAction("CREATE") && (
                <Button
                  type="secondary"
                  onClick={() => goToAcceptances(row?.id)}
                >
                  {translate("CM.menu_title_acceptance")}
                </Button>
              )}
            </LayoutCell>
          );
        },
      },
    ],
    [getLinkClickRow, goToAcceptances, translate, validAction]
  );

  return (
    <>
      <div className="page-master__table">
        <StandardTable
          rowKey={TABLE_ROW_KEY}
          columns={columns}
          dataSource={loadingList ? [] : list}
          isDragable={true}
          loading={loadingList}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 350px)" }}
          locale={{
            emptyText: (
              <EmptyData
                message={translate("CM.txt_search_no_data")}
                height={WIDTH_400}
              />
            ),
          }}
        />
        <div className="page-master__pagination">
          <Pagination
            total={count}
            onChange={handlePagination}
            pageSize={modelFilter.pageSize}
            pageIndex={modelFilter.pageIndex}
            pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
          />
        </div>
      </div>
    </>
  );
};

export default WaitingAcceptanceTabTable;
