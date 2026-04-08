// ============================================================
// 地区与道路数据 - 等级逐步提升，无重叠
// ============================================================
//
// 【道路等级规则】（新增地区时请参考）
//
//  地区序号 | 地区名称 | 道路数 | 每条道路等级跨度 | 等级范围
//  ---------|----------|--------|------------------|----------
//     1     | 关都     |  27条  |     5级          | 1 - 135
//     2     | 城都     |  24条  |  5~10级          | 136 - 300
//     3     | 丰缘     |  24条  |    15级          | 301 - 660
//     4     | 神奥     |  24条  |    20级          | 661 - 1140
//     5     | 合众     |  23条  |    25级          | 1141 - 1715
//     6     | 卡洛斯   |  23条  |    30级          | 1716 - 2410
//     7     | 阿罗拉   |  14条  |  60~100级        | 2411 - 3600
//     8     | 伽勒尔   |  15条  |   200级          | 3601 - 6600
//     9     | 帕底亚   |  14条  | 500~1000级       | 6601 - 17000
//    10     | Mega进化 |  10条  |   1500级         | 17001 - 32000
//
// 规则说明：
//   - 新地区的起始等级 = 上一个地区最后一条道路的最高等级 + 1。
//   - 每条道路的等级范围 = [上一条道路最高等级+1, 上一条道路最高等级+跨度]。
//   - 传说/幻之宝可梦的等级范围应设置在对应道路等级范围的末尾附近。
//
// ============================================================

