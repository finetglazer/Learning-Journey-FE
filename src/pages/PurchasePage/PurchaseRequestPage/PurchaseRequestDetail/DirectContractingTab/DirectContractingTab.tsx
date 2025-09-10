import { Col, Row } from "antd";
import { formatNumber } from "core/helpers/number";
import { isEmpty, isEqual } from "lodash";
import { EDirectContractingType } from "models/Proposal";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../PurchaseRequestDetailHook";
import "./DirectContractingTab.scss";
import {
  listAppointmentMethodEnum,
  listContractValueTypeEnum,
} from "config/const";

const DirectContractingTab = () => {
  const { model } = useContext<PurchaseRequestDetailModel>(
    PurchaseRequestDetailHookContext
  );

  const [translate] = useTranslation();

  const { contractorAppointment } = model?.purchaseProposalId || {};

  const getContractValueType = () => {
    if (!contractorAppointment?.contractValueType) return "---";
    return (
      listContractValueTypeEnum.find(
        (i) => i.id === Number(contractorAppointment?.contractValueType)
      )?.name || "---"
    );
  };

  const getAppointmentMethod = () => {
    return listAppointmentMethodEnum.find((item) =>
      isEqual(item?.id, contractorAppointment?.appointmentMethod)
    );
  };

  const isAppointmentMethod =
    Number(contractorAppointment.appointmentMethod) ===
    EDirectContractingType.DIRECT_CONTRACTING_WITH_ASSESSMENT;

  return (
    <div className="direct-contracting_data_wrapper">
      <div className="body">
        <Row className="item_row">
          <Col span={6} className="item_col bg_grey">
            <span className="label">
              {translate("PP.appointment_method_title")}
            </span>
            <span className="value">
              {getAppointmentMethod()?.name || "---"}
            </span>
          </Col>
          <Col span={6} className="item_col bg_grey">
            <span className="label">
              {translate("PP.contractor_appointment_name_title")}
            </span>
            <span className="value ">
              {contractorAppointment?.name || "---"}
            </span>
          </Col>

          {!isAppointmentMethod ? (
            <>
              <Col span={6} className="item_col bg_grey">
                <span className="label">
                  {translate("PP.contract_value_title")}
                </span>
                <span className="value">
                  {formatNumber(contractorAppointment?.contractValue) || "---"}
                  {!isEmpty(contractorAppointment?.contractValue) && (
                    <span className="label">
                      {" "}
                      {translate("PR.current_vnd")}
                    </span>
                  )}
                </span>
              </Col>
              <Col span={6} className="item_col bg_grey">
                <span className="label">
                  {translate("PP.inclusive_of_tax_text")}
                </span>
                <span className="value">{getContractValueType()}</span>
              </Col>
            </>
          ) : (
            <Col span={12} className="item_col bg_grey">
              <span className="label">
                {translate("PP.appointment_reason_title")}
              </span>
              <span className="value">
                {contractorAppointment?.appointmentReason || "---"}
              </span>
            </Col>
          )}
        </Row>
        {!isAppointmentMethod && (
          <Row className="item_row">
            <Col span={6} className="item_col">
              <span className="label">
                {translate("PP.appointment_reason_title")}
              </span>
              <span className="value">
                {contractorAppointment?.appointmentReason || "---"}
              </span>
            </Col>
            <Col span={6} className="item_col">
              <span className="label">
                {translate("PP.execution_time_title")}
              </span>
              <span className="value">
                {contractorAppointment?.executionTime || "---"}
              </span>
            </Col>
            <Col span={6} className="item_col">
              <span className="label">{translate("PP.tax_payer_title")}</span>
              <span className="value">
                {contractorAppointment?.taxPayer || "---"}
              </span>
            </Col>
            <Col span={6} className="item_col">
              <span className="label">
                {translate("PP.contract_type_title")}
              </span>
              <span className="value">
                {contractorAppointment?.contractType || "---"}
              </span>
            </Col>
          </Row>
        )}
        <Row className="item_row">
          <Col span={6} className="item_col">
            <span className="label">{translate("PP.tax_code_title")}</span>
            <span className="value">
              {contractorAppointment?.supplier?.taxCode || "---"}
            </span>
          </Col>
          <Col span={6} className="item_col">
            <span className="label">{translate("PP.supplier_name")}</span>
            <span className="value">
              {contractorAppointment?.supplier?.name || "---"}
            </span>
          </Col>
          <Col span={6} className="item_col">
            <span className="label">{translate("PP.supplier_code")}</span>
            <span className="value">
              {contractorAppointment?.supplier?.code || "---"}
            </span>
          </Col>
          <Col span={6} className="item_col">
            <span className="label">{translate("PP.supplier_type")}</span>
            <span className="value">
              {contractorAppointment?.supplier?.type || "---"}
            </span>
          </Col>
        </Row>
        {!isAppointmentMethod && (
          <Row className="item_row">
            <Col span={6} className="item_col">
              <span className="label">
                {translate("PP.warranty_content_title")}
              </span>
              <span className="value">
                {contractorAppointment?.warrantyContent || "---"}
              </span>
            </Col>
            <Col span={6} className="item_col">
              <span className="label">
                {translate("PP.guarantee_content_title")}
              </span>
              <span className="value">
                {contractorAppointment?.guaranteeContent || "---"}
              </span>
            </Col>
            <Col span={12} className="item_col">
              <span className="label">
                {translate("PP.payment_condition_title")}
              </span>
              <span className="value">
                {contractorAppointment?.paymentTerms || "---"}
              </span>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default DirectContractingTab;
