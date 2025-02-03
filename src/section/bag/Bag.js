import React, { useState, useEffect } from "react";
import { supabase } from "../../db/supabase";
import products from "../../db/product";
import { handleUseItem, setPopupHandler } from "./itemHandler"; // ✅ 핸들러 가져오기
import style from "./bag.module.scss";

export default function Bag() {
  const [bagItems, setBagItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ visible: false, image: "", text: "" });

  useEffect(() => {
    const fetchBagItems = async () => {
      setLoading(true);
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) {
        alert("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users_info")
        .select("bag_item")
        .eq("user_id", loggedInUser.id)
        .single();

      if (error) {
        console.error("소지품 데이터를 가져오는 중 오류 발생:", error);
        setLoading(false);
        return;
      }

      setBagItems(data.bag_item || []);
      setLoading(false);
    };

    fetchBagItems();
    setPopupHandler(setPopup); // ✅ 팝업 핸들러 등록
  }, []);

  return (
    <div className={style.container}>
      {loading ? (
        <p>로딩 중...</p>
      ) : bagItems.length === 0 ? (
        <p className={style.noItems}>소지하신 아이템이 없습니다!😮</p>
      ) : (
        bagItems.map((bagItem, index) => {
          const product = products.find((p) => p.id === bagItem.itemId);
          const isUsed = bagItem.used;

          return (
            <div key={`${bagItem.itemId}-${index}`} className={style.haveItem} style={{ opacity: isUsed ? 0.7 : 1 }}>
              <img src={product.image} alt={product.name} />
              <div className={style.itemInfo}>
                <span className={style.itemN}>{product.name} - {bagItem.count}개</span>
                <span className={style.itemD}>{product.description}</span>
                {!isUsed && (
                  <div className={style.btn}>
                    <button>선물하기</button>
                    <button onClick={() => handleUseItem(bagItem.itemId, bagItems, setBagItems)}>사용하기</button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* ✅ 팝업 UI */}
      {popup.visible && (
        <div className={style.popup}>
          <div className={style.popupContent}>
            <img src={popup.image} alt="popup" />
            <p>{popup.text}</p>
            <button onClick={() => setPopup({ visible: false, image: "", text: "" })}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
