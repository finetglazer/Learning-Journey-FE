import { Col, Row } from "antd";
import { DESCRIPTION_REGEX } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { Profile } from "models/Profile";
import { TemporaryImportAssetModel } from "models/TemporaryImportAsset/TemporaryImportAsset";
import { useContext } from "react";
import { FormItem, InputText } from "react-components-design-system";
import { useAppSelector } from "rtk/useRedux";
import { TemporaryImportAssetDetailHookContext } from "../../../TemporaryImportAssetDetailHook";

const GenerationInformation = () => {
  const { model, translate, handleChangeSingleField } =
    useContext<TemporaryImportAssetModel>(
      TemporaryImportAssetDetailHookContext
    );
  const profile: Profile = useAppSelector((state) => state.profile);

  return (
    <div className="temporary-import-asset_contract_basic">
      <div className="">
        <Row gutter={12}>
          <Col lg={8}>
            <InputText
              translate={translate}
              label={translate("TIA.temporary_import_asset_creator_label")}
              placeHolder="--"
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={profile?.account?.email + " - " + profile?.account?.name}
            />
          </Col>
          <Col lg={8}>
            <InputText
              translate={translate}
              label={translate("TIA.temporary_import_asset_unit_create_label")}
              placeHolder="--"
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={profile?.businessDepartment?.name}
            />
          </Col>
          <Col lg={8}>
            <InputText
              translate={translate}
              label={translate("TIA.temporary_import_asset_position_label")}
              placeHolder="--"
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={profile?.position?.name}
            />
          </Col>
        </Row>
      </div>
      <div className="p-t--xs">
        <Row gutter={12}>
          <Col lg={8}>
            <InputText
              translate={translate}
              label={translate("TIA.temporary_import_asset_branch_label")}
              placeHolder="--"
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={profile?.businessBranch?.name}
            />
          </Col>
          <Col lg={8}>
            <InputText
              translate={translate}
              label={translate("TIA.temporary_import_asset_branch_unit_label")}
              placeHolder="--"
              allowClear={false}
              readOnly={true}
              isSmall={false}
              value={profile?.businessDepartment?.businessUnitName}
            />
          </Col>
        </Row>
      </div>
      <div className="p-t--xs">
        <Row>
          <Col lg={24}>
            <FormItem
              validateObject={utilService.getValidateObj(model, "description")}
            >
              <InputText
                isRequired
                label={translate(
                  "TIA.temporary_import_asset_description_label"
                )}
                placeHolder={translate(
                  "TIA.temporary_import_asset_description_label_placeholder"
                )}
                allowClear={false}
                isSmall={false}
                onChange={handleChangeSingleField({
                  fieldName: "description",
                })}
                value={model.description}
                regexInput={DESCRIPTION_REGEX}
                translate={translate}
                maxLength={500}
              />
            </FormItem>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GenerationInformation;
