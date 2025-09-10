import { CheckmarkFilled } from "@carbon/icons-react";
import notification from "antd/lib/notification";
import { USER_NOTIFICATION_ROUTE } from "config/route-const";
import { Notification } from "core/models/Notification";
import signalRService, {
  SignalRMethodName,
} from "core/services/common-services/signalr-service";
import { ListResult } from "core/services/service-types";
import path from "path";
import React from "react";
import { finalize } from "rxjs";
import { notificationRepository } from "./NotificationRepository";
import { useAppSelector } from "rtk/useRedux";
import { RootState } from "rtk";
import { formatDateTime, utcVN } from "core/helpers/date-time";
const DEFAULT_NOTIFICATION_TAKE = 10;

export function useNotificationDropdownHook(
  active?: boolean,
  setIsFetchUnRead?: React.Dispatch<React.SetStateAction<number>>
) {
  const [filterUnread, setFilterUnread] = React.useState<boolean>(false);

  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const [loadingNotification, setLoadingNotification] =
    React.useState<boolean>(false);

  const [loadNotificationMore, setLoadNotificationMore] =
    React.useState<boolean>(true);

  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const [total, setTotal] = React.useState<number>(0);

  const [newPageIndex, setNewPageIndex] = React.useState<number>(1);

  const fetchReadNotification = React.useCallback(async (id: string) => {
    try {
      notificationRepository
        .read({
          ids: [id],
        })
        .subscribe(() => {
          // eslint-disable-next-line no-console
          // console.log(`readNotiId:`, id);
        });
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log(`ex:`, ex);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notificationConfig = (data: any) => {
    return notification.success({
      message: (
        <div
          className="content-noti-ellipsis title"
          dangerouslySetInnerHTML={{
            __html: data.requestName,
          }}
        ></div>
      ),

      description: (
        <div
          className="content-noti-ellipsis content"
          dangerouslySetInnerHTML={{
            __html: data?.description?.replaceAll(
              "DateTimeNow",
              formatDateTime(utcVN(data?.createdDate))
            ),
          }}
        ></div>
      ),
      icon: <CheckmarkFilled size={24} color="#0673C6" />,
      onClick: async () => {
        notificationRepository.read({
          ids: [data.id],
        });
        setTimeout(() => {
          window.location.href = data.detailUrl ? data.detailUrl : "#";
        }, 0);
      },
      className: "notification-real-time",
    });
  };

  const handleChangeFilterUnread = React.useCallback((value: boolean) => {
    setNewPageIndex(1);
    setHasMore(true);
    setLoadNotificationMore(true);
    setFilterUnread(value);
  }, []);

  const handleWhenClickOutside = React.useCallback(() => {
    setNewPageIndex(1);
    setHasMore(true);
    setLoadNotificationMore(true);
  }, []);

  const handleClickToNotification = React.useCallback(() => {
    window.location.href = USER_NOTIFICATION_ROUTE;
  }, []);

  const handleReadNotification = React.useCallback(
    (id: string, url: string, isReaded: boolean) => {
      return async () => {
        if (!isReaded) {
          setIsFetchUnRead((prev) => prev - 1);
        }
        // ev.preventDefault();
        await fetchReadNotification(id);
        window.location.href = url;
      };
    },
    [fetchReadNotification, setIsFetchUnRead]
  );

  function buildAbsoluteLink(url: string | null | undefined | number) {
    if (url === null || typeof url === "undefined") {
      return "#";
    }
    return path.join("/", url.toString());
  }

  const profileUser = useAppSelector(
    (state: RootState) => state?.profile?.account
  );

  React.useEffect(() => {
    signalRService.registerChannel<Notification[]>(
      SignalRMethodName.ReceiveNotification,
      (responseNotiList) => {
        responseNotiList?.forEach((dataNoti) => {
          const receiveUserIds: string[] = dataNoti?.receiveUserIds || [];
          if (
            receiveUserIds?.length > 0 &&
            receiveUserIds?.includes(profileUser?.id)
          ) {
            notificationConfig(dataNoti);
            setIsFetchUnRead((prev) => prev + 1);
          }
        });
      }
    );

    return () =>
      signalRService.offChanel(SignalRMethodName.ReceiveNotification);
  }, [profileUser?.id, setIsFetchUnRead]);

  React.useEffect(() => {
    if (notifications?.length && !loadingNotification) {
      const scrollableDiv = document.getElementsByClassName(
        "notification-list__wrapper"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scrollableDiv[0].addEventListener("scroll", function (event: any) {
        const maxScroll = event.target.scrollHeight - event.target.clientHeight;
        const currentScroll = event.target.scrollTop;
        if (currentScroll + 1 >= maxScroll) {
          if (hasMore === true) {
            const newPageIndexTmp = newPageIndex + 1;
            setNewPageIndex(newPageIndexTmp);
            setLoadNotificationMore(true);
          }
        }
      });
    }
  }, [hasMore, notifications?.length, loadingNotification, newPageIndex]);

  React.useEffect(() => {
    if (active) {
      const scrollableDiv = document.getElementsByClassName(
        "notification-list__wrapper"
      );
      scrollableDiv[0].scrollTop = 0;
    }
  }, [active]);

  React.useEffect(() => {
    if (loadNotificationMore && hasMore && active) {
      setLoadingNotification(true);
      setLoadNotificationMore(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newFilter: any = {
        pageIndex: newPageIndex,
        pageSize: DEFAULT_NOTIFICATION_TAKE,
      };
      if (filterUnread) {
        newFilter.isReaded = false;
      }

      notificationRepository
        .getAll(newFilter)
        .pipe(
          finalize(() => {
            setLoadingNotification(false);
          })
        )
        .subscribe({
          next: (results: ListResult<Notification>) => {
            const newData = results?.data?.items?.length
              ? results?.data?.items
              : [];
            if (newPageIndex === 1) {
              setNotifications(newData);
            } else {
              setNotifications([...notifications, ...newData]);
            }

            setTotal(results?.data?.totalRecords);
            if (
              newPageIndex * DEFAULT_NOTIFICATION_TAKE >=
              results?.data?.totalRecords
            ) {
              setHasMore(false);
            }
          },
        });
    }
  }, [
    hasMore,
    notifications,
    loadNotificationMore,
    active,
    filterUnread,
    newPageIndex,
  ]);

  return {
    handleClickToNotification,
    notifications,
    hasMore,
    total,
    loadingNotification,
    handleReadNotification,
    buildAbsoluteLink,
    handleWhenClickOutside,
    handleChangeFilterUnread,
    filterUnread,
    notificationConfig,
  };
}
