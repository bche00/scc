import React, { useState, useEffect } from "react";
import style from "./shop.module.scss";

import TextDone from "../../asset/util/text_done.gif";
import products from "../../db/product.js";

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

  useEffect(() => {
    const randomDialogue =
      dialogues[Math.floor(Math.random() * dialogues.length)];
    setCurrentDialogue(randomDialogue);
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product); // 선택된 상품 업데이트
  };

  return (
    <div className={style.container}>
      {/* 상단 대화 박스 */}
      <div className={style.c01}>
        <div className={style.imgBox} />
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
              onClick={() => handleProductClick(product)} // 클릭 시 상세 정보 업데이트
            >
              <img src={product.image} alt={product.name} />
              <span>{product.price}c</span>
            </div>
          ))}
        </div>

        {/* 선택된 상품 상세 정보 */}
        {selectedProduct && (
          <div className={style.productInfo}>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div className={style.infoMore}>
              <span className={style.productN}>{selectedProduct.name}</span>
              <span className={style.productD}>
                {selectedProduct.description}
              </span>
              <div className={style.btn}>
                <button>선물</button>
                <button>구매</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
