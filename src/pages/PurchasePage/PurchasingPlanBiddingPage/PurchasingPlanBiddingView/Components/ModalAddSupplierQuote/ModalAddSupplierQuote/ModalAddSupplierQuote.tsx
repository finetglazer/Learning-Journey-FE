/* eslint-disable import/no-unresolved */
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
// Constants & Services
import {
  DEFAULT_DATETIME_VALUE,
  TIME_FORMAT,
  WIDTH_1000,
} from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
// UI Components
import { DatePicker, FormItem, Modal } from "react-components-design-system";
// Styles
import styles from "./ModalAddSupplierQuote.module.scss";
import SupplierInformationTable from "./SupplierInformationTable/SupplierInformationTable";
import { Col, Row } from "antd";
import { DATE_FORMAT } from "components/OpinionCollector/Components/CollectOpinionModal/CollectOpinionModal";
import {
  formatDate,
  getDisabledTimeOpenBid,
  getDisabledTimeSelected,
  getISOStringDate,
} from "core/helpers/date-time";
import {
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
  SupplierQuotationAction,
} from "models/PurchasingPlan/PurchasingPlan";
import { isEqual } from "lodash";

type Props = {
  open: boolean;
  handleCancel: () => void;
  onPressConfirm?: (model: PurchasingPlanTypeModel) => void;
  titleModel?: string;
  titleList?: string;
  idContainer?: string;
  isNotConfirmDelete?: boolean;
  actionQuote?: SupplierQuotationAction;
  contextValue: PurchasingPlanModel;
  loading?: boolean;
};

