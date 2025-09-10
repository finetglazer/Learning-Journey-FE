import { proposalSummaryStatus } from "config/const";
import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { businessBranchRepository } from "core/repositories/BusinessBranchRepository";
import { organizationRepository } from "core/repositories/OrganizationRepository";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { isString } from "lodash";
import CommonFilter from "models/CommonFilter";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { contractStatuses } from "pages/ReportPage/Purchase/OrderContractSummary/Components/constant";
import { ModelFilter } from "react-3layer-common";
import {
  DateRangePicker,
  FormItem,
  MultipleSelect,
  STANDARD_DATE_FORMAT_INVERSE,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
      | "handleChangeMultipleSelectFilter"
      | "handleChangeDateRangeFilter"
      | "modelFilter"
      | "error"
    > {}

const DATE_FORMAT = [
  STANDARD_DATE_FORMAT_SLASH,
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_INVERSE,
];

export default function Filter({
  modelFilter,
  error,
  onFilter,
  onReset,
  handleChangeMultipleSelectFilter,
  handleChangeDateRangeFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  const createdDateFrom = modelFilter?.createdDate?.from;
  const createdDateTo = modelFilter?.createdDate?.to;
  const isDisabled = !createdDateFrom || !createdDateTo;

  return (
    <FilterReport {...filterReportProps} isDisabled={isDisabled}>
      <div className="form-item">
        <FormItem
          validateObject={utilService.getValidateObj(
            createdDateFrom && createdDateTo ? undefined : error,
            "createdDateFrom"
          )}
        >
          <DateRangePicker
            label={translate("report.purchase.proposal_summary.filter.txt_created_date")}
            placeholder={[
              translate("report.purchase.proposal_summary.placeholder.txt_from_date"),
              translate("report.purchase.proposal_summary.placeholder.txt_to_date"),
            ]}
            onChange={handleChangeDateRangeFilter({
              fieldName: "createdDate",
              fieldType: ["from", "to"],
            })}
            dateFormat={DATE_FORMAT}
            value={[
              isString(createdDateFrom)
                ? dayjs(createdDateFrom)
                : createdDateFrom,
              isString(createdDateTo)
                ? dayjs(createdDateTo)
                : createdDateTo,
            ]}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
      <div className="form-item">
        <MultipleSelect
          label={translate(
            "report.purchase.proposal_summary.filter.txt_cost_type"
          )}
          placeHolder={translate(
            "report.purchase.proposal_summary.placeholder.txt_cost_type"
          )}
          values={modelFilter?.costTypeIdsValue || []}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "costTypeIds",
          })}
          render={(option) => `${option?.code} - ${option.name}`}
          getList={contractRepository.getListCostType}
          classFilter={CommonFilter}
          isSmall={false}
          appendToBody
          isUsingSearch
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          label={translate(
            "report.purchase.proposal_summary.filter.txt_cost_group"
          )}
          placeHolder={translate(
            "report.purchase.proposal_summary.placeholder.txt_cost_group"
          )}
          values={modelFilter?.costGroupIdsValue || []}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "costGroupIds",
          })}
          render={(option) => `${option?.code} - ${option.name}`}
          getList={contractRepository.getListCostGroup}
          classFilter={CommonFilter}
          isSmall={false}
          appendToBody
          isUsingSearch
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          values={modelFilter?.unitCreatedIdsValue || []}
          label={translate("report.purchase.proposal_summary.filter.txt_unit_created")}
          placeHolder={translate("report.purchase.proposal_summary.filter.txt_unit_created")}
          render={(item) => `${item?.code} - ${item?.name}`}
          getList={organizationRepository.getListOrganization}
          valueFilter={{
            name: "",
          }}
          searchType=""
          classFilter={CommonFilter}
          searchProperty="name"
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "unitCreatedIds",
          })}
          isUsingSearch
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          values={modelFilter?.businessBranchIdsValue || []}
          label={translate(
            "report.purchase.proposal_summary.filter.txt_branch_created"
          )}
          placeHolder={translate(
            "report.purchase.proposal_summary.placeholder.txt_branch_created"
          )}
          render={(item) => `${item?.code} - ${item?.name}`}
          getList={businessBranchRepository.getListApplicableBranch}
          valueFilter={{
            name: "",
          }}
          searchType=""
          classFilter={CommonFilter}
          searchProperty="name"
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "businessBranchIds",
          })}
          appendToBody
          isUsingSearch
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          values={modelFilter?.statusesValue || []}
          label={translate(
            "report.purchase.proposal_summary.filter.txt_status"
          )}
          placeHolder={translate(
            "report.purchase.proposal_summary.placeholder.txt_status"
          )}
          render={(item) => `${item?.name}`}
          getList={() => of(contractStatuses)}
          classFilter={CommonFilter}
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "statuses",
          })}
          appendToBody
          isUsingSearch={false}
        />
      </div>
    </FilterReport>
  );
}
