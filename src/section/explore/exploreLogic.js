import { exploreResults } from "./exploreData"; // 🔹 exploreResults 불러오기

export function performExploration() {
  const successRate = Math.random();
  if (successRate > 0.5) {
    const successType = Math.random();
    if (successType < 0.6) return getReward(exploreResults.success1);
    if (successType < 0.95) return getReward(exploreResults.success2);
    return getSpecialReward();
  }
  return exploreResults.fail.text;
}

function getReward(result) {
  let rewardText = result.text;
  result.rewards.forEach(reward => {
    if (Math.random() < reward.probability) {
      rewardText += ` | ${reward.item}을(를) 획득했다.`;
      if (reward.amount) rewardText += ` (${reward.amount}개)`;
    }
  });
  return rewardText;
}

function getSpecialReward() {
  let rewardText = exploreResults.success3.text;
  exploreResults.success3.rewards.forEach(reward => {
    if (Math.random() < reward.probability) {
      rewardText += ` | ${reward.item}을(를) 획득했다.`;
    }
  });
  return rewardText;
}