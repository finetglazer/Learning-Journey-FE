import { Card } from "antd";
import classNames from "classnames";
import "./CardGrid.scss";
import { PropsWithChildren } from "react";

interface CardGridProps extends PropsWithChildren {
  className?: string;
  title?: string;
  content?: string;
}

const { Grid } = Card;

const CardGrid = ({ className, title = "", children }: CardGridProps) => {
  return (
    <Grid hoverable={false} className={classNames("card-grid", className)}>
      <div className="card-grid-title">{title}</div>
      <div className="card-grid-content">{children}</div>
    </Grid>
  );
};

export default CardGrid;
