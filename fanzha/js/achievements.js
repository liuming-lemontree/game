// 成就系统 - 激励用户学习和防范诈骗
class AchievementManager {
  constructor() {
    this.achievements = this.getAchievementsData();
    this.unlockedAchievements = new Set();
    this.storage = window.storageManager;
    this.init();
  }

  init() {
    this.loadAchievementProgress();
  }

  // 成就数据
  getAchievementsData() {
    return {
      'first_answer': {
        title: '初出茅庐',
        description: '完成第一个诈骗场景',
        icon: '🌟',
        requirement: 1,
        type: 'progress',
        category: '基础成就'
      },
      'ten_answers': {
        title: '小有成就',
        description: '完成10个诈骗场景',
        icon: '⭐',
        requirement: 10,
        type: 'progress',
        category: '基础成就'
      },
      'fifty_answers': {
        title: '经验丰富',
        description: '完成50个诈骗场景',
        icon: '🏆',
        requirement: 50,
        type: 'progress',
        category: '基础成就'
      },
      'hundred_answers': {
        title: '反诈专家',
        description: '完成100个诈骗场景',
        icon: '👑',
        requirement: 100,
        type: 'progress',
        category: '基础成就'
      },
      'perfect_score': {
        title: '完美解答',
        description: '连续答对10个场景',
        icon: '💯',
        requirement: 10,
        type: 'streak',
        category: '技巧成就'
      },
      'lightning_fast': {
        title: '反应神速',
        description: '在5秒内快速答对场景',
        icon: '⚡',
        requirement: 1,
        type: 'speed',
        category: '技巧成就'
      },
      'category_master': {
        title: '分类大师',
        description: '完成所有类型的诈骗场景',
        icon: '🎯',
        requirement: 4, // 4种类型：电话、短信、网络、社交
        type: 'category',
        category: '技巧成就'
      },
      'tutorial_complete': {
        title: '学无止境',
        description: '完成所有教程学习',
        icon: '📚',
        requirement: 4, // 4个教程模块
        type: 'tutorial',
        category: '学习成就'
      },
      'high_score': {
        title: '高分达人',
        description: '累计获得1000积分',
        icon: '💰',
        requirement: 1000,
        type: 'score',
        category: '积分成就'
      },
      'score_master': {
        title: '积分大师',
        description: '累计获得5000积分',
        icon: '💎',
        requirement: 5000,
        type: 'score',
        category: '积分成就'
      },
      'combo_master': {
        title: '连击大师',
        description: '连续答对20个场景',
        icon: '🔥',
        requirement: 20,
        type: 'streak',
        category: '技巧成就'
      },
      'diverse_knowledge': {
        title: '知识渊博',
        description: '在不同难度级别都答对过场景',
        icon: '🧠',
        requirement: 3, // 3个难度：简单、中等、困难
        type: 'difficulty',
        category: '学习成就'
      },
      'persistent': {
        title: '坚持不懈',
        description: '连续7天登录游戏',
        icon: '🗓️',
        requirement: 7,
        type: 'daily',
        category: '活跃成就'
      },
      'error_correction': {
        title: '知错能改',
        description: '答错后重新学习并答对',
        icon: '🔄',
        requirement: 1,
        type: 'correction',
        category: '学习成就'
      },
      'quick_learner': {
        title: '快速学习者',
        description: '在一天内完成10个场景',
        icon: '🚀',
        requirement: 10,
        type: 'daily_progress',
        category: '活跃成就'
      },
      'streak_master': {
        title: '连击高手',
        description: '连续答对5个场景',
        icon: '🔥',
        requirement: 5,
        type: 'streak',
        category: '技巧成就'
      },
      'perfect_streak': {
        title: '完美连击',
        description: '连续答对10个场景',
        icon: '💎',
        requirement: 10,
        type: 'streak',
        category: '技巧成就'
      },
      'cyber_aware': {
        title: '网络安全意识',
        description: '识别网络诈骗',
        icon: '💻',
        requirement: 1,
        type: 'category',
        category: '分类成就'
      },
      'social_guardian': {
        title: '社交守护者',
        description: '识别社交诈骗',
        icon: '👥',
        requirement: 1,
        type: 'category',
        category: '分类成就'
      },
      'expert_detector': {
        title: '专家侦探',
        description: '答对高难度场景',
        icon: '🔍',
        requirement: 1,
        type: 'difficulty',
        category: '挑战成就'
      },
      'quick_thinker': {
        title: '思维敏捷',
        description: '在3秒内快速答对',
        icon: '🚀',
        requirement: 1,
        type: 'speed',
        category: '技巧成就'
      },
      'score_hunter': {
        title: '积分猎人',
        description: '获得100积分',
        icon: '🎯',
        requirement: 100,
        type: 'score',
        category: '积分成就'
      },
      'points_master': {
        title: '积分大师',
        description: '获得500积分',
        icon: '🎮',
        requirement: 500,
        type: 'score',
        category: '积分成就'
      },
      'diligent_learner': {
        title: '勤奋学习者',
        description: '完成10个答题',
        icon: '📝',
        requirement: 10,
        type: 'progress',
        category: '基础成就'
      },
      'knowledge_seeker': {
        title: '知识探索者',
        description: '完成50个答题',
        icon: '🧭',
        requirement: 50,
        type: 'progress',
        category: '基础成就'
      },
      'accuracy_expert': {
        title: '准确率专家',
        description: '答题准确率达到80%',
        icon: '🎯',
        requirement: 0.8,
        type: 'accuracy',
        category: '技巧成就'
      },
      'multi_category': {
        title: '多面手',
        description: '完成2种不同类型的诈骗场景',
        icon: '🔄',
        requirement: 2,
        type: 'category',
        category: '分类成就'
      },
      'all_category': {
        title: '全面掌握',
        description: '完成4种不同类型的诈骗场景',
        icon: '🌈',
        requirement: 4,
        type: 'category',
        category: '分类成就'
      },
      'daily_login': {
        title: '每日登录',
        description: '连续3天登录学习',
        icon: '📅',
        requirement: 3,
        type: 'daily',
        category: '活跃成就'
      }
    };
  }

