import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { CheckboxGroup, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import {
  DocumentTypeContext,
  DocumentTypeHooks,
} from "../DocumentTypeMasterHooks";
import { listDocumentTypeStatusEnum } from "./const";
import { DocumentTypeFilter } from "models/DocumentType/DocumentTypeFilter";
import "./DocumentTypeAdvanceFilter.scss";

interface DocumentTypeAdvanceFilterProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const DocumentTypeAdvanceFilter = ({
  setVisible,
}: DocumentTypeAdvanceFilterProps) => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<DocumentTypeHooks>(DocumentTypeContext);

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: DocumentTypeFilter,
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
      className="document-type__advance-filter"
    >
      {/* Checkbox status */}
      <FilterPanel.Left lg={6}>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listDocumentTypeStatusEnum}
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
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("DT.txt_document_type_code")}
              placeHolder={translate("DT.plh_document_type_code")}
              value={modelFilter?.code}
              onChange={handleChangeInputFilter({
                fieldName: "code",
              })}
            />
          </Col>

          {/* Name */}
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("DT.txt_document_type_name")}
              placeHolder={translate("DT.plh_document_type_name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
              })}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
