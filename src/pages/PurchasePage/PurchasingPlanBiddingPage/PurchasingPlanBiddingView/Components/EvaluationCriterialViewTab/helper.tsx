import { LIST_ROLE_EVALUATION } from "config/const";
import { ViewRole } from "models/PurchasingPlan";

export const mappingRoleToRoleName = (role: ViewRole) => {
  return LIST_ROLE_EVALUATION.find((item) => item.id === role)?.name;
};
