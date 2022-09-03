<template>
  <!-- 卡片组件 -->
  <el-card>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>日志信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格组件 -->
    <el-table :data="tableData">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-tag type="danger">操作方法:{{scope.row.methods}} {{scope.row.ddesc}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="操作IP">
      </el-table-column>
      <el-table-column prop="createtime" label="操作时间">
      </el-table-column>
      <el-table-column prop="ddesc" label="方法描述">
      </el-table-column>
    </el-table>
    <!-- 分页组件定义 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pager.page"
      :page-sizes="[5, 10, 15, 20]" :page-size="pager.size" layout="total,
sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
  </el-card>
</template>
<script>
  export default {
    data() {
      return {
        rules: {
          catename: [{
            required: true,
            message: '请输入类别名称',
            trigger: 'blur'
          }]
        }, //定义表单验证规则
        editDialogFlag: false, //控制修改对话框显示
        category: { //封装数据
          cateid: 0,
          catename: ''
        },
        addDialogFlag: false, //控制对话框是否显示
        cateName: '', //条件查询
        tableData: [],
        pager: { //分页封装对象
          page: 1,
          size: 5,
          total: 0
        }
      }
    },
    //该属性是vue对象中的成员变量，作用编写用户自己定的方法
    methods: {
      handleCurrentChange(val) {
        this.pager.page = val;
        this.listPage();
      },
      handleSizeChange(val) {
        this.pager.size = val;
        this.listPage(); //重新调用查询方法
      },
      //用户定义的前端请求方法
      listPage() {
        this.$http.get('http://127.0.0.1/tbLog/listPage', {
          params: {
            page: this.pager.page,
            size: this.pager.size,
          }
        }).then(res => {
          this.tableData = res.data.data.rows;
          this.pager.total = res.data.data.total
        }).catch(error => {
          this.$message.error('错了哦，网络异常');
        })
      }
    },
    //vue声明周期函数
    mounted() {
      this.listPage();
    }
  }
</script>
<style>
  .el-breadcrumb {
    padding-bottom: 20px;
  }

  .el-pagination {
    padding-top: 10px;
  }
</style>
