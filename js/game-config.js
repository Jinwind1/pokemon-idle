// ============================================================
// 游戏配置数据 - 徽章、宝石、树果系统
// ============================================================

// ===================== 基础常量 =====================
const MAX_POKEMON_LEVEL = 9999; // 宝可梦等级上限

// ===================== 徽章配置 =====================
const BADGE_DATA = {
    kanto: {
        name: '关都徽章',
        icon: '🏅',
        description: '通关关都地区获得',
        effect: '解锁金币掉落：击败宝可梦后可以获得金币',
        effectType: 'unlock_gold',
    },
    johto: {
        name: '城都徽章',
        icon: '🎖️',
        description: '城都地区解锁后，完成城都图鉴获得',
        effect: '获取金币提高 100%',
        effectType: 'gold_bonus',
        value: 1.0, // +100%
    },
    hoenn: {
        name: '丰缘徽章',
        icon: '🌟',
        description: '丰缘地区解锁后，完成丰缘图鉴获得',
        effect: '经验值获取提高 50%',
        effectType: 'exp_bonus',
        value: 0.5, // +50%
    },
    sinnoh: {
        name: '神奥徽章',
        icon: '💎',
        description: '神奥地区解锁后，完成神奥图鉴获得',
        effect: '闪光宝可梦出现概率提高 100%',
        effectType: 'shiny_bonus',
        value: 1.0, // +100% (闪光概率翻倍)
    },
    unova: {
        name: '合众徽章',
        icon: '⚡',
        description: '合众地区解锁后，完成合众图鉴获得',
        effect: '已6V且闪光的宝可梦出现概率降低',
        effectType: 'completed_weight_reduce',
        value: 9 / 10, // 权重减少 9/10
    },
    kalos: {
        name: '卡洛斯徽章',
        icon: '🌸',
        description: '卡洛斯地区解锁后，完成卡洛斯图鉴获得',
        effect: '树果成熟时间减半',
        effectType: 'berry_time_bonus',
        value: 0.5, // 成熟时间 ×0.5（减半）
    },
    alola: {
        name: '阿罗拉徽章',
        icon: '🌺',
        description: '阿罗拉地区解锁后，完成阿罗拉图鉴获得',
        effect: '获取宝石时属性数值偏向更高值',
        effectType: 'gem_value_bonus',
        value: 0.5, // 属性值在 min~max 范围内偏向高值（加权50%）
    },
    galar: {
        name: '伽勒尔徽章',
        icon: '⚙️',
        description: '伽勒尔地区解锁后，完成伽勒尔图鉴获得',
        effect: '收获树果数量翻倍',
        effectType: 'berry_yield_bonus',
        value: 2, // 收获数量 ×2
    },
    paldea: {
        name: '帕底亚徽章',
        icon: '💎',
        description: '帕底亚地区解锁后，完成帕底亚图鉴获得',
        effect: '最大离线时间增加到48小时',
        effectType: 'offline_time_bonus',
        value: 48 * 60 * 60 * 1000, // 48小时（毫秒）
    },
};

// ===================== 宝石系统配置 =====================
const GEM_QUALITIES = [
    { id: 'common',    name: '普通', color: '#a0a0a0', attrCount: 1, weight: 10000, price: 100 },
    { id: 'magic',     name: '魔法', color: '#2ecc71', attrCount: 2, weight: 1000, price: 300 },
    { id: 'rare',      name: '稀有', color: '#3498db', attrCount: 3, weight: 100, price: 800 },
    { id: 'epic',      name: '史诗', color: '#9b59b6', attrCount: 4, weight: 10,  price: 2000 },
    { id: 'mythic',    name: '神话', color: '#f39c12', attrCount: 5, weight: 1,  price: 5000 },
    { id: 'legendary', name: '传说', color: '#e74c3c', attrCount: 6, weight: 0.1, price: 10000 },
    { id: 'eternal',   name: '永恒', color: '#00d2ff', attrCount: 8, weight: 0.01, price: 25000 },
];

