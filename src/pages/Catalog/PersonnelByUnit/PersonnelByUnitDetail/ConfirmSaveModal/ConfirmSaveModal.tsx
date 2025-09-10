import TrashSvg from "assets/icons/CostLine/ic_trash.svg";
import { STANDARD_TIME_FORMAT_MM_YYYY } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import dayjs from "dayjs";
import { ModalConfirm } from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface ConfirmSaveModalProps {
  visibleConfirmModal: boolean;
  onSave: () => void;
  handleCancel: () => void;
  date: string;
}

export const ConfirmSaveModal = (props: ConfirmSaveModalProps) => {
  const [translate] = useTranslation();
  const { visibleConfirmModal, onSave, handleCancel, date } = props;

  return (
    <ModalConfirm
      centered
      open={visibleConfirmModal}
      titleButtonApply={translate("generalActions.confirm")}
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={handleCancel}
      handleSave={onSave}
      icon={<img src={TrashSvg} alt="" width={72} height={72} />}
      title={translate("PBU.confirmSaveTitle")}
      content={translate("PBU.confirmSaveContent", {
        date: formatDate(dayjs(date), STANDARD_TIME_FORMAT_MM_YYYY),
      })}
    />
  );
};
