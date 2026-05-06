import { COIN_OPTIONS, ELEMENT_LABELS, buildFortune, buildHexagram, getTransitPillars } from "./fortune-core.js";
import { getDayYi, getDayJi } from "./lunar-almanac.js";
import { analyzeHexagramSelfLine } from "./fortune-core.js";
import { analyzeHexagramUsefulLine } from "./fortune-core.js";

const LANGUAGE_KEY = "coin-divination-language";
const DEFAULT_LANGUAGE = "en";
const DEFAULT_TIMEZONE = "America/Indianapolis";
const NEUTRAL_COIN_LINES = [7, 8, 7, 8, 7, 8];

const state = {
  language: localStorage.getItem(LANGUAGE_KEY) === "zh" ? "zh" : DEFAULT_LANGUAGE,
  activeView: "coin",
  coinCastingMode: "quick",
  isCoinCasting: false,
  coinLines: [null, null, null, null, null, null],
  coinResult: null,
  baziResult: null,
};

const HTML_TRANSLATION_KEYS = new Set(["coinIntroText3"]);

const translations = {
  en: {
    heroEyebrow: "Eastern Chart x Hexagram Casting",
    heroTitle: "Hexagram Divination",
    heroText: "A reading for today, drawn from birth time and coin.",
    heroLabel: "Today's Almanac",
    heroGood: "Auspicious",
    heroAvoid: "Avoid",
    coinViewLabel: "Hexagram Divination",
    baziViewLabel: "Bazi Reading",
    coinIntroKicker: "",
    coinIntroTitle: "What Is Six-Line Casting?",
    coinIntroText1: "Six-line casting is a traditional way of asking one clear question by using three coins to cast six lines. Each toss becomes one yin or yang line, and the six lines are stacked from bottom to top to form the primary hexagram.",
    coinIntroText2: "If a cast produces an old yin or old yang line, that line is treated as moving. In practice, the reading usually starts with the primary hexagram for the present situation, then the moving lines for the key turning points, and finally the changed hexagram for where the matter may be heading.",
    coinIntroText3: "Its roots go back to the divination tradition of the Yijing, where six-line hexagrams were used to model change. The later six-line method commonly used today developed by combining the hexagram with a more detailed way of reading shifts and relationships inside the cast. Traditionally, people believe it can answer a question because the moment of asking, the cast itself, and the changing yin-yang pattern are treated as corresponding to the situation you are asking about. <a href=\"https://en.wikipedia.org/wiki/I_Ching_divination\" target=\"_blank\" rel=\"noreferrer\">Learn more here.</a>",
    coinStep1Kicker: "Step 1",
    coinStep1Title: "Frame One Clear Question",
    coinIntentNote: "Before you cast, settle your mind and hold one specific matter only. One hexagram should answer one question, not several at the same time. Then choose the question type below by the useful line you would usually take in six-line reading.",
    coinFocusLabel: "By six-line useful-line method, which question type fits best?",
    coinFocusSelf: "Personal situation / general outlook (read from the Self line)",
    coinFocusWealth: "Money, trade, or male love inquiry (take Wealth)",
    coinFocusAuthority: "Career, position, or female love inquiry (take Officer)",
    coinFocusParent: "Documents, exams, housing, or parents (take Parent)",
    coinFocusChild: "Children, pregnancy, healing, or relief (take Child)",
    coinFocusSibling: "Friends, partnership, or competition (take Sibling)",
    overall: "Overall",
    career: "Career",
    wealth: "Wealth",
    love: "Love",
    health: "Health",
    coinStep2Kicker: "Step 2",
    coinStep2Title: "Cast A Six-Line Hexagram",
    coinQuickTab: "Quick Reading",
    coinTraditionalTab: "Traditional Coin Casting",
    coinQuickTitle: "We can perform the ritual for you.",
    coinQuickTextLead: "We can perform the ritual for you, so you can get a quick reading. But we do recommend",
    coinQuickTextTail: "if you'd like to perform the cast yourself for a more accurate reading.",
    coinQuickAction: "Automatic Casting",
    coinGuideIntro: "Best with real coins: toss three coins for each line and record the heads and tails below. For example, if you get two heads and one tail, record it as 2H/1T.",
    coinGuideSteps: "Six-line divination works best when you ask one concrete question. Toss your coins 6 times, record each toss in order, then read the hexagram from the current situation into the direction of change.",
    clearCast: "Clear Casting",
    coinGenerate: "Generate Hexagram Reading",
    coinStep3Kicker: "Step 3",
    coinStep3Title: "Hexagram Reading",
    coinEmptyState: "After you complete the six-line cast, your hexagram reading will appear here.",
    coinScoreLabel: "Hexagram Tone",
    coinSelfTitle: "Read The Self Line First",
    coinUsefulTitle: "Then Read The Useful Line And Response",
    coinSummaryTitle: "Reading For Your Question",
    coinFocusTitle: "Practical Advice",
    coinHexagramTitle: "Current Situation",
    coinChangeTitle: "Direction Of Change",
    coinLinesTitle: "Moving Lines To Watch",
    baziIntroKicker: "Bazi Path",
    baziIntroTitle: "Read the Day Through Your Birth Chart",
    baziIntroText1: "This page reads only the birth chart and the current timing background. It does not use a hexagram cast.",
    baziIntroText2: "Use it when you want the chart structure, climate, and luck-cycle context behind today's energy.",
    baziIntroEstimateLead: "If you do not know the exact birth time, use the closest approximate time you remember for now.",
    baziIntroEstimateRule: "A more accurate birth time usually gives a more accurate reading, especially for the hour pillar, luck cycles, and timing-related details.",
    baziStep1Kicker: "Step 1",
    baziStep1Title: "Enter Birth Details",
    birthDate: "Birth Date",
    openCalendar: "Open calendar",
    birthTime: "Birth Time",
    gender: "Gender",
    female: "Female",
    male: "Male",
    other: "Other / Prefer not to say",
    baziFocusLabel: "What do you want the chart to focus on today?",
    baziStep2Kicker: "Step 2",
    baziStep2Title: "Generate Bazi Reading",
    baziActionCopy: "We will read today's timing through your natal chart, seasonal climate, and current luck-cycle background.",
    baziGenerate: "Generate Bazi Reading",
    baziStep3Kicker: "Step 3",
    baziStep3Title: "Bazi Reading",
    baziEmptyState: "After you enter your birth details, your chart-based reading will appear here.",
    baziScoreLabel: "Chart Tone Today",
    baziSummaryTitle: "Main Reading",
    baziFocusTitle: "Focus Guidance",
    baziClimateTitle: "Chart Climate",
    baziMeaningTitle: "What This Means",
    baziStructureTitle: "Chart Structure",
    baziLuckTitle: "Luck Cycles",
    coinProgress: "Manual next: record Line {line}. Completed {count}/6.",
    coinReady: "All 6 lines are recorded. Generate the hexagram reading when you're ready.",
    coinMissing: "Please complete all six coin lines first.",
    baziMissingDate: "Please enter a valid birth date before continuing.",
    baziMissingTime: "Please choose a birth time before continuing.",
    baziMissingForm: "Please complete the birth details first.",
    notCast: "Not cast",
  },
  zh: {
    heroEyebrow: "东方命理 x 金钱起卦",
    heroTitle: "Hexagram Divination",
    heroText: "从出生时间与金钱起卦中，为今天读出一则提示。",
    heroLabel: "今日黄历",
    heroGood: "宜",
    heroAvoid: "忌",
    coinViewLabel: "金钱卦",
    baziViewLabel: "八字",
    coinIntroKicker: "",
    coinIntroTitle: "什么是六爻起卦",
    coinIntroText1: "六爻起卦是一种围绕单一问题来占问的传统方法：用三枚硬币连续起六次，每一次结果形成一爻，六爻按照从下到上的顺序排起来，就形成了本卦。",
    coinIntroText2: "如果起卦时出现老阴或老阳，这一爻就算动爻。实际解读时，通常会先看本卦来判断当下局面，再看动爻抓住关键变化点，最后再看变卦，理解这件事后面可能转向哪里。",
    coinIntroText3: "它的源头可以追到《易经》的占筮传统。六爻这套后来常用的方法，则是在六画成卦的基础上，逐步发展出更细的爻位、变化与关系判断。传统上之所以认为它能回答问题，是因为会把“起念发问的当下”“起出的卦象”以及其中阴阳变化的结构，看作与所问之事彼此感应、互相对应。<a href=\"https://en.wikipedia.org/wiki/I_Ching_divination\" target=\"_blank\" rel=\"noreferrer\">了解更多</a>",
    coinStep1Kicker: "步骤 1",
    coinStep1Title: "先确定一件要问的事",
    coinIntentNote: "起卦前要先静心，一事一卦。先在心里定下一件具体要问的事，并在六次起卦过程中持续把注意力放在这个问题上；一个卦象不要同时询问多个问题。然后再按六爻常用的取用神方法，选出下面最接近的类别。",
    coinFocusLabel: "按六爻取用神，这次主要属于哪一类问题？",
    coinFocusSelf: "自身处境 / 综合判断（以世爻为主）",
    coinFocusWealth: "求财、交易、男问感情（取妻财）",
    coinFocusAuthority: "工作、职位、女问感情（取官鬼）",
    coinFocusParent: "文书、考试、房产、父母长辈（取父母）",
    coinFocusChild: "子女、怀孕、医药、解除忧患（取子孙）",
    coinFocusSibling: "朋友、合伙、竞争、兄弟姐妹（取兄弟）",
    overall: "整体",
    career: "事业",
    wealth: "财富",
    love: "感情",
    health: "健康",
    coinStep2Kicker: "步骤 2",
    coinStep2Title: "起六爻金钱卦",
    coinQuickTab: "快速起卦",
    coinTraditionalTab: "传统手动起卦",
    coinQuickTitle: "我们可以先替你完成起卦仪式。",
    coinQuickTextLead: "我们可以先替你完成起卦仪式，让你快速拿到一版阅读。不过如果你更在意准确度，还是更推荐",
    coinQuickTextTail: "由你自己亲手起卦。",
    coinQuickAction: "自动起卦",
    coinGuideIntro: "更推荐用真实硬币：每一爻抛三枚硬币，把正反面的数量记录在下方。比如两正一反，就记作 2H/1T。",
    coinGuideSteps: "六爻更适合一事一占。按顺序抛 6 次硬币，把结果记到下面六爻，再从本卦、动爻、变卦的顺序来读这次问题。",
    clearCast: "清空起卦",
    coinGenerate: "生成卦象解读",
    coinStep3Kicker: "步骤 3",
    coinStep3Title: "卦象解读",
    coinEmptyState: "完成六爻起卦后，这里会出现只属于这次卦象的解读。",
    coinScoreLabel: "卦象强度",
    coinSelfTitle: "先看世爻",
    coinUsefulTitle: "再看用神与世应",
    coinSummaryTitle: "针对这次问题的主判断",
    coinFocusTitle: "实际建议",
    coinHexagramTitle: "当前局面",
    coinChangeTitle: "后续变化方向",
    coinLinesTitle: "需要重点看的动爻",
    baziIntroKicker: "八字",
    baziIntroTitle: "只看命盘，读今天的气候与时机",
    baziIntroText1: "这个页面只解读你的八字命盘与今天的时令背景，不会使用金钱卦。",
    baziIntroText2: "适合你想看今天的命理结构、调候重点，以及大运流年背景时使用。",
    baziIntroEstimateLead: "如果你不知道精确出生时间，可以先用你记得最接近的大概时间代替。",
    baziIntroEstimateRule: "出生时间越准确，结果通常越准确，尤其会影响时柱、大运起算和一些与时机有关的细节。",
    baziStep1Kicker: "步骤 1",
    baziStep1Title: "输入出生信息",
    birthDate: "出生日期",
    openCalendar: "打开日历",
    birthTime: "出生时间",
    gender: "性别",
    female: "女",
    male: "男",
    other: "其他 / 不设定",
    baziFocusLabel: "你想让今天的命盘解读更聚焦在哪个方向？",
    baziStep2Kicker: "步骤 2",
    baziStep2Title: "生成八字解读",
    baziActionCopy: "系统会只根据你的原局、调候、今日时令与当前大运流年来读今天的命理背景。",
    baziGenerate: "生成八字解读",
    baziStep3Kicker: "步骤 3",
    baziStep3Title: "八字解读",
    baziEmptyState: "输入出生信息后，这里会出现只属于命盘背景的今日解读。",
    baziScoreLabel: "今日命盘气势",
    baziSummaryTitle: "主判断",
    baziFocusTitle: "对应你问题的提示",
    baziClimateTitle: "调候与时令",
    baziMeaningTitle: "这代表什么",
    baziStructureTitle: "命理结构",
    baziLuckTitle: "大运与流年",
    coinProgress: "下一步请先记录第 {line} 爻，当前已完成 {count}/6。",
    coinReady: "六爻都已记录完成，可以生成卦象解读了。",
    coinMissing: "请先完成六次起卦。",
    baziMissingDate: "请先输入有效的出生日期。",
    baziMissingTime: "请先选择出生时间。",
    baziMissingForm: "请先补全出生信息。",
    notCast: "未落爻",
  },
};