const GEM_ATTRIBUTES = [
    { id: 'crit_rate',       name: '会心一击概率',         min: 1,  max: 5,  unit: '%',  icon: '💥' },
    { id: 'hp_bonus',        name: '生命值',               min: 1,  max: 5,  unit: '%',  icon: '❤️' },
    { id: 'atk_bonus',       name: '攻击力',               min: 1,  max: 5,  unit: '%',  icon: '⚔️' },
    { id: 'def_bonus',       name: '防御力',               min: 1,  max: 5,  unit: '%',  icon: '🛡️' },
    { id: 'speed_bonus',     name: '速度',                 min: 1,  max: 5,  unit: '%',  icon: '💨' },
    { id: 'dodge_rate',      name: '闪避概率',             min: 1,  max: 5,  unit: '%',  icon: '💫' },
];

const GEM_BAG_MAX = 100;

// ===================== 树果系统配置 =====================
const BERRY_DATA = {
    hp_berry:    { id: 'hp_berry',    name: '体力树果',  icon: '🍎', stat: 'hp',    color: '#e74c3c' },
    atk_berry:   { id: 'atk_berry',   name: '攻击树果',  icon: '🍊', stat: 'atk',   color: '#e67e22' },
    def_berry:   { id: 'def_berry',   name: '防御树果',  icon: '🍋', stat: 'def',   color: '#f1c40f' },
    spAtk_berry: { id: 'spAtk_berry', name: '特攻树果',  icon: '🍇', stat: 'spAtk', color: '#9b59b6' },
    spDef_berry: { id: 'spDef_berry', name: '特防树果',  icon: '🫐', stat: 'spDef', color: '#3498db' },
    speed_berry: { id: 'speed_berry', name: '速度树果',  icon: '🍑', stat: 'speed', color: '#2ecc71' },
};
const BERRY_SEED_PRICE = 50000;      // 种子价格（金币）
const BERRY_PLOT_MAX = 10;           // 最大种植空地
const BERRY_GROW_TIME = 5 * 60 * 60 * 1000; // 5小时成熟（毫秒）
const BERRY_STAT_BONUS = 5;          // 每个树果增加种族值基础数值+5
const BERRY_STAT_CAP = 255;          // 每只宝可梦单独种族值上限255

// ===================== 技能系统配置 =====================
const SKILL_LEVEL_REQUIREMENT = 1000; // 升级技能所需最低等级
const MAX_SKILL_LEVEL = 8;            // 技能最大等级

