// 页面管理器 - 处理主游戏页面和功能页面之间的切换
class PageManager {
    constructor() {
        this.currentPage = 'game'; // 当前页面：'game', 'tutorial', 'progress', 'challenge', 'achievements'
        this.pages = {
            game: {
                element: document.getElementById('game-container'),
                controls: document.getElementById('main-controls')
            },
            tutorial: {
                element: document.getElementById('tutorial-page'),
                controls: document.getElementById('back-controls')
            },
            progress: {
                element: document.getElementById('progress-page'),
                controls: document.getElementById('back-controls')
            },
            challenge: {
                element: document.getElementById('challenge-page'),
                controls: document.getElementById('back-controls')
            },
            achievements: {
                element: document.getElementById('achievements-page'),
                controls: document.getElementById('back-controls')
            }
        };

        // 游戏容器现在已在HTML中定义，无需动态创建

        this.init();
    }

    init() {
        // 确保游戏容器和其他页面元素都正确引用
        this.updatePageReferences();
        this.bindEvents();
        this.showPage('game');
    }

    // 更新页面引用（确保所有元素都正确找到）
    updatePageReferences() {
        // 重新获取所有页面元素引用
        this.pages.game.element = document.getElementById('game-container');
        this.pages.tutorial.element = document.getElementById('tutorial-page');
        this.pages.progress.element = document.getElementById('progress-page');
        this.pages.challenge.element = document.getElementById('challenge-page');
        this.pages.achievements.element = document.getElementById('achievements-page');

        // 检查关键元素是否存在
        console.log('Page elements updated:', {
            game: !!this.pages.game.element,
            tutorial: !!this.pages.tutorial.element,
            progress: !!this.pages.progress.element,
            challenge: !!this.pages.challenge.element,
            achievements: !!this.pages.achievements.element
        });
    }

    bindEvents() {
        // 绑定返回按钮事件 - 使用事件委托确保动态创建的按钮也能响应
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'back-to-main') {
                console.log('Back to main button clicked');
                this.showPage('game');
            }
        });

        // 同时绑定现有按钮
        const backToMainBtn = document.getElementById('back-to-main');
        if (backToMainBtn) {
            backToMainBtn.addEventListener('click', () => {
                console.log('Back to main button clicked (direct binding)');
                this.showPage('game');
            });
        } else {
            console.log('Back to main button not found during initialization');
        }
    }

    // 显示指定页面
    showPage(pageName) {
        if (!this.pages[pageName]) {
            console.error('Page not found:', pageName);
            return;
        }

        console.log('Switching to page:', pageName);

        // 隐藏所有页面
        Object.keys(this.pages).forEach(key => {
            const page = this.pages[key];
            if (page.element) {
                page.element.style.display = 'none';
            }
            if (page.controls) {
                page.controls.style.display = 'none';
            }
        });

        // 显示目标页面
        const targetPage = this.pages[pageName];
        if (targetPage.element) {
            targetPage.element.style.display = 'block';
            console.log('Showing page element:', pageName);
        } else {
            console.warn('Page element not found:', pageName);
        }
        if (targetPage.controls) {
            targetPage.controls.style.display = 'flex';
            console.log('Showing page controls:', pageName);
        } else {
            console.warn('Page controls not found:', pageName);
        }

        this.currentPage = pageName;

        // 页面切换后的特殊处理
        this.handlePageSwitch(pageName);
    }

    // 处理页面切换后的逻辑
    handlePageSwitch(pageName) {
        switch (pageName) {
            case 'game':
                // 返回游戏时，刷新游戏状态
                if (window.game) {
                    document.getElementById('score-value').textContent = window.game.score;
                    // 确保场景容器可见
                    const scenarioContainer = document.getElementById('scenario-container');
                    if (scenarioContainer) {
                        scenarioContainer.style.display = 'flex';
                    }
                }
                break;
            case 'tutorial':
                // 显示教程页面时，初始化教程内容
                if (window.tutorialManager) {
                    window.tutorialManager.showTutorialMenu();
                }
                break;
            case 'progress':
                // 显示进度页面时，更新进度数据
                if (window.progressManager) {
                    window.progressManager.updateProgressDisplay();
                }
                break;
            case 'challenge':
                // 显示挑战页面时，加载挑战记录
                if (window.challengeManager) {
                    window.challengeManager.loadChallengeRecords();
                }
                break;
            case 'achievements':
                // 显示成就页面时，渲染成就内容
                if (window.achievementManager) {
                    window.achievementManager.renderAchievementsPage();
                }
                break;
        }
    }

    // 获取当前页面
    getCurrentPage() {
        return this.currentPage;
    }

    // 检查是否在游戏页面
    isInGamePage() {
        return this.currentPage === 'game';
    }
}

// 页面切换快捷方法
const Navigation = {
    showGame: () => window.pageManager.showPage('game'),
    showTutorial: () => window.pageManager.showPage('tutorial'),
    showProgress: () => window.pageManager.showPage('progress'),
    showChallenge: () => window.pageManager.showPage('challenge'),
    showAchievements: () => window.pageManager.showPage('achievements'),
    getCurrentPage: () => window.pageManager.getCurrentPage(),
    isInGamePage: () => window.pageManager.isInGamePage()
};

// 初始化页面管理器
document.addEventListener('DOMContentLoaded', () => {
    window.pageManager = new PageManager();
    window.Navigation = Navigation;
});