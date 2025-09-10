import i18nTranslation from "core/config/i18n";
import { t } from "i18next";
i18nTranslation.initialize();

export const listLegalEntityStatusEnum = [
  { id: 0, code: "TRUE", name: t("CM.txt_status_active") },
];
