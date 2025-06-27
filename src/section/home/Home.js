import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../db/supabase";
import { Link } from "react-router-dom";
import style from "./home.module.scss";

import Coin from "../../asset/util/coin.gif";
import Mail from "../../asset/util/mail.png";
import MailH from "../../asset/util/mail_have.gif";
import Shop from "../../asset/icon/shop.png";
import Bag from "../../asset/icon/bag.png";
import Record from "../../asset/icon/record.png";
import MailHandler from "./MailHandler.js";
import CoinGiftPopup from "./CoinGiftPopup.js";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [coin, setCoin] = useState(0);
  const [mail, setMail] = useState(0); // 우편 개수 상태
  const [loading, setLoading] = useState(true);
  const [giftPopup, setGiftPopup] = useState(false); // 우편 팝업 상태
  const [coinClickCount, setCoinClickCount] = useState(0); 
  const [showCoinGiftPopup, setShowCoinGiftPopup] = useState(false); // 코인 전달(어드민만)
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const allowedUserIds = [1]; //추후 코인 전달 사용 가능 어드민 추가 시 배열에 user_id 추가
  // 탐사 입장 카운트
  const [showExplorePopup, setShowExplorePopup] = useState(false);
  const [exploreRemaining, setExploreRemaining] = useState(null);
  const navigate = useNavigate();

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
        // users_info에서 코인 가져오기
        const { data: userInfo, error: infoError } = await supabase
          .from("users_info")
          .select("coin")
          .eq("user_id", userId)
          .single();

        if (infoError) {
          console.error("유저 정보를 가져오는 중 오류:", infoError); 
          setLoading(false);
          return;
        }

        setUserName(loggedInUser.name);
        setCoin(userInfo.coin);

        // 서버에서 우편 개수 가져오기
        fetchMailboxCount(userId);
      } catch (error) {
        console.error("예기치 않은 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 탐사 횟수 초기화 함수
  useEffect(() => {
    const checkExploreReset = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return;

      const { data, error } = await supabase
        .from("users_info")
        .select("explore_limit")
        .eq("user_id", loggedInUser.id)
        .single();

      if (error || !data) {
        console.error("탐사 초기화 정보 불러오기 실패:", error);
        return;
      }

      let exploreData = data.explore_limit;

      const today = new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Seoul",
      });

      if (exploreData.date !== today) {
        const newData = { date: today, remaining: 2 };
        const { error: updateError } = await supabase
          .from("users_info")
          .update({ explore_limit: newData })
          .eq("user_id", loggedInUser.id);

        if (updateError) {
          console.error("탐사 초기화 실패:", updateError);
        }
      }
    };

    checkExploreReset();
  }, []);

  // 탐사 입장 횟수 카운트 함수
    const handleExploreClick = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    const { data, error } = await supabase
      .from("users_info")
      .select("explore_limit")
      .eq("user_id", loggedInUser.id)
      .single();

    if (error || !data) {
      alert("탐사 정보를 불러오지 못했습니다.");
      return;
    }

    setExploreRemaining(data.explore_limit.remaining || 0);
    setShowExplorePopup(true);
  };

  const handleStartExplore = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    localStorage.setItem("allowExplore", "true");
    if (!loggedInUser) return;

    // 탐사 횟수 차감
    const newRemaining = exploreRemaining - 1;
    const today = new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Seoul",
    });

    const { error } = await supabase
      .from("users_info")
      .update({ explore_limit: { date: today, remaining: newRemaining } })
      .eq("user_id", loggedInUser.id);

    if (error) {
      alert("탐사 시작에 실패했습니다.");
      return;
    }

    localStorage.setItem("allowExplore", "true"); // 진입 허용

    setShowExplorePopup(false);

    // 0.1초 딜레이 후 이동
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/explore");
  };



  // 서버에서 우편 개수 가져오는 함수
  const fetchMailboxCount = async (userId) => {
    const { data, error } = await supabase
      .from("gift_records")
      .select("id")
      .eq("receiver_id", userId)
      .eq("received", false); // 아직 받지 않은 우편만 가져오기

    if (error) {
      console.error("우편 개수 불러오기 실패:", error);
      return;
    }

    setMail(data.length); // 우편 개수 업데이트
  };

  // 실시간 코인 수 업데이트 구독
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

const subscription = supabase
  .channel("coin-updates")
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "users_info",
      filter: `user_id=eq.${loggedInUser.id}`,
    },
    (payload) => {
      // console.log("Realtime coin update payload:", payload);
      setCoin(payload.new.coin);
    }
  )
  .subscribe();

