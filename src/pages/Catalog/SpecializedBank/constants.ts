import { numberConstants } from "core/config/consts";
import { t } from "i18next";
import { isEmpty } from "lodash";
import { Model, ModelFilter } from "react-3layer-common";
import { Observable, of } from "rxjs";

export const listStatus = () => [
  { id: numberConstants.ONE, code: "ACTIVE", name: t("CM.txt_status_active") },
  {
    id: numberConstants.ZERO,
    code: "DEACTIVATE",
    name: t("CM.txt_status_deactivate"),
  },
];

export const listType = (commonFilter?: ModelFilter): Observable<Model[]> => {
  const searchText = commonFilter?.name?.contain;
  const trimmedText = searchText?.replace(/\s+/g, " ").trim();
  const list = [
    {
      id: numberConstants.ZERO.toString(),
      code: "BANK",
      name: t("SB.txt_type_specialized_bank"),
    },
    {
      id: numberConstants.ONE.toString(),
      code: "BLOCK",
      name: t("SB.txt_type_specialized_block"),
    },
  ];

  if (!isEmpty(trimmedText)) {
    return of(
      list.filter((item) =>
        item.name.toLowerCase().includes(trimmedText.toLowerCase())
      )
    );
  }

  return of(list);
};
