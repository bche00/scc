import React from 'react';
import style from './home.module.scss';
import { Link } from 'react-router-dom';
import Coin from '../../asset/util/coin.gif';
import Mail from '../../asset/util/mail.png';
import Shop from '../../asset/icon/shop.png';
import Bag from '../../asset/icon/bag.png';
import Record from '../../asset/icon/record.png';

export default function Home() {
  return (
    <div className={style.container}>
      <div className={style.user}>환영합니다! ○○○ 부원님😊</div>
      <div className={style.c01}>
        <div className={style.top}>
        <div className={style.alarm}>
          <div className="d-flex flex-column align-items-center gap-1">
            <img src={Coin} alt="Coin" />
            <p className={style.utilNumber}>0c</p>
          </div>
          <div  className="d-flex flex-column align-items-center gap-1">
            <img src={Mail} alt="Mail" />
            <p className={style.utilNumber}>0</p>
          </div>
        </div>
        <Link to="/explore">
          <div className={style.explore}>
            <p>*탐사하기*</p>
          </div>
        </Link>
      </div>


        <div className={style.banner}>
          <p className={style.planText}>오늘의 일정은 ---- 입니다~! ▶ 바로가기 ◀</p>
      </div>

      </div>

      <div className={style.c02}>
          <Link to="/shop">
          <div className={style.utilIcon}>
            <img src={Shop} alt="Shop" className={style.icon} />
            <p>매점</p>
          </div>
        </Link>
        <Link to="/bag">
          <div className={style.utilIcon}>
            <img src={Bag} alt="Bag" className={style.icon} />
            <p>소지품</p>
          </div>
        </Link>
        <Link to="/record">
          <div className={style.utilIcon}>
            <img src={Record} alt="Record" className={style.icon} />
            <p>기록</p>
          </div>
        </Link>

      </div>
    </div>
  );
}
