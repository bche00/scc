import React, { useState, useEffect } from "react";
import { supabase } from "../../db/supabase"; // Supabase 연결
import style from "./shop.module.scss";

import TextDone from "../../asset/util/text_done.gif";
import products from "../../db/product.js";
import Coin from "../../asset/util/coin.gif";

export default function Shop() {
  const dialogues = [
    "인기척이 느껴진다.",
    "무언가 섬뜩한 기운이 감돈다.",
    "어딘가 낯선 느낌이다.",
    "스산한 기운이 스며든다.",
    "누군가 쳐다보는 듯한 기분이다.",
    "기묘한 소리가 들린다.",
    "…방금 말소리가 들리지 않았나?",
  ];

  const [currentDialogue, setCurrentDialogue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // 선택된 상품
  const [loading, setLoading] = useState(false);
  const [userCoin, setUserCoin] = useState(0); // **유저 코인 상태 추가**

  useEffect(() => {
    const randomDialogue =
      dialogues[Math.floor(Math.random() * dialogues.length)];
    setCurrentDialogue(randomDialogue);
  }, []);

  // **유저 소지금 가져오기**
  useEffect(() => {
    const fetchUserCoin = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return;

      const { data, error } = await supabase
        .from("users_info")
        .select("coin, bag_item")
        .eq("user_id", loggedInUser.id)
        .single();

      if (error) {
        console.error("유저 코인 정보를 가져오는 중 오류 발생:", error);
        return;
      }

      setUserCoin(data.coin);
    };

    fetchUserCoin();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handlePurchase = async () => {
    if (!selectedProduct) return;
  
    const confirmPurchase = window.confirm(
      `${selectedProduct.name}을(를) 구매하시겠습니까?(${selectedProduct.price}c)`
    );
    if (!confirmPurchase) return;
  
    setLoading(true);
  
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) {
        alert("로그인이 필요합니다.");
        setLoading(false);
        return;
      }
  
      const userId = loggedInUser.id;
  
      // **유저 정보 가져오기**
      const { data: userInfo, error: userError } = await supabase
        .from("users_info")
        .select("coin, bag_item")
        .eq("user_id", userId)
        .single();
  
      if (userError || !userInfo) {
        console.error("유저 정보를 가져오는 중 오류 발생:", userError);
        alert("유저 정보를 가져오는 데 실패했습니다.");
        setLoading(false);
        return;
      }
  
      if (userInfo.coin < selectedProduct.price) {
        alert("이런! 코인이 부족합니다😥");
        setLoading(false);
        return;
      }
  
      // **코인 차감 및 소지품 업데이트**
      const updatedCoins = userInfo.coin - selectedProduct.price;
      const updatedBagitem = [...userInfo.bag_item];
  
      // **기존 아이템 중 used: false 상태인 것 찾기**
      const existingItem = updatedBagitem.find(
        (item) => item.itemId === selectedProduct.id && !item.used
      );
  
      if (existingItem) {
        existingItem.count += 1;
      } else {
        updatedBagitem.push({ itemId: selectedProduct.id, count: 1, used: false });
      }
  
      // **📌 한국 시간(KST) 변환**
      const koreaTime = new Date();
      koreaTime.setHours(koreaTime.getHours() + 9); // UTC → KST 변환
  
      // **Supabase 업데이트 (유저 정보)**
      const { error: updateError } = await supabase
        .from("users_info")
        .update({
          coin: updatedCoins,
          bag_item: updatedBagitem,
        })
        .eq("user_id", userId);
  
      if (updateError) {
        console.error("데이터 업데이트 중 오류 발생:", updateError);
        alert("구매 처리 중 문제가 발생했습니다.");
      } else {
        // **📌 구매 기록 저장 (KST 적용)**
        const { error: recordError } = await supabase.from("users_record").insert([
          {
            user_id: userId,
            item_id: selectedProduct.id,
            item_name: selectedProduct.name,
            type: "purchase",
            timestamp: koreaTime.toISOString(), // ✅ 한국 시간 저장
          },
        ]);
  
        if (recordError) {
          console.error("구매 기록 저장 오류:", recordError);
        }
  
        alert("구매가 완료되었습니다!");
        setUserCoin(updatedCoins);
      }
    } catch (err) {
      console.error("예기치 않은 오류 발생:", err);
      alert("구매 처리 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className={style.container}>
      {/* 상단 텍스트 박스 */}
      <div className={style.c01}>
        <div className={style.imgBox}>
          <div className={style.coin}>
            <img src={Coin} alt="Coin" /> {userCoin}c
          </div>
        </div>
        <div className={style.textBox}>
          {currentDialogue}
          <img src={TextDone} alt="Text done" />
        </div>
      </div>

      {/* 상품 리스트 */}
      <div className={style.c02}>
        <div className={style.productList}>
          {products.map((product) => (
            <div
              key={product.id}
              className={style.product}
              onClick={() => handleProductClick(product)}
            >
              <img src={product.image} alt={product.name} />
              <span>{product.price}c</span>
            </div>
          ))}
        </div>

        {/* 선택된 상품 상세 정보 */}
        {selectedProduct && (
          <div className={style.productInfo}>
            <div class={style.imgBox}>
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              {selectedProduct.price}c
            </div>
            <div className={style.infoMore}>
              <span className={style.productN}>
                {selectedProduct.name}
              </span>
              <span className={style.productD}>
                {selectedProduct.description}
              </span>
              <div className={style.btn}>
                <button>선물</button>
                <button onClick={handlePurchase} disabled={loading}>
                  {loading ? "구매 중..." : "구매"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
