// 学习路径推荐系统 - 基于游戏场景文档的智能学习路径
class LearningPathSystem {
    constructor() {
        this.paths = this.initializeLearningPaths();
        this.currentPath = null;
        this.userLevel = 'beginner';
        this.userProgress = {
            completedScenarios: new Set(),
            skillLevels: {},
            preferences: {},
            weakAreas: [],
            strongAreas: []
        };

        this.loadUserProgress();
        this.assessUserLevel();
        this.generateCurrentPath();
    }

    // 初始化学习路径
    initializeLearningPaths() {
        return {
            // 初学者路径
            beginner: {
                name: '防骗初学者',
                description: '适合刚接触防诈骗知识的用户，从基础概念开始学习',
                icon: '🌱',
                color: '#28a745',
                estimatedTime: '30-45分钟',
                scenarios: [
                    'sms_001', // 中奖诈骗
                    'sms_005', // 积分兑换
                    'phone_002', // 客服退款
                    'phone_004', // 医保卡异常
                    'net_003'   // 兼职刷单
                ],
                objectives: [
                    '了解常见诈骗手段',
                    '掌握基础防骗原则',
                    '建立防骗意识'
                ],
                nextPath: 'intermediate'
            },

            // 进阶路径
            intermediate: {
                name: '防骗进阶者',
                description: '适合有一定基础的用户，学习识别复杂诈骗手段',
                icon: '🚀',
                color: '#ffc107',
                estimatedTime: '45-60分钟',
                scenarios: [
                    'phone_001', // 冒充公检法
                    'phone_003', // 冒充领导
                    'phone_005', // ETC认证
                    'sms_002',   // 银行升级
                    'sms_004',   // 学校收费
                    'sms_006',   // 快递签收
                    'net_002'    // 虚假投资
                ],
                objectives: [
                    '识别冒充诈骗',
                    '了解金融诈骗',
                    '掌握官方核实方法'
                ],
                nextPath: 'advanced'
            },

            // 高级路径
            advanced: {
                name: '防骗专家',
                description: '适合有经验的用户，挑战高难度复杂诈骗场景',
                icon: '👑',
                color: '#dc3545',
                estimatedTime: '60-90分钟',
                scenarios: [
                    'net_001',     // 钓鱼网站
                    'net_005',     // 虚假客服
                    'net_007',     // 冒充公检法网站
                    'social_002',  // 情感诈骗
                    'social_004',  // 杀猪盘
                    'phone_006',   // 贷款诈骗
                    'social_005',  // 海外代购
                    'social_006',  // 虚假招聘
                ],
                objectives: [
                    '精通各种诈骗手段',
                    '能够指导他人防骗',
                    '成为防骗专家'
                ],
                nextPath: 'master'
            },

            // 大师路径
            master: {
                name: '防骗大师',
                description: '全面掌握所有诈骗类型，应对各种复杂情况',
                icon: '🏆',
                color: '#6f42c1',
                estimatedTime: '90-120分钟',
                scenarios: [
                    // 全部场景的复习和挑战
                ],
                objectives: [
                    '全面掌握防骗知识',
                    '具备教学能力',
                    '能够识别新型诈骗'
                ],
                nextPath: null
            },

            // 专题路径
            specialized: {
                financial_fraud: {
                    name: '金融诈骗专题',
                    description: '专注于金融相关的诈骗防范',
                    icon: '💰',
                    color: '#17a2b8',
                    scenarios: [
                        'net_002',  // 虚假投资
                        'net_004',  // 游戏账号交易
                        'phone_006', // 贷款诈骗
                        'social_004'  // 杀猪盘
                    ]
                },
                impersonation_fraud: {
                    name: '冒充诈骗专题',
                    description: '学习识别各种冒充身份的诈骗',
                    icon: '🎭',
                    color: '#fd7e14',
                    scenarios: [
                        'phone_001', // 冒充公检法
                        'phone_002', // 冒充客服
                        'phone_003', // 冒充领导
                        'social_001', // 冒充熟人
                        'net_005'     // 冒充客服
                    ]
                },
                network_fraud: {
                    name: '网络诈骗专题',
                    description: '专注于网络环境下的诈骗防范',
                    icon: '🌐',
                    color: '#20c997',
                    scenarios: [
                        'net_001',  // 钓鱼网站
                        'net_002',  // 虚假投资
                        'net_003',  // 兼职刷单
                        'net_004',  // 游戏账号交易
                        'net_006',  // 虚假慈善
                        'net_007'   // 冒充公检法网站
                    ]
                }
            }
        };
    }

