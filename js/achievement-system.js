// 成就系统 - 基于游戏场景文档的完整成就体系
class AchievementSystem {
    constructor(storage = window.storage) {
        this.storage = storage;
        this.achievements = this.initializeAchievements();
        this.userAchievements = new Set();
        this.achievementProgress = {};
        this.notificationQueue = [];
        this.isNotificationShowing = false;

        this.loadUserAchievements();
        this.initializeEventListeners();
    }

    // 初始化成就数据
    initializeAchievements() {
        return {
            // 学习成就
            'beginner': {
                id: 'beginner',
                name: '初学者',
                description: '完成5个场景，开启防骗之旅',
                icon: '🌟',
                color: '#28a745',
                type: 'learning',
                condition: (progress) => progress.completedScenarios >= 5,
                points: 50
            },
            'intermediate': {
                id: 'intermediate',
                name: '防骗达人',
                description: '完成15个场景，具备一定防骗能力',
                icon: '🏆',
                color: '#ffc107',
                type: 'learning',
                condition: (progress) => progress.completedScenarios >= 15,
                points: 100
            },
            'expert': {
                id: 'expert',
                name: '诈骗专家',
                description: '完成全部25个场景，成为防骗专家',
                icon: '👑',
                color: '#dc3545',
                type: 'learning',
                condition: (progress) => progress.completedScenarios >= 25,
                points: 200
            },

            // 分类成就
            'phone_master': {
                id: 'phone_master',
                name: '电话防骗专家',
                description: '完成全部6个电话诈骗场景',
                icon: '📞',
                color: '#17a2b8',
                type: 'category',
                condition: (progress) => progress.categoryProgress && progress.categoryProgress.phone && progress.categoryProgress.phone.completed === 6,
                points: 80
            },
            'sms_master': {
                id: 'sms_master',
                name: '短信识别高手',
                description: '完成全部6个短信诈骗场景',
                icon: '📱',
                color: '#6610f2',
                type: 'category',
                condition: (progress) => progress.categoryProgress && progress.categoryProgress.sms && progress.categoryProgress.sms.completed === 6,
                points: 80
            },
            'network_master': {
                id: 'network_master',
                name: '网络安全卫士',
                description: '完成全部7个网络诈骗场景',
                icon: '🌐',
                color: '#20c997',
                type: 'category',
                condition: (progress) => progress.categoryProgress && progress.categoryProgress.network && progress.categoryProgress.network.completed === 7,
                points: 100
            },
            'social_master': {
                id: 'social_master',
                name: '社交防骗达人',
                description: '完成全部6个社交诈骗场景',
                icon: '👥',
                color: '#fd7e14',
                type: 'category',
                condition: (progress) => progress.categoryProgress && progress.categoryProgress.social && progress.categoryProgress.social.completed === 6,
                points: 80
            },

            // 难度成就
            'easy_warrior': {
                id: 'easy_warrior',
                name: '简单关卡征服者',
                description: '完成全部简单难度场景',
                icon: '🛡️',
                color: '#28a745',
                type: 'difficulty',
                condition: (progress) => progress.difficultyProgress && progress.difficultyProgress.easy && progress.difficultyProgress.easy.completed === 6,
                points: 60
            },
            'medium_champion': {
                id: 'medium_champion',
                name: '中等关卡冠军',
                description: '完成全部中等难度场景',
                icon: '⚔️',
                color: '#ffc107',
                type: 'difficulty',
                condition: (progress) => progress.difficultyProgress && progress.difficultyProgress.medium && progress.difficultyProgress.medium.completed === 14,
                points: 120
            },
            'hard_legend': {
                id: 'hard_legend',
                name: '困难关卡传奇',
                description: '完成全部困难难度场景',
                icon: '🔥',
                color: '#dc3545',
                type: 'difficulty',
                condition: (progress) => progress.difficultyProgress && progress.difficultyProgress.hard && progress.difficultyProgress.hard.completed === 5,
                points: 150
            },

            // 挑战成就
            'perfect_start': {
                id: 'perfect_start',
                name: '完美开局',
                description: '连续正确回答10个场景',
                icon: '💯',
                color: '#28a745',
                type: 'challenge',
                condition: (progress) => progress.bestStreak >= 10,
                points: 100
            },
            'score_master': {
                id: 'score_master',
                name: '高分王者',
                description: '累计获得2000分以上',
                icon: '💰',
                color: '#ffc107',
                type: 'challenge',
                condition: (progress) => progress.totalScore >= 2000,
                points: 150
            },
            'speed_runner': {
                id: 'speed_runner',
                name: '快速学习者',
                description: '在30分钟内完成10个场景',
                icon: '⚡',
                color: '#17a2b8',
                type: 'challenge',
                condition: (progress) => false, // 需要特殊实现
                points: 120
            },
            'collector': {
                id: 'collector',
                name: '收藏家',
                description: '收藏10个不同的场景',
                icon: '💎',
                color: '#e83e8c',
                type: 'challenge',
                condition: (progress) => progress.favoriteCount >= 10,
                points: 80
            },

            // 特殊成就
            'first_step': {
                id: 'first_step',
                name: '防骗第一步',
                description: '完成第一个场景',
                icon: '👣',
                color: '#6f42c1',
                type: 'special',
                condition: (progress) => progress.completedScenarios >= 1,
                points: 20,
                hidden: true
            },
            'early_bird': {
                id: 'early_bird',
                name: '早起鸟儿',
                description: '在上午6-9点完成场景挑战',
                icon: '🐦',
                color: '#fd7e14',
                type: 'special',
                condition: (progress) => false, // 需要时间检查
                points: 50,
                hidden: true
            },
            'night_owl': {
                id: 'night_owl',
                name: '夜猫子',
                description: '在晚上10点后完成场景挑战',
                icon: '🦉',
                color: '#343a40',
                type: 'special',
                condition: (progress) => false, // 需要时间检查
                points: 50,
                hidden: true
            },
            'persistent': {
                id: 'persistent',
                name: '坚持不懈',
                description: '连续7天都进行游戏',
                icon: '📅',
                color: '#20c997',
                type: 'special',
                condition: (progress) => false, // 需要日期检查
                points: 100,
                hidden: true
            },

            // 高分成就
            'high_scorer': {
                id: 'high_scorer',
                name: '高分玩家',
                description: '单个场景获得满分150分',
                icon: '🏅',
                color: '#ffc107',
                type: 'score',
                condition: (progress) => false, // 需要单次得分检查
                points: 50
            },
            'perfect_all': {
                id: 'perfect_all',
                name: '完美全通关',
                description: '所有场景都是一次性正确通过',
                icon: '🌟',
                color: '#dc3545',
                type: 'score',
                condition: (progress) => false, // 需要完美通关检查
                points: 300
            }
        };
    }

