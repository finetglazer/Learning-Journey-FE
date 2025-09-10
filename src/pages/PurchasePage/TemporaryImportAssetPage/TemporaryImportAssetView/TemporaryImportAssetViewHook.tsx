import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import ApprovalHistoryTab from "components/ApprovalHistoryTab/ApprovalHistoryTab";
import { TOPIC_TYPE } from "config/const";
import {
  APP_OVERVIEW,
  TEMPORARY_IMPORT_ASSET_MASTER_ROUTE,
  TEMPORARY_IMPORT_ASSET_VIEW_ROUTE,
} from "config/route-const";
import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { HttpStatusCode } from "core/services/service-types";
import saveAs from "file-saver";
import { get, isEmpty, isEqual, size, toLower } from "lodash";
import { RepoStateDetail } from "models/Payment";
import {
  Breadcrumbs,
  ConfirmModalType,
  TemporaryImportAssetStatus,
  TemporaryImportAssetTypeModel,
  TemporaryImportAssetViewModel,
} from "models/TemporaryImportAsset/TemporaryImportAsset";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import TabName from "pages/PaymentPage/PaymentCreate/Components/TabName/TabName";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { finalize, tap } from "rxjs";
import { ModelSelect } from "../TemporaryImportAssetMaster/TemporaryImportAssetMasterHook";
import { temporaryImportAssetRepository } from "../TemporaryImportAssetRepository";
import TemporaryImportAssetDetailIntergration from "./Components/IntergarationView/TemporaryImportAssetDetailIntergration";
import PurchasePlanGenerationInfoTabView from "./Components/TemporaryImportAssetTabView/TemporaryImportAssetTabView";

const APPROVE_TYPE = "approveType";

export const TemporaryImportAssetViewHookContext =
  createContext<TemporaryImportAssetViewModel>({
    model: new TemporaryImportAssetTypeModel(),
    dispatchModel: null,
    loading: false,
    handleChangeAllField: null,
    handleChangeSingleField: null,
    handleDownloadFileAttached: null,
    breadcrumbs: [],
    loadingModal: false,
    loadingButtonConfirm: false,
    modelSelected: null,
    setModelSelected: null,
    tabRepositoriesView: null,
    translate: null,
    handleApplyButtonInConfirmModal: null,
    handleApproveTemporaryAsset: null,
  });

