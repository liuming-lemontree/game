// 教程模块 - 防诈骗知识教学系统
class TutorialManager {
  constructor() {
    this.currentTutorial = null;
    this.completedTutorials = new Set();
    this.storage = window.storageManager;
    this.init();
  }

  init() {
    this.loadTutorialProgress();
    this.renderTutorialMenu();
  }

  // 教程内容数据
  getTutorialContent() {
    return {
      'phone-fraud': {
        title: '电话诈骗防范',
        icon: '📞',
        description: '学习识别和防范各类电话诈骗',
        sections: [
          {
            title: '冒充公检法诈骗',
            content: '骗子冒充公安、检察院、法院工作人员，声称你涉嫌犯罪，要求配合调查并转账。',
            keyPoints: [
              '公检法机关不会通过电话办案',
              '不会要求转账到"安全账户"',
              '不会发送通缉令等法律文书',
              '办案有严格的法律程序'
            ],
            examples: [
              {
                scenario: '接到自称公安局的电话，说你涉嫌洗钱',
                correct: '挂断电话，拨打110核实',
                wrong: '按照对方要求转账'
              }
            ]
          },
          {
            title: '冒充客服诈骗',
            content: '骗子冒充电商平台、快递公司、银行客服，以各种理由要求你提供信息或转账。',
            keyPoints: [
              '正规客服不会索要密码验证码',
              '不会要求转账到个人账户',
              '有问题应通过官方渠道联系',
              '退款赔偿有正规流程'
            ],
            examples: [
              {
                scenario: '接到自称淘宝客服的电话，说订单异常',
                correct: '挂断电话，登录官方APP查看',
                wrong: '提供银行卡信息'
              }
            ]
          },
          {
            title: '冒充熟人诈骗',
            content: '骗子冒充领导、同事、亲友，以各种紧急情况为由要求转账。',
            keyPoints: [
              '转账前务必通过其他方式核实',
              '领导不会通过电话要求紧急转账',
              '亲友借钱会有详细说明',
              '紧急情况应该多渠道确认'
            ],
            examples: [
              {
                scenario: '接到自称公司领导的电话，要求转账',
                correct: '挂断电话，当面或通过微信确认',
                wrong: '直接转账'
              }
            ]
          }
        ]
      },
      'sms-fraud': {
        title: '短信诈骗防范',
        icon: '💬',
        description: '学习识别和防范各类短信诈骗',
        sections: [
          {
            title: '中奖诈骗短信',
            content: '骗子发送虚假中奖信息，诱导你点击链接或提供个人信息。',
            keyPoints: [
              '天上不会掉馅饼',
              '中奖信息需要核实',
              '不要点击陌生链接',
              '正规抽奖有公证程序'
            ],
            examples: [
              {
                scenario: '收到短信说你中了苹果手机',
                correct: '删除短信，不予理会',
                wrong: '点击链接填写信息'
              }
            ]
          },
          {
            title: '银行通知短信',
            content: '骗子冒充银行发送虚假通知，诱导你点击钓鱼链接。',
            keyPoints: [
              '银行不会通过短信发送链接',
              '账户问题应通过官方APP查询',
              '不要输入银行卡密码',
              '验证码不能告诉任何人'
            ],
            examples: [
              {
                scenario: '收到银行短信说账户异常',
                correct: '登录官方APP查询',
                wrong: '点击短信中的链接'
              }
            ]
          }
        ]
      },
      'net-fraud': {
        title: '网络诈骗防范',
        icon: '🌐',
        description: '学习识别和防范各类网络诈骗',
        sections: [
          {
            title: '钓鱼网站诈骗',
            content: '骗子制作仿冒网站，诱导你输入账号密码等敏感信息。',
            keyPoints: [
              '仔细检查网站域名',
              '使用官方APP或网站',
              '不要在陌生网站输入密码',
              '启用双重认证'
            ],
            examples: [
              {
                scenario: '收到邮件要求验证银行账户',
                correct: '手动输入银行官网地址',
                wrong: '点击邮件中的链接'
              }
            ]
          },
          {
            title: '虚假投资诈骗',
            content: '骗子承诺高收益、稳赚不赔，诱导你投资虚假项目。',
            keyPoints: [
              '高收益必然伴随高风险',
              '投资需要理性分析',
              '选择正规投资平台',
              '不要轻信他人推荐'
            ],
            examples: [
              {
                scenario: '网友推荐稳赚的投资项目',
                correct: '拒绝并举报',
                wrong: '小额投资试水'
              }
            ]
          }
        ]
      },
      'social-fraud': {
        title: '社交诈骗防范',
        icon: '👥',
        description: '学习识别和防范各类社交诈骗',
        sections: [
          {
            title: '冒充熟人诈骗',
            content: '骗子冒充亲友、同事等熟人，以各种理由要求转账。',
            keyPoints: [
              '通过多种方式核实身份',
              '不要仅凭网络信息判断',
              '涉及金钱要格外谨慎',
              '紧急情况多渠道确认'
            ],
            examples: [
              {
                scenario: '微信好友借钱',
                correct: '电话或视频确认',
                wrong: '直接转账'
              }
            ]
          },
          {
            title: '情感诈骗',
            content: '骗子通过网络交友建立感情，然后以各种理由索要钱财。',
            keyPoints: [
              '网络交友要保持警惕',
              '不要轻信他人身份',
              '涉及金钱要特别小心',
              '保护个人隐私信息'
            ],
            examples: [
              {
                scenario: '网恋对象遇到困难需要钱',
                correct: '拒绝并结束关系',
                wrong: '转账帮助'
              }
            ]
          }
        ]
      }
    };
  }

