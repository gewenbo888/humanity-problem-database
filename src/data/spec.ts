// Canonical CIVLAB platforms spec — consumed by all 11 sites.
// Each platform: id, slug, name, oneLine, body, modules, dataModel, features, equations, sampleData

export type Bilingual = { en: string; zh: string };

export type Module = {
  id: string;
  name: Bilingual;
  body: Bilingual;
};

export type Feature = {
  name: Bilingual;
  body: Bilingual;
};

export type Platform = {
  id: string;
  slug: string;
  name: Bilingual;
  hue: string;             // hex accent
  glyph: string;           // single character/symbol
  oneLine: Bilingual;
  body: Bilingual;         // 3-4 paragraphs of vision
  modules: Module[];       // 4-6 modules
  features: Feature[];     // 3-5 user-facing capabilities
  dataModel: { name: Bilingual; fields: { key: string; type: string; note: Bilingual }[] };
  // Interactive component type the site will render
  interactiveKind:
    | "tree" | "graph" | "database" | "simulator" | "agents"
    | "matrix" | "timeline" | "memorial" | "compression" | "memory";
  // Sample data the interactive component will use (varies by kind)
  sampleData: any;
};

export const PLATFORMS: Platform[] = [
  // ────────────────────────────────────────────────────────────────────
  {
    id: "civilization-tree",
    slug: "civilization-tree",
    name: { en: "Civilization Tree", zh: "文明之树" },
    hue: "#9b6f3a",
    glyph: "❦",
    oneLine: {
      en: "A living branching map of human civilization — eras, technologies, ideas, and the dependencies that link them.",
      zh: "一棵活的、分叉的人类文明地图——时代、技术、思想，以及把它们串起来的依赖关系。",
    },
    body: {
      en: "Civilization Tree is a structural view of human progress as a directed graph of capabilities, where each node unlocks others. Stone tools enabled animal domestication, which enabled grain agriculture, which enabled cities, which enabled writing. Print enabled mass literacy, which enabled the modern citizen. Transistors enabled computing, which enabled the internet, which enabled foundation models. Each node carries its date of first significant use, its prerequisites, and what it unlocked downstream.\n\nThe tree is not a tech tree from a video game. Real history has parallel discoveries, dead ends, regressions, and re-inventions. The data model captures all of these. A user can pick any modern capability — say, mRNA vaccines — and walk backward through the chain of dependencies all the way to fire.",
      zh: "Civilization Tree 是人类进步的结构性视图——把它表示为一张能力之有向图，其中每个节点解锁其他节点。石器使动物驯化成为可能；驯化使农耕成为可能；农耕使城市成为可能；城市使文字成为可能。印刷术使大规模识字成为可能；识字使现代公民成为可能。晶体管使计算成为可能；计算使互联网成为可能；互联网使基础模型成为可能。每个节点都携带其首次显著使用的时间、它的前置条件，以及它在下游解锁了什么。\n\n这棵树不是电子游戏里的科技树。真实的历史有并行发现、死胡同、倒退与重新发明——数据模型把这些都收下。用户可以挑任一现代能力——比如 mRNA 疫苗——沿着依赖链一路向后走，最终走到火。",
    },
    modules: [
      { id: "node-graph",   name: { en: "Capability nodes",          zh: "能力节点" },     body: { en: "Each capability is a node with year, prerequisites, civilization-of-origin.",      zh: "每项能力是一节点，记录年份、前置条件、起源文明。" } },
      { id: "lineage",      name: { en: "Lineage walker",            zh: "谱系漫游" },     body: { en: "Pick any modern capability; walk backward through every prerequisite to root.",   zh: "选任一现代能力——沿前置一路向后走到根。" } },
      { id: "parallels",    name: { en: "Parallel discoveries",      zh: "平行发现" },     body: { en: "Surface multiple independent inventions of the same capability across cultures.",  zh: "呈现同一能力在不同文化中独立发明的多个版本。" } },
      { id: "regressions",  name: { en: "Regressions & dead ends",  zh: "倒退与死胡同" }, body: { en: "Roman concrete, Antikythera mechanism, lost ancient knowledge — visible.",        zh: "罗马混凝土、安提基特拉机械、失传的古代知识——皆可见。" } },
      { id: "rate-clock",   name: { en: "Rate clock",                zh: "速率钟" },       body: { en: "How long between each unlock? Visualization of the accelerating cadence.",         zh: "每次解锁之间隔多久？呈现节奏加速的可视化。" } },
    ],
    features: [
      { name: { en: "Walk a capability's lineage all the way back",  zh: "把任一能力的谱系一直走回去" }, body: { en: "Click any node, then click 'walk back' to highlight the dependency path.", zh: "点击任一节点，再点『往回走』，便高亮出依赖路径。" } },
      { name: { en: "Filter by era, region, or domain",              zh: "按时代、地区或领域筛选" },   body: { en: "Hide everything except (say) Song-dynasty inventions.",                    zh: "只显示（比如）宋代之发明。" } },
      { name: { en: "Random capability discovery",                   zh: "随机能力发现" },              body: { en: "Surface one node you've never thought about today.",                       zh: "今天给你一个你没想过的节点。" } },
    ],
    dataModel: {
      name: { en: "Capability", zh: "能力（Capability）" },
      fields: [
        { key: "id",          type: "uuid",     note: { en: "Capability id",                       zh: "能力 id" } },
        { key: "year",        type: "year",     note: { en: "Year of first significant use",       zh: "首次显著使用年份" } },
        { key: "prerequisites", type: "uuid[]", note: { en: "Capabilities required for this one",  zh: "本能力所需的前置能力" } },
        { key: "origin",      type: "string",   note: { en: "Civilization of origin",              zh: "起源文明" } },
        { key: "unlocks",     type: "uuid[]",   note: { en: "Capabilities directly unlocked",      zh: "直接解锁的能力" } },
        { key: "domain",      type: "enum",     note: { en: "{material, social, info, energy, life}", zh: "{物质、社会、信息、能源、生命}" } },
      ],
    },
    interactiveKind: "tree",
    sampleData: {
      nodes: [
        { id: "fire",          year: -700000, label: { en: "Fire",                  zh: "火" },              domain: "energy", deps: [] },
        { id: "stone-tools",   year: -300000, label: { en: "Stone tools",           zh: "石器" },            domain: "material", deps: [] },
        { id: "language",      year: -100000, label: { en: "Spoken language",       zh: "口语" },            domain: "info", deps: [] },
        { id: "domestication", year: -10000,  label: { en: "Animal domestication", zh: "动物驯化" },        domain: "life", deps: ["language", "stone-tools"] },
        { id: "agriculture",   year: -9500,   label: { en: "Grain agriculture",     zh: "谷物农业" },        domain: "life", deps: ["domestication"] },
        { id: "pottery",       year: -7000,   label: { en: "Pottery",               zh: "陶器" },            domain: "material", deps: ["fire", "agriculture"] },
        { id: "metal",         year: -6000,   label: { en: "Smelting (copper)",     zh: "冶铜" },            domain: "material", deps: ["fire", "pottery"] },
        { id: "writing",       year: -3200,   label: { en: "Writing (cuneiform)",   zh: "文字（楔形）" },     body: "info", domain: "info", deps: ["agriculture", "language"] },
        { id: "iron",          year: -1200,   label: { en: "Iron metallurgy",       zh: "冶铁" },            domain: "material", deps: ["metal"] },
        { id: "math-axiom",    year: -300,    label: { en: "Axiomatic math (Euclid)", zh: "公理化数学（欧几里得）" }, domain: "info", deps: ["writing"] },
        { id: "paper",         year: 105,     label: { en: "Paper (Cai Lun)",       zh: "造纸（蔡伦）" },     domain: "info", deps: ["writing"] },
        { id: "print",         year: 1455,    label: { en: "Movable-type print",    zh: "活字印刷" },        domain: "info", deps: ["paper"] },
        { id: "scientific-method", year: 1620, label: { en: "Scientific method",   zh: "科学方法" },        domain: "info", deps: ["math-axiom", "print"] },
        { id: "steam",         year: 1769,    label: { en: "Steam engine",         zh: "蒸汽机" },          domain: "energy", deps: ["iron", "scientific-method"] },
        { id: "electricity",   year: 1831,    label: { en: "Electromagnetism",     zh: "电磁感应" },        domain: "energy", deps: ["scientific-method"] },
        { id: "telegraph",     year: 1837,    label: { en: "Telegraph",            zh: "电报" },            domain: "info", deps: ["electricity"] },
        { id: "internal-comb", year: 1876,    label: { en: "Internal combustion",  zh: "内燃机" },          domain: "energy", deps: ["steam"] },
        { id: "powered-flight",year: 1903,    label: { en: "Powered flight",       zh: "动力飞行" },        domain: "material", deps: ["internal-comb"] },
        { id: "transistor",    year: 1947,    label: { en: "Transistor",           zh: "晶体管" },          domain: "info", deps: ["electricity"] },
        { id: "ic",            year: 1958,    label: { en: "Integrated circuit",   zh: "集成电路" },        domain: "info", deps: ["transistor"] },
        { id: "internet",      year: 1969,    label: { en: "Internet (ARPANET)",   zh: "互联网（ARPANET）" }, domain: "info", deps: ["ic", "telegraph"] },
        { id: "www",           year: 1989,    label: { en: "World Wide Web",       zh: "万维网" },          domain: "info", deps: ["internet"] },
        { id: "smartphone",    year: 2007,    label: { en: "Smartphone",           zh: "智能手机" },        domain: "info", deps: ["www", "ic"] },
        { id: "deep-learning", year: 2012,    label: { en: "Deep learning",        zh: "深度学习" },        domain: "info", deps: ["ic", "internet"] },
        { id: "mrna-vaccine",  year: 2020,    label: { en: "mRNA vaccine",         zh: "mRNA 疫苗" },       domain: "life", deps: ["scientific-method", "deep-learning"] },
        { id: "foundation-models", year: 2022, label: { en: "Foundation models",   zh: "基础模型" },        domain: "info", deps: ["deep-learning", "internet"] },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────
  {
    id: "how-the-world-works",
    slug: "how-the-world-works",
    name: { en: "How The World Works", zh: "世界如何运作" },
    hue: "#3a6e62",
    glyph: "◐",
    oneLine: {
      en: "Browseable diagrams of the systems that actually run the planet — power grids, container shipping, semiconductor fabs, central banks.",
      zh: "可浏览的图解——真正在运转这颗行星的系统：电网、集装箱航运、晶圆厂、央行。",
    },
    body: {
      en: "Most people have no working model of how electricity actually reaches a wall socket, how a single shipping container moves from a Vietnamese factory to a Brooklyn doorstep, or how the U.S. dollar is created. The world runs on hidden infrastructure. How The World Works is a visual encyclopedia of that infrastructure: each entry is a single system, presented as a diagram, with a 5-minute explanation, the chokepoints that matter, and the specific people / institutions that operate it.\n\nNot a textbook. A field guide for adults who notice they don't actually know how their world works.",
      zh: "大多数人没有任何关于『电是如何到达墙上插座』『一只集装箱如何从越南工厂走到布鲁克林门口』『美元如何被创造』的实际模型。世界靠隐藏的基础设施在转。How The World Works 是这套基础设施的视觉百科：每一条目都是一个单一系统，以图解呈现——配五分钟的解释、关键的咽喉点，以及具体在操作它的人／机构。\n\n它不是教科书——它是一份给『发现自己其实并不懂自己的世界』的成年人的田野指南。",
    },
    modules: [
      { id: "atlas",        name: { en: "Systems atlas",        zh: "系统图册" },     body: { en: "100+ diagrammed systems, each on its own card.",                       zh: "百余幅系统图，每张一卡。" } },
      { id: "chokepoints",  name: { en: "Chokepoint registry",  zh: "咽喉点登记" },   body: { en: "TSMC fabs, Strait of Hormuz, Suez Canal, ICBC, ASML, etc.",            zh: "台积电、霍尔木兹海峡、苏伊士运河、工行、ASML 等。" } },
      { id: "operators",    name: { en: "Operator directory",   zh: "操作者名册" },   body: { en: "Specific companies and individuals who actually run each system.",      zh: "实际操作每个系统的具体公司与个人。" } },
      { id: "incidents",    name: { en: "Incident library",     zh: "事故案例库" },   body: { en: "What happens when a chokepoint fails — Suez 2021, Texas freeze, ASML embargo.", zh: "咽喉失守时会发生什么——2021 苏伊士、德州冻灾、ASML 禁运。" } },
      { id: "search",       name: { en: "Plain-English search", zh: "普通话搜索" },   body: { en: "'How does my electricity get here?' returns the local generation→transmission→distribution chain.", zh: "『我的电从哪来？』返回本地发电→输电→配电链条。" } },
    ],
    features: [
      { name: { en: "5-minute explainers per system",        zh: "每系统五分钟讲清" },   body: { en: "Diagram + 500-word explanation + 'where it can break'.",          zh: "图解 + 500 字说明 + 『它会从哪里坏掉』。" } },
      { name: { en: "Chokepoint browser",                     zh: "咽喉点浏览器" },       body: { en: "Filter the world's systems by which single point can break them.", zh: "按『哪一处的故障能把整个系统拖垮』来筛选世界各系统。" } },
      { name: { en: "'Where does my X come from?' lookup",   zh: "『我的 X 从哪来？』查询" }, body: { en: "Pick a daily object; trace its supply chain back to raw materials.",  zh: "选一件日常物品，追其供应链直到原料。" } },
    ],
    dataModel: {
      name: { en: "System", zh: "System（系统）" },
      fields: [
        { key: "id",         type: "uuid",         note: { en: "System id",                          zh: "系统 id" } },
        { key: "domain",     type: "enum",         note: { en: "{energy, logistics, finance, comms, ...}", zh: "{能源、物流、金融、通信、…}" } },
        { key: "diagram",    type: "svg",          note: { en: "Inline SVG diagram",                zh: "内嵌 SVG 图" } },
        { key: "chokepoints",type: "Chokepoint[]", note: { en: "Failure-mode list",                  zh: "失效模式清单" } },
        { key: "operators",  type: "Operator[]",   note: { en: "Who actually runs it",               zh: "实际运营者" } },
      ],
    },
    interactiveKind: "database",
    sampleData: {
      systems: [
        { id: "power-grid",          domain: "energy",    label: { en: "Electrical grid",             zh: "电网" },                blurb: { en: "Generation → transmission (high-voltage) → distribution → outlet. Frequency must stay within 0.5% of 50/60 Hz.", zh: "发电 → 输电（高压）→ 配电 → 插座。频率必须维持在 50／60 Hz 的 0.5% 以内。" }, choke: { en: "Synchronized inertia loss; substations are unguarded.", zh: "同步惯量丢失；变电站无人看守。" } },
        { id: "container-ship",      domain: "logistics", label: { en: "Container shipping",          zh: "集装箱航运" },           blurb: { en: "20 ft / 40 ft TEUs. ~85% of world trade by tonnage. ~5,500 active container ships.",        zh: "20 / 40 英尺 TEU。约 85% 的世界贸易（按吨位）。在航集装箱船约 5,500 艘。" }, choke: { en: "Suez, Panama, Strait of Malacca.", zh: "苏伊士、巴拿马、马六甲。" } },
        { id: "semi-fab",            domain: "tech",      label: { en: "Semiconductor fab",           zh: "晶圆厂" },               blurb: { en: "EUV lithography (ASML monopoly) → wafer → die → package → board.",                          zh: "EUV 光刻（ASML 垄断）→ 晶圆 → 裸片 → 封装 → 主板。" }, choke: { en: "ASML in NL; 95% of leading-edge in TSMC Taiwan.", zh: "ASML 在荷兰；95% 前沿制程在台积电。" } },
        { id: "fed-money",           domain: "finance",   label: { en: "U.S. dollar creation",        zh: "美元创造" },             blurb: { en: "Fed buys Treasuries → bank reserves expand → bank lending creates checking deposits.",        zh: "美联储购买国债 → 银行准备金扩张 → 银行放贷创造活期存款。" }, choke: { en: "Repo market, primary dealers.", zh: "回购市场、一级交易商。" } },
        { id: "internet-bgp",        domain: "comms",     label: { en: "Internet BGP routing",        zh: "BGP 路由" },             blurb: { en: "Autonomous Systems announce IP prefixes; trust-based; misconfigured leaks have taken down regions.", zh: "自治系统宣告 IP 前缀；基于信任；配置错误曾让整片区域下线。" }, choke: { en: "Tier-1 transit providers; submarine cables.", zh: "一级骨干网；海底光缆。" } },
        { id: "haber-bosch",         domain: "energy",    label: { en: "Haber-Bosch nitrogen fixation", zh: "哈伯—博施合成氨" },     blurb: { en: "Atmospheric N₂ + H₂ → NH₃ at 200+ bar. Feeds half of humanity.",                            zh: "大气 N₂ + H₂ 在 200 bar 以上压力下合成氨——养活半数人类。" }, choke: { en: "Natural gas as H₂ source; energy-intensive.", zh: "天然气作 H₂ 来源；高能耗。" } },
        { id: "container-port",      domain: "logistics", label: { en: "Container port",              zh: "集装箱港口" },           blurb: { en: "Ship-to-shore cranes (made by ZPMC, ~70% global share) + reefer plugs + customs.",          zh: "岸桥（振华重工，全球约 70% 份额）+ 冷藏插座 + 海关。" }, choke: { en: "Crane sourcing; longshore labor.", zh: "岸桥来源；码头劳工。" } },
        { id: "rare-earth",          domain: "materials", label: { en: "Rare-earth supply chain",     zh: "稀土供应链" },           blurb: { en: "Mine → separation → metal → magnet. China refines ~90% of global supply.",                  zh: "采矿 → 分离 → 金属 → 磁铁。中国精炼约占全球 90%。" }, choke: { en: "Single-point separation capacity.", zh: "单点分离产能。" } },
        { id: "swift",               domain: "finance",   label: { en: "SWIFT messaging",             zh: "SWIFT 报文系统" },        blurb: { en: "Bank-to-bank instructions, not money. ~11,000 institutions; sanctions tool.",               zh: "银行之间的指令——不是钱本身。约 11,000 家机构；制裁工具。" }, choke: { en: "Belgian co-op; politically governed.", zh: "比利时合作社；受政治治理。" } },
        { id: "vaccine-coldchain",   domain: "health",    label: { en: "Vaccine cold chain",          zh: "疫苗冷链" },             blurb: { en: "Manufacturer → cold storage → distribution truck (2–8°C, mRNA: −70°C) → clinic.",            zh: "厂商 → 冷库 → 配送车（2–8°C；mRNA 需 −70°C）→ 诊所。" }, choke: { en: "Last-mile fridges in low-income regions.", zh: "中低收入地区的最后一公里冰箱。" } },
        { id: "satellite-gps",       domain: "comms",     label: { en: "GPS / GNSS",                  zh: "GPS／全球卫星导航" },     blurb: { en: "31 active GPS satellites in MEO. Sub-meter precision. Single most relied-on space utility.",  zh: "31 颗 MEO 中地球轨道 GPS 卫星——亚米级精度——单一最被依赖的太空公共设施。" }, choke: { en: "Jamming, spoofing, single-frequency civilian receivers.", zh: "干扰、欺骗、单频民用接收器。" } },
        { id: "fertilizer-potash",   domain: "materials", label: { en: "Potash supply",               zh: "钾肥供应" },             blurb: { en: "Belarus + Russia + Canada = ~70% of world potash. K-fertilizer makes modern agriculture work.", zh: "白俄罗斯 + 俄罗斯 + 加拿大占全球钾肥约 70%。钾肥让现代农业得以成立。" }, choke: { en: "Few mines; sanctions-sensitive.", zh: "矿点稀少；对制裁敏感。" } },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────
  {
    id: "humanity-problem-database",
    slug: "humanity-problem-database",
    name: { en: "Humanity Problem Database", zh: "人类难题数据库" },
    hue: "#bd3a2c",
    glyph: "✕",
    oneLine: {
      en: "A searchable, scored catalog of humanity's open problems — from cancer to coordination failure to climate.",
      zh: "一份可搜索、可打分的人类未解难题目录——从癌症到协同失败到气候。",
    },
    body: {
      en: "Some problems get attention because they're glamorous (longevity research). Others kill orders of magnitude more people but don't trend (indoor cooking smoke, road traffic). The Humanity Problem Database is a structured catalog of open problems, each scored on impact (DALYs / lives / dollars), tractability (does anyone know how to make progress?), and crowdedness (how many people already work on it). Founders and researchers can filter by 'high-impact, tractable, neglected' — the working definition of where the marginal effort matters most.\n\nThe data is opinionated. Each entry has a position with sources. Disagreement is encouraged; fork the database and run your own scores.",
      zh: "有些问题之所以受关注，是因为它们光彩夺目（如延寿研究）。另一些杀死的人多出几个量级，却不上头条（如室内烹饪烟、道路交通）。Humanity Problem Database 是一份结构化的开放问题目录——每一条都被按影响（DALYs／生命／美元）、可处理性（有没有人知道怎么推进）、与拥挤度（已经有多少人在做）打分。创业者与研究者可按『高影响、可处理、被忽视』筛选——这是『边际努力最有价值之处』的工作定义。\n\n数据是有立场的。每条都附有来源——欢迎不同意；把数据库 fork 走，跑你自己的分数。",
    },
    modules: [
      { id: "catalog",     name: { en: "Problem catalog",     zh: "问题目录" },   body: { en: "100+ open problems, each with structured fields.",                  zh: "百余个开放难题——每条皆有结构化字段。" } },
      { id: "scorecards",  name: { en: "Impact scorecards",   zh: "影响评分卡" }, body: { en: "Impact, tractability, crowdedness — the standard triad.",            zh: "影响、可处理、拥挤度——标准三联。" } },
      { id: "sources",     name: { en: "Source ledger",       zh: "来源账簿" },   body: { en: "Every claim links to its primary source.",                            zh: "每一论断皆链至其原始来源。" } },
      { id: "filters",     name: { en: "Multi-axis filter",   zh: "多轴筛选" },   body: { en: "'High impact + tractable + neglected' is one click.",                zh: "『高影响 + 可处理 + 被忽视』一键即得。" } },
      { id: "disagree",    name: { en: "Disagreement layer",  zh: "异议层" },     body: { en: "Add your own scores; see how the rank changes.",                     zh: "录入你自己的分数——看排名如何变化。" } },
    ],
    features: [
      { name: { en: "Filter to 'where should I work?'",  zh: "筛出『我应该去做什么？』" }, body: { en: "Standard EA-style ITN scoring with explicit weights.",   zh: "标准 EA 式 ITN 评分——权重显式可见。" } },
      { name: { en: "Compare two problems side-by-side", zh: "两个问题并排对比" },         body: { en: "Pull up cancer + coordination failure; see the math.",   zh: "并排取出癌症与协同失败——看数字。" } },
      { name: { en: "Position your own work",            zh: "为自己的工作定位" },         body: { en: "Where does your project sit on the ITN axes?",           zh: "你的项目在 ITN 轴上落在哪里？" } },
    ],
    dataModel: {
      name: { en: "Problem", zh: "Problem（难题）" },
      fields: [
        { key: "id",            type: "uuid",   note: { en: "Problem id",                                  zh: "难题 id" } },
        { key: "impact_dalys",  type: "number", note: { en: "Annual DALYs lost or equivalent harm",       zh: "每年损失的 DALY 或等价损害" } },
        { key: "tractability",  type: "0..1",   note: { en: "Probability of meaningful progress in 10y",  zh: "十年内取得有意义进展的概率" } },
        { key: "crowdedness",   type: "FTE",    note: { en: "Approximate full-time-equivalent workers",   zh: "近似全职等量工作者" } },
        { key: "marginal_score",type: "number", note: { en: "Computed: impact × tractability / crowdedness", zh: "计算值：影响 × 可处理 / 拥挤度" } },
      ],
    },
    interactiveKind: "database",
    sampleData: {
      problems: [
        { id: "indoor-air",      label: { en: "Indoor cooking-smoke deaths",   zh: "室内烹饪烟雾致死" },          impact: 4_000_000, tractability: 0.85, crowd: 5_000,   note: { en: "Solid-fuel cooking kills ~4M/yr. Clean-cookstove tech exists; deployment lags.", zh: "固体燃料烹饪每年致死约 400 万人。清洁炉灶技术已有——部署滞后。" } },
        { id: "road-traffic",    label: { en: "Road traffic deaths",           zh: "道路交通致死" },              impact: 1_350_000, tractability: 0.9,  crowd: 100_000, note: { en: "1.35M/yr globally. Engineering solutions known; political will is the bottleneck.", zh: "全球每年 135 万人死亡。工程方案明确——政治意愿是瓶颈。" } },
        { id: "antibiotic-res",  label: { en: "Antimicrobial resistance",     zh: "抗微生物耐药" },              impact: 1_270_000, tractability: 0.6,  crowd: 30_000,  note: { en: "Direct deaths attributable, climbing fast. New antibiotic discovery pipeline broken.", zh: "直接致死归因，正快速上升。新抗生素研发管道已断。" } },
        { id: "cancer",          label: { en: "Cancer (all)",                 zh: "癌症（总和）" },              impact: 9_700_000, tractability: 0.5,  crowd: 600_000, note: { en: "Crowded but heterogeneous; specific cancers vary wildly in tractability.", zh: "已拥挤——但异质性强；具体癌种之可处理性差异极大。" } },
        { id: "coordination",    label: { en: "Civilizational coordination",  zh: "文明级协同" },                 impact: 9_000_000, tractability: 0.2,  crowd: 1_000,   note: { en: "If we can't coordinate on climate, AI safety, pandemic prep, much else cascades. Unclear what works.", zh: "若我们无法在气候、AI 安全、流行病防备上协同——其他多事将级联崩塌。何为有效尚不清楚。" } },
        { id: "lead-poisoning",  label: { en: "Lead poisoning (cookware/spice)", zh: "铅中毒（炊具／香料）" },     impact: 800_000,   tractability: 0.95, crowd: 300,     note: { en: "Cheap testing + targeted bans extremely effective. Almost no one works on it.", zh: "便宜的检测 + 定点禁令极为有效——几乎无人在做。" } },
        { id: "ai-safety",       label: { en: "AI alignment",                 zh: "AI 对齐" },                   impact: 0,         tractability: 0.4,  crowd: 5_000,   note: { en: "Tail-risk-dominated; if catastrophe odds are even 1%, expected DALY enormous.", zh: "尾部风险主导——若灾难概率仅 1%，期望 DALY 也极巨。" } },
        { id: "stillbirth",      label: { en: "Stillbirth (low-income)",      zh: "死胎（中低收入）" },          impact: 1_900_000, tractability: 0.8,  crowd: 8_000,   note: { en: "Largely preventable; chronically underfunded.", zh: "大半可防——长期资金不足。" } },
        { id: "groundwater-as",  label: { en: "Arsenic in groundwater (Bangladesh)", zh: "孟加拉国地下水砷" },   impact: 200_000,   tractability: 0.7,  crowd: 500,     note: { en: "20+ million people exposed; remediation tech exists.", zh: "二千余万人暴露——补救技术已有。" } },
        { id: "water-sanitation",label: { en: "Water + sanitation",           zh: "饮水与卫生" },                impact: 1_500_000, tractability: 0.85, crowd: 80_000,  note: { en: "Diarrheal disease still kills children at scale.", zh: "腹泻病仍在大规模杀死儿童。" } },
        { id: "alzheimers",      label: { en: "Alzheimer's disease",          zh: "阿尔茨海默病" },              impact: 32_000_000, tractability: 0.3, crowd: 200_000, note: { en: "Massive impact (DALY-weighted), low recent tractability — drug pipeline failures.", zh: "影响巨大（DALY 加权）——近期可处理性低；新药研发屡败。" } },
        { id: "suicide",         label: { en: "Suicide",                      zh: "自杀" },                      impact: 700_000,   tractability: 0.5,  crowd: 50_000,  note: { en: "Means restriction (firearms, pesticides) the highest-leverage intervention.", zh: "限制手段（枪支、农药）——杠杆最高的干预。" } },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────
  {
    id: "future-simulator",
    slug: "future-simulator",
    name: { en: "Future Simulator", zh: "未来模拟器" },
    hue: "#446ba0",
    glyph: "▲",
    oneLine: {
      en: "Drag sliders, see which futures the assumptions actually produce. The point is not prediction — it's intuition.",
      zh: "拖动滑块——看看这些假设到底通向哪种未来。重点不是预测——是直觉。",
    },
    body: {
      en: "Future Simulator is an interactive sandbox over a small set of macro variables: AGI capability growth rate, energy cost trajectory, demographic decline, automation deployment speed, geopolitical fragmentation. Pick values; the simulator runs forward 30 years and shows you what those values produce — not as a single prediction, but as a Monte Carlo distribution over plausible outcomes.\n\nThe model is deliberately simple. It is wrong about the specifics in the way every macro model is wrong about specifics. What it gets right is the directional logic: here is what the world looks like if these are your assumptions. Change the assumptions; watch the world change. The simulator's value is in giving you intuition for which assumptions are doing the work.",
      zh: "Future Simulator 是一个互动沙盒——基于一小组宏观变量：AGI 能力增长率、能源成本轨迹、人口衰退、自动化部署速度、地缘碎片化。拨数值；模拟器向前推 30 年——把你的数值产出的世界呈现出来——不是单一预测，而是一份对合理结局的蒙特卡洛分布。\n\n模型是刻意简单的。它在具体上是错的——每一个宏观模型在具体上都是错的。它做对的是方向性的逻辑：『若你假设这些——世界会是这副模样』。改假设——看世界变。模拟器的价值，是给你建立『哪些假设在做实际工作』的直觉。",
    },
    modules: [
      { id: "macro-engine", name: { en: "Macro engine",         zh: "宏观引擎" },     body: { en: "Coupled ODEs over population, productivity, energy, capability growth.",     zh: "对人口、生产率、能源、能力增长的耦合常微分方程。" } },
      { id: "monte-carlo",  name: { en: "Monte Carlo runner",   zh: "蒙特卡洛跑" },   body: { en: "1,000 parameter samples per slider configuration; distributions over outcomes.", zh: "每组滑块配置跑 1,000 组参数样本——得出结局的分布。" } },
      { id: "scenarios",    name: { en: "Scenario library",     zh: "情景库" },       body: { en: "Pre-built scenario templates: 'fast AGI', 'energy cheap', 'demographic collapse'.", zh: "预置情景模板：『快速 AGI』『能源极便宜』『人口崩塌』。" } },
      { id: "explainers",   name: { en: "Driver explainers",    zh: "驱动解释" },     body: { en: "For each variable: what it represents, what we know, what's contested.",       zh: "每个变量：它代表什么、已知什么、有争议者何。" } },
      { id: "compare",      name: { en: "Compare runs",         zh: "运行对比" },     body: { en: "Side-by-side overlay of two scenarios.",                                    zh: "两情景并排叠加。" } },
    ],
    features: [
      { name: { en: "Drag sliders, see futures shift live",          zh: "拖滑块——实时看未来变化" }, body: { en: "GDP, population, energy, automation, fragmentation — all live.",  zh: "GDP、人口、能源、自动化、碎片化——皆实时。" } },
      { name: { en: "Save and share a scenario URL",                 zh: "保存并分享情景 URL" },     body: { en: "Send your assumptions to a colleague — argue from the same numbers.", zh: "把你的假设传给同事——从同一组数字辩论。" } },
      { name: { en: "Sensitivity analysis (which slider matters most?)", zh: "敏感性分析（哪一个滑块最重要？）" }, body: { en: "Tornado chart showing per-variable impact on outcomes.",       zh: "龙卷风图——按变量呈现对结果的影响。" } },
    ],
    dataModel: {
      name: { en: "ScenarioRun", zh: "ScenarioRun（情景跑）" },
      fields: [
        { key: "id",         type: "uuid",          note: { en: "Run id",                       zh: "运行 id" } },
        { key: "params",     type: "Params",        note: { en: "Slider values used",            zh: "所用滑块值" } },
        { key: "horizon",    type: "years",         note: { en: "Default 30 years",              zh: "默认 30 年" } },
        { key: "samples",    type: "int",           note: { en: "Monte-Carlo sample count",      zh: "蒙特卡洛样本数" } },
        { key: "outcome_dist",type: "histogram",    note: { en: "GDP / pop / capability bands",  zh: "GDP / 人口 / 能力区间" } },
      ],
    },
    interactiveKind: "simulator",
    sampleData: {
      sliders: [
        { id: "agi-rate",      label: { en: "AGI capability growth (% / yr)", zh: "AGI 能力增长（%／年）" }, min: 0,    max: 60, default: 12 },
        { id: "energy-cost",   label: { en: "Energy cost change (% / yr)",   zh: "能源成本变化（%／年）" }, min: -8,   max: 8,  default: -2 },
        { id: "demography",    label: { en: "Working-age population (% / yr)", zh: "劳动年龄人口（%／年）" }, min: -2, max: 2,  default: -0.4 },
        { id: "automation",    label: { en: "Automation deployment (% jobs/yr)", zh: "自动化部署（% 职位／年）" }, min: 0, max: 12, default: 3 },
        { id: "fragmentation", label: { en: "Geopolitical fragmentation",     zh: "地缘碎片化" },           min: 0,    max: 1,  default: 0.5 },
      ],
      outputs: ["gdp_30y_idx", "global_pop_30y", "agi_capability_idx", "energy_per_capita_30y"],
    },
  },

  // ────────────────────────────────────────────────────────────────────
  {
    id: "ai-society-sandbox",
    slug: "ai-society-sandbox",
    name: { en: "AI Society Sandbox", zh: "AI 社会沙盒" },
    hue: "#7d6c8a",
    glyph: "◯",
    oneLine: {
      en: "A toy economy of autonomous AI agents — citizens, firms, regulators — running on visible rules.",
      zh: "一个自治 AI 代理的玩具经济——公民、企业、监管者——在可见规则上运行。",
    },
    body: {
      en: "AI Society Sandbox is a deterministic, fully-visible micro-society in which every agent's policy and every transaction is inspectable. Citizens have utility functions; firms have production functions; regulators have rule sets. You can step the simulation, change a regulation, and see the macro consequences in 50 ticks. Not a prediction of how AI agents will actually behave; a tool for building intuition about which institutional designs survive autonomous-agent populations.\n\nNo magic black box: the policies are short, the rules are short, the data is in front of you. If a result surprises you, you can find the line of code that produced it.",
      zh: "AI Society Sandbox 是一个确定性、完全可见的微型社会——每个代理的策略与每笔交易都可被检视。公民有效用函数；企业有生产函数；监管者有规则集。你可以推进模拟、修改一条规定——50 个 tick 内便看见宏观结果。这不是『AI 代理实际会如何行事』的预测——它是建立『哪种制度设计能在自治代理种群下存活』之直觉的工具。\n\n没有魔法黑箱：策略短、规则短、数据摆在你面前。若一个结果让你意外——你可以找到产生它的那一行代码。",
    },
    modules: [
      { id: "agent-types",   name: { en: "Agent types",       zh: "代理类型" },     body: { en: "Citizen (consume + work), Firm (produce + hire), Regulator (set rules).",  zh: "公民（消费 + 工作）、企业（生产 + 招工）、监管者（定规则）。" } },
      { id: "policies",      name: { en: "Policy library",    zh: "策略库" },       body: { en: "Greedy, satisficer, RL-shaped, random, malicious — pluggable.",            zh: "贪婪、满足化、RL 塑、随机、恶意——可插拔。" } },
      { id: "stepper",       name: { en: "Discrete-time stepper", zh: "离散时间推进" }, body: { en: "Pause, step, rewind. Inspect any agent's state at any tick.",         zh: "暂停、步进、回退——任一时刻检视任一代理的状态。" } },
      { id: "rules",         name: { en: "Regulation editor", zh: "规则编辑器" },    body: { en: "Add taxes, caps, anti-monopoly rules; see effects.",                       zh: "加税、加上限、反垄断规则——看效果。" } },
      { id: "metrics",       name: { en: "Macro metrics",     zh: "宏观指标" },     body: { en: "GDP, Gini, employment, monopoly index over time.",                         zh: "随时间的 GDP、基尼、就业、垄断指数。" } },
    ],
    features: [
      { name: { en: "Pause-step-resume the economy",            zh: "暂停-步进-继续整经济" },    body: { en: "Pause at tick 47; inspect why citizen #312 starved; resume.",         zh: "在 tick 47 暂停，查公民 #312 为何饿死——再继续。" } },
      { name: { en: "Drop in a new policy live",                zh: "在线投放新策略" },           body: { en: "Halfway through a run, change all firms to a new policy.",            zh: "运行中途——把所有企业切到新策略。" } },
      { name: { en: "Save runs to share with colleagues",       zh: "保存运行以分享" },           body: { en: "Share a tick-by-tick replay URL.",                                     zh: "分享一份逐 tick 的回放 URL。" } },
    ],
    dataModel: {
      name: { en: "Agent", zh: "Agent（代理）" },
      fields: [
        { key: "id",        type: "uuid",   note: { en: "Agent id",                              zh: "代理 id" } },
        { key: "type",      type: "enum",   note: { en: "{citizen, firm, regulator}",            zh: "{公民、企业、监管}" } },
        { key: "policy",    type: "code",   note: { en: "Reference to a Policy in the library",  zh: "策略库中的某个 Policy 引用" } },
        { key: "state",     type: "blob",   note: { en: "Type-specific local state (cash, inventory, etc.)", zh: "类型相关的本地状态（现金、库存等）" } },
      ],
    },
    interactiveKind: "agents",
    sampleData: {
      pop: 60,
      tickRate: 200, // ms
      defaults: {
        citizens: 40, firms: 5, regulators: 1,
        policies: ["greedy", "satisficer", "random"],
      },
    },
  },

  // ────────────────────────────────────────────────────────────────────
  {
    id: "global-materials-graph",
    slug: "global-materials-graph",
    name: { en: "Global Materials Graph", zh: "全球材料图谱" },
    hue: "#5d7494",
    glyph: "◇",
    oneLine: {
      en: "Every important material in modern technology, the elements that go into it, and the chokepoint countries that supply them.",
      zh: "现代技术中每一种重要材料、其所含元素，以及供应它们的咽喉国家。",
    },
    body: {
      en: "The modern world runs on perhaps two hundred materials. Each is mined, processed, and refined through a multi-step chain. Each step is concentrated in a small number of countries. Lithium — Australia mines it, China refines it. Gallium — China supplies 98% of pure metal. Cobalt — DRC mines it, China refines it. Global Materials Graph turns this into a single navigable map: pick a material, see its element composition, its mining geography, its refining geography, the products that depend on it, and the timeline of price and supply shocks.\n\nFor founders, this is competitive intelligence. For policymakers, this is the inventory. For everyone else, this is how to see the physical layer of the economy you live in.",
      zh: "现代世界靠着大约两百种材料在转。每一种都要经过多步的开采、加工与精炼链。每一步都集中在少数几个国家。锂——澳大利亚采，中国精炼。镓——中国供应 98% 的纯金属。钴——刚果采，中国精炼。Global Materials Graph 把这件事做成一张可导航的地图：选一种材料——看它的元素构成、采矿地理、精炼地理、依赖它的产品，以及价格与供应冲击的时间线。\n\n对创业者，这是竞争情报。对政策制定者，这是清单。对其他人——这是观察『你所生活之经济』物理层的方式。",
    },
    modules: [
      { id: "material-db",   name: { en: "Material database",     zh: "材料数据库" },   body: { en: "200+ materials with composition, applications, criticality.",            zh: "200+ 种材料，含成分、应用、临界性。" } },
      { id: "geo-supply",    name: { en: "Geographic supply",     zh: "地理供应" },     body: { en: "Country-level mining and refining shares per material.",                 zh: "每材料按国家的采矿与精炼份额。" } },
      { id: "chains",        name: { en: "Process chains",        zh: "工艺链" },       body: { en: "Step-by-step transformation from ore to finished good.",                 zh: "从矿石到成品的逐步转化。" } },
      { id: "shocks",        name: { en: "Supply shock log",      zh: "供应冲击日志" }, body: { en: "Recorded events: 2010 China rare-earth ban, 2022 Indonesia nickel ban.", zh: "已记录的事件：2010 中国稀土禁运、2022 印尼镍禁。" } },
      { id: "products",      name: { en: "Product dependencies",  zh: "产品依赖" },     body: { en: "Which finished products fail without this material?",                    zh: "哪些成品因缺此料而无法运作？" } },
    ],
    features: [
      { name: { en: "Pick a material → see who controls supply",   zh: "选材料 → 见谁掌握供应" }, body: { en: "Country shares for mining and refining, separately.",                  zh: "采矿与精炼分别按国家份额。" } },
      { name: { en: "Pick a country → see its leverage",           zh: "选国家 → 见其杠杆" },     body: { en: "All materials in which this country has > 30% share.",                  zh: "该国份额 > 30% 的所有材料。" } },
      { name: { en: "Pick a product → see its material-bill of risks", zh: "选产品 → 见其材料账单风险" }, body: { en: "Smartphone, EV battery, solar panel — broken into criticality risks.", zh: "智能手机、电动车电池、太阳能板——拆解到临界性风险。" } },
    ],
    dataModel: {
      name: { en: "Material", zh: "Material（材料）" },
      fields: [
        { key: "id",          type: "uuid",            note: { en: "Material id",                           zh: "材料 id" } },
        { key: "elements",    type: "ElementShare[]",  note: { en: "Composition by atom %",                 zh: "按原子百分比的成分" } },
        { key: "mining",      type: "CountryShare[]",  note: { en: "Mining share by country",               zh: "采矿份额按国" } },
        { key: "refining",    type: "CountryShare[]",  note: { en: "Refining share by country",             zh: "精炼份额按国" } },
        { key: "products",    type: "ProductRef[]",    note: { en: "Products dependent on this material",   zh: "依赖此材料的产品" } },
        { key: "criticality", type: "0..1",            note: { en: "Composite criticality score",           zh: "综合临界性评分" } },
      ],
    },
    interactiveKind: "graph",
    sampleData: {
      nodes: [
        { id: "Li",      kind: "element",  label: "Li",       weight: 6 },
        { id: "Co",      kind: "element",  label: "Co",       weight: 7 },
        { id: "Ni",      kind: "element",  label: "Ni",       weight: 5 },
        { id: "Ga",      kind: "element",  label: "Ga",       weight: 9 },
        { id: "Si",      kind: "element",  label: "Si",       weight: 4 },
        { id: "Cu",      kind: "element",  label: "Cu",       weight: 3 },
        { id: "Nd",      kind: "element",  label: "Nd",       weight: 8 },
        { id: "battery-licobalt", kind: "material",  label: { en: "Li-Co battery cathode", zh: "锂钴正极" }, weight: 8 },
        { id: "battery-linmc",    kind: "material",  label: { en: "NMC cathode",           zh: "NMC 正极" }, weight: 8 },
        { id: "gan-led",          kind: "material",  label: { en: "GaN semiconductor",     zh: "GaN 半导体" }, weight: 9 },
        { id: "neo-magnet",       kind: "material",  label: { en: "Neodymium magnet",      zh: "钕铁硼磁铁" }, weight: 9 },
        { id: "silicon-wafer",    kind: "material",  label: { en: "Silicon wafer",         zh: "硅晶圆" },     weight: 7 },
        { id: "ev-battery",       kind: "product",   label: { en: "EV battery",            zh: "电动车电池" }, weight: 9 },
        { id: "smartphone",       kind: "product",   label: { en: "Smartphone",            zh: "智能手机" },   weight: 8 },
        { id: "wind-turbine",     kind: "product",   label: { en: "Wind turbine",          zh: "风力涡轮机" }, weight: 7 },
      ],
      edges: [
        { from: "Li", to: "battery-licobalt" }, { from: "Co", to: "battery-licobalt" },
        { from: "Li", to: "battery-linmc" }, { from: "Ni", to: "battery-linmc" }, { from: "Co", to: "battery-linmc" },
        { from: "Ga", to: "gan-led" },
        { from: "Nd", to: "neo-magnet" },
        { from: "Si", to: "silicon-wafer" },
        { from: "battery-linmc", to: "ev-battery" }, { from: "battery-licobalt", to: "ev-battery" }, { from: "neo-magnet", to: "ev-battery" }, { from: "Cu", to: "ev-battery" },
        { from: "silicon-wafer", to: "smartphone" }, { from: "battery-licobalt", to: "smartphone" }, { from: "gan-led", to: "smartphone" },
        { from: "neo-magnet", to: "wind-turbine" }, { from: "Cu", to: "wind-turbine" },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────
  {
    id: "ai-replacement-map",
    slug: "ai-replacement-map",
    name: { en: "AI Replacement Map", zh: "AI 替代地图" },
    hue: "#bd5d2c",
    glyph: "▣",
    oneLine: {
      en: "An honest, occupation-by-occupation map of which jobs LLM-era AI is replacing, augmenting, or leaving alone.",
      zh: "一份诚实的、按职业划分的地图——LLM 时代的 AI 在替代什么、增强什么、放过什么。",
    },
    body: {
      en: "Most AI-job-loss content is either panic ('AI will take everything') or denial ('it just helps with email'). Both lose information. AI Replacement Map looks at occupations one at a time. For each, it scores: what fraction of tasks AI can already do, what fraction it augments, what fraction it cannot touch in the next 5 years, and the empirical wage / posting trend in the relevant labor market over the last 24 months. The result is a heatmap of where the actual displacement is happening, the augmentation is happening, and the protective moats remain.\n\nThe scores have explicit uncertainty bounds and explicit assumptions. Disagree? Fork the methodology and re-score.",
      zh: "大多数关于『AI 抢工作』的内容，要么是恐慌（『AI 会全拿走』），要么是否认（『它只是帮你写邮件』）。两者都丢失信息。AI Replacement Map 一职业一职业地看。对每一种职业，它评分：AI 已能做的任务比例、AI 增强的任务比例、未来 5 年内 AI 触不到的比例，以及过去 24 个月相关劳动力市场的工资 / 招聘经验趋势。结果是一张热图——呈现真实的替代发生在哪里、增强发生在哪里、护城河保留在哪里。\n\n评分附明确的不确定区间与假设——不同意？fork 方法论，重新打分。",
    },
    modules: [
      { id: "occupation-db", name: { en: "Occupation database",   zh: "职业数据库" },     body: { en: "~250 occupations from O*NET aligned to task-level scoring.",          zh: "~250 个职业（来自 O*NET），对齐到任务级评分。" } },
      { id: "task-scorer",   name: { en: "Task-level scorer",      zh: "任务级评分" },     body: { en: "Each occupation broken into ~20 tasks; LLM-era automatability per task.", zh: "每职业拆为约 20 个任务——按任务评 LLM 时代的自动化可达性。" } },
      { id: "wage-tracker",  name: { en: "Wage / posting tracker", zh: "工资／招聘追踪" }, body: { en: "Monthly wage and job-posting volume by BLS / LinkedIn signals.",       zh: "月度工资与招聘量——按 BLS／LinkedIn 信号。" } },
      { id: "moat-finder",   name: { en: "Moat finder",            zh: "护城河发现" },      body: { en: "Tasks that resist automation: physical, social-trust, regulatory.",     zh: "抗自动化的任务：物理、社会信任、合规。" } },
      { id: "transition",    name: { en: "Transition advisor",     zh: "转换建议" },        body: { en: "If your job is heavily exposed, what adjacent roles compound your skills?", zh: "若你职业暴露很高——哪些相邻角色能复利你的技能？" } },
    ],
    features: [
      { name: { en: "Search any occupation",                  zh: "搜任一职业" },             body: { en: "'Paralegal', 'truck driver', 'radiologist' — instant scorecard.",     zh: "『律师助理』『卡车司机』『放射科医生』——即时评分卡。" } },
      { name: { en: "Heatmap by industry",                    zh: "按行业的热图" },           body: { en: "Where is the most exposure right now?",                                zh: "目前哪里暴露最大？" } },
      { name: { en: "Personal exposure check",                zh: "个人暴露检查" },           body: { en: "Paste your job description; get task-level breakdown.",                zh: "贴一段你自己的工作描述——得到任务级拆解。" } },
    ],
    dataModel: {
      name: { en: "Occupation", zh: "Occupation（职业）" },
      fields: [
        { key: "id",            type: "soc-code",  note: { en: "Standard Occupational Classification code", zh: "标准职业分类代码" } },
        { key: "tasks",         type: "Task[]",    note: { en: "Constituent tasks (O*NET)",                  zh: "构成任务（O*NET）" } },
        { key: "automate_pct",  type: "0..1",      note: { en: "Share of tasks LLM-era AI can already do",   zh: "LLM 时代 AI 已能做的任务比例" } },
        { key: "augment_pct",   type: "0..1",      note: { en: "Share AI meaningfully accelerates",          zh: "AI 显著加速的任务比例" } },
        { key: "moat_pct",      type: "0..1",      note: { en: "Share that resists automation",              zh: "抗自动化的任务比例" } },
      ],
    },
    interactiveKind: "matrix",
    sampleData: {
      occupations: [
        { id: "paralegal",          label: { en: "Paralegal",                zh: "律师助理" },        automate: 0.55, augment: 0.30, moat: 0.15 },
        { id: "radiologist",        label: { en: "Radiologist",              zh: "放射科医生" },       automate: 0.20, augment: 0.55, moat: 0.25 },
        { id: "truck-driver-long",  label: { en: "Long-haul truck driver",   zh: "长途卡车司机" },     automate: 0.05, augment: 0.10, moat: 0.85 },
        { id: "translator",         label: { en: "Translator",               zh: "翻译" },             automate: 0.65, augment: 0.25, moat: 0.10 },
        { id: "frontend-dev",       label: { en: "Front-end developer",      zh: "前端工程师" },       automate: 0.30, augment: 0.55, moat: 0.15 },
        { id: "backend-dev",        label: { en: "Back-end developer",       zh: "后端工程师" },       automate: 0.25, augment: 0.55, moat: 0.20 },
        { id: "tax-preparer",       label: { en: "Tax preparer",             zh: "税务准备员" },       automate: 0.55, augment: 0.30, moat: 0.15 },
        { id: "plumber",            label: { en: "Plumber",                  zh: "水管工" },           automate: 0.05, augment: 0.10, moat: 0.85 },
        { id: "primary-care-doc",   label: { en: "Primary-care physician",   zh: "全科医生" },         automate: 0.10, augment: 0.50, moat: 0.40 },
        { id: "graphic-designer",   label: { en: "Graphic designer",         zh: "平面设计师" },       automate: 0.45, augment: 0.40, moat: 0.15 },
        { id: "barber",             label: { en: "Barber / hairdresser",     zh: "理发师" },           automate: 0.0,  augment: 0.05, moat: 0.95 },
        { id: "data-analyst",       label: { en: "Data analyst",             zh: "数据分析师" },       automate: 0.40, augment: 0.50, moat: 0.10 },
        { id: "copywriter",         label: { en: "Copywriter",               zh: "文案" },             automate: 0.55, augment: 0.30, moat: 0.15 },
        { id: "elementary-teacher", label: { en: "Elementary teacher",       zh: "小学教师" },         automate: 0.10, augment: 0.30, moat: 0.60 },
        { id: "construction-mgr",   label: { en: "Construction manager",     zh: "建筑工程经理" },     automate: 0.10, augment: 0.30, moat: 0.60 },
        { id: "accountant",         label: { en: "Accountant",               zh: "会计师" },           automate: 0.40, augment: 0.45, moat: 0.15 },
        { id: "psychiatrist",       label: { en: "Psychiatrist",             zh: "精神科医生" },       automate: 0.05, augment: 0.30, moat: 0.65 },
        { id: "pilot-commercial",   label: { en: "Commercial pilot",         zh: "民航飞行员" },       automate: 0.10, augment: 0.20, moat: 0.70 },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────
  {
    id: "failure-museum",
    slug: "failure-museum",
    name: { en: "Failure Museum", zh: "失败博物馆" },
    hue: "#7a341c",
    glyph: "⊘",
    oneLine: {
      en: "A serious archive of how things actually broke — companies, missions, treaties, theories — and what was learned.",
      zh: "一个关于事物如何真正出错的认真档案——公司、任务、条约、理论——以及人们从中学到了什么。",
    },
    body: {
      en: "Survivorship bias rules our histories. We learn the names of the companies that succeeded, the missions that landed, the treaties that held. We learn nothing about the dozens that didn't — and so we keep making the same mistakes. The Failure Museum is the missing wing. Each entry is a single failure, with the structural decisions that produced it, the warning signs that were ignored, the public narrative at the time, and the autopsy as the field eventually wrote it. Curated; sources required.\n\nThe goal is not schadenfreude. The goal is the thing autopsies do for medicine: convert losses into knowledge that future practitioners can use.",
      zh: "幸存者偏差主宰着我们的历史叙事。我们记得成功的公司、登陆成功的任务、签订成功的条约——却对数十个没成的几乎一无所知。于是我们一再犯相同的错。Failure Museum 是缺失的那一翼。每条记录是一桩失败——附产生它的结构性决定、被无视的警告信号、当时的公众叙事，以及该领域日后写下的事后剖析。每条人工策展，必备来源。\n\n目的不是幸灾乐祸。目的，是医学剖检对医学之所是：把损失转化为后来者可用的知识。",
    },
    modules: [
      { id: "case-files",     name: { en: "Case files",          zh: "案卷" },         body: { en: "100+ failures across business, science, engineering, governance.",     zh: "百余桩失败——横跨商业、科学、工程、治理。" } },
      { id: "structural",     name: { en: "Structural decisions",zh: "结构性决定" },    body: { en: "What was decided that made failure likely, often years before.",        zh: "哪些决定使失败变得很可能——常在事发前数年。" } },
      { id: "warnings",       name: { en: "Warning signs",       zh: "警告信号" },      body: { en: "Which signals would have flagged the trajectory? Why were they missed?", zh: "哪些信号本可警示轨迹——它们为何被错过？" } },
      { id: "narrative",      name: { en: "Narrative-at-the-time", zh: "彼时叙事" },     body: { en: "What everyone said before the failure was visible.",                    zh: "在失败可见之前，所有人都在怎么说。" } },
      { id: "autopsy",        name: { en: "Autopsy",             zh: "剖析" },          body: { en: "What the field eventually concluded, with sources.",                    zh: "该领域最终的结论——附来源。" } },
    ],
    features: [
      { name: { en: "Browse by domain",            zh: "按领域浏览" },              body: { en: "Engineering, biotech, geopolitics, finance, governance.",          zh: "工程、生物技术、地缘、金融、治理。" } },
      { name: { en: "Filter by failure mode",      zh: "按失败模式筛选" },          body: { en: "'Single point of failure', 'denied warnings', 'goal substitution'.", zh: "『单点故障』『拒绝警告』『目标替换』。" } },
      { name: { en: "Random failure of the day",   zh: "今日随机一败" },             body: { en: "Forced confrontation with one historically expensive mistake.",      zh: "强制你与一个历史上昂贵的错误对峙。" } },
    ],
    dataModel: {
      name: { en: "Failure", zh: "Failure（失败）" },
      fields: [
        { key: "id",        type: "uuid",            note: { en: "Failure id",                              zh: "失败 id" } },
        { key: "domain",    type: "enum",            note: { en: "{eng, biotech, geo, finance, gov, social}", zh: "{工程、生物技术、地缘、金融、治理、社会}" } },
        { key: "year",      type: "year",            note: { en: "Year of culmination",                     zh: "失败显现之年份" } },
        { key: "mode",      type: "string[]",        note: { en: "Failure mode tags",                        zh: "失败模式标签" } },
        { key: "loss",      type: "string",          note: { en: "Quantified loss (lives, dollars, missions)", zh: "量化损失（生命、美元、任务）" } },
        { key: "sources",   type: "url[]",           note: { en: "Primary sources",                          zh: "原始来源" } },
      ],
    },
    interactiveKind: "memorial",
    sampleData: {
      cases: [
        { id: "challenger",  year: 1986, label: { en: "Challenger STS-51-L",      zh: "挑战者号 STS-51-L" },     domain: "eng",     mode: ["denied warnings", "schedule pressure"], loss: { en: "7 astronauts", zh: "7 名宇航员" }, blurb: { en: "O-ring brittleness in cold launch; engineers warned and were overruled.", zh: "低温下 O 形圈脆化；工程师警告——被压下。" } },
        { id: "theranos",    year: 2016, label: { en: "Theranos blood-test fraud", zh: "Theranos 血检骗局" },     domain: "biotech", mode: ["unfalsifiable claims", "captured board"], loss: { en: "$10B+ valuation; criminal convictions", zh: "估值 100 亿美元+；刑事定罪" }, blurb: { en: "Edison machine never worked; secrecy + celebrity board enabled long deception.", zh: "Edison 机器从未真正工作；保密 + 名人董事会令长期欺骗成为可能。" } },
        { id: "deepwater",   year: 2010, label: { en: "Deepwater Horizon",         zh: "深水地平线" },             domain: "eng",     mode: ["concentric error", "cost cuts"], loss: { en: "11 dead; ~$60B in damages", zh: "11 人死亡；约 600 亿美元损失" }, blurb: { en: "BP cement-job decisions + missing safety review compounded into blowout.", zh: "BP 的水泥施工决定 + 安全审查缺失——叠加酿成井喷。" } },
        { id: "long-term",   year: 1998, label: { en: "Long-Term Capital Management", zh: "长期资本管理公司" },   domain: "finance", mode: ["model risk", "leverage"], loss: { en: "$4.6B; near-systemic crisis", zh: "46 亿美元；几近系统性危机" }, blurb: { en: "Nobel-laureate-led; assumed Russia couldn't default. It defaulted.", zh: "诺奖得主主导；假设俄罗斯不会违约——结果违约。" } },
        { id: "boeing-737max", year: 2019, label: { en: "Boeing 737 MAX MCAS",     zh: "波音 737 MAX MCAS" },     domain: "eng",     mode: ["regulatory capture", "single sensor"], loss: { en: "346 dead; multi-billion grounding", zh: "346 人死亡；多十亿美元停飞" }, blurb: { en: "Single-sensor MCAS without crew training; FAA delegated review back to Boeing.", zh: "单传感器 MCAS——机组未接受相关培训；FAA 把审查委托回波音自己。" } },
        { id: "wework",      year: 2019, label: { en: "WeWork S-1 collapse",       zh: "WeWork S-1 崩溃" },       domain: "finance", mode: ["governance", "valuation drift"], loss: { en: "Valuation from $47B → $8B", zh: "估值由 470 亿 → 80 亿美元" }, blurb: { en: "S-1 disclosure exposed governance and metrics that private rounds had concealed.", zh: "S-1 披露曝光了私募轮所掩盖的治理与指标。" } },
        { id: "fukushima",   year: 2011, label: { en: "Fukushima Dai-ichi",        zh: "福岛第一核电站" },         domain: "eng",     mode: ["chain failure", "siting"], loss: { en: "Long-term displacement; ~$200B", zh: "长期搬迁；约 2000 亿美元" }, blurb: { en: "Tsunami exceeded design; backup generators in basement; cooling lost.", zh: "海啸超出设计标准；备用发电机置于地下室——冷却失效。" } },
        { id: "minitel",     year: 2010, label: { en: "Minitel sunset",            zh: "Minitel 终结" },           domain: "tech",    mode: ["lock-in", "missed transition"], loss: { en: "France's web lead, never recovered", zh: "法国曾领先的网络优势——再未追回" }, blurb: { en: "Successful national-scale terminal network couldn't migrate to open Internet protocols.", zh: "国家级终端网络的成功——未能迁移到开放互联网协议。" } },
        { id: "deepmind-rl", year: 2018, label: { en: "RL-only AGI bets",          zh: "纯 RL 通往 AGI 的押注" }, domain: "tech",    mode: ["paradigm overcommit"], loss: { en: "Years redirected", zh: "数年研究方向偏移" }, blurb: { en: "Belief reinforcement learning was the path. Foundation models came from elsewhere.", zh: "曾相信强化学习是通路——基础模型由别处而来。" } },
        { id: "bay-of-pigs", year: 1961, label: { en: "Bay of Pigs invasion",      zh: "猪湾事件" },               domain: "geo",     mode: ["groupthink", "intel rejection"], loss: { en: "U.S. credibility; Cuban-Soviet alignment", zh: "美方信誉；古—苏联结盟" }, blurb: { en: "Plan inherited from Eisenhower team; dissenting analyses suppressed.", zh: "继承自艾森豪威尔团队的方案；不同意见被压下。" } },
        { id: "concorde",    year: 2003, label: { en: "Concorde retired",          zh: "协和客机退役" },           domain: "eng",     mode: ["TAM mis-estimation"], loss: { en: "27-year operating loss", zh: "27 年运营亏损" }, blurb: { en: "Engineering triumph; market for routine supersonic civil flight didn't materialize.", zh: "工程上的胜利；常态化超音速民航市场——并未成形。" } },
        { id: "kyoto",       year: 2012, label: { en: "Kyoto Protocol expiry",     zh: "《京都议定书》到期" },     domain: "gov",     mode: ["non-compliance", "scope"], loss: { en: "Lost decade for emissions reduction", zh: "温室气体减排被推迟一代人" }, blurb: { en: "Top-down hard caps without binding enforcement; major emitters opted out.", zh: "自上而下的硬性上限——无强制力；主要排放国选择退出。" } },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────
  {
    id: "knowledge-compression-engine",
    slug: "knowledge-compression-engine",
    name: { en: "Knowledge Compression Engine", zh: "知识压缩引擎" },
    hue: "#3a6e62",
    glyph: "▽",
    oneLine: {
      en: "Any domain, compressed into a 3-hour understanding experience: 12 concepts, in dependency order, with the smallest possible example for each.",
      zh: "任一领域，压缩为 3 小时的理解体验：12 个概念，按依赖顺序，每个配最小可能的示例。",
    },
    body: {
      en: "The fastest path through any technical domain is not the textbook order — it is the dependency order. Twelve concepts, taught in the order in which each one becomes possible to grasp, with the smallest example that demonstrates each. The result: in three hours of attention, a new entrant has the working model that lets them read the field's actual literature.\n\nThis platform is the schema for that. Pick a domain — quantum mechanics, double-entry bookkeeping, plate tectonics, transformer architecture. The system gives you the 12-node compression with concept dependencies visualized as a graph. You move through the graph in topological order; at each node, the explanation is the minimum required, and the worked example is the minimum that proves it.",
      zh: "穿越任一技术领域的最快路径——不是教科书的顺序，而是依赖顺序。十二个概念，按『每一个变得可能被理解』的顺序教授，每个配能展示它的最小示例。结果：用三小时的注意力——新手便有了那种能让他读懂该领域真实文献的工作模型。\n\n本平台是这件事的架构。选一个领域——量子力学、复式记账、板块构造、Transformer 架构。系统给你 12 节点的压缩——概念依赖以图呈现。你按拓扑顺序在图上前进；每个节点的解释皆为所需最少，配的样例也是足以证明它的最小者。",
    },
    modules: [
      { id: "domain-graph",  name: { en: "Domain compression graphs", zh: "领域压缩图" }, body: { en: "12-node DAG per domain.",                                            zh: "每领域一张 12 节点的 DAG。" } },
      { id: "min-examples",  name: { en: "Minimum-viable examples",   zh: "最小示例" },     body: { en: "The smallest worked example that proves each concept.",              zh: "能证明每个概念的最小可行例。" } },
      { id: "topo-walker",   name: { en: "Topological walker",        zh: "拓扑漫游" },     body: { en: "Walk a domain in dependency order; backtrack when stuck.",           zh: "按依赖顺序穿过一个领域——卡住可回退。" } },
      { id: "checkpoints",   name: { en: "Checkpoints",               zh: "检查点" },       body: { en: "Per-node 5-question check; you can't move on until ≥4 right.",       zh: "每节点 5 题检查——答对 ≥4 题方可前进。" } },
      { id: "library",       name: { en: "Domain library",            zh: "领域库" },       body: { en: "Initial 30 domains; community contributions accepted.",              zh: "初始 30 个领域；接受社区贡献。" } },
    ],
    features: [
      { name: { en: "3-hour timer per domain",            zh: "每领域 3 小时计时" },     body: { en: "Targeted attention budget.",                                        zh: "目标注意力预算。" } },
      { name: { en: "Visual dependency graph",            zh: "可视依赖图" },             body: { en: "See the 12 concepts and the order in which they unlock.",           zh: "看到 12 个概念以及它们解锁的顺序。" } },
      { name: { en: "Compression health check",           zh: "压缩健康检查" },           body: { en: "Did your example actually show the principle? Did your prereqs hold?", zh: "你给的示例真的展示了原理吗？前置成立吗？" } },
    ],
    dataModel: {
      name: { en: "Domain", zh: "Domain（领域）" },
      fields: [
        { key: "id",          type: "uuid",          note: { en: "Domain id",                          zh: "领域 id" } },
        { key: "concepts",    type: "Concept[12]",   note: { en: "Exactly 12 concepts in dependency order", zh: "恰好 12 个概念，按依赖顺序" } },
        { key: "min_examples",type: "Example[12]",   note: { en: "One minimal worked example per concept",  zh: "每个概念配一个最小工作示例" } },
        { key: "checkpoints", type: "Question[60]",  note: { en: "5 questions × 12 nodes",                  zh: "5 题 × 12 节点" } },
      ],
    },
    interactiveKind: "compression",
    sampleData: {
      domain: { en: "Double-entry bookkeeping", zh: "复式记账" },
      concepts: [
        { i: 1,  label: { en: "Account",                        zh: "账户" },             deps: [] },
        { i: 2,  label: { en: "Debit & Credit",                 zh: "借与贷" },           deps: [1] },
        { i: 3,  label: { en: "T-account",                      zh: "T 形账" },           deps: [2] },
        { i: 4,  label: { en: "Journal entry",                  zh: "分录" },             deps: [3] },
        { i: 5,  label: { en: "Trial balance",                  zh: "试算平衡" },          deps: [4] },
        { i: 6,  label: { en: "Asset / Liability / Equity",     zh: "资产／负债／权益" },   deps: [1] },
        { i: 7,  label: { en: "Accounting equation",            zh: "会计恒等式" },        deps: [6] },
        { i: 8,  label: { en: "Income statement",               zh: "利润表" },            deps: [7,5] },
        { i: 9,  label: { en: "Balance sheet",                  zh: "资产负债表" },         deps: [7,5] },
        { i: 10, label: { en: "Cash-flow statement",            zh: "现金流量表" },         deps: [9,8] },
        { i: 11, label: { en: "Accrual vs cash basis",          zh: "权责发生制 vs 收付实现制" }, deps: [8] },
        { i: 12, label: { en: "Working capital",                zh: "营运资本" },           deps: [9,11] },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────
  {
    id: "human-memory-project",
    slug: "human-memory-project",
    name: { en: "Human Memory Project", zh: "人类记忆计划" },
    hue: "#9a4d6e",
    glyph: "❉",
    oneLine: {
      en: "An open archive of ordinary lives — collected, indexed, made searchable so future humans (and machines) can know who we were.",
      zh: "一份普通人的开放档案——被收集、被索引、可被搜索——使未来的人（与机器）能知道我们曾是谁。",
    },
    body: {
      en: "The historical record has always belonged to the famous. The Human Memory Project flips this: ordinary lives, in their own words, structured for posterity. A contributor uploads a structured account of their life — places lived, work done, people loved, beliefs held, eras witnessed — under a permissive license. The archive is then indexed, made searchable, and made queryable in natural language: 'what did people in Wuhan in 1985 think about the future?' returns first-person accounts.\n\nThis is not a social network. There are no likes, no feed. It is a library — a deliberate, slow, careful infrastructure for the part of human experience that historically goes unrecorded.",
      zh: "历史记录一向属于名人。Human Memory Project 把这反过来：普通人的人生，用他们自己的话，按形式收纳，留给后世。投稿人上传一份关于自己一生的结构化叙述——住过的地方、做过的工作、爱过的人、抱持的信念、见证过的时代——以宽松许可发布。档案随后被索引、可搜索，并可被自然语言查询：『1985 年武汉的人们怎么想未来？』返回第一人称叙述。\n\n这不是社交网络——没有点赞、没有信息流。它是一座图书馆——一份刻意、缓慢、谨慎的基础设施，承载历史上一向不被记录的那一部分人类经验。",
    },
    modules: [
      { id: "structured-form", name: { en: "Structured submission",  zh: "结构化投稿" },   body: { en: "12-section template that produces well-indexed life records.",        zh: "12 段式模板——产出可良好索引的人生记录。" } },
      { id: "license",         name: { en: "Permissive license",     zh: "宽松许可" },     body: { en: "CC0 or CC-BY by default; contributor chooses.",                       zh: "默认 CC0 或 CC-BY；由投稿人选择。" } },
      { id: "search",          name: { en: "Natural-language search",zh: "自然语言搜索" }, body: { en: "Ask the corpus questions; get first-person accounts back.",           zh: "向文集提问——得到第一人称叙述。" } },
      { id: "anonymization",   name: { en: "Anonymization tool",     zh: "匿名化工具" },   body: { en: "Strip names; keep places, dates, professions.",                       zh: "去除姓名——保留地点、日期、职业。" } },
      { id: "preservation",    name: { en: "Preservation",           zh: "保存" },         body: { en: "IPFS pinning + university partner mirror.",                            zh: "IPFS 钉住 + 大学伙伴镜像。" } },
    ],
    features: [
      { name: { en: "Submit your own life record",            zh: "提交你自己的人生记录" },        body: { en: "30-90 minute structured form. Auto-saves.",                       zh: "30–90 分钟的结构化表格——自动保存。" } },
      { name: { en: "Search by era + place + question",       zh: "按时代 + 地点 + 问题 搜索" },   body: { en: "Find first-person accounts by joint filter.",                     zh: "联合筛选找第一人称叙述。" } },
      { name: { en: "Anonymous mode",                         zh: "匿名模式" },                    body: { en: "Submit and search without revealing identity.",                   zh: "无须暴露身份即可提交与搜索。" } },
    ],
    dataModel: {
      name: { en: "LifeRecord", zh: "LifeRecord（人生记录）" },
      fields: [
        { key: "id",       type: "uuid",     note: { en: "Record id (anonymous by default)", zh: "记录 id（默认匿名）" } },
        { key: "born",     type: "year",     note: { en: "Birth year (decade-bin acceptable)", zh: "出生年（可填十年区间）" } },
        { key: "places",   type: "Place[]",  note: { en: "Places lived, in order",            zh: "依序所居之地" } },
        { key: "work",     type: "Stint[]",  note: { en: "Work history",                       zh: "工作经历" } },
        { key: "beliefs",  type: "string[]", note: { en: "Belief shifts over time",            zh: "随时间的信念转变" } },
        { key: "license",  type: "enum",     note: { en: "{CC0, CC-BY, CC-BY-SA}",             zh: "{CC0、CC-BY、CC-BY-SA}" } },
      ],
    },
    interactiveKind: "memory",
    sampleData: {
      // sample first-person snippets (synthetic but representative)
      records: [
        { id: "r-001", born: 1932, place: { en: "rural Sichuan", zh: "四川农村" },     era: { en: "Great Leap Famine", zh: "大跃进饥荒" },     snippet: { en: "We ate the bark off the trees the second winter. The third winter there was no bark.", zh: "第二个冬天我们吃树皮——到第三个冬天，树皮也没了。" } },
        { id: "r-002", born: 1950, place: { en: "Brooklyn",     zh: "布鲁克林" },       era: { en: "1970s blackouts",   zh: "1970 年代停电" },    snippet: { en: "When the power went out in '77, my father sat on the front step with a baseball bat all night. The neighborhood looked after itself.", zh: "1977 年停电那夜，父亲拿着棒球棒坐在门前台阶整整一夜。整条街自己照看着自己。" } },
        { id: "r-003", born: 1965, place: { en: "Shenzhen",      zh: "深圳" },          era: { en: "Reform & Opening",   zh: "改革开放" },         snippet: { en: "I was 14 when I first saw a foreign factory. By 30 my whole village was a city.", zh: "我十四岁第一次见到外资工厂。到三十岁，我整个村已经成了一座城。" } },
        { id: "r-004", born: 1972, place: { en: "Sarajevo",      zh: "萨拉热窝" },       era: { en: "Siege of Sarajevo", zh: "萨拉热窝围城" },      snippet: { en: "We learned which streets you could cross at noon and which you couldn't. The map of the city changed every day.", zh: "我们学会了哪些街正午可以过、哪些不能过。城市的地图——每天都在变。" } },
        { id: "r-005", born: 1980, place: { en: "Bangalore",     zh: "班加罗尔" },        era: { en: "Y2K outsourcing",   zh: "千禧年外包潮" },     snippet: { en: "My father drove a rickshaw. I write code for a London bank. The two of us still share dinner.", zh: "我父亲拉人力车。我给一家伦敦银行写代码——我们俩还一起吃晚饭。" } },
        { id: "r-006", born: 1985, place: { en: "Lagos",         zh: "拉各斯" },         era: { en: "Mobile-money rise",  zh: "手机支付兴起" },     snippet: { en: "Before M-Pesa I sent money home in someone's pocket. After, I sent it in fifteen seconds.", zh: "在 M-Pesa 之前，我把钱托人捎回家。之后——十五秒就到。" } },
        { id: "r-007", born: 1990, place: { en: "Reykjavík",     zh: "雷克雅未克" },     era: { en: "Iceland's 2008 crash", zh: "冰岛 2008 崩溃" },   snippet: { en: "When the bank fell, my parents lost their savings. Then they wrote a new constitution.", zh: "银行倒闭那年，父母的积蓄没了——然后他们写了一部新宪法。" } },
        { id: "r-008", born: 1995, place: { en: "Wuhan",         zh: "武汉" },           era: { en: "Pandemic 2020",       zh: "2020 大流行" },      snippet: { en: "My grandmother's funeral was on a screen. I rewatched it three times that month.", zh: "祖母的葬礼是在屏幕上看的——那个月我重看了三遍。" } },
      ],
    },
  },
];

export const PLATFORM_BY_ID: Record<string, Platform> = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]));

export const ECOSYSTEM_NAME: Bilingual = { en: "civlab · Civilization-Scale Startup Lab", zh: "civlab · 文明级创业实验室" };

export const PILLARS: Bilingual[] = [
  { en: "AI-first",    zh: "AI 优先" },
  { en: "Graph-native",zh: "图原生" },
  { en: "Bilingual",   zh: "双语" },
  { en: "Open data",   zh: "数据开放" },
  { en: "Source-cited",zh: "有据可依" },
];
