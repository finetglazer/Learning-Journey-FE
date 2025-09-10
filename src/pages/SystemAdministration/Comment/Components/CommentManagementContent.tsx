import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CommentManagementFilter } from "./CommentManagementFilter";
import { CommentManagementTable } from "./CommentManagementTable";

enum CollapseKey {
  SEARCH_CONDITION = "1",
  SEARCH_RESULT = "2",
}

export const CommentManagementContent = () => {
  const [translate] = useTranslation();

  const items: CollapseItem[] = useMemo(() => {
    return [
      {
        key: CollapseKey.SEARCH_CONDITION,
        label: translate("RM.title_search_condition"),
        children: <CommentManagementFilter />,
      },
      {
        key: CollapseKey.SEARCH_RESULT,
        label: translate("RM.title_search_result"),
        children: <CommentManagementTable />,
      },
    ];
  }, [translate]);

  return (
    <CollapseView
      items={items}
      defaultActiveKey={[
        CollapseKey.SEARCH_CONDITION,
        CollapseKey.SEARCH_RESULT,
      ]}
    />
  );
};
