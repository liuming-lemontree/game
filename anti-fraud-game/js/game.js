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
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    // 开始游戏
    startGame() {
        // 添加按钮点击反馈
        const startButton = document.querySelector('.btn-primary[onclick*="startGame"]');
        if (startButton) {
            startButton.classList.add('clicked');
            setTimeout(() => {
                startButton.classList.remove('clicked');
            }, 300);
        }

        // 显示加载动画
        this.showLoadingAnimation();

        // 延迟执行游戏开始逻辑，让用户看到反馈
        setTimeout(() => {
            this.currentScore = 0;
            this.currentLevel = 1;
            this.streak = 0;
            this.sessionStartTime = new Date();
            this.sessionScenarios = [];

            this.switchScreen('game-screen');
            this.loadScenario();
        }, 500);
    }

    // 加载场景
    loadScenario() {
        // 根据关卡获取合适难度的场景
        let difficulty = this.getDifficultyByLevel();
        this.currentScenario = this.scenarioManager.getRandomScenario(difficulty);

        if (!this.currentScenario) {
            this.showGameComplete();
            return;
        }

        this.sessionScenarios.push(this.currentScenario.id);
        this.renderScenario();
        this.updateGameUI();
    }

    getDifficultyByLevel() {
        // 根据关卡动态调整难度
        if (this.currentLevel <= 3) return 'easy';
        if (this.currentLevel <= 6) return 'medium';
        if (this.currentLevel <= 9) return 'hard';
        return 'mixed'; // 高级关卡混合难度
    }

    renderScenario() {
        const scenarioContainer = document.getElementById('scenario-container');
        const choicesContainer = document.getElementById('choices-container');
        const feedbackContainer = document.getElementById('feedback-container');
        const nextBtn = document.getElementById('next-btn');

        // 清空容器
        scenarioContainer.innerHTML = '';
        choicesContainer.innerHTML = '';
        feedbackContainer.innerHTML = '';
        feedbackContainer.classList.add('hidden');
        nextBtn.classList.add('hidden');

        // 渲染场景内容
        const scenarioTypeNames = {
            phone: '电话诈骗',
            sms: '短信诈骗',
            network: '网络诈骗',
            social: '社交诈骗'
        };

        scenarioContainer.innerHTML = `
            <div class="scenario-type">${scenarioTypeNames[this.currentScenario.type] || '诈骗场景'}</div>
            ${this.currentScenario.sender ? `<div class="scenario-sender">发件人：${this.currentScenario.sender}</div>` : ''}
            <div class="scenario-content">${this.currentScenario.content}</div>
        `;

        // 渲染选择选项
        this.currentScenario.choices.forEach((choice, index) => {
            const choiceBtn = document.createElement('button');
            choiceBtn.className = 'choice-btn';
            choiceBtn.innerHTML = `
                <span class="choice-text">${choice.text}</span>
                <span class="choice-icon hidden"></span>
            `;
            choiceBtn.onclick = () => this.selectChoice(index);
            choicesContainer.appendChild(choiceBtn);
        });

        // 添加动画效果
        setTimeout(() => {
            scenarioContainer.style.animation = 'slideUp 0.3s ease forwards';
        }, 100);

        setTimeout(() => {
            const choices = choicesContainer.querySelectorAll('.choice-btn');
            choices.forEach((choice, index) => {
                setTimeout(() => {
                    choice.style.animation = 'slideUp 0.3s ease forwards';
                }, index * 100);
            });
        }, 300);
    }

    selectChoice(choiceIndex) {
        const choice = this.currentScenario.choices[choiceIndex];
        const choiceBtns = document.querySelectorAll('.choice-btn');
        const selectedBtn = choiceBtns[choiceIndex];

        // 禁用所有按钮
        choiceBtns.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'not-allowed';
        });

        // 标记选中的按钮
        selectedBtn.classList.add('selected');

        // 显示结果
        setTimeout(() => {
            this.showChoiceResult(choiceIndex, choice);
        }, 500);
    }

    showChoiceResult(choiceIndex, choice) {
        const choiceBtns = document.querySelectorAll('.choice-btn');
        const selectedBtn = choiceBtns[choiceIndex];
        const feedbackContainer = document.getElementById('feedback-container');
        const nextBtn = document.getElementById('next-btn');

        // 显示正确/错误图标
        const icon = selectedBtn.querySelector('.choice-icon');
        icon.classList.remove('hidden');
        icon.textContent = choice.isCorrect ? '✓' : '✗';

        // 标记正确/错误样式
        if (choice.isCorrect) {
            selectedBtn.classList.add('correct');
            this.correctAnswers++;
            this.streak++;
            this.currentScore += this.currentScenario.points || 100;

            // 连击奖励
            if (this.streak >= 3) {
                const bonusPoints = this.streak * 10;
                this.currentScore += bonusPoints;
                this.showStreakBonus(this.streak, bonusPoints);
            }
        } else {
            selectedBtn.classList.add('incorrect');
            this.streak = 0;

            // 显示正确答案
            const correctIndex = this.currentScenario.choices.findIndex(c => c.isCorrect);
            if (correctIndex !== -1 && correctIndex !== choiceIndex) {
                choiceBtns[correctIndex].classList.add('correct');
                const correctIcon = choiceBtns[correctIndex].querySelector('.choice-icon');
                correctIcon.classList.remove('hidden');
                correctIcon.textContent = '✓';
            }
        }

        this.totalAttempts++;

        // 显示反馈信息
        feedbackContainer.innerHTML = `
            <div class="feedback-content">
                <div class="feedback-title">
                    ${choice.isCorrect ? '✓ 回答正确！' : '✗ 回答错误'}
                </div>
                <div class="feedback-text">${choice.feedback}</div>
                ${choice.tips ? `
                    <div class="feedback-tips">
                        <strong>防诈骗小贴士：</strong><br>
                        ${choice.tips}
                    </div>
                ` : ''}
            </div>
        `;
        feedbackContainer.className = `feedback-container ${choice.isCorrect ? 'correct' : 'incorrect'}`;
        feedbackContainer.classList.remove('hidden');

        // 显示下一题按钮
        nextBtn.textContent = this.sessionScenarios.length >= 5 ? '完成游戏' : '下一题';
        nextBtn.classList.remove('hidden');

        // 更新游戏UI
        this.updateGameUI();

        // 检查成就
        this.checkAchievements();
    }

    showStreakBonus(streak, bonusPoints) {
        const bonusMessage = document.createElement('div');
        bonusMessage.className = 'streak-bonus';
        bonusMessage.innerHTML = `
            <div class="bonus-content">
                <div class="bonus-title">🔥 连击奖励！</div>
                <div class="bonus-text">连续答对${streak}题，获得${bonusPoints}分额外奖励！</div>
            </div>
        `;

        document.body.appendChild(bonusMessage);

        setTimeout(() => {
            bonusMessage.classList.add('show');
        }, 100);

        setTimeout(() => {
            bonusMessage.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(bonusMessage);
            }, 300);
        }, 2000);
    }

    nextScenario() {
        if (this.sessionScenarios.length >= 5) {
            this.endGame();
        } else {
            this.currentLevel++;
            this.loadScenario();
        }
    }

    updateGameUI() {
        document.getElementById('current-score').textContent = this.currentScore;
        document.getElementById('current-level').textContent = this.currentLevel;
    }

    // 游戏结束
    endGame() {
        const sessionTime = Math.round((new Date() - this.sessionStartTime) / 1000);
        const accuracy = this.totalAttempts > 0 ? Math.round((this.correctAnswers / this.totalAttempts) * 100) : 0;

        // 更新游戏数据
        this.updateGameData(accuracy, sessionTime);

        // 显示游戏结果
        this.showGameResults(accuracy, sessionTime);
    }

    updateGameData(accuracy, sessionTime) {
        const gameData = storage.getGameData() || {};

        // 更新统计数据
        gameData.totalScore += this.currentScore;
        gameData.totalAttempts += this.totalAttempts;
        gameData.correctAnswers += this.correctAnswers;
        gameData.completedLevels = Math.max(gameData.completedLevels || 0, this.currentLevel);
        gameData.highScore = Math.max(gameData.highScore || 0, this.currentScore);
        gameData.lastPlayedDate = new Date().toISOString();

        // 更新场景统计
        this.sessionScenarios.forEach(scenarioId => {
            const scenario = this.scenarioManager.getScenarioById(scenarioId);
            if (scenario && gameData.statistics[scenario.type]) {
                gameData.statistics[scenario.type].attempts++;
            }
        });

        // 记录完成的场景
        if (!gameData.completedScenarios) {
            gameData.completedScenarios = [];
        }
        this.sessionScenarios.forEach(scenarioId => {
            if (!gameData.completedScenarios.includes(scenarioId)) {
                gameData.completedScenarios.push(scenarioId);
            }
        });

        storage.saveGameData(gameData);
    }

    showGameResults(accuracy, sessionTime) {
        const resultsHTML = `
            <div class="game-results">
                <div class="results-header">
                    <h2>🎯 游戏完成！</h2>
                </div>

                <div class="results-stats">
                    <div class="stat-item">
                        <div class="stat-value">${this.currentScore}</div>
                        <div class="stat-label">本次得分</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${accuracy}%</div>
                        <div class="stat-label">正确率</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.round(sessionTime / 60)}</div>
                        <div class="stat-label">用时(分钟)</div>
                    </div>
                </div>

                <div class="results-feedback">
                    ${this.getPerformanceFeedback(accuracy)}
                </div>

                <div class="results-actions">
                    <button class="btn btn-primary" onclick="game.startGame()">再玩一次</button>
                    <button class="btn btn-secondary" onclick="game.backToMenu()">返回主页</button>
                </div>
            </div>
        `;

        const gameContainer = document.querySelector('.game-content');
        gameContainer.innerHTML = resultsHTML;

        // 检查时间挑战成就
        if (sessionTime <= 600 && this.correctAnswers >= 5) { // 10分钟内答对5题
            this.unlockTimeChallengeAchievement();
        }
    }

    getPerformanceFeedback(accuracy) {
        if (accuracy >= 90) {
            return `
                <div class="feedback-excellent">
                    <h3>🏆 表现优秀！</h3>
                    <p>您已经掌握了很好的防诈骗意识！继续保持这种警惕性，让诈骗分子无机可乘。</p>
                </div>
            `;
        } else if (accuracy >= 70) {
            return `
                <div class="feedback-good">
                    <h3>👍 表现良好！</h3>
                    <p>您的防诈骗意识不错，但还有提升空间。建议多学习教程，进一步提高识别诈骗的能力。</p>
                </div>
            `;
        } else {
            return `
                <div class="feedback-need-improvement">
                    <h3>📚 需要加强学习</h3>
                    <p>建议您先认真学习防诈骗教程，了解各种诈骗手段和防范方法，保护好自己的财产安全。</p>
                </div>
            `;
        }
    }

    showGameComplete() {
        const gameContainer = document.querySelector('.game-content');
        gameContainer.innerHTML = `
            <div class="game-complete">
                <h2>🎊 恭喜完成所有场景！</h2>
                <p>您已经学习了所有防诈骗场景，成为了真正的反诈先锋！</p>
                <div class="complete-actions">
                    <button class="btn btn-primary" onclick="game.startGame()">重新挑战</button>
                    <button class="btn btn-secondary" onclick="game.backToMenu()">返回主页</button>
                </div>
            </div>
        `;
    }

    // 成就系统
    checkAchievements() {
        const gameData = storage.getGameData();
        const newAchievements = storage.checkAchievements(gameData, this.streak);

        if (newAchievements.length > 0) {
            this.showAchievementNotifications(newAchievements);
        }
    }

    unlockTimeChallengeAchievement() {
        const achievement = storage.unlockAchievement('quick_learner');
        if (achievement) {
            this.showAchievementNotifications([achievement]);
        }
    }

    showAchievementNotifications(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                const notification = document.createElement('div');
                notification.className = 'achievement-notification';
                notification.innerHTML = `
                    <div class="notification-content">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-info">
                            <div class="achievement-title">🎉 成就解锁！</div>
                            <div class="achievement-name">${achievement.name}</div>
                            <div class="achievement-desc">${achievement.description}</div>
                            <div class="achievement-points">+${achievement.points} 积分</div>
                        </div>
                    </div>
                `;

                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.classList.add('show');
                }, 100);

                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 3000);

            }, index * 3500);
        });
    }

    // 教程相关
    showTutorial() {
        this.switchScreen('tutorial-screen');
    }

    // 成就相关
    showAchievements() {
        this.switchScreen('achievements-screen');
        this.loadAchievements();
    }

    loadAchievements() {
        const achievements = storage.getAchievements();
        const gameData = storage.getGameData();

        // 更新统计数据
        document.getElementById('total-score').textContent = gameData && gameData.totalScore || 0;
        document.getElementById('total-levels').textContent = gameData && gameData.completedLevels || 0;
        document.getElementById('accuracy-rate').textContent = storage.calculateAccuracy() + '%';

        // 渲染成就徽章
        const achievementsGrid = document.querySelector('.achievements-grid');
        achievementsGrid.innerHTML = achievements.map(achievement => `
            <div class="achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
                ${achievement.unlocked ? `
                    <div class="achievement-date">
                        ${new Date(achievement.unlockedDate).toLocaleDateString()}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    // 关于页面
    showAbout() {
        this.switchScreen('about-screen');
    }

    // 返回主菜单
    backToMenu() {
        this.switchScreen('main-menu');
        this.updateMainMenuStats();
        this.updateTouchEnhancements();
    }

    // 更新触控增强元素
    updateTouchEnhancements() {
        if (window.touchEnhancement && window.touchEnhancement.isActive) {
            console.log('🔄 更新触控增强元素');
            // 重新扫描页面上的交互元素
            window.touchEnhancement.enhanceAllInteractiveElements();
        }
    }

    updateMainMenuStats() {
        const gameData = storage.getGameData();
        if (gameData) {
            const highScoreElement = document.getElementById('high-score');
            const completedLevelsElement = document.getElementById('completed-levels');
            
            if (highScoreElement) {
                highScoreElement.textContent = gameData.highScore || 0;
            }
            
            if (completedLevelsElement) {
                completedLevelsElement.textContent = gameData.completedLevels || 0;
            }
        }
    }

    // 游戏设置
    loadGameSettings() {
        const gameData = storage.getGameData();
        if (gameData && gameData.gameSettings) {
            // 应用设置
            this.gameSettings = gameData.gameSettings;
        } else {
            this.gameSettings = {
                soundEnabled: true,
                vibrationEnabled: true,
                difficulty: 'mixed',
                language: 'zh-CN'
            };
        }
    }

    // 首次访问检查
    checkFirstVisit() {
        try {
            const gameData = storage.getGameData();
            if (!gameData || !gameData.tutorialShown) {
                // 确保DOM已准备就绪后再显示教程介绍
                if (document && document.body) {
                    this.showTutorialIntro();
                } else {
                    console.warn('DOM尚未完全准备就绪，延迟显示教程介绍');
                    setTimeout(() => this.checkFirstVisit(), 100);
                }
            }
        } catch (error) {
            console.error('检查首次访问时出错:', error);
        }
    }

    showTutorialIntro() {
        try {
            const introHTML = `
                <div class="tutorial-intro">
                    <div class="intro-content">
                        <h2>🎓 欢迎来到反诈先锋</h2>
                        <p>这是一个专门教你防范电信诈骗的教育游戏。</p>
                        <div class="intro-features">
                            <div class="feature-item">
                                <span class="feature-icon">📱</span>
                                <span class="feature-text">学习识别各种诈骗手段</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🎯</span>
                                <span class="feature-text">通过场景模拟实战演练</span>
                            </div>
                            <div class="feature-item">
                                <span class="feature-icon">🏆</span>
                                <span class="feature-text">解锁成就徽章</span>
                            </div>
                        </div>
                        <div class="intro-actions">
                            <button class="btn btn-primary" onclick="game.closeTutorialIntro()">开始学习</button>
                            <button class="btn btn-secondary" onclick="game.viewTutorial()">先看教程</button>
                        </div>
                    </div>
                </div>
            `;

            if (document && document.body) {
                const introDiv = document.createElement('div');
                introDiv.id = 'tutorial-intro';
                introDiv.innerHTML = introHTML;
                document.body.appendChild(introDiv);

                setTimeout(() => {
                    if (introDiv && introDiv.classList) {
                        introDiv.classList.add('show');
                    }
                }, 100);
            }
        } catch (error) {
            console.error('显示教程介绍时出错:', error);
        }
    }

    closeTutorialIntro() {
        try {
            const introDiv = document.getElementById('tutorial-intro');
            if (introDiv) {
                if (introDiv.classList) {
                    introDiv.classList.remove('show');
                }
                setTimeout(() => {
                    try {
                        const currentIntroDiv = document.getElementById('tutorial-intro');
                        if (currentIntroDiv && document.body) {
                            document.body.removeChild(currentIntroDiv);
                        }
                    } catch (innerError) {
                        console.error('移除教程介绍时出错:', innerError);
                    }
                }, 300);
            }
            
            // 标记教程已显示
            storage.updateGameData({ tutorialShown: true });
        } catch (error) {
            console.error('关闭教程介绍时出错:', error);
        }
    }

    viewTutorial() {
        this.closeTutorialIntro();
        this.showTutorial();
    }

    // 处理屏幕方向变化
    handleOrientationChange() {
        // 可以在这里添加横屏模式的特殊处理
        console.log('屏幕方向已改变');
    }

    // 处理页面可见性变化
    handleVisibilityChange() {
        if (document.hidden && this.currentScreen === 'game-screen') {
            // 页面隐藏时暂停游戏
            console.log('游戏已暂停');
        } else if (!document.hidden && this.currentScreen === 'game-screen') {
            // 页面显示时恢复游戏
            console.log('游戏已恢复');
        }
    } // 结束handleVisibilityChange方法

    // 添加游戏样式
    addGameStyles() {
        const gameStyles = `
<style>
.game-results, .game-complete {
    text-align: center;
    padding: 20px;
}

.results-header h2 {
    color: #667eea;
    margin-bottom: 24px;
    font-size: 28px;
}

.results-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
}

.stat-item {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 12px;
    text-align: center;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 14px;
    color: #666;
}

.results-feedback {
    margin-bottom: 24px;
    padding: 16px;
    border-radius: 12px;
}

.feedback-excellent {
    background: #d4edda;
    color: #155724;
}

.feedback-good {
    background: #fff3cd;
    color: #856404;
}

.feedback-need-improvement {
    background: #f8d7da;
    color: #721c24;
}

.results-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.complete-actions {
    margin-top: 24px;
}

.streak-bonus {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
    text-align: center;
    min-width: 250px;
}

.streak-bonus.show {
    opacity: 1;
}

.bonus-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
}

.bonus-text {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
}

.achievement-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    min-width: 200px;
    max-width: 90vw;
}

.achievement-notification.show {
    opacity: 1;
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 12px;
}

.achievement-icon {
    font-size: 32px;
    flex-shrink: 0;
}

.achievement-info {
    flex: 1;
}

.achievement-title {
    font-size: 16px;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 4px;
}

.achievement-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 2px;
}

.achievement-desc {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
}

.achievement-points {
    font-size: 12px;
    color: #28a745;
    font-weight: 600;
}

.tutorial-intro {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.tutorial-intro.show {
    opacity: 1;
}

.intro-content {
    background: white;
    border-radius: 16px;
    padding: 32px;
    margin: 20px;
    max-width: 267px;
    text-align: center;
}

.intro-content h2 {
    color: #667eea;
    margin-bottom: 16px;
    font-size: 24px;
}

.intro-content p {
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
}

.intro-features {
    text-align: left;
    margin-bottom: 32px;
}

.feature-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 12px;
}

</style>
`;
        
        // 添加样式到页面头部
        document.head.insertAdjacentHTML('beforeend', gameStyles);
    } // 结束addGameStyles方法

} // 结束AntiFraudGame类

// 确保AntiFraudGame在全局范围内可用
if (typeof window !== 'undefined') {
    window.AntiFraudGame = AntiFraudGame;
    
    // 初始化游戏实例
    try {
        window.game = new AntiFraudGame();
    } catch (error) {
        console.error('初始化游戏实例失败:', error);
        // 确保即使初始化失败也有基本的game对象
        window.game = {
            backToMenu: function() {
                alert('返回主菜单');
                window.history.back();
            }
        };
    }
}