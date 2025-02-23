import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exploreLocations } from "./exploreData";
import { performExploration } from "./exploreLogic";
import style from "./explore.module.scss";
import TextDone from "../../asset/util/text_done.gif";

export default function Explore({ location = "1층 복도" }) {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState(
    exploreLocations[location] || exploreLocations["1층 복도"]
  );
  // 이전 상태는 탐사 이벤트 이전의 상태(예: "방송실")를 보관
  const [previousLocation, setPreviousLocation] = useState(null);

  // 텍스트 관련 상태
  const [activeTextSegments, setActiveTextSegments] = useState([]);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  // UI 상태
  const [showChoices, setShowChoices] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [explorationCompleted, setExplorationCompleted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [eventType, setEventType] = useState(null); // "success" or "fail"
  // eventResult를 새로 도입: 탐사 이벤트 결과 객체 저장 (초기 null)
  const [eventResult, setEventResult] = useState(null);

  const currentLocationName =
    Object.keys(exploreLocations).find(
      (key) => exploreLocations[key] === currentLocation
    ) || "Location Image";

  // 기본 설명 텍스트 로드: 탐사 이벤트가 아닐 때 AND eventResult가 null일 때만 실행
  useEffect(() => {
    if (!isExploring && eventResult === null) {
      const texts = currentLocation.description
        ? currentLocation.description.split("|")
        : [""];
      setActiveTextSegments(texts);
      setTextIndex(0);
      setDisplayText("");
      setCharIndex(0);
      setShowChoices(false);
    }
  }, [currentLocation, isExploring, eventResult]);

  // 타입라이터 효과: activeTextSegments의 현재 구간을 한 글자씩 출력
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
      // 한 구간이 완전히 출력되었음
      if (textIndex === activeTextSegments.length - 1) {
        const timer = setTimeout(() => {
          if (isExploring) {
            if (eventType === "fail") {
              setShowChoices(true);
              setExplorationCompleted(true);
            } else if (eventType === "success") {
              setExplorationCompleted(true);
              // 성공은 팝업은 사용자의 클릭으로 띄움.
            }
          } else {
            setShowChoices(true);
          }
        }, 300); // 딜레이 300ms
        return () => clearTimeout(timer);
      }
    }
  }, [charIndex, textIndex, activeTextSegments, isExploring, eventType]);

  // 텍스트 영역 클릭 처리
  const handleTextClick = () => {
    if (isExploring && eventType === "success" && explorationCompleted && !showPopup) {
      // 성공 이벤트 완료 후 사용자가 클릭하면 팝업을 띄움
      setShowPopup(true);
      return;
    }
    if (showPopup) return;
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
      setShowChoices(true);
    }
  };

  // 선택지 클릭 처리
  const handleChoiceClick = (choice) => {
    const dispChoice = typeof choice === "string" ? choice : choice.text;
    const lookupChoice =
      typeof choice === "string"
        ? choice.replace("▶ ", "")
        : choice.text.replace("▶ ", "");
    if (!lookupChoice) return;

    // "돌아간다." 선택 시: 실패 이벤트라면 이전 상태(예: 방송실)로 복원
    if (lookupChoice === "돌아간다.") {
      if (previousLocation) {
        // 리셋 후 이전 상태 복원
        setIsExploring(false);
        setEventType(null);
        setEventResult(null);
        setExplorationCompleted(false);
        setShowPopup(false);
        setActiveTextSegments([]);
        setTextIndex(0);
        setCharIndex(0);
        setDisplayText("");
        setShowChoices(false);
        setCurrentLocation(previousLocation);
      }
      return;
    }
    // 일반 선택: 해당 위치로 전환
    if (exploreLocations[lookupChoice]) {
      setPreviousLocation(currentLocation);
      setCurrentLocation(exploreLocations[lookupChoice]);
      return;
    }
    // "조사한다" (triggersEvent) 선택 시
    if (choice.triggersEvent) {
      // 이전 상태는 그대로 남겨두어야(예: 방송실) 실패 시 복원 가능
      setIsExploring(true);
      const result = performExploration(); // { type, segments } 반환
      setEventResult(result);
      setEventType(result.type);
      setActiveTextSegments(result.segments);
      // 완전 초기화: 새 이벤트 결과를 위해
      setTextIndex(0);
      setDisplayText("");
      setCharIndex(0);
      setShowChoices(false);
      setExplorationCompleted(false);
      return;
    }
  };

  return (
    <div className={style.container}>
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
          {((!isExploring && showChoices) || (isExploring && eventType === "fail" && showChoices)) &&
            currentLocation.choices?.map((choice, index) => (
              <button key={index} onClick={() => handleChoiceClick(choice)}>
                {typeof choice === "string" ? choice : choice.text}
              </button>
          ))}
        </div>

        <img src={TextDone} alt="Text done" />
      </div>
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