    // 加载用户进度
    loadUserProgress() {
        try {
            const saved = window.storage.getItem('learningPathProgress');
            if (saved) {
                this.userProgress = {
                    ...this.userProgress,
                    ...saved,
                    completedScenarios: new Set(saved.completedScenarios || []),
                    weakAreas: saved.weakAreas || [],
                    strongAreas: saved.strongAreas || []
                };
            }
        } catch (error) {
            console.warn('加载学习路径进度失败:', error);
        }
    }

    // 保存用户进度
    saveUserProgress() {
        try {
            const data = {
                ...this.userProgress,
                completedScenarios: Array.from(this.userProgress.completedScenarios)
            };
            window.storage.setItem('learningPathProgress', data);
        } catch (error) {
            console.warn('保存学习路径进度失败:', error);
        }
    }

    // 评估用户水平
    assessUserLevel() {
        const completedCount = this.userProgress.completedScenarios.size;

        if (completedCount < 5) {
            this.userLevel = 'beginner';
        } else if (completedCount < 15) {
            this.userLevel = 'intermediate';
        } else if (completedCount < 25) {
            this.userLevel = 'advanced';
        } else {
            this.userLevel = 'master';
        }

        this.analyzePerformance();
    }

    // 分析用户表现
    analyzePerformance() {
        const scenarioData = window.ScenarioData;
        if (!scenarioData) return;

        // 分析各类型表现
        const typePerformance = {
            phone: { completed: 0, correct: 0, total: 0 },
            sms: { completed: 0, correct: 0, total: 0 },
            network: { completed: 0, correct: 0, total: 0 },
            social: { completed: 0, correct: 0, total: 0 }
        };

        // 分析难度表现
        const difficultyPerformance = {
            easy: { completed: 0, correct: 0, total: 0 },
            medium: { completed: 0, correct: 0, total: 0 },
            hard: { completed: 0, correct: 0, total: 0 }
        };

        // 统计表现数据
        Object.values(scenarioData).flat().forEach(scenario => {
            const type = scenario.type;
            const difficulty = scenario.difficulty;

            typePerformance[type].total++;
            difficultyPerformance[difficulty].total++;

            if (this.userProgress.completedScenarios.has(scenario.id)) {
                typePerformance[type].completed++;
                difficultyPerformance[difficulty].completed++;

                // 这里可以进一步分析正确率
                // 需要从存储中获取详细的答题记录
            }
        });

        // 识别强项和弱项
        this.identifyStrengthsAndWeaknesses(typePerformance, difficultyPerformance);
    }

    // 识别强项和弱项
    identifyStrengthsAndWeaknesses(typePerf, diffPerf) {
        this.userProgress.weakAreas = [];
        this.userProgress.strongAreas = [];

        // 分析类型表现
        Object.entries(typePerf).forEach(([type, perf]) => {
            const completionRate = perf.total > 0 ? (perf.completed / perf.total) * 100 : 0;
            if (completionRate < 50) {
                this.userProgress.weakAreas.push(type);
            } else if (completionRate > 80) {
                this.userProgress.strongAreas.push(type);
            }
        });

        // 分析难度表现
        Object.entries(diffPerf).forEach(([difficulty, perf]) => {
            const completionRate = perf.total > 0 ? (perf.completed / perf.total) * 100 : 0;
            if (completionRate < 50) {
                this.userProgress.weakAreas.push(difficulty);
            } else if (completionRate > 80) {
                this.userProgress.strongAreas.push(difficulty);
            }
        });
    }

