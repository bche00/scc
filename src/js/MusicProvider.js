// MusicProvider.js
import React, { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import soundOn from "../asset/util/sound_on.png";
import soundOff from "../asset/util/sound_off.png";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentPath, setCurrentPath] = useState("");
  const location = useLocation();

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  // 음악 교체 로직
  useEffect(() => {
    if (audio) {
      audio.pause();
    }

    const newAudio = new Audio(
      currentPath === "/explore"
        ? "/asset/sound/explore_music.mp3"
        : "/asset/sound/public_music.mp3"
    );

    newAudio.loop = true;
    newAudio.volume = 0.4;

    // 사용자가 꺼두지 않은 경우만 재생 시도
    if (isPlaying) {
      newAudio.play().catch((err) => {
        console.error("자동 재생 실패 (브라우저 정책일 수 있음):", err);
      });
    }

    setAudio(newAudio);

    return () => {
      newAudio.pause();
    };
  }, [currentPath]);

  // 최초 사용자 클릭 시 재생 시도
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audio) return;

      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("첫 클릭 재생 실패:", err);
        });

      // 더 이상 이 이벤트 안 듣게
      document.removeEventListener("click", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
    };
  }, [audio]);

  const toggleMusic = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("재생 실패:", e);
      });
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}

      {/* /explore 라우터 전용 */}
      {currentPath === "/explore" && (
        <img
          src={isPlaying ? soundOn : soundOff}
          alt="toggle sound"
          onClick={toggleMusic}
          style={{
            position: "fixed",
            bottom: "10px",
            left: "10px",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            zIndex: 9999,
          }}
        />
      )}
    </MusicContext.Provider>
  );
};
