/* 404 NotFound */

import React from "react";
import { Button } from "antd";
import errorUrl from "@/assets/error.gif";
import { History } from "history";

import "./index.less";

interface Props {
  history: History;
}

export default function NotFoundContainer(props: Props): JSX.Element {
  const gotoHome = (): void => {
    props.history.replace("/");
  };
  return (
    <div className="page-error">
      <div>
        <div className="title">404</div>
        <div className="info">Oh dear</div>
        <div className="info">这里什么也没有</div>
        <Button className="back-btn" type="primary" ghost onClick={gotoHome}>
          返回首页
        </Button>
      </div>
      <img src={errorUrl + `?${Date.now()}`} />
    </div>
  );
}
