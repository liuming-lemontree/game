class GameEngine {
  constructor() {
    this.currentScenario = null;
    this.score = 0;
    this.answeredScenarios = new Set();
    this.correctStreak = 0; // 连击计数
    this.gameStats = {
      totalAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalScore: 0,
      completedCategories: new Set(),
      completedDifficulties: new Set(),
      fastAnswers: 0,
      corrections: 0,
      todayProgress: 0,
      consecutiveDays: 1,
      lastPlayDate: new Date().toDateString()
    };
    this.answerStartTime = null; // 记录答题开始时间
    this.storage = window.storageManager;
    this.achievementManager = window.achievementManager;
    // 当前场景引用
    this.currentScenario = null;
    // 确保storage manager已初始化
    if (this.storage && typeof this.storage.init === 'function') {
      this.storage.init();
    }
    this.init();
  }

  init() {
    console.log('Game initializing...');

    // 检查依赖是否加载
    if (!window.scenarios || window.scenarios.length === 0) {
      throw new Error('Scenarios data not loaded');
    }

    // 确保页面管理器已初始化
    if (!window.pageManager) {
      console.error('Page manager not initialized');
      return;
    }

    this.loadProgress();
    this.bindEvents();
    this.loadRandomScenario();

    // 初始化教程和成就系统
    this.initializeTutorial();
    this.initializeAchievements();

    console.log('Game initialization complete');
  }

  // 初始化教程系统
  initializeTutorial() {
    if (window.tutorialManager) {
      window.tutorialManager.initialize();
    }
  }

  // 初始化成就系统
  initializeAchievements() {
    if (window.achievementManager) {
      window.achievementManager.initialize();
    }
  }

  bindEvents() {
    // 绑定选项按钮事件
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('option-btn')) {
        const choiceIndex = parseInt(e.target.dataset.index);
        this.handleAnswer(choiceIndex);
      }
    });

    // 绑定下一题按钮事件
    document.getElementById('next-btn').addEventListener('click', () => {
      this.loadRandomScenario();
    });

    // 绑定重新开始按钮事件
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.restart();
    });

    // 教程按钮
    document.getElementById('tutorial-btn')?.addEventListener('click', () => {
      if (window.Navigation) {
        window.Navigation.showTutorial();
      }
    });

    // 学习进度按钮
    document.getElementById('progress-btn')?.addEventListener('click', () => {
      if (window.Navigation) {
        window.Navigation.showProgress();
      }
    });

    // 挑战模式按钮
    document.getElementById('challenge-btn')?.addEventListener('click', () => {
      if (window.Navigation) {
        window.Navigation.showChallenge();
      }
    });

    // 成就按钮
    document.getElementById('achievements-btn')?.addEventListener('click', () => {
      if (window.Navigation) {
        window.Navigation.showAchievements();
      }
    });

    // 退出游戏按钮
    document.getElementById('exit-btn')?.addEventListener('click', () => {
      this.handleExit();
    });

    // 这些事件监听器已移除，因为我们不再使用弹窗模式
    // 页面切换现在由 PageManager 处理
  }

  loadRandomScenario() {
    // 隐藏结果面板
    document.getElementById('result').style.display = 'none';

    // 记录答题开始时间
    this.answerStartTime = Date.now();

    // 获取所有未答过的场景
    const availableScenarios = window.scenarios.filter(s => !this.answeredScenarios.has(s.id));

    // 如果所有场景都已答过，显示完成信息
    if (availableScenarios.length === 0) {
      this.showCompletion();
      return;
    }

    // 随机选择一个场景
    const randomIndex = Math.floor(Math.random() * availableScenarios.length);
    this.currentScenario = availableScenarios[randomIndex];

    // 渲染场景
    this.renderScenario();
  }

  renderScenario() {
    if (!this.currentScenario) {
      console.error('No current scenario to render');
      return;
    }

    // 更新场景信息
    document.getElementById('scenario-type').textContent = this.currentScenario.type;
    document.getElementById('scenario-title').textContent = this.currentScenario.title;
    document.getElementById('scenario-sender').textContent = this.currentScenario.sender;
    document.getElementById('scenario-content').textContent = this.currentScenario.content;
    
    // 处理选项：确保有4个选项并随机排列
    let choices = [...this.currentScenario.choices];
    
    // 如果选项少于4个，添加额外的错误选项
    if (choices.length < 4) {
      // 创建额外的错误选项
      const additionalChoices = [
        { text: '半信半疑，先查看更多信息', isCorrect: false, feedback: '❌ 错误！面对可疑信息应采取明确的安全措施', tips: '✅ 正确做法：通过官方渠道核实信息' },
        { text: '联系对方了解更多细节', isCorrect: false, feedback: '❌ 错误！不应主动联系可疑来源', tips: '✅ 正确做法：通过官方渠道核实身份' },
        { text: '稍后再处理', isCorrect: false, feedback: '❌ 错误！延迟处理可能导致错过处理真实问题的时机', tips: '✅ 正确做法：通过官方渠道及时核实' }
      ];
      
      // 随机添加额外选项直到有4个
      let addedCount = 0;
      const neededCount = 4 - choices.length;
      const usedIndices = new Set();
      
      while (addedCount < neededCount && addedCount < additionalChoices.length) {
        const randomIndex = Math.floor(Math.random() * additionalChoices.length);
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          choices.push(additionalChoices[randomIndex]);
          addedCount++;
        }
      }
    }
    
    // 随机打乱选项顺序
    choices = this.shuffleArray(choices);
    
    // 渲染选项
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    // 保存原始索引映射关系
    this.currentScenarioChoices = choices;
    
    choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'option-btn';
      button.dataset.index = index;
      button.textContent = choice.text;
      optionsContainer.appendChild(button);
    });
    
    // 显示场景容器
    document.getElementById('scenario-container').style.display = 'block';
  }
  
  // 随机打乱数组的辅助方法
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  handleAnswer(choiceIndex, choice = null) {
    if (!this.currentScenario) {
        console.error('No current scenario available');
        return;
    }

    // 如果没有直接传入choice对象，从打乱后的选项数组中获取
    const selectedChoice = choice || this.currentScenarioChoices[choiceIndex];

    if (!selectedChoice) {
        console.error('No selected choice found for index:', choiceIndex);
        return;
    }

    const answerTime = this.answerStartTime ? Date.now() - this.answerStartTime : 0;

    // 判断答案是否正确
    const isCorrect = selectedChoice.isCorrect;

    // 更新游戏统计
    this.gameStats.totalAnswered++;
    this.gameStats.todayProgress++;

    // 更新得分和连击
    if (isCorrect) {
      this.score += this.currentScenario.points;
      this.gameStats.correctAnswers++;
      this.gameStats.currentStreak++;
      this.gameStats.totalScore += this.currentScenario.points;

      // 更新最佳连击
      if (this.gameStats.currentStreak > this.gameStats.bestStreak) {
        this.gameStats.bestStreak = this.gameStats.currentStreak;
      }

      // 检查快速答题（5秒内）
      if (answerTime < 5000) {
        this.gameStats.fastAnswers++;
      }

      // 添加震动反馈（如果设备支持）
      if (navigator.vibrate) {
        navigator.vibrate([100]);
      }
    } else {
      // 答错重置连击
      this.gameStats.currentStreak = 0;
    }

    // 记录已答场景和分类
    this.answeredScenarios.add(this.currentScenario.id);
    this.gameStats.completedCategories.add(this.currentScenario.type);
    this.gameStats.completedDifficulties.add(this.currentScenario.difficulty);

    // 检查成就
    if (this.achievementManager) {
      this.achievementManager.checkAchievements(this.gameStats);

      // 检查特定成就
      if (isCorrect) {
        // 连击成就
        if (this.gameStats.currentStreak >= 5) {
          this.achievementManager.unlockAchievement('streak_master');
        }
        if (this.gameStats.currentStreak >= 10) {
          this.achievementManager.unlockAchievement('perfect_streak');
        }

        // 分类成就
        if (this.currentScenario.type === '网络诈骗') {
          this.achievementManager.unlockAchievement('cyber_aware');
        } else if (this.currentScenario.type === '社交诈骗') {
          this.achievementManager.unlockAchievement('social_guardian');
        }

        // 难度成就
        if (this.currentScenario.difficulty === 'hard') {
          this.achievementManager.unlockAchievement('expert_detector');
        }

        // 快速答题成就
        if (answerTime < 3000) {
          this.achievementManager.unlockAchievement('quick_thinker');
        }
      }

      // 积分成就
      if (this.score >= 100) {
        this.achievementManager.unlockAchievement('score_hunter');
      }
      if (this.score >= 500) {
        this.achievementManager.unlockAchievement('points_master');
      }

      // 答题数量成就
      if (this.gameStats.totalAnswered >= 10) {
        this.achievementManager.unlockAchievement('diligent_learner');
      }
      if (this.gameStats.totalAnswered >= 50) {
        this.achievementManager.unlockAchievement('knowledge_seeker');
      }

      // 正确率成就
      if (this.gameStats.totalAnswered >= 20 && this.gameStats.correctAnswers / this.gameStats.totalAnswered >= 0.8) {
        this.achievementManager.unlockAchievement('accuracy_expert');
      }

      // 分类完成成就
      if (this.gameStats.completedCategories.size >= 2) {
        this.achievementManager.unlockAchievement('multi_category');
      }
      if (this.gameStats.completedCategories.size >= 4) {
        this.achievementManager.unlockAchievement('all_category');
      }
    }

    // 保存进度
    this.saveProgress();

    // 显示结果
    this.showResult(isCorrect, selectedChoice);
  }

  showResult(isCorrect, choice) {
    // 隐藏场景容器
    document.getElementById('scenario-container').style.display = 'none';

    // 更新结果信息
    // 确保使用传入的选项对象中的反馈和提示信息
    document.getElementById('result-feedback').textContent = choice.feedback;
    document.getElementById('result-tips').textContent = choice.tips;
    document.getElementById('score-value').textContent = this.score;

    // 显示结果面板
    document.getElementById('result').style.display = 'block';
  }

  showCompletion() {
    // 隐藏场景容器
    document.getElementById('scenario-container').style.display = 'none';
    
    // 显示完成信息
    document.getElementById('result-feedback').textContent = '🎉 恭喜完成所有场景学习！';
    document.getElementById('result-tips').textContent = '您已掌握所有反诈知识，继续保持警惕！';
    document.getElementById('score-value').textContent = this.score;
    
    // 显示结果面板
    document.getElementById('result').style.display = 'block';
  }

  saveProgress() {
    const progress = {
      score: this.score,
      answeredScenarios: Array.from(this.answeredScenarios),
      gameStats: {
        ...this.gameStats,
        completedCategories: Array.from(this.gameStats.completedCategories),
        completedDifficulties: Array.from(this.gameStats.completedDifficulties)
      }
    };
    this.storage.saveProgress(progress);
  }

  loadProgress() {
    const progress = this.storage.loadProgress();
    if (progress) {
      this.score = progress.score || 0;
      this.answeredScenarios = new Set(progress.answeredScenarios || []);
      
      // 加载游戏统计
      if (progress.gameStats) {
        this.gameStats = {
          ...progress.gameStats,
          completedCategories: new Set(progress.gameStats.completedCategories || []),
          completedDifficulties: new Set(progress.gameStats.completedDifficulties || [])
        };
      }
      
      document.getElementById('score-value').textContent = this.score;
    }
  }

  restart() {
    // 重置游戏状态
    this.score = 0;
    this.answeredScenarios.clear();
    this.correctStreak = 0;
    this.gameStats = {
      totalAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalScore: 0,
      completedCategories: new Set(),
      completedDifficulties: new Set(),
      fastAnswers: 0,
      corrections: 0,
      todayProgress: 0,
      consecutiveDays: 1,
      lastPlayDate: new Date().toDateString()
    };
    
    // 清除存储
    this.storage.clearProgress();
    
    // 更新UI
    document.getElementById('score-value').textContent = this.score;
    
    // 加载新场景
    this.loadRandomScenario();
  }

  // 获取游戏统计信息
  getGameStats() {
    return {
      ...this.gameStats,
      completedCategories: this.gameStats.completedCategories.size,
      completedDifficulties: this.gameStats.completedDifficulties.size,
      accuracy: this.gameStats.totalAnswered > 0 ? 
        Math.round((this.gameStats.correctAnswers / this.gameStats.totalAnswered) * 100) : 0
    };
  }

  // 更新统计信息（供外部调用）
  updateStats() {
    // 更新UI显示
    document.getElementById('score-value').textContent = this.score;
    
    // 如果成就面板已打开，刷新显示
    const achievementsPanel = document.getElementById('achievements-panel');
    if (achievementsPanel && achievementsPanel.style.display === 'block') {
      if (window.achievementManager) {
        window.achievementManager.renderAchievementsPanel();
      }
    }
    
    // 如果统计面板已打开，刷新显示
    const statsPanel = document.getElementById('stats-panel');
    if (statsPanel && statsPanel.style.display === 'block') {
      this.showStatsPanel();
    }
  }

  // 退出游戏处理
  handleExit() {
     if (confirm('确定要退出游戏吗？当前进度会自动保存')) {
       this.saveProgress();
       window.close();
     }
   }

  // 显示统计面板
  showStatsPanel() {
    const stats = this.getGameStats();
    const panel = document.getElementById('stats-panel');
    if (!panel) return;

    panel.innerHTML = `
      <div class="stats-container">
        <h3>📊 游戏统计</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">${stats.totalAnswered}</div>
            <div class="stat-label">总答题数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${stats.accuracy}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${stats.bestStreak}</div>
            <div class="stat-label">最佳连击</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${stats.totalScore}</div>
            <div class="stat-label">总积分</div>
          </div>
        </div>
        <div class="stats-details">
          <div class="detail-item">
            <span>完成分类：</span>
            <span>${stats.completedCategories}/4</span>
          </div>
          <div class="detail-item">
            <span>完成难度：</span>
            <span>${stats.completedDifficulties}/3</span>
          </div>
          <div class="detail-item">
            <span>快速答题：</span>
            <span>${stats.fastAnswers}次</span>
          </div>
        </div>
        <button id="close-stats" class="btn close-btn">关闭</button>
      </div>
    `;

    panel.style.display = 'block';

    document.getElementById('close-stats')?.addEventListener('click', () => {
      panel.style.display = 'none';
    });
  }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('DOM loaded, initializing game...');
    window.game = new GameEngine();
    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Error initializing game:', error);

    // 显示错误信息给用户
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 50px; color: red;">
          <h2>游戏加载失败</h2>
          <p>错误信息: ${error.message}</p>
          <p>请刷新页面重试，或检查浏览器控制台获取更多信息。</p>
          <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            刷新页面
          </button>
        </div>
      `;
    }
  }
});