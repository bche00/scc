import { exploreResults } from "./exploreData";

export function performExploration() {
  const successRate = Math.random();
  if (successRate > 0.5) {
    const successType = Math.random();
    if (successType < 0.6) return getReward(exploreResults.success1);
    if (successType < 0.95) return getReward(exploreResults.success2);
    return getReward(exploreResults.success3);
  }
  return getRandomFailMessage();
}

function getReward(result) {
  let rewardText = result.text.split("|")[0];
  let rewardItem = "";
  result.rewards.forEach(reward => {
    if (Math.random() < reward.probability) {
      rewardItem = reward.item;
    }
  });
  return rewardText + "|" + result.text.replace("{reward}", rewardItem);
}

function getRandomFailMessage() {
  const failMessages = exploreResults.fail.text;
  return failMessages[Math.floor(Math.random() * failMessages.length)];
}
