const express = require('express');
const router = express.Router();
const Mock = require('mockjs');
const Random = Mock.Random;

// global value for the total counts of items in list table
let total = 28

/* GET buryVisualization listing. */
router.get('/', function(req, res, next) {
    const data =Mock.mock({
        'list|20':[{
            'id|+1':1,
            'serial_number|1-100':1,
            'warn_number|1-100':1,
            'warn_name|1':['报警类型1','报警类型2','报警类型3'],
            'warn_level|1':['紧急','重要'],
            'warn_detail':'环境IP:10.114.123.12,服务名称:XX',
            'create_time':Random.datetime(),
            'finish_time':Random.datetime(),
            'contact|4':'abc'
        }]
    });

    res.send({
        code: 0,
        message: 'success',
        data: data.list
    })});

router.get('/getPointData', function(req, res, next) {
    console.log(req.query)
    const {appType, pointCode, createUser, platform} = req.query
    if(!appType || !pointCode || !createUser || !platform) {
        res.send({
            message: 'You should supply appType, pointCode, createUser and platform',
            code: 1
        })

        return
    }

    const data =Mock.mock({
        'pointId|100-100000': 1,
        'parentId|100-100000': 1,
        'pointCode':  'Event_' + Random.string(16),
        'pointType|1-2': 1,
        platform,
        'platformName|1': ['android','ios','h5-ios', 'h5-android', 'h5'],
        'parentPageName': 'Page_' + Random.string(16),
        "pointName":"首页_原生_click",
        "function":"理赔申请",
        "module": "保险",
        "productManager": "古玥",
        'tagId|1000-2000': 1,
        createUser,
        'eventType': 5,
        'date': ['05/25', '05/26', '05/27', '05/28', '05/29', '05/30', '05/31'],
        'PV': [Random.integer(200, 500), Random.integer(200, 500), Random.integer(200, 500), Random.integer(200, 500), Random.integer(200, 500), Random.integer(200, 500), Random.integer(200, 500)],
    });

    res.send({
        message: 'success',
        code: 0,
        data
    })
});

router.post('/pageList', function(req, res, next) {
    console.log(req.params, req.url, req.body)
    const {pageNo, pageSize, appType, key, creator, platform} = req.body
    if(!pageNo || !pageSize || !appType) {
        res.send({
            message: 'You should supply pageNo, pageSize, appType',
            code: 1
        })

        return
    }

    const generateResultsArray = (size) => {
        let results = []
        for(let i=0; i<size; i++) {
            const e = Mock.mock({
                'pointId|100-1000': 1,
                'parentId|10000-99999': 1,
                'pointCode': Random.string(16),
                'pointType|1-2': 1,
                'platform|1-5': 1,
                'platformName|1': ['android','ios','h5-ios', 'h5-android', 'h5'],
                "parentName|1": ['保险页','首页-泰生活','首页-商城'],
                "pointName|1": ['保险页-提交','首页-保存','首页-商城-添加购物车'],
                "function":"理赔申请",
                "module": "保险",
                "productManager|1": ["古玥", "小健"],
                "tagId|0-4": 1,
                "createUser|1": ['admin','PL','Gao Xuewen', 'Leon', 'Kevin', 'Ivy', 'Rex', 'Forrest', 'Tom'],
                'insertTime':Random.datetime(),
                'updateTime':Random.datetime(),
                'version|1':['1.1.3','1.4.5','1.0.0'],
                'reportFirstVersion|1':['2.1.3','2.4.5','1.0.0'],
                'firstReportTime':Random.datetime(),
                'lastReportTime':Random.datetime(),
                'eventType': 5
            })

            results.push(e)
        }

        return results
    }
    const flag = (total - (pageNo - 1) * pageSize) > pageSize
    const data =Mock.mock({
        'pageNum': pageNo,
        'pageSize': pageSize,
        'total': total,
        'pages': 1,
        'results': flag ? generateResultsArray(pageSize) : generateResultsArray(total - (pageNo - 1) * pageSize)
    });

    res.send({
        message: 'success',
        code: 0,
        data: data
    })
});

router.get('/queryTerm/:appType', function(req, res, next) {
    console.log(req.params, req.url, req.body, req.query)
    const appType = req.params.appType
    if(!appType) {
        res.send({
            message: 'You should supply path parameter appType',
            code: 1
        })

        return
    }

    const data =Mock.mock({
        'platforms': [
            {
                'id': '1,3',
                'name': 'Android'
            },
            {
                'id': '2,4',
                'name': 'IOS'
            },
            {
                'id': '5',
                'name': 'WEB'
            }
        ],
        'creators|3-5':[{
            'id|100-1000': 1,
            'name|1': [Random.name(), Random.name(),Random.name(),Random.name(),Random.name(),Random.name(),Random.name()],
        }]
    });

    res.send({
        message: 'success',
        code: 0,
        data: data
    })
});

router.post('/save', function(req, res, next) {
    console.log(req.params, req.url, req.body)
    const {pointCode, pointName, pointType, platform} = req.body
    console.log('....', pointCode, pointName, pointType, platform)

    if(!pointCode || !pointName || !pointType || !platform) {
        res.send({
            message: 'You should supply pointCode, pointName, pointType, platform',
            code: 1
        })

        return
    }

    total++

    res.send({
        message: 'success',
        code: 0
    })
});

router.post('/delete', function(req, res, next) {
    console.log(req.params, req.url, req.body)
    const {pointId} = req.body
    console.log('..... pointId', pointId)

    if(!pointId) {
        res.send({
            message: 'parameter error',
            code: 1
        })

        return
    }

    total--

    res.send({
        message: 'success',
        code: 0
    })
});

module.exports = router;