const ModalAddSupplierQuote = ({
  open,
  handleCancel,
  onPressConfirm,
  titleModel,
  titleList,
  idContainer,
  isNotConfirmDelete,
  actionQuote,
  contextValue,
  loading,
}: Props) => {
  const [translate] = useTranslation();

  //actionQuote
  const isNegotiationRound = isEqual(
    actionQuote,
    SupplierQuotationAction.AddNegotiationRound
  );
  //data change

  const handleSaveModal = () => onPressConfirm?.(contextValue.model);

  // đây là biến dùng để change data, lưu và submit
  const masterSupplierAddQuote = contextValue?.model?.masterSupplierAddQuote;

  const handleChangeOfferRequestDate = (
    value: dayjs.Dayjs | null,
    field: string
  ) => {
    const dateValue = getISOStringDate(value);

    contextValue.handleChangeAllField({
      ...contextValue?.model,
      errors: {
        ...contextValue?.model?.errors,
        [field]: null,
      },
      masterSupplierAddQuote: {
        ...masterSupplierAddQuote,
        [field]: dateValue,
      },
    });
  };

  // Sửa lại useEffect để clear fields khi modal mở
  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (open) {
      if (isEqual(actionQuote, SupplierQuotationAction.AddSupplierQuotation)) {
        // Gọi lần đầu ngay lập tức
        handleChangeOfferRequestDate(dayjs(), "releaseDate");

        // Sau đó set interval để gọi lại sau mỗi 30s
        intervalId = setInterval(() => {
          handleChangeOfferRequestDate(dayjs(), "releaseDate");
        }, 300000);
      } else {
        // Gọi lần đầu ngay lập tức
        handleChangeOfferRequestDate(dayjs(), "roundStartDate");

        // Sau đó set interval để gọi lại sau mỗi 30s
        intervalId = setInterval(() => {
          handleChangeOfferRequestDate(dayjs(), "roundStartDate");
        }, 300000);
      }
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [open, actionQuote]); // Thêm actionQuote vào dependency array
  return (
    <Modal
      open={open}
      title={translate(titleModel)}
      size={WIDTH_1000}
      closeIcon={true}
      isShowIconBack={false}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("PL.confirm")}
      handleCancel={handleCancel}
      handleSave={handleSaveModal}
      key={"modal-add-supplier-quote"}
      className={styles["modal-list-suppliers"]}
      loading={loading}
    >
      <Row gutter={[16, 16]}>
        {isEqual(actionQuote, SupplierQuotationAction.AddSupplierQuotation) && (
          <>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  contextValue?.model,
                  "releaseDate"
                )}
              >
                <DatePicker
                  isRequired
                  label={translate("PL.txt_time_of_release_of")}
                  placeholder={translate("PL.txt_enter_time")}
                  dateFormat={DATE_FORMAT}
                  isSmall={false}
                  disabledTime={() =>
                    getDisabledTimeSelected(
                      dayjs(masterSupplierAddQuote?.releaseDate) || dayjs()
                    )
                  }
                  showTime={{ format: TIME_FORMAT }}
                  value={
                    masterSupplierAddQuote?.releaseDate
                      ? dayjs(masterSupplierAddQuote?.releaseDate)
                      : dayjs()
                  }
                  onChange={(value) => {
                    handleChangeOfferRequestDate(value, "releaseDate");
                  }}
                  readOnly
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  contextValue?.model,
                  "roundStartDate"
                )}
              >
                <DatePicker
                  isRequired
                  label={translate("PL.txt_start_time_bidding")}
                  placeholder={translate("PL.txt_enter_time")}
                  dateFormat={DATE_FORMAT}
                  isSmall={false}
                  showTime={{ format: TIME_FORMAT }}
                  minDate={
                    masterSupplierAddQuote?.releaseDate
                      ? dayjs(masterSupplierAddQuote?.releaseDate)
                      : dayjs()
                  }
                  disabledTime={() =>
                    getDisabledTimeSelected(
                      dayjs(masterSupplierAddQuote?.roundStartDate || dayjs()),
                      dayjs(masterSupplierAddQuote?.releaseDate) || dayjs(),
                      true
                    )
                  }
                  value={
                    masterSupplierAddQuote?.roundStartDate
                      ? dayjs(masterSupplierAddQuote?.roundStartDate)
                      : undefined
                  }
                  onChange={(value) => {
                    handleChangeOfferRequestDate(value, "roundStartDate");
                  }}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  contextValue?.model,
                  "roundEndDate"
                )}
              >
                <DatePicker
                  isRequired
                  label={translate("PL.txt_end_time_bidding")}
                  placeholder={translate("PL.txt_enter_time")}
                  dateFormat={DATE_FORMAT}
                  isSmall={false}
                  showTime={{ format: TIME_FORMAT }}
                  minDate={
                    masterSupplierAddQuote?.roundStartDate
                      ? dayjs(masterSupplierAddQuote?.roundStartDate)
                      : dayjs()
                  }
                  disabledTime={() =>
                    getDisabledTimeSelected(
                      dayjs(masterSupplierAddQuote?.roundEndDate || dayjs()),
                      dayjs(masterSupplierAddQuote?.roundStartDate),
                      true
                    )
                  }
                  readOnly={
                    !(
                      !!masterSupplierAddQuote?.roundStartDate &&
                      dayjs(masterSupplierAddQuote?.roundStartDate).isValid()
                    )
                  }
                  value={
                    masterSupplierAddQuote?.roundEndDate
                      ? dayjs(masterSupplierAddQuote?.roundEndDate)
                      : undefined
                  }
                  onChange={(value) => {
                    handleChangeOfferRequestDate(value, "roundEndDate");
                  }}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  contextValue?.model,
                  "roundOpenDate"
                )}
              >
                <DatePicker
                  isRequired
                  label={translate("PL.txt_opening_time")}
                  placeholder={translate("PL.txt_enter_time")}
                  dateFormat={DATE_FORMAT}
                  isSmall={false}
                  showTime={{ format: TIME_FORMAT }}
                  minDate={
                    masterSupplierAddQuote?.roundEndDate
                      ? dayjs(masterSupplierAddQuote?.roundEndDate)
                      : dayjs(formatDate(new Date()), DEFAULT_DATETIME_VALUE)
                  }
                  disabledTime={() =>
                    getDisabledTimeSelected(
                      dayjs(masterSupplierAddQuote?.roundOpenDate || dayjs()),
                      dayjs(masterSupplierAddQuote?.roundEndDate),
                      true
                    )
                  }
                  readOnly={
                    !(
                      !!masterSupplierAddQuote?.roundEndDate &&
                      dayjs(masterSupplierAddQuote?.roundEndDate).isValid()
                    )
                  }
                  value={
                    masterSupplierAddQuote?.roundOpenDate
                      ? dayjs(masterSupplierAddQuote?.roundOpenDate)
                      : undefined
                  }
                  onChange={(value) => {
                    handleChangeOfferRequestDate(value, "roundOpenDate");
                  }}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  contextValue?.model,
                  "evaluateStartDate"
                )}
              >
                <DatePicker
                  isRequired
                  label={translate("PL.txt_bid_start_time")}
                  placeholder={translate("PL.txt_enter_time")}
                  dateFormat={DATE_FORMAT}
                  isSmall={false}
                  showTime={{ format: TIME_FORMAT }}
                  minDate={
                    masterSupplierAddQuote?.roundOpenDate
                      ? dayjs(masterSupplierAddQuote?.roundOpenDate)
                      : dayjs()
                  }
                  disabledTime={() =>
                    getDisabledTimeSelected(
                      dayjs(
                        masterSupplierAddQuote?.evaluateStartDate || dayjs()
                      ),
                      dayjs(masterSupplierAddQuote?.roundOpenDate),
                      true
                    )
                  }
                  readOnly={
                    !(
                      !!masterSupplierAddQuote?.roundOpenDate &&
                      dayjs(masterSupplierAddQuote?.roundOpenDate).isValid()
                    )
                  }
                  value={
                    masterSupplierAddQuote?.evaluateStartDate
                      ? dayjs(masterSupplierAddQuote?.evaluateStartDate)
                      : undefined
                  }
                  onChange={(value) => {
                    handleChangeOfferRequestDate(value, "evaluateStartDate");
                  }}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  contextValue?.model,
                  "evaluateEndDate"
                )}
              >
                <DatePicker
                  isRequired
                  label={translate("PL.txt_bid_end_time")}
                  placeholder={translate("PL.txt_enter_time")}
                  dateFormat={DATE_FORMAT}
                  isSmall={false}
                  showTime={{ format: TIME_FORMAT }}
                  minDate={
                    masterSupplierAddQuote?.evaluateStartDate
                      ? dayjs(masterSupplierAddQuote?.evaluateStartDate)
                      : dayjs()
                  }
                  disabledTime={() =>
                    getDisabledTimeSelected(
                      dayjs(masterSupplierAddQuote?.evaluateEndDate || dayjs()),
                      dayjs(masterSupplierAddQuote?.evaluateStartDate),
                      true
                    )
                  }
                  readOnly={
                    !(
                      !!masterSupplierAddQuote?.evaluateStartDate &&
                      dayjs(masterSupplierAddQuote?.evaluateStartDate).isValid()
                    )
                  }
                  value={
                    masterSupplierAddQuote?.evaluateEndDate
                      ? dayjs(masterSupplierAddQuote?.evaluateEndDate)
                      : undefined
                  }
                  onChange={(value) => {
                    handleChangeOfferRequestDate(value, "evaluateEndDate");
                  }}
                />
              </FormItem>
            </Col>
          </>
        )}
        {!isEqual(
          actionQuote,
          SupplierQuotationAction.AddSupplierQuotation
        ) && (
          <>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  contextValue?.model,
                  "roundStartDate"
                )}
              >
                <DatePicker
                  isRequired
                  label={translate("PL.txt_start_time_bidding")}
                  placeholder={translate("PL.txt_enter_time")}
                  readOnly
                  dateFormat={DATE_FORMAT}
                  isSmall={false}
                  showTime={{ format: TIME_FORMAT }}
                  minDate={dayjs()}
                  disabledTime={() =>
                    getDisabledTimeSelected(
                      dayjs(masterSupplierAddQuote?.roundStartDate)
                    )
                  }
                  value={
                    masterSupplierAddQuote?.roundStartDate
                      ? dayjs(masterSupplierAddQuote?.roundStartDate)
                      : undefined
                  }
                  onChange={(value) => {
                    handleChangeOfferRequestDate(value, "roundStartDate");
                  }}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                validateObject={utilService.getValidateObj(
                  contextValue?.model,
                  "roundEndDate"
                )}
              >
                <DatePicker
                  isRequired
                  label={translate("PL.txt_end_time_bidding")}
                  placeholder={translate("PL.txt_enter_time")}
                  dateFormat={DATE_FORMAT}
                  isSmall={false}
                  showTime={{ format: TIME_FORMAT }}
                  minDate={
                    masterSupplierAddQuote?.roundStartDate
                      ? dayjs(masterSupplierAddQuote?.roundStartDate)
                      : dayjs()
                  }
                  disabledTime={() => {
                    return getDisabledTimeSelected(
                      dayjs(masterSupplierAddQuote?.roundEndDate || dayjs()),
                      dayjs(masterSupplierAddQuote?.roundStartDate) || dayjs(),
                      true
                    );
                  }}
                  readOnly={
                    !(
                      !!masterSupplierAddQuote?.roundStartDate &&
                      dayjs(masterSupplierAddQuote?.roundStartDate).isValid()
                    )
                  }
                  value={
                    masterSupplierAddQuote?.roundEndDate
                      ? dayjs(masterSupplierAddQuote?.roundEndDate)
                      : undefined
                  }
                  onChange={(value) => {
                    handleChangeOfferRequestDate(value, "roundEndDate");
                  }}
                />
              </FormItem>
            </Col>
          </>
        )}
      </Row>
      <div>
        <div className={styles["title-list"]}>{translate(titleList)}</div>
      </div>

      <SupplierInformationTable
        isDetail={false}
        contextValue={contextValue}
        isView={false}
        idContainer={idContainer}
        isNotConfirmDelete={isNotConfirmDelete}
        isNegotiationRound={isNegotiationRound}
      />
    </Modal>
  );
};

export default ModalAddSupplierQuote;
