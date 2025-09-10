/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";

import {
  ExchangeRateMasterContext,
  ExchangeRateMasterContextModel,
} from "../ExchangeRateMaster/ExchangeRateMasterHook";
import "./ExchangeRatePreview.scss";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import appMessageService from "core/services/common-services/app-message-service";
import dayjs from "dayjs";
import { isEmpty } from "lodash";

const ExchangeRatePreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenPreviewModal,
    detailModel: model,
    handleCloseModal,
  } = useContext<ExchangeRateMasterContextModel>(ExchangeRateMasterContext);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const copyToClipboard = () => {
    const textToCopy = model?.code;
    if (isEmpty(textToCopy)) return;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        notifyToast({
          message: translate("CL.copied_to_clipboard_message"),
        });
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  return (
    <>
      <Modal
        open={isOpenPreviewModal}
        title={translate("exchangeRates.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("preview")}
        onCancel={() => handleCloseModal("preview")}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="exchange-rate-view-body">
          <span className="exchange-rate__name">{model?.fromCurrencyName}</span>
          <div className="exchange-rate__code" onClick={copyToClipboard}>
            <span className="exchange-rate__code-value">
              {model?.fromCurrencyCode}
            </span>
            <div className="exchange-rate__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <span className="exchange-rate__name">{model?.toCurrencyName}</span>
          <div className="exchange-rate__code" onClick={copyToClipboard}>
            <span className="exchange-rate__code-value">
              {model?.toCurrencyCode}
            </span>
            <div className="exchange-rate__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="w-100">
            <div className="exchange-rate__item">
              <span className="exchange-rate__item-label">
                {translate("exchangeRates.sellBankTransfer")}
              </span>
              <span className="exchange-rate__item-description">
                {formatNumber(model?.sellTransfer)}
              </span>
            </div>
            <div className="exchange-rate__item m-l--sm">
              <span className="exchange-rate__item-label">
                {translate("exchangeRates.buyBankTransfer")}
              </span>
              <span className="exchange-rate__item-description">
                {formatNumber(model?.buyTransfer)}
              </span>
            </div>

            <div className="exchange-rate__item m-t--sm">
              <span className="exchange-rate__item-label">
                {translate("exchangeRates.centralExchangeRate")}
              </span>
              <span className="exchange-rate__item-description">
                {formatNumber(model?.centralExchangeRate)}
              </span>
            </div>
            <div className="exchange-rate__item m-t--sm m-l--xs">
              <span className="exchange-rate__item-label">
                {translate("exchangeRates.exchangeRateDate")}
              </span>
              <span className="exchange-rate__item-description">
                {model?.exchangeRateDate &&
                  dayjs(model?.exchangeRateDate)?.isValid() &&
                  formatDateTimeToVietnamTimezone(model?.exchangeRateDate)}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExchangeRatePreview;
