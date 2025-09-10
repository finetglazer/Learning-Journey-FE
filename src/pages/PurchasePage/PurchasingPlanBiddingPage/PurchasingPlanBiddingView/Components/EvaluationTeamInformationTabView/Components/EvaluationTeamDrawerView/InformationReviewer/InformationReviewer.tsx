import React from "react";
import "./InformationReviewer.scss";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  currentData?: any;
}

const InformationReviewer = ({ currentData }: Props) => {
  const [translate] = useTranslation();

  return (
    <div className="information_reviewer_detail">
      <Row gutter={24}>
        <Col span={8}>
          <div className="title">{translate("PL.txt_reviewer")}</div>
          <div className="value">{currentData?.user?.name}</div>
        </Col>
        <Col span={8}>
          <div className="title">{translate("PL.purchasing_plan_email")}</div>
          <div className="value">{currentData?.user?.email}</div>
        </Col>
        <Col span={8}>
          <div className="title">
            {translate("PL.drawer_phone_number_supplier")}
          </div>
          <div className="value">{currentData?.user?.phoneNumber}</div>
        </Col>
      </Row>
      <div className="border m-y--sm" />
      <Row gutter={24}>
        <Col span={8}>
          <div className="title text-truncate">
            {translate("PL.competitive_offer.title.position")}
          </div>
          <div className="value">{currentData?.user?.position?.name}</div>
        </Col>
        <Col span={8}>
          <div className="title text-truncate">
            {translate("PL.competitive_offer.title.unit")}
          </div>
          <div className="value">{currentData?.user?.organization?.name}</div>
        </Col>
      </Row>
    </div>
  );
};

export default InformationReviewer;
