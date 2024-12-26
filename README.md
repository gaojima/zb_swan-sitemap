<h2 align="center">
	Zblog 1.7 百度小程序 swan-sitemap 索引页组件
</h2>
<h3>
	在 app.json 文件配置的 dynamicLib 字段中增加对 swan-sitemap 的引用
</h3>
<pre>
"dynamicLib": {
  // 'swan-sitemap-lib' 是个可自己定的别名。
  "swan-sitemap-lib": {
  // provider 是要引用的动态库的名字，在此为 'swan-sitemap'。
  "provider": "swan-sitemap"
  }
}
</pre>
<p>
	然后在小程序项目根目录创建 swan-sitemap 文件夹，并在文件夹下创建 index.js、index.swan、index.css、index.json 页面文件。
</p>
<p>
	简单解释下路径为什么一定要在根目录（例：/swan-sitemap/index）？
</p>
<p>
	如果放在pages内（例：/pages/swan-sitemap/index）会导致收录出现死链，放置根目录却不会，可能是个BUG，连百度小程序自己都不知道。
</p>
<h3>
	swan-sitemap/index.swan
</h3>
<p>
	swan-sitemap-list 需要组件字段，以下list-data是可以修改的，这里默认使用百度给出的，path="/swan-sitemap/index" 不可修改。
<p>
<pre>
<swan-sitemap-list
    list-data="{{listData}}"
    current-page="{{currentPage}}"
    total-page="{{totalPage}}"
    path="/swan-sitemap/index">
<\swan-sitemap-list>
</pre>
<h3>
	swan-sitemap/index.json
</h3>
<p>
	在 swan-sitemap/index.json页面中配置 usingComponents 字段引用组件声明。
<p>
<pre>
{
    "navigationBarTitleText": "索引页",
    "usingComponents": {
        "swan-sitemap-list": "dynamicLib://swan-sitemap-lib/swan-sitemap-list"
    }
}
</pre>
<h3>
	swan-sitemap/index.js
</h3>
<p>
	这里特别要注意时间格式，格式为 YYYY-MM-DD HH:mm:ss 。
<p>
<pre>
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
</pre>
<h3>
	官方参考文档
</h3>
<p>
	百度智能小程序 swan-sitemap 官方参考文档
</p>
<pre>
https://smartprogram.baidu.com/docs/develop/framework/sitemap/
</pre>
<p>
	完成以上步骤后，进入百度智能小程序页面，打开搜索接入 > 自然搜索 > 小程序新资源提交 > 自动同步，将 /swan-sitemap/index 提交进入即可，页面可以修改可删除，自由性较高。
</p>