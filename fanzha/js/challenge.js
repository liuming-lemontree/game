// 挑战模式管理器
class ChallengeManager {
    constructor() {
        this.currentChallenge = null;
        this.challengeTimer = null;
        this.questionTimer = null;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.answeredCount = 0;
        this.correctCount = 0;
        this.startTime = null;
        this.usedScenarios = new Set();
        this.storage = window.storageManager;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadChallengeRecords();
    }

    // 绑定事件
    bindEvents() {
        // 挑战模式按钮
        const challengeBtn = document.getElementById('challenge-btn');
        if (challengeBtn) {
            challengeBtn.addEventListener('click', () => this.showChallengePanel());
        }

        // 关闭挑战面板
        const closeChallengeBtn = document.getElementById('close-challenge');
        if (closeChallengeBtn) {
            closeChallengeBtn.addEventListener('click', () => this.hideChallengePanel());
        }

        // 开始挑战按钮
        document.querySelectorAll('.start-challenge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.startChallenge(mode);
            });
        });

        // 退出挑战按钮
        const quitChallengeBtn = document.getElementById('quit-challenge');
        if (quitChallengeBtn) {
            quitChallengeBtn.addEventListener('click', () => this.quitChallenge());
        }

        // 再次挑战按钮
        const retryChallengeBtn = document.getElementById('retry-challenge');
        if (retryChallengeBtn) {
            retryChallengeBtn.addEventListener('click', () => this.retryChallenge());
        }

        // 返回菜单按钮
        const backToMenuBtn = document.getElementById('back-to-menu');
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => this.backToMenu());
        }
    }

    // 面板显示/隐藏现在由PageManager管理
    // 当切换到挑战页面时，会自动调用loadChallengeRecords()

    // 开始挑战
    startChallenge(mode) {
        const difficulty = this.getDifficultyForMode(mode);
        const questionCount = this.getQuestionCountForMode(mode);

        this.currentChallenge = {
            mode: mode,
            difficulty: difficulty,
            questionCount: questionCount,
            timeLimit: this.getTimeLimitForMode(mode),
            questionTimeLimit: this.getQuestionTimeLimitForMode(mode)
        };

        this.resetChallengeStats();
        this.hideChallengePanel();
        this.showChallengeGame();
        this.startChallengeTimer();
        this.loadNextScenario();
    }

    // 获取模式对应的难度
    getDifficultyForMode(mode) {
        switch (mode) {
            case 'timed':
                return document.getElementById('timed-difficulty').value;
            case 'survival':
                return document.getElementById('survival-difficulty').value;
            case 'speed':
                return 'random'; // 极速模式使用随机难度
            default:
                return 'all';
        }
    }

    // 获取模式对应的题目数量
    getQuestionCountForMode(mode) {
        switch (mode) {
            case 'speed':
                return parseInt(document.getElementById('speed-count').value);
            default:
                return null; // 其他模式题目数量不限
        }
    }

    // 获取模式对应的时间限制
    getTimeLimitForMode(mode) {
        switch (mode) {
            case 'timed':
                return 60; // 60秒
            case 'speed':
                return null; // 每题单独计时
            case 'survival':
                return null; // 无时间限制
            default:
                return null;
        }
    }

    // 获取每题的时间限制
    getQuestionTimeLimitForMode(mode) {
        switch (mode) {
            case 'speed':
                return 10; // 10秒每题
            default:
                return null;
        }
    }

    // 重置挑战统计
    resetChallengeStats() {
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.answeredCount = 0;
        this.correctCount = 0;
        this.startTime = Date.now();
        this.usedScenarios.clear();
    }

    // 显示挑战游戏界面
    showChallengeGame() {
        const gameElement = document.getElementById('challenge-game');
        if (gameElement) {
            gameElement.style.display = 'flex';
            this.updateChallengeUI();
        }
    }

    // 隐藏挑战游戏界面
    hideChallengeGame() {
        const gameElement = document.getElementById('challenge-game');
        if (gameElement) {
            gameElement.style.display = 'none';
        }
    }

    // 开始挑战计时器
    startChallengeTimer() {
        if (this.currentChallenge.timeLimit) {
            let timeLeft = this.currentChallenge.timeLimit;
            this.updateTimerDisplay(timeLeft);

            this.challengeTimer = setInterval(() => {
                timeLeft--;
                this.updateTimerDisplay(timeLeft);

                if (timeLeft <= 0) {
                    this.endChallenge();
                }
            }, 1000);
        }
    }

    // 开始单题计时器
    startQuestionTimer() {
        if (this.currentChallenge.questionTimeLimit) {
            let timeLeft = this.currentChallenge.questionTimeLimit;
            this.updateQuestionTimerDisplay(timeLeft);

            this.questionTimer = setInterval(() => {
                timeLeft--;
                this.updateQuestionTimerDisplay(timeLeft);

                if (timeLeft <= 0) {
                    this.handleTimeout();
                }
            }, 1000);
        }
    }

    // 停止计时器
    stopTimers() {
        if (this.challengeTimer) {
            clearInterval(this.challengeTimer);
            this.challengeTimer = null;
        }
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
    }

    // 播放音效
    playSound(type) {
        // 使用Web Audio API创建简单的音效
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            switch (type) {
                case 'correct':
                    oscillator.frequency.value = 800;
                    gainNode.gain.value = 0.1;
                    break;
                case 'wrong':
                    oscillator.frequency.value = 300;
                    gainNode.gain.value = 0.1;
                    break;
                case 'timeout':
                    oscillator.frequency.value = 200;
                    gainNode.gain.value = 0.15;
                    break;
                case 'complete':
                    oscillator.frequency.value = 1000;
                    gainNode.gain.value = 0.2;
                    break;
            }

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // 如果音频API不可用，静默失败
        }
    }

    // 添加震动反馈
    addVibration() {
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    }

    // 更新计时器显示
    updateTimerDisplay(timeLeft) {
        const timerElement = document.getElementById('challenge-timer');
        if (timerElement) {
            timerElement.textContent = `⏱️ ${timeLeft}`;

            // 时间少于10秒时添加警告动画
            if (timeLeft <= 10) {
                timerElement.style.color = '#f44336';
                timerElement.classList.add('warning');
            } else {
                timerElement.style.color = '#ffeb3b';
                timerElement.classList.remove('warning');
            }
        }
    }

    // 更新单题计时器显示
    updateQuestionTimerDisplay(timeLeft) {
        const timerElement = document.getElementById('challenge-timer');
        if (timerElement) {
            timerElement.textContent = `⏱️ ${timeLeft}`;

            // 时间少于3秒时变红
            if (timeLeft <= 3) {
                timerElement.style.color = '#f44336';
            } else {
                timerElement.style.color = '#ffeb3b';
            }
        }
    }

    // 加载下一个场景
    loadNextScenario() {
        if (this.currentChallenge.mode === 'speed' &&
            this.answeredCount >= this.currentChallenge.questionCount) {
            this.endChallenge();
            return;
        }

        const scenario = this.getRandomScenario();
        if (!scenario) {
            this.endChallenge();
            return;
        }

        this.displayScenario(scenario);
        this.startQuestionTimer();
    }

    // 获取随机场景
    getRandomScenario() {
        const availableScenarios = window.scenarios.filter(scenario => {
            // 过滤已使用的场景
            if (this.usedScenarios.has(scenario.id)) {
                return false;
            }

            // 根据难度过滤
            if (this.currentChallenge.difficulty !== 'all' &&
                this.currentChallenge.difficulty !== 'random') {
                const difficultyMap = {
                    'easy': '简单',
                    'medium': '中等',
                    'hard': '困难'
                };
                return scenario.difficulty === difficultyMap[this.currentChallenge.difficulty];
            }

            return true;
        });

        if (availableScenarios.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * availableScenarios.length);
        const scenario = availableScenarios[randomIndex];
        this.usedScenarios.add(scenario.id);
        return scenario;
    }

    // 显示场景
    displayScenario(scenario) {
        // 更新场景类型
        const typeElement = document.getElementById('challenge-scenario-type');
        if (typeElement) {
            typeElement.textContent = scenario.type;
        }

        // 更新场景标题
        const titleElement = document.getElementById('challenge-scenario-title');
        if (titleElement) {
            titleElement.textContent = scenario.title;
        }

        // 更新发件人
        const senderElement = document.getElementById('challenge-scenario-sender');
        if (senderElement) {
            senderElement.textContent = scenario.sender;
        }

        // 更新内容
        const contentElement = document.getElementById('challenge-scenario-content');
        if (contentElement) {
            contentElement.textContent = scenario.content;
        }

        // 清空并生成选项
        const optionsContainer = document.getElementById('challenge-options');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';

            // 随机打乱选项顺序
            const shuffledChoices = [...scenario.choices].sort(() => Math.random() - 0.5);

            shuffledChoices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = choice.text;
                button.addEventListener('click', () => this.handleAnswer(choice, scenario));
                optionsContainer.appendChild(button);
            });
        }

        // 更新进度
        this.updateProgress();
    }

    // 处理答案
    handleAnswer(choice, scenario) {
        this.stopTimers();
        this.answeredCount++;

        const optionsContainer = document.getElementById('challenge-options');
        const buttons = optionsContainer.querySelectorAll('button');

        // 禁用所有按钮
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'not-allowed';
        });

        // 添加视觉反馈
        if (choice.isCorrect) {
            this.correctCount++;
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
            this.score += scenario.points;

            // 连击奖励
            if (this.streak >= 3) {
                const bonus = Math.floor(scenario.points * 0.1 * this.streak);
                this.score += bonus;
                this.showFloatingText(`+${bonus} 连击奖励!`, '#4caf50');
            }

            // 播放正确音效和震动
            this.playSound('correct');
            this.addVibration();

            // 添加正确答案动画
            this.showAnswerFeedback('correct', choice);
        } else {
            this.streak = 0;

            // 播放错误音效
            this.playSound('wrong');
            this.addVibration();

            // 添加错误答案动画
            this.showAnswerFeedback('wrong', choice);

            // 生存模式答错即结束
            if (this.currentChallenge.mode === 'survival') {
                setTimeout(() => {
                    this.endChallenge();
                }, 1500);
                return;
            }
        }

        this.updateChallengeUI();

        // 延迟加载下一题
        setTimeout(() => {
            this.loadNextScenario();
        }, 1500);
    }

    // 显示答案反馈
    showAnswerFeedback(type, choice) {
        const buttons = document.querySelectorAll('#challenge-options button');
        buttons.forEach(btn => {
            if (btn.textContent === choice.text) {
                if (type === 'correct') {
                    btn.style.background = 'linear-gradient(135deg, #4caf50, #8bc34a)';
                    btn.style.color = 'white';
                    btn.style.transform = 'scale(1.05)';
                    btn.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.4)';
                } else {
                    btn.style.background = 'linear-gradient(135deg, #f44336, #e91e63)';
                    btn.style.color = 'white';
                    btn.style.transform = 'scale(1.05)';
                    btn.style.boxShadow = '0 4px 20px rgba(244, 67, 54, 0.4)';
                }
            } else if (choice.isCorrect) {
                // 如果有正确答案但用户选错了，高亮正确答案
                btn.style.background = 'linear-gradient(135deg, #4caf50, #8bc34a)';
                btn.style.color = 'white';
                btn.style.opacity = '0.7';
            } else {
                btn.style.opacity = '0.4';
            }
        });
    }

    // 显示浮动文字效果
    showFloatingText(text, color = '#4caf50') {
        const floatingText = document.createElement('div');
        floatingText.textContent = text;
        floatingText.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: ${color};
            font-size: 2em;
            font-weight: bold;
            z-index: 10000;
            animation: floatUp 2s ease-out forwards;
            pointer-events: none;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -150%);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(floatingText);

        // 清理
        setTimeout(() => {
            document.body.removeChild(floatingText);
            document.head.removeChild(style);
        }, 2000);
    }

    // 处理超时
    handleTimeout() {
        this.stopTimers();
        this.streak = 0;
        this.answeredCount++;

        // 播放超时音效和震动
        this.playSound('timeout');
        this.addVibration();

        // 显示超时提示
        this.showFloatingText('时间到！', '#ff9800');

        // 禁用所有按钮并显示正确答案
        const optionsContainer = document.getElementById('challenge-options');
        const buttons = optionsContainer.querySelectorAll('button');

        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'not-allowed';
            btn.style.opacity = '0.4';

            // 高亮正确答案
            const choice = this.currentScenario.choices.find(c => c.isCorrect);
            if (choice && btn.textContent === choice.text) {
                btn.style.background = 'linear-gradient(135deg, #4caf50, #8bc34a)';
                btn.style.color = 'white';
                btn.style.opacity = '0.8';
            }
        });

        // 生存模式超时即结束
        if (this.currentChallenge.mode === 'survival') {
            setTimeout(() => {
                this.endChallenge();
            }, 1500);
            return;
        }

        this.updateChallengeUI();

        // 延迟加载下一题
        setTimeout(() => {
            this.loadNextScenario();
        }, 1500);
    }

    // 更新挑战UI
    updateChallengeUI() {
        // 更新模式名称
        const modeNameElement = document.getElementById('challenge-mode-name');
        if (modeNameElement) {
            const modeNames = {
                'timed': '限时挑战',
                'survival': '生存模式',
                'speed': '极速模式'
            };
            modeNameElement.textContent = modeNames[this.currentChallenge.mode] || '挑战模式';
        }

        // 更新分数（添加动画）
        const scoreElement = document.getElementById('challenge-score');
        if (scoreElement) {
            const newScore = `得分: ${this.score}`;
            if (scoreElement.textContent !== newScore) {
                scoreElement.textContent = newScore;
                scoreElement.classList.add('score-pop');
                setTimeout(() => {
                    scoreElement.classList.remove('score-pop');
                }, 500);
            }
        }

        // 更新连击（添加动画）
        const streakElement = document.getElementById('challenge-streak');
        if (streakElement) {
            const newStreak = `连击: ${this.streak}`;
            if (streakElement.textContent !== newStreak) {
                streakElement.textContent = newStreak;
                if (this.streak >= 3) {
                    streakElement.classList.add('streak-active');
                    setTimeout(() => {
                        streakElement.classList.remove('streak-active');
                    }, 500);
                }
            }
        }
    }

    // 更新进度
    updateProgress() {
        const progressBar = document.getElementById('challenge-progress-bar');
        const progressText = document.getElementById('challenge-progress-text');

        if (progressBar && progressText) {
            if (this.currentChallenge.mode === 'speed') {
                const progress = (this.answeredCount / this.currentChallenge.questionCount) * 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `进度: ${this.answeredCount}/${this.currentChallenge.questionCount}`;
            } else {
                // 其他模式显示已答题数
                progressBar.style.width = '0%';
                progressText.textContent = `已答题: ${this.answeredCount}`;
            }
        }
    }

    // 结束挑战
    endChallenge() {
        this.stopTimers();

        const endTime = Date.now();
        const totalTime = Math.floor((endTime - this.startTime) / 1000);
        const accuracy = this.answeredCount > 0 ? Math.round((this.correctCount / this.answeredCount) * 100) : 0;

        // 保存挑战记录
        this.saveChallengeRecord({
            mode: this.currentChallenge.mode,
            score: this.score,
            accuracy: accuracy,
            answeredCount: this.answeredCount,
            correctCount: this.correctCount,
            maxStreak: this.maxStreak,
            time: totalTime,
            date: new Date().toISOString()
        });

        // 显示结果
        this.showChallengeResult({
            score: this.score,
            accuracy: accuracy,
            maxStreak: this.maxStreak,
            time: totalTime
        });
    }

    // 显示挑战结果
    showChallengeResult(stats) {
        this.hideChallengeGame();

        const resultElement = document.getElementById('challenge-result');
        if (resultElement) {
            // 更新统计数据
            document.getElementById('final-score').textContent = stats.score;
            document.getElementById('final-accuracy').textContent = `${stats.accuracy}%`;
            document.getElementById('final-streak').textContent = stats.maxStreak;
            document.getElementById('final-time').textContent = `${stats.time}秒`;

            // 根据表现设置标题
            const titleElement = document.getElementById('challenge-result-title');
            if (stats.accuracy >= 90) {
                titleElement.textContent = '🏆 挑战成功！';
                titleElement.style.color = '#4caf50';
            } else if (stats.accuracy >= 70) {
                titleElement.textContent = '👍 表现不错！';
                titleElement.style.color = '#ff9800';
            } else {
                titleElement.textContent = '💪 继续努力！';
                titleElement.style.color = '#2196f3';
            }

            resultElement.style.display = 'flex';
        }
    }

    // 隐藏挑战结果
    hideChallengeResult() {
        const resultElement = document.getElementById('challenge-result');
        if (resultElement) {
            resultElement.style.display = 'none';
        }
    }

    // 显示挑战选择面板
    showChallengePanel() {
        // 这个方法现在由PageManager管理
        if (window.Navigation) {
            window.Navigation.showChallenge();
        }
    }

    // 隐藏挑战选择面板
    hideChallengePanel() {
        // 这个方法现在由PageManager管理
        if (window.pageManager) {
            // 页面切换由PageManager处理
        }
    }

    // 退出挑战
    quitChallenge() {
        this.stopTimers();
        this.hideChallengeGame();
        this.currentChallenge = null;
    }

    // 再次挑战
    retryChallenge() {
        this.hideChallengeResult();
        if (this.currentChallenge) {
            this.startChallenge(this.currentChallenge.mode);
        }
    }

    // 返回菜单
    backToMenu() {
        this.hideChallengeResult();
        this.showChallengePanel();
    }

    // 保存挑战记录
    saveChallengeRecord(record) {
        try {
            let records = JSON.parse(localStorage.getItem('challengeRecords') || '[]');
            records.unshift(record); // 新记录放在前面

            // 只保留最近100条记录
            if (records.length > 100) {
                records = records.slice(0, 100);
            }

            localStorage.setItem('challengeRecords', JSON.stringify(records));
        } catch (error) {
            console.error('保存挑战记录失败:', error);
        }
    }

    // 加载挑战记录
    loadChallengeRecords() {
        try {
            const records = JSON.parse(localStorage.getItem('challengeRecords') || '[]');
            this.displayChallengeRecords(records);
        } catch (error) {
            console.error('加载挑战记录失败:', error);
        }
    }

    // 显示挑战记录
    displayChallengeRecords(records) {
        const recordsList = document.getElementById('challenge-records-list');
        if (!recordsList) return;

        if (records.length === 0) {
            recordsList.innerHTML = '<p style="text-align: center; color: #666;">暂无挑战记录</p>';
            return;
        }

        // 只显示最近10条记录
        const recentRecords = records.slice(0, 10);

        recordsList.innerHTML = recentRecords.map(record => {
            const date = new Date(record.date);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

            const modeNames = {
                'timed': '限时',
                'survival': '生存',
                'speed': '极速'
            };

            return `
                <div class="record-item">
                    <div>
                        <span style="font-weight: bold;">${modeNames[record.mode] || record.mode}</span>
                        <span style="margin-left: 10px; color: #666;">${dateStr}</span>
                    </div>
                    <div>
                        <span style="color: #4caf50; font-weight: bold;">${record.score}分</span>
                        <span style="margin-left: 10px; color: #666;">${record.accuracy}%</span>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// 初始化挑战管理器
window.challengeManager = new ChallengeManager();