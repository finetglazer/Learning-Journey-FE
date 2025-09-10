import { Add } from "@carbon/icons-react";
import classNames from "classnames";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import { useContext } from "react";
import { Button, StandardTable } from "react-components-design-system";
import {
  AppendixTermModalState,
  DrawerAppendixContext,
  DrawerAppendixContextType,
} from "../../DrawerAppendixHook";
import AppendixTermModal from "../AppendixTermModal/AppendixTermModal";

const AppendixTerm = () => {
  const [translate] = useTranslationContract();
  const { model, termColumns, setAppendixTermModal, appendixTermModal } =
    useContext<DrawerAppendixContextType>(DrawerAppendixContext);

  const isShowModal = appendixTermModal !== AppendixTermModalState.HIDE;

  return (
    <div className={classNames("appendix_term_wrapper")}>
      <Button
        icon={<Add />}
        iconPlace="left"
        type="secondary"
        onClick={() => setAppendixTermModal(AppendixTermModalState.ADD)}
      >
        {translate("CT.add_contract_terms")}
      </Button>
      <StandardTable
        rowKey="id"
        isDragable
        columns={termColumns}
        dataSource={model?.appendixTerms}
        scroll={{ y: "calc(100vh - 430px)" }}
      />
      {isShowModal && <AppendixTermModal />}
    </div>
  );
};

export default AppendixTerm;
