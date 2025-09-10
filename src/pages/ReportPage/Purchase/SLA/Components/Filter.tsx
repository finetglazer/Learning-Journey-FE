import { listReportTypeEnum } from "config/const";
import {
  STANDARD_DATE_FORMAT_COMPACT,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import dayjs from "dayjs";
import { t } from "i18next";
import { isString } from "lodash";
import CommonFilter from "models/CommonFilter";
import FilterReport, {
  FilterReportProps,
} from "pages/ReportPage/Components/FilterReport/FilterReport";
import useReport from "pages/ReportPage/Components/hooks/useReport";
import { useMemo } from "react";
import {
  DateRangePicker,
  FormItem,
  MultipleSelect,
  Select,
  STANDARD_DATE_FORMAT_INVERSE,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import { reportRepository } from "../../../ReportRepository";

interface FilterProps
  extends Pick<FilterReportProps, "onFilter" | "onReset">,
    Pick<
      ReturnType<typeof useReport>,
      | "handleChangeMultipleSelectFilter"
      | "handleChangeDateRangeFilter"
      | "handleChangeSelectFilter"
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
  onFilter,
  onReset,
  handleChangeMultipleSelectFilter,
  handleChangeDateRangeFilter,
  handleChangeAllFilter,
}: FilterProps) {
  const [translate] = useTranslation();
  const filterReportProps = { onFilter, onReset };

  const createdDateFrom = modelFilter?.createdDate?.from;
  const createdDateTo = modelFilter?.createdDate?.to;

  const approvedDateFrom = modelFilter?.approvedDate?.from;
  const approvedDateTo = modelFilter?.approvedDate?.to;

  const processedReportTypeList = useMemo(() => {
    return listReportTypeEnum.map((item) => ({
      ...item,
      name: t(item.name),
    }));
  }, []);

  return (
    <FilterReport {...filterReportProps}>
      <div className="form-item">
        <FormItem>
          <DateRangePicker
            label={translate("report.purchase.sla.filter.txt_created_date")}
            placeholder={[
              translate("report.purchase.sla.placeholder.txt_from_date"),
              translate("report.purchase.sla.placeholder.txt_to_date"),
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
        <FormItem>
          <DateRangePicker
            label={translate("report.purchase.sla.filter.txt_approved_date")}
            placeholder={[
              translate("report.purchase.sla.placeholder.txt_from_date"),
              translate("report.purchase.sla.placeholder.txt_to_date"),
            ]}
            onChange={handleChangeDateRangeFilter({
              fieldName: "approvedDate",
              fieldType: ["from", "to"],
            })}
            dateFormat={DATE_FORMAT}
            value={[
              isString(approvedDateFrom)
                ? dayjs(approvedDateFrom)
                : approvedDateFrom,
              isString(approvedDateTo) ? dayjs(approvedDateTo) : approvedDateTo,
            ]}
            isSmall={false}
            isRequired
          />
        </FormItem>
      </div>
      <div className="form-item">
        <FormItem>
          <Select
            label={translate("report.purchase.sla.filter.txt_report_type")}
            placeHolder={translate(
              "report.purchase.sla.placeholder.txt_report_type"
            )}
            value={modelFilter?.reportTypeValue}
            onChange={(id, value) =>
              handleChangeAllFilter({
                ...modelFilter,
                reportTypeValue: value,
                reportTypeId: id,
                reportsValue: null,
                reportsId: null,
              })
            }
            searchType=""
            searchProperty="search"
            valueFilter={{ ...modelFilter, search: "" }}
            getList={() => of(processedReportTypeList)}
            classFilter={CommonFilter}
            render={(item) =>
              item && (item?.length ?? []) !== 0
                ? item?.id + " - " + item?.name
                : ""
            }
            appendToBody
            isEnumerable={false}
            isSmall={false}
          />
        </FormItem>
      </div>
      <div className="form-item">
        <MultipleSelect
          appendToBody
          values={modelFilter?.reportsValue || []}
          label={translate("report.purchase.sla.filter.txt_report")}
          placeHolder={translate("report.purchase.sla.placeholder.txt_report")}
          render={(item) => (item ? item?.code + " - " + item?.name : "")}
          getList={reportRepository.getReportsByType}
          classFilter={CommonFilter}
          searchProperty="search"
          searchType=""
          valueFilter={{
            ...modelFilter,
            search: "",
            pageIndex: 1,
            pageSize: 30,
          }}
          isEnumerable={false}
          isSmall={false}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "reports",
          })}
          isUsingSearch
        />
      </div>
    </FilterReport>
  );
}
