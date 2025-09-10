import React from "react";
import { ColumnProps } from "antd/lib/table";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import {
  LayoutCell,
  OneLineText,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchasingPlanTypeModel } from "models/PurchasingPlan";
import { TrashCan } from "@carbon/icons-react";
import { formatNumber } from "core/helpers/number";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FixedType } from "antd/lib/table/interface";
import { Table, Tooltip } from "antd";
import { ErrorTab } from "assets/icons";

type Props = {
  model: PurchasingPlanTypeModel;
  setOpenDrawer: (value: boolean) => void;
  setRecordEdit: (value: GoodServiceByCategory) => void;
  handleDeleteRowConfirm: (id: string) => void;
  isView?: boolean;
};

const useColumnPlanServicesInformation = ({
  model,
  setRecordEdit,
  setOpenDrawer,
  handleDeleteRowConfirm,
  isView = false,
}: Props) => {
  const [translate] = useTranslation();

  const columns: ColumnProps<GoodServiceByCategory>[] = React.useMemo(() => {
    const dataColumn: ColumnProps<GoodServiceByCategory>[] = [
      {
        title: (
          <div className="p-l--md">
            {translate("PL.purchasing_plan_goods_services")}
          </div>
        ),
        ellipsis: true,
        width: 240,
        fixed: "left" as FixedType,
        key: "id",
        dataIndex: "id",
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record?.children) {
            return (
              <LayoutCell className="data-with-collapse">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={record?.goodsServicesCategoryName}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className="data-with-collapse">
              <div
                onClick={() => {
                  setOpenDrawer(true);
                  setRecordEdit(record);
                }}
                className="d-flex align-center w-100 cursor-pointer"
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
        title: () => (
          <div>{translate("PL.principle.title.description_goods")}</div>
        ),
        width: 320,
        ellipsis: true,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record.children) return null;
          return (
            <LayoutCell position={"left"}>
              <OneLineText value={record?.description} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <div>{translate("PL.purchasing_plan_unit")}</div>,
        ellipsis: true,
        width: 140,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record.children) return null;
          return (
            <LayoutCell position={"left"}>
              <OneLineText value={record?.unit?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>{translate("PL.purchasing_plan_purchase_quantity")}</div>
        ),
        ellipsis: true,
        fixed: "right" as FixedType,
        width: 160,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record.children) return null;
          return (
            <LayoutCell>
              <OneLineText
                value={formatNumber(record?.remainingRequestQuantity)}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <div>{translate("PL.purchasing_plan_brand_category")}</div>
        ),
        ellipsis: true,
        width: 180,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record.children) return null;
          return (
            <LayoutCell position={"left"}>
              <OneLineText value={record?.manufacturer?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <div>{translate("PL.purchasing_plan_note")}</div>,
        ellipsis: true,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record.children) return null;
          return (
            <LayoutCell position={"left"}>
              <OneLineText value={record?.note} useTooltip />
            </LayoutCell>
          );
        },
      },
      isView
        ? undefined
        : {
            title: "",
            key: "action",
            fixed: "right" as FixedType,
            dataIndex: "action",
            width: 40,
            render: (_: unknown, record: GoodServiceByCategory) => {
              if (record.children) return null;
              return (
                <LayoutCell>
                  <div className="payment-red cursor-pointer btn">
                    <TrashCan
                      size={20}
                      onClick={() => handleDeleteRowConfirm(record.id)}
                    />
                  </div>
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
          if (model.errors[`goodsItems[${indexRecord}]`]) {
            error += `${model.errors[`goodsItems[${indexRecord}]`]}\n`;
          }

          if (model.errors[`goodsItems[${indexRecord}].quantity`]) {
            error += `${model.errors[`goodsItems[${indexRecord}].quantity`]}\n`;
          }
        }

        const isHaveError =
          model.errors[`goodsItems[${indexRecord}]`] ||
          model.errors[`goodsItems[${indexRecord}].quantity`];

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
      Object.keys(model.errors).some((el) => el.includes("goodsItems"))
    ) {
      dataColumn.unshift(errorColumn);
    }
    return dataColumn.filter(Boolean);
  }, [
    translate,
    isView,
    model,
    setOpenDrawer,
    setRecordEdit,
    handleDeleteRowConfirm,
  ]);
  return { columns };
};

export default useColumnPlanServicesInformation;
