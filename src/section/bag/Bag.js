import React, { useState, useEffect } from "react";
import { supabase } from "../../db/supabase";
import products from "../../db/product";
import { handleUseItem, setPopupHandler } from "./itemHandler"; 
import { handleGiftItem } from "./giftHandler"; // 선물 기능 추가
import style from "./bag.module.scss";

export default function Bag() {
  const [bagItems, setBagItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ visible: false, image: "", text: "" });

  // 선물하기 팝업 관련 상태 추가
  const [giftPopup, setGiftPopup] = useState({ visible: false, item: null });
  const [users, setUsers] = useState([]); // 유저 목록
  const [selectedUser, setSelectedUser] = useState(null);
  const [userCoin, setUserCoin] = useState(0); //코인 상태 추가
  const [searchTerm, setSearchTerm] = useState("");

const filteredUsers = users.filter((user) =>
  user.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) {
        alert("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users_info")
        .select("bag_item, coin") //한 번에 가져오기
        .eq("user_id", loggedInUser.id)
        .single();

      if (error) {
        console.error("소지품 데이터를 가져오는 중 오류 발생:", error);
        setLoading(false);
        return;
      }

      setBagItems(data.bag_item || []);
      setUserCoin(data.coin ?? 0); //코인 null 방지
      setLoading(false);
    };

    const fetchUsers = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return; //로그인한 유저 없으면 실행 중단

      const { data, error } = await supabase
        .from("users")
        .select("id, name")
        .neq("id", loggedInUser.id); // 자기 자신 제외

      if (error) {
        console.error("유저 목록 가져오기 실패:", error);
        return;
      }

      setUsers(data);
    };

    fetchUserData();
    fetchUsers();
    setPopupHandler(setPopup);
  }, []);

  const handleOpenGiftPopup = (item) => {
    setGiftPopup({ visible: true, item });
    setSelectedUser(null); //유저 선택 초기화
  };

  return (
    <div className={style.container}>
      {loading ? (
        <p>로딩 중...</p>
      ) : bagItems.length === 0 ? (
        <p className={style.noItems}>비어있습니다.</p>
      ) : (
        bagItems.map((bagItem, index) => {
          const product = products.find((p) => p.id === Number(bagItem.itemId)) || {}; //id 변환하여 비교
          const isUsed = bagItem.used;

          return (
            <div key={`${bagItem.itemId}-${index}`} className={style.haveItem} style={{ opacity: isUsed ? 0.7 : 1 }}>
              <img src={product.image || "/default.png"} alt={product.name || "알 수 없는 아이템"} />
              <div className={style.itemInfo}>
                <span className={style.itemN}>{product.name || "알 수 없는 아이템"} - {bagItem.count}개</span>
                <span className={style.itemD}>{product.description || "설명 없음"}</span>
                {!isUsed && (
                  <div className={style.btn}>
                    <button onClick={() => handleOpenGiftPopup(bagItem)}>선물</button>
                    <button onClick={() => handleUseItem(bagItem.itemId, bagItems, setBagItems)}>사용</button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {popup.visible && (
        <div className={style.popup}>
          <div className={style.popupContent}>
            <img src={popup.image} alt="popup" />
            <p style={{ whiteSpace: "pre-line" }}>{popup.text}</p>
            <button onClick={() => setPopup({ visible: false, image: "", text: "" })}>닫기</button>
          </div>
        </div>
      )}

      {/* 선물하기 팝업 */}
      {giftPopup.visible && (
        <div className={style.overlay}>
          <div className={style.popup}>

            <div className={style.popupContent}>
              <h2 className={style.popupText}>누구에게 선물할까?</h2>

              {/* 검색창 */}
              <input
                type="text"
                placeholder="이름 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={style.searchInput}/>

              {/* 필터링된 유저 리스트 */}
              <div className={style.userList}>
                {filteredUsers.length === 0 ? (
                  <p>검색 결과가 없습니다.</p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`${style.userItem} ${
                        selectedUser?.id === user.id ? style.selected : ""
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      {user.name}
                    </div>
                  ))
                )}
              </div>

              {/* 버튼 */}
              <div className={style.btn}>
                <button
                  onClick={() =>
                    handleGiftItem(
                      giftPopup.item,
                      selectedUser,
                      bagItems,
                      setBagItems,
                      setGiftPopup,
                      userCoin,
                      setUserCoin
                    )
                  }
                  disabled={!selectedUser}>
                  보내기
                </button>
                <button onClick={() => setGiftPopup({ visible: false, item: null })}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
