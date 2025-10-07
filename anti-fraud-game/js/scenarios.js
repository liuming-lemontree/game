// 游戏场景数据
const ScenariosData = {
    // 电话诈骗场景
    phone: [
        {
            id: 'phone_001',
            type: 'phone',
            title: '冒充公检法诈骗',
            sender: '自称市公安局民警',
            content: '您好，我是市公安局的民警，我们侦破了一起重大洗钱案件，发现您的银行卡涉嫌资金转移。现在需要您配合调查，请将资金转移到我们的安全账户，否则将冻结您的所有资产。',
            choices: [
                {
                    text: '立即按照要求转账配合调查',
                    isCorrect: false,
                    feedback: '错误！公检法机关绝不会通过电话要求转账到"安全账户"。这是典型的冒充公检法诈骗。',
                    tips: '真正的公检法机关不会通过电话要求转账，更不会设立所谓的"安全账户"。如接到此类电话，应立即挂断并报警。'
                },
                {
                    text: '要求对方出示证件并拨打110核实',
                    isCorrect: true,
                    feedback: '正确！遇到自称公检法的人员，应要求对方出示工作证件，并通过官方渠道核实身份。',
                    tips: '遇到可疑电话时，可以拨打110或当地派出所电话核实，不要轻信陌生电话中的信息。'
                },
                {
                    text: '提供个人信息配合调查',
                    isCorrect: false,
                    feedback: '错误！不要向陌生人透露个人信息，特别是身份证号、银行卡号等敏感信息。',
                    tips: '保护个人信息很重要，不要向任何陌生电话透露个人敏感信息。'
                }
            ],
            difficulty: 'medium',
            points: 100
        },
        {
            id: 'phone_002',
            type: 'phone',
            title: '冒充客服退款诈骗',
            sender: '自称电商平台客服',
            content: '您好，我是xx购物平台客服。由于您购买的商品存在质量问题，我们需要为您办理退款。请提供您的银行卡号和验证码，我们立即为您处理退款。',
            choices: [
                {
                    text: '立即提供银行卡信息和验证码',
                    isCorrect: false,
                    feedback: '错误！不要向任何人提供银行卡验证码，验证码相当于银行卡密码。',
                    tips: '银行卡验证码是交易凭证，绝不能告诉任何人。正规退款不会索要验证码。'
                },
                {
                    text: '通过官方APP或网站联系客服核实',
                    isCorrect: true,
                    feedback: '正确！应该通过官方渠道联系客服核实退款信息，不要轻信陌生电话。',
                    tips: '处理退款等业务时，务必通过官方APP或网站联系客服，不要点击陌生链接或相信陌生电话。'
                },
                {
                    text: '要求对方先退款再提供信息',
                    isCorrect: false,
                    feedback: '错误！这仍然是诈骗陷阱，不要与对方进行任何交易。',
                    tips: '任何要求提供银行信息的陌生电话都可能是诈骗，应该直接挂断。'
                }
            ],
            difficulty: 'easy',
            points: 80
        },
        {
            id: 'phone_003',
            type: 'phone',
            title: '冒充领导诈骗',
            sender: '自称公司领导',
            content: '小王，我是张总。现在我正在开会，不方便说话。有个紧急项目需要立即付款5万元，你先把钱转到这个账户：6228481234567890123，会后我马上还你。',
            choices: [
                {
                    text: '立即转账以免影响项目',
                    isCorrect: false,
                    feedback: '错误！不要轻信陌生电话自称领导要求转账的情况。',
                    tips: '遇到自称领导要求转账的电话，一定要通过其他方式核实对方身份，如当面确认或拨打领导常用电话。'
                },
                {
                    text: '通过其他方式核实领导身份',
                    isCorrect: true,
                    feedback: '正确！应该通过当面确认、微信或拨打领导常用电话等方式核实身份。',
                    tips: '转账前务必通过多种渠道确认对方身份，不要仅凭电话就进行大额转账。'
                },
                {
                    text: '先转一部分钱试试真假',
                    isCorrect: false,
                    feedback: '错误！即使是小额转账也可能陷入诈骗陷阱。',
                    tips: '任何可疑的转账要求都应该拒绝，不要通过"小额测试"来判断真伪。'
                }
            ],
            difficulty: 'medium',
            points: 120
        },
        {
            id: 'phone_004',
            type: 'phone',
            title: '医保卡异常诈骗',
            sender: '自称医保局工作人员',
            content: '您好，我是市医保局工作人员。您的医保卡在异地有异常消费记录，涉嫌违规使用。请提供您的身份证号和医保卡密码，我们需要核实并为您冻结账户。',
            choices: [
                {
                    text: '立即提供个人信息配合调查',
                    isCorrect: false,
                    feedback: '错误！医保局不会通过电话要求提供密码等敏感信息。',
                    tips: '医保、社保等机构不会通过电话要求提供密码、验证码等敏感信息。'
                },
                {
                    text: '挂断电话并拨打官方热线核实',
                    isCorrect: true,
                    feedback: '正确！应该通过官方渠道核实信息，不要轻信陌生电话。',
                    tips: '可以拨打12393医保服务热线或前往当地医保局办事大厅核实信息。'
                },
                {
                    text: '要求对方提供工号并核实身份',
                    isCorrect: false,
                    feedback: '错误！对方提供的工号可能是伪造的，仍需通过官方渠道核实。',
                    tips: '不要相信陌生电话中提供的任何身份证明信息，都可能是伪造的。'
                }
            ],
            difficulty: 'easy',
            points: 80
        },
        {
            id: 'phone_005',
            type: 'phone',
            title: 'ETC认证诈骗',
            sender: '自称高速ETC客服',
            content: '您好，您的ETC账户已失效，需要在2小时内完成认证，否则将影响高速通行。请点击我们发送的短信链接进行认证，或提供银行卡号完成认证。',
            choices: [
                {
                    text: '立即点击链接进行认证',
                    isCorrect: false,
                    feedback: '错误！不要点击陌生短信中的链接，可能是钓鱼网站。',
                    tips: 'ETC认证请通过官方APP或官网办理，不要点击陌生链接。'
                },
                {
                    text: '通过官方ETCAPP核实账户状态',
                    isCorrect: true,
                    feedback: '正确！应该通过官方渠道核实ETC账户状态，不要轻信陌生电话。',
                    tips: '可以通过官方ETCAPP或前往ETC服务网点核实账户状态。'
                },
                {
                    text: '提供银行卡信息快速认证',
                    isCorrect: false,
                    feedback: '错误！不要向陌生人提供银行卡信息进行所谓的"认证"。',
                    tips: '任何要求提供银行信息的电话都可能是诈骗，应立即挂断。'
                }
            ],
            difficulty: 'medium',
            points: 90
        },
        {
            id: 'phone_006',
            type: 'phone',
            title: '贷款诈骗',
            sender: '自称贷款公司客服',
            content: '恭喜您！您的信用良好，已获得我司10万元无抵押贷款额度，年利率仅3.6%。现在办理只需提供身份证和银行卡照片，5分钟内即可放款。',
            choices: [
                {
                    text: '立即提供材料办理贷款',
                    isCorrect: false,
                    feedback: '错误！不要向陌生贷款公司提供个人敏感信息。',
                    tips: '正规贷款机构不会通过电话主动推销贷款，也不会要求提供身份证照片等敏感信息。'
                },
                {
                    text: '核实该公司资质后再考虑',
                    isCorrect: true,
                    feedback: '正确！应该先核实贷款公司的正规资质，不要轻信电话推销。',
                    tips: '可以通过工商部门网站查询公司资质，或选择银行等正规金融机构办理贷款。'
                },
                {
                    text: '先收取小额手续费再放款',
                    isCorrect: false,
                    feedback: '错误！任何要求先收费的贷款都是诈骗！',
                    tips: '正规贷款机构不会在放款前收取任何费用，凡是要求先收费的都是诈骗。'
                }
            ],
            difficulty: 'hard',
            points: 120
        }
    ],

    // 短信诈骗场景
    sms: [
        {
            id: 'sms_001',
            type: 'sms',
            title: '中奖诈骗短信',
            sender: '1069xxxxxx',
            content: '恭喜您！您的手机号码在xx活动中中奖，获得价值10000元的奖品和5000元现金。请点击链接 http://fake-prize.com 领取，24小时内有效！',
            choices: [
                {
                    text: '立即点击链接领取奖品',
                    isCorrect: false,
                    feedback: '错误！不要点击陌生短信中的链接，这些链接可能导向钓鱼网站。',
                    tips: '天上不会掉馅饼，中奖诈骗通常要求您先支付各种费用或提供个人信息。'
                },
                {
                    text: '删除短信并举报诈骗',
                    isCorrect: true,
                    feedback: '正确！遇到可疑的中奖短信，应该直接删除并通过官方渠道举报。',
                    tips: '可以通过12321网络不良与垃圾信息举报受理中心举报诈骗短信。'
                },
                {
                    text: '回复短信咨询详情',
                    isCorrect: false,
                    feedback: '错误！回复短信会让诈骗分子知道您的手机号是活跃的，可能收到更多诈骗信息。',
                    tips: '不要回复可疑短信，直接删除是最好的处理方式。'
                }
            ],
            difficulty: 'easy',
            points: 60
        },
        {
            id: 'sms_002',
            type: 'sms',
            title: '假冒银行短信',
            sender: '955xx（假冒银行）',
            content: '尊敬的客户，您的银行卡积分即将过期，现有10000积分可兑换800元现金。请点击链接 http://fake-bank.com 登录兑换，退订回T',
            choices: [
                {
                    text: '点击链接登录兑换积分',
                    isCorrect: false,
                    feedback: '错误！这可能是钓鱼网站，旨在窃取您的银行卡信息。',
                    tips: '银行积分兑换通常需要通过官方APP或网银操作，不会通过短信链接进行。'
                },
                {
                    text: '拨打银行官方客服电话核实',
                    isCorrect: true,
                    feedback: '正确！应该通过官方渠道核实积分信息，不要相信陌生短信链接。',
                    tips: '遇到银行相关短信，可以拨打银行卡背面的官方客服电话核实真伪。'
                },
                {
                    text: '退订短信不再接收',
                    isCorrect: false,
                    feedback: '错误！退订回复可能验证您的手机号活跃，导致更多诈骗信息。',
                    tips: '不要回复诈骗短信，包括退订。直接删除并开启短信过滤功能。'
                }
            ],
            difficulty: 'medium',
            points: 90
        },
        {
            id: 'sms_003',
            type: 'sms',
            title: '假冒ETC短信',
            sender: 'ETC服务中心',
            content: '您的ETC账户已过期，请点击链接 http://fake-etc.com 重新认证，否则将影响正常使用。链接24小时内有效，逾期将注销您的ETC账户。',
            choices: [
                {
                    text: '立即点击链接重新认证',
                    isCorrect: false,
                    feedback: '错误！不要点击陌生短信中的链接，这可能泄露您的个人信息。',
                    tips: 'ETC认证通常需要通过官方APP或线下网点办理，不会通过短信链接进行。'
                },
                {
                    text: '联系ETC官方客服核实',
                    isCorrect: true,
                    feedback: '正确！应该通过官方渠道核实ETC账户状态，不要相信陌生短信。',
                    tips: '可以通过ETC官方APP、客服热线或线下网点核实账户信息。'
                },
                {
                    text: '先注销ETC再重新办理',
                    isCorrect: false,
                    feedback: '错误！这样会给诈骗分子可乘之机，造成不必要的麻烦。',
                    tips: '不要基于可疑短信采取任何行动，应先通过官方渠道确认信息真实性。'
                }
            ],
            difficulty: 'medium',
            points: 100
        },
        {
            id: 'sms_004',
            type: 'sms',
            title: '冒充学校收费诈骗',
            sender: '校讯通',
            content: '【xx学校】尊敬的家长，您的孩子本学期学费3800元需在今日内缴纳，否则将影响正常上课。请点击链接 http://school-fee.com 在线缴费，支持微信、支付宝。',
            choices: [
                {
                    text: '立即点击链接缴费',
                    isCorrect: false,
                    feedback: '错误！不要点击陌生短信中的缴费链接，可能是诈骗网站。',
                    tips: '学校缴费应该通过官方渠道或学校通知的方式，不会通过短信链接要求缴费。'
                },
                {
                    text: '联系学校老师或班主任核实',
                    isCorrect: true,
                    feedback: '正确！应该通过学校官方渠道或直接联系老师核实缴费信息。',
                    tips: '遇到涉及金钱的学校信息，务必通过电话或直接到学校核实，不要相信陌生短信。'
                },
                {
                    text: '先交一小部分费用试试',
                    isCorrect: false,
                    feedback: '错误！即使是小额缴费也可能被骗，且会助长诈骗行为。',
                    tips: '不要基于可疑短信进行任何缴费操作，应先确认信息的真实性。'
                }
            ],
            difficulty: 'medium',
            points: 100
        },
        {
            id: 'sms_005',
            type: 'sms',
            title: '积分兑换诈骗',
            sender: '10086',
            content: '尊敬的用户，您的话费积分已达到5000分，可兑换500元话费或精美礼品。请点击链接 http://mobile-gift.com 立即兑换，24小时内过期。',
            choices: [
                {
                    text: '立即点击链接兑换话费',
                    isCorrect: false,
                    feedback: '错误！不要点击陌生短信中的兑换链接，可能是钓鱼网站。',
                    tips: '运营商积分兑换应该通过官方APP或营业厅办理，不会通过短信链接进行。'
                },
                {
                    text: '登录官方运营商APP核实积分',
                    isCorrect: true,
                    feedback: '正确！应该通过官方运营商APP或客服热线核实积分情况。',
                    tips: '可以通过官方运营商APP、客服电话或营业厅查询和兑换积分。'
                },
                {
                    text: '回复短信查询详情',
                    isCorrect: false,
                    feedback: '错误！回复短信会让诈骗分子知道您的手机号是活跃的。',
                    tips: '不要回复可疑短信，直接删除并开启短信过滤功能。'
                }
            ],
            difficulty: 'easy',
            points: 70
        },
        {
            id: 'sms_006',
            type: 'sms',
            title: '快递签收诈骗',
            sender: '快递公司',
            content: '您的快递已到达，但因地址不详无法派送。请点击链接 http://express-delivery.com 更新地址，或拨打客服电话400-xxx-xxxx重新安排配送。',
            choices: [
                {
                    text: '立即点击链接更新地址',
                    isCorrect: false,
                    feedback: '错误！不要点击陌生短信中的快递链接，可能窃取个人信息。',
                    tips: '快递信息更新应该通过官方快递APP或官方客服热线，不要点击陌生链接。'
                },
                {
                    text: '通过官方快递APP查询物流信息',
                    isCorrect: true,
                    feedback: '正确！应该通过官方快递APP或官方客服查询真实的物流信息。',
                    tips: '可以通过快递公司官方APP、官网或官方客服热线查询和确认快递信息。'
                },
                {
                    text: '拨打短信中的客服电话',
                    isCorrect: false,
                    feedback: '错误！短信中的电话可能是诈骗电话，会进一步引导您操作。',
                    tips: '不要拨打陌生短信中提供的电话号码，应该通过官方渠道获取客服联系方式。'
                }
            ],
            difficulty: 'medium',
            points: 90
        }
    ],

    // 网络诈骗场景
    network: [
        {
            id: 'net_001',
            type: 'network',
            title: '钓鱼网站诈骗',
            sender: '系统安全提醒',
            content: '检测到您的账户存在安全风险，请立即登录 http://fake-bank.com 紧急冻结账户。如不操作，30分钟后您的所有资金将被转移。',
            choices: [
                {
                    text: '立即登录网站冻结账户',
                    isCorrect: false,
                    feedback: '错误！这是钓鱼网站，旨在窃取您的账户信息。',
                    tips: '不要相信恐吓性的安全提醒，真正的安全问题会通过官方渠道通知。'
                },
                {
                    text: '通过官方APP或网站登录检查',
                    isCorrect: true,
                    feedback: '正确！应该通过官方渠道检查账户安全，不要点击可疑链接。',
                    tips: '遇到可疑的安全提醒，务必通过官方APP或网站登录账户查看真实情况。'
                },
                {
                    text: '拨打网站上的客服电话',
                    isCorrect: false,
                    feedback: '错误！网站上的客服电话可能是假的，会进一步引导您进行诈骗操作。',
                    tips: '不要相信可疑网站上提供的任何联系方式，应通过官方渠道获取客服信息。'
                }
            ],
            difficulty: 'hard',
            points: 150
        },
        {
            id: 'net_002',
            type: 'network',
            title: '虚假投资诈骗',
            sender: '投资顾问王经理',
            content: '发现一个绝佳的投资机会，数字货币投资项目，日收益5%，无风险。已经有很多人赚了大钱。立即注册可获500元新手红包，机会难得！',
            choices: [
                {
                    text: '立即注册投资获取高额收益',
                    isCorrect: false,
                    feedback: '错误！高收益承诺通常是诈骗陷阱，天下没有免费的午餐。',
                    tips: '任何承诺高收益、无风险的投资都是可疑的，正规投资都有风险。'
                },
                {
                    text: '查询该投资平台资质和口碑',
                    isCorrect: true,
                    feedback: '正确！投资前应该核实平台资质，查询相关监管信息。',
                    tips: '投资前要核实平台是否获得相关监管牌照，查询用户评价和投诉情况。'
                },
                {
                    text: '先投少量资金试试',
                    isCorrect: false,
                    feedback: '错误！即使是小额投资也可能陷入诈骗，初期的小额回报是为了引诱大额投资。',
                    tips: '诈骗平台通常会允许初期小额提现，目的是为了让您投入更多资金。'
                }
            ],
            difficulty: 'medium',
            points: 120
        },
        {
            id: 'net_003',
            type: 'network',
            title: '兼职刷单诈骗',
            sender: '兼职客服',
            content: '诚聘兼职刷单员，在家就能赚钱。每单返佣10-30%，日赚300-500元。无需经验，操作简单。第一单试做，垫付100元立返130元。',
            choices: [
                {
                    text: '立即尝试第一单刷单',
                    isCorrect: false,
                    feedback: '错误！刷单本身就是违法行为，而且是常见的诈骗手段。',
                    tips: '刷单是违法行为，任何要求垫付资金的兼职都可能是诈骗。'
                },
                {
                    text: '拒绝参与并举报诈骗信息',
                    isCorrect: true,
                    feedback: '正确！应该拒绝参与刷单等违法兼职，并向相关部门举报。',
                    tips: '可以通过反诈中心APP或12321平台举报网络兼职诈骗信息。'
                },
                {
                    text: '先了解详细操作流程',
                    isCorrect: false,
                    feedback: '错误！了解流程仍可能被诱导参与诈骗，应该直接拒绝。',
                    tips: '不要参与任何形式的刷单兼职，这些通常都是诈骗陷阱。'
                }
            ],
            difficulty: 'easy',
            points: 80
        },
        {
            id: 'net_004',
            type: 'network',
            title: '游戏账号交易诈骗',
            sender: '游戏交易平台',
            content: '高价收号！您的xx游戏账号估值8000元，现可立即出售。请登录 http://game-trade.com 进行账号估值和交易，需提供账号密码完成价值评估。',
            choices: [
                {
                    text: '立即登录网站评估账号价值',
                    isCorrect: false,
                    feedback: '错误！不要在可疑网站提供游戏账号密码，可能被盗号。',
                    tips: '游戏账号交易应该通过官方认证的平台，不要在陌生网站提供账号信息。'
                },
                {
                    text: '通过游戏官方渠道核实交易信息',
                    isCorrect: true,
                    feedback: '正确！应该通过游戏官方渠道或认证平台进行账号交易。',
                    tips: '游戏账号交易存在风险，建议通过官方或有信誉的平台进行，不要轻信高价收号信息。'
                },
                {
                    text: '提供账号密码快速评估',
                    isCorrect: false,
                    feedback: '错误！提供账号密码会导致账号被盗，造成更大损失。',
                    tips: '任何要求提供账号密码的交易都是诈骗，应该立即停止。'
                }
            ],
            difficulty: 'medium',
            points: 100
        },
        {
            id: 'net_005',
            type: 'network',
            title: '虚假客服诈骗',
            sender: '在线客服',
            content: '您好，我是xx平台客服。系统检测到您的账户被误冻结，需要您提供身份验证解冻。请点击链接 http://support-verify.com 提供身份证正反面照片。',
            choices: [
                {
                    text: '立即点击链接提供身份信息',
                    isCorrect: false,
                    feedback: '错误！不要在可疑网站提供身份证照片等敏感信息。',
                    tips: '客服问题应该通过官方APP或官方客服热线处理，不要点击陌生链接。'
                },
                {
                    text: '通过官方APP联系客服核实情况',
                    isCorrect: true,
                    feedback: '正确！应该通过官方APP或官方客服热线联系客服核实账户状态。',
                    tips: '任何声称账户问题的客服都应该通过官方渠道核实，不要相信陌生链接。'
                },
                {
                    text: '提供部分身份信息协助解冻',
                    isCorrect: false,
                    feedback: '错误！即使提供部分身份信息也可能被用于诈骗。',
                    tips: '不要向任何可疑客服提供身份信息，应该通过官方渠道处理账户问题。'
                }
            ],
            difficulty: 'hard',
            points: 130
        },
        {
            id: 'net_006',
            type: 'network',
            title: '虚假慈善捐款诈骗',
            sender: '爱心基金会',
            content: '紧急求助！山区儿童急需医疗救助，您的100元捐款可以拯救一个生命。请点击链接 http://charity-help.com 献爱心，我们会公开善款使用情况。',
            choices: [
                {
                    text: '立即点击链接捐款救助',
                    isCorrect: false,
                    feedback: '错误！不要在可疑网站捐款，可能是诈骗网站。',
                    tips: '慈善捐款应该通过正规公益机构进行，不要轻信网络上的紧急求助信息。'
                },
                {
                    text: '通过正规公益机构查询并捐款',
                    isCorrect: true,
                    feedback: '正确！应该通过正规公益机构或官方平台进行捐款。',
                    tips: '可以通过红十字会、希望工程等正规公益机构进行捐款，确保善款真正用于帮助需要的人。'
                },
                {
                    text: '先捐款小部分看看情况',
                    isCorrect: false,
                    feedback: '错误！即使是小额捐款也可能被骗，且会助长诈骗行为。',
                    tips: '不要基于可疑信息进行任何捐款，应该通过正规渠道确认慈善项目的真实性。'
                }
            ],
            difficulty: 'medium',
            points: 90
        },
        {
            id: 'net_007',
            type: 'network',
            title: '冒充公检法网站诈骗',
            sender: '最高人民法院',
            content: '您的名下有一张法院传票未处理，案件编号：2024-xx-xxxx。请立即登录 http://court-notice.com 查看传票详情并处理，否则将影响您的征信记录。',
            choices: [
                {
                    text: '立即登录网站查看传票',
                    isCorrect: false,
                    feedback: '错误！不要点击可疑的法院传票链接，可能是钓鱼网站。',
                    tips: '法院传票不会通过网站链接发送，应该通过官方法院或司法渠道核实。'
                },
                {
                    text: '拨打12368司法服务热线核实',
                    isCorrect: true,
                    feedback: '正确！应该通过官方司法服务热线或当地法院核实传票信息。',
                    tips: '可以通过12368司法服务热线或直接联系当地法院核实相关法律文书信息。'
                },
                {
                    text: '提供个人信息查询案件详情',
                    isCorrect: false,
                    feedback: '错误！不要向可疑网站提供个人信息查询案件。',
                    tips: '法律文书查询应该通过官方司法渠道进行，不要相信网络上的传票通知。'
                }
            ],
            difficulty: 'hard',
            points: 150
        }
    ],

    // 社交诈骗场景
    social: [
        {
            id: 'social_001',
            type: 'social',
            title: '冒充熟人诈骗',
            sender: '同学（头像和名字相似）',
            content: '在吗？我出车祸了，急需用钱住院，现在微信无法支付，能否先转2000元到这个账户：6228481234567890123，回头我马上还你。',
            choices: [
                {
                    text: '立即转账帮助同学',
                    isCorrect: false,
                    feedback: '错误！不要轻信网络上的借款请求，即使是熟人也要核实身份。',
                    tips: '遇到网上借款请求，务必通过电话或其他可靠方式确认对方身份。'
                },
                {
                    text: '通过电话或其他方式核实身份',
                    isCorrect: true,
                    feedback: '正确！应该通过多种渠道核实对方身份，确认情况真实性。',
                    tips: '可以通过拨打对方常用电话、视频通话等方式确认对方身份和情况。'
                },
                {
                    text: '先转一部分钱表示关心',
                    isCorrect: false,
                    feedback: '错误！即使是小额转账也可能被骗，而且会鼓励诈骗分子继续行骗。',
                    tips: '不要基于可疑信息进行任何转账，应该先确认情况真实性。'
                }
            ],
            difficulty: 'medium',
            points: 100
        },
        {
            id: 'social_002',
            type: 'social',
            title: '情感诈骗',
            sender: '网友（认识一个月）',
            content: '亲爱的，我这边家里出了急事，需要5万元周转，但我的资金都被套住了。你能否先借我5万元，下个月我一定还你，我们的感情这么好，你一定会帮我的对吗？',
            choices: [
                {
                    text: '出于感情借钱帮助',
                    isCorrect: false,
                    feedback: '错误！不要因为感情就盲目借钱给网上认识的人。',
                    tips: '网络交友要谨慎，特别是涉及金钱往来时，更要保持理性。'
                },
                {
                    text: '拒绝借钱并保持距离',
                    isCorrect: true,
                    feedback: '正确！应该拒绝金钱往来，并对这段关系保持警惕。',
                    tips: '真正的朋友不会在网络上频繁借钱，要警惕利用感情进行诈骗的行为。'
                },
                {
                    text: '要求对方提供身份证明',
                    isCorrect: false,
                    feedback: '错误！身份证明可能造假，仍可能被骗。',
                    tips: '网络上的身份信息都可能造假，不要基于这些信息就进行金钱交易。'
                }
            ],
            difficulty: 'hard',
            points: 150
        },
        {
            id: 'social_003',
            type: 'social',
            title: '虚假求助诈骗',
            sender: '陌生网友',
            content: '我是贫困山区的学生，考上大学但交不起学费，希望能得到您的帮助。我的录取通知书和身份证明都可以提供，恳请您资助我的学费，我会努力学习回报社会。',
            choices: [
                {
                    text: '立即捐款资助学生',
                    isCorrect: false,
                    feedback: '错误！不要轻信网络上的个人求助信息，这些可能是诈骗。',
                    tips: '如需捐款，应通过正规的公益机构进行，不要直接向个人转账。'
                },
                {
                    text: '通过正规公益渠道捐款',
                    isCorrect: true,
                    feedback: '正确！应该通过正规公益机构进行捐款，确保资金真正用于帮助需要的人。',
                    tips: '可以通过红十字会、希望工程等正规公益机构进行捐款，避免个人诈骗。'
                },
                {
                    text: '要求提供更多证明材料',
                    isCorrect: false,
                    feedback: '错误！证明材料可能造假，仍可能被骗。',
                    tips: '不要基于网络上的证明材料就进行捐款，这些材料可能都是伪造的。'
                }
            ],
            difficulty: 'medium',
            points: 90
        },
        {
            id: 'social_004',
            type: 'social',
            title: '情感诈骗（杀猪盘）',
            sender: '网友"小雨"',
            content: '认识你3个月了，我觉得我们很合适。最近我发现一个很好的投资平台，月收益15%，我已经赚了很多了。我们一起投资赚钱，为我们的未来做准备吧，先投5000元试试。',
            choices: [
                {
                    text: '立即投资一起赚钱',
                    isCorrect: false,
                    feedback: '错误！这是典型的"杀猪盘"诈骗，通过感情诱导投资。',
                    tips: '任何通过感情诱导投资的都是诈骗，不要被情感蒙蔽理智。'
                },
                {
                    text: '拒绝投资并保持警惕',
                    isCorrect: true,
                    feedback: '正确！应该拒绝任何网友的投资推荐，保持警惕。',
                    tips: '网友推荐的投资机会通常是诈骗陷阱，应该通过正规渠道了解投资信息。'
                },
                {
                    text: '先投少量资金测试',
                    isCorrect: false,
                    feedback: '错误！即使小额投资也可能是诈骗，初期允许提现是为了引诱大额投资。',
                    tips: '诈骗平台通常会允许初期小额提现，目的是为了让您投入更多资金。'
                }
            ],
            difficulty: 'hard',
            points: 150
        },
        {
            id: 'social_005',
            type: 'social',
            title: '冒充海外代购诈骗',
            sender: '海外代购商家',
            content: '最新款xx品牌包，国内专柜价3万元，我这里只需1.8万元，绝对是正品。先付定金5000元，货到海关再付尾款，有视频验货。',
            choices: [
                {
                    text: '立即支付定金锁定优惠',
                    isCorrect: false,
                    feedback: '错误！不要向陌生代购支付定金，可能是诈骗。',
                    tips: '海外代购存在风险，应该通过正规渠道或有信誉的平台购买。'
                },
                {
                    text: '要求对方提供正规购买凭证',
                    isCorrect: true,
                    feedback: '正确！应该要求提供正规购买凭证，并通过官方渠道核实。',
                    tips: '代购商品应该要求提供正规购买凭证、发票等，通过官方渠道验证真伪。'
                },
                {
                    text: '先支付定金看看货再说',
                    isCorrect: false,
                    feedback: '错误！即使支付定金也可能被骗，且会助长诈骗行为。',
                    tips: '不要向任何可疑代购支付定金，应该通过正规渠道购买商品。'
                }
            ],
            difficulty: 'medium',
            points: 100
        },
        {
            id: 'social_006',
            type: 'social',
            title: '虚假招聘诈骗',
            sender: 'HR李经理',
            content: '您好，看到您的简历很符合我们公司的要求。职位是行政助理，月薪8000元，五险一金。但需要先缴纳2000元服装押金，入职后退还。请今天内转账确认入职。',
            choices: [
                {
                    text: '立即支付押金确认入职',
                    isCorrect: false,
                    feedback: '错误！正规公司不会要求入职前缴纳任何费用。',
                    tips: '任何要求入职前缴纳费用的招聘都是诈骗，应该立即拒绝。'
                },
                {
                    text: '核实公司资质和招聘信息',
                    isCorrect: true,
                    feedback: '正确！应该核实公司的正规资质和招聘信息的真实性。',
                    tips: '可以通过工商部门网站查询公司资质，或通过官方招聘渠道核实招聘信息。'
                },
                {
                    text: '要求对方先出具录用通知书',
                    isCorrect: false,
                    feedback: '错误！即使是录用通知书也可能是伪造的，仍需核实公司资质。',
                    tips: '不要仅凭录用通知书就相信招聘信息，应该通过多种渠道核实公司情况。'
                }
            ],
            difficulty: 'medium',
            points: 90
        }
    ]
};

