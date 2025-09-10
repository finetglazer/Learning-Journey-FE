import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { MAX_DIGITAL_NUMBER_4_DIGITS, NUMBER_MAX_13 } from "config/const";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import { gt } from "lodash";
import CommonFilter from "models/CommonFilter";
import {
  PurchaseRequestWaitingForPlanFilterModel,
  SearchingFilterModel,
} from "models/PurchasingPlan";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
} from "react";
import {
  CheckboxGroup,
  DateRangePicker,
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { purchasingPlanRepository } from "../../PurchasingPlanRepository";
import {
  PurchasingPlanMaster,
  PurchasingPlanMasterContext,
} from "../PurchasingPlanMasterHook";
import {
  PurchaseRequestWaitingForPlanContext,
  PurchaseRequestWaitingForPlanContextType,
} from "./PurchaseRequestWaitingForPlanHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";

export const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm:ss";

export const NUMBER_RANGE_ICON = "-";

interface LogAdvanceFilterProperties {
  setVisible?: Dispatch<SetStateAction<boolean>>;
}

const AdvanceFilter = ({ setVisible }: LogAdvanceFilterProperties) => {
  const {
    translate,
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
    notifyToast,
  } = useContext<PurchaseRequestWaitingForPlanContextType>(
    PurchaseRequestWaitingForPlanContext
  );

  const { purchasingMethodList, directContractingList } =
    useContext<PurchasingPlanMaster>(PurchasingPlanMasterContext);

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: PurchaseRequestWaitingForPlanFilterModel,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeMultipleSelectFilter,
    handleChangeDateRangeFilter,
    handleChangeCheckboxFilter,
    handleChangeInputFilter,
    handleChangeNumberRangeFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  const handleSaveModelFilter = useCallback(() => {
    if (
      gt(
        modelFilter?.totalRange?.lessEqual,
        modelFilter?.totalRange?.greaterEqual
      )
    ) {
      notifyToast({
        type: "error",
        message: translate("PL.warning_total_range_filter_message"),
      });
      return;
    }

    handleApplyFilter();
  }, [modelFilter?.totalRange, translate, handleApplyFilter, notifyToast]);

  // function to reupdate model filter from origin filter
  const handleClickOutside = () => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...filter,
      },
    });
  };

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <div className="purchase_plan-filter">
      <FilterPanel
        handleApplyFilter={handleSaveModelFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        modelFilter={modelFilter}
        handleClickOutside={handleClickOutside}
      >
        <FilterPanel.Left>
          <div className="d-flex flex-column gap-4">
            <CheckboxGroup
              label={translate("PL.filter_purchasing_methods_text")}
              dataOptions={purchasingMethodList}
              values={modelFilter?.purchasingMethodsId}
              onChange={handleChangeCheckboxFilter({
                fieldName: "purchasingMethods",
              })}
            />
            <CheckboxGroup
              label={translate("PL.direct_contracting")}
              dataOptions={directContractingList}
              values={modelFilter?.appointmentMethodsId}
              onChange={handleChangeCheckboxFilter({
                fieldName: "appointmentMethods",
              })}
            />
          </div>
        </FilterPanel.Left>

        <FilterPanel.Right hasLeft lg={20}>
          <Row gutter={[16, 16]}>
            <Col lg={8}>
              <InputText
                value={modelFilter?.code}
                label={translate("PL.purchasing_plan_request_code")}
                placeHolder={translate("PL.purchase_request_code_placeholder")}
                onChange={handleChangeInputFilter({
                  fieldName: "code",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <InputText
                value={modelFilter?.name}
                label={translate("PL.filter_purchasing_request_name")}
                placeHolder={translate(
                  "PL.purchasing_request_name_placeholder"
                )}
                onChange={handleChangeInputFilter({
                  fieldName: "name",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.costGroupValue || []}
                label={translate("PL.filter_purchase_plan_cost_group")}
                placeHolder={translate("PL.plh_purchase_plan_cost_group")}
                render={(item) =>
                  item?.id ? `${item?.code} - ${item?.name}` : null
                }
                getList={purchasingPlanRepository.getListCostGroup}
                classFilter={CommonFilter}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "costGroup",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.goodsValue || []}
                label={translate("PL.filter_goods_service")}
                placeHolder={translate("PL.goods_service_placeholder")}
                getList={purchasingPlanRepository.getGoodServicesList}
                classFilter={SearchingFilterModel}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "goods",
                })}
                searchProperty="name"
                searchType=""
                isSmall={false}
              />
            </Col>

            <Col lg={16}>
              <div className="purchase_plan-advance-filter__form-around">
                <InputNumber
                  className="form-item"
                  value={modelFilter?.totalRange?.lessEqual}
                  label={translate("PL.filter_total_range")}
                  placeHolder={translate("PL.total_range_from_placeholder")}
                  onChange={(lessEqual: number) =>
                    handleChangeNumberRangeFilter({
                      fieldName: "totalRange",
                    })([modelFilter?.totalRange?.greaterEqual, lessEqual])
                  }
                  decimalDigit={MAX_DIGITAL_NUMBER_4_DIGITS}
                  numberType="DECIMAL"
                  max={NUMBER_MAX_13}
                  isSmall={false}
                />
                <div className="form-item__connect">{NUMBER_RANGE_ICON}</div>
                <InputNumber
                  className="form-item"
                  value={modelFilter?.totalRange?.greaterEqual}
                  placeHolder={translate("PL.total_range_to_placeholder")}
                  onChange={(greaterEqual: number) =>
                    handleChangeNumberRangeFilter({
                      fieldName: "totalRange",
                    })([greaterEqual, modelFilter?.totalRange?.lessEqual])
                  }
                  decimalDigit={MAX_DIGITAL_NUMBER_4_DIGITS}
                  numberType="DECIMAL"
                  max={NUMBER_MAX_13}
                  isSmall={false}
                />
              </div>
            </Col>

            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.purchaseOrganizationValue || []}
                label={translate("PL.filter_purchasing_department")}
                placeHolder={translate("PL.purchasing_department_placeholder")}
                getList={purchasingPlanRepository.listOrganization}
                classFilter={SearchingFilterModel}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "purchaseOrganization",
                })}
                searchProperty="searchText"
                isSmall={false}
              />
            </Col>

            <Col lg={8}>
              <InputText
                value={modelFilter?.purchaseProposalCode}
                label={translate("PL.filter_proposal_code")}
                placeHolder={translate("PL.proposal_code_placeholder")}
                onChange={handleChangeInputFilter({
                  fieldName: "purchaseProposalCode",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <MultipleSelect
                appendToBody
                values={modelFilter?.createdUserValue || []}
                label={translate("PL.filter_create_user")}
                placeHolder={translate("PL.create_user_placeholder")}
                render={(item) => item?.email + " - " + item?.name}
                getList={contractRepository.getListUser}
                classFilter={CommonFilter}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "createdUser",
                })}
                valueFilter={{
                  isActive: true,
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                isSmall={false}
              />
            </Col>
            <Col lg={8}>
              <DateRangePicker
                label={translate("PL.filter_create_date")}
                onChange={handleChangeDateRangeFilter({
                  fieldName: "createdDateRange",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                value={[
                  modelFilter?.createdDateRange?.greaterEqual
                    ? dayjs(modelFilter?.createdDateRange?.greaterEqual)
                    : null,
                  modelFilter?.createdDateRange?.lessEqual
                    ? dayjs(modelFilter?.createdDateRange?.lessEqual)
                    : null,
                ]}
                placeholder={[
                  translate("CM.from_date"),
                  translate("CM.to_date"),
                ]}
                bgColor="white"
                isSmall={false}
              />
            </Col>
            <Col lg={8} className="mb-3">
              <MultipleSelect
                appendToBody
                values={modelFilter?.organizationIdValue || []}
                label={translate("PL.filter_business_unit")}
                placeHolder={translate("PL.business_unit_placeholder")}
                getList={purchasingPlanRepository.getListOrganization}
                classFilter={CommonFilter}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "organizationId",
                })}
                searchProperty="name"
                isSmall={false}
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};

export default AdvanceFilter;