// 每个属性8个等级的技能，严格按伤害递增排列（招式名和威力参考官方原版数据）
// 技能等级>0时，战斗中使用对应技能替代固定威力50
const SKILL_DATA = {
    normal: [
        { level: 1,  name: '高速星星',   power: 60  },
        { level: 2,  name: '劈开',       power: 70  },
        { level: 3,  name: '怪力',       power: 80  },
        { level: 4,  name: '攀岩',       power: 90  },
        { level: 5,  name: '强力钻',     power: 100 },
        { level: 6,  name: '舍身冲撞',   power: 120 },
        { level: 7,  name: '爆音波',     power: 140 },
        { level: 8,  name: '破坏光线',   power: 150 },
    ],
    fire: [
        { level: 1,  name: '火焰轮',     power: 60  },
        { level: 2,  name: '火焰拳',     power: 75  },
        { level: 3,  name: '火焰踢',     power: 85  },
        { level: 4,  name: '热风',       power: 95  },
        { level: 5,  name: '大字爆炎',   power: 110 },
        { level: 6,  name: '闪焰冲锋',   power: 120 },
        { level: 7,  name: '过热',       power: 130 },
        { level: 8,  name: '爆炸烈焰',   power: 150 },
    ],
    water: [
        { level: 1,  name: '水之波动',   power: 60  },
        { level: 2,  name: '水波刀',     power: 70  },
        { level: 3,  name: '热水',       power: 80  },
        { level: 4,  name: '冲浪',       power: 90  },
        { level: 5,  name: '蟹锤击',     power: 100 },
        { level: 6,  name: '加农水炮',   power: 110 },
        { level: 7,  name: '波动冲',     power: 120 },
        { level: 8,  name: '水炮',       power: 150 },
    ],
    electric: [
        { level: 1,  name: '电击波',     power: 60  },
        { level: 2,  name: '雷电拳',     power: 75  },
        { level: 3,  name: '放电',       power: 80  },
        { level: 4,  name: '十万伏特',   power: 90  },
        { level: 5,  name: '打雷',       power: 110 },
        { level: 6,  name: '电磁炮',     power: 120 },
        { level: 7,  name: '雷击',       power: 130 },
        { level: 8,  name: '电光束',     power: 150 },
    ],
    grass: [
        { level: 1,  name: '魔法叶',     power: 60  },
        { level: 2,  name: '亿万吸取',   power: 75  },
        { level: 3,  name: '种子炸弹',   power: 80  },
        { level: 4,  name: '能量球',     power: 90  },
        { level: 5,  name: '叶刃',       power: 90  },
        { level: 6,  name: '强力鞭打',   power: 120 },
        { level: 7,  name: '飞叶风暴',   power: 130 },
        { level: 8,  name: '疯狂植物',   power: 150 },
    ],
    ice: [
        { level: 1,  name: '极光束',     power: 65  },
        { level: 2,  name: '冰冻拳',     power: 75  },
        { level: 3,  name: '冰柱坠击',   power: 85  },
        { level: 4,  name: '冰冻光线',   power: 90  },
        { level: 5,  name: '冰锤',       power: 100 },
        { level: 6,  name: '雪矛',       power: 120 },
        { level: 7,  name: '极寒冷焰',   power: 140 },
        { level: 8,  name: '冷冻伏特',   power: 150 },
    ],
    fighting: [
        { level: 1,  name: '回旋踢',     power: 60  },
        { level: 2,  name: '借力摔',     power: 70  },
        { level: 3,  name: '波导弹',     power: 80  },
        { level: 4,  name: '圣剑',       power: 90 },
        { level: 5,  name: '飞身重压',   power: 100 },
        { level: 6,  name: '蛮力',       power: 120 },
        { level: 7,  name: '飞膝踢',     power: 130 },
        { level: 8,  name: '流星突击',   power: 150 },
    ],
    poison: [
        { level: 1,  name: '毒液冲击',   power: 65  },
        { level: 2,  name: '十字毒刃',   power: 70  },
        { level: 3,  name: '毒击',       power: 80  },
        { level: 4,  name: '污泥炸弹',   power: 90  },
        { level: 5,  name: '污泥波',     power: 95  },
        { level: 6,  name: '剧毒暴冲',   power: 100  },
        { level: 7,  name: '打嗝',       power: 120 },
        { level: 8,  name: '垃圾射击',   power: 150 },
    ],
    ground: [
        { level: 1,  name: '重踏',      power: 60  },
        { level: 2,  name: '泥巴炸弹',   power: 65  },
        { level: 3,  name: '发脾气',     power: 75  },
        { level: 4,  name: '挖洞',       power: 80  },
        { level: 5,  name: '大地之力',   power: 90  },
        { level: 6,  name: '地震',      power: 100  },
        { level: 7,  name: '突飞猛扑',   power: 120 },
        { level: 8,  name: '断崖之剑',   power: 150 },
    ],
    flying: [
        { level: 1,  name: '翅膀攻击',   power: 60  },
        { level: 2,  name: '空气斩',     power: 75  },
        { level: 3,  name: '飞翔',       power: 90  },
        { level: 4,  name: '气旋攻击',   power: 100 },
        { level: 5,  name: '暴风',       power: 110 },
        { level: 6,  name: '勇鸟猛攻',   power: 120 },
        { level: 7,  name: '画龙点睛',   power: 130 },
        { level: 8,  name: '神鸟猛击',   power: 150 },
    ],
    psychic: [
        { level: 1,  name: '幻象光线',   power: 65  },
        { level: 2,  name: '精神利刃',   power: 70  },
        { level: 3,  name: '意念头锤',   power: 80  },
        { level: 4,  name: '精神强念',   power: 90  },
        { level: 5,  name: '精神击破',   power: 100 },
        { level: 6,  name: '预知未来',   power: 110 },
        { level: 7,  name: '同步干扰',   power: 130 },
        { level: 8,  name: '棱镜镭射',   power: 160 },
    ],
    bug: [
        { level: 1,  name: '虫咬',       power: 60  },
        { level: 2,  name: '急速折返',   power: 70  },
        { level: 3,  name: '十字剪',     power: 80  },
        { level: 4,  name: '迎头一击',   power: 90  },
        { level: 5,  name: '虫鸣',       power: 100  },
        { level: 6,  name: '攻击指令',   power: 110  },
        { level: 7,  name: '花粉团',     power: 120  },
        { level: 8,  name: '超级角击',   power: 150  },
    ],
    rock: [
        { level: 1,  name: '原始之力',   power: 60  },
        { level: 2,  name: '岩崩',       power: 75  },
        { level: 3,  name: '力量宝石',   power: 80  },
        { level: 4,  name: '强刃攻击',   power: 95  },
        { level: 5,  name: '钻石风暴',   power: 100 },
        { level: 6,  name: '流星光束',   power: 120 },
        { level: 7,  name: '双刃头锤',   power: 130 },
        { level: 8,  name: '岩石炮',     power: 150 },
    ],
    ghost: [
        { level: 1,  name: '影子拳',     power: 60  },
        { level: 2,  name: '暗影爪',     power: 70  },
        { level: 3,  name: '暗影球',     power: 80  },
        { level: 4,  name: '暗影之骨',   power: 85  },
        { level: 5,  name: '潜影奇袭',   power: 90  },
        { level: 6,  name: '暗影之光',   power: 100 },
        { level: 7,  name: '暗影潜袭',    power: 120 },
        { level: 8,  name: '星碎',       power: 150 },
    ],
    dragon: [
        { level: 1,  name: '龙息',       power: 60  },
        { level: 2,  name: '龙爪',       power: 80  },
        { level: 3,  name: '龙锤',       power: 90  },
        { level: 4,  name: '龙之俯冲',   power: 100 },
        { level: 5,  name: '逆鳞',       power: 120 },
        { level: 6,  name: '流星群',     power: 130 },
        { level: 7,  name: '时光咆哮',   power: 150 },
        { level: 8,  name: '无极光束',   power: 160 },
    ],
    dark: [
        { level: 1,  name: '咬住',       power: 60  },
        { level: 2,  name: '暗袭要害',   power: 70  },
        { level: 3,  name: '咬碎',       power: 80  },
        { level: 4,  name: '恶之波动',   power: 90  },
        { level: 5,  name: '暗黑爆破',   power: 100  },
        { level: 6,  name: '怒火中烧',   power: 110  },
        { level: 7,  name: '移花接木',   power: 120 },
        { level: 8,  name: '异次元猛攻', power: 150 },
    ],
    steel: [
        { level: 1,  name: '钢拳双击',   power: 60  },
        { level: 2,  name: '钢翼',      power: 70  },
        { level: 3,  name: '铁头',      power: 80  },
        { level: 4,  name: '彗星拳',    power: 90  },
        { level: 5,  name: '铁尾',      power: 100  },
        { level: 6,  name: '淘金潮',     power: 120 },
        { level: 7,  name: '破灭之愿',   power: 140 },
        { level: 8,  name: '巨力锤',     power: 160 },
    ],
    fairy: [
        { level: 1,  name: '妖精之风',   power: 60  },
        { level: 2,  name: '魅惑之声',   power: 70  },
        { level: 3,  name: '吸取之吻',   power: 80  },
        { level: 4,  name: '魔法闪耀',   power: 90  },
        { level: 5,  name: '嬉闹',       power: 100  },
        { level: 6,  name: '月亮之力',   power: 110  },
        { level: 7,  name: '花朵加农炮', power: 130 },
        { level: 8,  name: '破灭之光',   power: 150 },
    ],
};

