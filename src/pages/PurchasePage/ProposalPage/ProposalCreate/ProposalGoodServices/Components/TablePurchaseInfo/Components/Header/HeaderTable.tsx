/* eslint-disable @typescript-eslint/no-explicit-any */
import { Download } from "@carbon/icons-react";
import { IcArrowsCounterClockwise, Import } from "assets/icons";
import add from "assets/icons/add.svg";
import { LoadingCM } from "components";
import { InventoryCheckingContentfilter } from "pages/PurchasePage/ProposalPage/ProposalDetail/Components/InventoryCheckingModal/InventoryCheckingModalHook";
import React, { useRef } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";

type Props = {
  isShow?: boolean;
  isLoading?: boolean;
  onClickAdd?: () => void;
  onClickUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelUploadFile?: () => void;
  onClickDownloadTemplate?: () => void;
  handleLoadListContent?: (
    goodService?: any,
    filterParam?: InventoryCheckingContentfilter
  ) => void;
};

const HeaderTable = ({
  isShow = true,
  onClickAdd,
  onClickUpload,
  onClickDownloadTemplate,
  isLoading = false,
  handleLoadListContent,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [translate] = useTranslation();

  const onImportFile = () => {
    fileInputRef.current?.click();
  };

  if (!isShow) return null;

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 gap-3">
      {isLoading && <LoadingCM />}
      <div className="d-flex gap-x--xs">
        <Button
          type={"secondary"}
          icon={<img src={add} alt="" width={12} height={12} />}
          iconPlace={"left"}
          onClick={onClickAdd}
        >
          {translate("PP.label_add_goods")}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={onClickUpload}
          accept=".xls,.xlsx"
        />
        <Button
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
          onClick={onClickDownloadTemplate}
        >
          {translate("BG.download_template_file")}
        </Button>
      </div>
      <div className="d-flex">
        <Button
          type={"text"}
          icon={
            <img src={IcArrowsCounterClockwise} alt="" width={16} height={16} />
          }
          iconPlace={"left"}
          onClick={(e) => {
            e.stopPropagation();
            handleLoadListContent(null, new InventoryCheckingContentfilter());
          }}
        >
          {translate("PP.txt_btn_check_asset")}
        </Button>
      </div>
    </div>
  );
};

export default HeaderTable;
