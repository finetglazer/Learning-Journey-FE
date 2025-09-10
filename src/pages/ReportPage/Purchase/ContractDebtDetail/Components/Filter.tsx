import { utilService } from "core/services/common-services/util-service";
import CommonFilter from "models/CommonFilter";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { Model } from "react-3layer-common";
import { FormItem, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { reportContractDebtDetailRepository } from "core/repositories/ReportContractDebtDetailRepository";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
      "handleChangeSelectFilter" | "modelFilter" | "error"
    > {}

export default function Filter({
  modelFilter,
  error,
  onFilter,
  onReset,
  handleChangeSelectFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  const handleSupplierChange = (idValue: number, value: Model) => {
    handleChangeSelectFilter({
      fieldName: "supplierName",
    })(idValue, value);

    handleChangeSelectFilter({
      fieldName: "contract",
    })(null, undefined);
  };

  const isDisabled = !modelFilter?.contractId;

  return (
    <FilterReport {...filterReportProps} isDisabled={isDisabled}>
      <div className="form-item-2">
        <Select
          value={modelFilter?.supplierNameValue}
          label={translate(
            "report.purchase.order_contract_summary.filter.txt_supplier_name.label"
          )}
          placeHolder={translate(
            "report.purchase.order_contract_summary.filter.txt_supplier_name.placeholder"
          )}
          getList={reportContractDebtDetailRepository.getDropdownSupplier}
          classFilter={CommonFilter}
          onChange={handleSupplierChange}
          render={(item) => {
            return item?.code ? item?.code + " - " + item?.name : item?.name
          }}
          isEnumerable={false}
          isSmall={false}
          appendToBody
          isSearch
        />
      </div>
      <div className="form-item-2">
        <FormItem
          validateObject={utilService.getValidateObj(
            modelFilter?.contractId ? undefined : error,
            "contractId"
          )}
        >
          <Select
            label={translate(
              "report.purchase.order_contract_summary.filter.txt_order_contract.label"
            )}
            placeHolder={translate(
              "report.purchase.order_contract_summary.filter.txt_order_contract.placeholder"
            )}
            value={modelFilter?.contractValue}
            onChange={handleChangeSelectFilter({
              fieldName: "contract",
            })}
            getList={(filter) =>
              reportContractDebtDetailRepository.getDropdownContract({
                ...filter,
                supplierNameId: modelFilter?.supplierNameId,
              })
            }
            classFilter={CommonFilter}
            render={(item) => {
              return item ? `${item?.code} - ${item?.name}` : undefined;
            }}
            appendToBody
            isEnumerable={false}
            isSmall={false}
            isRequired
            isSearch
          />
        </FormItem>
      </div>
    </FilterReport>
  );
}
