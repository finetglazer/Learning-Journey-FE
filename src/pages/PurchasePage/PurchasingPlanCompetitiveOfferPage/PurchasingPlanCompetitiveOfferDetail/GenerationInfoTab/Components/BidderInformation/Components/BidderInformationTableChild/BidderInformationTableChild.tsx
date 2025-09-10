import { ColumnProps } from "antd/lib/table";
import { listService } from "core/services/page-services/list-service";
import {
  BidderInformationType,
  PersonInChargeModel,
  PurchasingPlanModel,
  SearchingFilterModel,
  SupplierModel,
} from "models/PurchasingPlan";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  LayoutCell,
  OneLineText,
  Select,
} from "react-components-design-system";
import { utilService } from "core/services/common-services/util-service";
import {
  BidderInformationModel,
  ColumnKey,
} from "models/PurchasingPlan/PurchasingPlanBidder";
import { AddIcon, TrashIcon } from "assets/icons";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { v4 as uuidv4 } from "uuid";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import styles from "./BidderInformation.module.scss";
import { cloneDeep, isEqual, isNil, size } from "lodash";
import { useAppSelector } from "rtk/useRedux";
import { combineTextExtra } from "core/helpers/text";
import { ConfigField } from "core/services/service-types";
import { Organization } from "models/Organization";

type props = {
  contextValue: PurchasingPlanModel;
  dataBidderInformation?: BidderInformationModel;
  isDetail?: boolean;
  organizationGeneral?: BidderInformationType;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeAllField?: any;
  isBidderInformation?: boolean;
};

const columnsWidth = {
  name: 220,
  taxCode: 140,
  address: 165,
  personInCharge: 200,
  email: 160,
  phone: 160,
  role: 160,
};

