import { Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";

type props = {
  title?: string;
};
function StatusTag({ title }: props) {
  const [translate] = useTranslation();

  return (
    <Tag
      value={isEmpty(title) ? translate("PM.newly_created") : title}
      className="m-l--2xs"
      size="sm"
      isShowBorder
      isShowDot={false}
    />
  );
}

export default StatusTag;
