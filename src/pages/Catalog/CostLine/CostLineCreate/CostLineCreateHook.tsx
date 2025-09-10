import { AxiosError } from "axios";
import { costLineRepository } from "core/repositories/CostLineRepository";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { GeneralAction } from "core/services/service-types";
import { isEqual } from "lodash";
import { CostLine } from "models/CostLine";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
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

export interface CreateCostLine {
  model: CostLine;
  dispatchModel: React.Dispatch<GeneralAction<CostLine>>;
  loading: boolean;
  history: any;
}

export const CreateCostLineContext = createContext<CreateCostLine>({
  model: new CostLine(),
  dispatchModel: null,
  loading: false,
  history: null,
});

export const useCostLineCreateHook = (
  setModalType: Dispatch<SetStateAction<ModalType>>
) => {
  const { handleLoadList } = useContext<CostLineMaster>(CostLineMasterContext);
  const [translate] = useTranslation();
  const DEFAULT_COST_LINE_STATE = useMemo(
    () => ({
      isActive: true,
      budgetCalculationMethodValue: {
        id: 1,
        name: translate("CL.cumulative_txt"),
      },
      budgetPeriodValue: {
        id: 0,
        name: translate("CL.monthly_txt"),
      },
    }),
    [translate]
  );

  const { model, dispatch } = detailService.useModel<CostLine>(
    CostLine,
    DEFAULT_COST_LINE_STATE
  );
  const [loading, setLoading] = useState<boolean>(false);

  const history = useHistory();

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
    handleChangeBoolField,
  } = fieldService.useField(model, dispatch);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const onSave = () => {
    setLoading(true);
    costLineRepository
      .createCostLine(model)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (isEqual(response?.status, 200)) {
            notifyToast({
              message: translate("CL.create_cost_line_succeed_message"),
            });
            handleChangeAllField({
              ...new CostLine(),
              ...DEFAULT_COST_LINE_STATE,
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
              message: error.response?.data?.messages,
              type: "error",
            });
          }
        },
      });
  };

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
