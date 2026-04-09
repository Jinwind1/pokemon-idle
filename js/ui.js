// ============================================================
// UI 管理 - 界面渲染和交互
// ============================================================

class GameUI {
    constructor(game) {
        this.game = game;
        this.currentTab = 'tab-battle';
        this.pokedexFilter = 'all';
        this.pokedexRegionFilter = 'all'; // 地区筛选：all, kanto, johto, hoenn, sinnoh, unova, kalos, alola, galar, paldea
        this.pokedexSort = 'none';
        this.pokedexSortDesc = true; // true = 从高到低, false = 从低到高
        this._createOfflineOverlay();
        this.setupEventListeners();
    }

    // 创建离线模拟进度遮罩层
    _createOfflineOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'offline-overlay';
        overlay.className = 'offline-overlay hidden';
        overlay.innerHTML = `
            <div class="offline-overlay-content">
                <div class="offline-overlay-icon">⚡</div>
                <div class="offline-overlay-title">离线结算中...</div>
                <div class="offline-overlay-time" id="offline-time-text"></div>
                <div class="offline-progress-bar-wrapper">
                    <div class="offline-progress-bar" id="offline-progress-bar"></div>
                </div>
                <div class="offline-overlay-info">
                    <span id="offline-percent-text">0%</span>
                    <span id="offline-battles-text">已完成 0 场战斗</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this._offlineOverlay = overlay;
    }

    // ===================== 事件监听 =====================
    setupEventListeners() {
        // Tab 切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // 图鉴地区筛选（三级筛选）
        document.querySelectorAll('.region-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.pokedexRegionFilter = btn.dataset.region;
                document.querySelectorAll('.region-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderPokedex();
            });
        });

        // 图鉴主过滤
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.pokedexFilter = btn.dataset.filter;
                // 重置排序为默认
                this.pokedexSort = 'none';
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 显示/隐藏二级筛选栏（仅已捕获、闪光、未闪光需要排序）
                const subFilters = document.getElementById('pokedex-sub-filters');
                if (this.pokedexFilter === 'caught' || this.pokedexFilter === 'shiny' || this.pokedexFilter === 'not_shiny') {
                    subFilters.classList.remove('hidden');
                } else {
                    subFilters.classList.add('hidden');
                }
                
                // 重置二级按钮状态
                document.querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('.sub-filter-btn[data-sort="none"]').classList.add('active');
                
                this.renderPokedex();
            });
        });
        
        // 图鉴二级排序
        document.querySelectorAll('.sub-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const clickedSort = btn.dataset.sort;
                // 如果点击的是当前排序方式，切换方向
                if (this.pokedexSort === clickedSort && clickedSort !== 'none') {
                    this.pokedexSortDesc = !this.pokedexSortDesc;
                } else {
                    // 切换排序方式，重置为从高到低
                    this.pokedexSort = clickedSort;
                    this.pokedexSortDesc = true;
                }
                document.querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateSortButtonIndicator();
                this.renderPokedex();
            });
        });

        // 图鉴搜索框
        const searchInput = document.getElementById('pokedex-search-input');
        if (searchInput) {
            let searchTimer = null;
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    this.pokedexSearchQuery = searchInput.value.trim();
                    this.renderPokedex();
                }, 200);
            });
        }

        // 设置按钮
        document.getElementById('btn-save').addEventListener('click', () => {
            this.game.save();
            this.showToast('💾 游戏已保存！');
        });

        document.getElementById('btn-export').addEventListener('click', () => {
            const data = this.game.exportSave();
            document.getElementById('save-data-area').value = data;
            this.showToast('📋 存档已导出！请复制上方文本。');
        });

        document.getElementById('btn-import').addEventListener('click', () => {
            const data = document.getElementById('save-data-area').value.trim();
            if (!data) {
                this.showToast('⚠️ 请先在文本框中粘贴存档数据！');
                return;
            }
            if (this.game.importSave(data)) {
                this.showToast('✅ 存档导入成功！');
                this.refreshAll();
                this.game.stopBattle();
                this.game.startBattle();
            } else {
                this.showToast('❌ 存档数据无效！');
            }
        });

        document.getElementById('btn-delete').addEventListener('click', () => {
            this.showConfirmDialog('确定删除存档？', '此操作不可恢复，所有游戏数据将被清除。', () => {
                this.game.stopBattle();
                this.game.deleteSave();
                this.game.initNewGame();
                this.refreshAll();
                this.game.startBattle();
                this.showToast('🗑️ 存档已删除，游戏重新开始。');
            });
        });

        // 玩法说明弹窗
        const gameplayHelpBtn = document.getElementById('btn-gameplay-help');
        if (gameplayHelpBtn) {
            gameplayHelpBtn.addEventListener('click', () => {
                this.showGameplayHelpDialog();
            });
        }

        // 自动更换最优宝可梦设置
        const autoSwitchCheckbox = document.getElementById('setting-auto-switch');
        if (autoSwitchCheckbox) {
            // 恢复保存的状态
            autoSwitchCheckbox.checked = !!this.game.gameState.settings?.autoSwitchBest;
            autoSwitchCheckbox.addEventListener('change', () => {
                this.game.gameState.settings = this.game.gameState.settings || {};
                this.game.gameState.settings.autoSwitchBest = autoSwitchCheckbox.checked;
                this.game.save();
                this.showToast(autoSwitchCheckbox.checked ? '✅ 已开启自动更换最优宝可梦' : '❌ 已关闭自动更换最优宝可梦');
                // 联动显示/隐藏一击必杀策略
                this._syncOneShotStrategyVisibility();
            });
            // 初始化时同步显示状态
            this._syncOneShotStrategyVisibility();
        }

        // 一击必杀策略单选框
        this._initOneShotStrategy();

        // 自动切换地图设置（直接开放）
        this._initAutoRouteSetting();

        // 一键升级技能按钮
        this._initUpgradeAllSkillsBtn();

        // 主题颜色切换
        this._initTheme();
        document.querySelectorAll('.theme-color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                document.querySelectorAll('.theme-color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.game.gameState.settings = this.game.gameState.settings || {};
                this.game.gameState.settings.theme = theme;
                this.game.save();
                this.showToast(`🎨 主题已切换为「${btn.title}」`);
            });
        });

        // 初始化徽章Tab可见性
        this.updateBadgeTabVisibility();
        // 初始化树果Tab可见性
        this.updateBerryTabVisibility();
        // 初始化技能Tab可见性
        this.updateSkillTabVisibility();
        // 初始化天赋Tab可见性
        this.updateTalentTabVisibility();
        // 初始化挑战塔Tab可见性
        this.updateTowerTabVisibility();

        // 游戏事件回调
        this.game.onBattleEvent = (event, data) => this.handleBattleEvent(event, data);
        this.game.onCatch = (pokemon) => this.showCatchNotification(pokemon);
        this.game.onLevelUp = (pokemon) => this.showLevelUpNotification(pokemon);

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // 在输入框、文本域中不触发快捷键
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            // 仅在徽章页面生效
            if (this.currentTab !== 'tab-badge') return;
            // 有弹窗时不触发
            if (document.querySelector('.dialog-overlay')) return;

            const key = e.key.toLowerCase();
            if (key === 'b') {
                // 全部购买
                const buyAllBtn = document.getElementById('btn-buy-all-gems');
                if (buyAllBtn && buyAllBtn.offsetParent !== null) {
                    buyAllBtn.click();
                }
            } else if (key === 's') {
                // 一键合成
                e.preventDefault(); // 防止触发浏览器搜索
                const synthesizeAllBtn = document.getElementById('btn-synthesize-all');
                if (synthesizeAllBtn && synthesizeAllBtn.offsetParent !== null) {
                    synthesizeAllBtn.click();
                }
            }
        });
    }

    // 更新排序按钮指示器
    updateSortButtonIndicator() {
        document.querySelectorAll('.sub-filter-btn').forEach(btn => {
            const sort = btn.dataset.sort;
            // 清除所有指示器
            btn.textContent = btn.textContent.replace(/ [↑↓]$/, '');
            // 添加方向指示器
            if (sort === this.pokedexSort && sort !== 'none') {
                const indicator = this.pokedexSortDesc ? '↓' : '↑';
                btn.textContent += ' ' + indicator;
            }
        });
    }

    // ===================== Tab 切换 =====================
    switchTab(tabId) {
        // 拦截锁定的徽章Tab
        if (tabId === 'tab-badge') {
            const badgeTabBtn = document.querySelector('.badge-tab-btn');
            if (badgeTabBtn && badgeTabBtn.classList.contains('locked')) {
                this.showToast('🔒 通关关都地区后解锁徽章系统');
                return;
            }
        }
        // 拦截锁定的树果Tab
        if (tabId === 'tab-berry') {
            const berryTabBtn = document.querySelector('.berry-tab-btn');
            if (berryTabBtn && berryTabBtn.classList.contains('locked')) {
                this.showToast('🔒 完成丰缘图鉴后解锁树果系统');
                return;
            }
        }
        // 拦截锁定的技能Tab
        if (tabId === 'tab-skill') {
            const skillTabBtn = document.querySelector('.skill-tab-btn');
            if (skillTabBtn && skillTabBtn.classList.contains('locked')) {
                this.showToast('🔒 完成合众地区图鉴后解锁技能系统');
                return;
            }
        }
        // 拦截锁定的天赋Tab
        if (tabId === 'tab-talent') {
            const talentTabBtn = document.querySelector('.talent-tab-btn');
            if (talentTabBtn && talentTabBtn.classList.contains('locked')) {
                this.showToast('🔒 完成阿罗拉地区图鉴后解锁天赋系统');
                return;
            }
        }
        // 拦截锁定的挑战塔Tab
        if (tabId === 'tab-tower') {
            const towerTabBtn = document.querySelector('.tower-tab-btn');
            if (towerTabBtn && towerTabBtn.classList.contains('locked')) {
                this.showToast('🔒 完成帕底亚地区图鉴后解锁挑战岛');
                return;
            }
        }
        this.currentTab = tabId;
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // 切换时刷新对应内容
        if (tabId === 'tab-map') this.renderMap();
        if (tabId === 'tab-badge') this.renderBadgePage();
        if (tabId === 'tab-berry') this.renderBerryPage();
        if (tabId === 'tab-skill') this.renderSkillPage();
        if (tabId === 'tab-talent') this.renderTalentPage();
        if (tabId === 'tab-tower') this.renderTowerPage();
        if (tabId === 'tab-pokedex') this.renderPokedex();
        if (tabId === 'tab-settings') this.renderSettings();
        if (tabId === 'tab-battle') {
            this.renderTeam();
        }
    }

    // ===================== 战斗界面 =====================
    handleBattleEvent(event, data) {
        switch (event) {
            case 'start':
                this.renderBattleStart(data);
                break;
            case 'playerAttack':
                this.onPlayerAttack(data);
                break;
            case 'enemyAttack':
                this.onEnemyAttack(data);
                break;
            case 'tick':
                this.updateBattleHP(data);
                break;
            case 'enemyDefeated':
                this.onEnemyDefeated(data);
                break;
            case 'playerFainted':
                if (this.game._towerMode) {
                    this.addBattleLog('我方宝可梦倒下了... 挑战失败', 'defeat');
                } else {
                    this.addBattleLog('我方宝可梦倒下了... 正在回复生命值', 'defeat');
                }
                break;
            case 'healing':
                this.updateBattleHP({
                    playerHp: data.hp,
                    playerMaxHp: data.maxHp,
                    enemyHp: 0,
                    enemyMaxHp: 1,
                });
                this.addBattleLog(`💚 生命值回复中... ${Math.floor(data.hp / data.maxHp * 100)}%`, 'normal');
                break;
            case 'evolved':
                this.showEvolutionNotification(data);
                break;
            case 'shinyEvolved':
                this.addBattleLog(`✨ ${data.oldName} 的闪光形态传递给了 ${data.newName}！`, 'shiny');
                this.showToast(`✨ ${data.newName} 获得了闪光形态！`);
                break;
            case 'shinySpread':
                this.addBattleLog(`✨ ${data.sourceName} 的闪光传播给了 ${data.targetName}！`, 'shiny');
                break;
            case 'shinyDefeated':
                this.addBattleLog(`✨ 获得了 ${data.name} 的闪光形态！可在图鉴中切换展示`, 'shiny');
                this.showToast(`✨ 恭喜！获得了 ${data.name} 的闪光形态！`);
                break;
            case 'badgeUnlocked':
                this.addBattleLog(`🏅 恭喜！获得了 ${data.badgeName}！`, 'evolution');
                this.showToast(`🏅 恭喜！获得了 ${data.badgeName}！`);
                this.updateBadgeTabVisibility();
                // 丰缘徽章解锁时同步解锁树果系统
                if (data.regionId === 'hoenn') {
                    this.updateBerryTabVisibility();
                    this._initBerrySystem();
                    setTimeout(() => {
                        this.showToast('🌱 树果系统已解锁！可以种植树果增强宝可梦了');
                    }, 2000);
                }
                // 合众徽章解锁时同步解锁技能系统
                if (data.regionId === 'unova') {
                    this.updateSkillTabVisibility();
                    setTimeout(() => {
                        this.showToast('⚡ 技能系统已解锁！1000级以上宝可梦可升级技能');
                    }, 2000);
                }
                // 阿罗拉徽章解锁时同步解锁天赋系统
                if (data.regionId === 'alola') {
                    this.updateTalentTabVisibility();
                    setTimeout(() => {
                        this.showToast('🌟 天赋系统已解锁！消耗天赋点强化各项能力');
                    }, 2000);
                }
                // 帕底亚徽章解锁时显示自动切换地图设置 + 解锁挑战塔
                if (data.regionId === 'paldea') {
                    this.updateAutoRouteSettingVisibility();
                    this._initAutoRouteSetting();
                    this.updateTowerTabVisibility();
                    setTimeout(() => {
                        this.showToast('💎 自动切换地图已解锁！可在设置中开启');
                    }, 2000);
                    setTimeout(() => {
                        this.showToast('🏝️ 挑战岛已解锁！挑战获取全局加成');
                    }, 4000);
                }
                break;
            case 'regionUnlocked':
                this.addBattleLog(`🎉 恭喜！${data.regionName}已解锁！`, 'evolution');
                this.showToast(`🎉 ${data.regionName}已解锁！可以在地图中前往了`);
                break;
            case 'playerDodge':
                this.addBattleLog(`💫 闪避了敌方的攻击！`, 'attack');
                break;
            case 'towerEnemyDefeated':
                // 将敌方HP条动画归零
                this.updateBattleHP({
                    playerHp: data.playerHp,
                    playerMaxHp: data.playerMaxHp,
                    enemyHp: 0,
                    enemyMaxHp: 1,
                });
                this.addBattleLog(`🏝️ 挑战塔：击败了第 ${data.floorIndex}/${data.totalEnemies} 只敌人！`, 'evolution');
                break;
            case 'towerFloorCleared':
                this.addBattleLog(`🎉 挑战塔：第 ${data.floor} 层通关！历史最高：${data.highestFloor} 层`, 'shiny');
                this.showToast(`🏝️ 挑战塔第 ${data.floor} 层通关！`);
                // 通关后切回挑战岛页面并恢复主线战斗
                setTimeout(() => {
                    this.switchTab('tab-tower');
                    this.game.startBattle(); // 恢复主线
                }, 500);
                break;
            case 'towerPlayerFainted':
                this.addBattleLog(`💀 挑战塔第 ${data.floor} 层挑战失败...`, 'defeat');
                this.showToast(`💀 挑战失败！可以重新挑战第 ${data.floor} 层`);
                // 失败后切回挑战岛页面并恢复主线战斗
                setTimeout(() => {
                    this.switchTab('tab-tower');
                    this.game.startBattle(); // 恢复主线
                }, 1500);
                break;
            case 'offlineStart':
                this._showOfflineOverlay(data.totalMs);
                break;
            case 'offlineProgress':
                this._updateOfflineProgress(data.progress, data.battles, data.percent);
                break;
            case 'offlineEnd':
                this._hideOfflineOverlay(data.battles, data.totalMs, data.offlineEvents);
                break;
            case 'autoSwitched': {
                const pokemonId = this.game.gameState.team[data.newIndex];
                const pokemonData = POKEMON_DATA[pokemonId];
                if (pokemonData) {
                    this.addBattleLog(`🔄 自动切换出战：${pokemonData.name}`, 'normal');
                }
                this.renderTeam();
                break;
            }
            case 'autoRouteSwitch': {
                const condition = this.game.gameState.settings?.routeSwitchCondition || '6v_shiny';
                const condText = condition === '6v_only' ? '全部6V' : '全部6V+闪光';
                this.addBattleLog(`💎 当前地图已${condText}！自动前往 ${data.regionName} · ${data.routeName}`, 'evolution');
                this.showToast(`💎 自动切换到 ${data.routeName}`);
                break;
            }
        }
    }

    renderBattleStart(battle) {
        const wild = battle.wild;
        const playerPokemonId = this.game.gameState.team[this.game.gameState.activePokemonIndex];
        const playerPokemon = this.game.createPokemon(playerPokemonId, true);

        // 获取双方属性
        const wildData = POKEMON_DATA[wild.id];
        const playerData = POKEMON_DATA[playerPokemonId];
        const wildTypes = wildData?.types || [];
        const playerTypes = playerData?.types || [];

        // 敌方信息
        const shinyPrefix = wild.isShiny ? '✨ ' : '';
        document.getElementById('enemy-name').textContent = shinyPrefix + wild.name;
        document.getElementById('enemy-level').textContent = `Lv.${wild.level}`;
        const enemyHpPercent = Math.max(0, battle.wildCurrentHp / battle.wildMaxHp * 100);
        document.getElementById('enemy-hp-bar').style.width = `${enemyHpPercent}%`;
        document.getElementById('enemy-hp-bar').className = `hp-bar${enemyHpPercent <= 20 ? ' hp-danger' : enemyHpPercent <= 50 ? ' hp-warning' : ''}`;
        document.getElementById('enemy-hp-text').textContent = `${battle.wildCurrentHp}/${battle.wildMaxHp}`;

        // 计算双向属性相克（支持双属性攻击方取最优）
        const playerEffectiveness = getBestTypeEffectiveness(playerTypes, wildTypes).multiplier;
        const enemyEffectiveness = getBestTypeEffectiveness(wildTypes, playerTypes).multiplier;
        
        // 敌方属性 + 对我方克制图标
        let enemyTypeIcon = '';
        if (enemyEffectiveness > 1) {
            enemyTypeIcon = `<span class="matchup-icon matchup-up" title="克制我方">🔥</span>`;
        } else if (enemyEffectiveness < 1) {
            enemyTypeIcon = `<span class="matchup-icon matchup-down" title="被我方抵抗">🛡️</span>`;
        }
        const enemyTypesHtml = wildTypes.map(t =>
            `<span class="type-badge ${t}">${TYPE_NAMES[t]}</span>`
        ).join(' ') + enemyTypeIcon;
        document.getElementById('enemy-types').innerHTML = enemyTypesHtml;

        // 敌方精灵图（闪光宝可梦使用闪光图片）
        const enemySprite = document.getElementById('enemy-sprite');
        const enemySpriteUrl = wild.isShiny ? getShinyPokemonSpriteUrl(wild.id) : getPokemonSpriteUrl(wild.id);
        enemySprite.innerHTML = `<img src="${enemySpriteUrl}" alt="${wild.name}" onerror="this.parentElement.textContent='👾'">`;
        if (wild.isShiny) {
            enemySprite.classList.add('shiny');
        } else {
            enemySprite.classList.remove('shiny');
        }

        // 玩家信息（根据图鉴展示偏好决定是否显示闪光外观）
        const playerShowShiny = this.game.gameState.pokedexDisplay[playerPokemonId] === 'shiny';
        const playerHasShiny = this.game.gameState.shinyDex[playerPokemonId];
        const playerShinyPrefix = playerHasShiny ? '✨ ' : '';
        document.getElementById('player-name').textContent = playerShinyPrefix + playerPokemon.name;
        document.getElementById('player-level').textContent = `Lv.${playerPokemon.level}`;
        const playerHpPercent = Math.max(0, battle.playerCurrentHp / battle.playerMaxHp * 100);
        document.getElementById('player-hp-bar').style.width = `${playerHpPercent}%`;
        document.getElementById('player-hp-bar').className = `hp-bar${playerHpPercent <= 20 ? ' hp-danger' : playerHpPercent <= 50 ? ' hp-warning' : ''}`;
        document.getElementById('player-hp-text').textContent = `${battle.playerCurrentHp}/${battle.playerMaxHp}`;

        // 玩家属性 + 对敌方克制图标
        let playerTypeIcon = '';
        if (playerEffectiveness > 1) {
            playerTypeIcon = `<span class="matchup-icon matchup-up" title="克制敌方">⚔️</span>`;
        } else if (playerEffectiveness < 1) {
            playerTypeIcon = `<span class="matchup-icon matchup-down" title="被敌方抵抗">🛡️</span>`;
        }
        const playerTypesHtml = playerTypes.map(t =>
            `<span class="type-badge ${t}">${TYPE_NAMES[t]}</span>`
        ).join(' ') + playerTypeIcon;
        document.getElementById('player-types').innerHTML = playerTypesHtml;

        // 玩家精灵图（根据图鉴展示偏好决定是否使用闪光图片）
        const playerSprite = document.getElementById('player-sprite');
        const playerSpriteUrl = playerShowShiny ? getShinyPokemonSpriteUrl(playerPokemonId) : getPokemonSpriteUrl(playerPokemonId);
        playerSprite.innerHTML = `<img src="${playerSpriteUrl}" alt="${playerPokemon.name}" onerror="this.parentElement.textContent='⚡'">`;
        if (playerShowShiny) {
            playerSprite.classList.add('shiny');
        } else {
            playerSprite.classList.remove('shiny');
        }

        // 清除原来的文字显示
        document.getElementById('player-matchup').innerHTML = '';
        document.getElementById('enemy-matchup').innerHTML = '';
        document.getElementById('type-matchup').innerHTML = '';

        this.addBattleLog(`野生的 ${shinyPrefix}${wild.name} 出现了！${wild.isShiny ? '（闪光！）' : ''}`, wild.isShiny ? 'shiny' : 'normal');

        // 重置攻击进度条
        document.getElementById('player-atk-bar').style.width = '0%';
        document.getElementById('enemy-atk-bar').style.width = '0%';
    }

    onPlayerAttack(data) {
        const playerSprite = document.getElementById('player-sprite');
        const enemySprite = document.getElementById('enemy-sprite');
        playerSprite.classList.add('attacking');
        setTimeout(() => {
            playerSprite.classList.remove('attacking');
            enemySprite.classList.add('hit');
            setTimeout(() => enemySprite.classList.remove('hit'), 300);
        }, 150);
        // 显示伤害信息
        const critText = data.critical ? '💥会心一击！' : '';
        const effectText = data.effectivenessText || '';
        const skillText = data.skillName ? `使用【${data.skillName}】` : '';
        this.addBattleLog(`${skillText}${critText}造成 ${data.damage} 点伤害 ${effectText}`, 'attack');
    }

    onEnemyAttack(data) {
        const enemySprite = document.getElementById('enemy-sprite');
        const playerSprite = document.getElementById('player-sprite');
        enemySprite.classList.add('attacking');
        setTimeout(() => {
            enemySprite.classList.remove('attacking');
            playerSprite.classList.add('hit');
            setTimeout(() => playerSprite.classList.remove('hit'), 300);
        }, 150);
        // 显示伤害信息
        const critText = data.critical ? '💥会心一击！' : '';
        const effectText = data.effectivenessText || '';
        this.addBattleLog(`${critText}受到 ${data.damage} 点伤害 ${effectText}`, 'attack');
    }

    updateBattleHP(data) {
        // 敌方HP
        const enemyPercent = Math.max(0, data.enemyHp / data.enemyMaxHp * 100);
        const enemyBar = document.getElementById('enemy-hp-bar');
        enemyBar.style.width = enemyPercent + '%';
        enemyBar.className = 'hp-bar' + (enemyPercent <= 20 ? ' low' : enemyPercent <= 50 ? ' medium' : '');
        document.getElementById('enemy-hp-text').textContent = `${Math.max(0, data.enemyHp)}/${data.enemyMaxHp}`;

        // 玩家HP
        const playerPercent = Math.max(0, data.playerHp / data.playerMaxHp * 100);
        const playerBar = document.getElementById('player-hp-bar');
        playerBar.style.width = playerPercent + '%';
        playerBar.className = 'hp-bar' + (playerPercent <= 20 ? ' low' : playerPercent <= 50 ? ' medium' : '');
        document.getElementById('player-hp-text').textContent = `${Math.max(0, data.playerHp)}/${data.playerMaxHp}`;

        // 攻击进度条
        if (data.playerAttackProgress !== undefined) {
            const playerAtkPercent = Math.min(100, Math.max(0, data.playerAttackProgress * 100));
            document.getElementById('player-atk-bar').style.width = playerAtkPercent + '%';
        }
        if (data.enemyAttackProgress !== undefined) {
            const enemyAtkPercent = Math.min(100, Math.max(0, data.enemyAttackProgress * 100));
            document.getElementById('enemy-atk-bar').style.width = enemyAtkPercent + '%';
        }
    }

    onEnemyDefeated(data) {
        // 更新血条：敌方为0，玩家回复后血量
        this.updateBattleHP({
            playerHp: data.playerHp,
            playerMaxHp: data.playerMaxHp,
            enemyHp: 0,
            enemyMaxHp: data.enemyMaxHp,
        });

        let message = `击败了 ${data.pokemon.name}！获得 ${data.exp} 经验值`;
        if (data.gold && data.gold > 0) {
            message += ` 🪙 +${data.gold}`;
        }
        if (data.healed && data.healed > 0) {
            message += ` 💚 回复 ${data.healed} HP`;
        }
        this.addBattleLog(message, 'defeat');
        this.renderTeam();
        // 更新金币显示
        this.updateGoldDisplay();
    }

    // 战斗日志数组，最多保存100条
    battleLogs = [];

    addBattleLog(msg, type = 'normal') {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        this.battleLogs.unshift({ time: timeStr, message: msg, type });
        
        // 只保留最近100条
        if (this.battleLogs.length > 100) {
            this.battleLogs = this.battleLogs.slice(0, 100);
        }
        
        this.renderBattleLogs();
    }

    renderBattleLogs() {
        const container = document.getElementById('battle-messages');
        container.innerHTML = this.battleLogs.map(log => {
            let colorClass = '';
            if (log.type === 'catch') colorClass = 'log-catch';
            else if (log.type === 'levelup') colorClass = 'log-levelup';
            else if (log.type === 'attack') colorClass = 'log-attack';
            else if (log.type === 'defeat') colorClass = 'log-defeat';
            else if (log.type === 'evolution') colorClass = 'log-evolution';
            return `<div class="log-entry ${colorClass}"><span class="log-time">[${log.time}]</span> ${log.message}</div>`;
        }).join('');
    }

    // ===================== 队伍面板（含属性/个体值/经验值） =====================
    // 格式化速率数字（大数字用 K/M 缩写）
    _formatRate(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 10000) return (num / 1000).toFixed(1) + 'K';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    renderTeam() {
        if (!this.game.gameState) return;

        const teamList = document.getElementById('team-list');
        // 获取实际速率
        const rates = this.game.getRatesPerMinute();
        let rateHtml = '';
        if (rates) {
            const parts = [];
            if (rates.expPerMin > 0) {
                parts.push(`<span class="rate-exp">📊 ${this._formatRate(rates.expPerMin)} 经验/分钟</span>`);
            }
            if (rates.goldPerMin > 0) {
                parts.push(`<span class="rate-gold">🪙 ${this._formatRate(rates.goldPerMin)} 金币/分钟</span>`);
            }
            if (parts.length > 0) {
                rateHtml = `<span class="team-rate-info">${parts.join(' ')}</span>`;
            }
        }
        teamList.innerHTML = '<h3 style="font-size:14px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap"><span>⚔️ 战斗队伍 (' + this.game.gameState.team.length + '/6)</span>' + rateHtml + '</h3>';

        // 出战宝可梦排在最前面，其余按等级从高到低排序
        const activeIdx = this.game.gameState.activePokemonIndex;
        const restIndices = this.game.gameState.team.map((_, i) => i).filter(i => i !== activeIdx);
        restIndices.sort((a, b) => {
            const levelA = this.game.getStoredData(this.game.gameState.team[a])?.level || 1;
            const levelB = this.game.getStoredData(this.game.gameState.team[b])?.level || 1;
            return levelB - levelA;
        });
        const renderOrder = [activeIdx, ...restIndices];

        renderOrder.forEach((index) => {
            const pokemonId = this.game.gameState.team[index];
            if (!pokemonId) return;
            const isActive = index === activeIdx;
            
            // 从 game.createPokemon 获取宝可梦实例（使用存储的等级）
            const pokemon = this.game.createPokemon(pokemonId, true);
            if (!pokemon) return;

            const battleStats = this.game.calculateBattleStats(index);
            const expProgress = this.game.getExpProgress(pokemonId);
            const baseData = POKEMON_DATA[pokemonId];

            const typeBadges = baseData.types.map(t =>
                `<span class="type-badge ${t}">${TYPE_NAMES[t]}</span>`
            ).join(' ');

            const slot = document.createElement('div');
            slot.className = `team-slot${isActive ? ' active' : ''}`;
            
            // 获取宝可梦的存储数据
            const storedData = this.game.getStoredData(pokemonId);
            
            // 计算战力和潜力
            const power = this.game.calculatePower(pokemonId, true);
            const potential = this.game.calculatePotential(pokemonId);
            const potentialColor = potential >= 80 ? '#2ecc71' : potential >= 60 ? '#f39c12' : '#e74c3c';
            
            const showShiny = this.game.gameState.pokedexDisplay[pokemonId] === 'shiny';
            const slotSpriteUrl = showShiny ? getShinyPokemonSpriteUrl(pokemonId) : getPokemonSpriteUrl(pokemonId);
            const hasShiny = this.game.gameState.shinyDex[pokemonId];
            const shinyNamePrefix = hasShiny ? '✨ ' : '';

            // 技能等级显示（0不显示）
            const skillLevel = storedData ? (storedData.skillLevel || 0) : 0;
            const skillBadgeHtml = skillLevel > 0 ? ` <span class="team-skill-badge">⚡${skillLevel >= MAX_SKILL_LEVEL ? 'Max' : 'Lv.' + skillLevel}</span>` : '';

            slot.innerHTML = `
                <div class="slot-main-row">
                    <div class="slot-sprite${showShiny ? ' shiny' : ''}"><img src="${slotSpriteUrl}" alt="${pokemon.name}" onerror="this.parentElement.textContent='🔵'"></div>
                    <div class="slot-info">
                        <div class="slot-name">${shinyNamePrefix}${pokemon.name} ${isActive ? '⚔️' : ''} <small style="color:var(--text-secondary);font-weight:normal">Lv.${pokemon.level}</small>${skillBadgeHtml}</div>
                        <div class="slot-type-nature">${typeBadges}</div>
                    </div>
                    <div class="team-slot-actions">
                        ${!isActive ? `<button onclick="gameUI.setActive(${index})">出战</button>` : ''}
                        ${!isActive && this.game.gameState.team.length > 1 ? `<button class="remove-btn" onclick="gameUI.removeFromTeam(${index})">移除</button>` : ''}
                    </div>
                </div>
                <div class="team-stats-wrapper">
                    <div class="team-stats-compact">
                        <div class="team-stat-line">
                            <span class="stat-name">❤️ 生命值</span>
                            <span class="stat-value">${battleStats.hp}</span>
                            <span class="stat-iv">(IV:${pokemon.ivs.hp})</span>
                        </div>
                        <div class="team-stat-line">
                            <span class="stat-name">⚔️ 攻击力</span>
                            <span class="stat-value">${battleStats.attack}</span>
                            <span class="stat-iv">(IV:${pokemon.ivs.atk}+${pokemon.ivs.spAtk})</span>
                        </div>
                        <div class="team-stat-line">
                            <span class="stat-name">🛡️ 防御力</span>
                            <span class="stat-value">${battleStats.defense}</span>
                            <span class="stat-iv">(IV:${pokemon.ivs.def}+${pokemon.ivs.spDef})</span>
                        </div>
                        <div class="team-stat-line">
                            <span class="stat-name">💨 速度</span>
                            <span class="stat-value">${battleStats.speed}</span>
                            <span class="stat-iv">(IV:${pokemon.ivs.speed})</span>
                        </div>
                    </div>
                    <div class="team-stats-right">
                        <div class="right-stat power-stat" title="战力">⚔️ ${power}</div>
                        <div class="right-stat potential-stat" title="潜力" style="color:${potentialColor}">💎 ${potential}%</div>
                    </div>
                </div>
                <div class="slot-exp-section">
                    <div class="slot-exp-info">
                        <span>EXP ${expProgress.current}/${expProgress.needed}</span>
                        <span>${expProgress.percent}%</span>
                    </div>
                    <div class="slot-exp-bar">
                        <div class="slot-exp-fill" style="width:${expProgress.percent}%"></div>
                    </div>
                </div>
            `;
            teamList.appendChild(slot);
        });
    }

    setActive(index) {
        this.game.setActivePokemon(index);
        this.renderTeam();
    }

    removeFromTeam(index) {
        if (this.game.removeFromTeam(index)) {
            this.renderTeam();
            this.showToast('宝可梦已离开队伍');
        }
    }

    addToTeamFromPokedex(pokemonId) {
        if (this.game.gameState.team.length >= 6) {
            this.showToast('⚠️ 队伍已满（最多6只）');
            return;
        }
        const result = this.game.addToTeamFromPokedex(pokemonId);
        if (result) {
            this.renderTeam();
            this.renderPokedex();
            this.showToast('宝可梦已加入队伍！');
        } else {
            this.showToast('⚠️ 加入队伍失败');
        }
    }

    removeFromTeamByPokemonId(pokemonId) {
        if (this.game.gameState.team.length <= 1) {
            this.showToast('⚠️ 队伍至少需要保留一只宝可梦');
            return;
        }
        const result = this.game.removeFromTeamByPokemonId(pokemonId);
        if (result) {
            this.renderTeam();
            this.renderPokedex();
            this.showToast('宝可梦已离开队伍');
        } else {
            this.showToast('⚠️ 无法移除出战宝可梦');
        }
    }

    // 一击必杀策略：初始化单选框
    _initOneShotStrategy() {
        const radios = document.querySelectorAll('input[name="oneshot-strategy"]');
        if (!radios.length) return;
        const saved = this.game.gameState.settings?.oneShotStrategy || 'fastest';
        radios.forEach(radio => {
            radio.checked = radio.value === saved;
            radio.addEventListener('change', () => {
                if (!radio.checked) return;
                this.game.gameState.settings = this.game.gameState.settings || {};
                this.game.gameState.settings.oneShotStrategy = radio.value;
                this.game.save();
                const labels = { fastest: '🏃 速度最快', lowest_level: '📈 等级最低', no_change: '🔒 不改变' };
                this.showToast(`⚡ 一击必杀策略: ${labels[radio.value]}`);
            });
        });
    }

    // 一击必杀策略：联动显示/隐藏
    _syncOneShotStrategyVisibility() {
        const group = document.getElementById('oneshot-strategy-group');
        if (!group) return;
        const autoSwitch = !!this.game.gameState.settings?.autoSwitchBest;
        group.style.display = autoSwitch ? '' : 'none';
    }

    // 初始化自动切换地图设置（无需徽章，直接开放）
    _initAutoRouteSetting() {
        const wrapper = document.getElementById('setting-auto-route-wrapper');
        const desc = document.getElementById('setting-auto-route-desc');
        const checkbox = document.getElementById('setting-auto-route');
        if (!wrapper || !checkbox) return;

        // 直接显示，无需徽章
        wrapper.style.display = '';
        if (desc) desc.style.display = '';
        checkbox.checked = !!this.game.gameState.settings?.autoRouteSwitch;
        checkbox.addEventListener('change', () => {
            this.game.gameState.settings = this.game.gameState.settings || {};
            this.game.gameState.settings.autoRouteSwitch = checkbox.checked;
            this.game.save();
            this.showToast(checkbox.checked ? '✅ 已开启自动切换地图' : '❌ 已关闭自动切换地图');
            // 联动显示/隐藏条件选项
            this._syncRouteSwitchConditionVisibility();
        });
        // 初始化条件单选框
        this._initRouteSwitchCondition();
        this._syncRouteSwitchConditionVisibility();
    }

    // 初始化地图切换条件单选框
    _initRouteSwitchCondition() {
        const radios = document.querySelectorAll('input[name="route-switch-condition"]');
        if (!radios.length) return;
        const saved = this.game.gameState.settings?.routeSwitchCondition || '6v_shiny';
        radios.forEach(radio => {
            radio.checked = radio.value === saved;
            radio.addEventListener('change', () => {
                if (!radio.checked) return;
                this.game.gameState.settings = this.game.gameState.settings || {};
                this.game.gameState.settings.routeSwitchCondition = radio.value;
                this.game.save();
                const labels = { '6v_shiny': '✨ 6V且闪光后切换', '6v_only': '🎯 6V后切换' };
                this.showToast(`📋 切换条件: ${labels[radio.value]}`);
            });
        });
    }

    // 联动显示/隐藏地图切换条件
    _syncRouteSwitchConditionVisibility() {
        const group = document.getElementById('route-switch-condition-group');
        if (!group) return;
        const autoSwitch = !!this.game.gameState.settings?.autoRouteSwitch;
        group.style.display = autoSwitch ? '' : 'none';
    }

    // 一键升级技能按钮初始化
    _initUpgradeAllSkillsBtn() {
        const btn = document.getElementById('btn-upgrade-all-skills');
        if (!btn) return;
        btn.addEventListener('click', () => {
            this.showConfirmDialog(
                '一键升级技能',
                '将遍历所有已捕获的宝可梦，把达到1000级且技能未满级的全部升级一次技能。<br>⚠️ 升级后等级将重置为1（超过1000级的经验会返还），确定继续吗？',
                () => {
                    const result = this.game.upgradeAllSkills();
                    if (result.success) {
                        const names = result.results.slice(0, 5).map(r => `${r.name}→Lv.${r.newSkillLevel}`).join('、');
                        const more = result.count > 5 ? `…等${result.count}只` : '';
                        this.showToast(`⚡ 成功升级 ${result.count} 只宝可梦的技能！\n${names}${more}`);
                        this.renderPokedex();
                        this.renderTeam();
                    } else {
                        this.showToast('⚠️ ' + result.message);
                    }
                }
            );
        });
    }

    // 同步一键升级技能按钮可见性
    _syncUpgradeAllSkillsBtnVisibility() {
        const btn = document.getElementById('btn-upgrade-all-skills');
        if (!btn) return;
        btn.style.display = this.game.isSkillUnlocked() ? '' : 'none';
    }

    // 显示自动切换地图设置（直接开放）
    updateAutoRouteSettingVisibility() {
        const wrapper = document.getElementById('setting-auto-route-wrapper');
        const desc = document.getElementById('setting-auto-route-desc');
        if (!wrapper) return;
        wrapper.style.display = '';
        if (desc) desc.style.display = '';
    }

    // ===================== 地图界面 =====================
    renderMap() {
        const regionList = document.getElementById('region-list');
        regionList.innerHTML = '';

        for (const key in REGIONS) {
            const region = REGIONS[key];
            const isUnlocked = this.game.isRegionUnlocked(key);
            const card = document.createElement('div');
            card.className = `region-card${this.game.gameState.currentRegion === key ? ' active' : ''}${!isUnlocked ? ' locked' : ''}`;
            card.dataset.regionId = key;

            if (isUnlocked) {
                // 检查该地区所有宝可梦是否全部6V / 全部闪光
                const allPokemon = region.routes.flatMap(r => r.pokemon);
                let regionAll6V = allPokemon.length > 0;
                let regionAllShiny = allPokemon.length > 0;
                for (const p of allPokemon) {
                    const caught = this.game.gameState.pokedex[p.id] === 'caught';
                    if (!caught) { regionAll6V = false; regionAllShiny = false; break; }
                    const storedData = this.game.getStoredData(p.id);
                    const is6V = storedData && storedData.ivs &&
                        storedData.ivs.hp === 31 && storedData.ivs.atk === 31 &&
                        storedData.ivs.def === 31 && storedData.ivs.spAtk === 31 &&
                        storedData.ivs.spDef === 31 && storedData.ivs.speed === 31;
                    if (!is6V) regionAll6V = false;
                    if (!this.game.gameState.shinyDex[p.id]) regionAllShiny = false;
                }
                let regionBadges = '';
                if (regionAll6V) regionBadges += ' <span class="route-badge-6v">6V</span>';
                if (regionAllShiny) regionBadges += ' <span class="route-badge-shiny">✨</span>';

                card.innerHTML = `
                    <h3>${region.name}${regionBadges}</h3>
                    <p>${region.description}</p>
                    <p style="font-size:11px;color:var(--warning);margin-top:4px">${region.routes.length} 个地点</p>
                `;
                card.addEventListener('click', () => {
                    this.game.changeRegion(key);
                    this.showRoutes(key);
                });
            } else {
                const progress = this.game.getRegionUnlockProgress(key);
                card.innerHTML = `
                    <h3>🔒 ${region.name}</h3>
                    <p style="color:var(--text-secondary)">${region.description}</p>
                    <div class="unlock-progress">
                        <div class="unlock-progress-text">解锁进度: ${progress.current}/${progress.total} (${progress.percent}%)</div>
                        <div class="unlock-progress-bar">
                            <div class="unlock-progress-fill" style="width:${progress.percent}%"></div>
                        </div>
                    </div>
                `;
            }
            regionList.appendChild(card);
        }

        // 默认显示当前地区的道路
        this.showRoutes(this.game.gameState.currentRegion);
    }

    showRoutes(regionId) {
        const region = REGIONS[regionId];
        if (!region) return;

        // 高亮选中的地区
        document.querySelectorAll('.region-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.regionId === regionId) {
                card.classList.add('active');
            }
        });

        document.getElementById('region-title').textContent = `📍 ${region.name}`;

        const routeList = document.getElementById('route-list');
        routeList.innerHTML = '';

        region.routes.forEach(route => {
            const isActive = this.game.gameState.currentRoute === route.id;
            const card = document.createElement('div');
            card.className = `route-card${isActive ? ' active' : ''}`;

            const pokemonPreview = route.pokemon.map(p => {
                const data = POKEMON_DATA[p.id];
                const caught = this.game.gameState.pokedex[p.id] === 'caught';
                const seen = this.game.gameState.pokedex[p.id];
                const name = data ? data.name : '???';
                
                // 标识符：闪光✨ 和 6V标识
                let badges = '';
                if (caught) {
                    const hasShiny = this.game.gameState.shinyDex[p.id];
                    const storedData = this.game.getStoredData(p.id);
                    const is6V = storedData && storedData.ivs && 
                        storedData.ivs.hp === 31 && storedData.ivs.atk === 31 && 
                        storedData.ivs.def === 31 && storedData.ivs.spAtk === 31 && 
                        storedData.ivs.spDef === 31 && storedData.ivs.speed === 31;
                    if (hasShiny) badges += '✨';
                    if (is6V) badges += '<span class="badge-6v">6V</span>';
                }
                
                return `<span style="${caught ? 'color:#2ecc71' : seen ? 'color:#f39c12' : 'color:#666'}">${name}${badges}</span>`;
            }).join('');

            // 检查该道路所有精灵是否全部6V / 全部闪光
            let allCaught = route.pokemon.length > 0;
            let all6V = route.pokemon.length > 0;
            let allShiny = route.pokemon.length > 0;
            for (const p of route.pokemon) {
                const caught = this.game.gameState.pokedex[p.id] === 'caught';
                if (!caught) { allCaught = false; all6V = false; allShiny = false; break; }
                const storedData = this.game.getStoredData(p.id);
                const is6V = storedData && storedData.ivs &&
                    storedData.ivs.hp === 31 && storedData.ivs.atk === 31 &&
                    storedData.ivs.def === 31 && storedData.ivs.spAtk === 31 &&
                    storedData.ivs.spDef === 31 && storedData.ivs.speed === 31;
                if (!is6V) all6V = false;
                if (!this.game.gameState.shinyDex[p.id]) allShiny = false;
            }
            let routeBadges = '';
            if (all6V) routeBadges += ' <span class="route-badge-6v">6V</span>';
            if (allShiny) routeBadges += ' <span class="route-badge-shiny">✨</span>';

            card.innerHTML = `
                <h3>${route.name}${routeBadges} ${isActive ? '📍' : ''}</h3>
                <p>${route.description}</p>
                <div class="route-level-range">Lv.${route.levelRange[0]} ~ Lv.${route.levelRange[1]}</div>
                <div class="route-pokemon-preview">${pokemonPreview}</div>
            `;

            card.addEventListener('click', () => {
                this.game.changeRoute(route.id);
                this.showRoutes(regionId); // 刷新显示
                this.showToast(`📍 移动到了 ${route.name}`);
            });

            routeList.appendChild(card);
        });
    }

    // ===================== 图鉴界面 =====================
    renderPokedex() {
        const stats = this.game.getPokedexStats();
        const shinyCount = this.game.getShinyStats();
        
        // 根据地区筛选更新统计数据显示
        const caughtEl = document.getElementById('pokedex-caught');
        if (this.pokedexRegionFilter === 'all') {
            caughtEl.textContent = `已捕获: ${stats.caught}/${stats.total}`;
        } else {
            const regionStats = this.game.getPokedexStatsByRegion(this.pokedexRegionFilter);
            const regionNames = { kanto: '关都', johto: '城都', hoenn: '丰缘', sinnoh: '神奥', unova: '合众', kalos: '卡洛斯', alola: '阿罗拉', galar: '伽勒尔', paldea: '帕底亚', mega: 'Mega' };
            const regionName = regionNames[this.pokedexRegionFilter] || this.pokedexRegionFilter;
            caughtEl.textContent = `${regionName}地区已捕获: ${regionStats.caught}/${regionStats.total}`;
        }
        
        // 更新闪光按钮显示数量
        const shinyFilterBtn = document.querySelector('.filter-btn.shiny-filter');
        if (shinyFilterBtn) {
            shinyFilterBtn.textContent = `✨ 闪光${shinyCount > 0 ? ' (' + shinyCount + ')' : ''}`;
        }

        // 更新未闪光按钮显示数量
        const notShinyCount = stats.caught - shinyCount;
        const notShinyFilterBtn = document.querySelector('.filter-btn.not-shiny-filter');
        if (notShinyFilterBtn) {
            notShinyFilterBtn.textContent = `未闪光${notShinyCount > 0 ? ' (' + notShinyCount + ')' : ''}`;
        }

        const grid = document.getElementById('pokedex-grid');
        grid.innerHTML = '';

        let allIds = Object.keys(POKEMON_DATA).map(Number);

        // 地区筛选
        if (this.pokedexRegionFilter === 'kanto') {
            allIds = allIds.filter(id => id >= 1 && id <= 151);
        } else if (this.pokedexRegionFilter === 'johto') {
            allIds = allIds.filter(id => id >= 152 && id <= 251);
        } else if (this.pokedexRegionFilter === 'hoenn') {
            allIds = allIds.filter(id => id >= 252 && id <= 386);
        } else if (this.pokedexRegionFilter === 'sinnoh') {
            allIds = allIds.filter(id => id >= 387 && id <= 493);
        } else if (this.pokedexRegionFilter === 'unova') {
            allIds = allIds.filter(id => id >= 494 && id <= 649);
        } else if (this.pokedexRegionFilter === 'kalos') {
            allIds = allIds.filter(id => id >= 650 && id <= 721);
        } else if (this.pokedexRegionFilter === 'alola') {
            allIds = allIds.filter(id => id >= 722 && id <= 809);
        } else if (this.pokedexRegionFilter === 'galar') {
            allIds = allIds.filter(id => id >= 810 && id <= 905);
        } else if (this.pokedexRegionFilter === 'paldea') {
            allIds = allIds.filter(id => id >= 906 && id <= 1025);
        } else if (this.pokedexRegionFilter === 'mega') {
            allIds = allIds.filter(id => id >= 1026 && id <= 1073);
        }

        // 搜索过滤
        if (this.pokedexSearchQuery) {
            const query = this.pokedexSearchQuery.toLowerCase();
            allIds = allIds.filter(id => {
                const data = POKEMON_DATA[id];
                if (!data) return false;
                // 匹配名称或编号
                if (data.name && data.name.toLowerCase().includes(query)) return true;
                if (String(id).includes(query)) return true;
                return false;
            });
        }

        // 过滤
        if (this.pokedexFilter === 'caught') {
            allIds = allIds.filter(id => this.game.gameState.pokedex[id] === 'caught');
        } else if (this.pokedexFilter === 'uncaught') {
            allIds = allIds.filter(id => !this.game.gameState.pokedex[id] || this.game.gameState.pokedex[id] !== 'caught');
        } else if (this.pokedexFilter === 'shiny') {
            allIds = allIds.filter(id => this.game.gameState.shinyDex[id]);
        } else if (this.pokedexFilter === 'not_shiny') {
            allIds = allIds.filter(id => this.game.gameState.pokedex[id] === 'caught' && !this.game.gameState.shinyDex[id]);
        }

        // 预计算缓存（power/potential/level），排序和渲染时复用
        this._pokedexCache = {};
        if (this.pokedexSort && this.pokedexSort !== 'none' && (this.pokedexFilter === 'caught' || this.pokedexFilter === 'shiny' || this.pokedexFilter === 'not_shiny')) {
            // 只在需要排序时预计算
            for (const id of allIds) {
                const stored = this.game.getStoredData(id);
                this._pokedexCache[id] = {
                    power: this.game.calculatePower(id, true),
                    potential: this.game.calculatePotential(id),
                    level: stored ? stored.level : 1
                };
            }
            allIds.sort((a, b) => {
                let result = 0;
                const ca = this._pokedexCache[a];
                const cb = this._pokedexCache[b];
                if (this.pokedexSort === 'power') {
                    result = cb.power - ca.power;
                } else if (this.pokedexSort === 'potential') {
                    result = cb.potential - ca.potential;
                } else if (this.pokedexSort === 'level') {
                    result = cb.level - ca.level;
                }
                return this.pokedexSortDesc ? result : -result;
            });
        } else {
            allIds.sort((a, b) => a - b);
        }

        // 分页渲染
        this._pokedexAllIds = allIds;
        this._pokedexRendered = 0;
        const PAGE_SIZE = 200;
        this._pokedexPageSize = PAGE_SIZE;
        this._renderPokedexBatch(grid, PAGE_SIZE);
    }

    /**
     * 分批渲染图鉴条目
     */
    _renderPokedexBatch(grid, count) {
        const allIds = this._pokedexAllIds;
        const start = this._pokedexRendered;
        const end = Math.min(start + count, allIds.length);

        // 移除旧的「加载更多」按钮
        const oldLoadMore = grid.querySelector('.pokedex-load-more');
        if (oldLoadMore) oldLoadMore.remove();

        const skillUnlockedGlobal = this.game.isSkillUnlocked();
        const berryUnlockedGlobal = this.game.isBerryUnlocked();
        const teamArr = this.game.gameState.team;
        const teamFull = teamArr.length >= 6;
        const teamSet = new Set(teamArr);

        const fragment = document.createDocumentFragment();

        for (let i = start; i < end; i++) {
            const id = allIds[i];
            const data = POKEMON_DATA[id];
            const status = this.game.gameState.pokedex[id] || 'unseen';

            const entry = document.createElement('div');
            entry.className = `pokedex-entry ${status}`;
            entry.dataset.pokemonId = id;

            if (status === 'unseen') {
                entry.innerHTML = `
                    <div class="dex-header">
                        <div class="dex-sprite">?</div>
                        <div class="dex-header-info">
                            <div class="dex-number">#${String(id).padStart(3, '0')}</div>
                            <div class="dex-name">???</div>
                        </div>
                    </div>
                `;
            } else if (status === 'seen') {
                const typeBadges = (data.types || []).map(t =>
                    `<span class="type-badge ${t}">${TYPE_NAMES[t] || t}</span>`
                ).join(' ');

                entry.innerHTML = `
                    <div class="dex-header">
                        <div class="dex-sprite"><img src="${getPokemonSpriteUrl(id)}" alt="${data.name}" onerror="this.parentElement.textContent='?'"></div>
                        <div class="dex-header-info">
                            <div class="dex-number">#${String(id).padStart(3, '0')}</div>
                            <div class="dex-name">${data.name}</div>
                            ${typeBadges ? `<div class="dex-types">${typeBadges}</div>` : ''}
                        </div>
                    </div>
                `;
            } else {
                // caught - 显示完整详情
                const inTeam = teamSet.has(id);
                const hasShiny = this.game.gameState.shinyDex[id];
                const isShowingShiny = this.game.gameState.pokedexDisplay[id] === 'shiny';

                const typeBadges = (data.types || []).map(t =>
                    `<span class="type-badge ${t}">${TYPE_NAMES[t] || t}</span>`
                ).join(' ');

                // 获取该宝可梦的存储数据
                const storedData = this.game.getStoredData(id);
                
                // 使用图鉴展示偏好的精灵图
                const spriteUrl = this.game.getPokedexSpriteUrl(id);
                
                // 使用缓存的战力和潜力（若有），否则现算
                const cached = this._pokedexCache[id];
                const power = cached ? cached.power : this.game.calculatePower(id, true);
                const potential = cached ? cached.potential : this.game.calculatePotential(id);
                const potentialColor = potential >= 80 ? '#2ecc71' : potential >= 60 ? '#f39c12' : '#e74c3c';

                // 树果喂食信息（仅在树果系统解锁后显示）
                const berryHtml = (berryUnlockedGlobal && storedData) ? this._buildBerrySectionHtml(id) : '';

                // 技能等级（提前计算，在 detailHtml 模板中使用）
                const currentSkillLevel = storedData ? (storedData.skillLevel || 0) : 0;

                const detailHtml = storedData ? `
                    <div class="dex-detail">
                        <div class="dex-detail-header">
                            <span class="dex-level-badge">等级 ${storedData.level}</span>
                            ${currentSkillLevel > 0 ? `<span class="dex-skill-badge">⚡ 技能 ${currentSkillLevel >= MAX_SKILL_LEVEL ? 'Max' : 'Lv.' + currentSkillLevel}</span>` : ''}
                            ${inTeam ? `<span class="dex-in-team">在队伍中</span>` : '<span style="color:var(--text-secondary);font-size:12px">已捕获 · 不在队伍中</span>'}
                        </div>
                        <div class="dex-power-potential">
                            <div class="dex-power">
                                <span class="power-label">⚔️ 战力</span>
                                <span class="power-value">${power}</span>
                            </div>
                            <div class="dex-potential" title="基于个体值、种族值、成长效率计算">
                                <span class="potential-label">💎 潜力</span>
                                <span class="potential-value" style="color:${potentialColor}">${potential}%</span>
                            </div>
                        </div>
                        <div class="dex-stats-section">
                            ${(() => { const ebs = this.game.getEffectiveBaseStats(id); const ebsTotal = ebs.hp + ebs.atk + ebs.def + ebs.spAtk + ebs.spDef + ebs.speed; return `
                            <div class="dex-stats-title">种族值（总和：${ebsTotal}）</div>
                            <div class="dex-stats-grid">
                                <div class="dex-stat-item iv"><span>体力</span><span>${ebs.hp} <small style="opacity:0.6">(IV:${storedData.ivs.hp})</small></span></div>
                                <div class="dex-stat-item iv"><span>攻击</span><span>${ebs.atk} <small style="opacity:0.6">(IV:${storedData.ivs.atk})</small></span></div>
                                <div class="dex-stat-item iv"><span>防御</span><span>${ebs.def} <small style="opacity:0.6">(IV:${storedData.ivs.def})</small></span></div>
                                <div class="dex-stat-item iv"><span>特攻</span><span>${ebs.spAtk} <small style="opacity:0.6">(IV:${storedData.ivs.spAtk})</small></span></div>
                                <div class="dex-stat-item iv"><span>特防</span><span>${ebs.spDef} <small style="opacity:0.6">(IV:${storedData.ivs.spDef})</small></span></div>
                                <div class="dex-stat-item iv"><span>速度</span><span>${ebs.speed} <small style="opacity:0.6">(IV:${storedData.ivs.speed})</small></span></div>
                            </div>`; })()}
                        </div>
                        ${berryHtml}
                    </div>
                ` : '';

                // 按钮逻辑：在队伍中显示"离开队伍"，不在队伍中显示"加入队伍"
                let buttonHtml = '';
                if (inTeam) {
                    buttonHtml = `<button class="dex-remove-btn" data-pokemon-id="${id}">- 离开队伍</button>`;
                } else if (!teamFull) {
                    buttonHtml = `<button class="dex-add-btn" data-pokemon-id="${id}">+ 加入队伍</button>`;
                } else {
                    buttonHtml = `<span style="color:var(--text-secondary);font-size:12px;white-space:nowrap">队伍已满</span>`;
                }

                // 升级技能按钮（需要技能系统已解锁、等级>=1000、技能等级<8）
                let skillBtnHtml = '';
                if (skillUnlockedGlobal && storedData && storedData.level >= SKILL_LEVEL_REQUIREMENT && currentSkillLevel < MAX_SKILL_LEVEL) {
                    skillBtnHtml = `<button class="dex-skill-btn" data-pokemon-id="${id}" title="等级重置为1，技能等级+1">⚡ 升级技能</button>`;
                }

                entry.innerHTML = `
                    <div class="dex-header">
                        <div class="dex-sprite${isShowingShiny ? ' shiny' : ''}"><img src="${spriteUrl}" alt="${data.name}" onerror="this.parentElement.textContent='?'"></div>
                        <div class="dex-header-info">
                            <div class="dex-number">#${String(id).padStart(3, '0')}</div>
                            <div class="dex-name">${data.name}${hasShiny ? ' ✨' : ''}</div>
                            <div class="dex-types">${typeBadges}</div>
                        </div>
                        <div class="dex-header-actions">
                            ${hasShiny ? `<button class="shiny-toggle-btn${isShowingShiny ? ' active' : ''}" data-pokemon-id="${id}" title="${isShowingShiny ? '切换为原始' : '切换为闪光'}">✨</button>` : ''}
                            ${buttonHtml}
                            ${skillBtnHtml}
                        </div>
                    </div>
                    ${detailHtml}
                `;

                // 绑定按钮事件
                if (inTeam) {
                    const btn = entry.querySelector('.dex-remove-btn');
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.removeFromTeamByPokemonId(id);
                    });
                } else if (!teamFull) {
                    const btn = entry.querySelector('.dex-add-btn');
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.addToTeamFromPokedex(id);
                    });
                }

                // 绑定闪光切换按钮事件
                if (hasShiny) {
                    const shinyBtn = entry.querySelector('.shiny-toggle-btn');
                    if (shinyBtn) {
                        shinyBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.game.togglePokedexDisplay(id);
                            this.renderPokedex();
                        });
                    }
                }

                // 绑定升级技能按钮事件
                const skillBtn = entry.querySelector('.dex-skill-btn');
                if (skillBtn) {
                    skillBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const pokemonName = data.name;
                        const sl = storedData.skillLevel || 0;
                        this.showConfirmDialog(
                            '升级技能',
                            `确定要升级 ${pokemonName} 的技能吗？<br>当前技能等级：${sl} → ${sl + 1}<br>⚠️ 等级将重置为 1，超过1000级的经验会返还。`,
                            () => {
                                const result = this.game.upgradeSkill(id);
                                if (result.success) {
                                    this.showToast(`⚡ ${pokemonName} 技能升至 Lv.${result.newSkillLevel}！等级重置为 Lv.${result.newLevel}`);
                                    this.renderPokedex();
                                    this.renderTeam();
                                } else {
                                    this.showToast('⚠️ ' + result.message);
                                }
                            }
                        );
                    });
                }

                // 绑定树果喂食按钮事件
                const berryFeedBtn = entry.querySelector('.berry-feed-btn');
                if (berryFeedBtn) {
                    berryFeedBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const select = entry.querySelector('.berry-feed-select');
                        const berryId = select?.value;
                        if (!berryId) {
                            this.showToast('⚠️ 请选择要喂食的树果');
                            return;
                        }
                        const result = this.game.feedBerry(id, berryId);
                        if (result.success) {
                            this.showToast(`${BERRY_DATA[berryId].icon} 喂食成功！(${result.fed}/${result.max})`);
                            // 局部更新树果区域，保留下拉选择
                            this._refreshBerrySectionForEntry(entry, id, berryId);
                            // 刷新战力和潜力值显示
                            this._refreshPowerPotentialForEntry(entry, id);
                            // 刷新其他宝可梦条目的树果下拉框（库存已变化）
                            this._refreshOtherBerrySelects(id);
                        } else {
                            this.showToast('⚠️ ' + result.message);
                        }
                    });
                }
            }

            fragment.appendChild(entry);
        }

        this._pokedexRendered = end;

        // 批量追加到 DOM（减少回流）
        grid.appendChild(fragment);

        // 如果还有更多条目，显示「加载更多」按钮
        if (end < allIds.length) {
            const loadMoreDiv = document.createElement('div');
            loadMoreDiv.className = 'pokedex-load-more';
            loadMoreDiv.innerHTML = `<button class="load-more-btn">加载更多（还剩 ${allIds.length - end} 条）</button>`;
            loadMoreDiv.querySelector('button').addEventListener('click', () => {
                this._renderPokedexBatch(grid, this._pokedexPageSize);
            });
            grid.appendChild(loadMoreDiv);
        }
    }

    /**
     * 生成某宝可梦的树果区域HTML
     */
    _buildBerrySectionHtml(pokemonId) {
        const berryFed = this.game.gameState.berryFed[pokemonId] || {};
        const berryTotal = this.game.getBerryFedTotal(pokemonId);
        const bag = this.game.gameState.berryBag;
        const hasBerryInBag = Object.values(bag).some(c => c > 0);

        let berryItemsHtml = '';
        for (const berryId in BERRY_DATA) {
            const berry = BERRY_DATA[berryId];
            const fed = berryFed[berryId] || 0;
            const maxForType = this.game.getBerryMaxForType(pokemonId, berryId);
            berryItemsHtml += `<div class="berry-fed-item"><span>${berry.icon} ${this._getStatName(berry.stat)}</span><span class="berry-fed-count" style="color:${fed >= maxForType ? '#2ecc71' : 'var(--text-secondary)'}">${fed}/${maxForType}</span></div>`;
        }

        // 喂食下拉菜单（仅当背包有树果时显示）
        let feedHtml = '';
        if (hasBerryInBag) {
            let optionsHtml = '';
            for (const berryId in BERRY_DATA) {
                const berry = BERRY_DATA[berryId];
                const count = bag[berryId] || 0;
                const fed = berryFed[berryId] || 0;
                const maxForType = this.game.getBerryMaxForType(pokemonId, berryId);
                if (count > 0 && fed < maxForType) {
                    optionsHtml += `<option value="${berryId}">${berry.icon} ${berry.name} (库存:${count})</option>`;
                }
            }
            if (optionsHtml) {
                feedHtml = `
                    <div class="berry-feed-action">
                        <select class="berry-feed-select" data-pokemon-id="${pokemonId}">
                            <option value="">选择树果喂食...</option>
                            ${optionsHtml}
                        </select>
                        <button class="berry-feed-btn" data-pokemon-id="${pokemonId}">🍎 喂食</button>
                    </div>`;
            }
        }

        return `
            <div class="dex-berry-section">
                <div class="dex-stats-title">🌱 树果加成 (已喂${berryTotal}个)</div>
                <div class="dex-stats-grid berry-grid">${berryItemsHtml}</div>
                ${feedHtml}
            </div>`;
    }

    /**
     * 局部更新某个图鉴条目的树果区域，保留下拉选中值
     */
    _refreshBerrySectionForEntry(entry, pokemonId, selectedBerryId) {
        const oldSection = entry.querySelector('.dex-berry-section');
        if (!oldSection) return;

        // 生成新的树果区域HTML
        const newHtml = this._buildBerrySectionHtml(pokemonId);
        const temp = document.createElement('div');
        temp.innerHTML = newHtml;
        const newSection = temp.firstElementChild;

        // 替换旧的树果区域
        oldSection.replaceWith(newSection);

        // 恢复下拉框选中值（如果该选项仍存在）
        const newSelect = newSection.querySelector('.berry-feed-select');
        if (newSelect && selectedBerryId) {
            const option = newSelect.querySelector(`option[value="${selectedBerryId}"]`);
            if (option) {
                newSelect.value = selectedBerryId;
            }
        }

        // 重新绑定喂食按钮事件
        const newFeedBtn = newSection.querySelector('.berry-feed-btn');
        if (newFeedBtn) {
            newFeedBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const select = newSection.querySelector('.berry-feed-select');
                const berryId = select?.value;
                if (!berryId) {
                    this.showToast('⚠️ 请选择要喂食的树果');
                    return;
                }
                const result = this.game.feedBerry(pokemonId, berryId);
                if (result.success) {
                    this.showToast(`${BERRY_DATA[berryId].icon} 喂食成功！(${result.fed}/${result.max})`);
                    // 递归局部更新，继续保留选择
                    this._refreshBerrySectionForEntry(entry, pokemonId, berryId);
                    // 刷新战力和潜力值显示
                    this._refreshPowerPotentialForEntry(entry, pokemonId);
                    // 刷新其他宝可梦条目的树果下拉框（库存已变化）
                    this._refreshOtherBerrySelects(pokemonId);
                } else {
                    this.showToast('⚠️ ' + result.message);
                }
            });
        }
    }

    /**
     * 喂食后刷新其他宝可梦条目的树果下拉框（因为库存数量变了）
     */
    _refreshOtherBerrySelects(excludePokemonId) {
        const allEntries = document.querySelectorAll('.pokedex-entry');
        for (const otherEntry of allEntries) {
            const otherId = otherEntry.dataset.pokemonId;
            if (otherId === excludePokemonId) continue;
            const otherBerrySection = otherEntry.querySelector('.dex-berry-section');
            if (!otherBerrySection) continue;
            // 记住当前选中的树果
            const otherSelect = otherBerrySection.querySelector('.berry-feed-select');
            const otherSelectedBerry = otherSelect?.value || null;
            // 刷新该条目的树果区域
            this._refreshBerrySectionForEntry(otherEntry, otherId, otherSelectedBerry);
        }
    }

    /**
     * 局部更新某个图鉴条目的战力和潜力值显示
     */
    _refreshPowerPotentialForEntry(entry, pokemonId) {
        const power = this.game.calculatePower(pokemonId, true);
        const potential = this.game.calculatePotential(pokemonId);
        const potentialColor = potential >= 80 ? '#2ecc71' : potential >= 60 ? '#f39c12' : '#e74c3c';

        const powerEl = entry.querySelector('.power-value');
        if (powerEl) powerEl.textContent = power;

        const potentialEl = entry.querySelector('.potential-value');
        if (potentialEl) {
            potentialEl.textContent = `${potential}%`;
            potentialEl.style.color = potentialColor;
        }
    }

    // ===================== 树果界面 =====================
    renderBerryPage() {
        if (!this.game.isBerryUnlocked()) return;
        this.updateGoldDisplay();
        this._renderBerryBagSummary();
        this._renderBerryPlots();
        this._renderBerryBag();
        this._renderBerryPlantOptions();
        this._bindBerryEvents();
    }

    _renderBerryBagSummary() {
        const el = document.getElementById('berry-bag-summary');
        if (!el) return;
        const total = this.game.getBerryBagTotal();
        el.textContent = `🎒 背包树果: ${total}`;
    }

    _renderBerryPlots() {
        const grid = document.getElementById('berry-plots-grid');
        const countEl = document.getElementById('berry-plot-count');
        if (!grid) return;
        grid.innerHTML = '';
        const plots = this.game.gameState.berryPlots;
        if (countEl) countEl.textContent = `${plots.length}/${BERRY_PLOT_MAX}`;

        for (let i = 0; i < BERRY_PLOT_MAX; i++) {
            const plot = plots[i];
            const cell = document.createElement('div');
            cell.className = 'berry-plot';

            if (plot) {
                const berry = BERRY_DATA[plot.berryId];
                const ripe = this.game.isBerryRipe(i);
                const timeLeft = this.game.getBerryTimeLeft(i);
                cell.classList.add(ripe ? 'ripe' : 'growing');
                cell.dataset.plotIndex = i;

                if (ripe) {
                    cell.innerHTML = `
                        <div class="berry-plot-icon ripe">${berry.icon}</div>
                        <div class="berry-plot-name">${berry.name}</div>
                        <div class="berry-plot-status ready">✅ 可采摘</div>
                        <button class="berry-harvest-btn" data-plot-index="${i}">采摘</button>
                    `;
                } else {
                    const h = Math.floor(timeLeft / 3600000);
                    const m = Math.floor((timeLeft % 3600000) / 60000);
                    const s = Math.floor((timeLeft % 60000) / 1000);
                    cell.innerHTML = `
                        <div class="berry-plot-icon growing">${berry.icon}</div>
                        <div class="berry-plot-name">${berry.name}</div>
                        <div class="berry-plot-status growing">🌱 生长中</div>
                        <div class="berry-plot-timer">${h}时${m}分${s}秒</div>
                    `;
                }
            } else {
                cell.classList.add('empty');
                cell.innerHTML = `
                    <div class="berry-plot-icon empty">🟫</div>
                    <div class="berry-plot-name">空地</div>
                `;
            }
            grid.appendChild(cell);
        }
    }

    _renderBerryBag() {
        const grid = document.getElementById('berry-bag-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const bag = this.game.gameState.berryBag;
        let hasAny = false;
        for (const berryId in BERRY_DATA) {
            const berry = BERRY_DATA[berryId];
            const count = bag[berryId] || 0;
            if (count > 0) hasAny = true;
            const item = document.createElement('div');
            item.className = `berry-bag-item${count > 0 ? '' : ' empty'}`;
            item.innerHTML = `
                <span class="berry-bag-icon">${berry.icon}</span>
                <span class="berry-bag-name">${berry.name}</span>
                <span class="berry-bag-count">${count}</span>
            `;
            grid.appendChild(item);
        }
        if (!hasAny) {
            grid.innerHTML = '<div class="berry-bag-empty">背包为空，种植树果后采摘获得</div>';
        }
    }

    _renderBerryPlantOptions() {
        const grid = document.getElementById('berry-plant-grid');
        if (!grid) return;
        grid.innerHTML = '';
        const plotsFull = this.game.gameState.berryPlots.length >= BERRY_PLOT_MAX;
        const gold = this.game.gameState.gold;
        const canAfford = gold >= BERRY_SEED_PRICE;

        for (const berryId in BERRY_DATA) {
            const berry = BERRY_DATA[berryId];
            const canPlant = canAfford && !plotsFull;
            const card = document.createElement('div');
            card.className = `berry-plant-card${canPlant ? '' : ' disabled'}`;
            card.innerHTML = `
                <div class="berry-plant-icon" style="background:${berry.color}20;border-color:${berry.color}">${berry.icon}</div>
                <div class="berry-plant-info">
                    <div class="berry-plant-name">${berry.name}种子</div>
                    <div class="berry-plant-effect">提升${this._getStatName(berry.stat)} +${BERRY_STAT_BONUS}/个 (上限${BERRY_STAT_CAP})</div>
                    <div class="berry-plant-stock">💰 ${BERRY_SEED_PRICE.toLocaleString()} 金币</div>
                </div>
                ${canPlant ? `<button class="berry-plant-btn" data-berry-id="${berryId}">购买种植</button>` : `<span class="berry-plant-disabled">${plotsFull ? '空地已满' : '金币不足'}</span>`}
            `;
            grid.appendChild(card);
        }
    }

    _getStatName(stat) {
        const names = { hp: '体力', atk: '攻击', def: '防御', spAtk: '特攻', spDef: '特防', speed: '速度' };
        return names[stat] || stat;
    }

    // 仅绑定田地格子里动态生成的采摘按钮（定时器每秒调用，不影响静态按钮）
    _bindBerryPlotEvents() {
        document.querySelectorAll('.berry-harvest-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(newBtn.dataset.plotIndex);
                const result = this.game.harvestBerry(index);
                if (result.success) {
                    this.showToast(`🧺 采摘了 ${result.count} 个${result.berryName}！`);
                    this.renderBerryPage();
                } else {
                    this.showToast('⚠️ ' + result.message);
                }
            });
        });
    }

    // 完整绑定所有树果事件（仅在 renderBerryPage 时调用）
    _bindBerryEvents() {
        // 田地采摘按钮
        this._bindBerryPlotEvents();

        // 一键采摘
        const harvestAllBtn = document.getElementById('btn-harvest-all');
        if (harvestAllBtn) {
            const newBtn = harvestAllBtn.cloneNode(true);
            harvestAllBtn.parentNode.replaceChild(newBtn, harvestAllBtn);
            newBtn.addEventListener('click', () => {
                const result = this.game.harvestAllBerries();
                if (result.success) {
                    const totalCount = result.results.reduce((s, r) => s + r.count, 0);
                    this.showToast(`🧺 一键采摘了 ${totalCount} 个树果！`);
                    this.renderBerryPage();
                } else {
                    this.showToast('⚠️ ' + result.message);
                }
            });
        }

        // 种植按钮（cloneNode 移除旧监听器，防止重复绑定）
        document.querySelectorAll('.berry-plant-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const berryId = newBtn.dataset.berryId;
                const result = this.game.plantBerry(berryId);
                if (result.success) {
                    this.showToast(`🌱 已种植${BERRY_DATA[berryId].name}！`);
                    this.renderBerryPage();
                } else {
                    this.showToast('⚠️ ' + result.message);
                }
            });
        });
    }

    // 树果定时器刷新（每秒更新倒计时）
    startBerryTimer() {
        if (this._berryTimer) clearInterval(this._berryTimer);
        this._berryTimer = setInterval(() => {
            if (this.currentTab === 'tab-berry' && this.game.isBerryUnlocked()) {
                this._renderBerryPlots();
                this._bindBerryPlotEvents(); // 仅重绑田地里动态生成的采摘按钮
            }
        }, 1000);
    }

    // 首次解锁树果系统时免费种植每种树果各1个
    _initBerrySystem() {
        const bag = this.game.gameState.berryBag;
        const hasAny = Object.values(bag).some(c => c > 0);
        const hasPlots = this.game.gameState.berryPlots.length > 0;
        const hasFed = Object.keys(this.game.gameState.berryFed).length > 0;
        if (hasAny || hasPlots || hasFed) return; // 已经用过树果系统，不再赠送
        // 免费种植每种树果各1个
        for (const berryId in BERRY_DATA) {
            this.game.plantBerryFree(berryId);
        }
        this.game.save();
    }

    // ===================== 设置界面 =====================
    renderSettings() {
        const stats = this.game.gameState.stats;
        const dexStats = this.game.getPokedexStats();
        const kantoStats = this.game.getPokedexStatsByRegion('kanto');
        const johtoStats = this.game.getPokedexStatsByRegion('johto');
        const hoennStats = this.game.getPokedexStatsByRegion('hoenn');
        const sinnohStats = this.game.getPokedexStatsByRegion('sinnoh');
        const unovaStats = this.game.getPokedexStatsByRegion('unova');
        const kalosStats = this.game.getPokedexStatsByRegion('kalos');
        const alolaStats = this.game.getPokedexStatsByRegion('alola');
        const galarStats = this.game.getPokedexStatsByRegion('galar');
        const paldeaStats = this.game.getPokedexStatsByRegion('paldea');

        document.getElementById('game-stats').innerHTML = `
            <div class="game-stat-row"><span>总战斗次数</span><span>${stats.totalBattles}</span></div>
            <div class="game-stat-row"><span>总获得经验</span><span>${stats.totalExp.toLocaleString()}</span></div>
            ${this.game.isGoldUnlocked() ? `<div class="game-stat-row"><span>🪙 当前金币</span><span>${(this.game.gameState.gold || 0).toLocaleString()}</span></div>
            <div class="game-stat-row"><span>🪙 累计金币</span><span>${(stats.totalGold || 0).toLocaleString()}</span></div>` : ''}
            <div class="game-stat-row"><span>图鉴完成度</span><span>${dexStats.caught}/${dexStats.total}</span></div>
            <div class="game-stat-row" style="padding-left:16px;font-size:12px"><span>├ 关都地区</span><span>${kantoStats.caught}/${kantoStats.total}</span></div>
            <div class="game-stat-row" style="padding-left:16px;font-size:12px"><span>├ 城都地区</span><span>${johtoStats.caught}/${johtoStats.total}${!this.game.isRegionUnlocked('johto') ? ' 🔒' : ''}</span></div>
            <div class="game-stat-row" style="padding-left:16px;font-size:12px"><span>├ 丰缘地区</span><span>${hoennStats.caught}/${hoennStats.total}${!this.game.isRegionUnlocked('hoenn') ? ' 🔒' : ''}</span></div>
            <div class="game-stat-row" style="padding-left:16px;font-size:12px"><span>├ 神奥地区</span><span>${sinnohStats.caught}/${sinnohStats.total}${!this.game.isRegionUnlocked('sinnoh') ? ' 🔒' : ''}</span></div>
            <div class="game-stat-row" style="padding-left:16px;font-size:12px"><span>├ 合众地区</span><span>${unovaStats.caught}/${unovaStats.total}${!this.game.isRegionUnlocked('unova') ? ' 🔒' : ''}</span></div>
            <div class="game-stat-row" style="padding-left:16px;font-size:12px"><span>├ 卡洛斯地区</span><span>${kalosStats.caught}/${kalosStats.total}${!this.game.isRegionUnlocked('kalos') ? ' 🔒' : ''}</span></div>
            <div class="game-stat-row" style="padding-left:16px;font-size:12px"><span>├ 阿罗拉地区</span><span>${alolaStats.caught}/${alolaStats.total}${!this.game.isRegionUnlocked('alola') ? ' 🔒' : ''}</span></div>
            <div class="game-stat-row" style="padding-left:16px;font-size:12px"><span>├ 伽勒尔地区</span><span>${galarStats.caught}/${galarStats.total}${!this.game.isRegionUnlocked('galar') ? ' 🔒' : ''}</span></div>
            <div class="game-stat-row" style="padding-left:16px;font-size:12px"><span>└ 帕底亚地区</span><span>${paldeaStats.caught}/${paldeaStats.total}${!this.game.isRegionUnlocked('paldea') ? ' 🔒' : ''}</span></div>
            <div class="game-stat-row"><span>✨ 闪光图鉴</span><span>${this.game.getShinyStats()}</span></div>
            ${this._renderBattleStatSources()}
        `;

        // 更新主题按钮选中态
        const currentTheme = this.game.gameState.settings?.theme || 'midnight';
        document.querySelectorAll('.theme-color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === currentTheme);
        });

        // 同步自动更换最优宝可梦设置的复选框状态
        const autoSwitchCheckbox = document.getElementById('setting-auto-switch');
        if (autoSwitchCheckbox) {
            autoSwitchCheckbox.checked = !!this.game.gameState.settings?.autoSwitchBest;
        }
        // 同步一击必杀策略
        this._syncOneShotStrategyVisibility();
        const savedStrategy = this.game.gameState.settings?.oneShotStrategy || 'fastest';
        const radios = document.querySelectorAll('input[name="oneshot-strategy"]');
        radios.forEach(r => { r.checked = r.value === savedStrategy; });

        // 同步地图切换条件
        this._syncRouteSwitchConditionVisibility();
        const savedCondition = this.game.gameState.settings?.routeSwitchCondition || '6v_shiny';
        const condRadios = document.querySelectorAll('input[name="route-switch-condition"]');
        condRadios.forEach(r => { r.checked = r.value === savedCondition; });

        // 同步一键升级技能按钮可见性
        this._syncUpgradeAllSkillsBtnVisibility();
    }

    // 渲染出战宝可梦属性来源分析（调用独立的 getStatSources，不影响高频战斗计算）
    _renderBattleStatSources() {
        const data = this.game.getStatSources();
        if (!data) return '';

        const { pokemonName, level, battleStats, self: selfStat, team, pokedex, gem, talent } = data;
        const src = { self: selfStat, team, pokedex, gem, talent };

        const stats = ['hp', 'attack', 'defense', 'speed'];
        const statNames = { hp: '❤️ 生命值', attack: '⚔️ 攻击力', defense: '🛡️ 防御力', speed: '💨 速度' };
        const sourceNames = { self: '自身属性', team: '队友加成', pokedex: '图鉴加成', gem: '宝石加成', talent: '天赋加成' };
        const sourceIcons = { self: '🐾', team: '👥', pokedex: '📖', gem: '💎', talent: '🌟' };
        const sourceColors = { self: '#e94560', team: '#2ecc71', pokedex: '#3498db', gem: '#f39c12', talent: '#9b59b6' };

        let html = `<div class="stat-sources-section">
            <div class="stat-sources-title">📊 出战宝可梦属性来源 — ${pokemonName} Lv.${level}</div>`;

        for (const stat of stats) {
            const total = battleStats[stat];
            if (total <= 0) continue;

            const sources = [
                { key: 'self', value: src.self[stat] },
                { key: 'team', value: src.team[stat] },
                { key: 'pokedex', value: src.pokedex[stat] },
                { key: 'gem', value: src.gem[stat] },
                { key: 'talent', value: src.talent[stat] },
            ].filter(s => s.value > 0);

            html += `<div class="stat-source-row">
                <div class="stat-source-label">${statNames[stat]} <span class="stat-source-total">${total.toLocaleString()}</span></div>
                <div class="stat-source-bar-container">`;

            for (const s of sources) {
                const pct = (s.value / total * 100).toFixed(1);
                html += `<div class="stat-source-bar-segment" style="width:${pct}%;background:${sourceColors[s.key]}" title="${sourceNames[s.key]}: ${s.value.toLocaleString()} (${pct}%)"></div>`;
            }

            html += `</div><div class="stat-source-details">`;

            for (const s of sources) {
                const pct = (s.value / total * 100).toFixed(1);
                html += `<span class="stat-source-detail-item">
                    <span class="stat-source-dot" style="background:${sourceColors[s.key]}"></span>
                    ${sourceIcons[s.key]} ${sourceNames[s.key]}: ${s.value.toLocaleString()} (${pct}%)
                </span>`;
            }

            html += `</div></div>`;
        }

        // 总属性汇总
        const totalAll = battleStats.hp + battleStats.attack + battleStats.defense + battleStats.speed;
        const summaryItems = [
            { key: 'self', value: src.self.hp + src.self.attack + src.self.defense + src.self.speed },
            { key: 'team', value: src.team.hp + src.team.attack + src.team.defense + src.team.speed },
            { key: 'pokedex', value: src.pokedex.hp + src.pokedex.attack + src.pokedex.defense + src.pokedex.speed },
            { key: 'gem', value: src.gem.hp + src.gem.attack + src.gem.defense + src.gem.speed },
            { key: 'talent', value: src.talent.hp + src.talent.attack + src.talent.defense + src.talent.speed },
        ].filter(s => s.value > 0);

        html += `<div class="stat-source-row stat-source-summary">
            <div class="stat-source-label">📋 属性总计 <span class="stat-source-total">${totalAll.toLocaleString()}</span></div>
            <div class="stat-source-bar-container">`;

        for (const s of summaryItems) {
            const pct = (s.value / totalAll * 100).toFixed(1);
            html += `<div class="stat-source-bar-segment" style="width:${pct}%;background:${sourceColors[s.key]}" title="${sourceNames[s.key]}: ${s.value.toLocaleString()} (${pct}%)"></div>`;
        }

        html += `</div><div class="stat-source-details">`;

        for (const s of summaryItems) {
            const pct = (s.value / totalAll * 100).toFixed(1);
            html += `<span class="stat-source-detail-item">
                <span class="stat-source-dot" style="background:${sourceColors[s.key]}"></span>
                ${sourceIcons[s.key]} ${sourceNames[s.key]}: ${s.value.toLocaleString()} (${pct}%)
            </span>`;
        }

        html += `</div></div></div>`;
        return html;
    }

    // 初始化主题（页面加载时恢复保存的主题）
    _initTheme() {
        const savedTheme = this.game.gameState.settings?.theme || 'midnight';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // ===================== 离线模拟进度 =====================
    _formatOfflineTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0) return `${hours}小时${minutes}分${seconds}秒`;
        if (minutes > 0) return `${minutes}分${seconds}秒`;
        return `${seconds}秒`;
    }

    _showOfflineOverlay(totalMs) {
        const overlay = this._offlineOverlay;
        if (!overlay) return;
        // 显示离线时间
        const timeText = document.getElementById('offline-time-text');
        if (timeText) timeText.textContent = `离线时间：${this._formatOfflineTime(totalMs)}`;
        // 重置进度
        const bar = document.getElementById('offline-progress-bar');
        if (bar) bar.style.width = '0%';
        const percentText = document.getElementById('offline-percent-text');
        if (percentText) percentText.textContent = '0%';
        const battlesText = document.getElementById('offline-battles-text');
        if (battlesText) battlesText.textContent = '已完成 0 场战斗';
        // 显示遮罩
        overlay.classList.remove('hidden');
    }

    _updateOfflineProgress(_progress, battles, percent) {
        const bar = document.getElementById('offline-progress-bar');
        if (bar) bar.style.width = `${percent}%`;
        const percentText = document.getElementById('offline-percent-text');
        if (percentText) percentText.textContent = `${percent}%`;
        const battlesText = document.getElementById('offline-battles-text');
        if (battlesText) battlesText.textContent = `已完成 ${battles.toLocaleString()} 场战斗`;
    }

    _hideOfflineOverlay(battles, totalMs) {
        const overlay = this._offlineOverlay;
        if (!overlay) return;
        // 先把进度填满
        const bar = document.getElementById('offline-progress-bar');
        if (bar) bar.style.width = '100%';
        const percentText = document.getElementById('offline-percent-text');
        if (percentText) percentText.textContent = '100%';
        const battlesText = document.getElementById('offline-battles-text');
        if (battlesText) battlesText.textContent = `完成 ${battles.toLocaleString()} 场战斗`;

        // 延迟一下再隐藏，让用户看到100%
        setTimeout(() => {
            overlay.classList.add('hidden');
            // 显示结算通知
            if (battles > 0) {
                this.addBattleLog(`⚡ 离线 ${this._formatOfflineTime(totalMs)} 完成了 ${battles.toLocaleString()} 场战斗！`, 'evolution');
                this.showToast(`⚡ 离线结算: 完成了 ${battles.toLocaleString()} 场战斗！`);
            }
            this.renderTeam();
        }, 600);
    }

    // ===================== 通知 =====================
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2200);
    }

    showCatchNotification(pokemon) {
        // 构建捕获信息
        let message = `捕获了 ${pokemon.name}`;
        
        if (pokemon.isFirstCatch) {
            message += ` (首次捕获！)`;
        } else if (pokemon.updatedStats && pokemon.updatedStats.length > 0) {
            const statNames = {
                hp: '体力', atk: '攻击', def: '防御', 
                spAtk: '特攻', spDef: '特防', speed: '速度'
            };
            const updates = pokemon.updatedStats.map(s => `${statNames[s.stat]} ${s.old}→${s.new}`).join(', ');
            message += ` (个体值更新: ${updates})`;
        } else if (pokemon.levelUp) {
            message += ` (等级提升至 Lv.${pokemon.level})`;
        }
        
        this.addBattleLog(message, 'catch');

        // 刷新队伍
        this.renderTeam();
    }

    showLevelUpNotification(pokemon) {
        // 改为显示在战斗日志中，连续升级合并为一条
        if (pokemon.startLevel && pokemon.level - pokemon.startLevel > 1) {
            this.addBattleLog(`${pokemon.name} Lv.${pokemon.startLevel} → Lv.${pokemon.level}！`, 'levelup');
        } else {
            this.addBattleLog(`${pokemon.name} 升到了 Lv.${pokemon.level}！`, 'levelup');
        }
    }

    showEvolutionNotification(data) {
        // 改为显示在战斗日志中
        this.addBattleLog(`🌟 ${data.oldName} 进化成了 ${data.newName}！等级重置为 Lv.1`, 'evolution');
    }

    showConfirmDialog(title, message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal">
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="modal-buttons">
                    <button class="cancel-btn">取消</button>
                    <button class="confirm-btn">确认</button>
                </div>
            </div>
        `;

