<template>
  <!-- 卡片组件 -->
  <el-card>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>借阅信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>借阅信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-input clearable @change="listPage" v-model="borrow.bname" placeholder="请输入借阅图书称查询"></el-input>
      </el-col>
      <el-col :span="6">
        <el-input clearable @change="listPage" v-model="borrow.names" placeholder="请输入借阅人名称称查询"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button icon="el-icon-plus" @click="openAddDialog" type="success">借阅
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格组件 -->
    <el-table :data="tableData">
      <el-table-column prop="book" label="图书名称">
        <template slot-scope="scope">
          {{scope.row.book.bname}}
        </template>
      </el-table-column>
      <el-table-column prop="names" label="借阅人">
      </el-table-column>
      <el-table-column prop="outtime" label="借出时间">
      </el-table-column>
      <el-table-column prop="intime" label="归还时间">
      </el-table-column>
      <el-table-column prop="quantity" label="借阅数量">
      </el-table-column>
      <el-table-column prop="tel" label="电话">
      </el-table-column>
      <el-table-column prop="stat" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.stat==1">已归还</el-tag>
          <el-tag type="danger" v-else-if="scope.row.stat==0">已借出</el-tag>
          <el-tag type="warning" v-else>未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <el-button icon="el-icon-s-promotion" @click="updatestat(scope.row)" size="mini" type="danger"
            v-show="scope.row.stat==0">归还
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="借阅图书" :show-close="false" :close-on-click-modal="false" :visible.sync="addDialogFlag">
      <el-form :model="borrow" :rules="rules" ref="borrow" label-width="100px">
        <el-form-item label="借阅用户">
          <el-input v-model="borrow.names" placeholder="请输入借阅用户"></el-input>
        </el-form-item>
        <el-form-item label="借阅图书">
          <el-select v-model="borrow.bid" placeholder="请选择图书">
            <el-option v-for="item in options" :key="item.bid" :label="item.bname" :value="item.bid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="借阅数量">
          <el-input v-model="borrow.quantity" placeholder="请输入借阅数量"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="borrow.tel" placeholder="请输入电话号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
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
        borrow: {
          boid:'',
          bname: '',
          names: '',
          quantity: '',
          tel: ''
        },
        options: [],
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
      close(){
        this.addDialogFlag=!this.addDialogFlag;
        this.borrow = {
          boid:'',
          bname: '',
          names: '',
          quantity: '',
          tel: ''
        }
      },
      updatestat(row) {
        this.$http.post('http://127.0.0.1/tbBorrow/updatestat?boid=' + row.boid ).then(res => {
          if(res.data.code == 200){
            this.$message({
              message:res.data.message,
              type:'success'
            })
          }
          this.listPage()
        })
      },
      save() {
        // let parmas = new URLSearchParams();
        // parmas.append("catename", this.category.catename)
        this.$refs['borrow'].validate(valid => {
          if (valid) {
            this.$http.put('http://127.0.0.1//tbBorrow/add', this.borrow)
              .then(res => {
                console.log(res)
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.message,
                    type: 'success'
                  });
                  this.addDialogFlag = !this.addDialogFlag;
                  this.borrow = {
                    boid:'',
                    bname: '',
                    names: '',
                    quantity: '',
                    tel: ''
                  };
                  this.listPage();
                }else if(res.data.code == 500){
                  this.$message({
                    message: res.data.message,
                    type: 'error',
                  });
                }
              }).catch(error => {
                this.$message.error('错了哦，网络异常');
              })
          }
        })
      },
      listbook() {
        this.$http.get('http://127.0.0.1/tbBook/list').then(res => {
          if (res.data.code == 200) {
            this.options = res.data.data;
          }
        })
      },
      openAddDialog() {
        this.addDialogFlag = !this.addDialogFlag; //将打开添加对话框标记改成true
      },
      openEditDialog(row) {
        this.category = row;
        console.info(this.category)
        this.editDialogFlag = !this.editDialogFlag;
      },
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
        this.$http.get('http://127.0.0.1/tbBorrow/listPage', {
          params: {
            page: this.pager.page,
            size: this.pager.size,
            bname: this.borrow.bname,
            names: this.borrow.names
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
      this.listbook();
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
