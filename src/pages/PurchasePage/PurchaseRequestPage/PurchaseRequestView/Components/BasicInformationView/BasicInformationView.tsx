import { Col, Row } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { PurchaseRequestDetailHookContext } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestDetail/PurchaseRequestDetailHook";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import "./BasicInformationView.scss";

const BasicInformationView = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);

  const { model, handleClickOriginalCode } =
    useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <div className="purchase_request_basic_info_view_wrapper">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{translate("PR.basic_info")}</div>
        <div>
          <img
            className={classNames("cursor-pointer", {
              "rotate-180": collapse,
              "rotate-0": !collapse,
            })}
            src={IcArrowDown}
            alt="img"
            width={16}
            height={16}
          />
        </div>
      </div>
      {collapse && (
        <div className="body">
          {model?.isAdjust && (
            <Row className="item_row">
              <Col span={16} className="item_col bg_grey">
                <span className="label">
                  {translate("PR.purchase_request_adjust_description")}
                </span>
                <span className="value">{model?.description}</span>
              </Col>
              <Col span={8} className="item_col bg_grey">
                <span className="label">
                  {translate("PR.originaled_purchasing_requirements_code")}
                </span>
                <div
                  className="value cursor-pointer"
                  onClick={() =>
                    handleClickOriginalCode(model?.originalPurchaseRequestId)
                  }
                >
                  <span className="value text_blue">
                    {model?.originalPurchaseRequestCode}
                  </span>
                </div>
              </Col>
            </Row>
          )}
          <Row className="item_row">
            <Col
              span={16}
              className={classNames("item_col", {
                bg_grey: !model?.isAdjust,
              })}
            >
              <span className="label">
                {translate("PR.table_purchase_request_name")}
              </span>
              <span className="value">{model?.name}</span>
            </Col>
            <Col
              span={8}
              className={classNames("item_col", {
                bg_grey: !model?.isAdjust,
              })}
            >
              <span className="label">
                {translate("PR.expected_receipt_date")}
              </span>
              <span className="value">
                {formatDate(
                  model?.expectedReceiveDate,
                  STANDARD_DATE_FORMAT_SLASH
                ) || "---"}
              </span>
            </Col>
          </Row>
          <Row className="item_row">
            <Col span={8} className="item_col">
              <span className="label">{translate("PR.purchase_form")}</span>
              <span className="value">{model?.purchasingMethod?.name}</span>
            </Col>
            <Col span={8} className="item_col">
              <span className="label">
                {translate("PR.filter_purchase_purchase_unit")}
              </span>
              <span className="value ">
                {model?.purchaseOrganization?.name || "---"}
              </span>
            </Col>
            <Col span={8} className="item_col">
              <span className="label">{translate("PR.user_create")}</span>
              <span className="value">
                {model?.user?.email} - {model?.user?.name}
              </span>
            </Col>
          </Row>
          <Row className="item_row">
            <Col span={8} className="item_col">
              <span className="label">{translate("PR.branch_create")}</span>
              <span className="value">
                {model?.businessBranch?.name || "---"}
              </span>
            </Col>
            <Col span={8} className="item_col">
              <span className="label">{translate("PR.creating_unit")}</span>
              <span className="value">
                {model?.organization?.name || "---"}
              </span>
            </Col>
            <Col span={8} className="item_col">
              <span className="label">{translate("PR.position")}</span>
              <span className="value">{model?.position?.name || "---"}</span>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default BasicInformationView;
