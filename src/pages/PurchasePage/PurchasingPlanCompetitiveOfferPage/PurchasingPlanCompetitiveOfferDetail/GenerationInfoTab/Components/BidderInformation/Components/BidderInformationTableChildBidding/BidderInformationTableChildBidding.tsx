import { ColumnProps } from "antd/lib/table";
import { listService } from "core/services/page-services/list-service";
import {
  BidderInformationType,
  PersonInChargeModel,
  PurchasingPlanModel,
  SearchingFilterModel,
  SupplierModel,
} from "models/PurchasingPlan";
import React, { useCallback, useMemo } from "react";
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
import styles from "./BidderInformationTableChildBidding.module.scss";
import { cloneDeep, isEqual, isNil, size } from "lodash";
import { useAppSelector } from "rtk/useRedux";
import { combineTextExtra } from "core/helpers/text";
import { ConfigField } from "core/services/service-types";

// ✅ Tối ưu: Extract types và constants
interface Props {
  contextValue: PurchasingPlanModel;
  dataBidderInformation?: BidderInformationModel;
  isDetail?: boolean;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  isBidderInformation?: boolean;
}

interface HandleChangeListFieldParams {
  newListField: PersonInChargeModel[];
  record?: PersonInChargeModel;
  errorsPass?: any;
  modelPass: any;
}

// ✅ Tối ưu: Extract constants
const COLUMNS_WIDTH = {
  name: 220,
  taxCode: 140,
  address: 165,
  personInCharge: 200,
  email: 160,
  phone: 160,
  role: 160,
} as const;

const DEFAULT_PAGE_SIZE = 30;
const TABLE_SCROLL_HEIGHT = "calc(100vh - 300px)";

