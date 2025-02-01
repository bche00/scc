import React, { useState, useEffect } from "react";
import { supabase } from "../../db/supabase";
import products from "../../db/product";
import style from "./bag.module.scss";

export default function Bag() {
  const [bagItems, setBagItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
  
      const sortedItems = data.bag_item?.map((item) => ({
        ...item,
        timestamp: item.timestamp ? new Date(item.timestamp).toISOString() : null,
      })) || [];

      setBagItems([
        ...sortedItems.filter((item) => !item.used),
        ...sortedItems.filter((item) => item.used),
      ]);
      setLoading(false);
    };
  
    fetchBagItems();
  }, []);

  // ✅ 아이템 사용 함수 추가 (빠졌던 부분)
  const handleUseItem = async (itemId) => {
    const confirmUse = window.confirm(
      `${products.find((p) => p.id === itemId).name}을(를) 사용하시겠습니까?`
    );

    if (!confirmUse) return;

    let updatedBagItems = [...bagItems];

    const itemIndex = updatedBagItems.findIndex(
      (item) => item.itemId === itemId && !item.used
    );

    if (itemIndex === -1) {
      alert("사용할 수 있는 아이템이 없습니다.");
      return;
    }

    const itemName = products.find((p) => p.id === itemId).name;
    
    const usedItemIndex = updatedBagItems.findIndex(
      (item) => item.itemId === itemId && item.used
    );

    if (usedItemIndex !== -1) {
      updatedBagItems[usedItemIndex].count += 1;
    } else {
      updatedBagItems.push({ itemId, count: 1, used: true });
    }

    updatedBagItems[itemIndex].count -= 1;
    updatedBagItems = updatedBagItems.filter((item) => item.count > 0 || item.used);

    updatedBagItems = [
      ...updatedBagItems.filter((item) => !item.used),
      ...updatedBagItems.filter((item) => item.used),
    ];

    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const koreaTime = new Date();
      koreaTime.setHours(koreaTime.getHours() + 9);

      const { error: recordError } = await supabase.from("users_record").insert([
        {
          user_id: loggedInUser.id,
          item_id: itemId,
          item_name: itemName,
          type: "used",
          timestamp: koreaTime.toISOString(),
        },
      ]);

      if (recordError) {
        console.error("아이템 사용 기록 저장 중 오류 발생:", recordError);
      }

      const { error } = await supabase
        .from("users_info")
        .update({ bag_item: updatedBagItems })
        .eq("user_id", loggedInUser.id);

      if (error) {
        console.error("아이템 사용 업데이트 중 오류 발생:", error);
        alert("아이템 사용 처리 중 문제가 발생했습니다.");
        return;
      }

      setBagItems(updatedBagItems);
      alert("아이템을 사용했습니다!");
    } catch (err) {
      console.error("예기치 않은 오류 발생:", err);
      alert("아이템 사용 처리 중 문제가 발생했습니다.");
    }
  };

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
            <div
              key={`${bagItem.itemId}-${index}`}
              className={style.haveItem}
              style={{
                opacity: isUsed ? 0.7 : 1,
                position: "relative",
              }}>
              <img src={product.image} alt={product.name} />
              {isUsed && (
                <div
                  className={style.overlay}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `url('/path/to/overlay_image.png') center/cover no-repeat`,
                    opacity: 0.5,
                  }}
                />
              )}
              <div className={style.itemInfo}>
                <span className={style.itemN}>
                  {product.name} - {bagItem.count}개
                </span>
                <span className={style.itemD}>{product.description}</span>

                {!isUsed && (
                  <div className={style.btn}>
                    <button>선물하기</button>
                    <button onClick={() => handleUseItem(bagItem.itemId)}>
                      사용하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
