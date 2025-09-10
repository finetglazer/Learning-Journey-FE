import React, { useContext } from "react";
import { Col, Row, Tooltip } from "antd";
import { ContractRequestType } from "models/Settlement";
import { isEqual } from "lodash";
import { formatCurrency } from "core/helpers/number";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";
import { useTranslation } from "react-i18next";
import styles from "./Insight.module.scss";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";

const Insight = () => {
  const [translate] = useTranslation();
  const { model } = useContext(ContractTerminationDetailHookContext);
  const contractPOInfo = model?.contactOrderInfo?.contract;
  const isContract = isEqual(
    model?.contactOrderInfo?.contract?.contractRequestType,
    ContractRequestType.Contract
  );
  const goToContractPage = () => {
    const url = `${window.location.origin}${CONTRACT_ROUTE_VIEW}/${model?.contactOrderInfo?.contract?.id}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <Row gutter={[24, 16]} className="mb-3">
        <Col span={8}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {isContract
                ? translate("CT.txt_contract_principle_name")
                : translate("settlement.purchase_order_txt")}
            </span>
            <div>
              <Tooltip placement="top" title={contractPOInfo?.name}>
                <div className={`${styles["limited-text"]} fw-medium`}>
                  {contractPOInfo?.name}
                </div>
              </Tooltip>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {isContract
                ? translate("AC.txt_contract_number")
                : translate("settlement.purchase_order_number_txt")}
            </span>
            <div>
              <div
                className={`${styles["blue"]} fw-medium cursor-pointer limited-text`}
                onClick={goToContractPage}
              >
                <div className={`${styles["limited-text"]} fw-medium `}>
                  <Tooltip placement={"top"} title={contractPOInfo?.contractNo}>
                    {contractPOInfo?.contractNo}
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {isContract
                ? translate("CT.txt_code_contract_principle")
                : translate("settlement.purchase_order_code")}
            </span>
            <div className={`${styles["limited-text"]} fw-medium`}>
              <Tooltip placement="top" title={contractPOInfo?.code}>
                {contractPOInfo?.code}
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={[24, 16]} className={`${styles["border"]} pt-3`}>
        <Col span={8}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {isContract
                ? translate("AC.txt_contract_total_value")
                : translate("settlement.purchase_order_total_txt")}
            </span>
            <div className={`${styles["limited-text"]} fw-medium`}>
              <Tooltip
                placement="top"
                title={`${formatCurrency({
                  value: contractPOInfo?.total,
                  code: contractPOInfo?.currency,
                })} ${contractPOInfo?.currency}`}
              >
                {formatCurrency({
                  value: contractPOInfo?.total,
                  code: contractPOInfo?.currency,
                })}{" "}
                <span className={`${styles["currency"]}`}>
                  {contractPOInfo?.currency}
                </span>
              </Tooltip>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {translate("AC.txt_contract_validity_period")}
            </span>

            <div className={`${styles["limited-text"]} fw-medium`}>
              <Tooltip
                placement="top"
                title={`${formatDate(
                  contractPOInfo?.effectiveDate,
                  STANDARD_DATE_FORMAT_SLASH
                )} - ${formatDate(
                  contractPOInfo?.endDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}`}
              >
                {formatDate(
                  contractPOInfo?.effectiveDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}{" "}
                -{" "}
                {formatDate(
                  contractPOInfo?.endDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              </Tooltip>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {translate("AC.txt_contract_manager")}
            </span>
            <div>
              <div className={`${styles["limited-text"]} fw-medium`}>
                <Tooltip
                  placement="top"
                  title={`${contractPOInfo?.managerEmail} - ${contractPOInfo?.managerName}`}
                >
                  {`${contractPOInfo?.managerEmail} - ${contractPOInfo?.managerName}`}
                </Tooltip>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Insight;
