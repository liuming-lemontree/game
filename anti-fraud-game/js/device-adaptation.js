// 设备适配管理器
class DeviceAdaptationManager {
    constructor() {
        this.deviceType = this.detectDeviceType();
        this.touchSupported = 'ontouchstart' in window;
        this.mouseSupported = 'onmousedown' in window;
        this.initializeAdaptations();
    }

    detectDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);

        if (isTablet) return 'tablet';
        if (isMobile) return 'mobile';
        return 'desktop';
    }

    initializeAdaptations() {
        // 添加设备类型到body
        document.body.classList.add(`device-${this.deviceType}`);
        document.body.classList.add(this.touchSupported ? 'touch-enabled' : 'touch-disabled');
        document.body.classList.add(this.mouseSupported ? 'mouse-enabled' : 'mouse-disabled');

        // 设置视口缩放（针对桌面设备）
        if (this.deviceType === 'desktop') {
            this.setupDesktopAdaptations();
        }

        // 添加触摸事件模拟
        if (!this.touchSupported && this.mouseSupported) {
            this.setupTouchSimulation();
        }

        // 监听设备方向变化
        this.setupOrientationHandling();

        // 监听窗口大小变化
        this.setupResizeHandling();

        console.log(`设备检测: ${this.deviceType}, 触摸支持: ${this.touchSupported}, 鼠标支持: ${this.mouseSupported}`);
    }

    setupDesktopAdaptations() {
        // 为桌面设备添加特殊的CSS类
        document.body.classList.add('desktop-mode');

        // 设置最小宽度以模拟手机屏幕
        const gameContainer = document.querySelector('.container') || document.body;
        if (gameContainer) {
            gameContainer.style.minWidth = '320px';
            gameContainer.style.maxWidth = '480px';
            gameContainer.style.margin = '0 auto';
        }

        // 添加鼠标悬停效果
        this.addHoverEffects();
    }

    setupTouchSimulation() {
        // 模拟触摸事件
        const touchEvents = {
            touchstart: 'mousedown',
            touchmove: 'mousemove',
            touchend: 'mouseup',
            touchcancel: 'mouseup'
        };

        // 为所有交互元素添加触摸事件模拟
        document.addEventListener('DOMContentLoaded', () => {
            this.addTouchSimulationToElements();
        });

        // 如果DOM已经加载，立即添加
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            this.addTouchSimulationToElements();
        }
    }

    addTouchSimulationToElements() {
        const interactiveElements = document.querySelectorAll(
            'button, .btn, .choice-btn, .category-btn, .lesson-card, .achievement-badge, a, [onclick], *:not(.disabled):not([disabled])'
        );

        interactiveElements.forEach(element => {
            // 添加触摸模拟样式类
            element.classList.add('touch-simulated');

            // 移除原有的触摸样式检查
            if (!element.hasAttribute('data-touch-added')) {
                element.setAttribute('data-touch-added', 'true');

                // 增强的鼠标事件处理
                element.addEventListener('mousedown', (e) => {
                    this.handleTouchStart(e, element);
                }, { passive: true });

                element.addEventListener('mouseup', (e) => {
                    this.handleTouchEnd(e, element);
                }, { passive: true });

                element.addEventListener('mouseleave', (e) => {
                    this.handleTouchCancel(e, element);
                }, { passive: true });

                // 添加全局点击事件以确保所有点击都能触发
                element.addEventListener('click', (e) => {
                    this.handleTouchClick(e, element);
                }, { passive: true });

                // 确保元素具有正确的角色属性
                if (!element.getAttribute('role')) {
                    element.setAttribute('role', 'button');
                }
            }
        });
    }

    handleTouchStart(event, element) {
        if (!this.touchSupported) {
            // 添加触摸开始样式
            element.classList.add('touch-active');
            element.style.transform = 'scale(0.98)';
            element.style.transition = 'transform 0.1s ease';

            // 创建触摸反馈
            this.createTouchFeedback(event.pageX, event.pageY);
        }
    }

    handleTouchEnd(event, element) {
        if (!this.touchSupported) {
            // 移除触摸样式
            element.classList.remove('touch-active');
            element.style.transform = '';

            // 添加点击反馈动画
            element.classList.add('click-feedback');
            setTimeout(() => {
                element.classList.remove('click-feedback');
            }, 300);
        }
    }

  handleTouchClick(event, element) {
        if (!this.touchSupported) {
            // 创建触摸反馈效果
            this.createTouchFeedback(event.pageX, event.pageY);

            // 添加音频反馈（如果支持）
            this.playClickSound();

            // 触发自定义触摸事件
            const touchEvent = new CustomEvent('touchClick', {
                bubbles: true,
                cancelable: true,
                detail: { element, originalEvent: event }
            });
            element.dispatchEvent(touchEvent);
        }
    }

    handleTouchCancel(event, element) {
        if (!this.touchSupported) {
            // 移除触摸样式
            element.classList.remove('touch-active');
            element.style.transform = '';
        }
    }

    createTouchFeedback(x, y) {
        // 创建触摸反馈效果
        const feedback = document.createElement('div');
        feedback.className = 'touch-feedback';
        feedback.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.3);
            border: 2px solid rgba(102, 126, 234, 0.6);
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            animation: touchRipple 0.6s ease-out;
        `;

        document.body.appendChild(feedback);

        // 移除反馈元素
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 600);
    }

    addHoverEffects() {
        const style = document.createElement('style');
        style.textContent = `
            .desktop-mode .btn:hover,
            .desktop-mode .choice-btn:hover,
            .desktop-mode .category-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .desktop-mode .lesson-card:hover,
            .desktop-mode .achievement-badge:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }

            .touch-simulated {
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            .touch-active {
                opacity: 0.8 !important;
            }

            .click-feedback {
                animation: clickPulse 0.3s ease;
            }

            @keyframes touchRipple {
                from {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                to {
                    transform: translate(-50%, -50%) scale(3);
                    opacity: 0;
                }
            }

            @keyframes clickPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    setupOrientationHandling() {
        // 监听屏幕方向变化
        if (screen.orientation) {
            screen.orientation.addEventListener('change', () => {
                this.handleOrientationChange();
            });
        } else {
            // 兼容旧版API
            window.addEventListener('orientationchange', () => {
                this.handleOrientationChange();
            });
        }

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleOrientationChange() {
        const orientation = this.getCurrentOrientation();
        document.body.classList.remove('orientation-portrait', 'orientation-landscape');
        document.body.classList.add(`orientation-${orientation}`);

        console.log(`屏幕方向变化: ${orientation}`);

        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('orientationchange', {
            detail: { orientation: orientation }
        }));
    }

    getCurrentOrientation() {
        if (screen.orientation) {
            return screen.orientation.angle % 180 === 0 ? 'portrait' : 'landscape';
        }
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    setupResizeHandling() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // 更新设备类型检测
        const newDeviceType = this.detectDeviceType();
        if (newDeviceType !== this.deviceType) {
            document.body.classList.remove(`device-${this.deviceType}`);
            this.deviceType = newDeviceType;
            document.body.classList.add(`device-${this.deviceType}`);

            console.log(`设备类型变化: ${this.deviceType}`);
        }

        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('deviceResize', {
            detail: {
                deviceType: this.deviceType,
                orientation: this.getCurrentOrientation(),
                width: window.innerWidth,
                height: window.innerHeight
            }
        }));
    }

    // 动态添加新元素的触摸模拟
    playClickSound() {
        try {
            // 创建简单的点击音效
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 1000; // 1kHz音调
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // 忽略音频错误，静默失败
        }
    }

  observeNewElements() {
        // 使用MutationObserver监听DOM变化
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                this.addTouchSimulationToElements();
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            return observer;
        }
        return null;
    }

    // 获取设备信息
    getDeviceInfo() {
        return {
            type: this.deviceType,
            touchSupported: this.touchSupported,
            mouseSupported: this.mouseSupported,
            orientation: this.getCurrentOrientation(),
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            userAgent: navigator.userAgent
        };
    }

    // 检查是否为移动设备
    isMobile() {
        return this.deviceType === 'mobile' || this.deviceType === 'tablet';
    }

    // 检查是否为桌面设备
    isDesktop() {
        return this.deviceType === 'desktop';
    }

    // 获取推荐的按钮大小
    getRecommendedButtonSize() {
        if (this.isMobile()) {
            return {
                minHeight: '44px',
                padding: '12px 20px',
                fontSize: '16px'
            };
        } else {
            return {
                minHeight: '40px',
                padding: '10px 16px',
                fontSize: '14px'
            };
        }
    }
}

// 创建全局设备适配管理器实例
let deviceAdapter;

function initializeDeviceAdapter() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            deviceAdapter = new DeviceAdaptationManager();
            // 监听新元素添加
            deviceAdapter.observeNewElements();
        });
    } else {
        deviceAdapter = new DeviceAdaptationManager();
        deviceAdapter.observeNewElements();
    }
}

// 立即初始化
initializeDeviceAdapter();

// 导出供全局使用
window.DeviceAdaptationManager = DeviceAdaptationManager;
window.deviceAdapter = deviceAdapter;