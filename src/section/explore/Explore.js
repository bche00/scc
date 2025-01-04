import React from 'react'
import style from './explore.module.scss';

import TextDone from '../../asset/util/text_done.gif';

export default function Explore() {
  return (
    <div className={style.container}>
      <div className={style.where}>과학실</div>
      <div className={style.imgBox}></div>
      <div className={style.textBox}>
        <p>
          이 곳에 대사가 들어갑니다.<br />대사라기보단 지문?<br />시각적 미감 상으론 세 줄 까지가 적당.
        </p>
          <img src={TextDone} alt="Text done" />
      </div>
    </div>
  )
}
