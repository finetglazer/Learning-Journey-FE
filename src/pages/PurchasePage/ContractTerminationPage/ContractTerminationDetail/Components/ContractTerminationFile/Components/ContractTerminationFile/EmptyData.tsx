import { Add } from "@carbon/icons-react";
import { Button } from "react-components-design-system";
import classNames from "./EmptyData.module.scss";

type EmptyDataProps = {
  icon: string;
  message: string;
  titleButton?: string;
  action?: () => void;
};

const EmptyData = ({ icon, message, titleButton, action }: EmptyDataProps) => {
  return (
    <div className={classNames.h_wrapper}>
      <div className={classNames.empty__wrapper}>
        <img className={classNames.empty__wrapper_icon} src={icon} alt="img" />
        <div className={classNames.empty__wrapper_content}>
          <div className={classNames.empty__wrapper_content__massage}>
            <p className={classNames.empty__wrapper_content__massage_import}>
              {message}
            </p>{" "}
          </div>
          {action && (
            <div className={classNames.empty__wrapper_content__button}>
              <Button
                icon={<Add />}
                iconPlace="left"
                type="secondary"
                onClick={action}
              >
                {titleButton}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyData;
