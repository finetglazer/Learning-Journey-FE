import React, { useContext } from "react";
import { ColumnProps } from "antd/lib/table";
import { isEmpty, size } from "lodash";

import { emptyCloudIcon } from "assets/icons";
import {
  LayoutCell,
  OneLineText,
  OverflowMenu,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import {
  renderResponseStatusTag,
  useResponseStatuses,
} from "../../../useResponseStatuses";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import useClarificationViewDrawer from "../../ClarificationViewDrawer/useClarificationViewDrawer";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import {
  ClarificationRecord,
  ClarificationType,
  listCriteriaType,
  RespondStatus,
} from "models/PurchasingPlan";
import { PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS } from "config/const";

const ClarificationDocumentsTable = () => {
  const [translate] = useTranslation();
  const responseStatuses = useResponseStatuses();
  const context = useContext(PurchasingPlanBiddingDetailHookContext);
  // Lấy dữ liệu từ model trong context
  const clarifications = context?.model?.clarifications || [];

  const data = clarifications
    ?.filter(
      (item: ClarificationRecord) =>
        item?.type === ClarificationType.BiddingDocument
    )
    ?.map((item: ClarificationRecord) => {
      return {
        ...item,
        isResponded: item?.canResponse,
      };
    })
    ?.sort((a: any, b: any) => {
      return (
        new Date(b?.createdDate).getTime() - new Date(a?.createdDate).getTime()
      );
    });
  // Sử dụng hook và context để tương tác với dữ liệu
  const { openClarificationDrawer, ClarificationDrawerComponent } =
    useClarificationViewDrawer();

  /**
   * Kiểm tra xem có cho phép phản hồi hồ sơ mời thầu không
   * @param status Trạng thái hiện tại của kế hoạch mua sắm
   * @returns true nếu cho phép phản hồi hồ sơ mời thầu, false nếu không
   */
  const canRespondToBidInvitation = (status: number) => {
    // Cho phép phản hồi hồ sơ mời thầu nếu trạng thái là "Chờ duyệt" hoặc "Đã duyệt"
    return (
      status === PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.WAITING_FOR_APPROVE ||
      status === PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.APPROVED
    );
  };

  // Cột cho bảng
  const columns: ColumnProps<ClarificationRecord>[] = React.useMemo(
    () => [
      {
        title: translate("PL.txt_index"),
        key: "index",
        width: 50,
        render: (_, __, index) => {
          return (
            <LayoutCell>
              <OneLineText value={(index + 1).toString()} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_classification"),
        key: "classification",
        dataIndex: "classification",
        ellipsis: true,
        width: 100,
        render: (type) => {
          const criteriaType = listCriteriaType?.find(
            (item) => item.id === type
          );
          const name = criteriaType?.name;
          return (
            <LayoutCell>
              <OneLineText value={translate(name) || ""} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_requesting_supplier"),
        key: "supplier",
        dataIndex: "supplier",
        ellipsis: true,
        width: 200,
        render: (supplier) => {
          return (
            <LayoutCell>
              <OneLineText value={supplier?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_clarification_sent_date"),
        key: "createdDate",
        dataIndex: "createdDate",
        ellipsis: true,
        width: 120,
        render: (createdDate) => {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(createdDate, STANDARD_DATE_FORMAT_SLASH)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_clarification_title"),
        key: "title",
        dataIndex: "title",
        ellipsis: true,
        width: 290,
        render: (title) => {
          return (
            <LayoutCell>
              <OneLineText value={title} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_response_date"),
        key: "responseDate",
        dataIndex: "responseDate",
        ellipsis: true,
        width: 120,
        render: (responseDate) => {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDate(responseDate, STANDARD_DATE_FORMAT_SLASH)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_msb_staff_responder"),
        key: "createUser",
        dataIndex: "createUser",
        ellipsis: true,
        width: 200,
        render: (createUser) => {
          return (
            <LayoutCell>
              {isEmpty(createUser) ? "---" : <OneLineText value={createUser} />}
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.txt_response_status"),
        key: "status",
        dataIndex: "status",
        ellipsis: true,
        width: 150,
        render: (value: RespondStatus) => {
          return (
            <LayoutCell>
              {renderResponseStatusTag({
                responseStatuses,
                status: value,
              })}
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        width: 40,
        fixed: "right",
        render(_, record: ClarificationRecord) {
          const items: ListOverflowMenu[] = [
            {
              title: translate("CM.txt_view"),
              action: () => handleViewClarification(record?.id),
              isShow: true,
            },
            {
              title: translate("OC.feedback"),
              action: () => handleFeedbackClarification(record?.id, "RESPOND"),
              isShow: record?.canResponse, // Chỉ cho phép sửa khi chưa phản hồi và có quyền
            },
          ];

          return (
            <LayoutCell>
              <OverflowMenu list={items} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate, data, context?.model?.status]
  );

  // Hàm xử lý khi người dùng nhấn vào action "Xem"
  const handleViewClarification = async (id: string) => {
    const res = await context?.handleGetClarificationDetail?.(id);

    // Mở drawer với chế độ phản hồi
    openClarificationDrawer(res?.data);
  };

  // Hàm xử lý khi người dùng nhấn vào action "phản hồi"
  const handleFeedbackClarification = async (
    id: string,
    action: "RESPOND" | undefined
  ) => {
    // Tìm item từ dữ liệu dựa vào ID
    const res = await context?.handleGetClarificationDetail?.(id);

    // Mở drawer với chế độ phản hồi
    openClarificationDrawer(res?.data, action);
  };

  return (
    <div>
      {!(size(data) > 0) ? (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate("PL.txt_no_data_recorded")}
        />
      ) : (
        <StandardTable
          isDragable={true}
          loading={false}
          rowKey={"id"}
          idContainer={`clarificationDocuments_table`}
          columns={columns}
          dataSource={data}
          scroll={{ y: "calc(100vh - 320px)" }}
        />
      )}
      <ClarificationDrawerComponent />
    </div>
  );
};

export default ClarificationDocumentsTable;
