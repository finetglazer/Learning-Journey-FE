import { isEqual } from "lodash";
import { useTranslation } from "react-i18next";
import { Tag } from "react-components-design-system";
import { RespondStatus } from "models/PurchasingPlan";

// Hàm tạo mảng trạng thái
export const useResponseStatuses = () => {
  const [translate] = useTranslation();

  return [
    {
      id: RespondStatus.Responded,
      name: translate("PL.txt_responded"),
      code: "SUCCESS", // Màu xanh lá
    },
    {
      id: RespondStatus.NoRespond,
      name: translate("PL.txt_not_responded"),
      code: "IN_PROGRESS", // Màu vàng
    },
  ];
};

export interface ParameterRenderResponseStatusTag {
  status: RespondStatus;
  responseStatuses: {
    id: RespondStatus;
    name: string;
    code: string;
  }[];
}
// Component để render tag trạng thái phản hồi
export const renderResponseStatusTag = ({
  responseStatuses,
  status,
}: ParameterRenderResponseStatusTag) => {
  const item = responseStatuses.find((type) => isEqual(type.id, status));

  if (!item) return null;

  return (
    <div>
      <Tag
        size="md"
        value={item.name}
        status={item.code}
        isShowDot={false}
        isShowBorder={true}
      />
    </div>
  );
};
