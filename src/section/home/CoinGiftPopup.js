import { useState, useEffect } from "react";
import { supabase } from "../../db/supabase";
import style from "./home.module.scss";

export default function CoinGiftPopup({ setShowCoinGiftPopup }) {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [coinAmount, setCoinAmount] = useState(1);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = userList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadUsers = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return;

      setCurrentUser(loggedInUser);

      const { data, error } = await supabase
        .from("users")
        .select("id, name")
        .eq("status", "approved")
        .neq("id", loggedInUser.id);

      if (error) {
        console.error("유저 목록 오류:", error);
      } else {
        setUserList(data);
      }
    };

    loadUsers();
  }, []);

const sendCoin = async () => {
  if (!selectedUser || coinAmount <= 0)
    return alert("정보를 정확히 입력하세요.");
  setSending(true);

  const { data: userInfo, error: infoError } = await supabase
    .from("users_info")
    .select("coin")
    .eq("user_id", currentUser.id)
    .single();

  if (infoError || !userInfo) {
    alert("내 코인 정보를 불러오지 못했습니다.");
    setSending(false);
    return;
  }

  if (userInfo.coin < coinAmount) {
    alert("코인이 부족합니다!");
    setSending(false);
    return;
  }

  // KST 타임스탬프 생성
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const timestamp = kstNow.toISOString().replace("Z", "");

  // 1. gift_records 테이블에 선물 기록 삽입
  const { data: giftData, error: insertError } = await supabase
    .from("gift_records")
    .insert({
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      receiver_id: selectedUser.id,
      receiver_name: selectedUser.name,
      item_id: null,
      item_name: `${coinAmount}코인`,
      count: coinAmount,
      received: false,
      timestamp: timestamp,
    })
    .select()
    .single();

  if (insertError || !giftData) {
    console.error("선물 등록 실패:", insertError);
    alert("전송 실패");
    setSending(false);
    return;
  }

  // 2. 내 코인 차감
  const { error: updateError } = await supabase
    .from("users_info")
    .update({ coin: userInfo.coin - coinAmount })
    .eq("user_id", currentUser.id);

  if (updateError) {
    console.error("코인 차감 실패:", updateError);
    alert("코인 차감 실패");
    setSending(false);
    return;
  }

  // 3. records 테이블에 보낸 기록 삽입 (gift_sent)
  const senderRecord = {
    user_id: currentUser.id,
    type: "gift_sent",
    item_name: `${coinAmount}코인`,
    timestamp: timestamp,
  };

  // 4. records 테이블에 받은 기록 삽입 (gift_received)
  const receiverRecord = {
    user_id: selectedUser.id,
    type: "gift_received",
    item_name: `${coinAmount}코인`,
    timestamp: timestamp,
  };

  const { error: recordError } = await supabase.from("users_record").insert([
    senderRecord,
    receiverRecord,
  ]);

  if (recordError) {
    console.error("record 저장 실패:", recordError);
    // 실패하더라도 알림은 띄우되, 실패 여부는 따로 로그만 찍고 진행
  }

  alert("코인을 보냈습니다!");
  setShowCoinGiftPopup(false);
};


  return (
    <>
      <div className={style.overlay} onClick={() => setShowCoinGiftPopup(false)}>
        <div className={style.popup} onClick={(e) => e.stopPropagation()}>
          <div className={style.popupTop}>
            코인 선물하기
            <span
              className={`${style.popupClose} cursorPointer`}
              onClick={() => setShowCoinGiftPopup(false)}>
              ×
            </span>
          </div>

          <div className={style.popupContent}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색"
              className={`${style.searchInput} inputText`}
            />

            <div className={style.userList}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`${style.userItem} cursorPointer ${
                      selectedUser?.id === user.id ? style.selected : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    {user.name}
                  </div>
                ))
              ) : (
                <div className={style.noUser}>검색 결과 없음</div>
              )}
            </div>

            <div className={style.coinAmount}>
              <input
                type="text"
                min={1}
                value={coinAmount}
                onChange={(e) => setCoinAmount(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className={style.btn}>
              <button disabled={!selectedUser || sending} onClick={sendCoin}>
                {sending ? "보내는 중..." : "보내기"}
              </button>
              <button onClick={() => setShowCoinGiftPopup(false)}>취소</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
