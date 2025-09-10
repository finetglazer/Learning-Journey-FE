import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  type EditorConfig,
  Autoformat,
  AutoImage,
  Autosave,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  EventInfo,
  Heading,
  ImageBlock,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  SimpleUploadAdapter,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  WordCount,
} from "ckeditor5";

// eslint-disable-next-line import/no-unresolved
import "ckeditor5/ckeditor5.css";
import classNames from "classnames";
import { utilService } from "core/services/common-services/util-service";
import { isEmpty, isNil } from "lodash";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import { getBase65ByPath } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGenerationInfoTab/Components/ProposedBasis/helper";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { FormItem } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./EditorCM.module.scss";

const LICENSE_KEY = "GPL";
type ErrorModel = {
  errors: {
    ckEditor: string | null | undefined;
  };
};
const initErrorModel: ErrorModel = {
  errors: {
    ckEditor: null,
  },
};

interface Props {
  data: string;
  onChange: (event: EventInfo, editor: any) => void;
  maxLength?: number;
  isRequired?: boolean;
  errorMess?: string;
  placeholder?: string;
  isCustomCss?: boolean;
  isConvertFile?: boolean;
}

const EditorCM: FC<Props> = ({
  data,
  onChange,
  maxLength,
  isRequired,
  errorMess,
  placeholder,
  isCustomCss,
  isConvertFile,
}) => {
  const [translate] = useTranslation();
  const editorRef = useRef(null);
  const wordCountRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [errors, setErrors] = useState(initErrorModel);
  const [dataEditor, setDataEditor] = useState<string | null>("");
  const countLoader = useRef(0);

  const listPath = useRef<
    {
      path: string;
      base64: string;
    }[]
  >([]);

  useEffect(() => {
    if (countLoader.current < 1 && data) {
      countLoader.current += 1;
      updateDataEditor(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  function MyCustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return {
        upload() {
          return loader.file.then(
            (file: Blob | File) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                if (isConvertFile) {
                  budgetRepository.uploadFile(file).subscribe({
                    next: (res) => {
                      resolve({
                        default: reader.result,
                      });
                      listPath.current.push({
                        path: res?.path,
                        base64: reader.result,
                      } as any);
                    },
                    error: (error) => {
                      reject(error);
                    },
                  });
                } else {
                  reader.onload = () => {
                    resolve({
                      default: reader?.result,
                    });
                  };
                }

                reader.onerror = (error) => {
                  reject(error);
                };
              })
          );
        },
      };
    };
  }

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      editorConfig: {
        extraPlugins: [MyCustomUploadAdapterPlugin],
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "|",
            "insertImage",
            "link",
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Autoformat,
          AutoImage,
          Autosave,
          BlockQuote,
          Bold,
          Essentials,
          Heading,
          ImageBlock,
          ImageInline,
          ImageInsert,
          ImageInsertViaUrl,
          ImageResize,
          ImageStyle,
          ImageTextAlternative,
          ImageToolbar,
          ImageUpload,
          Indent,
          IndentBlock,
          Italic,
          Link,
          LinkImage,
          List,
          ListProperties,
          MediaEmbed,
          Paragraph,
          PasteFromOffice,
          SimpleUploadAdapter,
          Table,
          TableCaption,
          TableCellProperties,
          TableColumnResize,
          TableProperties,
          TableToolbar,
          TextTransformation,
          TodoList,
          Underline,
          WordCount,
        ],
        htmlSupport: {
          allow: [
            {
              name: /^.*$/,
              styles: true,
              attributes: true,
              classes: true,
            },
          ],
        },
        image: {
          toolbar: [
            "imageTextAlternative",
            "|",
            "imageStyle:inline",
            "imageStyle:wrapText",
            "imageStyle:breakText",
            "|",
            "resizeImage",
          ],
        },
        wordCount: {
          onUpdate: (stats: { characters: number }) => {
            if (isNil(maxLength)) {
              return;
            }
            if (stats?.characters > maxLength) {
              setErrors((prevState) => ({
                ...prevState,
                errors: {
                  ckEditor: translate("CM.max_message", {
                    length: maxLength,
                  }),
                },
              }));
            } else {
              setErrors((prevState) => ({
                ...prevState,
                errors: {
                  ckEditor: null,
                },
              }));
            }
          },
        },
        placeholder: placeholder,
        licenseKey: LICENSE_KEY,
      } as EditorConfig,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLayoutReady]);

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
    listPath.current = newListPath.filter((item) => item !== null) as any;
    let newContent = data;
    newListPath.forEach((item) => {
      const base64 = item.base64;
      const path = item.path;
      newContent = newContent.replace(path, base64);
    });
    setDataEditor(newContent);
  };

  const handleEditorChange = (event: EventInfo, editor: any) => {
    const content = editor.getData();
    onChange(event, {
      ...editor,
      getData: () => (isConvertFile ? getNewContent() : content),
    });
    setDataEditor(content);

    if (isRequired && isEmpty(content)) {
      const errorMsg = translate("CM.required_message");
      setErrors((prev) => ({
        ...prev,
        errors: { ckEditor: errorMsg },
      }));
    }
  };

  const getNewContent = useMemo(
    () => () => {
      let newContent = editorRef?.current?.getData();
      listPath?.current.forEach((item) => {
        const base64 = item.base64;
        const path = item.path;
        newContent = newContent.replace(base64, path);
      });
      return newContent;
    },
    []
  );

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      errors: { ckEditor: errorMess },
    }));
  }, [errorMess]);

  return (
    <>
      <div
        ref={editorRef}
        className={classNames(`${styles["EditorCM-container"]}`, {
          [`${styles["EditorCM-custom"]}`]: isCustomCss,
        })}
      >
        {editorConfig && (
          <FormItem
            validateObject={utilService.getValidateObj(errors, "ckEditor")}
          >
            <div className="w-100">
              <CKEditor
                data={dataEditor}
                onChange={handleEditorChange}
                editor={ClassicEditor}
                config={editorConfig}
                onReady={(editor) => {
                  editorRef.current = editor;
                  wordCountRef.current = editor.plugins.get("WordCount");
                }}
              />
            </div>
          </FormItem>
        )}
      </div>
    </>
  );
};

export default EditorCM;