    // 生成当前学习路径
    generateCurrentPath() {
        this.currentPath = this.recommendPath();
    }

    // 推荐学习路径
    recommendPath() {
        // 基于用户水平和弱项推荐路径
        if (this.userProgress.weakAreas.length > 0) {
            return this.recommendRemedialPath();
        }

        if (this.userLevel === 'master') {
            return this.paths.master;
        }

        return this.paths[this.userLevel];
    }

    // 推荐补救路径
    recommendRemedialPath() {
        // 针对弱项推荐专题路径
        const weakAreas = this.userProgress.weakAreas;
        const typeWeakAreas = weakAreas.filter(area => ['phone', 'sms', 'network', 'social'].includes(area));

        if (typeWeakAreas.length > 0) {
            const targetArea = typeWeakAreas[0];
            const scenarios = this.getScenariosByTypeAndDifficulty(targetArea, 'easy');

            return {
                name: `${this.getTypeName(targetArea)}强化训练`,
                description: `针对${this.getTypeName(targetArea)}的强化学习`,
                icon: '🎯',
                color: '#e83e8c',
                scenarios: scenarios.slice(0, 5),
                objectives: [`强化${this.getTypeName(targetArea)}识别能力`],
                isRemedial: true
            };
        }

        return this.paths[this.userLevel];
    }

    // 根据类型和难度获取场景
    getScenariosByTypeAndDifficulty(type, difficulty) {
        const allScenarios = window.ScenarioData ? window.ScenarioData[type] || [] : [];
        return allScenarios.filter(s => s.difficulty === difficulty);
    }

    // 获取类型名称
    getTypeName(type) {
        const names = {
            phone: '电话诈骗',
            sms: '短信诈骗',
            network: '网络诈骗',
            social: '社交诈骗',
            easy: '简单难度',
            medium: '中等难度',
            hard: '困难难度'
        };
        return names[type] || type;
    }

    // 获取推荐场景
    getRecommendedScenarios(count = 3) {
        if (!this.currentPath || !this.currentPath.scenarios) {
            return this.getDefaultRecommendations(count);
        }

        const recommendations = [];
        const uncompleted = this.currentPath.scenarios.filter(id =>
            !this.userProgress.completedScenarios.has(id)
        );

        if (uncompleted.length === 0) {
            // 当前路径已完成，推荐下一个路径
            return this.getNextPathRecommendations(count);
        }

        // 返回未完成的场景
        return uncompleted.slice(0, count);
    }

    // 获取下一个路径推荐
    getNextPathRecommendations(count) {
        const nextPathName = this.currentPath.nextPath;
        if (!nextPathName || !this.paths[nextPathName]) {
            return this.getDefaultRecommendations(count);
        }

        const nextPath = this.paths[nextPathName];
        return nextPath.scenarios.slice(0, count);
    }

    // 获取默认推荐
    getDefaultRecommendations(count) {
        // 根据用户水平推荐未完成的场景
        let targetDifficulty = 'easy';
        if (this.userLevel === 'intermediate') targetDifficulty = 'medium';
        if (this.userLevel === 'advanced' || this.userLevel === 'master') targetDifficulty = 'hard';

        const allScenarios = window.ScenarioData ? Object.values(window.ScenarioData).flat() : [];
        const uncompleted = allScenarios.filter(s =>
            !this.userProgress.completedScenarios.has(s.id) && s.difficulty === targetDifficulty
        );

        return uncompleted.slice(0, count).map(s => s.id);
    }

    // 获取学习进度
    getPathProgress() {
        if (!this.currentPath || !this.currentPath.scenarios) {
            return { completed: 0, total: 0, percentage: 0 };
        }

        const total = this.currentPath.scenarios.length;
        const completed = this.currentPath.scenarios.filter(id =>
            this.userProgress.completedScenarios.has(id)
        ).length;

        return {
            completed,
            total,
            percentage: total > 0 ? (completed / total) * 100 : 0
        };
    }

