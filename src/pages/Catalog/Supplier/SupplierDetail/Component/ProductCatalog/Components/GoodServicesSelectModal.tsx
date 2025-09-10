import useDebounceFn from "ahooks/lib/useDebounceFn";
import { Tree } from "antd";
import type { AntTreeNodeProps, BasicDataNode } from "antd/es/tree";
import { IcArrowDown, IcSearchSVG } from "assets/icons";
import { AxiosError } from "axios";
import classNames from "classnames";
import { DEBOUNCE_TIME_300, MODAL_WIDTH_600 } from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { GoodsServicesCategory } from "models/GoodsServicesCategory";
import { useEffect, useRef, useState } from "react";
import { InputText, Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import styles from "../ProductCatalog.module.scss";
import supplierRepository from "pages/Catalog/Supplier/SupplierRepository";

interface GoodServicesSelectModalProps {
  selected: string[] | undefined;
  onClose: () => void;
  onSelect: (selected: GoodsServicesCategory[]) => void;
}
function GoodServicesSelectModal({
  selected,
  onClose,
  onSelect,
}: GoodServicesSelectModalProps) {
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();
  const [treeData, setTreeData] = useState<GoodsServicesCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const goodServicesSelected = useRef<GoodsServicesCategory[]>([]);
  const handleGetGoodServices = async (search?: string) => {
    setIsLoading(true);
    supplierRepository
      .getDropdownGoodsServicesCategory({ search })
      .pipe(
        finalize(() => {
          setIsLoading(false);
        })
      )
      .subscribe({
        next: (data: GoodsServicesCategory[]) => {
          setTreeData(data);
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.messages,
            type: "error",
          });
        },
      });
  };

  const { run } = useDebounceFn(
    (search: string) => {
      handleGetGoodServices(search);
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  const handleSave = () => {
    onSelect(goodServicesSelected.current);
  };

  useEffect(() => {
    handleGetGoodServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal
        title={translate("SL.modal_category")}
        size={MODAL_WIDTH_600}
        handleSave={handleSave}
        handleCancel={onClose}
        titleButtonCancel={translate("SL.btn_cancel")}
        titleButtonApply={translate("SL.btn_chose")}
        className={styles["good-services"]}
        disableButtonApply={isLoading}
        disableButtonCancel={isLoading}
        isShowIconBack={false}
        closeIcon={false}
        open
      >
        <InputText
          prefix={<img src={IcSearchSVG} alt="" width={16} />}
          placeHolder={translate("SL.txt_search_category")}
          label={translate("CM.btn_search")}
          onChange={run}
          isSmall={false}
        />
        <div className={styles["tree-container"]}>
          {!isLoading && (
            <Tree
              checkable
              switcherIcon={({ expanded }: AntTreeNodeProps) => (
                <img
                  src={IcArrowDown}
                  alt=""
                  className={classNames({
                    [styles["icon-expanded"]]: !expanded,
                  })}
                />
              )}
              onCheck={(_, e) => {
                goodServicesSelected.current = e?.checkedNodes;
              }}
              defaultCheckedKeys={selected}
              className={styles["tree"]}
              fieldNames={{
                title: "name",
                key: "id",
              }}
              treeData={treeData as BasicDataNode[]}
              defaultExpandAll
            />
          )}
        </div>
      </Modal>
    </>
  );
}

export default GoodServicesSelectModal;