const REGIONS = {
    kanto: {
        id: 'kanto',
        name: '关都地区',
        nameEn: 'Kanto',
        description: '初代宝可梦的故乡，拥有丰富的地形和多样的宝可梦。',
        routes: [
            {
                id: 'kanto_route1',
                name: '1号道路',
                description: '真新镇到常磐市之间的道路',
                levelRange: [1, 5],
                pokemon: [
                    { id: 19, weight: 55, levelRange: [1, 4] },  // 小拉达
                    { id: 16, weight: 45, levelRange: [1, 5] },  // 波波
                ]
            },
            {
                id: 'kanto_route2',
                name: '2号道路',
                description: '常磐市到常磐森林之间的道路',
                levelRange: [6, 10],
                pokemon: [
                    { id: 16, weight: 30, levelRange: [6, 10] },  // 波波
                    { id: 19, weight: 30, levelRange: [6, 10] },  // 小拉达
                    { id: 10, weight: 20, levelRange: [6, 10] },  // 绿毛虫
                    { id: 13, weight: 20, levelRange: [6, 10] },  // 独角虫
                ]
            },
            {
                id: 'kanto_viridian_forest',
                name: '常磐森林',
                description: '一片茂密的森林，虫系宝可梦的天堂',
                levelRange: [11, 15],
                pokemon: [
                    { id: 10, weight: 25, levelRange: [11, 15] },  // 绿毛虫
                    { id: 13, weight: 25, levelRange: [11, 15] },  // 独角虫
                    { id: 46, weight: 25, levelRange: [11, 15] },  // 派拉斯
                    { id: 11, weight: 10, levelRange: [11, 15] },  // 铁甲蛹
                    { id: 14, weight: 10, levelRange: [11, 15] },  // 铁壳蛹
                    { id: 25, weight: 5, levelRange: [11, 15] },   // 皮卡丘（稀有）
                ]
            },
            {
                id: 'kanto_route3',
                name: '3号道路',
                description: '尼比市到月见山之间的道路',
                levelRange: [16, 20],
                pokemon: [
                    { id: 21, weight: 30, levelRange: [16, 20] }, // 烈雀
                    { id: 27, weight: 20, levelRange: [16, 20] }, // 穿山鼠
                    { id: 32, weight: 20, levelRange: [16, 20] }, // 尼多朗
                    { id: 29, weight: 20, levelRange: [16, 20] }, // 尼多兰
                    { id: 39, weight: 10, levelRange: [16, 20] },  // 胖丁
                ]
            },
            {
                id: 'kanto_mt_moon',
                name: '月见山',
                description: '连接尼比市和华蓝市的山洞',
                levelRange: [21, 25],
                pokemon: [
                    { id: 41, weight: 35, levelRange: [21, 25] }, // 超音蝠
                    { id: 74, weight: 25, levelRange: [21, 25] }, // 小拳石
                    { id: 46, weight: 15, levelRange: [21, 25] }, // 派拉斯
                    { id: 27, weight: 15, levelRange: [21, 25] }, // 穿山鼠
                    { id: 35, weight: 10, levelRange: [21, 25] }, // 皮皮（稀有）
                ]
            },
            {
                id: 'kanto_route4',
                name: '4号道路',
                description: '月见山到华蓝市之间的道路',
                levelRange: [26, 30],
                pokemon: [
                    { id: 21, weight: 25, levelRange: [26, 30] },  // 烈雀
                    { id: 23, weight: 20, levelRange: [26, 30] },  // 阿柏蛇
                    { id: 27, weight: 20, levelRange: [26, 30] },  // 穿山鼠
                    { id: 56, weight: 20, levelRange: [26, 30] },  // 猴怪
                    { id: 48, weight: 15, levelRange: [26, 30] },  // 毛球
                ]
            },
            {
                id: 'kanto_route24',
                name: '24号道路 (黄金桥)',
                description: '华蓝市北方的著名桥梁',
                levelRange: [31, 35],
                pokemon: [
                    { id: 43, weight: 25, levelRange: [31, 35] }, // 走路草
                    { id: 69, weight: 25, levelRange: [31, 35] }, // 喇叭芽
                    { id: 16, weight: 20, levelRange: [31, 35] }, // 波波
                    { id: 10, weight: 15, levelRange: [31, 35] }, // 绿毛虫
                    { id: 63, weight: 15, levelRange: [31, 35] }, // 凯西
                ]
            },
            {
                id: 'kanto_route5',
                name: '5号道路',
                description: '华蓝市到金黄市之间的道路',
                levelRange: [36, 40],
                pokemon: [
                    { id: 52, weight: 25, levelRange: [36, 40] }, // 喵喵
                    { id: 43, weight: 25, levelRange: [36, 40] }, // 走路草
                    { id: 16, weight: 20, levelRange: [36, 40] }, // 波波
                    { id: 56, weight: 12, levelRange: [36, 40] }, // 猴怪
                    { id: 63, weight: 12, levelRange: [36, 40] }, // 凯西
                    { id: 1, weight: 6, levelRange: [36, 40] },   // 妙蛙种子（稀有）
                ]
            },
            {
                id: 'kanto_route6',
                name: '6号道路',
                description: '金黄市到枯叶市之间的道路',
                levelRange: [41, 45],
                pokemon: [
                    { id: 52, weight: 25, levelRange: [41, 45] }, // 喵喵
                    { id: 69, weight: 25, levelRange: [41, 45] }, // 喇叭芽
                    { id: 16, weight: 18, levelRange: [41, 45] }, // 波波
                    { id: 56, weight: 13, levelRange: [41, 45] }, // 猴怪
                    { id: 63, weight: 13, levelRange: [41, 45] }, // 凯西
                    { id: 7, weight: 6, levelRange: [41, 45] },   // 杰尼龟（稀有）
                ]
            },
            {
                id: 'kanto_route9',
                name: '9号道路',
                description: '华蓝市到岩山隧道的崎岖山路',
                levelRange: [46, 50],
                pokemon: [
                    { id: 21, weight: 25, levelRange: [46, 50] }, // 烈雀
                    { id: 19, weight: 20, levelRange: [46, 50] }, // 小拉达
                    { id: 23, weight: 20, levelRange: [46, 50] }, // 阿柏蛇
                    { id: 48, weight: 20, levelRange: [46, 50] }, // 毛球
                    { id: 100, weight: 15, levelRange: [46, 50] }, // 霹雳电球
                ]
            },
            {
                id: 'kanto_rock_tunnel',
                name: '岩山隧道',
                description: '漆黑的岩石隧道，连接华蓝市和紫苑镇',
                levelRange: [51, 55],
                pokemon: [
                    { id: 41, weight: 25, levelRange: [51, 55] }, // 超音蝠
                    { id: 74, weight: 25, levelRange: [51, 55] }, // 小拳石
                    { id: 66, weight: 20, levelRange: [51, 55] }, // 腕力
                    { id: 104, weight: 20, levelRange: [51, 55] }, // 卡拉卡拉
                    { id: 95, weight: 10, levelRange: [51, 55] }, // 大岩蛇
                ]
            },
            {
                id: 'kanto_route7',
                name: '7号道路',
                description: '金黄市到彩虹市之间的短道路',
                levelRange: [56, 60],
                pokemon: [
                    { id: 52, weight: 25, levelRange: [56, 60] }, // 喵喵
                    { id: 37, weight: 20, levelRange: [56, 60] }, // 六尾
                    { id: 58, weight: 20, levelRange: [56, 60] }, // 卡蒂狗
                    { id: 43, weight: 17, levelRange: [56, 60] }, // 走路草
                    { id: 17, weight: 12, levelRange: [56, 60] }, // 比比鸟
                    { id: 4, weight: 6, levelRange: [56, 60] },   // 小火龙（稀有）
                ]
            },
            {
                id: 'kanto_route8',
                name: '8号道路',
                description: '金黄市到紫苑镇之间的道路',
                levelRange: [61, 65],
                pokemon: [
                    { id: 96, weight: 25, levelRange: [61, 65] }, // 催眠貘
                    { id: 37, weight: 20, levelRange: [61, 65] }, // 六尾
                    { id: 58, weight: 20, levelRange: [61, 65] }, // 卡蒂狗
                    { id: 69, weight: 15, levelRange: [61, 65] }, // 喇叭芽
                    { id: 25, weight: 15, levelRange: [61, 65] }, // 皮卡丘
                    { id: 122, weight: 5, levelRange: [61, 65] }, // 魔墙人偶（稀有）
                ]
            },
            {
                id: 'kanto_pokemon_tower',
                name: '宝可梦塔',
                description: '紫苑镇的灵魂安息之所',
                levelRange: [66, 70],
                pokemon: [
                    { id: 92, weight: 35, levelRange: [66, 70] }, // 鬼斯
                    { id: 104, weight: 25, levelRange: [66, 70] }, // 卡拉卡拉
                    { id: 41, weight: 25, levelRange: [66, 70] }, // 超音蝠
                    { id: 93, weight: 15, levelRange: [66, 70] }, // 鬼斯通
                ]
            },
            {
                id: 'kanto_route10',
                name: '10号道路',
                description: '岩山隧道入口和无人发电厂附近',
                levelRange: [71, 75],
                pokemon: [
                    { id: 100, weight: 30, levelRange: [71, 75] }, // 霹雳电球
                    { id: 81, weight: 28, levelRange: [71, 75] },  // 小磁怪
                    { id: 21, weight: 20, levelRange: [71, 75] },  // 烈雀
                    { id: 23, weight: 15, levelRange: [71, 75] },  // 阿柏蛇
                    { id: 125, weight: 6, levelRange: [71, 75] },  // 电击兽（稀有）
                    { id: 145, weight: 3, levelRange: [75, 75] },  // 闪电鸟（传说）
                ]
            },
            {
                id: 'kanto_route11',
                name: '11号道路',
                description: '枯叶市东方的道路',
                levelRange: [76, 80],
                pokemon: [
                    { id: 23, weight: 25, levelRange: [76, 80] }, // 阿柏蛇
                    { id: 84, weight: 20, levelRange: [76, 80] }, // 嘟嘟
                    { id: 50, weight: 20, levelRange: [76, 80] }, // 地鼠
                    { id: 96, weight: 15, levelRange: [76, 80] }, // 催眠貘
                    { id: 19, weight: 15, levelRange: [76, 80] }, // 小拉达
                    { id: 138, weight: 5, levelRange: [76, 80] },  // 菊石兽（稀有）
                ]
            },
            {
                id: 'kanto_route12',
                name: '12号道路',
                description: '枯叶市到紫苑镇的海边道路',
                levelRange: [81, 85],
                pokemon: [
                    { id: 79, weight: 30, levelRange: [81, 85] }, // 呆呆兽
                    { id: 129, weight: 25, levelRange: [81, 85] }, // 鲤鱼王
                    { id: 48, weight: 20, levelRange: [81, 85] }, // 毛球
                    { id: 72, weight: 15, levelRange: [81, 85] }, // 玛瑙水母
                    { id: 83, weight: 7, levelRange: [81, 85] },  // 大葱鸭（稀有）
                    { id: 143, weight: 3, levelRange: [85, 85] }, // 卡比兽（稀有）
                ]
            },
            {
                id: 'kanto_route13',
                name: '13号道路',
                description: '连接紫苑镇和浅红市的道路',
                levelRange: [86, 90],
                pokemon: [
                    { id: 43, weight: 20, levelRange: [86, 90] }, // 走路草
                    { id: 69, weight: 20, levelRange: [86, 90] }, // 喇叭芽
                    { id: 54, weight: 20, levelRange: [86, 90] }, // 可达鸭
                    { id: 17, weight: 20, levelRange: [86, 90] }, // 比比鸟
                    { id: 84, weight: 15, levelRange: [86, 90] }, // 嘟嘟
                    { id: 133, weight: 5, levelRange: [86, 90] },  // 伊布（稀有）
                ]
            },
            {
                id: 'kanto_safari_zone',
                name: '狩猎区',
                description: '浅红市的大型自然保护区',
                levelRange: [91, 95],
                pokemon: [
                    { id: 114, weight: 13, levelRange: [91, 95] }, // 蔓藤怪
                    { id: 29, weight: 12, levelRange: [91, 95] },  // 尼多兰
                    { id: 32, weight: 12, levelRange: [91, 95] },  // 尼多朗
                    { id: 102, weight: 12, levelRange: [91, 95] }, // 蛋蛋
                    { id: 111, weight: 10, levelRange: [91, 95] }, // 独角犀牛
                    { id: 123, weight: 10, levelRange: [91, 95] }, // 飞天螳螂
                    { id: 127, weight: 10, levelRange: [91, 95] }, // 凯罗斯
                    { id: 115, weight: 8, levelRange: [91, 95] },  // 袋兽
                    { id: 128, weight: 8, levelRange: [91, 95] },  // 肯泰罗
                    { id: 113, weight: 5, levelRange: [91, 95] },  // 吉利蛋
                ]
            },
            {
                id: 'kanto_route17',
                name: '17号道路 (自行车道)',
                description: '从金黄市到浅红市的下坡道路',
                levelRange: [96, 100],
                pokemon: [
                    { id: 84, weight: 20, levelRange: [96, 100] }, // 嘟嘟
                    { id: 50, weight: 20, levelRange: [96, 100] }, // 地鼠
                    { id: 20, weight: 20, levelRange: [96, 100] }, // 拉达
                    { id: 88, weight: 20, levelRange: [96, 100] }, // 臭泥
                    { id: 109, weight: 15, levelRange: [96, 100] }, // 瓦斯弹
                    { id: 140, weight: 5, levelRange: [96, 100] }, // 化石盔（稀有）
                ]
            },
            {
                id: 'kanto_route19',
                name: '19号水道',
                description: '浅红市到双子岛的海上道路',
                levelRange: [101, 105],
                pokemon: [
                    { id: 72, weight: 30, levelRange: [101, 105] }, // 玛瑙水母
                    { id: 116, weight: 20, levelRange: [101, 105] }, // 墨海马
                    { id: 60, weight: 20, levelRange: [101, 105] }, // 蚊香蝌蚪
                    { id: 120, weight: 15, levelRange: [101, 105] }, // 海星星
                    { id: 86, weight: 15, levelRange: [101, 105] }, // 小海狮
                ]
            },
            {
                id: 'kanto_seafoam_islands',
                name: '双子岛',
                description: '传说中急冻鸟栖息的冰冷洞窟',
                levelRange: [106, 110],
                pokemon: [
                    { id: 86, weight: 25, levelRange: [106, 110] }, // 小海狮
                    { id: 90, weight: 25, levelRange: [106, 110] }, // 大舌贝
                    { id: 98, weight: 20, levelRange: [106, 110] }, // 大钳蟹
                    { id: 87, weight: 15, levelRange: [106, 110] }, // 白海狮
                    { id: 131, weight: 8, levelRange: [106, 110] }, // 拉普拉斯（稀有）
                    { id: 124, weight: 6, levelRange: [106, 110] }, // 迷唇姐（稀有）
                    { id: 144, weight: 3, levelRange: [110, 110] }, // 急冻鸟（传说）
                ]
            },
            {
                id: 'kanto_pokemon_mansion',
                name: '宝可梦屋',
                description: '红莲岛上的废弃大宅，曾经的研究所',
                levelRange: [111, 115],
                pokemon: [
                    { id: 77, weight: 25, levelRange: [111, 115] }, // 小火马
                    { id: 58, weight: 20, levelRange: [111, 115] }, // 卡蒂狗
                    { id: 109, weight: 20, levelRange: [111, 115] }, // 瓦斯弹
                    { id: 132, weight: 20, levelRange: [111, 115] }, // 百变怪
                    { id: 108, weight: 8, levelRange: [111, 115] }, // 大舌头（稀有）
                    { id: 126, weight: 7, levelRange: [111, 115] }, // 鸭嘴火兽（稀有）
                ]
            },
            {
                id: 'kanto_route21',
                name: '21号水道',
                description: '红莲岛到真新镇之间的海上道路',
                levelRange: [116, 120],
                pokemon: [
                    { id: 72, weight: 25, levelRange: [116, 120] }, // 玛瑙水母
                    { id: 129, weight: 20, levelRange: [116, 120] }, // 鲤鱼王
                    { id: 116, weight: 15, levelRange: [116, 120] }, // 墨海马
                    { id: 118, weight: 15, levelRange: [116, 120] }, // 角金鱼
                    { id: 90, weight: 15, levelRange: [116, 120] }, // 大舌贝
                    { id: 73, weight: 10, levelRange: [116, 120] }, // 毒刺水母
                ]
            },
            {
                id: 'kanto_route22',
                name: '22号道路',
                description: '常磐市到冠军之路入口',
                levelRange: [121, 125],
                pokemon: [
                    { id: 21, weight: 20, levelRange: [121, 125] }, // 烈雀
                    { id: 56, weight: 20, levelRange: [121, 125] }, // 猴怪
                    { id: 19, weight: 15, levelRange: [121, 125] }, // 小拉达
                    { id: 29, weight: 15, levelRange: [121, 125] }, // 尼多兰
                    { id: 32, weight: 15, levelRange: [121, 125] }, // 尼多朗
                    { id: 50, weight: 15, levelRange: [121, 125] }, // 地鼠
                ]
            },
            {
                id: 'kanto_victory_road',
                name: '冠军之路',
                description: '通往石英高原的最后试炼',
                levelRange: [126, 130],
                pokemon: [
                    { id: 67, weight: 27, levelRange: [126, 130] }, // 豪力
                    { id: 75, weight: 27, levelRange: [126, 130] }, // 隆隆石
                    { id: 95, weight: 23, levelRange: [126, 130] }, // 大岩蛇
                    { id: 106, weight: 8, levelRange: [126, 130] }, // 飞腿郎（稀有）
                    { id: 107, weight: 8, levelRange: [126, 130] }, // 快拳郎（稀有）
                    { id: 142, weight: 6, levelRange: [126, 130] }, // 化石翼龙（稀有）
                    { id: 146, weight: 3, levelRange: [130, 130] }, // 火焰鸟（传说）
                ]
            },
            {
                id: 'kanto_cerulean_cave',
                name: '华蓝洞窟',
                description: '传说中最强宝可梦栖息的神秘洞窟',
                levelRange: [131, 135],
                pokemon: [
                    { id: 64, weight: 28, levelRange: [131, 135] },  // 勇基拉
                    { id: 147, weight: 25, levelRange: [131, 135] }, // 迷你龙
                    { id: 82, weight: 22, levelRange: [131, 135] },  // 三合一磁怪
                    { id: 137, weight: 14, levelRange: [131, 135] }, // 多边兽（稀有）
                    { id: 149, weight: 8, levelRange: [131, 135] },  // 快龙（稀有）
                    { id: 150, weight: 2, levelRange: [135, 135] },  // 超梦（传说）
                    { id: 151, weight: 1, levelRange: [135, 135] },  // 梦幻（幻之宝可梦）
                ]
            },
        ]
    },
    johto: {
        id: 'johto',
        name: '城都地区',
        nameEn: 'Johto',
        description: '第二世代宝可梦的家园，充满了传说与神秘。需要集齐关都地区所有宝可梦才能前往。',
        unlockCondition: { type: 'pokedex_complete', region: 'kanto', range: [1, 151] },
        routes: [
            {
                id: 'johto_route29',
                name: '29号道路',
                description: '若叶镇到吉花市之间的道路',
                levelRange: [136, 140],
                pokemon: [
                    { id: 161, weight: 35, levelRange: [136, 140] },  // 尾立
                    { id: 163, weight: 30, levelRange: [136, 140] },  // 咕咕
                    { id: 187, weight: 20, levelRange: [136, 140] },  // 毽子草
                    { id: 172, weight: 15, levelRange: [136, 140] },  // 皮丘
                ]
            },
            {
                id: 'johto_route30',
                name: '30号道路',
                description: '吉花市到桔梗市之间的道路',
                levelRange: [141, 145],
                pokemon: [
                    { id: 165, weight: 25, levelRange: [141, 145] },  // 芭瓢虫
                    { id: 167, weight: 25, levelRange: [141, 145] },  // 圆丝蛛
                    { id: 161, weight: 20, levelRange: [141, 145] },  // 尾立
                    { id: 175, weight: 10, levelRange: [141, 145] },  // 波克比
                    { id: 173, weight: 10, levelRange: [141, 145] },  // 皮宝宝
                    { id: 174, weight: 10, levelRange: [141, 145] },  // 宝宝丁
                ]
            },
            {
                id: 'johto_sprout_tower',
                name: '喇叭芽之塔',
                description: '桔梗市中供奉喇叭芽的古塔',
                levelRange: [146, 150],
                pokemon: [
                    { id: 92, weight: 25, levelRange: [146, 150] },   // 鬼斯
                    { id: 69, weight: 20, levelRange: [146, 150] },   // 喇叭芽
                    { id: 177, weight: 20, levelRange: [146, 150] },  // 天然雀
                    { id: 163, weight: 15, levelRange: [146, 150] },  // 咕咕
                    { id: 201, weight: 10, levelRange: [146, 150] },  // 未知图腾
                    { id: 200, weight: 10, levelRange: [146, 150] },  // 梦妖
                ]
            },
            {
                id: 'johto_route32',
                name: '32号道路',
                description: '桔梗市到联合洞穴的长道路',
                levelRange: [151, 155],
                pokemon: [
                    { id: 179, weight: 28, levelRange: [151, 155] },  // 咩利羊
                    { id: 194, weight: 22, levelRange: [151, 155] },  // 乌波
                    { id: 187, weight: 20, levelRange: [151, 155] },  // 毽子草
                    { id: 190, weight: 15, levelRange: [151, 155] },  // 长尾怪手
                    { id: 206, weight: 10, levelRange: [151, 155] },  // 土龙弟弟
                    { id: 152, weight: 5, levelRange: [151, 155] },   // 菊草叶（稀有）
                ]
            },
            {
                id: 'johto_union_cave',
                name: '联合洞穴',
                description: '连接桔梗市和满金市的自然洞穴',
                levelRange: [156, 160],
                pokemon: [
                    { id: 74, weight: 25, levelRange: [156, 160] },   // 小拳石
                    { id: 194, weight: 18, levelRange: [156, 160] },  // 乌波
                    { id: 204, weight: 18, levelRange: [156, 160] },  // 榛果球
                    { id: 231, weight: 15, levelRange: [156, 160] },  // 小小象
                    { id: 95, weight: 12, levelRange: [156, 160] },   // 大岩蛇
                    { id: 236, weight: 12, levelRange: [156, 160] },  // 无畏小子
                ]
            },
            {
                id: 'johto_route34',
                name: '34号道路',
                description: '满金市南方的道路',
                levelRange: [161, 165],
                pokemon: [
                    { id: 183, weight: 22, levelRange: [161, 165] },  // 玛力露
                    { id: 209, weight: 22, levelRange: [161, 165] },  // 布鲁
                    { id: 191, weight: 18, levelRange: [161, 165] },  // 向日种子
                    { id: 203, weight: 18, levelRange: [161, 165] },  // 麒麟奇
                    { id: 185, weight: 15, levelRange: [161, 165] },  // 胡说树
                    { id: 155, weight: 5, levelRange: [161, 165] },   // 火球鼠（稀有）
                ]
            },
            {
                id: 'johto_national_park',
                name: '自然公园',
                description: '满金市北方的虫系宝可梦乐园',
                levelRange: [166, 170],
                pokemon: [
                    { id: 165, weight: 25, levelRange: [166, 170] },  // 芭瓢虫
                    { id: 193, weight: 20, levelRange: [166, 170] },  // 蜻蜻蜓
                    { id: 123, weight: 15, levelRange: [166, 170] },  // 飞天螳螂
                    { id: 127, weight: 15, levelRange: [166, 170] },  // 凯罗斯
                    { id: 214, weight: 15, levelRange: [166, 170] },  // 赫拉克罗斯
                    { id: 213, weight: 10, levelRange: [166, 170] },  // 壶壶（稀有）
                ]
            },
            {
                id: 'johto_route35',
                name: '35号道路',
                description: '满金市到圆朱市的道路',
                levelRange: [171, 175],
                pokemon: [
                    { id: 190, weight: 20, levelRange: [171, 175] },  // 长尾怪手
                    { id: 216, weight: 20, levelRange: [171, 175] },  // 熊宝宝
                    { id: 198, weight: 20, levelRange: [171, 175] },  // 黑暗鸦
                    { id: 234, weight: 15, levelRange: [171, 175] },  // 惊角鹿
                    { id: 202, weight: 15, levelRange: [171, 175] },  // 果然翁
                    { id: 235, weight: 10, levelRange: [171, 175] },  // 图图犬（稀有）
                ]
            },
            {
                id: 'johto_burned_tower',
                name: '焚烧塔',
                description: '圆朱市中被烧毁的古塔，传说中三圣兽在此诞生',
                levelRange: [176, 180],
                pokemon: [
                    { id: 92, weight: 25, levelRange: [176, 180] },   // 鬼斯
                    { id: 200, weight: 20, levelRange: [176, 180] },  // 梦妖
                    { id: 93, weight: 18, levelRange: [176, 180] },   // 鬼斯通
                    { id: 228, weight: 17, levelRange: [176, 180] },  // 戴鲁比
                    { id: 218, weight: 15, levelRange: [176, 180] },  // 熔岩虫
                    { id: 158, weight: 5, levelRange: [176, 180] },   // 小锯鳄（稀有）
                ]
            },
            {
                id: 'johto_route38',
                name: '38号道路',
                description: '圆朱市到浅黄市的道路',
                levelRange: [181, 185],
                pokemon: [
                    { id: 58, weight: 20, levelRange: [181, 185] },   // 卡蒂狗
                    { id: 52, weight: 20, levelRange: [181, 185] },   // 喵喵
                    { id: 128, weight: 15, levelRange: [181, 185] },  // 肯泰罗
                    { id: 241, weight: 15, levelRange: [181, 185] },  // 大奶罐
                    { id: 164, weight: 15, levelRange: [181, 185] },  // 猫头夜鹰
                    { id: 162, weight: 15, levelRange: [181, 185] },  // 大尾立
                ]
            },
            {
                id: 'johto_route40',
                name: '40号水道',
                description: '浅黄市到漩涡列岛的海上道路',
                levelRange: [186, 190],
                pokemon: [
                    { id: 72, weight: 25, levelRange: [186, 190] },   // 玛瑙水母
                    { id: 222, weight: 20, levelRange: [186, 190] },  // 太阳珊瑚
                    { id: 223, weight: 20, levelRange: [186, 190] },  // 铁炮鱼
                    { id: 170, weight: 20, levelRange: [186, 190] },  // 灯笼鱼
                    { id: 211, weight: 10, levelRange: [186, 190] },  // 千针鱼
                    { id: 226, weight: 5, levelRange: [186, 190] },   // 巨翅飞鱼（稀有）
                ]
            },
            {
                id: 'johto_route42',
                name: '42号道路',
                description: '满金市到阿驲山区的道路',
                levelRange: [191, 195],
                pokemon: [
                    { id: 207, weight: 22, levelRange: [191, 195] },  // 天蝎
                    { id: 215, weight: 20, levelRange: [191, 195] },  // 狃拉
                    { id: 227, weight: 15, levelRange: [191, 195] },  // 盔甲鸟
                    { id: 238, weight: 15, levelRange: [191, 195] },  // 迷唇娃
                    { id: 240, weight: 15, levelRange: [191, 195] },  // 小鸭嘴龙
                    { id: 239, weight: 13, levelRange: [191, 195] },  // 电击怪
                ]
            },
            {
                id: 'johto_route43',
                name: '43号道路',
                description: '通往愤怒之湖的道路',
                levelRange: [196, 200],
                pokemon: [
                    { id: 23, weight: 18, levelRange: [196, 200] },   // 阿柏蛇
                    { id: 96, weight: 18, levelRange: [196, 200] },   // 催眠貘
                    { id: 129, weight: 18, levelRange: [196, 200] },  // 鲤鱼王
                    { id: 234, weight: 16, levelRange: [196, 200] },  // 惊角鹿
                    { id: 164, weight: 15, levelRange: [196, 200] },  // 猫头夜鹰
                    { id: 198, weight: 15, levelRange: [196, 200] },  // 黑暗鸦
                ]
            },
            {
                id: 'johto_lake_of_rage',
                name: '愤怒之湖',
                description: '传说中红色暴鲤龙出没的湖泊',
                levelRange: [201, 210],
                pokemon: [
                    { id: 129, weight: 28, levelRange: [201, 210] },  // 鲤鱼王
                    { id: 118, weight: 18, levelRange: [201, 210] },  // 角金鱼
                    { id: 183, weight: 15, levelRange: [201, 210] },  // 玛力露
                    { id: 195, weight: 15, levelRange: [201, 210] },  // 沼王
                    { id: 130, weight: 12, levelRange: [201, 210] },  // 暴鲤龙
                    { id: 119, weight: 12, levelRange: [201, 210] },  // 金鱼王
                ]
            },
            {
                id: 'johto_route44',
                name: '44号道路',
                description: '通往冰之通道的寒冷道路',
                levelRange: [211, 220],
                pokemon: [
                    { id: 220, weight: 25, levelRange: [211, 220] },  // 小山猪
                    { id: 216, weight: 20, levelRange: [211, 220] },  // 熊宝宝
                    { id: 215, weight: 18, levelRange: [211, 220] },  // 狃拉
                    { id: 207, weight: 17, levelRange: [211, 220] },  // 天蝎
                    { id: 178, weight: 12, levelRange: [211, 220] },  // 天然鸟
                    { id: 176, weight: 8, levelRange: [211, 220] },   // 波克基古（稀有）
                ]
            },
            {
                id: 'johto_ice_path',
                name: '冰之通道',
                description: '连接满金和浅黄的冰冷洞穴',
                levelRange: [221, 230],
                pokemon: [
                    { id: 220, weight: 25, levelRange: [221, 230] },  // 小山猪
                    { id: 86, weight: 20, levelRange: [221, 230] },   // 小海狮
                    { id: 221, weight: 15, levelRange: [221, 230] },  // 长毛猪
                    { id: 225, weight: 15, levelRange: [221, 230] },  // 信使鸟
                    { id: 124, weight: 13, levelRange: [221, 230] },  // 迷唇姐
                    { id: 87, weight: 12, levelRange: [221, 230] },   // 白海狮
                ]
            },
            {
                id: 'johto_route45',
                name: '45号道路',
                description: '黑暗市南方的陡峭山路',
                levelRange: [231, 240],
                pokemon: [
                    { id: 74, weight: 22, levelRange: [231, 240] },   // 小拳石
                    { id: 207, weight: 22, levelRange: [231, 240] },  // 天蝎
                    { id: 111, weight: 22, levelRange: [231, 240] },  // 独角犀牛
                    { id: 231, weight: 17, levelRange: [231, 240] },  // 小小象
                    { id: 246, weight: 10, levelRange: [231, 240] },  // 幼基拉斯
                    { id: 227, weight: 7, levelRange: [231, 240] },   // 盔甲鸟（稀有）
                ]
            },
            {
                id: 'johto_dark_cave',
                name: '漆黑洞穴',
                description: '城都地区的幽暗洞窟',
                levelRange: [241, 250],
                pokemon: [
                    { id: 74, weight: 20, levelRange: [241, 250] },   // 小拳石
                    { id: 200, weight: 20, levelRange: [241, 250] },  // 梦妖
                    { id: 228, weight: 20, levelRange: [241, 250] },  // 戴鲁比
                    { id: 204, weight: 15, levelRange: [241, 250] },  // 榛果球
                    { id: 206, weight: 15, levelRange: [241, 250] },  // 土龙弟弟
                    { id: 202, weight: 10, levelRange: [241, 250] },  // 果然翁
                ]
            },
            {
                id: 'johto_route27',
                name: '27号道路',
                description: '通往关都地区的长道路',
                levelRange: [251, 260],
                pokemon: [
                    { id: 189, weight: 18, levelRange: [251, 260] },  // 毽子棉
                    { id: 229, weight: 18, levelRange: [251, 260] },  // 黑鲁加
                    { id: 217, weight: 18, levelRange: [251, 260] },  // 圈圈熊
                    { id: 232, weight: 18, levelRange: [251, 260] },  // 顿甲
                    { id: 205, weight: 18, levelRange: [251, 260] },  // 佛烈托斯
                    { id: 224, weight: 10, levelRange: [251, 260] },  // 章鱼桶
                ]
            },
            {
                id: 'johto_victory_road',
                name: '城都冠军之路',
                description: '通往石英联盟的最终试炼',
                levelRange: [261, 270],
                pokemon: [
                    { id: 221, weight: 25, levelRange: [261, 270] },  // 长毛猪
                    { id: 67, weight: 18, levelRange: [261, 270] },   // 豪力
                    { id: 75, weight: 18, levelRange: [261, 270] },   // 隆隆石
                    { id: 219, weight: 15, levelRange: [261, 270] },  // 熔岩蜗牛
                    { id: 246, weight: 12, levelRange: [261, 270] },  // 幼基拉斯
                    { id: 247, weight: 12, levelRange: [261, 270] },  // 沙基拉斯
                ]
            },
            {
                id: 'johto_whirl_islands',
                name: '漩涡列岛',
                description: '传说中洛奇亚栖息的海底洞窟',
                levelRange: [271, 280],
                pokemon: [
                    { id: 116, weight: 25, levelRange: [271, 280] },  // 墨海马
                    { id: 171, weight: 22, levelRange: [271, 280] },  // 电灯怪
                    { id: 117, weight: 20, levelRange: [271, 280] },  // 海刺龙
                    { id: 226, weight: 18, levelRange: [271, 280] },  // 巨翅飞鱼
                    { id: 131, weight: 12, levelRange: [271, 280] },  // 拉普拉斯
                    { id: 245, weight: 3, levelRange: [280, 280] },   // 水君（传说）
                    { id: 249, weight: 2, levelRange: [280, 280] },   // 洛奇亚（传说）
                ]
            },
            {
                id: 'johto_tin_tower',
                name: '钟塔',
                description: '圆朱市中供奉凤王的神圣塔楼',
                levelRange: [281, 290],
                pokemon: [
                    { id: 92, weight: 20, levelRange: [281, 290] },   // 鬼斯
                    { id: 177, weight: 20, levelRange: [281, 290] },  // 天然雀
                    { id: 178, weight: 19, levelRange: [281, 290] },  // 天然鸟
                    { id: 93, weight: 18, levelRange: [281, 290] },   // 鬼斯通
                    { id: 200, weight: 18, levelRange: [281, 290] },  // 梦妖
                    { id: 243, weight: 4, levelRange: [290, 290] },   // 雷公（传说）
                    { id: 244, weight: 4, levelRange: [290, 290] },   // 炎帝（传说）
                    { id: 250, weight: 2, levelRange: [290, 290] },   // 凤王（传说）
                ]
            },
            {
                id: 'johto_mt_silver',
                name: '白银山',
                description: '城都地区最高峰，最强训练师的修炼圣地',
                levelRange: [291, 300],
                pokemon: [
                    { id: 221, weight: 18, levelRange: [291, 300] },   // 长毛猪
                    { id: 217, weight: 18, levelRange: [291, 300] },   // 圈圈熊
                    { id: 215, weight: 18, levelRange: [291, 300] },   // 狃拉
                    { id: 42, weight: 15, levelRange: [291, 300] },    // 大嘴蝠
                    { id: 246, weight: 15, levelRange: [291, 300] },   // 幼基拉斯
                    { id: 247, weight: 15, levelRange: [291, 300] },   // 沙基拉斯
                    { id: 251, weight: 1, levelRange: [300, 300] },    // 时拉比（幻之宝可梦）
                ]
            },
        ]
    },
    hoenn: {
        id: 'hoenn',
        name: '丰缘地区',
        nameEn: 'Hoenn',
        description: '第三世代宝可梦的故乡，拥有广阔的海洋和丰富的自然环境。需要集齐城都地区所有宝可梦才能前往。',
        unlockCondition: { type: 'pokedex_complete', region: 'johto', range: [152, 251] },
        routes: [
            {
                id: 'hoenn_route101',
                name: '101号道路',
                description: '未白镇到古辰镇之间的道路',
                levelRange: [301, 315],
                pokemon: [
                    { id: 263, weight: 35, levelRange: [301, 315] },  // 蛇纹熊
                    { id: 261, weight: 30, levelRange: [301, 315] },  // 土狼犬
                    { id: 265, weight: 20, levelRange: [301, 315] },  // 刺尾虫
                    { id: 276, weight: 15, levelRange: [301, 315] },  // 傲骨燕
                ]
            },
            {
                id: 'hoenn_route102',
                name: '102号道路',
                description: '古辰镇到橙华市之间的道路',
                levelRange: [316, 330],
                pokemon: [
                    { id: 270, weight: 25, levelRange: [316, 330] },  // 莲叶童子
                    { id: 273, weight: 25, levelRange: [316, 330] },  // 橡实果
                    { id: 280, weight: 20, levelRange: [316, 330] },  // 拉鲁拉丝
                    { id: 283, weight: 15, levelRange: [316, 330] },  // 溜溜糖球
                    { id: 298, weight: 15, levelRange: [316, 330] },  // 露力丽
                ]
            },
            {
                id: 'hoenn_petalburg_woods',
                name: '橙华森林',
                description: '橙华市附近的茂密森林',
                levelRange: [331, 345],
                pokemon: [
                    { id: 265, weight: 25, levelRange: [331, 345] },  // 刺尾虫
                    { id: 285, weight: 20, levelRange: [331, 345] },  // 蘑蘑菇
                    { id: 287, weight: 15, levelRange: [331, 345] },  // 懒人獭
                    { id: 266, weight: 15, levelRange: [331, 345] },  // 甲壳茧
                    { id: 268, weight: 15, levelRange: [331, 345] },  // 盾甲茧
                    { id: 252, weight: 10, levelRange: [331, 345] },  // 木守宫（稀有）
                ]
            },
            {
                id: 'hoenn_route104',
                name: '104号道路',
                description: '橙华市到卡那兹市之间的海岸道路',
                levelRange: [346, 360],
                pokemon: [
                    { id: 278, weight: 25, levelRange: [346, 360] },  // 长翅鸥
                    { id: 276, weight: 20, levelRange: [346, 360] },  // 傲骨燕
                    { id: 263, weight: 20, levelRange: [346, 360] },  // 蛇纹熊
                    { id: 300, weight: 15, levelRange: [346, 360] },  // 向尾喵
                    { id: 183, weight: 10, levelRange: [346, 360] },  // 玛力露
                    { id: 255, weight: 10, levelRange: [346, 360] },  // 火稚鸡（稀有）
                ]
            },
            {
                id: 'hoenn_rustboro_tunnel',
                name: '石之洞窟',
                description: '卡那兹市附近的岩石洞窟',
                levelRange: [361, 375],
                pokemon: [
                    { id: 304, weight: 25, levelRange: [361, 375] },  // 可可多拉
                    { id: 296, weight: 20, levelRange: [361, 375] },  // 幕下力士
                    { id: 74, weight: 20, levelRange: [361, 375] },   // 小拳石
                    { id: 299, weight: 15, levelRange: [361, 375] },  // 朝北鼻
                    { id: 290, weight: 10, levelRange: [361, 375] },  // 土居忍士
                    { id: 303, weight: 10, levelRange: [361, 375] },  // 大嘴娃（稀有）
                ]
            },
            {
                id: 'hoenn_route110',
                name: '110号道路',
                description: '紫堇市到凯那市之间的长道路',
                levelRange: [376, 390],
                pokemon: [
                    { id: 309, weight: 25, levelRange: [376, 390] },  // 落雷兽
                    { id: 311, weight: 15, levelRange: [376, 390] },  // 正电拍拍
                    { id: 312, weight: 15, levelRange: [376, 390] },  // 负电拍拍
                    { id: 293, weight: 15, levelRange: [376, 390] },  // 咕妞妞
                    { id: 316, weight: 15, levelRange: [376, 390] },  // 溶食兽
                    { id: 258, weight: 15, levelRange: [376, 390] },  // 水跃鱼（稀有）
                ]
            },
            {
                id: 'hoenn_route111',
                name: '111号道路 (沙漠地带)',
                description: '紫堇市北方的炎热沙漠',
                levelRange: [391, 405],
                pokemon: [
                    { id: 328, weight: 25, levelRange: [391, 405] },  // 大颚蚁
                    { id: 322, weight: 20, levelRange: [391, 405] },  // 呆火驼
                    { id: 331, weight: 20, levelRange: [391, 405] },  // 刺球仙人掌
                    { id: 343, weight: 15, levelRange: [391, 405] },  // 天秤偶
                    { id: 327, weight: 10, levelRange: [391, 405] },  // 晃晃斑
                    { id: 345, weight: 10, levelRange: [391, 405] },  // 触手百合（稀有）
                ]
            },
            {
                id: 'hoenn_route112',
                name: '112号道路 (烟突山)',
                description: '通往釜炎镇的火山道路',
                levelRange: [406, 420],
                pokemon: [
                    { id: 322, weight: 25, levelRange: [406, 420] },  // 呆火驼
                    { id: 324, weight: 15, levelRange: [406, 420] },  // 煤炭龟
                    { id: 307, weight: 15, levelRange: [406, 420] },  // 玛沙那
                    { id: 325, weight: 15, levelRange: [406, 420] },  // 跳跳猪
                    { id: 261, weight: 15, levelRange: [406, 420] },  // 土狼犬
                    { id: 347, weight: 15, levelRange: [406, 420] },  // 太古羽虫（稀有）
                ]
            },
            {
                id: 'hoenn_route113',
                name: '113号道路',
                description: '釜炎镇到飞翠市之间被火山灰覆盖的道路',
                levelRange: [421, 435],
                pokemon: [
                    { id: 327, weight: 20, levelRange: [421, 435] },  // 晃晃斑
                    { id: 315, weight: 20, levelRange: [421, 435] },  // 毒蔷薇
                    { id: 313, weight: 15, levelRange: [421, 435] },  // 电萤虫
                    { id: 314, weight: 15, levelRange: [421, 435] },  // 甜甜萤
                    { id: 336, weight: 15, levelRange: [421, 435] },  // 饭匙蛇
                    { id: 335, weight: 15, levelRange: [421, 435] },  // 猫鼬斩
                ]
            },
            {
                id: 'hoenn_route114',
                name: '114号道路',
                description: '流星瀑布附近的道路',
                levelRange: [436, 450],
                pokemon: [
                    { id: 333, weight: 25, levelRange: [436, 450] },  // 青绵鸟
                    { id: 339, weight: 20, levelRange: [436, 450] },  // 泥泥鳅
                    { id: 337, weight: 15, levelRange: [436, 450] },  // 月石
                    { id: 338, weight: 15, levelRange: [436, 450] },  // 太阳岩
                    { id: 302, weight: 15, levelRange: [436, 450] },  // 勾魂眼
                    { id: 351, weight: 10, levelRange: [436, 450] },  // 飘浮泡泡（稀有）
                ]
            },
            {
                id: 'hoenn_meteor_falls',
                name: '流星瀑布',
                description: '传说中龙系宝可梦栖息的神秘洞窟',
                levelRange: [451, 465],
                pokemon: [
                    { id: 371, weight: 25, levelRange: [451, 465] },  // 宝贝龙
                    { id: 304, weight: 20, levelRange: [451, 465] },  // 可可多拉
                    { id: 41, weight: 15, levelRange: [451, 465] },   // 超音蝠
                    { id: 337, weight: 15, levelRange: [451, 465] },  // 月石
                    { id: 338, weight: 15, levelRange: [451, 465] },  // 太阳岩
                    { id: 374, weight: 10, levelRange: [451, 465] },  // 铁哑铃（稀有）
                ]
            },
            {
                id: 'hoenn_route118',
                name: '118号道路',
                description: '凯那市东方的海岸道路',
                levelRange: [466, 480],
                pokemon: [
                    { id: 309, weight: 20, levelRange: [466, 480] },  // 落雷兽
                    { id: 278, weight: 20, levelRange: [466, 480] },  // 长翅鸥
                    { id: 341, weight: 20, levelRange: [466, 480] },  // 龙虾小兵
                    { id: 318, weight: 15, levelRange: [466, 480] },  // 利牙鱼
                    { id: 352, weight: 15, levelRange: [466, 480] },  // 变隐龙
                    { id: 359, weight: 10, levelRange: [466, 480] },  // 阿勃梭鲁（稀有）
                ]
            },
            {
                id: 'hoenn_route119',
                name: '119号道路',
                description: '天气研究所附近的热带雨林',
                levelRange: [481, 495],
                pokemon: [
                    { id: 357, weight: 20, levelRange: [481, 495] },  // 热带龙
                    { id: 352, weight: 20, levelRange: [481, 495] },  // 变隐龙
                    { id: 283, weight: 15, levelRange: [481, 495] },  // 溜溜糖球
                    { id: 261, weight: 15, levelRange: [481, 495] },  // 土狼犬
                    { id: 315, weight: 15, levelRange: [481, 495] },  // 毒蔷薇
                    { id: 349, weight: 15, levelRange: [481, 495] },  // 丑丑鱼（稀有）
                ]
            },
            {
                id: 'hoenn_route120',
                name: '120号道路',
                description: '茵郁市附近的神秘道路',
                levelRange: [496, 510],
                pokemon: [
                    { id: 359, weight: 18, levelRange: [496, 510] },  // 阿勃梭鲁
                    { id: 353, weight: 18, levelRange: [496, 510] },  // 怨影娃娃
                    { id: 355, weight: 18, levelRange: [496, 510] },  // 夜巡灵
                    { id: 302, weight: 16, levelRange: [496, 510] },  // 勾魂眼
                    { id: 358, weight: 15, levelRange: [496, 510] },  // 风铃铃
                    { id: 327, weight: 15, levelRange: [496, 510] },  // 晃晃斑
                ]
            },
            {
                id: 'hoenn_route121',
                name: '121号道路',
                description: '绿岭市到凯那市的道路',
                levelRange: [511, 525],
                pokemon: [
                    { id: 353, weight: 18, levelRange: [511, 525] },  // 怨影娃娃
                    { id: 355, weight: 18, levelRange: [511, 525] },  // 夜巡灵
                    { id: 320, weight: 17, levelRange: [511, 525] },  // 吼吼鲸
                    { id: 370, weight: 17, levelRange: [511, 525] },  // 爱心鱼
                    { id: 261, weight: 15, levelRange: [511, 525] },  // 土狼犬
                    { id: 278, weight: 15, levelRange: [511, 525] },  // 长翅鸥
                ]
            },
            {
                id: 'hoenn_mt_pyre',
                name: '送火山',
                description: '宝可梦灵魂安息的圣山',
                levelRange: [526, 540],
                pokemon: [
                    { id: 353, weight: 20, levelRange: [526, 540] },  // 怨影娃娃
                    { id: 355, weight: 20, levelRange: [526, 540] },  // 夜巡灵
                    { id: 92, weight: 17, levelRange: [526, 540] },   // 鬼斯
                    { id: 93, weight: 14, levelRange: [526, 540] },   // 鬼斯通
                    { id: 307, weight: 12, levelRange: [526, 540] },  // 玛沙那
                    { id: 358, weight: 10, levelRange: [526, 540] },  // 风铃铃
                    { id: 383, weight: 4, levelRange: [539, 540] },   // 固拉多（传说）
                ]
            },
            {
                id: 'hoenn_route124',
                name: '124号水道',
                description: '通往潜水区域的深海水道',
                levelRange: [541, 555],
                pokemon: [
                    { id: 320, weight: 22, levelRange: [541, 555] },  // 吼吼鲸
                    { id: 318, weight: 18, levelRange: [541, 555] },  // 利牙鱼
                    { id: 366, weight: 18, levelRange: [541, 555] },  // 珍珠贝
                    { id: 370, weight: 15, levelRange: [541, 555] },  // 爱心鱼
                    { id: 363, weight: 15, levelRange: [541, 555] },  // 海豹球
                    { id: 369, weight: 12, levelRange: [541, 555] },  // 古空棘鱼
                ]
            },
            {
                id: 'hoenn_shoal_cave',
                name: '浅滩洞穴',
                description: '琉璃市附近受潮汐影响的洞穴',
                levelRange: [556, 570],
                pokemon: [
                    { id: 363, weight: 25, levelRange: [556, 570] },  // 海豹球
                    { id: 361, weight: 22, levelRange: [556, 570] },  // 雪童子
                    { id: 41, weight: 15, levelRange: [556, 570] },   // 超音蝠
                    { id: 339, weight: 15, levelRange: [556, 570] },  // 泥泥鳅
                    { id: 360, weight: 13, levelRange: [556, 570] },  // 小果然
                    { id: 362, weight: 10, levelRange: [556, 570] },  // 冰鬼护（稀有）
                ]
            },
            {
                id: 'hoenn_route126',
                name: '126号水道',
                description: '通往海底洞窟的深海区域',
                levelRange: [571, 585],
                pokemon: [
                    { id: 341, weight: 20, levelRange: [571, 585] },  // 龙虾小兵
                    { id: 318, weight: 17, levelRange: [571, 585] },  // 利牙鱼
                    { id: 320, weight: 17, levelRange: [571, 585] },  // 吼吼鲸
                    { id: 72, weight: 15, levelRange: [571, 585] },   // 玛瑙水母
                    { id: 170, weight: 14, levelRange: [571, 585] },  // 灯笼鱼
                    { id: 369, weight: 10, levelRange: [571, 585] },  // 古空棘鱼
                    { id: 382, weight: 4, levelRange: [584, 585] },   // 盖欧卡（传说）
                ]
            },
            {
                id: 'hoenn_route128',
                name: '128号水道',
                description: '通往彩幽市的危险海域',
                levelRange: [586, 600],
                pokemon: [
                    { id: 319, weight: 20, levelRange: [586, 600] },  // 巨牙鲨
                    { id: 321, weight: 20, levelRange: [586, 600] },  // 吼鲸王
                    { id: 342, weight: 16, levelRange: [586, 600] },  // 铁螯龙虾
                    { id: 340, weight: 14, levelRange: [586, 600] },  // 鲶鱼王
                    { id: 226, weight: 12, levelRange: [586, 600] },  // 巨翅飞鱼
                    { id: 350, weight: 12, levelRange: [586, 600] },  // 美纳斯（稀有）
                    { id: 380, weight: 3, levelRange: [599, 600] },   // 拉帝亚斯（传说）
                ]
            },
            {
                id: 'hoenn_victory_road',
                name: '丰缘冠军之路',
                description: '通往联盟的最终试炼',
                levelRange: [601, 615],
                pokemon: [
                    { id: 305, weight: 17, levelRange: [601, 615] },  // 可多拉
                    { id: 329, weight: 16, levelRange: [601, 615] },  // 超音波幼虫
                    { id: 308, weight: 16, levelRange: [601, 615] },  // 恰雷姆
                    { id: 344, weight: 14, levelRange: [601, 615] },  // 念力土偶
                    { id: 356, weight: 12, levelRange: [601, 615] },  // 彷徨夜灵
                    { id: 372, weight: 12, levelRange: [601, 615] },  // 甲壳龙
                    { id: 375, weight: 11, levelRange: [601, 615] },  // 金属怪（稀有）
                    { id: 381, weight: 3, levelRange: [613, 615] },   // 拉帝欧斯（传说）
                ]
            },
            {
                id: 'hoenn_sealed_chamber',
                name: '封印遗迹',
                description: '隐藏在丰缘各处的古代遗迹',
                levelRange: [616, 630],
                pokemon: [
                    { id: 344, weight: 24, levelRange: [616, 630] },  // 念力土偶
                    { id: 346, weight: 20, levelRange: [616, 630] },  // 摇篮百合
                    { id: 348, weight: 19, levelRange: [616, 630] },  // 太古盔甲
                    { id: 330, weight: 12, levelRange: [616, 630] },  // 沙漠蜻蜓
                    { id: 334, weight: 12, levelRange: [616, 630] },  // 七夕青鸟
                    { id: 377, weight: 6, levelRange: [625, 630] },  // 雷吉洛克（传说）
                    { id: 378, weight: 6, levelRange: [625, 630] },  // 雷吉艾斯（传说）
                    { id: 379, weight: 3, levelRange: [630, 630] },   // 雷吉斯奇鲁（传说）
                ]
            },
            {
                id: 'hoenn_sky_pillar',
                name: '天空之柱',
                description: '传说中烈空坐栖息的高塔',
                levelRange: [631, 645],
                pokemon: [
                    { id: 373, weight: 20, levelRange: [631, 645] },  // 暴飞龙
                    { id: 376, weight: 18, levelRange: [631, 645] },  // 巨金怪
                    { id: 354, weight: 16, levelRange: [631, 645] },  // 诅咒娃娃
                    { id: 356, weight: 15, levelRange: [631, 645] },  // 彷徨夜灵
                    { id: 332, weight: 14, levelRange: [631, 645] },  // 梦歌仙人掌
                    { id: 334, weight: 12, levelRange: [631, 645] },  // 七夕青鸟
                    { id: 384, weight: 4, levelRange: [645, 645] },   // 烈空坐（传说）
                ]
            },
            {
                id: 'hoenn_birth_island',
                name: '诞生之岛',
                description: '传说中代欧奇希斯降临的神秘小岛',
                levelRange: [646, 660],
                pokemon: [
                    { id: 373, weight: 20, levelRange: [646, 660] },  // 暴飞龙
                    { id: 376, weight: 20, levelRange: [646, 660] },  // 巨金怪
                    { id: 289, weight: 15, levelRange: [646, 660] },  // 请假王
                    { id: 297, weight: 15, levelRange: [646, 660] },  // 铁掌力士
                    { id: 330, weight: 14, levelRange: [646, 660] },  // 沙漠蜻蜓
                    { id: 365, weight: 10, levelRange: [646, 660] },  // 帝牙海狮
                    { id: 350, weight: 4, levelRange: [646, 660] },   // 美纳斯
                    { id: 385, weight: 2, levelRange: [659, 660] },   // 基拉祈（幻之宝可梦）
                    { id: 386, weight: 1, levelRange: [660, 660] },   // 代欧奇希斯（幻之宝可梦）
                ]
            },
        ]
    },
    sinnoh: {
        id: 'sinnoh',
        name: '神奥地区',
        nameEn: 'Sinnoh',
        description: '第四世代宝可梦的家园，拥有雄伟的天冠山和神秘的时空传说。需要集齐丰缘地区所有宝可梦才能前往。',
        unlockCondition: { type: 'pokedex_complete', region: 'hoenn', range: [252, 386] },
        routes: [
            {
                id: 'sinnoh_route201',
                name: '201号道路',
                description: '双叶镇到真砂镇之间的道路',
                levelRange: [661, 680],
                pokemon: [
                    { id: 396, weight: 35, levelRange: [661, 680] },  // 姆克儿
                    { id: 399, weight: 30, levelRange: [661, 680] },  // 大牙狸
                    { id: 401, weight: 20, levelRange: [661, 680] },  // 圆法师
                    { id: 403, weight: 15, levelRange: [661, 680] },  // 小猫怪
                ]
            },
            {
                id: 'sinnoh_route202',
                name: '202号道路',
                description: '真砂镇到祝庆市之间的道路',
                levelRange: [681, 700],
                pokemon: [
                    { id: 396, weight: 25, levelRange: [681, 700] },  // 姆克儿
                    { id: 403, weight: 20, levelRange: [681, 700] },  // 小猫怪
                    { id: 406, weight: 20, levelRange: [681, 700] },  // 含羞苞
                    { id: 399, weight: 20, levelRange: [681, 700] },  // 大牙狸
                    { id: 387, weight: 15, levelRange: [681, 700] },  // 草苗龟（稀有）
                ]
            },
            {
                id: 'sinnoh_route204',
                name: '204号道路',
                description: '祝庆市到苑之镇之间的道路',
                levelRange: [701, 720],
                pokemon: [
                    { id: 406, weight: 22, levelRange: [701, 720] },  // 含羞苞
                    { id: 401, weight: 20, levelRange: [701, 720] },  // 圆法师
                    { id: 418, weight: 20, levelRange: [701, 720] },  // 泳圈鼬
                    { id: 396, weight: 18, levelRange: [701, 720] },  // 姆克儿
                    { id: 412, weight: 10, levelRange: [701, 720] },  // 结草儿
                    { id: 390, weight: 10, levelRange: [701, 720] },  // 小火焰猴（稀有）
                ]
            },
            {
                id: 'sinnoh_ravaged_path',
                name: '荒芜小道',
                description: '连接204号道路两段的洞穴',
                levelRange: [721, 740],
                pokemon: [
                    { id: 41, weight: 25, levelRange: [721, 740] },   // 超音蝠
                    { id: 74, weight: 20, levelRange: [721, 740] },   // 小拳石
                    { id: 408, weight: 20, levelRange: [721, 740] },  // 头盖龙
                    { id: 410, weight: 15, levelRange: [721, 740] },  // 盾甲龙
                    { id: 393, weight: 10, levelRange: [721, 740] },  // 波加曼（稀有）
                    { id: 436, weight: 10, levelRange: [721, 740] },  // 铜镜怪
                ]
            },
            {
                id: 'sinnoh_route205',
                name: '205号道路',
                description: '苑之镇到百代森林之间的道路',
                levelRange: [741, 760],
                pokemon: [
                    { id: 418, weight: 22, levelRange: [741, 760] },  // 泳圈鼬
                    { id: 422, weight: 22, levelRange: [741, 760] },  // 无壳海兔
                    { id: 420, weight: 18, levelRange: [741, 760] },  // 樱花宝
                    { id: 397, weight: 18, levelRange: [741, 760] },  // 姆克鸟
                    { id: 415, weight: 10, levelRange: [741, 760] },  // 三蜜蜂
                    { id: 414, weight: 10, levelRange: [741, 760] },  // 绅士蛾
                    { id: 458, weight: 8, levelRange: [741, 760] },   // 小球飞鱼
                ]
            },
            {
                id: 'sinnoh_eterna_forest',
                name: '百代森林',
                description: '百代市附近的古老森林',
                levelRange: [761, 780],
                pokemon: [
                    { id: 406, weight: 20, levelRange: [761, 780] },  // 含羞苞
                    { id: 412, weight: 15, levelRange: [761, 780] },  // 结草儿
                    { id: 414, weight: 15, levelRange: [761, 780] },  // 绅士蛾
                    { id: 415, weight: 15, levelRange: [761, 780] },  // 三蜜蜂
                    { id: 425, weight: 15, levelRange: [761, 780] },  // 飘飘球
                    { id: 442, weight: 10, levelRange: [761, 780] },  // 花岩怪（稀有）
                    { id: 440, weight: 10, levelRange: [761, 780] },  // 小福蛋
                    { id: 417, weight: 8, levelRange: [761, 780] },  // 帕奇利兹
                ]
            },
            {
                id: 'sinnoh_route206',
                name: '206号道路（自行车道）',
                description: '百代市到随意遗迹之间的下坡道路',
                levelRange: [781, 800],
                pokemon: [
                    { id: 434, weight: 22, levelRange: [781, 800] },  // 臭鼬噗
                    { id: 403, weight: 20, levelRange: [781, 800] },  // 小猫怪
                    { id: 397, weight: 18, levelRange: [781, 800] },  // 姆克鸟
                    { id: 432, weight: 15, levelRange: [781, 800] },  // 东施喵
                    { id: 431, weight: 15, levelRange: [781, 800] },  // 魅力喵
                    { id: 433, weight: 10, levelRange: [781, 800] },  // 铃铛响
                ]
            },
            {
                id: 'sinnoh_wayward_cave',
                name: '迷幻洞窟',
                description: '206号道路下方隐藏的洞穴',
                levelRange: [801, 820],
                pokemon: [
                    { id: 74, weight: 20, levelRange: [801, 820] },   // 小拳石
                    { id: 41, weight: 18, levelRange: [801, 820] },   // 超音蝠
                    { id: 436, weight: 18, levelRange: [801, 820] },  // 铜镜怪
                    { id: 438, weight: 17, levelRange: [801, 820] },  // 盆才怪
                    { id: 439, weight: 15, levelRange: [801, 820] },  // 魔尼尼
                    { id: 443, weight: 12, levelRange: [801, 820] },  // 圆陆鲨（稀有）
                ]
            },
            {
                id: 'sinnoh_route209',
                name: '209号道路',
                description: '随意镇到迷路市之间的道路',
                levelRange: [821, 840],
                pokemon: [
                    { id: 431, weight: 20, levelRange: [821, 840] },  // 魅力喵
                    { id: 397, weight: 18, levelRange: [821, 840] },  // 姆克鸟
                    { id: 425, weight: 18, levelRange: [821, 840] },  // 飘飘球
                    { id: 427, weight: 18, levelRange: [821, 840] },  // 卷卷耳
                    { id: 440, weight: 12, levelRange: [821, 840] },  // 小福蛋
                    { id: 442, weight: 8, levelRange: [821, 840] },   // 花岩怪（稀有）
                    { id: 429, weight: 6, levelRange: [840, 840] },   // 梦妖魔（稀有）
                ]
            },
            {
                id: 'sinnoh_lost_tower',
                name: '失落之塔',
                description: '迷路市附近的宝可梦灵魂安息之所',
                levelRange: [841, 860],
                pokemon: [
                    { id: 92, weight: 22, levelRange: [841, 860] },   // 鬼斯
                    { id: 93, weight: 18, levelRange: [841, 860] },   // 鬼斯通
                    { id: 355, weight: 18, levelRange: [841, 860] },  // 夜巡灵
                    { id: 425, weight: 17, levelRange: [841, 860] },  // 飘飘球
                    { id: 200, weight: 15, levelRange: [841, 860] },  // 梦妖
                    { id: 442, weight: 10, levelRange: [841, 860] },  // 花岩怪（稀有）
                ]
            },
            {
                id: 'sinnoh_route210',
                name: '210号道路',
                description: '通往神和镇的浓雾道路',
                levelRange: [861, 880],
                pokemon: [
                    { id: 397, weight: 18, levelRange: [861, 880] },  // 姆克鸟
                    { id: 423, weight: 18, levelRange: [861, 880] },  // 海兔兽
                    { id: 434, weight: 18, levelRange: [861, 880] },  // 臭鼬噗
                    { id: 419, weight: 16, levelRange: [861, 880] },  // 浮潜鼬
                    { id: 433, weight: 15, levelRange: [861, 880] },  // 铃铛响
                    { id: 441, weight: 15, levelRange: [861, 880] },  // 聒噪鸟
                ]
            },
            {
                id: 'sinnoh_route212',
                name: '212号道路',
                description: '帷幕市到水脉市之间的沼泽道路',
                levelRange: [881, 900],
                pokemon: [
                    { id: 453, weight: 22, levelRange: [881, 900] },  // 不良蛙
                    { id: 422, weight: 20, levelRange: [881, 900] },  // 无壳海兔
                    { id: 397, weight: 15, levelRange: [881, 900] },  // 姆克鸟
                    { id: 449, weight: 15, levelRange: [881, 900] },  // 沙河马
                    { id: 455, weight: 15, levelRange: [881, 900] },  // 尖牙笼（稀有）
                    { id: 415, weight: 13, levelRange: [881, 900] },  // 三蜜蜂
                ]
            },
            {
                id: 'sinnoh_great_marsh',
                name: '大湿地',
                description: '水脉市的广阔湿地保护区',
                levelRange: [901, 920],
                pokemon: [
                    { id: 453, weight: 18, levelRange: [901, 920] },  // 不良蛙
                    { id: 451, weight: 18, levelRange: [901, 920] },  // 钳尾蝎
                    { id: 455, weight: 15, levelRange: [901, 920] },  // 尖牙笼
                    { id: 449, weight: 15, levelRange: [901, 920] },  // 沙河马
                    { id: 400, weight: 12, levelRange: [901, 920] },  // 大尾狸
                    { id: 416, weight: 12, levelRange: [901, 920] },  // 蜂女王（稀有）
                    { id: 454, weight: 10, levelRange: [901, 920] },  // 毒骷蛙（稀有）
                ]
            },
            {
                id: 'sinnoh_route214',
                name: '214号道路',
                description: '帷幕市到水脉市东面的道路',
                levelRange: [921, 940],
                pokemon: [
                    { id: 449, weight: 20, levelRange: [921, 940] },  // 沙河马
                    { id: 434, weight: 18, levelRange: [921, 940] },  // 臭鼬噗
                    { id: 453, weight: 18, levelRange: [921, 940] },  // 不良蛙
                    { id: 404, weight: 15, levelRange: [921, 940] },  // 勒克猫
                    { id: 435, weight: 12, levelRange: [921, 940] },  // 坦克臭鼬
                    { id: 450, weight: 10, levelRange: [921, 940] },  // 河马兽（稀有）
                    { id: 446, weight: 7, levelRange: [921, 940] },   // 小卡比兽（稀有）
                ]
            },
            {
                id: 'sinnoh_route215',
                name: '215号道路',
                description: '帷幕市北方的雨天道路',
                levelRange: [941, 960],
                pokemon: [
                    { id: 404, weight: 22, levelRange: [941, 960] },  // 勒克猫
                    { id: 397, weight: 18, levelRange: [941, 960] },  // 姆克鸟
                    { id: 427, weight: 18, levelRange: [941, 960] },  // 卷卷耳
                    { id: 434, weight: 18, levelRange: [941, 960] },  // 臭鼬噗
                    { id: 428, weight: 12, levelRange: [941, 960] },  // 长耳兔（稀有）
                    { id: 448, weight: 12, levelRange: [941, 960] },  // 路卡利欧（稀有）
                ]
            },
            {
                id: 'sinnoh_mt_coronet_south',
                name: '天冠山（南部）',
                description: '神奥地区中央的雄伟山脉',
                levelRange: [961, 980],
                pokemon: [
                    { id: 436, weight: 20, levelRange: [961, 980] },  // 铜镜怪
                    { id: 74, weight: 18, levelRange: [961, 980] },   // 小拳石
                    { id: 437, weight: 15, levelRange: [961, 980] },  // 青铜钟
                    { id: 447, weight: 15, levelRange: [961, 980] },  // 利欧路
                    { id: 443, weight: 12, levelRange: [961, 980] },  // 圆陆鲨
                    { id: 408, weight: 10, levelRange: [961, 980] },  // 头盖龙
                    { id: 410, weight: 10, levelRange: [961, 980] },  // 盾甲龙
                    { id: 482, weight: 3, levelRange: [980, 980] },   // 亚克诺姆（传说）
                ]
            },
            {
                id: 'sinnoh_route216',
                name: '216号道路',
                description: '通往切锋市的雪地道路',
                levelRange: [981, 1000],
                pokemon: [
                    { id: 459, weight: 25, levelRange: [981, 1000] },  // 雪笠怪
                    { id: 215, weight: 20, levelRange: [981, 1000] },  // 狃拉
                    { id: 220, weight: 18, levelRange: [981, 1000] },  // 小山猪
                    { id: 397, weight: 17, levelRange: [981, 1000] },  // 姆克鸟
                    { id: 461, weight: 10, levelRange: [981, 1000] },  // 玛狃拉（稀有）
                    { id: 460, weight: 10, levelRange: [981, 1000] },  // 暴雪王（稀有）
                ]
            },
            {
                id: 'sinnoh_lake_acuity',
                name: '睿智湖',
                description: '切锋市附近的神圣湖泊',
                levelRange: [1001, 1020],
                pokemon: [
                    { id: 459, weight: 22, levelRange: [1001, 1020] },  // 雪笠怪
                    { id: 215, weight: 20, levelRange: [1001, 1020] },  // 狃拉
                    { id: 461, weight: 16, levelRange: [1001, 1020] },  // 玛狃拉
                    { id: 460, weight: 15, levelRange: [1001, 1020] },  // 暴雪王
                    { id: 437, weight: 15, levelRange: [1001, 1020] },  // 青铜钟
                    { id: 478, weight: 9, levelRange: [1001, 1020] },   // 雪妖女（稀有）
                    { id: 480, weight: 3, levelRange: [1020, 1020] },   // 由克希（传说）
                    { id: 481, weight: 3, levelRange: [1020, 1020] },   // 艾姆利多（传说）
                ]
            },
            {
                id: 'sinnoh_route222',
                name: '222号道路',
                description: '通往水脉市的海岸道路',
                levelRange: [1021, 1040],
                pokemon: [
                    { id: 423, weight: 20, levelRange: [1021, 1040] },  // 海兔兽
                    { id: 419, weight: 18, levelRange: [1021, 1040] },  // 浮潜鼬
                    { id: 405, weight: 15, levelRange: [1021, 1040] },  // 伦琴猫
                    { id: 398, weight: 15, levelRange: [1021, 1040] },  // 姆克鹰
                    { id: 457, weight: 15, levelRange: [1021, 1040] },  // 霓虹鱼
                    { id: 456, weight: 10, levelRange: [1021, 1040] },  // 荧光鱼
                    { id: 479, weight: 7, levelRange: [1040, 1040] },   // 洛托姆（稀有）
                    { id: 489, weight: 1, levelRange: [1040, 1040] },   // 霏欧纳（传说）
                ]
            },
            {
                id: 'sinnoh_mt_coronet_summit',
                name: '天冠山（枪之柱）',
                description: '天冠山顶峰，传说中时空扭曲之地',
                levelRange: [1041, 1060],
                pokemon: [
                    { id: 444, weight: 20, levelRange: [1041, 1060] },  // 尖牙陆鲨
                    { id: 437, weight: 20, levelRange: [1041, 1060] },  // 青铜钟
                    { id: 448, weight: 14, levelRange: [1041, 1060] },  // 路卡利欧
                    { id: 460, weight: 12, levelRange: [1041, 1060] },  // 暴雪王
                    { id: 476, weight: 12, levelRange: [1041, 1060] },  // 大朝北鼻
                    { id: 485, weight: 7, levelRange: [1059, 1060] },   // 席多蓝恩（传说）
                    { id: 483, weight: 2, levelRange: [1060, 1060] },   // 帝牙卢卡（传说）
                    { id: 484, weight: 2, levelRange: [1060, 1060] },   // 帕路奇亚（传说）
                ]
            },
            {
                id: 'sinnoh_victory_road',
                name: '神奥冠军之路',
                description: '通往神奥联盟的最终试炼',
                levelRange: [1061, 1080],
                pokemon: [
                    { id: 445, weight: 16, levelRange: [1061, 1080] },  // 烈咬陆鲨
                    { id: 398, weight: 16, levelRange: [1061, 1080] },  // 姆克鹰
                    { id: 448, weight: 14, levelRange: [1061, 1080] },  // 路卡利欧
                    { id: 405, weight: 14, levelRange: [1061, 1080] },  // 伦琴猫
                    { id: 452, weight: 12, levelRange: [1061, 1080] },  // 龙王蝎
                    { id: 444, weight: 12, levelRange: [1061, 1080] },  // 尖牙陆鲨
                    { id: 475, weight: 10, levelRange: [1061, 1080] },  // 艾路雷朵（稀有）
                    { id: 473, weight: 6, levelRange: [1061, 1080] },   // 象牙猪（稀有）
                    { id: 486, weight: 2, levelRange: [1080, 1080] },   // 雷吉奇卡斯（传说）
                ]
            },
            {
                id: 'sinnoh_sendoff_spring',
                name: '归途洞窟',
                description: '通往反转世界入口的神秘洞窟',
                levelRange: [1081, 1100],
                pokemon: [
                    { id: 445, weight: 18, levelRange: [1081, 1100] },  // 烈咬陆鲨
                    { id: 452, weight: 16, levelRange: [1081, 1100] },  // 龙王蝎
                    { id: 429, weight: 14, levelRange: [1081, 1100] },  // 梦妖魔
                    { id: 477, weight: 14, levelRange: [1081, 1100] },  // 黑夜魔灵
                    { id: 472, weight: 12, levelRange: [1081, 1100] },  // 天蝎王
                    { id: 442, weight: 10, levelRange: [1081, 1100] },  // 花岩怪
                    { id: 487, weight: 2, levelRange: [1100, 1100] },   // 骑拉帝纳（传说）
                ]
            },
            {
                id: 'sinnoh_fullmoon_island',
                name: '满月岛 & 新月岛',
                description: '传说中蕾冠王与达克莱伊栖息的神秘岛屿',
                levelRange: [1101, 1120],
                pokemon: [
                    { id: 445, weight: 18, levelRange: [1101, 1120] },  // 烈咬陆鲨
                    { id: 448, weight: 16, levelRange: [1101, 1120] },  // 路卡利欧
                    { id: 405, weight: 14, levelRange: [1101, 1120] },  // 伦琴猫
                    { id: 475, weight: 13, levelRange: [1101, 1120] },  // 艾路雷朵
                    { id: 428, weight: 12, levelRange: [1101, 1120] },  // 长耳兔
                    { id: 488, weight: 3, levelRange: [1120, 1120] },   // 克雷色利亚（传说）
                    { id: 491, weight: 3, levelRange: [1120, 1120] },   // 达克莱伊（传说）
                    { id: 490, weight: 3, levelRange: [1120, 1120] },   // 玛纳霏（传说）
                ]
            },
            {
                id: 'sinnoh_hall_of_origin',
                name: '创始之间',
                description: '传说中阿尔宙斯降临的至高圣域',
                levelRange: [1121, 1140],
                pokemon: [
                    { id: 445, weight: 16, levelRange: [1121, 1140] },  // 烈咬陆鲨
                    { id: 448, weight: 14, levelRange: [1121, 1140] },  // 路卡利欧
                    { id: 475, weight: 14, levelRange: [1121, 1140] },  // 艾路雷朵
                    { id: 473, weight: 12, levelRange: [1121, 1140] },  // 象牙猪
                    { id: 477, weight: 12, levelRange: [1121, 1140] },  // 黑夜魔灵
                    { id: 476, weight: 10, levelRange: [1121, 1140] },  // 大朝北鼻
                    { id: 474, weight: 8, levelRange: [1121, 1140] },   // 多边兽Z（稀有）
                    { id: 492, weight: 2, levelRange: [1140, 1140] },   // 谢米（幻之宝可梦）
                    { id: 493, weight: 1, levelRange: [1140, 1140] },   // 阿尔宙斯（幻之宝可梦）
                ]
            },
        ]
    },
    unova: {
        id: 'unova',
        name: '合众地区',
        nameEn: 'Unova',
        description: '第五世代宝可梦的故乡，拥有繁华的都市与广袤的自然。需要集齐神奥地区所有宝可梦才能前往。',
        unlockCondition: { type: 'pokedex_complete', region: 'sinnoh', range: [387, 493] },
        routes: [
            {
                id: 'unova_route1',
                name: '1号道路',
                description: '鹿子镇到唐草镇之间的道路',
                levelRange: [1141, 1165],
                pokemon: [
                    { id: 504, weight: 35, levelRange: [1141, 1165] },  // 探探鼠
                    { id: 519, weight: 30, levelRange: [1141, 1165] },  // 豆豆鸽
                    { id: 506, weight: 20, levelRange: [1141, 1165] },  // 小约克
                    { id: 509, weight: 15, levelRange: [1141, 1165] },  // 扒手猫
                ]
            },
            {
                id: 'unova_route2',
                name: '2号道路',
                description: '唐草镇到三曜市之间的道路',
                levelRange: [1166, 1190],
                pokemon: [
                    { id: 506, weight: 25, levelRange: [1166, 1190] },  // 小约克
                    { id: 504, weight: 20, levelRange: [1166, 1190] },  // 探探鼠
                    { id: 509, weight: 20, levelRange: [1166, 1190] },  // 扒手猫
                    { id: 511, weight: 12, levelRange: [1166, 1190] },  // 花椰猴
                    { id: 513, weight: 12, levelRange: [1166, 1190] },  // 爆香猴
                    { id: 515, weight: 11, levelRange: [1166, 1190] },  // 冷水猴
                ]
            },
            {
                id: 'unova_dreamyard',
                name: '梦之遗迹',
                description: '三曜市郊外的神秘遗迹',
                levelRange: [1191, 1215],
                pokemon: [
                    { id: 517, weight: 25, levelRange: [1191, 1215] },  // 食梦梦
                    { id: 543, weight: 20, levelRange: [1191, 1215] },  // 百足蜈蚣
                    { id: 540, weight: 20, levelRange: [1191, 1215] },  // 虫宝包
                    { id: 519, weight: 15, levelRange: [1191, 1215] },  // 豆豆鸽
                    { id: 546, weight: 10, levelRange: [1191, 1215] },  // 木棉球
                    { id: 495, weight: 10, levelRange: [1191, 1215] },  // 藤藤蛇（稀有）
                ]
            },
            {
                id: 'unova_route3',
                name: '3号道路',
                description: '三曜市到七宝市之间的道路',
                levelRange: [1216, 1240],
                pokemon: [
                    { id: 522, weight: 22, levelRange: [1216, 1240] },  // 斑斑马
                    { id: 520, weight: 20, levelRange: [1216, 1240] },  // 咕咕鸽
                    { id: 548, weight: 18, levelRange: [1216, 1240] },  // 百合根娃娃
                    { id: 535, weight: 15, levelRange: [1216, 1240] },  // 圆蝌蚪
                    { id: 505, weight: 15, levelRange: [1216, 1240] },  // 步哨鼠
                    { id: 550, weight: 12, levelRange: [1216, 1240] },  // 野蛮鲈鱼
                    { id: 498, weight: 10, levelRange: [1216, 1240] },  // 暖暖猪（稀有）
                ]
            },
            {
                id: 'unova_wellspring_cave',
                name: '地下水脉穴',
                description: '连接3号道路与4号道路的洞穴',
                levelRange: [1241, 1265],
                pokemon: [
                    { id: 524, weight: 25, levelRange: [1241, 1265] },  // 石丸子
                    { id: 532, weight: 22, levelRange: [1241, 1265] },  // 搬运小匠
                    { id: 527, weight: 18, levelRange: [1241, 1265] },  // 滚滚蝙蝠
                    { id: 535, weight: 15, levelRange: [1241, 1265] },  // 圆蝌蚪
                    { id: 529, weight: 10, levelRange: [1241, 1265] },  // 螺钉地鼠
                    { id: 501, weight: 10, levelRange: [1241, 1265] },  // 水水獭（稀有）
                ]
            },
            {
                id: 'unova_route4',
                name: '4号道路（沙漠区）',
                description: '七宝市到飞云市之间的沙漠道路',
                levelRange: [1266, 1290],
                pokemon: [
                    { id: 551, weight: 25, levelRange: [1266, 1290] },  // 黑眼鳄
                    { id: 554, weight: 18, levelRange: [1266, 1290] },  // 火红不倒翁
                    { id: 556, weight: 15, levelRange: [1266, 1290] },  // 沙铃仙人掌
                    { id: 557, weight: 15, levelRange: [1266, 1290] },  // 石居蟹
                    { id: 572, weight: 15, levelRange: [1266, 1290] },  // 泡沫栗鼠
                    { id: 570, weight: 12, levelRange: [1266, 1290] },  // 索罗亚（稀有）
                ]
            },
            {
                id: 'unova_pinwheel_forest',
                name: '矢车之森',
                description: '七宝市附近的茂密森林',
                levelRange: [1291, 1315],
                pokemon: [
                    { id: 540, weight: 20, levelRange: [1291, 1315] },  // 虫宝包
                    { id: 543, weight: 18, levelRange: [1291, 1315] },  // 百足蜈蚣
                    { id: 546, weight: 15, levelRange: [1291, 1315] },  // 木棉球
                    { id: 548, weight: 15, levelRange: [1291, 1315] },  // 百合根娃娃
                    { id: 585, weight: 15, levelRange: [1291, 1315] },  // 四季鹿
                    { id: 636, weight: 10, levelRange: [1291, 1315] },  // 燃烧虫（稀有）
                    { id: 531, weight: 7, levelRange: [1291, 1315] },   // 差不多娃娃（稀有）
                ]
            },
            {
                id: 'unova_skyarrow_bridge',
                name: '天箭桥',
                description: '连接飞云市的宏伟大桥',
                levelRange: [1316, 1340],
                pokemon: [
                    { id: 520, weight: 22, levelRange: [1316, 1340] },  // 咕咕鸽
                    { id: 580, weight: 22, levelRange: [1316, 1340] },  // 鸭宝宝
                    { id: 568, weight: 18, levelRange: [1316, 1340] },  // 破破袋
                    { id: 595, weight: 15, levelRange: [1316, 1340] },  // 电电虫
                    { id: 507, weight: 13, levelRange: [1316, 1340] },  // 哈约克
                    { id: 594, weight: 10, levelRange: [1316, 1340] },  // 保姆曼波
                    { id: 587, weight: 10, levelRange: [1316, 1340] },  // 电飞鼠（稀有）
                ]
            },
            {
                id: 'unova_route5',
                name: '5号道路',
                description: '飞云市到帆巴市之间的道路',
                levelRange: [1341, 1365],
                pokemon: [
                    { id: 510, weight: 20, levelRange: [1341, 1365] },  // 酷豹
                    { id: 572, weight: 18, levelRange: [1341, 1365] },  // 泡沫栗鼠
                    { id: 595, weight: 18, levelRange: [1341, 1365] },  // 电电虫
                    { id: 568, weight: 15, levelRange: [1341, 1365] },  // 破破袋
                    { id: 538, weight: 12, levelRange: [1341, 1365] },  // 投摔鬼
                    { id: 559, weight: 10, levelRange: [1341, 1365] },  // 滑滑小子
                    { id: 574, weight: 7, levelRange: [1341, 1365] },   // 哥德宝宝（稀有）
                ]
            },
            {
                id: 'unova_desert_resort',
                name: '古代城堡（沙漠度假区）',
                description: '合众地区中心的广袤沙漠遗迹',
                levelRange: [1366, 1390],
                pokemon: [
                    { id: 551, weight: 20, levelRange: [1366, 1390] },  // 黑眼鳄
                    { id: 561, weight: 15, levelRange: [1366, 1390] },  // 象征鸟
                    { id: 562, weight: 15, levelRange: [1366, 1390] },  // 哭哭面具
                    { id: 622, weight: 15, levelRange: [1366, 1390] },  // 泥偶小人
                    { id: 554, weight: 12, levelRange: [1366, 1390] },  // 火红不倒翁
                    { id: 564, weight: 10, levelRange: [1366, 1390] },  // 原盖海龟（稀有）
                    { id: 566, weight: 8, levelRange: [1366, 1390] },   // 始祖小鸟（稀有）
                    { id: 618, weight: 5, levelRange: [1366, 1390] },   // 泥巴鱼（稀有）
                ]
            },
            {
                id: 'unova_route6',
                name: '6号道路',
                description: '帆巴市到电气石洞穴之间的道路',
                levelRange: [1391, 1415],
                pokemon: [
                    { id: 585, weight: 20, levelRange: [1391, 1415] },  // 四季鹿
                    { id: 577, weight: 18, levelRange: [1391, 1415] },  // 单卵细胞球
                    { id: 536, weight: 15, levelRange: [1391, 1415] },  // 蓝蟾蜍
                    { id: 599, weight: 15, levelRange: [1391, 1415] },  // 齿轮儿
                    { id: 590, weight: 15, levelRange: [1391, 1415] },  // 哎呀球菇
                    { id: 597, weight: 10, levelRange: [1391, 1415] },  // 种子铁球（稀有）
                    { id: 607, weight: 7, levelRange: [1391, 1415] },   // 烛光灵（稀有）
                ]
            },
            {
                id: 'unova_chargestone_cave',
                name: '电气石洞穴',
                description: '充满电气石的神秘洞穴',
                levelRange: [1416, 1440],
                pokemon: [
                    { id: 599, weight: 22, levelRange: [1416, 1440] },  // 齿轮儿
                    { id: 602, weight: 18, levelRange: [1416, 1440] },  // 麻麻小鱼
                    { id: 525, weight: 18, levelRange: [1416, 1440] },  // 地幔岩
                    { id: 529, weight: 15, levelRange: [1416, 1440] },  // 螺钉地鼠
                    { id: 527, weight: 12, levelRange: [1416, 1440] },  // 滚滚蝙蝠
                    { id: 588, weight: 10, levelRange: [1416, 1440] },  // 盖盖虫（稀有）
                    { id: 616, weight: 5, levelRange: [1416, 1440] },   // 小嘴蜗（稀有）
                ]
            },
            {
                id: 'unova_route7',
                name: '7号道路',
                description: '帆巴市到吹寄市之间的塔楼道路',
                levelRange: [1441, 1465],
                pokemon: [
                    { id: 586, weight: 20, levelRange: [1441, 1465] },  // 萌芽鹿
                    { id: 547, weight: 15, levelRange: [1441, 1465] },  // 风妖精
                    { id: 549, weight: 15, levelRange: [1441, 1465] },  // 裙儿小姐
                    { id: 521, weight: 15, levelRange: [1441, 1465] },  // 高傲雉鸡
                    { id: 569, weight: 15, levelRange: [1441, 1465] },  // 灰尘山
                    { id: 582, weight: 10, levelRange: [1441, 1465] },  // 迷你冰（稀有）
                    { id: 629, weight: 10, levelRange: [1441, 1465] },  // 秃鹰丫头
                ]
            },
            {
                id: 'unova_celestial_tower',
                name: '天堂之塔',
                description: '吹寄市附近的灵魂安息之所',
                levelRange: [1466, 1490],
                pokemon: [
                    { id: 607, weight: 25, levelRange: [1466, 1490] },  // 烛光灵
                    { id: 592, weight: 20, levelRange: [1466, 1490] },  // 轻飘飘
                    { id: 562, weight: 18, levelRange: [1466, 1490] },  // 哭哭面具
                    { id: 608, weight: 15, levelRange: [1466, 1490] },  // 灯火幽灵
                    { id: 528, weight: 12, levelRange: [1466, 1490] },  // 心蝙蝠
                    { id: 605, weight: 10, levelRange: [1466, 1490] },  // 小灰怪
                    { id: 569, weight: 10, levelRange: [1466, 1490] },  // 灰尘山
                ]
            },
            {
                id: 'unova_route8',
                name: '8号道路（湿地）',
                description: '吹寄市到雪花市之间的沼泽道路',
                levelRange: [1491, 1515],
                pokemon: [
                    { id: 537, weight: 18, levelRange: [1491, 1515] },  // 蟾蜍王
                    { id: 613, weight: 18, levelRange: [1491, 1515] },  // 喷嚏熊
                    { id: 569, weight: 15, levelRange: [1491, 1515] },  // 灰尘山
                    { id: 593, weight: 15, levelRange: [1491, 1515] },  // 胖嘟嘟
                    { id: 545, weight: 12, levelRange: [1491, 1515] },  // 蜈蚣王
                    { id: 615, weight: 12, levelRange: [1491, 1515] },  // 几何雪花（稀有）
                    { id: 591, weight: 10, levelRange: [1491, 1515] },  // 败露球菇
                    { id: 606, weight: 7, levelRange: [1491, 1515] },   // 大宇怪（稀有）
                    { id: 642, weight: 3, levelRange: [1515, 1515] },   // 雷电云（传说·风云神）
                ]
            },
            {
                id: 'unova_twist_mountain',
                name: '螺旋山',
                description: '合众地区中心的螺旋状巨大山脉',
                levelRange: [1516, 1540],
                pokemon: [
                    { id: 526, weight: 20, levelRange: [1516, 1540] },  // 庞岩怪
                    { id: 534, weight: 18, levelRange: [1516, 1540] },  // 修建老匠
                    { id: 530, weight: 15, levelRange: [1516, 1540] },  // 龙头地鼠
                    { id: 613, weight: 15, levelRange: [1516, 1540] },  // 喷嚏熊
                    { id: 624, weight: 12, levelRange: [1516, 1540] },  // 驹刀小兵
                    { id: 631, weight: 10, levelRange: [1516, 1540] },  // 熔蚁兽（稀有）
                    { id: 632, weight: 10, levelRange: [1516, 1540] },  // 铁蚁（稀有）
                    { id: 645, weight: 3, levelRange: [1540, 1540] },   // 土地云（传说·风云神）
                ]
            },
            {
                id: 'unova_route9',
                name: '9号道路',
                description: '帆巴市到双龙市之间的购物街道路',
                levelRange: [1541, 1565],
                pokemon: [
                    { id: 560, weight: 18, levelRange: [1541, 1565] },  // 头巾混混
                    { id: 552, weight: 18, levelRange: [1541, 1565] },  // 混混鳄
                    { id: 510, weight: 15, levelRange: [1541, 1565] },  // 酷豹
                    { id: 571, weight: 12, levelRange: [1541, 1565] },  // 索罗亚克
                    { id: 523, weight: 12, levelRange: [1541, 1565] },  // 雷电斑马
                    { id: 619, weight: 12, levelRange: [1541, 1565] },  // 功夫鼬
                    { id: 626, weight: 8, levelRange: [1541, 1565] },   // 爆炸头水牛（稀有）
                    { id: 610, weight: 5, levelRange: [1541, 1565] },   // 牙牙（稀有）
                    { id: 647, weight: 2, levelRange: [1565, 1565] },   // 凯路迪欧（幻之宝可梦）
                ]
            },
            {
                id: 'unova_dragonspiral_tower',
                name: '龙螺旋之塔',
                description: '合众地区最古老的建筑，传说中龙之宝可梦沉睡之地',
                levelRange: [1566, 1590],
                pokemon: [
                    { id: 610, weight: 20, levelRange: [1566, 1590] },  // 牙牙
                    { id: 563, weight: 18, levelRange: [1566, 1590] },  // 死神棺
                    { id: 623, weight: 15, levelRange: [1566, 1590] },  // 泥偶巨人
                    { id: 609, weight: 12, levelRange: [1566, 1590] },  // 水晶灯火灵
                    { id: 576, weight: 12, levelRange: [1566, 1590] },  // 哥德小姐
                    { id: 579, weight: 10, levelRange: [1566, 1590] },  // 人造细胞卵
                    { id: 621, weight: 10, levelRange: [1566, 1590] },  // 赤面龙
                    { id: 633, weight: 8, levelRange: [1566, 1590] },   // 单首龙（稀有）
                    { id: 638, weight: 3, levelRange: [1590, 1590] },   // 勾帕路翁（传说）
                    { id: 639, weight: 2, levelRange: [1590, 1590] },   // 代拉基翁（传说）
                ]
            },
            {
                id: 'unova_route10',
                name: '10号道路',
                description: '通往合众冠军之路的入口',
                levelRange: [1591, 1615],
                pokemon: [
                    { id: 553, weight: 18, levelRange: [1591, 1615] },  // 流氓鳄
                    { id: 555, weight: 15, levelRange: [1591, 1615] },  // 达摩狒狒
                    { id: 508, weight: 15, levelRange: [1591, 1615] },  // 长毛狗
                    { id: 542, weight: 15, levelRange: [1591, 1615] },  // 保姆虫
                    { id: 627, weight: 12, levelRange: [1591, 1615] },  // 毛头小鹰
                    { id: 629, weight: 10, levelRange: [1591, 1615] },  // 秃鹰丫头
                    { id: 596, weight: 10, levelRange: [1591, 1615] },  // 电蜘蛛
                    { id: 640, weight: 3, levelRange: [1615, 1615] },   // 毕力吉翁（传说）
                    { id: 641, weight: 3, levelRange: [1615, 1615] },   // 龙卷云（传说）
                ]
            },
            {
                id: 'unova_victory_road',
                name: '合众冠军之路',
                description: '通往合众联盟的最终试炼',
                levelRange: [1616, 1640],
                pokemon: [
                    { id: 611, weight: 16, levelRange: [1616, 1640] },  // 斧牙龙
                    { id: 625, weight: 14, levelRange: [1616, 1640] },  // 劈斩司令
                    { id: 601, weight: 14, levelRange: [1616, 1640] },  // 齿轮怪
                    { id: 589, weight: 12, levelRange: [1616, 1640] },  // 骑士蜗牛
                    { id: 617, weight: 12, levelRange: [1616, 1640] },  // 敏捷虫
                    { id: 637, weight: 10, levelRange: [1616, 1640] },  // 火神蛾
                    { id: 634, weight: 10, levelRange: [1616, 1640] },  // 双首暴龙
                    { id: 628, weight: 8, levelRange: [1616, 1640] },   // 勇士雄鹰（稀有）
                    { id: 630, weight: 4, levelRange: [1616, 1640] },   // 秃鹰娜（稀有）
                    { id: 648, weight: 2, levelRange: [1640, 1640] },   // 美洛耶塔（幻之宝可梦）
                ]
            },
            {
                id: 'unova_giant_chasm',
                name: '巨人洞窟',
                description: '传说中酋雷姆栖息的冰冷巨洞',
                levelRange: [1641, 1665],
                pokemon: [
                    { id: 614, weight: 16, levelRange: [1641, 1665] },  // 冻原熊
                    { id: 584, weight: 14, levelRange: [1641, 1665] },  // 双倍多多冰
                    { id: 604, weight: 14, levelRange: [1641, 1665] },  // 麻麻鳗鱼王
                    { id: 598, weight: 12, levelRange: [1641, 1665] },  // 坚果哑铃
                    { id: 558, weight: 12, levelRange: [1641, 1665] },  // 岩殿居蟹
                    { id: 565, weight: 10, levelRange: [1641, 1665] },  // 肋骨海龟
                    { id: 567, weight: 10, levelRange: [1641, 1665] },  // 始祖大鸟
                    { id: 646, weight: 1, levelRange: [1665, 1665] },   // 酋雷姆（传说）
                ]
            },
            {
                id: 'unova_n_castle',
                name: 'N之城堡',
                description: '等离子团的空中城堡，传说之龙沉眠之地',
                levelRange: [1666, 1690],
                pokemon: [
                    { id: 612, weight: 14, levelRange: [1666, 1690] },  // 双斧战龙
                    { id: 635, weight: 12, levelRange: [1666, 1690] },  // 三首恶龙
                    { id: 571, weight: 12, levelRange: [1666, 1690] },  // 索罗亚克
                    { id: 555, weight: 10, levelRange: [1666, 1690] },  // 达摩狒狒
                    { id: 637, weight: 10, levelRange: [1666, 1690] },  // 火神蛾
                    { id: 609, weight: 10, levelRange: [1666, 1690] },  // 水晶灯火灵
                    { id: 539, weight: 8, levelRange: [1666, 1690] },   // 打击鬼
                    { id: 538, weight: 8, levelRange: [1666, 1690] },   // 投摔鬼
                    { id: 643, weight: 2, levelRange: [1689, 1690] },   // 莱希拉姆（传说）
                    { id: 644, weight: 2, levelRange: [1689, 1690] },   // 捷克罗姆（传说）
                ]
            },
            {
                id: 'unova_liberty_garden',
                name: '自由花园 & 天涯之境',
                description: '传说中幻之宝可梦栖息的神秘场所',
                levelRange: [1691, 1715],
                pokemon: [
                    { id: 612, weight: 14, levelRange: [1691, 1715] },  // 双斧战龙
                    { id: 635, weight: 12, levelRange: [1691, 1715] },  // 三首恶龙
                    { id: 637, weight: 12, levelRange: [1691, 1715] },  // 火神蛾
                    { id: 604, weight: 10, levelRange: [1691, 1715] },  // 麻麻鳗鱼王
                    { id: 625, weight: 10, levelRange: [1691, 1715] },  // 劈斩司令
                    { id: 589, weight: 10, levelRange: [1691, 1715] },  // 骑士蜗牛
                    { id: 601, weight: 10, levelRange: [1691, 1715] },  // 齿轮怪
                    { id: 628, weight: 8, levelRange: [1691, 1715] },   // 勇士雄鹰
                    { id: 494, weight: 2, levelRange: [1715, 1715] },   // 比克提尼（幻之宝可梦）
                    { id: 649, weight: 1, levelRange: [1664, 1665] },   // 盖诺赛克特（幻之宝可梦）
                ]
            },
        ]
    },
    kalos: {
        id: 'kalos',
        name: '卡洛斯地区',
        nameEn: 'Kalos',
        description: '第六世代宝可梦的故乡，以美丽的巴黎风格城市与Mega进化闻名。需要集齐合众地区所有宝可梦才能前往。',
        unlockCondition: { type: 'pokedex_complete', region: 'unova', range: [494, 649] },
        routes: [
            {
                id: 'kalos_route2',
                name: '2号道路',
                description: '白檀市到朝香镇之间的森林小径',
                levelRange: [1716, 1745],
                pokemon: [
                    { id: 659, weight: 30, levelRange: [1716, 1745] },  // 掘掘兔
                    { id: 661, weight: 25, levelRange: [1716, 1745] },  // 小箭雀
                    { id: 664, weight: 20, levelRange: [1716, 1745] },  // 粉蝶虫
                    { id: 650, weight: 15, levelRange: [1716, 1745] },  // 哈力栗
                    { id: 656, weight: 10, levelRange: [1716, 1745] },  // 呱呱泡蛙（稀有）
                ]
            },
            {
                id: 'kalos_santalune_forest',
                name: '白檀森林',
                description: '白檀市附近的茂密森林，虫系宝可梦乐园',
                levelRange: [1746, 1775],
                pokemon: [
                    { id: 664, weight: 25, levelRange: [1746, 1775] },  // 粉蝶虫
                    { id: 665, weight: 20, levelRange: [1746, 1775] },  // 粉蝶蛹
                    { id: 661, weight: 20, levelRange: [1746, 1775] },  // 小箭雀
                    { id: 659, weight: 15, levelRange: [1746, 1775] },  // 掘掘兔
                    { id: 653, weight: 10, levelRange: [1746, 1775] },  // 火狐狸（稀有）
                    { id: 666, weight: 10, levelRange: [1746, 1775] },  // 彩粉蝶（稀有）
                ]
            },
            {
                id: 'kalos_route4',
                name: '4号道路（花庭园）',
                description: '密阿雷市南面的美丽花园道路',
                levelRange: [1776, 1805],
                pokemon: [
                    { id: 669, weight: 25, levelRange: [1776, 1805] },  // 花蓓蓓
                    { id: 667, weight: 20, levelRange: [1776, 1805] },  // 小狮狮
                    { id: 672, weight: 20, levelRange: [1776, 1805] },  // 坐骑小羊
                    { id: 661, weight: 15, levelRange: [1776, 1805] },  // 小箭雀
                    { id: 662, weight: 10, levelRange: [1776, 1805] },  // 火箭雀
                    { id: 670, weight: 10, levelRange: [1776, 1805] },  // 花叶蒂（稀有）
                ]
            },
            {
                id: 'kalos_route5',
                name: '5号道路',
                description: '密阿雷市到海翼市之间的道路',
                levelRange: [1806, 1835],
                pokemon: [
                    { id: 674, weight: 22, levelRange: [1806, 1835] },  // 顽皮熊猫
                    { id: 659, weight: 20, levelRange: [1806, 1835] },  // 掘掘兔
                    { id: 667, weight: 18, levelRange: [1806, 1835] },  // 小狮狮
                    { id: 661, weight: 15, levelRange: [1806, 1835] },  // 小箭雀
                    { id: 660, weight: 15, levelRange: [1806, 1835] },  // 掘地兔
                    { id: 650, weight: 10, levelRange: [1806, 1835] },  // 哈力栗（稀有）
                ]
            },
            {
                id: 'kalos_route7',
                name: '7号道路（要塞道路）',
                description: '通往异世石碑的古道',
                levelRange: [1836, 1865],
                pokemon: [
                    { id: 676, weight: 20, levelRange: [1836, 1865] },  // 多丽米亚
                    { id: 672, weight: 18, levelRange: [1836, 1865] },  // 坐骑小羊
                    { id: 674, weight: 18, levelRange: [1836, 1865] },  // 顽皮熊猫
                    { id: 662, weight: 15, levelRange: [1836, 1865] },  // 火箭雀
                    { id: 678, weight: 12, levelRange: [1836, 1865] },  // 超能妙喵
                    { id: 677, weight: 12, levelRange: [1836, 1865] },  // 妙喵
                    { id: 656, weight: 5, levelRange: [1836, 1865] },   // 呱呱泡蛙（稀有）
                ]
            },
            {
                id: 'kalos_connecting_cave',
                name: '连接洞穴',
                description: '连接7号道路和密阿雷市的洞窟',
                levelRange: [1866, 1895],
                pokemon: [
                    { id: 679, weight: 25, levelRange: [1866, 1895] },  // 独剑鞘
                    { id: 703, weight: 18, levelRange: [1866, 1895] },  // 小碎钻
                    { id: 41, weight: 18, levelRange: [1866, 1895] },   // 超音蝠
                    { id: 694, weight: 15, levelRange: [1866, 1895] },  // 伞电蜥
                    { id: 680, weight: 14, levelRange: [1866, 1895] },  // 双剑鞘（稀有）
                    { id: 695, weight: 10, levelRange: [1866, 1895] },  // 光电伞蜥（稀有）
                ]
            },
            {
                id: 'kalos_route8',
                name: '8号道路（海岸线）',
                description: '海翼市到古香市之间的海岸道路',
                levelRange: [1896, 1925],
                pokemon: [
                    { id: 688, weight: 22, levelRange: [1896, 1925] },  // 龟脚脚
                    { id: 690, weight: 20, levelRange: [1896, 1925] },  // 垃垃藻
                    { id: 692, weight: 18, levelRange: [1896, 1925] },  // 铁臂枪虾
                    { id: 686, weight: 15, levelRange: [1896, 1925] },  // 好啦鱿
                    { id: 689, weight: 12, levelRange: [1896, 1925] },  // 龟足巨铠（稀有）
                    { id: 693, weight: 8, levelRange: [1896, 1925] },   // 钢炮臂虾（稀有）
                    { id: 687, weight: 5, levelRange: [1896, 1925] },   // 乌贼王（稀有）
                ]
            },
            {
                id: 'kalos_route9',
                name: '9号道路（碎石路）',
                description: '古香市到映照洞穴之间的陡峭山路',
                levelRange: [1926, 1955],
                pokemon: [
                    { id: 696, weight: 22, levelRange: [1926, 1955] },  // 宝宝暴龙
                    { id: 698, weight: 22, levelRange: [1926, 1955] },  // 冰雪龙
                    { id: 672, weight: 18, levelRange: [1926, 1955] },  // 坐骑小羊
                    { id: 673, weight: 15, levelRange: [1926, 1955] },  // 坐骑山羊
                    { id: 697, weight: 13, levelRange: [1926, 1955] },  // 怪颚龙（稀有）
                    { id: 699, weight: 10, levelRange: [1926, 1955] },  // 冰雪巨龙（稀有）
                ]
            },
            {
                id: 'kalos_glittering_cave',
                name: '映照洞穴',
                description: '蕴含化石的闪亮洞窟',
                levelRange: [1956, 1985],
                pokemon: [
                    { id: 703, weight: 25, levelRange: [1956, 1985] },  // 小碎钻
                    { id: 679, weight: 20, levelRange: [1956, 1985] },  // 独剑鞘
                    { id: 696, weight: 15, levelRange: [1956, 1985] },  // 宝宝暴龙
                    { id: 698, weight: 15, levelRange: [1956, 1985] },  // 冰雪龙
                    { id: 694, weight: 12, levelRange: [1956, 1985] },  // 伞电蜥
                    { id: 680, weight: 8, levelRange: [1956, 1985] },   // 双剑鞘（稀有）
                    { id: 704, weight: 5, levelRange: [1956, 1985] },   // 黏黏宝（稀有）
                ]
            },
            {
                id: 'kalos_route10',
                name: '10号道路（石碑道路）',
                description: '密阿雷市到荒凉镇之间的神秘道路',
                levelRange: [1986, 2015],
                pokemon: [
                    { id: 705, weight: 18, levelRange: [1986, 2015] },  // 黏美儿
                    { id: 667, weight: 15, levelRange: [1986, 2015] },  // 小狮狮
                    { id: 668, weight: 15, levelRange: [1986, 2015] },  // 火炎狮
                    { id: 678, weight: 15, levelRange: [1986, 2015] },  // 超能妙喵
                    { id: 662, weight: 12, levelRange: [1986, 2015] },  // 火箭雀
                    { id: 663, weight: 12, levelRange: [1986, 2015] },  // 烈箭鹰
                    { id: 706, weight: 8, levelRange: [1986, 2015] },   // 黏美龙（稀有）
                    { id: 704, weight: 5, levelRange: [1986, 2015] },   // 黏黏宝（稀有）
                    { id: 700, weight: 5, levelRange: [1986, 2015] },   // 仙子伊布（稀有）
                ]
            },
            {
                id: 'kalos_route11',
                name: '11号道路（镜穴道路）',
                description: '通往映照洞穴的崎岖道路',
                levelRange: [2016, 2045],
                pokemon: [
                    { id: 674, weight: 20, levelRange: [2016, 2045] },  // 顽皮熊猫
                    { id: 667, weight: 18, levelRange: [2016, 2045] },  // 小狮狮
                    { id: 675, weight: 15, levelRange: [2016, 2045] },  // 霸道熊猫
                    { id: 682, weight: 15, levelRange: [2016, 2045] },  // 粉香香
                    { id: 684, weight: 15, levelRange: [2016, 2045] },  // 绵绵泡芙
                    { id: 668, weight: 12, levelRange: [2016, 2045] },  // 火炎狮
                    { id: 683, weight: 5, levelRange: [2016, 2045] },   // 芳香精（稀有）
                ]
            },
            {
                id: 'kalos_route12',
                name: '12号道路（海滨道路）',
                description: '古香市南方的海滨道路',
                levelRange: [2046, 2075],
                pokemon: [
                    { id: 690, weight: 20, levelRange: [2046, 2075] },  // 垃垃藻
                    { id: 692, weight: 18, levelRange: [2046, 2075] },  // 铁臂枪虾
                    { id: 688, weight: 17, levelRange: [2046, 2075] },  // 龟脚脚
                    { id: 691, weight: 15, levelRange: [2046, 2075] },  // 毒藻龙
                    { id: 686, weight: 15, levelRange: [2046, 2075] },  // 好啦鱿
                    { id: 693, weight: 10, levelRange: [2046, 2075] },  // 钢炮臂虾（稀有）
                    { id: 685, weight: 5, levelRange: [2046, 2075] },   // 胖甜妮（稀有）
                ]
            },
            {
                id: 'kalos_route13',
                name: '13号道路（荒地道路）',
                description: '穿越干旱荒原的道路',
                levelRange: [2076, 2105],
                pokemon: [
                    { id: 694, weight: 22, levelRange: [2076, 2105] },  // 伞电蜥
                    { id: 660, weight: 18, levelRange: [2076, 2105] },  // 掘地兔
                    { id: 695, weight: 15, levelRange: [2076, 2105] },  // 光电伞蜥
                    { id: 673, weight: 15, levelRange: [2076, 2105] },  // 坐骑山羊
                    { id: 663, weight: 12, levelRange: [2076, 2105] },  // 烈箭鹰
                    { id: 702, weight: 10, levelRange: [2076, 2105] },  // 咚咚鼠
                    { id: 701, weight: 8, levelRange: [2076, 2105] },   // 摔角鹰人（稀有）
                ]
            },
            {
                id: 'kalos_route14',
                name: '14号道路（沼泽道路）',
                description: '穿越潮湿沼泽的阴暗道路',
                levelRange: [2106, 2135],
                pokemon: [
                    { id: 704, weight: 22, levelRange: [2106, 2135] },  // 黏黏宝
                    { id: 705, weight: 15, levelRange: [2106, 2135] },  // 黏美儿
                    { id: 675, weight: 15, levelRange: [2106, 2135] },  // 霸道熊猫
                    { id: 708, weight: 15, levelRange: [2106, 2135] },  // 小木灵
                    { id: 710, weight: 15, levelRange: [2106, 2135] },  // 南瓜精
                    { id: 709, weight: 10, levelRange: [2106, 2135] },  // 朽木妖（稀有）
                    { id: 711, weight: 8, levelRange: [2106, 2135] },   // 南瓜怪人（稀有）
                ]
            },
            {
                id: 'kalos_route15',
                name: '15号道路（日照道路）',
                description: '百刻市附近的荒野道路',
                levelRange: [2136, 2165],
                pokemon: [
                    { id: 668, weight: 18, levelRange: [2136, 2165] },  // 火炎狮
                    { id: 663, weight: 16, levelRange: [2136, 2165] },  // 烈箭鹰
                    { id: 675, weight: 16, levelRange: [2136, 2165] },  // 霸道熊猫
                    { id: 706, weight: 15, levelRange: [2136, 2165] },  // 黏美龙
                    { id: 673, weight: 15, levelRange: [2136, 2165] },  // 坐骑山羊
                    { id: 681, weight: 12, levelRange: [2136, 2165] },  // 坚盾剑怪（稀有）
                    { id: 671, weight: 8, levelRange: [2136, 2165] },   // 花洁夫人（稀有）
                ]
            },
            {
                id: 'kalos_frost_cavern',
                name: '冰雪洞窟',
                description: '卡洛斯地区北部的冰冷洞窟',
                levelRange: [2166, 2195],
                pokemon: [
                    { id: 712, weight: 22, levelRange: [2166, 2195] },  // 冰宝
                    { id: 698, weight: 20, levelRange: [2166, 2195] },  // 冰雪龙
                    { id: 699, weight: 15, levelRange: [2166, 2195] },  // 冰雪巨龙
                    { id: 703, weight: 15, levelRange: [2166, 2195] },  // 小碎钻
                    { id: 713, weight: 12, levelRange: [2166, 2195] },  // 冰岩怪
                    { id: 706, weight: 10, levelRange: [2166, 2195] },  // 黏美龙（稀有）
                    { id: 681, weight: 6, levelRange: [2166, 2195] },   // 坚盾剑怪（稀有）
                ]
            },
            {
                id: 'kalos_route17',
                name: '17号道路（玛姆牛道路）',
                description: '铲雪通行的雪原道路',
                levelRange: [2196, 2225],
                pokemon: [
                    { id: 712, weight: 22, levelRange: [2196, 2225] },  // 冰宝
                    { id: 713, weight: 15, levelRange: [2196, 2225] },  // 冰岩怪
                    { id: 699, weight: 15, levelRange: [2196, 2225] },  // 冰雪巨龙
                    { id: 660, weight: 13, levelRange: [2196, 2225] },  // 掘地兔
                    { id: 663, weight: 13, levelRange: [2196, 2225] },  // 烈箭鹰
                    { id: 706, weight: 12, levelRange: [2196, 2225] },  // 黏美龙
                    { id: 707, weight: 10, levelRange: [2196, 2225] },  // 钥圈儿（稀有）
                ]
            },
            {
                id: 'kalos_route18',
                name: '18号道路（谷间道路）',
                description: '映雪市到冠军之路之间的峡谷道路',
                levelRange: [2226, 2255],
                pokemon: [
                    { id: 706, weight: 18, levelRange: [2226, 2255] },  // 黏美龙
                    { id: 675, weight: 16, levelRange: [2226, 2255] },  // 霸道熊猫
                    { id: 681, weight: 14, levelRange: [2226, 2255] },  // 坚盾剑怪
                    { id: 668, weight: 14, levelRange: [2226, 2255] },  // 火炎狮
                    { id: 663, weight: 14, levelRange: [2226, 2255] },  // 烈箭鹰
                    { id: 697, weight: 12, levelRange: [2226, 2255] },  // 怪颚龙
                    { id: 699, weight: 12, levelRange: [2226, 2255] },  // 冰雪巨龙（稀有）
                ]
            },
            {
                id: 'kalos_route19',
                name: '19号道路（大谷道路）',
                description: '通往冠军之路的壮阔峡谷',
                levelRange: [2256, 2285],
                pokemon: [
                    { id: 706, weight: 16, levelRange: [2256, 2285] },  // 黏美龙
                    { id: 681, weight: 14, levelRange: [2256, 2285] },  // 坚盾剑怪
                    { id: 675, weight: 14, levelRange: [2256, 2285] },  // 霸道熊猫
                    { id: 697, weight: 14, levelRange: [2256, 2285] },  // 怪颚龙
                    { id: 668, weight: 14, levelRange: [2256, 2285] },  // 火炎狮
                    { id: 663, weight: 14, levelRange: [2256, 2285] },  // 烈箭鹰
                    { id: 699, weight: 10, levelRange: [2256, 2285] },  // 冰雪巨龙
                    { id: 713, weight: 4, levelRange: [2256, 2285] },   // 冰岩怪（稀有）
                ]
            },
            {
                id: 'kalos_victory_road',
                name: '卡洛斯冠军之路',
                description: '通往卡洛斯联盟的最终试炼',
                levelRange: [2286, 2315],
                pokemon: [
                    { id: 706, weight: 16, levelRange: [2286, 2315] },  // 黏美龙
                    { id: 681, weight: 14, levelRange: [2286, 2315] },  // 坚盾剑怪
                    { id: 697, weight: 14, levelRange: [2286, 2315] },  // 怪颚龙
                    { id: 699, weight: 12, levelRange: [2286, 2315] },  // 冰雪巨龙
                    { id: 675, weight: 12, levelRange: [2286, 2315] },  // 霸道熊猫
                    { id: 663, weight: 10, levelRange: [2286, 2315] },  // 烈箭鹰
                    { id: 668, weight: 10, levelRange: [2286, 2315] },  // 火炎狮
                    { id: 706, weight: 8, levelRange: [2286, 2315] },   // 黏美龙
                    { id: 714, weight: 4, levelRange: [2315, 2315] },   // 嗡蝠（稀有）
                ]
            },
            {
                id: 'kalos_terminus_cave',
                name: '终结洞窟',
                description: '传说中基格尔德沉睡的深邃洞窟',
                levelRange: [2316, 2345],
                pokemon: [
                    { id: 703, weight: 18, levelRange: [2316, 2345] },  // 小碎钻
                    { id: 681, weight: 15, levelRange: [2316, 2345] },  // 坚盾剑怪
                    { id: 697, weight: 14, levelRange: [2316, 2345] },  // 怪颚龙
                    { id: 706, weight: 14, levelRange: [2316, 2345] },  // 黏美龙
                    { id: 713, weight: 12, levelRange: [2316, 2345] },  // 冰岩怪
                    { id: 715, weight: 10, levelRange: [2316, 2345] },  // 音波龙（稀有）
                    { id: 718, weight: 2, levelRange: [2345, 2345] },   // 基格尔德（传说）
                ]
            },
            {
                id: 'kalos_unknown_dungeon',
                name: '未知洞窟',
                description: '卡洛斯地区最深处的神秘洞穴',
                levelRange: [2346, 2375],
                pokemon: [
                    { id: 706, weight: 16, levelRange: [2346, 2375] },  // 黏美龙
                    { id: 681, weight: 14, levelRange: [2346, 2375] },  // 坚盾剑怪
                    { id: 697, weight: 14, levelRange: [2346, 2375] },  // 怪颚龙
                    { id: 699, weight: 12, levelRange: [2346, 2375] },  // 冰雪巨龙
                    { id: 675, weight: 12, levelRange: [2346, 2375] },  // 霸道熊猫
                    { id: 668, weight: 10, levelRange: [2346, 2375] },  // 火炎狮
                    { id: 716, weight: 3, levelRange: [2374, 2375] },   // 哲尔尼亚斯（传说）
                    { id: 717, weight: 3, levelRange: [2374, 2375] },   // 伊裴尔塔尔（传说）
                ]
            },
            {
                id: 'kalos_sea_spirits_den',
                name: '海神洞窟 & 花园',
                description: '传说中幻之宝可梦栖息的神秘场所',
                levelRange: [2376, 2410],
                pokemon: [
                    { id: 706, weight: 14, levelRange: [2376, 2410] },  // 黏美龙
                    { id: 681, weight: 12, levelRange: [2376, 2410] },  // 坚盾剑怪
                    { id: 697, weight: 12, levelRange: [2376, 2410] },  // 怪颚龙
                    { id: 699, weight: 12, levelRange: [2376, 2410] },  // 冰雪巨龙
                    { id: 668, weight: 10, levelRange: [2376, 2410] },  // 火炎狮
                    { id: 663, weight: 10, levelRange: [2376, 2410] },  // 烈箭鹰
                    { id: 675, weight: 10, levelRange: [2376, 2410] },  // 霸道熊猫
                    { id: 713, weight: 8, levelRange: [2376, 2410] },   // 冰岩怪
                    { id: 719, weight: 2, levelRange: [2405, 2410] },   // 蒂安希（幻之宝可梦）
                    { id: 720, weight: 1, levelRange: [2405, 2410] },   // 胡帕（幻之宝可梦）
                    { id: 721, weight: 1, levelRange: [2405, 2410] },   // 波尔凯尼恩（幻之宝可梦）
                ]
            },
        ]
    },
    alola: {
        id: 'alola',
        name: '阿罗拉地区',
        nameEn: 'Alola',
        description: '温暖的南国群岛，拥有独特的地区形态宝可梦和守护神。',
        unlockCondition: { type: 'pokedex_complete', region: 'kalos', range: [650, 721] },
        routes: [
            {
                id: 'alola_route1',
                name: '1号道路',
                description: '好奥乐市到利利小镇之间的道路',
                levelRange: [2411, 2460],
                pokemon: [
                    { id: 722, weight: 25, levelRange: [2411, 2460] },  // 木木枭
                    { id: 725, weight: 25, levelRange: [2411, 2460] },  // 火斑喵
                    { id: 728, weight: 25, levelRange: [2411, 2460] },  // 球球海狮
                    { id: 731, weight: 15, levelRange: [2411, 2460] },  // 小笃儿
                    { id: 734, weight: 10, levelRange: [2411, 2460] },  // 猫鼬少
                ]
            },
            {
                id: 'alola_route2',
                name: '2号道路',
                description: '好奥乐市郊外的道路',
                levelRange: [2461, 2520],
                pokemon: [
                    { id: 744, weight: 25, levelRange: [2461, 2520] },  // 岩狗狗
                    { id: 736, weight: 20, levelRange: [2461, 2520] },  // 强颚鸡母虫
                    { id: 739, weight: 20, levelRange: [2461, 2520] },  // 好胜蟹
                    { id: 742, weight: 20, levelRange: [2461, 2520] },  // 萌虻
                    { id: 741, weight: 15, levelRange: [2461, 2520] },  // 花舞鸟
                ]
            },
            {
                id: 'alola_route3',
                name: '3号道路',
                description: '美乐美乐岛的草地道路',
                levelRange: [2521, 2580],
                pokemon: [
                    { id: 749, weight: 25, levelRange: [2521, 2580] },  // 泥驴仔
                    { id: 747, weight: 20, levelRange: [2521, 2580] },  // 好坏星
                    { id: 751, weight: 20, levelRange: [2521, 2580] },  // 滴蛛
                    { id: 753, weight: 20, levelRange: [2521, 2580] },  // 伪螳草
                    { id: 746, weight: 15, levelRange: [2521, 2580] },  // 弱丁鱼
                ]
            },
            {
                id: 'alola_route4',
                name: '4号道路',
                description: '阿卡拉岛的热闹街道',
                levelRange: [2581, 2640],
                pokemon: [
                    { id: 755, weight: 20, levelRange: [2581, 2640] },  // 睡睡菇
                    { id: 757, weight: 20, levelRange: [2581, 2640] },  // 夜盗火蜥
                    { id: 759, weight: 20, levelRange: [2581, 2640] },  // 童偶熊
                    { id: 761, weight: 20, levelRange: [2581, 2640] },  // 甜竹竹
                    { id: 764, weight: 20, levelRange: [2581, 2640] },  // 花疗环环
                ]
            },
            {
                id: 'alola_route5',
                name: '5号道路',
                description: '阿卡拉岛连接至皇家大道的道路',
                levelRange: [2641, 2700],
                pokemon: [
                    { id: 723, weight: 15, levelRange: [2641, 2700] },  // 投羽枭
                    { id: 726, weight: 15, levelRange: [2641, 2700] },  // 炎热喵
                    { id: 729, weight: 15, levelRange: [2641, 2700] },  // 花漾海狮
                    { id: 765, weight: 15, levelRange: [2641, 2700] },  // 智挥猩
                    { id: 766, weight: 15, levelRange: [2641, 2700] },  // 投掷猴
                    { id: 735, weight: 15, levelRange: [2641, 2700] },  // 猫鼬探长
                    { id: 740, weight: 10, levelRange: [2641, 2700] },  // 好胜毛蟹
                ]
            },
            {
                id: 'alola_route6',
                name: '6号道路',
                description: '乌拉乌拉岛的道路',
                levelRange: [2701, 2800],
                pokemon: [
                    { id: 737, weight: 20, levelRange: [2701, 2800] },  // 虫电宝
                    { id: 743, weight: 20, levelRange: [2701, 2800] },  // 蝶结萌虻
                    { id: 745, weight: 20, levelRange: [2701, 2800] },  // 鬃岩狼人
                    { id: 732, weight: 15, levelRange: [2701, 2800] },  // 喇叭啄鸟
                    { id: 767, weight: 15, levelRange: [2701, 2800] },  // 宇宙乌贼
                    { id: 768, weight: 10, levelRange: [2701, 2800] },  // 具甲武者
                ]
            },
            {
                id: 'alola_route7',
                name: '7号道路',
                description: '乌拉乌拉岛的海滨道路',
                levelRange: [2801, 2900],
                pokemon: [
                    { id: 750, weight: 20, levelRange: [2801, 2900] },  // 重泥挽马
                    { id: 752, weight: 20, levelRange: [2801, 2900] },  // 滴蛛霸
                    { id: 754, weight: 20, levelRange: [2801, 2900] },  // 兰螳花
                    { id: 748, weight: 15, levelRange: [2801, 2900] },  // 超坏星
                    { id: 756, weight: 15, levelRange: [2801, 2900] },  // 灯罩夜菇
                    { id: 758, weight: 10, levelRange: [2801, 2900] },  // 焰后蜥
                ]
            },
            {
                id: 'alola_route8',
                name: '8号道路',
                description: '乌拉乌拉岛至波尼岛的道路',
                levelRange: [2901, 3000],
                pokemon: [
                    { id: 760, weight: 15, levelRange: [2901, 3000] },  // 穿着熊
                    { id: 762, weight: 15, levelRange: [2901, 3000] },  // 甜舞妮
                    { id: 763, weight: 15, levelRange: [2901, 3000] },  // 甜冷美后
                    { id: 769, weight: 15, levelRange: [2901, 3000] },  // 沙丘娃
                    { id: 770, weight: 15, levelRange: [2901, 3000] },  // 噬沙堡爷
                    { id: 771, weight: 15, levelRange: [2901, 3000] },  // 拳海参
                    { id: 772, weight: 10, levelRange: [2901, 3000] },  // 属性：空
                ]
            },
            {
                id: 'alola_route9',
                name: '9号道路',
                description: '波尼岛的山区道路',
                levelRange: [3001, 3100],
                pokemon: [
                    { id: 724, weight: 12, levelRange: [3001, 3100] },  // 狙射树枭
                    { id: 727, weight: 12, levelRange: [3001, 3100] },  // 炽焰咆哮虎
                    { id: 730, weight: 12, levelRange: [3001, 3100] },  // 西狮海壬
                    { id: 733, weight: 12, levelRange: [3001, 3100] },  // 铳嘴大鸟
                    { id: 738, weight: 12, levelRange: [3001, 3100] },  // 锹农炮虫
                    { id: 773, weight: 10, levelRange: [3001, 3100] },  // 银伴战兽
                    { id: 774, weight: 10, levelRange: [3001, 3100] },  // 小陨星
                    { id: 775, weight: 10, levelRange: [3001, 3100] },  // 树枕尾熊
                    { id: 776, weight: 10, levelRange: [3001, 3100] },  // 爆焰龟兽
                ]
            },
            {
                id: 'alola_route10',
                name: '10号道路',
                description: '波尼岛的花园道路',
                levelRange: [3101, 3200],
                pokemon: [
                    { id: 777, weight: 15, levelRange: [3101, 3200] },  // 托戈德玛尔
                    { id: 778, weight: 15, levelRange: [3101, 3200] },  // 谜拟Ｑ
                    { id: 779, weight: 15, levelRange: [3101, 3200] },  // 磨牙彩皮鱼
                    { id: 780, weight: 15, levelRange: [3101, 3200] },  // 老翁龙
                    { id: 781, weight: 15, levelRange: [3101, 3200] },  // 破破舵轮
                    { id: 782, weight: 15, levelRange: [3101, 3200] },  // 心鳞宝
                    { id: 783, weight: 10, levelRange: [3101, 3200] },  // 鳞甲龙
                ]
            },
            {
                id: 'alola_route11',
                name: '11号道路',
                description: '波尼岛的深处道路',
                levelRange: [3201, 3300],
                pokemon: [
                    { id: 784, weight: 15, levelRange: [3201, 3300] },  // 杖尾鳞甲龙
                    { id: 789, weight: 15, levelRange: [3201, 3300] },  // 科斯莫古
                    { id: 790, weight: 15, levelRange: [3201, 3300] },  // 科斯莫姆
                    { id: 785, weight: 10, levelRange: [3201, 3300] },  // 卡璞・鸣鸣
                    { id: 786, weight: 10, levelRange: [3201, 3300] },  // 卡璞・蝶蝶
                    { id: 787, weight: 10, levelRange: [3201, 3300] },  // 卡璞・哞哞
                    { id: 788, weight: 10, levelRange: [3201, 3300] },  // 卡璞・鳍鳍
                    { id: 791, weight: 8, levelRange: [3201, 3300] },   // 索尔迦雷欧
                    { id: 792, weight: 7, levelRange: [3201, 3300] },   // 露奈雅拉
                ]
            },
            {
                id: 'alola_route12',
                name: '12号道路',
                description: '异兽出没的异次元区域',
                levelRange: [3301, 3400],
                pokemon: [
                    { id: 793, weight: 15, levelRange: [3301, 3400] },  // 虚吾伊德
                    { id: 794, weight: 15, levelRange: [3301, 3400] },  // 爆肌蚊
                    { id: 795, weight: 15, levelRange: [3301, 3400] },  // 费洛美螂
                    { id: 796, weight: 15, levelRange: [3301, 3400] },  // 电束木
                    { id: 797, weight: 15, levelRange: [3301, 3400] },  // 铁火辉夜
                    { id: 798, weight: 15, levelRange: [3301, 3400] },  // 纸御剑
                    { id: 799, weight: 10, levelRange: [3301, 3400] },  // 恶食大王
                ]
            },
            {
                id: 'alola_route13',
                name: '13号道路',
                description: '奈克洛兹玛的黑暗领域',
                levelRange: [3401, 3500],
                pokemon: [
                    { id: 800, weight: 20, levelRange: [3401, 3500] },  // 奈克洛兹玛
                    { id: 803, weight: 20, levelRange: [3401, 3500] },  // 毒贝比
                    { id: 801, weight: 15, levelRange: [3401, 3500] },  // 玛机雅娜
                    { id: 802, weight: 15, levelRange: [3401, 3500] },  // 玛夏多
                    { id: 804, weight: 15, levelRange: [3401, 3500] },  // 四颚针龙
                    { id: 805, weight: 15, levelRange: [3401, 3500] },  // 垒磊石
                ]
            },
            {
                id: 'alola_route14',
                name: '14号道路',
                description: '阿罗拉的极限之地',
                levelRange: [3501, 3600],
                pokemon: [
                    { id: 808, weight: 30, levelRange: [3501, 3600] },  // 美录坦
                    { id: 809, weight: 30, levelRange: [3501, 3600] },  // 美录梅塔
                    { id: 806, weight: 20, levelRange: [3501, 3600] },  // 火头獠牙
                    { id: 807, weight: 20, levelRange: [3501, 3600] },  // 泽洛拉
                ]
            },
        ]
    },
    galar: {
        id: 'galar',
        name: '伽勒尔地区',
        nameEn: 'Galar',
        description: '工业发达的地区，极巨化现象让宝可梦变得巨大化。',
        unlockCondition: { type: 'pokedex_complete', region: 'alola', range: [722, 809] },
        routes: [
            {
                id: 'galar_route1',
                name: '1号道路',
                description: '木桩镇到机擎市之间的道路',
                levelRange: [3601, 3800],
                pokemon: [
                    { id: 810, weight: 15, levelRange: [3601, 3800] },  // 敲音猴
                    { id: 813, weight: 15, levelRange: [3601, 3800] },  // 炎兔儿
                    { id: 816, weight: 15, levelRange: [3601, 3800] },  // 泪眼蜥
                    { id: 819, weight: 15, levelRange: [3601, 3800] },  // 贪心栗鼠
                    { id: 821, weight: 15, levelRange: [3601, 3800] },  // 稚山雀
                    { id: 824, weight: 15, levelRange: [3601, 3700] },  // 索侦虫
                    { id: 827, weight: 10, levelRange: [3601, 3800] },  // 偷儿狐
                ]
            },
            {
                id: 'galar_route2',
                name: '2号道路',
                description: '机擎市郊外的矿区道路',
                levelRange: [3801, 4000],
                pokemon: [
                    { id: 829, weight: 15, levelRange: [3801, 4000] },  // 幼棉棉
                    { id: 831, weight: 15, levelRange: [3801, 4000] },  // 毛辫羊
                    { id: 820, weight: 12, levelRange: [3801, 4000] },  // 藏饱栗鼠
                    { id: 822, weight: 12, levelRange: [3801, 4000] },  // 蓝鸦
                    { id: 825, weight: 12, levelRange: [3801, 4000] },  // 天罩虫
                    { id: 828, weight: 12, levelRange: [3801, 4000] },  // 狐大盗
                    { id: 833, weight: 12, levelRange: [3801, 4000] },  // 咬咬龟
                ]
            },
            {
                id: 'galar_route3',
                name: '3号道路',
                description: '伽勒尔矿山深处',
                levelRange: [4001, 4200],
                pokemon: [
                    { id: 835, weight: 15, levelRange: [4001, 4200] },  // 来电汪
                    { id: 837, weight: 15, levelRange: [4001, 4200] },  // 小炭仔
                    { id: 811, weight: 12, levelRange: [4001, 4200] },  // 啪咚猴
                    { id: 814, weight: 12, levelRange: [4001, 4200] },  // 腾蹴小将
                    { id: 817, weight: 12, levelRange: [4001, 4200] },  // 变涩蜥
                    { id: 830, weight: 12, levelRange: [4001, 4200] },  // 白蓬蓬
                    { id: 832, weight: 12, levelRange: [4001, 4200] },  // 毛毛角羊
                ]
            },
            {
                id: 'galar_route4',
                name: '4号道路',
                description: '旷野地带的开阔草原',
                levelRange: [4201, 4400],
                pokemon: [
                    { id: 840, weight: 15, levelRange: [4201, 4400] },  // 啃果虫
                    { id: 843, weight: 15, levelRange: [4201, 4400] },  // 沙包蛇
                    { id: 834, weight: 12, levelRange: [4201, 4400] },  // 暴噬龟
                    { id: 836, weight: 12, levelRange: [4201, 4400] },  // 逐电犬
                    { id: 838, weight: 12, levelRange: [4201, 4400] },  // 大炭车
                    { id: 823, weight: 10, levelRange: [4201, 4400] },  // 钢铠鸦
                    { id: 826, weight: 10, levelRange: [4201, 4400] },  // 以欧路普
                ]
            },
            {
                id: 'galar_route5',
                name: '5号道路',
                description: '伽勒尔中部的城镇区域',
                levelRange: [4401, 4600],
                pokemon: [
                    { id: 841, weight: 12, levelRange: [4401, 4600] },  // 苹裹龙
                    { id: 842, weight: 12, levelRange: [4401, 4600] },  // 丰蜜龙
                    { id: 844, weight: 12, levelRange: [4401, 4600] },  // 沙螺蟒
                    { id: 839, weight: 10, levelRange: [4401, 4600] },  // 巨炭山
                    { id: 812, weight: 8, levelRange: [4401, 4600] },   // 轰擂金刚猩
                    { id: 815, weight: 8, levelRange: [4401, 4600] },   // 闪焰王牌
                    { id: 818, weight: 8, levelRange: [4401, 4600] },   // 千面避役
                ]
            },
            {
                id: 'galar_route6',
                name: '6号道路',
                description: '拳关市至棘丘市之间的滨海道路',
                levelRange: [4601, 4800],
                pokemon: [
                    { id: 846, weight: 15, levelRange: [4601, 4800] },  // 刺梭鱼
                    { id: 848, weight: 15, levelRange: [4601, 4800] },  // 毒电婴
                    { id: 850, weight: 15, levelRange: [4601, 4800] },  // 烧火蚣
                    { id: 845, weight: 12, levelRange: [4601, 4800] },  // 古月鸟
                    { id: 847, weight: 10, levelRange: [4601, 4800] },  // 戽斗尖梭
                    { id: 849, weight: 10, levelRange: [4601, 4800] },  // 颤弦蝾螈
                    { id: 851, weight: 10, levelRange: [4601, 4800] },  // 焚焰蚣
                ]
            },
            {
                id: 'galar_route7',
                name: '7号道路',
                description: '格拉球大草原的训练区域',
                levelRange: [4801, 5000],
                pokemon: [
                    { id: 852, weight: 12, levelRange: [4801, 5000] },  // 拳拳蛸
                    { id: 854, weight: 12, levelRange: [4801, 5000] },  // 来悲茶
                    { id: 856, weight: 12, levelRange: [4801, 5000] },  // 迷布莉姆
                    { id: 853, weight: 10, levelRange: [4801, 5000] },  // 八爪武师
                    { id: 855, weight: 10, levelRange: [4801, 5000] },  // 怖思壶
                    { id: 857, weight: 10, levelRange: [4801, 5000] },  // 提布莉姆
                    { id: 858, weight: 8, levelRange: [4801, 5000] },   // 布莉姆温
                ]
            },
            {
                id: 'galar_route8',
                name: '8号道路',
                description: '棘丘市附近的阴暗森林',
                levelRange: [5001, 5200],
                pokemon: [
                    { id: 859, weight: 12, levelRange: [5001, 5200] },  // 捣蛋小妖
                    { id: 860, weight: 10, levelRange: [5001, 5200] },  // 诈唬魔
                    { id: 862, weight: 10, levelRange: [5001, 5200] },  // 堵拦熊
                    { id: 863, weight: 10, levelRange: [5001, 5200] },  // 喵头目
                    { id: 864, weight: 10, levelRange: [5001, 5200] },  // 魔灵珊瑚
                    { id: 865, weight: 10, levelRange: [5001, 5200] },  // 葱游兵
                    { id: 861, weight: 8, levelRange: [5001, 5200] },   // 长毛巨魔
                ]
            },
            {
                id: 'galar_route9',
                name: '9号道路',
                description: '冠之雪原的入口地带',
                levelRange: [5201, 5400],
                pokemon: [
                    { id: 872, weight: 15, levelRange: [5201, 5400] },  // 雪吞虫
                    { id: 866, weight: 12, levelRange: [5201, 5400] },  // 踏冰人偶
                    { id: 867, weight: 12, levelRange: [5201, 5400] },  // 死神板
                    { id: 868, weight: 12, levelRange: [5201, 5400] },  // 小仙奶
                    { id: 871, weight: 12, levelRange: [5201, 5400] },  // 啪嚓海胆
                    { id: 869, weight: 10, levelRange: [5201, 5400] },  // 霜奶仙
                    { id: 870, weight: 10, levelRange: [5201, 5400] },  // 列阵兵
                ]
            },
            {
                id: 'galar_route10',
                name: '10号道路',
                description: '冠之雪原的冰冻深处',
                levelRange: [5401, 5600],
                pokemon: [
                    { id: 878, weight: 15, levelRange: [5401, 5600] },  // 铜象
                    { id: 873, weight: 12, levelRange: [5401, 5600] },  // 雪绒蛾
                    { id: 876, weight: 12, levelRange: [5401, 5600] },  // 爱管侍
                    { id: 877, weight: 12, levelRange: [5401, 5600] },  // 莫鲁贝可
                    { id: 875, weight: 10, levelRange: [5401, 5600] },  // 冰砌鹅
                    { id: 879, weight: 10, levelRange: [5401, 5600] },  // 大王铜象
                    { id: 874, weight: 8, levelRange: [5401, 5600] },   // 巨石丁
                ]
            },
            {
                id: 'galar_route11',
                name: '11号道路',
                description: '伽勒尔的化石遗迹地带',
                levelRange: [5601, 5800],
                pokemon: [
                    { id: 885, weight: 15, levelRange: [5601, 5800] },  // 多龙梅西亚
                    { id: 880, weight: 12, levelRange: [5601, 5800] },  // 雷鸟龙
                    { id: 881, weight: 12, levelRange: [5601, 5800] },  // 雷鸟海兽
                    { id: 882, weight: 12, levelRange: [5601, 5800] },  // 鳃鱼龙
                    { id: 883, weight: 12, levelRange: [5601, 5800] },  // 鳃鱼海兽
                    { id: 884, weight: 8, levelRange: [5601, 5800] },   // 铝钢龙
                ]
            },
            {
                id: 'galar_route12',
                name: '12号道路',
                description: '能量塔周边的龙之巢穴',
                levelRange: [5801, 6000],
                pokemon: [
                    { id: 886, weight: 12, levelRange: [5801, 6000] },  // 多龙奇
                    { id: 891, weight: 12, levelRange: [5801, 6000] },  // 熊徒弟
                    { id: 887, weight: 10, levelRange: [5801, 6000] },  // 多龙巴鲁托
                    { id: 894, weight: 10, levelRange: [6001, 6200] },  // 雷吉艾勒奇
                    { id: 895, weight: 8, levelRange: [6001, 6200] },   // 雷吉铎拉戈
                ]
            },
            {
                id: 'galar_route13',
                name: '13号道路',
                description: '铠之孤岛的修炼道场',
                levelRange: [6001, 6200],
                pokemon: [
                    { id: 892, weight: 15, levelRange: [6001, 6200] },  // 武道熊师
                    { id: 893, weight: 15, levelRange: [6001, 6200] },  // 萨戮德
                    { id: 896, weight: 10, levelRange: [6001, 6200] },  // 雪暴马
                    { id: 897, weight: 8, levelRange: [6150, 6200] },   // 灵幽马
                    { id: 889, weight: 3, levelRange: [5900, 6000] },   // 藏玛然特
                    
                ]
            },
            {
                id: 'galar_route14',
                name: '14号道路',
                description: '洗翠地区的古老遗迹',
                levelRange: [6201, 6400],
                pokemon: [
                    { id: 899, weight: 15, levelRange: [6201, 6400] },  // 诡角鹿
                    { id: 900, weight: 15, levelRange: [6201, 6400] },  // 劈斧螳螂
                    { id: 902, weight: 12, levelRange: [6201, 6400] },  // 幽尾玄鱼
                    { id: 903, weight: 12, levelRange: [6201, 6400] },  // 大狃拉
                    { id: 904, weight: 12, levelRange: [6201, 6400] },  // 万针鱼
                    { id: 888, weight: 3, levelRange: [5900, 6000] },   // 苍响
                ]
            },
            {
                id: 'galar_route15',
                name: '15号道路',
                description: '洗翠之巅——传说降临之地',
                levelRange: [6401, 6600],
                pokemon: [
                    { id: 901, weight: 20, levelRange: [6401, 6600] },  // 月月熊
                    { id: 902, weight: 20, levelRange: [6401, 6600] },  // 幽尾玄鱼
                    { id: 905, weight: 10, levelRange: [6550, 6600] },   // 眷恋云
                    { id: 898, weight: 5, levelRange: [6170, 6200] },   // 蕾冠王
                    { id: 890, weight: 1, levelRange: [5950, 6000] },   // 无极汰那
                ]
            },
        ]
    },
    paldea: {
        id: 'paldea',
        name: '帕底亚地区',
        nameEn: 'Paldea',
        description: '广阔的伊比利亚风格地区，拥有太晶化现象和神秘的古来/未来宝可梦。',
        unlockCondition: { type: 'pokedex_complete', region: 'galar', range: [810, 905] },
        routes: [
            {
                id: 'paldea_route1',
                name: '南部第一区',
                description: '桌台市南方的草原地带，御三家宝可梦出没',
                levelRange: [6601, 7100],
                pokemon: [
                    { id: 906, weight: 12, levelRange: [6601, 7100] },  // 新叶喵
                    { id: 909, weight: 12, levelRange: [6601, 7100] },  // 呆火鳄
                    { id: 912, weight: 12, levelRange: [6601, 7100] },  // 润水鸭
                    { id: 915, weight: 12, levelRange: [6601, 6850] },  // 爱吃豚
                    { id: 917, weight: 12, levelRange: [6601, 6850] },  // 团珠蛛
                    { id: 919, weight: 12, levelRange: [6601, 6850] },  // 豆蟋蟀
                    { id: 921, weight: 12, levelRange: [6601, 6850] },  // 布拨
                    { id: 924, weight: 8, levelRange: [6601, 7100] },   // 一对鼠
                    { id: 926, weight: 8, levelRange: [6601, 7100] },   // 狗仔包
                ]
            },
            {
                id: 'paldea_route2',
                name: '南部第二区',
                description: '桌台市东南方的田园地带',
                levelRange: [7101, 7600],
                pokemon: [
                    { id: 922, weight: 12, levelRange: [7101, 7600] },  // 布土拨
                    { id: 928, weight: 12, levelRange: [7101, 7600] },  // 迷你芙
                    { id: 929, weight: 12, levelRange: [7101, 7600] },  // 奥利纽
                    { id: 918, weight: 10, levelRange: [7101, 7600] },  // 操陷蛛
                    { id: 920, weight: 10, levelRange: [7101, 7600] },  // 烈腿蝗
                    { id: 925, weight: 10, levelRange: [7101, 7600] },  // 一家鼠
                    { id: 927, weight: 10, levelRange: [7101, 7600] },  // 麻花犬
                    { id: 931, weight: 10, levelRange: [7101, 7600] },  // 怒鹦哥
                    { id: 932, weight: 8, levelRange: [7101, 7600] },   // 盐石宝
                ]
            },
            {
                id: 'paldea_route3',
                name: '西部第一区',
                description: '帕底亚西部的山谷地带',
                levelRange: [7601, 8100],
                pokemon: [
                    { id: 935, weight: 12, levelRange: [7601, 8100] },  // 炭小侍
                    { id: 938, weight: 12, levelRange: [7601, 8100] },  // 光蚪仔
                    { id: 907, weight: 10, levelRange: [7601, 8100] },  // 蒂蕾喵
                    { id: 910, weight: 10, levelRange: [7601, 8100] },  // 炙烫鳄
                    { id: 913, weight: 10, levelRange: [7601, 8100] },  // 涌跃鸭
                    { id: 916, weight: 10, levelRange: [7601, 8100] },  // 飘香豚
                    { id: 923, weight: 10, levelRange: [7601, 8100] },  // 巴布土拨
                    { id: 930, weight: 10, levelRange: [7601, 8100] },  // 奥利瓦
                    { id: 933, weight: 10, levelRange: [7601, 8100] },  // 盐石垒
                ]
            },
            {
                id: 'paldea_route4',
                name: '西部第二区',
                description: '帕底亚西部的高原岩区',
                levelRange: [8101, 8600],
                pokemon: [
                    { id: 942, weight: 12, levelRange: [8101, 8600] },  // 偶叫獒
                    { id: 944, weight: 12, levelRange: [8101, 8600] },  // 滋汁鼹
                    { id: 936, weight: 10, levelRange: [8101, 8600] },  // 红莲铠骑
                    { id: 937, weight: 10, levelRange: [8101, 8600] },  // 苍炎刃鬼
                    { id: 939, weight: 10, levelRange: [8101, 8600] },  // 电肚蛙
                    { id: 940, weight: 10, levelRange: [8101, 8600] },  // 电海燕
                    { id: 934, weight: 8, levelRange: [8101, 8600] },   // 盐石巨灵
                    { id: 941, weight: 8, levelRange: [8101, 8600] },   // 大电海燕
                    { id: 943, weight: 8, levelRange: [8101, 8600] },   // 獒教父
                ]
            },
            {
                id: 'paldea_route5',
                name: '东部第一区',
                description: '帕底亚东部的沿海区域',
                levelRange: [8601, 9100],
                pokemon: [
                    { id: 948, weight: 12, levelRange: [8601, 9100] },  // 原野水母
                    { id: 945, weight: 10, levelRange: [8601, 9100] },  // 涂标客
                    { id: 946, weight: 10, levelRange: [8601, 9100] },  // 纳噬草
                    { id: 947, weight: 10, levelRange: [8601, 9100] },  // 怖纳噬草
                    { id: 949, weight: 10, levelRange: [8601, 9100] },  // 陆地水母
                    { id: 950, weight: 10, levelRange: [8601, 9100] },  // 毛崖蟹
                    { id: 908, weight: 8, levelRange: [8601, 9100] },   // 魔幻假面喵
                    { id: 911, weight: 8, levelRange: [8601, 9100] },   // 骨纹巨声鳄
                    { id: 914, weight: 8, levelRange: [8601, 9100] },   // 狂欢浪舞鸭
                ]
            },
            {
                id: 'paldea_route6',
                name: '东部第二区',
                description: '帕底亚东部的火山地带',
                levelRange: [9101, 9600],
                pokemon: [
                    { id: 953, weight: 12, levelRange: [9101, 9600] },  // 虫滚泥
                    { id: 955, weight: 12, levelRange: [9101, 9600] },  // 飘飘雏
                    { id: 957, weight: 12, levelRange: [9101, 9600] },  // 小锻匠
                    { id: 951, weight: 10, levelRange: [9101, 9600] },  // 热辣娃
                    { id: 952, weight: 10, levelRange: [9101, 9600] },  // 狠辣椒
                    { id: 954, weight: 10, levelRange: [9101, 9600] },  // 虫甲圣
                    { id: 958, weight: 10, levelRange: [9101, 9600] },  // 巧锻匠
                    { id: 956, weight: 8, levelRange: [9101, 9600] },   // 超能艳鸵
                    { id: 959, weight: 8, levelRange: [9101, 9600] },   // 巨锻匠
                ]
            },
            {
                id: 'paldea_route7',
                name: '北部第一区',
                description: '帕底亚北部的冻土地带',
                levelRange: [9601, 10100],
                pokemon: [
                    { id: 960, weight: 12, levelRange: [9601, 10100] },  // 海地鼠
                    { id: 963, weight: 12, levelRange: [9601, 10100] },  // 波普海豚
                    { id: 965, weight: 12, levelRange: [9601, 10100] },  // 噗隆隆
                    { id: 961, weight: 10, levelRange: [9601, 10100] },  // 三海地鼠
                    { id: 962, weight: 10, levelRange: [9601, 10100] },  // 下石鸟
                    { id: 967, weight: 10, levelRange: [9601, 10100] },  // 摩托蜥
                    { id: 968, weight: 10, levelRange: [9601, 10100] },  // 拖拖蚓
                    { id: 964, weight: 8, levelRange: [9601, 10100] },   // 海豚侠
                    { id: 966, weight: 8, levelRange: [9601, 10100] },   // 普隆隆姆
                ]
            },
            {
                id: 'paldea_route8',
                name: '北部第二区',
                description: '帕底亚北部的雪山区域',
                levelRange: [10101, 10600],
                pokemon: [
                    { id: 969, weight: 12, levelRange: [10101, 10600] },  // 晶光芽
                    { id: 971, weight: 12, levelRange: [10101, 10600] },  // 墓仔狗
                    { id: 974, weight: 12, levelRange: [10101, 10600] },  // 走鲸
                    { id: 972, weight: 10, levelRange: [10101, 10600] },  // 墓扬犬
                    { id: 973, weight: 10, levelRange: [10101, 10600] },  // 缠红鹤
                    { id: 976, weight: 10, levelRange: [10101, 10600] },  // 轻身鳕
                    { id: 970, weight: 8, levelRange: [10101, 10600] },   // 晶光花
                    { id: 975, weight: 8, levelRange: [10101, 10600] },   // 浩大鲸
                    { id: 977, weight: 5, levelRange: [10450, 10600] },   // 吃吼霸
                ]
            },
            {
                id: 'paldea_route9',
                name: '帕底亚大坑洞入口',
                description: '帕底亚中央大坑洞的入口区域',
                levelRange: [10601, 11100],
                pokemon: [
                    { id: 996, weight: 12, levelRange: [10601, 11100] },  // 凉脊龙
                    { id: 978, weight: 10, levelRange: [10601, 11100] },  // 米立龙
                    { id: 980, weight: 10, levelRange: [10601, 11100] },  // 土王
                    { id: 981, weight: 10, levelRange: [10601, 11100] },  // 奇麒麟
                    { id: 982, weight: 10, levelRange: [10601, 11100] },  // 土龙节节
                    { id: 999, weight: 10, levelRange: [10601, 11100] },  // 索财灵
                    { id: 979, weight: 8, levelRange: [10601, 11100] },   // 弃世猴
                    { id: 983, weight: 8, levelRange: [10601, 11100] },   // 仆刀将军
                    { id: 997, weight: 8, levelRange: [10601, 11100] },   // 冻脊龙
                ]
            },
            {
                id: 'paldea_route10',
                name: '帕底亚大坑洞深处',
                description: '大坑洞的深层区域，古来宝可梦出没',
                levelRange: [11101, 12000],
                pokemon: [
                    { id: 984, weight: 10, levelRange: [11101, 12000] },  // 雄伟牙（古来种）
                    { id: 985, weight: 10, levelRange: [11101, 12000] },  // 吼叫尾（古来种）
                    { id: 986, weight: 10, levelRange: [11101, 12000] },  // 猛恶菇（古来种）
                    { id: 987, weight: 8, levelRange: [11101, 12000] },   // 振翼发（古来种）
                    { id: 988, weight: 8, levelRange: [11101, 12000] },   // 爬地翅（古来种）
                    { id: 989, weight: 8, levelRange: [11101, 12000] },   // 沙铁皮（古来种）
                    { id: 998, weight: 5, levelRange: [11400, 12000] },   // 戟脊龙
                    { id: 1000, weight: 2, levelRange: [11400, 12000] },  // 赛富豪
                ]
            },
            {
                id: 'paldea_route11',
                name: '零区深处',
                description: '帕底亚大坑洞最深处，未来种悖论宝可梦出没',
                levelRange: [12001, 13000],
                pokemon: [
                    { id: 990, weight: 10, levelRange: [12001, 13000] },  // 铁辙迹（未来种）
                    { id: 991, weight: 10, levelRange: [12001, 13000] },  // 铁包袱（未来种）
                    { id: 992, weight: 10, levelRange: [12001, 13000] },  // 铁臂膀（未来种）
                    { id: 993, weight: 10, levelRange: [12001, 13000] },  // 铁脖颈（未来种）
                    { id: 994, weight: 10, levelRange: [12001, 13000] },  // 铁毒蛾（未来种）
                    { id: 995, weight: 10, levelRange: [12001, 13000] },  // 铁荆棘（未来种）
                    { id: 1005, weight: 5, levelRange: [12001, 13000] },  // 轰鸣月
                    { id: 1006, weight: 5, levelRange: [12001, 13000] },  // 铁武者
                ]
            },
            {
                id: 'paldea_route12',
                name: '灾厄之域',
                description: '传说中四灾宝可梦封印之地',
                levelRange: [14001, 15000],
                pokemon: [
                    { id: 1001, weight: 10, levelRange: [14001, 15000] },  // 古简蜗
                    { id: 1002, weight: 10, levelRange: [14001, 15000] },  // 古剑豹
                    { id: 1003, weight: 10, levelRange: [14001, 15000] },  // 古鼎鹿
                    { id: 1004, weight: 10, levelRange: [14001, 15000] },  // 古玉鱼
                    { id: 1009, weight: 8, levelRange: [14001, 15000] },   // 波荡水
                    { id: 1010, weight: 8, levelRange: [14001, 15000] },   // 铁斑叶
                ]
            },
            {
                id: 'paldea_route13',
                name: '蓝莓学园',
                description: 'DLC蓝莓学园的特训区域，新伙伴登场',
                levelRange: [15001, 16000],
                pokemon: [
                    { id: 1012, weight: 12, levelRange: [15001, 16000] },  // 斯魔茶
                    { id: 1011, weight: 10, levelRange: [15001, 16000] },  // 裹蜜虫
                    { id: 1013, weight: 8, levelRange: [15001, 16000] },   // 来悲粗茶
                    { id: 1014, weight: 8, levelRange: [15001, 16000] },   // 够赞狗
                    { id: 1015, weight: 8, levelRange: [15001, 16000] },   // 愿增猿
                    { id: 1016, weight: 8, levelRange: [15001, 16000] },   // 吉雉鸡
                    { id: 1017, weight: 8, levelRange: [15001, 16000] },   // 厄诡椪
                    { id: 1018, weight: 5, levelRange: [15001, 16000] },   // 铝钢桥龙
                    { id: 1019, weight: 5, levelRange: [15001, 16000] },   // 蜜集大蛇
                ]
            },
            {
                id: 'paldea_route14',
                name: '传说之路',
                description: '帕底亚的终极区域，隐藏着最强的传说宝可梦',
                levelRange: [16001, 17000],
                pokemon: [
                    { id: 1020, weight: 8, levelRange: [16001, 17000] },   // 破空焰
                    { id: 1021, weight: 8, levelRange: [16001, 17000] },   // 猛雷鼓
                    { id: 1022, weight: 8, levelRange: [16001, 17000] },   // 铁磐岩
                    { id: 1023, weight: 8, levelRange: [16001, 17000] },   // 铁头壳
                    { id: 1024, weight: 5, levelRange: [16001, 17000] },   // 太乐巴戈斯
                    { id: 1025, weight: 5, levelRange: [16001, 17000] },   // 桃歹郎
                    { id: 1007, weight: 1, levelRange: [17000, 17000] },   // 故勒顿
                    { id: 1008, weight: 1, levelRange: [17000, 17000] },   // 密勒顿
                ]
            },
        ]
    },

    // ===================== 第10地区: Mega进化地区 (ID 1026-1073) =====================
    mega: {
        id: 'mega',
        name: 'Mega进化地区',
        nameEn: 'Mega Evolution',
        description: '超越极限的Mega进化之地，经典Mega宝可梦聚集于此。需完成帕底亚图鉴方可进入。',
        unlockCondition: { type: 'pokedex_complete', region: 'paldea', range: [906, 1025] },
        routes: [
            {
                id: 'mega_route1',
                name: 'Mega觉醒之路',
                description: '初代Mega进化的觉醒之地，关都初始御三家和虫系Mega汇聚于此',
                levelRange: [17001, 18500],
                pokemon: [
                    { id: 1026, weight: 12, levelRange: [17001, 18500] },  // Mega妙蛙花
                    { id: 1029, weight: 12, levelRange: [17001, 18500] },  // Mega水箭龟
                    { id: 1027, weight: 10, levelRange: [17001, 18500] },  // Mega喷火龙X
                    { id: 1028, weight: 10, levelRange: [17001, 18500] },  // Mega喷火龙Y
                    { id: 1030, weight: 10, levelRange: [17001, 18500] },  // Mega大针蜂
                    { id: 1031, weight: 10, levelRange: [17001, 18500] },  // Mega大比鸟
                    { id: 1032, weight: 10, levelRange: [17001, 18500] },  // Mega胡地
                    { id: 1033, weight: 10, levelRange: [17001, 18500] },  // Mega呆壳兽
                    { id: 1034, weight: 8, levelRange: [17001, 18500] },   // Mega耿鬼
                    { id: 1035, weight: 8, levelRange: [17001, 18500] },   // Mega袋兽
                ]
            },
            {
                id: 'mega_route2',
                name: 'Mega进化之森',
                description: '暗藏强大Mega力量的森林，关都后期Mega宝可梦出没',
                levelRange: [18501, 20000],
                pokemon: [
                    { id: 1043, weight: 12, levelRange: [18501, 20000] },  // Mega巨钳螳螂
                    { id: 1044, weight: 12, levelRange: [18501, 20000] },  // Mega赫拉克罗斯
                    { id: 1036, weight: 10, levelRange: [18501, 20000] },  // Mega大甲
                    { id: 1037, weight: 10, levelRange: [18501, 20000] },  // Mega暴鲤龙
                    { id: 1038, weight: 10, levelRange: [18501, 20000] },  // Mega化石翼龙
                    { id: 1041, weight: 10, levelRange: [18501, 20000] },  // Mega电龙
                    { id: 1042, weight: 10, levelRange: [18501, 20000] },  // Mega大钢蛇
                    { id: 1045, weight: 10, levelRange: [18501, 20000] },  // Mega黑鲁加
                    { id: 1039, weight: 5, levelRange: [19000, 20000] },   // Mega超梦X
                    { id: 1040, weight: 5, levelRange: [19000, 20000] },   // Mega超梦Y
                ]
            },
            {
                id: 'mega_route3',
                name: 'Mega岩浆峡谷',
                description: '城都与丰缘强力Mega宝可梦栖息的灼热峡谷',
                levelRange: [20001, 21500],
                pokemon: [
                    { id: 1051, weight: 12, levelRange: [20001, 21500] },  // Mega勾魂眼
                    { id: 1052, weight: 12, levelRange: [20001, 21500] },  // Mega大嘴娃
                    { id: 1047, weight: 10, levelRange: [20001, 21500] },  // Mega蜥蜴王
                    { id: 1048, weight: 10, levelRange: [20001, 21500] },  // Mega火焰鸡
                    { id: 1049, weight: 10, levelRange: [20001, 21500] },  // Mega巨沼怪
                    { id: 1050, weight: 10, levelRange: [20001, 21500] },  // Mega沙奈朵
                    { id: 1053, weight: 10, levelRange: [20001, 21500] },  // Mega波士可多拉
                    { id: 1054, weight: 10, levelRange: [20001, 21500] },  // Mega恰雷姆
                    { id: 1046, weight: 8, levelRange: [20001, 21500] },   // Mega班基拉斯
                ]
            },
            {
                id: 'mega_route4',
                name: 'Mega暴风海域',
                description: '丰缘Mega后半部队驻守的狂风暴雨海域',
                levelRange: [21501, 23000],
                pokemon: [
                    { id: 1055, weight: 10, levelRange: [21501, 23000] },  // Mega雷电兽
                    { id: 1056, weight: 10, levelRange: [21501, 23000] },  // Mega巨牙鲨
                    { id: 1057, weight: 10, levelRange: [21501, 23000] },  // Mega喷火驼
                    { id: 1058, weight: 10, levelRange: [21501, 23000] },  // Mega七夕青鸟
                    { id: 1059, weight: 10, levelRange: [21501, 23000] },  // Mega诅咒娃娃
                    { id: 1060, weight: 10, levelRange: [21501, 23000] },  // Mega阿勃梭鲁
                    { id: 1061, weight: 10, levelRange: [21501, 23000] },  // Mega冰鬼护
                    { id: 1062, weight: 8, levelRange: [21501, 23000] },   // Mega暴飞龙
                    { id: 1063, weight: 8, levelRange: [21501, 23000] },   // Mega巨金怪
                    { id: 1064, weight: 7, levelRange: [21501, 23000] },   // Mega拉帝亚斯
                ]
            },
            {
                id: 'mega_route5',
                name: 'Mega极光冰原',
                description: '传说级Mega宝可梦与神奥Mega聚集的极寒之地',
                levelRange: [23001, 24500],
                pokemon: [
                    { id: 1070, weight: 12, levelRange: [23001, 24500] },  // Mega雪暴王
                    { id: 1072, weight: 12, levelRange: [23001, 24500] },  // Mega差不多娃娃
                    { id: 1067, weight: 12, levelRange: [23001, 24500] },  // Mega长耳兔
                    { id: 1071, weight: 10, levelRange: [23001, 24500] },  // Mega艾路雷朵
                    { id: 1068, weight: 8, levelRange: [23001, 24500] },   // Mega烈咬陆鲨
                    { id: 1069, weight: 8, levelRange: [23001, 24500] },   // Mega路卡利欧
                    { id: 1073, weight: 8, levelRange: [23001, 24500] },   // Mega蒂安希
                    { id: 1065, weight: 7, levelRange: [23001, 24500] },   // Mega拉帝欧斯
                    { id: 1066, weight: 3, levelRange: [24000, 24500] },   // Mega裂空座
                ]
            },
        ]
    }
};