        overlay.querySelector('.cancel-btn').addEventListener('click', () => overlay.remove());
        overlay.querySelector('.confirm-btn').addEventListener('click', () => {
            overlay.remove();
            onConfirm();
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        document.body.appendChild(overlay);
    }

    showTutorialDialog(onClose) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay tutorial-overlay';
        overlay.innerHTML = `
            <div class="modal tutorial-modal">
                <div class="tutorial-icon">🎉</div>
                <h3>欢迎来到宝可梦世界！</h3>
                <div class="tutorial-body">
                    <div class="tutorial-item">
                        <span class="tutorial-emoji">🎯</span>
                        <span>你的目标是<strong>收集全部宝可梦</strong>，成为最强训练家！</span>
                    </div>
                    <div class="tutorial-item">
                        <span class="tutorial-emoji">⚔️</span>
                        <span>击败野生宝可梦后会<strong>自动捕获</strong>，无需手动操作。</span>
                    </div>
                    <div class="tutorial-item">
                        <span class="tutorial-emoji">📖</span>
                        <span>在<strong>图鉴</strong>中可以将已捕获的宝可梦编入队伍上阵战斗。</span>
                    </div>
                    <div class="tutorial-item">
                        <span class="tutorial-emoji">💪</span>
                        <span>未上阵的宝可梦也会以一定比例为队伍提供<strong>属性加成</strong>，捕获越多越强！</span>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="confirm-btn tutorial-start-btn">开始冒险！</button>
                </div>
            </div>
        `;

        overlay.querySelector('.tutorial-start-btn').addEventListener('click', () => {
            overlay.classList.add('tutorial-closing');
            setTimeout(() => {
                overlay.remove();
                if (onClose) onClose();
            }, 300);
        });

        document.body.appendChild(overlay);
    }

    showGameplayHelpDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal gameplay-modal">
                <h3>📘 游戏玩法说明</h3>
                <div class="gameplay-modal-body">
                    <p>核心目标：不断捕获、培养并集齐图鉴，解锁更多地区与系统。</p>

                    <div class="help-group">
                        <h4>📖 名词解释</h4>
                        <ul>
                            <li><strong>战力</strong>：当前属性综合强度，按（生命+攻击×技能威力系数+防御+速度）/10 计算。技能等级越高，攻击力在战力中的权重越大。</li>
                            <li><strong>潜力</strong>：养成上限评估分，综合经验组与成长属性评分。</li>
                            <li><strong>个体值（IV）</strong>：每只宝可梦的隐藏属性（0~31），影响最终属性。</li>
                            <li><strong>图鉴</strong>：记录见过/捕获状态；地区解锁与徽章获取都依赖图鉴进度。</li>
                            <li><strong>徽章与宝石</strong>：地区徽章提供功能与加成，宝石可进一步强化战斗词条。</li>
                        </ul>
                    </div>

                    <div class="help-group">
                        <h4>⚔️ 战斗属性来源</h4>
                        <ul>
                            <li><strong>基础面板</strong>：由种族值、等级、个体值共同决定。</li>
                            <li><strong>队伍加成</strong>：队伍其他成员按比例提供属性支援。</li>
                            <li><strong>图鉴加成</strong>：已捕获且不在队伍中的宝可梦也会提供小比例加成。</li>
                            <li><strong>宝石/徽章词条</strong>：会心、闪避、伤害修正、胜利回复等额外效果。</li>
                            <li><strong>属性克制</strong>：攻击与防御属性关系会改变最终伤害。</li>
                        </ul>
                    </div>

