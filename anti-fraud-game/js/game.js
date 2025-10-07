// 游戏核心逻辑
class AntiFraudGame {
    constructor() {
        try {
            this.currentScreen = 'main-menu';
            this.currentScenario = null;
            this.currentScore = 0;
            this.currentLevel = 1;
            this.streak = 0; // 连续答对次数
            this.totalAttempts = 0;
            this.correctAnswers = 0;
            
            // 添加防御性检查，确保EnhancedScenarioManager可用
            try {
                this.scenarioManager = typeof EnhancedScenarioManager !== 'undefined' ? new EnhancedScenarioManager() : null;
                if (!this.scenarioManager && typeof window.enhancedScenarioManager !== 'undefined') {
                    this.scenarioManager = window.enhancedScenarioManager;
                }
            } catch (error) {
                console.warn('创建EnhancedScenarioManager实例失败:', error);
                this.scenarioManager = null;
            }
            
            this.sessionStartTime = null;
            this.sessionScenarios = [];
            this.gameSettings = {
                soundEnabled: true,
                vibrationEnabled: true,
                difficulty: 'mixed',
                language: 'zh-CN'
            };

            // 延迟初始化，确保DOM完全加载
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeGame());
            } else {
                setTimeout(() => this.initializeGame(), 100); // 延迟一点时间确保DOM完全准备好
            }
        } catch (error) {
            console.error('AntiFraudGame构造函数出错:', error);
            // 即使构造函数出错，也要确保backToMenu方法可用
            this.backToMenu = function() {
                console.log('返回主菜单方法被调用');
                // 尝试切换到主菜单
                const screens = document.querySelectorAll('.screen');
                if (screens) {
                    screens.forEach(screen => {
                        if (screen && screen.classList) {
                            screen.classList.remove('active');
                        }
                    });
                }
                
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu && mainMenu.classList) {
                    mainMenu.classList.add('active');
                }
            };
        }
    }

    initializeGame() {
        try {
            // 绑定事件
            try {
                this.bindEvents();
            } catch (error) {
                console.error('绑定事件时出错:', error);
            }
            
            // 隐藏加载屏幕
            setTimeout(() => {
                try {
                    const loadingScreen = document.getElementById('loading');
                    if (loadingScreen) {
                        loadingScreen.style.display = 'none';
                    }
                } catch (error) {
                    console.error('隐藏加载屏幕时出错:', error);
                }
            }, 1000);

            // 更新主菜单统计数据（仅当相关DOM元素存在时）
            try {
                if (document.getElementById('high-score') && document.getElementById('completed-levels')) {
                    this.updateMainMenuStats();
                }
            } catch (error) {
                console.error('更新主菜单统计数据时出错:', error);
            }

            // 初始化游戏设置
            try {
                this.loadGameSettings();
            } catch (error) {
                console.error('初始化游戏设置时出错:', error);
            }

            // 检查首次访问
            try {
                this.checkFirstVisit();
            } catch (error) {
                console.error('检查首次访问时出错:', error);
            }

            // 添加游戏样式
            try {
                this.addGameStyles();
            } catch (error) {
                console.error('添加游戏样式时出错:', error);
            }
        } catch (error) {
            console.error('游戏初始化时出错:', error);
        }
    }

    bindEvents() {
        try {
            // 监听屏幕方向变化
            window.addEventListener('orientationchange', () => {
                try {
                    this.handleOrientationChange();
                } catch (error) {
                    console.error('处理屏幕方向变化时出错:', error);
                }
            });

            // 监听页面可见性变化
            document.addEventListener('visibilitychange', () => {
                try {
                    this.handleVisibilityChange();
                } catch (error) {
                    console.error('处理页面可见性变化时出错:', error);
                }
            });

            // 防止意外关闭页面时丢失进度
            window.addEventListener('beforeunload', (e) => {
                try {
                    if (this.currentScreen === 'game-screen' && this.sessionStartTime) {
                        e.preventDefault();
                        e.returnValue = '游戏正在进行中，确定要离开吗？';
                    }
                } catch (error) {
                    console.error('处理页面关闭事件时出错:', error);
                }
            });
        } catch (error) {
            console.error('绑定事件时出错:', error);
        }
    }

    // 屏幕切换
    switchScreen(screenId) {
        try {
            // 隐藏所有屏幕
            const screens = document.querySelectorAll('.screen');
            if (screens) {
                screens.forEach(screen => {
                    if (screen && screen.classList) {
                        screen.classList.remove('active');
                    }
                });
            }

            // 激活目标屏幕
            const targetScreen = document.getElementById(screenId);
            if (targetScreen && targetScreen.classList) {
                targetScreen.classList.add('active');
                this.currentScreen = screenId;

                // 屏幕切换后的特殊处理
                try {
                    if (screenId === 'achievements-screen') {
                        this.loadAchievements();
                    } else if (screenId === 'tutorial-screen') {
                        if (window.tutorial && typeof window.tutorial.showCategory === 'function') {
                            tutorial.showCategory('phone'); // 默认显示电话诈骗教程
                        }
                    }
                } catch (error) {
                    console.error('屏幕切换后处理出错:', error);
                }
                
                // 更新触控增强元素
                try {
                    this.updateTouchEnhancements();
                } catch (error) {
                    console.error('更新触控增强元素时出错:', error);
                }
            }
        } catch (error) {
            console.error('切换屏幕时出错:', error);
        }
    }

    // 显示加载动画
    showLoadingAnimation() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>正在加载游戏场景...</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);

        // 2秒后自动隐藏加载动画
        setTimeout(() => {
            this.hideLoadingAnimation();
        }, 2000);
    }

    // 隐藏加载动画
    hideLoadingAnimation() {
        const loadingOverlay = document.getElementById('loading-overlay');
       