import { listService } from "core/services/page-services/list-service";
import { GeneralActionEnum } from "core/services/service-types";
import { AcceptancePersonRequest } from "models/Acceptance";
import { AcceptanceComponent } from "models/Acceptance/Acceptance";
import { useMemo, useState } from "react";
import { useAcceptanceInformationContext } from "../../AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";

export enum AcceptanceModal {
  LIST = "LIST",
}

export const useAcceptanceMembersHooks = () => {
  const [modal, setModal] = useState<AcceptanceModal | null>(null);
  const { dispatch, model } = useAcceptanceInformationContext();
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const acceptanceComponents = useMemo(
    () => model?.acceptanceComponents,
    [model]
  );
  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<AcceptancePersonRequest>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const memberListSelected = useMemo(
    () => acceptanceComponents?.map((item) => item?.id) || [],
    [acceptanceComponents]
  );

  const handleUpdateAcceptanceComponent = (
    acceptanceComponents: AcceptanceComponent[]
  ) => {
    dispatch({
      type: GeneralActionEnum.UPDATE,
      payload: {
        acceptanceComponents,
      },
    });
  };

  const handleAddMember = ({
    acceptanceSelects,
  }: {
    acceptanceSelects: AcceptancePersonRequest[];
  }) => {
    const list = acceptanceSelects.filter(
      (item) => !memberListSelected.includes(item?.id)
    );
    const newList = [...list, ...(acceptanceComponents || [])];
    handleUpdateAcceptanceComponent(newList as any);
    setModal(null);
  };

  const handleDeleteMember = (ids: string[]) => {
    const newDeliveryReceipt = acceptanceComponents.filter((member) => {
      return !ids.includes(member?.id);
    });
    handleUpdateAcceptanceComponent(newDeliveryReceipt);
    setSelectedRowKeys(
      selectedRowKeys.filter((id) => !ids.includes(id.toString()))
    );
    setIsOpenModelConfirmDeleteRow(false);
  };

  return {
    modal,
    memberList: acceptanceComponents,
    rowSelection,
    selectedRowKeys,
    memberListSelected,
    setModal,
    setSelectedRowKeys,
    handleAddMember,
    handleDeleteMember,
    isOpenModelConfirmDeleteRow,
    setIsOpenModelConfirmDeleteRow,
  };
};
