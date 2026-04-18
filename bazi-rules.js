const HIDDEN_STEMS = {
  zi: ["gui"],
  chou: ["ji", "gui", "xin"],
  yin: ["jia", "bing", "wu"],
  mao: ["yi"],
  chen: ["wu", "yi", "gui"],
  si: ["bing", "geng", "wu"],
  wu: ["ding", "ji"],
  wei: ["ji", "yi", "ding"],
  shen: ["geng", "ren", "wu"],
  you: ["xin"],
  xu: ["wu", "xin", "ding"],
  hai: ["ren", "jia"],
};

const STEM_LU_BRANCH = {
  jia: "yin",
  yi: "mao",
  bing: "si",
  ding: "wu",
  wu: "si",
  ji: "wu",
  geng: "shen",
  xin: "you",
  ren: "hai",
  gui: "zi",
};

const BRANCH_CLASH = {
  zi: "wu",
  chou: "wei",
  yin: "shen",
  mao: "you",
  chen: "xu",
  si: "hai",
  wu: "zi",
  wei: "chou",
  shen: "yin",
  you: "mao",
  xu: "chen",
  hai: "si",
};

const BRANCH_HARM = {
  zi: "wei",
  chou: "wu",
  yin: "si",
  mao: "chen",
  chen: "mao",
  si: "yin",
  wu: "chou",
  wei: "zi",
  shen: "hai",
  you: "xu",
  xu: "you",
  hai: "shen",
};

const BRANCH_PUNISH = {
  zi: ["mao"],
  mao: ["zi"],
  yin: ["si", "shen"],
  si: ["yin", "shen"],
  shen: ["yin", "si"],
  chou: ["xu", "wei"],
  xu: ["chou", "wei"],
  wei: ["chou", "xu"],
  chen: ["chen"],
  wu: ["wu"],
  you: ["you"],
  hai: ["hai"],
};

const BRANCH_COMBINES = {
  zi: "chou",
  chou: "zi",
  yin: "hai",
  mao: "xu",
  chen: "you",
  si: "shen",
  wu: "wei",
  wei: "wu",
  shen: "si",
  you: "chen",
  xu: "mao",
  hai: "yin",
};

const THREE_HARMONY = [
  { branches: ["shen", "zi", "chen"], element: "water", center: "zi" },
  { branches: ["hai", "mao", "wei"], element: "wood", center: "mao" },
  { branches: ["yin", "wu", "xu"], element: "fire", center: "wu" },
  { branches: ["si", "you", "chou"], element: "metal", center: "you" },
];

const THREE_MEETING = [
  { branches: ["yin", "mao", "chen"], element: "wood" },
  { branches: ["si", "wu", "wei"], element: "fire" },
  { branches: ["shen", "you", "xu"], element: "metal" },
  { branches: ["hai", "zi", "chou"], element: "water" },
];

const TOMB_BRANCH_DETAILS = {
  chen: { main: "earth", residual: "wood", tomb: "water" },
  xu: { main: "earth", residual: "metal", tomb: "fire" },
  chou: { main: "earth", residual: "water", tomb: "metal" },
  wei: { main: "earth", residual: "wood", tomb: "fire" },
};

const FAVORABLE_PATTERN_GUIDE = {
  正官: ["财", "印"],
  七杀: ["食神", "印"],
  正财: ["食神", "官"],
  偏财: ["食神", "官"],
  正印: ["官", "比劫"],
  偏印: ["财", "食神"],
  食神: ["财", "印"],
  伤官: ["印", "财"],
  比肩: ["官", "财"],
  劫财: ["官", "食神"],
  建禄: ["财", "官"],
};

const PALACE_LABELS = {
  year: "祖上父母宫",
  month: "父母兄弟宫",
  day: "夫妻宫",
  hour: "子女晚景宫",
};

const SIX_RELATIVE_FOCUS = {
  parents: {
    palaceKeys: ["year", "month"],
    relations: ["正印", "偏印", "正财", "偏财"],
  },
  marriage_male: {
    palaceKeys: ["day"],
    relations: ["正财", "偏财"],
  },
  marriage_female: {
    palaceKeys: ["day"],
    relations: ["正官", "七杀"],
  },
  children: {
    palaceKeys: ["hour"],
    relations: ["食神", "伤官", "七杀", "正官"],
  },
  wealth: {
    palaceKeys: ["day", "hour"],
    relations: ["正财", "偏财", "食神", "伤官"],
  },
  health: {
    palaceKeys: ["month", "day"],
    relations: ["偏印", "正印", "七杀", "伤官"],
  },
  career: {
    palaceKeys: ["month", "day"],
    relations: ["正官", "七杀", "正印", "偏印"],
  },
};

