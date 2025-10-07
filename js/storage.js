// 本地存储管理器
class StorageManager {
    constructor() {
        this.storageKey = 'fanzhaGameData';
        this.achievementsKey = 'fanzhaAchievements';
        this.tutorialKey = 'fanzhaTutorial';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!this.getGameData()) {
            this.createDefaultData();
        }
        if (!this.getAchievements()) {
            this.createDefaultAchievements();
        }
        if (!this.getTutorialProgress()) {
            this.createDefaultTutorialProgress();
        }
    }

    // 游戏数据管理
    createDefaultData() {
        const defaultData = {
            highScore: 0,
            totalScore: 0,
            completedLevels: 0,
            totalAttempts: 0,
            correctAnswers: 0,
            currentLevel: 1,
            unlockedScenarios: ['phone_001', 'sms_001', 'net_001', 'social_001'], // 初始解锁的场景
            completedScenarios: [],
            statistics: {
                phone: { attempts: 0, correct: 0 },
                sms: { attempts: 0, correct: 0 },
                network: { attempts: 0, correct: 0 },
                social: { attempts: 0, correct: 0 }
            },
            lastPlayedDate: null,
            gameSettings: {
                soundEnabled: true,
                vibrationEnabled: true,
                difficulty: 'mixed', // easy, medium, hard, mixed
                language: 'zh-CN'
            },
            version: '1.0.0'
        };

        this.saveGameData(defaultData);
    }

    getGameData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('获取游戏数据失败:', error);
            return null;
        }
    }

    saveGameData(data) {
        try {
            data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存游戏数据失败:', error);
            return false;
        }
    }

    updateGameData(updates) {
        const currentData = this.getGameData() || {};
        const updatedData = { ...currentData, ...updates };
        return this.saveGameData(updatedData);
    }

    // 成就系统管理
    createDefaultAchievements() {
        const defaultAchievements = [
            {
                id: 'first_step',
                name: '初出茅庐',
                description: '完成第一个场景',
                icon: '👶',
                condition: { type: 'complete_scenarios', value: 1 },
                unlocked: false,
                unlockedDate: null,
                points: 10
            },
            {
                id: 'phone_expert',
                name: '电话防骗专家',
                description: '正确识别10个电话诈骗',
                icon: '📞',
                condition: { type: 'correct_by_type', category: 'phone', value: 10 },
                unlocked: false,
                unlockedDate: null,
                points: 50
            },
            {
                id: 'sms_expert',
                name: '短信防骗专家',
                description: '正确识别10个短信诈骗',
                icon: '💬',
                condition: { type: 'correct_by_type', category: 'sms', value: 10 },
                unlocked: false,
                unlockedDate: null,
                points: 50
            },
            {
                id: 'network_expert',
                name: '网络防骗专家',
                description: '正确识别10个网络诈骗',
                icon: '🌐',
                condition: { type: 'correct_by_type', category: 'network', value: 10 },
                unlocked: false,
                unlockedDate: null,
                points: 50
            },
            {
                id: 'social_expert',
                name: '社交防骗专家',
                description: '正确识别10个社交诈骗',
                icon: '👥',
                condition: { type: 'correct_by_type', category: 'social', value: 10 },
                unlocked: false,
                unlockedDate: null,
                points: 50
            },
            {
                id: 'score_1000',
                name: '千分达人',
                description: '累计获得1000分',
                icon: '🏆',
                condition: { type: 'total_score', value: 1000 },
                unlocked: false,
                unlockedDate: null,
                points: 30
            },
            {
                id: 'perfect_streak',
                name: '完美表现',
                description: '连续答对5道题',
                icon: '⭐',
                condition: { type: 'streak', value: 5 },
                unlocked: false,
                unlockedDate: null,
                points: 40
            },
            {
                id: 'all_types_master',
                name: '全能防骗大师',
                description: '每种类型都正确识别5个',
                icon: '🎯',
                condition: { type: 'all_types', value: 5 },
                unlocked: false,
                unlockedDate: null,
                points: 100
            },
            {
                id: 'high_accuracy',
                name: '精准判断',
                description: '正确率达到90%以上（至少20题）',
                icon: '🎖️',
                condition: { type: 'accuracy', value: 90, minAttempts: 20 },
                unlocked: false,
                unlockedDate: null,
                points: 60
            },
            {
                id: 'daily_player',
                name: '每日学习',
                description: '连续7天玩游戏',
                icon: '📅',
                condition: { type: 'daily_streak', value: 7 },
                unlocked: false,
                unlockedDate: null,
                points: 35
            },
            {
                id: 'challenge_master',
                name: '挑战大师',
                description: '完成所有场景',
                icon: '👑',
                condition: { type: 'complete_all', value: 'all' },
                unlocked: false,
                unlockedDate: null,
                points: 200
            },
            {
                id: 'quick_learner',
                name: '快速学习者',
                description: '在10分钟内完成5个场景',
                icon: '⚡',
                condition: { type: 'time_challenge', value: 5, timeLimit: 600 },
                unlocked: false,
                unlockedDate: null,
                points: 45
            }
        ];

        this.saveAchievements(defaultAchievements);
    }

    getAchievements() {
        try {
            const achievements = localStorage.getItem(this.achievementsKey);
            return achievements ? JSON.parse(achievements) : null;
        } catch (error) {
            console.error('获取成就数据失败:', error);
            return null;
        }
    }

    saveAchievements(achievements) {
        try {
            localStorage.setItem(this.achievementsKey, JSON.stringify(achievements));
            return true;
        } catch (error) {
            console.error('保存成就数据失败:', error);
            return false;
        }
    }

    unlockAchievement(achievementId) {
        const achievements = this.getAchievements();
        const achievement = achievements.find(a => a.id === achievementId);

        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedDate = new Date().toISOString();
            this.saveAchievements(achievements);
            return achievement;
        }

        return null;
    }

    checkAchievements(gameData, currentStreak = 0) {
        const achievements = this.getAchievements();
        const newUnlocks = [];

        achievements.forEach(achievement => {
            if (achievement.unlocked) return;

            let shouldUnlock = false;

            switch (achievement.condition.type) {
                case 'complete_scenarios':
                    shouldUnlock = gameData.completedScenarios.length >= achievement.condition.value;
                    break;

                case 'correct_by_type':
                    shouldUnlock = gameData.statistics[achievement.condition.category]?.correct >= achievement.condition.value;
                    break;

                case 'total_score':
                    shouldUnlock = gameData.totalScore >= achievement.condition.value;
                    break;

                case 'streak':
                    shouldUnlock = currentStreak >= achievement.condition.value;
                    break;

                case 'all_types':
                    shouldUnlock = Object.values(gameData.statistics).every(stat => stat.correct >= achievement.condition.value);
                    break;

                case 'accuracy':
                    const accuracy = gameData.totalAttempts > 0 ?
                        (gameData.correctAnswers / gameData.totalAttempts) * 100 : 0;
                    shouldUnlock = accuracy >= achievement.condition.value &&
                                  gameData.totalAttempts >= achievement.condition.minAttempts;
                    break;

                case 'daily_streak':
                    shouldUnlock = this.calculateDailyStreak() >= achievement.condition.value;
                    break;

                case 'complete_all':
                    shouldUnlock = gameData.completedScenarios.length >= 12; // 假设总共有12个场景
                    break;

                case 'time_challenge':
                    // 这个需要在游戏逻辑中处理
                    break;
            }

            if (shouldUnlock) {
                const unlockedAchievement = this.unlockAchievement(achievement.id);
                if (unlockedAchievement) {
                    newUnlocks.push(unlockedAchievement);
                }
            }
        });

        return newUnlocks;
    }

    // 教程进度管理
    createDefaultTutorialProgress() {
        const defaultProgress = {
            completedCategories: [],
            viewedLessons: [],
            progress: {
                phone: 0,
                sms: 0,
                network: 0,
                social: 0
            },
            lastViewedCategory: null,
            totalTimeSpent: 0
        };

        this.saveTutorialProgress(defaultProgress);
    }

    getTutorialProgress() {
        try {
            const progress = localStorage.getItem(this.tutorialKey);
            return progress ? JSON.parse(progress) : null;
        } catch (error) {
            console.error('获取教程进度失败:', error);
            return null;
        }
    }

    saveTutorialProgress(progress) {
        try {
            localStorage.setItem(this.tutorialKey, JSON.stringify(progress));
            return true;
        } catch (error) {
            console.error('保存教程进度失败:', error);
            return false;
        }
    }

    updateTutorialProgress(category, lessonId) {
        const progress = this.getTutorialProgress() || this.createDefaultTutorialProgress();

        if (!progress.viewedLessons.includes(lessonId)) {
            progress.viewedLessons.push(lessonId);
        }

        progress.lastViewedCategory = category;
        progress.progress[category] = Math.min(progress.progress[category] + 1, 100);

        return this.saveTutorialProgress(progress);
    }

    // 统计功能
    calculateAccuracy() {
        const gameData = this.getGameData();
        if (!gameData || gameData.totalAttempts === 0) return 0;

        return Math.round((gameData.correctAnswers / gameData.totalAttempts) * 100);
    }

    calculateDailyStreak() {
        const gameData = this.getGameData();
        if (!gameData || !gameData.lastPlayedDate) return 0;

        const lastPlayed = new Date(gameData.lastPlayedDate);
        const today = new Date();
        const diffTime = Math.abs(today - lastPlayed);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 1; // 今天玩过
        if (diffDays === 1) return 2; // 昨天玩过
        return 1; // 间隔超过一天，重新开始
    }

    getTotalUnlockedAchievements() {
        const achievements = this.getAchievements();
        return achievements ? achievements.filter(a => a.unlocked).length : 0;
    }

    getTotalAchievementPoints() {
        const achievements = this.getAchievements();
        if (!achievements) return 0;

        return achievements
            .filter(a => a.unlocked)
            .reduce((total, a) => total + (a.points || 0), 0);
    }

    // 数据导出和导入
    exportData() {
        try {
            const data = {
                gameData: this.getGameData(),
                achievements: this.getAchievements(),
                tutorialProgress: this.getTutorialProgress(),
                exportDate: new Date().toISOString()
            };

            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('导出数据失败:', error);
            return null;
        }
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            if (data.gameData) {
                this.saveGameData(data.gameData);
            }
            if (data.achievements) {
                this.saveAchievements(data.achievements);
            }
            if (data.tutorialProgress) {
                this.saveTutorialProgress(data.tutorialProgress);
            }

            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }

    // 清除数据
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.achievementsKey);
            localStorage.removeItem(this.tutorialKey);
            this.initializeStorage();
            return true;
        } catch (error) {
            console.error('清除数据失败:', error);
            return false;
        }
    }

    // 数据备份和恢复
    backupToCloud() {
        // 这里可以实现云备份功能
        // 例如上传到服务器或云存储
        console.log('云备份功能暂未实现');
    }

    restoreFromCloud() {
        // 这里可以实现从云端恢复功能
        console.log('云恢复功能暂未实现');
    }
}

// 导出类供初始化管理器使用
// 全局实例将由初始化管理器创建