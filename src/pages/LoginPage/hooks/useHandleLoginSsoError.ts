import appMessageService from "core/services/common-services/app-message-service";
import { ValidateStatus } from "core/services/service-types";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

enum ErrorCodeLogin {
  NOT_EXIST = "NOT_EXIST",
}

const errorCodeKey = "errorMessage";

export default function useHandleLoginSsoError() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const errorCode = searchParams.get(errorCodeKey);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const handleRemoveParams = () => {
    searchParams.delete(errorCodeKey);
    history.replace({
      pathname: history.location.pathname,
      search: searchParams.toString(),
    });
  };

  useLayoutEffect(() => {
    if (errorCode === ErrorCodeLogin.NOT_EXIST) {
      notifyToast({
        message: translate("CM.message.error.not_exist"),
        type: ValidateStatus.error,
        onClose: handleRemoveParams,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorCode, translate]);
}
