import React, { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MusicContext = createContext();

// 야 이거 일단... 나중에 해라. 로그인 버튼에 음악 재생 변수 넣어버려그냥

export const MusicProvider = ({ children }) => {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // 음악 재생 상태
  const location = useLocation();

  useEffect(() => {
    if (audio) {
      audio.pause();
    }

    let newAudio;

    if (location.pathname === "/explore") {
      newAudio = new Audio("/asset/sound/explore_music.mp3");
    } else {
      newAudio = new Audio("/asset/sound/public_music.mp3");
    }

    setAudio(newAudio);

    // 음악 자동 재생 대신, 버튼을 통해 재생하도록 설정
    return () => {
      if (newAudio) {
        newAudio.pause();
      }
    };
  }, [location]);

  const playMusic = () => {
    if (audio && !isPlaying) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Music play failed:", error);
      });
    }
  };

  return (
    <MusicContext.Provider value={{ audio, playMusic }}>
      {children}
      {/* 사용자 상호작용을 위한 버튼 */}
      {!isPlaying && (
        <button onClick={playMusic} style={{ position: "fixed", bottom: 10, right: 10 }}>
          Play Music
        </button>
      )}
    </MusicContext.Provider>
  );
};
