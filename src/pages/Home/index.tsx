/* 主页 */

import React from "react";
import logoUrl from "@/assets/react-logo.jpg";

import "./index.less";

export default function HomePageContainer(): JSX.Element {
  return (
    <div className="page-home all_nowarp">
      <div className="box">
        <img src={logoUrl} />
        <div className="title">华能智能调运系统</div>
        <div className="info">
        欢迎进入华能智能调运系统
        </div>
      </div>
    </div>
  );
}
