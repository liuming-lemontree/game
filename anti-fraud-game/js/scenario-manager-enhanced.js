// 增强场景管理器 - 基于游戏场景文档的高级功能
class EnhancedScenarioManager {
    constructor(storage = window.storage) {
        this.storage = storage;
        this.categories = {
            phone: { name: '电话诈骗', icon: '📞', count: 6 },
            sms: { name: '短信诈骗', icon: '📱', count: 6 },
            network: { name: '网络诈骗', icon: '🌐', count: 7 },
            social: { name: '社交诈骗', icon: '👥', count: 6 }
        };

        this.difficulties = {
            easy: { name: '简单', color: '#28a745', range: '60-80分' },
            medium: { name: '中等', color: '#ffc107', range: '90-120分' },
            hard: { name: '困难', color: '#dc3545', range: '130-150分' }
        };

        this.userProgress = {
            completedScenarios: new Set(),
            favoriteScenarios: new Set(),
            categoryProgress: {},
            difficultyProgress: {},
            streakCount: 0,
            totalScore: 0,
            bestStreak: 0
        };

        this.filters = {
            category: 'all',
            difficulty: 'all',
            search: '',
            status: 'all', // all, completed, uncompleted
            favorites: false
        };

        this.loadUserProgress();
        this.initializeEventListeners();
    }

    // 加载用户进度
    loadUserProgress() {
        try {
            const saved = this.storage.getItem('enhancedProgress');
            if (saved) {
                this.userProgress = {
                    ...this.userProgress,
                    ...saved,
                    completedScenarios: new Set(saved.completedScenarios || []),
                    favoriteScenarios: new Set(saved.favoriteScenarios || [])
                };
            }
        } catch (error) {
            console.warn('加载用户进度失败:', error);
        }
        this.updateProgressData();
    }

    // 保存用户进度
    saveUserProgress() {
        try {
            const data = {
                ...this.userProgress,
                completedScenarios: Array.from(this.userProgress.completedScenarios),
                favoriteScenarios: Array.from(this.userProgress.favoriteScenarios)
            };
            this.storage.setItem('enhancedProgress', data);
        } catch (error) {
            console.warn('保存用户进度失败:', error);
        }
    }

    // 更新进度数据
    updateProgressData() {
        // 更新分类进度
        Object.keys(this.categories).forEach(category => {
            const categoryScenarios = this.getScenariosByCategory(category);
            const completed = categoryScenarios.filter(s =>
                this.userProgress.completedScenarios.has(s.id)
            ).length;
            this.userProgress.categoryProgress[category] = {
                completed: completed,
                total: categoryScenarios.length,
                percentage: (completed / categoryScenarios.length) * 100
            };
        });

        // 更新难度进度
        Object.keys(this.difficulties).forEach(difficulty => {
            const difficultyScenarios = this.getScenariosByDifficulty(difficulty);
            const completed = difficultyScenarios.filter(s =>
                this.userProgress.completedScenarios.has(s.id)
            ).length;
            this.userProgress.difficultyProgress[difficulty] = {
                completed: completed,
                total: difficultyScenarios.length,
                percentage: (completed / difficultyScenarios.length) * 100
            };
        });
    }

    // 获取分类场景
    getScenariosByCategory(category) {
        if (category === 'all') {
            return window.ScenarioData ? Object.values(window.ScenarioData).flat() : [];
        }
        return window.ScenarioData ? window.ScenarioData[category] || [] : [];
    }

    // 获取难度场景
    getScenariosByDifficulty(difficulty) {
        const allScenarios = this.getScenariosByCategory('all');
        return difficulty === 'all' ? allScenarios :
            allScenarios.filter(s => s.difficulty === difficulty);
    }

    // 应用筛选条件
    getFilteredScenarios() {
        let scenarios = this.getScenariosByCategory('all');

        // 分类筛选
        if (this.filters.category !== 'all') {
            scenarios = scenarios.filter(s => s.type === this.filters.category);
        }

        // 难度筛选
        if (this.filters.difficulty !== 'all') {
            scenarios = scenarios.filter(s => s.difficulty === this.filters.difficulty);
        }

        // 状态筛选
        if (this.filters.status === 'completed') {
            scenarios = scenarios.filter(s => this.userProgress.completedScenarios.has(s.id));
        } else if (this.filters.status === 'uncompleted') {
            scenarios = scenarios.filter(s => !this.userProgress.completedScenarios.has(s.id));
        }

        // 收藏筛选
        if (this.filters.favorites) {
            scenarios = scenarios.filter(s => this.userProgress.favoriteScenarios.has(s.id));
        }

        // 搜索筛选
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            scenarios = scenarios.filter(s =>
                s.title.toLowerCase().includes(searchTerm) ||
                s.content.toLowerCase().includes(searchTerm) ||
                s.sender.toLowerCase().includes(searchTerm)
            );
        }