                    <div class="help-group">
                        <h4>📈 经验分配规则</h4>
                        <ul>
                            <li><strong>出战宝可梦</strong>：获得100%经验。</li>
                            <li><strong>同队其他宝可梦</strong>：每只获得50%经验。</li>
                            <li><strong>图鉴中已捕获且不在队伍的宝可梦</strong>：每只获得1%经验（向上取整）。</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="cancel-btn gameplay-close-btn">我知道了</button>
                </div>
            </div>
        `;

        const close = () => overlay.remove();
        overlay.querySelector('.gameplay-close-btn').addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document.body.appendChild(overlay);
    }


    // ===================== 徽章页面 =====================
    updateBadgeTabVisibility() {
        const badgeTabBtn = document.querySelector('.badge-tab-btn');
        if (badgeTabBtn) {
            const unlocked = this.game.isRegionCompleted('kanto') || this.game.hasBadge('kanto');
            // 移除旧锁图标
            const oldLock = badgeTabBtn.querySelector('.lock-icon');
            if (oldLock) oldLock.remove();
            if (unlocked) {
                badgeTabBtn.classList.remove('locked');
            } else {
                badgeTabBtn.classList.add('locked');
                const lockSpan = document.createElement('span');
                lockSpan.className = 'lock-icon';
                lockSpan.textContent = '🔒';
                badgeTabBtn.appendChild(lockSpan);
            }
        }
    }

    updateBerryTabVisibility() {
        const berryTabBtn = document.querySelector('.berry-tab-btn');
        if (berryTabBtn) {
            const unlocked = this.game.isBerryUnlocked();
            const oldLock = berryTabBtn.querySelector('.lock-icon');
            if (oldLock) oldLock.remove();
            if (unlocked) {
                berryTabBtn.classList.remove('locked');
            } else {
                berryTabBtn.classList.add('locked');
                const lockSpan = document.createElement('span');
                lockSpan.className = 'lock-icon';
                lockSpan.textContent = '🔒';
                berryTabBtn.appendChild(lockSpan);
            }
        }
    }

    updateSkillTabVisibility() {
        const skillTabBtn = document.querySelector('.skill-tab-btn');
        if (skillTabBtn) {
            const unlocked = this.game.isSkillUnlocked();
            const oldLock = skillTabBtn.querySelector('.lock-icon');
            if (oldLock) oldLock.remove();
            if (unlocked) {
                skillTabBtn.classList.remove('locked');
            } else {
                skillTabBtn.classList.add('locked');
                const lockSpan = document.createElement('span');
                lockSpan.className = 'lock-icon';
                lockSpan.textContent = '🔒';
                skillTabBtn.appendChild(lockSpan);
            }
        }
    }

    // ===================== 技能页面 =====================
    renderSkillPage() {
        if (!this.game.isSkillUnlocked()) return;

        // 渲染规则说明
        const rulesEl = document.getElementById('skill-rules-content');
        if (rulesEl) {
            rulesEl.innerHTML = `
                <div class="skill-rules-list">
                    <div class="skill-rule-item">📌 每只宝可梦有独立的<strong>技能等级</strong>（0~${MAX_SKILL_LEVEL}级），默认0级。</div>
                    <div class="skill-rule-item">📌 当宝可梦等级 ≥ <strong>${SKILL_LEVEL_REQUIREMENT}</strong> 级时，可在图鉴中点击「升级技能」按钮。</div>
                    <div class="skill-rule-item">📌 升级后：等级<strong>重置为1</strong>，技能等级+1。超过${SKILL_LEVEL_REQUIREMENT}级的经验会返还。</div>
                    <div class="skill-rule-item">📌 技能等级 > 0 时，战斗攻击将使用该宝可梦对应属性的<strong>技能威力</strong>（替代默认50威力）。</div>
                    <div class="skill-rule-item">📌 双属性宝可梦会自动选择对敌方<strong>克制效果更好</strong>的属性技能进行攻击。</div>
                    <div class="skill-rule-item">💡 前往<strong>图鉴</strong>页面，对≥${SKILL_LEVEL_REQUIREMENT}级的宝可梦使用「升级技能」按钮提升实力！</div>
                </div>
            `;
        }

        // 渲染技能表格
        const tableEl = document.getElementById('skill-table-content');
        if (tableEl) {
            let html = '';
            for (const type in SKILL_DATA) {
                const typeName = TYPE_NAMES[type] || type;
                const skills = SKILL_DATA[type];
                html += `
                    <div class="skill-type-group">
                        <div class="skill-type-header">
                            <span class="type-badge ${type}">${typeName}</span>
                        </div>
                        <div class="skill-type-table">
                            ${skills.map(s => `
                                <div class="skill-row">
                                    <span class="skill-level-tag">Lv.${s.level}</span>
                                    <span class="skill-name">${s.name}</span>
                                    <span class="skill-power">威力 ${s.power}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            tableEl.innerHTML = html;
        }
    }

    // ===================== 天赋页面 =====================
    updateTalentTabVisibility() {
        const talentTabBtn = document.querySelector('.talent-tab-btn');
        if (talentTabBtn) {
            const unlocked = this.game.isTalentUnlocked();
            const oldLock = talentTabBtn.querySelector('.lock-icon');
            if (oldLock) oldLock.remove();
            if (unlocked) {
                talentTabBtn.classList.remove('locked');
            } else {
                talentTabBtn.classList.add('locked');
                const lockSpan = document.createElement('span');
                lockSpan.className = 'lock-icon';
                lockSpan.textContent = '🔒';
                talentTabBtn.appendChild(lockSpan);
            }
        }
    }

    renderTalentPage() {
        if (!this.game.isTalentUnlocked()) return;

        const totalPoints = this.game.getTotalTalentPoints();
        const usedPoints = this.game.getUsedTalentPoints();
        const remainingPoints = totalPoints - usedPoints;
        const totalLevel = this.game.getTotalPokemonLevel();
        const nextPointLevel = (totalPoints + 1) * 10000; // 下一个天赋点所需总等级

        // 渲染天赋点数显示
        const pointsDisplay = document.getElementById('talent-points-display');
        if (pointsDisplay) {
            pointsDisplay.innerHTML = `
                <span>🌟 天赋点：</span>
                <span class="talent-points-remaining">${remainingPoints}</span>
                <span class="talent-points-total">/ ${totalPoints} (已用 ${usedPoints})</span>
                <span class="talent-level-info">｜📊 总等级 ${totalLevel.toLocaleString()} / ${nextPointLevel.toLocaleString()} (下一点)</span>
            `;
        }

        // 渲染天赋规则
        const rulesEl = document.getElementById('talent-rules-content');
        if (rulesEl) {
            rulesEl.innerHTML = `
                <div class="talent-rules-list">
                    <div class="talent-rule-item">📌 天赋点总数 = 全部宝可梦等级之和 ÷ <strong>10000</strong>（向下取整）</div>
                    <div class="talent-rule-item">📌 每次升级天赋消耗 <strong>1</strong> 个天赋点</div>
                    <div class="talent-rule-item">📌 按住 <strong>Shift</strong> 点击升级可一次升 <strong>10</strong> 级</div>
                    <div class="talent-rule-item">📌 按住 <strong>Ctrl</strong> 点击升级可一次升满</div>
                    <div class="talent-rule-item">📌 重置天赋需要花费 <strong>100万</strong> 金币，归还所有已用天赋点</div>
                    <div class="talent-rule-item">💡 宝可梦等级越高，可用天赋点越多！持续战斗提升等级来获取更多天赋点</div>
                </div>
            `;
        }

        // 重置按钮事件
        const resetBtn = document.getElementById('btn-reset-talents');
        if (resetBtn) {
            // 移除旧的事件监听
            const newResetBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            newResetBtn.addEventListener('click', () => {
                if (usedPoints === 0) {
                    this.showToast('当前没有已分配的天赋点');
                    return;
                }
                if (confirm(`确定要重置所有天赋吗？\n将花费 1,000,000 金币\n当前金币: ${this.game.gameState.gold.toLocaleString()}`)) {
                    const result = this.game.resetTalents();
                    if (result.success) {
                        this.showToast('🔄 天赋已重置！');
                        this.renderTalentPage();
                    } else {
                        this.showToast(result.message);
                    }
                }
            });
        }

        // 渲染天赋列表
        const listEl = document.getElementById('talent-list');
        if (listEl) {
            let html = '';
            for (const talentId in TALENT_DATA) {
                const talent = TALENT_DATA[talentId];
                const level = this.game.getTalentLevel(talentId);
                const effectValue = this.game.getTalentValue(talentId);
                const isMaxed = level >= talent.maxLevel;
                const category = TALENT_CATEGORIES[talent.category] || { name: '其他', icon: '📋' };
                const progressPercent = (level / talent.maxLevel * 100).toFixed(1);

                // 特殊效果文本
                let effectText = '';
                if (talentId === 'skill_stat_bonus') {
                    const skillSum = this.game.getSkillLevelSum();
                    const actualBonus = this.game.getTalentStatBonusPercent();
                    effectText = `技能等级之和(${skillSum}) × ${effectValue.toFixed(2)}% = <span class="effect-value">+${actualBonus.toFixed(2)}%</span> 全属性`;
                } else if (talentId === 'gem_attr_boost') {
                    const choice = this.game.getTalentGemAttrChoice();
                    const choiceName = choice ? (GEM_ATTRIBUTES.find(a => a.id === choice)?.name || '未选择') : '未选择';
                    effectText = `当前选择: <span class="effect-value">${choiceName}</span>，概率 <span class="effect-value">+${effectValue}%</span>`;
                } else if (talentId === 'team_exp_bonus') {
                    const tLevel = this.game.getTalentLevel('team_exp_bonus');
                    // 展示几个代表等级的提升示例
                    const exampleLow = this.game.getMonsterLevelBoost(1);
                    const exampleMid = this.game.getMonsterLevelBoost(5000);
                    const exampleHigh = this.game.getMonsterLevelBoost(17000);
                    effectText = `Lv.${tLevel}: Lv.1→<span class="effect-value">${exampleLow}</span>，Lv.5000→<span class="effect-value">${exampleMid}</span>，Lv.17000→<span class="effect-value">${exampleHigh}</span>`;
                } else {
                    effectText = `当前效果: <span class="effect-value">${talentId === 'berry_time_reduce' ? '-' : '+'}${effectValue}${talent.unit}</span>`;
                }

                html += `
                    <div class="talent-card" data-talent-id="${talentId}">
                        <div class="talent-card-header">
                            <div class="talent-card-title">
                                <span class="talent-card-icon">${talent.icon}</span>
                                <span class="talent-card-name">${talent.name}</span>
                                <span class="talent-category-tag ${talent.category}">${category.icon} ${category.name}</span>
                            </div>
                            <span class="talent-card-level">${level} / ${talent.maxLevel}</span>
                        </div>
                        <div class="talent-card-body">
                            <div class="talent-card-info">
                                <div class="talent-card-desc">${talent.description}</div>
                                <div class="talent-card-effect">${effectText}</div>
                                <div class="talent-progress-bar">
                                    <div class="talent-progress-fill" style="width: ${progressPercent}%"></div>
                                </div>
                            </div>
                            <div class="talent-card-actions">
                                <button class="talent-upgrade-btn ${isMaxed ? 'maxed' : ''}" 
                                        data-talent="${talentId}"
                                        ${isMaxed ? 'disabled' : ''}>
                                    ${isMaxed ? '已满级' : '⬆ 升级'}
                                </button>
                                <div class="talent-upgrade-hint">${isMaxed ? '' : '每级+' + talent.perLevel + talent.unit}</div>
                            </div>
                        </div>
                        ${talentId === 'gem_attr_boost' ? this._renderGemAttrSelector() : ''}
                    </div>
                `;
            }
            listEl.innerHTML = html;

            // 绑定升级按钮事件（支持Shift和Ctrl）
            listEl.querySelectorAll('.talent-upgrade-btn:not(.maxed)').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tid = btn.dataset.talent;
                    const talent = TALENT_DATA[tid];
                    if (!talent) return;
                    const currentLv = this.game.getTalentLevel(tid);
                    let levels = 1;
                    if (e.ctrlKey) {
                        // Ctrl: 升满
                        levels = Math.min(talent.maxLevel - currentLv, remainingPoints);
                    } else if (e.shiftKey) {
                        // Shift: 升10级
                        levels = Math.min(10, talent.maxLevel - currentLv, remainingPoints);
                    }
                    if (levels <= 0) {
                        this.showToast('天赋点不足');
                        return;
                    }
                    const result = this.game.upgradeTalent(tid, levels);
                    if (result.success) {
                        this.showToast(`🌟 ${talent.name} 升至 Lv.${result.newLevel}（消耗${result.pointsUsed}点）`);
                        this.renderTalentPage();
                    } else {
                        this.showToast(result.message);
                    }
                });
            });

            // 绑定宝石属性选择器事件
            listEl.querySelectorAll('.gem-attr-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    const attrId = opt.dataset.attr;
                    const result = this.game.setTalentGemAttrChoice(attrId);
                    if (result.success) {
                        const attrName = GEM_ATTRIBUTES.find(a => a.id === attrId)?.name || attrId;
                        this.showToast(`🔮 宝石属性偏好已设为: ${attrName}`);
                        this.renderTalentPage();
                    }
                });
            });
        }
    }

    // 渲染宝石属性选择器
    _renderGemAttrSelector() {
        const currentChoice = this.game.getTalentGemAttrChoice();
        let html = '<div class="talent-gem-attr-selector">';
        for (const attr of GEM_ATTRIBUTES) {
            const selected = currentChoice === attr.id ? 'selected' : '';
            html += `<button class="gem-attr-option ${selected}" data-attr="${attr.id}">${attr.icon} ${attr.name}</button>`;
        }
        html += '</div>';
        return html;
    }


    updateGoldDisplay() {
        const goldStr = (this.game.gameState.gold || 0).toLocaleString();
        const el = document.getElementById('gold-amount');
        if (el) el.textContent = goldStr;
        const berryEl = document.getElementById('berry-gold-amount');
        if (berryEl) berryEl.textContent = goldStr;
    }

    renderBadgePage() {
        this.updateGoldDisplay();
        this.renderBadgeList();
        this.renderShop();
        this.renderGemBag();
        this.renderGemBonuses();
    }

    renderBadgeList() {
        const container = document.getElementById('badge-list');
        if (!container) return;
        container.innerHTML = '';

        for (const regionId in BADGE_DATA) {
            const badgeInfo = BADGE_DATA[regionId];
            const badge = this.game.gameState.badges[regionId];
            const unlocked = badge?.unlocked;
            const completed = this.game.isRegionCompleted(regionId);

            const card = document.createElement('div');
            card.className = `badge-card${unlocked ? ' unlocked' : ' locked'}`;

            if (unlocked) {
                const gem = badge.gem;
                const gemAttrSum = gem ? gem.attrs.reduce((sum, a) => sum + a.value, 0) : 0;
                const gemHtml = gem ? `
                    <div class="badge-gem-slot filled" style="border-color:${gem.qualityColor}">
                        <div class="gem-quality" style="color:${gem.qualityColor}">💎 ${gem.qualityName}</div>
                        <div class="gem-attrs-mini">${gem.attrs.map(a => `<span>${a.icon} ${a.name}+${a.value}${a.unit}</span>`).join('')}</div>
                        <div class="gem-slot-bottom">
                            <button class="gem-unequip-btn" data-region="${regionId}">卸下</button>
                            <span class="gem-attr-sum" style="color:${gem.qualityColor}">属性总和：${gemAttrSum}%</span>
                        </div>
                    </div>
                ` : `
                    <div class="badge-gem-slot empty">
                        <span class="gem-slot-empty-text">🔲 空插槽 - 从背包镶嵌宝石</span>
                    </div>
                `;

                card.innerHTML = `
                    <div class="badge-card-header">
                        <span class="badge-icon">${badgeInfo.icon}</span>
                        <div class="badge-info">
                            <div class="badge-name">${badgeInfo.name}</div>
                            <div class="badge-effect">${badgeInfo.effect}</div>
                        </div>
                    </div>
                    <div class="badge-gem-area">
                        <div class="badge-gem-label">宝石插槽</div>
                        ${gemHtml}
                    </div>
                `;

                // 绑定卸下按钮事件
                if (gem) {
                    const btn = card.querySelector('.gem-unequip-btn');
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const result = this.game.unequipGem(regionId);
                        if (result.success) {
                            this.showToast('💎 宝石已卸下');
                            this.renderBadgePage();
                        } else {
                            this.showToast('⚠️ ' + result.message);
                        }
                    });
                }
            } else {
                // 未解锁徽章：根据地区解锁状态分两阶段展示
                const unlockProgress = this.game.getRegionUnlockProgress(regionId);
                const badgeProgress = this.game.getPokedexStatsByRegion(regionId);
                const regionData = REGIONS[regionId];
                const regionName = regionData?.name || regionId;
                const regionUnlocked = this.game.isRegionUnlocked(regionId);
                // 获取前置地区名称（用于"集齐XX图鉴"提示）
                const prevRegionName = regionData?.unlockCondition?.region
                    ? (REGIONS[regionData.unlockCondition.region]?.name || '') : '';

                let lockedDesc = badgeInfo.description;
                let progressText = '';

                if (regionId === 'kanto') {
                    // 关都：起始地区，无需解锁地区，只需集齐图鉴
                    progressText = `关都徽章进度: ${badgeProgress.caught}/${badgeProgress.total}`;
                } else if (!regionUnlocked) {
                    // 地区未解锁
                    lockedDesc = `需先解锁${regionName}（集齐${prevRegionName}图鉴）`;
                    // 仅城都显示解锁进度（第一个需要解锁的地区，玩家最关心）
                    if (regionId === 'johto') {
                        progressText = `${regionName}解锁进度: ${unlockProgress.current}/${unlockProgress.total} (${unlockProgress.percent}%)`;
                    }
                } else {
                    // 地区已解锁，但徽章未获得
                    lockedDesc = `${regionName}已解锁，捕获全部${regionName}宝可梦后获得`;
                    progressText = `${badgeInfo.name}进度: ${badgeProgress.caught}/${badgeProgress.total}`;
                }

                card.innerHTML = `
                    <div class="badge-card-header">
                        <span class="badge-icon locked-icon">🔒</span>
                        <div class="badge-info">
                            <div class="badge-name">${badgeInfo.name}</div>
                            <div class="badge-effect" style="color:var(--text-secondary)">${lockedDesc}</div>
                        </div>
                    </div>
                    ${!completed && progressText ? `<div class="badge-progress">${progressText}</div>` : ''}
                `;
            }

            container.appendChild(card);
        }
    }

    renderShop() {
        const shopSection = document.getElementById('shop-section');
        if (!shopSection) return;

        // 商店通关关都后解锁
        if (!this.game.isGoldUnlocked()) {
            shopSection.style.display = 'none';
            return;
        }
        shopSection.style.display = '';

        const gemCount = this.game.gameState.gems.length;
        document.getElementById('gem-bag-count').textContent = `背包: ${gemCount}/${GEM_BAG_MAX}`;

        const buyBtn = document.getElementById('btn-buy-gem');
        if (buyBtn) {
            // 移除旧监听器（通过克隆节点）
            const newBtn = buyBtn.cloneNode(true);
            buyBtn.parentNode.replaceChild(newBtn, buyBtn);
            newBtn.addEventListener('click', () => {
                const result = this.game.buyGem();
                if (result.success) {
                    this.showToast(`💎 获得 ${result.gem.qualityName} 宝石！`);
                    this.updateGoldDisplay();
                    this.renderGemBag();
                    this.renderShop();
                    this.renderGemBonuses();
                } else {
                    this.showToast('⚠️ ' + result.message);
                }
            });
        }

        const buyAllBtn = document.getElementById('btn-buy-all-gems');
        if (buyAllBtn) {
            const newAllBtn = buyAllBtn.cloneNode(true);
            buyAllBtn.parentNode.replaceChild(newAllBtn, buyAllBtn);
            newAllBtn.addEventListener('click', () => {
                const result = this.game.buyAllGems();
                if (result.success) {
                    const stopText = result.reason === 'bag_full' ? '背包已满' : '金币已不足';
                    this.showToast(`🛒 批量购买完成：获得 ${result.count} 颗宝石，花费 ${result.spent} 金币（${stopText}）`);
                    this.updateGoldDisplay();
                    this.renderGemBag();
                    this.renderShop();
                    this.renderGemBonuses();
                } else {
                    this.showToast('⚠️ ' + result.message);
                }
            });
        }


        const sourceByTarget = {
            magic: 'common',
            rare: 'magic',
            epic: 'rare',
            mythic: 'epic',
            legendary: 'mythic',
            eternal: 'legendary',
        };

        // 合成按钮事件
        shopSection.querySelectorAll('.gem-synthesis-btn:not(#btn-synthesize-all):not(#btn-reforge-eternal)').forEach(btn => {
            const cloned = btn.cloneNode(true);
            btn.parentNode.replaceChild(cloned, btn);
            cloned.addEventListener('click', () => {
                const targetQuality = cloned.dataset.targetQuality;
                const sourceQuality = sourceByTarget[targetQuality];
                const sourceInfo = GEM_QUALITIES.find(q => q.id === sourceQuality);
                const targetInfo = GEM_QUALITIES.find(q => q.id === targetQuality);
                const candidates = this.game.gameState.gems.filter(g => g.quality === sourceQuality && !g.locked);

                if (!sourceInfo || !targetInfo) {
                    this.showToast('⚠️ 合成配置异常');
                    return;
                }

                if (candidates.length < 10) {
                    this.showToast(`⚠️ 缺少可合成的${sourceInfo.name}宝石：需要10个，当前${candidates.length}个（未锁定）`);
                    return;
                }

                this.showGemSynthesisDialog(sourceQuality, targetQuality);
            });
        });

        // 一键合成按钮事件
        const synthesizeAllBtn = document.getElementById('btn-synthesize-all');
        if (synthesizeAllBtn) {
            const newBtn = synthesizeAllBtn.cloneNode(true);
            synthesizeAllBtn.parentNode.replaceChild(newBtn, synthesizeAllBtn);
            newBtn.addEventListener('click', () => {
                const result = this.game.synthesizeAllGems();
                if (result.success) {
                    // 汇总合成结果
                    const qualityNames = { common: '普通', magic: '魔法', rare: '稀有', epic: '史诗', mythic: '神话', legendary: '传说', eternal: '永恒' };
                    const summary = {};
                    for (const r of result.results) {
                        const name = qualityNames[r.targetQuality] || r.targetQuality;
                        summary[name] = (summary[name] || 0) + 1;
                    }
                    const summaryText = Object.entries(summary).map(([name, count]) => `${name}×${count}`).join('、');
                    this.showToast(`🔄 一键合成完成！共合成 ${result.count} 次，获得：${summaryText}`);
                    this.renderBadgePage();
                } else {
                    this.showToast('⚠️ ' + result.message);
                }
            });
        }

        // 重铸永恒宝石按钮事件
        const reforgeBtn = document.getElementById('btn-reforge-eternal');
        if (reforgeBtn) {
            const newReforgeBtn = reforgeBtn.cloneNode(true);
            reforgeBtn.parentNode.replaceChild(newReforgeBtn, reforgeBtn);
            newReforgeBtn.addEventListener('click', () => {
                const eternalGems = this.game.gameState.gems.filter(g => g.quality === 'eternal' && !g.locked);
                if (eternalGems.length < 2) {
                    this.showToast(`⚠️ 需要至少2个未锁定的永恒宝石，当前${eternalGems.length}个`);
                    return;
                }
                this.showReforgeDialog();
            });
        }

        // 一键购买合成到永恒宝石按钮（帕底亚徽章解锁后显示）
        const autoEternalBtn = document.getElementById('btn-auto-eternal');
        if (autoEternalBtn) {
            const paldeaUnlocked = this.game.hasBadge('paldea');
            autoEternalBtn.style.display = paldeaUnlocked ? '' : 'none';
            if (paldeaUnlocked) {
                const newAutoBtn = autoEternalBtn.cloneNode(true);
                autoEternalBtn.parentNode.replaceChild(newAutoBtn, autoEternalBtn);
                newAutoBtn.addEventListener('click', () => {
                    if (this.game.gameState.gold < 1000) {
                        this.showToast('⚠️ 金币不足');
                        return;
                    }
                    // 如果正在运行中，忽略重复点击
                    if (this._autoEternalRunning) {
                        this.showToast('⏳ 正在运行中...');
                        return;
                    }
                    this.showConfirmDialog(
                        '一键购买并合成永恒宝石',
                        '将自动循环购买宝石并合成，直到产生新的永恒宝石或金币耗尽。<br>⚠️ 可能消耗大量金币，确定继续吗？',
                        () => {
                            this._startAutoEternalProcess();
                        }
                    );
                });
            }
        }
    }

    showGemSynthesisDialog(sourceQuality, targetQuality) {
        const sourceInfo = GEM_QUALITIES.find(q => q.id === sourceQuality);
        const targetInfo = GEM_QUALITIES.find(q => q.id === targetQuality);
        if (!sourceInfo || !targetInfo) {
            this.showToast('⚠️ 合成配置异常');
            return;
        }

        const candidates = this.game.gameState.gems.filter(g => g.quality === sourceQuality && !g.locked);
        if (candidates.length < 10) {
            this.showToast(`⚠️ 缺少可合成的${sourceInfo.name}宝石：需要10个，当前${candidates.length}个（未锁定）`);
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const listHtml = candidates.map((g, idx) => {
            const attrsText = g.attrs.map(a => `${a.icon}${a.name}+${a.value}${a.unit}`).join('、');
            return `
                <label class="synthesis-item">
                    <input type="checkbox" class="synthesis-check" value="${g.uid}" ${idx < 10 ? 'checked' : ''}>
                    <span class="synthesis-item-name">💎 ${g.qualityName}宝石</span>
                    <span class="synthesis-item-attrs">${attrsText}</span>
                </label>
            `;
        }).join('');

        overlay.innerHTML = `
            <div class="modal synthesis-modal">
                <h3>✨ 合成${targetInfo.name}宝石</h3>
                <p>请选择 10 个${sourceInfo.name}宝石进行合成</p>
                <div class="synthesis-count">已选择 <span id="synthesis-selected-count">10</span>/10</div>
                <div class="synthesis-list">${listHtml}</div>
                <div class="modal-buttons">
                    <button class="cancel-btn">取消</button>
                    <button class="confirm-btn">确认合成</button>
                </div>
            </div>
        `;

        const countEl = overlay.querySelector('#synthesis-selected-count');
        const checks = Array.from(overlay.querySelectorAll('.synthesis-check'));
        const confirmBtn = overlay.querySelector('.confirm-btn');

        const updateSelectedState = () => {
            const selectedCount = checks.filter(c => c.checked).length;
            countEl.textContent = String(selectedCount);
            confirmBtn.disabled = selectedCount !== 10;
        };

        checks.forEach(c => {
            c.addEventListener('change', () => {
                const selectedCount = checks.filter(x => x.checked).length;
                if (selectedCount > 10) {
                    c.checked = false;
                    this.showToast('⚠️ 最多只能选择10个宝石');
                }
                updateSelectedState();
            });
        });

        overlay.querySelector('.cancel-btn').addEventListener('click', () => overlay.remove());
        confirmBtn.addEventListener('click', () => {
            const selectedUids = checks.filter(c => c.checked).map(c => c.value);
            const result = this.game.synthesizeGems(sourceQuality, selectedUids);
            if (!result.success) {
                this.showToast('⚠️ ' + result.message);
                return;
            }
            overlay.remove();
            this.showToast(`✨ 合成成功！获得 ${result.newGem.qualityName} 宝石`);
            this.renderBadgePage();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        updateSelectedState();
        document.body.appendChild(overlay);
    }

    // 一键购买并合成永恒宝石 - 异步分批处理
    _autoEternalRunning = false;

    _startAutoEternalProcess() {
        const initResult = this.game.startAutoEternal();
        if (!initResult.success) {
            this.showToast('⚠️ ' + initResult.message);
            return;
        }
        this._autoEternalRunning = true;

        // 创建进度条覆盖层（复用 modal 样式）
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal" style="max-width:420px;text-align:center">
                <h3>💎 一键购买合成永恒</h3>
                <div id="eternal-progress-info" style="margin:12px 0;color:var(--text-secondary);font-size:13px;min-height:40px;">
                    正在准备...
                </div>
                <div style="background:rgba(255,255,255,0.1);border-radius:8px;height:20px;overflow:hidden;margin-bottom:8px;">
                    <div id="eternal-progress-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#9b59b6,#e74c3c);border-radius:8px;transition:width 0.15s;"></div>
                </div>
                <button id="btn-stop-auto-eternal" class="gem-synthesis-btn eternal" style="padding:10px 30px;font-size:15px;">⏹️ 停止</button>
            </div>`;
        document.body.appendChild(overlay);

        const infoEl = document.getElementById('eternal-progress-info');
        const barEl = document.getElementById('eternal-progress-bar');
        const stopBtn = document.getElementById('btn-stop-auto-eternal');

        stopBtn.addEventListener('click', () => {
            this.game.stopAutoEternal();
            stopBtn.disabled = true;
            stopBtn.textContent = '停止中...';
        });

        const BATCH_SIZE = 50; // 每批处理轮数
        let batchCount = 0;
        let stepResult = null;

        const runBatch = () => {
            for (let i = 0; i < BATCH_SIZE; i++) {
                if (!this._autoEternalRunning) { stepResult = { reason: 'stopped' }; break; }
                batchCount++;
                stepResult = this.game.autoBuySynthStep();

                if (stepResult.done) {
                    this._autoEternalRunning = false;
                    this._finishAutoEternal(stepResult, infoEl, barEl, stopBtn, overlay);
                    return;
                }
            }

            // 停止或更新进度
            if (!this._autoEternalRunning) {
                this._finishAutoEternal({ reason: 'stopped', bought: stepResult?.totalBought || 0, spent: stepResult?.totalSpent || 0, synthesized: stepResult?.totalSynthesized || 0, rounds: batchCount }, infoEl, barEl, stopBtn, overlay);
            } else {
                infoEl.innerHTML = `第 ${batchCount} 轮...<br>已购买 ${stepResult.totalBought} 颗 | 花费 ${stepResult.totalSpent.toLocaleString()} 金币 | 合成 ${stepResult.totalSynthesized} 次`;
                barEl.style.width = Math.min(100, (batchCount % 500) / 500 * 100) + '%';
                setTimeout(runBatch, 0); // 让出主线程
            }
        };

        setTimeout(runBatch, 0);
    }

    _finishAutoEternal(result, infoEl, barEl, stopBtn, overlay) {
        this._autoEternalRunning = false;
        const reasonText = result.reason === 'eternal_found'
            ? `<span style="color:#e74c3c">✨ 成功获得 ${result.newEternals} 颗永恒宝石！</span>`
            : result.reason === 'stopped'
                ? '<span style="color:#f39c12">⏹️ 已手动停止</span>'
                : result.reason === 'gold_empty'
                    ? '💰 金币已耗尽'
                    : '🎒 背包已满且无法继续合成';
        infoEl.innerHTML = `${reasonText}<br><small>共购买 ${result.bought} 颗，花费 ${result.spent.toLocaleString()} 金币，合成 ${result.synthesized} 次（${result.rounds} 轮）</small>`;
        barEl.style.width = '100%';
        // 克隆替换按钮，清除所有旧的 eventListener
        const doneBtn = stopBtn.cloneNode(true);
        doneBtn.textContent = '完成';
        doneBtn.disabled = false;
        doneBtn.addEventListener('click', () => { overlay.remove(); this.renderBadgePage(); });
        stopBtn.parentNode.replaceChild(doneBtn, stopBtn);
    }

    showReforgeDialog() {
        const eternalGems = this.game.gameState.gems.filter(g => g.quality === 'eternal' && !g.locked);
        if (eternalGems.length < 2) {
            this.showToast(`⚠️ 需要至少2个未锁定的永恒宝石，当前${eternalGems.length}个`);
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const listHtml = eternalGems.map((g, idx) => {
            const attrsText = g.attrs.map(a => `${a.icon}${a.name}+${a.value}${a.unit}`).join('、');
            return `
                <label class="synthesis-item">
                    <input type="checkbox" class="reforge-check" value="${g.uid}" ${idx < 2 ? 'checked' : ''}>
                    <span class="synthesis-item-name">💎 ${g.qualityName}宝石</span>
                    <span class="synthesis-item-attrs">${attrsText}</span>
                </label>
            `;
        }).join('');

        overlay.innerHTML = `
            <div class="modal synthesis-modal">
                <h3>🔨 重铸永恒宝石</h3>
                <p>选择 2 个永恒宝石，重铸为 1 个新的永恒宝石（重新随机属性）</p>
                <div class="synthesis-count">已选择 <span id="reforge-selected-count">2</span>/2</div>
                <div class="synthesis-list">${listHtml}</div>
                <div class="modal-buttons">
                    <button class="cancel-btn">取消</button>
                    <button class="confirm-btn">确认重铸</button>
                </div>
            </div>
        `;

        const countEl = overlay.querySelector('#reforge-selected-count');
        const checks = Array.from(overlay.querySelectorAll('.reforge-check'));
        const confirmBtn = overlay.querySelector('.confirm-btn');

        const updateSelectedState = () => {
            const selectedCount = checks.filter(c => c.checked).length;
            countEl.textContent = String(selectedCount);
            confirmBtn.disabled = selectedCount !== 2;
        };

        checks.forEach(c => {
            c.addEventListener('change', () => {
                const selectedCount = checks.filter(x => x.checked).length;
                if (selectedCount > 2) {
                    c.checked = false;
                    this.showToast('⚠️ 最多只能选择2个宝石');
                }
                updateSelectedState();
            });
        });

        overlay.querySelector('.cancel-btn').addEventListener('click', () => overlay.remove());
        confirmBtn.addEventListener('click', () => {
            const selectedUids = checks.filter(c => c.checked).map(c => c.value);
            const result = this.game.reforgeEternalGem(selectedUids);
            if (!result.success) {
                this.showToast('⚠️ ' + result.message);
                return;
            }
            overlay.remove();
            this.showToast(`🔨 重铸成功！获得新的永恒宝石`);
            this.renderBadgePage();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        updateSelectedState();
        document.body.appendChild(overlay);
    }

    renderGemBag() {
        const container = document.getElementById('gem-bag-list');
        const section = document.getElementById('gem-bag-section');
        if (!container || !section) return;

        if (!this.game.isGoldUnlocked()) {
            section.style.display = 'none';
            return;
        }
        section.style.display = '';

        const gems = this.game.gameState.gems;
        if (gems.length === 0) {
            container.innerHTML = '<div class="gem-bag-empty">背包空空如也，去商店购买宝石吧！</div>';
            return;
        }

        container.innerHTML = '';
        // 按锁定状态排序（锁定在前），再按品质排序（高品质在前：永恒→传说→神话→史诗→稀有→魔法→普通）
        const qualityOrder = { 'eternal': 0, 'legendary': 1, 'mythic': 2, 'epic': 3, 'rare': 4, 'magic': 5, 'common': 6 };
        const sorted = [...gems].sort((a, b) => {
            // 锁定的宝石排在前面
            const lockA = a.locked ? 0 : 1;
            const lockB = b.locked ? 0 : 1;
            if (lockA !== lockB) return lockA - lockB;
            // 品质高的排前面（mythic=0 最小排最前）
            const qA = (a.quality in qualityOrder) ? qualityOrder[a.quality] : 99;
            const qB = (b.quality in qualityOrder) ? qualityOrder[b.quality] : 99;
            return qA - qB;
        });

        for (const gem of sorted) {
            const card = document.createElement('div');
            card.className = `gem-card gem-${gem.quality}`;
            card.style.borderColor = gem.qualityColor;

            const attrsHtml = gem.attrs.map(a =>
                `<div class="gem-attr-line">${a.icon} ${a.name} <span class="gem-attr-value">+${a.value}${a.unit}</span></div>`
            ).join('');

            // 获取可镶嵌的徽章列表（仅显示空槽徽章）
            const badgeOptions = [];
            for (const regionId in this.game.gameState.badges) {
                const b = this.game.gameState.badges[regionId];
                if (b?.unlocked && !b.gem) {
                    badgeOptions.push({ regionId, name: BADGE_DATA[regionId].name });
                }
            }

            const equipBtnsHtml = badgeOptions.map(b =>
                `<button class="gem-equip-btn" data-gem-uid="${gem.uid}" data-region="${b.regionId}">镶嵌到${b.name}</button>`
            ).join('');

            const newBadgeHtml = gem.isNew ? '<span class="gem-new-badge" title="新购买">NEW</span>' : '';

            const gemAttrTotal = gem.attrs.reduce((sum, a) => sum + a.value, 0);
            card.innerHTML = `
                ${newBadgeHtml}
                <div class="gem-name">${gem.locked ? '🔒 ' : ''}💎 ${gem.qualityName}宝石</div>
                <div class="gem-hover-panel">
                    <div class="gem-attrs">${attrsHtml}</div>
                    <div class="gem-attr-sum-row" style="color:${gem.qualityColor}">属性总和：${gemAttrTotal}%</div>
                    <div class="gem-equip-actions">${equipBtnsHtml}</div>
                    <div class="gem-action-row">
                        <button class="gem-lock-btn${gem.locked ? ' locked' : ''}" data-gem-uid="${gem.uid}">${gem.locked ? '🔓 解锁' : '🔒 锁定'}</button>
                        <button class="gem-discard-btn" data-gem-uid="${gem.uid}">🗑️ 丢弃</button>
                    </div>
                </div>
            `;

            const markGemViewed = () => {
                if (!gem.isNew) return;
                gem.isNew = false;
                const badge = card.querySelector('.gem-new-badge');
                if (badge) badge.remove();
                this.game.save();
            };

            // 根据位置自动调整悬浮面板方向（靠右时左对齐，避免被裁切）
            const adjustPanelPosition = () => {
                const panel = card.querySelector('.gem-hover-panel');
                if (panel) {
                    card.classList.remove('align-right');
                    const cardRect = card.getBoundingClientRect();
                    const panelWidth = Math.min(280, window.innerWidth * 0.8);
                    const overflowRight = cardRect.right + panelWidth > window.innerWidth - 8;
                    if (overflowRight) {
                        card.classList.add('align-right');
                    }
                }
            };

            card.addEventListener('mouseenter', () => {
                adjustPanelPosition();
                markGemViewed();
            });

            // 点击卡片：仅触摸设备使用 toggle active（手机兼容）
            // PC 端有 hover 能力，不需要点击 toggle，避免 hover 和 click 冲突
            const hasHover = window.matchMedia('(hover: hover)').matches;
            card.addEventListener('click', (e) => {
                if (hasHover) {
                    // PC 端：点击只标记已查看，不做 toggle
                    markGemViewed();
                    return;
                }
                // 触摸设备：toggle active
                const isActive = card.classList.contains('active');
                document.querySelectorAll('.gem-card.active').forEach(c => c.classList.remove('active'));
                if (!isActive) {
                    adjustPanelPosition();
                    card.classList.add('active');
                    container.classList.add('has-active-gem');
                } else {
                    container.classList.remove('has-active-gem');
                }
                markGemViewed();
            });

            // 绑定镶嵌按钮
            card.querySelectorAll('.gem-equip-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const regionId = btn.dataset.region;
                    const gemUid = btn.dataset.gemUid;
                    const result = this.game.equipGem(regionId, gemUid);
                    if (result.success) {
                        this.showToast(`💎 宝石已镶嵌到 ${BADGE_DATA[regionId].name}`);
                        this.renderBadgePage();
                    } else {
                        this.showToast('⚠️ ' + result.message);
                    }
                });
            });

            // 绑定锁定按钮
            const lockBtn = card.querySelector('.gem-lock-btn');
            if (lockBtn) {
                lockBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const result = this.game.toggleGemLock(gem.uid);
                    if (result.success) {
                        this.showToast(result.locked ? '🔒 宝石已锁定' : '🔓 宝石已解锁');
                        this.renderGemBag();
                        this.renderShop();
                    } else {
                        this.showToast('⚠️ ' + result.message);
                    }
                });
            }

            // 绑定丢弃按钮
            const discardBtn = card.querySelector('.gem-discard-btn');
            if (discardBtn) {
                discardBtn.addEventListener('click', (e) => {
                    markGemViewed();
                    e.stopPropagation();
                    this.showConfirmDialog('丢弃宝石', '确定要丢弃这颗宝石吗？此操作不可恢复。', () => {
                        const result = this.game.discardGem(gem.uid);
                        if (result.success) {
                            this.showToast('🗑️ 宝石已丢弃');
                            this.renderBadgePage();
                        } else {
                            this.showToast('⚠️ ' + result.message);
                        }
                    });
                });
            }

            container.appendChild(card);
        }

