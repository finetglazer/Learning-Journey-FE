import { numberConstants } from "core/config/consts";
import { t } from "i18next";

const listStatus = [
  { id: numberConstants.ONE, code: "ACTIVE", name: t("CM.txt_status_active") },
  {
    id: numberConstants.ZERO,
    code: "DEACTIVATE",
    name: t("CM.txt_status_deactivate"),
  },
];

const TEXT_AREA_MAX_LENGTH = 500;

export { listStatus, TEXT_AREA_MAX_LENGTH };
