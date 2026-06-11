export default {
    components: {
    },
    data() {
        return {
            loadingText: '',
            loading: false,
            sheetOptions: {
                container: 'luckysheet', // luckysheet为容器id
                title: '', // 表 头名
                lang: 'zh', // 中文
                plugins: ['chart'],
                fontList: [
                {
                    'fontName': '条形码（barCode128）',
                    'url': ''
                },
                {
                    'fontName': '二维码（qrCode）',
                    'url': ''
                }
                ],
                forceCalculation: true,
                functionButton: '',
                index: '0', // 工作表索引
                status: '1', // 激活状态
                order: '0', // 工作表的顺序
                hide: '0', // 是否隐藏
                showtoolbar: false, // 是否显示工具栏
                showinfobar: false, // 是否显示顶部信息栏
                showsheetbar: true, // 是否显示底部sheet按钮
                allowEdit: true,
                // allowCopy:false,
                rowHeaderWidth: 46,
                columnHeaderHeight: 20,
                sheetFormulaBar: true,
                showtoolbarConfig: {

                },
                cellRightClickConfig: {
                copyAs: false, // 复制为
                deleteCell: false, // 删除单元格
                hideRow: true, // 隐藏选中行和显示选中行
                hideColumn: true, // 隐藏选中列和显示选中列
                matrix: false, // 矩阵操作选区
                sort: false, // 排序选区
                filter: false, // 筛选选区
                chart: false, // 图表生成
                image: false, // 插入图片
                data: false, // 数据验证
                cellFormat: false, // 设置单元格格式
                link: false // 插入链接
                },
                pager: {
                },
                hook: {
                }
            },
            searchHandle:[
            ]
        }
    },
    mounted() {
        this.getSnapshotData();
    },
    methods: {
        initLuckySheet() {
            var options = this.sheetOptions
            luckysheet.create(options)
        },
        getSnapshotData(){
            const snapshotId = this.$route.query.snapshotId;
            var obj = {
                url: this.apis.reportSnapshot.getSnapshotApi,
                params: {id:snapshotId}
            }
            var that = this;
            this.loading = true;
            this.loadingText="数据加载中..."
            this.commonUtil.doPost(obj).then((response) => {
                that.loading = false;
                if (response.code == '200') {
                    that.sheetOptions.data = response.responseData;
                    that.initLuckySheet();
                }
            })
        },
        exportSnapshot: function() {
            this.loading = true;
            this.loadingText="EXCEL数据导出中..."
            const snapshotId = this.$route.query.snapshotId;
            const headers = {}
            this.commonUtil.downloadFile(this.apis.reportSnapshot.exportSnapshotApi, { id:snapshotId }, this.closeLoading, headers)
        },
        closeLoading() {
            this.loading = false
        },
    }
}