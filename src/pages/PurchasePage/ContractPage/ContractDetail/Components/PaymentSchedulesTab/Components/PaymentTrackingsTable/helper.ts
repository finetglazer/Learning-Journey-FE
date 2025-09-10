import i18nTranslation from "core/config/i18n";
import { t } from "i18next";
import { ERPStatus, RequestStatus } from "models/Contract";
i18nTranslation.initialize();

export const getNameByRequestStatus = (status: RequestStatus) => {
  const requestStatus = {
    0: {
      title: t("CT.payment_trackings.draft"),
      status: "DEFAULT",
    },
    1: {
      title: t("CT.payment_trackings.pending_approval"),
      status: "IN_PROGRESS",
    },
    2: {
      title: t("CT.payment_trackings.approved"),
      status: "SUCCESS",
    },
    3: {
      title: t("CT.payment_trackings.returned"),
      status: "ERROR",
    },
    4: {
      title: t("CT.payment_trackings.rejected"),
      status: "ERROR",
    },
    5: {
      title: t("CT.payment_trackings.revoked"),
      status: "ERROR",
    },
  };
  return requestStatus[status];
};

export const getNameByERPStatus = (ERPStatus: ERPStatus) => {
  const status = [
    t("CT.payment_trackings.final_erp"),
    t("CT.payment_trackings.pending_erp"),
    t("CT.payment_trackings.error_erp"),
    t("CT.payment_trackings.reject_erp"),
  ];
  return status[ERPStatus];
};