// ===================== 天赋系统配置 =====================
const TALENT_RESET_COST = 1000000; // 重置天赋花费100万金币
const TALENT_MAX_LEVEL = 100;      // 天赋最大等级
const TALENT_DATA = {
    exp_bonus: {
        id: 'exp_bonus',
        name: '经验值额外增加',
        icon: '📚',
        description: '击败宝可梦获得的经验值额外增加',
        maxLevel: 100,
        perLevel: 1,
        unit: '%',
        category: 'growth',
    },
    gold_bonus: {
        id: 'gold_bonus',
        name: '金币额外增加',
        icon: '🪙',
        description: '击败宝可梦获得的金币额外增加',
        maxLevel: 100,
        perLevel: 1,
        unit: '%',
        category: 'growth',
    },
    shiny_bonus: {
        id: 'shiny_bonus',
        name: '闪光概率额外增加',
        icon: '✨',
        description: '遇到闪光宝可梦的概率额外增加',
        maxLevel: 100,
        perLevel: 1,
        unit: '%',
        category: 'growth',
    },
    gem_common_reduce: {
        id: 'gem_common_reduce',
        name: '普通宝石概率降低',
        icon: '💎',
        description: '购买宝石时出现普通宝石的概率降低',
        maxLevel: 100,
        perLevel: 1,
        unit: '%',
        category: 'resource',
    },
    berry_time_reduce: {
        id: 'berry_time_reduce',
        name: '树果成熟时间缩短',
        icon: '🌱',
        description: '树果成熟所需时间缩短',
        maxLevel: 100,
        perLevel: 1,
        unit: '分钟',
        category: 'resource',
    },
    crit_damage_bonus: {
        id: 'crit_damage_bonus',
        name: '会心一击伤害增加',
        icon: '💥',
        description: '会心一击的伤害倍率增加（原本150%基础上增加）',
        maxLevel: 100,
        perLevel: 1,
        unit: '%',
        category: 'battle',
    },
    team_exp_bonus: {
        id: 'team_exp_bonus',
        name: '野生怪物等级提升',
        icon: '👥',
        description: '提高野外遇到的怪物等级，满级时全图怪物均为30000级（挑战塔除外）',
        maxLevel: 100,
        perLevel: 1,
        unit: '',
        category: 'growth',
    },
    pokedex_exp_bonus: {
        id: 'pokedex_exp_bonus',
        name: '图鉴内宝可梦获得经验增加',
        icon: '📖',
        description: '不在队伍中的已捕获宝可梦获得的经验额外增加',
        maxLevel: 100,
        perLevel: 1,
        unit: '%',
        category: 'growth',
    },
    skill_stat_bonus: {
        id: 'skill_stat_bonus',
        name: '宝可梦全属性增加',
        icon: '⚡',
        description: '基于技能等级之和，增加宝可梦全属性百分比',
        maxLevel: 100,
        perLevel: 0.0002,
        unit: '%',
        category: 'battle',
        special: '技能等级之和×每级0.0002%',
    },
    gem_attr_boost: {
        id: 'gem_attr_boost',
        name: '宝石属性出现概率增加',
        icon: '🔮',
        description: '选择一条宝石属性，使其在生成宝石时出现概率增加',
        maxLevel: 100,
        perLevel: 1,
        unit: '%',
        category: 'resource',
        special: '需选择目标属性',
    },
};

// 天赋分类
const TALENT_CATEGORIES = {
    growth: { name: '成长', icon: '📈' },
    battle: { name: '战斗', icon: '⚔️' },
    resource: { name: '资源', icon: '💰' },
};

// ===================== 挑战塔配置 =====================
const TOWER_MAX_FLOOR = 200;            // 最高层数
const TOWER_ENEMIES_PER_FLOOR = 6;      // 每层敌人数量
const TOWER_BASE_LEVEL = 18000;         // 第1层怪物等级
const TOWER_LEVEL_INCREMENT = 1000;      // 每层等级递增
const TOWER_MIN_BASE_STAT_TOTAL = 500;  // 候选怪物种族值总和下限

// ===================== 离线模拟配置 =====================
const MAX_OFFLINE_TIME = 24 * 60 * 60 * 1000;  // 离线模拟上限24小时（毫秒）
const OFFLINE_BATCH_SIZE = 200;                  // 每批模拟战斗数
