import { TopicType } from "core/models/History";
import { useEffect, useRef, useState } from "react";
import { ModelFilter } from "react-3layer-common";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { useAppSelector } from "rtk/useRedux";
import { map, Observable } from "rxjs";
import Comment from "./Comment";
import { FileAttachments, Message } from "./Comment.model";
import { commentRepository } from "./CommentRepository";

interface Params {
  id: string;
}

interface ICommentProps {
  topicType?: TopicType;
  topicId?: string;
  isNewLayoutVersion?: boolean;
}

const Template = ({
  topicType,
  topicId,
  isNewLayoutVersion,
}: ICommentProps) => {
  const profile = useAppSelector((state) => state.profile);
  const { id } = useParams<Params>();
  const idTag = useRef<string[]>([]);
  const [filterComment, setFilterComment] = useState<ModelFilter>();
  const [uploadedFile, setUploadedFile] = useState<FileAttachments[] | null>(
    null
  );
  const [translate] = useTranslation();
  const countObservable = new Observable<number>((observer) => {
    setTimeout(() => {
      observer.next(50);
      observer.complete();
    }, 1000);
  });

  useEffect(() => {
    setFilterComment({
      topicId: topicId || id,
      topicType: topicType,
    });
  }, [id, topicId, topicType]);

  const countComment = () => {
    return countObservable;
  };

  const attachFile = (files: File[]): Observable<FileAttachments[]> => {
    return commentRepository.importFile(files).pipe(
      map((fileModels: FileAttachments[]) => {
        setUploadedFile(fileModels);
        return fileModels;
      })
    );
  };

  const postComment = (message: Message): Observable<Message> => {
    if (uploadedFile) {
      return commentRepository
        .createComment({
          ...message,
          topicId: filterComment?.topicId,
          topicType: filterComment?.topicType,
          commentAttachments: [uploadedFile],
        })
        .pipe(
          map((res) => {
            setUploadedFile(null);
            return res;
          })
        );
    } else {
      return commentRepository.createComment({
        ...message,
        topicId: filterComment?.topicId,
        topicType: filterComment?.topicType,
        content: message.content.trim(),
      });
    }
  };

  const handleUpdateIdTag = (id: string[]) => {
    idTag.current = id;
  };

  return (
    <div>
      {filterComment && (
        <Comment
          attachFile={attachFile}
          canSend
          countMessages={countComment}
          getMessages={commentRepository.listComment}
          placeholder={translate("CM.txt_input_comment")}
          postMessage={postComment}
          suggestList={commentRepository.listMasterUser}
          userInfo={{
            avatar: "",
            name: `${profile?.account?.name}`,
            id: `${profile?.account?.id}`,
            email: `${profile?.account?.email}`,
          }}
          renderName={(t) => `${t?.email} - ${t?.name}`}
          isShowHeader={true}
          defaultFilter={filterComment}
          onGetIdTags={handleUpdateIdTag}
          isNewLayoutVersion={isNewLayoutVersion}
        />
      )}
    </div>
  );
};

export const Comments = Template.bind({});
