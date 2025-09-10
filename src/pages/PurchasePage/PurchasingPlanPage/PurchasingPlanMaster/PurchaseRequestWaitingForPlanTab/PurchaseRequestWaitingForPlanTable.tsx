import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import {
  CheckedDisable,
  IcCheckedSuccess,
  IcEmptySearchSvg,
} from "assets/icons";
import {
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
} from "config/route-const";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { tableService } from "core/services/page-services/table-service";
import { isEqual } from "lodash";
import { Organization } from "models/Organization";
import { ICostGroup, IPurchaseRequest } from "models/PurchasingPlan";
import { useContext, useMemo } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import EmptyDataCM from "../Components/EmptyDataCM";
import {
  PurchaseRequestWaitingForPlanContext,
  PurchaseRequestWaitingForPlanContextType,
} from "./PurchaseRequestWaitingForPlanHook";
import { TicketCode } from "components";

enum ETableField {
  PROPOSAL_CODE = "code",
  PURCHASE_REQUEST_CODE = "originalPurchaseRequestCode",
  PURCHASE_REQUEST_NAME = "name",
  CREATE_USER = "createUser",
  CREATED_DATE = "createdDate",
  TOTAL_VALUE = "total",
  APPOINTMENT_METHOD = "appointmentMethod",
  ACTION = "action",
  ORGANIZATION = "organization",
}

enum EAppointmentMethod {
  NONE,
  WITH_ASSESSMENT,
  WITHOUT_ASSESSMENT,
}

const APPOINTMENT_METHOD_ICON_SIZE = 16;
const EMPTY_SEARCH_ICON_SIZE = 400;
const TABLE_SCROLL_HEIGHT = "calc(100vh - 348px)";

const PurchaseRequestWaitingForPlanTable = () => {
  const {
    translate,
    paymentRequestList,
    loadingList,
    totalRequest,
    modelFilter,
    handleOpenModal,
    dispatchFilter,
    handleLoadList,
  } = useContext<PurchaseRequestWaitingForPlanContextType>(
    PurchaseRequestWaitingForPlanContext
  );

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const columns: ColumnProps<IPurchaseRequest>[] = useMemo(
    () => [
      {
        title: translate("PL.purchase_request_code_header_table"),
        key: ETableField.PROPOSAL_CODE,
        dataIndex: ETableField.PROPOSAL_CODE,
        ellipsis: true,
        width: 140,
        render: (code: string, purchaseRequest: IPurchaseRequest) => (
          <LayoutCell>
            <TicketCode
              content={code}
              href={`${PURCHASE_REQUEST_VIEW_ROUTE}/${purchaseRequest?.id}`}
            />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.proposal_code_header_table"),
        key: ETableField.PURCHASE_REQUEST_CODE,
        dataIndex: ETableField.PURCHASE_REQUEST_CODE,
        ellipsis: true,
        width: 120,
        render: (
          purchaseRequestCode: string,
          purchaseRequest: IPurchaseRequest
        ) => (
          <LayoutCell>
            <TicketCode
              content={purchaseRequestCode}
              href={`${PROPOSAL_DETAIL_ROUTE}/${purchaseRequest?.originalPurchaseRequestId}`}
            />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.purchase_request_name_header_table"),
        key: ETableField.PURCHASE_REQUEST_NAME,
        dataIndex: ETableField.PURCHASE_REQUEST_NAME,
        ellipsis: true,
        render: (purchaseRequestName: string) => (
          <LayoutCell>
            <OneLineText value={purchaseRequestName} useTooltip />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.table_purchase_plan_cost_group"),
        key: "costGroup",
        dataIndex: "costGroup",
        ellipsis: true,
        width: 142,
        render(costGroup: ICostGroup) {
          return (
            <LayoutCell>
              <OneLineText useTooltip value={costGroup?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.create_user_header_table"),
        key: ETableField.CREATE_USER,
        dataIndex: ETableField.CREATE_USER,
        width: 140,
        ellipsis: true,
        render: (createUser: string, row: IPurchaseRequest) => (
          <LayoutCell>
            <Tooltip
              placement="topLeft"
              className="w-100"
              title={`${createUser} - ${row?.createUserName}`}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {createUser}
              </div>
            </Tooltip>
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.business_unit_header_table"),
        key: ETableField.ORGANIZATION,
        dataIndex: ETableField.ORGANIZATION,
        width: 140,
        ellipsis: true,
        render: (value: Organization) => (
          <LayoutCell>
            <OneLineText value={value?.name} useTooltip />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.table_purchase_plan_create_date"),
        key: ETableField.CREATED_DATE,
        dataIndex: ETableField.CREATED_DATE,
        ellipsis: true,
        width: 140,
        render: (timestamp: string) => (
          <LayoutCell>
            <OneLineText
              value={formatDate(timestamp, STANDARD_DATE_FORMAT_SLASH)}
              useTooltip
            />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <OneLineText
            className="text-right"
            value={translate("PL.total_value_header_table")}
            useTooltip={false}
          />
        ),
        key: ETableField.TOTAL_VALUE,
        dataIndex: ETableField.TOTAL_VALUE,
        ellipsis: true,
        width: 145,
        render: (totalValue: string) => {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatNumber(totalValue)}
                useTooltip={false}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <OneLineText
            value={translate("PL.appointment_contract_table")}
            useTooltip={false}
          />
        ),
        className: "custom_appointment",
        key: ETableField.APPOINTMENT_METHOD,
        dataIndex: ETableField.APPOINTMENT_METHOD,
        ellipsis: true,
        width: 100,
        render: (appointmentMethod: boolean) => (
          <LayoutCell position="center">
            {!isEqual(appointmentMethod, EAppointmentMethod.NONE) && (
              <img
                src={
                  isEqual(appointmentMethod, EAppointmentMethod.WITH_ASSESSMENT)
                    ? IcCheckedSuccess
                    : CheckedDisable
                }
                width={APPOINTMENT_METHOD_ICON_SIZE}
                height={APPOINTMENT_METHOD_ICON_SIZE}
                alt="icon_checked_success"
              />
            )}
          </LayoutCell>
        ),
      },
      {
        key: ETableField.ACTION,
        dataIndex: ETableField.ACTION,
        ellipsis: true,
        width: 96,
        render: (_, purchaseRequest: IPurchaseRequest) => (
          <LayoutCell position="center">
            <Button
              size="sm"
              type="secondary"
              onClick={() => handleOpenModal(purchaseRequest)}
            >
              {translate("PL.btn_create_purchasing_plan_abbreviation")}
            </Button>
          </LayoutCell>
        ),
      },
    ],
    [translate, handleOpenModal]
  );

  return (
    <div className="page-master__table">
      <StandardTable
        rowKey={"id"}
        columns={columns}
        dataSource={paymentRequestList}
        isDragable={true}
        loading={loadingList}
        onChange={handleTableChange}
        scroll={{ y: TABLE_SCROLL_HEIGHT }}
        idContainer="table-id"
        locale={{
          emptyText: (
            <EmptyDataCM
              message={translate("CM.txt_search_no_data")}
              isFilter
              icon={IcEmptySearchSvg}
              height={EMPTY_SEARCH_ICON_SIZE}
            />
          ),
        }}
      />
      <div className="page-master__pagination">
        <Pagination
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={totalRequest}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </div>
  );
};

export default PurchaseRequestWaitingForPlanTable;
