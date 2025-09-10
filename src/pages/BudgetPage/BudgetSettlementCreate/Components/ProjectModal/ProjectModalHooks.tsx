import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import {
  FilterAction,
  FilterActionEnum,
  KeyType,
} from "core/services/service-types";
import { type TFunction } from "i18next";
import { isEqual, isNil } from "lodash";
import { Project } from "models/Project/Project";
import { ProjectFilter } from "models/Project/ProjectFilter";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "rtk/useRedux";
import { finalize } from "rxjs";
import { ModalType } from "../../BudgetSettlementCreateHook";
import { budgetSettlementRepository } from "../../BudgetSettlementRepository";

interface ProjectModalHooksProps {
  type: number;
  setModal: Dispatch<SetStateAction<ModalType>>;
  callback?: (list: Project[]) => void;
  addedProjectIds: string[];
}

export interface ProjectBudget {
  list: Project[];
  modelFilter: ProjectFilter;
  count: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<ProjectFilter>>;
  handleLoadList: (filterParams?: ProjectFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<Project>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  translate: TFunction;
}

interface Profile {
  account: {
    email?: string;
    name?: string;
  };
  businessDepartment: {
    id?: string;
    name?: string;
    businessUnitId?: string;
    businessUnitCode?: string;
    businessUnitName?: string;
  };
}

export const ProjectBudgetContext = createContext<ProjectBudget>({
  list: [],
  modelFilter: null,
  count: 0,
  loadingList: false,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  rowSelection: undefined,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
  translate: null,
});

export const useProjectModalHooks = ({
  type,
  setModal,
  callback,
  addedProjectIds,
}: ProjectModalHooksProps) => {
  const [translate] = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const profile: Profile = useAppSelector((state) => state.profile);

  const businessUnitsValue = useMemo(() => {
    if (
      isNil(profile?.businessDepartment) ||
      isNil(profile.businessDepartment?.businessUnitId) ||
      isNil(profile.businessDepartment?.businessUnitName) ||
      isNil(profile.businessDepartment?.businessUnitCode)
    ) {
      return undefined;
    }

    return [
      {
        id: profile?.businessDepartment?.businessUnitId,
        name: profile?.businessDepartment?.businessUnitName,
        code: profile?.businessDepartment?.businessUnitCode,
      },
    ];
  }, [profile]);

  const baseFilter: ProjectFilter = useMemo(() => {
    return {
      ...new ProjectFilter(),
      budgetSettlementType: type,
      pageIndex: 1,
      pageSize: 10,
      businessUnitsValue,
      addedProjectIds,
    };
  }, [addedProjectIds, businessUnitsValue, type]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(ProjectFilter, baseFilter);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<Project, ProjectFilter>(
      budgetSettlementRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { canBulkAction, rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<Project>("checkbox", [], true);

  const onSave = () => {
    setLoading(true);
    budgetSettlementRepository
      .getSelected(selectedRowKeys)
      .pipe(
        finalize(() => {
          setLoading(false);
        })
      )
      .subscribe({
        next: (response: AxiosResponse) => {
          if (isEqual(response.status, 200)) {
            if (callback) callback(response.data);
            onCancel();
          }
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  const onCancel = () => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...new ProjectFilter(),
      },
    });
    setSelectedRowKeys([]);
    setTimeout(() => {
      setModal({ type: "NONE" });
    }, 100);
  };

  useEffect(() => {
    handleLoadList({
      ...baseFilter,
    });
  }, [baseFilter, handleLoadList]);

  return {
    dispatchFilter,
    modelFilter,
    list,
    loadingList,
    handleLoadList,
    handleResetList,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    count,
    translate,
    onSave,
    onCancel,

    loading,
  };
};
