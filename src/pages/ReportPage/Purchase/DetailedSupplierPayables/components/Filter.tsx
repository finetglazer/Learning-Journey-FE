import { DATE_FORMAT } from "components/OpinionCollector/Components/CollectOpinionModal/CollectOpinionModal";
import { purchasingContractReportRepository } from "core/repositories/PurchasingContractReportRepository";
import { supplierRepository } from "core/repositories/SupplierRepository";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { isString } from "lodash";
import CommonFilter from "models/CommonFilter";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { paymentRepository } from "pages/PaymentPage/PaymentRepository";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { Model, ModelFilter } from "react-3layer-common";
import {
  DateRangePicker,
  FormItem,
  MultipleSelect,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
      | "handleChangeDateRangeFilter"
      | "handleChangeSelectFilter"
      | "handleChangeMultipleSelectFilter"
      | "handleChangeAllFilter"
      | "modelFilter"
      | "error"
    > {}

const Filter = ({
  modelFilter,
  error,
  onFilter,
  onReset,
  handleChangeSelectFilter,
  handleChangeDateRangeFilter,
  handleChangeMultipleSelectFilter,
  handleChangeAllFilter,
}: FilterProps) => {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };
  const effectiveDateFrom = modelFilter?.effectiveDateRange?.from;
  const effectiveDateTo = modelFilter?.effectiveDateRange?.to;
  const contractIds = modelFilter?.contractIdsValue?.map((contract: any) => contract.id);
  const isDisabled = !effectiveDateFrom || !effectiveDateTo || !contractIds || !contractIds.length;

  const handleBusinessBranchChange = (idValue: number, value: Model) => {
    handleChangeAllFilter({
      ...modelFilter,
      businessBranchIdValue: value,
      businessBranchIdId: idValue,
      contractIdsValue: [],
      contractIdsId: undefined,
      projectIdValue: undefined,
    });
  };

  const handleSupplierChange = (idValue: number, value: Model) => {
    handleChangeAllFilter({
      ...modelFilter,
      supplierIdValue: value,
      supplierIdId: idValue,
      contractIdsValue: [],
      contractIdsId: undefined,
    });
  };

  return (
    <FilterReport {...filterReportProps} isDisabled={isDisabled}>
      <div className="form-item-2">
        <FormItem
          validateObject={utilService.getValidateObj(
            effectiveDateFrom && effectiveDateTo ? undefined : error,
            "effectiveDateRange"
          )}
        >
          <DateRangePicker
            label={translate(
              "report.purchase.detailed_supplier_payables.filter.txt_effective_date"
            )}
            placeholder={[
              translate(
                "report.purchase.detailed_supplier_payables.placeholder.txt_from_date"
              ),
              translate(
                "report.purchase.detailed_supplier_payables.placeholder.txt_to_date"
              ),
            ]}
            onChange={handleChangeDateRangeFilter({
              fieldName: "effectiveDateRange",
              fieldType: ["from", "to"],
            })}
            dateFormat={DATE_FORMAT}
            value={[
              isString(effectiveDateFrom)
                ? dayjs(effectiveDateFrom)
                : effectiveDateFrom,
              isString(effectiveDateTo)
                ? dayjs(effectiveDateTo)
                : effectiveDateTo,
            ]}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
      <div className="form-item-2">
        <FormItem
          validateObject={utilService.getValidateObj(
            modelFilter?.businessBranchId ? undefined : error,
            "businessBranchId"
          )}
        >
          <Select
            label={translate(
              "report.purchase.detailed_supplier_payables.filter.txt_branch"
            )}
            placeHolder={translate(
              "report.purchase.detailed_supplier_payables.placeholder.txt_branch"
            )}
            value={modelFilter?.businessBranchIdValue}
            onChange={handleBusinessBranchChange}
            searchType=""
            getList={
              paymentRepository.listBusinessBranchForDetailedSupplierPayables
            }
            classFilter={DemoFilter}
            valueFilter={{ name: "" }}
            render={(item) => {
              return item ? `${item?.code} - ${item?.name}` : undefined;
            }}
            appendToBody
            isEnumerable={false}
            isSmall={false}
            searchProperty="name"
            isSearch
          />
        </FormItem>
      </div>
      <div className="form-item-2">
        <FormItem
          validateObject={utilService.getValidateObj(
            modelFilter?.supplierId ? undefined : error,
            "supplierId"
          )}
        >
          <Select
            value={modelFilter?.supplierIdValue}
            label={translate(
              "report.purchase.detailed_supplier_payables.filter.txt_supplier"
            )}
            placeHolder={translate(
              "report.purchase.detailed_supplier_payables.placeholder.txt_supplier"
            )}
            getList={supplierRepository.getDropdown}
            classFilter={CommonFilter}
            valueFilter={{supplierId: "", name: {contain: modelFilter?.name}, isActive: true}}
            onChange={handleSupplierChange}
            render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
            isEnumerable={false}
            isSmall={false}
            appendToBody
            isSearch
          />
        </FormItem>
      </div>
      <div className="form-item-2">
        <FormItem>
          <MultipleSelect
            label={translate(
              "report.purchase.detailed_supplier_payables.filter.txt_contract_order"
            )}
            placeHolder={translate(
              "report.purchase.detailed_supplier_payables.placeholder.txt_contract_order"
            )}
            values={modelFilter?.contractIdsValue ?? []}
            onChange={handleChangeMultipleSelectFilter({
              fieldName: "contractIds",
            })}
            searchType=""
            searchProperty="name"
            getList={purchasingContractReportRepository.getForDropdown}
            classFilter={DemoFilter}
            valueFilter={{
              pageIndex: 1,
              pageSize: 30,
              name: modelFilter?.name,
              supplierIdValue: modelFilter?.supplierIdValue ?? undefined,
              businessBranchIdValue:
                modelFilter?.businessBranchIdValue ?? undefined,
            }}
            render={(item) => {
              return item ? `${item?.code} - ${item?.name}` : undefined;
            }}
            appendToBody
            isEnumerable={false}
            isSmall={false}
            isUsingSearch
            isRequired
          />
        </FormItem>
      </div>
      <div className="form-item-2">
        <FormItem>
          <Select
            label={translate(
              "report.purchase.detailed_supplier_payables.filter.txt_project"
            )}
            placeHolder={translate(
              "report.purchase.detailed_supplier_payables.placeholder.txt_project"
            )}
            value={modelFilter?.projectIdValue}
            onChange={handleChangeSelectFilter({
              fieldName: "projectId",
            })}
            searchType=""
            getList={(filterArgumentFromSelect?: ModelFilter) => {
              const params: ModelFilter =
                filterArgumentFromSelect || new CommonFilter();
              (params as any).businessBranches =
                modelFilter?.businessBranchIdValue
                  ? [modelFilter?.businessBranchIdValue?.id]
                  : undefined;
              return paymentRepository.getAllProject(params);
            }}
            classFilter={DemoFilter}
            valueFilter={{
              name: "",
              pageIndex: 1,
              pageSize: 30
            }}
            render={(item) => {
              return item ? `${item?.code} - ${item?.name}` : undefined;
            }}
            appendToBody
            isEnumerable={false}
            isSmall={false}
            isSearch
          />
        </FormItem>
      </div>
    </FilterReport>
  );
};

export default Filter;
