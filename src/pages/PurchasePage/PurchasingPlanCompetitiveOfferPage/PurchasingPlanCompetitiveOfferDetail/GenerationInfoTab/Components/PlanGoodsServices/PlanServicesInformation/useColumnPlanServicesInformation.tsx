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
import { Tooltip } from "antd";
import { ErrorTab } from "assets/icons";
import { omit, size } from "lodash";

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

  const columns = (modelPass: any) => {
    const errorColumn: ColumnProps<GoodServiceByCategory> = {
      title: "",
      dataIndex: "errorsBE",
      key: "errorsBE",
      width: 40,
      render: (errorsBE: any, record: GoodServiceByCategory) => {
        if (record?.children?.length > 0) {
          return null;
        }
        const result = omit(errorsBE, ["index"]);

        const errors = Object.values(result);

        if (errors && size(errors) === 0) {
          return null;
        }

        return (
          <LayoutCell>
            <Tooltip
              placement="right"
              title={errors?.join("\n")}
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

    const dataColumn: ColumnProps<GoodServiceByCategory>[] = [
      errorColumn,
      {
        title: <div>{translate("PL.purchasing_plan_goods_services")}</div>,
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
              <OneLineText value={formatNumber(record?.quantity)} useTooltip />
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
                  <div className="red cursor-pointer btn">
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

    return dataColumn.filter(Boolean);
  };
  return { columns };
};

export default useColumnPlanServicesInformation;
