import { purchasingContractReportRepository } from "core/repositories/PurchasingContractReportRepository";
import { supplierRepository } from "core/repositories/SupplierRepository";
import { utilService } from "core/services/common-services/util-service";
import { isEqual } from "lodash";
import CommonFilter from "models/CommonFilter";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { Model } from "react-3layer-common";
import { FormItem, Select } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./OrderContractSummaryDetailFilter.scss";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
      "handleChangeSelectFilter" | "modelFilter" | "error" | "handleChangeAllFilter"
    > {}

export default function OrderContractSummaryDetailFilter({
  modelFilter,
  error,
  onFilter,
  onReset,
  handleChangeSelectFilter,
  handleChangeAllFilter
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  const handleSupplierChange = (idValue: number, value: Model) => {
    handleChangeAllFilter({
      supplierNameValue: value,
      supplierNameId: idValue,
      contractValue: [],
      contractId: undefined
    });
  };

  const isDisabled = !modelFilter?.supplierNameId || !modelFilter?.contractId;

  return (
    <FilterReport {...filterReportProps} isDisabled={isDisabled}>
      <div className="order-contract-summary-detail-filter">
        <div className="form-item">
          <FormItem
            validateObject={utilService.getValidateObj(
              modelFilter?.supplierNameId ? undefined : error,
              "supplierNameId"
            )}
          >
            <Select
              value={modelFilter?.supplierNameValue}
              label={translate(
                "report.purchase.order_contract_summary.filter.txt_supplier_name.label"
              )}
              placeHolder={translate(
                "report.purchase.order_contract_summary.filter.txt_supplier_name.placeholder"
              )}
              getList={(filter) =>
                supplierRepository.getDropdown({
                  ...filter,
                  isActive: true,
                })
              }
              classFilter={CommonFilter}
              onChange={handleSupplierChange}
              render={(item) => (item ? `${item?.code} - ${item?.name}` : "")}
              isEnumerable={false}
              isSmall={false}
              appendToBody
              isRequired
              isSearch
            />
          </FormItem>
        </div>
        <div className="form-item">
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
              disabled={
                !modelFilter?.supplierNameValue ||
                isEqual(modelFilter.supplierNameValue.length, 0)
              }
              searchType=""
              getList={(filter) => {
                const supplierId = modelFilter?.supplierNameId;
                return purchasingContractReportRepository.dropdown({
                  ...filter,
                  supplierId,
                });
              }}
              classFilter={undefined}
              valueFilter={{ name: "" }}
              render={(item) => item && (item?.length ?? []) !== 0 ? item?.code + " - " + item?.name : ""}
              appendToBody
              isEnumerable={false}
              isSmall={false}
              isRequired
              isSearch
            />
          </FormItem>
        </div>
      </div>
    </FilterReport>
  );
}
