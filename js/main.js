// ============================================================
// 主入口 - 游戏初始化
// ============================================================

let game;
let gameUI;

window.addEventListener('DOMContentLoaded', () => {
    // 初始化游戏核心
    game = new GameCore();

    // 尝试加载存档
    let loaded = false;
    try {
        loaded = game.load();
    } catch (e) {
        console.warn('加载存档异常:', e);
    }
    if (!loaded) {
        game.initNewGame();
    }

    // 初始化UI
    gameUI = new GameUI(game);

    // 初次渲染
    gameUI.renderTeam();

    // 新手引导（只弹一次）
    if (!localStorage.getItem('pokemon_idle_tutorial_done')) {
        gameUI.showTutorialDialog(() => {
            localStorage.setItem('pokemon_idle_tutorial_done', '1');
        });
    }

    // 开始战斗
    game.startBattle();

    // 开始自动保存
    game.startAutoSave();

    // 启动树果倒计时刷新
    gameUI.startBerryTimer();

    console.log('🎮 宝可梦挂机放置游戏已启动！');
});

// 页面关闭前保存
window.addEventListener('beforeunload', () => {
    if (game) {
        game.save();
    }
});
