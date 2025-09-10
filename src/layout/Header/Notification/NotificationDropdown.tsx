import { NotificationCounter } from "@carbon/icons-react";
import { Tooltip } from "antd";
import classNames from "classnames";
import {
  formatDateTime,
  formatDateTimeFromNow,
  utcVN,
} from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import React, { useRef } from "react";
import { TagFilter } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./NotificationDropdown.scss";
import { useNotificationDropdownHook } from "./NotificationDropdownHook";

interface NotificationDropdownProps {
  active?: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCountUnread: React.Dispatch<React.SetStateAction<number>>;
}
interface TagFilterList {
  title: string;
  value: string;
}

const NotificationDropdown = (props: NotificationDropdownProps) => {
  const [translate] = useTranslation();
  const ref = useRef();
  const { active, setActive, setCountUnread } = props;

  const {
    // handleClickToNotification,
    notifications,
    // hasMore,
    // loadingNotification,
    handleReadNotification,
    // buildAbsoluteLink,
    handleWhenClickOutside,
    handleChangeFilterUnread,
    filterUnread,
  } = useNotificationDropdownHook(active, setCountUnread);

  const listTagFilter = React.useMemo<TagFilterList[]>(() => {
    return [
      {
        title: translate("CM.tab_all"),
        value: "0",
      },
      {
        title: translate("CM.un_read"),
        value: "1",
      },
    ];
  }, [translate]);

  const handleClickOutside = React.useCallback(() => {
    setActive(false);
    handleWhenClickOutside();
  }, [handleWhenClickOutside, setActive]);

  utilService.useClickOutside(ref, handleClickOutside);

  return (
    <div
      className={classNames("notification-container", {
        "is-active": active,
      })}
      ref={ref}
    >
      <div className="notification-menu-wrapper">
        <div className="notification-menu__header">
          <div className="notification-menu__header-title">
            {translate("CM.notifications.title")}
          </div>
          <div>
            <TagFilter
              listTag={listTagFilter}
              onClick={(val) => {
                const value = val === "0" ? false : true;
                handleChangeFilterUnread(value);
              }}
              value={filterUnread ? "1" : "0"}
            />
          </div>
        </div>
        <div className="notification-content">
          <div className="notification-list__wrapper">
            {notifications && notifications?.length > 0 ? (
              notifications?.map((notification, index: number) => (
                <div key={index}>
                  <div
                    className={classNames("notification-item m-t--3xs", {
                      "notification-item__unread": !notification.isReaded,
                    })}
                    onClick={handleReadNotification(
                      notification.id,
                      notification.detailUrl ? notification.detailUrl : "#",
                      notification.isReaded
                    )}
                  >
                    <div className="notification-item__info">
                      <div className="notification-item__title">
                        <span className="notification-item__title-web">
                          {notification?.requestName}{" "}
                          {formatDateTime(utcVN(notification?.createdDate))}
                        </span>
                      </div>
                      {notification?.description ? (
                        <Tooltip
                          title={notification?.description?.replaceAll(
                            "DateTimeNow",
                            formatDateTime(utcVN(notification?.createdDate))
                          )}
                        >
                          <div className="notification-item__content">
                            {notification?.description?.replaceAll(
                              "DateTimeNow",
                              formatDateTime(utcVN(notification?.createdDate))
                            )}
                          </div>
                        </Tooltip>
                      ) : (
                        <></>
                      )}

                      <div className="notification-item__time">
                        {formatDateTimeFromNow(
                          dayjs(notification?.createdDate)?.utc(true),
                          localStorage.getItem("I18N_LANGUAGE")
                        )}
                      </div>
                    </div>
                    <div className="notification-item__icon">
                      <NotificationCounter
                        size={16}
                        color={
                          notification.isReaded
                            ? "var(--color-secondary)"
                            : "var(--color-primary)"
                        }
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "inherit" }}
                >
                  {translate("CM.notifications.nodata")}
                </div>
              </>
            )}
          </div>
        </div>
        {/* <div className="notification-menu__footer">
          <div
            className="notification-menu__footer-view"
            onClick={handleClickToNotification}
          >
            <img src={TrayArrowDown} alt="" />
            {translate("CM.notifications.viewAll")}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default NotificationDropdown;