    // 加载用户成就
    loadUserAchievements() {
        try {
            const saved = this.storage.getItem('userAchievements');
            if (saved) {
                this.userAchievements = new Set(saved.achievements || []);
                this.achievementProgress = saved.progress || {};
            }
        } catch (error) {
            console.warn('加载成就数据失败:', error);
            this.userAchievements = new Set();
            this.achievementProgress = {};
        }
    }

    // 保存用户成就
    saveUserAchievements() {
        try {
            const data = {
                achievements: Array.from(this.userAchievements),
                progress: this.achievementProgress,
                lastUpdated: new Date().toISOString()
            };
            this.storage.setItem('userAchievements', data);
        } catch (error) {
            console.warn('保存成就数据失败:', error);
        }
    }

    // 检查成就
    checkAchievements(progress = null) {
        const currentProgress = progress || this.getCurrentProgress();
        const newAchievements = [];

        Object.values(this.achievements).forEach(achievement => {
            if (!this.userAchievements.has(achievement.id) &&
                achievement.condition(currentProgress)) {
                this.unlockAchievement(achievement.id);
                newAchievements.push(achievement);
            }
        });

        return newAchievements;
    }

    // 解锁成就
    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return;

        this.userAchievements.add(achievementId);
        this.saveUserAchievements();

        // 显示成就通知
        this.showAchievementNotification(achievement);

