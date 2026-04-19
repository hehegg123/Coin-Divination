import { COIN_OPTIONS, ELEMENT_LABELS, buildFortune, getTransitPillars } from "./fortune-core.js";
import { getDayYi, getDayJi } from "./lunar-almanac.js";

const STORAGE_KEY = "fortune-teller-mvp-state";
const LANGUAGE_KEY = "fortune-teller-language";
const DEFAULT_LANGUAGE = "en";
const DEFAULT_TIMEZONE = "America/Indianapolis";

const state = {
  coinLines: [null, null, null, null, null, null],
  castingMode: "quick",
  language: DEFAULT_LANGUAGE,
  isCasting: false,
  latestResult: null,
  scrollRaf: null,
};

const translations = {
  en: {
    heroEyebrow: "Birth Time x Coin Casting",
    heroTitle: "Coin Divination",
    heroText: "A reading for today, drawn from birth time and coin.",
    heroLabel: "Today's Almanac",
    heroGood: "Auspicious",
    heroAvoid: "Avoid",
    introKicker: "Before You Start",
    introTitle: "What You'll Get",
    introText1: "Enter your birth details, pick one topic, and get a reading for today.",
    introText2: "You will see the short answer first, then the deeper Bazi and hexagram reasoning only if you want it.",
    introEstimateLead: "If you do not know the exact birth time, use the closest approximate time you remember for now.",
    introEstimateRule: "A more accurate birth time usually gives a more accurate reading, especially for the hour pillar, luck cycles, and timing-related details.",
    step1Kicker: "Step 1",
    step1Title: "Enter Birth Details",
    birthDate: "Birth Date",
    openCalendar: "Open calendar",
    birthTime: "Birth Time",
    gender: "Gender",
    female: "Female",
    male: "Male",
    other: "Other / Prefer not to say",
    focusArea: "What do you want to focus on today?",
    overall: "Overall",
    career: "Career",
    wealth: "Wealth",
    love: "Love",
    health: "Health",
    step2Kicker: "Step 2",
    step2Title: "Cast Six Coin Lines",
    step2QuickTab: "Quick Reading",
    step2TraditionalTab: "Traditional Coin Casting",
    traditionalRecommended: "Recommended for self-casting",
    quickCastAction: "Automatic Casting",
    randomCast: "Random Cast",
    randomCasting: "Casting...",
    quickCastTitle: "We can perform the ritual for you.",
    quickCastTextLead: "We can perform the ritual for you, so you can get a quick reading. But we do recommend",
    quickCastTextTail: "if you'd like to perform the cast yourself for a more accurate reading.",
    coinGuideIntro: "Best with real coins: toss three coins for each line and record the heads and tails below. For example, if you get two heads and one tail, record it as 2H/1T.",
    coinGuideSteps: "Toss your coins 6 times, record each toss in the six lines below in order, then generate today's reading.",
    clearCast: "Clear Casting",
    generate: "Generate Today's Reading",
    step3Kicker: "Step 3",
    step3Title: "Your Reading",
    emptyState: "After you enter your birth details and complete the six-line casting, your reading will appear here.",
    scoreLabel: "Today's Overall Reading",
    summaryTitle: "Main Reading",
    adviceTitle: "Suggested Action",
    goodTitle: "Favorable",
    avoidTitle: "Avoid",
    structureTitle: "Chart Structure",
    meaningTitle: "What This Means",
    hexagramTitle: "Hexagram Insight",
    lineTitle: "Line Guidance",
    luckTitle: "Luck Cycles",
    hexagramGroupKicker: "From the Hexagram",
    hexagramGroupTitle: "Hexagram-Based Reading",
    hexagramGroupNote: "These cards come from the coin casting itself: image, moving lines, and change.",
    baziGroupKicker: "From the Birth Chart",
    baziGroupTitle: "Bazi-Based Reading",
    baziGroupNote: "These cards come from the natal chart, season, and luck-cycle background.",
    blendedGroupKicker: "Blended Reading",
    blendedGroupTitle: "Combined Reading",
    blendedGroupNote: "These cards combine the chart background with the current hexagram to answer today's question.",
    advancedToggle: "See the full chart breakdown",
    advancedToggleHint: "Hexagram detail, chart structure, and longer-cycle context",
    overallMetric: "Overall",
    careerMetric: "Career",
    wealthMetric: "Wealth",
    loveMetric: "Love",
    healthMetric: "Health",
    unsetLine: "Not cast",
    castProgress: "Manual first: record Line {line} next. Completed {count}/6.",
    castReady: "All 6 lines are recorded. Generate today's reading when you're ready.",
    castStable: "The hexagram looks relatively stable today. Steady progress is favored.",
    castDynamic: "The hexagram has several moving lines. Leave room for adjustments today.",
    errorMissing: "Please complete the birth details first.",
    errorBirthDate: "Please use a valid birth date before continuing.",
    errorQuickCast: "Use Cast My Reading first so we can generate all six lines for you.",
    errorCoins: "Please complete all six coin lines first.",
  },
  zh: {
    heroEyebrow: "生辰时间 x 起卦",
    heroTitle: "Coin Divination",
    heroText: "从生辰时间与起卦中，为今天读出一则提示。",
    heroLabel: "今日凶吉",
    heroGood: "宜",
    heroAvoid: "忌",
    introKicker: "开始前",
    introTitle: "你会看到什么",
    introText1: "先输入生辰信息，再选一个你今天最想问的方向，系统会给你一份今天的阅读。",
    introText2: "你会先看到短版结论；如果想看更深的命盘和卦象依据，再展开详细部分。",
    introEstimateLead: "如果你不知道精确出生时间，可以先用你记得最接近的大概时间代替。",
    introEstimateRule: "出生时间越准确，结果通常也会越准确，尤其会影响时柱、大运起算和一些细节判断。",
    step1Kicker: "步骤 1",
    step1Title: "输入命盘信息",
    birthDate: "出生日期",
    openCalendar: "打开日历",
    birthTime: "出生时间",
    gender: "性别",
    female: "女",
    male: "男",
    other: "其他 / 不设定",
    focusArea: "你今天最想问的方向",
    overall: "整体运势",
    career: "事业推进",
    wealth: "财务机会",
    love: "感情互动",
    health: "身心状态",
    step2Kicker: "步骤 2",
    step2Title: "六次古钱起卦",
    step2QuickTab: "快速起卦",
    step2TraditionalTab: "手动起卦",
    traditionalRecommended: "更推荐亲手起卦",
    quickCastAction: "自动起卦",
    randomCast: "随机起一卦",
    randomCasting: "起卦中...",
    quickCastTitle: "我们可以代你完成起卦仪式。",
    quickCastTextLead: "我们可以代你完成起卦仪式，让你先快速得到一版阅读；不过如果你想要更准确的结果，还是更推荐你切换到",
    quickCastTextTail: "自己亲手起卦。",
    coinGuideIntro: "更推荐手动起卦：每次抛三枚硬币，古钱币更佳，把正面和反面的数量记录在下方。比如两正一反，就记作 2H/1T。",
    coinGuideSteps: "抛掷 6 次硬币后，按顺序把每次结果记录到下方六爻，再生成今日运势。",
    clearCast: "清空起卦",
    generate: "生成今日运势",
    step3Kicker: "步骤 3",
    step3Title: "综合结果",
    emptyState: "填写生辰并完成六次起卦后，这里会出现你的阅读结果。",
    scoreLabel: "今日总运",
    summaryTitle: "主判断",
    adviceTitle: "行动建议",
    goodTitle: "宜",
    avoidTitle: "忌",
    structureTitle: "命理结构",
    meaningTitle: "这代表什么",
    hexagramTitle: "卦象提示",
    lineTitle: "爻位变化",
    luckTitle: "大运与流年",
    hexagramGroupKicker: "卦象相关",
    hexagramGroupTitle: "起卦结果",
    hexagramGroupNote: "这一组只看这次起卦本身，重点放在卦象、动爻和变动方向。",
    baziGroupKicker: "八字相关",
    baziGroupTitle: "命盘背景",
    baziGroupNote: "这一组来自你的原局、大运流年与今天的时令背景。",
    blendedGroupKicker: "合成判断",
    blendedGroupTitle: "综合结果",
    blendedGroupNote: "这一组把命盘背景和当前卦象放在一起，回答你今天这件事该怎么把握。",
    advancedToggle: "展开完整命盘解释",
    advancedToggleHint: "卦象细节、命盘结构和更长周期的背景",
    overallMetric: "整体",
    careerMetric: "事业",
    wealthMetric: "财运",
    loveMetric: "感情",
    healthMetric: "健康",
    unsetLine: "未落爻",
    castProgress: "更推荐手动起卦：下一步先记录第 {line} 爻，当前已完成 {count}/6。",
    castReady: "六爻已经记录完成，可以生成今日运势。",
    castStable: "卦象相对稳定，适合按步骤推进。",
    castDynamic: "卦象变化偏多，今天更适合留余地。",
    errorMissing: "请先补全出生信息。",
    errorBirthDate: "请先填写有效的出生日期。",
    errorQuickCast: "请先点“直接生成阅读”，系统才能先帮你起出六爻。",
    errorCoins: "请先完成六次古钱起卦。",
  },
};

