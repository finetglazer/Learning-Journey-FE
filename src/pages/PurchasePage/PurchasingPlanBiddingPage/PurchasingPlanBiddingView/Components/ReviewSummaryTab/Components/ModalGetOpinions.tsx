import { GetOpinionsInfo } from "assets/icons";
import dayjs, { Dayjs } from "dayjs";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext, useState } from "react";
import {
  DatePicker,
  FormItem,
  ModalConfirm,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface EditReviewProps {
  dismiss: (shouldReloadList?: boolean) => void;
}

export const ModalGetOpinions = ({ dismiss }: EditReviewProps) => {
  const [translate] = useTranslation();

  const [gatherOpinionEndDate, setGatherOpinionEndDate] =
    useState<Dayjs | null>();
  const [messageError, setMessageError] = useState("");

  const { handleGatherOpinion } = useContext<PurchasingPlanModel>(
    PurchasingPlanBiddingDetailHookContext
  );

  const onSave = () => {
    if (!gatherOpinionEndDate) {
      setMessageError(translate("CM.input_require_validation"));
      return;
    }
    handleGatherOpinion(gatherOpinionEndDate);
    setMessageError("");
    dismiss();
  };

  const getDisabledDate = (current: Dayjs | null): boolean =>
    !!current && current.isBefore(dayjs().startOf("day"));

  const getDisabledTime = (selectedDate: Dayjs | null) => {
    if (selectedDate && selectedDate.isSame(dayjs(), "day")) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();

      return {
        disabledHours: () =>
          Array.from({ length: currentHour }, (_, hourIndex) => hourIndex),
        disabledMinutes: (selectedHour: number) =>
          selectedHour === currentHour
            ? Array.from(
                { length: currentMinute },
                (_, minuteIndex) => minuteIndex
              )
            : [],
      };
    }
    return {};
  };

  return (
    <ModalConfirm
      open
      title={translate("PL.txt_modal_title_get_opinions")}
      content={translate("PL.txt_modal_content_get_opinions")}
      icon={<img src={GetOpinionsInfo} alt="" />}
      titleButtonApply={translate("CM.btn_confirm")}
      titleButtonCancel={translate("CM.btn_close")}
      handleSave={onSave}
      handleCancel={dismiss}
    >
      <div className="w-100 h-100 m-t--lg">
        <FormItem message={messageError}>
          <DatePicker
            label={translate("PL.txt_closing_date_opinions")}
            isRequired
            value={gatherOpinionEndDate}
            onChange={(date) => {
              setGatherOpinionEndDate(date);
              setMessageError("");
            }}
            dateFormat={["DD-MM-YYYY HH:mm"]}
            showTime={{ format: "HH:mm" }}
            minDate={dayjs(new Date())}
            disabledDate={getDisabledDate}
            disabledTime={getDisabledTime}
          />
        </FormItem>
      </div>
    </ModalConfirm>
  );
};