const BidderInformationTableChild = ({
  contextValue,
  isDetail = false,
  handleChangeSingleField,
  handleChangeAllField,
  isBidderInformation = false,
}: props) => {
  const { translate, model, getPurchasePlanTypeByRouter } = contextValue;
  const profile = useAppSelector((state) => state.profile);

  const picInfo = useMemo(
    () => ({
      ...model?.organizationGeneral,
      ...profile?.organization,
    }),
    [model?.organizationGeneral, profile?.organization]
  );

  const isEdit = useMemo(() => model?.isEdit, [model?.isEdit]);

  const organizationGeneral: BidderInformationType = useMemo(
    () =>
      !isBidderInformation
        ? {
            name: picInfo?.name,
            id: picInfo?.id,
            taxCode: picInfo?.taxCode,
            address: picInfo?.address,
          }
        : {
            name: model?.configSystem?.businessName,
            id: picInfo?.id,
            taxCode: model?.configSystem?.businessTaxCode,
            address: model?.configSystem?.businessAddress,
          },
    [
      isBidderInformation,
      model?.configSystem?.businessAddress,
      model?.configSystem?.businessName,
      model?.configSystem?.businessTaxCode,
      picInfo?.address,
      picInfo?.id,
      picInfo?.name,
      picInfo?.taxCode,
    ]
  );

  const personInChargeInfosList = useMemo(() => {
    return model?.organizationGeneral?.personInChargeInfos || [];
  }, [model?.organizationGeneral?.personInChargeInfos]);

  const personInChargeInfos = useMemo(
    () =>
      (personInChargeInfosList || [])?.map((item) => {
        return {
          ...item,
          pic: {
            id: item?.picId,
            name: item?.pic?.name,
            email: item?.pic?.email,
            phoneNumber: item?.pic?.phoneNumber,
            position: {
              name: item?.role,
            } as PersonInChargeModel,
          },
          name: organizationGeneral?.name,
          taxCode: organizationGeneral?.taxCode,
          address: organizationGeneral?.address,
        };
      }),
    [
      organizationGeneral?.address,
      organizationGeneral?.name,
      organizationGeneral?.taxCode,
      personInChargeInfosList,
    ]
  );

  const handleChangeListFieldItemTable = useCallback(
    ({
      newListField,
      record,
      errorsPass,
      modelPass,
    }: {
      newListField: PersonInChargeModel[];
      record?: PersonInChargeModel;
      errorsPass?: any;
      modelPass: any;
    }) => {
      const errors = cloneDeep(errorsPass);
      const errorKey = `organizationGeneral.personInChargeInfos[${record?.indexBeforeValidate}].picId`;
      if (errors && errors?.[errorKey] && !isNil(record?.indexBeforeValidate)) {
        delete errors[errorKey];
      }

      handleChangeAllField({
        ...modelPass,
        errors,
        purchasePlanType: getPurchasePlanTypeByRouter(),
        organizationGeneral: {
          ...modelPass?.organizationGeneral,
          personInChargeInfos: newListField?.map((item) => ({
            ...item,
            id: item.id,
            picId: item.pic?.id,
            name: item.name,
            email: item.email,
            phoneNumber: item.phoneNumber,
            role: item.role,
            taxCode: item.taxCode,
            address: item.address,
            isTotal: item.isTotal,
            pic: {
              id: item.pic?.id,
              name: item.pic?.name,
              email: item.pic?.email,
              phoneNumber: item.pic?.phoneNumber,
              position: {
                name: item.pic?.position?.name,
              } as PersonInChargeModel,
            },
          })),
        },
      });
    },
    [getPurchasePlanTypeByRouter, handleChangeAllField]
  );

  const {
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRowKeys,
    setSelectedRow,
  } = listService.useRowSelection<SupplierModel>("checkbox", [], false, "auto");

  const handleAddNewPersonInCharge = useCallback(() => {
    const newListData = [...personInChargeInfosList];
    const newDataObject = new PersonInChargeModel();
    newDataObject.id = uuidv4();
    newDataObject.name = isEdit
      ? organizationGeneral?.name
      : organizationGeneral?.name;
    newDataObject.taxCode = isEdit
      ? organizationGeneral?.taxCode
      : organizationGeneral?.taxCode;
    newDataObject.address = isEdit
      ? organizationGeneral?.address
      : organizationGeneral?.address;

    // Set current user as default person in charge
    if (profile && profile.account) {
      newDataObject.pic = {
        id: profile.account.id,
        name:
          profile.account?.name ||
          profile.account?.displayName ||
          profile.account?.username,
        email: profile.account.email,
        phoneNumber: profile.account.phoneNumber,
        position: {
          name: profile.position?.name,
        } as PersonInChargeModel,
      };
      newDataObject.picId = profile.account.id;
      newDataObject.email = profile.account.email;
      newDataObject.phoneNumber = profile.account.phoneNumber;
      newDataObject.role = profile.position?.name;
    }

    newListData.push(newDataObject);

    handleChangeListFieldItemTable({
      newListField: newListData,
      modelPass: model,
    });
  }, [
    handleChangeListFieldItemTable,
    isEdit,
    model,
    organizationGeneral?.address,
    organizationGeneral?.name,
    organizationGeneral?.taxCode,
    personInChargeInfosList,
    profile,
  ]);

  const handleDeletePersonInCharge = useCallback(
    (idToDelete: string | number) => {
      const newListData = personInChargeInfosList?.filter(
        (item) => item.id !== idToDelete
      );
      const newSelectedRow = selectedRow.filter(
        (item) => item.id !== idToDelete
      );
      const newSelectedRowKeys = selectedRowKeys.filter(
        (key) => key !== idToDelete
      );

      handleChangeListFieldItemTable({
        newListField: newListData,
        modelPass: model,
      });
      setSelectedRow(newSelectedRow);
      setSelectedRowKeys(newSelectedRowKeys);
    },
    [
      handleChangeListFieldItemTable,
      model,
      personInChargeInfosList,
      selectedRow,
      selectedRowKeys,
      setSelectedRow,
      setSelectedRowKeys,
    ]
  );

  const handleChangeItemTable = useCallback(
    // set any because doesn't know
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ value, key, id }: { value: any; key: string; id: string }) => {
      const newListData = cloneDeep(personInChargeInfosList);
      //find item change by id
      const itemChange: PersonInChargeModel = newListData?.find((e) =>
        isEqual(id, e?.id)
      );

      if (key === ColumnKey.PIC) {
        itemChange[ColumnKey.PIC] = value;
        itemChange[ColumnKey.PERSON_IN_CHARGE_ID] = value?.id;
        itemChange[ColumnKey.EMAIL] = value?.email;
        itemChange[ColumnKey.PHONE_NUMBER] = value?.phoneNumber;
        itemChange[ColumnKey.ROLE] = value?.position?.name;
      }

      const newListDataChange = newListData?.map((item) => {
        if (item?.id === itemChange?.id) {
          return {
            ...item,
            ...itemChange,
          };
        }
        return item;
      });

      handleChangeListFieldItemTable({
        newListField: newListDataChange,
        record: itemChange,
        modelPass: model,
      });
    },
    [personInChargeInfosList, handleChangeListFieldItemTable, model]
  );

  const handleDeleteItemsSelected = () => {
    const newListData = [...personInChargeInfosList].filter(
      (item) => !selectedRowKeys.includes(item.id)
    );

    handleChangeListFieldItemTable({
      newListField: newListData,
      modelPass: model,
    });
    setSelectedRowKeys([]);
    setSelectedRow([]);
  };

  const columns: ColumnProps<PersonInChargeModel>[] = React.useMemo(
    () => [
      {
        title: isBidderInformation
          ? translate("PL.txt_inviting_party")
          : translate("PL.competitive_offer.title.name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render: (value, record) => {
          let newValue = record?.pic?.name;
          if (picInfo?.organizationId === record?.pic?.organizationId) {
            newValue = picInfo?.organization?.name;
          }
          return (
            <LayoutCell>
              <div className="text-ellipsis">
                <OneLineText value={value || newValue} />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_supplier_tax_code"),
        key: ColumnKey.TAX_CODE,
        dataIndex: ColumnKey.TAX_CODE,
        ellipsis: true,
        width: columnsWidth.taxCode,
        render: (value, record) => {
          let newValue = record?.pic?.taxCode;
          if (picInfo?.organizationId === record?.pic?.organizationId) {
            newValue = picInfo?.taxCode;
          }
          return (
            <LayoutCell>
              <div className="text-ellipsis">
                <OneLineText value={value || newValue} />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_supplier_address"),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        width: columnsWidth.address,
        ellipsis: true,
        render: (value, record) => {
          let newValue = record?.pic?.address;
          if (picInfo?.organizationId === record?.pic?.organizationId) {
            newValue = picInfo?.address;
          }
          return (
            <LayoutCell>
              <OneLineText value={value || newValue} />
            </LayoutCell>
          );
        },
      },
      {
        title: (
          <UnitTitle
            title={translate("PL.bidding.title.person_in_charge")}
            isShowUnit={false}
            required={!isDetail}
          />
        ),
        key: ColumnKey.PIC,
        dataIndex: ColumnKey.PIC,
        width: columnsWidth.personInCharge,
        render: (value, record, index) => {
          if (isDetail) {
            return (
              <LayoutCell>
                <OneLineText value={record?.pic?.name} useTooltip={true} />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `organizationGeneral.personInChargeInfos[${record?.indexBeforeValidate}].picId`
                )}
                isTableCell={true}
              >
                <Select
                  isSmall={true}
                  placeHolder={translate(
                    "PL.bidding.placeholder.person_in_charge"
                  )}
                  classFilter={SearchingFilterModel}
                  searchProperty="searchText"
                  isSearch={true}
                  getList={(TModelFilter) => {
                    return purchasingPlanRepository.listMasterUser({
                      pageIndex: 1,
                      pageSize: 30,
                      searchText: TModelFilter?.searchText,
                      isActive: true,
                      isSupplier: false,
                    } as SearchingFilterModel);
                  }}
                  value={value}
                  onChange={(_, item) => {
                    handleChangeItemTable({
                      value: item,
                      key: ColumnKey.PIC,
                      id: record?.id,
                    });
                  }}
                  isEnumerable={false}
                  isRequired
                  appendToBody
                  disabled={isDetail}
                  render={(valueRender) => {
                    if (value?.id === valueRender?.id) {
                      return combineTextExtra(valueRender?.name);
                    }
                    return combineTextExtra(
                      valueRender?.name,
                      valueRender?.email,
                      valueRender?.position?.name
                    );
                  }}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_email"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        width: columnsWidth.email,
        render: (value, _, index) => (
          <LayoutCell>
            <OneLineText value={value} useTooltip={true} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.drawer_phone_number_supplier"),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        width: columnsWidth.phone,
        render: (value, _, index) => (
          <LayoutCell>
            <OneLineText value={value} useTooltip={true} />
          </LayoutCell>
        ),
      },
      {
        title: translate("CT.create_contract.title.position_title"),
        key: ColumnKey.ROLE,
        dataIndex: ColumnKey.ROLE,
        width: columnsWidth.role,
        render: (value, _, index) => (
          <LayoutCell>
            <OneLineText value={value} useTooltip={true} />
          </LayoutCell>
        ),
      },
      {
        title: "",
        width: isDetail ? 1 : 40,
        render(_, record) {
          if (isDetail) return;
          return (
            <LayoutCell>
              <button
                className={styles["delete-row-btn"]}
                onClick={() => handleDeletePersonInCharge(record?.id)}
              >
                <TrashIcon fillColor="#C03629" />
              </button>
            </LayoutCell>
          );
        },
      },
    ],
    [
      isBidderInformation,
      translate,
      isDetail,
      picInfo?.organizationId,
      picInfo?.organization?.name,
      picInfo?.taxCode,
      picInfo?.address,
      model,
      handleChangeItemTable,
      handleDeletePersonInCharge,
    ]
  );

  const getRowSelection = () => {
    return isDetail
      ? null
      : {
          ...rowSelection,
          renderCell: (value: boolean, record: any) => {
            if (record.isTotal) return null;
            return (
              <div className="d-flex justify-content-center align-items-center payment-height_40">
                <Checkbox
                  disabled={isDetail}
                  checked={value}
                  onChange={(e) => {
                    if (e) {
                      setSelectedRowKeys([...selectedRowKeys, record.id]);
                      setSelectedRow([...selectedRow, record]);
                    } else {
                      setSelectedRowKeys(
                        selectedRowKeys.filter((key) => key !== record.id)
                      );
                      setSelectedRow(
                        selectedRow.filter((key) => key.id !== record.id)
                      );
                    }
                  }}
                />
              </div>
            );
          },
        };
  };

  useEffect(() => {
    const newPurchasePlanTypeByRouter = getPurchasePlanTypeByRouter();

    const isReachPageWithoutId =
      newPurchasePlanTypeByRouter.id === model?.purchasePlanType?.id;

    if (
      (isReachPageWithoutId && personInChargeInfos.length > 0) ||
      (model?.purchasePlanType?.id &&
        getPurchasePlanTypeByRouter()?.id &&
        getPurchasePlanTypeByRouter().id === model.purchasePlanType.id)
    )
      return;

    if (
      Array.isArray(personInChargeInfos) &&
      personInChargeInfos.length === 0 &&
      organizationGeneral &&
      profile &&
      profile.account
    ) {
      const newPerson = new PersonInChargeModel();
      newPerson.id = uuidv4();
      newPerson.name = organizationGeneral.name;
      newPerson.taxCode = organizationGeneral.taxCode;
      newPerson.address = organizationGeneral.address;
      // Set current user as default person in charge
      newPerson.pic = {
        id: profile.account.id,
        name: profile.account.name,
        email: profile.account.email,
        phoneNumber: profile.account.phoneNumber,
        position: {
          name: profile.position?.name,
        } as PersonInChargeModel,
      };
      newPerson.picId = profile.account.id;
      newPerson.email = profile.account.email;
      newPerson.phoneNumber = profile.account.phoneNumber;
      newPerson.role = profile.position?.name;

      handleChangeListFieldItemTable({
        newListField: [newPerson],
        modelPass: model,
      });
      return;
    }

    if ((!model?.purchasePlanType?.id && !model?.name && isEdit) || isDetail) {
      handleChangeListFieldItemTable({
        newListField: personInChargeInfos,
        modelPass: model,
      });
    }
  }, [
    getPurchasePlanTypeByRouter,
    handleChangeListFieldItemTable,
    isDetail,
    isEdit,
    model,
    organizationGeneral,
    personInChargeInfos,
    profile,
  ]);

  return (
    <div>
      {size(personInChargeInfosList) > 0 && !isDetail && (
        <Button
          className="receiving_date_btn"
          type="secondary"
          size="lg"
          icon={<img src={AddIcon} alt="img" width={12} height={12} />}
          iconPlace="left"
          onClick={handleAddNewPersonInCharge}
          disabled={isDetail}
        >
          {translate("PL.bidding.button.add_person_in_charge")}
        </Button>
      )}

      <div className="mt-2">
        <TableWithEmpty
          list={
            size(personInChargeInfosList) > 0 ? personInChargeInfosList : null
          }
          columns={columns}
          idContainer={"BidderInformation-1"}
          scroll={{ y: "calc(100vh - 300px)" }}
          isDragable={true}
          actionBarComponent={
            <>
              {isDetail ? null : (
                <ActionBarComponent
                  selectedRowKeys={selectedRowKeys}
                  setSelectedRowKeys={setSelectedRowKeys}
                >
                  <Button
                    type="secondary"
                    size="sm"
                    onClick={handleDeleteItemsSelected}
                  >
                    {translate("CL.delete_btn")}
                  </Button>
                </ActionBarComponent>
              )}
            </>
          }
          rowSelection={getRowSelection()}
          emptyExtra={
            <CloudyEmpty content={translate("CA.msg_empty_data_in_system")}>
              {isDetail ? null : (
                <Button
                  className={styles["w-content"]}
                  type="secondary"
                  size="lg"
                  icon={<img src={AddIcon} alt="img" width={12} height={12} />}
                  iconPlace="left"
                  onClick={handleAddNewPersonInCharge}
                  disabled={isDetail}
                >
                  {translate("PL.bidding.button.add_person_in_charge")}
                </Button>
              )}
            </CloudyEmpty>
          }
          fieldValidate="supplierPurchasePlans"
          modelValidate={model}
        />
      </div>
    </div>
  );
};

export default BidderInformationTableChild;
