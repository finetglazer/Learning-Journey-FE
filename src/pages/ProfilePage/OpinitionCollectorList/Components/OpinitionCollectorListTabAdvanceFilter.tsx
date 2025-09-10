import FilterPanel from "components/FilterPanel/FilterPanel";
import { opinionCollectorRepository } from "components/OpinionCollector/OpinionCollectorRepository";
import { listTypeEnumStatusResponse } from "config/const";
import { TIME_FORMAT } from "core/config/consts";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { ResponderFilter } from "models/OpinionCollector";
import { OpinionCollectorListFilter } from "models/OpinionCollectorList/OpinionCollectorListFilter";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import {
  DateRangePicker,
  EnumSelect,
  InputText,
  MultipleSelect,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";
import {
  OpinitionCollectorList,
  OpinitionCollectorListContext,
} from "../OpinitionCollectorListHook";

interface OpinitionCollectorListTabAdvanceFilterProps {
  setVisible?: Dispatch<SetStateAction<boolean>>;
}

const listType = () => {
  return of(listTypeEnumStatusResponse);
};

const getListOinitionType = () => {
  const list = [
    { id: 0, name: t("OC.txt_all") },
    { id: 1, name: t("OC.mandatory") },
    { id: 2, name: t("OC.optional") },
  ];

  return of(list);
};

export const DATE_FORMAT = [
  "DD/MM/YYYY HH:mm",
  "DDMMYYYY HH:mm",
  "DD-MM-YYYY HH:mm",
];

const OpinitionCollectorListTabAdvanceFilter = (
  props: OpinitionCollectorListTabAdvanceFilterProps
) => {
  const { setVisible } = props;
  const opinitionCollectorList = useContext<OpinitionCollectorList>(
    OpinitionCollectorListContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = opinitionCollectorList;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: OpinionCollectorListFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeDateRangeFilter,
    handleChangeSelectFilter,
    handleChangeMultipleSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <FilterPanel
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.btn_apply")}
      modelFilter={modelFilter}
      handleClickOutside={handleClickOutside}
    >
      <div className="opinion-list-filter">
        <InputText
          value={modelFilter?.code}
          label={translate("OC.label_code")}
          placeHolder={translate("OC.placehoder_code")}
          className="opinion-list-filter-form"
          onChange={handleChangeInputFilter({
            fieldName: "code",
          })}
        />
        <MultipleSelect
          values={modelFilter?.creatorValue || []}
          label={translate("OC.label_sender")}
          placeHolder={translate("OC.placehoder_sender")}
          render={(item) => item?.email}
          getList={opinionCollectorRepository.getListUser}
          searchProperty="name"
          className="opinion-list-filter-form"
          classFilter={ResponderFilter}
          onChange={handleChangeMultipleSelectFilter({
            fieldName: "creator",
          })}
        />
        <Select
          value={modelFilter.statusValue}
          label={translate("CM.txt_status")}
          placeHolder={translate("OC.placehoder_status_selection")}
          getList={listType}
          className="opinion-list-filter-form"
          classFilter={Number}
          onChange={handleChangeSelectFilter({
            fieldName: "status",
            fieldType: "status",
          })}
        />
        <DateRangePicker
          label={translate("OC.label_response_time_limit")}
          className="opinion-list-filter-form"
          onChange={handleChangeDateRangeFilter({
            fieldName: "responseDueDate",
            fieldType: ["greaterEqual", "lessEqual"],
            useTime: true,
          })}
          value={[
            modelFilter?.responseDueDate?.greaterEqual,
            modelFilter?.responseDueDate?.lessEqual,
          ]}
          placeholder={[
            translate("BG.plh_date_from"),
            translate("BG.plh_date__to"),
          ]}
          dateFormat={DATE_FORMAT}
          showTime={{ format: TIME_FORMAT }}
          bgColor="white"
          isSmall
        />

        <div className="opinion-list-filter-form">
          <EnumSelect
            type={1}
            label={translate("OC.opinion_type")}
            placeHolder={translate("OC.placehoder_opinion_type")}
            getList={getListOinitionType}
            value={modelFilter?.opinionTypeValue}
            onChange={handleChangeSelectFilter({
              fieldName: "opinionType",
              fieldType: "opinionType",
            })}
          />
        </div>
      </div>
    </FilterPanel>
  );
};

export default OpinitionCollectorListTabAdvanceFilter;
