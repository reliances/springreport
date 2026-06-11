export default {
  name:'reportSnapshot',
  data() {
    return{
      pageData:{
        //请求的url start
        requestUrl:{
          listApi:"/api/reportSnapshot/getTableList",//获取表格数据api
          insertApi:"/api/reportSnapshot/insert",//新增用api
          updateApi:"/api/reportSnapshot/update",//更新用api
          getDetailApi:"/api/reportSnapshot//getDetail",//获取详情用api
          deleteOneApi:"/api/reportSnapshot/delete",//单条删除api
          deleteBatchApi:"/api/reportSnapshot/deletebatch",//批量删除api
        },
        //请求的url end
        //查询表单内容 start
        searchForm:[
					{type:'Input',label:'快照名称',prop:'snapshotName'},
					{type:'Input',label:'快照日期',prop:'snapshotDate'},
        ],
        //查询表单内容 end
        //查询条件 start
        queryData:{
					snapshotName:"",//快照名称 
					snapshotDate:"",//快照日期 
        },
        //查询条件 end
        //查询表单按钮start
        searchHandle:[
          {label:'清除条件',type:'',handle:()=>this.resetSearch(),auth:'ignore'},
          {label:'查询',type:'primary',handle:()=>this.searchtablelist(),auth:'ignore'},
        ],
        //查询表单按钮end
        //表格数据start
        tableData:[],
        //表格数据end
        //表格工具栏按钮 start
        tableHandles:[
          { label: '刷新', type: 'danger', position: 'left', iconClass: 'action-icon-refresh', handle: () => this.searchtablelist(), auth: 'reportSnapshot_view' }
        ],
        //表格工具栏按钮 end
        selectList:[],//表格选中的数据
        //表格分页信息start
        tablePage:{
          currentPage: 1,
          pageSize:10,
          pageTotal: 0,
          pageSizeRange:[5, 10, 20, 50]
        },
        //表格分页信息end
        //表格列表头start
        tableCols:[
					{label:'快照名称',prop:'snapshotName',align:'center'},
          {label:'所属报表',prop:'tplName',align:'center'},
					{label:'快照日期',prop:'snapshotDate',align:'center'},
          {label:'创建人',prop:'userName',align:'center'},
          {label:'创建时间',prop:'createTime',align:'center'},
					{label:'操作',prop:'operation',align:'center',type:'button',btnList:[
						{label:'查看快照',type:'primary',auth:'reportSnapshot_view',handle:(row)=>this.viewSnapshot(row)},
					]}
        ],
        //表格列表头end
      }
    }
  },
  mounted(){
    this.searchtablelist();
  },
  methods:{
    /**
     * @description: 获取表格数据
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    searchtablelist(){
      var obj = {
        url:this.pageData.requestUrl.listApi,
        params:Object.assign({}, this.pageData.queryData, this.pageData.tablePage),
      }
      this.commonUtil.getTableList(obj).then(response=>{
        this.commonUtil.tableAssignment(response,this.pageData.tablePage,this.pageData.tableData);
      });
    },
    resetSearch(){
      this.commonUtil.clearObj(this.pageData.queryData);
      this.searchtablelist();
    },
    /**
     * @description: modal显示
     * @param {type} 类型 1新增，2编辑 3详情 
     * @param {id} 数据唯一标识
     * @return: 
     * @author: caiyang
     */    
    showModal(type,id){
      this.commonUtil.showModal(this.pageData.modalConfig,type);
      if(type != this.commonConstants.modalType.insert)
      {
        this.getDetail(id);
      }
      
    },
    /**
     * @description: 获取详细数据
     * @param {id} 数据唯一标识
     * @return: 
     * @author: caiyang
     */    
    getDetail(id){
      var obj = {
        url:this.pageData.requestUrl.getDetailApi,
        params:{id:id},
      }
      this.commonUtil.doGet(obj).then(response=>{
        this.commonUtil.coperyProperties(this.pageData.modalData,response.responseData);//数据赋值
      });
    },
    /**
     * @description: 关闭modal
     * @param 
     * @return: 
     * @author: caiyang
     */    
    closeModal(){
      this.$refs['modalRef'].$refs['modalFormRef'].resetFields();//校验重置
      this.pageData.modalConfig.show = false;//关闭modal
      this.commonUtil.clearObj(this.pageData.modalData);//清空modalData
    },
    /**
     * @description: 保存数据
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    save(){
      this.$refs['modalRef'].$refs['modalFormRef'].validate((valid) => {
        if (valid) {
            var obj = {
              params:this.pageData.modalData,
              removeEmpty:false,
            }
            if(this.pageData.modalConfig.type == this.commonConstants.modalType.insert)
            {
              obj.url = this.pageData.requestUrl.insertApi;
            }else{
              obj.url = this.pageData.requestUrl.updateApi
            }
            this.commonUtil.doPost(obj) .then(response=>{
              if (response.code == "200")
              {
                this.closeModal();
                this.searchtablelist();
              }
            });
        }else{
            return false;
        }
      });
    },
    /**
     * @description: 删除一条数据
     * @param {id} 数据唯一标识 
     * @return: 
     * @author: caiyang
     */    
    deleteOne(id){
      let obj = {
        url:this.pageData.requestUrl.deleteOneApi,
        messageContent:this.commonUtil.getMessageFromList("confirm.delete",null),
        callback:this.searchtablelist,
        params:{id:id},
        type:"get",
      }
      //弹出删除确认框
      this.commonUtil.showConfirm(obj)
    },
    /**
     * @description: 批量删除
     * @param {type} 
     * @return: 
     * @author: caiyang
     */    
    deleteBatch(){
        const length = this.pageData.selectList.length;
        if(length == 0)
        {
            this.commonUtil.showMessage({message:this.commonUtil.getMessageFromList("error.batchdelete.empty",null),type: this.commonConstants.messageType.error});
        }else{
          let ids = new Array();
          for (let i = 0; i < length; i++) {
              ids.push(this.pageData.selectList[i].id);
          }
          let obj = {
            url:this.pageData.requestUrl.deleteBatchApi,
            messageContent:this.commonUtil.getMessageFromList("confirm.delete",null),
            callback:this.searchtablelist,
            params:ids,
            type:"post",
          }
          this.commonUtil.showConfirm(obj);
        }
    },
    selectChange(rows){
      this.pageData.selectList = rows;
    },
    viewSnapshot(row){
      const viewReport = this.$router.resolve({ name: "viewSnapshot", query: { snapshotId: row.id,}})
      window.open(viewReport.href, '_blank')
    }
  }
};