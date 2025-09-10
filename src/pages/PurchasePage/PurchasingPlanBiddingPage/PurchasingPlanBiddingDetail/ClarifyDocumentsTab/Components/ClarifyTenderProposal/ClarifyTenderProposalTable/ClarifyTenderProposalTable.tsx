import React, { useCallback, useContext, useState } from "react";
import { ColumnProps } from "antd/lib/table";
import { isEmpty, size } from "lodash";

import { AddIcon, emptyCloudIcon } from "assets/icons";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import {
  Button,
  LayoutCell,
  OneLineText,
  OverflowMenu,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { ListOverflowMenu } from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/BudgetMasterTabTable";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import {
  renderResponseStatusTag,
  useResponseStatuses,
} from "../../useResponseStatuses";
import ClarificationDetailDrawer from "../../ClarificationDetailDrawer/ClarificationDetailDrawer";
import { useAppSelector } from "rtk/useRedux";
import { Profile } from "models/Profile";
import useClarificationViewDrawer from "../ClarificationViewDrawer/useClarificationViewDrawer";
import { PurchasingPlanBiddingDetailHookContext } from "../../../../PurchasingPlanBiddingDetailHook";
import {
  ClarificationRecord,
  ClarificationType,
  listCriteriaType,
} from "models/PurchasingPlan/PurchasingPlan";
import { RespondStatus } from "models/PurchasingPlan";
import { PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS } from "config/const";

const ClarifyTenderProposalTable = () => {
  const [translate] = useTranslation();
  const responseStatuses = useResponseStatuses();
  // Sử dụng context
  const context = useContext(PurchasingPlanBiddingDetailHookContext);
  const { model, handleChangeSingleField } = context;
  // Lấy dữ liệu từ model trong context
  const clarifications = context?.model?.clarifications || [];
  const data = clarifications
    ?.filter(
      (item: ClarificationRecord) =>
        item?.type === ClarificationType.BidSubmission
    )
    ?.map((item: ClarificationRecord) => {
      return {
        ...item,
        isResponded: item?.status === RespondStatus.Responded,
      };
    })
    ?.sort((a: any, b: any) => {
      return (
        new Date(b?.createdDate).getTime() - new Date(a?.createdDate).getTime()
      );
    });

  /**
   * Kiểm tra xem có cho phép tạo mới làm rõ hồ sơ dự thầu không
   * @param status Trạng thái hiện tại của kế hoạch mua sắm
   * @returns true nếu cho phép tạo mới làm rõ hồ sơ dự thầu, false nếu không
   */
  const canCreateClarificationRequest = (status: number) => {
    // Cho phép tạo mới làm rõ hồ sơ dự thầu nếu trạng thái là "Mở hồ sơ", "Chấm thầu", hoặc "Đàm phán"
    return (
      status === PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.OPEN_PROFILE ||
      status === PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.BIDDING ||
      status === PURCHASING_PLAN_COMPETITIVE_OFFER_STATUS.NEGOTIATE
    );
  };

  // Cột cho bảng - cập nhật theo UI mới
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
        // Cột mới: CBNV MSB yêu cầu
        title: translate("PL.txt_msb_staff_requestor"),
        key: "createUser",
        dataIndex: "createUser",
        ellipsis: true,
        width: 200,
        render: (createUser) => {
          return (
            <LayoutCell>
              {isEmpty(createUser) ? "---" : <OneLineText value={createUser} />}{" "}
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
        // Cột đổi tên: Nhà cung cấp phản hồi
        title: translate("PL.txt_supplier_responder"),
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
          ];

          return (
            <LayoutCell>
              <OverflowMenu list={items} />
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  // Hàm xử lý khi người dùng nhấn vào action "Xem"
  const handleViewClarification = async (id: string) => {
    // Mở drawer xem chi tiết
    const res = await context?.handleGetClarificationDetail?.(id);

    // Mở drawer với chế độ phản hồi
    openClarificationDrawer(res?.data);
  };

  // State để quản lý drawer
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [currentClarification, setCurrentClarification] = useState<
    ClarificationRecord | undefined
  >(undefined);

  // Hàm đóng drawer
  const handleCloseDrawer = useCallback(() => {
    setIsDrawerVisible(false);
    setCurrentClarification(undefined);
  }, []);

  // Hàm xử lý khi lưu dữ liệu từ drawer
  const handleSaveClarification = useCallback(
    (data: ClarificationRecord) => {
      // Cập nhật dữ liệu vào model thông qua context
      if (model?.clarifications && handleChangeSingleField) {
        // Tạo một bản sao của danh sách hiện tại
        const updatedList = [...model.clarifications];

        // Tìm vị trí của record cần cập nhật
        const index = updatedList.findIndex((item) => item.id === data.id);

        if (index !== -1) {
          // Cập nhật record nếu đã tồn tại
          updatedList[index] = { ...updatedList[index], ...data };
        } else {
          // Thêm mới nếu chưa tồn tại
          updatedList.push(data as any);
        }

        // Cập nhật danh sách vào model
        handleChangeSingleField({ fieldName: "clarifications" })(updatedList);
      }

      handleCloseDrawer();
    },
    [model?.clarificationProposals, handleChangeSingleField, handleCloseDrawer]
  );

  const profile: Profile = useAppSelector((state) => state.profile);

  const currentUser = {
    name: profile?.account?.name,
    id: profile?.account?.id,
  };

  const onAddClarification = () => {
    setIsDrawerVisible(true);
  };

  const { openClarificationDrawer, ClarificationDrawerComponent } =
    useClarificationViewDrawer();

  return (
    <div>
      {size(data) > 0 &&
        canCreateClarificationRequest(context?.model?.status) && (
          <div className="p-b--xs">
            <Button
              icon={<img src={AddIcon} alt="img" width={14} height={14} />}
              iconPlace="left"
              type="secondary"
              onClick={onAddClarification}
            >
              {translate("PL.add_clarification_request")}
            </Button>
          </div>
        )}

      {!(size(data) > 0) ? (
        !canCreateClarificationRequest(context?.model?.status) ? (
          <EmptyItemTable
            icon={<img src={emptyCloudIcon} alt="" />}
            content={translate("PL.txt_no_data_recorded")}
          />
        ) : (
          <EmptyInitializeTable
            textButton={translate("PL.add_clarification_request")}
            content={
              <div className="text-break-line">
                {translate("PL.txt_no_data_recorded")}
              </div>
            }
            icon={<img src={emptyCloudIcon} alt="" />}
            onHandleClickAdd={onAddClarification}
          />
        )
      ) : (
        <StandardTable
          isDragable={true}
          loading={false}
          rowKey={"id"}
          idContainer={"clarificationDocuments_2"}
          columns={columns}
          dataSource={data}
          scroll={{ y: "calc(100vh - 320px)" }}
        />
      )}
      {/* Drawer Chi tiết làm rõ hồ sơ */}
      <ClarificationDetailDrawer
        visible={isDrawerVisible}
        onClose={handleCloseDrawer}
        currentItem={currentClarification}
        onSave={handleSaveClarification}
        suppliersData={model?.supplierPurchasePlans || []}
        currentUser={currentUser}
      />
      <ClarificationDrawerComponent />
    </div>
  );
};

export default ClarifyTenderProposalTable;