  // 检查并解锁成就
  checkAchievements(gameStats) {
    const newlyUnlocked = [];
    
    Object.entries(this.achievements).forEach(([id, achievement]) => {
      if (this.unlockedAchievements.has(id)) return; // 已解锁的跳过
      
      if (this.isAchievementUnlocked(id, achievement, gameStats)) {
        this.unlockedAchievements.add(id);
        newlyUnlocked.push({ id, ...achievement });
        this.saveAchievementProgress();
      }
    });

    // 显示新解锁的成就
    if (newlyUnlocked.length > 0) {
      this.showAchievementUnlock(newlyUnlocked);
    }

    return newlyUnlocked;
  }

  // 判断成就是否解锁
  isAchievementUnlocked(id, achievement, gameStats) {
    switch (achievement.type) {
      case 'progress':
        return gameStats.totalAnswered >= achievement.requirement;
      
      case 'streak':
        return gameStats.currentStreak >= achievement.requirement;
      
      case 'score':
        return gameStats.totalScore >= achievement.requirement;
      
      case 'category':
        return gameStats.completedCategories >= achievement.requirement;
      
      case 'tutorial':
        return gameStats.completedTutorials >= achievement.requirement;
      
      case 'difficulty':
        return gameStats.completedDifficulties >= achievement.requirement;
      
      case 'daily':
        return gameStats.consecutiveDays >= achievement.requirement;
      
      case 'daily_progress':
        return gameStats.todayProgress >= achievement.requirement;
      
      case 'speed':
        return gameStats.fastAnswers >= achievement.requirement;
      
      case 'correction':
        return gameStats.corrections >= achievement.requirement;
        
      case 'accuracy':
        return gameStats.totalAnswered > 0 && 
               (gameStats.correctAnswers / gameStats.totalAnswered) >= achievement.requirement;
      
      default:
        return false;
    }
  }

