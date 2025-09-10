/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { notificationRepository } from "./NotificationRepository";

export default function useNotificationUnreadCountHook() {
  const [countUnread, setCountUnread] = React.useState<number>(0);
  React.useEffect(() => {
    const newFilter: any = {
      pageIndex: 1,
      pageSize: 1,
      isReaded: false,
    };

    notificationRepository.getAll(newFilter).subscribe({
      next: (results: any) => {
        setCountUnread(results?.data?.totalRecords);
      },
    });
  }, []);

  return {
    countUnread,
    setCountUnread,
  };
}
