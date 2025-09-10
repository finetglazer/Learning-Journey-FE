import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { CheckboxGroup, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { CommercialTermsFilter } from "models/CommercialTerms/CommercialTermsFilter";
import {
  CommercialTermsContext,
  CommercialTermsHooks,
} from "../CommercialTermsMasterHooks";
import { listCommercialTermsStatusEnum } from "./const";

interface CommercialTermsAdvanceFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const CommercialTermsAdvanceFilter = ({
  setVisible,
}: CommercialTermsAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<CommercialTermsHooks>(CommercialTermsContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: CommercialTermsFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const { handleChangeInputFilter, handleChangeCheckboxFilter } =
    filterService.useFilter(modelFilter, dispatchFilter);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <FilterPanel
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonApply={translate("CM.btn_apply")}
      modelFilter={modelFilter}
      handleApplyFilter={handleApplyFilter}
      handleClearModelFilter={handleClearFilter}
      handleResetFilter={handleResetFilter}
      handleClickOutside={handleClickOutside}
      listIgnoreCountField={["orderBy", "orderType", "tabKey", "search", "tab"]}
    >
      {/* Checkbox status */}
      <FilterPanel.Left lg={6}>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listCommercialTermsStatusEnum}
          values={modelFilter?.statusesId}
          onChange={handleChangeCheckboxFilter({
            fieldName: "statuses",
          })}
        />
      </FilterPanel.Left>
      {/* More fields */}
      <FilterPanel.Right lg={18}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("CCT.txt_commercial_terms_code")}
              placeHolder={translate("CCT.plh_commercial_terms_code")}
              value={modelFilter?.code}
              onChange={handleChangeInputFilter({
                fieldName: "code",
              })}
            />
          </Col>
          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("CCT.txt_commercial_terms_name")}
              placeHolder={translate("CCT.plh_commercial_terms_name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
              })}
            />
          </Col>

          {/* Description */}
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("CCT.txt_commercial_terms_describe")}
              placeHolder={translate("CCT.plh_commercial_terms_describe")}
              value={modelFilter?.description}
              onChange={handleChangeInputFilter({
                fieldName: "description",
              })}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
