/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Model, ModelFilter } from "react-3layer-common";
import { finalize, forkJoin, Observable } from "rxjs";
import { webService } from "../common-services/web-service";
import appMessageService from "../common-services/app-message-service";
import { AxiosError } from "axios";
import { fieldService } from "./field-service";
import { useHistory } from "react-router-dom";
import { utilService } from "core/services/common-services/util-service";
import {
  GeneralAction,
  GeneralActionEnum,
  ValidationError,
} from "../service-types";
import dayjs from "dayjs";

/* Action and Reducer of Mapping control */
type MappingModel<T extends Model> = {
  list?: T[];
  count?: number;
  contentIds?: number[];
  contentValues?: Model[];
  checkedKeys?: number[];
  checkedValues?: T[];
};

enum MappingTypeEnum {
  UPDATE_LIST,
  UPDATE_CONTENTS,
  UPDATE_CHECKED,
  CHECKED,
  CHECKED_ALL,
  UNCHECKED,
  UNCHECKED_ALL,
  UNDO_CHECKED,
}

interface MappingAction<T extends Model> {
  type: MappingTypeEnum;
  payload?: MappingModel<T>;
}

function mappingReducer<T extends Model>(
  state: MappingModel<T>,
  action: MappingAction<T>
): MappingModel<T> {
  switch (action.type) {
    case MappingTypeEnum.UPDATE_CONTENTS:
      return {
        ...state,
        contentIds: action.payload.contentIds,
        contentValues: action.payload.contentValues,
        checkedKeys: action.payload.contentIds,
      };
    case MappingTypeEnum.UPDATE_LIST:
      return {
        ...state,
        list: [...action.payload.list],
        count: action.payload.count,
      };
    case MappingTypeEnum.UPDATE_CHECKED:
      return {
        ...state,
        checkedKeys: action.payload.checkedKeys,
        checkedValues: action.payload.checkedValues,
      };
    case MappingTypeEnum.CHECKED:
      return {
        ...state,
        checkedKeys: [...state.checkedKeys, ...action.payload.checkedKeys],
        checkedValues: [
          ...state.checkedValues,
          ...action.payload.checkedValues,
        ],
      };
    case MappingTypeEnum.UNCHECKED:
      state.checkedKeys = state.checkedKeys.filter(
        (current: number) => current !== action.payload.checkedKeys[0]
      );
      state.checkedValues = state.checkedValues.filter(
        (current: T) => current.id !== action.payload.checkedValues[0]?.id
      );
      return {
        ...state,
      };
    case MappingTypeEnum.CHECKED_ALL:
      return {
        ...state,
        checkedKeys: Array.from(
          new Set([...state.checkedKeys, ...action.payload.checkedKeys])
        ),
        checkedValues: utilService.uniqueArray([
          ...state.checkedValues,
          ...action.payload.checkedValues,
        ]) as T[],
      };
    case MappingTypeEnum.UNCHECKED_ALL:
      state.checkedKeys = state.checkedKeys.filter((current: number) =>
        action.payload.checkedKeys.every((number) => number !== current)
      );
      state.checkedValues = state.checkedValues.filter((current: T) =>
        action.payload.checkedValues.every((item: T) => item.id !== current.id)
      );
      return {
        ...state,
      };
    case MappingTypeEnum.UNDO_CHECKED:
      return {
        ...state,
        checkedKeys: action.payload.checkedKeys,
        checkedValues: action.payload.checkedValues,
      };
    default:
      return { ...state };
  }
}

function handleSetAction<T extends Model>(action: GeneralAction<T>): T {
  return { ...(action.payload as T) };
}

function handleUpdateAction<T extends Model>(
  state: T,
  action: GeneralAction<T>
): T {
  const { errors, ...restPayload } = action.payload;
  if (errors) {
    state["errors"] = {
      ...state["errors"],
      ...errors,
    };
  }
  return { ...state, ...(restPayload as T) };
}

function handleSetErrorsAction<T extends Model>(
  state: T,
  action: GeneralAction<T>
): T {
  const errors: ValidationError = {};
  const errorArrays: ValidationError = {};

  if (!utilService.isEmpty(action.payload)) {
    processErrors(action.payload as ValidationError, errors, errorArrays);

    if (!utilService.isEmpty(errorArrays)) {
      processErrorArrays(state, errorArrays);
    }
  }

  return { ...state, errors };
}

