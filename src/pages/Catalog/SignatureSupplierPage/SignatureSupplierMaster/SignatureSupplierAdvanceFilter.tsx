import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { SignatureSupplierFilter } from "models/SignatureSupplier";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  DateRangePicker,
  InputText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  SignatureSupplierMasterContext,
  SignatureSupplierMasterContextModel,
} from "./SignatureSupplierMasterHook";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface SignatureSupplierMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SignatureSupplierMasterAdvanceFilter = ({
  setVisible,
}: SignatureSupplierMasterAdvanceFilterProps) => {
  const signatureSupplierMaster =
    useContext<SignatureSupplierMasterContextModel>(
      SignatureSupplierMasterContext
    );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = signatureSupplierMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: SignatureSupplierFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeDateFilter,
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
      handleApplyFilter={handleApplyFilter}
      handleResetFilter={handleResetFilter}
      handleClearModelFilter={handleClearFilter}
      modelFilter={modelFilter}
      handleClickOutside={handleClickOutside}
      handleToggleFilter={setVisible}
    >
      <FilterPanel.Left lg={6}>
        <CheckboxGroup
          label={translate("CM.txt_status")}
          dataOptions={listStatus()}
          values={modelFilter?.statusId}
          onChange={handleChangeCheckboxFilter({
            fieldName: "status",
          })}
        />
      </FilterPanel.Left>
      <FilterPanel.Right lg={18}>
        <Row gutter={16}>
          {/* Code */}
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("signatureSuppliers.code")}
              placeHolder={translate("signatureSuppliers.placeholder.code")}
              value={modelFilter?.code}
              onChange={handleChangeInputFilter({
                fieldName: "code",
                classFilter: StringFilter,
              })}
            />
          </Col>

          {/* Name */}
          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("signatureSuppliers.name")}
              placeHolder={translate("signatureSuppliers.placeholder.name")}
              value={modelFilter?.name}
              onChange={handleChangeInputFilter({
                fieldName: "name",
                classFilter: StringFilter,
              })}
            />
          </Col>

          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("signatureSuppliers.description")}
              placeHolder={translate(
                "signatureSuppliers.placeholder.description"
              )}
              value={modelFilter?.description}
              onChange={handleChangeInputFilter({
                fieldName: "description",
                classFilter: StringFilter,
              })}
            />
          </Col>
        </Row>
      </FilterPanel.Right>
    </FilterPanel>
  );
};
