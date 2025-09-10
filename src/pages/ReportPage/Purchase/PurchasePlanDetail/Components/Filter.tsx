import { utilService } from "core/services/common-services/util-service";
import { isNil } from "lodash";
import CommonFilter from "models/CommonFilter";
import { ManageSupplier } from "models/ContractPrinciple";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { reportRepository } from "pages/ReportPage/ReportRepository";
import { Model, ModelFilter } from "react-3layer-common";
import {
  FormItem,
  MultipleSelect,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Observable, of } from "rxjs";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
      | "handleChangeMultipleSelectFilter"
      | "handleChangeSelectFilter"
      | "handleChangeAllFilter"
      | "modelFilter"
      | "error"
    > {}

export default function Filter({
  modelFilter,
  error,
  onFilter,
  onReset,
  handleChangeMultipleSelectFilter,
  handleChangeAllFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };
  const isDisabled =
    !modelFilter?.supplierIdsId || !modelFilter?.supplierIdsValue;
  const getSuppliersForPlan = (): Observable<ManageSupplier[]> => {
    if (!modelFilter?.purchasePlanIdValue?.id) {
      return of([]);
    }
    const filter: ModelFilter = {
      purchasePlanId: modelFilter.purchasePlanIdValue?.id,
    };
    return contractRepository.getListSupplier(filter);
  };

  const handlePurchasePlanChange = (idValue: number, value: Model) => {
    handleChangeAllFilter({
      ...modelFilter,
      purchasePlanIdValue: value,
      purchasePlanIdId: idValue,
      supplierIdsValue: [],
      supplierIdsId: undefined,
    });
  };

  return (
    <FilterReport {...filterReportProps} isDisabled={isDisabled}>
      <div className="form-item-2">
        <FormItem
          validateObject={utilService.getValidateObj(
            modelFilter?.supplierIdsId ? undefined : error?.supplierIdsId,
            "supplierIdsId"
          )}
        >
          <Select
            appendToBody
            value={modelFilter?.purchasePlanIdValue}
            label={translate(
              "report.purchase.purchase_plan_detail.filter.txt_purchase_plan"
            )}
            placeHolder={translate(
              "report.purchase.purchase_plan_detail.filter.txt_choose_purchase_plan"
            )}
            getList={reportRepository.getPurchaseDropdown as any}
            classFilter={CommonFilter}
            render={(item) =>
              item?.code ? item?.code + " - " + item?.name : ""
            }
            onChange={handlePurchasePlanChange}
            isEnumerable={false}
            isSmall={false}
            isRequired
            isSearch
          />
        </FormItem>
      </div>
      <div className="form-item-2">
        <MultipleSelect
          appendToBody
          values={modelFilter?.supplierIdsValue || []}
          label={translate(
            "report.purchase.purchase_plan_detail.filter.txt_supplier"
          )}
          placeHolder={translate(
            "report.purchase.purchase_plan_detail.filter.txt_choose_supplier"
          )}
          render={(item) => item?.taxCode + " - " + item?.name}
          getList={getSuppliersForPlan}
          classFilter={CommonFilter}
          searchProperty="name"
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "supplierIds",
          })}
          disabled={isNil(modelFilter?.purchasePlanIdValue)}
          isRequired
        />
      </div>
      <div></div>
    </FilterReport>
  );
}