const NAYIN_60 = {
  "甲子": "海中金", "乙丑": "海中金", "丙寅": "炉中火", "丁卯": "炉中火", "戊辰": "大林木", "己巳": "大林木",
  "庚午": "路旁土", "辛未": "路旁土", "壬申": "剑锋金", "癸酉": "剑锋金", "甲戌": "山头火", "乙亥": "山头火",
  "丙子": "涧下水", "丁丑": "涧下水", "戊寅": "城头土", "己卯": "城头土", "庚辰": "白蜡金", "辛巳": "白蜡金",
  "壬午": "杨柳木", "癸未": "杨柳木", "甲申": "泉中水", "乙酉": "泉中水", "丙戌": "屋上土", "丁亥": "屋上土",
  "戊子": "霹雳火", "己丑": "霹雳火", "庚寅": "松柏木", "辛卯": "松柏木", "壬辰": "长流水", "癸巳": "长流水",
  "甲午": "砂中金", "乙未": "砂中金", "丙申": "山下火", "丁酉": "山下火", "戊戌": "平地木", "己亥": "平地木",
  "庚子": "壁上土", "辛丑": "壁上土", "壬寅": "金箔金", "癸卯": "金箔金", "甲辰": "佛灯火", "乙巳": "佛灯火",
  "丙午": "天河水", "丁未": "天河水", "戊申": "大驿土", "己酉": "大驿土", "庚戌": "钗钏金", "辛亥": "钗钏金",
  "壬子": "桑柘木", "癸丑": "桑柘木", "甲寅": "大溪水", "乙卯": "大溪水", "丙辰": "沙中土", "丁巳": "沙中土",
  "戊午": "天上火", "己未": "天上火", "庚申": "石榴木", "辛酉": "石榴木", "壬戌": "大海水", "癸亥": "大海水",
};

const HEALTH_ELEMENT_MAP = {
  wood: ["肝", "胆", "筋", "四肢伸展"],
  fire: ["心", "小肠", "血液循环", "情绪躁热"],
  earth: ["脾", "胃", "消化", "腹部代谢"],
  metal: ["肺", "大肠", "呼吸道", "皮肤鼻咽"],
  water: ["肾", "膀胱", "泌尿", "生殖与内分泌"],
};

const HIDDEN_STEM_WEIGHTS = [1, 0.6, 0.3];

const PILLAR_QI_WEIGHTS = {
  year: { stem: 0.9, branch: 0.75 },
  month: { stem: 1.25, branch: 1.85 },
  day: { stem: 0, branch: 1.1 },
  hour: { stem: 0.85, branch: 0.8 },
};

const STEM_COMBINES = {
  jia: { pair: "ji", element: "earth" },
  yi: { pair: "geng", element: "metal" },
  bing: { pair: "xin", element: "water" },
  ding: { pair: "ren", element: "wood" },
  wu: { pair: "gui", element: "fire" },
  ji: { pair: "jia", element: "earth" },
  geng: { pair: "yi", element: "metal" },
  xin: { pair: "bing", element: "water" },
  ren: { pair: "ding", element: "wood" },
  gui: { pair: "wu", element: "fire" },
};

const STEM_CLIMATE_MODES = {
  jia: {
    name: "甲庚丁互用",
    stems: ["ding", "geng", "gui"],
    primary: ["fire", "metal"],
    secondary: ["water"],
    summary: "甲木重在先暖后裁，再看是否得水滋扶。",
  },
  yi: {
    name: "乙癸丙模式",
    stems: ["gui", "bing", "geng"],
    primary: ["water", "fire"],
    secondary: ["metal"],
    summary: "乙木藤萝，先要癸水滋养，再要丙火暖局。",
  },
  bing: {
    name: "丙壬甲模式",
    stems: ["ren", "jia", "wu"],
    primary: ["water"],
    secondary: ["wood", "earth"],
    summary: "丙火炎上，先要壬水节烈，再看甲木引通。",
  },
  ding: {
    name: "丁甲庚模式",
    stems: ["jia", "geng", "ren"],
    primary: ["wood", "metal"],
    secondary: ["water"],
    summary: "丁火如灯，先取甲木引燃，再看庚金劈甲成材。",
  },
  wu: {
    name: "戊甲丙癸模式",
    stems: ["jia", "bing", "gui"],
    primary: ["wood", "fire"],
    secondary: ["water"],
    summary: "戊土厚重，先疏后暖，若燥过头再用癸水调剂。",
  },
  ji: {
    name: "己甲丙癸模式",
    stems: ["jia", "bing", "gui"],
    primary: ["wood", "fire"],
    secondary: ["water"],
    summary: "己土湿润，先暖后疏，寒湿重时更喜丙火。",
  },
  geng: {
    name: "庚丁甲模式",
    stems: ["ding", "jia", "ren"],
    primary: ["fire", "wood"],
    secondary: ["water"],
    summary: "庚金重炼，先取丁火，再借甲木引丁成器。",
  },
  xin: {
    name: "辛壬甲模式",
    stems: ["ren", "jia", "bing"],
    primary: ["water", "wood"],
    secondary: ["fire"],
    summary: "辛金珠玉，先壬洗润，再甲疏土，必要时借丙发光。",
  },
  ren: {
    name: "壬庚辛模式",
    stems: ["geng", "xin", "ren"],
    primary: ["metal"],
    secondary: ["water"],
    summary: "壬水江海，重在通源，先看庚辛金是否得力。",
  },
  gui: {
    name: "癸辛庚模式",
    stems: ["xin", "geng", "ren"],
    primary: ["metal"],
    secondary: ["water"],
    summary: "癸水雨露，先辛后庚以通源，再看壬水助势。",
  },
};

