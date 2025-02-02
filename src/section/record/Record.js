import React, { useState, useEffect } from "react";
import { supabase } from "../../db/supabase";
import style from "./record.module.scss";

export default function Record() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      
      if (!loggedInUser) {
        alert("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      console.log("📢 Fetching records for user:", loggedInUser.id);

      const { data, error } = await supabase
      .from("users_record")
      .select("*")
      .eq("user_id", loggedInUser.id)
      .order("timestamp", { ascending: false }); // 최신 기록이 위로 오도록 정렬

      if (error) {
        console.error("⚠️ 기록을 가져오는 중 오류 발생:", error);
        setLoading(false);
        return;
      }

      console.log("✅ 가져온 기록 데이터:", data);
      setRecords(data);
      setLoading(false);
    };

    fetchRecords();

    // 🔥 실시간 업데이트 리스너 추가
    const subscription = supabase
    .channel("record_updates")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "users_record" }, // 변경된 테이블명 반영
      (payload) => {
        console.log("🆕 새로운 기록이 추가됨:", payload.new);
        setRecords((prevRecords) => [payload.new, ...prevRecords]);
      }
    )
    .subscribe();
    
  

    return () => {
      console.log("🛑 Unsubscribing from real-time updates.");
      supabase.removeChannel(subscription);
    };
  }, []);

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};


  return (
    <div className={style.container}>
      <h2>기록</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : records.length === 0 ? (
        <p>아직 기록이 없습니다!😮</p>
      ) : (
        <ul className={style.recordList}>
          {records.map((record) => (
            <li key={`${record.user_id}-${record.item_id}-${record.timestamp}`} className={style.recordItem}>
              <strong>[{record.type === "used" ? "사용" : record.type === "purchase" ? "구매" : "알 수 없음"}]</strong>
              {record.item_name}  
              <span className={style.timestamp}>{formatDate(record.timestamp)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
