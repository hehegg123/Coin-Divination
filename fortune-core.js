import { BOOK_RULESET } from "./book-rules.js";
import { getHexagramRule } from "./yijing-rules.js";
import {
  BRANCH_CLASH,
  BRANCH_CLIMATE_EFFECTS,
  BRANCH_COMBINES,
  BRANCH_HARM,
  BRANCH_PUNISH,
  BRANCH_SEASON_GROUP,
  DAYMASTER_SEASONAL_RULES,
  FAVORABLE_PATTERN_GUIDE,
  HIDDEN_STEMS,
  HIDDEN_STEM_WEIGHTS,
  HEALTH_ELEMENT_MAP,
  NAYIN_60,
  PALACE_LABELS,
  PILLAR_QI_WEIGHTS,
  SIX_RELATIVE_FOCUS,
  STEM_CLIMATE_EFFECTS,
  STEM_CLIMATE_MODES,
  STEM_COMBINES,
  STEM_LU_BRANCH,
  THREE_HARMONY,
  THREE_MEETING,
  TOMB_BRANCH_DETAILS,
} from "./bazi-rules.js";

const STEMS = [
  { key: "jia", label: "甲", element: "wood", yinYang: "yang" },
  { key: "yi", label: "乙", element: "wood", yinYang: "yin" },
  { key: "bing", label: "丙", element: "fire", yinYang: "yang" },
  { key: "ding", label: "丁", element: "fire", yinYang: "yin" },
  { key: "wu", label: "戊", element: "earth", yinYang: "yang" },
  { key: "ji", label: "己", element: "earth", yinYang: "yin" },
  { key: "geng", label: "庚", element: "metal", yinYang: "yang" },
  { key: "xin", label: "辛", element: "metal", yinYang: "yin" },
  { key: "ren", label: "壬", element: "water", yinYang: "yang" },
  { key: "gui", label: "癸", element: "water", yinYang: "yin" },
];

const BRANCHES = [
  { key: "zi", label: "子", element: "water" },
  { key: "chou", label: "丑", element: "earth" },
  { key: "yin", label: "寅", element: "wood" },
  { key: "mao", label: "卯", element: "wood" },
  { key: "chen", label: "辰", element: "earth" },
  { key: "si", label: "巳", element: "fire" },
  { key: "wu", label: "午", element: "fire" },
  { key: "wei", label: "未", element: "earth" },
  { key: "shen", label: "申", element: "metal" },
  { key: "you", label: "酉", element: "metal" },
  { key: "xu", label: "戌", element: "earth" },
  { key: "hai", label: "亥", element: "water" },
];

const ELEMENT_LABELS = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

const ELEMENT_SUPPORT = {
  wood: "water",
  fire: "wood",
  earth: "fire",
  metal: "earth",
  water: "metal",
};

const ELEMENT_OUTPUT = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

const ELEMENT_CONTROL = {
  wood: "earth",
  fire: "metal",
  earth: "water",
  metal: "wood",
  water: "fire",
};

const ELEMENT_GENERATED_BY = Object.fromEntries(
  Object.entries(ELEMENT_SUPPORT).map(([element, supporter]) => [supporter, element]),
);

const SEASON_SUPPORT = {
  yin: "wood",
  mao: "wood",
  chen: "earth",
  si: "fire",
  wu: "fire",
  wei: "earth",
  shen: "metal",
  you: "metal",
  xu: "earth",
  hai: "water",
  zi: "water",
  chou: "earth",
};

const TRIGRAMS = {
  "111": { key: "qian", name: "乾", title: "天行健", element: "metal", reading: "阳气足，适合主动推进、决策、亮相。" },
  "000": { key: "kun", name: "坤", title: "地势厚", element: "earth", reading: "重承接与整理，适合稳住节奏、配合推进。" },
  "100": { key: "zhen", name: "震", title: "雷启势", element: "wood", reading: "事情会被启动，但不宜犹疑太久。" },
  "011": { key: "xun", name: "巽", title: "风入局", element: "wood", reading: "适合沟通渗透、协商、写作与信息交换。" },
  "010": { key: "kan", name: "坎", title: "水行险", element: "water", reading: "有变量与不确定，先看清再行动更稳。" },
  "101": { key: "li", name: "离", title: "火见明", element: "fire", reading: "利表达、展示、审美、被看见，但忌心急。" },
  "001": { key: "gen", name: "艮", title: "山止念", element: "earth", reading: "适合收束、复盘、立界限，不宜硬推。" },
  "110": { key: "dui", name: "兑", title: "泽悦人", element: "metal", reading: "利社交与反馈，也提醒注意口舌是非。" },
};

const COIN_OPTIONS = [
  { value: 6, label: "3反 0正", nature: "老阴", symbol: "阴变" },
  { value: 7, label: "1正 2反", nature: "少阳", symbol: "阳" },
  { value: 8, label: "2正 1反", nature: "少阴", symbol: "阴" },
  { value: 9, label: "3正 0反", nature: "老阳", symbol: "阳变" },
];

const MONTH_BOUNDARIES = [
  { name: "小寒", month: 1, day: 6, branchIndex: 1 },
  { name: "立春", month: 2, day: 4, branchIndex: 2 },
  { name: "惊蛰", month: 3, day: 6, branchIndex: 3 },
  { name: "清明", month: 4, day: 5, branchIndex: 4 },
  { name: "立夏", month: 5, day: 6, branchIndex: 5 },
  { name: "芒种", month: 6, day: 6, branchIndex: 6 },
  { name: "小暑", month: 7, day: 7, branchIndex: 7 },
  { name: "立秋", month: 8, day: 8, branchIndex: 8 },
  { name: "白露", month: 9, day: 8, branchIndex: 9 },
  { name: "寒露", month: 10, day: 8, branchIndex: 10 },
  { name: "立冬", month: 11, day: 7, branchIndex: 11 },
  { name: "大雪", month: 12, day: 7, branchIndex: 0 },
];

function datePartsInTimeZone(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function localDateToUtc(dateString, timeString, timeZone) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hour, minute] = timeString.split(":").map(Number);
  let guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  for (let index = 0; index < 4; index += 1) {
    const parts = datePartsInTimeZone(guess, timeZone);
    const desiredUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
    const actualUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    const delta = desiredUtc - actualUtc;
    if (delta === 0) break;
    guess = new Date(guess.getTime() + delta);
  }

  return guess;
}

function pillarFromIndex(index) {
  const normalized = ((index % 60) + 60) % 60;
  return {
    stem: STEMS[normalized % 10],
    branch: BRANCHES[normalized % 12],
    cycleIndex: normalized,
    label: `${STEMS[normalized % 10].label}${BRANCHES[normalized % 12].label}`,
  };
}

function toCycleIndexFromOne(positionOneBased) {
  return ((positionOneBased - 1) % 60 + 60) % 60;
}

function getYearPillar(parts) {
  const afterLichun = parts.month > 2 || (parts.month === 2 && parts.day >= 4);
  const solarYear = afterLichun ? parts.year : parts.year - 1;
  return pillarFromIndex(((solarYear - 1984) % 60 + 60) % 60);
}

function getMonthBranchIndex(parts) {
  const marker = parts.month * 100 + parts.day;
  let active = 1;
  for (const boundary of MONTH_BOUNDARIES) {
    const boundaryMarker = boundary.month * 100 + boundary.day;
    if (marker >= boundaryMarker) active = boundary.branchIndex;
  }
  return active;
}

function getMonthStemStart(yearStemIndex) {
  if ([0, 5].includes(yearStemIndex)) return 2;
  if ([1, 6].includes(yearStemIndex)) return 4;
  if ([2, 7].includes(yearStemIndex)) return 6;
  if ([3, 8].includes(yearStemIndex)) return 8;
  return 0;
}

function getMonthPillar(parts) {
  const yearPillar = getYearPillar(parts);
  const monthBranchIndex = getMonthBranchIndex(parts);
  const sequenceOffset = (monthBranchIndex - 2 + 12) % 12;
  const stemIndex = (getMonthStemStart(yearPillar.cycleIndex % 10) + sequenceOffset) % 10;

  return {
    stem: STEMS[stemIndex],
    branch: BRANCHES[monthBranchIndex],
    cycleIndex: stemIndex,
    label: `${STEMS[stemIndex].label}${BRANCHES[monthBranchIndex].label}`,
  };
}

function daysSince1900(date) {
  const start = Date.UTC(1900, 0, 1);
  const target = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.round((target - start) / 86400000);
}

function getDayPillar(parts) {
  const adjustedUtcDate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  if (parts.hour >= 23) adjustedUtcDate.setUTCDate(adjustedUtcDate.getUTCDate() + 1);
  const offset = daysSince1900(adjustedUtcDate);
  return pillarFromIndex(toCycleIndexFromOne(offset + 1));
}

function getHourBranchIndex(hour) {
  if (hour === 23 || hour === 0) return 0;
  return Math.floor((hour + 1) / 2);
}

function getHourStemStart(dayStemIndex) {
  if ([0, 5].includes(dayStemIndex)) return 0;
  if ([1, 6].includes(dayStemIndex)) return 2;
  if ([2, 7].includes(dayStemIndex)) return 4;
  if ([3, 8].includes(dayStemIndex)) return 6;
  return 8;
}

function getHourPillar(parts, dayPillar) {
  const hourBranchIndex = getHourBranchIndex(parts.hour);
  const stemIndex = (getHourStemStart(dayPillar.cycleIndex % 10) + hourBranchIndex) % 10;
  return {
    stem: STEMS[stemIndex],
    branch: BRANCHES[hourBranchIndex],
    cycleIndex: stemIndex,
    label: `${STEMS[stemIndex].label}${BRANCHES[hourBranchIndex].label}`,
  };
}

function scoreElementRelation(selfElement, otherElement) {
  if (selfElement === otherElement) return 10;
  if (ELEMENT_SUPPORT[selfElement] === otherElement) return 8;
  if (ELEMENT_OUTPUT[selfElement] === otherElement) return -2;
  if (ELEMENT_CONTROL[selfElement] === otherElement) return 4;
  if (ELEMENT_CONTROL[otherElement] === selfElement) return -8;
  return 0;
}

function uniqueElements(elements) {
  return [...new Set(elements)];
}

function uniqueStrings(items) {
  return [...new Set(items.filter(Boolean))];
}

function scoreStrengthComponent(dayMasterElement, otherElement) {
  if (dayMasterElement === otherElement) return 1.2;
  if (ELEMENT_SUPPORT[dayMasterElement] === otherElement) return 1;
  if (ELEMENT_GENERATED_BY[dayMasterElement] === otherElement) return -0.7;
  if (ELEMENT_CONTROL[dayMasterElement] === otherElement) return -0.85;
  if (ELEMENT_CONTROL[otherElement] === dayMasterElement) return -0.45;
  return 0;
}

function roundValue(value) {
  return Math.round(value * 100) / 100;
}

function controllerElement(element) {
  return Object.keys(ELEMENT_CONTROL).find((key) => ELEMENT_CONTROL[key] === element) || "earth";
}

function orderedPillars(input) {
  if (Array.isArray(input)) {
    return input.map((pillar, index) => ({
      key: ["year", "month", "day", "hour"][index] || `slot${index}`,
      pillar,
    }));
  }

  return ["year", "month", "day", "hour"]
    .filter((key) => input[key])
    .map((key) => ({ key, pillar: input[key] }));
}

function countElements(input, options = {}) {
  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const includeDayStem = options.includeDayStem ?? true;

  for (const { key, pillar } of orderedPillars(input)) {
    const qiWeight = PILLAR_QI_WEIGHTS[key] || { stem: 0.8, branch: 0.8 };
    if (includeDayStem || key !== "day") {
      counts[pillar.stem.element] += key === "day" ? 1.15 : qiWeight.stem;
    }

    const branchBaseWeight = qiWeight.branch * 0.32;
    counts[pillar.branch.element] += branchBaseWeight;

    const hiddenStems = hiddenStemObjects(pillar.branch.key);
    hiddenStems.forEach((stem, index) => {
      const hiddenWeight = qiWeight.branch * (HIDDEN_STEM_WEIGHTS[index] || 0.2);
      counts[stem.element] += hiddenWeight;
    });
  }

  return Object.fromEntries(Object.entries(counts).map(([element, value]) => [element, roundValue(value)]));
}

function seasonPhaseForElement(seasonElement, element) {
  if (element === seasonElement) return { label: "旺", score: 1.8 };
  if (ELEMENT_OUTPUT[seasonElement] === element) return { label: "相", score: 1.1 };
  if (ELEMENT_SUPPORT[seasonElement] === element) return { label: "休", score: 0.2 };
  if (ELEMENT_CONTROL[seasonElement] === element) return { label: "囚", score: -0.9 };
  if (controllerElement(seasonElement) === element) return { label: "死", score: -1.35 };
  return { label: "平", score: 0 };
}

