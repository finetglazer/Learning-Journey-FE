import { Col, Row } from "antd";
import { listAppointmentMethodEnum } from "config/const";
import { formatNumber } from "core/helpers/number";
import { isEmpty } from "lodash";
import { EDirectContractingType, ProposalCreateModel } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import "./DirectContractingDetail.scss";

const DirectContractingDetail = () => {
  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const [translate] = useTranslation();

  const { contractorAppointment } = model;
  const appointmentMethod =
    contractorAppointment?.appointmentMethod as (typeof listAppointmentMethodEnum)[number];

  const isAppointmentMethod =
    appointmentMethod?.id ===
    EDirectContractingType.DIRECT_CONTRACTING_WITH_ASSESSMENT;

  if (isEmpty(contractorAppointment?.appointmentMethod))
    return (
      <div className="direct-contracting_detail_wrapper">
        <div className="body">
          <Row className="item_row">
            <Col span={24} className="item_col bg_grey">
              <span className="label">
                {translate("PP.appointment_method_title")}
              </span>
              <span className="value">---</span>
            </Col>
          </Row>
        </div>
      </div>
    );

  return (
    <div className="direct-contracting_detail_wrapper">
      <div className="body">
        <Row className="item_row">
          <Col span={6} className="item_col bg_grey">
            <span className="label">
              {translate("PP.appointment_method_title")}
            </span>
            <ValueItem value={appointmentMethod?.name} />
          </Col>
          <Col span={6} className="item_col bg_grey">
            <span className="label">
              {translate("PP.contractor_appointment_name_title")}
            </span>
            <ValueItem value={contractorAppointment?.name} />
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
                  {translate("PP.contract_value_type_title")}
                </span>
                <ValueItem
                  value={contractorAppointment?.contractValueType?.name}
                />
              </Col>
            </>
          ) : (
            <Col span={12} className="item_col bg_grey">
              <span className="label">
                {translate("PP.appointment_reason_title")}
              </span>
              <ValueItem value={contractorAppointment?.appointmentReason} />
            </Col>
          )}
        </Row>
        {!isAppointmentMethod && (
          <Row className="item_row">
            <Col span={6} className="item_col">
              <span className="label">
                {translate("PP.appointment_reason_title")}
              </span>
              <ValueItem value={contractorAppointment?.appointmentReason} />
            </Col>
            <Col span={6} className="item_col">
              <span className="label">
                {translate("PP.execution_time_title")}
              </span>
              <ValueItem value={contractorAppointment?.executionTime} />
            </Col>
            <Col span={6} className="item_col">
              <span className="label">{translate("PP.tax_payer_title")}</span>
              <ValueItem value={contractorAppointment?.taxPayer} />
            </Col>
            <Col span={6} className="item_col">
              <span className="label">
                {translate("PP.contract_type_title")}
              </span>
              <ValueItem value={contractorAppointment?.contractType} />
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
            <ValueItem value={contractorAppointment?.supplier?.name} />
          </Col>
          <Col span={6} className="item_col">
            <span className="label">{translate("PP.supplier_code")}</span>
            <ValueItem value={contractorAppointment?.supplier?.code} />
          </Col>
          <Col span={6} className="item_col">
            <span className="label">{translate("PP.supplier_type")}</span>
            <ValueItem value={contractorAppointment?.supplier?.type} />
          </Col>
        </Row>
        {!isAppointmentMethod && (
          <Row className="item_row">
            <Col span={6} className="item_col">
              <span className="label">
                {translate("PP.warranty_content_title")}
              </span>
              <ValueItem value={contractorAppointment?.warrantyContent} />
            </Col>
            <Col span={6} className="item_col">
              <span className="label">
                {translate("PP.guarantee_content_title")}
              </span>
              <ValueItem value={contractorAppointment?.guaranteeContent} />
            </Col>
            <Col span={12} className="item_col">
              <span className="label">
                {translate("PP.payment_condition_title")}
              </span>
              <ValueItem value={contractorAppointment?.paymentTerms} />
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

const ValueItem = ({ value }: { value?: string }) => {
  return <span className="value break-all">{value || "---"}</span>;
};

export default DirectContractingDetail;
