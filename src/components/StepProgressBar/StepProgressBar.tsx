import { isEmpty, isEqual, isUndefined, lt } from "lodash";
import { StepProgressBarProperties, StepStatus } from "./types";

import { CaretRightIcon, SuccessPointStepper } from "assets/icons";
import classNames from "classnames";
import "./StepProgressBar.scss";

const CARET_RIGHT_ICON_SIZE = 16;

const SUCCESS_ICON_SIZE = 24;

const getStepStatusClass = (
  index: number,
  status?: StepStatus,
  currentStep?: number
): string => {
  if (!isUndefined) return status;

  if (!isUndefined(currentStep)) {
    const currentStepIndex = currentStep - 1;

    if (lt(index, currentStepIndex)) {
      return StepStatus.SUCCESS;
    } else if (isEqual(index, currentStepIndex)) {
      return StepStatus.IN_PROGRESS;
    } else {
      return StepStatus.NOT_STARTED;
    }
  }

  return StepStatus.NOT_STARTED;
};

const StepProgressBar = ({ steps, currentStep }: StepProgressBarProperties) => {
  if (isEmpty(steps)) return null;

  return (
    <div className="progress_bar_container">
      {steps.map((step, index) => {
        const isLastItem = isEqual(index, steps.length - 1);

        const stepStatusClass = getStepStatusClass(
          index,
          step.status,
          currentStep
        );

        return (
          <div key={step.title} className="step">
            <div className="step_content">
              {isEqual(stepStatusClass, StepStatus.SUCCESS) ? (
                <img
                  src={SuccessPointStepper}
                  width={SUCCESS_ICON_SIZE}
                  height={SUCCESS_ICON_SIZE}
                  alt="success-icon"
                />
              ) : (
                <div className={classNames("order", stepStatusClass)}>
                  <span>{index + 1}</span>
                </div>
              )}

              <span className={stepStatusClass}>{step.title}</span>
            </div>

            {!isLastItem && (
              <img
                src={CaretRightIcon}
                width={CARET_RIGHT_ICON_SIZE}
                height={CARET_RIGHT_ICON_SIZE}
                alt="caret-icon"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgressBar;
