import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { EditorCM } from "components";
import { ProposalCreateModel } from "models/Proposal";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { useContext, useEffect, useState } from "react";
import { getBase65ByPath } from "./helper";

type Props = {
  fieldName: string;
  title: string;
};

const FormEditTextItem = ({ fieldName, title }: Props) => {
  const [collapse, setCollapse] = useState<boolean>(true);
  const [dataEditor, setDataEditor] = useState<string>("");

  const { model, handleChangeSingleField } = useContext<ProposalCreateModel>(
    ProposalCreateHookContext
  );

  const handleChange = (content: string) => {
    handleChangeSingleField({
      fieldName,
    })(content);
  };

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  useEffect(() => {
    const container = document.querySelector(".form-edit_wrapper-detail");
    if (container) {
      const links = container.querySelectorAll("a");
      links.forEach((link) => {
        link.addEventListener("click", (event) => {
          const href = (event.target as HTMLAnchorElement).getAttribute("href");
          if (href && !isValidUrl(href)) {
            event.preventDefault();
          }
        });
      });
    }
  }, [model, fieldName, collapse]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (model?.isDetail) {
      updateDataEditor(model[fieldName]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldName, model]);

  const updateDataEditor = async (data: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    const imgTags = doc.querySelectorAll("img[src^='eprocurement/']");
    const newListPath = await Promise.all(
      Array.from(imgTags).map(async (img) => {
        const path = img.getAttribute("src");
        if (path) {
          const base64 = await getBase65ByPath(path);
          return { path, base64 };
        }
        return null;
      })
    );

    let newContent = data;
    newListPath.forEach((item) => {
      const base64 = item.base64;
      const path = item.path;
      newContent = newContent.replace(path, base64);
    });
    setDataEditor(newContent);
  };

  return (
    <div className="form-edit_wrapper">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{title}</div>
        <div>
          <img
            className={classNames("cursor-pointer", {
              "rotate-180": !collapse,
              "rotate-0": collapse,
            })}
            src={IcArrowDown}
            alt="img"
            width={12}
            height={12}
          />
        </div>
      </div>
      <div
        className={classNames("form-edit_wrapper-detail", { hidden: collapse })}
      >
        {model.isDetail ? (
          <div
            className="m-t--xs"
            dangerouslySetInnerHTML={{ __html: dataEditor }}
          />
        ) : (
          <div className="body-form-edit_wrapper">
            <EditorCM
              data={model[fieldName]}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleChange(data);
              }}
              isConvertFile
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormEditTextItem;
