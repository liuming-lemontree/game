// 连续答对和额外积分奖励系统
class StreakRewardSystem {
    constructor() {
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.sessionStreak = 0;
        this.multiplier = 1.0;
        this.bonusPoints = 0;
        this.streakHistory = [];
        this.lastCorrectTime = null;
        this.streakTimeout = null;

        this.rewards = {
            streak_3: { streak: 3, multiplier: 1.2, bonus: 10, message: '三连胜！获得额外积分', icon: '🔥' },
            streak_5: { streak: 5, multiplier: 1.5, bonus: 25, message: '五连胜！表现精彩', icon: '⚡' },
            streak_10: { streak: 10, multiplier: 2.0, bonus: 50, message: '十连胜！防骗达人', icon: '🏆' },
            streak_15: { streak: 15, multiplier: 2.5, bonus: 100, message: '十五连胜！防骗专家', icon: '👑' },
            streak_20: { streak: 20, multiplier: 3.0, bonus: 200, message: '二十连胜！传奇防骗大师', icon: '🌟' }
        };

        this.comboRewards = {
            speed_combo: { threshold: 5000, bonus: 5, message: '快速回答！', icon: '⚡' },
            perfect_combo: { threshold: 3, bonus: 15, message: '完美连击！', icon: '💯' },
            difficulty_combo: { threshold: 5, bonus: 20, message: '困难关卡连击！', icon: '🔥' }
        };

        this.loadStreakData();
        this.initializeEventListeners();
    }