    // 完成场景
    completeScenario(scenarioId) {
        this.userProgress.completedScenarios.add(scenarioId);
        this.saveUserProgress();
        this.assessUserLevel();

        // 检查是否完成当前路径
        const progress = this.getPathProgress();
        if (progress.percentage >= 100) {
            this.completeCurrentPath();
        }
    }

    // 完成当前路径
    completeCurrentPath() {
        // 触发路径完成事件
        window.dispatchEvent(new CustomEvent('learningPathCompleted', {
            detail: {
                path: this.currentPath,
                nextPath: this.currentPath.nextPath
            }
        }));

        // 生成下一个路径
        if (this.currentPath.nextPath) {
            this.userLevel = this.currentPath.nextPath;
            this.generateCurrentPath();
        }
    }

    // 创建学习路径UI
    createLearningPathUI() {
        const progress = this.getPathProgress();
        const path = this.currentPath;

        if (!path) {
            return '<div class="learning-path-placeholder">正在生成学习路径...</div>';
        }

        return `
            <div class="learning-path">
                <div class="path-header">
                    <div class="path-info">
                        <div class="path-icon">${path.icon}</div>
                        <div class="path-details">
                            <h3 class="path-name">${path.name}</h3>
                            <p class="path-description">${path.description}</p>
                            <div class="path-meta">
                                <span class="path-time">⏱️ ${path.estimatedTime}</span>
                                <span class="path-progress">进度: ${progress.completed}/${progress.total}</span>
                            </div>
                        </div>
                    </div>
                    ${path.isRemedial ? '<div class="remedial-badge">强化训练</div>' : ''}
                </div>

                <div class="path-progress-bar">
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${progress.percentage}%; background: ${path.color}"></div>
                    </div>
                    <div class="progress-text">${Math.round(progress.percentage)}% 完成</div>
                </div>

                <div class="path-objectives">
                    <h4>学习目标:</h4>
                    <ul>
                        ${path.objectives.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                </div>

                <div class="path-scenarios">
                    <h4>包含场景:</h4>
                    <div class="scenario-list">
                        ${path.scenarios.map(id => this.createPathScenarioItem(id)).join('')}
                    </div>
                </div>

                <div class="path-actions">
                    <button class="btn btn-primary" onclick="learningPathSystem.startPath()">
                        ${progress.completed === 0 ? '开始学习' : '继续学习'}
                    </button>
                    ${progress.percentage >= 100 ? `
                        <button class="btn btn-success" onclick="learningPathSystem.nextPath()">
                            下一路径
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary" onclick="learningPathSystem.changePath()">
                        切换路径
                    </button>
                </div>
            </div>
        `;
    }

    // 创建路径场景项
    createPathScenarioItem(scenarioId) {
        const allScenarios = window.ScenarioData ? Object.values(window.ScenarioData).flat() : [];
        const scenario = allScenarios.find(s => s.id === scenarioId);
        const isCompleted = this.userProgress.completedScenarios.has(scenarioId);

        if (!scenario) return '';

        return `
            <div class="path-scenario-item ${isCompleted ? 'completed' : ''}">
                <div class="scenario-status">
                    ${isCompleted ? '✅' : '📝'}
                </div>
                <div class="scenario-info">
                    <div class="scenario-title">${scenario.title}</div>
                    <div class="scenario-meta">
                        <span class="scenario-type">${this.getTypeName(scenario.type)}</span>
                        <span class="scenario-difficulty">${this.getTypeName(scenario.difficulty)}</span>
                        <span class="scenario-points">${scenario.points}分</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 开始路径
    startPath() {
        const recommendations = this.getRecommendedScenarios(1);
        if (recommendations.length > 0 && window.game) {
            window.game.startSpecificScenario(recommendations[0]);
        }
    }

    // 切换到下一个路径
    nextPath() {
        if (this.currentPath && this.currentPath.nextPath) {
            this.userLevel = this.currentPath.nextPath;
            this.generateCurrentPath();
            this.updatePathUI();
        }
    }

    // 切换路径
    changePath() {
        // 显示路径选择对话框
        this.showPathSelectionDialog();
    }

    // 显示路径选择对话框
    showPathSelectionDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'path-selection-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>选择学习路径</h3>
                <div class="path-options">
                    ${this.createPathOptions()}
                </div>
                <div class="dialog-actions">
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.remove()">取消</button>
                </div>
            </div>
        `;

        // 添加样式
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            padding: 0;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;

        document.body.appendChild(dialog);
        this.addPathSelectionStyles();
    }

    // 创建路径选项
    createPathOptions() {
        const options = [];

        // 添加基础路径
        ['beginner', 'intermediate', 'advanced', 'master'].forEach(level => {
            const path = this.paths[level];
            options.push(`
                <div class="path-option ${this.userLevel === level ? 'current' : ''}"
                     onclick="learningPathSystem.selectPath('${level}')">
                    <div class="option-icon">${path.icon}</div>
                    <div class="option-details">
                        <h4>${path.name}</h4>
                        <p>${path.description}</p>
                        <div class="option-meta">
                            <span>⏱️ ${path.estimatedTime}</span>
                            <span>📊 ${path.scenarios.length}个场景</span>
                        </div>
                    </div>
                    ${this.userLevel === level ? '<div class="current-badge">当前</div>' : ''}
                </div>
            `);
        });

        // 添加专题路径
        if (this.paths.specialized) {
            options.push('<h4 class="section-title">专题路径</h4>');
            Object.entries(this.paths.specialized).forEach(([key, path]) => {
                options.push(`
                    <div class="path-option specialized" onclick="learningPathSystem.selectSpecializedPath('${key}')">
                        <div class="option-icon">${path.icon}</div>
                        <div class="option-details">
                            <h4>${path.name}</h4>
                            <p>${path.description}</p>
                            <div class="option-meta">
                                <span>📊 ${path.scenarios.length}个场景</span>
                            </div>
                        </div>
                    </div>
                `);
            });
        }

        return options.join('');
    }

    // 选择路径
    selectPath(level) {
        this.userLevel = level;
        this.generateCurrentPath();
        this.updatePathUI();

        // 关闭对话框
        const dialog = document.querySelector('.path-selection-dialog');
        if (dialog) dialog.remove();
    }

    // 选择专题路径
    selectSpecializedPath(key) {
        const path = this.paths.specialized[key];
        this.currentPath = {
            ...path,
            scenarios: path.scenarios || [],
            objectives: [`完成${path.name}的学习`],
            isSpecialized: true
        };

        this.updatePathUI();

        // 关闭对话框
        const dialog = document.querySelector('.path-selection-dialog');
        if (dialog) dialog.remove();
    }

    // 更新路径UI
    updatePathUI() {
        const pathContainer = document.querySelector('.learning-path-container');
        if (pathContainer) {
            pathContainer.innerHTML = this.createLearningPathUI();
        }
    }

    // 添加路径选择样式
    addPathSelectionStyles() {
        if (document.getElementById('path-selection-styles')) return;

        const style = document.createElement('style');
        style.id = 'path-selection-styles';
        style.textContent = `
            .path-selection-dialog .dialog-content {
                padding: 30px;
            }

            .path-selection-dialog h3 {
                margin: 0 0 20px 0;
                text-align: center;
                color: #333;
            }

            .path-options {
                margin-bottom: 20px;
            }

            .path-option {
                display: flex;
                align-items: center;
                padding: 15px;
                margin: 10px 0;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .path-option:hover {
                border-color: #667eea;
                background: #f8f9ff;
            }

            .path-option.current {
                border-color: #28a745;
                background: #f0fff4;
            }

            .path-option.specialized {
                border-color: #ffc107;
                background: #fffdf7;
            }

            .option-icon {
                font-size: 2rem;
                margin-right: 15px;
                width: 50px;
                text-align: center;
            }

            .option-details {
                flex: 1;
            }

            .option-details h4 {
                margin: 0 0 5px 0;
                color: #333;
            }

            .option-details p {
                margin: 0 0 8px 0;
                color: #666;
                font-size: 0.9rem;
            }

            .option-meta span {
                font-size: 0.8rem;
                color: #888;
                margin-right: 15px;
            }

            .current-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #28a745;
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
            }

            .section-title {
                margin: 20px 0 10px 0;
                color: #666;
                font-size: 1rem;
                border-bottom: 1px solid #e9ecef;
                padding-bottom: 5px;
            }

            .dialog-actions {
                text-align: center;
            }

            .learning-path {
                background: white;
                border-radius: 15px;
                padding: 25px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                margin: 20px 0;
            }

            .path-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: 20px;
            }

