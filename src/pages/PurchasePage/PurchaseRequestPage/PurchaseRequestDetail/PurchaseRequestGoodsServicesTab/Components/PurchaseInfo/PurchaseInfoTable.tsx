import { ColumnProps } from "antd/lib/table";
import { ExpandableConfig, TableRowSelection } from "antd/lib/table/interface";
import { DeleteRoundIcon, ErrorTab, IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { addNumbers, formatNumber, roundTo } from "core/helpers/number";
import { listService } from "core/services/page-services/list-service";
import { difference, isEqual, isNumber, isUndefined, size } from "lodash";
import { JPY_CURRENCY, VND_CURRENCY } from "models/Payment";
import {
  GoodServiceByCategory,
  GoodsServices,
  PurchaseRequestDetailModel,
} from "models/PurchaseRequest";
import { formatNumberToCurrency } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import React, { useContext, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import { convertData } from "../../helper";
import GoodsServiceDrawer from "../GoodsServiceDrawer/GoodsServiceDrawer";
import "./PurchaseInfo.scss";
import { Tooltip } from "antd";
import CellCustom from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/Components/TablePurchaseInfo/Components/CellCustom";
import { GoodService } from "models/Proposal/GoodService";

const PurchaseInfoTable = () => {
  const [translate] = useTranslation();

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [recordEdit, setRecordEdit] = useState<GoodServiceByCategory>();

  const { model, handleChangeSingleField, changeListSelectedGoodsServices } =
    useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  const isVND = isEqual(
    model?.purchaseProposalId?.currency?.code,
    VND_CURRENCY
  );

  const isJYP = isEqual(
    model?.purchaseProposalId?.currency?.code,
    JPY_CURRENCY
  );

  const roundNum = isVND || isJYP ? 0 : 2;

  const sumRoundNum = isVND || isJYP ? 0 : 4;

  const { rowSelection, selectedRowKeys, setSelectedRowKeys, setSelectedRow } =
    listService.useRowSelection<GoodsServices>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const columns: ColumnProps<GoodServiceByCategory>[] = React.useMemo(() => {
    const dataColumn: ColumnProps<GoodServiceByCategory>[] = [
      {
        title: (
          <div
            className={classNames("p-l--md", {
              "p-l--lg": model?.isDetail,
            })}
          >
            {translate("PR.goods_services")}
          </div>
        ),
        ellipsis: true,
        width: 240,
        fixed: "left",
        key: "id",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="m-l--sm">
                <OneLineText
                  useTooltip
                  value={translate("PR.size_type_goods_services", {
                    size: size(model?.purchaseItems),
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children) {
            return (
              <LayoutCell className="data-with-collapse">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={record?.category?.name}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className="data-with-collapse">
              <CellCustom
                onClick={() => {
                  setOpenDrawer(true);
                  setRecordEdit(record);
                }}
                record={record as GoodService}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-flex">{translate("PR.brand_category")}</div>
        ),
        ellipsis: true,
        width: 130,
        key: "brand_category",
        render: (_, record) => {
          if (record?.children) return null;
          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.branch?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <div>{translate("PR.quantity")}</div>,
        align: "right",
        key: "quantity",
        ellipsis: true,
        width: 80,
        render: (_, record) => {
          if (record?.children) return null;

          if (isNumber(record?.quantity)) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  value={formatNumber(record?.quantity?.toString())}
                />
              </LayoutCell>
            );
          }
        },
      },
      {
        title: () => <div>{translate("PR.unit")}</div>,
        ellipsis: true,
        width: 90,
        key: "unit",
        render: (_, record) => {
          if (record.children) return null;
          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.unit?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PR.unit_price")}
            unit={model?.purchaseProposalId?.currency?.code}
          />
        ),
        ellipsis: true,
        width: 150,
        align: "right",
        render: (_, record) => {
          if (record.children || record.isTotal) return null;
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText useTooltip value={formatNumber(record?.unitPrice)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PR.total_price")}
            unit={model?.purchaseProposalId?.currency?.code}
          />
        ),
        ellipsis: true,
        align: "right",
        width: 155,
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    model?.purchaseItems?.reduce((prev: number, curr) => {
                      return addNumbers(
                        prev || 0,
                        roundTo(curr.unitPrice * curr.quantity || 0, roundNum)
                      );
                    }, 0),
                    roundNum
                  )}
                />
              </LayoutCell>
            );
          }
          if (record.children) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    record?.children?.reduce((prev: number, curr) => {
                      return addNumbers(
                        prev || 0,
                        roundTo(curr.unitPrice * curr.quantity || 0, roundNum)
                      );
                    }, 0),
                    roundNum
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(
                  record.unitPrice * record.quantity || 0,
                  roundNum
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PR.tax")}
            unit={model?.purchaseProposalId?.currency?.code}
          />
        ),
        ellipsis: true,
        width: 155,
        align: "right",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    model?.purchaseItems?.reduce((prev: number, curr) => {
                      return addNumbers(prev, curr?.taxAmount || 0);
                    }, 0),
                    sumRoundNum
                  )}
                />
              </LayoutCell>
            );
          }
          if (record.children) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    record?.children?.reduce((prev: number, curr) => {
                      return addNumbers(prev, curr?.taxAmount || 0);
                    }, 0),
                    sumRoundNum
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(
                  record?.taxAmount || 0,
                  sumRoundNum
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PR.other_costs")}
            unit={model?.purchaseProposalId?.currency?.code}
          />
        ),
        ellipsis: true,
        width: 155,
        align: "right",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    model?.purchaseItems?.reduce((prev: number, curr) => {
                      return prev + curr?.otherAmount || 0;
                    }, 0),
                    sumRoundNum
                  )}
                />
              </LayoutCell>
            );
          }
          if (record.children) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    record?.children?.reduce((prev: number, curr) => {
                      return prev + curr?.otherAmount || 0;
                    }, 0),
                    sumRoundNum
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(
                  record?.otherAmount || 0,
                  sumRoundNum
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PR.total_amount")}
            unit={model?.purchaseProposalId?.currency?.code}
          />
        ),
        ellipsis: true,
        width: 155,
        align: "right",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    model?.purchaseItems?.reduce((prev: number, curr) => {
                      return addNumbers(
                        prev,
                        roundTo(curr.totalAmount || 0, sumRoundNum)
                      );
                    }, 0),
                    sumRoundNum
                  )}
                />
              </LayoutCell>
            );
          }
          if (record.children) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    record?.children?.reduce((prev: number, curr) => {
                      return addNumbers(
                        prev,
                        roundTo(curr.totalAmount || 0, sumRoundNum)
                      );
                    }, 0),
                    sumRoundNum
                  )}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(
                  record?.totalAmount || 0,
                  sumRoundNum
                )}
              />
            </LayoutCell>
          );
        },
      },
      model?.purchaseProposalId?.currency?.code !== VND_CURRENCY
        ? {
            title: () => (
              <UnitTitle
                title={translate("PR.total_converted_amount")}
                unit={translate("PM.payment_currency_unit")}
              />
            ),
            ellipsis: true,
            width: 155,
            align: "right",
            render: (_, record) => {
              if (record.isTotal) {
                return (
                  <LayoutCell className="justify-content-end">
                    <OneLineText
                      useTooltip
                      className="fw-semibold"
                      value={formatNumber(
                        model?.purchaseItems?.reduce((prev: number, curr) => {
                          return addNumbers(
                            prev,
                            curr.totalConvertedAmount || 0
                          );
                        }, 0)
                      )}
                    />
                  </LayoutCell>
                );
              }
              if (record.children) {
                return (
                  <LayoutCell className="justify-content-end">
                    <OneLineText
                      useTooltip
                      className="fw-semibold"
                      value={formatNumberToCurrency(
                        record?.children?.reduce((prev: number, curr) => {
                          return addNumbers(
                            prev,
                            curr.totalConvertedAmount || 0
                          );
                        }, 0),
                        sumRoundNum
                      )}
                    />
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell className="justify-content-end">
                  <OneLineText
                    useTooltip
                    value={formatNumber(record?.totalConvertedAmount || 0)}
                  />
                </LayoutCell>
              );
            },
          }
        : {
            width: 0,
          },
      {
        title: () => (
          <div className="payment-font-14 d-flex">
            {translate("PR.description")}
          </div>
        ),
        ellipsis: true,
        width: 250,
        key: "description",
        render: (_, record) => {
          if (record.children) return null;
          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.description} />
            </LayoutCell>
          );
        },
      },
    ];

    const errorColumn: ColumnProps<GoodServiceByCategory> = {
      title: "",
      dataIndex: "",
      key: "",
      width: 40,
      render: (_: unknown, record: GoodServiceByCategory) => {
        if (record?.children?.length > 0 || !model || !model.errors) {
          return "";
        }
        const indexRecord = model.purchaseItems?.findIndex(
          (el) => el.id === record.id
        );

        let error = "";
        if (indexRecord >= 0) {
          if (model.errors[`purchaseItems[${indexRecord}]`]) {
            error += `${model.errors[`purchaseItems[${indexRecord}]`]}\n`;
          }

          if (model.errors[`purchaseItems[${indexRecord}].branchId`]) {
            error += `${translate("PR.brand_category")}: ${
              model.errors[`purchaseItems[${indexRecord}].branchId`]
            }\n`;
          }

          if (model.errors[`purchaseItems[${indexRecord}].quantity`]) {
            error += `${translate("PR.quantity")}: ${
              model.errors[`purchaseItems[${indexRecord}].quantity`]
            }\n`;
          }
        }

        const isHaveError =
          model.errors[`purchaseItems[${indexRecord}]`] ||
          model.errors[`purchaseItems[${indexRecord}].branchId`] ||
          model.errors[`purchaseItems[${indexRecord}].quantity`];

        if (isHaveError)
          return (
            <LayoutCell>
              <Tooltip
                placement="right"
                title={error}
                rootClassName="text-break-line"
              >
                <div className="error-tab">
                  <ErrorTab />
                </div>
              </Tooltip>
            </LayoutCell>
          );
      },
    };

    if (
      model?.errors &&
      Object.keys(model.errors).some((el) => el.includes("purchaseItems"))
    ) {
      dataColumn.unshift(errorColumn);
    }
    return dataColumn.filter(Boolean);
  }, [model, translate, roundNum, sumRoundNum]);

  const rowSelections: TableRowSelection<GoodServiceByCategory> = {
    ...rowSelection,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRow(
        selectedRows.filter(
          (item) => item?.id && isUndefined(item?.category?.id)
        )
      );
    },
    renderCell: (value: boolean, record: GoodServiceByCategory) => {
      return (
        <div
          className={`${
            record.isTotal ? "d-none" : "d-flex"
          } justify-content-center align-items-center payment-height_40`}
        >
          <Checkbox
            readOnly={record.isTotal}
            checked={value}
            onChange={(e) => {
              if (!record.children) {
                const lsIdSelected = e
                  ? [...selectedRowKeys, record?.id]
                  : difference(selectedRowKeys, [record?.id]);
                const parent = convertDataByCategory.find((item) =>
                  item.children?.some((i) => i.id === record?.id)
                );
                if (
                  parent?.children?.every((child) =>
                    lsIdSelected.includes(child.id)
                  )
                ) {
                  setSelectedRowKeys([...lsIdSelected, parent?.id]);
                } else {
                  const checkParentSelected = selectedRowKeys.includes(
                    parent?.id
                  );
                  setSelectedRowKeys(
                    checkParentSelected
                      ? difference(lsIdSelected, [parent.id])
                      : lsIdSelected
                  );
                }
              } else {
                const idChildSelected = record.children.map((i) => i.id);
                if (e) {
                  setSelectedRowKeys([
                    ...selectedRowKeys,
                    ...idChildSelected,
                    record?.id,
                  ]);
                } else {
                  setSelectedRowKeys(
                    difference(selectedRowKeys, [
                      ...idChildSelected,
                      record?.id,
                    ])
                  );
                }
              }
            }}
          />
        </div>
      );
    },
  };

  const expandable: ExpandableConfig<GoodServiceByCategory> = {
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
          className="d-flex justify-content-center"
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
  };

  const handleBulkDeleteRow = () => {
    const editSelectedGoods = model?.purchaseItems?.filter(
      (item) => !selectedRowKeys.includes(item.id)
    );
    handleChangeSingleField({
      fieldName: "purchaseItems",
    })(editSelectedGoods);
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const convertDataByCategory = convertData(model?.purchaseItems ?? []);

  return (
    <div className="m-t--md purchase_info_table">
      <ActionBarComponent
        selectedRowKeys={model?.purchaseItems
          ?.filter((item) => selectedRowKeys?.includes(item?.id))
          ?.map((item) => item.id)}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => {
            setOpenModalConfirmDeleteAll(true);
          }}
        >
          {translate("CL.delete_btn")}
        </Button>
      </ActionBarComponent>
      <StandardTable
        rowKey="id"
        isDragable
        columns={columns}
        dataSource={[{ isTotal: true }, ...convertDataByCategory]}
        scroll={{ y: "calc(100vh - 320px)" }}
        rowSelection={!model.isDetail ? rowSelections : undefined}
        expandable={expandable}
        rowClassName={(record) => {
          const classes = [];
          if (model.isDetail) classes.push("detail-row");
          if (record.isTotal) classes.push("total-row");
          if (record.id === recordEdit?.id && openDrawer)
            classes.push("editable-row");
          return classes.join(" ");
        }}
      />
      {openDrawer && (
        <GoodsServiceDrawer
          visible={openDrawer}
          onPressClose={() => {
            setOpenDrawer(false);
          }}
          data={recordEdit}
          onPressSave={changeListSelectedGoodsServices}
        />
      )}
      <ModalConfirm
        open={openModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PR.confirm_delete_goods_services")}
        content={translate("PR.delete_warning")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={handleBulkDeleteRow}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default PurchaseInfoTable;
