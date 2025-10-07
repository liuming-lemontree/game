// 触控模拟增强脚本 - 专门优化桌面端鼠标触控体验
class TouchEnhancement {
    constructor() {
        this.isEnabled = !('ontouchstart' in window) && window.matchMedia('(hover: hover)').matches;
        this.touchElements = new Set();
        this.soundEnabled = true;
        this.stats = {
            elementsEnhanced: 0,
            clicks: 0,
            doubleClicks: 0,
            rippleEffects: 0
        };
        this.isActive = false;

        if (this.isEnabled) {
            this.init();
        }
    }

    init() {
        console.log('🖱️ 启用桌面端触控模拟增强');
        this.isActive = true;

        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEnhancements());
        } else {
            this.setupEnhancements();
        }

        // 监听新元素添加
        this.observeNewElements();

        // 添加全局样式
        this.addEnhancedStyles();

        // 设置键盘导航支持
        this.setupKeyboardNavigation();
    }

    setupEnhancements() {
        // 为所有交互元素添加增强效果
        this.enhanceAllInteractiveElements();

        // 添加触控指示器
        this.addTouchIndicators();

        // 设置触控反馈
        this.setupTouchFeedback();

        // 优化点击延迟
        this.optimizeClickDelay();
    }

    enhanceAllInteractiveElements() {
        const selectors = [
            'button', '.btn', '.choice-btn', '.category-btn',
            '.lesson-card', '.achievement-badge', 'a[href]',
            '[onclick]', '[role="button"]', '.interactive-element',
            '.game-nav button', '.menu-buttons button',
            '.tutorial-categories button', '.stats-bar .stat-item'
        ];

        const elements = document.querySelectorAll(selectors.join(', '));

        elements.forEach(element => {
            this.enhanceElement(element);
        });
    }

    enhanceElement(element) {
        if (this.touchElements.has(element)) return;
        this.touchElements.add(element);
        this.stats.elementsEnhanced++;

        // 添加触控增强类
        element.classList.add('touch-enhanced');

        // 确保元素可以聚焦
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }

        // 增强鼠标事件
        this.enhanceMouseEvents(element);

        // 确保可访问性
        this.ensureAccessibility(element);
    }

    enhanceMouseEvents(element) {
        let isPressed = false;
        let pressStartTime = 0;

        element.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // 左键
                isPressed = true;
                pressStartTime = Date.now();

                // 添加按压效果
                this.addPressEffect(element, e);

                // 创建触控涟漪
                this.createRipple(element, e);
            }
        });

        element.addEventListener('mouseup', (e) => {
            if (isPressed && e.button === 0) {
                isPressed = false;

                // 计算按压时长
                const pressDuration = Date.now() - pressStartTime;

                // 移除按压效果
                this.removePressEffect(element);

                // 播放点击音效
                if (this.soundEnabled && pressDuration < 500) {
                    this.playClickSound();
                }

                // 添加释放动画
                this.addReleaseAnimation(element);
                
                // 增加点击统计
                this.stats.clicks++;
            }
        });

        element.addEventListener('mouseleave', () => {
            if (isPressed) {
                isPressed = false;
                this.removePressEffect(element);
            }
        });

        // 双击支持
        element.addEventListener('dblclick', (e) => {
            this.addDoubleClickEffect(element, e);
            this.stats.doubleClicks++;
        });
    }

    addPressEffect(element, event) {
        element.classList.add('mouse-pressed');

        // 添加缩放效果
        element.style.transform = 'scale(0.96)';
        element.style.transition = 'transform 0.1s ease';

        // 添加阴影效果
        element.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2) inset';
    }

    removePressEffect(element) {
        element.classList.remove('mouse-pressed');
        element.style.transform = '';
        element.style.boxShadow = '';
    }

    createRipple(element, event) {
        const ripple = document.createElement('div');
        ripple.className = 'mouse-ripple';

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;

        // 确保父元素有相对定位
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }

        element.appendChild(ripple);
        
        // 增加涟漪效果统计
        this.stats.rippleEffects++;

        // 动画结束后移除
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    addReleaseAnimation(element) {
        element.classList.add('mouse-released');
        setTimeout(() => {
            element.classList.remove('mouse-released');
        }, 200);
    }

    addDoubleClickEffect(element, event) {
        element.classList.add('double-click-effect');
        setTimeout(() => {
            element.classList.remove('double-click-effect');
        }, 300);

        // 创建特殊的双击涟漪
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                this.createRipple(element, event);
            }, i * 100);
        }
    }

    playClickSound() {
        try {
            // 使用 Web Audio API 创建触控音效
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // 设置音调参数
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.05);
            oscillator.type = 'sine';

            // 设置音量包络
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            // 播放声音
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // 静默失败
        }
    }

    addTouchIndicators() {
        // 添加全局触控指示器样式
        const indicator = document.createElement('div');
        indicator.id = 'touch-indicator';
        indicator.innerHTML = `
            <div class="touch-indicator-text">🖱️ 桌面端触控模拟已启用</div>
        `;
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(indicator);

        // 显示指示器3秒
        setTimeout(() => {
            indicator.style.opacity = '0.8';
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                    }
                }, 300);
            }, 3000);
        }, 1000);
    }

    setupTouchFeedback() {
        // 全局触控反馈
        document.addEventListener('click', (e) => {
            if (this.touchElements.has(e.target) || this.touchElements.has(e.target.closest('.touch-enhanced'))) {
                // 创建全局触控反馈
                this.createGlobalFeedback(e);
            }
        });
    }

    createGlobalFeedback(event) {
        const feedback = document.createElement('div');
        feedback.className = 'global-touch-feedback';
        feedback.style.cssText = `
            position: fixed;
            left: ${event.clientX}px;
            top: ${event.clientY}px;
            width: 30px;
            height: 30px;
            border: 2px solid rgba(102, 126, 234, 0.8);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: globalFeedback 0.5s ease-out;
            pointer-events: none;
            z-index: 10001;
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 500);
    }

    optimizeClickDelay() {
        // 消除300ms点击延迟
        document.addEventListener('touchstart', function() {}, { passive: true });

        // 优化触摸响应
        if (window.PointerEvent) {
            document.addEventListener('pointerdown', function(e) {
                if (e.pointerType === 'mouse') {
                    e.target.dispatchEvent(new MouseEvent('touchstart', {
                        bubbles: true,
                        cancelable: true,
                        clientX: e.clientX,
                        clientY: e.clientY
                    }));
                }
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('touch-enhanced')) {
                switch(e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.simulateTouch(e.target);
                        break;
                    case 'ArrowUp':
                    case 'ArrowDown':
                    case 'ArrowLeft':
                    case 'ArrowRight':
                        this.navigateWithArrows(e.key, e.target);
                        break;
                }
            }
        });
    }

    simulateTouch(element) {
        // 模拟触控效果
        element.classList.add('keyboard-activated');
        this.playClickSound();
        this.createRipple(element, {
            clientX: element.getBoundingClientRect().left + element.offsetWidth / 2,
            clientY: element.getBoundingClientRect().top + element.offsetHeight / 2
        });

        setTimeout(() => {
            element.classList.remove('keyboard-activated');
        }, 200);
    }

    navigateWithArrows(key, currentElement) {
        // 简单的方向键导航
        const allEnhanced = Array.from(document.querySelectorAll('.touch-enhanced'));
        const currentIndex = allEnhanced.indexOf(currentElement);

        let nextIndex;
        switch(key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                nextIndex = currentIndex > 0 ? currentIndex - 1 : allEnhanced.length - 1;
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                nextIndex = currentIndex < allEnhanced.length - 1 ? currentIndex + 1 : 0;
                break;
        }

        if (nextIndex !== undefined && allEnhanced[nextIndex]) {
            allEnhanced[nextIndex].focus();
        }
    }

    observeNewElements() {
        // 监听DOM变化，为新元素添加触控增强
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新元素是否为交互元素
                            if (node.matches && node.matches('button, .btn, .choice-btn, .category-btn, .lesson-card, .achievement-badge, [onclick], [role="button"]')) {
                                this.enhanceElement(node);
                            }

                            // 检查子元素
                            const interactiveChildren = node.querySelectorAll && node.querySelectorAll('button, .btn, .choice-btn, .category-btn, .lesson-card, .achievement-badge, [onclick], [role="button"]');
                            if (interactiveChildren) {
                                interactiveChildren.forEach(child => this.enhanceElement(child));
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    ensureAccessibility(element) {
        // 确保元素的可访问性
        if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
            element.setAttribute('aria-label', 'Interactive element');
        }

        // 添加角色属性
        if (!element.getAttribute('role')) {
            element.setAttribute('role', 'button');
        }
    }

    addEnhancedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 触控增强样式 */
            .touch-enhanced {
                position: relative;
                overflow: hidden;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .touch-enhanced:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .mouse-pressed {
                transform: scale(0.96) !important;
                transition: transform 0.1s ease !important;
            }

            .mouse-released {
                animation: releaseAnimation 0.2s ease;
            }

            .double-click-effect {
                animation: doubleClickAnimation 0.3s ease;
            }

            .keyboard-activated {
                animation: keyboardActivation 0.2s ease;
            }

            @keyframes rippleEffect {
                from {
                    transform: scale(0);
                    opacity: 1;
                }
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }

            @keyframes globalFeedback {
                from {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }

            @keyframes releaseAnimation {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            @keyframes doubleClickAnimation {
                0% { transform: scale(1); }
                25% { transform: scale(1.2); }
                50% { transform: scale(1); }
                75% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            @keyframes keyboardActivation {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
                100% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
            }

            /* 焦点样式增强 */
            .touch-enhanced:focus {
                outline: 2px solid #667eea;
                outline-offset: 2px;
            }

            /* 禁用状态样式 */
            .touch-enhanced:disabled,
            .touch-enhanced.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                pointer-events: none;
            }

            /* 加载状态样式 */
            .touch-enhanced.loading {
                pointer-events: none;
                position: relative;
            }

            .touch-enhanced.loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 16px;
                height: 16px;
                margin: -8px 0 0 -8px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;

        document.head.appendChild(style);
    }

    // 公共方法 - 禁用触控增强
    disable() {
        if (!this.isActive) return;
        
        console.log('🖱️ 禁用桌面端触控模拟增强');
        
        // 移除所有触控增强类
        document.querySelectorAll('.touch-enhanced').forEach(element => {
            element.classList.remove('touch-enhanced', 'mouse-pressed', 'mouse-released');
            element.style.transform = '';
            element.style.boxShadow = '';
        });
        
        // 清空触控元素集合
        this.touchElements.clear();
        this.isActive = false;
    }
    
    // 启用触控增强
    enable() {
        if (this.isActive) return;
        
        console.log('🖱️ 启用桌面端触控模拟增强');
        this.isActive = true;
        this.setupEnhancements();
    }
    
    // 获取触控增强统计信息
    getStats() {
        return {
            enabled: this.isActive,
            totalElements: this.touchElements.size,
            ...this.stats
        };
    }
    
    // 切换音效
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        console.log(`🖱️ 触控音效已${this.soundEnabled ? '启用' : '禁用'}`);
        return this.soundEnabled;
    }
}

// 创建全局触控增强实例
let touchEnhancement;

function initializeTouchEnhancement() {
    if (!('ontouchstart' in window) && window.matchMedia('(hover: hover)').matches) {
        touchEnhancement = new TouchEnhancement();
        window.touchEnhancement = touchEnhancement;

        // 添加全局控制命令
        window.toggleTouchSound = () => touchEnhancement.toggleSound();
        window.getTouchStats = () => touchEnhancement.getStats();

        console.log('🖱️ 桌面端触控模拟增强已加载');
        console.log('使用 toggleTouchSound() 切换音效');
        console.log('使用 getTouchStats() 查看统计');
    }
}

// 初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTouchEnhancement);
} else {
    initializeTouchEnhancement();
}

// 导出
window.TouchEnhancement = TouchEnhancement;