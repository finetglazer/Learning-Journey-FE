import { utilService } from "core/services/common-services/util-service";
import { isString } from "lodash";
import CommonFilter from "models/CommonFilter";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import {
  DateRangePicker,
  FormItem,
  Select,
  STANDARD_DATE_FORMAT_INVERSE,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { supplierRepository } from "core/repositories/SupplierRepository";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
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
  handleChangeSelectFilter,
  handleChangeDateRangeFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };
  const isDisabled =
    !modelFilter?.supplierId || !modelFilter.effectiveDateRange;

  const effectiveDateFrom = modelFilter?.effectiveDateRange?.from;
  const effectiveDateTo = modelFilter?.effectiveDateRange?.to;

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
              })}
            classFilter={CommonFilter}
            render={(item) => {
              return item?.code ? item?.code + " - " + item?.name : item?.name
            }}
            onChange={handleChangeSelectFilter({
              fieldName: "supplier",
            })}
            isEnumerable={false}
            isSmall={false}
            isRequired
            isSearch
          />
        </FormItem>
      </div>
      <div className="form-item-2">
        <FormItem
          validateObject={utilService.getValidateObj(
            effectiveDateFrom && effectiveDateTo ? undefined : error,
            "effectiveDateRange"
          )}
        >
          <DateRangePicker
            label={translate(
              "report.purchase.supplier_goods_items_detail.filter.effective_date_range"
            )}
            placeholder={[
              translate("CM.from_date"),
              translate("CM.plh_to_date"),
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
      <div></div>
    </FilterReport>
  );
}
