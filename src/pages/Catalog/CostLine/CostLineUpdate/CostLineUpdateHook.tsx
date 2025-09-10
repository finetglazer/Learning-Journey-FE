import { AxiosError } from "axios";
import { costLineRepository } from "core/repositories/CostLineRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralAction } from "core/services/service-types";
import { isEqual, isUndefined } from "lodash";
import {
  BudgetCalculationMethod,
  BudgetPeriod,
  CostLine,
} from "models/CostLine";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize } from "rxjs";
import {
  CostLineMaster,
  CostLineMasterContext,
  DEFAULT_MODAL_TYPE,
  ModalType,
} from "../CostLineMaster/CostLineMasterHook";

export interface CostLineUpdate {
  model: CostLine;
  dispatchModel: React.Dispatch<GeneralAction<CostLine>>;
  loading: boolean;
  history: any;
}

export const UpdateCostLineContext = createContext<CostLineUpdate>({
  model: new CostLine(),
  dispatchModel: null,
  loading: false,
  history: null,
});

export const useCostLineUpdateHook = (
  setModalType: Dispatch<SetStateAction<ModalType>>,
  id: string
) => {
  const { handleLoadList } = useContext<CostLineMaster>(CostLineMasterContext);
  const [translate] = useTranslation();
  const { model, dispatch } = detailService.useModel<CostLine>(CostLine);
  const [loading, setLoading] = useState<boolean>(false);

  const history = useHistory();

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    handleChangeBoolField,
  } = fieldService.useField(model, dispatch);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const getCostLineDetail = useCallback(
    (id: string) => {
      setLoading(true);
      costLineRepository
        .detail(id)
        .pipe(finalize(() => setLoading(false)))
        .subscribe({
          next: (response) => {
            if (isEqual(response?.status, 200)) {
              const { data } = response;
              handleChangeAllField({
                ...data,
                budgetPeriodValue: {
                  id: data?.budgetPeriod,
                  name: translate(`CL.${BudgetPeriod[data?.budgetPeriod]}_txt`),
                },
                budgetCalculationMethodValue: {
                  id: data?.budgetCalculationMethod,
                  name: translate(
                    `CL.${
                      BudgetCalculationMethod[data?.budgetCalculationMethod]
                    }_txt`
                  ),
                },
                parent: {
                  id: data?.parentId,
                  name: data?.parentName,
                },
                defaultCostDriverValue: {
                  id: data?.costDriverId,
                  name: data?.costDriverName,
                },
              });
            }
          },
          error: (error: AxiosError) => {
            console.log("Could not fetch cost line detail with error ", error);
          },
        });
    },
    [handleChangeAllField]
  );

  const onSave = () => {
    setLoading(true);
    costLineRepository
      .updateCostLine(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (isEqual(response?.status, 200)) {
            notifyToast({
              message: translate("CL.update_cost_line_succeed_message"),
            });
            setModalType(DEFAULT_MODAL_TYPE);
            handleLoadList();
          }
        },
        error: (error: AxiosError) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
            });
          } else {
            notifyToast({
              message: error.response?.data?.message,
              type: "error",
            });
          }
        },
      });
  };

  useEffect(() => {
    if (!isUndefined(id)) {
      getCostLineDetail(id);
    }
  }, [getCostLineDetail, id]);

  return {
    model,
    dispatchModel: dispatch,
    history,
    loading,

    // non-context:
    translate,
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    handleChangeBoolField,
    onSave,
  };
};