            .path-info {
                display: flex;
                align-items: flex-start;
                gap: 15px;
            }

            .path-icon {
                font-size: 2.5rem;
                line-height: 1;
            }

            .path-name {
                margin: 0 0 8px 0;
                color: #333;
            }

            .path-description {
                margin: 0 0 10px 0;
                color: #666;
                line-height: 1.4;
            }

            .path-meta span {
                font-size: 0.9rem;
                color: #888;
                margin-right: 15px;
            }

            .remedial-badge {
                background: #e83e8c;
                color: white;
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
            }

            .path-progress-bar {
                margin: 20px 0;
                position: relative;
            }

            .progress-track {
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                transition: width 0.5s ease;
            }

            .progress-text {
                text-align: center;
                margin-top: 5px;
                font-size: 0.9rem;
                color: #666;
            }

            .path-objectives {
                margin: 20px 0;
            }

            .path-objectives h4 {
                margin: 0 0 10px 0;
                color: #333;
            }

            .path-objectives ul {
                margin: 0;
                padding-left: 20px;
            }

            .path-objectives li {
                margin: 5px 0;
                color: #666;
            }

            .path-scenarios {
                margin: 20px 0;
            }

            .path-scenarios h4 {
                margin: 0 0 15px 0;
                color: #333;
            }

