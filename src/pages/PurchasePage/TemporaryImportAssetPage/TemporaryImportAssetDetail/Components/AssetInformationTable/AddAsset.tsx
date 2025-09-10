import { t } from "i18next";

import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { EmptyAssetIcon, AddIconRed } from "assets/icons";
import { Button } from "react-components-design-system";

interface AddAssetProps {
  onAddAsset: () => void;
  isButton?: boolean;
  className?: string;
  disabled?: boolean;
}

const AddAsset = ({
  onAddAsset,
  isButton = false,
  className,
  disabled = false,
}: AddAssetProps) => {
  return (
    <div className={`add-asset-wrapper ${className}`}>
      {isButton ? (
        <Button
          icon={<img src={AddIconRed} alt="img" width={14} height={14} />}
          iconPlace="left"
          type="secondary"
          onClick={onAddAsset}
          disabled={disabled}
        >
          {t("TIA.txt_add_asset")}
        </Button>
      ) : (
        <EmptyInitializeTable
          textButton={t("TIA.txt_add_asset")}
          content={
            <div
              className="invoice-width_content_document_empty"
              dangerouslySetInnerHTML={{
                __html: t(
                  "TIA.payment_advance_payment_application_content_empty"
                ),
              }}
            />
          }
          icon={<img src={EmptyAssetIcon} alt="" />}
          onHandleClickAdd={onAddAsset}
          buttonIcon={<img src={AddIconRed} alt="img" width={14} height={14} />}
          disableButton={disabled}
        />
      )}
    </div>
  );
};

export default AddAsset;