        // 点击空白处关闭所有宝石面板（手机兼容）
        if (!this._gemBagClickOutsideBound) {
            this._gemBagClickOutsideBound = true;
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.gem-card')) {
                    document.querySelectorAll('.gem-card.active').forEach(c => c.classList.remove('active'));
                    const gemList = document.getElementById('gem-bag-list');
                    if (gemList) gemList.classList.remove('has-active-gem');
                }
            });
        }

    }

    renderGemBonuses() {
        const container = document.getElementById('gem-bonus-list');
        const section = document.getElementById('gem-bonus-section');
        if (!container || !section) return;

        if (!this.game.isGoldUnlocked()) {
            section.style.display = 'none';
            return;
        }
        section.style.display = '';

        const bonuses = this.game.getGemBonuses();
        const hasAnyBonus = Object.values(bonuses).some(v => v > 0);

        if (!hasAnyBonus) {
            container.innerHTML = '<div class="gem-bonus-empty">暂无宝石加成，镶嵌宝石到徽章中即可获得加成</div>';
            return;
        }

        container.innerHTML = '';
        for (const attr of GEM_ATTRIBUTES) {
            if (bonuses[attr.id] > 0) {
                const line = document.createElement('div');
                line.className = 'gem-bonus-line';
                let valueText = `+${bonuses[attr.id]}${attr.unit}`;
                if (attr.id === 'dodge_rate' && bonuses[attr.id] > 75) {
                    valueText += `（上限：75%）`;
                }
                line.innerHTML = `<span>${attr.icon} ${attr.name}</span><span class="gem-bonus-value">${valueText}</span>`;
                container.appendChild(line);
            }
        }
    }

    // ===================== 全局刷新 =====================
    refreshAll() {
        this.renderTeam();
        this.updateBadgeTabVisibility();
        this.updateBerryTabVisibility();
        this.updateSkillTabVisibility();
        this.updateTalentTabVisibility();
        this.updateTowerTabVisibility();
        if (this.currentTab === 'tab-map') this.renderMap();
        if (this.currentTab === 'tab-badge') this.renderBadgePage();
        if (this.currentTab === 'tab-berry') this.renderBerryPage();
        if (this.currentTab === 'tab-skill') this.renderSkillPage();
        if (this.currentTab === 'tab-talent') this.renderTalentPage();
        if (this.currentTab === 'tab-tower') this.renderTowerPage();
        if (this.currentTab === 'tab-pokedex') this.renderPokedex();
        if (this.currentTab === 'tab-settings') this.renderSettings();
    }

    // ===================== 挑战塔页面 =====================
    updateTowerTabVisibility() {
        const towerTabBtn = document.querySelector('.tower-tab-btn');
        if (towerTabBtn) {
            const unlocked = this.game.isTowerUnlocked();
            const oldLock = towerTabBtn.querySelector('.lock-icon');
            if (oldLock) oldLock.remove();
            if (unlocked) {
                towerTabBtn.classList.remove('locked');
            } else {
                towerTabBtn.classList.add('locked');
                const lockSpan = document.createElement('span');
                lockSpan.className = 'lock-icon';
                lockSpan.textContent = '🔒';
                towerTabBtn.appendChild(lockSpan);
            }
        }
    }

    renderTowerPage() {
        if (!this.game.isTowerUnlocked()) return;

        const tower = this.game.gameState.tower;
        const bonus = this.game.getTowerBonus();

        // 顶部进度
        const floorDisplay = document.getElementById('tower-floor-display');
        if (floorDisplay) {
            floorDisplay.innerHTML = `
                <span class="tower-progress">进度：<strong>${tower.currentFloor}</strong> / ${TOWER_MAX_FLOOR} 层</span>
                <span class="tower-highest">最高：<strong>${tower.highestFloor}</strong> 层</span>
            `;
        }

        // 加成信息
        const bonusInfo = document.getElementById('tower-bonus-info');
        if (bonusInfo) {
            bonusInfo.innerHTML = `
                <div class="tower-bonus-grid">
                    <div class="tower-bonus-item">
                        <span class="bonus-icon">📈</span>
                        <span class="bonus-label">经验值</span>
                        <span class="bonus-value">+${bonus}%</span>
                    </div>
                    <div class="tower-bonus-item">
                        <span class="bonus-icon">🪙</span>
                        <span class="bonus-label">金币</span>
                        <span class="bonus-value">+${bonus}%</span>
                    </div>
                    <div class="tower-bonus-item">
                        <span class="bonus-icon">✨</span>
                        <span class="bonus-label">闪光概率</span>
                        <span class="bonus-value">+${bonus}%</span>
                    </div>
                </div>
            `;
        }

        // 规则说明
        const rulesContent = document.getElementById('tower-rules-content');
        if (rulesContent) {
            rulesContent.innerHTML = `
                <div class="tower-rules-list">
                    <div class="tower-rule-item">🏝️ 挑战塔共 <strong>${TOWER_MAX_FLOOR} 层</strong>，每层 <strong>${TOWER_ENEMIES_PER_FLOOR} 只</strong>高种族值闪光宝可梦</div>
                    <div class="tower-rule-item">⚔️ 需要连续击败6只才能通关，<strong>HP跨怪物继承</strong>（每场战斗不回复血量）</div>
                    <div class="tower-rule-item">🔄 每层进入时<strong>HP回满</strong>，失败后从第一只怪重新开始</div>
                    <div class="tower-rule-item">📈 通关加成：<strong>历史最高层数%</strong> 额外增加经验/金币/闪光概率</div>
                    <div class="tower-rule-item">⚠️ 怪物等级范围：<strong>${this.game.getTowerFloorLevel(1).toLocaleString()}</strong> ~ <strong>${this.game.getTowerFloorLevel(TOWER_MAX_FLOOR).toLocaleString()}</strong></div>
                </div>
            `;
        }

        // 当前层标题
        const floorTitle = document.getElementById('tower-floor-title');
        if (floorTitle) {
            const level = this.game.getTowerFloorLevel(tower.currentFloor);
            floorTitle.textContent = `第 ${tower.currentFloor} 层 — 怪物等级 ${level.toLocaleString()}`;
        }

        // 敌人网格
        const enemiesGrid = document.getElementById('tower-enemies-grid');
        if (enemiesGrid) {
            if (!tower.enemies) {
                // 未生成敌人（还没进入过）
                let html = '';
                for (let i = 0; i < TOWER_ENEMIES_PER_FLOOR; i++) {
                    html += `
                        <div class="tower-enemy-card unknown">
                            <div class="tower-enemy-sprite">❓</div>
                            <div class="tower-enemy-name">???</div>
                        </div>
                    `;
                }
                enemiesGrid.innerHTML = html;
            } else {
                let html = '';
                for (let i = 0; i < tower.enemies.length; i++) {
                    const enemyId = tower.enemies[i];
                    // 兼容旧存档（对象）和新格式（纯id）
                    const id = typeof enemyId === 'object' ? enemyId.id : enemyId;
                    const baseData = POKEMON_DATA[id];
                    const name = baseData ? baseData.name : `#${id}`;
                    const level = this.game.getTowerFloorLevel(tower.currentFloor);
                    const spriteUrl = `sprites/pokemon/${id}.png`;
                    html += `
                        <div class="tower-enemy-card">
                            <div class="tower-enemy-sprite">
                                <img src="${spriteUrl}" alt="${name}" onerror="this.style.display='none';this.parentElement.textContent='${name.slice(0,2)}'">
                            </div>
                            <div class="tower-enemy-name">${name}</div>
                            <div class="tower-enemy-level">Lv.${level.toLocaleString()}</div>
                        </div>
                    `;
                }
                enemiesGrid.innerHTML = html;
            }
        }

        // 操作按钮状态
        const startBtn = document.getElementById('btn-tower-start');
        const fleeBtn = document.getElementById('btn-tower-flee');
        if (startBtn) {
            if (this.game._towerMode) {
                startBtn.style.display = 'none';
                if (fleeBtn) fleeBtn.style.display = 'inline-block';
            } else {
                startBtn.style.display = 'inline-block';
                if (fleeBtn) fleeBtn.style.display = 'none';

                // 全部通关 100 层
                if (tower.currentFloor >= TOWER_MAX_FLOOR && tower.highestFloor >= TOWER_MAX_FLOOR) {
                    startBtn.textContent = `🏆 已通关全部 ${tower.currentFloor} 层！`;
                    startBtn.disabled = true;
                    startBtn.classList.add('maxed');
                } else {
                    startBtn.textContent = `⚔️ 挑战第 ${tower.currentFloor} 层`;
                    startBtn.disabled = false;
                    startBtn.classList.remove('maxed');
                }
            }
        }

        // 绑定事件（只绑定一次）
        if (!this._towerEventsSetup) {
            this._setupTowerEvents();
            this._towerEventsSetup = true;
        }
    }

    _setupTowerEvents() {
        const startBtn = document.getElementById('btn-tower-start');
        const fleeBtn = document.getElementById('btn-tower-flee');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.game._towerMode) return;

                const result = this.game.enterTower();
                if (!result.success) {
                    this.showToast(result.message);
                    return;
                }

                // 渲染当前层敌人
                this.renderTowerPage();

                // 切换到战斗页面
                this.switchTab('tab-battle');
                this.addBattleLog(`🏝️ 进入挑战塔第 ${this.game.gameState.tower.currentFloor} 层！`, 'evolution');

                // 开始战斗
                this.game.startTowerBattle();
            });
        }

        if (fleeBtn) {
            fleeBtn.addEventListener('click', () => {
                if (!this.game._towerMode) return;
                this.game.exitTower();
                this.addBattleLog(`🏃 撤退了挑战塔`, 'info');
                this.showToast('🏃 已撤退，返回主线战斗');
                this.renderTowerPage();
            });
        }
    }
}
