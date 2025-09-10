import { ModelFilter } from "react-3layer-common";
import { of } from "rxjs";

export const yearList = (valueFilter: ModelFilter) => {
  const yearString: string = valueFilter?.year?.toString() || "";
  const currentYear = new Date().getFullYear();
  const list = [];
  for (let year = currentYear; year >= 1900; year--) {
    if (year?.toString()?.includes(yearString)) {
      list.push({ id: year, name: year.toString() });
    }
  }
  return of(list);
};
