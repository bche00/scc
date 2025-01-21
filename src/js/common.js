console.log('뭐 해?');

// 클릭 사운드
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let buffer;

fetch('/asset/sound/click_sound.mp3')
  .then(response => response.arrayBuffer())
  .then(data => audioContext.decodeAudioData(data))
  .then(decodedData => {
    buffer = decodedData;
  });

document.addEventListener('click', () => {
  if (!buffer) return;
  let source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
});


// 100vh 모바일 ui(주소창, 하단바 등)에따라 유동적으로
const updateViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

updateViewportHeight();

window.addEventListener("resize", updateViewportHeight);