const phraseMap = {
  "上扬日": "Rising day",
  "顺势日": "Favorable day",
  "平衡日": "Balanced day",
  "谨慎日": "Cautious day",
  "收敛日": "Low-profile day",
  "极强": "very strong",
  "偏强": "strong",
  "中和": "balanced",
  "偏弱": "weak",
  "极弱": "very weak",
  比肩: "Friend Star",
  劫财: "Rob Wealth",
  食神: "Eating God",
  伤官: "Hurting Officer",
  偏财: "Indirect Wealth",
  正财: "Direct Wealth",
  七杀: "Seven Killings",
  正官: "Direct Officer",
  偏印: "Indirect Resource",
  正印: "Direct Resource",
  建禄: "Jian Lu",
  "三合/三会主导": "major harmony structure",
  半合主导: "partial harmony structure",
  月干透出: "month stem revealed",
  月令藏干: "month branch hidden stem",
  "木局": "Wood frame",
  "火局": "Fire frame",
  "土局": "Earth frame",
  "金局": "Metal frame",
  "水局": "Water frame",
  "半木局": "Partial Wood frame",
  "半火局": "Partial Fire frame",
  "半土局": "Partial Earth frame",
  "半金局": "Partial Metal frame",
  "半水局": "Partial Water frame",
  "建禄格": "Jian Lu frame",
  "从强格": "Follow-strong frame",
  "从弱格": "Follow-weak frame",
  "伤官配印": "Hurting Officer with Resource",
  "杀印相生": "Seven Killings supported by Resource",
  "官印相生": "Officer and Resource in mutual support",
  "财官相生": "Wealth generating Officer",
  "食伤生财": "Output generating Wealth",
  "月令得禄": "month command receives Lu",
  "月令比肩透气": "month command expresses peer qi",
  "强弱转化": "follow pattern from strength shift",
  "食伤与印星并见": "output and resource appear together",
  "七杀与印星相生": "Seven Killings and Resource form support",
  "官星与印星并见": "Officer and Resource appear together",
  "财星引官": "wealth star leads officer star",
  "食伤泄秀生财": "output releases qi to generate wealth",
  金肃偏燥: "dry and sharp metal climate",
  木旺偏燥: "dry wood-heavy climate",
  水寒偏重: "cold water-heavy climate",
  火炎偏燥: "hot and dry fire climate",
  土重偏滞: "heavy and stagnant earth climate",
  木旺待疏: "wood is excessive and needs pruning",
  "木燥需润": "dry wood needs moisture",
  "金旺伐木": "metal is strong and cuts wood",
  "寒木向阳": "cold wood seeks warmth and sunlight",
  "火赖木生": "fire relies on wood to grow",
  "炎火需济": "blazing fire needs cooling balance",
  "火退喜扶": "retreating fire needs support",
  "寒火待燃": "cold fire needs fuel",
  "湿土待暖": "damp earth needs warmth",
  "燥土喜润": "dry earth prefers moisture",
  "厚土喜疏": "heavy earth needs loosening",
  "寒土喜暖": "cold earth prefers warmth",
  "金困木乡": "metal is constrained in wood territory",
  "金熔待水": "molten metal needs water",
  "金旺需火": "strong metal needs fire",
  "寒金待炼": "cold metal needs forging",
  "水木泛动": "water and wood move too freely",
  "水弱待源": "weak water needs a source",
  "金白水清": "clear metal brings clear water",
  "寒水须阳": "cold water needs yang warmth",
  "寒湿偏重": "cold and damp are pronounced",
  "炎热偏燥": "heat and dryness are pronounced",
  "偏寒": "leaning cold",
  "偏热": "leaning hot",
  "偏燥": "leaning dry",
  "偏湿": "leaning damp",
  "寒暖燥湿较平": "temperature and moisture are relatively balanced",
  "顺行": "forward",
  "逆行": "reverse",
  "小寒": "Minor Cold",
  "立春": "Start of Spring",
  "惊蛰": "Awakening of Insects",
  "清明": "Clear and Bright",
  "立夏": "Start of Summer",
  "芒种": "Grain in Ear",
  "小暑": "Minor Heat",
  "立秋": "Start of Autumn",
  "白露": "White Dew",
  "寒露": "Cold Dew",
  "立冬": "Start of Winter",
  "大雪": "Major Snow",
  "木金对照较明显": "wood and metal stand in strong contrast",
  "木火气势较明显": "wood and fire are especially active",
  "水火对照较明显": "water and fire stand in strong contrast",
  "火水对照较明显": "fire and water stand in strong contrast",
  "土金结构较明显": "earth and metal structure is prominent",
  "火土相随较明显": "fire and earth move together clearly",
  "旺": "in season",
  "相": "supported by season",
  "平": "neutral",
  "休": "resting",
  "囚": "constrained",
  "死": "out of season",
  印: "Resource",
  财: "Wealth",
  官: "Officer",
  比劫: "Companions",
  "低调日": "Low-profile day",
  "定主线": "Set one main track",
  "见关键人": "Meet a key person",
  "完成收尾": "Finish loose ends",
  "列优先级": "Set priorities",
  "临时改主意": "Last-minute changes",
  "情绪化答应": "Emotional promises",
  "过量社交": "Excessive socializing",
  "一次做太多": "Doing too much at once",
  "推进合作": "Advance collaboration",
  "梳理账目": "Review finances",
  "主动沟通": "Initiate communication",
  "规律作息": "Keep a steady routine",
  "安排复盘": "Plan a review",
  "补文书": "Handle paperwork",
  "小步快跑": "Move in small steps",
  "保留弹性": "Keep some flexibility",
  "草率下注": "Hasty risk taking",
  "硬碰硬": "Direct confrontation",
  "拖延决定": "Delayed decisions",
  "熬夜透支": "Late-night overexertion",
  "冲动消费": "Impulse spending",
  "旧事翻账": "Reopening old conflicts",
  "话说太满": "Overpromising",
  "勉强表态": "Forced statements",
  汇报: "Give updates",
  定方案: "Set the plan",
  跟进项目: "Follow up on projects",
  简化流程: "Simplify workflow",
  复核账目: "Review accounts",
  小额尝试: "Try small positions",
  谈条件: "Negotiate terms",
  控制开支: "Control spending",
  真诚沟通: "Speak sincerely",
  表达感谢: "Show appreciation",
  减少试探: "Reduce mixed signals",
  留空间: "Leave space",
  早睡早起: "Keep regular sleep",
  早点休息: "Get to bed earlier",
  轻运动: "Do light exercise",
  温和运动: "Choose gentle exercise",
  补水: "Stay hydrated",
  放慢节奏: "Slow the pace",
  祭祀: "Offer rituals",
  祈福: "Pray for blessings",
  求嗣: "Pray for children",
  开光: "Consecrate",
  沐浴: "Purification bath",
  酬神: "Offer thanks to deities",
  造庙: "Build a temple",
  斋醮: "Hold fasting rites",
  焚香: "Burn incense",
  谢土: "Thank the earth",
  出火: "Move the household fire",
  雕刻: "Carving work",
  嫁娶: "Marriage",
  订婚: "Engagement",
  纳采: "Betrothal",
  问名: "Exchange names",
  纳婿: "Receive a son-in-law",
  归宁: "Return to family",
  安床: "Set the bed",
  合帐: "Set up bed curtains",
  冠笄: "Coming-of-age rite",
  订盟: "Formalize an alliance",
  进人口: "Add household members",
  裁衣: "Cut garments",
  挽面: "Facial grooming rite",
  开容: "Open the face ceremony",
  修坟: "Repair a grave",
  启钻: "Open the burial marker",
  入宅: "Move into home",
  安门: "Install doors",
  修造: "Construction",
  起基: "Lay foundations",
  动土: "Break ground",
  上梁: "Raise beams",
  竖柱: "Raise pillars",
  开井开池: "Open wells and ponds",
  作陂放水: "Build banks and release water",
  拆卸: "Demolition",
  破屋: "Demolish house",
  坏垣: "Clear broken walls",
  补垣: "Repair walls",
  伐木做梁: "Cut timber for beams",
  作灶: "Build stove",
  解除: "Remove obstacles",
  开柱眼: "Open pillar holes",
  穿屏扇架: "Install screens and frames",
  盖屋合脊: "Roof and close the ridge",
  开厕: "Open a toilet room",
  造仓: "Build storage",
  塞穴: "Seal openings",
  平治道涂: "Level roads",
  造桥: "Build bridges",
  作厕: "Build a toilet",
  筑堤: "Build embankments",
  开池: "Open a pond",
  伐木: "Cut timber",
  开渠: "Open channels",
  掘井: "Dig wells",
  扫舍: "Clean the house",
  放水: "Release water",
  造屋: "Build a house",
  合脊: "Close the roof ridge",
  造畜稠: "Build livestock pens",
  修门: "Repair doors",
  定磉: "Set foundation stones",
  作梁: "Set beams",
  修饰垣墙: "Repair walls and enclosures",
  架马: "Set up scaffolding",
  开市: "Open for business",
  挂匾: "Hang a signboard",
  纳财: "Receive wealth",
  求财: "Seek wealth",
  开仓: "Open storage",
  买车: "Buy a vehicle",
  置产: "Acquire property",
  雇佣: "Hire people",
  出货财: "Dispatch goods and funds",
  安机械: "Install machinery",
  造车器: "Build vehicles or tools",
  经络: "Meridian treatment",
  酝酿: "Brew alcohol",
  作染: "Dye fabric",
  鼓铸: "Casting and smelting",
  造船: "Build a boat",
  割蜜: "Harvest honey",
  栽种: "Planting",
  取渔: "Fishing",
  结网: "Cast or mend nets",
  牧养: "Animal husbandry",
  安碓硙: "Install grinding stones",
  习艺: "Practice a craft",
  入学: "Begin studies",
  理发: "Get a haircut",
  探病: "Visit the sick",
  见贵: "Meet helpful people",
  乘船: "Travel by boat",
  渡水: "Cross water",
  针灸: "Acupuncture",
  出行: "Travel",
  移徙: "Relocate",
  分居: "Separate households",
  剃头: "Shave hair",
  整手足甲: "Trim nails",
  纳畜: "Receive livestock",
  捕捉: "Capture",
  畋猎: "Hunting",
  教牛马: "Train cattle and horses",
  会亲友: "Meet family and friends",
  赴任: "Take office",
  求医: "Seek medical help",
  治病: "Treat illness",
  词讼: "Legal disputes",
  起基动土: "Lay foundations and break ground",
  盖屋: "Build roofing",
  造仓库: "Build warehouses",
  立券交易: "Sign contracts and trade",
  交易: "Make transactions",
  立券: "Sign contracts",
  会友: "Meet friends",
  求医疗病: "Seek treatment",
  诸事不宜: "Avoid major undertakings",
  馀事勿取: "Do not add extra matters",
  余事勿取: "Do not add extra matters",
  行丧: "Funeral matters",
  断蚁: "Pest clearing",
  安葬: "Burial",
  破土: "Break ground for burial",
  立碑: "Set a memorial stone",
  成服: "Mourning attire rite",
  除服: "End mourning rite",
  开生坟: "Prepare a burial plot",
  合寿木: "Prepare longevity wood",
  入殓: "Encoffinment",
  移柩: "Move the coffin",
  普渡: "Universal offering rite",
  安香: "Install incense altar",
  无: "None",
  抢答: "Jump in too fast",
  同时开太多: "Open too many tasks",
  情绪消费: "Emotional spending",
  模糊边界: "Blurred boundaries",
  忽略休息: "Ignore rest",
  少熬夜: "Sleep earlier",
  规律饮食: "Keep meals regular",
  空口承诺: "Make empty promises",
  强推对抗: "Force confrontation",
  忽略细节: "Miss important details",
  拖到太晚: "Leave it too late",
  急于回本: "Rush to recover losses",
  跟风下注: "Follow the crowd into bets",
  口头交易: "Rely on verbal deals only",
  翻旧账: "Bring up old grievances",
  过度脑补: "Over-interpret signals",
  冷处理过久: "Stay emotionally distant too long",
  赌气表达: "Speak out of spite",
  久坐不动: "Stay sedentary too long",
  饮食失衡: "Eat out of balance",
  透支体力: "Overdraw your energy",
  睡前高刺激: "Overstimulate before sleep",
  减负: "Lighten the load",
  缓一缓: "Slow down for now",
  轻装出行: "Travel light",
  整理思路: "Sort out your thoughts",
  修补关系: "Repair relationships",
  争强好胜: "Push to outcompete others",
  临时变卦: "Change course at the last minute",
  过量熬夜: "Stay up too late",
  推进正事: "Move key work forward",
  安排会面: "Arrange meetings",
  情绪对抗: "Argue emotionally",
  仓促承诺: "Make rushed promises",
  沟通表达: "Communicate clearly",
  处理文书: "Handle paperwork",
  反复犹豫: "Waver repeatedly",
  分心太多: "Spread attention too thin",
  规划财务: "Plan finances",
  复盘进度: "Review progress",
  稳步推进: "Advance steadily",
  冒进下注: "Take reckless risks",
  拜访贵人: "Visit a helpful ally",
  打磨细节: "Refine the details",
  急于求成: "Push for quick results",
  轻量行动: "Take light action",
  整理空间: "Tidy your space",
  修养身心: "Restore body and mind",
  超额安排: "Over-schedule yourself",
  透支精力: "Drain your energy reserves",
  休整充电: "Rest and recharge",
  陪伴家人: "Spend time with family",
  仓促开局: "Start too hastily",
  争论输赢: "Argue over winning and losing",
};

const trigramMap = {
  qian: { name: "Heaven", title: "Heaven in motion", reading: "Strong yang energy supports initiative, decisions, and stepping forward." },
  kun: { name: "Earth", title: "Earth in support", reading: "Focus on receptivity, organization, and steady coordination." },
  zhen: { name: "Thunder", title: "Thunder begins", reading: "Things are ready to start moving, but hesitation costs momentum." },
  xun: { name: "Wind", title: "Wind enters", reading: "Good for communication, negotiation, writing, and information flow." },
  kan: { name: "Water", title: "Water through risk", reading: "There is uncertainty in the field, so clarity before action is safer." },
  li: { name: "Fire", title: "Fire brings clarity", reading: "Good for expression, visibility, presentation, and aesthetics, but avoid rushing." },
  gen: { name: "Mountain", title: "Mountain sets a boundary", reading: "Good for closing loops, reviewing, and setting limits instead of forcing progress." },
  dui: { name: "Lake", title: "Lake invites exchange", reading: "Good for social feedback and rapport, while watching words carefully." },
};

const elementEnglishMap = {
  wood: "Wood",
  fire: "Fire",
  earth: "Earth",
  metal: "Metal",
  water: "Water",
};

const stemEnglishMap = {
  jia: "Jia",
  yi: "Yi",
  bing: "Bing",
  ding: "Ding",
  wu: "Wu",
  ji: "Ji",
  geng: "Geng",
  xin: "Xin",
  ren: "Ren",
  gui: "Gui",
};

const branchEnglishMap = {
  zi: "Zi",
  chou: "Chou",
  yin: "Yin",
  mao: "Mao",
  chen: "Chen",
  si: "Si",
  wu: "Wu",
  wei: "Wei",
  shen: "Shen",
  you: "You",
  xu: "Xu",
  hai: "Hai",
};

const focusLabelMap = {
  en: {
    overall: "Today's Reading",
    career: "Career Reading",
    wealth: "Wealth Reading",
    love: "Love Reading",
    health: "Health Reading",
  },
  zh: {
    overall: "今日总运",
    career: "事业运势",
    wealth: "财运评分",
    love: "感情运势",
    health: "健康运势",
  },
};

const form = document.querySelector("#fortune-form");
const heroDate = document.querySelector("#hero-date");
const heroBlurb = document.querySelector("#hero-blurb");
const coinLinesContainer = document.querySelector("#coin-lines");
const analyzeButton = document.querySelector("#analyze-button");
const randomizeButton = document.querySelector("#randomize-all");
const clearButton = document.querySelector("#clear-casting");
const step1Error = document.querySelector("#step1-error");
const step2Error = document.querySelector("#step2-error");
const emptyState = document.querySelector("#empty-state");
const resultsPanel = document.querySelector("#results");
const advancedReading = document.querySelector("#advanced-reading");
const resultsSection = resultsPanel?.closest(".panel-results");
const birthDateInput = document.querySelector("#birth-date");
const birthDatePicker = document.querySelector("#birth-date-picker");
const birthDatePickerButton = document.querySelector("#birth-date-picker-button");
const birthTimeInput = document.querySelector("#birth-time");
const castingProgress = document.querySelector("#casting-progress");
const castingRouteButtons = [...document.querySelectorAll("[data-casting-mode]")];
const quickCastingRoute = document.querySelector('#casting-route-quick');
const traditionalCastingRoute = document.querySelector('#casting-route-traditional');
const switchToTraditionalButton = document.querySelector("#switch-to-traditional");
const langEnButton = document.querySelector("#lang-en");
const langZhButton = document.querySelector("#lang-zh");
const coinStage = document.querySelector("#coin-stage");
const coinDiscs = [...document.querySelectorAll(".coin-disc")];
const estimateButtons = [...document.querySelectorAll("[data-estimate-time]")];

function t(key) {
  return translations[state.language][key] ?? translations.en[key] ?? key;
}