function relationBucket(dayStem, otherStem) {
  const relation = relationType(dayStem, otherStem);
  if (["比肩", "劫财"].includes(relation)) return { relation, bucket: "peer" };
  if (["偏印", "正印"].includes(relation)) return { relation, bucket: "resource" };
  if (["食神", "伤官"].includes(relation)) return { relation, bucket: "output" };
  if (["偏财", "正财"].includes(relation)) return { relation, bucket: "wealth" };
  if (["七杀", "正官"].includes(relation)) return { relation, bucket: "authority" };
  return { relation, bucket: "neutral" };
}

function collectRelationInfluence(pillars) {
  const dayStem = pillars.day.stem;
  const totals = {
    peer: 0,
    resource: 0,
    output: 0,
    wealth: 0,
    authority: 0,
  };
  const relationCounts = {
    比肩: 0,
    劫财: 0,
    食神: 0,
    伤官: 0,
    偏财: 0,
    正财: 0,
    七杀: 0,
    正官: 0,
    偏印: 0,
    正印: 0,
  };
  const relationSources = [];

  for (const { key, pillar } of orderedPillars(pillars)) {
    const qiWeight = PILLAR_QI_WEIGHTS[key] || { stem: 0.8, branch: 0.8 };
    if (key !== "day") {
      const visible = relationBucket(dayStem, pillar.stem);
      totals[visible.bucket] += qiWeight.stem;
      relationCounts[visible.relation] += qiWeight.stem;
      relationSources.push({ relation: visible.relation, bucket: visible.bucket, weight: qiWeight.stem, source: `${key}-stem` });
    }

    hiddenStemObjects(pillar.branch.key).forEach((stem, index) => {
      const hidden = relationBucket(dayStem, stem);
      const weight = qiWeight.branch * (HIDDEN_STEM_WEIGHTS[index] || 0.2);
      totals[hidden.bucket] += weight;
      relationCounts[hidden.relation] += weight;
      relationSources.push({ relation: hidden.relation, bucket: hidden.bucket, weight, source: `${key}-branch-${index}` });
    });
  }

  return {
    totals: Object.fromEntries(Object.entries(totals).map(([bucket, value]) => [bucket, roundValue(value)])),
    relationCounts: Object.fromEntries(Object.entries(relationCounts).map(([relation, value]) => [relation, roundValue(value)])),
    relationSources,
  };
}

function calculateRootScore(pillars) {
  const dayStem = pillars.day.stem;
  const resourceElement = ELEMENT_SUPPORT[dayStem.element];
  let rootScore = 0;
  let rootCount = 0;

  for (const { key, pillar } of orderedPillars(pillars)) {
    const branchWeight = (PILLAR_QI_WEIGHTS[key] || { branch: 0.8 }).branch;
    hiddenStemObjects(pillar.branch.key).forEach((stem, index) => {
      const weight = branchWeight * (HIDDEN_STEM_WEIGHTS[index] || 0.2);
      if (stem.element === dayStem.element) {
        rootScore += weight * (index === 0 ? 1.3 : 1.05);
        rootCount += 1;
      } else if (stem.element === resourceElement) {
        rootScore += weight * 0.72;
      }
    });

    if (pillar.branch.key === STEM_LU_BRANCH[dayStem.key]) {
      rootScore += 1.15;
      rootCount += 1;
    }
  }

  return {
    rootScore: roundValue(rootScore),
    rootCount,
  };
}

function calculateClimateState(pillars) {
  let temperature = 0;
  let moisture = 0;

  for (const { key, pillar } of orderedPillars(pillars)) {
    const qiWeight = PILLAR_QI_WEIGHTS[key] || { stem: 0.8, branch: 0.8 };
    const stemEffect = STEM_CLIMATE_EFFECTS[pillar.stem.key];
    const branchEffect = BRANCH_CLIMATE_EFFECTS[pillar.branch.key];

    if (stemEffect) {
      temperature += stemEffect.temperature * (key === "day" ? 1.05 : qiWeight.stem);
      moisture += stemEffect.moisture * (key === "day" ? 1.05 : qiWeight.stem);
    }

    if (branchEffect) {
      temperature += branchEffect.temperature * qiWeight.branch * 0.45;
      moisture += branchEffect.moisture * qiWeight.branch * 0.45;
    }

    hiddenStemObjects(pillar.branch.key).forEach((stem, index) => {
      const weight = qiWeight.branch * (HIDDEN_STEM_WEIGHTS[index] || 0.2) * 0.55;
      const effect = STEM_CLIMATE_EFFECTS[stem.key];
      if (!effect) return;
      temperature += effect.temperature * weight;
      moisture += effect.moisture * weight;
    });
  }

  return {
    temperature: roundValue(temperature),
    moisture: roundValue(moisture),
  };
}

function rankElements(scoreMap) {
  return Object.entries(scoreMap)
    .filter(([, value]) => value > 0)
    .sort((left, right) => right[1] - left[1])
    .map(([element]) => element);
}

function pushElementWeights(scoreMap, elements, weight) {
  for (const element of elements) {
    scoreMap[element] = (scoreMap[element] || 0) + weight;
  }
}

function monthCommandStem(pillars) {
  const hidden = hiddenStemObjects(pillars.month.branch.key);
  return hidden[0] || pillars.month.stem;
}

function dominantElement(counts) {
  return Object.entries(counts).sort((left, right) => right[1] - left[1])[0][0];
}

function balanceScore(counts) {
  const values = Object.values(counts);
  return Math.max(0, 12 - (Math.max(...values) - Math.min(...values)) * 2);
}

function getTrigram(lines) {
  return TRIGRAMS[lines.map((line) => (line === 7 || line === 9 ? 1 : 0)).join("")];
}

function buildHexagram(lines) {
  const lower = getTrigram(lines.slice(0, 3));
  const upper = getTrigram(lines.slice(3, 6));
  const rule = getHexagramRule(lower.key, upper.key);
  const changedLines = lines.map((value) => {
    if (value === 6) return 7;
    if (value === 9) return 8;
    return value;
  });
  const changedLower = getTrigram(changedLines.slice(0, 3));
  const changedUpper = getTrigram(changedLines.slice(3, 6));
  const changedRule = getHexagramRule(changedLower.key, changedUpper.key);
  const movingLines = lines
    .map((value, index) => ({ value, position: index + 1 }))
    .filter((line) => line.value === 6 || line.value === 9)
    .map((line) => line.position);
  const linePolarity = lines.map((value) => (value === 7 || value === 9 ? "yang" : "yin"));
  const changedLinePolarity = changedLines.map((value) => (value === 7 || value === 9 ? "yang" : "yin"));
  const lineScore = lines.reduce((score, value) => {
    if (value === 9) return score + 6;
    if (value === 7) return score + 4;
    if (value === 8) return score + 2;
    return score - 1;
  }, 0);

  return {
    upper,
    lower,
    changedUpper,
    changedLower,
    movingLines,
    lines: [...lines],
    changedLines,
    linePolarity,
    changedLinePolarity,
    title: rule ? `${rule.nameZh}卦` : `${upper.name}上${lower.name}下`,
    nameZh: rule?.nameZh || `${upper.name}上${lower.name}下`,
    nameEn: rule?.nameEn || `${upper.key} over ${lower.key}`,
    trigramTitleZh: `${upper.name}上${lower.name}下`,
    image: `${upper.title} / ${lower.title}`,
    reading: rule ? `${rule.judgmentZh}${rule.actionZh}` : `${upper.reading}${lower.reading}`,
    judgmentZh: rule?.judgmentZh || "",
    judgmentEn: rule?.judgmentEn || "",
    actionZh: rule?.actionZh || "",
    actionEn: rule?.actionEn || "",
    changedTitle: changedRule ? `${changedRule.nameZh}卦` : `${changedUpper.name}上${changedLower.name}下`,
    changedNameZh: changedRule?.nameZh || `${changedUpper.name}上${changedLower.name}下`,
    changedNameEn: changedRule?.nameEn || `${changedUpper.key} over ${changedLower.key}`,
    changedTrigramTitleZh: `${changedUpper.name}上${changedLower.name}下`,
    changedImage: `${changedUpper.title} / ${changedLower.title}`,
    changedReading: changedRule ? `${changedRule.judgmentZh}${changedRule.actionZh}` : `${changedUpper.reading}${changedLower.reading}`,
    changedJudgmentZh: changedRule?.judgmentZh || "",
    changedJudgmentEn: changedRule?.judgmentEn || "",
    changedActionZh: changedRule?.actionZh || "",
    changedActionEn: changedRule?.actionEn || "",
    rule,
    changedRule,
    score: lineScore - movingLines.length * 2,
  };
}

function relationType(dayStem, otherStem) {
  const samePolarity = dayStem.yinYang === otherStem.yinYang;
  if (dayStem.element === otherStem.element) {
    return samePolarity ? "比肩" : "劫财";
  }
  if (ELEMENT_SUPPORT[dayStem.element] === otherStem.element) {
    return samePolarity ? "偏印" : "正印";
  }
  if (ELEMENT_GENERATED_BY[dayStem.element] === otherStem.element) {
    return samePolarity ? "食神" : "伤官";
  }
  if (ELEMENT_CONTROL[dayStem.element] === otherStem.element) {
    return samePolarity ? "偏财" : "正财";
  }
  if (ELEMENT_CONTROL[otherStem.element] === dayStem.element) {
    return samePolarity ? "七杀" : "正官";
  }
  return "中和";
}

function stemByKey(key) {
  return STEMS.find((stem) => stem.key === key);
}

function relationToElement(dayStem, element) {
  return relationType(dayStem, STEMS.find((stem) => stem.element === element && stem.yinYang === dayStem.yinYang) || STEMS[0]);
}

function hiddenStemObjects(branchKey) {
  return (HIDDEN_STEMS[branchKey] || []).map(stemByKey).filter(Boolean);
}

function getNaYin(label) {
  return NAYIN_60[label] || "";
}

function visibleStemKeys(pillars) {
  return [pillars.year.stem.key, pillars.month.stem.key, pillars.day.stem.key, pillars.hour.stem.key];
}

function detectStructureForce(branchKeys, groups) {
  for (const group of groups) {
    const hitCount = group.branches.filter((branch) => branchKeys.includes(branch)).length;
    if (hitCount === 3) {
      return { type: "full", ...group };
    }
    if (hitCount === 2 && "center" in group && group.branches.filter((branch) => branchKeys.includes(branch)).includes(group.center)) {
      return { type: "half", ...group };
    }
  }
  return null;
}

function legacyDeterminePattern(pillars) {
  const dayStem = pillars.day.stem;
  const branchKeys = Object.values(pillars).map((pillar) => pillar.branch.key);
  const harmony = detectStructureForce(branchKeys, THREE_HARMONY) || detectStructureForce(branchKeys, THREE_MEETING);
  if (harmony) {
    return {
      name: harmony.type === "full" ? `${ELEMENT_LABELS[harmony.element]}局` : `半${ELEMENT_LABELS[harmony.element]}局`,
      relation: relationToElement(dayStem, harmony.element),
      source: harmony.type === "full" ? "三合/三会主导" : "半合主导",
      element: harmony.element,
    };
  }

  const monthBranch = pillars.month.branch.key;
  const hiddenStems = hiddenStemObjects(monthBranch);
  const visibleKeys = visibleStemKeys(pillars);
  const chosenStem =
    hiddenStems.find((stem) => visibleKeys.includes(stem.key) && stem.key !== pillars.day.stem.key) ||
    hiddenStems[0] ||
    pillars.month.stem;

  const relation = relationType(dayStem, chosenStem);
  const name = relation === "比肩" && STEM_LU_BRANCH[dayStem.key] === monthBranch ? "建禄" : relation;
  return {
    name,
    relation,
    source: chosenStem.key === pillars.month.stem.key ? "月干透出" : "月令藏干",
    element: chosenStem.element,
  };
}

function legacyDerivePatternAdvice(pattern, structure, dayStem) {
  const guide = FAVORABLE_PATTERN_GUIDE[pattern.name] || FAVORABLE_PATTERN_GUIDE[pattern.relation] || [];
  const mapped = [];
  for (const item of guide) {
    if (item === "财") mapped.push(ELEMENT_CONTROL[dayStem.element]);
    if (item === "官") mapped.push(Object.keys(ELEMENT_CONTROL).find((key) => ELEMENT_CONTROL[key] === dayStem.element));
    if (item === "印") mapped.push(ELEMENT_SUPPORT[dayStem.element]);
    if (item === "食神") mapped.push(ELEMENT_GENERATED_BY[dayStem.element]);
    if (item === "比劫") mapped.push(dayStem.element);
  }
  const favorableElements = uniqueElements([...structure.favorableElements, ...mapped]);
  const unfavorableElements = uniqueElements(structure.unfavorableElements.filter((element) => !favorableElements.includes(element)));
  return { favorableElements, unfavorableElements, guide };
}

function legacyUsefulGods(structure, climate, pattern, dayStem) {
  const structural = structure.favorableElements;
  const climateSet = climate.needed;
  const patternSet = pattern.favorableElements;
  return {
    patternGods: uniqueElements(patternSet),
    supportiveGods: uniqueElements([...structural, ...climateSet].filter((element) => !patternSet.includes(element) || climateSet.includes(element))),
    avoidGods: uniqueElements([...structure.unfavorableElements, ...pattern.unfavorableElements]),
    dayMasterElement: dayStem.element,
  };
}

