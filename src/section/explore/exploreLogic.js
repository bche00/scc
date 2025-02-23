// exploreLogic.js
import { exploreResults } from "./exploreResults";

export function performExploration() {
  const successRate = Math.random();
  if (successRate > 0.5) {
    const successType = Math.random();
    let result;
    if (successType < 0.6) result = exploreResults.success1;
    else if (successType < 0.95) result = exploreResults.success2;
    else result = exploreResults.success3;

    // 보상 선택
    let reward = "";
    if (result.rewards && result.rewards.length > 0) {
      let rand = Math.random();
      let cumulative = 0;
      for (const r of result.rewards) {
        cumulative += r.probability;
        if (rand < cumulative) {
          reward = r.item;
          break;
        }
      }
      if (!reward) reward = result.rewards[result.rewards.length - 1].item;
    }
    // 각 segment에서 {reward}를 치환
    const newSegments = result.segments.map(segment =>
      segment.replace("{reward}", reward)
    );
    return {
      type: "success",
      segments: newSegments
    };
  } else {
    const failResult = exploreResults.fail;
    // 실패일 경우, segments 중 하나를 무작위 선택하여 단일 segment로 반환
    const randomIndex = Math.floor(Math.random() * failResult.segments.length);
    return {
      type: "fail",
      segments: [failResult.segments[randomIndex]]
    };
  }
}
