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

    // 离线结算：页面加载时如果距离上次保存超过2秒，自动执行离线战斗
    if (loaded && game.gameState && game.gameState.lastSave) {
        const elapsed = Date.now() - game.gameState.lastSave;
        if (elapsed > 2000) {
            const offlineBonusValue = game.getBadgeEffectValue('offline_time_bonus');
            const maxOffline = offlineBonusValue !== null ? offlineBonusValue : (24 * 3600 * 1000);
            const cappedElapsed = Math.min(elapsed, maxOffline);
            console.log(`[离线] 距上次保存 ${Math.floor(cappedElapsed / 60000)} 分钟，开始结算...`);
            // 延迟到下一帧，确保UI已初始化
            requestAnimationFrame(() => { game._processOfflineBattles(cappedElapsed); });
        }
    }

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