function persistLanguage() {
  localStorage.setItem(LANGUAGE_KEY, state.language);
}

function restoreLanguage() {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (saved === "en" || saved === "zh") state.language = saved;
}

function applyTranslations() {
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  document.title = "Coin Divination";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (key) node.textContent = t(key);
  });
  if (birthDatePickerButton) {
    birthDatePickerButton.setAttribute("aria-label", t("openCalendar"));
    birthDatePickerButton.setAttribute("title", t("openCalendar"));
  }
  if (birthDatePicker) {
    birthDatePicker.setAttribute("aria-label", t("birthDate"));
  }
  langEnButton.classList.toggle("active", state.language === "en");
  langZhButton.classList.toggle("active", state.language === "zh");
  randomizeButton.textContent = randomizeButtonLabel();
}

function randomizeButtonLabel() {
  if (state.isCasting) return t("randomCasting");
  return state.castingMode === "quick" ? t("quickCastAction") : t("randomCast");
}

function clearStepError(step) {
  const node = step === "step1" ? step1Error : step2Error;
  if (!node) return;
  node.textContent = "";
  node.classList.add("hidden");
}

function clearStepErrors() {
  clearStepError("step1");
  clearStepError("step2");
}

function showStepError(step, message) {
  const node = step === "step1" ? step1Error : step2Error;
  if (!node) return;
  node.textContent = message;
  node.classList.remove("hidden");
}

