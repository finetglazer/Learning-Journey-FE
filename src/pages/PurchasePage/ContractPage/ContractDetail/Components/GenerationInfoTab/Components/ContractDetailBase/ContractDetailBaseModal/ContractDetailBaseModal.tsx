import { IcEmptySearchSvg } from "assets/icons";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import {
  BaseShoppingPlanFilter,
  ContractDetailModel,
  ContractPlanModal,
} from "models/Contract";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import "../ContractDetailBase.scss";
import ContractDetailBaseFilter from "./ContractDetailBaseFilter";
import ContractDetailBaseModalColumn from "./ContractDetailBaseModalColumn";

type props = {
  open: boolean;
  handleCancel: () => void;
  handleApply?: (id: string) => void;
  isPrinciple?: boolean;
};

const ContractDetailBaseModal = ({
  open,
  handleCancel,
  handleApply,
  isPrinciple,
}: props) => {
  const [checkedId, setCheckedId] = useState("");

  const { model, translate } = useContext<ContractDetailModel>(
    ContractDetailHookContext
  );

  const baseFilter = useMemo(() => {
    return {
      ...new BaseShoppingPlanFilter(),
      pageIndex: 1,
      pageSize: 10,
      isPrincipleContract: isPrinciple,
    };
  }, [isPrinciple]);

  const onChangeShoppingPlan = (event: string) => {
    setCheckedId(event);
  };

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(BaseShoppingPlanFilter, baseFilter);

  const { count, list, loadingList, handleLoadList } = listService.useList<
    ContractPlanModal,
    BaseShoppingPlanFilter
  >(
    contractRepository.getContractPlanModal,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  useEffect(() => {
    if (open) {
      handleLoadList(modelFilter);
    }
  }, [handleLoadList, modelFilter, open]);

  useEffect(() => {
    if (model?.originalPurchasePlanId) {
      setCheckedId(model.originalPurchasePlanId);
    }
  }, [model?.originalPurchasePlanId]);

  return (
    <Modal
      open={open}
      title={translate("CT.contract_plan.title_modal")}
      size={1100}
      closeIcon={true}
      className="payment-minHeight-500"
      isShowIconBack={false}
      handleCancel={handleCancel}
      handleSave={() => handleApply(checkedId)}
      titleButtonCancel={translate("CM.btn_close")}
      disableButtonApply={!checkedId}
      titleButtonApply={translate("CM.txt_select")}
    >
      <ContractDetailBaseFilter
        modelFilter={modelFilter}
        dispatchFilter={dispatchFilter}
      />
      <div className="page-master__table">
        <StandardTable
          rowKey={"id"}
          className="payment-custom_table"
          columns={ContractDetailBaseModalColumn({
            translate,
            onChangeShoppingPlan,
            shoppingPlanValue: checkedId,
          })}
          loading={loadingList}
          dataSource={list}
          scroll={{ y: 340 }}
          locale={{
            emptyText: (
              <EmptyDataCM
                message={translate("CM.txt_search_no_data")}
                isFilter
                icon={IcEmptySearchSvg}
                height={600}
              />
            ),
          }}
        />
      </div>
      <div className="page-master__pagination">
        <Pagination
          pageIndex={modelFilter.pageIndex}
          pageSize={modelFilter.pageSize}
          total={count}
          onChange={handlePagination}
          pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
        />
      </div>
    </Modal>
  );
};

export default ContractDetailBaseModal;
