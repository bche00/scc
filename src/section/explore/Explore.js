import React, { useState, useEffect } from "react";
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
    ) || "Location Image";

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
  const handleChoiceClick = (choice) => {
    const lookupChoice =
      typeof choice === "string"
        ? choice.replace("▶ ", "")
        : choice.text.replace("▶ ", "");
    if (!lookupChoice) return;

    // "돌아간다." 선택 시: 이전 위치 스택에서 마지막 항목을 복원
    if (lookupChoice === "돌아간다.") {
      if (previousLocations.length > 0) {
        const lastLocation = previousLocations[previousLocations.length - 1];
        setPreviousLocations(prev => prev.slice(0, -1));
        // 리셋 후 복원
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

    // 일반 선택: 현재 위치를 이전 위치 스택에 추가하고, 선택한 위치로 전환
    if (exploreLocations[lookupChoice]) {
      setPreviousLocations(prev => [...prev, currentLocation]);
      setExplorationResult(null);
      setCurrentLocation(exploreLocations[lookupChoice]);
      return;
    }

    // "조사한다" (triggersEvent) 선택 시
    if (choice.triggersEvent) {
      // 이전 위치는 그대로 남겨두어 실패 시 복원 가능.
      if (investigated[currentLocationName]) {
        // 이미 조사한 장소: 특수 실패 결과
        const specialResult = {
          type: "fail",
          segments: ["이미 조사했던 곳이다. 다른 곳을 살펴보자"]
        };
        setExplorationResult(specialResult);
        setEventType("fail");
        // 실패 결과 시 선택지는 "돌아간다."만 남김
        if (currentLocation.choices) {
          const newChoices = currentLocation.choices.filter(c => {
            const t = typeof c === "string" ? c : c.text;
            return t.includes("돌아간다");
          });
          setCurrentLocation({ ...currentLocation, choices: newChoices });
        }
      } else {
        // 아직 조사하지 않은 경우
        // 이전 위치는 기록(만약 아직 기록되어 있지 않으면)
        if (previousLocations.length === 0) {
          setPreviousLocations([currentLocation]);
        }
        const result = performExploration(); // { type, segments }
        setExplorationResult(result);
        setEventType(result.type);
        if (result.type === "fail") {
          setInvestigated(prev => ({ ...prev, [currentLocationName]: true }));
          if (currentLocation.choices) {
            const newChoices = currentLocation.choices.filter(c => {
              const t = typeof c === "string" ? c : c.text;
              return t.includes("돌아간다");
            });
            setCurrentLocation({ ...currentLocation, choices: newChoices });
          }
        }
      }
      // 이벤트 결과 진입 시 모든 텍스트 상태 초기화
      setTextIndex(0);
      setCharIndex(0);
      setDisplayText("");
      setShowChoices(false);
      setExplorationCompleted(false);
      return;
    }
  };

  // 탐사 종료 버튼 클릭 처리 (항상 보임)
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