  // 显示成就解锁动画
  showAchievementUnlock(achievements) {
    achievements.forEach((achievement, index) => {
      setTimeout(() => {
        // 播放解锁音效
        this.playUnlockSound();

        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
          <div class="achievement-notification-content">
            <div class="achievement-notification-icon">${achievement.icon}</div>
            <div class="achievement-notification-info">
              <div class="achievement-notification-title">🎉 成就解锁！</div>
              <div class="achievement-notification-name">${achievement.title}</div>
              <div class="achievement-notification-desc">${achievement.description}</div>
            </div>
            <div class="achievement-notification-badge">🏆</div>
          </div>
          <div class="achievement-notification-sparkles">
            <div class="sparkle sparkle-1">✨</div>
            <div class="sparkle sparkle-2">⭐</div>
            <div class="sparkle sparkle-3">✨</div>
          </div>
        `;

        document.body.appendChild(notification);

        // 添加进入动画
        setTimeout(() => {
          notification.classList.add('show');
        }, 100);

        // 添加震动反馈（如果支持）
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }

        // 3.5秒后移除
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => {
            notification.remove();
          }, 300);
        }, 3500);

        // 在成就页面中高亮新解锁的成就
        this.highlightNewlyUnlocked(achievement.id);

      }, index * 600); // 多个成就依次显示
    });
  }

  // 播放解锁音效
  playUnlockSound() {
    try {
      // 创建音频上下文播放成就解锁音效
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 创建上升的音调效果
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.15); // C6

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('音效播放失败:', error);
    }
  }

  // 高亮新解锁的成就
  highlightNewlyUnlocked(achievementId) {
    setTimeout(() => {
      // 在成就页面中查找对应的成就项
      const achievementElement = document.querySelector(`[data-achievement-id="${achievementId}"]`);
      if (achievementElement) {
        achievementElement.classList.add('newly-unlocked');

        // 添加闪烁效果
        let flashCount = 0;
        const flashInterval = setInterval(() => {
          achievementElement.classList.toggle('highlight-flash');
          flashCount++;

          if (flashCount >= 6) {
            clearInterval(flashInterval);
            achievementElement.classList.remove('highlight-flash');
            // 保留高亮状态一段时间
            setTimeout(() => {
              achievementElement.classList.remove('newly-unlocked');
            }, 5000);
          }
        }, 300);
      }
    }, 500); // 等待成就页面渲染完成
  }

  // 初始化成就系统
  initialize() {
    // 成就系统已就绪，可以在这里添加初始化逻辑
    console.log('成就系统已初始化');
  }

  // 显示成就页面内容（由PageManager调用）
  renderAchievementsPage() {
    // 获取游戏统计数据
    const gameStats = window.game ? window.game.getGameStats() : {};
    const tutorialStats = window.tutorialManager ? window.tutorialManager.getStudyStats() : {};

    // 渲染成就内容
    this.renderAchievementsPageContent();

    // 显示评价和鼓励
    this.showEvaluationAndEncouragement(gameStats, tutorialStats);
  }

  // 渲染成就页面内容
  renderAchievementsPageContent() {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    const achievementsHtml = this.generateAchievementsHtml();
    const statsHtml = this.generateAchievementStatsHtml();

    container.innerHTML = `
      ${statsHtml}
      ${achievementsHtml}
    `;
  }

  // 生成成就HTML - 横条式布局
  generateAchievementsHtml() {
    const categories = this.groupAchievementsByCategory();
    let html = '';

    Object.entries(categories).forEach(([category, achievements]) => {
      html += `
        <div class="achievement-category">
          <h3 class="category-title">${category}</h3>
          <div class="achievements-grid">
      `;

      achievements.forEach(achievement => {
        const isUnlocked = this.unlockedAchievements.has(achievement.id);

        html += `
          <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}" data-achievement-id="${achievement.id}">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
              <div class="achievement-title">${achievement.title}</div>
              <div class="achievement-description">${achievement.description}</div>
            </div>
            <div class="achievement-status">${isUnlocked ? '✅' : '🔒'}</div>
            <div class="achievement-progress">
              <div class="achievement-progress-bar" style="width: ${isUnlocked ? '100%' : '0%'}"></div>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    return html;
  }

  // 生成成就统计HTML
  generateAchievementStatsHtml() {
    const unlockedCount = this.unlockedAchievements.size;
    const totalCount = Object.keys(this.achievements).length;
    const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    return `
      <div class="achievement-summary">
        <div class="summary-item">
          <div class="summary-number">${unlockedCount}</div>
          <div class="summary-label">已解锁</div>
        </div>
        <div class="summary-item">
          <div class="summary-number">${totalCount}</div>
          <div class="summary-label">总成就</div>
        </div>
        <div class="summary-item">
          <div class="summary-number">${percentage}%</div>
          <div class="summary-label">完成度</div>
        </div>
      </div>
    `;
  }

  // 显示评价和鼓励
  showEvaluationAndEncouragement(gameStats, tutorialStats) {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    // 获取评价信息
    const evaluation = this.getEvaluation(gameStats, tutorialStats);
    const encouragement = this.getEncouragement(gameStats, tutorialStats);

    // 在成就容器顶部添加评价和鼓励区域
    const evaluationHtml = `
      <div class="evaluation-section">
        <div class="evaluation-header">
          <h3>📈 学习评价</h3>
        </div>
        <div class="evaluation-content">
          <div class="evaluation-text">${evaluation}</div>
          <div class="encouragement-text">${encouragement}</div>
        </div>
      </div>
    `;

    // 将评价区域插入到成就容器顶部
    container.insertAdjacentHTML('afterbegin', evaluationHtml);
  }

  // 获取学习评价
  getEvaluation(gameStats, tutorialStats) {
    const totalAnswered = gameStats.totalAnswered || 0;
    const accuracy = gameStats.accuracy || 0;
    const completedTutorials = tutorialStats.completed || 0;
    
    let evaluation = '';
    
    // 基于答题数量和正确率评价
    if (totalAnswered === 0) {
      evaluation = '您还没有开始答题，快来体验反诈知识学习吧！';
    } else if (totalAnswered < 5) {
      evaluation = '您刚开始接触反诈知识，继续加油！';
    } else if (totalAnswered < 20) {
      evaluation = '您已经掌握了一些反诈知识，表现不错！';
    } else if (totalAnswered < 50) {
      evaluation = '您的反诈知识储备相当丰富，继续努力！';
    } else {
      evaluation = '您已经是反诈知识达人，非常出色！';
    }
    
    // 基于正确率评价
    if (accuracy >= 90) {
      evaluation += ' 您的判断准确率非常高，展现了出色的反诈能力！';
    } else if (accuracy >= 80) {
      evaluation += ' 您的判断准确率很不错，继续保持！';
    } else if (accuracy >= 60) {
      evaluation += ' 您的判断准确率还有提升空间，多加练习会更好！';
    } else {
      evaluation += ' 建议多学习防诈知识，提高判断准确率！';
    }
    
    // 基于教程学习情况评价
    if (completedTutorials === 0) {
      evaluation += ' 建议先学习防诈教程，打好知识基础。';
    } else if (completedTutorials < 3) {
      evaluation += ' 您已经学习了部分防诈知识，继续完成教程会有更大收获。';
    } else {
      evaluation += ' 您已经系统学习了防诈知识，理论基础很扎实！';
    }
    
    return evaluation;
  }

  // 获取鼓励词语
  getEncouragement(gameStats, tutorialStats) {
    const totalAnswered = gameStats.totalAnswered || 0;
    const accuracy = gameStats.accuracy || 0;
    const bestStreak = gameStats.bestStreak || 0;
    const completedTutorials = tutorialStats.completed || 0;
    
    let encouragements = [];
    
    // 基于不同指标的鼓励
    if (totalAnswered > 0) {
      encouragements.push(`您已经完成了 ${totalAnswered} 个场景答题，这是很好的开始！`);
    }
    
    if (accuracy > 0) {
      encouragements.push(`当前正确率 ${accuracy}%，继续努力向更高目标迈进！`);
    }
    
    if (bestStreak > 5) {
      encouragements.push(`您曾连续答对 ${bestStreak} 个场景，展现了出色的判断力！`);
    }
    
    if (completedTutorials > 0) {
      encouragements.push(`您已经学习了 ${completedTutorials} 个防诈教程，知识储备很丰富！`);
    }
    
    // 通用鼓励语
    encouragements.push('每一次学习都是对自身安全的投资，继续加油！');
    encouragements.push('防范诈骗，保护自己和家人，您做得很好！');
    encouragements.push('知识就是力量，您的学习将帮助您远离诈骗风险！');
    
    // 随机选择一个鼓励语
    const randomIndex = Math.floor(Math.random() * encouragements.length);
    return encouragements[randomIndex];
  }

  // 渲染成就面板
  renderAchievementsPanel() {
    const panel = document.getElementById('achievements-panel');
    if (!panel) return;

    // 获取详细统计数据
    const gameStats = window.game ? window.game.getGameStats() : {};
    const tutorialStats = window.tutorialManager ? window.tutorialManager.getStudyStats() : {};
    
    let html = `
      <div class="achievements-container">
        <div class="panel-header">
          <h2>🏆 辉煌成就</h2>
          <button id="close-achievements" class="btn close-btn">✕ 返回</button>
        </div>
        
        <!-- 成就概览卡片 -->
        <div class="achievement-overview">
          <div class="overview-card">
            <div class="overview-icon">🎯</div>
            <div class="overview-content">
              <div class="overview-number">${stats.unlocked}</div>
              <div class="overview-label">已解锁</div>
            </div>
          </div>
          <div class="overview-card">
            <div class="overview-icon">📊</div>
            <div class="overview-content">
              <div class="overview-number">${stats.progress}%</div>
              <div class="overview-label">完成度</div>
            </div>
          </div>
        </div>
    `;
    
    // 绑定返回按钮事件
    setTimeout(() => {
      const closeBtn = document.getElementById('close-achievements');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          panel.style.display = 'none';
        });
      }
    }, 100);
    
    // 按类别分组显示
    const categories = this.groupAchievementsByCategory();
    
    Object.entries(categories).forEach(([category, achievements]) => {
      html += `
        <div class="achievement-category">
          <h3 class="category-title">${category}</h3>
          <div class="achievement-cards">
      `;

      achievements.forEach(achievement => {
        const isUnlocked = this.unlockedAchievements.has(achievement.id);
        html += `
          <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="card-header">
              <div class="card-icon">${achievement.icon}</div>
              <div class="card-status">${isUnlocked ? '✅' : '🔒'}</div>
            </div>
            <div class="card-content">
              <h3 class="card-title">${achievement.title}</h3>
              <p class="card-description">${achievement.description}</p>
              <div class="card-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${this.getProgressPercentage(achievement)}%"></div>
                </div>
                <span class="progress-text">${this.getProgressText(achievement)}</span>
              </div>
            </div>
          </div>
        `;
      });
      
      html += '</div></div>';
    });

    // 添加成就完成度
    html += `
      <div class="achievement-summary">
        <div class="summary-item">
          <span class="summary-number">${stats.unlocked}</span>
          <span class="summary-label">已解锁</span>
        </div>
        <div class="summary-item">
          <span class="summary-number">${stats.total}</span>
          <span class="summary-label">总成就</span>
        </div>
        <div class="summary-progress">
          <div class="progress-circle" data-progress="${stats.progress}">
            <svg viewBox="0 0 36 36">
              <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <path class="circle-fill" stroke-dasharray="${stats.progress}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <text x="18" y="20.35" class="percentage">${stats.progress}%</text>
            </svg>
          </div>
        </div>
      </div>
    `;
    
    // 获取总体统计
    const stats = this.getAchievementStats();
    
    html += '</div>';
    panel.innerHTML = html;
  }

