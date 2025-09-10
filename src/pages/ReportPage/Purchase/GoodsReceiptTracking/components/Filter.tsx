import { utilService } from "core/services/common-services/util-service";
import { isEqual, isString } from "lodash";
import CommonFilter from "models/CommonFilter";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import {
  DateRangePicker,
  FormItem,
  MultipleSelect,
  Select,
  STANDARD_DATE_FORMAT_INVERSE,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { purchasingContractReportRepository } from "core/repositories/PurchasingContractReportRepository";
import { DemoFilter } from "pages/PaymentPage/PaymentMaster/PaymentMasterTab/PaymentMasterTabAdvanceFilter";
import { Model, ModelFilter } from "react-3layer-common";
import { supplierRepository } from "core/repositories/SupplierRepository";

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
  handleChangeSelectFilter,
  handleChangeDateRangeFilter,
  handleChangeMultipleSelectFilter,
  handleChangeAllFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };
  const isDisabled = !modelFilter?.supplierId;

  const createdDateFrom = modelFilter?.createdDateRange?.from;
  const createdDateTo = modelFilter?.createdDateRange?.to;

  const handleSupplierChange = (idValue: number, value: Model) => {
    handleChangeAllFilter({
      ...modelFilter,
      supplierId: idValue,
      supplierValue: value,
      contractIdsValue: [],
      contractIdsId: undefined,
    });
  };

  return (
    <FilterReport {...filterReportProps} isDisabled={isDisabled}>
      <div className="form-item-2">
        <FormItem
          validateObject={utilService.getValidateObj(
            modelFilter?.supplierIds ? undefined : error?.supplierIds,
            "supplier"
          )}
        >
          <Select
            appendToBody
            value={modelFilter?.supplierValue}
            label={translate(
              "report.purchase.supplier_goods_items_detail.filter.txt_supplier"
            )}
            placeHolder={translate(
              "report.purchase.supplier_goods_items_detail.filter.txt_supplier"
            )}
            getList={(filter) =>
              supplierRepository.getDropdown({
                ...filter,
                isActive: true,
              })
            }
            classFilter={CommonFilter}
            render={(item) =>
              item?.code ? item?.code + " - " + item?.name : item?.name
            }
            onChange={handleSupplierChange}
            isEnumerable={false}
            isSmall={false}
            isRequired
            isSearch
          />
        </FormItem>
      </div>
      <div className="form-item-2">
        <FormItem>
          <MultipleSelect
            label={translate(
              "report.purchase.goods_receipt_tracking.filter.txt_contract_or_po"
            )}
            placeHolder={translate(
              "report.purchase.goods_receipt_tracking.placeholder.txt_contract"
            )}
            values={modelFilter.contractIdsValue ?? []}
            onChange={handleChangeMultipleSelectFilter({
              fieldName: "contractIds",
            })}
            disabled={
              !modelFilter?.supplierValue ||
              isEqual(modelFilter.supplierValue.length, 0)
            }
            searchType=""
            searchProperty="name"
            getList={(filterArgumentFromSelect?: ModelFilter) => {
              const params: ModelFilter =
                filterArgumentFromSelect || new CommonFilter();
              (params as any).supplierId = modelFilter?.supplierValue?.id;
              return purchasingContractReportRepository.dropdown(params);
            }}
            classFilter={DemoFilter}
            valueFilter={{ name: "" }}
            render={(item) => {
              return item ? `${item?.code} - ${item?.name}` : undefined;
            }}
            appendToBody
            isEnumerable={false}
            isSmall={false}
            isUsingSearch
          />
        </FormItem>
      </div>
      <div className="form-item-2">
        <FormItem
          validateObject={utilService.getValidateObj(
            createdDateFrom && createdDateTo ? undefined : error,
            "createdDateRange"
          )}
        >
          <DateRangePicker
            label={translate(
              "report.purchase.goods_receipt_tracking.filter.txt_goods_receipt_created_date"
            )}
            placeholder={[
              translate(
                "report.purchase.goods_receipt_tracking.placeholder.txt_from_date"
              ),
              translate(
                "report.purchase.goods_receipt_tracking.placeholder.txt_to_date"
              ),
            ]}
            onChange={handleChangeDateRangeFilter({
              fieldName: "createdDateRange",
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
          />
        </FormItem>
      </div>
      <div></div>
    </FilterReport>
  );
}
