import { isEmpty } from "lodash";

export function getLastPath(path: string, idDetail?: string): string {
  const parts = path.split("/");
  if (!isEmpty(idDetail)) {
    return "/" + parts[parts.length - 2];
  }
  return "/" + parts[parts.length - 1];
}
