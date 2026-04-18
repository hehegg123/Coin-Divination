import fs from "node:fs";
import path from "node:path";
import { buildFortune } from "./fortune-core.js";

const DEFAULTS = {
  births: 48,
  casts: 256,
  focus: "overall",
  timezone: "America/Indianapolis",
  analysisDate: todayInTimezone("America/Indianapolis"),
  output: "test-agent-report.json",
  seed: 20260415,
};

const HOUR_SAMPLES = [
  "00:30",
  "02:30",
  "04:30",
  "06:30",
  "08:30",
  "10:30",
  "12:30",
  "14:30",
  "16:30",
  "18:30",
  "20:30",
  "22:30",
];

const COIN_VALUES = [6, 7, 8, 9];

function todayInTimezone(timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function parseArgs(argv) {
  const options = { ...DEFAULTS };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const next = argv[index + 1];
    if (token === "--births" && next) {
      options.births = Number(next);
      index += 1;
    } else if (token === "--casts" && next) {
      options.casts = Number(next);
      index += 1;
    } else if (token === "--focus" && next) {
      options.focus = next;
      index += 1;
    } else if (token === "--timezone" && next) {
      options.timezone = next;
      index += 1;
    } else if (token === "--analysis-date" && next) {
      options.analysisDate = next;
      index += 1;
    } else if (token === "--output" && next) {
      options.output = next;
      index += 1;
    } else if (token === "--seed" && next) {
      options.seed = Number(next);
      index += 1;
    }
  }
  return options;
}

function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = Math.imul(value ^ (value >>> 15), value | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleWithoutReplacement(items, count, random) {
  if (count >= items.length) return [...items];
  const pool = [...items];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, count);
}

function formatIsoDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function randomDate(random) {
  const start = Date.UTC(1972, 0, 1);
  const end = Date.UTC(2012, 11, 31);
  const span = end - start;
  const stamp = start + Math.floor(random() * span);
  return new Date(stamp);
}

function buildBirthSamples(count, random) {
  const seen = new Set();
  const births = [];
  while (births.length < count) {
    const date = formatIsoDate(randomDate(random));
    const time = HOUR_SAMPLES[Math.floor(random() * HOUR_SAMPLES.length)];
    const gender = births.length % 2 === 0 ? "female" : "male";
    const key = `${date}|${time}|${gender}`;
    if (seen.has(key)) continue;
    seen.add(key);
    births.push({
      id: `B${String(births.length + 1).padStart(3, "0")}`,
      birthDate: date,
      birthTime: time,
      gender,
    });
  }
  return births;
}