function pillarRelationSnapshots(pillars) {
  return Object.entries(pillars).map(([key, pillar]) => ({
    key,
    palace: PALACE_LABELS[key],
    stem: pillar.stem,
    branch: pillar.branch,
    label: pillar.label,
  }));
}

function describeBranchLink(transitBranch, natalBranch) {
  if (BRANCH_CLASH[transitBranch] === natalBranch) return "冲";
  if (BRANCH_COMBINES[transitBranch] === natalBranch) return "合";
  if (BRANCH_HARM[transitBranch] === natalBranch) return "害";
  if ((BRANCH_PUNISH[transitBranch] || []).includes(natalBranch)) return "刑";
  return "";
}

function legacyDynamicInteractions(pillars, transitDay, transitMonth) {
  const natal = pillarRelationSnapshots(pillars);
  const branchKeys = natal.map((item) => item.branch.key);
  const luTargets = uniqueStrings([
    STEM_LU_BRANCH[pillars.day.stem.key],
    STEM_LU_BRANCH[pillars.month.stem.key],
    STEM_LU_BRANCH[pillars.day.stem.key] === pillars.day.branch.key ? pillars.day.branch.key : "",
  ]);

  const findings = [];
  for (const transit of [
    { label: "流日", stem: transitDay.stem, branch: transitDay.branch, pillar: transitDay },
    { label: "流月", stem: transitMonth.stem, branch: transitMonth.branch, pillar: transitMonth },
  ]) {
    for (const item of natal) {
      const branchLink = describeBranchLink(transit.branch.key, item.branch.key);
      if (branchLink) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}形成${branchLink}`);
        if (branchLink === "冲" && TOMB_BRANCH_DETAILS[item.branch.key]) {
          const tomb = TOMB_BRANCH_DETAILS[item.branch.key];
          findings.push(`${item.label}属四库动位，${ELEMENT_LABELS[tomb.main]}主气被引动，内藏${ELEMENT_LABELS[tomb.residual]}余气与${ELEMENT_LABELS[tomb.tomb]}墓气也需并看`);
        }
      }
      if (transit.stem.key === item.stem.key && transit.branch.key === item.branch.key) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}伏吟`);
      } else if (BRANCH_CLASH[transit.branch.key] === item.branch.key) {
        findings.push(`${transit.label}${transit.pillar.label}对${item.palace}${item.label}有反吟/冲动倾向`);
      }
    }

    if (luTargets.includes(transit.branch.key)) {
      findings.push(`${transit.label}${transit.pillar.label}触及祿位，容易引动原局关键成分`);
    }
  }

  const fullH = detectStructureForce([...branchKeys, transitDay.branch.key], THREE_HARMONY) || detectStructureForce([...branchKeys, transitMonth.branch.key], THREE_HARMONY);
  const fullM = detectStructureForce([...branchKeys, transitDay.branch.key], THREE_MEETING) || detectStructureForce([...branchKeys, transitMonth.branch.key], THREE_MEETING);
  if (fullH) findings.push(`动态组合出现${fullH.type === "full" ? "三合" : "半合"}${ELEMENT_LABELS[fullH.element]}势`);
  if (fullM) findings.push(`动态组合出现三会${ELEMENT_LABELS[fullM.element]}势`);

  return uniqueStrings(findings).slice(0, 8);
}

function legacyClimateAnalysis(pillars) {
  const branch = pillars.month.branch.key;
  const season = SEASON_SUPPORT[branch];
  const warmSet = ["si", "wu", "wei", "xu"];
  const coldSet = ["hai", "zi", "chou"];
  let note = "寒暖适中";
  let needed = [];

  if (warmSet.includes(branch)) {
    note = "偏暖燥";
    needed = ["water"];
  } else if (coldSet.includes(branch)) {
    note = "偏寒湿";
    needed = ["fire"];
  } else if (season === "wood") {
    note = "木旺待疏";
    needed = ["metal", "fire"];
  } else if (season === "metal") {
    note = "金肃偏燥";
    needed = ["fire", "water"];
  }

  return {
    note,
    needed: uniqueElements(needed),
  };
}

function imageAnalysis(pillars) {
  const counts = countElements(Object.values(pillars));
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return {
    dominant: sorted[0][0],
    secondary: sorted[1][0],
    note: `${ELEMENT_LABELS[sorted[0][0]]}${ELEMENT_LABELS[sorted[1][0]]}对照较明显`,
  };
}

function buildNaYinProfile(pillars) {
  const rows = Object.entries(pillars).map(([key, pillar]) => ({
    key,
    palace: PALACE_LABELS[key],
    label: pillar.label,
    naYin: getNaYin(pillar.label),
  }));
  const distinct = uniqueStrings(rows.map((row) => row.naYin));
  return {
    rows,
    summary: distinct.join("、"),
  };
}

function branchIsTombForRelation(pillar, relation, dayStem, gender) {
  if (!TOMB_BRANCH_DETAILS[pillar.branch.key]) return false;
  const hiddenRelations = hiddenStemObjects(pillar.branch.key).map((stem) => relationType(dayStem, stem));
  if (hiddenRelations.includes(relation)) return true;
  if (gender === "female" && (relation === "正官" || relation === "七杀")) return hiddenRelations.includes("正官") || hiddenRelations.includes("七杀");
  if (gender !== "female" && (relation === "正财" || relation === "偏财")) return hiddenRelations.includes("正财") || hiddenRelations.includes("偏财");
  return false;
}

function marriageAnalysis(pillars, gender, topics, dynamics) {
  const dayStem = pillars.day.stem;
  const spouseRelations = gender === "female" ? ["正官", "七杀"] : ["正财", "偏财"];
  const spouseHits = relationHitsForFocus(pillars, spouseRelations, ["day"]);
  const spouseVisible = spouseHits.filter((hit) => spouseRelations.includes(hit.stemRelation));
  const spouseInYear = spouseVisible.some((hit) => hit.key === "year");
  const spouseInHour = spouseVisible.some((hit) => hit.key === "hour");
  const spouseInDay = spouseVisible.some((hit) => hit.key === "day");
  const spouseInTomb = Object.values(pillars).some((pillar) =>
    branchIsTombForRelation(pillar, gender === "female" ? "正官" : "正财", dayStem, gender) ||
    branchIsTombForRelation(pillar, gender === "female" ? "七杀" : "偏财", dayStem, gender),
  );
  const injuryStars = relationHitsForFocus(pillars, ["伤官", "食神"], ["day", "hour"]);
  const injuryHeavy = injuryStars.length >= 3;
  const dayBranchClashed = dynamics.some((item) => item.includes("夫妻宫") && (item.includes("冲") || item.includes("刑") || item.includes("害")));

  const signs = [];
  if (spouseInYear) signs.push("配偶星落年柱，感情启动偏早");
  if (spouseInDay) signs.push("配偶信息贴近日柱，婚缘落点较直接");
  if (spouseInHour) signs.push("配偶星偏后，婚缘通常不算太早");
  if (spouseInTomb) signs.push("配偶星入墓，婚缘往往偏晚");
  if (injuryHeavy) signs.push("伤食偏重，对婚姻稳定性有扰动");
  if (dayBranchClashed) signs.push("今日动态触及夫妻宫，婚恋情绪更易波动");

  return {
    tendency: spouseInYear ? "偏早" : spouseInHour || spouseInTomb ? "偏晚" : "中段",
    divorceRisk: injuryHeavy || dayBranchClashed,
    signs,
    score: topics.marriage.score + (spouseInYear ? 1 : 0) - (spouseInTomb ? 1 : 0),
  };
}

function wealthAnalysis(pillars, structure, pattern, topics) {
  const dayStem = pillars.day.stem;
  const wealthHits = relationHitsForFocus(pillars, ["正财", "偏财"], ["month", "day", "hour"]);
  const outputHits = relationHitsForFocus(pillars, ["食神", "伤官"], ["month", "day", "hour"]);
  const monthHidden = hiddenStemObjects(pillars.month.branch.key).map((stem) => relationType(dayStem, stem));
  const wealthFromDoor = monthHidden.includes("正财") || monthHidden.includes("偏财") || ["正财", "偏财"].includes(relationType(dayStem, pillars.month.stem));
  const outputGeneratesWealth = outputHits.length > 0 && wealthHits.length > 0;
  const bodyWeakWealthHeavy = structure.strengthLabel === "偏弱" && wealthHits.length >= 2;
  const noWealthVisible = wealthHits.length === 0;

  const signs = [];
  if (wealthFromDoor) signs.push("财气通门户");
  if (outputGeneratesWealth) signs.push("有伤食生财之路");
  if (bodyWeakWealthHeavy) signs.push("身弱财旺，先扶身再任财");
  if (noWealthVisible) signs.push("明财不显，更看暗财与运岁引发");
  if (pattern.name.includes("财")) signs.push("格局本身偏向财星");

  return {
    wealthFromDoor,
    outputGeneratesWealth,
    bodyWeakWealthHeavy,
    noWealthVisible,
    signs,
    score: topics.wealth.score + (wealthFromDoor ? 2 : 0) + (outputGeneratesWealth ? 2 : 0) - (bodyWeakWealthHeavy ? 2 : 0),
  };
}

function legacyHealthAnalysis(pillars, elementCounts, structure, climate, topics) {
  const counts = Object.entries(elementCounts).sort((a, b) => a[1] - b[1]);
  const weakest = counts[0][0];
  const strongest = counts[counts.length - 1][0];
  const weakestCount = counts[0][1];
  const strongestCount = counts[counts.length - 1][1];
  const imbalance = strongestCount - weakestCount;
  const weakParts = HEALTH_ELEMENT_MAP[weakest];
  const strongParts = HEALTH_ELEMENT_MAP[strongest];
  const warnings = [];

  if (imbalance >= 2) warnings.push(`${ELEMENT_LABELS[weakest]}偏弱，对应${weakParts.join("、")}较需保养`);
  if (climate.note.includes("燥")) warnings.push("燥象偏重，注意津液、睡眠与炎症型问题");
  if (climate.note.includes("寒")) warnings.push("寒象偏重，注意循环、保暖与代谢");
  if (structure.strengthLabel === "偏弱") warnings.push("日主偏弱，宜先顾基础体能与恢复力");
  if (strongestCount >= 3) warnings.push(`${ELEMENT_LABELS[strongest]}偏亢，${strongParts.join("、")}可能更容易承压`);

  return {
    weakestElement: weakest,
    strongestElement: strongest,
    warnings,
    score: topics.health.score - Math.max(0, imbalance - 1),
  };
}

function relationHitsForFocus(pillars, targetRelations, palaceKeys) {
  const dayStem = pillars.day.stem;
  const hits = [];
  for (const [key, pillar] of Object.entries(pillars)) {
    const stemRelation = relationType(dayStem, pillar.stem);
    const hiddenRelations = hiddenStemObjects(pillar.branch.key).map((stem) => relationType(dayStem, stem));
    const matched = [stemRelation, ...hiddenRelations].filter((relation) => targetRelations.includes(relation));
    if (matched.length || palaceKeys.includes(key)) {
      hits.push({
        key,
        palace: PALACE_LABELS[key],
        label: pillar.label,
        stemRelation,
        hiddenRelations,
        palaceMatched: palaceKeys.includes(key),
      });
    }
  }
  return hits;
}

function topicSummaryLabel(topic, gender) {
  if (topic === "marriage") return gender === "female" ? "夫星/夫宫并看" : "妻星/妻宫并看";
  if (topic === "parents") return "父母星与父母宫同参";
  if (topic === "children") return "子女星与时柱同参";
  if (topic === "wealth") return "财星食伤并看门户流通";
  if (topic === "health") return "寒暖燥湿与偏颇并看";
  return "官杀印星并看事业平台";
}

function specialTopicAnalysis(pillars, structure, usefulSet, gender) {
  const marriageKey = gender === "female" ? "marriage_female" : "marriage_male";
  const topics = {
    parents: SIX_RELATIVE_FOCUS.parents,
    marriage: SIX_RELATIVE_FOCUS[marriageKey],
    children: SIX_RELATIVE_FOCUS.children,
    wealth: SIX_RELATIVE_FOCUS.wealth,
    health: SIX_RELATIVE_FOCUS.health,
    career: SIX_RELATIVE_FOCUS.career,
  };

  const result = {};
  for (const [topic, config] of Object.entries(topics)) {
    const hits = relationHitsForFocus(pillars, config.relations, config.palaceKeys);
    const palaceCount = hits.filter((item) => item.palaceMatched).length;
    const relationCount = hits.reduce((sum, item) => {
      const visible = config.relations.includes(item.stemRelation) ? 1 : 0;
      const hidden = item.hiddenRelations.filter((relation) => config.relations.includes(relation)).length;
      return sum + visible + hidden;
    }, 0);
    const score = palaceCount * 2 + relationCount + (topic === "health" && structure.strengthLabel === "偏弱" ? -1 : 0);
    result[topic] = {
      score,
      hits: hits.slice(0, 4),
      summary: topicSummaryLabel(topic, gender),
    };
  }

  result.marriage.tags = uniqueStrings([
    result.marriage.score >= 5 ? "婚缘信号较明显" : "婚缘信号偏弱",
    usefulSet.patternGods.includes("fire") || usefulSet.patternGods.includes("wood") ? "关系重互动经营" : "",
  ]);
  result.wealth.tags = uniqueStrings([
    result.wealth.score >= 5 ? "财路较开" : "财路需经营",
    result.wealth.hits.some((hit) => hit.stemRelation === "食神" || hit.stemRelation === "伤官") ? "有食伤生财倾向" : "",
  ]);
  result.health.tags = uniqueStrings([
    structure.strengthLabel === "偏弱" ? "先保养元气" : "注意节律平衡",
  ]);
  return result;
}

