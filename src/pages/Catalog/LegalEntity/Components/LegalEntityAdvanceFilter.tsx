import { Checkbox, Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { InputText, MultipleSelect } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import CommonFilter from "models/CommonFilter";
import { LegalEntityFilter } from "models/LegalEntity/LegalEntityFilter";

import {
  LegalEntityContext,
  LegalEntityHooks,
} from "../LegalEntityMaster/LegalEntityMasterHooks";
import legalEntityRepository from "../LegalEntityRepository";
import "./LegalEntityAdvanceFilter.scss";
import { t } from "i18next";

interface LegalEntityAdvanceFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const listBoolean = () => [
  { value: true, label: t("LE.txt_default_legal_entity") },
  { value: false, label: t("LE.txt_not_default_legal_entity") },
];

export const LegalEntityAdvanceFilter = ({
  setVisible,
}: LegalEntityAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<LegalEntityHooks>(LegalEntityContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: LegalEntityFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeMultipleSelectFilter,
    handleChangeAllFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

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
      className="legal-entity__advance-filter"
    >
      {/* More fields */}
      <FilterPanel.Right lg={24}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("LE.txt_legal_entity_code")}
              placeHolder={translate("LE.plh_legal_entity_input_code")}
              value={modelFilter?.legalEntityCode}
              onChange={handleChangeInputFilter({
                fieldName: "legalEntityCode",
              })}
              isSmall={false}
            />
          </Col>

          {/* Name */}
          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("LE.txt_legal_entity_name")}
              placeHolder={translate("LE.plh_legal_entity_name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
              })}
              isSmall={false}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("LE.txt_legal_entity_tax_code")}
              placeHolder={translate("LE.plh_legal_entity_input_tax_code")}
              value={modelFilter?.legalEntityTaxCode}
              onChange={handleChangeInputFilter({
                fieldName: "legalEntityTaxCode",
              })}
              isSmall={false}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("LE.txt_legal_entity_address")}
              placeHolder={translate("LE.plh_legal_entity_input_address")}
              value={modelFilter?.address}
              onChange={handleChangeInputFilter({
                fieldName: "address",
              })}
              isSmall={false}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.representativeIdsValue || []}
              label={translate("LE.txt_legal_entity_representative")}
              placeHolder={translate(
                "LE.plh_legal_entity_input_representative"
              )}
              getList={legalEntityRepository.getRepresentative}
              classFilter={CommonFilter}
              isSmall={false}
              searchType=""
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "representativeIds",
              })}
              isEnumerable={false}
              valueFilter={{
                name: "",
              }}
            />
          </Col>

          <Col lg={12} className="m-b--md">
            <InputText
              label={translate("LE.txt_legal_entity_representative_position")}
              placeHolder={translate(
                "LE.plh_legal_entity_input_authorized_person_position"
              )}
              value={modelFilter?.representativePosition}
              onChange={handleChangeInputFilter({
                fieldName: "representativePosition",
              })}
              isSmall={false}
            />
          </Col>
        </Row>
        <Row className="m-b--sm">
          <Checkbox.Group
            options={listBoolean()}
            value={modelFilter?.isDefaultLegalEntities}
            onChange={(checkedValue: boolean[]) => {
              handleChangeAllFilter({
                ...modelFilter,
                isDefaultLegalEntities: checkedValue,
              });
            }}
          ></Checkbox.Group>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