export function useTemporaryImportAssetViewHook() {
  const [translate] = useTranslation();
  const history = useHistory();
  const location = useLocation<{ isViewWaitingApprove?: boolean }>();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const { id: idDetail } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [modelSelected, setModelSelected] = useState<ModelSelect | null>(null);
  const [loadingButtonConfirm, setLoadingButtonConfirm] =
    useState<boolean>(false);
  const { model, dispatch: dispatchModel } =
    detailService.useModel<TemporaryImportAssetTypeModel>(
      TemporaryImportAssetTypeModel
    );

  const queryParams = new URLSearchParams(location.search);
  const approveType = queryParams.get(APPROVE_TYPE);
  const isViewWaitingApproved = queryParams.get("isViewWaitingApprove");

  const { handleChangeAllField, handleChangeSingleField } =
    fieldService.useField(model, dispatchModel);

  const breadcrumbsInit = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_procurement"),
    },
    {
      name: translate("CM.menu_temporary_import_asset"),
      path: TEMPORARY_IMPORT_ASSET_MASTER_ROUTE,
    },
    {
      name: translate("TIA.title_temporary_import_asset_view"),
      path: TEMPORARY_IMPORT_ASSET_VIEW_ROUTE + `/${idDetail}`,
    },
  ];

  const disabledButtonOpinion = useMemo(() => {
    const nonApprovalStates: number[] = [
      TemporaryImportAssetStatus.CANCEL,
      TemporaryImportAssetStatus.REJECT,
      TemporaryImportAssetStatus.APPROVE,
    ];

    return nonApprovalStates.includes(model?.status);
  }, [model?.status]);

  const isViewWaitingApprove = useMemo(() => {
    if (approveType) return true;

    return isEqual(toLower(isViewWaitingApproved), "true");
  }, [approveType, isViewWaitingApproved]);

  const [tabRepositoriesView, setTabRepositoriesView] =
    useState<RepoStateDetail[]>();

  const tabRepositoriesViewInit: RepoStateDetail[] = [
    {
      tabKey: "0",
      tabTitle: (
        <TabName
          text={translate("PP.tab_general_information")}
          isShowIconError={model.errorTabs?.includes(0)}
        />
      ),
      children: <PurchasePlanGenerationInfoTabView />,
    },
  ];

  useEffect(() => {
    if (model?.status == 2) {
      setTabRepositoriesView([
        ...tabRepositoriesViewInit,
        {
          tabKey: "1",
          tabTitle: (
            <TabName text={translate("TIA.tab_integrated_asset_management")} />
          ),
          children: <TemporaryImportAssetDetailIntergration />,
        },
        {
          tabKey: "2",
          tabTitle: <TabName text={translate("CM.txt_approval_history")} />,
          children: (
            <ApprovalHistoryTab
              topicId={idDetail}
              topicType={TOPIC_TYPE.TEMPORARY_IMPORT_ASSET}
              disabledButtonOpinion={disabledButtonOpinion}
              processAfterFeedbackSubmission={
                handleGetTemporaryImportAssetDetail
              }
              model={model}
            />
          ),
        },
      ]);
    } else {
      setTabRepositoriesView([
        ...tabRepositoriesViewInit,
        {
          tabKey: "1",
          tabTitle: <TabName text={translate("CM.txt_approval_history")} />,
          children: (
            <ApprovalHistoryTab
              topicId={idDetail}
              topicType={TOPIC_TYPE.TEMPORARY_IMPORT_ASSET}
              disabledButtonOpinion={disabledButtonOpinion}
              processAfterFeedbackSubmission={
                handleGetTemporaryImportAssetDetail
              }
              model={model}
            />
          ),
        },
      ]);
    }
  }, [model?.status]);

  const [breadcrumbs, setBreadcrumbs] =
    useState<Breadcrumbs[]>(breadcrumbsInit);

  useEffect(() => {
    if (!isEmpty(idDetail)) {
      setBreadcrumbs((prevState) => {
        const newBreadcrumbs = [...prevState];
        newBreadcrumbs[size(prevState) - 1] = {
          name: `${translate("TIA.title_temporary_import_asset_view", {
            code: model?.code,
          })}`,
        };
        return newBreadcrumbs;
      });
    }
  }, [idDetail, translate, model?.code]);

  const handleGoMaster = useCallback(() => {
    history.push(TEMPORARY_IMPORT_ASSET_MASTER_ROUTE);
  }, [history]);

  const handleGetTemporaryImportAssetDetail = () => {
    const params = {
      isViewWaitingApprove,
    };

    if (!idDetail) return;
    setLoading(true);
    temporaryImportAssetRepository
      .getTemporaryImportAssetDetail(idDetail, params)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: (response: any) => {
          if (!response) return;

          const {
            creator,
            organization,
            position,
            orgBusinessBranch,
            orgBusinessDepartment,
            description,
            contract,
            supplier,
          } = response;

          handleChangeAllField({
            ...model,
            ...response,
            generalInformation: {
              creatorName: creator?.name,
              organizationName: organization?.name,
              position: position?.name,
              orgBusinessBranch: orgBusinessBranch?.name,
              orgBusinessDepartment: orgBusinessDepartment?.businessUnitName,
              description,
            },
            baseContract: {
              id: contract?.id,
              code: contract?.code,
              contractNo: contract?.contractNo,
              name: contract?.name,
              taxCode: supplier?.taxCode,
              supplierName: supplier?.name,
              currency: contract?.currency,
            },
          });
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error?.response?.data?.message,
            type: "error",
          });
        },
        complete: () => {
          setLoading(false);
        },
      });
  };

  const handleDownloadFileAttached = (file?: FileModel) => {
    budgetRepository.downloadFile(file?.path).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, file?.name);
      },
    });
  };

  const refreshListAndHideModal = () => {
    handleGoMaster();
    notifyToast();
    setModelSelected(null);
  };

  const handleUpdateError = (error: AxiosError) => {
    if (isEqual(error.response?.status, HttpStatusCode.BAD_REQUEST)) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors["reason"],
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    }
  };

  // Delete single budget
  const deleteTemporaryImport = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    temporaryImportAssetRepository
      .deleteTemporaryImportAsset(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => {
          setLoadingModal(false);
          setLoadingButtonConfirm(false);
        })
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleUpdateError,
      });
  };

  const cancelTemporaryImport = (id: string, reason: string) => {
    setLoadingButtonConfirm(true);
    temporaryImportAssetRepository
      .cancelTemporaryImportAsset(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => {
          setLoadingModal(false);
          setLoadingButtonConfirm(false);
        })
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleUpdateError,
      });
  };

  //Return req
  const actionTemporaryImport = (
    id: string,
    reason: string,
    action: number
  ) => {
    setLoadingButtonConfirm(true);
    temporaryImportAssetRepository
      .actionTemporaryImportAsset(id, reason, action)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => {
          setLoadingModal(false);
          setLoadingButtonConfirm(false);
        })
      )
      .subscribe({
        next: refreshListAndHideModal,
        error: handleUpdateError,
      });
  };

  const handleApplyButtonInConfirmModal = (
    model: TemporaryImportAssetTypeModel,
    reason: string,
    action: number
  ) => {
    const id = get(model, "id");
    if (!id) return; // Return early if no ID

    const actionMap = {
      [ConfirmModalType.CANCEL]: () => cancelTemporaryImport(id, reason),
      [ConfirmModalType.DELETE]: () => deleteTemporaryImport(id, reason),
    };

    get(actionMap, modelSelected?.type, () =>
      actionTemporaryImport(id, reason, action)
    )();
  };

  useEffect(() => {
    if (!idDetail) return;

    handleGetTemporaryImportAssetDetail();
  }, [idDetail]);

  const handleApproveTemporaryAsset = (id: string) => {
    const actionType = 0;
    setLoading(true);
    temporaryImportAssetRepository
      .approveTemporaryAsset(id, actionType)
      .pipe(
        tap(() => setLoading(true)),
        finalize(() => setLoading(false))
      )
      .subscribe({
        next: () => {
          notifyToast();
          handleGoMaster();
        },
        error: (error: AxiosError) => {
          handleError({
            model,
            error,
            handleChangeAllField,
          });
        },
      });
  };

  return {
    translate,
    model,
    loading,
    dispatchModel,
    loadingModal,
    loadingButtonConfirm,
    handleChangeAllField,
    handleDownloadFileAttached,
    handleApplyButtonInConfirmModal,
    modelSelected,
    setModelSelected,
    breadcrumbs,
    tabRepositoriesView,
    handleApproveTemporaryAsset,
    handleChangeSingleField,
  };
}
