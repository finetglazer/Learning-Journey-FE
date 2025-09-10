import { WarningStrokeIcon } from "assets/icons";
import { uniqueId } from "lodash";
import { Fragment } from "react";

interface ErrorMessagesProperties {
  errorList: string[];
}

const ErrorMessages = ({ errorList }: ErrorMessagesProperties) => {
  return (
    <Fragment>
      {errorList.map((error, index) => (
        <div
          key={uniqueId(index.toString())}
          className="error_messages_container"
        >
          <img src={WarningStrokeIcon} alt="warning" />
          <span dangerouslySetInnerHTML={{ __html: error }} />
        </div>
      ))}
    </Fragment>
  );
};

export default ErrorMessages;
