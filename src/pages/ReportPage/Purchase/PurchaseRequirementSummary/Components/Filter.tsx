import { purchaseRequirementSummaryStatus } from "config/const";
import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { organizationRepository } from "core/repositories/OrganizationRepository";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { isString } from "lodash";
import CommonFilter from "models/CommonFilter";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
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
      | "handleChangeSelectFilter"
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
  const disableFilter = !createdDateFrom || !createdDateTo;

  return (
    <FilterReport {...filterReportProps} isDisabled={disableFilter}>
      <div className="form-item">
        <FormItem
          validateObject={utilService.getValidateObj(
            createdDateFrom && createdDateTo ? undefined : error,
            "createdDate"
          )}
        >
          <DateRangePicker
            label={translate(
              "report.purchase.purchase_requirement_summary.filter.txt_created_date"
            )}
            placeholder={[
              translate("CM.from_date"),
              translate("CM.plh_to_date"),
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
              isString(createdDateTo) ? dayjs(createdDateTo) : createdDateTo,
            ]}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          values={modelFilter?.costTypeIdsValue || []}
          label={translate(
            "report.purchase.purchase_requirement_summary.filter.txt_cost_type"
          )}
          placeHolder={translate(
            "report.purchase.purchase_requirement_summary.placeholder.txt_cost_type"
          )}
          render={(item) => item.code + " - " + item.name}
          getList={contractRepository.getListCostType}
          classFilter={DemoFilter}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "costTypeIds",
          })}
          isSmall={false}
          isUsingSearch
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          values={modelFilter?.costGroupIdsValue || []}
          label={translate(
            "report.purchase.purchase_requirement_summary.filter.txt_cost_group"
          )}
          placeHolder={translate(
            "report.purchase.purchase_requirement_summary.placeholder.txt_cost_group"
          )}
          render={(item) => item.code + " - " + item.name}
          getList={contractRepository.getListCostGroup}
          classFilter={DemoFilter}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "costGroupIds",
          })}
          isSmall={false}
          isUsingSearch
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          label={translate(
            "report.purchase.purchase_requirement_summary.filter.txt_creating_unit"
          )}
          placeHolder={translate(
            "report.purchase.purchase_requirement_summary.placeholder.txt_creating_unit"
          )}
          values={modelFilter?.unitCreatedIdsValue || []}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "unitCreatedIds",
          })}
          getList={(filterArgumentFromSelect?: ModelFilter) => {
            return organizationRepository.getListOrganization({
              name: filterArgumentFromSelect?.name?.contain,
            });
          }}
          render={(item) => `${item?.code} - ${item?.name}`}
          classFilter={DemoFilter}
          isSmall={false}
          isUsingSearch
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          values={modelFilter?.branchTransactionOfficeCreatedIdsValue || []}
          label={translate(
            "report.purchase.purchase_requirement_summary.filter.txt_branch_created"
          )}
          placeHolder={translate(
            "report.purchase.purchase_requirement_summary.placeholder.txt_branch_created"
          )}
          getList={paymentRepository.listBusinessBranch}
          classFilter={DemoFilter}
          render={(item) => `${item?.code} - ${item?.name}`}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "branchTransactionOfficeCreatedIds",
          })}
          isSmall={false}
          isUsingSearch
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          values={modelFilter?.statusesValue || []}
          label={translate(
            "report.purchase.purchase_requirement_summary.filter.txt_status"
          )}
          placeHolder={translate(
            "report.purchase.purchase_requirement_summary.placeholder.txt_status"
          )}
          render={(item) => item?.name}
          getList={() => of(purchaseRequirementSummaryStatus)}
          classFilter={CommonFilter}
          searchProperty="name"
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "statuses",
          })}
          isUsingSearch
        />
      </div>
    </FilterReport>
  );
}
