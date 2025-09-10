import { Download } from "@carbon/icons-react";
import { EmptyProposalGood, Import } from "assets/icons";
import add from "assets/icons/add.svg";
import { useRef } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./Empty.scss";
import ProgressBar from "pages/BudgetPage/BudgetCreate/Components/ProgressBar/ProgressBar";

type Props = {
  openAdd?: () => void;
  onCancelUploadFile?: () => void;
  isDetail?: boolean;
  isLoading?: boolean;
  onUploadFile?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  enableUpload?: boolean;
  onDownloadTemplate?: () => void;
};

export const EmptyData = ({
  openAdd,
  isDetail,
  isLoading,
  onCancelUploadFile,
  onUploadFile,
  enableUpload = false,
  onDownloadTemplate,
}: Props) => {
  const [translate] = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onImportFile = () => {
    fileInputRef.current?.click();
  };

  if (isDetail) return null;

  return (
    <div className="Proposal-good-services-empty-wrapper">
      {isLoading ? (
        <ProgressBar onClickCancel={onCancelUploadFile} />
      ) : (
        <>
          <EmptyProposalGood />
          <div className="body">
            <span className="content">
              {translate("PP.text_empty_please")}{" "}
              <span className="content__import">
                {translate("PP.text_empty_add_goods")}
              </span>{" "}
              <br />
              {translate("PP.text_empty_or")}{" "}
              <span className="content__import">
                {translate("PP.text_empty_upload_list_goods")}
              </span>{" "}
              <br />
              {translate("PP.text_folow_template")}
            </span>
            <div className="content__button">
              <Button
                type={"secondary"}
                icon={<img src={add} alt="" width={12} height={12} />}
                iconPlace={"left"}
                onClick={openAdd}
              >
                {translate("PP.label_add_goods")}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onUploadFile}
                accept=".xls,.xlsx"
              />
              <Button
                disabled={!enableUpload}
                icon={<Import />}
                iconPlace="left"
                type="secondary"
                onClick={onImportFile}
              >
                {translate("PP.text_empty_upload_list_goods")}
              </Button>
              <Button
                type="tertiary"
                icon={<Download />}
                iconPlace="left"
                onClick={onDownloadTemplate}
              >
                {translate("BG.download_template_file")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
