import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import style from "./layout.module.scss";
import Util from "../util/Util";

export default function Layout({ children, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 라우터 경로 가져오기

  // 경로에 따른 텍스트 설정
  const getRouteText = () => {
    switch (location.pathname) {
      case "/":
        return "";
      case "/shop":
        return "- 매점";
      case "/bag":
        return "- 소지품";
      case "/record":
        return "- 기록";
      case "/explore":
        return "- 탐사";
      default:
        return "";
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      localStorage.removeItem("isLoggedIn"); // 로컬스토리지 초기화
      setIsLoggedIn(false); // 상태 업데이트
      navigate("/login"); // 로그인 페이지로 이동
    }
  };

  return (
    <div className={style.container}>
      <div className={style.phone}>
        <div className={style.bar}>
          心靈捕捉部 {getRouteText()} {/* 고정 텍스트 뒤에 동적 텍스트 추가 */}
          <span
            className={`${style.close} cursorPointer`}
            onClick={handleLogout}>
            ×
          </span>
        </div>
        <div className={style.content}>{children}</div>
        <div className={style.util}>
          <Util />
        </div>
      </div>
    </div>
  );
}