    // 加载连续答对数据
    loadStreakData() {
        try {
            const saved = localStorage.getItem('streakData');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.bestStreak = parsed.bestStreak || 0;
                this.streakHistory = parsed.streakHistory || [];
            }
        } catch (error) {
            console.warn('加载连续答对数据失败:', error);
        }
    }

    // 保存连续答对数据
    saveStreakData() {
        try {
            const data = {
                bestStreak: this.bestStreak,
                streakHistory: this.streakHistory.slice(-50) // 只保留最近50条记录
            };
            localStorage.setItem('streakData', JSON.stringify(data));
        } catch (error) {
            console.warn('保存连续答对数据失败:', error);
        }
    }

    // 处理场景答题结果
    handleScenarioResult(scenarioId, isCorrect, basePoints, difficulty, responseTime) {
        const result = {
            scenarioId,
            isCorrect,
            basePoints,
            difficulty,
            responseTime,
            timestamp: Date.now(),
            totalPoints: 0,
            bonusPoints: 0,
            multiplier: 1.0,
            streak: this.currentStreak
        };

        if (isCorrect) {
            // 正确答案处理
            this.handleCorrectAnswer(result);
        } else {
            // 错误答案处理
            this.handleWrongAnswer(result);
        }

        // 保存到历史记录
        this.streakHistory.push(result);
        this.saveStreakData();

        // 触发事件
        window.dispatchEvent(new CustomEvent('streakUpdated', {
            detail: {
                currentStreak: this.currentStreak,
                bestStreak: this.bestStreak,
                result: result
            }
        }));

        return result;
    }

    // 处理正确答案
    handleCorrectAnswer(result) {
        this.currentStreak++;
        this.sessionStreak++;

        // 更新最佳记录
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }

        // 计算倍数和奖励
        const streakReward = this.calculateStreakReward();
        const comboRewards = this.calculateComboRewards(result);

        // 应用倍数
        result.multiplier = streakReward.multiplier;
        result.totalPoints = Math.floor(result.basePoints * streakReward.multiplier);

        // 计算额外奖励
        result.bonusPoints = streakReward.bonus + comboRewards.totalBonus;
        result.totalPoints += result.bonusPoints;

        // 显示奖励动画
        this.showRewardAnimation(streakReward, comboRewards);

        // 设置连击超时
        this.setStreakTimeout();

        // 记录时间
        this.lastCorrectTime = Date.now();
    }

    // 处理错误答案
    handleWrongAnswer(result) {
        this.currentStreak = 0;
        this.multiplier = 1.0;
        result.totalPoints = 0;
        result.bonusPoints = 0;
        result.multiplier = 1.0;

        // 清除连击超时
        this.clearStreakTimeout();

        // 显示连击结束提示
        this.showStreakEndAnimation();
    }

    // 计算连续答对奖励
    calculateStreakReward() {
        let reward = { streak: 0, multiplier: 1.0, bonus: 0, message: '', icon: '' };

        // 找到当前连击数对应的最高奖励
        Object.values(this.rewards).forEach(r => {
            if (this.currentStreak >= r.streak && r.streak > reward.streak) {
                reward = { ...r };
            }
        });

        return reward;
    }

    // 计算连击奖励
    calculateComboRewards(result) {
        const rewards = [];

        // 快速回答奖励
        if (result.responseTime && result.responseTime < this.comboRewards.speed_combo.threshold) {
            rewards.push({
                type: 'speed',
                bonus: this.comboRewards.speed_combo.bonus,
                message: this.comboRewards.speed_combo.message,
                icon: this.comboRewards.speed_combo.icon
            });
        }

        // 难度连击奖励
        const recentHardScenarios = this.getRecentScenarios(5)
            .filter(s => s.isCorrect && s.difficulty === 'hard')
            .length;

        if (recentHardScenarios >= this.comboRewards.difficulty_combo.threshold) {
            rewards.push({
                type: 'difficulty',
                bonus: this.comboRewards.difficulty_combo.bonus,
                message: this.comboRewards.difficulty_combo.message,
                icon: this.comboRewards.difficulty_combo.icon
            });
        }

        // 完美连击奖励（全部正确且无超时）
        const recentScenarios = this.getRecentScenarios(this.comboRewards.perfect_combo.threshold);
        const isPerfectCombo = recentScenarios.length >= this.comboRewards.perfect_combo.threshold &&
            recentScenarios.every(s => s.isCorrect && s.responseTime < 10000);

        if (isPerfectCombo) {
            rewards.push({
                type: 'perfect',
                bonus: this.comboRewards.perfect_combo.bonus,
                message: this.comboRewards.perfect_combo.message,
                icon: this.comboRewards.perfect_combo.icon
            });
        }

        return {
            rewards: rewards,
            totalBonus: rewards.reduce((sum, r) => sum + r.bonus, 0)
        };
    }

    // 获取最近的场景记录
    getRecentScenarios(count) {
        return this.streakHistory.slice(-count);
    }

    // 设置连击超时
    setStreakTimeout() {
        this.clearStreakTimeout();
        this.streakTimeout = setTimeout(() => {
            this.resetStreak();
            this.showStreakTimeoutAnimation();
        }, 30000); // 30秒无操作重置连击
    }

    // 清除连击超时
    clearStreakTimeout() {
        if (this.streakTimeout) {
            clearTimeout(this.streakTimeout);
            this.streakTimeout = null;
        }
    }

    // 重置连击
    resetStreak() {
        this.currentStreak = 0;
        this.multiplier = 1.0;
    }

    // 显示奖励动画
    showRewardAnimation(streakReward, comboRewards) {
        if (streakReward.streak > 0) {
            this.createFloatingText(streakReward.message, '#28a745', 'large');
            this.createFloatingText(`×${streakReward.multiplier} 倍数！`, '#ffc107', 'medium');
            if (streakReward.bonus > 0) {
                this.createFloatingText(`+${streakReward.bonus} 奖励积分`, '#17a2b8', 'medium');
            }
        }

        // 显示连击奖励
        comboRewards.rewards.forEach(reward => {
            setTimeout(() => {
                this.createFloatingText(
                    `${reward.icon} ${reward.message} +${reward.bonus}`,
                    '#e83e8c',
                    'small'
                );
            }, 200);
        });
    }

    // 显示连击结束动画
    showStreakEndAnimation() {
        if (this.sessionStreak > 0) {
            this.createFloatingText(`连击结束！本次连击：${this.sessionStreak}次`, '#dc3545', 'large');
            this.sessionStreak = 0;
        }
    }

    // 显示连击超时动画
    showStreakTimeoutAnimation() {
        this.createFloatingText('连击超时，重新开始', '#6c757d', 'medium');
    }

    // 创建飘动文字效果
    createFloatingText(text, color = '#28a745', size = 'medium') {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;

        const sizeClasses = {
            small: 'text-small',
            medium: 'text-medium',
            large: 'text-large'
        };

        floatingText.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: ${color};
            font-weight: bold;
            font-size: ${size === 'small' ? '1rem' : size === 'medium' ? '1.5rem' : '2rem'};
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            pointer-events: none;
            animation: floatUp 2s ease-out forwards;
            white-space: nowrap;
        `;

        document.body.appendChild(floatingText);

        // 动画结束后移除元素
        setTimeout(() => {
            if (floatingText.parentNode) {
                floatingText.parentNode.removeChild(floatingText);
            }
        }, 2000);
    }

    // 获取连击统计
    getStreakStats() {
        const recentHistory = this.streakHistory.slice(-20);
        const correctCount = recentHistory.filter(s => s.isCorrect).length;
        const averageResponseTime = recentHistory
            .filter(s => s.responseTime)
            .reduce((sum, s, _, arr) => sum + s.responseTime / arr.length, 0);

        return {
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            sessionStreak: this.sessionStreak,
            multiplier: this.multiplier,
            recentAccuracy: recentHistory.length > 0 ? (correctCount / recentHistory.length) * 100 : 0,
            averageResponseTime: Math.round(averageResponseTime),
            totalBonusPoints: this.streakHistory.reduce((sum, s) => sum + (s.bonusPoints || 0), 0),
            streakMilestones: this.getStreakMilestones()
        };
    }

    // 获取连击里程碑
    getStreakMilestones() {
        const milestones = [];
        Object.values(this.rewards).forEach(reward => {
            if (this.bestStreak >= reward.streak) {
                milestones.push(reward);
            }
        });
        return milestones.sort((a, b) => b.streak - a.streak);
    }

    // 创建连击显示UI
    createStreakDisplay() {
        const stats = this.getStreakStats();

        const html = `
            <div class="streak-display">
                <div class="current-streak">
                    <div class="streak-icon">🔥</div>
                    <div class="streak-number">${this.currentStreak}</div>
                    <div class="streak-label">连击</div>
                </div>

                ${this.multiplier > 1 ? `
                    <div class="streak-multiplier">
                        <div class="multiplier-icon">⚡</div>
                        <div class="multiplier-number">×${this.multiplier.toFixed(1)}</div>
                        <div class="multiplier-label">倍数</div>
                    </div>
                ` : ''}

                <div class="best-streak">
                    <div class="best-icon">🏆</div>
                    <div class="best-number">${this.bestStreak}</div>
                    <div class="best-label">最佳</div>
                </div>

                <div class="streak-progress">
                    <div class="progress-label">距离下一奖励</div>
                    <div class="progress-bar">
                        ${this.createStreakProgressBar()}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    // 创建连击进度条
    createStreakProgressBar() {
        const nextMilestone = this.getNextMilestone();
        if (!nextMilestone) {
            return '<div class="progress-complete">已达成所有连击奖励！</div>';
        }

        const currentProgress = this.currentStreak;
        const prevMilestone = this.getPreviousMilestone();
        const prevStreak = prevMilestone ? prevMilestone.streak : 0;
        const nextStreak = nextMilestone.streak;
        const progress = ((currentProgress - prevStreak) / (nextStreak - prevStreak)) * 100;

        return `
            <div class="progress-track">
                <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                <div class="progress-text">${currentProgress} / ${nextStreak} ${nextMilestone.icon}</div>
            </div>
        `;
    }

    // 获取下一个里程碑
    getNextMilestone() {
        for (const reward of Object.values(this.rewards)) {
            if (this.currentStreak < reward.streak) {
                return reward;
            }
        }
        return null;
    }

    // 获取上一个里程碑
    getPreviousMilestone() {
        let prevMilestone = null;
        for (const reward of Object.values(this.rewards)) {
            if (this.currentStreak >= reward.streak) {
                prevMilestone = reward;
            }
        }
        return prevMilestone;
    }

    // 添加连击样式
    addStreakStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                50% {
                    opacity: 1;
                    transform: translate(-50%, -70%) scale(1.2);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -100%) scale(1);
                }
            }

            .streak-display {
                background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
                border-radius: 15px;
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
                color: white;
                text-align: center;
            }

            .current-streak,
            .best-streak,
            .streak-multiplier {
                display: inline-block;
                margin: 0 15px;
                vertical-align: top;
            }

            .streak-icon,
            .best-icon,
            .multiplier-icon {
                font-size: 2rem;
                margin-bottom: 5px;
            }

            .streak-number,
            .best-number,
            .multiplier-number {
                font-size: 2.5rem;
                font-weight: bold;
                line-height: 1;
                margin-bottom: 5px;
            }

            .streak-label,
            .best-label,
            .multiplier-label {
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .streak-progress {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(255, 255, 255, 0.3);
            }

            .progress-label {
                font-size: 0.9rem;
                margin-bottom: 8px;
            }

            .progress-track {
                position: relative;
                background: rgba(255, 255, 255, 0.3);
                height: 8px;
                border-radius: 4px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #fff, #feca57);
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            .progress-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 0.8rem;
                font-weight: bold;
                color: #333;
            }

            .progress-complete {
                font-weight: bold;
                font-size: 1rem;
            }

            .floating-text {
                animation: floatUp 2s ease-out forwards;
                font-family: 'Noto Sans SC', sans-serif;
            }
        `;

        document.head.appendChild(style);
    }

    // 初始化事件监听器
    initializeEventListeners() {
        // 监听场景完成事件
        window.addEventListener('scenarioCompleted', (e) => {
            const { scenarioId, isCorrect, points, difficulty, responseTime } = e.detail;
            this.handleScenarioResult(scenarioId, isCorrect, points, difficulty, responseTime);
        });

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.clearStreakTimeout();
            } else {
                if (this.currentStreak > 0) {
                    this.setStreakTimeout();
                }
            }
        });
    }

    // 重置会话数据
    resetSession() {
        this.sessionStreak = 0;
        this.currentStreak = 0;
        this.multiplier = 1.0;
        this.clearStreakTimeout();
    }
}

// 创建全局连击奖励系统实例
let streakRewardSystem;

function initializeStreakRewardSystem() {
    streakRewardSystem = new StreakRewardSystem();
    window.streakRewardSystem = streakRewardSystem;

    // 添加样式
    streakRewardSystem.addStreakStyles();

    console.log('🔥 连击奖励系统已初始化');
}

// 初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStreakRewardSystem);
} else {
    initializeStreakRewardSystem();
}

// 导出
window.StreakRewardSystem = StreakRewardSystem;