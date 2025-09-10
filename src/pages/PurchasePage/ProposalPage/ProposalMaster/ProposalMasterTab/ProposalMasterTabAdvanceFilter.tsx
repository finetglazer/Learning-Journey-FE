import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { listProposalStatusEnum, NUMBER_MAX_13 } from "config/const";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { ProposalFilter } from "models/Proposal/ProposalFilter";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { contractPrincipleRepository } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleRepository";
import React, { useCallback, useContext } from "react";
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
import { proposalRepository } from "../../ProposalRepository";
import { ProposalMaster, ProposalMasterContext } from "../ProposalMasterHook";
import { gt } from "lodash";

interface ProposalMasterTabAdvanceFilterProps {
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

class DemoFilter extends ModelFilter {
  id: IdFilter = new IdFilter();
  name: StringFilter = new StringFilter();
  code: StringFilter = new StringFilter();
}

const ProposalMasterTabAdvanceFilter = (
  props: ProposalMasterTabAdvanceFilterProps
) => {
  const appUserMaster = useContext<ProposalMaster>(ProposalMasterContext);
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
    notifyToast,
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

  const handleSaveModelFilter = useCallback(() => {
    if (gt(modelFilter?.totalRange?.from, modelFilter?.totalRange?.to)) {
      notifyToast({
        type: "error",
        message: translate("PL.warning_total_range_filter_message"),
      });
      return;
    }

    handleApplyFilter();
  }, [
    modelFilter?.totalRange?.from,
    modelFilter?.totalRange?.to,
    handleApplyFilter,
    notifyToast,
    translate,
  ]);

  React.useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

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

  return (
    <FilterPanel
      handleApplyFilter={handleSaveModelFilter}
      handleClearModelFilter={handleClearFilter}
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
          dataOptions={listProposalStatusEnum}
          values={modelFilter?.statusesId}
          onChange={handleChangeCheckboxFilter({
            fieldName: "statuses",
          })}
        />
      </FilterPanel.Left>
      <FilterPanel.Right>
        <Row gutter={16}>
          <Col lg={24}>
            <InputText
              className="m-b--sm"
              isSmall={false}
              value={modelFilter?.code}
              label={translate("PP.table_proposal_code")}
              placeHolder={translate("PP.filter_plh_find_by_proposal_code")}
              onChange={handleChangeInputFilter({
                fieldName: "code",
              })}
            />
          </Col>

          <Col lg={24}>
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
          <Col lg={24} className="m-b--md">
            <MultipleSelect
              isSmall={false}
              values={modelFilter?.goodsIdsValue || []}
              label={translate("PP.tab_goods_services")}
              placeHolder={translate("PP.filter_choose_goods_services")}
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
          <Col lg={24}>
            <div className="d-flex align-items-end h-100">
              <InputNumber
                className="d-flex m-b--sm"
                isSmall={false}
                value={modelFilter?.totalRange?.from}
                label={translate("PP.filter_label_total_range")}
                placeHolder={translate("PP.filter_plh_from")}
                onChange={handleUpdateTotalRange("from")}
                max={NUMBER_MAX_13}
              />
              <div className="Proposal__advance__filter__seperate__item">-</div>
              <InputNumber
                className="d-flex m-b--sm"
                isSmall={false}
                value={modelFilter?.totalRange?.to}
                label={undefined}
                placeHolder={translate("PP.filter_plh_to")}
                onChange={handleUpdateTotalRange("to")}
                max={NUMBER_MAX_13}
              />
            </div>
          </Col>

          <Col lg={12} className="m-b--sm">
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
              appendToBody
              isSmall={false}
            />
          </Col>
          <Col lg={24} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.businessUnitIdValue || []}
              label={translate("PP.label_create_unit")}
              placeHolder={translate("PP.filter_plh_choose_create_unit")}
              getList={contractPrincipleRepository.getListOrganization}
              classFilter={DemoFilter}
              render={(item) => `${item?.code} - ${item?.name}`}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "businessUnitId",
              })}
              appendToBody
              isSmall={false}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};

export default ProposalMasterTabAdvanceFilter;
