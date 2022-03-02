'use strict';
export default {
  config: {
    //全文检索
    fullTextSearch:{
      mes: {
        success: '索引生成成功',
        clearSuccess:'清除内容缓存成功',
        tip:'提示',
        ok:'确定',
      },
      label: {
        corsUrl:'跨域请求URL',
        relativePath:'使用相对路径',
        protocol:"访问协议",
        dynamicSuffix:"动态页后缀",
        staticSuffix:"静态页后缀",
        staticDir:"静态页目录",
        staticMobileDir:"手机静态页目录",
        mobileStaticSync:"手机静态页同步生成",
        resouceSync:"资源自动同步FTP",
        pageSync:"静态页自动同步FTP",
        syncPageFtpId:"静态页同步FTP",
        staticIndex:"开启静态首页",
        tplIndex:"首页模板",
        localeAdmin:"后台本地化",
        localeFront:"前台本地化",
        uploadFtpId:"附件FTP",
        resycleOn:"开启回收站",
        afterCheck:"审核后",
        master:"是否主站",
        unDelete:'不能修改删除',
        reversion:'修改后退回',
        modifiedUnchanged:'修改后不变',
        PageTip:'建议使用.jhtml为后缀，以避免冲突',
        no:'--无--',
        ossId:'云储存',
        indexToRoot:'使用根首页',
        name:'名称',
        ip:'服务器IP',
        path:'远程目录',
        url:'访问URL',
        id:'ID',
        port:'FTP端口号',
        timeout:'传输超时时间',
        username:'FTP用户名',
        password:'FTP密码',
        encoding:'编码',
        portTip:'默认端口21',
        timeoutTip:'单位：秒，0为服务器默认',
        pathTip:'留空为根目录',
        urlTip:'访问该FTP的url地址',
        imgWidth:'图片宽度',
        imgHeight:'图片高度',
        hasImage:'是否有图片',
        disabled:'禁用',
        true:'是',
        false:'否',
        modelName:'模板名字',
        tplChannelPrefix:'栏目模板前缀',
        tplContentPrefix:'内容模板前缀',
        priority:'排列顺序',
        def:'默认',
        enable:'启用',
        idTip:'内容类型ID重复',
        modelIdTip:'ID已经存在',
        modelId:'模板ID',
        modelGlobal:'全站模型',
        channelModelOperate :'栏目模型操作',
        contentModelOperate:'内容模型操作',
        modelPath:'模型路径:',
        titleImg:'栏目标题图',
        contentImg:'栏目内容图',
        width:'宽',
        heigth:'高',
        hasContent:'是否有内容',
        contextPath:'部署路径',
        contextPathTip:'部署在根目录请留空',
        portNumTip:'默认留空',
        defImgTip:'图片不存在时显示',
        defImg:'默认图片',
        emailValidate:'开启邮箱验证',
        uploadToDb:'数据库附件',
        dbFileUri:'附件地址',
        dbFileUriTip:'一般无需改动',
        viewOnlyChecked:'只终审浏览内容页',
        insideSite:'内网',
        insideSiteTip:'内网通过站点路径区分站点',
        officeHome:'openoffice安装目录',
        officePort:'openoffice端口',
        errorTimes:'登录错误次数',
        errorTimesTip:'达到错误次数后显示验证码',
        errorInterval:'登录错误时间',
        errorIntervalTip:'(分钟)。超过时间重计次数',
        host:'邮件服务器',
        emailPort:'邮件端口',
        emailPortTip:'留空则为默认端口',
        emailUsername:'邮件用户名',
        emailPassword:'邮件密码',
        emailEncoding:'邮件编码',
        personal:'发件人',
        forgotPasswordSubject:'找回密码标题',
        forgotPasswordText:'找回密码内容',
        forgotPasswordTextTip:'用户ID：${uid}，用户名：${username}，重置KEY：${resetKey}，重置密码：${resetPwd}',
        registerSubject:'会员注册标题',
        registerText:'会员注册内容',
        registerTextTip:'用户名：${username}，激活码：${activationCode}',
        usernameMinLen:'用户名最小长度',
        usernameReserved:'用户名保留字',
        usernameReservedTip:'可以使用 * 作为通配符，如: *admin*',
        passwordMinLen:'密码最小长度',
        memberOn:'开启会员功能',
        userImgWidth:'用户头像宽度',
        registerOn:'开启会员注册',
        checkOn:'注册审核',
        userImgHeight:'用户头像高度',
        field:'字段',
        dataType:'数据类型',
        label:'名称',
        stringText:'字符串文本',
        intText:'整型文本',
        doubleText:'浮点型文本',
        areaText:'文本区',
        date:'日期',
        spinner:'下拉列表',
        checkBox:'复选框',
        radio:'单选框',
        help:'帮助信息',
        helpPosition:'帮助位置',
        helpPositionTip:'上1，右2，下3，左4',
        defValue:'默认值',
        optValue:'可选项',
        optValueTip:'多个值用","分开',
        rows:'行数',
        cols:'列数',
        required:'必填项',
        iamgeController:'图片尺寸控制',
        iamgeControllerTip:'小于该尺寸的图片不添加水印',
        onMark:"开启水印",
        markImage:'水印图片',
        markImageTip:'留空则使用文字水印',
        markText:'水印文字',
        markTextTip:'使用中文有可能出现乱码',
        position:'位置',
        markTextConfig:'水印文字属性',
        offsetX:'水平偏移量',
        offsetY:'垂直偏移量',
        textSize:'字体大小',
        color:'颜色',
        alpha:'文字透明度',
        alphaTip:'0-100，越小越透明',
        random:"随机",
        lowerLeft:'左下',
        lowerRight:'右下',
        upperLeft:'左上',
        upperRight:'右上',
        center:'中央',
        firewallLoginPassword:'防火墙登录密码',
        firewallPassword:'防火墙密码',
        updateNull:'不修改请留空',
        isOpen:'是否开启',
        open:'打开',
        close:'关闭',
        AccessDomain:'访问域名',
        ips:'指定来访ip',
        allowHours:'允许登录后台的时间',
        allowWeek:'允许登录后台的星期',
        spot:'点',
        monday:'星期一',
        tuesday:'星期二',
        wednesday:'星期三',
        thursday:'星期四',
        friday:'星期五',
        thursday:'星期六',
        sunday:'星期天',
        dayNew:'天数',
        dayNewTip:'定义多少天内为new(1代表今日)',
        pictureNew:'new标记图片',
        preview:'预览部分内容',
        flowSwitch:'流量统计开关',
        codeImgWidth:'二维码宽度',
        codeImgHeight:'二维码高度',
        weixinAppId:'微信小程序ID',
        weixinAppSecret:'微信小程序密钥',
        weixinLoginId:'微信开放平台ID',
        weixinLoginSecret:'微信开放平台密钥',
        contentFreshMinute:'内容查询缓存时间',
        contentFreshMinuteTip:'单位:分钟[0表示不缓存]',
        TenToTwyPeople:'10-20人',
        TwyToFiFTyPeople:'20-50人',
        FiFTyToHPeople:'50-100人',
        HpeopleUp:'100人以上',
        companyName:'公司名称',
        scale:'公司规模',
        companyAddress:'公司地址',
        contact:'公司联系方式',
        industry:'公司行业',
        nature:'公司性质',
        companyDescription:'公司简介',
        fixed:'固定',
        weixinPublicAppId:'微信公众号APPID',
        weixinSecret:'微信公众号Secret',
        weixinAccount:'微信支付商户号',
        weixinPassword:'微信支付商户密钥',
        transferApiPassword:'微信企业转账API密钥',
        payTransferPassword:'转账登陆密码',
        rewardPattern:'打赏默认配置',
        rewardMin:'打赏随机最小数',
        rewardMax :'打赏随机最大数',
        alipayPartnerId :'合作者ID',
        alipayAccount :'支付宝签约账户:',
        sCode:'支付宝安全校验码',
        alipayAppId:'支付宝应用ID',
        alipayPublicKey:'支付宝公钥',
        alipayPrivateKey:'支付宝私钥',
        alipayPrivateKeyTip:'工具生成的支付宝私钥复制需要注意把行串起，去除行之间空字符，不修改请留空',
        chargeRatio :'平台抽成比例',
        chargeRatioTip :'0.1表示10个点 平台抽取用户支付10%',
        minDrawAmount :'提现最小额度',
        domain:'域名',
        accessPath:'站点访问路径',
        siteName:'站点名称',
        domainNoTip:'域名不可用',
        accessPathCheckTip:'访问路径不可用',
        siteTip:'主站点已经存在！',
        domainTip:'用","分开',
        appId:'APP ID',
        appKey:'APP KEY',
        qqEnable:'QQ登录',
        sinaEnable:'新浪微博登录',
        qqWeboEnable:'腾讯微博登录',
        ssoEnable:'是否开启单点登录',
        attrs:'认证地址',
        apiAddress:'接口地址',
        targetNamespace:'空间',
        successResult:'正确返回值',
        apiType:'接口类型',
        apiOperate:'接口方法',
        paramsList:'参数列表',
        paramsListTip:'参数名称 默认值',
        addUser:'添加用户',
        updateUser:'修改用户',
        deleteUser:'删除用户',
        userName:"用户名",
        system:'系统',
        opt:'操作',
        time:'时间',
        interface:'接口',
        callId:'调用ID',
        callTime:'调用时间',
        url:'地址',
        apiCode:"接口代码",
        callTotalCount:'调用总次数',
        callMonthCount:'月调用次数',
        callWeekCount:'周调用次数',
        callDayCount:'日调用次数',
        apiPwd:'独立密码',
        limitSingleDevice:'是否限制单设备同时登陆',
        isAdmin:'是否默认管理后台API账户',
        apiPwdTip:'密码错误',
        guestneedNeedLogin:'留言是否登录',
        commentOpen:'评论是否开启',
        guestbookOpen:'留言是否开启',
        guestbookDayLimit:'用户发表留言日最高限制数',
        commentDayLimit:'用户发表评论日最高 限制数',

      },
      btn: {
        modelChannel:'栏目模型',
        modelContent:'内容模型',
        preview:'预览',
        clearSession:'清除内容查询缓存',
        set:'基本设置',
        generate:'生成',
      },
      rules:{

      },
      submenu: {
        ftp:'FTP 管理',
        list:'列表',
        add:'添加',
        edit:'修改',
        type:'内容类型',
        model:'模型管理',
        config:'全局设置',
        systemUpdate:'系统设置',
        systemSet:'系统设置',
        loginSet:'登录设置',
        memberSet:'会员设置',
        registerModel:"会员注册模型",
        markSet:'水印设置',
        fireWallSet:'防火墙设置',
        attrSet:'其他配置',
        companySet:"机构信息设置",
        contentSet:'内容佣金配置',
        site:'站点管理',
        apiManage:'接口管理',
        apiUpdate:'接口设置',
        apiSSOupdate:'单点登录认证',
        ftpList:'ftp管理列表',
        ftpAdd:'ftp管理添加',
        ftpEdit:'ftp管理修改',
        typeList:'内容类型列表',
        typeAdd:'内容类型添加',
        typeEdit:'内容类型编辑',
        modelList:'模型管理列表',
        modelAdd:'模型管理添加',
        modelEdit:'模型管理修改',
        registerModelList:'会员注册列表',
        registerModelAdd:'会员注册添加',
        registerModelEdit:'会员注册修改',
        siteList:'站点管理列表',
        siteAdd:'站点管理添加',
        siteEdit:'站点管理修改',
        apiMan:'接口管理',
        apiManList:'接口管理列表',
        apiManAdd:'接口管理添加',
        apiManEdit:'接口管理修改',
        apiUserMan:'接口用户管理',
        apiUserManList:'接口用户管理列表',
        apiUserManAdd:'接口用户管理添加',
        apiUserManEdit:'接口用户管理修改',
        apiUseRecord:'接口调用记录',
        apiUseRecordList:'接口调用记录列表',
        apiRecord:'API接口记录',
        apiRecordList:'API接口记录列表',
        apiInfo:'API接口管理',
        apiInfoAdd:'API接口管理添加',
        apiInfoEdit:'API接口管理编辑',
        apiInfoList:'API接口管理列表',
        apiAccount:'API接口账户管理',
        apiAccountList:'API接口账户管理列表',
        apiAccountAdd:'API接口账户管理添加',


      }
    },
    //内容复用
    contentReuse:{
      mes: {

      },
      label: {

      },
      btn: {

      },
      rules:{

      },
      submenu: {

      }
    },
    menu:'运营',
  },



};
