import { TrashCan } from "@carbon/icons-react";
import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import {
  AddIcon,
  DeleteRoundIcon,
  DownloadSimple,
  emptyCloudIcon,
} from "assets/icons";
import uploadSimple from "assets/icons/uploadSimple.svg";
import { formatNumber } from "core/helpers/number";
import dayjs from "dayjs";
import {
  AssetItems,
  SettlementHookModel,
  SettlementType,
} from "models/Settlement";
import { UnitTitleTable } from "pages/PaymentPage/PaymentCreate/Components/UnitTitleTable/UnitTitleTable";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { useContext, useMemo, useState } from "react";
import {
  Button,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import "./AssetInformation.scss";
import DrawerAssetDetail from "./Components/DrawerAssetDetail/DrawerAssetDetail";
import EmptyInitTable from "./Components/EmptyInitTable/EmptyInitTable";
import { v4 as uuid } from "uuid";
import DrawerCreateAsset from "./Components/DrawerCreateAsset/DrawerCreateAsset";
import { gt } from "lodash";

const AssetInformation = () => {
  const { translate, model, handleChangeSingleField, handleChangeAllField } =
    useContext<SettlementHookModel>(SettlementHookContext);
  const [openDrawerAssetDetail, setOpenDrawerAssetDetail] =
    useState<boolean>(false);
  const [recordEdit, setRecordEdit] = useState<AssetItems>();
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState<boolean>(false);
  const [idDelete, setIdDelete] = useState<string>();

  const handleCloseDrawerAssetDetail = () => {
    setOpenDrawerAssetDetail(false);
    setRecordEdit(null);
  };

  const handSaveAssetDetail = () => {
    const lengthNote = 1000;
    const errors: Record<string, unknown> = {};
    if (!model?.dateOfUse) {
      errors["dateOfUse"] = translate("CM.input_require_validation");
    }
    if (!model?.startDateDepreciation) {
      errors["startDateDepreciation"] = translate(
        "CM.input_require_validation"
      );
    }

    handleChangeAllField({
      ...model,
      errors,
    });

    if (
      model?.dateOfUse &&
      model?.startDateDepreciation &&
      (model?.originalPrice || model?.originalPrice === 0) &&
      (!model?.noteAssets || model?.noteAssets?.length <= lengthNote)
    ) {
      const dataAssetItems = model?.assetItems?.map((item: AssetItems) => {
        if (item.id === recordEdit?.id) {
          return {
            ...item,
            classify: model?.assetItemClassifyDetail,
            depreciationMonths: model?.assetItemDepreciationMonthsDetail,
            originalCost: model?.originalPrice,
            usageStartDate: model?.dateOfUse,
            depreciationStartDate: model?.startDateDepreciation,
            note: model?.noteAssets,
            quantity: model.quantity,
            ownerOrganization: model.ownerOrganization,
            ownerOrganizationId: model.ownerOrganizationId,
            ownerUser: model.ownerUser,
            ownerUserId: model.ownerUserId,
          };
        }
        return item;
      });
      handleChangeSingleField({
        fieldName: "assetItems",
      })(dataAssetItems);
      setOpenDrawerAssetDetail(false);
      setRecordEdit(null);
    }
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const id = recordEdit?.id || idDelete;
    const assetItems = model.assetItems.filter(
      (item: AssetItems) => item.id !== id
    );
    handleChangeSingleField({
      fieldName: "assetItems",
    })(assetItems);
    setIsOpenModelConfirmDeleteRow(false);
    setOpenDrawerCreateAsset(false);
    setRecordEdit(null);
  };

  const [openDrawerCreateAsset, setOpenDrawerCreateAsset] =
    useState<boolean>(false);

  const handleCloseDrawerCreateAsset = () => {
    handleResetData();
    setOpenDrawerCreateAsset(false);
    setRecordEdit(null);
  };

  const handleCreateAsset = () => {
    handleResetData();
    setRecordEdit(null);
    setOpenDrawerAssetDetail(false);
    setOpenDrawerCreateAsset(true);
  };

  const validate = () => {
    const lengthNote = 1000;
    const lengthCode = 255;
    const lengthGoodsNote = 500;
    let errors: Record<string, string | undefined> = {};

    const requiredFields = [
      "assetItemCode",
      "assetItemGoodsId",
      "assetItemBranchId",
      "ownerOrganization",
      "ownerUser",
      "assetItemType",
      "assetItemUsageStartDate",
      "assetItemDepreciationStartDate",
      "quantity",
    ];

    const hasError = requiredFields.some((field) => !model?.[field]);
    const isValidNote = gt(model?.assetItemNote?.length, lengthNote);
    const isValidCode = model?.assetItemCode?.length > lengthCode;
    const isValidGoodsDescription =
      model?.assetItemGoodsDescription?.length > lengthNote;
    const isValidGoodsNote =
      model?.assetItemGoodsNote?.length > lengthGoodsNote;

    if (isValidCode) {
      errors.assetItemCode = isValidCode
        ? translate("CM.input_length_validation", { maxLength: lengthCode })
        : undefined;
      handleChangeAllField({
        ...model,
        errors: { ...model.errors, ...errors },
      });
      return false;
    }

    if (
      hasError ||
      isValidNote ||
      isValidGoodsDescription ||
      isValidGoodsNote ||
      model.assetItemOriginalCost === undefined
    ) {
      errors = requiredFields.reduce(
        (acc: Record<string, string | undefined>, field) => {
          acc[field] = model?.[field]
            ? undefined
            : translate("CM.input_require_validation");
          return acc;
        },
        {} as Record<string, string | undefined>
      );

      errors.assetItemNote = isValidNote
        ? translate("CM.input_length_validation", { maxLength: lengthNote })
        : undefined;

      errors.assetItemGoodsDescription = isValidGoodsDescription
        ? translate("CM.input_length_validation", { maxLength: lengthNote })
        : undefined;
      errors.assetItemGoodsNote = isValidGoodsNote
        ? translate("CM.input_length_validation", {
            maxLength: lengthGoodsNote,
          })
        : undefined;
      errors.assetItemOriginalCost =
        model.assetItemOriginalCost !== undefined
          ? undefined
          : translate("CM.input_require_validation");

      handleChangeAllField({
        ...model,
        errors: { ...model.errors, ...errors },
      });
      return false;
    }
    return true;
  };

  const handleResetData = () => {
    const fieldsDelete = [
      "assetItemCode",
      "assetItemName",
      "assetItemGoodsId",
      "assetItemBranchId",
      "assetItemGoodsDescription",
      "assetItemGoodsNote",
      "ownerOrganization",
      "ownerUser",
      "assetItemOriginalCost",
      "assetItemType",
      "assetItemUsageStartDate",
      "assetItemDepreciationStartDate",
      "assetItemNote",
      "assetItemDepreciationMonths",
      "assetItemClassify",
      "classifyType",
      "quantity",
    ];

    const updatedModel = { ...model };
    const updatedErrors = { ...(model?.errors || {}) };

    fieldsDelete.forEach((field) => {
      if (field in updatedModel) {
        delete updatedModel[field];
      }
      if (field in updatedErrors) {
        delete updatedErrors[field];
      }
    });

    handleChangeAllField({
      ...model,
    });
  };

  const handSaveCreateAsset = () => {
    if (!validate()) return;

    const assetItem = {
      code: model.assetItemCode,
      name: model.assetItemName,
      originNo: model.originNo,
      serialNumber: model.serialNumber,
      quantity: model.quantity,
      goods: model.assetItemGoodsId,
      branch: model.assetItemBranchId,
      goodsDescription: model.assetItemGoodsDescription,
      goodsNote: model.assetItemGoodsNote,
      ownerOrganization: model.ownerOrganization,
      ownerUser: model.ownerUser,
      originalCost: model.assetItemOriginalCost,
      type: model.assetItemType?.id,
      usageStartDate: model.assetItemUsageStartDate,
      depreciationStartDate: model.assetItemDepreciationStartDate,
      note: model.assetItemNote,
      classify: model.assetItemClassify,
      depreciationMonths: model.assetItemDepreciationMonths,
      isSynced: false,
      classifyType: model.classifyType,
    };

    if (recordEdit) {
      const dataAssetItems = model?.assetItems?.map((item: AssetItems) => {
        if (item.id === recordEdit?.id) {
          return {
            ...item,
            ...assetItem,
          };
        }
        return item;
      });
      handleChangeSingleField({
        fieldName: "assetItems",
      })(dataAssetItems);
    } else {
      const assetItems = [
        ...(model.assetItems || []),
        {
          id: uuid(),
          ...assetItem,
        },
      ];

      handleChangeAllField({
        ...model,
        assetItems,
      });
    }

    setOpenDrawerCreateAsset(false);
    setRecordEdit(null);
  };

  const columns: ColumnProps<AssetItems>[] = useMemo(
    () => [
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_type")}
            unit={" "}
          />
        ),
        dataIndex: "type",
        key: "type",
        width: 124,
        render(text, record) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  record?.type === 1
                    ? SettlementType?.NEW_PURCHASE
                    : SettlementType?.UPGRADE
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.asset_name")}
            unit={" "}
          />
        ),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: 260,
        render(code, record) {
          return (
            <LayoutCell>
              <div
                className="text_blue fw-semibold cursor-pointer text-truncate"
                onClick={() => {
                  handleResetData();
                  if (record?.asset?.isSynced) {
                    setOpenDrawerCreateAsset(false);
                    setOpenDrawerAssetDetail(true);
                  } else {
                    setOpenDrawerAssetDetail(false);
                    setOpenDrawerCreateAsset(true);
                  }

                  setRecordEdit(record);
                }}
              >
                <TwoLineText
                  valueLine1={record?.name}
                  valueLine2={record?.code}
                  classNameSecondLine="text-neutral-7"
                  classNameFirstLine="text-table-content-primary"
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.origin_no")}
            unit={" "}
          />
        ),
        key: "originNo",
        dataIndex: "originNo",
        width: 150,
        ellipsis: true,
        render(goodsDescription, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.originNo} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_quantity")}
            unit={" "}
          />
        ),
        key: "quantity",
        dataIndex: "quantity",
        width: 100,
        ellipsis: true,
        render(goodsDescription, record) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(record?.quantity)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_original_price")}
            unit={model?.contract?.currency}
          />
        ),
        key: "originalCost",
        dataIndex: "originalCost",
        ellipsis: true,
        align: "right",
        width: 160,
        render(originalCost, record) {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(record?.originalCost)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_classify")}
            unit={" "}
          />
        ),
        key: "classify",
        dataIndex: "classify",
        ellipsis: true,
        width: 160,
        render(classify, record) {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.classify} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate(
              "settlement.settlement_number_of_months_of_depreciation"
            )}
            unit={" "}
          />
        ),
        key: "depreciationMonths",
        dataIndex: "depreciationMonths",
        ellipsis: true,
        width: 172,
        render(depreciationMonths, record) {
          return (
            <LayoutCell position="right">
              <OneLineText value={String(record?.depreciationMonths)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_date_of_use")}
            unit={" "}
          />
        ),
        key: "usageStartDate",
        dataIndex: "usageStartDate",
        ellipsis: true,
        width: 168,
        render(usageStartDate, record) {
          return (
            <LayoutCell position="left">
              <OneLineText
                value={
                  record?.usageStartDate &&
                  dayjs(record?.usageStartDate).format("DD/MM/YYYY")
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_start_date_depreciation")}
            unit={" "}
          />
        ),
        key: "depreciationStartDate",
        dataIndex: "depreciationStartDate",
        ellipsis: true,
        width: 204,
        render(depreciationStartDate, record) {
          return (
            <LayoutCell position="left">
              <OneLineText
                value={
                  record?.depreciationStartDate &&
                  dayjs(record?.depreciationStartDate).format("DD/MM/YYYY")
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate(
              "settlement.settlement_receiving_and_registered_unit"
            )}
            unit={" "}
          />
        ),
        key: "ownerOrganization",
        dataIndex: "ownerOrganization",
        ellipsis: true,
        width: 200,
        render(ownerOrganization: string, record) {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.ownerOrganization?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_Recipient_and_named")}
            unit={" "}
          />
        ),
        key: "ownerUser",
        dataIndex: "ownerUser",
        ellipsis: true,
        width: 179,
        render(ownerUser: string, record) {
          return (
            <LayoutCell position="left">
              {/* <OneLineText value={record?.ownerUser?.email} /> */}
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={`${record?.ownerUser?.email} - ${record?.ownerUser?.name}`}
              >
                <div className="text-truncate">{record?.ownerUser?.email}</div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_goods_services")}
            unit={" "}
          />
        ),
        key: "accountName",
        dataIndex: "accountName",
        width: 200,
        ellipsis: true,
        render(accountName, record) {
          return (
            <LayoutCell>
              <Tooltip
                placement="topLeft"
                className="w-100"
                title={record?.goods?.name}
              >
                <div className="text_blue fw-semibold cursor-pointer text-truncate">
                  {record?.goods?.name}
                </div>
                <div className="text-second__style">{record?.goods?.code}</div>
              </Tooltip>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate(
              "settlement.settlement_description_goods_and_services"
            )}
            unit={" "}
          />
        ),
        key: "goodsDescription",
        dataIndex: "goodsDescription",
        width: 220,
        ellipsis: true,
        render(goodsDescription, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.goodsDescription} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_brand_or_type")}
            unit={" "}
          />
        ),
        key: "branch",
        dataIndex: "branch",
        ellipsis: true,
        width: 194,
        render(branch: string, record) {
          return (
            <LayoutCell>
              <OneLineText value={record?.branch?.name} />
            </LayoutCell>
          );
        },
      },

      {
        title: "",
        key: "action",
        fixed: "right",
        dataIndex: "action",
        width: 40,
        render: (_, record) => {
          if (!record?.asset?.isSynced) {
            return (
              <LayoutCell>
                <div className="payment-red cursor-pointer btn">
                  <TrashCan
                    size={24}
                    onClick={() => handleDeleteRowConfirm(record.id)}
                  />
                </div>
              </LayoutCell>
            );
          }
        },
      },
    ],
    [translate, model]
  );

  return (
    <div className="asset-information-tab p-t--md p-b--lg p-x--sm">
      {!model?.assetItems || model?.assetItems?.length === 0 ? (
        <div className="p-b--sm">
          <EmptyInitTable
            isSolid={false}
            textButtonLeft={translate("settlement.settlement_add_asset_info")}
            textButtonCenter={translate("BG.upload")}
            textButtonRight={translate("BG.download_template_file")}
            content={
              <div>
                <div>{translate("CM.empty.no_data_recorded")}</div>
                <div>{translate("settlement.let_add_data")}</div>
              </div>
            }
            icon={<img src={emptyCloudIcon} alt="" />}
            buttonIconCenter={<img src={uploadSimple} alt="" />}
            buttonIconRight={<img src={DownloadSimple} alt="" />}
            disableButtonLeft={false}
            disableButtonRight={false}
            disableButtonCenter={true}
            onHandleClickAddLeft={handleCreateAsset}
          />
        </div>
      ) : (
        <div>
          <div className="d-flex m-b--xs">
            <Button
              className="m-r--2xs"
              icon={<img src={AddIcon} alt="" />}
              iconPlace="left"
              type="secondary"
              onClick={handleCreateAsset}
            >
              {translate("settlement.settlement_add_asset_info")}
            </Button>
            <Button
              className="disabled-button m-r--2xs"
              icon={
                <img
                  src={uploadSimple}
                  alt=""
                  style={{ color: "#42526e !important" }}
                />
              }
              iconPlace="left"
              type="tertiary"
            >
              {translate("BG.upload")}
            </Button>
            <Button
              icon={<img src={DownloadSimple} alt="" />}
              iconPlace="left"
              type="tertiary"
            >
              {translate("BG.download_template_file")}
            </Button>
          </div>
          <div>
            <StandardTable
              className="tab__budget"
              rowKey={"id"}
              columns={columns}
              dataSource={model?.assetItems}
              isDragable={true}
              scroll={{ y: "calc(100vh - 360px)" }}
              idContainer="table-id"
            />
          </div>
        </div>
      )}

      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("settlement.asset_title_modal_delete")}
        content={translate("settlement.asset_content_modal_delete")}
        titleButtonCancel={translate("CM.btn_close")}
        titleButtonApply={translate("CM.txt_delete")}
        handleSave={() => {
          handleDeleteRow();
        }}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />

      {openDrawerAssetDetail && (
        <DrawerAssetDetail
          visible={openDrawerAssetDetail}
          handleClose={handleCloseDrawerAssetDetail}
          handleSave={handSaveAssetDetail}
          recordEdit={recordEdit}
        />
      )}

      {openDrawerCreateAsset && (
        <DrawerCreateAsset
          visible={openDrawerCreateAsset}
          handleClose={handleCloseDrawerCreateAsset}
          handleSave={handSaveCreateAsset}
          recordEdit={recordEdit}
          handleDelete={() => setIsOpenModelConfirmDeleteRow(true)}
        />
      )}
    </div>
  );
};

export default AssetInformation;
