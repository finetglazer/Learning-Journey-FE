import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { ErrorTab, TrashIcon } from "assets/icons";
import classNames from "classnames";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { detectIntegerCurrency } from "core/helpers/currency";
import { addNumbers, formatNumber, roundTo } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { size } from "lodash";
import { ContractDetailFormModel, ContractGoodsItem } from "models/Contract";
import { VND_CURRENCY } from "models/Payment";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import { formatNumberToCurrency } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/helper";
import React from "react";
import {
  FormItem,
  LayoutCell,
  OneLineText,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./GoodsServicesInfo.module.scss";

type Props = {
  modelMaster: ContractDetailFormModel;
  currencyCode?: string;
  isDetailPage?: boolean;
  roundNum?: number;
  setSelectedDetailGoodsServicesId: React.Dispatch<
    React.SetStateAction<string>
  >;
  setDeletingGoodsServicesId: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenDeleteConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const useColumnGoodServicesInfo = ({
  modelMaster,
  currencyCode,
  roundNum,
  isDetailPage,
  setSelectedDetailGoodsServicesId,
  setDeletingGoodsServicesId,
  setIsOpenDeleteConfirmModal,
}: Props) => {
  const [translate] = useTranslation();
  const columns: ColumnProps<GoodServiceByCategory>[] = React.useMemo(() => {
    const dataColumn: ColumnProps<GoodServiceByCategory>[] = [
      {
        title: (
          <div
            className={classNames("p-l--md", {
              "p-l--lg": isDetailPage,
            })}
          >
            {translate("PR.goods_services")}
          </div>
        ),
        ellipsis: true,
        width: 220,
        fixed: "left",
        key: "id",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="m-l--sm">
                <OneLineText
                  useTooltip
                  value={translate("PR.size_type_goods_services", {
                    size: size(modelMaster?.contractGoodsServicesList),
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
              <div
                className="text-ellipsis"
                onClick={() => {
                  setSelectedDetailGoodsServicesId(record?.id);
                }}
              >
                <TwoLineText
                  classNameFirstLine="text_blue fw-semibold"
                  classNameSecondLine="text-second__style"
                  valueLine1={record?.name}
                  valueLine2={record?.code}
                  useTooltip
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CT.description_of_goods_and_services"),
        ellipsis: true,
        width: 200,
        key: "description",
        render: (_, record) => {
          if (record?.children) return null;
          return (
            <LayoutCell>
              <OneLineText value={record?.description} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <div>{translate("PR.unit")}</div>,
        ellipsis: true,
        width: 90,
        key: "unit",
        render: (_, record) => {
          if (record?.children) return null;
          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.unit?.name} />
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
          const index = modelMaster?.contractGoodsServicesList?.findIndex(
            (item) => item.id === record.id
          );
          return (
            <FormItem
              validateObject={utilService.getValidateObj(
                modelMaster,
                `contractGoodsServicesList[${index}].quantity`
              )}
            >
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  value={formatNumber(record?.quantity?.toString())}
                />
              </LayoutCell>
            </FormItem>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("PR.unit_price")} unit={currencyCode} />
        ),
        ellipsis: true,
        width: 145,
        align: "right",
        render: (_, record) => {
          if (record.children || record.isTotal) return null;
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(
                  record?.unitPrice,
                  detectIntegerCurrency(modelMaster?.currency) ? 0 : 4
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("PR.total_price")} unit={currencyCode} />
        ),
        ellipsis: true,
        align: "right",
        width: 145,
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    modelMaster?.contractGoodsServicesList?.reduce(
                      (prev: number, curr) => {
                        return addNumbers(
                          prev || 0,
                          roundTo(curr.unitPrice * curr.quantity || 0, roundNum)
                        );
                      },
                      0
                    ),
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
        title: () => <div>{translate("PR.tax_type")}</div>,
        align: "right",
        key: "tax",
        ellipsis: true,
        width: 145,
        render: (_, record) => {
          if (record?.children) return null;
          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={record?.tax?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("PR.tax")} unit={currencyCode} />
        ),
        ellipsis: true,
        width: 145,
        align: "right",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    modelMaster?.contractGoodsServicesList?.reduce(
                      (prev: number, curr) => {
                        return addNumbers(prev, curr?.taxAmount || 0);
                      },
                      0
                    ),
                    detectIntegerCurrency(modelMaster?.currency) ? 0 : 4
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
                    detectIntegerCurrency(modelMaster?.currency) ? 0 : 4
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
                  detectIntegerCurrency(modelMaster?.currency) ? 0 : 4
                )}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle title={translate("PR.total_amount")} unit={currencyCode} />
        ),
        ellipsis: true,
        width: 145,
        align: "right",
        render: (_, record) => {
          if (record.isTotal) {
            return (
              <LayoutCell className="justify-content-end">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumberToCurrency(
                    modelMaster?.contractGoodsServicesList?.reduce(
                      (prev: number, curr) => {
                        return addNumbers(
                          prev,
                          roundTo(
                            (curr?.unitPrice || 0) * (curr?.quantity || 0),
                            roundNum
                          ) + (curr?.taxAmount || 0)
                        );
                      },
                      0
                    ),
                    detectIntegerCurrency(modelMaster?.currency) ? 0 : 4
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
                        roundTo(
                          (curr?.unitPrice || 0) * (curr?.quantity || 0),
                          roundNum
                        ) + (curr?.taxAmount || 0)
                      );
                    }, 0),
                    detectIntegerCurrency(modelMaster?.currency) ? 0 : 4
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
                  roundTo(
                    (record?.unitPrice || 0) * (record?.quantity || 0),
                    roundNum
                  ) + (record?.taxAmount || 0),
                  detectIntegerCurrency(modelMaster?.currency) ? 0 : 4
                )}
              />
            </LayoutCell>
          );
        },
      },
      currencyCode !== VND_CURRENCY
        ? {
            title: () => (
              <UnitTitle
                title={translate("PR.total_converted_amount")}
                unit={translate("PM.payment_currency_unit")}
              />
            ),
            ellipsis: true,
            width: 145,
            align: "right",
            render: (_, record) => {
              if (record.isTotal) {
                return (
                  <LayoutCell className="justify-content-end">
                    <OneLineText
                      useTooltip
                      className="fw-semibold"
                      value={formatNumberToCurrency(
                        modelMaster?.contractGoodsServicesList?.reduce(
                          (prev: number, curr) => {
                            return addNumbers(
                              prev,
                              (roundTo(
                                (curr?.unitPrice || 0) * (curr?.quantity || 0),
                                roundNum
                              ) +
                                (curr?.taxAmount || 0)) *
                                (modelMaster?.rate || 1)
                            );
                          },
                          0
                        ),
                        0
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
                            (roundTo(
                              (curr?.unitPrice || 0) * (curr?.quantity || 0),
                              roundNum
                            ) +
                              (curr?.taxAmount || 0)) *
                              (modelMaster?.rate || 1)
                          );
                        }, 0),
                        0
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
                      (roundTo(
                        (record?.unitPrice || 0) * (record?.quantity || 0),
                        roundNum
                      ) +
                        (record?.taxAmount || 0)) *
                        (modelMaster?.rate || 1),
                      0
                    )}
                  />
                </LayoutCell>
              );
            },
          }
        : {
            width: 0,
          },
      {
        title: translate("CT.manufacture_categories"),
        ellipsis: true,
        width: 145,
        key: "brand_category",
        render: (_, record) => {
          if (record?.children) return null;
          const index = modelMaster?.contractGoodsServicesList?.findIndex(
            (item) => item.id === record.id
          );
          return (
            <FormItem
              validateObject={utilService.getValidateObj(
                modelMaster,
                `contractGoodsServicesList[${index}].branchId`
              )}
            >
              <LayoutCell>
                <OneLineText value={record?.branch?.name} />
              </LayoutCell>
            </FormItem>
          );
        },
      },
      {
        title: translate("CT.note"),
        ellipsis: true,
        width: 160,
        key: "note",
        dataIndex: "note",
        render: (_, record) => {
          if (record?.children) return null;
          return (
            <LayoutCell>
              <OneLineText value={record?.note} />
            </LayoutCell>
          );
        },
      },

      {
        title: "",
        width: 40,
        fixed: "right",
        render(_, record) {
          if (record.children || record.isTotal || !isDetailPage) return null;

          return (
            <LayoutCell>
              <button
                className={styles["delete-goods-services-row"]}
                onClick={() => {
                  setDeletingGoodsServicesId(record?.id);
                  setIsOpenDeleteConfirmModal(true);
                }}
              >
                <TrashIcon fillColor="#C03629" />
              </button>
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
      render: (_: unknown, record) => {
        if (
          record?.children?.length > 0 ||
          !modelMaster ||
          !modelMaster.errors
        ) {
          return "";
        }

        const indexRecord = modelMaster.contractGoodsItems?.findIndex(
          (el: ContractGoodsItem) => el.goodsId === record.goodsId
        );

        let error = "";
        if (
          indexRecord >= 0 &&
          modelMaster.errors[`contractGoodsItems[${indexRecord}].receiverInfos`]
        ) {
          error += `${
            modelMaster.errors[
              `contractGoodsItems[${indexRecord}].receiverInfos`
            ]
          }\n`;
        }

        const isHaveError =
          modelMaster.errors[`contractGoodsItems[${indexRecord}]`] ||
          modelMaster.errors[
            `contractGoodsItems[${indexRecord}].receiverInfos`
          ];

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
      modelMaster?.errors &&
      Object.keys(modelMaster.errors).some((el) =>
        el.includes("contractGoodsItems")
      )
    ) {
      dataColumn.unshift(errorColumn);
    }

    return dataColumn;
  }, [
    modelMaster,
    translate,
    currencyCode,
    roundNum,
    isDetailPage,
    setSelectedDetailGoodsServicesId,
    setDeletingGoodsServicesId,
    setIsOpenDeleteConfirmModal,
  ]);
  return { columns };
};

export default useColumnGoodServicesInfo;