const phraseMap = {
  上扬日: "Rising day",
  顺势日: "Favorable day",
  平衡日: "Balanced day",
  谨慎日: "Cautious day",
  收敛日: "Low-profile day",
  极强: "very strong",
  偏强: "strong",
  中和: "balanced",
  偏弱: "weak",
  极弱: "very weak",
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
  木旺待疏: "wood is excessive and needs pruning",
  木燥需润: "dry wood needs moisture",
  金旺伐木: "metal is strong and cuts wood",
  寒木向阳: "cold wood seeks warmth",
  火赖木生: "fire relies on wood to grow",
  炎火需济: "blazing fire needs cooling balance",
  火退喜扶: "retreating fire needs support",
  寒火待燃: "cold fire needs fuel",
  湿土待暖: "damp earth needs warmth",
  燥土喜润: "dry earth prefers moisture",
  厚土喜疏: "heavy earth needs loosening",
  寒土喜暖: "cold earth prefers warmth",
  金肃偏燥: "dry and sharp metal climate",
  金困木乡: "metal is constrained in wood territory",
  金熔待水: "molten metal needs water",
  金旺需火: "strong metal needs fire",
  寒金待炼: "cold metal needs forging",
  水木泛动: "water and wood move too freely",
  水弱待源: "weak water needs a source",
  金白水清: "clear metal brings clear water",
  寒水须阳: "cold water needs warmth",
  水寒偏重: "cold water-heavy climate",
  火炎偏燥: "hot and dry fire climate",
  土重偏滞: "heavy and stagnant earth climate",
  偏寒湿: "cold and damp",
  偏热燥: "hot and dry",
  偏平和: "relatively even",
  逆行: "reverse flow",
  顺行: "forward flow",
  定主线: "Set the main line",
  见关键人: "Meet the key person",
  完成收尾: "Finish the closing work",
  列优先级: "Rank priorities",
  祭祀: "Ritual offering",
  祈福: "Pray for blessings",
  求嗣: "Pray for children",
  开光: "Consecration",
  订盟: "Make an agreement",
  纳采: "Betrothal",
  裁衣: "Tailoring",
  合帐: "Prepare bed curtains",
  冠笄: "Coming-of-age rite",
  安床: "Set the bed",
  开市: "Open for business",
  纳财: "Receive wealth",
  开仓: "Open storage",
  出货财: "Release goods and funds",
  动土: "Break ground",
  破土: "Break earth",
  修造: "Construction and repairs",
  入宅: "Move into the home",
  移徙: "Relocate",
  赴任: "Take office",
  沐浴: "Purification bath",
  酬神: "Offer thanks to deities",
  造庙: "Build a temple",
  斋醮: "Hold fasting rites",
  焚香: "Burn incense",
  谢土: "Thank the earth",
  雕刻: "Carving work",
  订婚: "Engagement",
  问名: "Exchange names",
  纳婿: "Receive a son-in-law",
  归宁: "Return to family",
  挽面: "Facial grooming rite",
  开容: "Open the face ceremony",
  修坟: "Repair a grave",
  启钻: "Open the burial marker",
  安门: "Install doors",
  起基: "Lay foundations",
  上梁: "Raise beams",
  竖柱: "Raise pillars",
  开井开池: "Open wells and ponds",
  作陂放水: "Build banks and release water",
  拆卸: "Demolition",
  破屋: "Demolish house",
  补垣: "Repair walls",
  伐木做梁: "Cut timber for beams",
  作灶: "Build stove",
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
  挂匾: "Hang a signboard",
  求财: "Seek wealth",
  买车: "Buy a vehicle",
  置产: "Acquire property",
  雇佣: "Hire people",
  安机械: "Install machinery",
  安机: "Install machinery",
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
  安碓磑: "Install grinding stones",
  习艺: "Practice a craft",
  入学: "Begin studies",
  理发: "Get a haircut",
  探病: "Visit the sick",
  见贵: "Meet helpful people",
  乘船: "Travel by boat",
  渡水: "Cross water",
  针灸: "Acupuncture",
  分居: "Separate households",
  剃头: "Shave hair",
  整手足甲: "Trim nails",
  纳畜: "Receive livestock",
  捕捉: "Capture",
  畋猎: "Hunting",
  教牛马: "Train cattle and horses",
  会亲友: "Meet family and friends",
  求医: "Seek medical help",
  治病: "Treat illness",
  词讼: "Legal disputes",
  起基动土: "Lay foundations and break ground",
  盖屋: "Build roofing",
  造仓库: "Build warehouses",
  立券交易: "Sign contracts and trade",
  交易: "Make transactions",
  会友: "Meet friends",
  求医疗病: "Seek treatment",
  行丧: "Funeral matters",
  断蚁: "Pest clearing",
  立碑: "Set a memorial stone",
  成服: "Mourning attire rite",
  除服: "End mourning rite",
  开生坟: "Prepare a burial plot",
  合寿木: "Prepare longevity wood",
  移柩: "Move the coffin",
  普渡: "Universal offering rite",
  安香: "Install incense altar",
  作陂放水: "Build banks and release water",
  破屋坏垣: "Demolish the house and clear broken walls",
  祀灶: "Kitchen offering rite",
  归岫: "Return to retreat",
  塑绘: "Sculpting and painting",
  齐醮: "Complete fasting rites",
  无: "None",
  临时改主意: "Change course at the last minute",
  情绪化答应: "Promise emotionally",
  过量社交: "Over-socialize",
  一次做太多: "Try to do too much at once",
  嫁娶: "Marriage ceremony",
  开光: "Consecration",
  出行: "Travel",
  出火: "Move fire / kitchen fire",
  进人口: "Receive new household members",
  立券: "Sign contracts",
  入殓: "Encoffinment",
  安葬: "Burial",
  解除: "Remove obstacles",
  坏垣: "Demolish old walls",
  馀事勿取: "Do not add extra matters",
  余事勿取: "Do not add extra matters",
  诸事不宜: "Avoid major undertakings",
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

const elementEnglishMap = { wood: "Wood", fire: "Fire", earth: "Earth", metal: "Metal", water: "Water" };
const stemEnglishMap = { jia: "Jia", yi: "Yi", bing: "Bing", ding: "Ding", wu: "Wu", ji: "Ji", geng: "Geng", xin: "Xin", ren: "Ren", gui: "Gui" };
const branchEnglishMap = { zi: "Zi", chou: "Chou", yin: "Yin", mao: "Mao", chen: "Chen", si: "Si", wu: "Wu", wei: "Wei", shen: "Shen", you: "You", xu: "Xu", hai: "Hai" };
const branchChineseMap = { zi: "子", chou: "丑", yin: "寅", mao: "卯", chen: "辰", si: "巳", wu: "午", wei: "未", shen: "申", you: "酉", xu: "戌", hai: "亥" };
const linePositionMap = {
  1: { zh: "初爻主开端、第一步与最早的反应。", en: "Line 1 speaks to the opening move and the first response." },
  2: { zh: "二爻主内部基础、配合度与能不能稳稳接住。", en: "Line 2 speaks to inner footing, support, and whether the matter can be held steadily." },
  3: { zh: "三爻主过渡卡点，最容易在推进时起摩擦。", en: "Line 3 marks the friction point in transition." },
  4: { zh: "四爻主开始接触外部局势，从准备走向现实。", en: "Line 4 shows the shift from preparation into real contact with the outside situation." },
  5: { zh: "五爻主主轴、核心判断与谁来定调。", en: "Line 5 points to the main axis, the core decision, and who sets the tone." },
  6: { zh: "上爻主事情走到极处，容易收尾、过头或转向。", en: "Line 6 speaks to culmination, excess, reversal, or how the matter closes." },
};

const nodes = {
  heroEyebrow: document.querySelector("#hero-eyebrow"),
  heroTitle: document.querySelector("#hero-title"),
  heroText: document.querySelector("#hero-text"),
  heroDate: document.querySelector("#hero-date"),
  heroBlurb: document.querySelector("#hero-blurb"),
  langEn: document.querySelector("#lang-en"),
  langZh: document.querySelector("#lang-zh"),
  viewCoin: document.querySelector("#view-coin"),
  viewBazi: document.querySelector("#view-bazi"),
  coinView: document.querySelector("#coin-view"),
  baziView: document.querySelector("#bazi-view"),
  coinForm: document.querySelector("#coin-form"),
  coinFocus: document.querySelector("#coin-focus-area"),
  coinModeQuick: document.querySelector("#coin-casting-mode-quick"),
  coinModeTraditional: document.querySelector("#coin-casting-mode-traditional"),
  coinRouteQuick: document.querySelector("#coin-casting-route-quick"),
  coinRouteTraditional: document.querySelector("#coin-casting-route-traditional"),
  coinSwitchTraditional: document.querySelector("#coin-switch-to-traditional"),
  coinRandomize: document.querySelector("#coin-randomize-all"),
  coinLines: document.querySelector("#coin-lines"),
  coinProgress: document.querySelector("#coin-casting-progress"),
  coinStage: document.querySelector("#coin-stage"),
  coinDiscs: [...document.querySelectorAll(".coin-disc")],
  coinClear: document.querySelector("#coin-clear-casting"),
  coinAnalyze: document.querySelector("#coin-analyze-button"),
  coinStep2Error: document.querySelector("#coin-step2-error"),
  coinEmptyState: document.querySelector("#coin-empty-state"),
  coinResults: document.querySelector("#coin-results"),
  coinScoreLabel: document.querySelector('[data-i18n="coinScoreLabel"]'),
  coinScoreValue: document.querySelector("#coin-score-value"),
  coinScoreTier: document.querySelector("#coin-score-tier"),
  coinSelfCard: document.querySelector("#coin-self-card"),
  coinUsefulCard: document.querySelector("#coin-useful-card"),
  coinSummaryText: document.querySelector("#coin-summary-text"),
  coinFocusText: document.querySelector("#coin-focus-text"),
  coinHexagramCard: document.querySelector("#coin-hexagram-card"),
  coinChangeCard: document.querySelector("#coin-change-card"),
  coinLinesCard: document.querySelector("#coin-lines-card"),
  baziBirthDate: document.querySelector("#bazi-birth-date"),
  baziBirthDatePicker: document.querySelector("#bazi-birth-date-picker"),
  baziBirthDatePickerButton: document.querySelector("#bazi-birth-date-picker-button"),
  baziBirthTime: document.querySelector("#bazi-birth-time"),
  baziBirthTimeHour: document.querySelector("#bazi-birth-time-hour"),
  baziBirthTimeMinute: document.querySelector("#bazi-birth-time-minute"),
  baziBirthTimeMeridiem: document.querySelector("#bazi-birth-time-meridiem"),
  baziGender: document.querySelector("#bazi-gender"),
  baziFocus: document.querySelector("#bazi-focus-area"),
  baziAnalyze: document.querySelector("#bazi-analyze-button"),
  baziStep1Error: document.querySelector("#bazi-step1-error"),
  baziEmptyState: document.querySelector("#bazi-empty-state"),
  baziResults: document.querySelector("#bazi-results"),
  baziScoreValue: document.querySelector("#bazi-score-value"),
  baziScoreTier: document.querySelector("#bazi-score-tier"),
  baziSummaryText: document.querySelector("#bazi-summary-text"),
  baziFocusText: document.querySelector("#bazi-focus-text"),
  baziClimateCard: document.querySelector("#bazi-climate-card"),
  baziMeaningCard: document.querySelector("#bazi-meaning-card"),
  baziStructureCard: document.querySelector("#bazi-structure-card"),
  baziLuckCard: document.querySelector("#bazi-luck-card"),
};

const coinResultsPanel = nodes.coinResults?.closest(".panel-results");
const baziResultsPanel = nodes.baziResults?.closest(".panel-results");

function t(key, vars = {}) {
  const template = translations[state.language][key] ?? translations.en[key] ?? key;
  return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toEnglish(text) {
  let output = String(text ?? "");
  Object.entries(phraseMap)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([zh, en]) => {
      output = output.replaceAll(zh, en);
    });
  return output;
}

function elementLabel(element) {
  return state.language === "zh" ? ELEMENT_LABELS[element] : (elementEnglishMap[element] || element);
}

function todayInTimezone(timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
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

function renderParagraph(text) {
  return `<div class="single-language-block"><p>${text}</p></div>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderDetailGrid(rows) {
  return `<div class="detail-grid">${rows.map((row) => `<div class="detail-row"><div class="detail-term">${row.label}</div><div class="detail-value">${row.value}</div></div>`).join("")}</div>`;
}

function renderSelfLineCard(reading) {
  const selfLine = reading.selfLine;
  if (!selfLine?.shiLine) {
    return renderParagraph(state.language === "zh" ? "世爻底表尚未完整，暂时不能判断卦主状态。" : "The Self-line table is not complete enough to judge the querent's state yet.");
  }

  const shi = selfLine.shiLine;
  const monthBranchKey = selfLine.transit?.monthPillar?.branch?.key;
  const dayBranchKey = selfLine.transit?.dayPillar?.branch?.key;
  const shiValue = state.language === "zh"
    ? `第${shi.position}爻 · ${shi.branchLabel}${elementLabel(shi.element)}`
    : `Line ${shi.position} · ${branchEnglishMap[shi.branchKey] || shi.branchKey} ${elementLabel(shi.element)}`;
  const monthValue = state.language === "zh"
    ? `${branchChineseMap[monthBranchKey] || ""}月：${selfLine.monthEffect.labelZh}`
    : `${branchEnglishMap[monthBranchKey] || monthBranchKey} month: ${selfLine.monthEffect.labelEn}`;
  const dayValue = state.language === "zh"
    ? `${branchChineseMap[dayBranchKey] || ""}日：${selfLine.dayEffect.labelZh}`
    : `${branchEnglishMap[dayBranchKey] || dayBranchKey} day: ${selfLine.dayEffect.labelEn}`;
  const statusValue = state.language === "zh"
    ? `${selfLine.status.tierZh} · ${selfLine.status.omenZh}`
    : `${selfLine.status.tierEn} · ${selfLine.status.omenEn}`;
  const detailText = state.language === "zh"
    ? `${selfLine.monthEffect.detailZh} ${selfLine.dayEffect.detailZh} ${selfLine.status.summaryZh}`
    : `${selfLine.monthEffect.detailEn} ${selfLine.dayEffect.detailEn} ${selfLine.status.summaryEn}`;

  return `
    ${renderDetailGrid([
      { label: state.language === "zh" ? "世爻" : "Self line", value: shiValue },
      { label: state.language === "zh" ? "月建" : "Month command", value: monthValue },
      { label: state.language === "zh" ? "日辰" : "Day branch", value: dayValue },
      { label: state.language === "zh" ? "卦主状态" : "Querent's state", value: statusValue },
    ])}
    <div class="single-language-block"><p>${detailText}</p></div>
  `;
}

function usefulLinePositionText(useful, language) {
  if (!useful?.usefulLine) {
    return language === "zh" ? "暂未定出稳定用神" : "A stable useful line is not determined yet";
  }

  const line = useful.usefulLine;
  const flags = [];
  if (line.isShi) flags.push(language === "zh" ? "临世" : "on the Self line");
  if (line.isYing) flags.push(language === "zh" ? "临应" : "on the Response line");
  if (line.isMoving) flags.push(language === "zh" ? "动爻" : "moving");
  const suffix = flags.length ? ` · ${flags.join(language === "zh" ? "、" : ", ")}` : "";

  return language === "zh"
    ? `第${line.position}爻 · ${line.relativeZh} · ${line.branchLabel}${elementLabel(line.element)}${suffix}`
    : `Line ${line.position} · ${line.relativeEn} · ${branchEnglishMap[line.branchKey] || line.branchKey} ${elementLabel(line.element)}${suffix}`;
}

function usefulFieldNote(useful, language) {
  if (!useful?.usefulLine) {
    return language === "zh"
      ? "这一步还看不出稳定落点，先别把结论说死。"
      : "This layer does not land cleanly yet, so it is too early to force a conclusion.";
  }

  const line = useful.usefulLine;
  const statusSummary = language === "zh" ? useful.status.summaryZh : useful.status.summaryEn;
  const shiYingDetail = language === "zh" ? useful.shiYing.detailZh : useful.shiYing.detailEn;
  const usefulToShiDetail = language === "zh" ? useful.usefulToShi.detailZh : useful.usefulToShi.detailEn;

  let landingText = "";
  if (language === "zh") {
    if (line.isYing) {
      landingText = "用神临应，说明事情关键更多握在对方或外部条件手里。";
    } else if (line.isShi) {
      landingText = "用神临世，说明这件事眼下更多还是看你自己怎么拿。";
    } else {
      landingText = `用神落在第${line.position}爻，说明关键点不只在你，也不只在对方，而在事情发展的某个环节。`;
    }
  } else if (line.isYing) {
    landingText = "The useful line sits on the Response line, so the key leverage is held more by the other side or by outer conditions.";
  } else if (line.isShi) {
    landingText = "The useful line sits on the Self line, so this matter depends more directly on what you do with it.";
  } else {
    landingText = `The useful line lands on line ${line.position}, so the real hinge sits in a stage of the matter rather than fully with you or the other side.`;
  }

  return `${statusSummary} ${landingText} ${usefulToShiDetail} ${shiYingDetail}`;
}

function renderUsefulLineCard(reading) {
  const useful = reading.usefulLineAnalysis;
  if (!useful) {
    return renderParagraph(state.language === "zh" ? "这一步的用神与世应判断还没有接上。" : "The useful-line and response-line reading is not connected yet.");
  }

  const usefulLine = useful.usefulLine;
  const timingValue = usefulLine
    ? (state.language === "zh"
      ? `月建：${usefulLine.timing.monthEffect.labelZh}；日辰：${usefulLine.timing.dayEffect.labelZh}；${usefulLine.timing.tierZh}`
      : `Month: ${usefulLine.timing.monthEffect.labelEn}; Day: ${usefulLine.timing.dayEffect.labelEn}; ${usefulLine.timing.tierEn}`)
    : (state.language === "zh" ? "暂未定" : "Pending");

  return `
    ${renderDetailGrid([
      { label: state.language === "zh" ? "这类问题的用神" : "Useful line for this question", value: state.language === "zh" ? useful.usefulRelationZh : useful.usefulRelationEn },
      { label: state.language === "zh" ? "用神落点" : "Where the useful line lands", value: usefulLinePositionText(useful, state.language) },
      { label: state.language === "zh" ? "用神得失" : "Useful-line condition", value: usefulLine ? timingValue : (state.language === "zh" ? `${useful.status.tierZh} · ${useful.status.omenZh}` : `${useful.status.tierEn} · ${useful.status.omenEn}`) },
      { label: state.language === "zh" ? "世应关系" : "Self / Response relation", value: state.language === "zh" ? useful.shiYing.labelZh : useful.shiYing.labelEn },
      { label: state.language === "zh" ? "用神对世爻" : "Useful line to Self line", value: useful.usefulToShi ? (state.language === "zh" ? useful.usefulToShi.labelZh : useful.usefulToShi.labelEn) : (state.language === "zh" ? "暂未定" : "Pending") },
    ])}
    <div class="single-language-block"><p>${usefulFieldNote(useful, state.language)}</p></div>
  `;
}

function formatList(items = []) {
  const values = items.filter(Boolean).map((item) => state.language === "zh" ? item : toEnglish(item));
  if (!values.length) return state.language === "zh" ? "无" : "None";
  return values.join(state.language === "zh" ? "、" : ", ");
}

function scoreTierText(score, language = state.language) {
  if (language === "zh") {
    if (score >= 86) return "上扬日";
    if (score >= 72) return "顺势日";
    if (score >= 58) return "平衡日";
    if (score >= 45) return "谨慎日";
    return "收敛日";
  }
  if (score >= 86) return "Rising day";
  if (score >= 72) return "Favorable day";
  if (score >= 58) return "Balanced day";
  if (score >= 45) return "Cautious day";
  return "Low-profile day";
}
function updateHeroCard() {
  const today = todayInTimezone(DEFAULT_TIMEZONE);
  const transit = getTransitPillars(today, DEFAULT_TIMEZONE);
  const good = getDayYi(transit.monthPillar.label, transit.dayPillar.label).slice(0, 6);
  const avoid = getDayJi(transit.monthPillar.label, transit.dayPillar.label).slice(0, 6);
  nodes.heroDate.textContent = formatDisplayDate(today);
  nodes.heroBlurb.innerHTML = `
    <div class="hero-almanac">
      <div class="hero-almanac-row">
        <strong>${t("heroGood")}</strong>
        <div class="hero-almanac-detail">${formatList(good)}</div>
      </div>
      <div class="hero-almanac-row">
        <strong>${t("heroAvoid")}</strong>
        <div class="hero-almanac-detail">${formatList(avoid)}</div>
      </div>
    </div>
  `;
}

function applyTranslations() {
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  document.title = "Hexagram Divination";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (!key) return;
    if (HTML_TRANSLATION_KEYS.has(key)) {
      node.innerHTML = t(key);
      return;
    }
    node.textContent = t(key);
  });
  nodes.heroEyebrow.textContent = t("heroEyebrow");
  nodes.heroTitle.textContent = t("heroTitle");
  nodes.heroText.textContent = t("heroText");
  nodes.viewCoin.textContent = t("coinViewLabel");
  nodes.viewBazi.textContent = t("baziViewLabel");
  nodes.langEn.classList.toggle("active", state.language === "en");
  nodes.langZh.classList.toggle("active", state.language === "zh");
  nodes.baziBirthDate.placeholder = "MM/DD/YYYY";
  nodes.baziBirthDatePicker.setAttribute("aria-label", t("birthDate"));
  nodes.baziBirthDatePickerButton.setAttribute("title", t("openCalendar"));
  populateBaziTimeControls();
  updateCoinProgress();
  updateHeroCard();
  if (state.coinResult && filledCoinLineCount() === 6) {
    renderCoinResult(buildCoinReading(state.coinLines, nodes.coinFocus.value));
  }
  if (state.baziResult) renderBaziResult(state.baziResult);
  renderCoinRows();
}

function setActiveView(view) {
  state.activeView = view === "bazi" ? "bazi" : "coin";
  const isCoin = state.activeView === "coin";
  nodes.coinView.classList.toggle("hidden", !isCoin);
  nodes.baziView.classList.toggle("hidden", isCoin);
  nodes.viewCoin.classList.toggle("active", isCoin);
  nodes.viewBazi.classList.toggle("active", !isCoin);
  nodes.viewCoin.setAttribute("aria-pressed", isCoin ? "true" : "false");
  nodes.viewBazi.setAttribute("aria-pressed", isCoin ? "false" : "true");
}

function setCoinCastingMode(mode) {
  state.coinCastingMode = mode === "traditional" ? "traditional" : "quick";
  const isQuick = state.coinCastingMode === "quick";
  nodes.coinRouteQuick.hidden = !isQuick;
  nodes.coinRouteTraditional.hidden = isQuick;
  nodes.coinModeQuick.classList.toggle("active", isQuick);
  nodes.coinModeTraditional.classList.toggle("active", !isQuick);
  nodes.coinModeQuick.setAttribute("aria-pressed", isQuick ? "true" : "false");
  nodes.coinModeTraditional.setAttribute("aria-pressed", isQuick ? "false" : "true");
}

function getCoinDescriptor(value) {
  return COIN_OPTIONS.find((option) => option.value === value);
}

function coinOptionText(option) {
  if (state.language === "zh") return `${option.label} · ${option.nature}`;
  const map = {
    6: "0H/3T · Old Yin",
    7: "1H/2T · Yang",
    8: "2H/1T · Yin",
    9: "3H/0T · Old Yang",
  };
  return map[option.value] ?? String(option.value);
}

function coinChipText(value) {
  if (!value) return t("notCast");
  if (state.language === "zh") return `${getCoinDescriptor(value).symbol} ${value}`;
  return {
    6: "Changing Yin",
    7: "Yang",
    8: "Yin",
    9: "Changing Yang",
  }[value] || String(value);
}

function filledCoinLineCount() {
  return state.coinLines.filter((value) => value !== null).length;
}

function nextOpenCoinLineIndex() {
  return state.coinLines.findIndex((value) => value === null);
}

function updateCoinProgress() {
  if (!nodes.coinProgress) return;
  const count = filledCoinLineCount();
  const next = nextOpenCoinLineIndex();
  nodes.coinProgress.textContent = next === -1
    ? t("coinReady")
    : t("coinProgress", { line: String(next + 1), count: String(count) });
}

function refreshCoinActions() {
  const filled = filledCoinLineCount() === 6;
  nodes.coinAnalyze.disabled = !filled || state.isCoinCasting;
  nodes.coinClear.disabled = state.isCoinCasting;
  nodes.coinRandomize.disabled = state.isCoinCasting;
  nodes.coinSwitchTraditional.disabled = state.isCoinCasting;
}

function clearCoinError() {
  nodes.coinStep2Error.textContent = "";
  nodes.coinStep2Error.classList.add("hidden");
}

function showCoinError(message) {
  nodes.coinStep2Error.textContent = message;
  nodes.coinStep2Error.classList.remove("hidden");
  nodes.coinStep2Error.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetCoinResult() {
  state.coinResult = null;
  nodes.coinResults.classList.add("hidden");
  nodes.coinEmptyState.classList.remove("hidden");
}

function renderCoinRows() {
  nodes.coinLines.innerHTML = state.coinLines.map((value, index) => {
    const isNext = nextOpenCoinLineIndex() === index;
    return `
      <div class="line-row${isNext ? " active" : ""}" data-line-row="${index}">
        <div class="line-label">${state.language === "zh" ? `第 ${index + 1} 爻` : `Line ${index + 1}`}</div>
        <div class="line-options">
          ${COIN_OPTIONS.map((option) => `
            <button
              type="button"
              class="option-button${value === option.value ? " selected" : ""}"
              data-line-index="${index}"
              data-line-value="${option.value}"
            >${coinOptionText(option)}</button>
          `).join("")}
        </div>
        <div class="line-chip">${coinChipText(value)}</div>
      </div>
    `;
  }).join("");
  updateCoinProgress();
  refreshCoinActions();
}

function setCoinFacesByValue(value) {
  const heads = { 6: 0, 7: 1, 8: 2, 9: 3 }[value] ?? 1;
  const order = [0, 1, 2].sort(() => Math.random() - 0.5);
  nodes.coinDiscs.forEach((disc, index) => {
    disc.dataset.face = order.indexOf(index) < heads ? "yang" : "yin";
  });
}

function animateCoinStage(value) {
  setCoinFacesByValue(value);
  nodes.coinStage.classList.remove("active");
  void nodes.coinStage.offsetWidth;
  nodes.coinStage.classList.add("active");
  return new Promise((resolve) => {
    window.setTimeout(() => {
      nodes.coinStage.classList.remove("active");
      resolve();
    }, 1080);
  });
}

async function randomizeCoinCast() {
  if (state.isCoinCasting) return;
  clearCoinError();
  resetCoinResult();
  state.isCoinCasting = true;
  state.coinLines = [null, null, null, null, null, null];
  renderCoinRows();
  for (let index = 0; index < 6; index += 1) {
    const value = COIN_OPTIONS[Math.floor(Math.random() * COIN_OPTIONS.length)].value;
    await animateCoinStage(value);
    state.coinLines[index] = value;
    renderCoinRows();
  }
  state.isCoinCasting = false;
  refreshCoinActions();
  setCoinCastingMode("traditional");
  nodes.coinAnalyze.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearCoinCast() {
  state.coinLines = [null, null, null, null, null, null];
  clearCoinError();
  resetCoinResult();
  renderCoinRows();
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

function lineTransitionMeaning(lineValue, language) {
  if (language === "zh") {
    return lineValue === 6
      ? "老阴发动，表示原本偏保留的一面开始转主动，提醒你不能只等局势自己变好。"
      : "老阳发动，表示原本过于主动的一面需要转弯或收束，别把推进做成硬顶。";
  }
  return lineValue === 6
    ? "An old yin line is moving, so a passive or waiting position is turning active. Do not rely only on waiting for the field to improve."
    : "An old yang line is moving, so an overactive or forceful position needs to soften or redirect instead of pushing harder.";
}

function hexagramChangeMeaning(hexagram, language) {
  const movingCount = hexagram.movingLines.length;
  if (language === "zh") {
    if (movingCount === 0) return "无动爻，以本卦为主，重点是按看清的方向稳稳执行。";
    if (movingCount === 1) return `只有一处动爻，变化集中，重点盯住第 ${hexagram.movingLines[0]} 爻，后势会转向 ${hexagram.changedTitle}。`;
    if (movingCount <= 3) return `共有 ${movingCount} 处动爻，说明事情可以推进，但要边走边修，后势会逐步转向 ${hexagram.changedTitle}。`;
    return `动爻较多，说明局势本身就在换相，最后会化向 ${hexagram.changedTitle}，更重要的是留余地、分阶段、看反馈。`;
  }
  if (movingCount === 0) return "There are no moving lines, so the primary hexagram stays in charge. The main task is steady execution after the image becomes clear.";
  if (movingCount === 1) return `There is one moving line, so the change is concentrated around line ${hexagram.movingLines[0]}, and the later tendency turns toward ${hexagram.changedNameEn || hexagram.changedTitle}.`;
  if (movingCount <= 3) return `There are ${movingCount} moving lines, so progress is possible, but correction needs to happen along the way as the reading turns toward ${hexagram.changedNameEn || hexagram.changedTitle}.`;
  return `There are many moving lines, so the field itself is shifting phase and leans toward ${hexagram.changedNameEn || hexagram.changedTitle}. Leave margin and move in stages.`;
}
function movingLineSummary(hexagram, language) {
  if (!hexagram.movingLines.length) {
    return language === "zh"
      ? "无动爻，今天以本卦为主，没有单独突出的爻位变化。"
      : "There are no moving lines today, so the primary hexagram remains the main reference without one standout changing line.";
  }
  return hexagram.movingLines.map((position) => {
    const lineValue = hexagram.lines[position - 1];
    const detail = `${linePositionMap[position][language]} ${lineTransitionMeaning(lineValue, language)}`;
    return language === "zh" ? `第 ${position} 爻：${detail}` : `Line ${position}: ${detail}`;
  }).join("<br />");
}

const COIN_FOCUS_META = {
  self: {
    label: { zh: "自身处境 / 综合判断", en: "personal situation / general outlook" },
    useful: { zh: "世爻", en: "the Self line" },
  },
  wealth: {
    label: { zh: "求财、交易、男问感情", en: "money, trade, or a male love inquiry" },
    useful: { zh: "妻财", en: "Wealth" },
  },
  authority: {
    label: { zh: "工作、职位、女问感情", en: "career, position, or a female love inquiry" },
    useful: { zh: "官鬼", en: "Officer" },
  },
  parent: {
    label: { zh: "文书、考试、房产、父母长辈", en: "documents, exams, housing, or parents" },
    useful: { zh: "父母", en: "Parent" },
  },
  child: {
    label: { zh: "子女、怀孕、医药、解除忧患", en: "children, pregnancy, healing, or relief" },
    useful: { zh: "子孙", en: "Child" },
  },
  sibling: {
    label: { zh: "朋友、合伙、竞争、兄弟姐妹", en: "friends, partnership, competition, or siblings" },
    useful: { zh: "兄弟", en: "Sibling" },
  },
};

function focusLabels(language) {
  return Object.fromEntries(
    Object.entries(COIN_FOCUS_META).map(([key, value]) => [key, value.label[language]]),
  );
}

function focusQuestionFit(focus, movingCount, language) {
  const map = {
    zh: {
      self: movingCount ? "放回你自己的处境上，不要一下子同时处理所有变量，先抓住最牵动局面的那一步。" : "放回你自己的处境上，先沿着同一条主线继续看，不必急着换问法。",
      wealth: movingCount ? "放回求财、交易或男问感情上，先看这一步值不值得动，再看能不能拿到手。" : "放回求财、交易或男问感情上，更适合稳守、复核条件和保留退路。",
      authority: movingCount ? "放回工作、职位或女问感情上，先看对方态度、规则压力和关键节点，再决定推进速度。" : "放回工作、职位或女问感情上，宜先守住秩序和分寸，不必急着抢进度。",
      parent: movingCount ? "放回文书、考试、房产或父母长辈上，要先核对流程、消息和纸面条件，再决定下一步。" : "放回文书、考试、房产或父母长辈上，更适合按规矩走、把细节查实。",
      child: movingCount ? "放回子女、怀孕、医药或解除忧患上，先看问题有没有缓下来，再决定是否继续加力。" : "放回子女、怀孕、医药或解除忧患上，更适合先养、先缓、先护住。",
      sibling: movingCount ? "放回朋友、合伙、竞争或兄弟姐妹上，先分清谁站在哪边，再决定怎么配合或防范。" : "放回朋友、合伙、竞争或兄弟姐妹上，更适合先分清边界与角色，不宜过早绑定。",
    },
    en: {
      self: movingCount ? "Applied to your own situation, do not try to solve every variable at once. First identify the one move that shifts the field most." : "Applied to your own situation, stay with the same main thread for now instead of changing your question too quickly.",
      wealth: movingCount ? "Applied to money, trade, or a male love inquiry, first judge whether this move is worth making before asking how much it can bring in." : "Applied to money, trade, or a male love inquiry, this favors steady review, clear terms, and leaving yourself a fallback path.",
      authority: movingCount ? "Applied to career, position, or a female love inquiry, first read the other side, the pressure of rules, and the key turning point before pushing." : "Applied to career, position, or a female love inquiry, it is better to keep order and proportion than to force speed.",
      parent: movingCount ? "Applied to documents, exams, housing, or parents, verify the process, the message, and the formal conditions before the next move." : "Applied to documents, exams, housing, or parents, this favors procedure, paperwork, and checking details carefully.",
      child: movingCount ? "Applied to children, pregnancy, healing, or relief, first see whether the pressure is easing before adding more effort." : "Applied to children, pregnancy, healing, or relief, this favors protecting, easing, and recovering before pushing.",
      sibling: movingCount ? "Applied to friends, partnership, competition, or siblings, first sort out who stands where before deciding how to cooperate or defend." : "Applied to friends, partnership, competition, or siblings, this favors clear role boundaries before early commitment.",
    },
  };
  return map[language][focus];
}

function coinQuestionLead(focus, language) {
  const meta = COIN_FOCUS_META[focus] || COIN_FOCUS_META.self;
  return language === "zh"
    ? `这类问题在六爻里，通常先取${meta.useful.zh}为用神来观察。`
    : `In six-line reading, this type of question is usually read by taking ${meta.useful.en} as the useful line first.`;
}

function coinCurrentSituationText(hexagram, focus, language) {
  const upperText = trigramFocusMeaning(hexagram.upper.key, focus, language, language === "zh" ? "外在" : "Outer");
  const lowerText = trigramFocusMeaning(hexagram.lower.key, focus, language, language === "zh" ? "内在" : "Inner");
  return language === "zh"
    ? `${upperText} ${lowerText} 先按这个现状来读，比急着问吉凶更重要。`
    : `${upperText} ${lowerText} Read the present field through that lens before jumping straight to a yes-or-no answer.`;
}

function coinDirectionText(hexagram, focus, language) {
  const changedTheme = language === "zh"
    ? `${hexagram.changedTitle}的主旨是：${hexagram.changedJudgmentZh || hexagram.changedReading}`
    : `The changed hexagram is ${hexagram.changedNameEn || hexagram.changedTitle}: ${hexagram.changedJudgmentEn || hexagram.changedReading}`;
  return `${hexagramChangeMeaning(hexagram, language)} ${changedTheme}`;
}

function usefulSummaryText(useful, language) {
  if (!useful) {
    return language === "zh" ? "这一层用神与世应还未接上。" : "The useful-line layer is not connected yet.";
  }

  const line = useful.usefulLine;
  const relationText = language === "zh" ? useful.usefulToShi?.labelZh : useful.usefulToShi?.labelEn;
  const responseHint = line?.isYing
    ? (language === "zh" ? " 用神临应，这件事的门槛更多在对方或外部。" : " The useful line sits on the Response line, so the gate is held more by the other side or by outer conditions.")
    : line?.isShi
      ? (language === "zh" ? " 用神临世，这件事更多还看你自己能不能把关键一步拿住。" : " The useful line sits on the Self line, so the matter depends more on whether you can hold the key move yourself.")
      : "";

  return language === "zh"
    ? `${useful.status.summaryZh}${relationText ? ` ${relationText}。` : ""}${responseHint}`
    : `${useful.status.summaryEn}${relationText ? ` ${relationText}.` : ""}${responseHint}`;
}

function usefulAdviceText(useful, language) {
  if (!useful?.usefulLine) {
    return language === "zh"
      ? "先别急着催结果，继续观察哪一边先动、哪一边先松。"
      : "Do not force an outcome yet. Keep watching which side moves first and which side loosens first.";
  }

  const line = useful.usefulLine;
  const relationKey = useful.usefulToShi?.key;

  if (language === "zh") {
    if (line.isYing) return "先看对方或外部条件有没有松口，再决定要不要继续推。";
    if (relationKey === "targetControlsActor") return "先减压、先避硬碰，等局面松一点再谈推进。";
    if (relationKey === "actorControlsTarget") return "主动权还在你手里，但要讲方法，先把最关键的一步做实。";
    if (relationKey === "actorGeneratesTarget") return "这件事更像你在主动投入，别一边喂它一边催它马上回报。";
    if (relationKey === "targetGeneratesActor") return "这件事对你还有回气之力，可以顺势接住，不必过分用蛮劲。";
    if (line.isMoving) return `关键变化落在第${line.position}爻，宜边做边看反馈，不要一次把话说满。`;
    return "先把用神这一侧稳住，再看要不要扩大动作；现在更怕乱改节奏。";
  }

  if (line.isYing) return "Watch for the other side or outer conditions to loosen first before deciding how hard to push.";
  if (relationKey === "targetControlsActor") return "Reduce pressure first and avoid a head-on push until the field softens.";
  if (relationKey === "actorControlsTarget") return "Leverage is still on your side, but it needs method. Make the key move concrete before doing more.";
  if (relationKey === "actorGeneratesTarget") return "You are feeding the matter more than the matter is feeding you, so do not overinvest while demanding instant return.";
  if (relationKey === "targetGeneratesActor") return "The matter still gives something back to you, so receive that support and avoid using unnecessary force.";
  if (line.isMoving) return `The key change sits on line ${line.position}, so move in stages and read feedback before saying too much.`;
  return "Stabilize the useful-line side first, then decide whether to expand. The bigger risk now is changing rhythm too often.";
}

function trigramFocusMeaning(trigramKey, focus, language, positionLabel) {
  const map = {
    zh: {
      qian: { self: `${positionLabel}乾，主主动、拍板与发起，放回你自己的处境上，就是先定主意。`, wealth: `${positionLabel}乾，求财、交易或男问感情时，更强调主动谈条件与快速判断。`, authority: `${positionLabel}乾，工作、职位或女问感情时，更强调立场、决定权与谁来定调。`, parent: `${positionLabel}乾，文书、考试、房产或父母长辈之事，重点是按标准拍板，不宜拖。`, child: `${positionLabel}乾，子女、怀孕、医药或解忧之事，容易想立刻见效，要防用力过猛。`, sibling: `${positionLabel}乾，朋友、合伙、竞争或兄弟姐妹之事，容易出现谁说了算的问题。` },
      kun: { self: `${positionLabel}坤，主承接、配合与稳定，放回你自己的处境上，就是先稳住局面。`, wealth: `${positionLabel}坤，求财、交易或男问感情时，更宜稳守、慢看条件。`, authority: `${positionLabel}坤，工作、职位或女问感情时，更适合先接住压力与现实安排。`, parent: `${positionLabel}坤，文书、考试、房产或父母长辈之事，更重手续、照料与耐心。`, child: `${positionLabel}坤，子女、怀孕、医药或解忧之事，更强调养、护与持续观察。`, sibling: `${positionLabel}坤，朋友、合伙、竞争或兄弟姐妹之事，更看配合度而非抢先。` },
      zhen: { self: `${positionLabel}震，主起动与变化来得快，放回你自己的处境上，就是关键看第一步。`, wealth: `${positionLabel}震，求财、交易或男问感情时，容易一时冲动出手。`, authority: `${positionLabel}震，工作、职位或女问感情时，局面会被突然推动，先看谁先动。`, parent: `${positionLabel}震，文书、考试、房产或父母长辈之事，往往先有消息或变动冒出来。`, child: `${positionLabel}震，子女、怀孕、医药或解忧之事，重点是别被一时反应带着跑。`, sibling: `${positionLabel}震，朋友、合伙、竞争或兄弟姐妹之事，容易先起摩擦或抢位。` },
      xun: { self: `${positionLabel}巽，主沟通、渗透与影响，放回你自己的处境上，就是先谈清楚。`, wealth: `${positionLabel}巽，求财、交易或男问感情时，更适合比价、协商和慢慢推进。`, authority: `${positionLabel}巽，工作、职位或女问感情时，更看谈法、写法与影响力。`, parent: `${positionLabel}巽，文书、考试、房产或父母长辈之事，往往要靠信息往来与细节沟通。`, child: `${positionLabel}巽，子女、怀孕、医药或解忧之事，更适合温和调整，不宜猛改。`, sibling: `${positionLabel}巽，朋友、合伙、竞争或兄弟姐妹之事，更看怎么谈边界与分工。` },
      kan: { self: `${positionLabel}坎，主变量、暗处与风险，放回你自己的处境上，就是先查清再动。`, wealth: `${positionLabel}坎，求财、交易或男问感情时，要防信息不清、账没算透。`, authority: `${positionLabel}坎，工作、职位或女问感情时，更像有压力、顾虑或隐藏变量。`, parent: `${positionLabel}坎，文书、考试、房产或父母长辈之事，要先核实消息和实际风险。`, child: `${positionLabel}坎，子女、怀孕、医药或解忧之事，更像在消耗神气，先求稳。`, sibling: `${positionLabel}坎，朋友、合伙、竞争或兄弟姐妹之事，要防口头说法和真实立场不一致。` },
      li: { self: `${positionLabel}离，主看见、表达与曝光，放回你自己的处境上，就是先把事情看明。`, wealth: `${positionLabel}离，求财、交易或男问感情时，容易被表面条件吸引，要防看得太亮却不够实。`, authority: `${positionLabel}离，工作、职位或女问感情时，更适合展示、说明和公开表达。`, parent: `${positionLabel}离，文书、考试、房产或父母长辈之事，更看文字、条款和是否白纸黑字说清。`, child: `${positionLabel}离，子女、怀孕、医药或解忧之事，要防过热、过急或精神太绷。`, sibling: `${positionLabel}离，朋友、合伙、竞争或兄弟姐妹之事，容易因为说得太直而起火。` },
      gen: { self: `${positionLabel}艮，主收口、边界与暂停，放回你自己的处境上，就是先停一下、看清边界。`, wealth: `${positionLabel}艮，求财、交易或男问感情时，有时停手比出手更重要。`, authority: `${positionLabel}艮，工作、职位或女问感情时，更适合控范围、先收束。`, parent: `${positionLabel}艮，文书、考试、房产或父母长辈之事，适合回头核对、补漏、立规矩。`, child: `${positionLabel}艮，子女、怀孕、医药或解忧之事，更强调减负与静养。`, sibling: `${positionLabel}艮，朋友、合伙、竞争或兄弟姐妹之事，关键是先分清边界和责任。` },
      dui: { self: `${positionLabel}兑，主交流、反馈与情绪氛围，放回你自己的处境上，就是先看互动给你的回音。`, wealth: `${positionLabel}兑，求财、交易或男问感情时，要防被情绪、舒适感和场面话带偏。`, authority: `${positionLabel}兑，工作、职位或女问感情时，更适合通过对话和反馈来推进。`, parent: `${positionLabel}兑，文书、考试、房产或父母长辈之事，更看回应、消息与口头往来。`, child: `${positionLabel}兑，子女、怀孕、医药或解忧之事，要留意情绪起伏对恢复的影响。`, sibling: `${positionLabel}兑，朋友、合伙、竞争或兄弟姐妹之事，互动强，但也最容易说多。` },
    },
    en: {
      qian: { self: `${positionLabel} trigram is Heaven, so the tone is initiative and decisive movement; read back to your own situation, it asks you to take a clear position first.`, wealth: `${positionLabel} trigram is Heaven, so money, trade, or a male love inquiry leans toward active terms and quicker judgment.`, authority: `${positionLabel} trigram is Heaven, so career, position, or a female love inquiry leans toward authority, stance, and who sets the tone.`, parent: `${positionLabel} trigram is Heaven, so documents, exams, housing, or parents are read through standards, formal judgment, and not delaying the decision.`, child: `${positionLabel} trigram is Heaven, so children, pregnancy, healing, or relief can become over-forced if you demand immediate results.`, sibling: `${positionLabel} trigram is Heaven, so friends, partnership, competition, or siblings can turn into a question of who leads.` },
      kun: { self: `${positionLabel} trigram is Earth, so the tone is support, coordination, and steadiness; read back to your own situation, it says stabilize first.`, wealth: `${positionLabel} trigram is Earth, so money, trade, or a male love inquiry favors patience, preservation, and slow review.`, authority: `${positionLabel} trigram is Earth, so career, position, or a female love inquiry asks you to receive the pressure of reality before pushing it.`, parent: `${positionLabel} trigram is Earth, so documents, exams, housing, or parents emphasize procedure, care, and patience.`, child: `${positionLabel} trigram is Earth, so children, pregnancy, healing, or relief favor protection, nourishment, and continued observation.`, sibling: `${positionLabel} trigram is Earth, so friends, partnership, competition, or siblings are more about cooperation than racing ahead.` },
      zhen: { self: `${positionLabel} trigram is Thunder, so the field starts moving quickly; read back to your own situation, the first move matters most.`, wealth: `${positionLabel} trigram is Thunder, so money, trade, or a male love inquiry carries a risk of impulsive action.`, authority: `${positionLabel} trigram is Thunder, so career, position, or a female love inquiry may be pushed suddenly, and the first mover matters.`, parent: `${positionLabel} trigram is Thunder, so documents, exams, housing, or parents often begin with a message or change breaking through.`, child: `${positionLabel} trigram is Thunder, so children, pregnancy, healing, or relief should not be driven by a momentary reaction.`, sibling: `${positionLabel} trigram is Thunder, so friends, partnership, competition, or siblings can flare into friction or a scramble for position.` },
      xun: { self: `${positionLabel} trigram is Wind, so outcomes shift through communication and subtle influence; read back to your own situation, talk it through first.`, wealth: `${positionLabel} trigram is Wind, so money, trade, or a male love inquiry benefits from comparison, negotiation, and gradual movement.`, authority: `${positionLabel} trigram is Wind, so career, position, or a female love inquiry is shaped by wording, writing, and influence.`, parent: `${positionLabel} trigram is Wind, so documents, exams, housing, or parents depend on information flow and detailed communication.`, child: `${positionLabel} trigram is Wind, so children, pregnancy, healing, or relief respond better to lighter adjustment than dramatic change.`, sibling: `${positionLabel} trigram is Wind, so friends, partnership, competition, or siblings depend on how roles and boundaries are talked through.` },
      kan: { self: `${positionLabel} trigram is Water, which points to uncertainty and hidden variables; read back to your own situation, investigate before moving.`, wealth: `${positionLabel} trigram is Water, so money, trade, or a male love inquiry warns against opaque terms and unclear arithmetic.`, authority: `${positionLabel} trigram is Water, so career, position, or a female love inquiry carries pressure, caution, or hidden variables.`, parent: `${positionLabel} trigram is Water, so documents, exams, housing, or parents need facts checked before trust.`, child: `${positionLabel} trigram is Water, so children, pregnancy, healing, or relief may feel draining and should be handled steadily.`, sibling: `${positionLabel} trigram is Water, so friends, partnership, competition, or siblings may say one thing while standing somewhere else.` },
      li: { self: `${positionLabel} trigram is Fire, which brings visibility and expression; read back to your own situation, first make the matter clearer.`, wealth: `${positionLabel} trigram is Fire, so money, trade, or a male love inquiry can be pulled by surface appeal and bright presentation.`, authority: `${positionLabel} trigram is Fire, so career, position, or a female love inquiry favors showing, presenting, and speaking plainly.`, parent: `${positionLabel} trigram is Fire, so documents, exams, housing, or parents turn on written terms, stated conditions, and whether things are clearly spelled out.`, child: `${positionLabel} trigram is Fire, so children, pregnancy, healing, or relief can become overheated or rushed.`, sibling: `${positionLabel} trigram is Fire, so friends, partnership, competition, or siblings can ignite through overly direct speech.` },
      gen: { self: `${positionLabel} trigram is Mountain, so boundaries and stopping points matter; read back to your own situation, pause and find the line first.`, wealth: `${positionLabel} trigram is Mountain, so money, trade, or a male love inquiry may be better served by not moving yet.`, authority: `${positionLabel} trigram is Mountain, so career, position, or a female love inquiry favors narrowing scope and holding the line.`, parent: `${positionLabel} trigram is Mountain, so documents, exams, housing, or parents favor review, patching gaps, and clear rules.`, child: `${positionLabel} trigram is Mountain, so children, pregnancy, healing, or relief call for reduced load and quiet recovery.`, sibling: `${positionLabel} trigram is Mountain, so friends, partnership, competition, or siblings hinge on clear boundaries and responsibilities.` },
      dui: { self: `${positionLabel} trigram is Lake, so exchange, feedback, and emotional tone shape the field; read back to your own situation, listen to the response you are getting.`, wealth: `${positionLabel} trigram is Lake, so money, trade, or a male love inquiry can be swayed by comfort, mood, and pleasant talk.`, authority: `${positionLabel} trigram is Lake, so career, position, or a female love inquiry moves better through dialogue and feedback.`, parent: `${positionLabel} trigram is Lake, so documents, exams, housing, or parents depend on response, updates, and spoken exchange.`, child: `${positionLabel} trigram is Lake, so children, pregnancy, healing, or relief are sensitive to emotional fluctuations.`, sibling: `${positionLabel} trigram is Lake, so friends, partnership, competition, or siblings become highly interactive, but also easier to overtalk.` },
    },
  };
  return map[language][trigramKey]?.[focus] || map[language][trigramKey]?.self || "";
}

function buildCoinReading(lines, focus) {
  const hexagram = buildHexagram(lines);
  const transitDate = todayInTimezone(DEFAULT_TIMEZONE);
  const selfLine = analyzeHexagramSelfLine(hexagram, transitDate, DEFAULT_TIMEZONE);
  const usefulLineAnalysis = analyzeHexagramUsefulLine(hexagram, focus, transitDate, DEFAULT_TIMEZONE);
  const score = clamp(Math.round(60 + hexagram.score + (6 - hexagram.movingLines.length) * 3), 28, 96);
  const language = state.language;
  const summary = usefulSummaryText(usefulLineAnalysis, language);
  const focusText = usefulAdviceText(usefulLineAnalysis, language);
  return {
    score,
    tier: scoreTierText(score, language),
    hexagram,
    selfLine,
    usefulLineAnalysis,
    summary,
    focusText,
  };
}

function renderCoinResult(reading) {
  state.coinResult = reading;
  nodes.coinEmptyState.classList.add("hidden");
  nodes.coinResults.classList.remove("hidden");
  nodes.coinResults.classList.remove("entering");
  void nodes.coinResults.offsetWidth;
  nodes.coinResults.classList.add("entering");
  nodes.coinScoreValue.textContent = String(reading.score);
  nodes.coinScoreTier.textContent = reading.tier;
  nodes.coinSelfCard.innerHTML = renderSelfLineCard(reading);
  nodes.coinUsefulCard.innerHTML = renderUsefulLineCard(reading);
  nodes.coinSummaryText.innerHTML = renderParagraph(reading.summary);
  nodes.coinFocusText.innerHTML = renderParagraph(reading.focusText);
  nodes.coinHexagramCard.innerHTML = renderDetailGrid([
    { label: state.language === "zh" ? "本卦" : "Primary Hexagram", value: state.language === "zh" ? `${reading.hexagram.title} · ${reading.hexagram.trigramTitleZh}` : `${reading.hexagram.nameEn} · ${hexagramName(reading.hexagram.upper, reading.hexagram.lower, "en")}` },
    { label: state.language === "zh" ? "卦象主旨" : "Main Theme", value: state.language === "zh" ? (reading.hexagram.judgmentZh || reading.hexagram.reading) : (reading.hexagram.judgmentEn || reading.hexagram.reading) },
    { label: state.language === "zh" ? "当前局面怎么读" : "How To Read The Current Field", value: coinCurrentSituationText(reading.hexagram, nodes.coinFocus.value, state.language) },
  ]);
  nodes.coinChangeCard.innerHTML = renderDetailGrid([
    { label: state.language === "zh" ? "变卦" : "Changed Hexagram", value: state.language === "zh" ? `${reading.hexagram.changedTitle} · ${reading.hexagram.changedTrigramTitleZh}` : `${reading.hexagram.changedNameEn} · ${hexagramName(reading.hexagram.changedUpper, reading.hexagram.changedLower, "en")}` },
    { label: state.language === "zh" ? "变化信号" : "Direction Of Change", value: coinDirectionText(reading.hexagram, nodes.coinFocus.value, state.language) },
  ]);
  nodes.coinLinesCard.innerHTML = renderParagraph(movingLineSummary(reading.hexagram, state.language));
  coinResultsPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function analyzeCoin() {
  clearCoinError();
  if (filledCoinLineCount() < 6) {
    showCoinError(t("coinMissing"));
    return;
  }
  renderCoinResult(buildCoinReading(state.coinLines, nodes.coinFocus.value));
}

function normalizeBirthDate(value) {
  const raw = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : "";
}

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function normalizeBirthTime(value) {
  const match = String(value || "").trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return "12:00";
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return "12:00";
  return `${padDatePart(hour)}:${padDatePart(minute)}`;
}

function decomposeBirthTime(value) {
  const normalized = normalizeBirthTime(value);
  const [hourRaw, minuteRaw] = normalized.split(":");
  const hour24 = Number(hourRaw);
  const minute = Number(minuteRaw);
  return {
    hour12: String(hour24 % 12 || 12),
    minute: padDatePart(minute),
    meridiem: hour24 >= 12 ? "pm" : "am",
  };
}

function composeBaziBirthTimeFromControls() {
  const hour12 = Number(nodes.baziBirthTimeHour.value || 12);
  const minute = Number(nodes.baziBirthTimeMinute.value || 0);
  const meridiem = nodes.baziBirthTimeMeridiem.value === "pm" ? "pm" : "am";
  const safeHour = hour12 >= 1 && hour12 <= 12 ? hour12 : 12;
  const hour24 = meridiem === "pm" ? (safeHour % 12) + 12 : safeHour % 12;
  return `${padDatePart(hour24)}:${padDatePart(minute)}`;
}

function syncBaziBirthTimeValue() {
  nodes.baziBirthTime.value = composeBaziBirthTimeFromControls();
}

function populateBaziTimeControls() {
  const current = decomposeBirthTime(nodes.baziBirthTime.value || "12:00");
  const meridiemLabels = state.language === "zh" ? { am: "上午", pm: "下午" } : { am: "AM", pm: "PM" };
  nodes.baziBirthTimeHour.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const hour = String(index + 1);
    return `<option value="${hour}">${padDatePart(hour)}</option>`;
  }).join("");
  nodes.baziBirthTimeMinute.innerHTML = Array.from({ length: 60 }, (_, index) => {
    const minute = padDatePart(index);
    return `<option value="${minute}">${minute}</option>`;
  }).join("");
  nodes.baziBirthTimeMeridiem.innerHTML = `<option value="am">${meridiemLabels.am}</option><option value="pm">${meridiemLabels.pm}</option>`;
  nodes.baziBirthTimeHour.value = current.hour12;
  nodes.baziBirthTimeMinute.value = current.minute;
  nodes.baziBirthTimeMeridiem.value = current.meridiem;
  syncBaziBirthTimeValue();
}

function formatBirthDateDigits(rawValue) {
  const digits = String(rawValue || "").replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseBirthDateInput(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return "";
  const isoValue = normalizeBirthDate(value);
  if (isoValue) return isoValue;
  const slashMatch = value.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (!slashMatch) return "";
  const [, monthRaw, dayRaw, yearRaw] = slashMatch;
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const year = Number(yearRaw);
  const test = new Date(year, month - 1, day, 12, 0, 0);
  if (Number.isNaN(test.getTime()) || test.getFullYear() !== year || test.getMonth() !== month - 1 || test.getDate() !== day) return "";
  return `${year}-${padDatePart(month)}-${padDatePart(day)}`;
}

function isoToUsDate(isoDate) {
  const normalized = normalizeBirthDate(isoDate);
  if (!normalized) return "";
  const [year, month, day] = normalized.split("-");
  return `${month}/${day}/${year}`;
}

function setBaziBirthDateDisplay(value) {
  const iso = parseBirthDateInput(value);
  nodes.baziBirthDate.value = iso ? isoToUsDate(iso) : "";
  nodes.baziBirthDatePicker.value = iso;
}

function getBaziBirthDateIso() {
  const typedValue = String(nodes.baziBirthDate.value || "").trim();
  if (typedValue) return parseBirthDateInput(typedValue);
  return normalizeBirthDate(nodes.baziBirthDatePicker.value || "");
}

function openBaziBirthDatePicker() {
  if (typeof nodes.baziBirthDatePicker.showPicker === "function") {
    try {
      nodes.baziBirthDatePicker.showPicker();
      return;
    } catch {
      // ignore and fall through
    }
  }
  nodes.baziBirthDatePicker.focus();
  nodes.baziBirthDatePicker.click();
}

function clearBaziError() {
  nodes.baziStep1Error.textContent = "";
  nodes.baziStep1Error.classList.add("hidden");
}

function showBaziError(message) {
  nodes.baziStep1Error.textContent = message;
  nodes.baziStep1Error.classList.remove("hidden");
  nodes.baziStep1Error.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetBaziResult() {
  state.baziResult = null;
  nodes.baziResults.classList.add("hidden");
  nodes.baziEmptyState.classList.remove("hidden");
}
function relationMeaning(relation, language) {
  const map = {
    zh: {
      比肩: "今天更强调自我主张、独立处理和按自己的节奏推进。",
      劫财: "今天容易出现资源分散、竞争感上升或被别人打乱节奏。",
      食神: "今天适合输出想法、做表达和顺势推进。",
      伤官: "今天判断会更锋利，也更容易不耐烦。",
      偏财: "今天更容易看到机会、资源流动和外部人脉带来的空间。",
      正财: "今天更适合务实处理钱、项目、责任和可落地的安排。",
      七杀: "今天压力和任务感会更强，适合迎难而上，但不宜硬撑过头。",
      正官: "今天更适合讲秩序、讲规范、讲责任，也适合稳妥推进正式事务。",
      偏印: "今天更适合独立思考、吸收信息、调整策略。",
      正印: "今天更适合补状态、找支持、先稳后动。",
    },
    en: {
      比肩: "Today emphasizes self-direction, independent action, and moving at your own pace.",
      劫财: "Today can scatter resources or let other people disrupt your rhythm.",
      食神: "Today supports output, expression, and moving forward more naturally.",
      伤官: "Today sharpens judgment, but it can also make you impatient or too blunt.",
      偏财: "Today makes opportunities, networks, and resource flow easier to notice and use.",
      正财: "Today is better for practical money matters, concrete tasks, and grounded execution.",
      七杀: "Today brings more pressure and demand, so it favors courage and decisive action, but not overstraining.",
      正官: "Today supports order, structure, accountability, and steady progress.",
      偏印: "Today is better for independent thinking, absorbing information, and strategy shifts.",
      正印: "Today supports recovery, preparation, support systems, and stabilizing before action.",
    },
  };
  return map[language][relation] || (language === "zh" ? "今天的主题会围绕这个关系展开。" : "This relation becomes one of today's main themes.");
}

function coreThemeCopy(relation, language) {
  const map = {
    zh: {
      比肩: "今天的主轴是按自己的节奏推进。适合独立处理，但也别太固执。",
      劫财: "今天的主轴是资源分配和边界感。先守住重点，再决定哪里值得投入。",
      食神: "今天的主轴是自然表达和顺势推进。把想法讲清、把东西做出来，会比硬推结果更有效。",
      伤官: "今天的主轴是判断和表达都变锋利。适合提出观点，但别把话说太满。",
      偏财: "今天的主轴是外部机会和信息流动。要留意机会，但不要因为一时感觉就立刻出手。",
      正财: "今天的主轴是务实落地。更适合处理钱、责任、进度和手头该完成的事。",
      七杀: "今天的主轴是压力下的决断。重点是稳准，不是逞强。",
      正官: "今天的主轴是秩序、责任和稳妥推进。今天更适合按规则办事。",
      偏印: "今天的主轴是先想清楚再行动。适合吸收信息、调整策略、重新看局。",
      正印: "今天的主轴是恢复、准备和补状态。先把自己稳住，后面的推进才会更顺。",
    },
    en: {
      比肩: "Today's core theme is moving at your own pace. It supports independent action, but it helps to stay flexible.",
      劫财: "Today's core theme is resource management and boundaries. Protect the main priority before spreading yourself wider.",
      食神: "Today's core theme is natural expression and smooth forward movement. Clear communication and visible output will work better than forcing the result.",
      伤官: "Today's core theme is sharper judgment and sharper expression. It is a good day to name the issue clearly, but not to push too hard.",
      偏财: "Today's core theme is outside opportunity and moving information. Stay alert to openings, but do not act too fast on first excitement alone.",
      正财: "Today's core theme is practical follow-through. It favors money matters, responsibility, timing, and finishing what is already in your hands.",
      七杀: "Today's core theme is decisive action under pressure. The goal is steady precision, not proving toughness.",
      正官: "Today's core theme is order, responsibility, and steady progress. It is better to work with structure than to improvise too much.",
      偏印: "Today's core theme is reflection before action. It supports rethinking strategy, as long as thought still turns into action.",
      正印: "Today's core theme is recovery, preparation, and support. Stabilize yourself first and the rest becomes easier to carry.",
    },
  };
  return map[language][relation] || (language === "zh" ? "今天的主轴是先读清局势，再决定怎么推进。" : "Today's core theme is reading the situation clearly before deciding how to move.");
}

function climateMeaningText(result, language) {
  const note = language === "zh" ? result.climate.note : toEnglish(result.climate.note);
  const needList = formatList(result.climate.primary?.length ? result.climate.primary.map((element) => elementLabel(element)) : result.climate.needed?.map((element) => elementLabel(element)) || []);
  return language === "zh"
    ? `调候显示“${note}”，说明今天最关键的不是猛推，而是先把状态拉回可用的位置。当前更需要补足 ${needList}。`
    : `The climate reads as "${note}," which means the key is not raw force but bringing the day back into usable balance. The chart currently asks for more ${needList}.`;
}

function climateActionLine(result, language) {
  const firstNeed = result.climate.primary?.[0] || result.climate.needed?.[0];
  if (!firstNeed) return language === "zh" ? "今天不需要刻意补某一边，重点是边走边看。" : "Today does not require heavy compensation in one direction; it is better to adjust as real conditions unfold.";
  const actionMap = {
    zh: { wood: "启动、扩展、沟通", fire: "表达、展示、加温", earth: "落实、整理、稳住", metal: "判断、取舍、定规则", water: "观察、缓冲、保留弹性" },
    en: { wood: "starting, expanding, and opening new directions", fire: "expression, visibility, and warming the field", earth: "grounding, organizing, and stabilizing", metal: "judgment, prioritizing, and setting rules", water: "observing, softening, and keeping flexibility" },
  };
  return language === "zh"
    ? `落到行动上，今天更适合用“${actionMap.zh[firstNeed]}”这种方式来补位。`
    : `In practical terms, today works better when you lean into ${actionMap.en[firstNeed]}.`;
}

function pillarDisplayLabel(pillar, language) {
  if (!pillar) return "";
  if (language === "zh") return pillar.label;
  return `${stemEnglishMap[pillar.stem?.key] || pillar.stem?.label || ""} ${branchEnglishMap[pillar.branch?.key] || pillar.branch?.label || ""}`.trim() || pillar.label;
}

function formatLuckAge(age, language) {
  const rounded = Number(age).toFixed(1);
  return language === "zh" ? `${rounded} 岁` : `${rounded} yrs`;
}

function renderLuckTimeline(items, type) {
  return `<div class="timeline-list">${items.map((item) => {
    const main = type === "dayun"
      ? pillarDisplayLabel(item.pillar, state.language)
      : `${item.solarYear} · ${pillarDisplayLabel(item.pillar, state.language)}`;
    const meta = type === "dayun"
      ? `${formatLuckAge(item.startAge, state.language)} - ${formatLuckAge(item.endAge, state.language)}`
      : String(item.solarYear);
    const relation = state.language === "zh" ? item.relation : toEnglish(item.relation);
    return `<article class="timeline-item${item.active ? " active" : ""}"><div class="timeline-main">${main}</div><div class="timeline-meta">${meta}</div><div class="timeline-relation">${relation}</div></article>`;
  }).join("")}</div>`;
}

function renderBaziStructure(result) {
  const primaryNeed = result.climate.primary?.length ? formatList(result.climate.primary.map((element) => elementLabel(element))) : (state.language === "zh" ? "无明显主取" : "No clear primary need");
  const secondaryNeed = result.climate.secondary?.length ? formatList(result.climate.secondary.map((element) => elementLabel(element))) : (state.language === "zh" ? "按原局再议" : "Context-based");
  return renderDetailGrid(state.language === "zh"
    ? [
      { label: "日主强弱", value: `${result.structure.strengthTier || result.structure.strengthLabel}（${result.structure.strengthScore.toFixed(1)}）` },
      { label: "月令主气", value: `${elementLabel(result.structure.seasonElement)} / ${result.structure.seasonPhase || "平"}` },
      { label: "调候判断", value: `${result.climate.note} · ${result.climate.bias}` },
      { label: "主需元素", value: primaryNeed },
      { label: "辅需元素", value: secondaryNeed },
      { label: "当前偏宜", value: formatList(result.structure.favorableElements.map((element) => elementLabel(element))) },
      { label: "当前偏忌", value: formatList(result.structure.unfavorableElements.map((element) => elementLabel(element))) },
      { label: "格局倾向", value: result.pattern.name },
    ]
    : [
      { label: "Strength", value: `${toEnglish(result.structure.strengthTier || result.structure.strengthLabel)} (${result.structure.strengthScore.toFixed(1)})` },
      { label: "Month Command", value: `${elementLabel(result.structure.seasonElement)} / ${toEnglish(result.structure.seasonPhase || "平")}` },
      { label: "Climate", value: `${toEnglish(result.climate.note)} · ${toEnglish(result.climate.bias)}` },
      { label: "Primary Need", value: primaryNeed },
      { label: "Secondary Need", value: secondaryNeed },
      { label: "Favorable", value: formatList(result.structure.favorableElements.map((element) => elementLabel(element))) },
      { label: "Avoid", value: formatList(result.structure.unfavorableElements.map((element) => elementLabel(element))) },
      { label: "Pattern", value: toEnglish(result.pattern.name) },
    ]);
}

function renderBaziLuck(result) {
  const luckCycle = result.luckCycle;
  if (!luckCycle) return renderParagraph(state.language === "zh" ? "当前没有足够的大运信息。" : "No luck-cycle context is available right now.");
  const referenceDate = new Date(`${luckCycle.referenceTerm.isoDate}T12:00:00`);
  const referenceLabel = state.language === "zh"
    ? `${luckCycle.referenceTerm.name} · ${luckCycle.referenceTerm.dateLabel}`
    : `${luckCycle.referenceTerm.name} · ${new Intl.DateTimeFormat("en-US", {
      timeZone: DEFAULT_TIMEZONE,
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(referenceDate)}`;
  const overview = renderDetailGrid(state.language === "zh"
    ? [
      { label: "顺逆行", value: `${luckCycle.directionLabel}（按年干阴阳与性别推）` },
      { label: "参考节气", value: referenceLabel },
      { label: "起运时间", value: luckCycle.startText },
      { label: "当前年龄", value: formatLuckAge(luckCycle.analysisAge, "zh") },
      { label: "当前大运", value: `${luckCycle.currentDaYun.label} · ${luckCycle.currentDaYun.relation}` },
      { label: "当前流年", value: `${luckCycle.currentAnnual.label} · ${luckCycle.currentAnnual.relation}` },
    ]
    : [
      { label: "Direction", value: toEnglish(luckCycle.directionLabel) },
      { label: "Reference Solar Term", value: referenceLabel },
      { label: "Luck Start", value: `Starts around age ${luckCycle.startAge}` },
      { label: "Current Age", value: formatLuckAge(luckCycle.analysisAge, "en") },
      { label: "Current Da Yun", value: `${pillarDisplayLabel(luckCycle.currentDaYun.pillar, "en")} · ${toEnglish(luckCycle.currentDaYun.relation)}` },
      { label: "Current Annual", value: `${pillarDisplayLabel(luckCycle.currentAnnual.pillar, "en")} · ${toEnglish(luckCycle.currentAnnual.relation)}` },
    ]);
  const findings = luckCycle.combinedFindings?.length
    ? `<ul class="plain-list">${luckCycle.combinedFindings.slice(0, 4).map((item) => `<li>${state.language === "zh" ? item : toEnglish(item)}</li>`).join("")}</ul>`
    : "";
  return `${overview}${renderLuckTimeline(luckCycle.daYunList.slice(0, 4), "dayun")}${renderLuckTimeline(luckCycle.annualList.slice(0, 5), "annual")}${findings}`;
}

function buildBaziSummary(result) {
  if (state.language === "zh") {
    return `你的日主属${elementLabel(result.dayMaster.element)}，原局强弱落在${result.structure.strengthTier || result.structure.strengthLabel}，月令主气偏${elementLabel(result.structure.seasonElement)}。调候显示“${result.climate.note}”，今天流日把主题拉向“${result.todayRelation}”。整体上，这更像是先读清局势，再用对节奏的一天。`;
  }
  return `Your Day Master is ${elementLabel(result.dayMaster.element)}. The natal structure reads as ${toEnglish(result.structure.strengthTier || result.structure.strengthLabel)}, with the month command leaning toward ${elementLabel(result.structure.seasonElement)}. The climate says "${toEnglish(result.climate.note)}," and today's timing highlights the ${toEnglish(result.todayRelation)} theme. Overall, this is a day for reading the field clearly and then using the right pace.`;
}

function buildBaziFocusText(result, focus) {
  const relationText = relationMeaning(result.todayRelation, state.language);
  const focusBlocks = {
    zh: {
      overall: `放到整体来看，重点不在一口气做很多，而在抓住最重要的一条主线。${relationText}`,
      career: `放到事业上，今天更看执行顺序、回应速度和你怎么处理规则与压力。${relationText}`,
      wealth: `放到财富上，今天更适合先看风险边界，再看机会值不值得追。${relationText}`,
      love: `放到感情上，今天更看表达分寸、关系节奏以及你怎么回应对方的信号。${relationText}`,
      health: `放到健康上，今天更看恢复、消耗与节律，而不是逞一时之强。${relationText}`,
    },
    en: {
      overall: `For the whole day, the key is not doing everything at once, but choosing the one line that matters most. ${relationText}`,
      career: `For career matters, the emphasis is on execution order, response timing, and how you handle rules or pressure. ${relationText}`,
      wealth: `For money matters, it is better to read risk boundaries first, then decide whether an opportunity is worth chasing. ${relationText}`,
      love: `For relationships, the emphasis is on tone, timing, and how you respond to the other person's signal. ${relationText}`,
      health: `For health, the emphasis is on recovery, load, and rhythm rather than proving toughness. ${relationText}`,
    },
  };
  return focusBlocks[state.language][focus];
}

function buildBaziMeaning(result, focus) {
  return renderDetailGrid(state.language === "zh"
    ? [
      { label: "你的底盘怎么定调", value: `原局${result.structure.strengthTier || result.structure.strengthLabel}，说明你今天更容易以自己的惯性去推进事情。关键不是蛮用力，而是顺着你的盘去用对力。` },
      { label: "时令怎么影响今天", value: climateMeaningText(result, "zh") },
      { label: "今天该怎么补位", value: climateActionLine(result, "zh") },
      { label: "这次问题上最该抓什么", value: buildBaziFocusText(result, focus) },
      { label: "今天的主轴", value: coreThemeCopy(result.todayRelation, "zh") },
    ]
    : [
      { label: "How Your Base Chart Sets The Tone", value: `The natal chart leans ${toEnglish(result.structure.strengthTier || result.structure.strengthLabel)}, which means the day is easier to handle when you work with your natural chart pattern instead of forcing a style that is not yours.` },
      { label: "How The Seasonal Climate Shapes Today", value: climateMeaningText(result, "en") },
      { label: "What Best Rebalances The Day", value: climateActionLine(result, "en") },
      { label: "What Matters Most For This Focus", value: buildBaziFocusText(result, focus) },
      { label: "Today's Core Theme", value: coreThemeCopy(result.todayRelation, "en") },
    ]);
}

function renderBaziResult(result) {
  state.baziResult = result;
  nodes.baziEmptyState.classList.add("hidden");
  nodes.baziResults.classList.remove("hidden");
  nodes.baziResults.classList.remove("entering");
  void nodes.baziResults.offsetWidth;
  nodes.baziResults.classList.add("entering");
  nodes.baziScoreValue.textContent = String(Math.round(result.score));
  nodes.baziScoreTier.textContent = state.language === "zh" ? result.tier : toEnglish(result.tier);
  nodes.baziSummaryText.innerHTML = renderParagraph(buildBaziSummary(result));
  nodes.baziFocusText.innerHTML = renderParagraph(buildBaziFocusText(result, nodes.baziFocus.value));
  nodes.baziClimateCard.innerHTML = `${renderParagraph(climateMeaningText(result, state.language))}${renderParagraph(climateActionLine(result, state.language))}`;
  nodes.baziMeaningCard.innerHTML = buildBaziMeaning(result, nodes.baziFocus.value);
  nodes.baziStructureCard.innerHTML = renderBaziStructure(result);
  nodes.baziLuckCard.innerHTML = renderBaziLuck(result);
  baziResultsPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function analyzeBazi() {
  clearBaziError();
  const birthDate = getBaziBirthDateIso();
  const birthTime = normalizeBirthTime(nodes.baziBirthTime.value || "12:00");
  if (!birthDate) {
    showBaziError(t("baziMissingDate"));
    return;
  }
  if (!birthTime) {
    showBaziError(t("baziMissingTime"));
    return;
  }
  const result = buildFortune({
    birthDate,
    birthTime,
    gender: nodes.baziGender.value,
    focusArea: nodes.baziFocus.value,
    timezone: DEFAULT_TIMEZONE,
    coinLines: NEUTRAL_COIN_LINES,
    analysisDate: todayInTimezone(DEFAULT_TIMEZONE),
  });
  renderBaziResult(result);
}

nodes.langEn.addEventListener("click", () => {
  state.language = "en";
  localStorage.setItem(LANGUAGE_KEY, state.language);
  applyTranslations();
});

nodes.langZh.addEventListener("click", () => {
  state.language = "zh";
  localStorage.setItem(LANGUAGE_KEY, state.language);
  applyTranslations();
});

nodes.viewCoin.addEventListener("click", () => setActiveView("coin"));
nodes.viewBazi.addEventListener("click", () => setActiveView("bazi"));
nodes.coinModeQuick.addEventListener("click", () => setCoinCastingMode("quick"));
nodes.coinModeTraditional.addEventListener("click", () => setCoinCastingMode("traditional"));
nodes.coinSwitchTraditional.addEventListener("click", () => {
  setCoinCastingMode("traditional");
  nodes.coinLines.scrollIntoView({ behavior: "smooth", block: "center" });
});
nodes.coinRandomize.addEventListener("click", randomizeCoinCast);
nodes.coinClear.addEventListener("click", clearCoinCast);
nodes.coinAnalyze.addEventListener("click", analyzeCoin);

nodes.coinLines.addEventListener("click", (event) => {
  const button = event.target.closest("[data-line-index]");
  if (!button || state.isCoinCasting) return;
  clearCoinError();
  resetCoinResult();
  state.coinLines[Number(button.dataset.lineIndex)] = Number(button.dataset.lineValue);
  renderCoinRows();
});

nodes.coinFocus.addEventListener("change", () => {
  if (state.coinResult && filledCoinLineCount() === 6) {
    renderCoinResult(buildCoinReading(state.coinLines, nodes.coinFocus.value));
  }
});

nodes.baziBirthDate.addEventListener("input", (event) => {
  event.target.value = formatBirthDateDigits(event.target.value);
  clearBaziError();
  resetBaziResult();
});

nodes.baziBirthDate.addEventListener("blur", () => {
  setBaziBirthDateDisplay(nodes.baziBirthDate.value);
});

nodes.baziBirthDatePickerButton.addEventListener("click", openBaziBirthDatePicker);
nodes.baziBirthDatePicker.addEventListener("change", () => {
  setBaziBirthDateDisplay(nodes.baziBirthDatePicker.value);
  clearBaziError();
  resetBaziResult();
});

[nodes.baziBirthTimeHour, nodes.baziBirthTimeMinute, nodes.baziBirthTimeMeridiem].forEach((select) => {
  select.addEventListener("change", () => {
    syncBaziBirthTimeValue();
    clearBaziError();
    resetBaziResult();
  });
});

[nodes.baziGender, nodes.baziFocus].forEach((field) => {
  field.addEventListener("change", () => {
    clearBaziError();
    resetBaziResult();
  });
});

nodes.baziAnalyze.addEventListener("click", analyzeBazi);

nodes.baziBirthTime.value = "12:00";
populateBaziTimeControls();
setCoinCastingMode("quick");
setActiveView("coin");
renderCoinRows();
applyTranslations();
updateHeroCard();
refreshCoinActions();
resetCoinResult();
resetBaziResult();
