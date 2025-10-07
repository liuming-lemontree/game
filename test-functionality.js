// 游戏功能测试脚本
console.log('🧪 开始《反诈先锋》游戏功能测试...\n');

// 测试结果记录
const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

// 测试函数
function runTest(testName, testFunction) {
    try {
        const result = testFunction();
        if (result) {
            console.log(`✅ ${testName}: 通过`);
            testResults.passed++;
            testResults.tests.push({ name: testName, status: 'PASS' });
        } else {
            console.log(`❌ ${testName}: 失败`);
            testResults.failed++;
            testResults.tests.push({ name: testName, status: 'FAIL' });
        }
    } catch (error) {
        console.log(`❌ ${testName}: 错误 - ${error.message}`);
        testResults.failed++;
        testResults.tests.push({ name: testName, status: 'ERROR', error: error.message });
    }
}

// 测试1: 检查全局对象是否正确创建
runTest('全局对象初始化', () => {
    return typeof window.game === 'object' &&
           typeof window.storage === 'object' &&
           typeof window.tutorial === 'object' &&
           typeof window.ScenarioManager === 'function';
});

// 测试2: 检查场景数据
runTest('场景数据完整性', () => {
    if (typeof ScenariosData === 'undefined') return false;

    let scenarioCount = 0;
    for (const [category, scenarios] of Object.entries(ScenariosData)) {
        scenarioCount += scenarios.length;
        for (const scenario of scenarios) {
            if (!scenario.id || !scenario.title || !scenario.content || !scenario.choices) {
                return false;
            }
        }
    }
    return scenarioCount > 0;
});

// 测试3: 检查存储功能
runTest('本地存储功能', () => {
    if (typeof window.storage === 'undefined') return false;

    try {
        // 测试基本存储功能
        const testData = { test: 'value', timestamp: Date.now() };
        window.storage.setItem('testKey', testData);
        const retrieved = window.storage.getItem('testKey');
        window.storage.removeItem('testKey');
        return retrieved && retrieved.test === 'value';
    } catch (error) {
        return false;
    }
});

// 测试4: 检查游戏核心功能
runTest('游戏核心功能', () => {
    if (typeof window.game === 'undefined') return false;

    return typeof window.game.startGame === 'function' &&
           typeof window.game.showTutorial === 'function' &&
           typeof window.game.backToMenu === 'function';
});

// 测试5: 检查教程系统
runTest('教程系统功能', () => {
    if (typeof window.tutorial === 'undefined') return false;

    return typeof window.tutorial.showCategory === 'function' &&
           typeof window.tutorial.lessons === 'object';
});

// 测试6: 检查场景管理器
runTest('场景管理器功能', () => {
    if (typeof window.ScenarioManager === 'undefined') return false;

    const manager = new window.ScenarioManager();
    return typeof manager.getRandomScenario === 'function' &&
           typeof manager.getScenarioById === 'function' &&
           manager.allScenarios.length > 0;
});

// 测试7: 检查DOM元素
runTest('DOM元素完整性', () => {
    const requiredElements = [
        'main-menu', 'game-screen', 'tutorial-screen',
        'achievements-screen', 'about-screen', 'loading'
    ];

    return requiredElements.every(id => {
        const element = document.getElementById(id);
        return element && element.classList.contains('screen');
    });
});

// 测试8: 检查样式文件加载
runTest('CSS样式加载', () => {
    const styleSheets = Array.from(document.styleSheets);
    const hasStyleCSS = styleSheets.some(sheet =>
        sheet.href && sheet.href.includes('style.css')
    );
    const hasMobileCSS = styleSheets.some(sheet =>
        sheet.href && sheet.href.includes('mobile.css')
    );

    return hasStyleCSS && hasMobileCSS;
});

// 测试9: 检查设备适配
runTest('设备适配功能', () => {
    return typeof window.deviceAdapter === 'object' &&
           typeof window.deviceAdapter.getDeviceInfo === 'function';
});

// 测试10: 检查错误处理
runTest('错误处理机制', () => {
    return typeof window.debugManager === 'object' &&
           typeof window.debugManager.logError === 'function';
});

// 输出测试结果
setTimeout(() => {
    console.log('\n📊 测试结果汇总:');
    console.log(`通过: ${testResults.passed}/${testResults.tests.length}`);
    console.log(`失败: ${testResults.failed}/${testResults.tests.length}`);

    if (testResults.failed > 0) {
        console.log('\n❌ 失败的测试:');
        testResults.tests
            .filter(test => test.status !== 'PASS')
            .forEach(test => {
                console.log(`  - ${test.name}: ${test.error || '测试失败'}`);
            });
    }

    console.log('\n🎯 游戏功能测试完成！');

    // 保存测试结果到全局变量
    window.gameTestResults = testResults;
}, 1000);

// 导出测试函数供外部调用
window.runGameTests = () => testResults;