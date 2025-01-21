import React from 'react'
import style from './shop.module.scss';

import TextDone from '../../asset/util/text_done.gif';

export default function Shop() {
  return (
    <div className={style.container}>
      <div className={style.c01}>
        <div className={style.imgBox} />
        <div className={style.textBox}>
          인기척이 느껴진다.
          <img src={TextDone} alt="Text done" />
        </div>
      </div>

      <div className={style.c02}>
        <div className={style.productList}>여기 아이템이랑 스크롤 들어감
          <div className={style.product}>컴포넌트로 만들어서 map돌림</div>
        </div>
      </div>
    </div>
  )
}
