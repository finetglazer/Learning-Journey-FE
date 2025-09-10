import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { useState } from "react";
import FormEditTextItem from "./FormEditTextItem";
import "./ProposedBasis.scss";

type Props = {
  title: string;
  formEdit: { fieldName: string; title: string }[];
};

const ProposedBasis = ({ title, formEdit }: Props) => {
  const [collapse, setCollapse] = useState<boolean>(true);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <div className="proposed-basis_wrapper">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{title}</div>
        <div>
          <img
            className={classNames("cursor-pointer", {
              "rotate-180": collapse,
              "rotate-0": !collapse,
            })}
            src={IcArrowDown}
            alt="img"
            width={16}
            height={16}
          />
        </div>
      </div>
      {collapse && (
        <div className="body-proposed">
          {formEdit?.map((item) => {
            {
              return (
                <FormEditTextItem
                  key={item?.fieldName}
                  fieldName={item?.fieldName}
                  title={item?.title}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default ProposedBasis;
