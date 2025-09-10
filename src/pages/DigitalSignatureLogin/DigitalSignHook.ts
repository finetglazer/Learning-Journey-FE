import appMessageService, {
  messageType,
} from "core/services/common-services/app-message-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { SigningInfo } from "models/SignatureInfo";
import React from "react";
import { Observable } from "rxjs";

export function useDigitalSign(
  getSigningInfo: (id: number | string) => Observable<SigningInfo>
) {
  const [signingInfo, setSigningInfo] = React.useState<SigningInfo>();
  const [visibleDigitalSigining, setVisibleDigitalSigning] =
    React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id }: any = queryStringService.useGetQueryString("id");

  React.useEffect(() => {
    if (typeof getSigningInfo != "undefined") {
      getSigningInfo(Number(id)).subscribe({
        next: (res: SigningInfo) => {
          setSigningInfo(res);
        },
        error: () => {
          appMessageService.messageFactory({
            type: messageType.ERROR,
            title: "Bạn cần kiểm tra lại các trường dữ liệu",
            description: "Có lỗi xảy ra",
          });
        },
      });
    }
  }, [getSigningInfo, id]);

  return {
    signingInfo,
    visibleDigitalSigining,
    setVisibleDigitalSigning,
  };
}
