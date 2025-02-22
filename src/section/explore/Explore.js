import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exploreLocations } from "./exploreData";
import { exploreResults } from "./exploreResults";
import style from "./explore.module.scss";
import TextDone from "../../asset/util/text_done.gif";

export default function Explore({ location = "1층 복도" }) {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(exploreLocations[location] || exploreLocations["1층 복도"]);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [isExploring, setIsExploring] = useState(false);
  const [explorationCompleted, setExplorationCompleted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setTextIndex(0);
    setDisplayText("");
    setCharIndex(0);
    setShowChoices(false);
    setIsExploring(false);
    setExplorationCompleted(false);
    setShowPopup(false);
  }, [currentLocation]);

  useEffect(() => {
    if (!explorationCompleted && currentLocation.description) {
      const currentText = currentLocation.description.split("|")[textIndex] || "";
      if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + currentText[charIndex]);
          setCharIndex(prev => prev + 1);
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        if (textIndex < currentLocation.description.split("|").length - 1) {
          setTimeout(() => setShowChoices(false), 500);
        } else {
          setTimeout(() => setShowChoices(true), 500);
        }
      }
    }
  }, [charIndex, textIndex, currentLocation, explorationCompleted]);

  const handleTextClick = () => {
    if (explorationCompleted) {
      if (showPopup) {
        setShowPopup(false);
        navigate("/home");
      } else {
        setCurrentLocation(exploreLocations[previousLocation?.name || "1층 복도"]);
        setExplorationCompleted(false);
        setTextIndex(0);
        setDisplayText("");
        setCharIndex(0);
        setShowChoices(false);
      }
      return;
    }
    
    const totalTexts = currentLocation.description ? currentLocation.description.split("|") : [];
    if (charIndex < (totalTexts[textIndex]?.length || 0)) {
      setDisplayText(totalTexts[textIndex]);
      setCharIndex(totalTexts[textIndex].length);
    } else if (textIndex < totalTexts.length - 1) {
      setTextIndex(prev => prev + 1);
      setDisplayText("");
      setCharIndex(0);
      setShowChoices(false);
    }
  };

  const handleChoiceClick = (choice) => {
    const cleanedChoice = typeof choice === "string" ? choice.replace("▶ ", "") : choice.text ? choice.text.replace("▶ ", "") : "";
    if (!cleanedChoice) return;
    
    if (cleanedChoice === "돌아간다.") {
      if (previousLocation) {
        setCurrentLocation(previousLocation);
        setPreviousLocation(null);
      }
    } else if (exploreLocations[cleanedChoice]) {
      setPreviousLocation(currentLocation);
      setCurrentLocation(exploreLocations[cleanedChoice]);
      setTextIndex(0);
      setDisplayText("");
      setCharIndex(0);
      setShowChoices(false);
    }
    
    if (choice.triggersEvent) {
      setIsExploring(true);
      const result = performExploration();
      let rewardText = result.text;
      
      if (result.rewards) {
        const rewardItem = result.rewards.find(r => Math.random() < r.probability);
        if (rewardItem) {
          rewardText = rewardText.replace("{reward}", rewardItem.item);
        }
      }
      
      setTextIndex(0);
      setDisplayText(rewardText);
      setCharIndex(0);
      setShowChoices(false);
      setExplorationCompleted(true);
      
      if (result !== exploreResults.fail) {
        setTimeout(() => setShowPopup(true), 1000);
      }
    }
  };

  const performExploration = () => {
    const successRate = Math.random();
    if (successRate > 0.5) {
      const successType = Math.random();
      if (successType < 0.6) return exploreResults.success1;
      if (successType < 0.95) return exploreResults.success2;
      return exploreResults.success3;
    }
    return exploreResults.fail;
  };

  return (
    <div className={style.container}>
      <div className={style.where}>{Object.keys(exploreLocations).find(key => exploreLocations[key] === currentLocation)}</div>
      <div className={style.imgBox}>
        <img src={currentLocation.image} alt={currentLocation} />
      </div>
      <div className={`${style.textBox}`} onClick={handleTextClick}>
        <p>{displayText.split("\n").map((line, i) => <span key={i}>{line}<br/></span>)}</p>
        <div className={style.choiceBox}>
          {showChoices && currentLocation.choices?.map((choice, index) => (
            <button key={index} onClick={() => handleChoiceClick(choice)}>{typeof choice === "string" ? choice.replace("▶ ", "") : choice.text ? choice.text.replace("▶ ", "") : ""}</button>
          ))}
        </div>
        <img src={TextDone} alt="Text done" />
      </div>
      {showPopup && (
        <div className={style.popup}>
          <div className={style.popupContent}>조사가 종료되었습니다.<br /></div>
          <div class={style.btn}>
            <button>확인.</button>
          </div>
        </div>
      )}
    </div>
  );
}
