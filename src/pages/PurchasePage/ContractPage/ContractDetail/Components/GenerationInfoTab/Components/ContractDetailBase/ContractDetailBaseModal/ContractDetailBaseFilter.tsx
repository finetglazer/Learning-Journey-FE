import { useDebounceFn } from "ahooks";
import { Col, Row } from "antd";
import { IcSearchSVG } from "assets/icons";
import { numberConstants } from "core/config/consts";
import { trimText } from "core/helpers/text";
import { filterService } from "core/services/page-services/filter-service";
import { FilterAction, FilterActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import CommonFilter from "models/CommonFilter";
import { BaseShoppingPlanFilter, ContractDetailModel } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { Dispatch, useContext } from "react";
import { ModelFilter } from "react-3layer-common";
import {
  DatePicker,
  DateRangePicker,
  DEBOUNCE_TIME_300,
  InputText,
  Select,
} from "react-components-design-system";

interface Props<TFilter extends ModelFilter> {
  modelFilter: BaseShoppingPlanFilter;
  dispatchFilter: Dispatch<FilterAction<TFilter>>;
}

const ContractDetailBaseFilter = ({
  modelFilter,
  dispatchFilter,
}: Props<BaseShoppingPlanFilter>) => {
  const { translate } = useContext<ContractDetailModel>(
    ContractDetailHookContext
  );

  const { handleChangeDateFilter, handleChangeSelectFilter } =
    filterService.useFilter(modelFilter, dispatchFilter);

  const { run } = useDebounceFn(
    (search: string) => {
      const trimmedText = trimText(search);

      const payload = {
        ...modelFilter,
        search: trimmedText,
        pageIndex: numberConstants.ONE,
      };
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload,
      });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  return (
    <div className="p-b--2xs">
      <Row gutter={16}>
        <Col span={7}>
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
            value={modelFilter?.search}
            placeHolder={translate("CT.contract_plan.search_modal")}
            isSmall={false}
            onChange={run}
          />
        </Col>
        <Col span={6}>
          <Select
            placeHolder={translate("CT.contract_plan.create_unit")}
            isSearch
            isSmall={false}
            classFilter={CommonFilter}
            valueFilter={{
              name: "",
            }}
            searchType=""
            searchProperty="name"
            getList={(filter) =>
              contractRepository.getListOrganization({
                ...filter,
                pageSize: 30,
              })
            }
            isEnumerable={false}
            render={(item) => (item ? `${item?.name}` : "")}
            onChange={handleChangeSelectFilter({
              fieldName: "businessDepartmentId",
            })}
            value={modelFilter?.businessDepartmentIdValue}
          />
        </Col>
        <Col span={5}>
          <Select
            value={modelFilter?.createUserValue}
            placeHolder={translate("CT.contract_plan.create_person")}
            isSmall={false}
            classFilter={CommonFilter}
            isSearch
            getList={contractRepository.getListUser}
            isEnumerable={false}
            render={(item) => (item ? `${item.email} - ${item.name}` : "")}
            onChange={handleChangeSelectFilter({
              fieldName: "createUser",
            })}
          />
        </Col>
        <Col span={6}>
          <DateRangePicker
            className="datepicker_base"
            placeholder={[translate("CM.from_date"), translate("CM.to_date")]}
            bgColor="white"
            isSmall={false}
            value={[
              modelFilter?.createdDate?.greaterEqual,
              modelFilter?.createdDate?.lessEqual,
            ]}
            onChange={handleChangeDateFilter({
              fieldName: "createdDate",
              fieldType: ["greaterEqual", "lessEqual"],
            })}
            popupClassName="date-range-picker-1"
          />
        </Col>
      </Row>
    </div>
  );
};

export default ContractDetailBaseFilter;
