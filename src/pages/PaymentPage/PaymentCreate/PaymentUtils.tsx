import { t } from "i18next";

export const getPaymentRequestTypeName = (name: string): string => {
  switch (name) {
    case "Thanh toán cho nhà cung cấp":
      return t("PM.title.forSupplier");
    case "Thanh toán cho cá nhân ":
      return t("PM.title.forIndividual");
    case "Tạm ứng cho nhà cung cấp":
      return t("PM.title.advanceforSupplier");
    case "Tạm ứng cho cá nhân":
      return t("PM.title.advanceforIndividual");
    case "Dự chi cho nhà cung cấp":
      return t("PM.title.expenseforSupplier");
    case "Dự chi cho cá nhân":
      return t("PM.title.expenseforIndividual");
    case "Đặt cọc":
      return t("PM.title.deposit");
    case "Hạch toán":
      return t("PM.title.accountingEntry");
  }
};
