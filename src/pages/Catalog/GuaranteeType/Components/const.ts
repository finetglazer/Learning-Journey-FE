import i18nTranslation from "core/config/i18n";
import { t } from "i18next";
i18nTranslation.initialize();

export const listGuaranteeTypeStatusEnum = [
  { id: 0, code: "ACTIVE", name: t("CM.txt_status_active") },
  { id: 1, code: "DEACTIVATE", name: t("CM.txt_status_deactivate") },
];
