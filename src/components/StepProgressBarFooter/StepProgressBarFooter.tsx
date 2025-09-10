import StepProgressBar from "components/StepProgressBar/StepProgressBar";
import { StepProgressBarProperties } from "components/StepProgressBar/types";
import { useTranslation } from "react-i18next";
import "./StepProgressBarFooter.scss";

const StepProgressBarFooter = (props: StepProgressBarProperties) => {
  const [translate] = useTranslation();

  return (
    <div className="step_progress_bar_footer">
      <span>{translate("CM.txt_complete_progress")}</span>
      <StepProgressBar {...props} />
    </div>
  );
};

export default StepProgressBarFooter;
