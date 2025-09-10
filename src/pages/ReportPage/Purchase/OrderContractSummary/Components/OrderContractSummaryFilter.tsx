import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { businessBranchRepository } from "core/repositories/BusinessBranchRepository";
import { contractPrincipleDropdownRepository } from "core/repositories/ContractPrincipleDropdownRepository";
import { costItemRepository } from "core/repositories/CostItemRepository";
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

export default function OrderContractSummaryFilter({
  modelFilter,
  error,
  onFilter,
  onReset,
  handleChangeMultipleSelectFilter,
  handleChangeDateRangeFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  const createDateRangeFrom = modelFilter?.createDateRange?.from;
  const createDateRangeTo = modelFilter?.createDateRange?.to;

  return (
    <FilterReport {...filterReportProps}>
      <div className="form-item">
        <FormItem
          validateObject={utilService.getValidateObj(
            createDateRangeFrom && createDateRangeTo ? undefined : error,
            "from"
          )}
        >
          <DateRangePicker
            label={translate("report.payment.filter.txt_creation_date")}
            placeholder={[
              translate("CM.from_date"),
              translate("settlement.plh_to_day"),
            ]}
            onChange={handleChangeDateRangeFilter({
              fieldName: "createDateRange",
              fieldType: ["from", "to"],
            })}
            dateFormat={DATE_FORMAT}
            value={[
              isString(createDateRangeFrom)
                ? dayjs(createDateRangeFrom)
                : createDateRangeFrom,
              isString(createDateRangeTo)
                ? dayjs(createDateRangeTo)
                : createDateRangeTo,
            ]}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
      <div className="form-item">
        <MultipleSelect
          label={translate(
            "report.purchase.order_contract_summary.filter.txt_contract_type.label"
          )}
          placeHolder={translate(
            "report.purchase.order_contract_summary.filter.txt_contract_type.placeholder"
          )}
          values={modelFilter?.contractTypesValue || []}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "contractTypes",
          })}
          render={(option) => `${option?.code} - ${option.name}`}
          getList={contractPrincipleDropdownRepository.getDropdown}
          classFilter={CommonFilter}
          isSmall={false}
          appendToBody
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          label={translate(
            "report.purchase.order_contract_summary.filter.txt_cost_item.label"
          )}
          placeHolder={translate(
            "report.purchase.order_contract_summary.filter.txt_cost_item.placeholder"
          )}
          values={modelFilter?.costItemsValue || []}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "costItems",
          })}
          render={(option) => `${option?.code} - ${option.name}`}
          getList={costItemRepository.getAll}
          classFilter={CommonFilter}
          isSmall={false}
          appendToBody
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          values={modelFilter?.createdOrganizationsValue || []}
          label={translate("AC.txt_creator_unit")}
          placeHolder={translate("AC.placeholder_txt_creator_unit")}
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
            fieldName: "createdOrganizations",
          })}
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          values={modelFilter?.createdBusinessBranchsValue || []}
          label={translate(
            "report.purchase.order_contract_summary.filter.txt_branch_creation.label"
          )}
          placeHolder={translate(
            "report.purchase.order_contract_summary.filter.txt_branch_creation.placeholder"
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
            fieldName: "createdBusinessBranchs",
          })}
          appendToBody
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          values={modelFilter?.manageOrganizationsValue || []}
          label={translate(
            "report.purchase.order_contract_summary.filter.txt_contract_management_unit.label"
          )}
          placeHolder={translate(
            "report.purchase.order_contract_summary.filter.txt_contract_management_unit.placeholder"
          )}
          render={(item) => `${item?.code} - ${item?.name}`}
          getList={contractRepository.getListOrganization}
          valueFilter={{
            name: "",
          }}
          searchType=""
          classFilter={CommonFilter}
          searchProperty="name"
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "manageOrganizations",
          })}
          appendToBody
        />
      </div>
      <div className="form-item">
        <MultipleSelect
          values={modelFilter?.statusesValue || []}
          label={translate(
            "report.purchase.order_contract_summary.filter.txt_status.label"
          )}
          placeHolder={translate(
            "report.purchase.order_contract_summary.filter.txt_status.placeholder"
          )}
          render={(item) => `${item?.name}`}
          getList={() => of(contractStatuses)}
          valueFilter={{
            name: "",
          }}
          searchType=""
          classFilter={CommonFilter}
          searchProperty="name"
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "statuses",
          })}
          appendToBody
        />
      </div>
    </FilterReport>
  );
}
