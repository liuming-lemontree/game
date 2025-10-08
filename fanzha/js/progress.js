// 学习进度管理器
class ProgressManager {
    constructor() {
        this.storage = window.storageManager;
        this.gameStats = null;
        this.learningHistory = [];
        this.goals = this.getDefaultGoals();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProgressData();
    }

    // 绑定事件
    bindEvents() {
        // 学习进度按钮
        const progressBtn = document.getElementById('progress-btn');
        if (progressBtn) {
            progressBtn.addEventListener('click', () => this.showProgressPanel());
        }

        // 关闭进度面板
        const closeProgressBtn = document.getElementById('close-progress');
        if (closeProgressBtn) {
            closeProgressBtn.addEventListener('click', () => this.hideProgressPanel());
        }
    }

    // 加载进度数据
    loadProgressData() {
        // 加载游戏统计数据
        const gameProgress = this.storage.loadProgress();
        if (gameProgress) {
            this.gameStats = gameProgress.gameStats || gameProgress;
        }

        // 加载学习历史
        const historyData = localStorage.getItem('learningHistory');
        if (historyData) {
            try {
                this.learningHistory = JSON.parse(historyData);
            } catch (error) {
                console.error('加载学习历史失败:', error);
                this.learningHistory = [];
            }
        }

        // 加载自定义目标
        const customGoals = localStorage.getItem('learningGoals');
        if (customGoals) {
            try {
                this.goals = { ...this.goals, ...JSON.parse(customGoals) };
            } catch (error) {
                console.error('加载学习目标失败:', error);
            }
        }
    }

    // 面板显示/隐藏现在由PageManager管理
    // 当切换到进度页面时，会自动调用updateProgressDisplay()

    // 更新进度显示
    updateProgressDisplay() {
        this.updateOverallProgress();
        this.updateCategoryProgress();
        this.updateDifficultyProgress();
        this.updateLearningCurve();
        this.updateLearningSuggestions();
        this.updateLearningGoals();
    }

    // 更新总体进度
    updateOverallProgress() {
        const totalAnswered = this.gameStats?.totalAnswered || 0;
        const totalScenarios = window.scenarios.length;
        const accuracy = this.gameStats?.totalAnswered > 0 ?
            Math.round((this.gameStats.correctAnswers / this.gameStats.totalAnswered) * 100) : 0;

        // 更新统计数字
        const totalAnsweredElement = document.getElementById('total-answered');
        if (totalAnsweredElement) {
            totalAnsweredElement.textContent = totalAnswered;
        }

        const accuracyRateElement = document.getElementById('accuracy-rate');
        if (accuracyRateElement) {
            accuracyRateElement.textContent = `${accuracy}%`;
        }

        // 更新圆形进度条
        const percentage = Math.min(Math.round((totalAnswered / totalScenarios) * 100), 100);
        const circleElement = document.querySelector('.circle');
        const percentageElement = document.querySelector('.percentage');

        if (circleElement) {
            const circumference = 2 * Math.PI * 15.9155;
            const offset = circumference - (percentage / 100) * circumference;
            circleElement.style.strokeDasharray = `${percentage}, 100`;
        }

        if (percentageElement) {
            percentageElement.textContent = `${percentage}%`;
        }
    }

    // 更新分类进度
    updateCategoryProgress() {
        const categoryProgress = this.calculateCategoryProgress();
        const container = document.getElementById('category-progress');

        if (!container) return;

        container.innerHTML = Object.entries(categoryProgress).map(([category, data]) => {
            const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
            const accuracy = data.correct > 0 ? Math.round((data.correct / data.completed) * 100) : 0;

            return `
                <div class="category-item">
                    <div class="category-name">${category}</div>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="category-stats">
                        完成度: ${percentage}% | 正确率: ${accuracy}%
                    </div>
                </div>
            `;
        }).join('');
    }

    // 计算分类进度
    calculateCategoryProgress() {
        const categories = {};
        const answeredScenarios = this.gameStats?.answeredScenarios || new Set();

        // 初始化分类
        window.scenarios.forEach(scenario => {
            if (!categories[scenario.type]) {
                categories[scenario.type] = {
                    total: 0,
                    completed: 0,
                    correct: 0
                };
            }
            categories[scenario.type].total++;
        });

        // 统计已完成和正确的情况
        answeredScenarios.forEach(scenarioId => {
            const scenario = window.scenarios.find(s => s.id === scenarioId);
            if (scenario && categories[scenario.type]) {
                categories[scenario.type].completed++;

                // 这里需要记录答题是否正确，暂时假设都正确
                // 实际应该从详细记录中获取
                if (this.gameStats?.correctAnswers) {
                    categories[scenario.type].correct++;
                }
            }
        });

        return categories;
    }

