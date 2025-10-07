// 调试和错误处理工具
class DebugManager {
    constructor() {
        this.enabled = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.errors = [];
        this.warnings = [];
        this.init();
    }

    init() {
        if (!this.enabled) return;

        // 捕获全局错误
        window.addEventListener('error', (event) => {
            this.logError(event.error, event.filename, event.lineno);
        });

        // 捕获Promise错误
        window.addEventListener('unhandledrejection', (event) => {
            this.logError(event.reason, 'Promise', null);
        });

        // 添加调试面板
        this.createDebugPanel();
    }

    logError(error, filename = null, lineno = null) {
        const errorInfo = {
            message: error.message || error,
            filename: filename,
            lineno: lineno,
            timestamp: new Date().toISOString(),
            stack: error.stack
        };

        this.errors.push(errorInfo);
        console.error('游戏错误:', errorInfo);

        if (this.enabled) {
            this.updateDebugPanel();
        }
    }

    logWarning(message, data = null) {
        const warningInfo = {
            message: message,
            data: data,
            timestamp: new Date().toISOString()
        };

        this.warnings.push(warningInfo);
        console.warn('游戏警告:', warningInfo);

        if (this.enabled) {
            this.updateDebugPanel();
        }
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML = `
            <div class="debug-header">
                <h3>调试面板</h3>
                <button class="debug-close" onclick="debugManager.togglePanel()">×</button>
            </div>
            <div class="debug-content">
                <div class="debug-section">
                    <h4>游戏状态</h4>
                    <div id="debug-game-state">加载中...</div>
                </div>
                <div class="debug-section">
                    <h4>存储数据</h4>
                    <div id="debug-storage">加载中...</div>
                </div>
                <div class="debug-section">
                    <h4>错误日志</h4>
                    <div id="debug-errors">无错误</div>
                </div>
                <div class="debug-section">
                    <h4>警告信息</h4>
                    <div id="debug-warnings">无警告</div>
                </div>
                <div class="debug-actions">
                    <button onclick="debugManager.clearStorage()">清除存储</button>
                    <button onclick="debugManager.resetGame()">重置游戏</button>
                    <button onclick="debugManager.exportData()">导出数据</button>
                    <button onclick="debugManager.testScenarios()">测试场景</button>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #debug-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 300px;
                max-height: 80vh;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }

            .debug-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background: #333;
                border-bottom: 1px solid #555;
            }

            .debug-header h3 {
                margin: 0;
                font-size: 14px;
            }

            .debug-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
            }

            .debug-content {
                max-height: 400px;
                overflow-y: auto;
                padding: 10px;
            }

            .debug-section {
                margin-bottom: 15px;
                border-bottom: 1px solid #444;
                padding-bottom: 10px;
            }

            .debug-section h4 {
                margin: 0 0 5px 0;
                color: #4CAF50;
                font-size: 12px;
            }

            .debug-section div {
                font-size: 11px;
                line-height: 1.4;
            }

            .debug-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }

            .debug-actions button {
                background: #555;
                color: white;
                border: none;
                padding: 5px 8px;
                border-radius: 3px;
                font-size: 10px;
                cursor: pointer;
            }

            .debug-actions button:hover {
                background: #666;
            }

            .error-item {
                color: #ff6b6b;
                margin-bottom: 3px;
            }

            .warning-item {
                color: #ffa726;
                margin-bottom: 3px;
            }

            .debug-hidden {
                display: none;
            }

            @media (max-width: 480px) {
                #debug-panel {
                    width: 250px;
                    right: 5px;
                    top: 5px;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(panel);

        // 初始隐藏面板
        panel.classList.add('debug-hidden');
    }

    togglePanel() {
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.classList.toggle('debug-hidden');
        }
    }

    updateDebugPanel() {
        if (!this.enabled) return;

        this.updateGameState();
        this.updateStorageInfo();
        this.updateErrors();
        this.updateWarnings();
    }

    updateGameState() {
        const gameStateEl = document.getElementById('debug-game-state');
        if (!gameStateEl) return;

        if (typeof game !== 'undefined' && game) {
            gameStateEl.innerHTML = `
                <div>当前屏幕: ${game.currentScreen || '未知'}</div>
                <div>当前分数: ${game.currentScore || 0}</div>
                <div>当前关卡: ${game.currentLevel || 1}</div>
                <div>连击数: ${game.streak || 0}</div>
                <div>场景管理器: ${game.scenarioManager ? '已加载' : '未加载'}</div>
            `;
        } else {
            gameStateEl.innerHTML = '<div style="color: #ff6b6b;">游戏实例未初始化</div>';
        }
    }

    updateStorageInfo() {
        const storageEl = document.getElementById('debug-storage');
        if (!storageEl) return;

        if (typeof storage !== 'undefined' && storage) {
            try {
                const gameData = storage.getGameData();
                const achievements = storage.getAchievements();

                storageEl.innerHTML = `
                    <div>游戏数据: ${gameData ? '已加载' : '未加载'}</div>
                    <div>最高分: ${gameData && gameData.highScore || 0}</div>
                    <div>完成关卡: ${gameData && gameData.completedLevels || 0}</div>
                    <div>成就数量: ${achievements && achievements.length || 0}</div>
                    <div>LocalStorage: ${typeof Storage !== 'undefined' ? '可用' : '不可用'}</div>
                `;
            } catch (error) {
                storageEl.innerHTML = `<div style="color: #ff6b6b;">存储读取失败: ${error.message}</div>`;
            }
        } else {
            storageEl.innerHTML = '<div style="color: #ff6b6b;">存储实例未初始化</div>';
        }
    }

    updateErrors() {
        const errorsEl = document.getElementById('debug-errors');
        if (!errorsEl) return;

        if (this.errors.length === 0) {
            errorsEl.innerHTML = '<div>无错误</div>';
        } else {
            errorsEl.innerHTML = this.errors.slice(-5).map(error =>
                `<div class="error-item">${error.message}</div>`
            ).join('');
        }
    }

    updateWarnings() {
        const warningsEl = document.getElementById('debug-warnings');
        if (!warningsEl) return;

        if (this.warnings.length === 0) {
            warningsEl.innerHTML = '<div>无警告</div>';
        } else {
            warningsEl.innerHTML = this.warnings.slice(-5).map(warning =>
                `<div class="warning-item">${warning.message}</div>`
            ).join('');
        }
    }

    clearStorage() {
        if (typeof storage !== 'undefined' && storage) {
            storage.clearAllData();
            this.logWarning('存储数据已清除');
            this.updateDebugPanel();
        }
    }

    resetGame() {
        if (typeof game !== 'undefined' && game) {
            game.currentScore = 0;
            game.currentLevel = 1;
            game.streak = 0;
            game.totalAttempts = 0;
            game.correctAnswers = 0;
            game.scenarioManager.reset();
            game.switchScreen('main-menu');
            this.logWarning('游戏已重置');
            this.updateDebugPanel();
        }
    }

    exportData() {
        if (typeof storage !== 'undefined' && storage) {
            const data = storage.exportData();
            if (data) {
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `fanzha-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                this.logWarning('数据已导出');
            }
        }
    }

    testScenarios() {
        if (typeof game !== 'undefined' && game && game.scenarioManager) {
            const scenario = game.scenarioManager.getRandomScenario();
            if (scenario) {
                console.log('测试场景:', scenario);
                this.logWarning('场景测试完成，查看控制台');
            }
        }
    }

    // 检查游戏完整性
    checkGameIntegrity() {
        const issues = [];

        // 检查必要的全局变量
        if (typeof game === 'undefined') {
            issues.push('游戏实例未初始化');
        }

        if (typeof storage === 'undefined') {
            issues.push('存储实例未初始化');
        }

        if (typeof tutorial === 'undefined') {
            issues.push('教程实例未初始化');
        }

        // 检查DOM元素
        const requiredElements = ['main-menu', 'game-screen', 'tutorial-screen'];
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                issues.push(`缺少必要的DOM元素: ${id}`);
            }
        });

        // 检查LocalStorage
        if (typeof Storage === 'undefined') {
            issues.push('LocalStorage不可用');
        }

        if (issues.length > 0) {
            this.logWarning('游戏完整性检查发现问题', issues);
            return false;
        }

        return true;
    }
}

// 导出类供初始化管理器使用
// 全局实例将由初始化管理器创建

// 等待初始化完成后添加快捷键支持
window.addEventListener('gameInitialized', () => {
    console.log('调试工具初始化完成');

    // 添加快捷键支持
    document.addEventListener('keydown', (event) => {
        // Ctrl+Shift+D 切换调试面板
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            event.preventDefault();
            if (window.debugManager) {
                window.debugManager.togglePanel();
            }
        }
    });

    // 进行完整性检查
    setTimeout(() => {
        if (window.debugManager) {
            window.debugManager.checkGameIntegrity();
            window.debugManager.updateDebugPanel();
        }
    }, 2000);
});