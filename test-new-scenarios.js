// 新场景功能测试脚本
console.log('🧪 开始测试新增的防诈骗场景...\n');

// 测试结果记录
const testResults = {
    totalScenarios: 0,
    passedScenarios: 0,
    failedScenarios: 0,
    scenarios: []
};

// 场景类型映射
const scenarioTypeNames = {
    'phone': '电话诈骗',
    'sms': '短信诈骗',
    'network': '网络诈骗',
    'social': '社交诈骗'
};

// 难度等级映射
const difficultyNames = {
    'easy': '简单',
    'medium': '中等',
    'hard': '困难'
};

// 测试单个场景
function testScenario(scenario, type, index) {
    const result = {
        id: scenario.id,
        type: type,
        title: scenario.title,
        passed: true,
        errors: []
    };

    // 检查必需字段
    const requiredFields = ['id', 'type', 'title', 'sender', 'content', 'choices', 'difficulty', 'points'];

    requiredFields.forEach(field => {
        if (!scenario[field]) {
            result.passed = false;
            result.errors.push(`缺少必需字段: ${field}`);
        }
    });

    // 检查ID格式
    if (scenario.id && !scenario.id.match(/^(phone|sms|network|social)_\d{3}$/)) {
        result.passed = false;
        result.errors.push(`ID格式不正确: ${scenario.id}`);
    }

    // 检查类型匹配
    if (scenario.type && scenario.type !== type) {
        result.passed = false;
        result.errors.push(`类型不匹配: 声明为${type}，但场景中为${scenario.type}`);
    }

    // 检查选项
    if (scenario.choices) {
        if (!Array.isArray(scenario.choices) || scenario.choices.length < 2) {
            result.passed = false;
            result.errors.push('选项必须是包含至少2个选项的数组');
        } else {
            // 检查每个选项
            scenario.choices.forEach((choice, choiceIndex) => {
                const choiceFields = ['text', 'isCorrect', 'feedback', 'tips'];
                choiceFields.forEach(field => {
                    if (choice[field] === undefined || choice[field] === null) {
                        result.passed = false;
                        result.errors.push(`选项${choiceIndex + 1}缺少字段: ${field}`);
                    }
                });

                // 检查isCorrect类型
                if (typeof choice.isCorrect !== 'boolean') {
                    result.passed = false;
                    result.errors.push(`选项${choiceIndex + 1}的isCorrect必须是布尔值`);
                }
            });

            // 检查是否有且仅有一个正确答案
            const correctChoices = scenario.choices.filter(choice => choice.isCorrect).length;
            if (correctChoices !== 1) {
                result.passed = false;
                result.errors.push(`必须有且仅有一个正确答案，当前有${correctChoices}个`);
            }
        }
    }

    // 检查难度
    if (scenario.difficulty && !['easy', 'medium', 'hard'].includes(scenario.difficulty)) {
        result.passed = false;
        result.errors.push(`难度值无效: ${scenario.difficulty}`);
    }

    // 检查分数
    if (scenario.points && (typeof scenario.points !== 'number' || scenario.points <= 0)) {
        result.passed = false;
        result.errors.push(`分数必须是正数，当前为: ${scenario.points}`);
    }

    // 检查内容长度
    if (scenario.content && scenario.content.length < 50) {
        result.errors.push('内容过短，建议至少50个字符');
    }

    // 检查反馈内容
    if (scenario.choices) {
        scenario.choices.forEach((choice, index) => {
            if (choice.feedback && choice.feedback.length < 10) {
                result.errors.push(`选项${index + 1}的反馈内容过短`);
            }
            if (choice.tips && choice.tips.length < 10) {
                result.errors.push(`选项${index + 1}的提示内容过短`);
            }
        });
    }

    return result;
}

