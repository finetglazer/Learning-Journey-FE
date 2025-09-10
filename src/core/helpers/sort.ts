import { Menu } from "config/config-type";
import * as i18n from "i18next";

export const sortMenu = (menus: Menu[]) =>
  menus.sort((leftItem, rightItem) =>
    i18n
      .t(leftItem?.name as string)
      .localeCompare(i18n.t(rightItem?.name as string))
  );
