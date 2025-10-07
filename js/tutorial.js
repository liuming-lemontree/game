// 教程管理器
class TutorialManager {
    constructor() {
        this.currentCategory = 'phone';
        this.lessons = this.initializeLessons();
        this.progress = storage.getTutorialProgress();
    }

    initializeLessons() {
        return {
            phone: [
                {
                    id: 'phone_lesson_1',
                    title: '认识电话诈骗',
                    content: '电话诈骗是指诈骗分子通过电话冒充他人身份，以各种理由骗取钱财的犯罪行为。常见的冒充身份包括公检法人员、银行客服、领导、熟人等。',
                    examples: [
                        '冒充公检法要求转账到"安全账户"',
                        '冒充客服办理退款需要验证码',
                        '冒充领导要求紧急转账',
                        '冒充熟人借钱应急'
                    ],
                    keyPoints: [
                        '公检法机关不会通过电话要求转账',
                        '不要相信陌生电话中的身份信息',
                        '验证码绝不能告诉任何人',
                        '转账前务必通过其他方式核实身份'
                    ]
                },
                {
                    id: 'phone_lesson_2',
                    title: '电话诈骗防范技巧',
                    content: '防范电话诈骗需要保持警惕，掌握基本的防范技巧。记住：凡是涉及转账、验证码、个人信息的电话都要特别小心。',
                    examples: [
                        '接到可疑电话时，先挂断再核实',
                        '通过官方渠道联系相关机构',
                        '不要点击电话中的链接',
                        '开启手机防骚扰功能'
                    ],
                    keyPoints: [
                        '不轻信：不轻信陌生电话中的信息',
                        '不透露：不透露个人信息和验证码',
                        '不转账：不轻易向陌生账户转账',
                        '要核实：通过其他渠道核实情况'
                    ]
                },
                {
                    id: 'phone_lesson_3',
                    title: '真实案例分析',
                    content: '通过分析真实案例，我们可以更好地识别电话诈骗的特征和手法。了解诈骗分子的套路，提高防范意识。',
                    examples: [
                        '案例一：假冒公检法诈骗，损失50万元',
                        '案例二：假冒客服退款，盗刷银行卡',
                        '案例三：假冒领导诈骗，公司损失20万元',
                        '案例四：假冒熟人借款，感情和金钱双重损失'
                    ],
                    keyPoints: [
                        '诈骗分子善于利用人的恐惧心理',
                        '制造紧迫感让人来不及思考',
                        '利用权威身份让人不敢质疑',
                        '通过情感绑架让人放松警惕'
                    ]
                }
            ],
            sms: [
                {
                    id: 'sms_lesson_1',
                    title: '认识短信诈骗',
                    content: '短信诈骗是通过发送虚假短信诱导受害者进行操作的一种诈骗方式。常见类型包括中奖通知、银行通知、积分兑换等。',
                    examples: [
                        '恭喜您中奖了，请点击链接领取',
                        '您的银行卡积分即将过期',
                        '您的ETC账户需要重新认证',
                        '您的包裹有问题，请点击处理'
                    ],
                    keyPoints: [
                        '不要相信天上掉馅饼的好事',
                        '不要点击短信中的陌生链接',
                        '银行通知要通过官方渠道核实',
                        '中奖诈骗通常需要先付费'
                    ]
                },
                {
                    id: 'sms_lesson_2',
                    title: '钓鱼短信识别',
                    content: '钓鱼短信是短信诈骗的主要形式，通常包含恶意链接，旨在窃取个人信息或银行账户信息。',
                    examples: [
                        '假冒银行的积分兑换链接',
                        '假冒运营商的话费充值链接',
                        '假冒电商的订单处理链接',
                        '假冒政府部门的通知链接'
                    ],
                    keyPoints: [
                        '检查发送号码是否为官方号码',
                        '注意链接域名是否为官方域名',
                        '不要在陌生网站输入个人信息',
                        '安装手机安全软件识别风险'
                    ]
                },
                {
                    id: 'sms_lesson_3',
                    title: '短信诈骗防范',
                    content: '防范短信诈骗需要提高警惕性，掌握基本的识别方法和应对策略。',
                    examples: [
                        '开启短信过滤功能',
                        '安装反诈骗中心APP',
                        '举报可疑短信',
                        '定期检查银行账户'
                    ],
                    keyPoints: [
                        '不点击：不点击陌生链接',
                        '不回复：不回复可疑短信',
                        '不轻信：不轻信短信内容',
                        '要举报：及时举报诈骗短信'
                    ]
                }
            ],
            network: [
                {
                    id: 'network_lesson_1',
                    title: '认识网络诈骗',
                    content: '网络诈骗是利用互联网技术进行的诈骗活动，包括钓鱼网站、虚假投资、兼职刷单、网络购物诈骗等多种形式。',
                    examples: [
                        '钓鱼网站假冒银行或电商平台',
                        '虚假投资平台承诺高收益',
                        '兼职刷单要求先垫付资金',
                        '网络购物诈骗收钱不发货'
                    ],
                    keyPoints: [
                        '高收益承诺通常是诈骗',
                        '不要在陌生网站输入敏感信息',
                        '兼职刷单是违法行为',
                        '网络购物要选择正规平台'
                    ]
                },
                {
                    id: 'network_lesson_2',
                    title: '投资理财诈骗',
                    content: '投资理财诈骗是网络诈骗的高发领域，通常承诺高额回报，利用人们的贪利心理进行诈骗。',
                    examples: [
                        '数字货币投资日收益5%',
                        '股票内幕消息稳赚不赔',
                        '外汇投资保本保息',
                        'P2P平台高息理财'
                    ],
                    keyPoints: [
                        '投资有风险，高收益伴随高风险',
                        '查询平台资质和监管信息',
                        '不要相信内部消息',
                        '分散投资降低风险'
                    ]
                },
                {
                    id: 'network_lesson_3',
                    title: '网络安全防护',
                    content: '提高网络安全意识，保护个人信息安全，预防网络诈骗。',
                    examples: [
                        '使用强密码并定期更换',
                        '开启双重认证',
                        '不在公共WiFi进行敏感操作',
                        '及时更新系统和软件'
                    ],
                    keyPoints: [
                        '保护个人信息不泄露',
                        '使用安全可靠的密码',
                        '警惕陌生文件和链接',
                        '定期检查账户安全'
                    ]
                }
            ],
            social: [
                {
                    id: 'social_lesson_1',
                    title: '认识社交诈骗',
                    content: '社交诈骗是利用社交平台和人际关系进行的诈骗活动，包括冒充熟人、情感诈骗、虚假求助等多种形式。',
                    examples: [
                        '冒充朋友借钱应急',
                        '网络交友诱导投资',
                        '虚假慈善求助',
                        '假冒导师或领导'
                    ],
                    keyPoints: [
                        '网络交友要保持警惕',
                        '不要轻易相信网络身份',
                        '涉及金钱往来要特别小心',
                        '通过多种方式核实身份'
                    ]
                },
                {
                    id: 'social_lesson_2',
                    title: '情感诈骗防范',
                    content: '情感诈骗是社交诈骗的常见形式，诈骗分子通过建立情感关系，然后以各种理由索要钱财。',
                    examples: [
                        '网络恋人突然遇到困难需要帮助',
                        '网友介绍投资机会',
                        '朋友推荐虚假项目',
                        '熟人介绍高收益理财'
                    ],
                    keyPoints: [
                        '不要因感情而失去理性判断',
                        '网络关系要谨慎对待',
                        '拒绝任何形式的金钱要求',
                        '保护个人隐私信息'
                    ]
                },
                {
                    id: 'social_lesson_3',
                    title: '社交平台安全',
                    content: '在社交平台上保护个人信息安全，预防社交诈骗。',
                    examples: [
                        '设置隐私保护',
                        '不添加陌生好友',
                        '警惕陌生人私信',
                        '举报可疑账号'
                    ],
                    keyPoints: [
                        '谨慎添加好友',
                        '不要透露个人敏感信息',
                        '警惕陌生人的私信',
                        '及时举报可疑行为'
                    ]
                }
            ]
        };
    }

