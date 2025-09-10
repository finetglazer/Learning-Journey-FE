import React, { useContext } from "react";
import { Col, Row, Tooltip } from "antd";
import { isEmpty } from "lodash";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";
import { useTranslation } from "react-i18next";
import styles from "./InsightBuy.module.scss";

const InsightBuy = () => {
  const [translate] = useTranslation();
  const { model } = useContext(ContractTerminationDetailHookContext);
  const legalEntity = model?.contactOrderInfo?.contract?.legalEntity;
  return (
    <div>
      <Row gutter={[24, 16]} className="mb-3">
        <Col span={8}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {translate("AC.txt_buyer_unit_name")}
            </span>
            <div>
              <div className={`${styles["limited-text"]} fw-medium`}>
                <Tooltip placement="top" title={legalEntity?.name}>
                  {legalEntity?.name}
                </Tooltip>
              </div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {translate("AC.txt_tax_id")}
            </span>
            <div>
              <div className={`${styles["limited-text"]} fw-medium`}>
                <Tooltip placement="top" title={legalEntity?.taxCode}>
                  {legalEntity?.taxCode}
                </Tooltip>
              </div>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {translate("AC.txt_address")}
            </span>
            <div className={`${styles["limited-text"]} fw-medium`}>
              <Tooltip placement="top" title={legalEntity?.address}>
                {legalEntity?.address}
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={[24, 16]} className={`${styles["border"]} pt-3`}>
        <Col span={8}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {translate("AC.txt_representative")}
            </span>
            <div className={`${styles["limited-text"]} fw-medium`}>
              <Tooltip
                placement="top"
                title={
                  isEmpty(legalEntity?.personAgent)
                    ? "--"
                    : legalEntity?.personAgent
                }
              >
                {isEmpty(legalEntity?.personAgent)
                  ? "--"
                  : legalEntity?.personAgent}
              </Tooltip>
            </div>
          </div>
        </Col>
        <Col span={16}>
          <div className="d-flex flex-column">
            <span className={`${styles["label"]}`}>
              {translate("AC.txt_position")}
            </span>
            <div className={`${styles["limited-text"]} fw-medium`}>
              <Tooltip
                placement="top"
                title={
                  isEmpty(legalEntity?.position) ? "--" : legalEntity?.position
                }
              >
                {isEmpty(legalEntity?.position) ? "--" : legalEntity?.position}
              </Tooltip>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default InsightBuy;
