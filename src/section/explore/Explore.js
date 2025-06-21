import React, { useState, useEffect } from "react";
import { supabase } from "../../db/supabase";
import { useNavigate } from "react-router-dom";
import { exploreLocations } from "./exploreData";
import { performExploration } from "./exploreLogic";
import style from "./explore.module.scss";
import TextDone from "../../asset/util/text_done.gif";
import products from "../../db/product";

export default function Explore({ location = "1층 복도" }) {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState(
    exploreLocations[location] || exploreLocations["1층 복도"]
  );
  const [previousLocations, setPreviousLocations] = useState([]);
  const [investigated, setInvestigated] = useState({});
  const [explorationResult, setExplorationResult] = useState(null);
  const [activeTextSegments, setActiveTextSegments] = useState([]);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [showChoices, setShowChoices] = useState(false);
  const [explorationCompleted, setExplorationCompleted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [eventType, setEventType] = useState(null);
  const [showTerminateModal, setShowTerminateModal] = useState(false);

  const currentLocationName =
    Object.keys(exploreLocations).find(
      (key) => exploreLocations[key] === currentLocation
    ) || "조사한다.";

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
      if (textIndex === activeTextSegments.length - 1) {
        const timer = setTimeout(() => {
          if (explorationResult) {
            if (explorationResult.type === "fail") {
              setShowChoices(true);
              setExplorationCompleted(true);
            } else if (explorationResult.type === "success") {
              setExplorationCompleted(true);
            }
          } else {
            setShowChoices(true);
          }
        }, 300);
        return () => clearTimeout(timer);
      } else {
        setShowChoices(false);
      }
    }
  }, [charIndex, textIndex, activeTextSegments, explorationResult]);

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
      if (
        explorationResult &&
        explorationResult.type === "success" &&
        explorationCompleted &&
        !showPopup
      ) {
        setShowPopup(true);
      } else {
        setShowChoices(true);
      }
    }
  };

const handleChoiceClick = async (choice) => {
  const lookupChoice =
    typeof choice === "string"
      ? choice.replace("▶ ", "")
      : choice.text.replace("▶ ", "");
  if (!lookupChoice) return;

  let actualChoice = typeof choice === "string" ? { text: choice } : choice;

  // 이미 조사한 장소라면 탐사 이벤트 막기
  if (actualChoice.triggersEvent) {
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
      return;
    }
  }

  // 코인 차감
  if (actualChoice.coinPenalty) {
    // ... 생략 (기존 코드 그대로 유지)
  }

  // 아이템 획득
  if (actualChoice.itemId) {
    // ... 생략 (기존 코드 그대로 유지)
  }

  if (actualChoice.triggersEvent) {
    if (previousLocations.length === 0) {
      setPreviousLocations([currentLocation]);
    }

    const result = await performExploration(); // { type, segments, coinReward? }
    setExplorationResult(result);
    setEventType(result.type);

    if (result.type === "success" && result.coinReward > 0) {
      // ... 생략 (코인 지급 로직 유지)
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

    setTextIndex(0);
    setCharIndex(0);
    setDisplayText("");
    setShowChoices(false);
    setExplorationCompleted(false);
    return;
  }

  // 이동
  if (actualChoice.goTo && exploreLocations[actualChoice.goTo]) {
    setPreviousLocations((prev) => [...prev, currentLocation]);
    setExplorationResult(null);
    setCurrentLocation(exploreLocations[actualChoice.goTo]);
    return;
  }

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
};


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
          (explorationResult?.type === "fail" && showChoices)
            ? currentLocation.choices?.map((choice, index) => (
                <button key={index} onClick={() => handleChoiceClick(choice)}>
                  {typeof choice === "string" ? choice : choice.text}
                </button>
              ))
            : null}
        </div>
        <img src={TextDone} alt="Text done" />
      </div>

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
