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
  const [userName, setUserName] = useState("");
  const [coin, setCoin] = useState(0);
  const [mail, setMail] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
  
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  
      if (!loggedInUser) {
        console.error("로그인된 유저 정보가 없습니다.");
        setLoading(false);
        return;
      }
  
      const userId = loggedInUser.id;
  
      try {
        const { data: userInfo, error: infoError } = await supabase
          .from("users_info")
          .select("coin, mail")
          .eq("user_id", userId)
          .single();
  
        if (infoError) {
          console.error("유저 추가 정보를 가져오는 중 오류:", infoError);
          setLoading(false);
          return;
        }
  
        setUserName(loggedInUser.name); 
        setCoin(userInfo.coin); 
        setMail(userInfo.mail.length); 
      } catch (error) {
        console.error("예기치 않은 오류:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  // ✅ 탈퇴 확인 및 처리 함수
  const handleLeaveClub = async () => {
    const userInput = prompt(
      `심령포착동아리를 탈퇴하시겠습니까?\n\n` +
      `그렇다면 귀하의 이름을 철자 오류 없이 입력해 주세요.`
    );

    if (userInput === null) {
      return; // 취소 버튼 누르면 종료
    }

    if (userInput !== userName) {
      alert("이름이 일치하지 않습니다. 정확히 입력해 주세요.");
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
      alert("로그인 정보를 찾을 수 없습니다.");
      return;
    }

    const userId = loggedInUser.id;

    try {
      const { error } = await supabase
        .from("users")
        .update({ status: null }) // ✅ status를 NULL로 변경
        .eq("id", userId);

      if (error) {
        console.error("탈퇴 처리 중 오류 발생:", error);
        alert("탈퇴 중 문제가 발생했습니다. 다시 시도해 주세요.");
        return;
      }

      alert("탈퇴가 완료되었습니다. 그동안 감사했습니다.🥺");
      
      // ✅ 로컬스토리지 삭제 및 리디렉트
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login"; // 로그인 페이지로 이동
    } catch (error) {
      console.error("탈퇴 중 오류:", error);
      alert("탈퇴 요청을 처리하는 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className={style.container}>
      {/* ✅ userName을 클릭하면 탈퇴 함수 실행 */}
      <div className={style.user}>
        환영합니다! &lceil;{" "}
        <span className='cursorPointer' onClick={handleLeaveClub}>
          {userName}
        </span>{" "}
        &rfloor; 부원님 😊
      </div>
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
          <p className={style.planText}>
            오늘의 일정은 ---- 입니다~! &rArr; 공지 바로가기 &lArr;
          </p>
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
