import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { listPurchaseRequestStatusEnum } from "config/const";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { isNil } from "lodash";
import { PurchaseRequestFilter } from "models/PurchaseRequest/PurchaseRequestFilter";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import React, { useContext } from "react";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import {
  CheckboxGroup,
  DateRangePicker,
  InputNumber,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { map } from "rxjs";
import { purchaseRequestRepository } from "../../PurchaseRequestRepository";
import {
  PurchaseRequestMaster,
  PurchaseRequestMasterContext,
} from "../PurchaseRequestMasterHook";

interface BudgetMasterAdvanceFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const AdjustPurchaseRequestMasterTabAdvanceFilter = (
  props: BudgetMasterAdvanceFilterProps
) => {
  const appUserMaster = useContext<PurchaseRequestMaster>(
    PurchaseRequestMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
    purchasingMethodList,
  } = appUserMaster;

  const { setVisible } = props;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: PurchaseRequestFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeDateFilter,
    handleChangeMultipleSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  // function to reupdate model filter from origin filter
  const handleClickOutside = () => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...filter,
      },
    });
  };

  const handleUpdateTotalRange = (fieldType: string) => (value?: number) => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        totalRange: {
          ...modelFilter.totalRange,
          [fieldType]: value,
        },
      },
    });
  };

  React.useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <div className="PurchaseRequestFilter">
      <FilterPanel
        handleApplyFilter={handleApplyFilter}
        handleClearModelFilter={handleClearFilter}
        handleResetFilter={handleResetFilter}
        titleButtonCancel={translate("CM.btn_cancel")}
        titleButtonApply={translate("CM.btn_apply")}
        listIgnoreCountField={[
          "orderBy",
          "orderType",
          "tabKey",
          "search",
          "tab",
        ]}
        modelFilter={modelFilter}
        handleClickOutside={handleClickOutside}
      >
        <FilterPanel.Left>
          <div className="d-flex flex-column gap-y--md">
            <CheckboxGroup
              label={translate("CM.txt_status")}
              dataOptions={listPurchaseRequestStatusEnum.filter(
                (status) => ![2, 3].includes(status.id)
              )}
              values={modelFilter?.statusesId?.in}
              onChange={handleChangeCheckboxFilter({
                fieldName: "statuses",
              })}
            />
            <CheckboxGroup
              label={translate("PR.filter_purchasing_methods")}
              dataOptions={purchasingMethodList}
              values={modelFilter?.purchasingMethodsId?.in}
              onChange={handleChangeCheckboxFilter({
                fieldName: "purchasingMethods",
              })}
            />
          </div>
        </FilterPanel.Left>
        <FilterPanel.Right hasLeft lg={20}>
          <Row gutter={16}>
            <Col lg={12}>
              <InputText
                className="m-b--sm"
                isSmall={false}
                value={modelFilter?.code}
                label={translate("PR.adjusted_procurement_requirements_code")}
                placeHolder={translate(
                  "PR.plh_adjusted_procurement_requirements_code"
                )}
                onChange={handleChangeInputFilter({
                  fieldName: "code",
                })}
              />
            </Col>
            <Col lg={12}>
              <InputText
                className="m-b--sm"
                isSmall={false}
                value={modelFilter?.description?.contain}
                label={translate(
                  "PR.adjusted_description_purchasing_requirements"
                )}
                placeHolder={translate(
                  "PR.plh_adjusted_description_purchasing_requirements"
                )}
                onChange={handleChangeInputFilter({
                  fieldName: "description",
                })}
              />
            </Col>
            <Col lg={12}>
              <InputText
                className="m-b--sm"
                isSmall={false}
                value={modelFilter?.originalPurchaseRequestCode}
                label={translate("PR.originaled_purchasing_requirements_code")}
                placeHolder={translate(
                  "PR.plh_originaled_purchasing_requirements_code"
                )}
                onChange={handleChangeInputFilter({
                  fieldName: "originalPurchaseRequestCode",
                })}
              />
            </Col>
            <Col lg={12}>
              <InputText
                className="m-b--sm"
                isSmall={false}
                value={modelFilter?.name}
                label={translate("PR.filter_purchase_request_name")}
                placeHolder={translate("PR.plh_purchasing_requirements_name")}
                onChange={handleChangeInputFilter({
                  fieldName: "name",
                })}
              />
            </Col>
            <Col lg={24} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.goodsIdsValue || []}
                label={translate("PP.tab_goods_services")}
                placeHolder={translate("PP.filter_choose_goods_services")}
                isEnumerable={false}
                getList={(filter: ModelFilter) => {
                  return purchaseRequestRepository
                    .getGoodServicesList({
                      ...filter,
                      search: filter?.name?.contain,
                    })
                    .pipe(
                      map((response) => {
                        if (Array.isArray(response?.data?.items)) {
                          return response?.data?.items;
                        }

                        return [];
                      })
                    );
                }}
                classFilter={DemoFilter}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "goodsIds",
                })}
                isSmall={false}
              />
            </Col>

            <Col lg={24}>
              <div className="d-flex align-items-end h-100">
                <InputNumber
                  className="d-flex m-b--sm"
                  isSmall={false}
                  value={modelFilter?.totalRange?.from}
                  label={translate("PP.filter_label_total_range")}
                  placeHolder={translate("PP.filter_plh_from")}
                  onChange={handleUpdateTotalRange("from")}
                />
                <div className="PurchaseRequest__advance__filter__seperate__item">
                  -
                </div>
                <InputNumber
                  className="d-flex m-b--sm"
                  isSmall={false}
                  value={modelFilter?.totalRange?.to}
                  label={undefined}
                  placeHolder={translate("PP.filter_plh_to")}
                  onChange={handleUpdateTotalRange("to")}
                />
              </div>
            </Col>

            <Col lg={12}>
              <InputText
                className="m-b--sm"
                isSmall={false}
                value={modelFilter?.proposalCode}
                label={translate("PR.table_proposal_code")}
                placeHolder={translate("PR.filter_plh_find_purchase_code")}
                onChange={handleChangeInputFilter({
                  fieldName: "proposalCode",
                })}
              />
            </Col>
            <Col lg={12}>
              <MultipleSelect
                values={modelFilter?.purchaseBusinessUnitIdValue || []}
                label={translate("PR.filter_purchase_purchase_unit")}
                placeHolder={translate("PR.filter_plh_enter_purchase_unit")}
                getList={contractRepository.getListOrganization}
                valueFilter={{
                  name: "",
                }}
                searchType=""
                searchProperty="name"
                classFilter={DemoFilter}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "purchaseBusinessUnitId",
                })}
                isSmall={false}
              />
            </Col>

            <Col lg={12} className="m-b--sm">
              <MultipleSelect
                values={modelFilter?.createUserValue || []}
                label={translate("PP.user_create")}
                placeHolder={translate("PP.filer_plh_choose_user_create")}
                render={(item) => item?.email + " - " + item?.name}
                getList={budgetRepository.listMasterUser}
                classFilter={DemoFilter}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "createUser",
                })}
                isSmall={false}
              />
            </Col>
            <Col lg={12} className="m-b--sm">
              <DateRangePicker
                label={translate("PR.filter_label_time_created")}
                onChange={handleChangeDateFilter({
                  fieldName: "createDate",
                  fieldType: ["greaterEqual", "lessEqual"],
                })}
                value={[
                  modelFilter?.createDate?.greaterEqual,
                  modelFilter?.createDate?.lessEqual,
                ]}
                placeholder={[
                  translate("BG.plh_date_from"),
                  translate("BG.plh_date__to"),
                ]}
                bgColor="white"
                isSmall={false}
              />
            </Col>
            <Col lg={24} className="m-b--md">
              <MultipleSelect
                values={modelFilter?.businessUnitIdValue || []}
                label={translate("PR.filter_label_create_unit")}
                placeHolder={translate("PR.filter_plh_enter_create_unit")}
                getList={budgetRepository.listBusinessDepartment}
                classFilter={DemoFilter}
                render={(item) => `${item?.code} - ${item?.name}`}
                onChange={handleChangeMultipleSelectFilter({
                  fieldName: "businessUnitId",
                })}
                isSmall={false}
              />
            </Col>
          </Row>
        </FilterPanel.Right>
      </FilterPanel>
    </div>
  );
};

export default AdjustPurchaseRequestMasterTabAdvanceFilter;
