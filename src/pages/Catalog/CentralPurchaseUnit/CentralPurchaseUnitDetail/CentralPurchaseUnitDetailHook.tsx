import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import _, { isUndefined } from "lodash";
import { finalize } from "rxjs";

import { handleError } from "core/helpers/handle-error";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  FilterActionEnum,
  GeneralActionEnum,
} from "core/services/service-types";
import { listService } from "core/services/page-services/list-service";
import { filterService } from "core/services/page-services/filter-service";

import { CentralPurchaseUnitDetailProps } from "./CentralPurchaseUnitDetail";
import centralPurchaseUnitRepository from "../CentralPurchaseUnitRepository";
import {
  CentralPurchaseUnit,
  Contact,
  ContactPersonFilter,
} from "models/CentralPurchaseUnit";

export const useCentralPurchaseUnitDetailHook = (
  dismiss: CentralPurchaseUnitDetailProps["dismiss"],
  id?: CentralPurchaseUnitDetailProps["centralPurchaseUnitId"]
) => {
  const [translate] = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const { model, dispatch } = detailService.useModel<CentralPurchaseUnit>(
    CentralPurchaseUnit,
    {
      ...new CentralPurchaseUnit(),
      isActive: true,
    }
  );

  const {
    handleChangeAllField,
    handleChangeBoolField,
    handleChangeSingleField,
    handleChangeSelectField,
  } = fieldService.useField(model, dispatch);

  const [isOpenSearchContact, setIsOpenSearchContact] =
    useState<boolean>(false);

  const [informationReceiverHDIds, setInformationReceiverHDIds] = useState<
    Contact["id"][]
  >([]);

  const [informationReceiverPAMSIds, setInformationReceiverPAMSIds] = useState<
    Contact["id"][]
  >([]);

  const [informationReceiversHDs, setInformationReceiverHDs] = useState<
    Contact[]
  >([]);

  const [informationReceiverPAMSs, setInformationReceiverPAMSs] = useState<
    Contact[]
  >([]);

  const {
    rowSelection: hdReceiverSelection,
    selectedRowKeys: hdReceiverSelectedRowKeys,
    setSelectedRowKeys: setSelectedHDReceiverRowKeys,
    selectedRow: hdReceiverSelectedRows,
    setSelectedRow: setSelectedHDReceiverRow,
  } = listService.useRowSelection<Contact>("checkbox", [], true);

  const {
    rowSelection: pamsReceiverSelection,
    selectedRowKeys: pamsReceiverSelectedRowKeys,
    setSelectedRowKeys: setSelectedPAMSReceiverRowKeys,
    selectedRow: pamsReceiverSelectedRows,
    setSelectedRow: setSelectedPAMSReceiverRow,
  } = listService.useRowSelection<Contact>("checkbox", [], true);

  const [updateFor, setUpdateFor] = useState<"HDReceiver" | "PAMSReceiver">(
    "HDReceiver"
  );

  const getDetail = useCallback(() => {
    setLoading(true);
    centralPurchaseUnitRepository.getDetail(id).subscribe({
      next: (response: CentralPurchaseUnit) => {
        dispatch({
          type: GeneralActionEnum.SET,
          payload: {
            ...response,
            isActive: response?.isActive,
          },
        });

        setInformationReceiverHDIds(response?.informationReceiverHDIds);
        setInformationReceiverPAMSIds(response?.informationReceiverPAMSIds);
        setSelectedHDReceiverRowKeys(response?.informationReceiverHDIds);
        setSelectedPAMSReceiverRowKeys(response?.informationReceiverPAMSIds);
        setInformationReceiverHDs(response?.informationReceiverHDs || []);
        setInformationReceiverPAMSs(response?.informationReceiverPAMSs || []);
      },
      error: () => {
        notifyToast({
          type: "error",
          message: translate("CM.message_system_error"),
        });
      },
      complete: () => setLoading(false),
    });
  }, [
    dispatch,
    id,
    notifyToast,
    setSelectedHDReceiverRowKeys,
    setSelectedPAMSReceiverRowKeys,
    translate,
  ]);

  const baseFilter: ContactPersonFilter = useMemo(() => {
    return {
      search: "",
    };
  }, []);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(ContactPersonFilter, baseFilter);

  const {
    list: contactPersonList,
    loadingList,
    handleLoadList,
  } = listService.useList<Contact, ContactPersonFilter>(
    centralPurchaseUnitRepository.getListContactPerson,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const createNewCentralPurchaseUnit = () => {
    const modelData: CentralPurchaseUnit = {
      ...model,
      informationReceiverHDIds: informationReceiverHDIds,
      informationReceiverPAMSIds: informationReceiverPAMSIds,
    };

    setLoading(true);
    centralPurchaseUnitRepository
      .create(modelData)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          dismiss(true);
        },
        error: (error: AxiosError) =>
          handleError<CentralPurchaseUnit>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  };

  const updateCentralPurchaseUnit = () => {
    const modelData: CentralPurchaseUnit = {
      ...model,
      informationReceiverHDIds: informationReceiverHDIds,
      informationReceiverPAMSIds: informationReceiverPAMSIds,
    };

    setLoading(true);
    centralPurchaseUnitRepository
      .update(modelData)
      .pipe(finalize(() => setLoading(false)))
      .subscribe({
        next: () => {
          notifyToast();
          dismiss(true);
        },
        error: (error: AxiosError) =>
          handleError<CentralPurchaseUnit>({
            model,
            error,
            handleChangeAllField,
          }),
      });
  };

  const onSave = () => {
    isUndefined(id)
      ? createNewCentralPurchaseUnit()
      : updateCentralPurchaseUnit();
  };

  const handleOpenUserModal = useCallback(
    (updateFor: "HDReceiver" | "PAMSReceiver") => {
      setUpdateFor(updateFor);
      handleLoadList(baseFilter, true);
      setSelectedHDReceiverRow(informationReceiversHDs);
      setSelectedHDReceiverRowKeys(informationReceiverHDIds);
      setSelectedPAMSReceiverRow(informationReceiverPAMSs);
      setSelectedPAMSReceiverRowKeys(informationReceiverPAMSIds);
      setIsOpenSearchContact(true);
    },
    [
      baseFilter,
      handleLoadList,
      informationReceiverHDIds,
      informationReceiverPAMSIds,
      informationReceiverPAMSs,
      informationReceiversHDs,
      setSelectedHDReceiverRow,
      setSelectedHDReceiverRowKeys,
      setSelectedPAMSReceiverRow,
      setSelectedPAMSReceiverRowKeys,
    ]
  );

  const handleCloseUserModal = useCallback(() => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        search: undefined,
        pageIndex: 1,
        pageSize: 10,
      },
    });
    setIsOpenSearchContact(false);
    setSelectedHDReceiverRowKeys(informationReceiverHDIds);
    setSelectedPAMSReceiverRowKeys(informationReceiverPAMSIds);
    setInformationReceiverHDs(hdReceiverSelectedRows);
    setInformationReceiverPAMSs(pamsReceiverSelectedRows);
  }, [
    dispatchFilter,
    hdReceiverSelectedRows,
    informationReceiverHDIds,
    informationReceiverPAMSIds,
    pamsReceiverSelectedRows,
    setSelectedHDReceiverRowKeys,
    setSelectedPAMSReceiverRowKeys,
  ]);

  const handleSaveUserModal = useCallback(() => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: {
        search: undefined,
        pageIndex: 1,
        pageSize: 10,
      },
    });
    setInformationReceiverHDIds(
      hdReceiverSelectedRowKeys?.map((item) => item?.toString())
    );
    setInformationReceiverPAMSIds(
      pamsReceiverSelectedRowKeys?.map((item) => item?.toString())
    );
    setInformationReceiverHDs(hdReceiverSelectedRows);
    setInformationReceiverPAMSs(pamsReceiverSelectedRows);
    setIsOpenSearchContact(false);
  }, [
    dispatchFilter,
    hdReceiverSelectedRowKeys,
    hdReceiverSelectedRows,
    pamsReceiverSelectedRowKeys,
    pamsReceiverSelectedRows,
  ]);

  const handleDeleteContent = useCallback(
    (updateFor: "HDReceiver" | "PAMSReceiver", id: string) => {
      const newModel = _.cloneDeep(model);
      if (updateFor === "HDReceiver") {
        const newContents = informationReceiversHDs?.filter(
          (contact: Contact) => {
            return contact?.id !== id;
          }
        );
        setInformationReceiverHDs(newContents);
        newModel.informationReceiverHDIds = newContents?.map(
          (contact) => contact.id
        );
        setInformationReceiverHDIds(newContents?.map((contact) => contact.id));
      } else {
        const newContents = informationReceiverPAMSs?.filter(
          (contact: Contact) => {
            return contact?.id !== id;
          }
        );
        setInformationReceiverPAMSs(newContents);
        newModel.informationReceiverPAMSIds = newContents?.map(
          (contact) => contact.id
        );
        setInformationReceiverPAMSIds(
          newContents?.map((contact) => contact.id)
        );
      }

      handleChangeAllField(newModel);
    },
    [
      handleChangeAllField,
      informationReceiverPAMSs,
      informationReceiversHDs,
      model,
    ]
  );

  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    if (!isUndefined(id) && firstLoad) {
      getDetail();
      setFirstLoad(false);
    }
  }, [firstLoad, getDetail, id]);

  return {
    translate,
    loading,
    isOpenSearchContact,
    loadingContactPerson: loadingList,
    model,
    contactPersonList,
    modelFilter,
    rowSelection:
      updateFor === "HDReceiver" ? hdReceiverSelection : pamsReceiverSelection,
    selectedRowKeys:
      updateFor === "HDReceiver"
        ? hdReceiverSelectedRowKeys
        : pamsReceiverSelectedRowKeys,
    setRowSelection:
      updateFor === "HDReceiver"
        ? setSelectedHDReceiverRowKeys
        : setSelectedPAMSReceiverRowKeys,

    dispatchFilter,
    handleLoadList,
    handleChangeAllField,
    handleChangeBoolField,
    handleChangeSingleField,
    handleChangeSelectField,
    onSave,
    handleOpenUserModal,
    handleSaveUserModal,
    handleCloseUserModal,
    handleDeleteContent,
    informationReceiversHDs,
    informationReceiverPAMSs,
  };
};
