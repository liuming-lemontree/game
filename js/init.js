// 统一初始化管理器
class InitializationManager {
    constructor() {
        this.modules = new Map();
        this.dependencies = new Map();
        this.initialized = new Set();
        this.errors = [];
        this.maxRetries = 10;
        this.retryDelay = 100;
    }

    // 注册模块
    registerModule(name, factory, dependencies = []) {
        this.modules.set(name, factory);
        this.dependencies.set(name, dependencies);
    }

    // 初始化所有模块
    async initializeAll() {
        console.log('开始初始化游戏模块...');

        try {
            // 按依赖顺序初始化
            const initOrder = this.getInitializationOrder();

            for (const moduleName of initOrder) {
                await this.initializeModule(moduleName);
            }

            console.log('所有模块初始化完成');
            return true;
        } catch (error) {
            console.error('模块初始化失败:', error);
            this.errors.push(error);
            return false;
        }
    }

    // 获取初始化顺序（拓扑排序）
    getInitializationOrder() {
        const visited = new Set();
        const visiting = new Set();
        const order = [];

        const visit = (name) => {
            if (visiting.has(name)) {
                throw new Error(`检测到循环依赖: ${name}`);
            }
            if (visited.has(name)) {
                return;
            }

            visiting.add(name);
            const deps = this.dependencies.get(name) || [];
            deps.forEach(dep => {
                if (!this.modules.has(dep)) {
                    console.warn(`依赖模块 ${dep} 未找到，跳过`);
                    return;
                }
                visit(dep);
            });
            visiting.delete(name);
            visited.add(name);
            order.push(name);
        };

        for (const name of this.modules.keys()) {
            visit(name);
        }

        return order;
    }

    // 初始化单个模块
    async initializeModule(name, retryCount = 0) {
        if (this.initialized.has(name)) {
            return this.modules.get(name);
        }

        const factory = this.modules.get(name);
        if (!factory) {
            throw new Error(`模块 ${name} 未注册`);
        }

        try {
            // 检查依赖
            const deps = this.dependencies.get(name) || [];
            for (const dep of deps) {
                if (!this.initialized.has(dep)) {
                    await this.initializeModule(dep);
                }
            }

            console.log(`初始化模块: ${name}`);

            // 等待DOM就绪（如果是DOM相关模块）
            if (this.requiresDOM(name)) {
                await this.waitForDOM();
            }

            // 执行初始化
            const instance = await factory();

            // 将实例挂载到全局对象
            window[name] = instance;
            this.initialized.add(name);

            console.log(`模块 ${name} 初始化成功`);
            return instance;

        } catch (error) {
            console.error(`模块 ${name} 初始化失败:`, error);

            // 重试机制
            if (retryCount < this.maxRetries) {
                console.log(`重试初始化模块 ${name} (${retryCount + 1}/${this.maxRetries})`);
                await this.sleep(this.retryDelay * Math.pow(2, retryCount));
                return this.initializeModule(name, retryCount + 1);
            }

            throw error;
        }
    }

    // 检查模块是否需要DOM
    requiresDOM(name) {
        const domModules = ['game', 'tutorial'];
        return domModules.includes(name);
    }

    // 等待DOM就绪
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    // 延迟函数
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 获取初始化状态
    getStatus() {
        return {
            totalModules: this.modules.size,
            initializedModules: this.initialized.size,
            pendingModules: Array.from(this.modules.keys()).filter(name => !this.initialized.has(name)),
            errors: this.errors
        };
    }
}

// 全局初始化管理器
const initManager = new InitializationManager();

// 注册存储模块
initManager.registerModule('storage', async () => {
    console.log('初始化存储模块...');
    return new StorageManager();
}, []);

// 注册触控增强模块
initManager.registerModule('touch-enhancement', async () => {
    console.log('初始化触控增强模块...');
    // 确保TouchEnhancement已经加载
    if (window.TouchEnhancement) {
        // 重新初始化触控增强
        if (window.touchEnhancement) {
            window.touchEnhancement.disable();
        }
        
        const touchEnhancement = new TouchEnhancement();
        window.touchEnhancement = touchEnhancement;
        
        console.log('✅ 触控增强模块初始化完成');
        return touchEnhancement;
    } else {
        // 等待触控增强脚本加载
        return new Promise(resolve => {
            setTimeout(() => {
                const touchEnhancement = new TouchEnhancement();
                window.touchEnhancement = touchEnhancement;
                console.log('✅ 触控增强模块初始化完成');
                resolve(touchEnhancement);
            }, 100);
        });
    }
}, ['storage']);

// 注册场景管理器
initManager.registerModule('ScenarioManager', async () => {
    console.log('初始化场景管理器...');
    return ScenarioManager;
}, []);

// 注册教程模块
initManager.registerModule('tutorial', async () => {
    console.log('初始化教程模块...');
    return new TutorialManager();
}, ['storage']);

// 注册游戏模块
initManager.registerModule('game', async () => {
    console.log('初始化游戏模块...');
    return new AntiFraudGame();
}, ['storage', 'ScenarioManager', 'touch-enhancement']);

// 注册调试模块
initManager.registerModule('debugManager', async () => {
    console.log('初始化调试模块...');
    return new DebugManager();
}, ['storage', 'game', 'tutorial']);

// 启动初始化
async function startInitialization() {
    console.log('开始游戏初始化流程...');

    try {
        const success = await initManager.initializeAll();

        if (success) {
            console.log('🎉 游戏初始化成功！');

            // 隐藏加载屏幕
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading');
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 300);
                }
            }, 500);

            // 触发初始化完成事件
            window.dispatchEvent(new CustomEvent('gameInitialized'));

        } else {
            console.error('❌ 游戏初始化失败');
            showInitializationError();
        }

    } catch (error) {
        console.error('初始化过程中发生错误:', error);
        showInitializationError(error);
    }
}

// 显示初始化错误
function showInitializationError(error = null) {
    const errorHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px;
                    max-width: 400px; text-align: center; z-index: 10000;">
            <h3>游戏初始化失败</h3>
            <p>抱歉，游戏在启动时遇到了问题。</p>
            ${error ? `<p style="font-size: 12px; color: #856404;">错误详情: ${error.message}</p>` : ''}
            <button onclick="location.reload()" style="background: #721c24; color: white;
                     border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                重新加载
            </button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', errorHTML);
}

// 页面加载完成后开始初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInitialization);
} else {
    startInitialization();
}

// 导出初始化管理器（用于调试）
window.initManager = initManager;