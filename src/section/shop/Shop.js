import React, { useState, useEffect } from 'react';
import style from './shop.module.scss';

import TextDone from '../../asset/util/text_done.gif';

export default function Shop() {
  const dialogues = [
    "인기척이 느껴진다.",
    "무언가 섬뜩한 기운이 감돈다.",
    "어딘가 낯선 느낌이다.",
    "스산한 기운이 스며든다.",
    "누군가 쳐다보는 듯한 기분이다.",
    "기묘한 소리가 들린다.",
    "…방금 말소리가 들리지 않았나?"
  ];

  const [currentDialogue, setCurrentDialogue] = useState("");

  useEffect(() => {
    const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    setCurrentDialogue(randomDialogue);
  }, []);

  return (
    <div className={style.container}>
      <div className={style.c01}>
        <div className={style.imgBox} />
        <div className={style.textBox}>
          {currentDialogue}
          <img src={TextDone} alt="Text done" />
        </div>
      </div>

      <div className={style.c02}>
        <div className={style.productList}>
          여기 아이템이랑 스크롤 들어감
          <div className={style.product}>컴포넌트로 만들어서 map돌림</div>
        </div>
      </div>
    </div>
  );
}
