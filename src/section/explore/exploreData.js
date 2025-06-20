export const exploreLocations = {
  "1층 복도": {
    image: "/asset/img/hallway.png",
    description: "시간이 얼마나 흘렀는지 잘 모르겠다.\n어딜 둘러볼까?",
    choices: ["▶ 1층", "▶ 2층", "▶ 3층", "▶ 외부"]
  },
  "1층": {
    image: "/asset/img/hallway.png",
    description: "교문은 굳게 닫혀있고, 창 밖은 어둡기만하다.",
    choices: ["▶ 교무실", "▶ 방송실", "▶ 행정실", "▶ 보건실", "▶ 복도(1층)", "▶ 돌아간다."]
  },
  "교무실": {
    image: "/asset/img/hallway.png",
    description: "잠겨있다.",
    choices: ["▶ 돌아간다."]
  },
  "방송실": {
    image: "/asset/img/broadcasting.png",
    description: "여러 방송 기기들이 구비되어있다. 서늘한 기운이 감돈다.",
    choices: ["▶ 모니터를 살펴본다.", "▶ 마이크를 살펴본다.", "▶ 카메라를 살펴본다.", "▶ 돌아간다."]
  },
  "모니터를 살펴본다.": {
    image: "/asset/img/broadcasting.png",
    description:
      "구식으로 보이는 낡은 모니터들이다.|한참 오래 전 부터 사람의 손을 타지 않은 듯 화면엔 먼지가 쌓여있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
  "마이크를 살펴본다.": {
    image: "/asset/img/broadcasting.png",
    description:
      "먼지가 쌓이는 것을 방지하려는 듯 천이 덮여있다.",
    choices: [
      { text: "▶ 작동시켜본다."},
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
  "작동시켜본다.": {
    image: "/asset/img/broadcasting.png",
    description:
      "케케묵은 냄새만 풍길 뿐, 전원은 켜지지 않는다.",
    choices: [
      { text: "▶ 돌아간다." }
    ]
  },
  "카메라를 살펴본다.": {
    image: "/asset/img/broadcasting.png",
    description:
      "사용감이 상당히 느껴지는 카메라 장비다.\n덮개가 렌즈를 가리고 있다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
    "행정실": {
    image: "/asset/img/office.png",
    description: "사무용 책상과 모니터들이 즐비하다.",
    choices: ["▶ 게시판을 살펴본다.", "▶ 사무용 책상을 살펴본다.", "▶ 사물함을 살펴본다.", "▶ 돌아간다."]
  },
    "게시판을 살펴본다.": {
    image: "/asset/img/office.png",
    description: "알아볼 수 없을 만큼 복잡한 내용의 문서들이 다닥다닥 붙어 있다.\n곳곳에 압정도 몇 개 튀어나와있다.",
    choices: [
      { text: "▶ 압정을 건드려본다."},
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
      ]
  },
    "압정을 건드려본다.": {
    image: "/asset/img/office.png",
    description:
      "아야!|HP가 2 정도 깎인 기분이 든다.|다행히 HP 시스템이 없어 별다른 일은 일어나지 않았다.",
    choices: [
      { text: "▶ 돌아간다." }
    ]
  },
      "사물함을 살펴본다.": {
    image: "/asset/img/office.png",
    description: "대부분 잠겨있다.|…개중엔 끔찍한 냄새가 나는 사물함도 몇 있는데, 굳이 건들진 말자.",
    choices: [
      { text: "▶ 그럼에도 조사한다.", triggersEvent: true},
      { text: "▶ 돌아간다." }
      ]
  },
      "보건실": {
    image: "/asset/img/health_Room.png",
    description: "약품 냄새가 코를 찌른다. 내부는 깨끗해 보인다.",
    choices: ["▶ 침대를 살펴본다.", "▶ 서랍을 살펴본다.", "▶ 트레이를 살펴본다.", "▶ 돌아간다."]
  },
      "침대를 살펴본다.": {
    image: "/asset/img/health_Room.png",
    description: "어떤 침대의 커튼을 들춰볼까?",
    choices: ["▶ 첫 번째 침대", "▶ 두 번째 침대", "▶ 세 번째 침대", "▶ 돌아간다."]
  },
    "첫 번째 침대": {
    image: "/asset/img/health_Room.png",
    description: "첫 번째 침대의 커튼을 들춰봤다.|….|…….|침구 위엔 먼지만 떠다닐 뿐 아무것도 없었다.",
    choices: ["▶ 두 번째 침대", "▶ 세 번째 침대.", "▶ 돌아간다."]
  },
    "두 번째 침대": {
    image: "/asset/img/health_Room.png",
    description: "두 번째 침대의 커튼을 들춰봤다.|아무도 없지만, 잘 정리된 이불 한 구석이 조금 불룩하다.",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
    "세 번째 침대": {
    image: "/asset/img/health_Room.png",
    description: "커튼 너머로 긴 머리의 여자 인영이 보인다.|….|…………….|들춰볼까?",
    choices: [
      { text: "▶ 조사한다.", triggersEvent: true },
      { text: "▶ 돌아간다." }
    ]
  },
    "서랍을 살펴본다.": {
  image: "/asset/img/health_Room.png",
  description: "치료를 받은 학생들의 명단과, 보건 선생님의것으로 보이는 서류 몇 가지가 가지런히 정리되어 있다.|…중간에는 시말서도 보인다.",
  choices: [
    { text: "▶ 조사한다.", triggersEvent: true},
    { text: "▶ 돌아간다." }
    ]
},
    "트레이를 살펴본다.": {
  image: "/asset/img/health_Room.png",
  description: "트레이 안에는 각종 의약품과 붕대 등의 응급처치 용품들이 들어있다.|다행히 학교 내부엔 친구들이 다칠 만한 경우들은 몇 없으니 사용할 일은 없을 것이다.",
  choices: [
    { text: "▶ 조사한다.", triggersEvent: true},
    { text: "▶ 돌아간다." }
    ]
  },
  "복도(1층)": {
    image: "/asset/img/hallway.png",
    description: "1층의 복도다.|주변엔 아무도 없다. 고요하다.",
    choices: ["▶ 창문을 살펴본다.", "▶ 화장실로 이동한다.", "▶ 돌아간다."]
  },
  "창문을 살펴본다.": {
    image: "/asset/img/hallway.png",
    description: "창 밖은 칠흑같은 어둠 뿐이다.|시간도 날씨도 알 수 없다.",
    choices: [
      { text: "▶ 열어본다.", coinPenalty: 2, goTo: "열어본다" },
      { text: "▶ 돌아간다." }
      ]
  },
    "열어본다": {
    image: "/asset/img/hallway.png",
    description: "…문을 열었다.|바람 한 점 불지 않는다. 별다른 특이사항은 없는 것 같……|…아!|손이 미끄러져 무언가 떨어트리고 말았다.|2코인을 잃었다.",
    choices: ["▶ 돌아간다."]
  },
};