function handleUpdateErrorsAction<T extends Model>(
  state: T,
  action: GeneralAction<T>
): T {
  if (action.payload && !utilService.isEmpty(action.payload)) {
    state.errors = {
      ...state["errors"],
      ...(action.payload as Model.Errors<Model>),
    };
  }
  return { ...state };
}

function processErrors(
  payload: ValidationError,
  errors: ValidationError,
  errorArrays: ValidationError
): void {
  Object.keys(payload).forEach((key: string) => {
    if (payload[key] && typeof payload[key] === "string") {
      errors[key] = payload[key];
    } else {
      errorArrays[key] = payload[key];
    }
  });
}

function processErrorArrays<T extends Model>(
  state: T,
  errorArrays: ValidationError
): void {
  Object.keys(errorArrays).forEach((key: string) => {
    const contents = state[key] || [];
    const values: any = errorArrays[key];

    Object.keys(values).forEach((key: string) => {
      const indexNumber = Number(key);
      if (contents[indexNumber]) {
        contents[indexNumber]["errors"] = { ...values[key] };
      } else {
        contents[indexNumber] = {};
        contents[indexNumber]["errors"] = { ...values[key] };
      }
    });
  });
}

function modelReducer<T extends Model>(state: T, action: GeneralAction<T>): T {
  switch (action.type) {
    case GeneralActionEnum.SET:
      return handleSetAction(action);

    case GeneralActionEnum.UPDATE:
      return handleUpdateAction(state, action);

    case GeneralActionEnum.SET_ERRORS:
      return handleSetErrorsAction(state, action);

    case GeneralActionEnum.UPDATE_ERRORS:
      return handleUpdateErrorsAction(state, action);

    default:
      return { ...state };
  }
}