function legacyAnalyzeStructure(pillars) {
  const dayMasterStem = pillars.day.stem;
  const monthBranchKey = pillars.month.branch.key;
  const seasonElement = SEASON_SUPPORT[monthBranchKey];
  const components = [
    { label: "年干", weight: 0.8, element: pillars.year.stem.element },
    { label: "年支", weight: 0.7, element: pillars.year.branch.element },
    { label: "月干", weight: 1, element: pillars.month.stem.element },
    { label: "月支", weight: 1.6, element: pillars.month.branch.element },
    { label: "日支", weight: 0.9, element: pillars.day.branch.element },
    { label: "时干", weight: 0.8, element: pillars.hour.stem.element },
    { label: "时支", weight: 0.7, element: pillars.hour.branch.element },
  ];

  let strengthScore = 0;
  for (const component of components) {
    strengthScore += scoreStrengthComponent(dayMasterStem.element, component.element) * component.weight;
  }
  strengthScore += seasonElement === dayMasterStem.element ? 1.4 : 0;
  strengthScore += ELEMENT_SUPPORT[dayMasterStem.element] === seasonElement ? 1 : 0;
  strengthScore -= ELEMENT_CONTROL[seasonElement] === dayMasterStem.element ? 0.8 : 0;

  let strengthLabel = "中和";
  if (strengthScore >= 2.8) strengthLabel = "偏强";
  else if (strengthScore <= -1.6) strengthLabel = "偏弱";

  const favorableElements = uniqueElements(
    strengthLabel === "偏强"
      ? [ELEMENT_GENERATED_BY[dayMasterStem.element], ELEMENT_CONTROL[dayMasterStem.element], ELEMENT_CONTROL[ELEMENT_GENERATED_BY[dayMasterStem.element]]]
      : [dayMasterStem.element, ELEMENT_SUPPORT[dayMasterStem.element]]
  );

  const unfavorableElements = uniqueElements(
    strengthLabel === "偏强"
      ? [dayMasterStem.element, ELEMENT_SUPPORT[dayMasterStem.element]]
      : [ELEMENT_GENERATED_BY[dayMasterStem.element], ELEMENT_CONTROL[dayMasterStem.element], ELEMENT_CONTROL[ELEMENT_GENERATED_BY[dayMasterStem.element]]]
  ).filter((element) => !favorableElements.includes(element));

  return {
    strengthScore,
    strengthLabel,
    seasonElement,
    favorableElements,
    unfavorableElements,
  };
}

function analyzeStructure(pillars) {
  const dayMasterStem = pillars.day.stem;
  const monthBranchKey = pillars.month.branch.key;
  const seasonElement = SEASON_SUPPORT[monthBranchKey];
  const seasonGroup = BRANCH_SEASON_GROUP[monthBranchKey] || "spring";
  const phase = seasonPhaseForElement(seasonElement, dayMasterStem.element);
  const weightedCounts = countElements(pillars);
  const profile = collectRelationInfluence(pillars);
  const roots = calculateRootScore(pillars);
  const supportScore = profile.totals.peer + profile.totals.resource;
  const drainScore = profile.totals.output + profile.totals.wealth + profile.totals.authority;
  const rawStrength = supportScore - drainScore + phase.score + roots.rootScore;
  const strengthScore = roundValue(rawStrength);

  let strengthTier = "中和";
  let strengthLabel = "中和";
  if (strengthScore >= 7.5) {
    strengthTier = "极强";
    strengthLabel = "偏强";
  } else if (strengthScore >= 2.6) {
    strengthTier = "偏强";
    strengthLabel = "偏强";
  } else if (strengthScore <= -5.2) {
    strengthTier = "极弱";
    strengthLabel = "偏弱";
  } else if (strengthScore <= -1.6) {
    strengthTier = "偏弱";
    strengthLabel = "偏弱";
  }

  let followPattern = "";
  if (supportScore >= 6 && drainScore <= 2 && roots.rootScore >= 3.2) followPattern = "从强";
  if (supportScore <= 2.1 && roots.rootScore <= 1.2 && drainScore >= 5.6) followPattern = "从弱";

  const controller = controllerElement(dayMasterStem.element);
  const favorableElements = uniqueElements(
    strengthLabel === "偏强"
      ? [ELEMENT_GENERATED_BY[dayMasterStem.element], ELEMENT_CONTROL[dayMasterStem.element], controller]
      : [dayMasterStem.element, ELEMENT_SUPPORT[dayMasterStem.element], ELEMENT_GENERATED_BY[dayMasterStem.element]]
  );

  const unfavorableElements = uniqueElements(
    strengthLabel === "偏强"
      ? [dayMasterStem.element, ELEMENT_SUPPORT[dayMasterStem.element]]
      : [ELEMENT_CONTROL[dayMasterStem.element], controller]
  ).filter((element) => !favorableElements.includes(element));

  return {
    strengthScore,
    strengthLabel,
    strengthTier,
    seasonElement,
    seasonGroup,
    seasonPhase: phase.label,
    rootScore: roots.rootScore,
    rootCount: roots.rootCount,
    followPattern,
    elementCounts: weightedCounts,
    categoryScores: {
      support: roundValue(supportScore),
      output: roundValue(profile.totals.output),
      wealth: roundValue(profile.totals.wealth),
      authority: roundValue(profile.totals.authority),
    },
    favorableElements,
    unfavorableElements,
  };
}

function weightedRelationSum(profile, relations) {
  return roundValue(relations.reduce((sum, relation) => sum + (profile.relationCounts[relation] || 0), 0));
}

function strongestWeightedRelation(profile, relations) {
  return relations
    .map((relation) => ({ relation, score: profile.relationCounts[relation] || 0 }))
    .sort((left, right) => right.score - left.score)[0];
}

function guideItemToElements(dayStem, item) {
  if (item === "财" || item === "正财" || item === "偏财") return [ELEMENT_CONTROL[dayStem.element]];
  if (item === "官" || item === "官杀" || item === "正官" || item === "七杀") return [controllerElement(dayStem.element)];
  if (item === "印" || item === "正印" || item === "偏印") return [ELEMENT_SUPPORT[dayStem.element]];
  if (item === "食神" || item === "伤官" || item === "食伤") return [ELEMENT_GENERATED_BY[dayStem.element]];
  if (item === "比劫" || item === "比肩" || item === "劫财") return [dayStem.element];
  return [];
}

function climateAnalysis(pillars, structure = analyzeStructure(pillars)) {
  const seasonGroup = BRANCH_SEASON_GROUP[pillars.month.branch.key] || "spring";
  const dayElement = pillars.day.stem.element;
  const seasonalRule = DAYMASTER_SEASONAL_RULES[dayElement]?.[seasonGroup] || { note: "寒暖适中", primary: [], secondary: [], avoid: [] };
  const stemMode = STEM_CLIMATE_MODES[pillars.day.stem.key] || { primary: [], secondary: [], summary: "" };
  const climateState = calculateClimateState(pillars);
  const primaryScores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const secondaryScores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const avoidScores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  pushElementWeights(primaryScores, seasonalRule.primary || [], 3.2);
  pushElementWeights(secondaryScores, seasonalRule.secondary || [], 1.8);
  pushElementWeights(avoidScores, seasonalRule.avoid || [], 2.2);
  pushElementWeights(primaryScores, stemMode.primary || [], 2.4);
  pushElementWeights(secondaryScores, stemMode.secondary || [], 1.2);

  if (climateState.temperature <= -8) {
    pushElementWeights(primaryScores, ["fire"], 3.8);
    pushElementWeights(secondaryScores, ["wood"], 1.8);
    pushElementWeights(avoidScores, ["water"], 2.5);
  } else if (climateState.temperature <= -3) {
    pushElementWeights(primaryScores, ["fire"], 2.4);
    pushElementWeights(secondaryScores, ["wood"], 1);
  } else if (climateState.temperature >= 8) {
    pushElementWeights(primaryScores, ["water"], 3.8);
    pushElementWeights(secondaryScores, ["metal"], 1.6);
    pushElementWeights(avoidScores, ["fire"], 2.8);
  } else if (climateState.temperature >= 3) {
    pushElementWeights(primaryScores, ["water"], 2.1);
    pushElementWeights(secondaryScores, ["metal"], 1);
  }

  if (climateState.moisture <= -6) {
    pushElementWeights(primaryScores, ["water"], 2.8);
    pushElementWeights(secondaryScores, ["metal"], 1.2);
  } else if (climateState.moisture <= -2.5) {
    pushElementWeights(primaryScores, ["water"], 1.6);
  } else if (climateState.moisture >= 6) {
    pushElementWeights(primaryScores, ["fire"], 2.3);
    pushElementWeights(secondaryScores, ["earth"], 1.4);
    pushElementWeights(avoidScores, ["water"], 1.8);
  } else if (climateState.moisture >= 2.5) {
    pushElementWeights(primaryScores, ["fire"], 1.2);
    pushElementWeights(secondaryScores, ["earth"], 0.8);
  }

  let bias = "寒暖燥湿较平";
  if (climateState.temperature <= -4 && climateState.moisture >= 2.5) bias = "寒湿偏重";
  else if (climateState.temperature >= 4 && climateState.moisture <= -2.5) bias = "炎热偏燥";
  else if (climateState.temperature <= -4) bias = "偏寒";
  else if (climateState.temperature >= 4) bias = "偏热";
  else if (climateState.moisture <= -3) bias = "偏燥";
  else if (climateState.moisture >= 3) bias = "偏湿";

  const primary = rankElements(primaryScores).slice(0, 2);
  const secondary = rankElements(secondaryScores).slice(0, 2).filter((element) => !primary.includes(element));
  const avoid = rankElements(avoidScores).slice(0, 2).filter((element) => !primary.includes(element) && !secondary.includes(element));

  return {
    note: seasonalRule.note,
    bias,
    mode: stemMode.name,
    modeSummary: stemMode.summary,
    needed: uniqueElements([...primary.slice(0, 2), ...secondary.slice(0, 2)]),
    primary,
    secondary,
    avoid,
    temperatureScore: climateState.temperature,
    moistureScore: climateState.moisture,
    emergencyLevel: Math.max(Math.round(Math.abs(climateState.temperature) / 3), Math.round(Math.abs(climateState.moisture) / 3)),
    summary: `${seasonalRule.note}；${stemMode.summary || "先以月令寒暖燥湿定调，再看全局平衡。"}`
  };
}

