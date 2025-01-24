import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./layout.module.scss";
import Util from "../util/Util";

export default function Layout({ children, setIsLoggedIn }) {
  const navigate = useNavigate();

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
          心靈捕捉部{" "}
          <span
            className={style.close}
            onClick={handleLogout} // 로그아웃 핸들러 연결
          >
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
