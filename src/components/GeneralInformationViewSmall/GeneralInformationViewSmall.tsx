import { Col, Row, Tooltip } from "antd";
import classNames from "classnames";
import { PropsWithChildren, ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./GeneralInformationViewSmall.module.scss";

interface TicketItem {
  label?: ReactNode | string;
  content?: ReactNode | string;
  className?: string;
  classNameContent?: string;
}

interface TicketProps extends PropsWithChildren {
  code: string;
  description?: string;
  note?: ReactNode | string;
  link?: string;
  title?: string;
  targetLink?: string;
  ticketItems?: TicketItem[];
  ticketClassName?: string;
  objectSummaryValue?: TicketItem;
  descriptionClassName?: string;
  titleClassName?: string;
}

function Ticket({
  code,
  description,
  link,
  targetLink = "_blank",
  ticketClassName,
  ticketItems,
  objectSummaryValue,
  descriptionClassName,
  titleClassName,
}: TicketProps) {
  if (!code) return null;

  const TicketItem = ({
    item,
    className,
    classNameContent,
  }: {
    item: TicketItem;
    className?: string;
    classNameContent?: string;
  }) => {
    return (
      <Col className={className}>
        <Row gutter={4} className={styles["ticket-item"]}>
          {item?.label && (
            <Col className={styles["ticket-item-label"]}>{item.label}:</Col>
          )}
          {item?.content && (
            <Col className={classNames(classNameContent)}>{item.content}</Col>
          )}
        </Row>
      </Col>
    );
  };

  return (
    <div className={classNames(styles["ticket"], ticketClassName)}>
      <Row justify="space-between" align="middle">
        <Col>
          <Row align="middle">
            <Tooltip title={code}>
              <Link
                className={classNames(
                  styles["code"],
                  "line-clamp-1",
                  titleClassName
                )}
                target={targetLink}
                to={link}
              >
                {code}
              </Link>
            </Tooltip>
            <div
              className={classNames(
                styles["description"],
                "line-clamp-3",
                descriptionClassName
              )}
            >
              {description}
            </div>
          </Row>
        </Col>
        {objectSummaryValue && (
          <TicketItem item={objectSummaryValue} {...objectSummaryValue} />
        )}
      </Row>
      <Row gutter={20} align="middle">
        {ticketItems?.map((item: TicketItem, index: number) => (
          <TicketItem key={index} item={item} {...item} />
        ))}
      </Row>
    </div>
  );
}

interface BlockContainerProps extends PropsWithChildren {
  title?: ReactNode;
  label?: string;
  content?: ReactNode | string;
  className?: string;
}

function BlockContainer({ title, children, className }: BlockContainerProps) {
  return (
    <div className={styles["block-container"]}>
      {title && (
        <div className={`${styles["title"]} ${className}`}>{title}</div>
      )}
      {children}
    </div>
  );
}

function ColBlock({
  content,
  label,
  children,
  className,
}: BlockContainerProps) {
  return (
    <Col className={styles["col-block"]}>
      {label && <div className={styles["col-block-label"]}>{label}</div>}
      {content && (
        <div className={`${styles["col-block-content"]} ${className}`}>
          {content}
        </div>
      )}
      {children}
    </Col>
  );
}

function Block({ content, label, children, className }: BlockContainerProps) {
  return (
    <Col className={styles["block"]}>
      {label && <div className={styles["block-label"]}>{label}</div>}
      {content && (
        <div className={`${styles["block-content"]} ${className}`}>
          {content}
        </div>
      )}
      {children}
    </Col>
  );
}

interface GeneralInformationViewSmallProps {
  children?: ReactNode;
  contentTicket?: ReactNode;
}

export default function GeneralInformationViewSmall({
  contentTicket,
  children,
}: GeneralInformationViewSmallProps) {
  return (
    <div className={styles["general-information"]}>
      {contentTicket}
      {children}
    </div>
  );
}

export { BlockContainer, ColBlock, Block, Ticket };