  // 渲染教程菜单
  renderTutorialMenu() {
    const tutorials = this.getTutorialContent();
    const menuContainer = document.getElementById('tutorial-menu');
    
    if (!menuContainer) return;

    let html = '<div class="tutorial-grid">';
    
    Object.entries(tutorials).forEach(([id, tutorial]) => {
      const isCompleted = this.completedTutorials.has(id);
      html += `
        <div class="tutorial-card ${isCompleted ? 'completed' : ''}" data-tutorial="${id}">
          <div class="tutorial-icon">${tutorial.icon}</div>
          <h3>${tutorial.title}</h3>
          <p>${tutorial.description}</p>
          <div class="tutorial-status">
            ${isCompleted ? '<span class="completed-badge">✅ 已完成</span>' : '<span class="start-badge">开始学习</span>'}
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    menuContainer.innerHTML = html;

    // 绑定点击事件
    menuContainer.querySelectorAll('.tutorial-card').forEach(card => {
      card.addEventListener('click', () => {
        const tutorialId = card.dataset.tutorial;
        this.startTutorial(tutorialId);
      });
    });
  }

  // 开始教程
  startTutorial(tutorialId) {
    const tutorials = this.getTutorialContent();
    this.currentTutorial = tutorials[tutorialId];
    
    if (!this.currentTutorial) return;

    this.renderTutorialContent(tutorialId);
  }

  // 渲染教程内容
  renderTutorialContent(tutorialId) {
    const contentContainer = document.getElementById('tutorial-content');
    if (!contentContainer || !this.currentTutorial) return;

    let html = `
      <div class="tutorial-header">
        <button id="back-to-menu" class="btn back-btn">← 返回</button>
        <h2>${this.currentTutorial.icon} ${this.currentTutorial.title}</h2>
      </div>
      <div class="tutorial-sections">
    `;

    this.currentTutorial.sections.forEach((section, index) => {
      html += `
        <div class="tutorial-section">
          <h3>${section.title}</h3>
          <div class="section-content">
            <p>${section.content}</p>
            
            <div class="key-points">
              <h4>💡 防范要点：</h4>
              <ul>
                ${section.keyPoints.map(point => `<li>${point}</li>`).join('')}
              </ul>
            </div>
            
            <div class="examples">
              <h4>📋 案例分析：</h4>
              <div class="example-case">
                <div class="scenario">
                  <strong>场景：</strong>${section.examples[0].scenario}
                </div>
                <div class="correct-response">
                  <strong>✅ 正确做法：</strong>${section.examples[0].correct}
                </div>
                <div class="wrong-response">
                  <strong>❌ 错误做法：</strong>${section.examples[0].wrong}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    html += `
      </div>
      <div class="tutorial-actions">
        <button id="complete-tutorial" class="btn complete-btn">完成学习</button>
      </div>
    `;

    contentContainer.innerHTML = html;

    // 绑定事件
    document.getElementById('back-to-menu')?.addEventListener('click', () => {
      this.showTutorialMenu();
    });

    document.getElementById('complete-tutorial')?.addEventListener('click', () => {
      this.completeTutorial(tutorialId);
    });

    // 显示内容区域，隐藏菜单
    document.getElementById('tutorial-menu').style.display = 'none';
    contentContainer.style.display = 'block';
  }

  // 初始化教程系统
  initialize() {
    // 教程系统已就绪，可以在这里添加初始化逻辑
    console.log('教程系统已初始化');
    // 不再在这里调用showChaptersMenu()，因为会在页面切换时调用
  }

  // 第三章：诈骗手段内容
  getChapter3Content() {
    const chapter = TutorialContent.chapter3;
    let techniquesHtml = '';
    
    chapter.content.commonTechniques.forEach(technique => {
      let examplesHtml = technique.examples.map(example => `<li>${example}</li>`).join('');
      let characteristicsHtml = technique.characteristics.map(char => `<li>${char}</li>`).join('');
      
      techniquesHtml += `
        <div class="technique-card">
          <h4>${technique.technique}</h4>
          <p>${technique.description}</p>
          <p><strong>常见例子：</strong></p>
          <ul>${examplesHtml}</ul>
          <p><strong>识别特征：</strong></p>
          <ul>${characteristicsHtml}</ul>
        </div>
      `;
    });
    
    let strategiesHtml = '';
    chapter.content.communicationStrategies.forEach(strategy => {
      let phrasesHtml = strategy.phrases.map(phrase => `<li>"${phrase}"</li>`).join('');
      
      strategiesHtml += `
        <div class="strategy-card">
          <h4>${strategy.strategy}</h4>
          <p>${strategy.description}</p>
          <p><strong>常用话术：</strong></p>
          <ul>${phrasesHtml}</ul>
        </div>
      `;
    });
    
    return `
      <div class="tutorial-section">
        <h2>${chapter.title}</h2>
        <h3>${chapter.subtitle}</h3>
        
        <div class="chapter-section">
          <h4>🎯 常用诈骗手法</h4>
          ${techniquesHtml}
        </div>
        
        <div class="chapter-section">
          <h4>💬 话术策略</h4>
          ${strategiesHtml}
        </div>
        
        <div class="tip-box">
          <h4>🔍 识破技巧</h4>
          <ul>
            <li>注意对方是否制造紧张气氛</li>
            <li>观察是否要求保密操作</li>
            <li>警惕承诺不合理的好处</li>
            <li>小心催促快速做决定</li>
          </ul>
        </div>
      </div>
    `;
  }

  // 快速参考内容
  getQuickRefContent() {
    return `
      <div class="tutorial-section">
        <h2>📞 紧急联系电话</h2>
        
        <div class="emergency-contacts">
          <div class="contact-card">
            <h4>🚨 报警电话</h4>
            <p class="contact-number">110</p>
            <p>遇到紧急情况或正在被骗时立即拨打</p>
          </div>
          
          <div class="contact-card">
            <h4>📞 反诈专线</h4>
            <p class="contact-number">96110</p>
            <p>全国反诈中心统一预警劝阻专线</p>
          </div>
          
          <div class="contact-card">
            <h4>🏦 银行客服</h4>
            <p class="contact-number">各银行客服电话</p>
            <p>银行卡异常、转账问题咨询</p>
          </div>
        </div>
        
        <div class="quick-actions">
          <h4>⚡ 快速行动指南</h4>
          <div class="action-steps">
            <div class="action-step">
              <span class="step-number">1</span>
              <span class="step-text">立即停止一切操作</span>
            </div>
            <div class="action-step">
              <span class="step-number">2</span>
              <span class="step-text">保存聊天记录和证据</span>
            </div>
            <div class="action-step">
              <span class="step-number">3</span>
              <span class="step-text">拨打110报警</span>
            </div>
            <div class="action-step">
              <span class="step-number">4</span>
              <span class="step-text">联系银行冻结账户</span>
            </div>
          </div>
        </div>
        
        <div class="important-reminders">
          <h4>⚠️ 重要提醒</h4>
          <ul>
            <li>公安机关不会通过电话办案</li>
            <li>任何要求转账的都是诈骗</li>
            <li>不要点击陌生链接</li>
            <li>保护好个人信息</li>
          </ul>
        </div>
      </div>
    `;
  }

  // 显示章节菜单
  showChaptersMenu() {
    const menuContainer = document.getElementById('tutorial-menu');
    if (!menuContainer) return;
    menuContainer.innerHTML = this.getChaptersMenu();
  }

  // 获取章节菜单内容
  getChaptersMenu() {
    return `
      <div class="tutorial-section">
        <h2>📚 反诈先锋教程</h2>
        <p>系统学习电信诈骗防范知识，保护自己和他人的财产安全</p>
        
        <div class="tutorial-cards">
          <div class="tutorial-card" onclick="window.tutorialManager.showTutorialContent('chapter1')">
            <h3>💔 第一章：惨痛案例</h3>
            <p>真实案例警示，了解诈骗造成的严重后果</p>
          </div>
          
          <div class="tutorial-card" onclick="window.tutorialManager.showTutorialContent('chapter2')">
            <h3>👥 第二章：目标人群</h3>
            <p>了解易被诈骗的人群特征和心理因素</p>
          </div>
          
          <div class="tutorial-card" onclick="window.tutorialManager.showTutorialContent('chapter3')">
            <h3>🎭 第三章：诈骗手段</h3>
            <p>掌握诈骗分子的常用手段和话术策略</p>
          </div>
          
          <div class="tutorial-card" onclick="window.tutorialManager.showTutorialContent('chapter4')">
            <h3>🛡️ 第四章：防范方法</h3>
            <p>学习实用的防范技巧和应对策略</p>
          </div>
          
          <div class="tutorial-card" onclick="window.tutorialManager.showTutorialContent('chapter5')">
            <h3>📝 第五章：防骗口诀</h3>
            <p>朗朗上口的防骗口诀，牢记心间</p>
          </div>
          
          <div class="tutorial-card" onclick="window.tutorialManager.showTutorialContent('quick-ref')">
            <h3>📋 快速参考</h3>
            <p>紧急联系方式和防骗要点速查</p>
          </div>
        </div>
      </div>
    `;
  }

  // 第一章：惨痛案例内容
  getChapter1Content() {
        const chapter = TutorialContent.chapter1;
        let casesHtml = '';
        
        chapter.content.forEach(case_item => {
            casesHtml += `
                <div class="case-study">
                    <h4>${case_item.title}</h4>
                    <p><strong>案例描述：</strong>${case_item.description}</p>
                    <p class="loss-amount">${case_item.loss}</p>
                    <p class="lesson-learned">${case_item.lesson}</p>
                    <span class="case-type">类型：${case_item.type}</span>
                </div>
            `;
        });
        
        return `
            <div class="tutorial-section">
                <h2>${chapter.title}</h2>
                <h3>${chapter.subtitle}</h3>
                <p>通过真实案例了解电信诈骗的危害，提高警惕性。</p>
                
                <div class="cases-container">
                    ${casesHtml}
                </div>
                
                <div class="summary-box">
                    <h4>💡 案例启示</h4>
                    <ul>
                        <li>诈骗手法不断翻新，但核心都是围绕"钱"</li>
                        <li>任何涉及转账的要求都要多方核实</li>
                        <li>被骗后要及时报警，尽可能挽回损失</li>
                        <li>预防胜于治疗，提高防骗意识最重要</li>
                    </ul>
                </div>
            </div>
        `;
    }

  // 显示教程菜单
  showTutorialMenu() {
    document.getElementById('tutorial-menu').style.display = 'block';
    document.getElementById('tutorial-content').style.display = 'none';

    // 检查是否有章节菜单内容，如果有则显示章节菜单
    if (typeof this.showChaptersMenu === 'function') {
      this.showChaptersMenu();
    } else {
      // 否则显示基础教程菜单
      this.renderTutorialMenu();
    }
  }

  // 这个方法已移除，教程面板现在由PageManager管理
    // 当切换到教程页面时，会自动调用showTutorialMenu()

  // 显示教程内容
  showTutorialContent(chapterId) {
    const contentContainer = document.getElementById('tutorial-content');
    const menuContainer = document.getElementById('tutorial-menu');
    
    if (!contentContainer || !menuContainer) return;

    let contentHtml = '';
    
    switch (chapterId) {
      case 'chapter1':
        contentHtml = this.getChapter1Content();
        break;
      case 'chapter2':
        contentHtml = this.getChapter2Content();
        break;
      case 'chapter3':
        contentHtml = this.getChapter3Content();
        break;
      case 'chapter4':
        contentHtml = this.getChapter4Content();
        break;
      case 'chapter5':
        contentHtml = this.getChapter5Content();
        break;
      case 'quick-ref':
        contentHtml = this.getQuickRefContent();
        break;
      default:
        contentHtml = '<p>章节内容暂未开发</p>';
    }

    contentHtml = `
      <div class="tutorial-header">
        <button id="back-to-chapters" class="btn back-btn">← 返回章节</button>
        <h2>📚 反诈先锋教程</h2>
      </div>
      ${contentHtml}
    `;

    contentContainer.innerHTML = contentHtml;
    
    // 绑定返回按钮事件
    document.getElementById('back-to-chapters')?.addEventListener('click', () => {
      this.showTutorialMenu();
    });

    // 显示内容区域，隐藏菜单
    menuContainer.style.display = 'none';
    contentContainer.style.display = 'block';
  }

  // 完成教程
  completeTutorial(tutorialId) {
    this.completedTutorials.add(tutorialId);
    this.saveTutorialProgress();
    
    // 显示完成提示
    this.showTutorialCompleteMessage(tutorialId);
    
    // 检查成就并更新统计
    this.updateAchievementStats();
    
    // 返回菜单
    setTimeout(() => {
      this.showTutorialMenu();
      this.renderTutorialMenu(); // 重新渲染菜单以显示完成状态
      
      // 如果成就面板已打开，刷新显示
      const achievementsPanel = document.getElementById('achievements-panel');
      if (achievementsPanel && achievementsPanel.style.display === 'block') {
        if (window.achievementManager) {
          window.achievementManager.renderAchievementsPanel();
        }
      }
    }, 2000);
  }

  // 更新成就统计
  updateAchievementStats() {
    if (window.achievementManager) {
      const gameStats = window.game ? window.game.getGameStats() : {};
      const tutorialStats = this.getStudyStats();
      
      // 检查教程相关成就
      window.achievementManager.checkAchievements({
        ...gameStats,
        completedTutorials: tutorialStats.completed
      });
      
      // 触发统计更新
      if (window.game && window.game.updateStats) {
        window.game.updateStats();
      }
    }
  }

  // 显示教程完成消息
  showTutorialCompleteMessage(tutorialId) {
    const message = document.createElement('div');
    message.className = 'tutorial-complete-message';
    message.innerHTML = `
      <div class="message-content">
        <div class="success-icon">🎉</div>
        <h3>恭喜完成学习！</h3>
        <p>您已完成《${this.currentTutorial?.title}》的学习</p>
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 2000);
  }

  // 保存教程进度
  saveTutorialProgress() {
    const progress = {
      completedTutorials: Array.from(this.completedTutorials),
      lastStudyTime: new Date().toISOString()
    };
    
    if (this.storage) {
      this.storage.saveTutorialProgress(progress);
    }
  }

  // 加载教程进度
  loadTutorialProgress() {
    if (this.storage) {
      const progress = this.storage.loadTutorialProgress();
      if (progress && progress.completedTutorials) {
        this.completedTutorials = new Set(progress.completedTutorials);
      }
    }
  }

  // 获取学习统计
  getStudyStats() {
    const totalTutorials = Object.keys(this.getTutorialContent()).length;
    const completedCount = this.completedTutorials.size;
    const progress = Math.round((completedCount / totalTutorials) * 100);
    
    return {
      total: totalTutorials,
      completed: completedCount,
      progress: progress
    };
  }

  // 第二章：目标人群内容
    getChapter2Content() {
        const chapter = TutorialContent.chapter2;
        let groupsHtml = '';
        
        chapter.content.highRiskGroups.forEach(group => {
            let characteristicsHtml = group.characteristics.map(char => `<li>${char}</li>`).join('');
            let scamsHtml = group.commonScams.map(scam => `<span class="scam-tag">${scam}</span>`).join('');
            
            groupsHtml += `
                <div class="risk-group">
                    <h4>${group.group}</h4>
                    <p><strong>特征：</strong></p>
                    <ul>${characteristicsHtml}</ul>
                    <p><strong>常见诈骗类型：</strong>${scamsHtml}</p>
                    <p><strong>防范建议：</strong>${group.prevention}</p>
                </div>
            `;
        });
        
        let psychologyHtml = '';
        chapter.content.psychologicalFactors.forEach(factor => {
            psychologyHtml += `
                <div class="psychology-factor">
                    <h5>${factor.factor}</h5>
                    <p>${factor.description}</p>
                    <p><strong>常见场景：</strong>${factor.example}</p>
                </div>
            `;
        });
        
        return `
            <div class="tutorial-section">
                <h2>${chapter.title}</h2>
                <h3>${chapter.subtitle}</h3>
                
                <div class="chapter-section">
                    <h4>🎯 高风险群体</h4>
                    ${groupsHtml}
                </div>
                
                <div class="chapter-section">
                    <h4>🧠 心理因素分析</h4>
                    ${psychologyHtml}
                </div>
                
                <div class="warning-box">
                    <h4>⚠️ 重要提醒</h4>
                    <p>任何人都可能成为诈骗受害者，不要掉以轻心！</p>
                    <p>了解这些特征是为了更好地防范，而不是歧视任何群体。</p>
                </div>
            </div>
        `;
    }

    // 第四章：防备和摆脱内容
    getChapter4Content() {
        const chapter = TutorialContent.chapter4;
        let principlesHtml = '';
        
        chapter.content.preventionPrinciples.forEach(principle => {
            let detailsHtml = principle.details.map(detail => `<li>${detail}</li>`).join('');
            
            principlesHtml += `
                <div class="principle-card">
                    <h4>${principle.principle}</h4>
                    <p>${principle.description}</p>
                    <p><strong>具体做法：</strong></p>
                    <ul>${detailsHtml}</ul>
                </div>
            `;
        });
        
        let skillsHtml = '';
        chapter.content.practicalTips.forEach(tip => {
            let actionsHtml = tip.actions.map(action => `<li>${action}</li>`).join('');
            
            skillsHtml += `
                <div class="skill-card">
                    <h4>${tip.situation}</h4>
                    <p>${tip.description || '具体应对措施：'}</p>
                    <p><strong>应对措施：</strong></p>
                    <ul>${actionsHtml}</ul>
                </div>
            `;
        });
        
        let responseHtml = '';
        chapter.content.emergencyResponse.forEach(response => {
            responseHtml += `
                <div class="response-card">
                    <h4>${response.step}</h4>
                    <p>${response.description}</p>
                    <p><strong>具体操作：</strong>${response.details}</p>
                </div>
            `;
        });
        
        return `
            <div class="tutorial-section">
                <h2>${chapter.title}</h2>
                <h3>${chapter.subtitle}</h3>
                
                <div class="chapter-section">
                    <h4>🛡️ 防备原则</h4>
                    ${principlesHtml}
                </div>
                
                <div class="chapter-section">
                    <h4>🔧 实用技巧</h4>
                    ${skillsHtml}
                </div>
                
                <div class="chapter-section">
                    <h4>🚨 应急响应</h4>
                    ${responseHtml}
                </div>
                
                <div class="warning-box">
                    <h4>⚠️ 重要提醒</h4>
                    <p>一旦发现被骗，立即停止一切操作！</p>
                    <p>保留证据，及时报警，寻求帮助！</p>
                </div>
            </div>
        `;
    }

    // 第五章：防范口诀内容
    getChapter5Content() {
        const chapter = TutorialContent.chapter5;
        let rhymesHtml = '';
        
        // 主口诀
        let mainRhymeHtml = chapter.content.mainChant.content.map(line => `<div class="rhyme-line">${line}</div>`).join('');
        rhymesHtml += `
            <div class="rhyme-card">
                <h4>${chapter.content.mainChant.title}</h4>
                <div class="rhyme-content">
                    ${mainRhymeHtml}
                </div>
            </div>
        `;
        
        // 分类口诀
        chapter.content.specificChants.forEach(chant => {
            let chantHtml = chant.chant.map(line => `<div class="rhyme-line">${line}</div>`).join('');
            rhymesHtml += `
                <div class="rhyme-card">
                    <h4>${chant.type}口诀</h4>
                    <div class="rhyme-content">
                        ${chantHtml}
                    </div>
                </div>
            `;
        });
        
        let checklistHtml = '';
        chapter.content.quickChecklist.items.forEach((item, index) => {
            checklistHtml += `
                <div class="checklist-item">
                    <input type="checkbox" id="check-${index}">
                    <label for="check-${index}">${item}</label>
                </div>
            `;
        });
        
        return `
            <div class="tutorial-section">
                <h2>${chapter.title}</h2>
                <h3>${chapter.subtitle}</h3>
                
                <div class="chapter-section">
                    <h4>📜 防范口诀</h4>
                    ${rhymesHtml}
                </div>
                
                <div class="chapter-section">
                    <h4>✅ 快速检查清单</h4>
                    <div class="checklist-container">
                        ${checklistHtml}
                    </div>
                    <p class="checklist-note">遇到可疑情况时，逐项检查，如果有多个项目符合，请立即警惕！</p>
                </div>
                
                <div class="tip-box">
                    <h4>💡 记忆技巧</h4>
                    <ul>
                        <li>将口诀写在便利贴上，贴在常用设备旁边</li>
                        <li>与家人朋友分享这些口诀，互相提醒</li>
                        <li>定期复习，形成条件反射</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

// 初始化教程管理器
window.tutorialManager = new TutorialManager();