    // 更新难度进度
    updateDifficultyProgress() {
        const difficultyProgress = this.calculateDifficultyProgress();
        const container = document.getElementById('difficulty-progress');

        if (!container) return;

        const difficultyClasses = {
            '简单': 'difficulty-easy',
            '中等': 'difficulty-medium',
            '困难': 'difficulty-hard'
        };

        container.innerHTML = Object.entries(difficultyProgress).map(([difficulty, data]) => {
            const cssClass = difficultyClasses[difficulty] || '';

            return `
                <div class="difficulty-item ${cssClass}">
                    <div class="difficulty-name">${difficulty}</div>
                    <div class="difficulty-count">${data.completed}</div>
                    <div class="difficulty-label">已完成 / ${data.total}</div>
                </div>
            `;
        }).join('');
    }

    // 计算难度进度
    calculateDifficultyProgress() {
        const difficulties = {
            '简单': { total: 0, completed: 0 },
            '中等': { total: 0, completed: 0 },
            '困难': { total: 0, completed: 0 }
        };

        const answeredScenarios = this.gameStats?.answeredScenarios || new Set();

        // 统计各难度总数
        window.scenarios.forEach(scenario => {
            if (difficulties[scenario.difficulty]) {
                difficulties[scenario.difficulty].total++;
            }
        });

        // 统计已完成数量
        answeredScenarios.forEach(scenarioId => {
            const scenario = window.scenarios.find(s => s.id === scenarioId);
            if (scenario && difficulties[scenario.difficulty]) {
                difficulties[scenario.difficulty].completed++;
            }
        });

        return difficulties;
    }

    // 更新学习曲线
    updateLearningCurve() {
        const canvas = document.getElementById('learning-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // 清空画布
        ctx.clearRect(0, 0, width, height);

        // 准备数据
        const data = this.prepareLearningCurveData();
        if (data.length < 2) return;

        // 绘制坐标轴
        this.drawAxes(ctx, width, height);

        // 绘制学习曲线
        this.drawLearningCurve(ctx, data, width, height);

        // 绘制数据点
        this.drawDataPoints(ctx, data, width, height);
    }

    // 准备学习曲线数据
    prepareLearningCurveData() {
        // 如果没有历史数据，生成模拟数据
        if (this.learningHistory.length === 0) {
            return this.generateSampleData();
        }

        return this.learningHistory.map(record => ({
            date: new Date(record.date),
            accuracy: record.accuracy || 0,
            answered: record.answered || 0
        }));
    }

    // 生成示例数据
    generateSampleData() {
        const data = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            data.push({
                date: date,
                accuracy: Math.floor(Math.random() * 30) + 60, // 60-90%
                answered: Math.floor(Math.random() * 10) + 1   // 1-10题
            });
        }

        return data;
    }

    // 绘制坐标轴
    drawAxes(ctx, width, height) {
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;

        // X轴
        ctx.beginPath();
        ctx.moveTo(40, height - 30);
        ctx.lineTo(width - 20, height - 30);
        ctx.stroke();

        // Y轴
        ctx.beginPath();
        ctx.moveTo(40, 10);
        ctx.lineTo(40, height - 30);
        ctx.stroke();
    }