function syncCastingMode() {
  const isQuick = state.castingMode === "quick";
  quickCastingRoute.hidden = !isQuick;
  traditionalCastingRoute.hidden = isQuick;
  castingRouteButtons.forEach((button) => {
    const active = button.dataset.castingMode === state.castingMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function setCastingMode(mode) {
  state.castingMode = mode === "traditional" ? "traditional" : "quick";
  syncCastingMode();
  randomizeButton.textContent = randomizeButtonLabel();
}

function normalizeBirthDate(value) {
  const raw = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : "";
}

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function formatBirthDateDigits(rawValue) {
  const digits = String(rawValue || "").replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function isoToUsDate(isoDate) {
  const normalized = normalizeBirthDate(isoDate);
  if (!normalized) return "";
  const [year, month, day] = normalized.split("-");
  return `${month}/${day}/${year}`;
}

function parseBirthDateInput(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return "";

  const isoValue = normalizeBirthDate(value);
  if (isoValue) return isoValue;

  const slashMatch = value.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (!slashMatch) return "";

  const [, monthRaw, dayRaw, yearRaw] = slashMatch;
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const year = Number(yearRaw);
  const test = new Date(year, month - 1, day, 12, 0, 0);
  if (
    Number.isNaN(test.getTime()) ||
    test.getFullYear() !== year ||
    test.getMonth() !== month - 1 ||
    test.getDate() !== day
  ) {
    return "";
  }

  return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
}

function getBirthDateIso() {
  const typedValue = String(birthDateInput?.value || "").trim();
  if (typedValue) return parseBirthDateInput(typedValue);
  return normalizeBirthDate(birthDatePicker?.value || "");
}

function setBirthDateDisplay(value) {
  const iso = parseBirthDateInput(value);
  if (birthDateInput) {
    birthDateInput.value = iso ? isoToUsDate(iso) : "";
  }
  if (birthDatePicker) {
    birthDatePicker.value = iso;
  }
}

function openBirthDatePicker() {
  if (!birthDatePicker) return;
  if (typeof birthDatePicker.showPicker === "function") {
    try {
      birthDatePicker.showPicker();
      return;
    } catch {
      // Fall through for browsers that block showPicker.
    }
  }
  birthDatePicker.focus();
  birthDatePicker.click();
}

function syncEstimateSelection() {
  const currentTime = birthTimeInput?.value || "";
  estimateButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.estimateTime === currentTime);
  });
}

function applyEstimatedBirthTime(time) {
  if (!birthTimeInput || !time) return;
  birthTimeInput.value = time;
  clearStepError("step1");
  resetReadingView();
  syncEstimateSelection();
  updateHeroBlurb();
  persistState();
}

function persistState() {
  const snapshot = {
    birthDate: getBirthDateIso(),
    birthTime: document.querySelector("#birth-time").value,
    gender: document.querySelector("#gender").value,
    focusArea: document.querySelector("#focus-area").value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function resetReadingView() {
  state.latestResult = null;
  resultsPanel?.classList.add("hidden");
  emptyState?.classList.remove("hidden");
  if (advancedReading) advancedReading.open = false;
}

function restoreState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const snapshot = JSON.parse(raw);
    setBirthDateDisplay(snapshot.birthDate || "");
    document.querySelector("#birth-time").value = snapshot.birthTime || "12:00";
    document.querySelector("#gender").value = snapshot.gender || "female";
    document.querySelector("#focus-area").value = snapshot.focusArea || "overall";
    state.coinLines = [null, null, null, null, null, null];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function todayInTimezone(timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function updateHeroDate() {
  const locale = state.language === "zh" ? "zh-CN" : "en-US";
  const sourceDate = todayInTimezone(DEFAULT_TIMEZONE);
  const referenceDate = new Date(`${sourceDate}T12:00:00`);
  heroDate.textContent = new Intl.DateTimeFormat(locale, {
    timeZone: DEFAULT_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(referenceDate);
}

function formatAlmanacList(items) {
  const visible = items.filter(Boolean).slice(0, 6);
  if (!visible.length) {
    return state.language === "zh" ? "无特别事项" : "No strong indication";
  }
  return state.language === "zh"
    ? visible.join("、")
    : visible.map((item) => toEnglish(item)).join(", ");
}

function buildHeroAlmanacHtml(goodTags, avoidTags) {
  const goodText = formatAlmanacList(goodTags);
  const avoidText = formatAlmanacList(avoidTags);
  return `<div class="hero-almanac"><div class="hero-almanac-row"><strong>${t("heroGood")}</strong><div class="hero-almanac-detail">${goodText}</div></div><div class="hero-almanac-row"><strong>${t("heroAvoid")}</strong><div class="hero-almanac-detail">${avoidText}</div></div></div>`;
}

function getDailyAlmanac() {
  // The hero almanac is intentionally date-only.
  // It should reflect the day's traditional almanac and stay independent
  // from the user's birth chart or casting result.
  const today = todayInTimezone(DEFAULT_TIMEZONE);
  const transit = getTransitPillars(today, DEFAULT_TIMEZONE);
  return {
    good: getDayYi(transit.monthPillar.label, transit.dayPillar.label),
    avoid: getDayJi(transit.monthPillar.label, transit.dayPillar.label),
  };
}

function getCoinDescriptor(value) {
  return COIN_OPTIONS.find((option) => option.value === value);
}

function coinOptionText(option) {
  if (state.language === "zh") return `${option.label} · ${option.nature}`;
  const englishMap = {
    6: "0H/3T · Old Yin",
    7: "1H/2T · Yang",
    8: "2H/1T · Yin",
    9: "3H/0T · Old Yang",
  };
  return englishMap[option.value] ?? String(option.value);
}

function coinChipText(value) {
  if (!value) return t("unsetLine");
  if (state.language === "zh") return `${getCoinDescriptor(value).symbol} ${value}`;
  const englishMap = {
    6: `Changing Yin ${value}`,
    7: `Yang ${value}`,
    8: `Yin ${value}`,
    9: `Changing Yang ${value}`,
  };
  return englishMap[value] ?? String(value);
}

function filledCoinLineCount() {
  return state.coinLines.filter(Boolean).length;
}

function nextOpenCoinLineIndex() {
  return state.coinLines.findIndex((line) => !line);
}

function updateCastingProgress() {
  if (!castingProgress) return;
  const count = filledCoinLineCount();
  const nextIndex = nextOpenCoinLineIndex();
  if (nextIndex === -1) {
    castingProgress.textContent = t("castReady");
    castingProgress.classList.add("is-ready");
    return;
  }
  castingProgress.textContent = t("castProgress")
    .replace("{count}", String(count))
    .replace("{line}", String(nextIndex + 1));
  castingProgress.classList.remove("is-ready");
}

function refreshCastingActions() {
  const allRecorded = nextOpenCoinLineIndex() === -1;
  randomizeButton.disabled = state.isCasting;
  clearButton.disabled = state.isCasting;
  analyzeButton.disabled = state.isCasting || !allRecorded;
  randomizeButton.textContent = randomizeButtonLabel();
}

function focusCoinLine(index) {
  if (index < 0) return;
  const targetRow = [...document.querySelectorAll(".line-row")][index];
  if (!targetRow) return;
  targetRow.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderCoinRows() {
  coinLinesContainer.innerHTML = "";
  const nextIndex = nextOpenCoinLineIndex();
  for (let index = 0; index < 6; index += 1) {
    const lineNumber = index + 1;
    const row = document.createElement("div");
    const isCurrent = nextIndex !== -1 && index === nextIndex;
    const isUpcoming = nextIndex !== -1 && index > nextIndex;
    const isComplete = Boolean(state.coinLines[index]);
    row.className = `line-row${isCurrent ? " is-current" : ""}${isUpcoming ? " is-upcoming" : ""}${isComplete ? " is-complete" : ""}`;

    const label = document.createElement("div");
    label.className = "line-label";
    label.textContent = state.language === "zh" ? `第 ${lineNumber} 爻` : `Line ${lineNumber}`;
    row.appendChild(label);

    const options = document.createElement("div");
    options.className = "line-options";

    for (const option of COIN_OPTIONS) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `option-button${state.coinLines[index] === option.value ? " active" : ""}`;
      button.textContent = coinOptionText(option);
      button.disabled = state.isCasting || isUpcoming;
      button.addEventListener("click", () => {
        if (state.isCasting || isUpcoming) return;
        clearStepError("step2");
        state.coinLines[index] = option.value;
        resetReadingView();
        renderCoinRows();
        updateHeroBlurb();
        persistState();
        window.setTimeout(() => focusCoinLine(nextOpenCoinLineIndex()), 120);
      });
      options.appendChild(button);
    }

    const chip = document.createElement("div");
    chip.className = "line-chip";
    chip.textContent = coinChipText(state.coinLines[index]);

    row.appendChild(options);
    row.appendChild(chip);
    coinLinesContainer.appendChild(row);
  }
  updateCastingProgress();
  refreshCastingActions();
}

function resetCoinStage() {
  coinStage.classList.remove("active");
}

function animateCoinStage(lineNumber) {
  coinDiscs.forEach((disc) => {
    const face = Math.random() > 0.5 ? "yang" : "yin";
    const drift = `${Math.round((Math.random() - 0.5) * 20)}px`;
    const lift = `${44 + Math.round(Math.random() * 16)}px`;
    const spin = `${900 + Math.round(Math.random() * 540)}deg`;
    disc.dataset.face = face;
    disc.style.setProperty("--coin-drift", drift);
    disc.style.setProperty("--coin-lift", lift);
    disc.style.setProperty("--coin-spin", spin);
  });
  coinStage.classList.remove("active");
  void coinStage.offsetWidth;
  coinStage.classList.add("active");
}

function updateHeroBlurb() {
  const almanac = getDailyAlmanac();
  heroBlurb.innerHTML = buildHeroAlmanacHtml(almanac.good, almanac.avoid);
}

function collectPayload() {
  const birthDate = getBirthDateIso();
  const birthTime = document.querySelector("#birth-time").value;
  const analysisDate = todayInTimezone(DEFAULT_TIMEZONE);
  const focusArea = document.querySelector("#focus-area").value;
  const gender = document.querySelector("#gender").value;
  return { birthDate, birthTime, timezone: DEFAULT_TIMEZONE, analysisDate, focusArea, gender, coinLines: [...state.coinLines] };
}

function validateBirthStep() {
  const birthDateRaw = String(birthDateInput?.value || birthDatePicker?.value || "").trim();
  const birthDate = getBirthDateIso();
  const birthTime = document.querySelector("#birth-time").value;
  if (birthDateRaw && !birthDate) return { step: "step1", message: t("errorBirthDate") };
  if (!birthDate || !birthTime) return { step: "step1", message: t("errorMissing") };
  return null;
}

function validateSteps() {
  const birthValidation = validateBirthStep();
  if (birthValidation) return birthValidation;
  if (state.coinLines.some((line) => !line)) {
    return { step: "step2", message: t(state.castingMode === "quick" ? "errorQuickCast" : "errorCoins") };
  }
  return null;
}

function renderMetrics(metrics) {
  const labels = {
    overall: t("overallMetric"),
    career: t("careerMetric"),
    wealth: t("wealthMetric"),
    love: t("loveMetric"),
    health: t("healthMetric"),
  };
  return Object.entries(labels)
    .map(([key, label]) => `<article class="metric-card"><h4>${label}</h4><p class="metric-value">${metrics[key]}</p></article>`)
    .join("");
}

function toEnglish(text) {
  const normalized = String(text ?? "").trim();
  return phraseMap[normalized] ?? text;
}

function elementLabel(element) {
  return state.language === "zh" ? ELEMENT_LABELS[element] : elementEnglishMap[element];
}

function formatDisplayDate(dateInput) {
  const locale = state.language === "zh" ? "zh-CN" : "en-US";
  const referenceDate = new Date(`${dateInput}T12:00:00`);
  return new Intl.DateTimeFormat(locale, {
    timeZone: DEFAULT_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(referenceDate);
}

function translateList(items, separator = ", ") {
  return items.map((item) => toEnglish(item)).join(separator);
}

function renderTag(tag) {
  const value = state.language === "zh" ? tag : toEnglish(tag);
  return `<li><span class="tag-en">${value}</span></li>`;
}

function englishTier(result) {
  if (result.score >= 86) return "Rising day";
  if (result.score >= 72) return "Favorable day";
  if (result.score >= 58) return "Balanced day";
  if (result.score >= 45) return "Cautious day";
  return "Low-profile day";
}

function englishHexagramSummary(result) {
  const movingCount = result.hexagram.movingLines.length;
  const primary = englishHexagramTitle(result);
  const changed = result.hexagram.changedNameEn || result.hexagram.changedTitle || primary;
  if (movingCount === 0) return `The cast forms ${primary} with no moving lines, so the day holds to one main track rather than changing shape midway.`;
  if (movingCount === 1) return `The cast forms ${primary}, with line ${result.hexagram.movingLines[0]} moving, so the real adjustment point is concentrated and the later tendency turns toward ${changed}.`;
  if (movingCount <= 3) return `The cast forms ${primary} with ${movingCount} moving lines, so the situation develops through adjustment and gradually turns toward ${changed}.`;
  return `The cast forms ${primary} with many moving lines, so the field is already changing phase and eventually leans toward ${changed}.`;
}

function englishFocusAppendix(result, focus) {
  if (focus === "wealth" && result.wealthDetail?.signs?.length) return `Money-side emphasis falls on ${translateList(result.wealthDetail.signs.slice(0, 2))}.`;
  if (focus === "love" && result.marriageDetail?.signs?.length) return `Relationship emphasis falls on ${translateList(result.marriageDetail.signs.slice(0, 2))}.`;
  if (focus === "health" && result.healthDetail?.warnings?.length) return `Body-and-energy emphasis falls on ${translateList(result.healthDetail.warnings.slice(0, 2))}.`;
  return "";
}

function englishSummary(result) {
  const focus = selectedFocus();
  return `For ${formatDisplayDate(todayInTimezone(DEFAULT_TIMEZONE))}, your Day Master belongs to ${elementLabel(result.dayMaster)}. The natal chart leans ${toEnglish(result.structure.strengthTier || result.structure.strengthLabel)}, with the month command placing it ${toEnglish(result.structure.seasonPhase || "平")}. Climate adjustment points to ${toEnglish(result.climate.note)} with a ${toEnglish(result.climate.bias)} bias, while the broader pattern trends toward ${toEnglish(result.pattern.name)}. The current luck background runs through ${result.luckCycle.currentDaYun.label} and ${result.luckCycle.currentAnnual.label}, and today's stem relation lands as ${toEnglish(result.todayRelation)}. ${englishHexagramSummary(result)} The overall tone reads as ${englishTier(result).toLowerCase()}. ${englishFocusAppendix(result, focus)}`.trim();
}

function englishAdvice(result) {
  const focus = selectedFocus();
  const focusMap = {
    overall: "Put most of today's energy into one main priority instead of splitting attention across too many fronts.",
    career: "Advance the clearest work first and keep the scope tighter than your impulse to open new tracks.",
    wealth: "Favor practical decisions, readable timing, and defined limits over speed, pressure, or speculation.",
    love: "Say the real thing more clearly, but leave enough softness for timing and response to breathe.",
    health: "Protect energy first, stabilize pace, and treat recovery as part of today's actual work.",
  };
  const relationLine = result.relationScore >= 6
    ? `Today's stem and branch pressure is supportive enough to move on purpose rather than only react.`
    : result.relationScore >= 1
      ? `Today's field is workable, but it still rewards measured pacing more than a fast push.`
      : result.relationScore <= -5
        ? `Today's field pushes back more noticeably, so protecting boundaries matters more than winning speed.`
        : `Today's field has some drag in it, so test the next step before adding force.`;
  const structureLine =
    result.structure.strengthTier === "极强" || result.structure.strengthLabel === "偏强"
      ? "Because your base chart already carries force, the smarter move is using it selectively instead of pressing everywhere at once."
      : result.structure.strengthTier === "极弱" || result.structure.strengthLabel === "偏弱"
        ? "Because your base chart depends more on timing and support, sequence and conditions matter more than trying to overpower the day."
        : "Because your base chart is relatively balanced, the real edge today comes from reading timing correctly rather than forcing a result.";
  const climateLine = climateMeaningText(result, "en");
  const themeLine = relationMeaning(result.pattern.relation, "en");
  const castLine = (() => {
    const movingCount = result.hexagram.movingLines.length;
    const primary = englishHexagramTitle(result);
    const changed = result.hexagram.changedNameEn || result.hexagram.changedTitle || primary;
    if (movingCount === 0) return `${primary} stays stable, so a cleaner follow-through will work better than changing methods too often.`;
    if (movingCount === 1) return `${primary} changes through one key turning point at line ${result.hexagram.movingLines[0]}, and the reading gradually leans toward ${changed}.`;
    if (movingCount <= 3) return `${primary} moves through ${movingCount} lines, so act with room to revise as the reading turns toward ${changed}.`;
    return `${primary} carries many moving lines, so treat the day as a phased process instead of locking in one rigid answer too early.`;
  })();
  const appendix = englishFocusAppendix(result, focus);
  return [focusMap[focus], relationLine, structureLine, climateLine, themeLine, castLine, appendix].filter(Boolean).join(" ");
}

function renderDetailGrid(rows) {
  return `<div class="detail-grid">${rows.map((row) => `<div class="detail-row"><div class="detail-term">${row.label}</div><div class="detail-value">${row.value}</div></div>`).join("")}</div>`;
}

function renderStructure(result) {
  if (state.language === "zh") {
    const primaryNeed = result.climate.primary?.length ? result.climate.primary.map((element) => elementLabel(element)).join("、") : "无明显主取";
    const secondaryNeed = result.climate.secondary?.length ? result.climate.secondary.map((element) => elementLabel(element)).join("、") : "按原局再议";
    return renderDetailGrid([
      { label: "日主强弱", value: `${result.structure.strengthTier || result.structure.strengthLabel}（${result.structure.strengthScore.toFixed(1)}）` },
      { label: "月令主气", value: `${elementLabel(result.structure.seasonElement)} / ${result.structure.seasonPhase || "平"}` },
      { label: "调候判断", value: `${result.climate.note} · ${result.climate.bias}` },
      { label: "主需元素", value: primaryNeed },
      { label: "辅需元素", value: secondaryNeed },
      { label: "形象视角", value: result.image.note },
      { label: "当前偏宜", value: result.structure.favorableElements.map((element) => elementLabel(element)).join("、") },
      { label: "当前偏忌", value: result.structure.unfavorableElements.map((element) => elementLabel(element)).join("、") },
    ]);
  }

  const primaryNeed = result.climate.primary?.length ? result.climate.primary.map((element) => elementLabel(element)).join(", ") : "No clear primary need";
  const secondaryNeed = result.climate.secondary?.length ? result.climate.secondary.map((element) => elementLabel(element)).join(", ") : "Context-based";
  return renderDetailGrid([
    { label: "Strength", value: `${toEnglish(result.structure.strengthTier || result.structure.strengthLabel)} (${result.structure.strengthScore.toFixed(1)})` },
    { label: "Month Command", value: `${elementLabel(result.structure.seasonElement)} / ${toEnglish(result.structure.seasonPhase || "平")}` },
    { label: "Climate", value: `${toEnglish(result.climate.note)} · ${toEnglish(result.climate.bias)}` },
    { label: "Primary Need", value: primaryNeed },
    { label: "Secondary Need", value: secondaryNeed },
    { label: "Image", value: toEnglish(result.image.note) },
    { label: "Favorable", value: result.structure.favorableElements.map((element) => elementLabel(element)).join(", ") },
    { label: "Avoid", value: result.structure.unfavorableElements.map((element) => elementLabel(element)).join(", ") },
  ]);
}

function formatLuckAge(age, language) {
  const rounded = Number(age).toFixed(1);
  return language === "zh" ? `${rounded} 岁` : `${rounded} yrs`;
}

function pillarDisplayLabel(pillar, language) {
  if (language === "zh") return pillar.label;
  return `${stemEnglishMap[pillar.stem.key]} ${branchEnglishMap[pillar.branch.key]}`;
}

function luckBackdropTone(score, language) {
  if (language === "zh") {
    if (score >= 5) return "长程背景明显偏顺，可以放大优势。";
    if (score >= 1) return "大运与流年总体帮扶，但仍需看当天触发。";
    if (score <= -5) return "长程背景偏压，需要更谨慎地择时。";
    if (score <= -1) return "大背景有阻力，宜先稳后动。";
    return "长程背景中性，关键看你如何顺势调整。";
  }
  if (score >= 5) return "The longer cycle is clearly supportive, so your advantages are easier to amplify.";
  if (score >= 1) return "The longer cycle is generally supportive, though the daily trigger still matters.";
  if (score <= -5) return "The longer cycle is more pressuring, so timing and restraint matter more.";
  if (score <= -1) return "The broader background adds friction, so steady pacing works better than forcing.";
  return "The longer-cycle background is fairly neutral, so execution and timing matter most.";
}

function englishLuckSummary(result) {
  const { luckCycle } = result;
  return `Your current Da Yun is ${pillarDisplayLabel(luckCycle.currentDaYun.pillar, "en")}, and the active annual pillar is ${pillarDisplayLabel(luckCycle.currentAnnual.pillar, "en")}. This timeline is estimated from an approximate solar-term method, with ${toEnglish(luckCycle.directionLabel)} movement and a start around ${formatLuckAge(luckCycle.startAge, "en")}. ${luckBackdropTone(luckCycle.backdropScore, "en")}`;
}

function renderLuckTimeline(items, type) {
  const language = state.language;
  return `<div class="timeline-list">${items.map((item) => {
    const main = type === "dayun"
      ? pillarDisplayLabel(item.pillar, language)
      : `${item.solarYear} · ${pillarDisplayLabel(item.pillar, language)}`;
    const meta = type === "dayun"
      ? (language === "zh"
        ? `${formatLuckAge(item.startAge, "zh")} - ${formatLuckAge(item.endAge, "zh")}`
        : `${formatLuckAge(item.startAge, "en")} - ${formatLuckAge(item.endAge, "en")}`)
      : String(item.solarYear);
    const relation = language === "zh" ? item.relation : toEnglish(item.relation);
    return `<article class="timeline-item${item.active ? " active" : ""}">
      <div class="timeline-main">${main}</div>
      <div class="timeline-meta">${meta}</div>
      <div class="timeline-relation">${relation}</div>
    </article>`;
  }).join("")}</div>`;
}

function renderLuck(result) {
  const { luckCycle } = result;
  if (!luckCycle) return "";

  if (state.language === "zh") {
    const overview = renderDetailGrid([
      { label: "顺逆行", value: `${luckCycle.directionLabel}（按年干阴阳与性别推）` },
      { label: "参考节气", value: `${luckCycle.referenceTerm.name} · ${luckCycle.referenceTerm.dateLabel}` },
      { label: "起运时间", value: luckCycle.startText },
      { label: "当前年龄", value: formatLuckAge(luckCycle.analysisAge, "zh") },
      { label: "当前大运", value: `${luckCycle.currentDaYun.label} · ${luckCycle.currentDaYun.relation}` },
      { label: "当前流年", value: `${luckCycle.currentAnnual.label} · ${luckCycle.currentAnnual.relation}` },
    ]);

    const findings = luckCycle.combinedFindings?.length
      ? `<ul class="plain-list">${luckCycle.combinedFindings.slice(0, 4).map((item) => `<li>${item}</li>`).join("")}</ul>`
      : "";

    return `
      ${renderParagraph(`当前大运是 ${luckCycle.currentDaYun.label}，流年是 ${luckCycle.currentAnnual.label}。${luckBackdropTone(luckCycle.backdropScore, "zh")} 这部分用来判断你现在所处的大背景，不只是当天一时的起伏。`)}
      ${overview}
      <div class="luck-stack">
        <h4 class="subtle-subhead">大运时间轴</h4>
        ${renderLuckTimeline(luckCycle.daYunList, "dayun")}
      </div>
      <div class="luck-stack">
        <h4 class="subtle-subhead">近年流年</h4>
        ${renderLuckTimeline(luckCycle.annualList, "annual")}
      </div>
      ${findings}
    `;
  }

    const overview = renderDetailGrid([
      { label: "Direction", value: `${toEnglish(luckCycle.directionLabel)} movement` },
      { label: "Reference Solar Term", value: `${toEnglish(luckCycle.referenceTerm.name)} · ${formatDisplayDate(luckCycle.referenceTerm.isoDate)}` },
      { label: "Luck Start", value: `${formatLuckAge(luckCycle.startAge, "en")} from birth` },
      { label: "Current Age", value: formatLuckAge(luckCycle.analysisAge, "en") },
      { label: "Current Da Yun", value: `${pillarDisplayLabel(luckCycle.currentDaYun.pillar, "en")} · ${toEnglish(luckCycle.currentDaYun.relation)}` },
      { label: "Current Annual", value: `${pillarDisplayLabel(luckCycle.currentAnnual.pillar, "en")} · ${toEnglish(luckCycle.currentAnnual.relation)}` },
    ]);

  return `
    ${renderParagraph(englishLuckSummary(result))}
    ${overview}
    <div class="luck-stack">
      <h4 class="subtle-subhead">Da Yun Timeline</h4>
      ${renderLuckTimeline(luckCycle.daYunList, "dayun")}
    </div>
    <div class="luck-stack">
      <h4 class="subtle-subhead">Annual Flow</h4>
      ${renderLuckTimeline(luckCycle.annualList, "annual")}
    </div>
  `;
}

function hexagramName(upper, lower, language) {
  if (language === "zh") return `${upper.name}上${lower.name}下`;
  return `${trigramMap[upper.key]?.name || upper.key} over ${trigramMap[lower.key]?.name || lower.key}`;
}

function hexagramImage(upper, lower, language) {
  if (language === "zh") return `${upper.title} / ${lower.title}`;
  return `${trigramMap[upper.key]?.title || upper.key} / ${trigramMap[lower.key]?.title || lower.key}`;
}

function hexagramReading(upper, lower, language) {
  if (language === "zh") return `${upper.reading}${lower.reading}`;
  return `${trigramMap[upper.key]?.reading || ""} ${trigramMap[lower.key]?.reading || ""}`.trim();
}

const linePositionMap = {
  1: {
    zh: "初爻在最下位，主事情刚起头、念头初动、第一步怎么走。",
    en: "Line 1 sits at the beginning, so it speaks to the first move, the first response, and how the matter starts.",
  },
  2: {
    zh: "二爻在内卦中位，主内部基础、配合度、能不能稳稳接住。",
    en: "Line 2 is the centered inner line, so it speaks to internal footing, support, and whether the matter can be held steadily.",
  },
  3: {
    zh: "三爻在内外之交，主卡点、过渡、推进时最容易起摩擦的地方。",
    en: "Line 3 sits on the threshold between inner and outer, so it marks friction, pressure, and the hard part of transition.",
  },
  4: {
    zh: "四爻进入外卦，主开始接触外部局势，事情从准备走向见人见事。",
    en: "Line 4 enters the outer trigram, so it shows the shift from preparation into real contact with the outside situation.",
  },
  5: {
    zh: "五爻居上卦中位，主主轴、核心判断、谁来定调和承担。",
    en: "Line 5 is the central line of the upper trigram, so it points to the main axis, the core decision, and who sets the tone.",
  },
  6: {
    zh: "上爻在最上位，主事情走到极处，容易出现收尾、过头、转向或退场。",
    en: "Line 6 stands at the top, so it speaks to culmination, excess, reversal, or how the matter closes out.",
  },
};

function lineTransitionMeaning(lineValue, language) {
  if (language === "zh") {
    return lineValue === 6
      ? "这一爻是老阴发动，表示原本偏保留、偏承受的一面正在转向主动，提醒你不能只等局势自己变好。"
      : "这一爻是老阳发动，表示原本过于主动、过于用力的一面需要转弯或收束，提醒你别把推进做成硬顶。";
  }
  return lineValue === 6
    ? "This is an old yin line in motion, so a passive or waiting position is turning active. It warns against only waiting for the field to improve by itself."
    : "This is an old yang line in motion, so an overactive or forceful position needs to bend, soften, or reduce pressure instead of pushing harder.";
}

function hexagramChangeMeaning(result, language) {
  const movingCount = result.hexagram.movingLines.length;
  if (language === "zh") {
    if (movingCount === 0) return "无动爻，以本卦为主，重点是看清卦象之后稳稳执行，不宜频繁改法。";
    if (movingCount === 1) return `只有一处动爻，变化集中，读卦时应把重点放在第 ${result.hexagram.movingLines[0]} 爻的位置上，后势会转向${result.hexagram.changedTitle}。`;
    if (movingCount <= 3) return `共有 ${movingCount} 处动爻，表示事情可以推进，但要边走边修，后势会逐步转向${result.hexagram.changedTitle}。`;
    return `动爻较多，说明局势本身就在换相，最后会化向${result.hexagram.changedTitle}。此时比“马上定论”更重要的是留余地、分阶段、看反馈。`;
  }

  if (movingCount === 0) return "There are no moving lines, so the primary hexagram is the main reading. The task is steady execution after reading the image clearly.";
  if (movingCount === 1) return `There is one moving line, so the change is concentrated. The main interpretive weight falls on line ${result.hexagram.movingLines[0]}, and the later tendency turns toward ${result.hexagram.changedNameEn || result.hexagram.changedTitle}.`;
  if (movingCount <= 3) return `There are ${movingCount} moving lines, which means progress is possible, but correction needs to happen along the way as the reading gradually turns toward ${result.hexagram.changedNameEn || result.hexagram.changedTitle}.`;
  return `There are many moving lines, so the field itself is changing phase and eventually leans toward ${result.hexagram.changedNameEn || result.hexagram.changedTitle}. Leave margin, move in stages, and let feedback reshape the next step.`;
}

function hexagramJudgment(result, language) {
  const { upper, lower, movingLines } = result.hexagram;
  const keys = [upper.key, lower.key];
  const baseAction = language === "zh" ? result.hexagram.actionZh : result.hexagram.actionEn;

  if (language === "zh") {
    if (!movingLines.length) return `${baseAction || "占断上偏向守其象与辞。"} 先按本卦提示做对方法，再求结果，不宜频繁换招。`;
    if (keys.includes("kan")) return `${baseAction || ""} 占断上先看风险与暗处，再决定要不要进。先明，再动，比一口气冲出去更合卦意。`.trim();
    if (keys.includes("gen")) return `${baseAction || ""} 占断上偏向先止后进，先定边界和收口，再看下一步，不宜硬推。`.trim();
    if (keys.includes("zhen")) return `${baseAction || ""} 占断上偏向先起步，先让事情动起来，但动作不宜散，要抓住第一关键步。`.trim();
    if (keys.includes("xun") || keys.includes("dui")) return `${baseAction || ""} 占断上偏向通过沟通、协商、交换信息来改变局势，口风和分寸比强硬更重要。`.trim();
    if (keys.includes("li") || keys.includes("qian")) return `${baseAction || ""} 占断上偏向明确表达和主动决断，但要防过亮、过急、过早定死。`.trim();
    return `${baseAction || ""} 占断上偏向顺势调整：该承接时承接，该推进时推进，关键是别逆着卦气做事。`.trim();
  }

  if (!movingLines.length) return `${baseAction || "The judgment leans toward holding the primary image."} Follow through cleanly rather than changing methods too often.`;
  if (keys.includes("kan")) return `${baseAction || ""} The judgment is to read risk and hidden variables first, then decide whether to advance. Clarity comes before movement.`.trim();
  if (keys.includes("gen")) return `${baseAction || ""} The judgment leans toward stopping before pushing: set limits, close gaps, and then decide the next move.`.trim();
  if (keys.includes("zhen")) return `${baseAction || ""} The judgment leans toward starting the first real step. Movement helps, but it should stay focused rather than scattered.`.trim();
  if (keys.includes("xun") || keys.includes("dui")) return `${baseAction || ""} The judgment leans toward changing the situation through communication, negotiation, and exchange. Tone matters more than force.`.trim();
  if (keys.includes("li") || keys.includes("qian")) return `${baseAction || ""} The judgment leans toward clear expression and decisive action, while avoiding glare, haste, or locking the answer too early.`.trim();
  return `${baseAction || ""} The judgment leans toward following the field: receive when the image asks for receiving, and advance only where the current actually opens.`.trim();
}

function renderLineGuidance(result) {
  const language = state.language;
  const movingLines = result.hexagram.movingLines;

  if (!movingLines.length) {
    return `${renderParagraph(language === "zh"
      ? "按《周易》“吉凶悔吝生乎动”的读法，无动爻时不必强找变化点，重点回到本卦本身的象与辞。"
      : "Following the Yijing rule that outcomes emerge through movement, no moving lines means there is no single turning point to force. The reading returns to the primary image itself.")}${renderDetailGrid([
      {
        label: language === "zh" ? "读法重点" : "Reading Priority",
        value: language === "zh" ? "以本卦为主，少改法，多守节奏。" : "Read the primary hexagram first, change methods less, and keep steadier pacing.",
      },
      {
        label: language === "zh" ? "变卦状态" : "Changed Hexagram",
        value: language === "zh" ? "无明显变卦重点。" : "No changed-hexagram emphasis today.",
      },
    ])}`;
  }

  const rows = movingLines.map((position) => {
    const lineValue = result.hexagram.lines[position - 1];
    return {
      label: language === "zh" ? `第 ${position} 爻` : `Line ${position}`,
      value: `${linePositionMap[position][language]} ${lineTransitionMeaning(lineValue, language)}`,
    };
  });

  return `${renderParagraph(language === "zh"
    ? "按《周易》“爻在其中、吉凶悔吝生乎动”的读法，真正需要盯住的是发动的爻位，因为它指出了事情哪里在变。"
    : "Following the Yijing rule that the lines carry the movement of the matter, the moving lines deserve the closest attention because they show where the situation is changing.")}${renderDetailGrid(rows)}`;
}

function elementActionMeaning(element, language) {
  const map = {
    zh: {
      wood: "适合启动、扩展、沟通、推动新方向",
      fire: "适合表达、展示、曝光、快速拍板",
      earth: "适合落实、整理、收尾、稳住节奏",
      metal: "适合判断、取舍、定规则、做切割",
      water: "适合观察、思考、迂回、保留弹性",
    },
    en: {
      wood: "good for starting, expanding, reaching out, and opening new directions",
      fire: "good for expression, visibility, presentation, and fast decisions",
      earth: "good for stabilizing, organizing, finishing, and keeping things grounded",
      metal: "good for judgment, prioritizing, setting rules, and cutting away noise",
      water: "good for observing, reflecting, adapting, and keeping flexibility",
    },
  };
  return map[language][element];
}

function relationMeaning(relation, language) {
  const map = {
    zh: {
      比肩: "今天会更强调自我主张、独立处理和按自己的节奏推进。",
      劫财: "今天容易出现资源分散、竞争感上升或被别人打乱节奏的情况。",
      食神: "今天适合输出想法、做内容、做表达，也更适合顺势推进。",
      伤官: "今天判断会更锋利，但也更容易不耐烦、顶撞或嫌事情太慢。",
      偏财: "今天更容易看到机会、资源流动和外部人脉带来的空间。",
      正财: "今天更适合务实处理钱、项目、责任和可落地的安排。",
      七杀: "今天压力和任务感会更强，适合迎难而上，但不宜硬撑过头。",
      正官: "今天更适合讲秩序、讲规范、讲责任，也适合稳妥推进正式事务。",
      偏印: "今天更适合独立思考、吸收信息、调整策略，但可能显得有点抽离。",
      正印: "今天更适合补状态、找支持、做准备、先稳后动。",
    },
    en: {
      比肩: "Today emphasizes self-direction, independent action, and moving at your own pace.",
      劫财: "Today can scatter resources, raise competition, or make other people disrupt your rhythm.",
      食神: "Today supports output, expression, content, and moving forward more naturally.",
      伤官: "Today sharpens judgment, but it can also make you impatient, blunt, or resistant to slow processes.",
      偏财: "Today makes opportunities, networks, and resource flow easier to notice and use.",
      正财: "Today is better for practical money matters, concrete tasks, responsibility, and grounded execution.",
      七杀: "Today brings more pressure and demand, so it favors courage and decisive action, but not overstraining.",
      正官: "Today supports order, structure, accountability, and steady progress in formal matters.",
      偏印: "Today is better for independent thinking, absorbing information, and strategy shifts, though it can feel detached.",
      正印: "Today supports recovery, preparation, support systems, and stabilizing before action.",
    },
  };
  return map[language][relation] ?? (language === "zh" ? "今天的主题会围绕这个关系展开。" : "This relation becomes one of today's main themes.");
}

function coreThemeCopy(relation, language) {
  const map = {
    zh: {
      比肩: "今天的主轴是按自己的节奏推进。适合独立处理、自己拍板，但也要避免太固执，只顾自己这一边。",
      劫财: "今天的主轴是资源分配和边界感。容易有人来分走你的注意力，所以更适合先守住重点，再决定哪里值得投入。",
      食神: "今天的主轴是自然表达和顺势推进。把想法讲清、把东西做出来，会比硬推结果更有效。",
      伤官: "今天的主轴是判断和表达都变锋利。适合提出观点、指出问题，但说太快太满也容易把气氛推紧。",
      偏财: "今天的主轴是外部机会和信息流动。适合留意人脉、机会和临场空间，但不要因为一时感觉就立刻出手。",
      正财: "今天的主轴是务实落地。更适合处理钱、责任、进度和手头该完成的事，不适合只谈感觉不谈落实。",
      七杀: "今天的主轴是压力下的决断。事情会更像在催你表态和行动，但重点是稳准，不是逞强。",
      正官: "今天的主轴是秩序、责任和稳妥推进。今天更适合按规则办事，把该承担的部分做好。",
      偏印: "今天的主轴是先想清楚再行动。适合吸收信息、调整策略、重新看局，但不要一直停在脑子里不落地。",
      正印: "今天的主轴是恢复、准备和补状态。先把自己稳住、把支持补足，后面的推进才会更顺。",
    },
    en: {
      比肩: "Today's core theme is moving at your own pace. It supports independent action and self-directed decisions, but it helps to stay flexible instead of getting stuck in your own line.",
      劫财: "Today's core theme is resource management and boundaries. Other people can pull on your time and attention, so protect the main priority before spreading yourself wider.",
      食神: "Today's core theme is natural expression and smooth forward movement. Clear communication and visible output will work better than forcing the result.",
      伤官: "Today's core theme is sharper judgment and sharper expression. It is a good day to name the issue clearly, but pushing too hard can make the tone brittle.",
      偏财: "Today's core theme is outside opportunity and moving information. Stay alert to openings and useful connections, but do not act too fast on first excitement alone.",
      正财: "Today's core theme is practical follow-through. It favors money matters, responsibility, timing, and finishing what is already in your hands.",
      七杀: "Today's core theme is decisive action under pressure. The day may push for a response, but the goal is steady precision, not proving toughness.",
      正官: "Today's core theme is order, responsibility, and steady progress. It is better to work with structure and do the formal part well than to improvise too much.",
      偏印: "Today's core theme is reflection before action. It supports taking in information, rethinking strategy, and stepping back, as long as thought still turns into action.",
      正印: "Today's core theme is recovery, preparation, and support. Stabilize yourself first, strengthen the base, and the rest of the day becomes easier to carry.",
    },
  };
  return map[language][relation] ?? (language === "zh"
    ? "今天的主轴是先读清局势，再决定怎么推进。"
    : "Today's core theme is reading the situation clearly before deciding how to move.");
}

function climateMeaningText(result, language) {
  const note = result.climate.note;
  const needList = (result.climate.primary?.length ? result.climate.primary : result.climate.needed).map((element) => elementLabel(element)).join(language === "zh" ? "、" : ", ");
  const biasText = language === "zh" ? result.climate.bias : toEnglish(result.climate.bias);
  const map = {
    zh: {
      木旺待疏: `这不是说“木很多”而已，而是说今天更容易一口气铺太开、想做太多。要点不是继续加码，而是做筛选、定优先级，并把分散的事情收成主线。补位方向偏 ${needList}，也就是更需要判断力、节奏感和适度表达。`,
      木燥需润: `这表示木气虽然有生发，但已经带出偏燥的一面。今天更容易想推进，却忽略润滑和缓冲，所以重点是先补水分、补弹性，再去扩张。`,
      金旺伐木: `这表示外部判断、规矩或压力感偏强，容易让你觉得要立刻收紧、立刻切断。今天更适合先护住主线，再谈取舍，不宜一上来就过度砍枝。`,
      寒木向阳: `这表示事情不是不能动，而是先要把状态暖起来。今天如果先让节奏热起来、把资源聚起来，后面的推进才会顺。`,
      火赖木生: `这表示今天的推动力来自准备、铺垫和持续加温，不来自突然爆发。先把支持条件做足，比直接点火更重要。`,
      炎火需济: `这表示今天很容易过热、过快、过度表达。重点不是继续加速，而是降温、复核、给决定留缓冲。`,
      火退喜扶: `这表示推进力不是没有，而是容易一下子掉下去。今天更适合稳稳续火，把事情接住，而不是等一股冲劲过去。`,
      寒火待燃: `这表示今天最怕的是状态起不来、心气不续。先把自己点着，事情才会动，所以准备、热身、聚焦都很关键。`,
      湿土待暖: `这表示今天容易拖、重、慢，像踩在潮湿泥地里。要点不是更谨慎，而是先把行动热起来，让事情开始滚动。`,
      燥土喜润: `这表示今天容易太硬、太干、太执着于既定安排。适合增加交流和回旋空间，不要一味顶住。`,
      厚土喜疏: `这表示今天顾虑和包袱可能偏重。更适合删减、简化、打通卡点，而不是把更多事继续堆上去。`,
      寒土喜暖: `这表示今天的难点在启动和回温。先让人、资源和节奏活起来，再谈执行细节，会顺很多。`,
      金肃偏燥: `这表示今天容易偏紧、偏急、偏用脑，判断会变快，但也容易太硬。更适合先加一点缓冲、交流和流动感，不要把自己锁进单一判断里。`,
      金困木乡: `这表示规则、判断或决断力并不差，但落在今天的环境里容易施展不开。做法上更适合先找支点、先借力，而不是硬切。`,
      金熔待水: `这表示今天容易因为压力或强度过高而失去冷静。先降温、先稳住判断，再做决定会更准。`,
      金旺需火: `这表示判断和切割力已经够强，真正缺的是把事情锻造成形。今天更适合定标准、做成品，而不是只停在判断。`,
      寒金待炼: `这表示你并不缺分辨力，但今天需要一点火候来把它变成有效动作。没有温度和推动，判断会停在心里。`,
      水木泛动: `这表示今天容易想法太活、路径太多、情绪也跟着流动。最需要的是立边界、定框架，让流动变成方向。`,
      水弱待源: `这表示今天的流动感和续航力不足。先补来源、补支持，再谈推进，会比硬撑更有效。`,
      金白水清: `这表示今天适合用更清楚的规则、信息和判断，把事情梳理干净。重点在澄清，而不是堆更多动作。`,
      寒水须阳: `这表示今天容易陷在观察和思考里。重点不是继续想，而是给自己一点温度、行动和推动力。`,
      水寒偏重: `这表示今天更容易观望、拖延、想很多却动得慢。重点不是继续想，而是先把身体和行动热起来，再进入正题。`,
      火炎偏燥: `这表示今天情绪、表达和推进欲会更强，容易很快拍板，也容易过热。重点是降一点火，给决定留复核空间。`,
      土重偏滞: `这表示今天容易稳过头、慢过头，卡在顾虑和重复确认里。更适合先动一小步，而不是一直等完全确定。`,
      偏寒湿: `这表示今天更容易偏被动、偏低能量，启动会慢。适合先做唤醒状态的事，再做判断。`,
      偏热燥: `这表示今天更容易上头、急着推进，动作比判断快。适合先降速，再做关键决定。`,
      偏平和: "这表示今天没有特别偏激的一边，重点不在补某一项，而在根据现实情况灵活取舍。",
    },
    en: {
      木旺待疏: `This does not just mean “more Wood.” It means today can feel too spread out, with too many ideas or directions opening at once. The key is not to add more, but to filter, rank priorities, and turn scattered momentum into one main track. The chart is asking for more ${needList}.`,
      木燥需润: "This shows growth is present, but it is drying out. The practical move is to add flexibility, lubrication, and patience before trying to push outward.",
      金旺伐木: "This shows pressure, rules, or cutting judgment running strong. The key is to protect the main line first, then prune, instead of cutting too aggressively too early.",
      寒木向阳: "This shows the issue is not possibility but activation. Warm the rhythm, gather support, and then move; momentum comes after warming up.",
      火赖木生: "This shows progress depends on preparation and fuel, not on a sudden burst. Build support first, then let the fire grow.",
      炎火需济: "This shows urgency, heat, and intensity running high. The practical move is cooling, reviewing, and leaving room before committing.",
      火退喜扶: "This shows momentum can drop after the first push. What helps today is sustaining the flame, not waiting for inspiration to carry everything.",
      寒火待燃: "This shows the challenge is getting the inner fire started. Warm-up, focus, and ignition matter before execution does.",
      湿土待暖: "This shows heaviness, drag, and slow movement. The answer is not more caution, but enough warmth and activation to get things rolling.",
      燥土喜润: "This shows the day can become too rigid, dry, or stuck in fixed arrangements. Add communication and flexibility instead of forcing harder.",
      厚土喜疏: "This shows concerns and burden piling up. Simplifying, reducing, and clearing bottlenecks work better than adding more weight.",
      寒土喜暖: "This shows the main issue is warming the system enough to move. Bring life back into rhythm, resources, and people first.",
      金肃偏燥: "This suggests the day may feel tense, sharp, and mentally overdriven. Judgment can be fast, but also too rigid. The practical move is to add more fluidity, communication, and pause before locking in conclusions.",
      金困木乡: "This shows your ability to judge is present, but the environment makes it harder to apply cleanly. Find leverage before trying to cut decisively.",
      金熔待水: "This shows pressure or intensity can overheat judgment. Cooling down first improves the quality of decisions.",
      金旺需火: "This shows discernment is already strong; what is missing is enough fire to forge it into usable form. Finish and shape, not just analyze.",
      寒金待炼: "This shows discernment exists, but it needs warmth and pressure to become action. Without ignition, insight stays theoretical.",
      水木泛动: "This shows too much movement in ideas, options, and emotional currents. Boundaries and structure turn flow into direction.",
      水弱待源: "This shows flow and continuity are undersupplied. Reconnect with sources of support before trying to push forward.",
      金白水清: "This shows today works well for clarification. Cleaner rules, cleaner information, and cleaner judgment are more valuable than more motion.",
      寒水须阳: "This shows thinking and observation can dominate action. Add warmth and initiative instead of staying only in reflection.",
      水寒偏重: "This suggests hesitation, overthinking, or low activation. The practical move is to warm up action first instead of waiting for perfect clarity.",
      火炎偏燥: "This suggests high urgency, strong expression, and fast decisions. The practical move is to cool the pace slightly and leave room to review before committing.",
      土重偏滞: "This suggests heaviness, caution, and getting stuck in repetition or over-confirmation. The practical move is to take one small concrete step instead of waiting for complete certainty.",
      偏寒湿: "This suggests a slower, heavier, lower-energy state. The practical move is to activate the body and momentum first, then decide.",
      偏热燥: "This suggests intensity and rushing. The practical move is to slow down a little before making key decisions.",
      偏平和: "This suggests no extreme bias today. The focus is less on compensation and more on reading the situation well and adjusting in real time.",
    },
  };
  return map[language][note] ?? (language === "zh"
    ? `今天整体呈现“${biasText}”的倾向，所以重点不只是知道受什么影响，而是主动补足 ${needList || "节奏与环境"}，把状态拉回可用的位置。`
    : `Today's tone leans toward "${biasText}", so the useful move is not just naming the influence but actively adding more ${needList || "timing and context"} to bring the day back into a usable balance.`);
}

function climateActionLine(result, language) {
  const firstNeed = result.climate.primary?.[0] || result.climate.needed[0];
  if (!firstNeed) {
    return language === "zh"
      ? "今天不需要刻意补某一边，重点是边走边看，根据现实反馈调整。"
      : "Today does not require strong compensation in one direction; it is better to adjust as real conditions unfold.";
  }

  const action = elementActionMeaning(firstNeed, language);
  return language === "zh"
    ? `落到行动上，今天更适合用“${action}”这种方式来把状态拉回平衡。`
    : `In practical terms, today works better when you lean into actions that are ${action}.`;
}

function selectedFocus() {
  return document.querySelector("#focus-area").value;
}

function focusLabels(language) {
  return language === "zh"
    ? {
        overall: "整体",
        career: "事业",
        wealth: "财务",
        love: "感情",
        health: "身心",
      }
    : {
        overall: "overall",
        career: "career",
        wealth: "money",
        love: "relationships",
        health: "health",
      };
}

function focusPrompt(focus, language) {
  const map = {
    zh: {
      overall: "你这次问的是整体状态，所以重点不是某一件事成不成，而是今天该用什么节奏过日子。",
      career: "你这次问的是事业，所以更看推进方式、合作阻力和决策节奏，而不是抽象的“好运不好运”。",
      wealth: "你这次问的是财务，所以更看机会怎么来、风险怎么控、该不该快进快出。",
      love: "你这次问的是感情，所以重点会落在表达、互动节奏和关系中的进退分寸。",
      health: "你这次问的是身心状态，所以重点会落在消耗、恢复、作息和今天该不该硬撑。",
    },
    en: {
      overall: "You asked about the whole day, so the key is not one isolated event but the pace and stance that suit today best.",
      career: "You asked about career, so this reading leans toward work rhythm, decision style, and friction in execution rather than abstract luck.",
      wealth: "You asked about money, so the reading focuses more on opportunity, restraint, and whether action should be quick or conservative.",
      love: "You asked about relationships, so the reading leans toward expression, timing, and how to handle closeness or distance well today.",
      health: "You asked about health, so the reading focuses more on energy use, recovery, routine, and whether today should be pushed or protected.",
    },
  };
  return map[language][focus];
}

function trigramFocusMeaning(trigramKey, focus, language, position) {
  const map = {
    zh: {
      qian: {
        overall: `${position}卦是乾，说明这部分气在催你主动、定方向、不要太拖。`,
        career: `${position}卦是乾，事业上更强调主动拍板、承担和正面推进。`,
        wealth: `${position}卦是乾，财务上容易想快一点见结果，但越急越要先定规则。`,
        love: `${position}卦是乾，感情里容易更想掌控节奏，表达会偏直接。`,
        health: `${position}卦是乾，身心上像在硬撑输出，要注意别把紧绷当成状态好。`,
      },
      kun: {
        overall: `${position}卦是坤，说明这部分气更适合接住现实、配合局势、稳稳落地。`,
        career: `${position}卦是坤，事业上更适合配合、协调、补位和稳住基础盘。`,
        wealth: `${position}卦是坤，财务上偏向保守、积累、先看长期而不是立刻出手。`,
        love: `${position}卦是坤，感情里更适合倾听、承接和给关系留空间。`,
        health: `${position}卦是坤，身心上更需要休整、睡眠和恢复，而不是继续顶着走。`,
      },
      zhen: {
        overall: `${position}卦是震，说明今天容易被事情推着动，拖久了反而更乱。`,
        career: `${position}卦是震，事业上适合先启动第一步，别一直卡在想。`,
        wealth: `${position}卦是震，财务上会出现触发点，但不适合被一时冲动带着跑。`,
        love: `${position}卦是震，感情里容易有突发对话或情绪波动，先稳住反应更重要。`,
        health: `${position}卦是震，身心上要防节奏忽快忽慢，别突然用力过猛。`,
      },
      xun: {
        overall: `${position}卦是巽，说明今天很多变化来自沟通、信息和细微影响。`,
        career: `${position}卦是巽，事业上更适合谈、写、协调、铺路，而不是硬碰硬。`,
        wealth: `${position}卦是巽，财务上更适合比较信息、问细节、慢慢谈条件。`,
        love: `${position}卦是巽，感情里更看说话方式和语气，细节比立场更重要。`,
        health: `${position}卦是巽，身心上适合轻柔调整，别一下改太猛。`,
      },
      kan: {
        overall: `${position}卦是坎，说明今天局里有不确定和暗流，先看清再动更重要。`,
        career: `${position}卦是坎，事业上要特别防信息不全、判断过早或流程里有坑。`,
        wealth: `${position}卦是坎，财务上更要避开看不透的局，先搞清风险。`,
        love: `${position}卦是坎，感情里容易多想或误会，先确认真实意思再下判断。`,
        health: `${position}卦是坎，身心上更像在消耗内在缓冲，今天要防透支。`,
      },
      li: {
        overall: `${position}卦是离，说明今天很多事会浮到台面上，看得见，也更容易被看见。`,
        career: `${position}卦是离，事业上适合展示、汇报、表达观点，但要防过快定论。`,
        wealth: `${position}卦是离，财务上容易被表面吸引，越亮眼的东西越要二次确认。`,
        love: `${position}卦是离，感情里适合把话说清，但别把表达变成压迫。`,
        health: `${position}卦是离，身心上偏热、偏耗神，今天要防上火和睡不稳。`,
      },
      gen: {
        overall: `${position}卦是艮，说明今天最重要的能力不是冲，而是停、收、立边界。`,
        career: `${position}卦是艮，事业上适合收尾、复盘、定边界，不适合什么都同时开。`,
        wealth: `${position}卦是艮，财务上更适合按住手、看清楚、先停一步。`,
        love: `${position}卦是艮，感情里要注意别因为防御太强而显得冷掉。`,
        health: `${position}卦是艮，身心上适合减量、休息、停掉不必要的消耗。`,
      },
      dui: {
        overall: `${position}卦是兑，说明今天很多变化会经过互动、反馈和情绪交换发生。`,
        career: `${position}卦是兑，事业上适合交流、谈判、拿反馈，但别只图当下顺耳。`,
        wealth: `${position}卦是兑，财务上容易因为人情、面子或一时感觉影响判断。`,
        love: `${position}卦是兑，感情里互动感会很强，重点是轻松表达但不要说过头。`,
        health: `${position}卦是兑，身心上要注意情绪消耗、社交过量和作息被打乱。`,
      },
    },
    en: {
      qian: {
        overall: `${position} trigram is Heaven, which pushes the day toward initiative, direction, and faster decisions.`,
        career: `${position} trigram is Heaven, so work matters lean toward initiative, ownership, and direct execution.`,
        wealth: `${position} trigram is Heaven, so money matters may feel rushed; define rules before acting fast.`,
        love: `${position} trigram is Heaven, so relationship energy can become more direct or controlling in tone.`,
        health: `${position} trigram is Heaven, so the body may look strong while actually running on tension.`,
      },
      kun: {
        overall: `${position} trigram is Earth, which favors receptivity, grounding, and working with reality instead of forcing it.`,
        career: `${position} trigram is Earth, so work is better handled through support, coordination, and steadiness.`,
        wealth: `${position} trigram is Earth, so money matters lean toward preservation, patience, and long-term thinking.`,
        love: `${position} trigram is Earth, so relationships benefit more from listening, holding space, and patient response.`,
        health: `${position} trigram is Earth, so recovery, sleep, and restoration matter more than pushing through.`,
      },
      zhen: {
        overall: `${position} trigram is Thunder, which means movement gets triggered quickly and delay creates more friction.`,
        career: `${position} trigram is Thunder, so career matters improve once you start the first concrete step.`,
        wealth: `${position} trigram is Thunder, so financial triggers may appear suddenly, but impulse is the risk.`,
        love: `${position} trigram is Thunder, so relationship dynamics can turn reactive fast; manage the first response.`,
        health: `${position} trigram is Thunder, so avoid abrupt bursts of effort or unstable pacing.`,
      },
      xun: {
        overall: `${position} trigram is Wind, so many changes come through communication, information, and subtle influence.`,
        career: `${position} trigram is Wind, so work is better moved through negotiation, writing, and quiet influence.`,
        wealth: `${position} trigram is Wind, so money questions benefit from comparing details and negotiating slowly.`,
        love: `${position} trigram is Wind, so wording, tone, and nuance matter more than blunt positions.`,
        health: `${position} trigram is Wind, so lighter adjustments work better than dramatic changes.`,
      },
      kan: {
        overall: `${position} trigram is Water, which points to uncertainty, hidden variables, and the need to read the field first.`,
        career: `${position} trigram is Water, so work matters require caution around incomplete information or unseen complications.`,
        wealth: `${position} trigram is Water, so money questions should avoid what is still unclear or opaque.`,
        love: `${position} trigram is Water, so relationships can be colored by doubt or projection unless meaning is clarified.`,
        health: `${position} trigram is Water, so energy may be draining inward; overextension is the main risk.`,
      },
      li: {
        overall: `${position} trigram is Fire, which brings visibility, exposure, and stronger outward expression.`,
        career: `${position} trigram is Fire, so career matters favor presentation, reporting, and visible output, but not rushed conclusions.`,
        wealth: `${position} trigram is Fire, so money choices can be swayed by what looks attractive on the surface.`,
        love: `${position} trigram is Fire, so honest expression helps, but pushing too hard can create pressure.`,
        health: `${position} trigram is Fire, so overstimulation, heat, or poor sleep becomes more relevant.`,
      },
      gen: {
        overall: `${position} trigram is Mountain, so the key skill today is stopping, containing, and setting boundaries.`,
        career: `${position} trigram is Mountain, so work is better for review, closure, and scope control than constant expansion.`,
        wealth: `${position} trigram is Mountain, so the wiser move in money matters may be to pause and withhold action.`,
        love: `${position} trigram is Mountain, so emotional distance or over-protection can become the issue in relationships.`,
        health: `${position} trigram is Mountain, so reduce load and protect recovery rather than pushing output.`,
      },
      dui: {
        overall: `${position} trigram is Lake, so outcomes are shaped more through exchange, feedback, and emotional tone.`,
        career: `${position} trigram is Lake, so work benefits from conversation and feedback, but not from chasing approval.`,
        wealth: `${position} trigram is Lake, so money judgment can be influenced by mood, people, or surface comfort.`,
        love: `${position} trigram is Lake, so relationship energy is interactive and expressive, but words can easily go too far.`,
        health: `${position} trigram is Lake, so social and emotional depletion may matter more than you expect.`,
      },
    },
  };
  return map[language][trigramKey]?.[focus] ?? "";
}

function movingLineMeaning(result, focus, language) {
  const count = result.hexagram.movingLines.length;
  if (language === "zh") {
    if (count === 0) return "这卦没有动爻，说明今天的调子相对固定，重点不是临场乱改，而是按看清的方向稳稳执行。";
    if (count === 1) return `这卦只有一处动爻，变化点比较集中，往往说明今天真正需要调整的只有一个关键环节：第 ${result.hexagram.movingLines[0]} 爻所代表的位置。`;
    if (count <= 3) return `这卦有 ${count} 处动爻，表示今天不是不能动，而是边动边修正会更对路。尤其在${focusLabels("zh")[focus]}这件事上，别把第一版方案当终版。`;
    return `这卦动爻较多，说明今天局势本身就在变。比起一次定死，更重要的是留余地、分阶段、根据反馈及时改法。`;
  }

  if (count === 0) return "There are no moving lines, so today's pattern is relatively steady. The task is not constant adjustment, but following through cleanly on what is already clear.";
  if (count === 1) return `There is only one moving line, so today's adjustment point is concentrated. Usually one key link needs revision more than the whole plan: line ${result.hexagram.movingLines[0]}.`;
  if (count <= 3) return `There are ${count} moving lines, which means movement is fine, but correction needs to happen along the way. In ${focusLabels("en")[focus]} matters, do not treat the first version as the final version.`;
  return "There are many moving lines, so the field itself is shifting. Leave margin, work in stages, and respond to feedback instead of locking one approach too early.";
}

function focusSpecificMeaning(result, focus, language) {
  const label = focusLabels(language)[focus];
  const score = result.metrics[focus] ?? result.score;
  const high = score >= 76;
  const low = score <= 52;
  const templates = {
    zh: {
      overall: high
        ? `放到${label}来看，今天不是完全轻松，但你有条件把事情带到自己想要的轨道上。`
        : low
          ? `放到${label}来看，今天更像“先别乱冲”，先稳住重点，比四处出击更划算。`
          : `放到${label}来看，今天不算极顺也不算极卡，关键在于你怎么选主线。`,
      career: high
        ? "放到事业上，今天更适合主动推进、对外沟通、拿结果。"
        : low
          ? "放到事业上，今天更适合先排障、补细节、别急着硬推。"
          : "放到事业上，今天更看执行顺序和边界管理。",
      wealth: high
        ? "放到财务上，今天更适合处理看得懂、节奏清楚、边界明确的机会。"
        : low
          ? "放到财务上，今天更适合防冲动、防误判、防为了快而忽略风险。"
          : "放到财务上，今天可以动，但要先把节奏和底线说清楚。",
      love: high
        ? "放到感情上，今天更适合主动表达、把误会讲开、推进真实互动。"
        : low
          ? "放到感情上，今天更适合少预设、少逼答复、先把情绪放稳。"
          : "放到感情上，今天的重点不是表态大小，而是表达分寸。",
      health: high
        ? "放到身心状态上，今天有调整空间，适合把节律拉回舒服的轨道。"
        : low
          ? "放到身心状态上，今天更像提醒你别透支，恢复比输出更重要。"
          : "放到身心状态上，今天重点是稳节奏，而不是忽然加码。",
    },
    en: {
      overall: high
        ? `In ${label} terms, the day is not effortless, but you do have enough support to bring things back onto your own track.`
        : low
          ? `In ${label} terms, today is more about not rushing blindly. Holding the center is worth more than scattering effort.`
          : `In ${label} terms, today is neither fully open nor fully blocked. The main issue is choosing the right line of effort.`,
      career: high
        ? "For career matters, today supports initiative, outreach, and concrete progress."
        : low
          ? "For career matters, today is better for clearing friction, fixing details, and not forcing a push too early."
          : "For career matters, sequencing and boundary control matter more than raw effort.",
      wealth: high
        ? "For money matters, clearer opportunities with defined boundaries are more favorable today."
        : low
          ? "For money matters, the real task is avoiding impulse, misreading risk, and acting too fast."
          : "For money matters, movement is possible, but only after pace and limits are clearly defined.",
      love: high
        ? "For relationships, today supports honest expression and clearing misunderstandings through real contact."
        : low
          ? "For relationships, today works better when you reduce assumptions, pressure, and emotional forcing."
          : "For relationships, tone and timing matter more than making a dramatic statement.",
      health: high
        ? "For health and energy, today gives room to reset your rhythm and feel more regulated."
        : low
          ? "For health and energy, today is more of a warning against overuse; recovery matters more than output."
          : "For health and energy, the main task is regulating pace rather than suddenly doing more.",
    },
  };
  return templates[language][focus];
}

function renderMeaning(result) {
  const language = state.language;
  const focus = selectedFocus();
  const upperMeaning = trigramFocusMeaning(result.hexagram.upper.key, focus, language, language === "zh" ? "外在" : "Upper");
  const lowerMeaning = trigramFocusMeaning(result.hexagram.lower.key, focus, language, language === "zh" ? "内在" : "Lower");
  const coreTheme = coreThemeCopy(result.pattern.relation, language);

  if (language === "zh") {
    const strengthMeaning =
      result.structure.strengthLabel === "偏强"
        ? "你的底盘本身更偏主动和有主见，所以一旦方向对了，推进通常不慢；但如果今天局势在变，太早用力过猛反而容易顶到阻力。"
        : result.structure.strengthLabel === "偏弱"
          ? "你的底盘更吃环境、支持和节奏，所以今天更讲究先把资源、体力和顺序摆对，再谈推进。"
          : "你的底盘相对均衡，说明今天真正拉开差距的，不是先天偏强偏弱，而是你是否读对节奏。";

    return renderDetailGrid([
      { label: "你这次问的是什么", value: focusPrompt(focus, "zh") },
      { label: "你的底盘会怎么影响今天", value: strengthMeaning },
      { label: "这卦为什么会把结果拉向这个方向", value: `${upperMeaning}${lowerMeaning}` },
      { label: "变化会达到什么程度", value: movingLineMeaning(result, focus, "zh") },
      { label: "放到你这次的问题上", value: focusSpecificMeaning(result, focus, "zh") },
      { label: "今天的主轴", value: coreTheme },
    ]);
  }

  const strengthMeaning =
    result.structure.strengthLabel === "偏强"
      ? "Your base chart carries more initiative and internal push, so once the direction is right, momentum comes naturally. The risk is using too much force before the situation is ready."
      : result.structure.strengthLabel === "偏弱"
        ? "Your base chart depends more on timing, support, and pacing, so getting the order and support right matters more than trying to overpower the day."
        : "Your base chart is relatively balanced, which means the main difference today comes from whether you read the timing correctly.";

  return renderDetailGrid([
    { label: "What You Asked About", value: focusPrompt(focus, "en") },
    { label: "How Your Base Chart Shapes Today", value: strengthMeaning },
    { label: "How The Hexagram Tilts The Reading", value: `${upperMeaning} ${lowerMeaning}`.trim() },
    { label: "How Much Change To Expect", value: movingLineMeaning(result, focus, "en") },
    { label: "What This Means For Your Focus", value: focusSpecificMeaning(result, focus, "en") },
    { label: "Today's Core Theme", value: coreTheme },
  ]);
}

function englishHexagramTitle(result) {
  return result.hexagram.nameEn || hexagramName(result.hexagram.upper, result.hexagram.lower, "en");
}

function englishHexagram(result) {
  const title = englishHexagramTitle(result);
  const judgment = result.hexagram.judgmentEn || hexagramReading(result.hexagram.upper, result.hexagram.lower, "en");
  const action = result.hexagram.actionEn ? ` ${result.hexagram.actionEn}` : "";
  return `${title}. Image: ${hexagramImage(result.hexagram.upper, result.hexagram.lower, "en")}. ${judgment}${action} ${hexagramChangeMeaning(result, "en")}`;
}

function renderPattern(result) {
  if (state.language === "zh") {
    return renderDetailGrid([
      { label: "格局倾向", value: result.pattern.name },
      { label: "成局来源", value: result.pattern.source },
      { label: "十神落点", value: result.pattern.relation },
      { label: "书中导向", value: result.pattern.guide.length ? result.pattern.guide.join("、") : "按强弱与调候并参" },
      { label: "格局用神", value: result.usefulSet.patternGods.length ? result.usefulSet.patternGods.map((element) => elementLabel(element)).join("、") : "按原局定" },
      { label: "辅助元素", value: result.usefulSet.supportiveGods.length ? result.usefulSet.supportiveGods.map((element) => elementLabel(element)).join("、") : "按原局再议" },
      { label: "综合偏忌", value: result.pattern.unfavorableElements.map((element) => elementLabel(element)).join("、") },
    ]);
  }

  const guide = result.pattern.guide.length ? translateList(result.pattern.guide) : "Context-based";
  return renderDetailGrid([
    { label: "Configuration", value: toEnglish(result.pattern.name) },
    { label: "Source", value: toEnglish(result.pattern.source) },
    { label: "Ten Gods Theme", value: toEnglish(result.pattern.relation) },
    { label: "Guide", value: guide },
    { label: "Primary Favorables", value: result.usefulSet.patternGods.length ? result.usefulSet.patternGods.map((element) => elementLabel(element)).join(", ") : "Context-based" },
    { label: "Support Elements", value: result.usefulSet.supportiveGods.length ? result.usefulSet.supportiveGods.map((element) => elementLabel(element)).join(", ") : "Context-based" },
    { label: "Avoid", value: result.pattern.unfavorableElements.map((element) => elementLabel(element)).join(", ") },
  ]);
}

function chineseHexagram(result) {
  const judgment = result.hexagram.judgmentZh || hexagramReading(result.hexagram.upper, result.hexagram.lower, "zh");
  const action = result.hexagram.actionZh || "";
  return `${result.hexagram.title} · ${result.hexagram.trigramTitleZh}。${judgment}${action}${hexagramChangeMeaning(result, "zh")}`;
}

function renderParagraph(text) {
  return `<div class="single-language-block"><p>${text}</p></div>`;
}

function movingLineSummary(result, language) {
  const movingLines = result.hexagram.movingLines;
  if (!movingLines.length) {
    return language === "zh"
      ? "无动爻，今天以本卦为主，没有单独突出的爻位变化。"
      : "There are no moving lines today, so the primary hexagram remains the main reference without one standout changing line.";
  }

  return movingLines.map((position) => {
    const lineValue = result.hexagram.lines[position - 1];
    const detail = `${linePositionMap[position][language]} ${lineTransitionMeaning(lineValue, language)}`;
    return language === "zh"
      ? `第 ${position} 爻：${detail}`
      : `Line ${position}: ${detail}`;
  }).join("<br />");
}

function renderHexagram(result) {
  const language = state.language;
  const rows = language === "zh"
    ? [
      { label: "本卦", value: `${result.hexagram.title} · ${result.hexagram.trigramTitleZh}` },
      { label: "卦象主旨", value: `${result.hexagram.judgmentZh || hexagramReading(result.hexagram.upper, result.hexagram.lower, "zh")}${result.hexagram.actionZh || ""}` },
      { label: "变化信号", value: hexagramChangeMeaning(result, "zh") },
      { label: "爻位变化", value: movingLineSummary(result, "zh") },
    ]
    : [
      { label: "Primary Hexagram", value: `${englishHexagramTitle(result)} · ${hexagramName(result.hexagram.upper, result.hexagram.lower, "en")}` },
      { label: "Main Theme", value: `${result.hexagram.judgmentEn || hexagramReading(result.hexagram.upper, result.hexagram.lower, "en")}${result.hexagram.actionEn ? ` ${result.hexagram.actionEn}` : ""}` },
      { label: "Change Signal", value: hexagramChangeMeaning(result, "en") },
      { label: "Moving Line Changes", value: movingLineSummary(result, "en") },
    ];
  return renderDetailGrid(rows);
}

function renderResult(result) {
  const focus = document.querySelector("#focus-area").value;
  const focusScore = result.metrics[focus];
  emptyState.classList.add("hidden");
  resultsPanel.classList.remove("hidden");
  if (advancedReading) advancedReading.open = false;
  document.querySelector('[data-i18n="scoreLabel"]').textContent = focusLabelMap[state.language][focus];
  document.querySelector("#score-value").textContent = String(focusScore);
  document.querySelector("#score-tier").innerHTML = state.language === "zh"
    ? `<span class="tier-zh">${result.tier}</span><span class="tier-date">${formatDisplayDate(todayInTimezone(DEFAULT_TIMEZONE))}</span>`
    : `<span class="tier-en">${englishTier(result)}</span><span class="tier-date">${formatDisplayDate(todayInTimezone(DEFAULT_TIMEZONE))}</span>`;
  document.querySelector("#metrics").innerHTML = "";
  document.querySelector("#summary-text").innerHTML = renderParagraph(state.language === "zh" ? result.summary : englishSummary(result));
  document.querySelector("#advice-text").innerHTML = renderParagraph(state.language === "zh" ? result.advice : englishAdvice(result));
  document.querySelector("#structure-card").innerHTML = renderStructure(result);
  document.querySelector("#meaning-card").innerHTML = renderMeaning(result);
  document.querySelector("#hexagram-card").innerHTML = renderHexagram(result);
  document.querySelector("#luck-card").innerHTML = renderLuck(result);
}

function showError(message, step = "step2") {
  showStepError(step, message);
  const node = step === "step1" ? step1Error : step2Error;
  node?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function playResultsEntrance() {
  if (!resultsPanel) return;
  resultsPanel.classList.remove("entering");
  void resultsPanel.offsetWidth;
  resultsPanel.classList.add("entering");
}

function scrollToResults() {
  if (!resultsSection) return;
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const targetY = Math.max(0, window.scrollY + resultsSection.getBoundingClientRect().top - 14);

  if (prefersReducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }

  if (state.scrollRaf) cancelAnimationFrame(state.scrollRaf);

  const startY = window.scrollY;
  const distance = targetY - startY;
  const duration = Math.max(900, Math.min(1450, Math.abs(distance) * 0.9));
  const startTime = performance.now();
  const easeInOutQuart = (progress) => (progress < 0.5
    ? 8 * progress ** 4
    : 1 - ((-2 * progress + 2) ** 4) / 2);

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeInOutQuart(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) {
      state.scrollRaf = requestAnimationFrame(tick);
    } else {
      state.scrollRaf = null;
    }
  };

  state.scrollRaf = requestAnimationFrame(tick);
}

function analyze() {
  clearStepErrors();
  const validation = validateSteps();
  if (validation) {
    showError(validation.message, validation.step);
    return;
  }
  try {
    const result = buildFortune(collectPayload());
    state.latestResult = result;
    renderResult(result);
    playResultsEntrance();
    scrollToResults();
    updateHeroBlurb();
    persistState();
  } catch (error) {
    showError(error.message, "step2");
  }
}

function setCastingUi(isCasting) {
  state.isCasting = isCasting;
  refreshCastingActions();
}

function randomizeAll() {
  if (state.isCasting) return;
  if (state.castingMode === "quick") {
    clearStepError("step1");
    const birthValidation = validateBirthStep();
    if (birthValidation) {
      showError(birthValidation.message, birthValidation.step);
      return;
    }
  }
  clearStepError("step2");
  setCastingUi(true);
  state.coinLines = [null, null, null, null, null, null];
  resetReadingView();
  renderCoinRows();
  updateHeroBlurb();

  const sequence = [0, 1, 2, 3, 4, 5];
  sequence.forEach((lineIndex, step) => {
    window.setTimeout(() => {
      animateCoinStage(lineIndex + 1);
    }, 1120 * step + 40);

    window.setTimeout(() => {
      state.coinLines[lineIndex] = COIN_OPTIONS[Math.floor(Math.random() * COIN_OPTIONS.length)].value;
      renderCoinRows();
      const targetRow = [...document.querySelectorAll(".line-row")][lineIndex];
      if (targetRow) {
        targetRow.classList.add("animating");
        window.setTimeout(() => targetRow.classList.remove("animating"), 360);
      }
      updateHeroBlurb();
      if (step === sequence.length - 1) {
        persistState();
        setCastingUi(false);
        if (state.castingMode === "quick") {
          setCastingMode("traditional");
          window.setTimeout(() => {
            analyzeButton?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            analyzeButton?.focus({ preventScroll: true });
          }, 180);
        }
      }
    }, 1120 * step + 920);
  });
}

function clearCasting() {
  if (state.isCasting) return;
  clearStepError("step2");
  state.coinLines = [null, null, null, null, null, null];
  resetReadingView();
  renderCoinRows();
  updateHeroBlurb();
  persistState();
}

restoreLanguage();
restoreState();
applyTranslations();
syncCastingMode();
syncEstimateSelection();
updateHeroDate();
renderCoinRows();
updateHeroBlurb();

analyzeButton.addEventListener("click", analyze);
randomizeButton.addEventListener("click", randomizeAll);
clearButton.addEventListener("click", clearCasting);
castingRouteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCastingMode(button.dataset.castingMode);
    clearStepError("step2");
  });
});
switchToTraditionalButton?.addEventListener("click", () => {
  setCastingMode("traditional");
  clearStepError("step2");
  window.setTimeout(() => focusCoinLine(nextOpenCoinLineIndex()), 120);
});
form.addEventListener("input", () => {
  clearStepError("step1");
  if (state.latestResult) resetReadingView();
});
birthDatePicker?.addEventListener("change", () => clearStepError("step1"));
langEnButton.addEventListener("click", () => {
  state.language = "en";
  persistLanguage();
  applyTranslations();
  syncCastingMode();
  updateHeroDate();
  if (state.latestResult) renderResult(state.latestResult);
  renderCoinRows();
  updateHeroBlurb();
});
langZhButton.addEventListener("click", () => {
  state.language = "zh";
  persistLanguage();
  applyTranslations();
  syncCastingMode();
  updateHeroDate();
  if (state.latestResult) renderResult(state.latestResult);
  renderCoinRows();
  updateHeroBlurb();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  analyze();
});
form.addEventListener("change", () => {
  resetReadingView();
  syncEstimateSelection();
  updateHeroDate();
  updateHeroBlurb();
  persistState();
});

estimateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyEstimatedBirthTime(button.dataset.estimateTime);
  });
});

birthDatePickerButton?.addEventListener("click", openBirthDatePicker);

birthDatePicker?.addEventListener("change", () => {
  setBirthDateDisplay(birthDatePicker.value);
  resetReadingView();
  persistState();
});

birthDateInput?.addEventListener("input", () => {
  const formatted = formatBirthDateDigits(birthDateInput.value);
  if (birthDateInput.value !== formatted) {
    birthDateInput.value = formatted;
  }
  const iso = parseBirthDateInput(formatted);
  if (birthDatePicker) {
    birthDatePicker.value = iso || "";
  }
});

birthDateInput?.addEventListener("blur", () => {
  if (!birthDateInput.value.trim()) {
    setBirthDateDisplay("");
    persistState();
    return;
  }
  const iso = parseBirthDateInput(birthDateInput.value);
  if (iso) {
    setBirthDateDisplay(iso);
    resetReadingView();
    persistState();
  }
});