const BidderInformationTableChildBidding: React.FC<Props> = ({
  contextValue,
  isDetail = false,
  isBidderInformation = false,
}) => {
  const { translate } = contextValue;
  const isEdit = contextValue?.model?.isEdit;
  const isView = isDetail;
  const profile = useAppSelector((state) => state.profile);

  // ✅ Tối ưu: Memoize complex calculations with stable dependencies
  const picInfo = useMemo(
    () => ({
      ...contextValue?.model?.organizationGeneral,
      ...contextValue?.model?.userOrganization,
    }),
    [
      contextValue?.model?.organizationGeneral,
      contextValue?.model?.userOrganization,
    ]
  );

  const organizationGeneral: BidderInformationType = useMemo(() => {
    return {
      name: contextValue?.model?.configSystem?.businessName || "",
      id: picInfo?.id || "",
      taxCode: contextValue?.model?.configSystem?.businessTaxCode || "",
      address: contextValue?.model?.configSystem?.businessAddress || "",
    };
  }, [isBidderInformation, picInfo, contextValue?.model?.configSystem]);

  // ✅ Lấy personInChargeInfosList trực tiếp từ context - đã được init trong hook
  const personInChargeInfosList = useMemo(() => {
    if (contextValue?.model?.organizationGeneral?.organization) {
      return (
        contextValue?.model?.organizationGeneral?.personInChargeInfos?.map(
          (item) => ({
            ...item,
            name: contextValue?.model?.organizationGeneral?.organization.name,
            taxCode:
              contextValue?.model?.organizationGeneral?.organization.taxCode,
            address:
              contextValue?.model?.organizationGeneral?.organization.address,
          })
        ) || []
      );
    }
    return contextValue?.model?.organizationGeneral?.personInChargeInfos || [];
  }, [contextValue?.model?.organizationGeneral]);

  const organizationView = useMemo(() => {
    return (
      contextValue?.model?.organizationGeneral?.organization || {
        name: contextValue?.model?.initUserOrganization?.organizationGeneral
          ?.name,
        taxCode:
          contextValue?.model?.initUserOrganization?.organizationGeneral
            ?.taxCode,
        address:
          contextValue?.model?.initUserOrganization?.organizationGeneral
            ?.address,
      }
    );
  }, [
    contextValue?.model?.organizationGeneral?.organization,
    contextValue?.model?.initUserOrganization?.organizationGeneral,
  ]);

  // ✅ Tối ưu: Extract utility function - STABLE REFERENCE
  const createPersonInChargeFromProfile = useCallback(
    (
      profile: any,
      organization: BidderInformationType
    ): PersonInChargeModel => {
      const newPerson = new PersonInChargeModel();
      newPerson.id = uuidv4();

      // 🚨 FIX: Safety checks for organization
      newPerson.name = organization?.name || "";
      newPerson.taxCode = organization?.taxCode || "";
      newPerson.address = organization?.address || "";

      if (profile?.account) {
        newPerson.pic = {
          id: profile.account.id,
          name:
            profile.account?.displayName ||
            profile.account?.username ||
            profile.account?.name,
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
      }

      return newPerson;
    },
    [] // STABLE - no dependencies
  );

  // 🚨 FIX: Make this function stable to prevent loops
  const handleChangeListFieldItemTable = useCallback(
    ({
      newListField,
      record,
      errorsPass,
      modelPass,
    }: HandleChangeListFieldParams) => {
      const errors = cloneDeep(errorsPass);
      const errorKey = `organizationGeneral.personInChargeInfos[${record?.indexBeforeValidate}].picId`;

      if (errors?.[errorKey] && !isNil(record?.indexBeforeValidate)) {
        delete errors[errorKey];
      }

      const transformedPersonInChargeInfos = newListField.map((item) => ({
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
      }));

      contextValue?.handleChangeAllField({
        ...modelPass,
        errors,
        organizationGeneral: {
          ...modelPass?.organizationGeneral,
          personInChargeInfos: transformedPersonInChargeInfos,
        },
      });
    },
    [contextValue] // Only contextValue as dependency
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
    const organization = isEdit ? organizationView : organizationGeneral;
    const newPerson = createPersonInChargeFromProfile(profile, organization);

    newListData.push({
      ...newPerson,
      pic: null,
      picId: null,
      email: "",
      phoneNumber: "",
      role: "",
    });

    handleChangeListFieldItemTable({
      newListField: newListData,
      modelPass: contextValue?.model,
    });
  }, [
    personInChargeInfosList,
    isEdit,
    organizationView,
    organizationGeneral,
    profile,
    createPersonInChargeFromProfile,
    handleChangeListFieldItemTable,
    contextValue?.model,
  ]);

  const handleDeletePersonInCharge = useCallback(
    (idToDelete: string | number) => {
      const newListData = personInChargeInfosList.filter(
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
        modelPass: contextValue?.model,
      });

      setSelectedRow(newSelectedRow);
      setSelectedRowKeys(newSelectedRowKeys);
    },
    [
      personInChargeInfosList,
      selectedRow,
      selectedRowKeys,
      handleChangeListFieldItemTable,
      contextValue?.model,
      setSelectedRow,
      setSelectedRowKeys,
    ]
  );

  const handleChangeItemTable = useCallback(
    ({ value, key, id }: { value: any; key: string; id: string }) => {
      const newListData = cloneDeep(personInChargeInfosList);
      const itemChange = newListData.find((e) => isEqual(id, e?.id));

      if (!itemChange) return;

      switch (key) {
        case ColumnKey.PIC:
          itemChange[ColumnKey.PIC] = {
            name: value?.fullName || value?.name,
            id: value?.id,
            email: value?.email,
            phoneNumber: value?.phoneNumber,
            position: {
              name: value?.position?.name,
            } as PersonInChargeModel,
          };
          itemChange[ColumnKey.PERSON_IN_CHARGE_ID] = value?.id;
          itemChange[ColumnKey.EMAIL] = value?.email;
          itemChange[ColumnKey.PHONE_NUMBER] = value?.phoneNumber;
          itemChange[ColumnKey.ROLE] = value?.position?.name;
          break;
        default:
          itemChange[key] = value;
      }

      const newListDataChange = newListData.map((item) =>
        item?.id === itemChange?.id ? { ...item, ...itemChange } : item
      );

      handleChangeListFieldItemTable({
        newListField: newListDataChange,
        record: itemChange,
        modelPass: contextValue?.model,
      });
    },
    [
      personInChargeInfosList,
      handleChangeListFieldItemTable,
      contextValue?.model,
    ]
  );

  const handleDeleteItemsSelected = useCallback(() => {
    const newListData = personInChargeInfosList.filter(
      (item) => !selectedRowKeys.includes(item.id)
    );

    handleChangeListFieldItemTable({
      newListField: newListData,
      modelPass: contextValue?.model,
    });

    setSelectedRowKeys([]);
    setSelectedRow([]);
  }, [
    personInChargeInfosList,
    selectedRowKeys,
    handleChangeListFieldItemTable,
    contextValue?.model,
    setSelectedRowKeys,
    setSelectedRow,
  ]);

  // ✅ STABLE render functions
  const renderCell = useCallback(
    (value: string) => (
      <LayoutCell>
        <div className="text-ellipsis">
          <OneLineText value={value} />
        </div>
      </LayoutCell>
    ),
    []
  );

  const renderPersonInChargeCell = useCallback(
    (value: any, record: PersonInChargeModel) => {
      if (isView) {
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
              contextValue?.model,
              `organizationGeneral.personInChargeInfos[${record?.indexBeforeValidate}].picId`
            )}
            isTableCell={true}
          >
            <Select
              isSmall={true}
              placeHolder={translate("PL.bidding.placeholder.person_in_charge")}
              classFilter={SearchingFilterModel}
              searchProperty="searchText"
              isSearch={true}
              getList={(TModelFilter) => {
                return isBidderInformation
                  ? purchasingPlanRepository.listMasterUserPost({
                      pageIndex: 1,
                      pageSize: 30,
                      searchText: TModelFilter?.searchText,
                      isActive: [true],
                      isSupplier: false,
                      userIgnoreIds: contextValue?.model?.evaluationTeam?.map(
                        (item) => item?.user?.id
                      ),
                    } as SearchingFilterModel)
                  : purchasingPlanRepository.listMasterUser({
                      pageIndex: 1,
                      pageSize: DEFAULT_PAGE_SIZE,
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
                  return combineTextExtra(
                    valueRender?.fullName || valueRender?.name
                  );
                }
                return combineTextExtra(
                  valueRender?.fullName || valueRender?.name,
                  valueRender?.email,
                  valueRender?.position?.name
                );
              }}
            />
          </FormItem>
        </LayoutCell>
      );
    },
    [isView, contextValue?.model, translate, handleChangeItemTable, isDetail]
  );

  const renderDeleteButton = useCallback(
    (record: PersonInChargeModel) => {
      if (isDetail) return null;

      return (
        <LayoutCell>
          <button
            className={styles["delete-row-btn"]}
            onClick={() => handleDeletePersonInCharge(record?.id)}
            aria-label="Delete person in charge"
          >
            <TrashIcon fillColor="#C03629" />
          </button>
        </LayoutCell>
      );
    },
    [isDetail, handleDeletePersonInCharge]
  );

  // ✅ STABLE columns
  const columns: ColumnProps<PersonInChargeModel>[] = useMemo(
    () => [
      {
        title: isBidderInformation
          ? translate("PL.txt_inviting_party")
          : translate("PL.competitive_offer.title.name"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: COLUMNS_WIDTH.name,
        render: renderCell,
      },
      {
        title: translate("PL.purchasing_plan_supplier_tax_code"),
        key: ColumnKey.TAX_CODE,
        dataIndex: ColumnKey.TAX_CODE,
        ellipsis: true,
        width: COLUMNS_WIDTH.taxCode,
        render: renderCell,
      },
      {
        title: translate("PL.purchasing_plan_supplier_address"),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        width: COLUMNS_WIDTH.address,
        ellipsis: true,
        render: renderCell,
      },
      {
        title: (
          <UnitTitle
            title={translate("PL.bidding.title.person_in_charge")}
            isShowUnit={false}
            required={!isView}
          />
        ),
        key: ColumnKey.PIC,
        dataIndex: ColumnKey.PIC,
        width: COLUMNS_WIDTH.personInCharge,
        render: renderPersonInChargeCell,
      },
      {
        title: translate("PL.purchasing_plan_email"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        width: COLUMNS_WIDTH.email,
        render: (value) => (
          <LayoutCell>
            <OneLineText value={value} useTooltip={true} />
          </LayoutCell>
        ),
      },
      {
        title: translate("PL.drawer_phone_number_supplier"),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        width: COLUMNS_WIDTH.phone,
        render: (value) => (
          <LayoutCell>
            <OneLineText value={value} useTooltip={true} />
          </LayoutCell>
        ),
      },
      {
        title: translate("CT.create_contract.title.position_title"),
        key: ColumnKey.ROLE,
        dataIndex: ColumnKey.ROLE,
        width: COLUMNS_WIDTH.role,
        render: (value) => (
          <LayoutCell>
            <OneLineText value={value} useTooltip={true} />
          </LayoutCell>
        ),
      },
      {
        title: "",
        width: isDetail ? 1 : 40,
        render: (_, record) => renderDeleteButton(record),
      },
    ],
    [
      isBidderInformation,
      translate,
      isView,
      isDetail,
      renderCell,
      renderPersonInChargeCell,
      renderDeleteButton,
    ]
  );

  // ✅ STABLE row selection
  const getRowSelection = useMemo(() => {
    if (isDetail) return null;

    return {
      ...rowSelection,
      renderCell: (value: boolean, record: PersonInChargeModel) => {
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
                    selectedRow.filter((item) => item.id !== record.id)
                  );
                }
              }}
            />
          </div>
        );
      },
    };
  }, [
    isDetail,
    rowSelection,
    selectedRowKeys,
    selectedRow,
    setSelectedRowKeys,
    setSelectedRow,
  ]);

  const hasPersonInChargeData = size(personInChargeInfosList) > 0;

  return (
    <div>
      {hasPersonInChargeData && !isDetail && (
        <Button
          className="receiving_date_btn"
          type="secondary"
          size="lg"
          icon={<img src={AddIcon} alt="Add" width={12} height={12} />}
          iconPlace="left"
          onClick={handleAddNewPersonInCharge}
          disabled={isDetail}
        >
          {translate("PL.bidding.button.add_person_in_charge")}
        </Button>
      )}

      <div className="mt-2">
        <TableWithEmpty
          list={hasPersonInChargeData ? personInChargeInfosList : null}
          columns={columns}
          idContainer="BidderInformation-1"
          scroll={{ y: TABLE_SCROLL_HEIGHT }}
          isDragable={true}
          actionBarComponent={
            !isDetail ? (
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
            ) : null
          }
          rowSelection={getRowSelection}
          emptyExtra={
            <CloudyEmpty content={translate("CA.msg_empty_data_in_system")}>
              {!isDetail && (
                <Button
                  className={styles["w-content"]}
                  type="secondary"
                  size="lg"
                  icon={<img src={AddIcon} alt="Add" width={12} height={12} />}
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
          modelValidate={contextValue?.model}
        />
      </div>
    </div>
  );
};

export default React.memo(BidderInformationTableChildBidding);