  // 按类别分组成就
  groupAchievementsByCategory() {
    const categories = {};
    
    Object.entries(this.achievements).forEach(([id, achievement]) => {
      if (!categories[achievement.category]) {
        categories[achievement.category] = [];
      }
      categories[achievement.category].push({ id, ...achievement });
    });
    
    return categories;
  }

  
  // 获取成就统计
  getAchievementStats() {
    const total = Object.keys(this.achievements).length;
    const unlocked = this.unlockedAchievements.size;
    const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    
    return { total, unlocked, progress };
  }

  // 保存成就进度
  saveAchievementProgress() {
    if (this.storage) {
      const progress = {
        unlockedAchievements: Array.from(this.unlockedAchievements),
        achievementStats: this.getAchievementStats()
      };
      this.storage.saveAchievementProgress(progress);
    }
  }

  // 加载成就进度
  loadAchievementProgress() {
    if (this.storage) {
      const progress = this.storage.loadAchievementProgress();
      if (progress && progress.unlockedAchievements) {
        this.unlockedAchievements = new Set(progress.unlockedAchievements);
      }
    }
  }

  // 获取用户成就数据（供游戏引擎调用）
  getUserAchievementData() {
    return {
      unlockedCount: this.unlockedAchievements.size,
      totalCount: Object.keys(this.achievements).length,
      unlockedAchievements: Array.from(this.unlockedAchievements),
      stats: this.getAchievementStats()
    };
  }

