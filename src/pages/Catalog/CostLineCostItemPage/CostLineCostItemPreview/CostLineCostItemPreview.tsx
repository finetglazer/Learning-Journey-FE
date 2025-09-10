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

import "./CostLineCostItemPreview.scss";
import {
  CostLineCostItemMasterContext,
  CostLineCostItemMasterContextModel,
} from "../CostLineCostItemMaster/CostLineCostItemMasterHook";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { isEmpty } from "lodash";
import appMessageService from "core/services/common-services/app-message-service";
import { CostType } from "models/Proposal";
import { CostItem } from "models/CostItem";
import { ColumnProps } from "antd/lib/table";

const CostLineCostItemPreview = () => {
  const [translate] = useTranslation();

  const {
    isOpenModalPreview,
    handleCloseModalPreview,
    previewModel: model,
  } = useContext<CostLineCostItemMasterContextModel>(
    CostLineCostItemMasterContext
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
        title: translate("costLineCostItems.costItems.code"),
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
        title: translate("costLineCostItems.costItems.name"),
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
        title: translate("costLineCostItems.costItems.costType"),
        key: "costType",
        dataIndex: "costType",
        sorter: false,
        width: "200px",
        render(...params: [CostType, CostItem, number]) {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  params[0]?.id ? `${params[0]?.code}-${params[0]?.name}` : null
                }
                useTooltip
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
        title={translate("costLineCostItems.preview")}
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
          <span className="cost-item__name">{model?.costLineName}</span>
          <div className="cost-item__code" onClick={copyToClipboard}>
            <span className="cost-item__code-value">{model?.costLineCode}</span>
            <div className="cost-item__code-icon">
              <img src={CopySvg} alt="CopySvg" />
            </div>
          </div>

          <div className="business-branch__item">
            <span className="business-branch__item-label">
              {translate("costItems.costType")}
            </span>
            <StandardTable
              rowKey="id"
              isDragable
              columns={contentColumns}
              dataSource={model?.costItems}
              scroll={{ y: "calc(100vh - 200px)" }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CostLineCostItemPreview;
