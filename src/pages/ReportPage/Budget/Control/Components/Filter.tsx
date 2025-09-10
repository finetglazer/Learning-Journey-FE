import dayjs from "dayjs";
import { isString } from "lodash";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { budgetSettlementRepository } from "pages/BudgetPage/BudgetSettlementCreate/BudgetSettlementRepository";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import React from "react";
import { DatePicker, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import CommonFilter from "../../../../../models/CommonFilter";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
      | "handleChangeSelectFilter"
      | "handleChangeDateFilter"
      | "handleChangeAllFilter"
      | "modelFilter"
      | "error"
    > {}

export default function Filter({
  modelFilter,
  onFilter,
  onReset,
  handleChangeSelectFilter,
  handleChangeDateFilter,
  handleChangeAllFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };
  const reportPeriod = modelFilter?.reportPeriod || dayjs();

  return (
    <FilterReport {...filterReportProps}>
      <div className="form-item">
        <Select
          label={translate("report.budget.filter.txt_cost_owner_nhcd")}
          placeHolder={translate("PM.payment_nhcd_placeholder")}
          classFilter={undefined}
          value={modelFilter?.businessUnitValue}
          onChange={(id, value) =>
            handleChangeAllFilter({
              ...modelFilter,
              businessUnitId: id,
              businessUnitValue: value,
              projectId: null,
              projectValue: null,
            })
          }
          getList={(filter) => {
            return budgetSettlementRepository.businessUnit({
              name: {
                contain: filter?.name?.trim(),
              },
              dropdown: true,
              pageSize: 30,
            });
          }}
          searchProperty="name"
          searchType=""
          valueFilter={{
            name: "",
          }}
          render={(optionValue) => {
            return optionValue
              ? `${optionValue?.code} - ${optionValue?.name}`
              : "";
          }}
          isSmall={false}
          isSearch
          isEnumerable={false}
          appendToBody
        />
      </div>
      <div className="form-item">
        <Select
          label={translate("report.budget.filter.txt_cost_owner_branch")}
          placeHolder={translate("PM.plh_cn_pgd_proposal")}
          classFilter={undefined}
          value={modelFilter?.businessBranchValue}
          onChange={(id, value) =>
            handleChangeAllFilter({
              ...modelFilter,
              businessBranchId: id,
              businessBranchValue: value,
              projectId: null,
              projectValue: null,
            })
          }
          getList={(filter) =>
            budgetSettlementRepository.businessBranch({
              name: {
                contain: filter?.name.trim(),
              },
              dropdown: true,
              pageSize: 30,
            })
          }
          searchProperty="name"
          searchType=""
          valueFilter={{
            name: "",
          }}
          isSmall={false}
          isSearch
          isEnumerable={false}
          appendToBody
        />
      </div>
      <div className="form-item">
        <Select
          label={translate("report.budget.filter.txt_cost_owner_department")}
          placeHolder={translate("PM.payment_tt_pb_placeholder")}
          classFilter={undefined}
          value={modelFilter?.businessDepartmentValue}
          disabled={!modelFilter?.businessUnitId}
          onChange={(id, value) =>
            handleChangeAllFilter({
              ...modelFilter,
              businessDepartmentId: id,
              businessDepartmentValue: value,
              projectId: null,
              projectValue: null,
            })
          }
          searchProperty="name"
          searchType=""
          valueFilter={{
            search: "",
            businessUnitId: modelFilter?.businessUnitId,
          }}
          render={(optionValue) => {
            return optionValue
              ? `${optionValue?.code} - ${optionValue?.name}`
              : "";
          }}
          getList={(filter) =>
            budgetRepository.listBusinessDepartment({
              ...filter,
              dropdown: true,
              pageSize: 30,
            })
          }
          isSmall={false}
          isSearch
          isEnumerable={false}
          appendToBody
        />
      </div>
      <div className="form-item">
        <DatePicker
          label={translate("report.budget.filter.txt_report_period")}
          placeholder={translate(
            "report.budget.filter.txt_select_report_period"
          )}
          value={isString(reportPeriod) ? dayjs(reportPeriod) : reportPeriod}
          onChange={handleChangeDateFilter({
            fieldName: "reportPeriod",
            fieldType: "",
          })}
          isRequired
          picker="month"
          dateFormat={["MM-YYYY"]}
          isSmall={false}
        />
      </div>
      <div className="form-item">
        <Select
          label={translate("report.budget.filter.txt_project")}
          placeHolder={translate("PM.payment_project_input_placeholder")}
          classFilter={CommonFilter}
          value={modelFilter?.projectValue}
          onChange={handleChangeSelectFilter({
            fieldName: "project",
          })}
          getList={budgetRepository.getProjectsByCategories}
          searchProperty="search"
          searchType=""
          valueFilter={{
            ...modelFilter,
            pageIndex: 1,
            pageSize: 30,
          }}
          isSmall={false}
          render={(optionValue) => {
            return optionValue
              ? `${optionValue?.code} - ${optionValue?.name}`
              : "";
          }}
          isSearch
          isEnumerable={false}
          appendToBody
        />
      </div>
    </FilterReport>
  );
}
