import { AxiosError } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { HttpStatusCode } from "core/services/service-types";
import { isEqual, isNil } from "lodash";
import { Model } from "react-3layer-common";

interface ErrorHandlerProps<T extends Model> {
  model: T;
  error: AxiosError;
  handleChangeAllField?: (data: T) => void;
}

type ErrorData = {
  type?: string;
  message?: string;
  errors: Model.Errors<Model>;
};

export enum ErrorType {
  VALIDATE = "Validate",
  SYSTEM_ERROR = "System Error",
  BAD_REQUEST = "Bad Request",
}

export const handleError = <T extends Model>({
  model,
  error,
  handleChangeAllField,
}: ErrorHandlerProps<T>) => {
  const { notifyToast } = appMessageService.useCRUDMessage();

  const { status, data } = error.response;
  const { type, message, errors } = data as ErrorData;
  if (isEqual(status, HttpStatusCode.BAD_REQUEST)) {
    if (isEqual(type, ErrorType.VALIDATE)) {
      if (isNil(handleChangeAllField)) return;
      handleChangeAllField({
        ...model,
        errors: errors,
      });
    } else {
      notifyToast({
        type: "error",
        message: message,
      });
    }
  }
};
