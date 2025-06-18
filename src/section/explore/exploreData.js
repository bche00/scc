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
    description:
      "구식으로 보이는 낡은 모니터들이다.|한참 오래 전 부터 사람의 손을 타지 않은 듯 화면엔 먼지가 쌓여있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
  "마이크를 살펴본다.": {
    image: "/asset/img/class_room.png",
    description:
      "먼지가 쌓이는 것을 방지하려는 듯 천이 덮여있다.",
    choices: [
      { text: "▶ 작동시켜본다.", coinPenalty: 2},
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
  "작동시켜본다.": {
    image: "/asset/img/class_room.png",
    description:
      "케케묵은 냄새만 풍길 뿐, 전원은 켜지지 않는다.",
    choices: [
      { text: "▶ 돌아간다." }
    ]
  },
  "카메라를 살펴본다.": {
    image: "/asset/img/class_room.png",
    description:
      "사용감이 상당히 느껴지는 카메라 장비다.\n덮개가 렌즈를 가리고 있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
    "행정실": {
    image: "/asset/img/class_room.png",
    description: "사무용 책상과 모니터들이 즐비하다.",
    choices: ["▶ 게시판을 살펴본다.", "▶ 사무용 책상을 살펴본다.", "▶ 사물함을 살펴본다.", "▶ 돌아간다."]
  },
    "게시판을 살펴본다.": {
    image: "/asset/img/class_room.png",
    description: "알아볼 수 없을 만큼 복잡한 내용의 문서들이 다닥다닥 붙어 있다.\n곳곳에 압정도 몇 개 튀어나와있다.",
    choices: [
      { text: "▶ 압정을 건드려본다." },
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
      ]
  },
    "압정을 건드려본다.": {
    image: "/asset/img/class_room.png",
    description:
      "아야!|HP가 2 정도 깎인 기분이 든다.|다행히 HP 시스템이 없어 별다른 일은 일어나지 않았다.",
    choices: [
      { text: "▶ 돌아간다." }
    ]
  },
      "사물함을 살펴본다.": {
    image: "/asset/img/class_room.png",
    description: "대부분 잠겨있다.|…개중엔 끔찍한 냄새가 나는 사물함도 몇 있는데, 굳이 건들진 말자.",
    choices: [
      { text: "▶ 그럼에도 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
      ]
  },
};
