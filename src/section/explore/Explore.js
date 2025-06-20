import React, { useState, useEffect } from "react";
import { supabase } from "../../db/supabase";
import { useNavigate } from "react-router-dom";
import { exploreLocations } from "./exploreData";
import { performExploration } from "./exploreLogic";
import style from "./explore.module.scss";
import TextDone from "../../asset/util/text_done.gif";

export default function Explore({ location = "1층 복도" }) {
  const navigate = useNavigate();

  // 현재 위치와 이전 위치 스택 (실패 시 복원용)
  const [currentLocation, setCurrentLocation] = useState(
    exploreLocations[location] || exploreLocations["1층 복도"]
  );
  const [previousLocations, setPreviousLocations] = useState([]);

  // 이미 조사 실패한(조사된) 장소 기록 (키: 위치 이름)
  const [investigated, setInvestigated] = useState({});

  // 탐사 이벤트 결과 객체: null이면 기본 모드, 아니면 { type:"success"|"fail", segments: [] }
  const [explorationResult, setExplorationResult] = useState(null);

  // 타이핑 효과 관련 상태
  const [activeTextSegments, setActiveTextSegments] = useState([]);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  // UI 상태
  const [showChoices, setShowChoices] = useState(false);
  const [explorationCompleted, setExplorationCompleted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // 탐사 이벤트 타입: "success" 또는 "fail"
  const [eventType, setEventType] = useState(null);
  // 탐사 종료 버튼 모달 (항상 보임)
  const [showTerminateModal, setShowTerminateModal] = useState(false);

  // 현재 위치 이름
  const currentLocationName =
    Object.keys(exploreLocations).find(
      (key) => exploreLocations[key] === currentLocation
    ) || "조사한다.";

  // 기본 모드: explorationResult가 null이면 현재 위치의 description 사용
  useEffect(() => {
    if (!explorationResult) {
      const texts = currentLocation.description
        ? currentLocation.description.split("|")
        : [""];
      setActiveTextSegments(texts);
      setTextIndex(0);
      setCharIndex(0);
      setDisplayText("");
      setShowChoices(false);
      setExplorationCompleted(false);
    }
  }, [currentLocation, explorationResult]);

  // 탐사 이벤트 모드: explorationResult가 있으면 그 결과의 segments 사용
  useEffect(() => {
    if (explorationResult) {
      setActiveTextSegments(explorationResult.segments);
      setTextIndex(0);
      setCharIndex(0);
      setDisplayText("");
      setShowChoices(false);
      setExplorationCompleted(false);
    }
  }, [explorationResult]);

  // 타입라이터 효과: activeTextSegments의 현재 세그먼트를 한 글자씩 출력
  useEffect(() => {
    if (activeTextSegments.length === 0) return;
    const segment = activeTextSegments[textIndex] || "";
    if (charIndex < segment.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + segment.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // 세그먼트 출력 완료
      if (textIndex === activeTextSegments.length - 1) {
        const timer = setTimeout(() => {
          if (explorationResult) {
            if (explorationResult.type === "fail") {
              setShowChoices(true);
              setExplorationCompleted(true);
            } else if (explorationResult.type === "success") {
              setExplorationCompleted(true);
              // 성공은 팝업은 사용자의 클릭으로 처리
            }
          } else {
            setShowChoices(true);
          }
        }, 300);
        return () => clearTimeout(timer);
      } else {
        // 중간 세그먼트에서는 선택지 숨김
        setShowChoices(false);
      }
    }
  }, [charIndex, textIndex, activeTextSegments, explorationResult]);

  // 텍스트 박스 클릭 처리
  const handleTextClick = () => {
    if (showTerminateModal || showPopup) return;
    const segment = activeTextSegments[textIndex] || "";
    if (charIndex < segment.length) {
      setDisplayText(segment);
      setCharIndex(segment.length);
    } else if (textIndex < activeTextSegments.length - 1) {
      setTextIndex((prev) => prev + 1);
      setDisplayText("");
      setCharIndex(0);
      setShowChoices(false);
    } else {
      if (explorationResult && explorationResult.type === "success" && explorationCompleted && !showPopup) {
        setShowPopup(true);
      } else {
        setShowChoices(true);
      }
    }
  };

  // 선택지 클릭 처리
const handleChoiceClick = async (choice) => {
  const lookupChoice =
    typeof choice === "string"
      ? choice.replace("▶ ", "")
      : choice.text.replace("▶ ", "");
  if (!lookupChoice) return;

  let actualChoice = typeof choice === "string" ? { text: choice } : choice;

  // 코인 패널티 먼저 적용
if (actualChoice.coinPenalty) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  console.log("로그인된 유저:", loggedInUser);

  if (loggedInUser?.id) {
    const { data: userInfo, error } = await supabase
      .from("users_info")
      .select("coin")
      .eq("user_id", loggedInUser.id)
      .single();

    // console.log("유저 코인 정보 조회 error:", error);
    // console.log("유저 코인 정보:", userInfo);
    const now = new Date();
    const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString();

    if (!error && userInfo) {
      const updatedCoin = Math.max(0, userInfo.coin - actualChoice.coinPenalty);
      const { error: updateError } = await supabase
        .from("users_info")
        .update({ coin: updatedCoin })
        .eq("user_id", loggedInUser.id);

      if (updateError) {
        console.error("코인 차감 실패:", updateError);
        alert("코인을 차감하는 중 문제가 발생했습니다.");
        return;
      } else {
        // console.log(`코인 차감 성공: ${actualChoice.coinPenalty}개`);

        const { data: insertData, error: insertError } = await supabase
          .from("users_record")
          .insert({
            user_id: loggedInUser.id,
            type: "penalty",
            item_name: `${actualChoice.coinPenalty}코인`,
            timestamp: koreaTime,
          });

        // if (insertError) {
        //   console.error("기록 추가 실패:", insertError);
        //   if (insertError.details) console.error("세부 내용:", insertError.details);
        //   if (insertError.hint) console.error("힌트:", insertError.hint);
        // } else {
        //   console.log("기록 추가 성공:", insertData);
        // }

      }
    }
  } else {
    console.warn("로그인된 유저 정보가 없습니다.");
  }
}



  // triggersEvent가 true면 exploreResults 출력
  if (actualChoice.triggersEvent) {
    const result = await performExploration();
    if (result?.segments) {
      setExplorationResult(result);
    }
    return;
  }

  // goTo가 있으면 해당 위치로 이동
  if (actualChoice.goTo && exploreLocations[actualChoice.goTo]) {
    setPreviousLocations((prev) => [...prev, currentLocation]);
    setExplorationResult(null);
    setCurrentLocation(exploreLocations[actualChoice.goTo]);
    return;
  }

  // 돌아간다.
  if (lookupChoice === "돌아간다.") {
    if (previousLocations.length > 0) {
      const lastLocation = previousLocations[previousLocations.length - 1];
      setPreviousLocations((prev) => prev.slice(0, -1));
      setExplorationResult(null);
      setEventType(null);
      setExplorationCompleted(false);
      setShowPopup(false);
      setActiveTextSegments([]);
      setTextIndex(0);
      setCharIndex(0);
      setDisplayText("");
      setShowChoices(false);
      setCurrentLocation(lastLocation);
    }
    return;
  }

  // 그냥 선택지 이동
  if (exploreLocations[lookupChoice]) {
    setPreviousLocations((prev) => [...prev, currentLocation]);
    setExplorationResult(null);
    setCurrentLocation(exploreLocations[lookupChoice]);
    return;
  }

  // 조사 이벤트 (중복 방지)
  if (choice.triggersEvent) {
    if (investigated[currentLocationName]) {
      const specialResult = {
        type: "fail",
        segments: ["이미 조사했던 곳이다. 다른 곳을 살펴보자"],
      };
      setExplorationResult(specialResult);
      setEventType("fail");
      if (currentLocation.choices) {
        const newChoices = currentLocation.choices.filter((c) => {
          const t = typeof c === "string" ? c : c.text;
          return t.includes("돌아간다");
        });
        setCurrentLocation({ ...currentLocation, choices: newChoices });
      }
    } else {
      if (previousLocations.length === 0) {
        setPreviousLocations([currentLocation]);
      }

      const result = await performExploration(); // { type, segments, coinReward? }
      setExplorationResult(result);
      setEventType(result.type);

      if (result.type === "success" && result.coinReward > 0) {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser?.id) {
          try {
            const { data: userInfo, error } = await supabase
              .from("users_info")
              .select("coin")
              .eq("user_id", loggedInUser.id)
              .single();

            if (!error && userInfo) {
              const currentCoin = Number(userInfo.coin) || 0;
              const updatedCoin = currentCoin + result.coinReward;

              const { error: updateError } = await supabase
                .from("users_info")
                .update({ coin: updatedCoin })
                .eq("user_id", loggedInUser.id);

              if (updateError) {
                console.error("코인 업데이트 실패:", updateError);
              } else {
                console.log(`코인 ${result.coinReward}개 지급 완료`);
              }
            } else {
              console.error("유저 정보 조회 실패:", error);
            }
          } catch (e) {
            console.error("코인 지급 중 오류:", e);
          }
        } else {
          console.warn("로그인된 유저 정보가 없습니다.");
        }
      }

      if (result.type === "fail") {
        setInvestigated((prev) => ({
          ...prev,
          [currentLocationName]: true,
        }));
        if (currentLocation.choices) {
          const newChoices = currentLocation.choices.filter((c) => {
            const t = typeof c === "string" ? c : c.text;
            return t.includes("돌아간다");
          });
          setCurrentLocation({ ...currentLocation, choices: newChoices });
        }
      }
    }

    setTextIndex(0);
    setCharIndex(0);
    setDisplayText("");
    setShowChoices(false);
    setExplorationCompleted(false);
    return;
  }
};



  // 탐사 종료 버튼 클릭 처리
  const handleTerminateClick = () => {
    setShowTerminateModal(true);
  };

  const confirmTerminate = () => {
    navigate("/");
  };

  const cancelTerminate = () => {
    setShowTerminateModal(false);
  };
  

  return (
    <div className={style.container}>
      {/* 탐사 종료 버튼 항상 보임 */}
      <button className={style.terminateButton} onClick={handleTerminateClick}>
        탐사 종료
      </button>
      <div className={style.where}>{currentLocationName}</div>
      <div className={style.imgBox}>
        <img src={currentLocation.image} alt={currentLocationName} />
      </div>
      <div className={style.textBox} onClick={handleTextClick}>
        <p>
          {displayText.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <div className={style.choiceBox}>
          {(!explorationResult && showChoices) ||
          (explorationResult && explorationResult.type === "fail" && showChoices)
            ? currentLocation.choices?.map((choice, index) => (
                <button key={index} onClick={() => handleChoiceClick(choice)}>
                  {typeof choice === "string" ? choice : choice.text}
                </button>
              ))
            : null}
        </div>
        <img src={TextDone} alt="Text done" />
      </div>

      {/* 탐사 종료 확인 모달 */}
      {showTerminateModal && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            탐사를 종료하시겠습니까? <br />
            <span>차감되었던 횟수는 복구되지 않습니다.</span>
          </div>
          <div className={style.modalButtons}>
            <button onClick={confirmTerminate}>종료</button>
            <button onClick={cancelTerminate}>취소</button>
          </div>
        </div>
      )}

      {/* 성공 이벤트 팝업 */}
      {showPopup && (
        <div className={style.popup}>
          <div className={style.popupContent}>조사가 종료되었습니다.</div>
          <div className={style.btn}>
            <button
              onClick={() => {
                setShowPopup(false);
                navigate("/");
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
