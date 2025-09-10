import { Col, Row } from "antd";
import { IcInformation } from "assets/icons";
import { STANDARD_DATE_FORMAT_FULL } from "core/config/consts";
import dayjs from "dayjs";
import React from "react";
import { InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./ActualOfferInformation.scss";
import { PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE } from "config/route-const";
import { useHistory } from "react-router-dom";
import { OfferRequest } from "models/PurchasingPlan";
import { isNil } from "lodash";
import { addZStringToDate } from "core/helpers/date-time";

const ActualOfferInformation = ({ data }: { data?: OfferRequest }) => {
  const [translate] = useTranslation();
  const history = useHistory();

  const handleRedirectAdjustPurchasingPlan = (id: string) => {
    if (isNil(id)) {
      return;
    }
    history.push(`${PURCHASE_PLAN_ADJUST_COMPETITIVE_OFFER_VIEW_ROUTE}/${id}`);
  };

  return (
    <div className="actual-offer-information">
      {data?.type === 0 ? (
        <>
          <Row gutter={12}>
            <Col span={8}>
              <span>{translate("PL.txt_time_of_release_of_document")}</span>
              <InputText
                isSmall={false}
                readOnly
                value={
                  data?.releaseDate &&
                  dayjs(addZStringToDate(data?.releaseDate)).format(
                    STANDARD_DATE_FORMAT_FULL
                  )
                }
              />
              {data?.oldReleaseDate && (
                <div className="d-flex align-items-center justify-content-start m-t--3xs">
                  <span className="actual-offer-information__title m-r--3xs">
                    <img src={IcInformation} alt="icon" />
                  </span>
                  <span className="actual-offer-information__title">
                    {translate("PL.txt_time_old")}
                  </span>
                  <span className="actual-offer-information__title m-l--3xs">
                    {data?.oldReleaseDate &&
                      dayjs(addZStringToDate(data?.oldReleaseDate)).format(
                        STANDARD_DATE_FORMAT_FULL
                      )}
                  </span>
                </div>
              )}
            </Col>
            <Col span={8}>
              <span>{translate("PL.txt_bidding_start_time")}</span>
              <InputText
                isSmall={false}
                readOnly
                value={
                  data?.bidStartDate &&
                  dayjs(addZStringToDate(data?.bidStartDate)).format(
                    STANDARD_DATE_FORMAT_FULL
                  )
                }
              />
              {data?.oldBidStartDate && (
                <div className="d-flex align-items-center justify-content-start m-t--3xs">
                  <span className="actual-offer-information__title m-r--3xs">
                    <img src={IcInformation} alt="icon" />
                  </span>
                  <span className="actual-offer-information__title">
                    {translate("PL.txt_time_old")}
                  </span>
                  <span className="actual-offer-information__title m-l--3xs">
                    {data?.oldBidStartDate &&
                      dayjs(addZStringToDate(data?.oldBidStartDate)).format(
                        STANDARD_DATE_FORMAT_FULL
                      )}
                  </span>
                </div>
              )}
            </Col>
            <Col span={8}>
              <span>{translate("PL.txt_bidding_end_time")}</span>
              <InputText
                isSmall={false}
                readOnly
                value={
                  data?.bidEndDate &&
                  dayjs(addZStringToDate(data?.bidEndDate)).format(
                    STANDARD_DATE_FORMAT_FULL
                  )
                }
              />
              {data?.oldBidEndDate && (
                <div className="d-flex align-items-center justify-content-start m-t--3xs">
                  <span className="actual-offer-information__title m-r--3xs">
                    <img src={IcInformation} alt="icon" />
                  </span>
                  <span className="actual-offer-information__title">
                    {translate("PL.txt_time_old")}
                  </span>
                  <span className="actual-offer-information__title m-l--3xs">
                    {data?.oldBidEndDate &&
                      dayjs(addZStringToDate(data?.oldBidEndDate)).format(
                        STANDARD_DATE_FORMAT_FULL
                      )}
                  </span>
                </div>
              )}
            </Col>
          </Row>
          <Row gutter={12} className="m-t--sm">
            <Col span={8}>
              <span>{translate("PL.txt_bid_open_time")}</span>
              <InputText
                isSmall={false}
                readOnly
                value={
                  data?.openBidDate &&
                  dayjs(addZStringToDate(data?.openBidDate)).format(
                    STANDARD_DATE_FORMAT_FULL
                  )
                }
              />
              {data?.oldOpenBidDate && (
                <div className="d-flex align-items-center justify-content-start m-t--3xs">
                  <span className="actual-offer-information__title m-r--3xs">
                    <img src={IcInformation} alt="icon" />
                  </span>
                  <span className="actual-offer-information__title">
                    {translate("PL.txt_time_old")}
                  </span>
                  <span className="actual-offer-information__title m-l--3xs">
                    {data?.oldOpenBidDate &&
                      dayjs(addZStringToDate(data?.oldOpenBidDate)).format(
                        STANDARD_DATE_FORMAT_FULL
                      )}
                  </span>
                </div>
              )}
            </Col>
            <Col span={8}>
              <div
                onClick={() =>
                  handleRedirectAdjustPurchasingPlan(
                    data?.originalPurchasePlanId
                  )
                }
              >
                <span>{translate("PL.txt_applicable_adjustment_code")}</span>
                <InputText
                  className="actual-offer-information_custom_input--primary input-text--readOnly"
                  isSmall={false}
                  readOnly
                  value={data?.originalPurchasePlanCode}
                />
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <Row gutter={12}>
          <Col span={8}>
            <span>{translate("PL.txt_bidding_start_time")}</span>
            <InputText
              isSmall={false}
              readOnly
              value={
                data?.bidStartDate &&
                dayjs(addZStringToDate(data?.bidStartDate)).format(
                  STANDARD_DATE_FORMAT_FULL
                )
              }
            />
            {data?.oldBidStartDate && (
              <div className="d-flex align-items-center justify-content-start m-t--3xs">
                <span className="actual-offer-information__title m-r--3xs">
                  <img src={IcInformation} alt="icon" />
                </span>
                <span className="actual-offer-information__title">
                  {translate("PL.txt_time_old")}
                </span>
                <span className="actual-offer-information__title m-l--3xs">
                  {data?.oldBidStartDate &&
                    dayjs(addZStringToDate(data?.oldBidStartDate)).format(
                      STANDARD_DATE_FORMAT_FULL
                    )}
                </span>
              </div>
            )}
          </Col>
          <Col span={8}>
            <span>{translate("PL.txt_bidding_end_time")}</span>
            <InputText
              isSmall={false}
              readOnly
              value={
                data?.bidEndDate &&
                dayjs(addZStringToDate(data?.bidEndDate)).format(
                  STANDARD_DATE_FORMAT_FULL
                )
              }
            />
            {data?.oldBidEndDate && (
              <div className="d-flex align-items-center justify-content-start m-t--3xs">
                <span className="actual-offer-information__title m-r--3xs">
                  <img src={IcInformation} alt="icon" />
                </span>
                <span className="actual-offer-information__title">
                  {translate("PL.txt_time_old")}
                </span>
                <span className="actual-offer-information__title m-l--3xs">
                  {data?.oldBidEndDate &&
                    dayjs(addZStringToDate(data?.oldBidEndDate)).format(
                      STANDARD_DATE_FORMAT_FULL
                    )}
                </span>
              </div>
            )}
          </Col>
          <Col span={8}>
            <div
              onClick={() =>
                handleRedirectAdjustPurchasingPlan(data?.originalPurchasePlanId)
              }
            >
              <span>{translate("PL.txt_applicable_adjustment_code")}</span>
              <InputText
                className="actual-offer-information_custom_input--primary input-text--readOnly"
                isSmall={false}
                readOnly
                value={data?.originalPurchasePlanCode}
              />
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ActualOfferInformation;