            .scenario-list {
                display: grid;
                gap: 10px;
            }

            .path-scenario-item {
                display: flex;
                align-items: center;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 6px;
                gap: 10px;
            }

            .path-scenario-item.completed {
                background: #e8f5e8;
            }

            .scenario-status {
                font-size: 1.2rem;
                width: 30px;
                text-align: center;
            }

            .scenario-info {
                flex: 1;
            }

            .scenario-title {
                font-weight: 500;
                color: #333;
                margin-bottom: 2px;
            }

            .scenario-meta {
                display: flex;
                gap: 10px;
            }

            .scenario-meta span {
                font-size: 0.8rem;
                color: #888;
                background: #e9ecef;
                padding: 2px 6px;
                border-radius: 10px;
            }

            .path-actions {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 20px;
            }

            .learning-path-placeholder {
                text-align: center;
                padding: 40px;
                color: #666;
                font-style: italic;
            }
        `;

        document.head.appendChild(style);
    }

    // 获取学习统计
    getLearningStats() {
        return {
            currentLevel: this.userLevel,
            currentPath: this.currentPath,
            pathProgress: this.getPathProgress(),
            completedScenarios: this.userProgress.completedScenarios.size,
            weakAreas: this.userProgress.weakAreas,
            strongAreas: this.userProgress.strongAreas
        };
    }
}

// 创建全局学习路径系统实例
let learningPathSystem;

function initializeLearningPathSystem() {
    learningPathSystem = new LearningPathSystem();
    window.learningPathSystem = learningPathSystem;

    console.log('🎓 学习路径系统已初始化');
}

// 初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLearningPathSystem);
} else {
    initializeLearningPathSystem();
}

// 导出
window.LearningPathSystem = LearningPathSystem;