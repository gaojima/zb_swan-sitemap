import { toDate } from '../utils/tool.js';
// 引入转换时间格式
Page({
    data: {
        listData: [],
        totalPage: 1,
        currentPage: 1,
        path: 'swan-sitemap/index'
    },

    onLoad(e) {
        // 初始页面打开时，需要读取页面的 currentPage 参数（即翻页页码），并根据参数值请求数据
        let {currentPage} = e;
        // 起始页码为 1，如读取到的值为空，默认赋值起始页码
        currentPage = +currentPage || 1;
        // 根据当前页码获取该页数据资源
        this.requestData(currentPage);
    },


    requestData(currentPage) {
        // 发起数据资源请求。
        swan.request({
            // 数据接口，需改为开发者实际的请求接口
            url: 'https://域名/zb_system/api.php?mod=post&act=list',
            header: {
                'content-type': 'application/json'
            },
            data: {
                // 参数中需携带页码参数，此为示例，可根据实际情况传入其他所需参数
                page: currentPage
            },

            success: res => {

                if (res.statusCode === 200) {
                    let resData = res.data;
                    console.log("resData",resData);
                    // 根据返回数据更新列表。如请求返回格式不符合模板数据 listData 的要求格式，需调整格式后再赋值给 listData。
                    
                    let list = resData.data.list

                    console.log(list);
					//输出转换时间格式，时间格式为 2021-08-23 16:32:22
                    for (var i = 0; i < resData.data.list.length; i++) {
                        resData.data.list[i]["PostTime"] = toDate(Number(resData.data.list[i]["PostTime"]) * 1000, 1);
                    }

					// listData 的格式要求为：Array<{title:string, path:string, releaseDate:DateString}>
					// 输出新的数组 Array<{title:string, path:string, releaseDate:DateString}>
                    let newTecherList = list.map(item=>({
						// 文章路径标题
                        title: item.Title,
						// 小程序文章路径
                        path: '/pages/article/index?id=' + item.ID,
						// 发布时间
                        releaseDate: item.PostTime
                    }))
					
                    console.log(newTecherList);

                    this.setData({
						// 给listData 输出新的数组 newTecherList
                        listData: newTecherList,
						// 总页数
                        totalPage: resData.data.pagebar.PageAll,
						// 页码参数
                        currentPage
                    });

                }
            }
        });
    }
});