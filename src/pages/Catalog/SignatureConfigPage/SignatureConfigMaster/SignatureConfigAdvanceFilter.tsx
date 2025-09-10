import { Col, Row } from "antd";
import FilterPanel from "components/FilterPanel/FilterPanel";
import { filterAdvanceService } from "core/services/page-services/filter-advance-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import { t } from "i18next";
import { SignatureConfigFilter } from "models/SignatureConfig";
import { useContext, useEffect } from "react";
import { StringFilter } from "react-3layer-advance-filters";
import {
  CheckboxGroup,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  SignatureConfigMasterContext,
  SignatureConfigMasterContextModel,
} from "./SignatureConfigMasterHook";
import { AppUserFilter } from "models/AppUser";
import { signatureConfigRepository } from "../SignatureConfigRepository";

export const listStatus = () => [
  { id: 1, code: "ACTIVE", name: t("CL.active_status_txt") },
  {
    id: 0,
    code: "IN_ACTIVE",
    name: t("CL.deactivate_status_full_txt"),
  },
];

interface SignatureConfigMasterAdvanceFilterProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SignatureConfigMasterAdvanceFilter = ({
  setVisible,
}: SignatureConfigMasterAdvanceFilterProps) => {
  const signatureConfigMaster = useContext<SignatureConfigMasterContextModel>(
    SignatureConfigMasterContext
  );
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = signatureConfigMaster;

  const [translate] = useTranslation();

  const {
    handleResetFilter,
    handleClearFilter,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    handleClickOutside,
  } = filterAdvanceService.useFilterAdvance({
    ModelFilterClass: SignatureConfigFilter,
    filter,
    updateFilter,
    handleCloseFilter: () => setVisible(false),
    handleLoadList,
  });

  const {
    handleChangeInputFilter,
    handleChangeCheckboxFilter,
    handleChangeMultipleSelectFilter,
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
          <Col lg={24} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.userValue || []}
              label={translate("signatureConfigs.user")}
              placeHolder={translate("signatureConfigs.placeholder.user")}
              getList={signatureConfigRepository.listUser}
              classFilter={AppUserFilter}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "user",
              })}
              isSmall={true}
              searchProperty="search"
              searchType={null}
              isEnumerable={false}
              appendToBody
            />
          </Col>

          <Col lg={24} className="m-b--md">
            <MultipleSelect
              values={modelFilter?.signatureSupplierValue || []}
              label={translate("signatureConfigs.signatureSupplier")}
              placeHolder={translate(
                "signatureConfigs.placeholder.signatureSupplier"
              )}
              getList={signatureConfigRepository.listSignaturesupplier}
              classFilter={AppUserFilter}
              onChange={handleChangeMultipleSelectFilter({
                fieldName: "signatureSupplier",
              })}
              isSmall={true}
              searchProperty="search"
              searchType={null}
              isEnumerable={false}
              appendToBody
            />
          </Col>

          <Col lg={24} className="m-b--md">
            <InputText
              label={translate("signatureConfigs.description")}
              placeHolder={translate(
                "signatureConfigs.placeholder.description"
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
