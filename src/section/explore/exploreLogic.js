// exploreLogic.js
import { exploreResults } from "./exploreResults";

export function performExploration() {
  const rand = Math.random();

  if (rand < 0.3) {
    // 성공
    const successOptions = ["success1", "success2", "success3"];
    const selectedKey = successOptions[Math.floor(Math.random() * successOptions.length)];
    const selectedResult = { ...exploreResults[selectedKey] };

    const rewardPool = selectedResult.rewards;
    const rewardRand = Math.random();
    let accumulated = 0;
    for (const reward of rewardPool) {
      accumulated += reward.probability;
      if (rewardRand <= accumulated) {
        selectedResult.segments = selectedResult.segments.map(segment =>
          segment.replace("{reward}", reward.item)
        );
        break;
      }
    }

    return selectedResult;
  } else {
    // 실패
    const failResult = exploreResults.fail;
    const randomSegment = failResult.segments[Math.floor(Math.random() * failResult.segments.length)];
    return {
      type: "fail",
      segments: [randomSegment]
    };
  }
}
