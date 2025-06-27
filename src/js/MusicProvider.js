import React, { createContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import soundOn from "../asset/util/sound_on.png";
import soundOff from "../asset/util/sound_off.png";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const publicAudioRef = useRef(null);
  const exploreAudioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrack, setCurrentTrack] = useState("public"); // "public" | "explore"

  // 공용 음악 초기화 (최초 1회만)
  useEffect(() => {
    const publicAudio = new Audio("/asset/sound/public_music.mp3");
    publicAudio.loop = true;
    publicAudio.volume = 0.4;
    publicAudioRef.current = publicAudio;

    // 자동재생 제한으로 play는 따로 컨트롤
    if (isPlaying && currentPath !== "/explore") {
      //publicAudio.play().catch((err) => console.warn("공용 음악 재생 실패:", err));
    }

    return () => {
      publicAudio.pause();
    };
  }, []);

  useEffect(() => {
  const handleFirstClick = () => {
    if (isPlaying) {
      if (currentTrack === "explore" && exploreAudioRef.current) {
        exploreAudioRef.current.play().catch(() => {});
      } else if (currentTrack === "public" && publicAudioRef.current) {
        publicAudioRef.current.play().catch(() => {});
      }
    }

    // 딱 한 번만 실행하고 제거
    document.removeEventListener("click", handleFirstClick);
  };

  // 첫 클릭 이벤트 감지
  document.addEventListener("click", handleFirstClick);

  return () => {
    document.removeEventListener("click", handleFirstClick);
  };
}, [isPlaying, currentTrack]);


  // explore 음악만 경로 바뀔 때 컨트롤
  useEffect(() => {
    if (currentPath === "/explore") {
      if (!exploreAudioRef.current) {
        const exploreAudio = new Audio("/asset/sound/explore_music.mp3");
        exploreAudio.loop = true;
        exploreAudio.volume = 0.4;
        exploreAudioRef.current = exploreAudio;
      }

      publicAudioRef.current?.pause();
      //exploreAudioRef.current.play().catch((err) => console.warn("탐사 음악 재생 실패:", err));
      setCurrentTrack("explore");
    } else {
      exploreAudioRef.current?.pause();

      if (isPlaying) {
        //publicAudioRef.current?.play().catch((err) => console.warn("공용 음악 재생 실패:", err));
        setCurrentTrack("public");
      }
    }
  }, [currentPath]);

  // 🎚 음악 토글
  const toggleMusic = () => {
    if (currentTrack === "explore" && exploreAudioRef.current) {
      if (isPlaying) {
        exploreAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        exploreAudioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else if (currentTrack === "public" && publicAudioRef.current) {
      if (isPlaying) {
        publicAudioRef.current.pause();
        setIsPlaying(false);
      } else {
        publicAudioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}

      {/* explore 라우터에서만 노출 */}
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
          }}/>
      )}
    </MusicContext.Provider>
  );
};
