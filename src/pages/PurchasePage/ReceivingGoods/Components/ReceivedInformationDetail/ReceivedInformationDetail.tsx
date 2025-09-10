import classNames from "classnames";
import CollapseView from "components/Collapse/CollapseView";
import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";
import { isEqual } from "lodash";
import { ContractInformation } from "pages/PurchasePage/ReceivingGoods/Components/ReceivedInformationDetail/Components/ContractInformation/ContractInformation";
import ReceivedGoodDetail from "pages/PurchasePage/ReceivingGoods/Components/ReceivedInformationDetail/Components/ReceivedGoodDetail/ReceivedGoodDetail";
import { ReceiverInformation } from "pages/PurchasePage/ReceivingGoods/Components/ReceivedInformationDetail/Components/ReceiverInformation/ReceiverInformation";
import { SellerInformation } from "pages/PurchasePage/ReceivingGoods/Components/ReceivedInformationDetail/Components/SellerInformation/SellerInformation";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useReceivingGoodsDetailContext } from "../../ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { Attachments } from "./Components/Attachments/Attachments";
import { DetailsReceiptInformation } from "./Components/DetailsReceiptInformation/DetailsReceiptInformation";
import styles from "./ReceivedInformationDetail.module.scss";
import { AdvancedCollapseView } from "components";

enum KeyTab {
  CONTRACT = "contract",
  SELLER = "seller",
  RECEIVER = "receiver",
  DETAILS_RECEIPT = "details_receipt",
  ATTACHMENT = "attachment",
  COMMENTS = "comments",
}

const ReceivedInformationDetail = () => {
  const { model, state } = useReceivingGoodsDetailContext();
  const [translate] = useTranslation();

  const contactItems = useMemo(
    () => [
      {
        key: KeyTab.CONTRACT,
        label: translate("RG.txt_contract_po_info"),
        children: <ContractInformation />,
      },
    ],
    [translate]
  );

  const receivedItem = useMemo(() => {
    return [
      {
        key: KeyTab.RECEIVER,
        label: translate("BG.general_information"),
        children: <ReceivedGoodDetail />,
      },
    ];
  }, [translate]);

  const sellerItems = useMemo(() => {
    let list = [
      {
        key: KeyTab.DETAILS_RECEIPT,
        label: translate("RG.txt_details_receipt_info"),
        children: <DetailsReceiptInformation />,
      },
    ];

    if (!isEqual(state, "VIEW")) {
      list = [
        {
          key: KeyTab.SELLER,
          label: translate("RG.txt_seller"),
          children: <SellerInformation />,
        },
        {
          key: KeyTab.RECEIVER,
          label: translate("RG.txt_receiver"),
          children: <ReceiverInformation />,
        },
        ...list,
        {
          key: KeyTab.ATTACHMENT,
          label: translate("RG.txt_attachment"),
          children: <Attachments />,
        },
      ];
    }

    return list;
  }, [state, translate]);

  return (
    <div
      className={classNames(styles["content-scroll"], {
        [styles["content-scroll-view"]]: isEqual(state, "VIEW"),
      })}
    >
      <>
        {isEqual(state, "VIEW") ? (
          <AdvancedCollapseView items={receivedItem} />
        ) : (
          <CollapseView
            items={contactItems}
            defaultActiveKey={Object.values(KeyTab)}
            isShowTopDivider={false}
          />
        )}
        {isEqual(state, "VIEW") ? (
          <AdvancedCollapseView items={sellerItems} />
        ) : (
          <CollapseView
            items={sellerItems}
            defaultActiveKey={Object.values(KeyTab)}
            isShowTopDivider={false}
          />
        )}

        {isEqual(state, "EDIT") || isEqual(state, "VIEW") ? (
          <div
            className={classNames({
              [styles["received-main"]]: isEqual(state, "VIEW"),
            })}
          >
            <div className={styles["content-comment"]}>
              <Comments
                topicType={TopicType.HistoryApproval}
                topicId={model?.id}
              />
            </div>
          </div>
        ) : null}
      </>
    </div>
  );
};

export default ReceivedInformationDetail;