export const detailService = {
  /**
   *
   * react hook for manage state of model
   * @param: ModelClass: new () => T
   * @param: initData: T
   *
   * @return: { model, dispatch }
   *
   * */
  useModel<T extends Model>(ModelClass: new () => T, initData?: T) {
    const [model, dispatch] = useReducer<Reducer<T, GeneralAction<T>>>(
      modelReducer,
      initData ? initData : new ModelClass()
    );
    const stateRef = useRef(model);
    stateRef.current = model;
    const getModel = useCallback(() => stateRef.current, []);

    return {
      model,
      dispatch,
      getModel,
    };
  },

  /**
   *
   * react hook for check detail page and set detail data
   * @param: getDetail:(id: number | string) => Observable<T>
   * @param: dispatch: React.Dispatch<ModelAction<T>>
   *
   * @return: { isDetail }
   *
   * */
  useGetIsDetail<T extends Model>(
    getDetail: (id: string) => Observable<T>,
    dispatch: React.Dispatch<any>,
    callBackFc?: (data: T) => T
  ) {
    const history = useHistory();
    const id = history.location.pathname.split("/").pop();
    // bắt id phải không include "-" (lỗi trong trường hợp tạo mới không có id thì id sẽ là entity-detail);
    const isDetail = useMemo(
      () => id !== null && !id?.includes("detail"),
      [id]
    );

    useEffect(() => {
      if (isDetail) {
        const subscription = getDetail(id).subscribe({
          next: (res) => {
            const newData =
              typeof callBackFc === "function"
                ? callBackFc(res.data)
                : res.data;
            dispatch({ type: GeneralActionEnum.SET, payload: newData });
          },
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    }, [callBackFc, dispatch, getDetail, id, isDetail]);

    return { isDetail };
  },

  /**
   *
   * react hook for handle actions in detail page
   * @param: model: T
   * @param: saveModel: (t: T) => Observable<T>
   *
   * @return: { loading, setLoading, handleSaveModel, handleGoMaster }
   *
   * */
  useActionsDetail<T extends Model>(
    model: T,
    saveModel: (t: T) => Observable<T>,
    handleChangeAllField: (data: unknown) => void,
    routeView: string,
    queryParams?: string,
    approveModel?: (t: T) => Observable<T>,
    cancelModel?: (t: T) => Observable<T>,
    rejectModel?: (t: T) => Observable<T>,
    resetModel?: (t: T) => Observable<T>
  ) {
    const history = useHistory();

    const baseRoute = useMemo(() => {
      const listPath = routeView.split("/");
      const baseRoute = "/" + listPath[listPath.length - 1];
      return baseRoute;
    }, [routeView]);

    const [loading, setLoading] = useState<boolean>(false);
    const [subscription] = webService.useSubscription();
    const { notifyUpdateItemSuccess, notifyUpdateItemError } =
      appMessageService.useCRUDMessage();

    const handleGoMaster = useCallback(() => {
      history.replace(
        `${routeView}${baseRoute}-master${queryParams ? queryParams : ""}`
      );
    }, [routeView, baseRoute, history, queryParams]);

    const handleSaveModel = useCallback(() => {
      setLoading(true);
      subscription.add(
        saveModel(model)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: () => {
              notifyUpdateItemSuccess();
              handleGoMaster();
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError({
                message: "Cập nhật có lỗi",
                description: utilService.getGeneralError(error),
              });
            },
          })
      );
    }, [
      handleChangeAllField,
      handleGoMaster,
      model,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      saveModel,
      subscription,
    ]);

    const handleSaveNoneRedirect = useCallback(() => {
      setLoading(true);
      subscription.add(
        saveModel(model)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: (item: T) => {
              handleChangeAllField(item);
              notifyUpdateItemSuccess();
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError({
                message: "Cập nhật có lỗi",
                description: utilService.getGeneralError(error),
              });
            },
          })
      );
    }, [
      handleChangeAllField,
      model,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      saveModel,
      subscription,
    ]);

    const handleSavePromise = useCallback(async () => {
      const promise = new Promise((resolve, reject) => {
        setLoading(true);
        subscription.add(
          saveModel(model)
            .pipe(finalize(() => setLoading(false)))
            .subscribe({
              next: (item: T) => {
                handleChangeAllField(item);
                notifyUpdateItemSuccess();
                resolve(item);
              },
              error: (error: AxiosError<T>) => {
                if (error.response && error.response.status === 400)
                  handleChangeAllField(error.response?.data);
                notifyUpdateItemError({
                  message: "Cập nhật có lỗi",
                  description: utilService.getGeneralError(error),
                });
                reject(error);
              },
            })
        );
      });
      return promise;
    }, [
      handleChangeAllField,
      model,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      saveModel,
      subscription,
    ]);
    const handleCancelModel = useCallback(() => {
      setLoading(true);
      subscription.add(
        cancelModel(model)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: () => {
              notifyUpdateItemSuccess();
              handleGoMaster();
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError({
                message: "Cập nhật có lỗi",
                description: utilService.getGeneralError(error),
              });
            },
          })
      );
    }, [
      cancelModel,
      handleChangeAllField,
      handleGoMaster,
      model,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      subscription,
    ]);
    const handleRejectModel = useCallback(() => {
      setLoading(true);
      subscription.add(
        rejectModel(model)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: () => {
              notifyUpdateItemSuccess();
              handleGoMaster();
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError({
                message: "Cập nhật có lỗi",
                description: utilService.getGeneralError(error),
              });
            },
          })
      );
    }, [
      handleChangeAllField,
      handleGoMaster,
      model,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      rejectModel,
      subscription,
    ]);
    const handleApproveModel = useCallback(() => {
      setLoading(true);
      subscription.add(
        approveModel(model)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: () => {
              notifyUpdateItemSuccess();
              handleGoMaster();
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError({
                message: "Cập nhật có lỗi",
                description: utilService.getGeneralError(error),
              });
            },
          })
      );
    }, [
      approveModel,
      handleChangeAllField,
      handleGoMaster,
      model,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      subscription,
    ]);
    const handleResetModel = useCallback(() => {
      setLoading(true);
      subscription.add(
        resetModel(model)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: () => {
              notifyUpdateItemSuccess();
              handleGoMaster();
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError({
                message: "Cập nhật có lỗi",
                description: utilService.getGeneralError(error),
              });
            },
          })
      );
    }, [
      resetModel,
      handleChangeAllField,
      handleGoMaster,
      model,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      subscription,
    ]);

    return {
      loading,
      setLoading,
      handleSaveModel,
      handleGoMaster,
      handleSaveNoneRedirect,
      handleSavePromise,
      handleApproveModel,
      handleCancelModel,
      handleRejectModel,
      handleResetModel,
    };
  },

  /**
   *
   * react hook for handle logic in detail modal page
   * @param: ModelClass: new () => T
   * @param: getDetail: (id: number) => Observable<T>
   * @param: saveModel: (t: Model) => Observable<T>
   * @param: saveModel: handleSeach?: () => void
   * 
   * @return: { model,
      dispatch,
      isOpenDetailModal,
      loadingModel,
      handleOpenDetailModal,
      handleSaveModel,
      handleCloseDetailModal,
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeAllField }
   *
   * */
  useDrawer<T extends Model>(
    ModelClass: new () => T,
    getDetail: (id: number) => Observable<T>,
    saveModel: (t: T) => Observable<T>,
    updateSuccesCallback?: () => void,
    defaultModel?: T
  ) {
    const { notifyUpdateItemSuccess, notifyUpdateItemError } =
      appMessageService.useCRUDMessage();

    const [subscription] = webService.useSubscription();

    const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
    const [loadingDrawer, setLoadingDrawer] = useState<boolean>(false);
    const { model, dispatch } = this.useModel(ModelClass);
    const {
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeAllField,
      handleChangeBoolField,
      handleChangeMultipleField,
    } = fieldService.useField(model, dispatch);

    const handleOpenDrawer = useCallback(
      (value?: number) => {
        setIsOpenDrawer(true);
        if (value) {
          setLoadingDrawer(true);
          subscription.add(
            getDetail(value)
              .pipe(finalize(() => setLoadingDrawer(false)))
              .subscribe((item: T) => {
                handleChangeAllField(item);
              })
          );
        } else {
          handleChangeAllField(defaultModel ? defaultModel : new ModelClass());
        }
      },
      [subscription, getDetail, handleChangeAllField, defaultModel, ModelClass]
    );

    const handleSaveModel = useCallback(() => {
      setLoadingDrawer(true);
      subscription.add(
        saveModel(model)
          .pipe(finalize(() => setLoadingDrawer(false)))
          .subscribe({
            next: (item: T) => {
              handleChangeAllField(item);
              setIsOpenDrawer(false);
              if (typeof updateSuccesCallback === "function")
                updateSuccesCallback();
              notifyUpdateItemSuccess({
                message: "Cập nhật thành công",
                className: "antd-notification-drawer",
              });
            },
            error: (error: AxiosError<T>) => {
              if (error.response && error.response.status === 400)
                handleChangeAllField(error.response?.data);
              notifyUpdateItemError({
                message: "Cập nhật thất bại",
                className: "antd-notification-drawer",
              });
            },
          })
      );
    }, [
      saveModel,
      subscription,
      updateSuccesCallback,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      handleChangeAllField,
      model,
    ]);

    const handleSaveModelPromise: () => Promise<T> = useCallback(() => {
      setLoadingDrawer(true);
      const promise: Promise<T> = new Promise((resolve, reject) => {
        subscription.add(
          saveModel(model)
            .pipe(finalize(() => setLoadingDrawer(false)))
            .subscribe({
              next: (item: T) => {
                handleChangeAllField(item);
                setIsOpenDrawer(false);
                notifyUpdateItemSuccess({
                  message: "Cập nhật thành công",
                  className: "antd-notification-drawer",
                });
                resolve(item);
              },
              error: (error: AxiosError<T>) => {
                if (error.response && error.response.status === 400)
                  handleChangeAllField(error.response?.data);
                notifyUpdateItemError({
                  message: "Cập nhật thất bại",
                  className: "antd-notification-drawer",
                });
                reject(false);
              },
            })
        );
      });
      return promise;
    }, [
      saveModel,
      subscription,
      notifyUpdateItemError,
      notifyUpdateItemSuccess,
      handleChangeAllField,
      model,
    ]);

    const handleCloseDrawer = useCallback(() => {
      setIsOpenDrawer(false);
      if (model.id) handleChangeAllField({ ...model });
      else handleChangeAllField({ ...new ModelClass() });
    }, [ModelClass, handleChangeAllField, model]);

    return {
      model,
      dispatch,
      isOpenDrawer,
      loadingDrawer,
      handleOpenDrawer,
      handleSaveModel,
      handleCloseDrawer,
      handleChangeMultipleField,
      handleChangeBoolField,
      handleChangeSingleField,
      handleChangeSelectField,
      handleChangeMultipleSelectField,
      handleChangeDateField,
      handleChangeTreeField,
      handleChangeAllField,
      handleSaveModelPromise,
    };
  },

  /**
   *
   * react hook for handle logic in detail modal page
   * @param: list: (filter: TFilter) => Observable<T[]>,
   * @param: count: (filter: TFilter) => Observable<number>,
   * @param: mappingData: (data: T[]) => TContent[],
   * @param: modelFilter: ModelFilter,
   * @param: contents: TContent[],
   * @param: isMultipleMapping: boolean = false
   *
   * @return: {
   *  open,
   *  listMapping: mappingModel.list,
   *  countMapping: mappingModel.count,
   *  checkedKeys: mappingModel.checkedKeys,
   *  spinning,
   *  handleOpenMapping,
   *  handleCloseMapping,
   *  handleSaveMapping,
   *  handleCancelMapping,
   *  handleCheckItem,
   *  }
   *
   * */

  useMappingService<
    T extends Model,
    TFilter extends ModelFilter,
    TContent extends Model
  >(
    list: (filter: TFilter) => Observable<T[]>,
    count: (filter: TFilter) => Observable<number>,
    modelFilter: ModelFilter,
    contents: TContent[],
    mappingField: [string, string],
    isMultipleMapping = false
  ) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [spinning, setSpinning] = React.useState<boolean>(false);
    const [mappingModel, dispatchMappingModel] = React.useReducer<
      Reducer<MappingModel<T>, MappingAction<T>>
    >(mappingReducer, {
      list: [],
      count: 0,
      checkedKeys: [],
      checkedValues: [],
    });
    const [subscription] = webService.useSubscription();
    const firstUpdate = React.useRef(true);
    const firstRender = React.useRef(true);
    const handleSaveMapping = React.useCallback(() => {
      const { checkedValues } = mappingModel;
      setOpen(false);
      return [...checkedValues];
    }, [mappingModel]);

    const handleResetMapping = React.useCallback(() => {
      const checkedKeys =
        contents.length > 0
          ? contents.map((content) => content[mappingField[0]])
          : [];
      const checkedValues =
        contents.length > 0
          ? contents.map((content) => content[mappingField[1]])
          : [];
      dispatchMappingModel({
        type: MappingTypeEnum.UPDATE_CHECKED,
        payload: {
          checkedKeys,
          checkedValues,
        },
      });
    }, [mappingField, contents]);

    const handleCancelMapping = React.useCallback(() => {
      if (!isMultipleMapping) {
        handleResetMapping();
      }
      setOpen(false);
    }, [isMultipleMapping, handleResetMapping]);

    const handleChangeItem = React.useCallback(
      (checkedIds: number[], checkedRows: T[], info: { type: string }) => {
        if (info && info.type === "all" && checkedIds.length === 0) {
          const { checkedKeys, checkedValues } = mappingModel;
          dispatchMappingModel({
            type: MappingTypeEnum.UPDATE_CHECKED,
            payload: {
              checkedKeys: [...checkedKeys],
              checkedValues: [...checkedValues],
            },
          });
        } else {
          dispatchMappingModel({
            type: MappingTypeEnum.UPDATE_CHECKED,
            payload: {
              checkedKeys: [...checkedIds],
              checkedValues: [...checkedRows],
            },
          });
        }
      },
      [mappingModel]
    );

    const handleCheck = React.useCallback((record: T, selected: boolean) => {
      const { id } = record;
      if (selected) {
        dispatchMappingModel({
          type: MappingTypeEnum.CHECKED,
          payload: {
            checkedKeys: [id],
            checkedValues: [record],
          },
        });
      } else {
        dispatchMappingModel({
          type: MappingTypeEnum.UNCHECKED,
          payload: {
            checkedKeys: [id],
            checkedValues: [record],
          },
        });
      }
    }, []);

    const handleCheckAll = React.useCallback(
      (selected: boolean, selectedRows: T[], changeRows: T[]) => {
        const selectedIds = changeRows.map((row) => row.id);
        if (selected) {
          dispatchMappingModel({
            type: MappingTypeEnum.CHECKED_ALL,
            payload: {
              checkedKeys: [...selectedIds],
              checkedValues: [...changeRows],
            },
          });
        } else {
          dispatchMappingModel({
            type: MappingTypeEnum.UNCHECKED_ALL,
            payload: {
              checkedKeys: [...selectedIds],
              checkedValues: [...changeRows],
            },
          });
        }
      },
      []
    );

    const handleGetListMapping = React.useCallback(
      (filterParam?: TFilter) => {
        setSpinning(true);
        const filterValue = filterParam
          ? { ...filterParam }
          : ({ ...new ModelFilter(), pageIndex: 0, pageSize: 10 } as TFilter);
        const getMappingData = forkJoin([list(filterValue), count(filterValue)])
          .pipe(
            finalize(() => {
              setSpinning(false);
            })
          )
          .subscribe({
            next: (results: [T[], number]) => {
              const list = results[0];
              const count = Number(results[1]);
              dispatchMappingModel({
                type: MappingTypeEnum.UPDATE_LIST,
                payload: {
                  list,
                  count,
                },
              });
            },
          });
        subscription.add(getMappingData);
      },
      [count, list, subscription]
    );

    const handleOpenMapping = React.useCallback(() => {
      setOpen(true);
      if (mappingModel.list.length === 0) {
        handleGetListMapping();
      }
      if (isMultipleMapping) {
        dispatchMappingModel({
          type: MappingTypeEnum.UPDATE_CHECKED,
          payload: {
            checkedKeys: [],
            checkedValues: [],
          },
        });
      }
    }, [handleGetListMapping, isMultipleMapping, mappingModel.list]);

    const handleCloseMapping = React.useCallback(() => {
      setOpen(false);
    }, []);

    React.useEffect(() => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      if (contents && !isMultipleMapping) {
        handleResetMapping();
      }
    }, [contents, isMultipleMapping, handleResetMapping]);

    React.useEffect(() => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      if (modelFilter) {
        handleGetListMapping(modelFilter as TFilter);
      }
    }, [handleGetListMapping, modelFilter]);

    return {
      open,
      listMapping: mappingModel.list,
      countMapping: mappingModel.count,
      checkedKeys: mappingModel.checkedKeys,
      spinning,
      handleOpenMapping,
      handleCloseMapping,
      handleSaveMapping,
      handleCancelMapping,
      handleChangeItem,
      handleCheck,
      handleCheckAll,
    };
  },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertDataToHaveIndexBeforeValidate(
  dataNode: any,
  paths: string[],
  targetData: any,
  blackList: string[] = []
) {
  // dataNode là node dữ liệu hiện tại, paths là mảng các key để truy cập vào node đó, entryData là dữ liệu được nhập vào
  const newPaths = [...paths];
  Object.keys(dataNode).forEach((currentKey) => {
    // check nếu typeof của từng là object
    // typeof là object thì nó là object hoặc array
    if (
      typeof dataNode[currentKey] === "object" &&
      dataNode[currentKey] !== null
    ) {
      // nếu là array,
      if (
        Array.isArray(dataNode[currentKey]) &&
        !dayjs.isDayjs(dataNode[currentKey][0]) &&
        !blackList.includes(currentKey)
      ) {
        // chúng ta cần thêm indexBeforeValidate vào mảng dữ liệu
        // indexBeforeValidate sẽ là index của phần tử trong mảng trước khi validate
        const newListData = dataNode[currentKey]?.map((dataChild, index) => {
          return {
            ...dataChild,
            indexBeforeValidate: index,
          };
        });
        // sau đó chúng ta sẽ map lại mảng mới (đi kèm indexBeforeValidate) vào mảng đích
        let currentObject = targetData;
        newPaths?.forEach((p, index) => {
          if (index < newPaths.length) {
            currentObject = currentObject[p];
          }
        });
        // gán lại vào mảng đích
        currentObject[currentKey] = newListData;

        // Sau khi gán xong, tiếp tục check xem liệu mảng này có dạng nested không (đệ quy từng phần tử để tiếp tục check)
        dataNode[currentKey]?.forEach((p, index) => {
          convertDataToHaveIndexBeforeValidate(
            p,
            [...newPaths, currentKey, index.toString()],
            targetData
          );
        });
      } else {
        // nếu là object
        // thực hiện lại đệ quy
        convertDataToHaveIndexBeforeValidate(
          dataNode[currentKey],
          [...newPaths, currentKey],
          targetData
        );
      }
    }
  });
  return targetData;
}
