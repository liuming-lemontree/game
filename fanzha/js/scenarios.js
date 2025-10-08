// 完整的25个诈骗场景数据
const scenarios = [
  // 电话诈骗场景
  {
    id: 'phone_001',
    type: '电话诈骗',
    title: '冒充客服退款',
    sender: '【XX快递】',
    content: '尊敬的客户，您购买的商品在运输中丢失，请点击以下链接办理退款赔偿：http://fake.xx',
    choices: [
      { text: '立即点击链接办理退款', isCorrect: false, feedback: '❌ 错误！这是典型钓鱼链接！快递公司不会通过短信发送退款链接', tips: '✅ 正确做法：登录官方APP核实物流信息' },
      { text: '登录官方APP核实物流信息', isCorrect: true, feedback: '✅ 正确！官方渠道核实最安全', tips: '✅ 防骗要点：任何要求点击链接的退款都是诈骗' },
      { text: '拨打短信中的联系电话询问', isCorrect: false, feedback: '❌ 错误！骗子可能使用改号软件，请通过官方渠道联系', tips: '✅ 正确做法：通过官方客服电话核实' }
    ],
    difficulty: '简单',
    points: 80
  },
  {
    id: 'phone_002',
    type: '电话诈骗',
    title: '冒充银行客服',
    sender: '【工商银行】',
    content: '您的银行卡存在异常交易，为保证资金安全，请提供验证码完成身份验证。',
    choices: [
      { text: '立即提供验证码', isCorrect: false, feedback: '❌ 错误！银行绝不会通过电话索要验证码', tips: '✅ 正确做法：挂断电话，通过官方APP或网点核实' },
      { text: '通过官方APP核实卡片状态', isCorrect: true, feedback: '✅ 正确！通过官方渠道核实最安全', tips: '✅ 防骗要点：银行卡验证码绝不能告诉任何人' },
      { text: '询问对方工号并投诉', isCorrect: false, feedback: '❌ 错误！可能是改号软件，无法核实真实性', tips: '✅ 正确做法：主动拨打银行官方客服电话' }
    ],
    difficulty: '中等',
    points: 100
  },
  {
    id: 'phone_003',
    type: '电话诈骗',
    title: '冒充领导诈骗',
    sender: '【公司领导】',
    content: '我是张总，现在有个紧急项目需要资金周转，你先转5万元到这个账户，明天报销。',
    choices: [
      { text: '立即转账给领导', isCorrect: false, feedback: '❌ 错误！转账前必须通过其他方式核实身份', tips: '✅ 正确做法：当面或通过其他联系方式确认' },
      { text: '通过其他方式核实领导身份', isCorrect: true, feedback: '✅ 正确！转账前务必通过多种渠道确认对方身份', tips: '✅ 防骗要点：领导不会通过电话要求紧急转账' },
      { text: '询问项目详情后再决定', isCorrect: false, feedback: '❌ 错误！可能已被套话，应立即核实身份', tips: '✅ 正确做法：停止对话，主动联系领导确认' }
    ],
    difficulty: '中等',
    points: 120
  },
  {
    id: 'phone_004',
    type: '电话诈骗',
    title: '医保卡异常诈骗',
    sender: '【医保局】',
    content: '您的医保卡在外地有异常消费记录，请按9转接人工服务提供个人信息核查。',
    choices: [
      { text: '按提示转接并提供信息', isCorrect: false, feedback: '❌ 错误！医保局不会通过电话要求提供密码等敏感信息', tips: '✅ 正确做法：挂断电话并拨打官方热线核实' },
      { text: '挂断电话并拨打官方热线核实', isCorrect: true, feedback: '✅ 正确！通过官方渠道核实最可靠', tips: '✅ 防骗要点：政府机构不会通过电话索要敏感信息' },
      { text: '回拨显示号码确认', isCorrect: false, feedback: '❌ 错误！显示号码可能被伪造', tips: '✅ 正确做法：主动拨打官方服务热线' }
    ],
    difficulty: '简单',
    points: 80
  },
  {
    id: 'phone_005',
    type: '电话诈骗',
    title: 'ETC认证诈骗',
    sender: '【ETC服务中心】',
    content: '您的ETC账户已失效，请点击短信链接重新认证，否则将影响正常使用。',
    choices: [
      { text: '点击短信链接认证', isCorrect: false, feedback: '❌ 错误！ETC认证请通过官方APP或官网办理', tips: '✅ 正确做法：通过官方ETCAPP核实账户状态' },
      { text: '通过官方ETCAPP核实账户状态', isCorrect: true, feedback: '✅ 正确！官方渠道办理最安全', tips: '✅ 防骗要点：任何要求点击链接的认证都是诈骗' },
      { text: '致电ETC客服询问', isCorrect: false, feedback: '❌ 错误！可能已被套话，应主动拨打官方电话', tips: '✅ 正确做法：通过官方客服电话核实' }
    ],
    difficulty: '中等',
    points: 90
  },
  {
    id: 'phone_006',
    type: '电话诈骗',
    title: '贷款诈骗',
    sender: '【XX贷款】',
    content: '无抵押低息贷款，额度高达50万，只需提供身份证和银行卡照片即可办理。',
    choices: [
      { text: '提供资料申请贷款', isCorrect: false, feedback: '❌ 错误！任何要求先收费的贷款都是诈骗', tips: '✅ 正确做法：核实该公司资质后再考虑' },
      { text: '核实公司资质后再考虑', isCorrect: true, feedback: '✅ 正确！正规贷款机构有严格审核流程', tips: '✅ 防骗要点：正规贷款不会要求提前支付费用' },
      { text: '询问是否有其他要求', isCorrect: false, feedback: '❌ 错误！可能已被套话，应谨慎对待', tips: '✅ 正确做法：通过官方渠道查询贷款机构信息' }
    ],
    difficulty: '困难',
    points: 120
  },
  
  // 短信诈骗场景
  {
    id: 'sms_001',
    type: '短信诈骗',
    title: '中奖诈骗短信',
    sender: '【幸运抽奖】',
    content: '恭喜您获得苹果手机一部，点击链接领取：http://gift.xxx',
    choices: [
      { text: '点击链接领取奖品', isCorrect: false, feedback: '❌ 错误！天上不会掉馅饼，中奖信息基本是诈骗', tips: '✅ 正确做法：删除短信，不要点击任何链接' },
      { text: '删除短信，不点击任何链接', isCorrect: true, feedback: '✅ 正确！防范意识很强', tips: '✅ 防骗要点：陌生中奖信息切勿轻信' },
      { text: '转发给朋友看看', isCorrect: false, feedback: '❌ 错误！可能传播诈骗信息', tips: '✅ 正确做法：直接删除并举报垃圾短信' }
    ],
    difficulty: '简单',
    points: 60
  },
  {
    id: 'sms_002',
    type: '短信诈骗',
    title: '银行升级提醒',
    sender: '【工商银行】',
    content: '您的网银即将停用，请点击链接更新个人信息：http://icbc.xxx',
    choices: [
      { text: '点击链接更新信息', isCorrect: false, feedback: '❌ 错误！银行升级会通过官方渠道通知', tips: '✅ 正确做法：通过官方银行APP或客服核实' },
      { text: '通过官方银行APP或客服核实', isCorrect: true, feedback: '✅ 正确！官方渠道最可靠', tips: '✅ 防骗要点：银行不会通过短信链接要求更新信息' },
      { text: '致电银行确认', isCorrect: false, feedback: '❌ 错误！可能拨打诈骗电话', tips: '✅ 正确做法：主动拨打银行官方客服电话' }
    ],
    difficulty: '中等',
    points: 90
  },
  {
    id: 'sms_003',
    type: '短信诈骗',
    title: 'ETC认证短信',
    sender: '【ETC认证】',
    content: '您的ETC账户异常，需重新认证，请点击链接处理：http://etccert.xxx',
    choices: [
      { text: '点击链接处理认证', isCorrect: false, feedback: '❌ 错误！官方机构不会通过短信链接要求认证', tips: '✅ 正确做法：通过官方ETC渠道处理' },
      { text: '通过官方ETC渠道处理', isCorrect: true, feedback: '✅ 正确！安全第一', tips: '✅ 防骗要点：ETC认证请通过官方APP或官网办理' },
      { text: '回复短信询问详情', isCorrect: false, feedback: '❌ 错误！可能泄露更多信息', tips: '✅ 正确做法：直接通过官方渠道核实' }
    ],
    difficulty: '中等',
    points: 100
  },
  {
    id: 'sms_004',
    type: '短信诈骗',
    title: '冒充学校收费诈骗',
    sender: '【学校财务处】',
    content: '下学期学费调整，请家长扫码支付最新费用：http://pay.school',
    choices: [
      { text: '扫码支付学费', isCorrect: false, feedback: '❌ 错误！学校缴费应该通过官方渠道或学校通知', tips: '✅ 正确做法：联系学校老师或班主任核实' },
      { text: '联系学校老师或班主任核实', isCorrect: true, feedback: '✅ 正确！核实后再缴费更安全', tips: '✅ 防骗要点：学校收费应通过官方渠道' },
      { text: '询问其他家长情况', isCorrect: false, feedback: '❌ 错误！可能已被误导', tips: '✅ 正确做法：直接与学校官方联系确认' }
    ],
    difficulty: '中等',
    points: 100
  },
  {
    id: 'sms_005',
    type: '短信诈骗',
    title: '积分兑换诈骗',
    sender: '【中国移动】',
    content: '您的积分即将过期，点击链接兑换话费：http://10086.points',
    choices: [
      { text: '点击链接兑换积分', isCorrect: false, feedback: '❌ 错误！运营商积分兑换通过官方APP或营业厅办理', tips: '✅ 正确做法：登录官方运营商APP核实积分' },
      { text: '登录官方运营商APP核实积分', isCorrect: true, feedback: '✅ 正确！官方渠道最安全', tips: '✅ 防骗要点：积分兑换应通过官方渠道' },
      { text: '致电10086确认', isCorrect: false, feedback: '❌ 错误！可能拨打诈骗电话', tips: '✅ 正确做法：通过官方APP或营业厅办理' }
    ],
    difficulty: '简单',
    points: 70
  },
  {
    id: 'sms_006',
    type: '短信诈骗',
    title: '快递签收诈骗',
    sender: '【快递服务】',
    content: '您的包裹投递失败，请点击链接更新地址：http://express.xxx',
    choices: [
      { text: '点击链接更新地址', isCorrect: false, feedback: '❌ 错误！快递信息更新应该通过官方快递渠道', tips: '✅ 正确做法：通过官方快递APP查询物流信息' },
      { text: '通过官方快递APP查询物流信息', isCorrect: true, feedback: '✅ 正确！官方渠道最可靠', tips: '✅ 防骗要点：快递信息变更应通过官方渠道' },
      { text: '拨打短信中的电话询问', isCorrect: false, feedback: '❌ 错误！可能是诈骗电话', tips: '✅ 正确做法：主动拨打快递公司官方电话' }
    ],
    difficulty: '中等',
    points: 90
  },
  
  // 网络诈骗场景
  {
    id: 'net_001',
    type: '网络诈骗',
    title: '钓鱼网站诈骗',
    sender: '【银行官网】',
    content: '检测到您的账户存在异常，请登录以下网址验证身份：http://bank-login.xxx',
    choices: [
      { text: '点击链接验证身份', isCorrect: false, feedback: '❌ 错误！仔细检查网站域名，不轻信陌生链接', tips: '✅ 正确做法：通过官方APP或网站登录检查' },
      { text: '通过官方APP或网站登录检查', isCorrect: true, feedback: '✅ 正确！防范意识很好', tips: '✅ 防骗要点：银行不会通过邮件或短信发送登录链接' },
      { text: '复制链接到浏览器打开', isCorrect: false, feedback: '❌ 错误！可能访问钓鱼网站', tips: '✅ 正确做法：手动输入官方网站地址' }
    ],
    difficulty: '困难',
    points: 150
  },
  {
    id: 'net_002',
    type: '网络诈骗',
    title: '虚假投资诈骗',
    sender: '【理财顾问】',
    content: '稳赚不赔高收益项目，年化收益率30%，限额抢购！',
    choices: [
      { text: '立即投资参与', isCorrect: false, feedback: '❌ 错误！高收益必然伴随高风险，天下没有免费午餐', tips: '✅ 正确做法：查询该投资平台资质和口碑' },
      { text: '查询该投资平台资质和口碑', isCorrect: true, feedback: '✅ 正确！理性投资很重要', tips: '✅ 防骗要点：任何承诺稳赚的投资都是诈骗' },
      { text: '询问朋友是否参与', isCorrect: false, feedback: '❌ 错误！可能集体受骗', tips: '✅ 正确做法：独立判断并核实平台资质' }
    ],
    difficulty: '中等',
    points: 120
  },
  {
    id: 'net_003',
    type: '网络诈骗',
    title: '兼职刷单诈骗',
    sender: '【兼职招聘】',
    content: '足不出户日赚千元，只需垫付刷单即可返佣，佣金丰厚！',
    choices: [
      { text: '报名参与刷单', isCorrect: false, feedback: '❌ 错误！刷单是违法行为，任何要求垫付的兼职都是诈骗', tips: '✅ 正确做法：拒绝参与并举报诈骗信息' },
      { text: '拒绝参与并举报诈骗信息', isCorrect: true, feedback: '✅ 正确！守法意识强', tips: '✅ 防骗要点：刷单违法且是诈骗陷阱' },
      { text: '询问具体操作流程', isCorrect: false, feedback: '❌ 错误！可能被进一步诱导', tips: '✅ 正确做法：直接拒绝并举报' }
    ],
    difficulty: '简单',
    points: 80
  },
  {
    id: 'net_004',
    type: '网络诈骗',
    title: '游戏账号交易诈骗',
    sender: '【游戏代练】',
    content: '高价收购王者荣耀账号，价格优厚，先付款后交易！',
    choices: [
      { text: '提供账号密码进行交易', isCorrect: false, feedback: '❌ 错误！游戏账号交易应该通过官方认证平台', tips: '✅ 正确做法：通过游戏官方渠道核实交易信息' },
      { text: '通过游戏官方渠道核实交易信息', isCorrect: true, feedback: '✅ 正确！安全意识好', tips: '✅ 防骗要点：账号交易应通过官方平台' },
      { text: '要求对方先付款', isCorrect: false, feedback: '❌ 错误！可能遭遇付款诈骗', tips: '✅ 正确做法：通过官方渠道进行交易' }
    ],
    difficulty: '中等',
    points: 100
  },
  {
    id: 'net_005',
    type: '网络诈骗',
    title: '虚假客服诈骗',
    sender: '【平台客服】',
    content: '检测到您的账户存在异常登录，请提供身份证和银行卡信息验证身份。',
    choices: [
      { text: '提供身份和银行卡信息', isCorrect: false, feedback: '❌ 错误！客服问题应该通过官方渠道处理', tips: '✅ 正确做法：通过官方APP联系客服核实情况' },
      { text: '通过官方APP联系客服核实情况', isCorrect: true, feedback: '✅ 正确！处理方式专业', tips: '✅ 防骗要点：官方客服不会索要敏感信息' },
      { text: '注销账户避免风险', isCorrect: false, feedback: '❌ 错误！可能正中骗子圈套', tips: '✅ 正确做法：通过官方渠道核实账户状态' }
    ],
    difficulty: '困难',
    points: 130
  },
  {
    id: 'net_006',
    type: '网络诈骗',
    title: '虚假慈善捐款诈骗',
    sender: '【慈善基金会】',
    content: '山区儿童失学急需帮助，扫描二维码献爱心，每份捐赠都有证书！',
    choices: [
      { text: '扫描二维码捐款', isCorrect: false, feedback: '❌ 错误！慈善捐款应该通过正规公益机构进行', tips: '✅ 正确做法：通过正规公益机构查询并捐款' },
      { text: '通过正规公益机构查询并捐款', isCorrect: true, feedback: '✅ 正确！爱心也要理性表达', tips: '✅ 防骗要点：捐款应通过正规公益机构' },
      { text: '转发朋友圈呼吁捐款', isCorrect: false, feedback: '❌ 错误！可能传播诈骗信息', tips: '✅ 正确做法：先核实慈善机构资质' }
    ],
    difficulty: '中等',
    points: 90
  },
  {
    id: 'net_007',
    type: '网络诈骗',
    title: '冒充公检法网站诈骗',
    sender: '【人民法院】',
    content: '您涉嫌洗钱犯罪，已发出通缉令，请点击链接查看并配合调查：http://court.xxx',
    choices: [
      { text: '点击链接查看详情', isCorrect: false, feedback: '❌ 错误！法院传票不会通过网站链接发送', tips: '✅ 正确做法：拨打12368司法服务热线核实' },
      { text: '拨打12368司法服务热线核实', isCorrect: true, feedback: '✅ 正确！冷静应对很关键', tips: '✅ 防骗要点：公检法不会通过网络发送通缉令' },
      { text: '立即自首配合调查', isCorrect: false, feedback: '❌ 错误！可能正中骗子圈套', tips: '✅ 正确做法：通过官方渠道核实信息' }
    ],
    difficulty: '困难',
    points: 150
  },
  
  // 社交诈骗场景
  {
    id: 'social_001',
    type: '社交诈骗',
    title: '冒充熟人诈骗',
    sender: '【老同学李明】',
    content: '刚出车祸急需手术费，先借5千救命，明日归还，收款码：xxx',
    choices: [
      { text: '立即转账救人', isCorrect: false, feedback: '❌ 错误！遇到网上借款请求务必通过多种渠道确认', tips: '✅ 正确做法：通过电话或其他方式核实身份' },
      { text: '通过电话或其他方式核实身份', isCorrect: true, feedback: '✅ 正确！防范意识强', tips: '✅ 防骗要点：熟人借钱要多重验证' },
      { text: '询问具体事故地点', isCorrect: false, feedback: '❌ 错误！可能被套取更多信息', tips: '✅ 正确做法：主动联系本人确认' }
    ],
    difficulty: '中等',
    points: 100
  },
  {
    id: 'social_002',
    type: '社交诈骗',
    title: '情感诈骗',
    sender: '【美女小雨】',
    content: '认识你很开心，我们已经是很好的朋友了，我想介绍你一个赚钱机会...',
    choices: [
      { text: '询问赚钱机会详情', isCorrect: false, feedback: '❌ 错误！网络身份信息都可能造假，不要涉及金钱交易', tips: '✅ 正确做法：要求对方提供身份证明' },
      { text: '要求对方提供身份证明', isCorrect: true, feedback: '✅ 正确！保持警觉很重要', tips: '✅ 防骗要点：网络交友要保持警惕' },
      { text: '婉拒但继续交流', isCorrect: false, feedback: '❌ 错误！可能持续被诱导', tips: '✅ 正确做法：减少接触可疑人员' }
    ],
    difficulty: '困难',
    points: 150
  },
  {
    id: 'social_003',
    type: '社交诈骗',
    title: '虚假求助诈骗',
    sender: '【大学生小王】',
    content: '我是山区支教的学生，家境贫寒，希望好心人资助学费，支付宝：xxx',
    choices: [
      { text: '直接转账资助', isCorrect: false, feedback: '❌ 错误！捐款应通过正规公益机构，不要直接给个人转账', tips: '✅ 正确做法：通过正规公益渠道捐款' },
      { text: '通过正规公益渠道捐款', isCorrect: true, feedback: '✅ 正确！理性献爱心', tips: '✅ 防骗要点：慈善捐助要通过正规渠道' },
      { text: '询问学校证实情况', isCorrect: false, feedback: '❌ 错误！可能被虚假信息误导', tips: '✅ 正确做法：通过官方公益机构核实' }
    ],
    difficulty: '中等',
    points: 90
  },
  {
    id: 'social_004',
    type: '社交诈骗',
    title: '情感诈骗（杀猪盘）',
    sender: '【投资导师】',
    content: '我这里有内部消息，跟着我投资稳赚不赔，先小额试试看？',
    choices: [
      { text: '小额投资试试', isCorrect: false, feedback: '❌ 错误！任何通过感情诱导的投资都是诈骗', tips: '✅ 正确做法：拒绝投资并保持警惕' },
      { text: '拒绝投资并保持警惕', isCorrect: true, feedback: '✅ 正确！防范意识强', tips: '✅ 防骗要点：网络投资需谨慎' },
      { text: '询问更多投资细节', isCorrect: false, feedback: '❌ 错误！可能被深度套牢', tips: '✅ 正确做法：远离可疑投资推荐' }
    ],
    difficulty: '困难',
    points: 150
  },
  {
    id: 'social_005',
    type: '社交诈骗',
    title: '冒充海外代购诈骗',
    sender: '【海外代购小美】',
    content: 'LV最新款包包，专柜代购，限时特价只要2000元，原价20000！',
    choices: [
      { text: '立即下单付款', isCorrect: false, feedback: '❌ 错误！代购商品应该要求提供正规购买凭证', tips: '✅ 正确做法：要求对方提供正规购买凭证' },
      { text: '要求对方提供正规购买凭证', isCorrect: true, feedback: '✅ 正确！理性消费很重要', tips: '✅ 防骗要点：明显低于市场价的商品要警惕' },
      { text: '询问能否货到付款', isCorrect: false, feedback: '❌ 错误！可能遭遇付款诈骗', tips: '✅ 正确做法：通过正规渠道购买奢侈品' }
    ],
    difficulty: '中等',
    points: 100
  },
  {
    id: 'social_006',
    type: '社交诈骗',
    title: '虚假招聘诈骗',
    sender: '【人事经理】',
    content: '月薪2万起，无需经验，入职即缴社保，需缴纳培训费500元。',
    choices: [
      { text: '缴纳培训费应聘', isCorrect: false, feedback: '❌ 错误！任何要求入职前缴纳费用的招聘都是诈骗', tips: '✅ 正确做法：核实公司资质和招聘信息' },
      { text: '核实公司资质和招聘信息', isCorrect: true, feedback: '✅ 正确！求职要谨慎', tips: '✅ 防骗要点：正规公司不会收取培训费' },
      { text: '询问是否可以免培训费', isCorrect: false, feedback: '❌ 错误！可能被进一步诱导', tips: '✅ 正确做法：通过官方渠道查询招聘信息' }
    ],
    difficulty: '中等',
    points: 90
  },
  // 新增诈骗场景
  {
    id: 'social_004',
    type: '社交诈骗',
    title: '游戏代练诈骗',
    sender: '【游戏代练】',
    content: '专业代练，王者荣耀上星耀只需200元，先付款后上分，保证安全。',
    choices: [
      { text: '立即付款购买代练', isCorrect: false, feedback: '❌ 错误！代练交易存在盗号风险', tips: '✅ 正确做法：避免购买游戏代练服务' },
      { text: '拒绝代练服务', isCorrect: true, feedback: '✅ 正确！代练可能盗取账号', tips: '✅ 防骗要点：不要相信游戏代练广告' },
      { text: '要求先上分后付款', isCorrect: false, feedback: '❌ 错误！可能被要求提供账号密码', tips: '✅ 正确做法：保护游戏账号安全' }
    ],
    difficulty: '简单',
    points: 70
  },
  {
    id: 'online_006',
    type: '网络诈骗',
    title: 'AI换脸诈骗',
    sender: '【好友视频】',
    content: '（视频中是好友模样）急需用钱，请转5000元到此账户，明天就还。',
    choices: [
      { text: '立即转账给好友', isCorrect: false, feedback: '❌ 错误！视频可能是AI换脸合成', tips: '✅ 正确做法：通过其他方式核实好友身份' },
      { text: '拨打好友电话核实', isCorrect: true, feedback: '✅ 正确！AI换脸需要仔细核实', tips: '✅ 防骗要点：视频通话也可能造假' },
      { text: '询问视频中的暗号', isCorrect: false, feedback: '❌ 错误！可能被提前套话', tips: '✅ 正确做法：主动联系对方确认' }
    ],
    difficulty: '困难',
    points: 150
  },
  {
    id: 'sms_005',
    type: '短信诈骗',
    title: 'ETC认证过期',
    sender: '【高速ETC】',
    content: '您的ETC账户已过期，点击链接重新认证：http://etc-fake.com，否则将影响高速通行。',
    choices: [
      { text: '立即点击链接认证', isCorrect: false, feedback: '❌ 错误！这是钓鱼网站', tips: '✅ 正确做法：通过官方APP或客服核实' },
      { text: '登录官方APP查询状态', isCorrect: true, feedback: '✅ 正确！官方渠道最可靠', tips: '✅ 防骗要点：ETC不会通过短信链接要求认证' },
      { text: '拨打短信中的电话咨询', isCorrect: false, feedback: '❌ 错误！可能是诈骗电话', tips: '✅ 正确做法：拨打ETC官方客服电话' }
    ],
    difficulty: '中等',
    points: 100
  },
  {
    id: 'online_007',
    type: '网络诈骗',
    title: '虚拟货币投资',
    sender: '【投资顾问】',
    content: '最新加密货币项目，预期收益300%，内测阶段，只限前100名投资者。',
    choices: [
      { text: '立即投资参与', isCorrect: false, feedback: '❌ 错误！高收益承诺通常是诈骗', tips: '✅ 正确做法：警惕任何保证高收益的投资' },
      { text: '拒绝参与并举报', isCorrect: true, feedback: '✅ 正确！虚拟货币投资风险极高', tips: '✅ 防骗要点：不要相信所谓内测投资机会' },
      { text: '小额投资试试', isCorrect: false, feedback: '❌ 错误！可能被诱导加大投入', tips: '✅ 正确做法：远离非法集资活动' }
    ],
    difficulty: '困难',
    points: 140
  },
  {
    id: 'phone_006',
    type: '电话诈骗',
    title: '疫苗接种预约',
    sender: '【疾控中心】',
    content: '您有新冠疫苗加强针预约资格，请提供身份证号和银行卡信息用于登记。',
    choices: [
      { text: '立即提供个人信息', isCorrect: false, feedback: '❌ 错误！疾控中心不会索要银行卡信息', tips: '✅ 正确做法：通过官方渠道预约疫苗' },
      { text: '拒绝并查询官方预约方式', isCorrect: true, feedback: '✅ 正确！保护个人信息安全', tips: '✅ 防骗要点：疫苗接种不会要求银行信息' },
      { text: '询问对方工作单位', isCorrect: false, feedback: '❌ 错误！可能被虚假信息欺骗', tips: '✅ 正确做法：拨打疾控中心官方电话' }
    ],
    difficulty: '中等',
    points: 110
  },
  {
    id: 'social_005',
    type: '社交诈骗',
    title: '明星粉丝团诈骗',
    sender: '【粉丝后援会】',
    content: '加入明星官方粉丝团需缴纳会费299元，可获得独家周边和见面会机会。',
    choices: [
      { text: '立即缴费加入', isCorrect: false, feedback: '❌ 错误！可能是假冒粉丝团', tips: '✅ 正确做法：通过明星官方渠道核实' },
      { text: '核实粉丝团真实性', isCorrect: true, feedback: '✅ 正确！谨慎对待粉丝团收费', tips: '✅ 防骗要点：不要轻信网络粉丝团信息' },
      { text: '先加入看看再说', isCorrect: false, feedback: '❌ 错误！可能被进一步骗取费用', tips: '✅ 正确做法：通过官方渠道确认活动真实性' }
    ],
    difficulty: '简单',
    points: 80
  },
  {
    id: 'online_008',
    type: '网络诈骗',
    title: '直播带货骗局',
    sender: '【网红主播】',
    content: '限时秒杀！原价5000元的名牌包包现在只要500元，点击链接立即抢购！',
    choices: [
      { text: '立即抢购', isCorrect: false, feedback: '❌ 错误！价格过低可能是假货或诈骗', tips: '✅ 正确做法：通过官方渠道购买商品' },
      { text: '怀疑是假货不购买', isCorrect: true, feedback: '✅ 正确！警惕过低价格', tips: '✅ 防骗要点：天上不会掉馅饼' },
      { text: '询问主播商品来源', isCorrect: false, feedback: '❌ 错误！可能被虚假信息欺骗', tips: '✅ 正确做法：通过正规渠道购买名牌商品' }
    ],
    difficulty: '中等',
    points: 90
  },
  {
    id: 'phone_007',
    type: '电话诈骗',
    title: '社保卡升级',
    sender: '【社保局】',
    content: '您的社保卡需要升级为第三代，请提供卡号和密码以便系统升级。',
    choices: [
      { text: '立即提供卡号密码', isCorrect: false, feedback: '❌ 错误！社保局不会索要密码', tips: '✅ 正确做法：到社保局现场办理' },
      { text: '到社保局现场咨询', isCorrect: true, feedback: '✅ 正确！官方渠道最安全', tips: '✅ 防骗要点：不要向任何人透露密码' },
      { text: '询问升级的具体时间', isCorrect: false, feedback: '❌ 错误！可能被进一步诱导', tips: '✅ 正确做法：主动到社保局核实' }
    ],
    difficulty: '中等',
    points: 100
  },
  {
    id: 'online_009',
    type: '网络诈骗',
    title: '知识付费陷阱',
    sender: '【课程导师】',
    content: '月入十万的短视频运营课，原价9999，今日特价999元，名额有限！',
    choices: [
      { text: '立即购买课程', isCorrect: false, feedback: '❌ 错误！夸大收益的课程要警惕', tips: '✅ 正确做法：选择正规教育平台' },
      { text: '查询导师和课程评价', isCorrect: true, feedback: '✅ 正确！理性对待知识付费', tips: '✅ 防骗要点：不要相信一夜暴富的承诺' },
      { text: '先试听再决定', isCorrect: false, feedback: '❌ 错误！可能被虚假内容欺骗', tips: '✅ 正确做法：通过知名学习平台购买课程' }
    ],
    difficulty: '中等',
    points: 85
  },
  {
    id: 'sms_006',
    type: '短信诈骗',
    title: '积分兑换诈骗',
    sender: '【中国移动】',
    content: '您的话费积分可兑换500元现金，请点击链接领取：http://fake-mobile.com',
    choices: [
      { text: '立即点击链接兑换', isCorrect: false, feedback: '❌ 错误！话费积分不能直接兑换现金', tips: '✅ 正确做法：通过运营商官方APP兑换' },
      { text: '登录官方APP查询积分', isCorrect: true, feedback: '✅ 正确！官方渠道最可靠', tips: '✅ 防骗要点：警惕积分兑换现金的诈骗' },
      { text: '拨打短信电话确认', isCorrect: false, feedback: '❌ 错误！可能是诈骗电话', tips: '✅ 正确做法：拨打运营商官方客服' }
    ],
    difficulty: '简单',
    points: 75
  },
  {
    id: 'social_006',
    type: '社交诈骗',
    title: '慈善捐款诈骗',
    sender: '【爱心基金会】',
    content: '贫困儿童急需手术费，请捐款到这个账户，每一分钱都会帮助到孩子。',
    choices: [
      { text: '立即捐款帮助', isCorrect: false, feedback: '❌ 错误！可能是假冒慈善机构', tips: '✅ 正确做法：通过正规慈善机构捐款' },
      { text: '核实慈善机构资质', isCorrect: true, feedback: '✅ 正确！善心也要理性', tips: '✅ 防骗要点：通过官方渠道核实慈善活动' },
      { text: '先小额捐款试试', isCorrect: false, feedback: '❌ 错误！可能被进一步诱导', tips: '✅ 正确做法：选择有资质的慈善组织' }
    ],
    difficulty: '中等',
    points: 95
  },
  {
    id: 'online_010',
    type: '网络诈骗',
    title: '云存储勒索',
    sender: '【云盘安全中心】',
    content: '您的云盘文件被加密，支付赎金300元方可恢复，否则文件将被永久删除。',
    choices: [
      { text: '立即支付赎金', isCorrect: false, feedback: '❌ 错误！支付赎金不能保证文件恢复', tips: '✅ 正确做法：联系平台客服处理' },
      { text: '联系平台客服求助', isCorrect: true, feedback: '✅ 正确！通过官方渠道解决问题', tips: '✅ 防骗要点：不要屈服于勒索软件' },
      { text: '尝试其他方式解密', isCorrect: false, feedback: '❌ 错误：可能下载更多恶意软件', tips: '✅ 正确做法：备份重要文件，报警处理' }
    ],
    difficulty: '困难',
    points: 130
  },
  {
    id: 'phone_008',
    type: '电话诈骗',
    title: '房屋拆迁补偿',
    sender: '【拆迁办】',
    content: '您的房子在拆迁范围内，先交2万元公证费可获得50万元补偿款。',
    choices: [
      { text: '立即缴纳公证费', isCorrect: false, feedback: '❌ 错误！拆迁不会提前收费', tips: '✅ 正确做法：到政府部门核实' },
      { text: '到政府部门核实拆迁信息', isCorrect: true, feedback: '✅ 正确！官方信息最可靠', tips: '✅ 防骗要点：拆迁补偿不会要求前期缴费' },
      { text: '询问拆迁具体时间', isCorrect: false, feedback: '❌ 错误！可能被虚假信息欺骗', tips: '✅ 正确做法：通过官方渠道查询拆迁规划' }
    ],
    difficulty: '中等',
    points: 105
  },
  {
    id: 'online_011',
    type: '网络诈骗',
    title: 'AI客服诈骗',
    sender: '【智能客服】',
    content: '检测到您的账户异常，请提供验证码以便AI系统自动验证身份。',
    choices: [
      { text: '立即提供验证码', isCorrect: false, feedback: '❌ 错误！即使是AI客服也不能索要验证码', tips: '✅ 正确做法：通过官方APP核实账户状态' },
      { text: '挂断并通过官方渠道核实', isCorrect: true, feedback: '✅ 正确！保护验证码安全', tips: '✅ 防骗要点：验证码绝不能告诉任何人' },
      { text: '询问AI客服的具体信息', isCorrect: false, feedback: '❌ 错误！可能被套取更多信息', tips: '✅ 正确做法：主动联系官方客服' }
    ],
    difficulty: '困难',
    points: 120
  },
  {
    id: 'sms_007',
    type: '短信诈骗',
    title: '航班取消赔偿',
    sender: '【航空公司】',
    content: '您购买的航班因故取消，可获得300元赔偿，请点击链接办理退款。',
    choices: [
      { text: '立即点击链接退款', isCorrect: false, feedback: '❌ 错误！这是钓鱼链接', tips: '✅ 正确做法：通过航空公司官方渠道核实' },
      { text: '登录航空公司APP查询', isCorrect: true, feedback: '✅ 正确！官方渠道最可靠', tips: '✅ 防骗要点：航班信息要通过官方渠道确认' },
      { text: '拨打短信电话咨询', isCorrect: false, feedback: '❌ 错误！可能是诈骗电话', tips: '✅ 正确做法：拨打航空公司官方客服' }
    ],
    difficulty: '中等',
    points: 95
  }
];

// 导出场景数据
window.scenarios = scenarios;