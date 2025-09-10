import { Col, Row } from "antd";
import classNames from "classnames";
import { OfferRequest, PurchasingPlanModel } from "models/PurchasingPlan";
import { InputNumber } from "react-components-design-system";

const BiddingPackageInformation = ({
  contextValue,
  data,
}: {
  contextValue: PurchasingPlanModel;
  data?: OfferRequest;
}) => {
  const { translate } = contextValue;

  return (
    <div className="bidding-package-information">
      <Row className={classNames("align-center")} align="middle" gutter={184}>
        <Col span={12} className={classNames("align-center mt-2")}>
          <Row align="middle">
            <Col span={18}>
              {translate("PL.competitive_offer.title.bidding_start_time")}
            </Col>
            <Col span={6}>
              <Row align="middle" justify="end" gutter={12}>
                <Col>+</Col>
                <Col>
                  <InputNumber
                    allowClear={false}
                    isSmall={true}
                    placeHolder="--"
                    className="input-day"
                    max={1000}
                    min={0}
                    allowNegative={false}
                    readOnly
                    value={data?.releaseDays}
                  />
                </Col>
                <Col>{translate("PL.bidding.title.unit_day")}</Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={12} className={classNames("align-center mt-2")}>
          <Row align="middle">
            <Col span={18}>
              {translate("PL.competitive_offer.title.bidding_end_time")}
            </Col>
            <Col span={6}>
              <Row align="middle" justify="end" gutter={12}>
                <Col>+</Col>
                <Col>
                  <InputNumber
                    allowClear={false}
                    isSmall={true}
                    placeHolder="--"
                    className="input-day"
                    max={1000}
                    min={0}
                    allowNegative={false}
                    readOnly
                    value={data?.bidEndDays}
                  />
                </Col>
                <Col>{translate("PL.bidding.title.unit_day")}</Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className={classNames("align-center")} align="middle" gutter={184}>
        <Col span={12} className={classNames("align-center mt-2")}>
          <Row align="middle">
            <Col span={18}>
              {translate(
                "PL.competitive_offer.title.time_of_release_of_document"
              )}
            </Col>
            <Col span={6}>
              <Row align="middle" justify="end" gutter={12}>
                <Col>+</Col>
                <Col>
                  <InputNumber
                    allowClear={false}
                    isSmall={true}
                    placeHolder="--"
                    className="input-day"
                    max={1000}
                    min={0}
                    allowNegative={false}
                    readOnly
                    value={data?.bidStartDays}
                  />
                </Col>
                <Col>{translate("PL.bidding.title.unit_day")}</Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={12} className={classNames("align-center mt-2")}>
          <Row align="middle">
            <Col span={18}>
              {translate("PL.competitive_offer.title.bid_closing_time")}
            </Col>
            <Col span={6}>
              <Row align="middle" justify="end" gutter={12}>
                <Col>+</Col>
                <Col>
                  <InputNumber
                    allowClear={false}
                    isSmall={true}
                    placeHolder="--"
                    className="input-day"
                    max={1000}
                    min={0}
                    allowNegative={false}
                    readOnly
                    value={data?.openBidDays}
                  />
                </Col>
                <Col>{translate("PL.bidding.title.unit_day")}</Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default BiddingPackageInformation;