  // 获取成就进度百分比
  getProgressPercentage(achievement) {
    const gameStats = window.game ? window.game.getGameStats() : {};
    let current = 0;
    let target = achievement.requirement;
    
    switch (achievement.type) {
      case 'progress':
        current = gameStats.totalAnswered || 0;
        break;
      case 'streak':
        current = gameStats.bestStreak || 0;
        break;
      case 'score':
        current = gameStats.totalScore || 0;
        break;
      case 'tutorial':
        const tutorialStats = window.tutorialManager ? window.tutorialManager.getStudyStats() : {};
        current = tutorialStats.completed || 0;
        break;
      case 'category':
        current = gameStats.completedCategories || 0;
        break;
      case 'daily':
        current = gameStats.loginDays || 0;
        break;
      default:
        current = 0;
    }
    
    return Math.min(Math.round((current / target) * 100), 100);
  }

  // 获取成就进度文本
  getProgressText(achievement) {
    const gameStats = window.game ? window.game.getGameStats() : {};
    let current = 0;
    let target = achievement.requirement;
    
    switch (achievement.type) {
      case 'progress':
        current = gameStats.totalAnswered || 0;
        break;
      case 'streak':
        current = gameStats.bestStreak || 0;
        break;
      case 'score':
        current = gameStats.totalScore || 0;
        break;
      case 'tutorial':
        const tutorialStats = window.tutorialManager ? window.tutorialManager.getStudyStats() : {};
        current = tutorialStats.completed || 0;
        break;
      case 'category':
        current = gameStats.completedCategories || 0;
        break;
      case 'daily':
        current = gameStats.loginDays || 0;
        break;
      default:
        current = 0;
    }
    
    if (this.unlockedAchievements.has(achievement.id)) {
      return '✅ 已完成';
    }
    
    return `${current}/${target}`;
  }

  // 重置成就（调试用）
  resetAchievements() {
    this.unlockedAchievements.clear();
    this.saveAchievementProgress();
    this.renderAchievementsPanel();
  }
  
  // 解锁指定成就
  unlockAchievement(achievementId) {
    if (this.achievements[achievementId] && !this.unlockedAchievements.has(achievementId)) {
      this.unlockedAchievements.add(achievementId);
      this.saveAchievementProgress();
      
      // 显示解锁通知
      this.showAchievementUnlock([{
        id: achievementId,
        ...this.achievements[achievementId]
      }]);
      
      return true;
    }
    return false;
  }
}

// 初始化成就管理器
window.achievementManager = new AchievementManager();