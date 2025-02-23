import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exploreLocations } from "./exploreData";
import { performExploration } from "./exploreLogic";
import style from "./explore.module.scss";
import TextDone from "../../asset/util/text_done.gif";

export default function Explore({ location = "1층 복도" }) {
  const navigate = useNavigate();

  // 현재 위치와 이전 위치 (실패 시 복원용)
  const [currentLocation, setCurrentLocation] = useState(
    exploreLocations[location] || exploreLocations["1층 복도"]
  );
  const [previousLocation, setPreviousLocation] = useState(null);

  // 재조사한 장소를 기록 (키: location name)
  const [investigated, setInvestigated] = useState({});

  // 탐사 이벤트 결과: null이면 기본 모드, 아니면 { type: "success"|"fail", segments: [] }
  const [explorationResult, setExplorationResult] = useState(null);

  // 타이핑 관련 상태
  const [activeTextSegments, setActiveTextSegments] = useState([]);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [showChoices, setShowChoices] = useState(false);
  const [explorationCompleted, setExplorationCompleted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // 현재 위치 이름 (예: "방송실", "모니터를 살펴본다.")
  const currentLocationName =
    Object.keys(exploreLocations).find(
      (key) => exploreLocations[key] === currentLocation
    ) || "Location Image";

  // 텍스트 세그먼트 로드:
  // - 탐사 이벤트가 없으면 기본 description을 분할하여 사용
  // - 탐사 이벤트 결과가 있으면 그 결과의 segments를 사용
  useEffect(() => {
    if (explorationResult) {
      setActiveTextSegments(explorationResult.segments);
    } else {
      const texts = currentLocation.description
        ? currentLocation.description.split("|")
        : [""];
      setActiveTextSegments(texts);
    }
    setTextIndex(0);
    setCharIndex(0);
    setDisplayText("");
    setShowChoices(false);
    setExplorationCompleted(false);
  }, [currentLocation, explorationResult]);

  // 타입라이터 효과
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
      // 한 세그먼트가 완전히 출력되었음.
      if (textIndex === activeTextSegments.length - 1) {
        const timer = setTimeout(() => {
          if (explorationResult) {
            // 탐사 이벤트 모드
            if (explorationResult.type === "fail") {
              setShowChoices(true); // 실패는 바로 선택지("돌아간다.") 표시
              setExplorationCompleted(true);
            } else if (explorationResult.type === "success") {
              setExplorationCompleted(true);
              // 성공은 선택지를 렌더하지 않음 (팝업은 사용자의 클릭에 의해)
            }
          } else {
            // 기본 모드: 설명 출력 후 선택지 표시
            setShowChoices(true);
          }
        }, 300);
        return () => clearTimeout(timer);
      } else {
        // 중간 세그먼트: ensure 선택지는 숨김
        setShowChoices(false);
      }
    }
  }, [charIndex, textIndex, activeTextSegments, explorationResult]);

  // 텍스트 영역 클릭 처리
  const handleTextClick = () => {
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
      // 만약 탐사 이벤트가 성공 모드이고 출력 완료되었으면,
      // 텍스트 영역 클릭 시 팝업을 띄움
      if (explorationResult && explorationResult.type === "success" && explorationCompleted && !showPopup) {
        setShowPopup(true);
      } else {
        setShowChoices(true);
      }
    }
  };

  // 선택지 클릭 처리
  const handleChoiceClick = (choice) => {
    const lookupChoice =
      typeof choice === "string"
        ? choice.replace("▶ ", "")
        : choice.text.replace("▶ ", "");
    if (!lookupChoice) return;

    // "돌아간다." 선택 시
    if (lookupChoice === "돌아간다.") {
      if (previousLocation) {
        // 리셋 후 이전 상태 복원
        setExplorationResult(null);
        setExplorationCompleted(false);
        setShowPopup(false);
        setActiveTextSegments([]);
        setTextIndex(0);
        setCharIndex(0);
        setDisplayText("");
        setShowChoices(false);
        setCurrentLocation(previousLocation);
        setPreviousLocation(null);
      }
      return;
    }

    // 일반 선택: 위치 전환
    if (exploreLocations[lookupChoice]) {
      setPreviousLocation(currentLocation);
      setExplorationResult(null);
      setCurrentLocation(exploreLocations[lookupChoice]);
      return;
    }

    // "조사한다" (triggersEvent) 선택 시
    if (choice.triggersEvent) {
      // 만약 이미 조사한 장소라면, 특수 실패 결과를 설정
      if (investigated[currentLocationName]) {
        const specialResult = {
          type: "fail",
          segments: ["이미 조사했던 곳이다. 다른 곳을 살펴보자"]
        };
        setExplorationResult(specialResult);
        // 선택지는 "돌아간다."만 남김
        if (currentLocation.choices) {
          const newChoices = currentLocation.choices.filter((c) => {
            const t = typeof c === "string" ? c : c.text;
            return t.includes("돌아간다");
          });
          setCurrentLocation({ ...currentLocation, choices: newChoices });
        }
      } else {
        // 일반 탐사 진행
        // 저장: 이전 위치는 현재 위치(예: "방송실")로, 이 상태를 실패 시 복원용으로 사용
        if (!previousLocation) setPreviousLocation(currentLocation);
        const result = performExploration(); // { type, segments }
        setExplorationResult(result);
        if (result.type === "fail") {
          setInvestigated((prev) => ({ ...prev, [currentLocationName]: true }));
          if (currentLocation.choices) {
            const newChoices = currentLocation.choices.filter((c) => {
              const t = typeof c === "string" ? c : c.text;
              return t.includes("돌아간다");
            });
            setCurrentLocation({ ...currentLocation, choices: newChoices });
          }
        }
      }
      // 초기화: 새 이벤트 결과를 위해 모든 텍스트 관련 상태 리셋
      setTextIndex(0);
      setCharIndex(0);
      setDisplayText("");
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
