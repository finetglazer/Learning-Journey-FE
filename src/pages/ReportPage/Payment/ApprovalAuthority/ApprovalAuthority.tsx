import { Tooltip, type TableColumnsType } from "antd";
import {
  listPaymentMethodEnum,
  listPaymentStatusEnum,
  listTypeEnumFilter,
} from "config/const";
import { PAYMENT_ROUTE } from "config/route-const";
import {
  STANDARD_DATE_FORMAT_COMPACT_WITH_TIME,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { paymentReportRepository } from "core/repositories/PaymentReport";
import dayjs from "dayjs";
import { isEqual, isObject, isUndefined } from "lodash";
import { OptionBaseModel } from "models/Common/Common";
import {
  PAYMENT_REQUEST_TYPE,
  TYPE_OF_PAYMENT_DETAIL_TYPE,
} from "models/Payment/PaymentRequestConstant";
import { PaymentReportAuthorityFilter } from "models/PaymentReport/PaymentReportFilter";
import { PaymentReportAuthorityModel } from "models/PaymentReport/PaymentReportModel";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import PaymentReportLayout from "pages/ReportPage/Components/Layout/PaymentReportLayout";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import { LayoutCell, OneLineText, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Filter from "./Components/Filter";
import {
  PaymentRequestType,
  PaymentRequestTypeGroup,
} from "models/Report/CostItems";

function getPaymentRequestType(type: number): string {
  return PaymentRequestType[type as PaymentRequestTypeGroup];
}

export default function ApprovalAuthority() {
  const [translate] = useTranslation();

  const {
    modelFilter,
    loadingList,
    list,
    count,
    error,
    isReset,
    isShowResult,
    handleFilter,
    handleResetFilter,
    handlePagination,
    handleExportFile,
    handleChangeMultipleSelectFilter,
    handleChangeDateRangeFilter,
  } = useReport({
    ModelFilterClass: PaymentReportAuthorityFilter,
    getList: paymentReportRepository.getAll,
    onExport: paymentReportRepository.export,
  });

  const columns: TableColumnsType<PaymentReportAuthorityModel> = [
    {
      title: translate(
        "report.payment.approval_authority.table.txt_authority_level"
      ),
      key: "id",
      width: 180,
      render(record: PaymentReportAuthorityModel) {
        return (
          <LayoutCell>
            <Tooltip
              title={`${record?.updateUser || ""} - ${
                record?.updateUserFullName || ""
              }`}
              className="w-100"
            >
              <div className="text-truncate">{record?.updateUser}</div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.approval_authority.table.txt_branch_request"
      ),
      key: "businessBranch",
      dataIndex: "businessBranch",
      width: 200,
      render(value: OptionBaseModel) {
        const content = `${value?.code || ""} - ${value?.name || ""}`;
        return (
          <LayoutCell>
            <OneLineText value={content} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.approval_authority.table.txt_department_request"
      ),
      key: "businessUnit",
      dataIndex: "businessUnit",
      width: 200,
      render(value: OptionBaseModel) {
        const content = `${value?.code || ""} - ${value?.name || ""}`;
        return (
          <LayoutCell>
            <OneLineText value={content} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.approval_authority.table.txt_request_code"
      ),
      key: "code",
      dataIndex: "code",
      width: 140,
      render(value: string, record) {
        const link = `${PAYMENT_ROUTE}${
          TYPE_OF_PAYMENT_DETAIL_TYPE[
            PAYMENT_REQUEST_TYPE[
              record?.paymentRequestType
            ] as unknown as keyof typeof TYPE_OF_PAYMENT_DETAIL_TYPE
          ]
        }/${record?.paymentRequestId}`;
        return (
          <LayoutCell>
            <Link to={link} target="_blank" className="hyperlink">
              <OneLineText
                className="text-table-content-primary"
                value={value}
              />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.approval_authority.table.txt_creation_date"
      ),
      key: "createdDate",
      dataIndex: "createdDate",
      width: 100,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText
              value={formatDate(value, STANDARD_DATE_FORMAT_SLASH)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.approval_authority.table.txt_request_type"
      ),
      key: "paymentRequestType",
      dataIndex: "paymentRequestType",
      width: 100,
      render(value: number) {
        return (
          <LayoutCell>
            <OneLineText value={getPaymentRequestType(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.approval_authority.table.txt_cost_type"),
      key: "costType",
      dataIndex: "costType",
      width: 130,
      render(value: OptionBaseModel) {
        const content = `${value?.code || ""} - ${value?.name || ""}`;
        return (
          <LayoutCell>
            <Tooltip title={content} className="w-100">
              <div className="text-truncate">{value?.name}</div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.approval_authority.table.txt_cost_item"),
      key: "costGroup",
      dataIndex: "costGroup",
      width: 160,
      render(value: OptionBaseModel) {
        const content = `${value?.code || ""} - ${value?.name || ""}`;
        return (
          <LayoutCell>
            <Tooltip title={content} className="w-100">
              <div className="text-truncate">{value?.name}</div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.approval_authority.table.txt_payment_method"
      ),
      key: "paymentMethod",
      dataIndex: "paymentMethod",
      width: 190,
      render(value: number) {
        const option = listPaymentMethodEnum.find(({ id }) =>
          isEqual(id, value)
        );
        return (
          <LayoutCell>
            <OneLineText value={option?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.approval_authority.table.txt_payment_content"
      ),
      key: "description",
      dataIndex: "description",
      width: 154,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.approval_authority.table.txt_currency_type"
      ),
      key: "currency",
      dataIndex: "currency",
      width: 100,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.approval_authority.table.txt_original_amount"
      ),
      key: "amount",
      dataIndex: "amount",
      width: 160,
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate(
        "report.payment.approval_authority.table.txt_converted_amount"
      ),
      key: "exchangeAmount",
      dataIndex: "exchangeAmount",
      width: 160,
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position="right">
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.approval_authority.table.txt_requester"),
      key: "createUser",
      width: 160,
      render(record: PaymentReportAuthorityModel) {
        return (
          <LayoutCell>
            <Tooltip
              title={`${record?.createUser || ""} - ${
                record?.createUserFullName || ""
              }`}
              className="w-100"
            >
              <div className="text-truncate">{record?.createUser}</div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("report.payment.approval_authority.table.txt_status"),
      key: "status",
      dataIndex: "status",
      width: 126,
      render(value: number) {
        const item = listPaymentStatusEnum.find((type) => type.id === value);
        return (
          <LayoutCell>
            <Tag
              size="md"
              value={item?.name}
              status={item.code}
              isShowDot={false}
              isShowBorder
            />
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <PaymentReportLayout
      title={translate("report.payment.approval_authority.title")}
      filterComponent={
        <Filter
          modelFilter={modelFilter}
          error={isReset ? undefined : error}
          onFilter={handleFilter}
          onReset={handleResetFilter}
          handleChangeDateRangeFilter={handleChangeDateRangeFilter}
          handleChangeMultipleSelectFilter={handleChangeMultipleSelectFilter}
        />
      }
    >
      <ResultReport
        columns={columns}
        loadingList={loadingList}
        dataSource={list}
        modelFilter={modelFilter}
        total={count}
        onExport={() =>
          handleExportFile(
            `${translate(
              "report.payment.approval_authority.title"
            )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}`
          )
        }
        onChangePagination={handlePagination}
        isShowResult={
          isUndefined(error) &&
          isObject(modelFilter?.createDateRange) &&
          !isReset &&
          isShowResult
        }
      />
    </PaymentReportLayout>
  );
}