const DAYMASTER_SEASONAL_RULES = {
  wood: {
    spring: { note: "木旺待疏", primary: ["fire"], secondary: ["metal", "water"], avoid: ["earth"] },
    summer: { note: "木燥需润", primary: ["water"], secondary: ["metal"], avoid: ["fire"] },
    autumn: { note: "金旺伐木", primary: ["water"], secondary: ["fire"], avoid: ["metal"] },
    winter: { note: "寒木向阳", primary: ["fire"], secondary: ["wood", "earth"], avoid: ["water"] },
  },
  fire: {
    spring: { note: "火赖木生", primary: ["wood", "fire"], secondary: ["water"], avoid: ["metal"] },
    summer: { note: "炎火需济", primary: ["water"], secondary: ["earth"], avoid: ["fire"] },
    autumn: { note: "火退喜扶", primary: ["wood"], secondary: ["fire"], avoid: ["water"] },
    winter: { note: "寒火待燃", primary: ["wood", "fire"], secondary: ["earth"], avoid: ["water"] },
  },
  earth: {
    spring: { note: "湿土待暖", primary: ["fire"], secondary: ["wood"], avoid: ["water"] },
    summer: { note: "燥土喜润", primary: ["water"], secondary: ["wood"], avoid: ["fire"] },
    autumn: { note: "厚土喜疏", primary: ["wood"], secondary: ["water"], avoid: ["earth"] },
    winter: { note: "寒土喜暖", primary: ["fire"], secondary: ["wood"], avoid: ["water"] },
  },
  metal: {
    spring: { note: "金困木乡", primary: ["earth"], secondary: ["metal"], avoid: ["fire"] },
    summer: { note: "金熔待水", primary: ["water"], secondary: ["earth"], avoid: ["fire"] },
    autumn: { note: "金旺需火", primary: ["fire"], secondary: ["water"], avoid: ["metal"] },
    winter: { note: "寒金待炼", primary: ["fire"], secondary: ["earth"], avoid: ["water"] },
  },
  water: {
    spring: { note: "水木泛动", primary: ["earth"], secondary: ["fire"], avoid: ["wood"] },
    summer: { note: "水弱待源", primary: ["metal"], secondary: ["water"], avoid: ["earth"] },
    autumn: { note: "金白水清", primary: ["metal"], secondary: ["water"], avoid: ["fire"] },
    winter: { note: "寒水须阳", primary: ["fire"], secondary: ["wood"], avoid: ["water"] },
  },
};

const STEM_CLIMATE_EFFECTS = {
  jia: { temperature: 1, moisture: -1 },
  yi: { temperature: 1, moisture: 0 },
  bing: { temperature: 4, moisture: -2 },
  ding: { temperature: 3, moisture: -1 },
  wu: { temperature: 1, moisture: -1 },
  ji: { temperature: 0, moisture: 1 },
  geng: { temperature: -1, moisture: -2 },
  xin: { temperature: -2, moisture: -2 },
  ren: { temperature: -4, moisture: 3 },
  gui: { temperature: -3, moisture: 2 },
};

const BRANCH_CLIMATE_EFFECTS = {
  zi: { temperature: -4, moisture: 3 },
  chou: { temperature: -2, moisture: 2 },
  yin: { temperature: 1, moisture: 0 },
  mao: { temperature: 2, moisture: -1 },
  chen: { temperature: 1, moisture: 1 },
  si: { temperature: 4, moisture: -2 },
  wu: { temperature: 5, moisture: -3 },
  wei: { temperature: 3, moisture: -1 },
  shen: { temperature: -1, moisture: -2 },
  you: { temperature: -2, moisture: -3 },
  xu: { temperature: 2, moisture: -2 },
  hai: { temperature: -4, moisture: 2 },
};

const BRANCH_SEASON_GROUP = {
  yin: "spring",
  mao: "spring",
  chen: "spring",
  si: "summer",
  wu: "summer",
  wei: "summer",
  shen: "autumn",
  you: "autumn",
  xu: "autumn",
  hai: "winter",
  zi: "winter",
  chou: "winter",
};

export {
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
};
