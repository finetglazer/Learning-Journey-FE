import { TrashCan } from "@carbon/icons-react";
import {
  ActionBarComponent,
  Button,
  FormItem,
  InputNumber,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";

import { Table, Tooltip } from "antd";
import { DeleteRoundIcon, IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { NUMBER_MAX_13 } from "config/const";
import {
  ACCEPTANCE_DETAIL_ROUTE,
  RECEIVING_GOODS_DETAIL_ROUTE,
} from "config/route-const";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { SelectAsset } from "models/TemporaryImportAsset/SelectAsset";
import { TemporaryImportAssetModel } from "models/TemporaryImportAsset/TemporaryImportAsset";
import { useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { TemporaryImportAssetDetailHookContext } from "../../TemporaryImportAssetDetailHook";
import SelectAssetModal from "../SelectAssetModal";
import AddAsset from "./AddAsset";
import "./AssetInformationTableStyled.scss";
import { COLUMNS, countTotal } from "./helper";

const AssetInformationTable = ({ contractId }: { contractId: string }) => {
  const {
    setModalType,
    modalType,
    handleCallback,
    selectedRowKeys,
    setSelectedRowKeys,
    rowSelection,
    handleDeleteRow,
    isOpenModelConfirmDeleteRow,
    setIsOpenModelConfirmDeleteRow,
    handleConfirmDeleteRow,
    model,
    translate,
    handleDeleteMultipleRow,
    runAsset,
  } = useContext<TemporaryImportAssetModel>(
    TemporaryImportAssetDetailHookContext
  );

  const total = countTotal(model?.tempReceiptItems || 0);

  const handleChangeItemTable = useCallback(
    (value: number, id: string, fieldNameError: string, goodId: string) => {
      runAsset(goodId, value, id, fieldNameError);
    },
    [runAsset]
  );

  const columns = [
    {
      title: () => (
        <div className="title uni mt">
          <div> {translate("TIA.txt_asset_name")}</div>
          <span>{translate("TIA.txt_asset_code")}</span>
        </div>
      ),
      width: 280,
      ellipsis: true,
      fixed: "left" as const,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <TwoLineText
              valueLine1={data?.assetName}
              valueLine2={data?.assetCode}
              classNameSecondLine="text-neutral-7"
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_asset_origin_no")}</div>
      ),
      width: 140,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText className="line-height-22" value={data?.originNo} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_asset_quantity")}</div>
      ),
      width: 100,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={formatNumber(data?.quantity || 0)}
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="title currency mt">
          <div>
            {translate("TIA.txt_input_value_term")}
            <span className="text-danger">&nbsp;*</span>
          </div>
          <span>VND</span>
        </div>
      ),
      width: 180,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset, index: number) => {
        return (
          <LayoutCell position="right" className="term-value-input">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `tempReceiptItems[${index}].amount`
              )}
              isTableCell={true}
            >
              <InputNumber
                className="payment-label_none"
                onChange={(value: number) => {
                  return handleChangeItemTable(
                    value,
                    data?.id,
                    `tempReceiptItems[${index}].amount`,
                    data?.goodsId
                  );
                }}
                value={data?.amount}
                isSmall={true}
                isTableCell={true}
                translate={translate}
                isRequired
                max={NUMBER_MAX_13}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: () => <div className="mt">{translate("TIA.txt_type")}</div>,
      width: 140,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText className="line-height-22" value={data?.classify} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_depreciation_month")}</div>
      ),
      width: 140,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={data?.depreciationMonths}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_serial_number")}</div>
      ),
      width: 160,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={data?.serialNumber}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_receipt_date")}</div>
      ),
      width: 168,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={
                data?.usageStartDate
                  ? formatDateTimeToVietnamTimezone(
                      data?.usageStartDate,
                      STANDARD_DATE_FORMAT_SLASH
                    )
                  : ""
              }
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_good_code_receipt")}</div>
      ),
      width: 160,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <Link
              to={`${ACCEPTANCE_DETAIL_ROUTE}/${data?.acceptanceId}`}
              target="_blank"
              className={"text-decoration-none"}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <OneLineText
                className="text-table-content-primary text-first__style "
                value={data?.acceptanceCode}
              />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">{translate("TIA.txt_asset_code_receipt")}</div>
      ),
      width: 160,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <Link
              to={`${RECEIVING_GOODS_DETAIL_ROUTE}/${data?.goodReceiptId}`}
              target="_blank"
              className={"text-decoration-none"}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <OneLineText
                className="text-table-content-primary text-first__style "
                value={data?.goodReceiptCode}
              />
            </Link>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="title uni mt">
          <div> {translate("TIA.txt_receiving_unit_and_in_charge")}</div>
          <span>{translate("TIA.txt_receiver_and_in_charge")}</span>
        </div>
      ),
      width: 200,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell className="column start">
            <OneLineText
              className="unit-name"
              value={data?.recipientUnitName}
            />
            <Tooltip
              title={`${data?.receiptPersonEmail} - ${data?.receiptPerson}`}
              overlayStyle={{ maxWidth: "500px" }}
            >
              <div className="d-inline-block text-in-table-cell text-truncate w-100 line-text second-line text-second__style">
                {data?.receiptPersonEmail}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: () => <div className="mt">{translate("TIA.txt_brand_type")}</div>,
      width: 160,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText className="line-height-22" value={data?.branchName} />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="mt">{translate("TIA.txt_receipt_note")}</div>
      ),
      width: 200,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={data?.goodsReceiptRequestItemNote}
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="mt">{translate("TIA.txt_goods_service")}</div>
      ),
      dataIndex: "name",
      key: "name",
      width: 250,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <TwoLineText
              classNameSecondLine="text-second__style"
              valueLine1={data?.goodServiceName}
              valueLine2={data?.goodServiceCode}
              useTooltip
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="mt">
          {translate("TIA.txt_goods_service_description")}
        </div>
      ),
      width: 200,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={data?.contractGoodsItemDescription}
            />
          </LayoutCell>
        );
      },
    },

    {
      title: () => (
        <div className="mt">{translate("TIA.txt_goods_service_note")}</div>
      ),
      width: 200,
      ellipsis: true,
      render: (_: SelectAsset, data: SelectAsset) => {
        return (
          <LayoutCell>
            <OneLineText
              className="line-height-22"
              value={data?.contractGoodsItemNote}
            />
          </LayoutCell>
        );
      },
    },

    {
      title: "",
      key: "action",
      dataIndex: "action",
      width: 40,
      fixed: "right" as const,
      render: (_: SelectAsset, record: { id: string }) => {
        return (
          <LayoutCell>
            <div className="payment-trash_icon cursor-pointer btn">
              {record?.id ? (
                <TrashCan
                  size={20}
                  onClick={() => handleConfirmDeleteRow(record.id)}
                />
              ) : null}
            </div>
          </LayoutCell>
        );
      },
    },
  ];

  return (
    <div className="asset-infor-table-wrapper">
      {!model?.tempReceiptItems || model?.tempReceiptItems?.length <= 0 ? (
        <AddAsset
          onAddAsset={() => setModalType({ type: "ADD_ASSET" })}
          disabled={!contractId}
        />
      ) : (
        <>
          <AddAsset
            isButton
            onAddAsset={() => setModalType({ type: "ADD_ASSET" })}
            className="add-asset-button"
            disabled={!contractId}
          />
          <div className="d-flex gap-2 align-items-center">
            <ActionBarComponent
              selectedRowKeys={selectedRowKeys?.filter((f) => f)}
              setSelectedRowKeys={setSelectedRowKeys}
            >
              <Button
                type="secondary"
                size="sm"
                onClick={() => setIsOpenModelConfirmDeleteRow(true)}
              >
                {translate("CM.txt_delete")}
              </Button>
            </ActionBarComponent>
          </div>
          <StandardTable
            className="asset-custom_table"
            idContainer="asset-status"
            rowKey={(record) => record?.id}
            dataSource={model?.tempReceiptItems || []}
            scroll={{ y: "calc(100vh - 470px)" }}
            rowSelection={{
              ...rowSelection,
              fixed: true,
            }}
            columns={columns}
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) => {
                if (!record.children || record.children.length === 0) {
                  return <div className="table__width-8" />;
                }
                return (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onExpand(record, e);
                    }}
                  >
                    <img
                      className={classNames("cursor-pointer m-x--3xs", {
                        "rotate-180": expanded,
                        "rotate-0": !expanded,
                      })}
                      src={IcArrowDown}
                      alt="img"
                      width={10}
                      height={10}
                    />
                  </div>
                );
              },
            }}
            summary={() => {
              const summaryCells = Array.from({ length: 15 }, (_, index) => {
                if (index === COLUMNS.SHOW_LABEL_TOTAL) {
                  return (
                    <Table.Summary.Cell key={index} index={index}>
                      {translate("TIA.txt_sum")}
                    </Table.Summary.Cell>
                  );
                }
                if (index === COLUMNS.SHOW_VALUE_TOTAL) {
                  return (
                    <Table.Summary.Cell
                      key={index}
                      index={index}
                      className="right-content"
                    >
                      {formatNumber(total)}
                    </Table.Summary.Cell>
                  );
                }
                return (
                  <Table.Summary.Cell
                    key={index}
                    index={index}
                  ></Table.Summary.Cell>
                );
              });

              return (
                <Table.Summary fixed="top">
                  <Table.Summary.Row>{summaryCells}</Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </>
      )}

      {modalType?.type === "ADD_ASSET" && (
        <SelectAssetModal
          visible={true}
          onCloseModal={() => setModalType({ type: "NONE" })}
          idIgnores={model?.tempReceiptItems?.map(
            (item: { id: string }) => item.id
          )}
          setModal={setModalType}
          callback={handleCallback}
          contractId={contractId}
        />
      )}

      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("TIA.modal_confirm_delete_asset_title")}
        content={translate("TIA.modal_confirm_delete_asset_content")}
        titleButtonCancel={translate("TIA.btn_close")}
        titleButtonApply={translate("TIA.btn_delete")}
        handleSave={
          selectedRowKeys?.length > 0
            ? handleDeleteMultipleRow
            : handleDeleteRow
        }
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />
    </div>
  );
};

export default AssetInformationTable;
