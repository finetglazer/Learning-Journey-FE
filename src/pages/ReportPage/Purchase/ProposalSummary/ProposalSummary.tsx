import { STANDARD_DATE_FORMAT_COMPACT_WITH_TIME, STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import dayjs from "dayjs";
import { isObject, isUndefined } from "lodash";
import PurchaseReportLayout from "pages/ReportPage/Components/Layout/PurchaseReportLayout";
import { useTranslation } from "react-i18next";
import { ProposalSummaryFilter } from "models/ProposalSummary/ProposalSummaryFilter";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { reportRepository } from "pages/ReportPage/ReportRepository";
import Filter from "./Components/Filter";
import ResultReport from "pages/ReportPage/Components/ResultReport/ResultReport";
import { TableColumnsType } from "antd";
import { ProposalSummaryModel } from "models/ProposalSummary/ProposalSummaryModel";
import { LayoutCell, OneLineText, Tag } from "react-components-design-system";
import { PROPOSAL_DETAIL_ROUTE } from "config/route-const";
import { Link } from "react-router-dom";
import { formatNumber } from "core/helpers/number";
import { proposalSummaryStatus } from "config/const";

const ProposalSummary = () => {
  const [translate] = useTranslation();

  const {
    list,
    count,
    error,
    modelFilter,
    loadingList,
    isReset,
    isShowResult,
    handleFilter,
    handleResetFilter,
    handleExportFile,
    handlePagination,
    handleChangeDateRangeFilter,
    handleChangeMultipleSelectFilter,
  } = useReport({
    ModelFilterClass: ProposalSummaryFilter,
    getList: reportRepository.getProposalSummaryList,
    onExport: reportRepository.getProposalSummaryFile,
  });

  const columns: TableColumnsType<ProposalSummaryModel> = [
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_order"
      ),
      key: "id",
      width: 44,
      render(_, __, index: number) {
        return (
          <LayoutCell>
            <OneLineText value={`${index + 1}`} />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_proposal_code"
      ),
      key: "code",
      dataIndex: "code",
      width: 120,
      render(value: string, record) {
        const link = `${PROPOSAL_DETAIL_ROUTE}/${record?.id}`;
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
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_created_date"
      ),
      key: "createdDate",
      dataIndex: "createdDate",
      width: 96,
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
        "report.purchase.proposal_summary.table.txt_approved_date"
      ),
      key: "approvedDate",
      dataIndex: "approvedDate",
      width: 96,
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
        "report.purchase.proposal_summary.table.txt_proposal_name"
      ),
      key: "name",
      dataIndex: "name",
      width: 280,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value}/>
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_cost_type"
      ),
      key: "costType",
      dataIndex: "costType",
      width: 220,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value}/>
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_cost_group"
      ),
      key: "costGroup",
      dataIndex: "costGroup",
      width: 280,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value}/>
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_project_code"
      ),
      key: "projectCode",
      dataIndex: "projectCode",
      width: 250,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value}/>
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_project_name"
      ),
      key: "projectName",
      dataIndex: "projectName",
      width: 220,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value}/>
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_amount_before_tax"
      ),
      key: "amountBeforeTax",
      dataIndex: "amountBeforeTax",
      width: 180,
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position={"right"}>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_tax"
      ),
      key: "tax",
      dataIndex: "tax",
      width: 180,
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position={"right"}>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_other_amount"
      ),
      key: "otherAmount",
      dataIndex: "otherAmount",
      width: 180,
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position={"right"}>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_reserved_amount"
      ),
      key: "reservedAmount",
      dataIndex: "reservedAmount",
      width: 180,
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position={"right"}>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_total_amount"
      ),
      key: "totalAmount",
      dataIndex: "totalAmount",
      width: 220,
      align: "right",
      render(value: number) {
        return (
          <LayoutCell position={"right"}>
            <OneLineText value={formatNumber(value)} />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_currency"
      ),
      key: "currency",
      dataIndex: "currency",
      width: 140,
      align: "center",
      render(value: string) {
        return (
          <LayoutCell position={"center"}>
            <OneLineText value={value} />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_status"
      ),
      key: "status",
      dataIndex: "status",
      width: 150,
      align: "center",
      render(value) {
        const item = proposalSummaryStatus.find(
          (type) => type.name === value
        );
        return (
          <LayoutCell position={"center"}>
            <Tag
              size="md"
              value={item?.name}
              status={item?.code}
              isShowDot={false}
              isShowBorder
            />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_branch_created"
      ),
      key: "businessBranchCreated",
      dataIndex: "businessBranchCreated",
      width: 170,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_bank_block_created"
      ),
      key: "bankBlockCreated",
      dataIndex: "bankBlockCreated",
      width: 170,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_department_created"
      ),
      key: "departmentCreated",
      dataIndex: "departmentCreated",
      width: 170,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      }
    },
    {
      title: translate(
        "report.purchase.proposal_summary.table.txt_creator"
      ),
      key: "creator",
      dataIndex: "creator",
      width: 120,
      render(value: string) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      }
    },
  ];

  const mapProposalSummaryList = (): ProposalSummaryModel[] => {
    if (!list || !list.length) return [];
    return list.map((source: any) => {
      const model = new ProposalSummaryModel();
      model.id = source.id;
      model.code = source.code;
      model.name = source.name;
      model.createdDate = source.createdDate;
      model.approvedDate = source.approveDate;
      model.costType = source.costType;
      model.costGroup = source.costGroup;
      model.amountBeforeTax = source.purchaseAmount?.amountBeforeTax;
      model.tax = source.purchaseAmount?.taxAmount;
      model.otherAmount = source.purchaseAmount?.otherAmount;
      model.reservedAmount = source.totalContingencyAmount;
      model.totalAmount = source.totalProposalAmount;
      model.currency = source.currency?.code;
      model.status = source.statusName;
      model.businessBranchCreated = source.organization?.businessBranch ? source.organization?.businessBranch?.code + " - " + source.organization?.businessBranch?.name : "";
      model.bankBlockCreated = source.organization?.businessUnit ? source.organization?.businessUnit?.code + " - " + source.organization?.businessUnit?.name : "";
      model.departmentCreated = source.organization?.businessDepartment ? source.organization?.businessDepartment?.code + " - " + source.organization?.businessDepartment?.name : "";
      model.creator = source.createdUser;

      return model;
    });
  };

  return (
    <PurchaseReportLayout
      title={translate("report.purchase.proposal_summary.title")}
      filterComponent={
        <Filter
          modelFilter={modelFilter}
          error={isReset ? undefined : modelFilter}
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
        dataSource={mapProposalSummaryList()}
        modelFilter={modelFilter}
        total={count}
        onExport={() => handleExportFile(`${translate(
          "report.purchase.proposal_summary.title"
        )}_${formatDate(dayjs(), STANDARD_DATE_FORMAT_COMPACT_WITH_TIME)}`)}
        onChangePagination={handlePagination}
        isShowResult={
          isUndefined(error) && !isUndefined(list) &&
          isObject(modelFilter?.createdDate) &&
          !isReset &&
          isShowResult
        }
      />
    </PurchaseReportLayout>
  );
};

export default ProposalSummary;
