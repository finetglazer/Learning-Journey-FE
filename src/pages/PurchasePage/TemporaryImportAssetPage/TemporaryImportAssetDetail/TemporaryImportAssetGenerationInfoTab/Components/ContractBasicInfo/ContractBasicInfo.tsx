import { TemporaryImportAssetModel } from "models/TemporaryImportAsset/TemporaryImportAsset";
import { useContext } from "react";
import { TemporaryImportAssetDetailHookContext } from "../../../TemporaryImportAssetDetailHook";
import { Col, Row } from "antd";
import {
  BORDER_TYPE,
  FormItem,
  InputText,
} from "react-components-design-system";
import { ChevronDown } from "@carbon/icons-react";
import { utilService } from "core/services/common-services/util-service";
import "./ContractBasicInfo.scss";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";

const ContractBasicInfo = () => {
  const { translate, model, setIsModalChooseContract } =
    useContext<TemporaryImportAssetModel>(
      TemporaryImportAssetDetailHookContext
    );
  const handleOpenModalSupplier = () => {
    setIsModalChooseContract(true);
  };

  const ClickViewContract = (id: string) => {
    window.open(
      `${window.location.origin}${CONTRACT_ROUTE_VIEW}/${id}`,
      "_blank"
    );
  };

  return (
    <div className="temporary-import-asset_contract_basic">
      <div className="">
        <Row gutter={12}>
          <Col lg={8}>
            <div onClick={handleOpenModalSupplier}>
              <FormItem
                validateObject={utilService.getValidateObj(model, "contractId")}
              >
                <InputText
                  label={translate(
                    "TIA.temporary_import_asset_contract_code_label"
                  )}
                  placeHolder={translate(
                    "TIA.temporary_import_asset_contract_code_label_placeholder"
                  )}
                  isRequired
                  type={BORDER_TYPE.BORDERED}
                  isSmall={false}
                  value={model?.contractCurrent?.code}
                  autoFocusInput={false}
                  suffix={<ChevronDown />}
                  readOnly={true}
                  className={
                    "temporary-import-asset_contract_basic_custom_input--disabled"
                  }
                />
              </FormItem>
            </div>
          </Col>
          <Col lg={8}>
            <div onClick={() => ClickViewContract(model?.contractCurrent?.id)}>
              <InputText
                label={translate(
                  "TIA.temporary_import_asset_contract_number_label"
                )}
                placeHolder={"--"}
                type={BORDER_TYPE.BORDERED}
                isSmall={false}
                value={model?.contractCurrent?.contractNo}
                readOnly={true}
                className="temporary-import-asset_contract_basic_custom_input--primary input-text--primary"
              />
            </div>
          </Col>
          <Col lg={8}>
            <InputText
              label={translate(
                "TIA.temporary_import_asset_contract_name_label"
              )}
              placeHolder={"--"}
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              value={model?.contractCurrent?.name}
              readOnly={true}
            />
          </Col>
        </Row>
      </div>
      <div className="p-t--xs">
        <Row gutter={12}>
          <Col lg={8}>
            <InputText
              label={translate(
                "TIA.temporary_import_asset_supplier_code_label"
              )}
              placeHolder={"--"}
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              value={model?.contractCurrent?.supplierTaxCode}
              readOnly={true}
            />
          </Col>
          <Col lg={8}>
            <InputText
              label={translate("TIA.temporary_import_asset_supplier_label")}
              placeHolder={"--"}
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              value={model?.contractCurrent?.supplierName}
              readOnly={true}
            />
          </Col>
          <Col lg={8}>
            <InputText
              label={translate("TIA.temporary_import_asset_currency_label")}
              placeHolder={"--"}
              type={BORDER_TYPE.BORDERED}
              isSmall={false}
              value={model?.contractCurrent?.currency}
              readOnly={true}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContractBasicInfo;