    // 绘制学习曲线
    drawLearningCurve(ctx, data, width, height) {
        if (data.length < 2) return;

        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const maxAccuracy = 100;
        const xStep = chartWidth / (data.length - 1);

        ctx.strokeStyle = '#007bff';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = padding + index * xStep;
            const y = height - padding - (point.accuracy / maxAccuracy) * chartHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    // 绘制数据点
    drawDataPoints(ctx, data, width, height) {
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        const maxAccuracy = 100;
        const xStep = chartWidth / (data.length - 1);

        data.forEach((point, index) => {
            const x = padding + index * xStep;
            const y = height - padding - (point.accuracy / maxAccuracy) * chartHeight;

            ctx.fillStyle = '#007bff';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    // 更新学习建议
    updateLearningSuggestions() {
        const suggestions = this.generateSuggestions();
        const container = document.getElementById('learning-suggestions');

        if (!container) return;

        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item">
                <div class="suggestion-icon">${suggestion.icon}</div>
                <div class="suggestion-text">${suggestion.text}</div>
            </div>
        `).join('');
    }

    // 生成学习建议
    generateSuggestions() {
        const suggestions = [];
        const totalAnswered = this.gameStats?.totalAnswered || 0;
        const accuracy = this.gameStats?.totalAnswered > 0 ?
            (this.gameStats.correctAnswers / this.gameStats.totalAnswered) * 100 : 0;

        // 基于答题数量的建议
        if (totalAnswered < 10) {
            suggestions.push({
                icon: '🎯',
                text: '刚开始学习，建议先从简单难度的题目开始，逐步建立信心。'
            });
        } else if (totalAnswered < 30) {
            suggestions.push({
                icon: '📚',
                text: '有一定基础了，建议尝试中等难度题目，挑战自己的判断能力。'
            });
        }

        // 基于正确率的建议
        if (accuracy < 60) {
            suggestions.push({
                icon: '💡',
                text: '正确率偏低，建议多学习防诈骗教程，了解各种诈骗手段的特征。'
            });
        } else if (accuracy > 85) {
            suggestions.push({
                icon: '🏆',
                text: '表现优秀！可以尝试挑战模式的限时答题，测试自己的反应速度。'
            });
        }

        // 基于分类进度的建议
        const categoryProgress = this.calculateCategoryProgress();
        const weakCategories = Object.entries(categoryProgress)
            .filter(([_, data]) => data.total > 0 && (data.completed / data.total) < 0.5)
            .map(([category]) => category);

        if (weakCategories.length > 0) {
            suggestions.push({
                icon: '📖',
                text: `在${weakCategories.join('、')}方面的掌握还不够，建议重点学习这些类型的防诈骗知识。`
            });
        }

        // 通用建议
        if (suggestions.length === 0) {
            suggestions.push({
                icon: '⭐',
                text: '学习进展很好！保持定期练习，不断提高防诈骗意识和能力。'
            });
        }

        return suggestions.slice(0, 3); // 最多显示3条建议
    }

    // 更新学习目标
    updateLearningGoals() {
        const container = document.getElementById('learning-goals');
        if (!container) return;

        container.innerHTML = Object.entries(this.goals).map(([key, goal]) => {
            const progress = this.calculateGoalProgress(goal);
            const statusClass = this.getGoalStatusClass(progress);

            return `
                <div class="goal-item ${statusClass}">
                    <div class="goal-icon">${goal.icon}</div>
                    <div class="goal-title">${goal.title}</div>
                    <div class="goal-description">${goal.description}</div>
                    <div class="goal-progress">
                        <div class="goal-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="goal-status">${progress}% 完成</div>
                </div>
            `;
        }).join('');
    }

    // 计算目标进度
    calculateGoalProgress(goal) {
        const totalAnswered = this.gameStats?.totalAnswered || 0;
        const accuracy = this.gameStats?.totalAnswered > 0 ?
            (this.gameStats.correctAnswers / this.gameStats.totalAnswered) * 100 : 0;

        switch (goal.type) {
            case 'count':
                return Math.min(Math.round((totalAnswered / goal.target) * 100), 100);
            case 'accuracy':
                return Math.min(Math.round((accuracy / goal.target) * 100), 100);
            case 'category':
                // 计算分类完成度
                const categoryProgress = this.calculateCategoryProgress();
                let totalCategories = 0;
                let completedCategories = 0;

                Object.values(categoryProgress).forEach(data => {
                    totalCategories++;
                    if (data.completed / data.total >= 0.8) {
                        completedCategories++;
                    }
                });

                return Math.min(Math.round((completedCategories / totalCategories) * 100), 100);
            default:
                return 0;
        }
    }

    // 获取目标状态样式类
    getGoalStatusClass(progress) {
        if (progress >= 100) {
            return 'goal-completed';
        } else if (progress > 0) {
            return 'goal-in-progress';
        } else {
            return 'goal-locked';
        }
    }

    // 获取默认目标
    getDefaultGoals() {
        return {
            beginner: {
                title: '初学者',
                description: '完成10道题目',
                type: 'count',
                target: 10,
                icon: '🌱'
            },
            intermediate: {
                title: '进阶者',
                description: '完成30道题目',
                type: 'count',
                target: 30,
                icon: '🌿'
            },
            expert: {
                title: '专家',
                description: '完成所有题目',
                type: 'count',
                target: window.scenarios.length,
                icon: '🌳'
            },
            accuracy_master: {
                title: '精准判断',
                description: '正确率达到85%',
                type: 'accuracy',
                target: 85,
                icon: '🎯'
            },
            category_master: {
                title: '全面掌握',
                description: '各类型题目完成度达到80%',
                type: 'category',
                target: 80,
                icon: '📚'
            },
            challenge_winner: {
                title: '挑战王者',
                description: '挑战模式得分超过1000分',
                type: 'challenge',
                target: 1000,
                icon: '👑'
            }
        };
    }

    // 记录学习历史
    recordLearningHistory() {
        const today = new Date().toDateString();
        const totalAnswered = this.gameStats?.totalAnswered || 0;
        const accuracy = this.gameStats?.totalAnswered > 0 ?
            Math.round((this.gameStats.correctAnswers / this.gameStats.totalAnswered) * 100) : 0;

        // 查找今天是否已有记录
        const existingIndex = this.learningHistory.findIndex(
            record => new Date(record.date).toDateString() === today
        );

        const record = {
            date: new Date().toISOString(),
            answered: totalAnswered,
            accuracy: accuracy
        };

        if (existingIndex >= 0) {
            this.learningHistory[existingIndex] = record;
        } else {
            this.learningHistory.push(record);
        }

        // 只保留最近30天的记录
        if (this.learningHistory.length > 30) {
            this.learningHistory = this.learningHistory.slice(-30);
        }

        // 保存到本地存储
        localStorage.setItem('learningHistory', JSON.stringify(this.learningHistory));
    }
}

// 初始化进度管理器
window.progressManager = new ProgressManager();