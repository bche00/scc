export const exploreLocations = {
  "1층 복도": {
    image: "/asset/img/class_room.png",
    description: "시간이 얼마나 흘렀는지 잘 모르겠다.\n어딜 둘러볼까?",
    choices: ["▶ 1층", "▶ 2층", "▶ 3층", "▶ 외부"]
  },
  "1층": {
    image: "/asset/img/class_room.png",
    description: "교문은 굳게 닫혀있고, 창 밖은 어둡기만하다.",
    choices: ["▶ 교무실", "▶ 방송실", "▶ 행정실", "▶ 보건실", "▶ 복도", "▶ 돌아간다."]
  },
  "교무실": {
    image: "/asset/img/class_room.png",
    description: "잠겨있다.",
    choices: ["▶ 돌아간다."]
  },
  "방송실": {
    image: "/asset/img/class_room.png",
    description: "여러 방송 기기들이 구비되어있다. 서늘한 기운이 감돈다.",
    choices: ["▶ 모니터를 살펴본다.", "▶ 마이크를 살펴본다.", "▶ 카메라를 살펴본다.", "▶ 돌아간다."]
  },
  "모니터를 살펴본다.": {
    image: "/asset/img/class_room.png",
    description: "구식으로 보이는 낡은 모니터들이다.|한참 오래 전 부터 사람의 손을 타지 않은 듯 화면엔 먼지가 쌓여있다.",
    choices: [
      { text: "조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  }
};