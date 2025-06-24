import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// 탐사 도중 새로고침하면 경고 알림
export default function PreventRefresh() {
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (location.pathname === "/explore") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location]);

  return null;
}
