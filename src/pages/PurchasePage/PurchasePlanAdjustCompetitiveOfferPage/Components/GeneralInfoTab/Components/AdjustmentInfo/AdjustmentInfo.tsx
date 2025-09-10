import { Col, Row } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, FormItem, TextArea } from "react-components-design-system";

import { DATE_FORMAT } from "components/OpinionCollector/Components/CollectOpinionModal/CollectOpinionModal";
import {
  DEFAULT_DATETIME_VALUE,
  MAX_LENGTH_500,
  STANDARD_DATE_FORMAT_FULL,
  TIME_FORMAT,
} from "core/config/consts";
import {
  convertUTCTimeToVietnamTimezone,
  formatDate,
  formatDateTime,
  getDisabledTime,
} from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";

import OutlinedInfoIcon from "assets/icons/Common/OutlinedInfoIcon";
import { PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS } from "config/const";
import { isNil } from "lodash";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";
import { useTranslation } from "react-i18next";
import styles from "./AdjustmentInfo.module.scss";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";
import { ColumnKey } from "models/PurchasingPlan";
import { ShoppingMethod } from "models/Contract";
import { useHistory } from "react-router";
import { PURCHASE_PLAN_ADJUST_BID_ROUTE } from "config/route-const";
import { useCallback, useMemo } from "react";

const DATE_PLACEHOLDER = "dd/mm/yyyy hh:mm";

interface InfoFormItemProps {
  value: string;
}
interface AdjustmentInfoProps {
  isDetail?: boolean;
  contextValue:
    | PurchasePlanAdjustCompetitiveOfferDetailHookContextProps
    | PurchasePlanAdjustBidDetailHookContextProps;
  fieldData?: string;
  fieldDataOld?: string;
}

const InfoFormItem = ({ value }: InfoFormItemProps) => {
  const [translate] = useTranslation();

  if (isNil(value)) return;

  return (
    <div className="d-flex gap-1 align-items-center mt-1">
      <OutlinedInfoIcon />
      <span className={styles["old-item-text"]}>
        {translate("PPA.old_time", {
          dateTime: formatDateTime(
            convertUTCTimeToVietnamTimezone(value),
            STANDARD_DATE_FORMAT_FULL
          ),
        })}
      </span>
    </div>
  );
};

