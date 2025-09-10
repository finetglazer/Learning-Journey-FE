import { EvaluationRole, User, ViewRole } from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { mappingRoleToRoleName } from "../../helper";
import { ColumnProps } from "antd/lib/table";

const RoleSection = () => {
  const [translate] = useTranslation();

  const { model } = useContext(PurchasingPlanBiddingDetailHookContext);

  const columns: ColumnProps<EvaluationRole>[] = useMemo(
    () => [
      {
        title: translate("PL.txt_member"),
        key: "user",
        dataIndex: "user",
        render(value: User) {
          return (
            <LayoutCell>
              <OneLineText value={value?.name ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_email"),
        key: "user",
        dataIndex: "user",
        render(value: User) {
          return (
            <LayoutCell>
              <OneLineText value={value?.email ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_role"),
        key: "role",
        dataIndex: "role",
        render(value: ViewRole) {
          return (
            <LayoutCell>
              <OneLineText
                value={mappingRoleToRoleName(value) ?? "---"}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_note"),
        key: "note",
        dataIndex: "note",
        render(value) {
          return (
            <LayoutCell>
              <OneLineText value={value ?? "---"} useTooltip />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <div>
      <StandardTable
        rowKey="id"
        isDragable
        columns={columns}
        dataSource={model?.evaluationCriteriaSummary?.evaluationRoles}
        scroll={{ y: "calc(100vh - 326px)" }}
      />
    </div>
  );
};

export default RoleSection;
