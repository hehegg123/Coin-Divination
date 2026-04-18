const BOOK_RULESET = {
  sourceBooks: [
    {
      key: "advanced",
      title: "八字命理學進階教程",
      author: "陆致极",
      focus: ["强弱分析", "调候分析", "格局分析", "六亲", "财帛", "婚缘", "健康寿元", "大运流年"],
    },
    {
      key: "dynamic",
      title: "八字命理动态分析教程",
      author: "陆致极",
      focus: ["动态篇", "大运", "流年", "强弱动态调整", "格局动态调整", "反吟伏吟", "六甲移位", "量化分析"],
    },
  ],
  distilledPrinciples: [
    {
      key: "multi_view",
      name: "多视角分析",
      summary: "先看强弱、调候、格局、形象四视角，再进入人生领域与时间变化判断。",
    },
    {
      key: "season_weight",
      name: "月令与时令权重",
      summary: "月令是节令枢纽，既影响日主旺衰，也影响取格与调候次序。",
    },
    {
      key: "dynamic_adjustment",
      name: "动态调整",
      summary: "大运看吉凶背景，流年看应期，动态判断要回归原局，重点观察应局、激活、引动。",
    },
    {
      key: "event_mapping",
      name: "事项映射",
      summary: "家庭婚姻、社会地位、子女健康等要结合十神、宫位与刑冲会合分别落判。",
    },
    {
      key: "xing_gong",
      name: "星宫同参",
      summary: "六亲与实务判断不能只看十神，也不能只看宫位，要把星与宫一起看。",
    },
    {
      key: "pattern_vs_useful",
      name: "格局用神与有用之神",
      summary: "格局用神用于判断结构成败，有用之神用于具体扶抑补偏，二者不可混为一谈。",
    },
    {
      key: "yuanshen_lu",
      name: "原身与祿",
      summary: "原身与祿是动态分析的重要纽带，流年流运触及祿位时常有激活效果。",
    },
    {
      key: "nayin_reference",
      name: "纳音参考",
      summary: "纳音以主五行为主，主要作辅助信息，不取代正统干支五行判断。",
    },
    {
      key: "pattern_rule",
      name: "取格步骤",
      summary: "通常从月令地支下手，以透出天干成分取格；若月令参与三合局、三会方，则以成局之十神为格。",
    },
    {
      key: "transformation_rule",
      name: "合与合化",
      summary: "六合、三合不等于必化，需看化神、月令与全局条件；合而不化只代表羁绊，合化才代表性质转变。",
    },
    {
      key: "branch_motion_rule",
      name: "地支动静",
      summary: "地支平时偏静，遇刑冲会合才气动，气动之后才进一步论生克与应事。",
    },
  ],
  implementationNotes: {
    currentStage: "MVP-RulePack-1",
    enabledFeatures: [
      "日主强弱近似量化",
      "月令季节加权",
      "喜忌五行推导",
      "今日天干十神映射",
      "流日流月对事项分数加权",
      "星宫同参的六亲/婚财健康映射",
      "纳音辅助提示",
      "格局用神与扶抑喜忌分层",
    ],
    nextFeatures: [
      "大运排盘与起运岁数",
      "格局成败与破格条件",
      "调候专用规则表",
      "冲合刑害破穿",
      "反吟伏吟与移位细则",
    ],
  },
};

export { BOOK_RULESET };