const AdjustmentInfo = ({
  isDetail = false,
  contextValue,
  fieldData = ColumnKey.OFFER_REQUEST,
  fieldDataOld = ColumnKey.OFFER_REQUEST_OLD,
}: AdjustmentInfoProps) => {
  const [translate] = useTranslation();
  const history = useHistory();
  const { model, handleChangeSingleField, isCreatePage } = contextValue;

  const dataRequest = useMemo(() => model?.[fieldData], [fieldData, model]);

  const dataRequestOld = useMemo(
    () => model?.[fieldDataOld],
    [fieldDataOld, model]
  );

  const isAdjustBid = useMemo(() => {
    return (
      model?.purchasePlanType === ShoppingMethod.BIDDING &&
      history.location.pathname.includes(PURCHASE_PLAN_ADJUST_BID_ROUTE)
    );
  }, [history.location.pathname, model?.purchasePlanType]);

  const ticketStatus = useMemo(() => {
    return isCreatePage ? model?.status : model?.oldOriginalPurchasePlanStatus;
  }, [isCreatePage, model?.oldOriginalPurchasePlanStatus, model?.status]);

  const handleChangeOfferRequestDate = useCallback(
    (date: Dayjs, fieldName: string) => {
      handleChangeSingleField({ fieldName: fieldData })({
        ...dataRequest,
        [fieldName]: date,
      });
    },
    [dataRequest, fieldData, handleChangeSingleField]
  );

  const getErrorValidateFieldData = (fieldName = "releaseDate") => {
    return utilService.getValidateObj(model, `${fieldData}.${fieldName}`);
  };

  return (
    <div className="d-flex flex-column gap-2">
      <Row>
        <Col span={24}>
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              "adjustmentDescription"
            )}
          >
            <TextArea
              label={translate("PPA.description_of_adjustments")}
              placeHolder={translate("PPA.enter_description_of_adjustments")}
              resize="none"
              maxLength={MAX_LENGTH_500}
              translate={translate}
              rows={3}
              value={model?.adjustmentDescription}
              onChange={(value) => {
                isAdjustBid
                  ? (model.adjustmentDescription = value)
                  : handleChangeSingleField({
                      fieldName: "adjustmentDescription",
                    })(value);
              }}
              isRequired={!isDetail}
              showCount
              readOnly={isDetail}
            />
          </FormItem>
        </Col>
      </Row>
      <div className="d-flex flex-column gap-3">
        <Row gutter={12}>
          {ticketStatus !==
            PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING && (
            <Col span={8}>
              <FormItem validateObject={getErrorValidateFieldData()}>
                <DatePicker
                  readOnly={
                    isDetail ||
                    (!isDetail &&
                      ticketStatus !==
                        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_APPROVED)
                  }
                  label={translate("PPA.start_time_of_document_issuance")}
                  placeholder={DATE_PLACEHOLDER}
                  dateFormat={DATE_FORMAT}
                  isSmall={false}
                  showTime={{ format: TIME_FORMAT }}
                  minDate={dayjs(
                    formatDate(new Date()),
                    DEFAULT_DATETIME_VALUE
                  )}
                  disabledTime={getDisabledTime}
                  value={
                    dataRequest?.releaseDate
                      ? dayjs(dataRequest?.releaseDate)
                      : undefined
                  }
                  onChange={(value) => {
                    handleChangeOfferRequestDate(value, "releaseDate");
                  }}
                  isRequired={
                    !isDetail &&
                    ticketStatus ===
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.PROFILE_APPROVED
                  }
                />
              </FormItem>
              <InfoFormItem value={dataRequestOld?.releaseDate} />
            </Col>
          )}

          <Col span={8}>
            <FormItem
              validateObject={getErrorValidateFieldData("bidStartDate")}
            >
              <DatePicker
                isRequired={
                  !isDetail &&
                  ![
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BID,
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING,
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_QUOTE,
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.EVALUATE_QUOTATION,
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_FOR_OPEN_PROFILE,
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.OPEN_PROFILE,
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING,
                  ].includes(ticketStatus)
                }
                readOnly={
                  isDetail ||
                  (!isDetail &&
                    [
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BID,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_QUOTE,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.EVALUATE_QUOTATION,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_FOR_OPEN_PROFILE,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.OPEN_PROFILE,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING,
                    ].includes(ticketStatus))
                }
                label={
                  isAdjustBid
                    ? translate("PPA.bidding_start_time")
                    : translate("PPA.txt_start_time_of_price_offer")
                }
                placeholder={DATE_PLACEHOLDER}
                dateFormat={DATE_FORMAT}
                isSmall={false}
                showTime={{ format: TIME_FORMAT }}
                minDate={dayjs(formatDate(new Date()), DEFAULT_DATETIME_VALUE)}
                disabledTime={getDisabledTime}
                value={
                  dataRequest?.bidStartDate
                    ? dayjs(dataRequest?.bidStartDate)
                    : undefined
                }
                onChange={(value) => {
                  handleChangeOfferRequestDate(value, "bidStartDate");
                }}
              />
            </FormItem>
            <InfoFormItem value={dataRequestOld?.bidStartDate} />
          </Col>
          <Col span={8}>
            <FormItem validateObject={getErrorValidateFieldData("bidEndDate")}>
              <DatePicker
                isRequired={
                  !isDetail &&
                  ![
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_FOR_OPEN_PROFILE,
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.OPEN_PROFILE,
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING,
                    PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.EVALUATE_QUOTATION,
                  ].includes(ticketStatus)
                }
                readOnly={
                  isDetail ||
                  (!isDetail &&
                    [
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_FOR_OPEN_PROFILE,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.OPEN_PROFILE,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.EVALUATE_QUOTATION,
                    ].includes(ticketStatus))
                }
                label={
                  isAdjustBid
                    ? translate("PPA.bidding_end_time")
                    : translate("PPA.txt_end_time_of_price_offer")
                }
                placeholder={DATE_PLACEHOLDER}
                dateFormat={DATE_FORMAT}
                isSmall={false}
                showTime={{ format: TIME_FORMAT }}
                minDate={dayjs(formatDate(new Date()), DEFAULT_DATETIME_VALUE)}
                disabledTime={getDisabledTime}
                value={
                  dataRequest?.bidEndDate
                    ? dayjs(dataRequest?.bidEndDate)
                    : undefined
                }
                onChange={(value) => {
                  handleChangeOfferRequestDate(value, "bidEndDate");
                }}
              />
            </FormItem>
            <InfoFormItem value={dataRequestOld?.bidEndDate} />
          </Col>
        </Row>
        {ticketStatus !==
          PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATING && (
          <Row gutter={12}>
            <Col span={8}>
              <FormItem
                validateObject={getErrorValidateFieldData("openBidDate")}
              >
                <DatePicker
                  isRequired={
                    !isDetail &&
                    ![
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.EVALUATE_QUOTATION,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.OPEN_PROFILE,
                      PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING,
                    ].includes(ticketStatus)
                  }
                  readOnly={
                    isDetail ||
                    (!isDetail &&
                      [
                        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.EVALUATE_QUOTATION,
                        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.OPEN_PROFILE,
                        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING,
                      ].includes(ticketStatus))
                  }
                  label={
                    isAdjustBid
                      ? translate("PPA.document_opening_time")
                      : translate("PPA.opening_time_of_price_offer")
                  }
                  placeholder={DATE_PLACEHOLDER}
                  dateFormat={DATE_FORMAT}
                  isSmall={false}
                  showTime={{ format: TIME_FORMAT }}
                  minDate={dayjs(
                    formatDate(new Date()),
                    DEFAULT_DATETIME_VALUE
                  )}
                  disabledTime={getDisabledTime}
                  value={
                    dataRequest?.openBidDate
                      ? dayjs(dataRequest?.openBidDate)
                      : undefined
                  }
                  onChange={(value) => {
                    handleChangeOfferRequestDate(value, "openBidDate");
                  }}
                />
              </FormItem>
              <InfoFormItem value={dataRequestOld?.openBidDate} />
            </Col>
            {isAdjustBid && (
              <>
                <Col span={8}>
                  <FormItem
                    validateObject={getErrorValidateFieldData(
                      "evaluateStartDate"
                    )}
                  >
                    <DatePicker
                      label={translate("PPA.bid_evaluation_start_time")}
                      placeholder={DATE_PLACEHOLDER}
                      dateFormat={DATE_FORMAT}
                      isSmall={false}
                      showTime={{ format: TIME_FORMAT }}
                      minDate={dayjs(
                        formatDate(new Date()),
                        DEFAULT_DATETIME_VALUE
                      )}
                      disabledTime={getDisabledTime}
                      value={
                        dataRequest?.evaluateStartDate
                          ? dayjs(dataRequest?.evaluateStartDate)
                          : undefined
                      }
                      onChange={(value) => {
                        handleChangeOfferRequestDate(
                          value,
                          "evaluateStartDate"
                        );
                      }}
                      isRequired={
                        !isDetail &&
                        ![
                          PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.EVALUATE_QUOTATION,
                          PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING,
                        ].includes(ticketStatus)
                      }
                      readOnly={
                        isDetail ||
                        (!isDetail &&
                          [
                            PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.EVALUATE_QUOTATION,
                            PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING,
                          ].includes(ticketStatus))
                      }
                    />
                  </FormItem>
                  {dataRequestOld?.evaluateStartDate && (
                    <InfoFormItem value={dataRequestOld?.evaluateStartDate} />
                  )}
                </Col>
                <Col span={8}>
                  <FormItem
                    validateObject={getErrorValidateFieldData(
                      "evaluateEndDate"
                    )}
                  >
                    <DatePicker
                      label={translate("PPA.bid_evaluation_end_time")}
                      placeholder={DATE_PLACEHOLDER}
                      dateFormat={DATE_FORMAT}
                      isSmall={false}
                      showTime={{ format: TIME_FORMAT }}
                      minDate={dayjs(
                        formatDate(new Date()),
                        DEFAULT_DATETIME_VALUE
                      )}
                      disabledTime={getDisabledTime}
                      value={
                        dataRequest?.evaluateEndDate
                          ? dayjs(dataRequest?.evaluateEndDate)
                          : undefined
                      }
                      onChange={(value) => {
                        handleChangeOfferRequestDate(value, "evaluateEndDate");
                      }}
                      isRequired={
                        !isDetail &&
                        PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.EVALUATE_QUOTATION !==
                          ticketStatus
                      }
                      readOnly={
                        isDetail ||
                        (!isDetail &&
                          PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.EVALUATE_QUOTATION ===
                            ticketStatus)
                      }
                    />
                  </FormItem>
                  {dataRequestOld?.evaluateEndDate && (
                    <InfoFormItem value={dataRequestOld?.evaluateEndDate} />
                  )}
                </Col>
              </>
            )}
          </Row>
        )}
      </div>
    </div>
  );
};

export default AdjustmentInfo;