        // 触发成就解锁事件
        window.dispatchEvent(new CustomEvent('achievementUnlocked', {
            detail: { achievement }
        }));
    }

    // 显示成就通知
    showAchievementNotification(achievement) {
        this.notificationQueue.push(achievement);
        this.processNotificationQueue();
    }

    // 处理通知队列
    processNotificationQueue() {
        if (this.isNotificationShowing || this.notificationQueue.length === 0) {
            return;
        }

        this.isNotificationShowing = true;
        const achievement = this.notificationQueue.shift();

        this.createAchievementPopup(achievement);
    }

    // 创建成就弹窗
    createAchievementPopup(achievement) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-popup-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4 class="achievement-title">成就解锁！</h4>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-points">+${achievement.points} 积分</div>
                </div>
                <button class="achievement-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // 添加样式
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 233px;
            transform: translateX(400px);
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;

        document.body.appendChild(popup);

        // 触发动画
        setTimeout(() => {
            popup.style.transform = 'translateX(0)';
        }, 100);

        // 自动关闭
        setTimeout(() => {
            popup.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
                this.isNotificationShowing = false;
                this.processNotificationQueue();
            }, 500);
        }, 5000);
    }

    // 获取当前进度
    getCurrentProgress() {
        if (window.enhancedScenarioManager) {
            return window.enhancedScenarioManager.getLearningStats();
        }

        // 回退到基础进度
        const gameData = storage.getGameData();
        return {
            completedScenarios: gameData.completedLevels || 0,
            totalScore: gameData.totalScore || 0,
            bestStreak: gameData.bestStreak || 0,
            categoryProgress: {},
            difficultyProgress: {},
            favoriteCount: 0
        };
    }

    // 获取成就列表
    getAchievements(type = 'all', unlockedOnly = false) {
        let achievements = Object.values(this.achievements);

        // 按类型筛选
        if (type !== 'all') {
            achievements = achievements.filter(a => a.type === type);
        }

        // 只显示已解锁
        if (unlockedOnly) {
            achievements = achievements.filter(a => this.userAchievements.has(a.id));
        }

        // 按分类和排序
        return achievements.sort((a, b) => {
            // 先按类型排序
            const typeOrder = { 'learning': 1, 'category': 2, 'difficulty': 3, 'challenge': 4, 'special': 5, 'score': 6 };
            if (typeOrder[a.type] !== typeOrder[b.type]) {
                return typeOrder[a.type] - typeOrder[b.type];
            }
            // 再按积分排序
            return b.points - a.points;
        });
    }

    // 获取成就统计
    getAchievementStats() {
        const totalAchievements = Object.keys(this.achievements).length;
        const unlockedCount = this.userAchievements.size;
        const totalPoints = Array.from(this.userAchievements)
            .map(id => (this.achievements[id] && this.achievements[id].points) || 0)
            .reduce((sum, points) => sum + points, 0);

        const typeStats = {};
        Object.values(this.achievements).forEach(achievement => {
            if (!typeStats[achievement.type]) {
                typeStats[achievement.type] = { total: 0, unlocked: 0 };
            }
            typeStats[achievement.type].total++;
            if (this.userAchievements.has(achievement.id)) {
                typeStats[achievement.type].unlocked++;
            }
        });

        return {
            totalAchievements,
            unlockedCount,
            completionRate: (unlockedCount / totalAchievements) * 100,
            totalPoints,
            typeStats
        };
    }

    // 创建成就展示UI
    createAchievementsDisplay() {
        const stats = this.getAchievementStats();
        const achievements = this.getAchievements();

        const html = `
            <div class="achievements-display">
                <div class="achievements-header">
                    <h3>🏆 我的成就</h3>
                    <div class="achievement-summary">
                        <div class="achievement-stat">
                            <div class="stat-number">${stats.unlockedCount}</div>
                            <div class="stat-label">已解锁</div>
                        </div>
                        <div class="achievement-stat">
                            <div class="stat-number">${stats.totalAchievements}</div>
                            <div class="stat-label">总成就</div>
                        </div>
                        <div class="achievement-stat">
                            <div class="stat-number">${stats.totalPoints}</div>
                            <div class="stat-label">成就积分</div>
                        </div>
                    </div>
                </div>

                <div class="achievements-filter">
                    <button class="filter-btn active" data-type="all">全部</button>
                    <button class="filter-btn" data-type="learning">学习</button>
                    <button class="filter-btn" data-type="category">分类</button>
                    <button class="filter-btn" data-type="difficulty">难度</button>
                    <button class="filter-btn" data-type="challenge">挑战</button>
                </div>

                <div class="achievements-grid">
                    ${achievements.map(achievement => this.createAchievementCard(achievement)).join('')}
                </div>
            </div>
        `;

        return html;
    }

    // 创建成就卡片
    createAchievementCard(achievement) {
        const isUnlocked = this.userAchievements.has(achievement.id);
        const progress = this.getAchievementProgress(achievement.id);

        return `
            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}" data-id="${achievement.id}">
                <div class="achievement-icon" style="background: ${isUnlocked ? achievement.color : '#ccc'}">
                    ${achievement.icon}
                </div>
                <div class="achievement-details">
                    <h4 class="achievement-name">${achievement.name}</h4>
                    <p class="achievement-description">${achievement.description}</p>
                    <div class="achievement-points">${achievement.points} 积分</div>
                    ${progress !== null ? `
                        <div class="achievement-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <span class="progress-text">${progress}%</span>
                        </div>
                    ` : ''}
                </div>
                ${isUnlocked ? '<div class="achievement-badge">✅</div>' : ''}
            </div>
        `;
    }

    // 获取成就进度
    getAchievementProgress(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return null;

        // 这里可以根据成就类型计算具体进度
        const progress = this.achievementProgress[achievementId];
        return progress !== undefined ? progress : null;
    }

    // 添加成就样式
    addAchievementStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .achievement-popup {
                font-family: 'Noto Sans SC', sans-serif;
            }

            .achievement-popup-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .achievement-icon {
                font-size: 3rem;
                animation: bounce 1s infinite;
            }

            .achievement-title {
                margin: 0 0 5px 0;
                font-size: 1.2rem;
                font-weight: bold;
            }

            .achievement-name {
                font-size: 1.1rem;
                font-weight: 500;
                margin-bottom: 5px;
            }

            .achievement-description {
                font-size: 0.9rem;
                opacity: 0.9;
                margin-bottom: 8px;
            }

            .achievement-points {
                font-size: 0.8rem;
                font-weight: bold;
                opacity: 0.8;
            }

            .achievement-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0.8;
            }

            .achievement-close:hover {
                opacity: 1;
            }

            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }

            .achievements-display {
                padding: 20px;
            }

            .achievements-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .achievement-summary {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-top: 20px;
            }

            .achievement-stat {
                text-align: center;
            }

            .stat-number {
                font-size: 2rem;
                font-weight: bold;
                color: #667eea;
            }

            .stat-label {
                font-size: 0.9rem;
                color: #666;
                margin-top: 5px;
            }

            .achievements-filter {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-bottom: 30px;
                flex-wrap: wrap;
            }

            .filter-btn {
                padding: 8px 16px;
                border: 2px solid #667eea;
                background: white;
                color: #667eea;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .filter-btn.active,
            .filter-btn:hover {
                background: #667eea;
                color: white;
            }

            .achievements-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }

            .achievement-card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                position: relative;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .achievement-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }

            .achievement-card.locked {
                opacity: 0.6;
            }

            .achievement-card .achievement-icon {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.8rem;
                color: white;
                margin-bottom: 15px;
            }

            .achievement-card.locked .achievement-icon {
                background: #ccc !important;
            }

            .achievement-name {
                font-size: 1.1rem;
                font-weight: bold;
                margin-bottom: 8px;
                color: #333;
            }

            .achievement-description {
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 10px;
                line-height: 1.4;
            }

            .achievement-points {
                font-size: 0.8rem;
                font-weight: bold;
                color: #667eea;
            }

            .achievement-progress {
                margin-top: 10px;
            }

            .progress-bar {
                height: 6px;
                background: #e9ecef;
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 5px;
            }

            .progress-fill {
                height: 100%;
                background: #667eea;
                transition: width 0.3s ease;
            }

            .progress-text {
                font-size: 0.8rem;
                color: #666;
            }

            .achievement-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 1.2rem;
            }
        `;

        document.head.appendChild(style);
    }

    // 初始化事件监听器
    initializeEventListeners() {
        // 成就筛选按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');

                const type = e.target.dataset.type;
                this.filterAchievements(type);
            }
        });

        // 场景完成事件
        window.addEventListener('scenarioCompleted', (e) => {
            this.checkAchievements();
        });
    }

    // 筛选成就
    filterAchievements(type) {
        const cards = document.querySelectorAll('.achievement-card');
        cards.forEach(card => {
            const achievementId = card.dataset.id;
            const achievement = this.achievements[achievementId];

            if (type === 'all' || achievement.type === type) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// 创建全局成就系统实例
let achievementSystem;

function initializeAchievementSystem() {
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
    
    achievementSystem = new AchievementSystem(storageInstance);
    window.achievementSystem = achievementSystem;

    // 添加样式
    achievementSystem.addAchievementStyles();

    console.log('🏆 成就系统已初始化');
}

// 初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAchievementSystem);
} else {
    initializeAchievementSystem();
}

// 导出
window.AchievementSystem = AchievementSystem;