import { FilterActionEnum } from "core/services/service-types";
import dayjs, { Dayjs } from "dayjs";
import CommonFilter from "models/CommonFilter";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { budgetSettlementRepository } from "pages/BudgetPage/BudgetSettlementCreate/BudgetSettlementRepository";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import {
  DateRangePicker,
  FormItem,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import React from "react";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
      | "handleChangeSelectFilter"
      | "handleChangeDateFilter"
      | "handleChangeAllFilter"
      | "modelFilter"
      | "dispatchFilter"
      | "error"
    > {}

export function Filter({
  modelFilter,
  onFilter,
  onReset,
  handleChangeSelectFilter,
  handleChangeAllFilter,
  dispatchFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  React.useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        projectYear: {
          fromYear: modelFilter?.projectYear?.fromYear ?? dayjs().year(),
          toYear: modelFilter?.projectYear?.toYear ?? dayjs().year(),
        },
      },
    });
  }, []); // Fire only once to set default projectYear for modelFilter

  const isDisabled =
    !modelFilter?.projectYear?.fromYear || !modelFilter?.projectYear?.toYear;

  return (
    <FilterReport {...filterReportProps} isDisabled={isDisabled}>
      <div className="form-item">
        <FormItem>
          <Select
            label={translate(
              "report.budget.investment_project_portfolio.filter.txt_bank_block"
            )}
            placeHolder={translate(
              "report.budget.investment_project_portfolio.placeholder.txt_bank_block"
            )}
            classFilter={CommonFilter}
            value={modelFilter?.businessUnitValue}
            onChange={(id, value) =>
              handleChangeAllFilter({
                ...modelFilter,
                businessUnitValue: value,
                businessUnitId: id,
                projectId: null,
                projectValue: null,
                businessDepartmentId: null,
                businessDepartmentValue: null,
              })
            }
            getList={budgetSettlementRepository.businessUnit}
            valueFilter={{
              name: {
                contain: modelFilter?.search?.trim() ?? "",
              },
            }}
            render={(optionValue) => {
              return optionValue
                ? `${optionValue?.code} - ${optionValue?.name}`
                : "";
            }}
            isSmall={false}
            isEnumerable={false}
            appendToBody
            isSearch
          />
        </FormItem>
      </div>
      <div className="form-item">
        <Select
          label={translate(
            "report.budget.investment_project_portfolio.filter.txt_business_branch"
          )}
          placeHolder={translate(
            "report.budget.investment_project_portfolio.placeholder.txt_business_branch"
          )}
          classFilter={CommonFilter}
          value={modelFilter?.businessBranchValue}
          onChange={(id, value) =>
            handleChangeAllFilter({
              ...modelFilter,
              businessBranchValue: value,
              businessBranchId: id,
              projectId: null,
              projectValue: null,
              businessDepartmentId: null,
              businessDepartmentValue: null,
            })
          }
          valueFilter={{
            name: {
              contain: modelFilter?.search?.trim() ?? "",
            },
            pageSize: 30,
          }}
          render={(optionValue) => {
            return optionValue ? `${optionValue?.name}` : "";
          }}
          getList={budgetSettlementRepository.businessBranch}
          isSmall={false}
          isSearch
          isEnumerable={false}
          appendToBody
        />
      </div>
      <div className="form-item">
        <Select
          label={translate(
            "report.budget.investment_project_portfolio.filter.txt_business_department"
          )}
          placeHolder={translate(
            "report.budget.investment_project_portfolio.placeholder.txt_business_department"
          )}
          classFilter={CommonFilter}
          value={modelFilter?.businessDepartmentValue}
          onChange={(id, value) =>
            handleChangeAllFilter({
              ...modelFilter,
              businessDepartmentValue: value,
              businessDepartmentId: id,
              projectId: null,
              projectValue: null,
            })
          }
          searchProperty="name"
          searchType=""
          valueFilter={{
            name: modelFilter?.search?.trim() ?? "",
          }}
          render={(optionValue) => {
            return optionValue
              ? `${optionValue?.businessUnitCode} - ${optionValue?.businessUnitName}`
              : "";
          }}
          getList={budgetRepository.listBusinessDepartment}
          isSmall={false}
          isSearch
          isEnumerable={false}
          appendToBody
        />
      </div>
      <div className="form-item">
        <DateRangePicker
          label={translate(
            "report.budget.investment_project_portfolio.filter.txt_project_year"
          )}
          placeholder={[
            translate(
              "report.budget.investment_project_portfolio.placeholder.txt_project_start_year"
            ),
            translate(
              "report.budget.investment_project_portfolio.placeholder.txt_project_end_year"
            ),
          ]}
          picker="year"
          dateFormat={["YYYY"]}
          value={[
            dayjs()
              .year(modelFilter?.projectYear?.fromYear ?? dayjs().year())
              .startOf("year"),
            dayjs()
              .year(modelFilter?.projectYear?.toYear ?? dayjs().year())
              .startOf("year"), // Prevent rounding up to the next year behavior
          ]}
          onChange={(date: [Dayjs, Dayjs]) => {
            dispatchFilter({
              type: FilterActionEnum.UPDATE,
              payload: {
                projectYear: {
                  fromYear: date[0].year(),
                  toYear: date[1].year(),
                },
              },
            });
          }}
          isSmall={false}
          isRequired
        />
      </div>
      <div className="form-item">
        <Select
          label={translate(
            "report.budget.investment_project_portfolio.filter.txt_project"
          )}
          placeHolder={translate(
            "report.budget.investment_project_portfolio.placeholder.txt_project"
          )}
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