        return scenarios;
    }

    // 标记场景完成
    markScenarioCompleted(scenarioId, score, isCorrect) {
        this.userProgress.completedScenarios.add(scenarioId);

        if (isCorrect) {
            this.userProgress.totalScore += score;
            this.userProgress.streakCount++;
            if (this.userProgress.streakCount > this.userProgress.bestStreak) {
                this.userProgress.bestStreak = this.userProgress.streakCount;
            }
        } else {
            this.userProgress.streakCount = 0;
        }

        this.updateProgressData();
        this.saveUserProgress();
        this.checkAchievements();
    }

    // 切换收藏状态
    toggleFavorite(scenarioId) {
        if (this.userProgress.favoriteScenarios.has(scenarioId)) {
            this.userProgress.favoriteScenarios.delete(scenarioId);
        } else {
            this.userProgress.favoriteScenarios.add(scenarioId);
        }
        this.saveUserProgress();
    }

    // 获取推荐场景
    getRecommendedScenarios(count = 3) {
        const uncompleted = this.getScenariosByCategory('all')
            .filter(s => !this.userProgress.completedScenarios.has(s.id));

        if (uncompleted.length === 0) {
            // 如果全部完成，推荐一些困难的场景复习
            return this.getScenariosByDifficulty('hard').slice(0, count);
        }

        // 智能推荐算法
        const recommendations = [];

        // 1. 优先推荐同分类中未完成的场景
        const preferredCategory = this.getPreferredCategory();
        if (preferredCategory) {
            const categoryScenarios = uncompleted.filter(s => s.type === preferredCategory);
            recommendations.push(...categoryScenarios.slice(0, Math.ceil(count / 2)));
        }

        // 2. 推荐适合当前水平的场景
        const suitableDifficulty = this.getSuitableDifficulty();
        const difficultyScenarios = uncompleted.filter(s => s.difficulty === suitableDifficulty);
        recommendations.push(...difficultyScenarios.slice(0, Math.ceil(count / 2)));

        // 3. 随机推荐其他场景
        const remaining = uncompleted.filter(s => !recommendations.includes(s));
        recommendations.push(...remaining.slice(0, count - recommendations.length));

        return recommendations.slice(0, count);
    }

    // 获取偏好的分类
    getPreferredCategory() {
        let maxProgress = 0;
        let preferredCategory = null;

        Object.entries(this.userProgress.categoryProgress).forEach(([category, progress]) => {
            if (progress.percentage > maxProgress && progress.percentage < 100) {
                maxProgress = progress.percentage;
                preferredCategory = category;
            }
        });

        return preferredCategory;
    }

    // 获取适合的难度
    getSuitableDifficulty() {
        const completedCount = this.userProgress.completedScenarios.size;

        if (completedCount < 5) return 'easy';
        if (completedCount < 15) return 'medium';
        return 'hard';
    }

    // 检查成就
    checkAchievements() {
        const achievements = [];

        // 学习成就
        if (this.userProgress.completedScenarios.size >= 5) {
            achievements.push({ id: 'beginner', name: '初学者', icon: '🌟' });
        }
        if (this.userProgress.completedScenarios.size >= 15) {
            achievements.push({ id: 'expert', name: '防骗达人', icon: '🏆' });
        }
        if (this.userProgress.completedScenarios.size >= 25) {
            achievements.push({ id: 'master', name: '诈骗专家', icon: '👑' });
        }

        // 分类成就
        Object.entries(this.userProgress.categoryProgress).forEach(([category, progress]) => {
            if (progress.completed === progress.total) {
                const categoryName = this.categories[category].name;
                achievements.push({
                    id: `${category}_master`,
                    name: `${categoryName}专家`,
                    icon: this.categories[category].icon
                });
            }
        });

        // 挑战成就
        if (this.userProgress.bestStreak >= 10) {
            achievements.push({ id: 'streak_master', name: '连胜达人', icon: '🔥' });
        }
        if (this.userProgress.totalScore >= 2000) {
            achievements.push({ id: 'score_master', name: '高分王者', icon: '💰' });
        }

        return achievements;
    }

    // 获取学习统计
    getLearningStats() {
        const totalScenarios = this.getScenariosByCategory('all').length;
        const completedScenarios = this.userProgress.completedScenarios.size;
        const completionRate = (completedScenarios / totalScenarios) * 100;

        const categoryStats = Object.entries(this.userProgress.categoryProgress).map(([category, progress]) => ({
            category: this.categories[category].name,
            icon: this.categories[category].icon,
            ...progress
        }));

        const difficultyStats = Object.entries(this.userProgress.difficultyProgress).map(([difficulty, progress]) => ({
            difficulty: this.difficulties[difficulty].name,
            color: this.difficulties[difficulty].color,
            ...progress
        }));

        return {
            totalScenarios,
            completedScenarios,
            completionRate,
            totalScore: this.userProgress.totalScore,
            bestStreak: this.userProgress.bestStreak,
            currentStreak: this.userProgress.streakCount,
            favoriteCount: this.userProgress.favoriteScenarios.size,
            categoryStats,
            difficultyStats
        };
    }

    // 创建场景筛选器UI
    createScenarioFilter() {
        const filterHtml = `
            <div class="scenario-filter">
                <div class="filter-section">
                    <h3>📋 场景筛选</h3>

                    <div class="filter-group">
                        <label>分类:</label>
                        <select id="category-filter" class="filter-select">
                            <option value="all">全部分类</option>
                            ${Object.entries(this.categories).map(([key, cat]) =>
                                `<option value="${key}">${cat.icon} ${cat.name}</option>`
                            ).join('')}
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>难度:</label>
                        <select id="difficulty-filter" class="filter-select">
                            <option value="all">全部难度</option>
                            ${Object.entries(this.difficulties).map(([key, diff]) =>
                                `<option value="${key}">${diff.name} (${diff.range})</option>`
                            ).join('')}
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>状态:</label>
                        <select id="status-filter" class="filter-select">
                            <option value="all">全部状态</option>
                            <option value="uncompleted">未完成</option>
                            <option value="completed">已完成</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>
                            <input type="checkbox" id="favorites-filter">
                            只看收藏
                        </label>
                    </div>

                    <div class="filter-group">
                        <input type="text" id="search-filter" placeholder="搜索场景..." class="filter-input">
                    </div>

                    <button id="reset-filters" class="btn btn-secondary">重置筛选</button>
                </div>
            </div>
        `;

        return filterHtml;
    }

    // 创建场景列表UI
    createScenarioList(scenarios) {
        const listHtml = `
            <div class="scenario-list">
                ${scenarios.map(scenario => this.createScenarioCard(scenario)).join('')}
            </div>
        `;

        return listHtml;
    }

    // 创建场景卡片
    createScenarioCard(scenario) {
        const isCompleted = this.userProgress.completedScenarios.has(scenario.id);
        const isFavorite = this.userProgress.favoriteScenarios.has(scenario.id);
        const category = this.categories[scenario.type];
        const difficulty = this.difficulties[scenario.difficulty];

        return `
            <div class="scenario-card ${isCompleted ? 'completed' : ''}" data-id="${scenario.id}">
                <div class="scenario-header">
                    <h4 class="scenario-title">
                        ${isCompleted ? '✅' : ''}
                        ${scenario.title}
                    </h4>
                    <div class="scenario-meta">
                        <span class="category-badge">${category.icon} ${category.name}</span>
                        <span class="difficulty-badge" style="background: ${difficulty.color}">
                            ${difficulty.name}
                        </span>
                        <span class="points-badge">🏆 ${scenario.points}分</span>
                    </div>
                </div>

                <div class="scenario-content">
                    <p class="scenario-sender">发件人: ${scenario.sender}</p>
                    <p class="scenario-description">${scenario.content.substring(0, 100)}...</p>
                </div>

                <div class="scenario-actions">
                    <button class="btn btn-primary" onclick="game.startSpecificScenario('${scenario.id}')">
                        ${isCompleted ? '重新挑战' : '开始挑战'}
                    </button>
                    <button class="btn btn-icon ${isFavorite ? 'active' : ''}"
                            onclick="enhancedScenarioManager.toggleFavorite('${scenario.id}')"
                            title="收藏">
                        ${isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;
    }

    // 初始化事件监听器
    initializeEventListeners() {
        // 这些将在UI创建后调用
    }

    // 重置筛选器
    resetFilters() {
        this.filters = {
            category: 'all',
            difficulty: 'all',
            search: '',
            status: 'all',
            favorites: false
        };
    }

    // 设置筛选器
    setFilter(type, value) {
        this.filters[type] = value;
    }

    // 获取学习路径推荐
    getLearningPath() {
        const path = {
            current: this.getSuitableDifficulty(),
            recommended: this.getRecommendedScenarios(5),
            nextSteps: []
        };

        // 根据进度推荐下一步
        if (this.userProgress.completedScenarios.size < 5) {
            path.nextSteps.push('继续完成简单场景，建立基础认知');
        } else if (this.userProgress.completedScenarios.size < 15) {
            path.nextSteps.push('挑战中等难度场景，提高识别能力');
        } else {
            path.nextSteps.push('攻克困难场景，成为防骗专家');
        }

        return path;
    }
}

// 创建全局增强场景管理器实例
let enhancedScenarioManager;

function initializeEnhancedScenarioManager() {
    // 使用window.storage或创建默认存储实例
    const storageInstance = window.storage || {
        getItem: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                return null;
            }
        },
        setItem: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('本地存储失败:', e);
            }
        }
    };
    
    enhancedScenarioManager = new EnhancedScenarioManager(storageInstance);
    window.enhancedScenarioManager = enhancedScenarioManager;

    console.log('✨ 增强场景管理器已初始化');
}

// 初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedScenarioManager);
} else {
    initializeEnhancedScenarioManager();
}

// 导出
window.EnhancedScenarioManager = EnhancedScenarioManager;