    showCategory(category) {
        this.currentCategory = category;
        this.updateCategoryButtons();
        this.renderLessons(category);

        // 更新进度
        if (!this.progress.completedCategories.includes(category)) {
            this.progress.lastViewedCategory = category;
            storage.saveTutorialProgress(this.progress);
        }
    }

    updateCategoryButtons() {
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.includes(this.getCategoryName(this.currentCategory))) {
                btn.classList.add('active');
            }
        });
    }

    getCategoryName(category) {
        const names = {
            phone: '电话诈骗',
            sms: '短信诈骗',
            network: '网络诈骗',
            social: '社交诈骗'
        };
        return names[category] || '未知类型';
    }

    renderLessons(category) {
        const container = document.getElementById('tutorial-content');
        const lessons = this.lessons[category] || [];

        container.innerHTML = lessons.map((lesson, index) => `
            <div class="lesson-card" data-lesson-id="${lesson.id}">
                <h4 class="lesson-title">
                    <span class="lesson-number">${index + 1}. </span>
                    ${lesson.title}
                </h4>
                <div class="lesson-content">
                    <p>${lesson.content}</p>

                    ${lesson.examples && lesson.examples.length > 0 ? `
                        <div class="lesson-examples">
                            <h5>常见例子：</h5>
                            ${lesson.examples.map(example => `
                                <div class="lesson-example">
                                    ${example}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${lesson.keyPoints && lesson.keyPoints.length > 0 ? `
                        <div class="lesson-key-points">
                            <h5>重点记住：</h5>
                            <ul>
                                ${lesson.keyPoints.map(point => `
                                    <li>${point}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>

                <div class="lesson-actions">
                    <button class="btn btn-secondary" onclick="tutorial.markLessonComplete('${lesson.id}')">
                        ${this.progress.viewedLessons.includes(lesson.id) ? '✓ 已学习' : '标记为已学习'}
                    </button>
                </div>
            </div>
        `).join('');

        // 添加动画效果
        setTimeout(() => {
            const cards = container.querySelectorAll('.lesson-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.animation = 'slideUp 0.3s ease forwards';
                }, index * 100);
            });
        }, 100);
    }

    markLessonComplete(lessonId) {
        if (!this.progress.viewedLessons.includes(lessonId)) {
            this.progress.viewedLessons.push(lessonId);
            this.progress.progress[this.currentCategory] = Math.min(
                this.progress.progress[this.currentCategory] + 33, // 每个类别3个课程
                100
            );

            storage.saveTutorialProgress(this.progress);
            storage.updateTutorialProgress(this.currentCategory, lessonId);

            // 重新渲染当前类别
            this.renderLessons(this.currentCategory);

            // 显示完成提示
            this.showCompletionMessage();
        }
    }

    showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <div class="completion-content">
                <h4>✓ 学习完成</h4>
                <p>继续加油！学习更多防诈骗知识。</p>
            </div>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.classList.add('show');
        }, 100);

        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 2000);
    }

    getProgress() {
        return {
            totalLessons: Object.values(this.lessons).reduce((total, categoryLessons) => total + categoryLessons.length, 0),
            completedLessons: this.progress.viewedLessons.length,
            categoryProgress: this.progress.progress,
            completedCategories: this.progress.completedCategories.length
        };
    }

    resetProgress() {
        this.progress = storage.createDefaultTutorialProgress();
        storage.saveTutorialProgress(this.progress);
        this.showCategory(this.currentCategory);
    }

    // 搜索功能
    searchLessons(keyword) {
        const allLessons = [];

        Object.entries(this.lessons).forEach(([category, categoryLessons]) => {
            categoryLessons.forEach(lesson => {
                if (lesson.title.includes(keyword) ||
                    lesson.content.includes(keyword) ||
                    (lesson.examples && lesson.examples.some(example => example.includes(keyword))) ||
                    (lesson.keyPoints && lesson.keyPoints.some(point => point.includes(keyword)))) {
                    allLessons.push({
                        ...lesson,
                        category: category,
                        categoryName: this.getCategoryName(category)
                    });
                }
            });
        });

        return allLessons;
    }

    // 获取推荐课程
    getRecommendedLessons() {
        const gameData = storage.getGameData();
        const recommendations = [];

        // 根据游戏表现推荐薄弱环节
        if (gameData && gameData.statistics) {
            Object.entries(gameData.statistics).forEach(([type, stats]) => {
                if (stats.attempts > 0) {
                    const accuracy = (stats.correct / stats.attempts) * 100;
                    if (accuracy < 70) { // 正确率低于70%推荐学习
                        recommendations.push({
                            category: type,
                            categoryName: this.getCategoryName(type),
                            reason: `正确率仅${Math.round(accuracy)}%，需要加强学习`,
                            lessons: this.lessons[type]
                        });
                    }
                }
            });
        }

        return recommendations;
    }
}

// 导出类供初始化管理器使用
// 全局实例将由初始化管理器创建

// 添加样式到页面
const tutorialStyles = `
<style>
.completion-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
    text-align: center;
    min-width: 200px;
}

.completion-message.show {
    opacity: 1;
}

.completion-content h4 {
    margin-bottom: 8px;
    font-size: 18px;
}

.completion-content p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
}

.lesson-number {
    color: #667eea;
    font-weight: 700;
}

.lesson-key-points {
    margin-top: 16px;
    padding: 12px;
    background: #f8f9ff;
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

.lesson-key-points h5 {
    margin-bottom: 8px;
    color: #667eea;
    font-size: 14px;
    font-weight: 600;
}

.lesson-key-points ul {
    margin: 0;
    padding-left: 20px;
}

.lesson-key-points li {
    margin: 4px 0;
    font-size: 14px;
    color: #555;
}

.lesson-actions {
    margin-top: 16px;
    text-align: center;
}

.lesson-actions .btn {
    font-size: 14px;
    padding: 8px 16px;
}
</style>
`;

// 将样式添加到页面
document.head.insertAdjacentHTML('beforeend', tutorialStyles);