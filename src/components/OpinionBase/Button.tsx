import { ChatIcon } from "assets/icons";
import FeedbackOpinionModal from "components/OpinionCollector/Components/FeedbackOpinionModal/FeedbackOpinionModal";
import { isEqual } from "lodash";
import { useMemo } from "react";
import { Button } from "react-components-design-system";
import { RootState } from "rtk";
import { useAppSelector } from "rtk/useRedux";
import { useFeedbackOpinionHooks } from "./opinionFeedbackHooks";

export const ButtonOpinion = () => {
  const { setIsOpen, ...props } = useFeedbackOpinionHooks();

  const currentUser = useAppSelector(
    (state: RootState) => state?.profile?.account
  );

  const isButtonDisabled = useMemo(() => {
    return (
      isEqual(props?.opinionCollectorModel?.canResponse, false) ||
      !isEqual(
        currentUser?.email?.toLowerCase(),
        props?.opinionCollectorModel?.responseByDetail?.email
      )
    );
  }, [
    currentUser?.email,
    props?.opinionCollectorModel?.canResponse,
    props?.opinionCollectorModel?.responseByDetail?.email,
  ]);

  return (
    <>
      <Button
        type="primary"
        size="lg"
        onClick={() => setIsOpen(true)}
        iconPlace="left"
        disabled={isButtonDisabled}
        icon={<img src={ChatIcon} alt="ChatIcon" />}
      >
        {props?.translate("OC.feedback")}
      </Button>
      {isEqual(props?.isOpen, true) ? (
        <FeedbackOpinionModal {...props} />
      ) : null}
    </>
  );
};