function determinePattern(pillars, structure = analyzeStructure(pillars)) {
  const dayStem = pillars.day.stem;
  const branchKeys = Object.values(pillars).map((pillar) => pillar.branch.key);
  const harmony = detectStructureForce(branchKeys, THREE_HARMONY) || detectStructureForce(branchKeys, THREE_MEETING);
  if (harmony) {
    return {
      name: harmony.type === "full" ? `${ELEMENT_LABELS[harmony.element]}局` : `半${ELEMENT_LABELS[harmony.element]}局`,
      relation: relationToElement(dayStem, harmony.element),
      source: harmony.type === "full" ? "三合/三会主导" : "半合主导",
      element: harmony.element,
    };
  }

  const profile = collectRelationInfluence(pillars);
  const printPower = weightedRelationSum(profile, ["正印", "偏印"]);
  const outputPower = weightedRelationSum(profile, ["食神", "伤官"]);
  const hurtPower = weightedRelationSum(profile, ["伤官"]);
  const wealthPower = weightedRelationSum(profile, ["正财", "偏财"]);
  const officerPower = weightedRelationSum(profile, ["正官", "七杀"]);
  const killPower = weightedRelationSum(profile, ["七杀"]);
  const officialPower = weightedRelationSum(profile, ["正官"]);
  const monthCommand = monthCommandStem(pillars);
  const monthRelation = relationType(dayStem, monthCommand);
  const dayLuBranch = STEM_LU_BRANCH[dayStem.key];

  if (structure.followPattern === "从强") {
    return { name: "从强格", relation: "比肩", source: "强弱转化", element: dayStem.element };
  }

  if (structure.followPattern === "从弱") {
    const lead = strongestWeightedRelation(profile, ["正财", "偏财", "正官", "七杀", "食神", "伤官"]);
    return {
      name: "从弱格",
      relation: lead?.relation || monthRelation,
      source: "强弱转化",
      element: lead && ["正财", "偏财"].includes(lead.relation)
        ? ELEMENT_CONTROL[dayStem.element]
        : lead && ["正官", "七杀"].includes(lead.relation)
          ? controllerElement(dayStem.element)
          : ELEMENT_GENERATED_BY[dayStem.element],
    };
  }

  if ((pillars.month.branch.key === dayLuBranch || monthRelation === "比肩") && structure.strengthScore >= 2) {
    return {
      name: "建禄格",
      relation: "比肩",
      source: pillars.month.branch.key === dayLuBranch ? "月令得禄" : "月令比肩透气",
      element: dayStem.element,
    };
  }

  if (hurtPower >= 1.1 && printPower >= 1.1) {
    return { name: "伤官配印", relation: "伤官", source: "食伤与印星并见", element: ELEMENT_GENERATED_BY[dayStem.element] };
  }

  if (killPower >= 1 && printPower >= 1) {
    return { name: "杀印相生", relation: "七杀", source: "七杀与印星相生", element: controllerElement(dayStem.element) };
  }

  if (officialPower >= 1 && printPower >= 1) {
    return { name: "官印相生", relation: "正官", source: "官星与印星并见", element: controllerElement(dayStem.element) };
  }

  if (wealthPower >= 1 && officerPower >= 1) {
    return {
      name: "财官相生",
      relation: strongestWeightedRelation(profile, ["正财", "偏财"])?.relation || "正财",
      source: "财星引官",
      element: ELEMENT_CONTROL[dayStem.element],
    };
  }

  if (outputPower >= 1 && wealthPower >= 1) {
    return {
      name: "食伤生财",
      relation: strongestWeightedRelation(profile, ["食神", "伤官"])?.relation || "食神",
      source: "食伤泄秀生财",
      element: ELEMENT_GENERATED_BY[dayStem.element],
    };
  }

  const monthBranch = pillars.month.branch.key;
  const hiddenStems = hiddenStemObjects(monthBranch);
  const visibleKeys = visibleStemKeys(pillars);
  const chosenStem =
    hiddenStems.find((stem) => visibleKeys.includes(stem.key) && stem.key !== pillars.day.stem.key) ||
    hiddenStems[0] ||
    pillars.month.stem;

  const relation = relationType(dayStem, chosenStem);
  return {
    name: relation === "比肩" && dayLuBranch === monthBranch ? "建禄格" : relation,
    relation,
    source: chosenStem.key === pillars.month.stem.key ? "月干透出" : "月令藏干",
    element: chosenStem.element,
  };
}

function derivePatternAdvice(pattern, structure, dayStem, climate) {
  const directGuideMap = {
    建禄格: ["食伤", "财", "官"],
    从强格: ["比劫", "印"],
    从弱格: ["财", "官", "食伤"],
    伤官配印: ["食伤", "印"],
    杀印相生: ["官杀", "印"],
    官印相生: ["官", "印"],
    财官相生: ["财", "官"],
    食伤生财: ["食伤", "财"],
  };
  const guide = directGuideMap[pattern.name] || FAVORABLE_PATTERN_GUIDE[pattern.name] || FAVORABLE_PATTERN_GUIDE[pattern.relation] || [];
  const mapped = guide.flatMap((item) => guideItemToElements(dayStem, item));
  const favorableElements = uniqueElements([...structure.favorableElements, ...mapped, ...(climate?.secondary || [])]);
  const unfavorableElements = uniqueElements(
    [...structure.unfavorableElements, ...(climate?.avoid || [])].filter((element) => !favorableElements.includes(element)),
  );
  return { favorableElements, unfavorableElements, guide };
}

function usefulGods(structure, climate, pattern, dayStem) {
  let priorityOrder = ["调候", "格局", "扶抑"];
  if ((climate.emergencyLevel || 0) >= 4) priorityOrder = ["调候", "扶抑", "格局"];
  if (pattern.name.includes("从")) priorityOrder = ["格局", "调候", "扶抑"];

  const climateGods = uniqueElements([...(climate.primary || []), ...(climate.secondary || [])]);
  const patternGods = uniqueElements(pattern.favorableElements);
  const supportiveGods = uniqueElements(
    [...structure.favorableElements, ...climateGods, ...patternGods].filter((element) => !pattern.unfavorableElements.includes(element)),
  );
  const avoidGods = uniqueElements([...(climate.avoid || []), ...structure.unfavorableElements, ...pattern.unfavorableElements])
    .filter((element) => !supportiveGods.includes(element));

  return {
    priorityOrder,
    climateGods,
    patternGods,
    supportiveGods,
    avoidGods,
    dayMasterElement: dayStem.element,
    decisionNote:
      priorityOrder[0] === "调候"
        ? "先看寒暖燥湿，再定扶抑与格局。"
        : priorityOrder[0] === "格局"
          ? "原局已有明显成格或从格，优先顺其结构。"
          : "原局强弱先行，先扶偏救弊，再谈细化。",
  };
}

