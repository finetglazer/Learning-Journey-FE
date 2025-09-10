/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import {
  LayoutCell,
  Modal,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext, useMemo } from "react";

import "./CostItemGoodsServicesPreview.scss";
import {
  CostItemGoodsServicesMasterContext,
  CostItemGoodsServicesMasterContextModel,
} from "../CostItemGoodsServicesMaster/CostItemGoodsServicesMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";
import { CostItem } from "models/CostItem";
import { ColumnProps } from "antd/lib/table";
import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DenySvg from "assets/icons/CostLine/ic_deny.svg";
import { GoodServiceType } from "models/GoodServiceType";
import { GoodsServicesCategory } from "models/GoodsServicesCategory";
const CostItemGoodsServicesPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenModalPreview,
    handleCloseModalPreview,
    previewModel: model,
  } = useContext<CostItemGoodsServicesMasterContextModel>(
    CostItemGoodsServicesMasterContext
  );

  const { notifyToast } = appMessageService.useCRUDMessage();

  const copyToClipboard = () => {
    const textToCopy = model?.costLineCode;
    if (isEmpty(textToCopy)) return;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        notifyToast({
          message: translate("CL.copied_to_clipboard_message"),
        });
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  const contentColumns: ColumnProps<CostItem>[] = useMemo(
    () => [
      {
        title: translate("costItemGoodsServices.goodsServices.code"),
        key: "code",
        dataIndex: "code",
        sorter: false,
        render(...params: [string, CostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("costItemGoodsServices.goodsServices.name"),
        key: "name",
        dataIndex: "name",
        sorter: false,
        render(...params: [string, CostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText value={params[0]} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: translate(
          "costItemGoodsServices.goodsServices.goodsServicesCategory"
        ),
        key: "goodsServicesCategory",
        dataIndex: "goodsServicesCategory",
        sorter: false,
        render(...params: [GoodsServicesCategory, CostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  params[0]?.id
                    ? `${params[0]?.code} - ${params[0]?.name}`
                    : null
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("costItemGoodsServices.goodsServices.goodServiceType"),
        key: "goodServiceType",
        dataIndex: "goodServiceType",
        sorter: false,
        render(...params: [GoodServiceType, CostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  params[0]?.id
                    ? `${params[0]?.code} - ${params[0]?.name}`
                    : null
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("costItemGoodsServices.goodsServices.isActive"),
        key: "isActive",
        dataIndex: "isActive",
        sorter: false,
        width: "200px",
        render(...params: [boolean, CostItem, number]) {
          return (
            <LayoutCell position="center">
              <img
                src={params[0] ? ActiveSvg : DenySvg}
                alt=""
                width={20}
                height={20}
              />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  return (
    <>
      <Modal
        open={isOpenModalPreview}
        title={translate("costItemGoodsServices.preview")}
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={handleCloseModalPreview}
        onCancel={handleCloseModalPreview}
        isShowIconBack={false}
        isShowButtonApply={false}
      >
        <div className="cost-item-view-body">
          <span className="cost-item__name">{model?.costItemName}</span>
          <div className="cost-item__code" onClick={copyToClipboard}>
            <span className="cost-item__code-value">{model?.costItemCode}</span>
            <div className="cost-item__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="business-branch__item">
            <span className="business-branch__item-label">
              {translate("costItemGoodsServices.goodsServicesTab")}
            </span>
            <StandardTable
              rowKey="id"
              isDragable
              columns={contentColumns}
              dataSource={model?.goodServices}
              scroll={{ y: "calc(100vh - 200px)" }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CostItemGoodsServicesPreview;