// 场景管理器
class ScenarioManager {
    constructor() {
        this.allScenarios = [];
        this.usedScenarios = new Set();
        this.initializeScenarios();
    }

    initializeScenarios() {
        // 将所有类型的场景合并到一个数组中
        Object.values(ScenariosData).forEach(typeScenarios => {
            this.allScenarios.push(...typeScenarios);
        });

        // 按难度排序
        this.allScenarios.sort((a, b) => {
            const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
    }

    getRandomScenario(difficulty = null) {
        let availableScenarios = this.allScenarios;

        if (difficulty) {
            availableScenarios = this.allScenarios.filter(s => s.difficulty === difficulty);
        }

        // 过滤已使用的场景
        availableScenarios = availableScenarios.filter(s => !this.usedScenarios.has(s.id));

        // 如果所有场景都用完了，重置使用记录
        if (availableScenarios.length === 0) {
            this.usedScenarios.clear();
            availableScenarios = this.allScenarios.filter(s =>
                difficulty ? s.difficulty === difficulty : true
            );
        }

        // 随机选择一个场景
        const randomIndex = Math.floor(Math.random() * availableScenarios.length);
        const selectedScenario = availableScenarios[randomIndex];

        // 标记为已使用
        this.usedScenarios.add(selectedScenario.id);

        return selectedScenario;
    }

    getScenarioById(id) {
        return this.allScenarios.find(s => s.id === id);
    }

    getScenariosByType(type) {
        return ScenariosData[type] || [];
    }

    reset() {
        this.usedScenarios.clear();
    }

    getProgress() {
        return {
            total: this.allScenarios.length,
            used: this.usedScenarios.size,
            remaining: this.allScenarios.length - this.usedScenarios.size
        };
    }
}