function allCoinCasts() {
  const casts = [];
  for (let index = 0; index < 4096; index += 1) {
    let value = index;
    const lines = [];
    for (let line = 0; line < 6; line += 1) {
      lines.push(COIN_VALUES[value % 4]);
      value = Math.floor(value / 4);
    }
    casts.push({
      id: `C${String(index + 1).padStart(4, "0")}`,
      lines,
    });
  }
  return casts;
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSections(result) {
  const summary = normalizeText(result.summary);
  const advice = normalizeText(result.advice);
  const structure = normalizeText([
    result.structure.strengthTier || result.structure.strengthLabel,
    result.structure.seasonPhase,
    result.climate.note,
    result.climate.bias,
    result.pattern.name,
    result.pattern.relation,
    result.todayRelation,
  ].join(" | "));
  const hexagram = normalizeText([
    result.hexagram.title,
    result.hexagram.trigramTitleZh,
    result.hexagram.judgmentZh || "",
    result.hexagram.actionZh || "",
    result.hexagram.movingLines.join(",") || "none",
  ].join(" | "));
  const visibleComposite = normalizeText([summary, advice, structure, hexagram].join(" || "));
  return { summary, advice, structure, hexagram, visibleComposite };
}

function buildCaseRecord(birth, cast, options) {
  const result = buildFortune({
    birthDate: birth.birthDate,
    birthTime: birth.birthTime,
    timezone: options.timezone,
    analysisDate: options.analysisDate,
    focusArea: options.focus,
    gender: birth.gender,
    coinLines: cast.lines,
  });

  return {
    birthId: birth.id,
    castId: cast.id,
    birthDate: birth.birthDate,
    birthTime: birth.birthTime,
    gender: birth.gender,
    coinLines: [...cast.lines],
    score: result.score,
    tier: result.tier,
    sections: buildSections(result),
  };
}

function collectValueStats(records, key) {
  const counts = new Map();
  records.forEach((record) => {
    const value = record.sections[key];
    if (!counts.has(value)) counts.set(value, []);
    counts.get(value).push(record);
  });

  const entries = [...counts.entries()]
    .map(([value, cases]) => ({ value, count: cases.length, sampleCases: cases.slice(0, 3).map((item) => ({
      birthId: item.birthId,
      castId: item.castId,
      birthDate: item.birthDate,
      birthTime: item.birthTime,
      gender: item.gender,
      coinLines: item.coinLines,
      score: item.score,
      tier: item.tier,
    })) }))
    .sort((a, b) => b.count - a.count);

  const total = records.length;
  const unique = entries.length;
  return {
    totalCases: total,
    uniqueValues: unique,
    collisionRate: round(1 - unique / total),
    largestCluster: entries[0]?.count || 0,
    topRepeats: entries.filter((item) => item.count > 1).slice(0, 8),
  };
}

function groupSensitivity(records, groupKey, sectionKey, expectedSpan) {
  const grouped = new Map();
  records.forEach((record) => {
    const key = record[groupKey];
    if (!grouped.has(key)) grouped.set(key, new Set());
    grouped.get(key).add(record.sections[sectionKey]);
  });

  const uniques = [...grouped.values()].map((set) => set.size);
  const averageUnique = uniques.reduce((sum, value) => sum + value, 0) / uniques.length;
  return {
    groups: uniques.length,
    averageUnique: round(averageUnique),
    averageCoverage: round(averageUnique / expectedSpan),
    minUnique: Math.min(...uniques),
    maxUnique: Math.max(...uniques),
  };
}

function round(value) {
  return Math.round(value * 10000) / 10000;
}

function printSummary(report) {
  console.log("Coin Divination Test Agent");
  console.log(`Analysis date: ${report.config.analysisDate}`);
  console.log(`Focus: ${report.config.focus}`);
  console.log(`Birth samples: ${report.config.births}`);
  console.log(`Cast samples: ${report.config.casts}`);
  console.log(`Total cases: ${report.sample.totalCases}`);
  console.log("");
  console.log("Exact repetition by visible section:");
  Object.entries(report.repetition).forEach(([key, stats]) => {
    console.log(
      `- ${key}: unique ${stats.uniqueValues}/${stats.totalCases}, collision rate ${Math.round(stats.collisionRate * 100)}%, largest cluster ${stats.largestCluster}`,
    );
  });
  console.log("");
  console.log("Sensitivity:");
  console.log(
    `- same birth, vary casts -> visible composite unique avg ${report.sensitivity.byBirth.visibleComposite.averageUnique}/${report.config.casts} (${Math.round(report.sensitivity.byBirth.visibleComposite.averageCoverage * 100)}%)`,
  );
  console.log(
    `- same cast, vary births -> visible composite unique avg ${report.sensitivity.byCast.visibleComposite.averageUnique}/${report.config.births} (${Math.round(report.sensitivity.byCast.visibleComposite.averageCoverage * 100)}%)`,
  );
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const random = mulberry32(options.seed);
  const births = buildBirthSamples(options.births, random);
  const casts = sampleWithoutReplacement(allCoinCasts(), options.casts, random);
  const records = [];

  births.forEach((birth) => {
    casts.forEach((cast) => {
      records.push(buildCaseRecord(birth, cast, options));
    });
  });

  const report = {
    config: {
      births: births.length,
      casts: casts.length,
      focus: options.focus,
      timezone: options.timezone,
      analysisDate: options.analysisDate,
      seed: options.seed,
    },
    sample: {
      totalCases: records.length,
      birthExamples: births.slice(0, 5),
      castExamples: casts.slice(0, 5),
    },
    repetition: {
      summary: collectValueStats(records, "summary"),
      advice: collectValueStats(records, "advice"),
      structure: collectValueStats(records, "structure"),
      hexagram: collectValueStats(records, "hexagram"),
      visibleComposite: collectValueStats(records, "visibleComposite"),
    },
    sensitivity: {
      byBirth: {
        summary: groupSensitivity(records, "birthId", "summary", casts.length),
        advice: groupSensitivity(records, "birthId", "advice", casts.length),
        visibleComposite: groupSensitivity(records, "birthId", "visibleComposite", casts.length),
      },
      byCast: {
        summary: groupSensitivity(records, "castId", "summary", births.length),
        advice: groupSensitivity(records, "castId", "advice", births.length),
        visibleComposite: groupSensitivity(records, "castId", "visibleComposite", births.length),
      },
    },
  };

  const outputPath = path.resolve(process.cwd(), options.output);
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  printSummary(report);
  console.log("");
  console.log(`Report written to ${outputPath}`);
}

main();
