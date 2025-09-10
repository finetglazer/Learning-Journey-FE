import { emptyCloudIcon, emptyIcon } from "assets/icons";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { useTranslation } from "react-i18next";
import "./EmptyDocuments.scss";

interface EmptyDocumentsProperties {
  isNewVersion?: boolean;
}

const EmptyDocuments = ({ isNewVersion }: EmptyDocumentsProperties) => {
  const [translate] = useTranslation();

  if (isNewVersion) {
    return (
      <EmptyItemTable
        icon={<img src={emptyCloudIcon} width={140} height={140} alt="" />}
        content={translate("CM.empty.no_data_recorded")}
      />
    );
  }

  return (
    <div className="w-full empty_documents-height d-flex justify-content-center align-items-center flex-row gap-4">
      <img src={emptyIcon} width={140} alt="" />
      <div className="empty_documents-text">
        {translate("PL.purchase_no_document")}
      </div>
    </div>
  );
};

export default EmptyDocuments;