// 主测试函数
function runNewScenarioTests() {
    console.log('📊 场景统计:');

    let totalScenarios = 0;
    const typeStats = {};

    // 测试每种类型的场景
    Object.keys(ScenariosData).forEach(type => {
        const scenarios = ScenariosData[type];
        const newScenarios = scenarios.filter(s => parseInt(s.id.split('_')[1]) > 3);

        typeStats[type] = {
            total: scenarios.length,
            new: newScenarios.length,
            passed: 0,
            failed: 0
        };

        console.log(`\n📱 ${scenarioTypeNames[type]}场景:`);
        console.log(`  总计: ${scenarios.length}个`);
        console.log(`  新增: ${newScenarios.length}个`);

        newScenarios.forEach((scenario, index) => {
            totalScenarios++;
            const result = testScenario(scenario, type, index);
            testResults.scenarios.push(result);

            if (result.passed) {
                testResults.passedScenarios++;
                typeStats[type].passed++;
                console.log(`  ✅ ${scenario.title} - 通过`);
            } else {
                testResults.failedScenarios++;
                typeStats[type].failed++;
                console.log(`  ❌ ${scenario.title} - 失败`);
                result.errors.forEach(error => {
                    console.log(`     ⚠️  ${error}`);
                });
            }
        });
    });

    testResults.totalScenarios = totalScenarios;

    // 输出统计信息
    console.log('\n📈 测试统计:');
    console.log(`  总场景数: ${totalScenarios}`);
    console.log(`  通过: ${testResults.passedScenarios}`);
    console.log(`  失败: ${testResults.failedScenarios}`);
    console.log(`  通过率: ${((testResults.passedScenarios / totalScenarios) * 100).toFixed(1)}%`);

    // 按类型统计
    console.log('\n📋 分类统计:');
    Object.keys(typeStats).forEach(type => {
        const stats = typeStats[type];
        if (stats.new > 0) {
            const passRate = ((stats.passed / stats.new) * 100).toFixed(1);
            console.log(`  ${scenarioTypeNames[type]}: ${stats.new}个新增，${stats.passed}个通过，${passRate}%通过率`);
        }
    });

    // 按难度统计
    const difficultyStats = { easy: 0, medium: 0, hard: 0 };
    testResults.scenarios.forEach(scenario => {
        if (ScenariosData[scenario.type]) {
            const scenarioData = ScenariosData[scenario.type].find(s => s.id === scenario.id);
            if (scenarioData) {
                difficultyStats[scenarioData.difficulty]++;
            }
        }
    });

    console.log('\n🎯 难度分布:');
    console.log(`  简单: ${difficultyStats.easy}个`);
    console.log(`  中等: ${difficultyStats.medium}个`);
    console.log(`  困难: ${difficultyStats.hard}个`);

    // 质量评估
    console.log('\n🏆 质量评估:');

    const avgChoices = testResults.scenarios.reduce((sum, s) => {
        const scenario = ScenariosData[s.type].find(sc => sc.id === s.id);
        return sum + (scenario ? scenario.choices.length : 0);
    }, 0) / totalScenarios;

    const avgPoints = testResults.scenarios.reduce((sum, s) => {
        const scenario = ScenariosData[s.type].find(sc => sc.id === s.id);
        return sum + (scenario ? scenario.points : 0);
    }, 0) / totalScenarios;

    console.log(`  平均选项数: ${avgChoices.toFixed(1)}个`);
    console.log(`  平均分数: ${avgPoints.toFixed(1)}分`);

    // 特殊场景检查
    console.log('\n🔍 特殊场景检查:');

    const highScenarios = testResults.scenarios.filter(s => {
        const scenario = ScenariosData[s.type].find(sc => sc.id === s.id);
        return scenario && scenario.points >= 130;
    });

    if (highScenarios.length > 0) {
        console.log(`  高分场景 (${highScenarios.length}个):`);
        highScenarios.forEach(s => {
            const scenario = ScenariosData[s.type].find(sc => sc.id === s.id);
            console.log(`    - ${scenario.title} (${scenario.points}分)`);
        });
    }

    // 生成报告
    generateTestReport();
}

// 生成测试报告
function generateTestReport() {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            total: testResults.totalScenarios,
            passed: testResults.passedScenarios,
            failed: testResults.failedScenarios,
            passRate: ((testResults.passedScenarios / testResults.totalScenarios) * 100).toFixed(1)
        },
        scenarios: testResults.scenarios.map(s => {
            const scenario = ScenariosData[s.type].find(sc => sc.id === s.id);
            return {
                id: s.id,
                type: scenarioTypeNames[s.type],
                title: s.title,
                difficulty: difficultyNames[scenario.difficulty],
                points: scenario.points,
                status: s.passed ? 'PASS' : 'FAIL',
                errors: s.errors
            };
        })
    };

    // 保存到全局变量供查看
    window.newScenarioTestReport = report;

    console.log('\n📄 详细报告已生成，可通过 window.newScenarioTestReport 查看');
}

// 执行测试
setTimeout(() => {
    runNewScenarioTests();

    // 最终结果
    setTimeout(() => {
        if (testResults.failedScenarios === 0) {
            console.log('\n🎉 所有新场景测试通过！');
        } else {
            console.log(`\n⚠️  有 ${testResults.failedScenarios} 个场景测试失败，请检查上述错误信息`);
        }
    }, 100);
}, 500);

// 导出测试函数
window.testNewScenarios = runNewScenarioTests;
window.getScenarioTestResults = () => testResults;