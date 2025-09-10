import { STATUS_ACTIVE } from "core/models/Common/Status";
import { isEqual } from "lodash";

export const getStatus = (isActive: boolean) => {
  const isActivated = isEqual(isActive, true);
  const keyI18n = isActivated
    ? "CL.active_status_txt"
    : "CL.deactivate_status_full_txt";
  const type = isActivated ? STATUS_ACTIVE.SUCCESS : STATUS_ACTIVE.DEFAULT;

  return {
    keyI18n,
    type,
  };
};
