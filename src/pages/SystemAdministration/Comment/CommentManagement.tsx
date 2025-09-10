import { TrashRoundIcon } from "assets/icons";
import { PageHeader } from "components";
import { isNil } from "lodash";
import { ModalConfirm } from "react-components-design-system";
import "./CommentManagement.scss";
import {
  CommentManagementContext,
  useCommentManagementHook,
} from "./CommentManagementHook";
import { CommentManagementContent } from "./Components/CommentManagementContent";

export const CommentManagement = () => {
  const {
    translate,
    breadcrumbs,
    loadingModal,
    deleteComment,
    processDeleteComment,
    ...contextValue
  } = useCommentManagementHook();

  return (
    <CommentManagementContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CM.menu_title_comment_management")}
          breadcrumbs={breadcrumbs}
          hasTabs={false}
        />
        <div className="comment-content__master">
          <CommentManagementContent />
        </div>
      </div>
      {/* Confirm delete modal */}
      {isNil(deleteComment) ? null : (
        <ModalConfirm
          open
          loading={loadingModal}
          title={translate("RM.title_delete_comment")}
          content={translate("RM.message_delete_comment")}
          icon={<img src={TrashRoundIcon} alt="" />}
          titleButtonApply={translate("CM.txt_delete")}
          titleButtonCancel={translate("CM.btn_cancel")}
          handleSave={processDeleteComment}
          handleCancel={() => contextValue.handleDeleteComment(undefined)}
        />
      )}
    </CommentManagementContext.Provider>
  );
};