// console.log("Subscribed to coin updates:", subscription);


    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // 실시간 우편함 개수 업데이트 구독
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    const subscription = supabase
      .channel("mail-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "gift_records",
          filter: `receiver_id=eq.${loggedInUser.id}`,
        },
        (payload) => {
          setMail((prevMail) => prevMail + 1);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "gift_records",
          filter: `receiver_id=eq.${loggedInUser.id}`,
        },
        (payload) => {
          // 받은 우편이 'received'로 표시되면 우편 개수 -1
          if (payload.new.received && !payload.old.received) {
            setMail((prevMail) => Math.max(prevMail - 1, 0));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // 탈퇴 확인 및 처리 함수
  const handleLeaveClub = async () => {
    const userInput = prompt(
      `심령포착동아리를 탈퇴하시겠습니까?\n\n` +
      `그렇다면 귀하의 이름을 철자 오류 없이 입력해 주세요.`
    );

    if (userInput === null) return;
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
      const { error } = await supabase.from("users").update({ status: null }).eq("id", userId);
      if (error) {
        console.error("탈퇴 처리 중 오류 발생:", error);
        alert("탈퇴 중 문제가 발생했습니다. 다시 시도해 주세요.");
        return;
      }

      alert("탈퇴가 완료되었습니다.");
      localStorage.removeItem("loggedInUser");
      window.location.href = "/login";
    } catch (error) {
      console.error("탈퇴 중 오류:", error);
      alert("탈퇴 요청을 처리하는 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className={`${style.container} ${giftPopup ? style.noInteraction : ""}`}>
      <div className={style.user}>
        환영합니다! &lceil;{" "}
        <span className="cursorPointer" onClick={handleLeaveClub}>
          {userName}
        </span>{" "}
        &rfloor; 부원님.
      </div>
      <div className={style.c01}>
        <div className={style.top}>
          <div className={style.alarm}>
            <div className="d-flex flex-column align-items-center gap-1">
              {showCoinGiftPopup && <CoinGiftPopup setShowCoinGiftPopup={setShowCoinGiftPopup} />}
              <img
                src={Coin}
                alt="Coin"
                onClick={() => {
                  // 허용된 유저인지 체크
                  if (!allowedUserIds.includes(loggedInUser?.id)) {
                    // 허용 안되면 클릭 카운트 초기화 및 팝업 절대 안 열림
                    setCoinClickCount(0);
                    return;
                  }

                  setCoinClickCount((prev) => {
                    if (prev === 2) {
                      setShowCoinGiftPopup(true);
                      return 0; // 클릭 카운트 초기화
                    }
                    return prev + 1;
                  });
                }}
              />

              <p className={style.utilNumber}>{coin}c</p>
            </div>
            <div className="d-flex flex-column align-items-center gap-1">
              <img
                src={mail > 0 ? MailH : Mail}
                alt="Mail"
                className={`${style.mailIcon} cursorPointer`}
                onClick={() => setGiftPopup(true)}
              />
              <p className={style.utilNumber}>{mail}</p> {/* 우편 개수 자동 업데이트 */}
            </div>
          </div>

          {showExplorePopup && (
            <div className={style.overlay}>
              <div className={style.popup}>
                <div className={style.popupContent}>
                  <h5>탐사를 시작할까요?</h5>
                  <p>오늘 남은 탐사 횟수: {exploreRemaining}회</p>
                  <div className={style.btn}>
                    <button
                      onClick={() => {
                        if (exploreRemaining > 0) {
                          localStorage.setItem("allowExplore", "true"); // 진입 허용
                          handleStartExplore(); // navigate("/explore") 포함되어 있어야 함. 악의적 접근 막기용
                        } else {
                          alert("오늘의 탐사 횟수를 모두 사용했습니다!");
                          setShowExplorePopup(false);
                        }
                    }}>
                      시작
                    </button>
                    <button onClick={() => setShowExplorePopup(false)}>취소</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={style.explore} onClick={handleExploreClick}>
            <p>*탐사하기*</p>
          </div>

        </div>

        <div className={style.banner}>
          {/* 서버 오픈 후 추가 */}
          {/* <a href="##" target="_blank">
            <p className={style.planText}>
              오늘의 일정은 ---- 입니다~! &rArr; 공지 바로가기 &lArr;
            </p>
          </a> */}
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

      {giftPopup && <MailHandler giftPopup={giftPopup} setGiftPopup={setGiftPopup} setMail={setMail} />}
    </div>
  );
}
