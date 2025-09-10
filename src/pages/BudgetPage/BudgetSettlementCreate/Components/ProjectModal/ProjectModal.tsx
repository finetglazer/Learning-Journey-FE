import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/icons";
import { FilterActionEnum } from "core/services/service-types";
import { isEmpty } from "lodash";
import CommonFilter from "models/CommonFilter";
import { BusinessUnit, Project } from "models/Project/Project";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Model } from "react-3layer-common";
import {
  InputText,
  Modal,
  MultipleSelect,
} from "react-components-design-system";
import { ModalType } from "../../BudgetSettlementCreateHook";
import { budgetSettlementRepository } from "../../BudgetSettlementRepository";
import "./ProjectModal.scss";
import {
  ProjectBudget,
  ProjectBudgetContext,
  useProjectModalHooks,
} from "./ProjectModalHooks";
import { ProjectModalTable } from "./ProjectModalTable";

const MODAL_SIZE = 1100;

interface ProjectModalProps {
  type: number;
  showModal: boolean;
  setModal: Dispatch<SetStateAction<ModalType>>;
  callback: (list: Project[]) => void;
  addedProjectIds: string[];
}

const HeaderView = () => {
  const { translate, modelFilter, dispatchFilter, handleLoadList } =
    useContext<ProjectBudget>(ProjectBudgetContext);
  const modelFilterRef = useRef(modelFilter);

  const { run } = useDebounceFn(
    (search: string) => {
      const trimmedText = (search || "").replace(/\s+/g, " ").trim();
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: trimmedText,
          pageIndex: 1,
        },
      });
      handleLoadList({ search: trimmedText, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  const handleChangeMultipleSelectFilter = React.useCallback(
    (fieldName: string) => {
      return (selectedList: Model) => {
        dispatchFilter({
          type: FilterActionEnum.UPDATE,
          payload: {
            [fieldName]: selectedList,
            pageIndex: 1,
          },
        });
        handleLoadList({
          ...modelFilterRef.current,
          [fieldName]: selectedList,
        });
      };
    },
    [dispatchFilter, handleLoadList]
  );

  useEffect(() => {
    modelFilterRef.current = modelFilter;
  }, [modelFilter]);

  return (
    <div className="header__container">
      {/* Search bar */}
      <div className="search-bar">
        <InputText
          prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
          value={modelFilter.search}
          placeHolder={translate("BG.placeholder_search_by_code_name_project")}
          onChange={run}
          type={1}
          isSmall
        />
      </div>
      <div className="select__wrapper">
        <div className="select-div">
          <MultipleSelect
            values={modelFilter?.businessUnitsValue || []}
            placeHolder={translate("BG.table_budget_nhcd_owner")}
            getList={budgetSettlementRepository.businessUnit}
            classFilter={CommonFilter}
            onChange={handleChangeMultipleSelectFilter("businessUnitsValue")}
            render={(t: BusinessUnit) => `${t?.code} - ${t?.name}`}
          />
        </div>
        <div className="select-div">
          <MultipleSelect
            values={modelFilter.businessBranchValue || []}
            placeHolder={translate("BG.table_budget_cn_pgd_owner")}
            getList={budgetSettlementRepository.businessBranch}
            classFilter={CommonFilter}
            onChange={handleChangeMultipleSelectFilter("businessBranchValue")}
          />
        </div>
        <div className="select-div">
          <MultipleSelect
            values={modelFilter.businessDepartmentValue || []}
            placeHolder={translate("BG.table_budget_tt_pb_owner")}
            getList={(model) => {
              const businessUnitIds = modelFilter?.businessUnitsValue?.map(
                (item: { id: string }) => item?.id
              );
              const bodyData = {
                search: model?.name?.contain,
                businessUnitIds,
              };
              return budgetSettlementRepository.businessDepartment(bodyData);
            }}
            classFilter={CommonFilter}
            onChange={handleChangeMultipleSelectFilter(
              "businessDepartmentValue"
            )}
            render={(item) =>
              item?.id ? `${item?.code} - ${item?.name}` : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export const ProjectModal = ({
  type,
  showModal,
  setModal,
  callback,
  addedProjectIds,
}: ProjectModalProps) => {
  const { loading, ...context } = useProjectModalHooks({
    type,
    setModal,
    callback,
    addedProjectIds,
  });

  return (
    <ProjectBudgetContext.Provider value={context}>
      <Modal
        open={showModal}
        isShowIconBack={false}
        destroyOnClose
        disableButtonApply={isEmpty(context.selectedRowKeys)}
        title={context.translate("BG.txt_list_project_budget")}
        size={MODAL_SIZE}
        titleButtonApply={context.translate(
          "PM.payment_modal_select_supplier_button_label"
        )}
        titleButtonCancel={context.translate(
          "PM.payment_modal_cancle_supplier_button_label"
        )}
        handleSave={context.onSave}
        handleCancel={context.onCancel}
        loading={loading}
      >
        {/* Header */}
        <HeaderView />
        <ProjectModalTable />
      </Modal>
    </ProjectBudgetContext.Provider>
  );
};
