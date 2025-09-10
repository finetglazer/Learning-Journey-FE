import notification, { ArgsProps } from "antd/lib/notification";
import {
  CloseIcon,
  ErrorWhiteIcon,
  InfoWhiteIcon,
  SuccessWhiteIcon,
} from "assets/icons";
import { t } from "i18next";
import { BehaviorSubject, Observable, Subject } from "rxjs";
notification.config({
  placement: "bottomRight",
});

export enum messageType {
  SUCCESS,
  WARNING,
  ERROR,
}

export interface IMessage {
  title?: string;
  description?: string;
  type?: messageType;
}

export class AppMessageService {
  success$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // success subject for app message
  error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // error subject for app message
  message$: Subject<IMessage> = new Subject(); // message subject for app message

  _success: () => Observable<boolean> = () =>
    this.success$ as Observable<boolean>; // expose get success$ Observable
  _error: () => Observable<boolean> = () => this.error$ as Observable<boolean>; // expose get error$ as Observable
  setSuccess: () => void = () => {
    this.success$.next(true);
  };
  setError: () => void = () => {
    this.error$.next(true);
  };

  setMessage: (message: IMessage) => void = (message: IMessage) => {
    this.message$.next(message);
  };

  messageFactory(content: IMessage) {
    const { type, description, title } = content;
    if (type === messageType.SUCCESS) {
      return notification.success({
        message: title,
        description,
      });
    }
    if (type === messageType.WARNING) {
      return notification.warning({
        message: title,
        description,
      });
    }
    if (type === messageType.ERROR) {
      return notification.error({
        message: title,
        description,
      });
    }
  }

  handleNotify(message: IMessage) {
    return (value: boolean) => {
      if (value) {
        this.messageFactory(message);
      }
    };
  }

  useCRUDMessage() {
    const notifyToast = (
      argsProps: ArgsProps = {
        message: t("CM.txt_update_success"),
        type: "success",
        placement: "top",
      }
    ) => {
      const type = argsProps.type || "success";
      const placement = argsProps.placement || "top";
      const message = argsProps.message as string;

      const getIcon = () => {
        switch (type) {
          case "success":
            return SuccessWhiteIcon;
          case "error":
            return ErrorWhiteIcon;
          case "info":
            return InfoWhiteIcon;
          default:
            return SuccessWhiteIcon;
        }
      };

      const getColor = () => {
        switch (type) {
          case "success":
            return "var(--palette-base-green-6)";
          case "error":
            return "var(--palette-base-red-6)";
          case "info":
            return "var(--palette-base-blue-6)";
          default:
            return "var(--palette-base-green-6)";
        }
      };
      // Split the message by `\n` and map each part to a `span` with a `br`
      const formattedMessage = message?.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ));
      return notification.open({
        className: "custom_toast",
        icon: <img src={getIcon()} alt="img" width={24} height={24} />,
        closeIcon: <img src={CloseIcon} alt="close" />,
        description: "",
        placement: placement, // You can adjust the position
        duration: 5, // Duration in seconds
        style: {
          background: getColor(),
        },
        ...argsProps,
        message: <div>{formattedMessage}</div>,
      });
    }; // updateSuccess method

    const notifyUpdateItemSuccess = (
      argsProps: ArgsProps = { message: t("CM.txt_update_success") }
    ) => {
      notifyToast({
        ...argsProps,
        type: "success",
      });
    }; // updateSuccess method

    const notifyUpdateItemError = (
      argsProps: ArgsProps = { message: "Cập nhật có lỗi" }
    ) => {
      return notification.error({
        ...argsProps,
      });
    }; // updateSuccess method

    const notifyBadRequest = (
      argsProps: ArgsProps = { message: "Lỗi dữ liệu" }
    ) => {
      return notification.error({
        ...argsProps,
      });
    }; // notifyBadRequest method (400)

    const notifyUnAuthorize = (
      argsProps: ArgsProps = { message: "Lỗi phân quyền" }
    ) => {
      return notification.error({
        ...argsProps,
      });
    }; // notifyUnAuthorize method (401)

    const notifyServerError = (argsProps?: ArgsProps) => {
      return notification.error({
        ...argsProps,
      });
    }; // notifyServerError method (502, 500)

    const notifyBEError = (
      argsProps: ArgsProps = { message: "Lỗi máy chủ" }
    ) => {
      return notification.error({
        ...argsProps,
      });
    }; // notifyBEError method (420)

    const notifyIdleError = (
      argsProps: ArgsProps = { message: "Lỗi gateway" }
    ) => {
      return notification.error({
        ...argsProps,
      });
    }; // notifyIdleError method (504)

    return {
      notifyUpdateItemSuccess,
      notifyUpdateItemError,
      notifyBadRequest,
      notifyUnAuthorize,
      notifyServerError,
      notifyBEError,
      notifyIdleError,
      notifyToast,
    };
  }
}

const appMessageService = new AppMessageService();
export default appMessageService;