function dynamicInteractions(pillars, transitDay, transitMonth) {
  const natal = pillarRelationSnapshots(pillars);
  const branchKeys = natal.map((item) => item.branch.key);
  const luTargets = uniqueStrings([
    STEM_LU_BRANCH[pillars.day.stem.key],
    STEM_LU_BRANCH[pillars.month.stem.key],
    STEM_LU_BRANCH[pillars.day.stem.key] === pillars.day.branch.key ? pillars.day.branch.key : "",
  ]);

  const findings = [];
  for (const transit of [
    { label: "流日", stem: transitDay.stem, branch: transitDay.branch, pillar: transitDay },
    { label: "流月", stem: transitMonth.stem, branch: transitMonth.branch, pillar: transitMonth },
  ]) {
    for (const item of natal) {
      const stemCombine = STEM_COMBINES[transit.stem.key];
      if (stemCombine?.pair === item.stem.key) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}天干五合，牵出${ELEMENT_LABELS[stemCombine.element]}气的主题`);
      }
      if (transit.stem.key === item.stem.key && transit.branch.key !== item.branch.key) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}天干同气，容易直接引动${item.palace}`);
      }

      const branchLink = describeBranchLink(transit.branch.key, item.branch.key);
      if (branchLink) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}形成${branchLink}，该宫位容易被引动`);
        if (branchLink === "冲" && TOMB_BRANCH_DETAILS[item.branch.key]) {
          const tomb = TOMB_BRANCH_DETAILS[item.branch.key];
          findings.push(`${item.label}属四库动位，${ELEMENT_LABELS[tomb.main]}主气被引动，内藏${ELEMENT_LABELS[tomb.residual]}余气与${ELEMENT_LABELS[tomb.tomb]}墓气也需并看`);
        }
      }

      if (transit.stem.key === item.stem.key && transit.branch.key === item.branch.key) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}伏吟，同位信息会被重复放大`);
      } else if (transit.branch.key === item.branch.key) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}同支并临，形成明显激活`);
      } else if (BRANCH_CLASH[transit.branch.key] === item.branch.key) {
        findings.push(`${transit.label}${transit.pillar.label}对${item.palace}${item.label}有反吟/冲动倾向`);
      }
    }

    if (luTargets.includes(transit.branch.key)) {
      findings.push(`${transit.label}${transit.pillar.label}触及禄位，容易引动原局关键成分`);
    }
    if (transit.branch.key === pillars.month.branch.key) {
      findings.push(`${transit.label}${transit.pillar.label}直接叠到月令，外部节令与社会环境感受会更强`);
    }
    if (transit.branch.key === pillars.day.branch.key) {
      findings.push(`${transit.label}${transit.pillar.label}触及日支，个人情绪与关系体验会更直接`);
    }
  }

  const fullH = detectStructureForce([...branchKeys, transitDay.branch.key], THREE_HARMONY) || detectStructureForce([...branchKeys, transitMonth.branch.key], THREE_HARMONY);
  const fullM = detectStructureForce([...branchKeys, transitDay.branch.key], THREE_MEETING) || detectStructureForce([...branchKeys, transitMonth.branch.key], THREE_MEETING);
  if (fullH) findings.push(`动态组合出现${fullH.type === "full" ? "三合" : "半合"}${ELEMENT_LABELS[fullH.element]}势`);
  if (fullM) findings.push(`动态组合出现三会${ELEMENT_LABELS[fullM.element]}势`);

  return uniqueStrings(findings).slice(0, 10);
}

function dynamicScoreFromFindings(findings) {
  return findings.reduce((score, item) => {
    if (item.includes("三合") || item.includes("三会") || item.includes("五合")) return score + 2;
    if (item.includes("引动") || item.includes("激活")) return score + 1;
    if (item.includes("伏吟")) return score - 2;
    if (item.includes("反吟") || item.includes("冲")) return score - 2;
    if (item.includes("刑") || item.includes("害")) return score - 1;
    return score;
  }, 0);
}

function categoryWeight(relation) {
  const table = {
    比肩: { career: -1, wealth: -2, love: 1, health: 0 },
    劫财: { career: -1, wealth: -4, love: -1, health: -1 },
    食神: { career: 2, wealth: 2, love: 1, health: 1 },
    伤官: { career: -2, wealth: 1, love: -2, health: -1 },
    偏财: { career: 1, wealth: 4, love: 1, health: 0 },
    正财: { career: 1, wealth: 5, love: 2, health: 0 },
    七杀: { career: 2, wealth: 0, love: -1, health: -2 },
    正官: { career: 4, wealth: 1, love: 2, health: 0 },
    偏印: { career: 1, wealth: -1, love: -1, health: 1 },
    正印: { career: 2, wealth: 0, love: 0, health: 2 },
  };
  return table[relation] || { career: 0, wealth: 0, love: 0, health: 0 };
}

function elementFavorScore(favorableElements, unfavorableElements, element) {
  if (favorableElements.includes(element)) return 5;
  if (unfavorableElements.includes(element)) return -5;
  return 0;
}

function getTier(score) {
  if (score >= 86) return "上扬日";
  if (score >= 72) return "顺势日";
  if (score >= 58) return "平衡日";
  if (score >= 45) return "谨慎日";
  return "收敛日";
}

function getDayDescriptor(score) {
  if (score >= 86) return "气势很顺，适合发起、会面、拍板。";
  if (score >= 72) return "今天适合顺势推进，把握明确机会。";
  if (score >= 58) return "节奏中性，适合做稳、做细、做确认。";
  if (score >= 45) return "今日不宜贪多，先守住重点更稳。";
  return "今天偏收敛，适合整理、止损、减少冲动决策。";
}

function buildAdvice(focusArea, hexagram, relationScore) {
  const focusText = {
    overall: "今天更适合把精力集中到一件最关键的事情上。",
    career: "事业面上宜先推进明确事项，不宜同时开太多新坑。",
    wealth: "财务面宜看清成本与节奏，小利可取，重仓要慢。",
    love: "感情面重在表达方式，少猜测，多确认。",
    health: "身心面要防节奏失衡，先睡稳、吃稳、动稳。",
  };
  const pressureText = relationScore < 0 ? "流日对本命有一定压力，今天更适合守中带进。" : "流日与本命互动不差，可以适度主动争取。";
  return `${focusText[focusArea]}${pressureText}${hexagram.movingLines.length > 0 ? "动爻较明显，行动前后最好留出修正空间。" : "卦气较稳，适合按计划推进。"}`;
}

function relationAdviceLine(relationScore, todayRelation = "中和", monthRelation = "中和") {
  if (relationScore >= 6) return `流日与本命相互托举，今天可以把“${todayRelation}”这股劲用在关键一步上。`;
  if (relationScore >= 1) return `流日对本命不算别扭，但月层偏“${monthRelation}”，所以可以先动，不宜贪快。`;
  if (relationScore <= -5) return `流日的牵制感比较明显，今天更像是在“${todayRelation}”的压力下做选择，先守边界比先抢进度更重要。`;
  return "流日与本命有一定拉扯，今天适合边试边看，先小幅推进，再决定要不要加力。";
}

function structureAdviceLine(structure, focusArea) {
  const strength = structure?.strengthTier || structure?.strengthLabel;
  if (strength === "极强" || strength === "偏强") {
    return focusArea === "career" || focusArea === "overall"
      ? "原局偏强时，今天的关键不是再用力，而是把力道用在最值得的一步。"
      : "原局偏强时，今天要避免因为自己有把握就一路推到底，留一点弹性反而更稳。";
  }
  if (strength === "极弱" || strength === "偏弱") {
    return focusArea === "health"
      ? "原局偏弱时，今天更吃状态、体力和环境支持，不适合硬扛。"
      : "原局偏弱时，今天更讲究先借力、先排顺序，不适合靠硬撑来拉动全局。";
  }
  return "原局较为中和时，今天真正拉开差距的，不是先天气势，而是你是否能读对节奏。";
}

function climateAdviceLineDetailed(climate) {
  const firstNeed = climate?.primary?.[0] || climate?.needed?.[0];
  const needText = firstNeed ? ELEMENT_LABELS[firstNeed] : "调候";
  if (climate?.bias === "寒湿偏重" || climate?.bias === "偏寒") return `调候偏寒，今天先把状态热起来，再谈推进；主要补位偏${needText}。`;
  if (climate?.bias === "炎热偏燥" || climate?.bias === "偏热") return `调候偏热，今天要先降速复核，不要让决定跑在情绪前面；主要补位偏${needText}。`;
  if (climate?.bias === "偏湿") return `调候偏湿，今天要先减掉拖和堆，用小步启动来把气带起来；主要补位偏${needText}。`;
  if (climate?.bias === "偏燥") return `调候偏燥，今天更需要留缓冲、多沟通、别硬推到底；主要补位偏${needText}。`;
  return "调候整体较平，今天的重点不在补偏，而在看清现实后用对方法。";
}

function themeAdviceLineDetailed(relation) {
  const map = {
    比肩: "今天的主轴偏向自己拿主意，适合独立处理，但不要固执到听不进反馈。",
    劫财: "今天的主轴偏向资源分配和边界感，要先守住重点，再决定哪些地方值得分精力。",
    食神: "今天的主轴偏向表达、输出和顺势推进，把想法说清、把东西做出来，会比硬顶结果更有效。",
    伤官: "今天的主轴偏向指出问题和快速判断，但话说太满反而容易把局面推紧。",
    偏财: "今天的主轴偏向外部机会和人脉流动，可以多看多接，但不要因为第一眼的感觉就立刻出手。",
    正财: "今天的主轴偏向责任、进度和落地，更适合把手头该完成的事确实完成。",
    七杀: "今天的主轴偏向压力下的决断，事情会像在催你给出回应，但重点是稳准，不是逞强。",
    正官: "今天的主轴偏向秩序、规则和稳妥推进，适合按正常流程办事，把该承担的部分做好。",
    偏印: "今天的主轴偏向重新看局、吸收信息和调整策略，适合先想清楚再动。",
    正印: "今天的主轴偏向补状态、找支持和先稳后动，先把基础托住，后面会更顺。",
  };
  return map[relation] || "今天的主轴是先读清局势，再决定怎么推进。";
}

function hexagramAdviceLineDetailed(hexagram) {
  const movingCount = hexagram.movingLines.length;
  if (movingCount === 0) return `本卦${hexagram.title}没有动爻，今天以主线做深做稳为主，不必频繁换法。`;
  const positions = hexagram.movingLines.join("、");
  if (movingCount === 1) return `本卦${hexagram.title}只在第${positions}爻动，真正要调整的是一个关键点，后势会转向${hexagram.changedTitle}。`;
  if (movingCount <= 3) return `本卦${hexagram.title}动在第${positions}爻，局面会边走边变，后势转向${hexagram.changedTitle}，所以要留修正空间。`;
  return `本卦${hexagram.title}动爻较多，化出${hexagram.changedTitle}，今天更适合分段推进，不适合一次定死。`;
}

function buildAdviceDetailed(focusArea, hexagram, relationScore, extras = {}) {
  const focusText = {
    overall: "今天更适合把精力集中到一件最关键的事情上。",
    career: "事业面上宜先推进明确事项，不宜同时开太多新坑。",
    wealth: "财务面宜看清成本与节奏，小利可取，重仓要慢。",
    love: "感情面重在表达方式，少猜测，多确认。",
    health: "身心面要防节奏失衡，先睡稳、吃稳、动稳。",
  };
  const relationText = relationAdviceLine(relationScore, extras.todayRelation || "中和", extras.monthRelation || "中和");
  const structureText = extras.structure ? structureAdviceLine(extras.structure, focusArea) : "";
  const climateText = extras.climate ? climateAdviceLineDetailed(extras.climate) : "";
  const themeText = extras.pattern?.relation ? themeAdviceLineDetailed(extras.pattern.relation) : "";
  const castText = hexagramAdviceLineDetailed(hexagram);
  return [focusText[focusArea], relationText, structureText, climateText, themeText, castText].filter(Boolean).join("");
}

function buildHexagramSummaryDetail(hexagram) {
  const movingCount = hexagram.movingLines.length;
  if (movingCount === 0) return `本卦为${hexagram.title}，无动爻，今天更适合围绕同一主线持续推进。`;
  if (movingCount === 1) {
    return `本卦为${hexagram.title}，第${hexagram.movingLines[0]}爻发动，局势关键变化集中在一个转折点，后势转向${hexagram.changedTitle}。`;
  }
  if (movingCount <= 3) {
    return `本卦为${hexagram.title}，共有${movingCount}处动爻，事情会边走边变，后势转向${hexagram.changedTitle}。`;
  }
  return `本卦为${hexagram.title}，动爻较多，说明今天局面本身就在换相，最终会化向${hexagram.changedTitle}。`;
}

function buildFocusAppendix(focusArea, details = {}) {
  if (focusArea === "wealth" && details.wealthDetail?.signs?.length) return `财务侧重点会落在${details.wealthDetail.signs.slice(0, 2).join("、")}。`;
  if (focusArea === "love" && details.marriageDetail?.signs?.length) return `感情侧重点会落在${details.marriageDetail.signs.slice(0, 2).join("、")}。`;
  if (focusArea === "health" && details.healthDetail?.warnings?.length) return `身心侧重点会落在${details.healthDetail.warnings.slice(0, 2).join("、")}。`;
  return "";
}

function buildTags(score, focusArea, positive) {
  const goodPool = {
    overall: ["定主线", "见关键人", "完成收尾", "列优先级"],
    career: ["汇报", "定方案", "跟进项目", "简化流程"],
    wealth: ["复核账目", "小额尝试", "谈条件", "控制开支"],
    love: ["真诚沟通", "表达感谢", "减少试探", "留空间"],
    health: ["早点休息", "温和运动", "少熬夜", "规律饮食"],
  };
  const avoidPool = {
    overall: ["临时改主意", "情绪化答应", "过量社交", "一次做太多"],
    career: ["空口承诺", "强推对抗", "忽略细节", "拖到太晚"],
    wealth: ["冲动消费", "急于回本", "跟风下注", "口头交易"],
    love: ["翻旧账", "过度脑补", "冷处理过久", "赌气表达"],
    health: ["久坐不动", "饮食失衡", "透支体力", "睡前高刺激"],
  };
  const pool = positive ? goodPool[focusArea] : avoidPool[focusArea];
  const adjusted = positive ? (score >= 60 ? pool : pool.slice(0, 2).concat(["减负", "缓一缓"])) : pool;
  return adjusted.slice(0, 4);
}

function pillarSummaryRows(pillars) {
  return [
    { name: "年柱", value: pillars.year.label, meta: `${ELEMENT_LABELS[pillars.year.stem.element]} / ${ELEMENT_LABELS[pillars.year.branch.element]}` },
    { name: "月柱", value: pillars.month.label, meta: `${ELEMENT_LABELS[pillars.month.stem.element]} / ${ELEMENT_LABELS[pillars.month.branch.element]}` },
    { name: "日柱", value: pillars.day.label, meta: `日主 ${ELEMENT_LABELS[pillars.day.stem.element]}` },
    { name: "时柱", value: pillars.hour.label, meta: `${ELEMENT_LABELS[pillars.hour.stem.element]} / ${ELEMENT_LABELS[pillars.hour.branch.element]}` },
  ];
}

function formatLocalDate(date, timeZone) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function approximateSolarTermsForYear(year, timeZone) {
  return MONTH_BOUNDARIES.map((boundary) => ({
    ...boundary,
    year,
    date: localDateToUtc(`${year}-${pad2(boundary.month)}-${pad2(boundary.day)}`, "12:00", timeZone),
  }));
}

function solarTermsAroundBirth(year, timeZone) {
  return [
    ...approximateSolarTermsForYear(year - 1, timeZone),
    ...approximateSolarTermsForYear(year, timeZone),
    ...approximateSolarTermsForYear(year + 1, timeZone),
  ].sort((left, right) => left.date.getTime() - right.date.getTime());
}

function solarYearForParts(parts) {
  return parts.month > 2 || (parts.month === 2 && parts.day >= 4) ? parts.year : parts.year - 1;
}

function solarAgeYears(startUtc, endUtc) {
  return (endUtc.getTime() - startUtc.getTime()) / (365.2425 * 86400000);
}

function pillarCycleIndex(pillar) {
  for (let index = 0; index < 60; index += 1) {
    const candidate = pillarFromIndex(index);
    if (candidate.stem.key === pillar.stem.key && candidate.branch.key === pillar.branch.key) return index;
  }
  return 0;
}

function shiftPillar(pillar, step) {
  return pillarFromIndex(pillarCycleIndex(pillar) + step);
}

function getSolarYearPillar(year) {
  return pillarFromIndex(((year - 1984) % 60 + 60) % 60);
}

function isDaYunForward(gender, yearStem) {
  if (gender === "female") return yearStem.yinYang === "yin";
  if (gender === "male") return yearStem.yinYang === "yang";
  return yearStem.yinYang === "yang";
}

function buildTransitFindings(pillars, transits, maxItems = 8) {
  const natal = pillarRelationSnapshots(pillars);
  const branchKeys = natal.map((item) => item.branch.key);
  const luTargets = uniqueStrings([
    STEM_LU_BRANCH[pillars.day.stem.key],
    STEM_LU_BRANCH[pillars.month.stem.key],
    STEM_LU_BRANCH[pillars.day.stem.key] === pillars.day.branch.key ? pillars.day.branch.key : "",
  ]);
  const findings = [];

  for (const transit of transits) {
    for (const item of natal) {
      const stemCombine = STEM_COMBINES[transit.pillar.stem.key];
      if (stemCombine?.pair === item.stem.key) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}天干五合，牵出${ELEMENT_LABELS[stemCombine.element]}气的主题`);
      }
      if (transit.pillar.stem.key === item.stem.key && transit.pillar.branch.key !== item.branch.key) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}天干同气，容易直接引动${item.palace}`);
      }

      const branchLink = describeBranchLink(transit.pillar.branch.key, item.branch.key);
      if (branchLink) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}形成${branchLink}，该宫位容易被引动`);
        if (branchLink === "冲" && TOMB_BRANCH_DETAILS[item.branch.key]) {
          const tomb = TOMB_BRANCH_DETAILS[item.branch.key];
          findings.push(`${item.label}属四库动位，${ELEMENT_LABELS[tomb.main]}主气被引动，内藏${ELEMENT_LABELS[tomb.residual]}余气与${ELEMENT_LABELS[tomb.tomb]}墓气也需并看`);
        }
      }

      if (transit.pillar.stem.key === item.stem.key && transit.pillar.branch.key === item.branch.key) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}伏吟，同位信息会被重复放大`);
      } else if (transit.pillar.branch.key === item.branch.key) {
        findings.push(`${transit.label}${transit.pillar.label}与${item.palace}${item.label}同支并临，形成明显激活`);
      } else if (BRANCH_CLASH[transit.pillar.branch.key] === item.branch.key) {
        findings.push(`${transit.label}${transit.pillar.label}对${item.palace}${item.label}有反吟/冲动倾向`);
      }
    }

    if (luTargets.includes(transit.pillar.branch.key)) {
      findings.push(`${transit.label}${transit.pillar.label}触及禄位，容易引动原局关键成分`);
    }
    if (transit.pillar.branch.key === pillars.month.branch.key) {
      findings.push(`${transit.label}${transit.pillar.label}直接叠到月令，外部节令与社会环境感受会更强`);
    }
    if (transit.pillar.branch.key === pillars.day.branch.key) {
      findings.push(`${transit.label}${transit.pillar.label}触及日支，个人情绪与关系体验会更直接`);
    }
  }

  const transitBranches = transits.map((item) => item.pillar.branch.key);
  const fullH = transitBranches
    .map((branch) => detectStructureForce([...branchKeys, branch], THREE_HARMONY))
    .find(Boolean);
  const fullM = transitBranches
    .map((branch) => detectStructureForce([...branchKeys, branch], THREE_MEETING))
    .find(Boolean);
  if (fullH) findings.push(`动态组合出现${fullH.type === "full" ? "三合" : "半合"}${ELEMENT_LABELS[fullH.element]}势`);
  if (fullM) findings.push(`动态组合出现三会${ELEMENT_LABELS[fullM.element]}势`);

  return uniqueStrings(findings).slice(0, maxItems);
}

function transitBackdropScore(dayMaster, transitPillar, patternResolved) {
  const relation =
    scoreElementRelation(dayMaster, transitPillar.stem.element) +
    Math.round(scoreElementRelation(dayMaster, transitPillar.branch.element) / 2) +
    Math.round(elementFavorScore(patternResolved.favorableElements, patternResolved.unfavorableElements, transitPillar.stem.element) / 2);
  return Math.max(-6, Math.min(6, Math.round(relation / 2)));
}

function estimateDaYunStart(birthUtc, birthParts, birthPillars, gender, timeZone) {
  const directionForward = isDaYunForward(gender, birthPillars.year.stem);
  const solarTerms = solarTermsAroundBirth(birthParts.year, timeZone);
  const referenceTerm = directionForward
    ? solarTerms.find((term) => term.date.getTime() > birthUtc.getTime())
    : [...solarTerms].reverse().find((term) => term.date.getTime() < birthUtc.getTime());
  const fallbackTerm = referenceTerm || solarTerms[directionForward ? solarTerms.length - 1 : 0];
  const diffDays = Math.abs(fallbackTerm.date.getTime() - birthUtc.getTime()) / 86400000;
  const startAge = diffDays / 3;
  const totalMonths = Math.round(diffDays * 4);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return {
    directionForward,
    directionLabel: directionForward ? "顺行" : "逆行",
    referenceTerm: fallbackTerm,
    startAge: roundValue(startAge),
    startText: months ? `${years}岁${months}个月起运` : `${years}岁起运`,
  };
}

function buildDaYunProfile(birthPillars, birthUtc, birthParts, analysisUtc, analysisParts, gender, patternResolved, timeZone) {
  const start = estimateDaYunStart(birthUtc, birthParts, birthPillars, gender, timeZone);
  const analysisAge = solarAgeYears(birthUtc, analysisUtc);
  const directionStep = start.directionForward ? 1 : -1;
  const cycles = [];

  for (let index = 0; index < 8; index += 1) {
    const pillar = shiftPillar(birthPillars.month, directionStep * (index + 1));
    const startAge = roundValue(start.startAge + index * 10);
    const endAge = roundValue(start.startAge + (index + 1) * 10);
    const interactions = buildTransitFindings(birthPillars, [{ label: "大运", pillar }], 4);
    const relation = relationType(birthPillars.day.stem, pillar.stem);
    cycles.push({
      index: index + 1,
      pillar,
      label: pillar.label,
      relation,
      startAge,
      endAge,
      active: analysisAge >= startAge && analysisAge < endAge,
      backdropScore: transitBackdropScore(birthPillars.day.stem.element, pillar, patternResolved) + Math.round(dynamicScoreFromFindings(interactions) / 2),
      interactions,
    });
  }

  const activeCycle = cycles.find((item) => item.active) || cycles[0];
  const currentSolarYear = solarYearForParts(analysisParts);
  const annuals = [];
  for (let year = currentSolarYear - 1; year <= currentSolarYear + 3; year += 1) {
    const pillar = getSolarYearPillar(year);
    const interactions = buildTransitFindings(
      birthPillars,
      [{ label: "大运", pillar: activeCycle.pillar }, { label: "流年", pillar }],
      5,
    );
    annuals.push({
      solarYear: year,
      pillar,
      label: pillar.label,
      relation: relationType(birthPillars.day.stem, pillar.stem),
      active: year === currentSolarYear,
      backdropScore: transitBackdropScore(birthPillars.day.stem.element, pillar, patternResolved) + Math.round(dynamicScoreFromFindings(interactions) / 2),
      interactions,
    });
  }

  const currentAnnual = annuals.find((item) => item.active) || annuals[1];
  const combinedFindings = buildTransitFindings(
    birthPillars,
    [{ label: "大运", pillar: activeCycle.pillar }, { label: "流年", pillar: currentAnnual.pillar }],
    6,
  );

  return {
    directionForward: start.directionForward,
    directionLabel: start.directionLabel,
    methodNote: "按阳男阴女顺、阴男阳女逆，取出生前后节气差三天一岁推起运。",
    startAge: start.startAge,
    startText: start.startText,
    referenceTerm: {
      name: start.referenceTerm.name,
      dateLabel: formatLocalDate(start.referenceTerm.date, timeZone),
      isoDate: `${start.referenceTerm.year}-${pad2(start.referenceTerm.month)}-${pad2(start.referenceTerm.day)}`,
    },
    analysisAge: roundValue(analysisAge),
    currentDaYun: activeCycle,
    daYunList: cycles,
    currentAnnual,
    annualList: annuals,
    combinedFindings,
    backdropScore: Math.max(-6, Math.min(6, activeCycle.backdropScore + currentAnnual.backdropScore)),
  };
}

function legacyBuildFortune(payload) {
  const birthUtc = localDateToUtc(payload.birthDate, payload.birthTime, payload.timezone);
  const analysisUtc = localDateToUtc(payload.analysisDate, "12:00", payload.timezone);
  const birthParts = datePartsInTimeZone(birthUtc, payload.timezone);
  const analysisParts = datePartsInTimeZone(analysisUtc, payload.timezone);

  const birthPillars = {
    year: getYearPillar(birthParts),
    month: getMonthPillar(birthParts),
  };
  birthPillars.day = getDayPillar(birthParts);
  birthPillars.hour = getHourPillar(birthParts, birthPillars.day);

  const todayDay = getDayPillar(analysisParts);
  const todayMonth = getMonthPillar(analysisParts);
  const elementCounts = countElements(Object.values(birthPillars));
  const dominant = dominantElement(elementCounts);
  const dayMaster = birthPillars.day.stem.element;
  const structure = analyzeStructure(birthPillars);
  const climate = climateAnalysis(birthPillars);
  const image = imageAnalysis(birthPillars);
  const pattern = determinePattern(birthPillars);
  const patternAdvice = derivePatternAdvice(pattern, structure, birthPillars.day.stem);
  const patternResolved = {
    ...pattern,
    favorableElements: patternAdvice.favorableElements,
    unfavorableElements: patternAdvice.unfavorableElements,
    guide: patternAdvice.guide,
  };
  const usefulSet = usefulGods(structure, climate, patternResolved, birthPillars.day.stem);
  const naYin = buildNaYinProfile(birthPillars);
  const todayRelation = relationType(birthPillars.day.stem, todayDay.stem);
  const monthRelation = relationType(birthPillars.day.stem, todayMonth.stem);
  const dynamics = dynamicInteractions(birthPillars, todayDay, todayMonth);
  const topics = specialTopicAnalysis(birthPillars, structure, usefulSet, payload.gender);
  const marriageDetail = marriageAnalysis(birthPillars, payload.gender, topics, dynamics);
  const wealthDetail = wealthAnalysis(birthPillars, structure, patternResolved, topics);
  const healthDetail = healthAnalysis(birthPillars, elementCounts, structure, climate, topics);
  const relationScore =
    scoreElementRelation(dayMaster, todayDay.stem.element) +
    Math.round(scoreElementRelation(dayMaster, todayDay.branch.element) / 2) +
    Math.round(scoreElementRelation(dayMaster, todayMonth.branch.element) / 2);
  const balance = balanceScore(elementCounts);
  const hexagram = buildHexagram(payload.coinLines);
  const usefulElementScore =
    elementFavorScore(patternResolved.favorableElements, patternResolved.unfavorableElements, todayDay.stem.element) +
    Math.round(elementFavorScore(patternResolved.favorableElements, patternResolved.unfavorableElements, todayMonth.branch.element) / 2) +
    climate.needed.reduce((score, element) => score + (todayDay.stem.element === element ? 2 : 0), 0);
  const score = Math.max(18, Math.min(98, 50 + relationScore + balance + hexagram.score + usefulElementScore));

  const relationWeights = categoryWeight(todayRelation);
  const monthWeights = categoryWeight(monthRelation);
  const metrics = {
    career: Math.max(20, Math.min(99, score + relationWeights.career + monthWeights.career + topics.career.score + (hexagram.upper.element === "metal" ? 4 : 0))),
    wealth: Math.max(20, Math.min(99, score + relationWeights.wealth + monthWeights.wealth + wealthDetail.score + (hexagram.lower.element === "earth" ? 4 : 0))),
    love: Math.max(20, Math.min(99, score + relationWeights.love + monthWeights.love + marriageDetail.score + (hexagram.upper.element === "wood" ? 3 : 0) - (hexagram.movingLines.length > 2 ? 4 : 0))),
    health: Math.max(20, Math.min(99, score + relationWeights.health + monthWeights.health + healthDetail.score - Math.max(0, hexagram.movingLines.length - 1) * 3)),
    overall: score,
  };

  const summary = `你的日主偏${ELEMENT_LABELS[dayMaster]}，本命五行里${ELEMENT_LABELS[dominant]}气较重，结构判断为${structure.strengthLabel}，格局倾向为${pattern.name}。今日流日为${todayDay.label}，对日主形成${todayRelation}之象，月层互动偏${monthRelation}。${buildHexagramSummaryDetail(hexagram)}整体提示是“${getDayDescriptor(score)}”${buildFocusAppendix(payload.focusArea, { wealthDetail, marriageDetail, healthDetail, topics })}`;

  return {
    score,
    tier: getTier(score),
    summary,
    advice: `${buildAdviceDetailed(payload.focusArea, hexagram, relationScore, { structure, climate, pattern: patternResolved, todayRelation, monthRelation })}${payload.focusArea === "wealth" ? ` ${wealthDetail.signs.join("，")}。` : payload.focusArea === "love" ? ` ${marriageDetail.signs.join("，")}。` : payload.focusArea === "health" ? ` ${healthDetail.warnings.join("，")}。` : ""}`,
    goodTags: buildTags(score, payload.focusArea, true),
    avoidTags: buildTags(score, payload.focusArea, false),
    metrics,
    pillars: birthPillars,
    pillarRows: pillarSummaryRows(birthPillars),
    dayMaster,
    dominant,
    elementCounts,
    structure,
    climate,
    image,
    pattern: patternResolved,
    usefulSet,
    naYin,
    topics,
    marriageDetail,
    wealthDetail,
    healthDetail,
    todayRelation,
    monthRelation,
    relationScore,
    dynamics,
    ruleSet: BOOK_RULESET,
    today: {
      dateLabel: formatLocalDate(analysisUtc, payload.timezone),
      dayPillar: todayDay,
      monthPillar: todayMonth,
    },
    hexagram,
  };
}

function healthAnalysis(pillars, elementCounts, structure, climate, topics) {
  const counts = Object.entries(elementCounts).sort((a, b) => a[1] - b[1]);
  const weakest = counts[0][0];
  const strongest = counts[counts.length - 1][0];
  const weakestCount = counts[0][1];
  const strongestCount = counts[counts.length - 1][1];
  const imbalance = strongestCount - weakestCount;
  const weakParts = HEALTH_ELEMENT_MAP[weakest];
  const strongParts = HEALTH_ELEMENT_MAP[strongest];
  const warnings = [];
  const climateTags = `${climate.note}${climate.bias}`;

  if (imbalance >= 1.8) warnings.push(`${ELEMENT_LABELS[weakest]}偏弱，对应${weakParts.join("、")}较需保养`);
  if (climateTags.includes("燥")) warnings.push("燥象偏重，注意津液、睡眠与炎症型问题");
  if (climateTags.includes("寒")) warnings.push("寒象偏重，注意循环、保暖与代谢");
  if (climateTags.includes("热")) warnings.push("热象偏重，注意心火、烦躁与过度消耗");
  if (climateTags.includes("湿")) warnings.push("湿象偏重，注意脾胃、浮肿与困倦感");
  if (structure.strengthLabel === "偏弱") warnings.push("日主偏弱，宜先顾基础体能与恢复力");
  if (strongestCount >= 3.2) warnings.push(`${ELEMENT_LABELS[strongest]}偏亢，${strongParts.join("、")}可能更容易承压`);

  return {
    weakestElement: weakest,
    strongestElement: strongest,
    warnings,
    score: topics.health.score - Math.max(0, Math.round(imbalance - 1)) - Math.max(0, (climate.emergencyLevel || 0) - 3),
  };
}

function buildFortune(payload) {
  const birthUtc = localDateToUtc(payload.birthDate, payload.birthTime, payload.timezone);
  const analysisUtc = localDateToUtc(payload.analysisDate, "12:00", payload.timezone);
  const birthParts = datePartsInTimeZone(birthUtc, payload.timezone);
  const analysisParts = datePartsInTimeZone(analysisUtc, payload.timezone);

  const birthPillars = {
    year: getYearPillar(birthParts),
    month: getMonthPillar(birthParts),
  };
  birthPillars.day = getDayPillar(birthParts);
  birthPillars.hour = getHourPillar(birthParts, birthPillars.day);

  const todayDay = getDayPillar(analysisParts);
  const todayMonth = getMonthPillar(analysisParts);
  const dayMaster = birthPillars.day.stem.element;
  const structure = analyzeStructure(birthPillars);
  const elementCounts = structure.elementCounts || countElements(birthPillars);
  const dominant = dominantElement(elementCounts);
  const climate = climateAnalysis(birthPillars, structure);
  const image = imageAnalysis(birthPillars);
  const pattern = determinePattern(birthPillars, structure);
  const patternAdvice = derivePatternAdvice(pattern, structure, birthPillars.day.stem, climate);
  const patternResolved = {
    ...pattern,
    favorableElements: patternAdvice.favorableElements,
    unfavorableElements: patternAdvice.unfavorableElements,
    guide: patternAdvice.guide,
  };
  const usefulSet = usefulGods(structure, climate, patternResolved, birthPillars.day.stem);
  const luckCycle = buildDaYunProfile(
    birthPillars,
    birthUtc,
    birthParts,
    analysisUtc,
    analysisParts,
    payload.gender,
    patternResolved,
    payload.timezone,
  );
  const naYin = buildNaYinProfile(birthPillars);
  const todayRelation = relationType(birthPillars.day.stem, todayDay.stem);
  const monthRelation = relationType(birthPillars.day.stem, todayMonth.stem);
  const dynamics = dynamicInteractions(birthPillars, todayDay, todayMonth);
  const dynamicScore = dynamicScoreFromFindings(dynamics);
  const topics = specialTopicAnalysis(birthPillars, structure, usefulSet, payload.gender);
  const marriageDetail = marriageAnalysis(birthPillars, payload.gender, topics, dynamics);
  const wealthDetail = wealthAnalysis(birthPillars, structure, patternResolved, topics);
  const healthDetail = healthAnalysis(birthPillars, elementCounts, structure, climate, topics);
  const relationScore =
    scoreElementRelation(dayMaster, todayDay.stem.element) +
    Math.round(scoreElementRelation(dayMaster, todayDay.branch.element) / 2) +
    Math.round(scoreElementRelation(dayMaster, todayMonth.branch.element) / 2);
  const balance = balanceScore(elementCounts);
  const hexagram = buildHexagram(payload.coinLines);
  const usefulElementScore =
    elementFavorScore(patternResolved.favorableElements, patternResolved.unfavorableElements, todayDay.stem.element) +
    Math.round(elementFavorScore(patternResolved.favorableElements, patternResolved.unfavorableElements, todayMonth.branch.element) / 2) +
    (climate.primary || []).reduce((score, element, index) => score + (todayDay.stem.element === element ? (index === 0 ? 3 : 2) : 0), 0);
  const score = Math.max(18, Math.min(98, 50 + relationScore + balance + hexagram.score + usefulElementScore + dynamicScore + luckCycle.backdropScore));

  const relationWeights = categoryWeight(todayRelation);
  const monthWeights = categoryWeight(monthRelation);
  const metrics = {
    career: Math.max(20, Math.min(99, score + relationWeights.career + monthWeights.career + topics.career.score + (hexagram.upper.element === "metal" ? 4 : 0))),
    wealth: Math.max(20, Math.min(99, score + relationWeights.wealth + monthWeights.wealth + wealthDetail.score + (hexagram.lower.element === "earth" ? 4 : 0))),
    love: Math.max(20, Math.min(99, score + relationWeights.love + monthWeights.love + marriageDetail.score + (hexagram.upper.element === "wood" ? 3 : 0) - (hexagram.movingLines.length > 2 ? 4 : 0))),
    health: Math.max(20, Math.min(99, score + relationWeights.health + monthWeights.health + healthDetail.score - Math.max(0, hexagram.movingLines.length - 1) * 3)),
    overall: score,
  };

  const summary = `你的日主属${ELEMENT_LABELS[dayMaster]}，原局${ELEMENT_LABELS[dominant]}气较重，强弱落在${structure.strengthTier}，月令下处于${structure.seasonPhase}地。调候显示${climate.note}，兼有${climate.bias}之象，格局倾向为${patternResolved.name}。当前大运在${luckCycle.currentDaYun.label}，流年在${luckCycle.currentAnnual.label}，一起构成这阶段的外部背景。今日流日为${todayDay.label}，对日主形成${todayRelation}。${buildHexagramSummaryDetail(hexagram)}整体提示是“${getDayDescriptor(score)}”${buildFocusAppendix(payload.focusArea, { wealthDetail, marriageDetail, healthDetail, topics })}`;

  return {
    score,
    tier: getTier(score),
    summary,
    advice: `${buildAdviceDetailed(payload.focusArea, hexagram, relationScore, { structure, climate, pattern: patternResolved, todayRelation, monthRelation })}${payload.focusArea === "wealth" ? ` ${wealthDetail.signs.join("，")}。` : payload.focusArea === "love" ? ` ${marriageDetail.signs.join("，")}。` : payload.focusArea === "health" ? ` ${healthDetail.warnings.join("，")}。` : ""}`,
    goodTags: buildTags(score, payload.focusArea, true),
    avoidTags: buildTags(score, payload.focusArea, false),
    metrics,
    pillars: birthPillars,
    pillarRows: pillarSummaryRows(birthPillars),
    dayMaster,
    dominant,
    elementCounts,
    structure,
    climate,
    image,
    pattern: patternResolved,
    usefulSet,
    naYin,
    topics,
    marriageDetail,
    wealthDetail,
    healthDetail,
    luckCycle,
    todayRelation,
    monthRelation,
    relationScore,
    dynamics,
    ruleSet: BOOK_RULESET,
    today: {
      dateLabel: formatLocalDate(analysisUtc, payload.timezone),
      dayPillar: todayDay,
      monthPillar: todayMonth,
    },
    hexagram,
  };
}

function getTransitPillars(dateString, timeZone) {
  const analysisUtc = localDateToUtc(dateString, "12:00", timeZone);
  const analysisParts = datePartsInTimeZone(analysisUtc, timeZone);
  return {
    dateLabel: formatLocalDate(analysisUtc, timeZone),
    dayPillar: getDayPillar(analysisParts),
    monthPillar: getMonthPillar(analysisParts),
  };
}

const RECTIFICATION_HOURS = [
  { key: "zi", time: "00:30", range: "23:00-00:59", labelZh: "子时", labelEn: "Zi Hour" },
  { key: "chou", time: "02:00", range: "01:00-02:59", labelZh: "丑时", labelEn: "Chou Hour" },
  { key: "yin", time: "04:00", range: "03:00-04:59", labelZh: "寅时", labelEn: "Yin Hour" },
  { key: "mao", time: "06:00", range: "05:00-06:59", labelZh: "卯时", labelEn: "Mao Hour" },
  { key: "chen", time: "08:00", range: "07:00-08:59", labelZh: "辰时", labelEn: "Chen Hour" },
  { key: "si", time: "10:00", range: "09:00-10:59", labelZh: "巳时", labelEn: "Si Hour" },
  { key: "wu", time: "12:00", range: "11:00-12:59", labelZh: "午时", labelEn: "Wu Hour" },
  { key: "wei", time: "14:00", range: "13:00-14:59", labelZh: "未时", labelEn: "Wei Hour" },
  { key: "shen", time: "16:00", range: "15:00-16:59", labelZh: "申时", labelEn: "Shen Hour" },
  { key: "you", time: "18:00", range: "17:00-18:59", labelZh: "酉时", labelEn: "You Hour" },
  { key: "xu", time: "20:00", range: "19:00-20:59", labelZh: "戌时", labelEn: "Xu Hour" },
  { key: "hai", time: "22:00", range: "21:00-22:59", labelZh: "亥时", labelEn: "Hai Hour" },
];

const RECTIFICATION_EVENT_RULES = {
  marriage: {
    palaces: ["day"],
    relationTargets(gender) {
      return gender === "female" ? ["正官", "七杀"] : ["正财", "偏财"];
    },
    globalKeywords: ["合", "冲", "伏吟", "激活"],
  },
  childbirth: {
    palaces: ["hour"],
    relationTargets() {
      return ["食神", "伤官"];
    },
    globalKeywords: ["子女晚景宫", "激活", "合", "冲"],
  },
  career: {
    palaces: ["month", "hour"],
    relationTargets() {
      return ["正官", "七杀", "正财", "偏财", "食神", "伤官"];
    },
    globalKeywords: ["禄位", "月令", "激活"],
  },
  relocation: {
    palaces: ["month", "day", "hour"],
    relationTargets() {
      return [];
    },
    globalKeywords: ["冲", "反吟", "害", "刑", "激活"],
  },
  surgery: {
    palaces: ["day", "hour"],
    relationTargets() {
      return ["七杀", "正官"];
    },
    globalKeywords: ["冲", "反吟", "害", "刑"],
  },
  family: {
    palaces: ["year", "month"],
    relationTargets() {
      return ["正印", "偏印", "比肩", "劫财"];
    },
    globalKeywords: ["冲", "反吟", "伏吟", "害"],
  },
};

function buildBirthPillarsForTime(birthDate, birthTime, timeZone) {
  const birthUtc = localDateToUtc(birthDate, birthTime, timeZone);
  const birthParts = datePartsInTimeZone(birthUtc, timeZone);
  const pillars = {
    year: getYearPillar(birthParts),
    month: getMonthPillar(birthParts),
  };
  pillars.day = getDayPillar(birthParts);
  pillars.hour = getHourPillar(birthParts, pillars.day);
  return { birthUtc, birthParts, pillars };
}

function scoreRectificationEvent(candidate, event, gender, timeZone) {
  const rule = RECTIFICATION_EVENT_RULES[event.type];
  if (!rule) {
    return { score: 0, palaceHits: [], relationHits: [], sampleFindings: [] };
  }

  const eventUtc = localDateToUtc(event.date, "12:00", timeZone);
  const eventParts = datePartsInTimeZone(eventUtc, timeZone);
  const eventYear = getYearPillar(eventParts);
  const eventMonth = getMonthPillar(eventParts);
  const eventDay = getDayPillar(eventParts);
  const structure = analyzeStructure(candidate.pillars);
  const pattern = determinePattern(candidate.pillars, structure);
  const climate = climateAnalysis(candidate.pillars, structure);
  const patternResolved = {
    ...pattern,
    favorableElements: pattern.favorableElements?.length ? pattern.favorableElements : structure.favorableElements,
    unfavorableElements: pattern.unfavorableElements?.length ? pattern.unfavorableElements : structure.unfavorableElements,
  };
  const luckCycle = buildDaYunProfile(
    candidate.pillars,
    candidate.birthUtc,
    candidate.birthParts,
    eventUtc,
    eventParts,
    gender,
    patternResolved,
    timeZone,
  );

  const transits = [
    { label: "大运", pillar: luckCycle.currentDaYun.pillar },
    { label: "流年", pillar: eventYear },
    { label: "流月", pillar: eventMonth },
    { label: "流日", pillar: eventDay },
  ];
  const findings = buildTransitFindings(candidate.pillars, transits, 10);
  const movementWords = ["冲", "反吟", "伏吟", "害", "刑", "激活", "引动", "同支并临"];
  const palaceHits = [];
  let score = 0;

  rule.palaces.forEach((palaceKey) => {
    const palaceLabel = PALACE_LABELS[palaceKey];
    const matching = findings.filter((item) => item.includes(palaceLabel));
    if (!matching.length) return;
    palaceHits.push(palaceKey);
    score += 1.6 + matching.length * 0.55;
    const moving = matching.filter((item) => movementWords.some((word) => item.includes(word)));
    score += moving.length * 0.9;
  });

  const relationTargets = rule.relationTargets(gender);
  const relationHits = transits
    .map((transit) => relationType(candidate.pillars.day.stem, transit.pillar.stem))
    .filter((relation) => relationTargets.includes(relation));
  score += relationHits.length * 0.8;

  const globalHits = findings.filter((item) => rule.globalKeywords.some((word) => item.includes(word)));
  score += Math.min(3, globalHits.length) * 0.45;

  return {
    score: roundValue(score),
    palaceHits,
    relationHits: uniqueStrings(relationHits),
    sampleFindings: uniqueStrings([...findings.filter((item) => rule.palaces.some((palaceKey) => item.includes(PALACE_LABELS[palaceKey]))), ...globalHits]).slice(0, 2),
  };
}

function rectifyBirthTime(payload) {
  const cleanEvents = (payload.events || [])
    .filter((event) => event && event.type && event.date)
    .slice(0, 3);

  if (!payload.birthDate || !cleanEvents.length) {
    return {
      rankings: [],
      confidence: "insufficient",
      comparedEventCount: cleanEvents.length,
      note: "insufficient_data",
    };
  }

  const rankings = RECTIFICATION_HOURS.map((candidateHour) => {
    const candidate = {
      ...candidateHour,
      ...buildBirthPillarsForTime(payload.birthDate, candidateHour.time, payload.timezone),
    };

    const eventBreakdown = cleanEvents.map((event) => ({
      ...event,
      ...scoreRectificationEvent(candidate, event, payload.gender, payload.timezone),
    }));

    const totalScore = roundValue(eventBreakdown.reduce((sum, item) => sum + item.score, 0));

    return {
      key: candidateHour.key,
      time: candidateHour.time,
      range: candidateHour.range,
      labelZh: candidateHour.labelZh,
      labelEn: candidateHour.labelEn,
      pillarLabel: candidate.pillars.hour.label,
      totalScore,
      eventBreakdown,
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const top = rankings[0];
  const second = rankings[1];
  const gap = roundValue((top?.totalScore || 0) - (second?.totalScore || 0));
  const confidence = gap >= 2.5 ? "strong" : gap >= 1.2 ? "moderate" : "light";

  return {
    rankings: rankings.slice(0, 3),
    confidence,
    comparedEventCount: cleanEvents.length,
    note: confidence === "light" ? "needs_more_events" : "candidate_hours_found",
  };
}

export { COIN_OPTIONS, ELEMENT_LABELS, buildFortune, formatLocalDate, getTransitPillars, rectifyBirthTime };
