import React, { useState, useEffect } from "react";
import { supabase } from "../../db/supabase";
import { Link } from "react-router-dom";
import style from "./home.module.scss";

import Coin from "../../asset/util/coin.gif";
import Mail from "../../asset/util/mail.png";
import Shop from "../../asset/icon/shop.png";
import Bag from "../../asset/icon/bag.png";
import Record from "../../asset/icon/record.png";

export default function Home() {
  const [userName, setUserName] = useState(""); // 유저 이름
  const [coin, setcoin] = useState(0); // 보유 코인
  const [mail, setmail] = useState(0); // 받은 메일 수
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      // 현재 유저 세션 가져오기 (최신 Supabase 방식)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        console.error("로그인된 유저가 없습니다.", sessionError);
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      try {
        // `users` 테이블에서 이름 가져오기
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name")
          .eq("id", userId)
          .single();

        if (userError) {
          console.error("유저 정보를 가져오는 중 오류:", userError);
          setLoading(false);
          return;
        }

        // `user_info` 테이블에서 추가 데이터 가져오기
        const { data: userInfo, error: infoError } = await supabase
          .from("user_info")
          .select("coin, mail")
          .eq("user_id", userId)
          .single();

        if (infoError) {
          console.error("유저 추가 정보를 가져오는 중 오류:", infoError);
          setLoading(false);
          return;
        }

        // 상태 업데이트
        setUserName(userData.name);
        setcoin(userInfo.coin);
        setmail(userInfo.mail.length); // 메일 배열 길이를 사용
      } catch (error) {
        console.error("예기치 않은 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className={style.container}>
      <div className={style.user}>환영합니다! {userName} 부원님😊</div>
      <div className={style.c01}>
        <div className={style.top}>
          <div className={style.alarm}>
            <div className="d-flex flex-column align-items-center gap-1">
              <img src={Coin} alt="Coin" />
              <p className={style.utilNumber}>{coin}c</p>
            </div>
            <div className="d-flex flex-column align-items-center gap-1">
              <img src={Mail} alt="Mail" />
              <p className={style.utilNumber}>{mail}</p>
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