import { budgetRepository } from "pages/BudgetPage/BudgetRepository";

export const getBase65ByPath = async (path: string) => {
  try {
    const response = await budgetRepository.downloadFile(path).toPromise();
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise<string | null>((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(path);
      };
    });
  } catch (error) {
    return path;
  }
};
