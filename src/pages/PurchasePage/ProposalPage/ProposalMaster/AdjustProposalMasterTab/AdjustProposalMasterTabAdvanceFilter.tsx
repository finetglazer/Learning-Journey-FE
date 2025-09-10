import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { listProposalStatusEnum, listTypeEnumFilter } from "config/const";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { isNil } from "lodash";
import { ProposalFilter } from "models/Proposal/ProposalFilter";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
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
import { map, of } from "rxjs";
import { proposalRepository } from "../../ProposalRepository";
import { ProposalMaster, ProposalMasterContext } from "../ProposalMasterHook";
import { contractPrincipleRepository } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleRepository";

interface AdjustProposalMasterAdvanceFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const listType = () => {
  return of(listTypeEnumFilter);
};

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const AdjustProposalMasterTabAdvanceFilter = (
  props: AdjustProposalMasterAdvanceFilterProps
) => {
  const appUserMaster = useContext<ProposalMaster>(ProposalMasterContext);
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = appUserMaster;

  const { setVisible } = props;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: ProposalFilter,
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
    <FilterPanel
      handleClearModelFilter={handleClearFilter}
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.btn_apply")}
      listIgnoreCountField={["orderBy", "orderType", "tabKey", "search", "tab"]}
      modelFilter={modelFilter}
      handleClickOutside={handleClickOutside}
    >
      <FilterPanel.Left>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listProposalStatusEnum.filter(
            (status) => status.id !== 5
          )}
          values={modelFilter?.statusesId}
          onChange={handleChangeCheckboxFilter({
            fieldName: "statuses",
          })}
        />
      </FilterPanel.Left>
      <FilterPanel.Right>
        <Row gutter={16}>
          <Col lg={12}>
            <InputText
              className="m-b--sm"
              isSmall={false}
              value={modelFilter?.code}
              label={translate("PP.adjust_proposal_code")}
              placeHolder={translate(
                "PP.filter_plh_find_by_adjust_proposal_code"
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
              value={modelFilter?.adjustmentDescription}
              label={translate("PP.adjust_description_proposal")}
              placeHolder={translate("PP.filter_plh_find_by_description")}
              onChange={handleChangeInputFilter({
                fieldName: "adjustmentDescription",
              })}
            />
          </Col>
          <Col lg={12}>
            <InputText
              className="m-b--sm"
              isSmall={false}
              value={modelFilter?.originalCode}
              label={translate("PP.adjust_proposal_original_code")}
              placeHolder={translate(
                "PP.filter_plh_find_by_proposal_original_code"
              )}
              onChange={handleChangeInputFilter({
                fieldName: "originalCode",
              })}
            />
          </Col>

          <Col lg={12}>
            <InputText
              className="m-b--sm"
              isSmall={false}
              value={modelFilter?.name}
              label={translate("PP.table_proposal_proposal_name")}
              placeHolder={translate("PP.filter_plh_find_by_proposal_name")}
              onChange={handleChangeInputFilter({
                fieldName: "name",
              })}
            />
          </Col>
          <Col lg={12}>
            <MultipleSelect
              isSmall={false}
              values={modelFilter?.goodsIdsValue || []}
              label={translate("PP.tab_goods_services")}
              placeHolder={translate("PP.filter_choose_goods_services")}
              isEnumerable={false}
              getList={(filter: ModelFilter) => {
                return proposalRepository
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
            />
          </Col>
          <Col lg={12}>
            <div className="d-flex align-items-end h-100">
              <InputNumber
                className="d-flex m-b--sm"
                isSmall={false}
                value={modelFilter?.totalRange?.from}
                label={translate("PP.filter_label_total_range")}
                placeHolder={translate("PP.filter_plh_from")}
                onChange={handleUpdateTotalRange("from")}
              />
              <div className="Proposal__advance__filter__seperate__item">-</div>
              <InputNumber
                isSmall={false}
                className="d-flex m-b--sm"
                value={modelFilter?.totalRange?.to}
                label={undefined}
                placeHolder={translate("PP.filter_plh_to")}
                onChange={handleUpdateTotalRange("to")}
              />
            </div>
          </Col>

          <Col lg={12} className="m-b--md">
            <DateRangePicker
              label={translate("PP.filter_create_time")}
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
          <Col lg={12} className="m-b--md">
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
          <Col lg={24} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.businessDepartmentValue || []}
              label={translate("PP.label_create_unit")}
              placeHolder={translate("PP.filter_plh_choose_create_unit")}
              getList={contractPrincipleRepository.getListOrganization}
              classFilter={DemoFilter}
              render={(item) => `${item?.code} - ${item?.name}`}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "businessDepartment",
              })}
              isSmall={false}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};

export default AdjustProposalMasterTabAdvanceFilter;
