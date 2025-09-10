import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { listLogLevelEnum, listLogServiceEnum } from "config/const";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { LogTrackingFilterModel } from "models/LogTracking";
import {
  LogTrackingContext,
  LogTrackingContextType,
} from "pages/LogTrackingPage/LogTrackingHook";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import {
  DateRangePicker,
  MultipleSelect,
} from "react-components-design-system";
import { of } from "rxjs";
import "../../LogTrackingMaster.scss";

const getListService = (filter: LogTrackingFilterModel) => {
  const searchKey = filter?.serviceSearchKey?.contain?.trim()?.toLowerCase();
  return of(
    listLogServiceEnum.filter((item) => {
      const itemName = item?.name?.toLowerCase();
      return searchKey ? itemName.includes(searchKey) : true;
    })
  );
};

const getListLevel = (filter: LogTrackingFilterModel) => {
  const searchKey = filter?.levelSearchKey?.contain?.trim()?.toLowerCase();

  return of(
    listLogLevelEnum.filter((item) => {
      const itemName = item?.name?.toLowerCase();
      return searchKey ? itemName.includes(searchKey) : true;
    })
  );
};

export const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm:ss";

interface LogAdvanceFilterProperties {
  setVisible?: Dispatch<SetStateAction<boolean>>;
}

const LogAdvanceFilter = ({ setVisible }: LogAdvanceFilterProperties) => {
  const {
    translate,
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<LogTrackingContextType>(LogTrackingContext);

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: LogTrackingFilterModel,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const { handleChangeMultipleSelectFilter, handleChangeDateRangeFilter } =
    filterService.useFilter(modelFilter, dispatchFilter);

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
      handleClickOutside={handleClickOutside}
      modelFilter={modelFilter}
    >
      <Row gutter={[16, 12]} className="filter_panel">
        <Col lg={12}>
          <MultipleSelect
            label="Service"
            values={modelFilter?.serviceNameValue || []}
            placeHolder="Select Services"
            getList={getListService}
            classFilter={LogTrackingFilterModel}
            render={(item) => item?.name}
            onChange={handleChangeMultipleSelectFilter({
              fieldName: "serviceName",
            })}
            searchProperty="serviceSearchKey"
          />
        </Col>

        <Col lg={12}>
          <MultipleSelect
            label="Level"
            values={modelFilter?.levelValue || []}
            placeHolder="Select Levels"
            getList={getListLevel}
            classFilter={LogTrackingFilterModel}
            render={(item) => item?.name}
            onChange={handleChangeMultipleSelectFilter({
              fieldName: "level",
            })}
            searchProperty="levelSearchKey"
          />
        </Col>

        <Col lg={24}>
          <DateRangePicker
            isSmall={false}
            label="Log Time"
            placeholder={["From", "To"]}
            dateFormat={[DATE_TIME_FORMAT, DATE_TIME_FORMAT]}
            value={[
              modelFilter?.logTime?.greaterEqual,
              modelFilter?.logTime?.lessEqual,
            ]}
            onChange={handleChangeDateRangeFilter({
              fieldName: "logTime",
              fieldType: ["greaterEqual", "lessEqual"],
              useTime: true,
            })}
          />
        </Col>
      </Row>
    </FilterPanel>
  );
};

export default LogAdvanceFilter;
