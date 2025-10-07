// 性能优化管理器
class PerformanceManager {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            memoryUsage: 0,
            fps: 0,
            networkRequests: 0
        };
        this.startTime = performance.now();
        this.observers = new Map();
        this.initializeOptimizations();
    }

    initializeOptimizations() {
        // 预加载关键资源
        this.preloadCriticalResources();

        // 设置性能监控
        this.setupPerformanceMonitoring();

        // 启用虚拟滚动（如果需要）
        this.enableVirtualScrolling();

        // 优化图片加载
        this.optimizeImageLoading();

        // 设置内存管理
        this.setupMemoryManagement();
    }

    preloadCriticalResources() {
        // 预加载关键场景数据
        if (typeof ScenarioManager !== 'undefined') {
            const scenarioManager = new ScenarioManager();
            // 预加载前几个场景
            for (let i = 0; i < 3; i++) {
                const scenario = scenarioManager.getRandomScenario();
                if (scenario) {
                    this.cacheScenario(scenario);
                }
            }
        }
    }

    cacheScenario(scenario) {
        // 使用内存缓存场景数据
        if (!window.gameScenarioCache) {
            window.gameScenarioCache = new Map();
        }
        window.gameScenarioCache.set(scenario.id, scenario);
    }

    setupPerformanceMonitoring() {
        // 监控页面加载性能
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            this.metrics.loadTime = loadTime;
            console.log(`页面加载完成，耗时: ${loadTime.toFixed(2)}ms`);
        });

        // 监控FPS
        this.monitorFPS();

        // 监控内存使用（如果支持）
        if (performance.memory) {
            this.monitorMemory();
        }

        // 监控网络请求
        this.monitorNetworkRequests();
    }

    monitorFPS() {
        let lastTime = performance.now();
        let frames = 0;

        const measureFPS = () => {
            frames++;
            const currentTime = performance.now();

            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
                console.log(`FPS: ${this.metrics.fps}`);
                frames = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    }

    monitorMemory() {
        setInterval(() => {
            if (performance.memory) {
                this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);

                // 如果内存使用过高，触发清理
                if (this.metrics.memoryUsage > 50) { // 50MB
                    this.cleanupMemory();
                }
            }
        }, 5000);
    }

    monitorNetworkRequests() {
        // 使用Performance API监控网络请求
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch') {
                    this.metrics.networkRequests++;

                    // 如果请求时间过长，记录警告
                    if (entry.duration > 1000) {
                        console.warn(`慢请求检测: ${entry.name} 耗时 ${entry.duration.toFixed(2)}ms`);
                    }
                }
            });
        });

        try {
            observer.observe({ entryTypes: ['resource'] });
            this.observers.set('network', observer);
        } catch (error) {
            console.warn('Performance Observer not supported');
        }
    }

    enableVirtualScrolling() {
        // 为长列表启用虚拟滚动
        const achievementGrid = document.querySelector('.achievements-grid');
        if (achievementGrid && achievementGrid.children.length > 20) {
            this.setupVirtualScrolling(achievementGrid);
        }
    }

    setupVirtualScrolling(container) {
        // 虚拟滚动实现（简化版）
        const items = Array.from(container.children);
        const itemHeight = items[0] && items[0].offsetHeight || 100;
        const visibleCount = Math.ceil(container.offsetHeight / itemHeight) + 2;

        let startIndex = 0;

        const updateVisibleItems = () => {
            container.innerHTML = '';

            for (let i = startIndex; i < Math.min(startIndex + visibleCount, items.length); i++) {
                const clone = items[i].cloneNode(true);
                container.appendChild(clone);
            }
        };

        container.addEventListener('scroll', () => {
            const newStartIndex = Math.floor(container.scrollTop / itemHeight);
            if (newStartIndex !== startIndex) {
                startIndex = newStartIndex;
                updateVisibleItems();
            }
        });

        updateVisibleItems();
    }

    optimizeImageLoading() {
        // 懒加载图片
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupMemoryManagement() {
        // 定期清理未使用的缓存
        setInterval(() => {
            this.cleanupCache();
        }, 60000); // 每分钟清理一次

        // 页面隐藏时清理内存
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanupMemory();
            }
        });
    }

    cleanupCache() {
        // 清理过期的场景缓存
        if (window.gameScenarioCache && window.gameScenarioCache.size > 10) {
            const entries = Array.from(window.gameScenarioCache.entries());
            // 保留最近的10个场景
            const toKeep = entries.slice(-10);
            window.gameScenarioCache.clear();
            toKeep.forEach(([key, value]) => {
                window.gameScenarioCache.set(key, value);
            });
        }
    }

    cleanupMemory() {
        // 强制垃圾回收（如果支持）
        if (window.gc) {
            window.gc();
        }

        // 清理事件监听器
        this.observers.forEach(observer => {
            observer.disconnect();
        });

        // 清理DOM缓存
        const tempElements = document.querySelectorAll('[data-temp]');
        tempElements.forEach(el => el.remove());

        console.log('内存清理完成');
    }

    // 性能分析工具
    startProfile(name) {
        if (performance.mark) {
            performance.mark(`${name}-start`);
        }
    }

    endProfile(name) {
        if (performance.mark && performance.measure) {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);

            const measures = performance.getEntriesByName(name);
            if (measures.length > 0) {
                const duration = measures[measures.length - 1].duration;
                console.log(`${name} 耗时: ${duration.toFixed(2)}ms`);
                return duration;
            }
        }
        return 0;
    }

    // 获取性能报告
    getPerformanceReport() {
        return {
            metrics: this.metrics,
            recommendations: this.getRecommendations(),
            timestamp: new Date().toISOString()
        };
    }

    getRecommendations() {
        const recommendations = [];

        if (this.metrics.loadTime > 3000) {
            recommendations.push('页面加载时间较长，建议优化资源大小');
        }

        if (this.metrics.fps < 30) {
            recommendations.push('帧率较低，建议减少动画效果或优化渲染');
        }

        if (this.metrics.memoryUsage > 50) {
            recommendations.push('内存使用较高，建议优化缓存策略');
        }

        if (this.metrics.networkRequests > 50) {
            recommendations.push('网络请求过多，建议合并请求或使用缓存');
        }

        return recommendations;
    }

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 创建全局性能管理器
let performanceManager;

function initializePerformanceManager() {
    performanceManager = new PerformanceManager();
    window.performanceManager = performanceManager;

    // 添加到调试面板
    if (window.debugManager) {
        setInterval(() => {
            const report = performanceManager.getPerformanceReport();
            if (window.debugManager.updatePerformanceMetrics) {
                window.debugManager.updatePerformanceMetrics(report);
            }
        }, 5000);
    }
}

// 初始化性能管理器
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePerformanceManager);
} else {
    initializePerformanceManager();
}

// 导出工具函数
window.PerformanceUtils = {
    debounce: (func, wait) => {
        if (!performanceManager) return func;
        return performanceManager.debounce(func, wait);
    },

    throttle: (func, limit) => {
        if (!performanceManager) return func;
        return performanceManager.throttle(func, limit);
    },

    profile: (name, func) => {
        if (!performanceManager) return func();
        performanceManager.startProfile(name);
        const result = func();
        performanceManager.endProfile(name);
        return result;
    }
};