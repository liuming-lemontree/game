// Fanzha Game Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fanzhan Game initialized');

    // Game state
    let gameState = {
        currentLevel: 0,
        score: 0,
        achievements: []
    };

    // DOM elements
    const startBtn = document.getElementById('startGame');
    const learnMoreBtn = document.getElementById('learnMore');

    // Event listeners
    startBtn.addEventListener('click', startGame);
    learnMoreBtn.addEventListener('click', showMoreInfo);

    // Functions
    function startGame() {
        console.log('Starting game...');

        // Show loading state
        startBtn.textContent = '加载中...';
        startBtn.disabled = true;

        // Simulate game loading
        setTimeout(() => {
            alert('游戏即将开始！\n\n这里是反诈骗教育游戏的开始界面。\n在完整版本中，您将体验各种反诈骗场景。');
            startBtn.textContent = '开始游戏';
            startBtn.disabled = false;
        }, 1500);
    }

    function showMoreInfo() {
        console.log('Showing more information...');

        const info = `
Fanzhan 反诈骗教育游戏

游戏特色：
• 真实诈骗场景模拟
• 互动式学习体验
• 防诈骗知识测试
• 成就系统
• 进度跟踪

学习目标：
• 识别常见诈骗手段
• 学习防范技巧
• 提高安全意识
• 保护个人信息

版本：1.0.0
开发团队：Fanzhan Team
        `;

        alert(info);
    }

    // Initialize game
    function initGame() {
        console.log('Initializing game components...');

        // Load saved game state
        loadGameState();

        // Update UI
        updateUI();

        console.log('Game ready!');
    }

    // Load game state from localStorage
    function loadGameState() {
        const saved = localStorage.getItem('fanzhanGameState');
        if (saved) {
            gameState = JSON.parse(saved);
            console.log('Game state loaded:', gameState);
        }
    }

    // Save game state to localStorage
    function saveGameState() {
        localStorage.setItem('fanzhanGameState', JSON.stringify(gameState));
        console.log('Game state saved:', gameState);
    }

    // Update UI elements
    function updateUI() {
        // Update score display if exists
        const scoreDisplay = document.getElementById('score');
        if (scoreDisplay) {
            scoreDisplay.textContent = gameState.score;
        }

        // Update level display if exists
        const levelDisplay = document.getElementById('level');
        if (levelDisplay) {
            levelDisplay.textContent = gameState.currentLevel;
        }
    }

    // Add some interactive effects
    function addInteractiveEffects() {
        // Add hover effects to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // Add click animations
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Press 'S' to start game
        if (event.key === 's' || event.key === 'S') {
            if (!startBtn.disabled) {
                startGame();
            }
        }

        // Press 'I' for information
        if (event.key === 'i' || event.key === 'I') {
            showMoreInfo();
        }
    });

    // Initialize everything
    initGame();
    addInteractiveEffects();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/fanzhan/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}