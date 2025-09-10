/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable import/no-unresolved */
import { Col, Row } from "antd";
import { isEqual } from "lodash";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { CircleStatus } from "../../Components/CircleStatus";
import {
  LegalEntityDetail,
  LegalEntityDetailContext,
} from "../../LegalEntityDetail/LegalEntityDetailHooks";
import "./GeneralInformationView.scss";

const GeneralInformation = () => {
  const { model } = useContext<LegalEntityDetail>(LegalEntityDetailContext);

  const [translate] = useTranslation();
  return (
    <div className="legal-entity-view_wrapper">
      <Row className="item_row">
        <Col span={12}>
          <div className="item_col">
            <span className="label">
              {translate("LE.txt_legal_entity_code")}
            </span>
            <span className="value text_blue">{model?.code || "---"}</span>
          </div>
        </Col>
        <Col span={12}>
          <div className="item_col">
            <span className="label">
              {translate("LE.txt_legal_entity_representative")}
            </span>
            <span className="value text_blue">
              {`${model?.representative?.code} - ${model?.representative?.email} - ${model?.representative?.name}`}
            </span>
          </div>
        </Col>
      </Row>

      <Row className="item_row">
        <Col span={12}>
          <Row>
            <Col span={12}>
              <div className="item_col">
                <span className="label">
                  {translate("LE.txt_legal_entity_name")}
                </span>
                <span className="value text_blue">{model?.name || "---"}</span>
              </div>
            </Col>
            <Col span={12}>
              <div className="item_col">
                <span className="label">
                  {translate("LE.txt_legal_entity_tax_code")}
                </span>
                <span className="value text_blue">
                  {model?.taxCode || "---"}
                </span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <div className="item_col">
            <span className="label">
              {translate("LE.txt_legal_entity_representative_position")}
            </span>
            <span className="value text_blue">
              {model?.representativePosition || "---"}
            </span>
          </div>
        </Col>
      </Row>

      <Row className="item_row">
        <Col span={24}>
          <Row>
            <Col span={12}>
              <div className="item_col">
                <span className="label">
                  {translate("LE.txt_legal_entity_address")}
                </span>
                <span className="value text_blue">
                  {model?.address || "---"}
                </span>
              </div>
            </Col>
            <div className="legal-entity-view_checkbox item_col">
              <span className="label">
                {translate("LE.txt_default_legal_entity")}
              </span>
              <span className="value text_blue">
                <CircleStatus
                  active={isEqual(model?.isDefaultLegalEntity, true)}
                />
              </span>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralInformation;
