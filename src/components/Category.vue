<template>
  <!-- 卡片组件 -->
  <el-card>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>馆藏类别管理</el-breadcrumb-item>
      <el-breadcrumb-item>类别信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-input clearable v-model="cateName" clearable @change="listPage" placeholder="请输入图书类别名称查询"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button icon="el-icon-plus" @click="openAddDialog" type="success">添加
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格组件 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="catename" label="类别名称" width="180">
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间">
      </el-table-column>
      <el-table-column prop="modifytime" label="修改时间">
      </el-table-column>
      <el-table-column lable="操作">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <el-tooltip content="点击修改" placement="bottom">
            <el-button type="warning" @click="openEditDialog(scope.row)" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip content="点击删除" placement="bottom">
            <el-button type="danger" @click="open(scope.row)" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件定义 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pager.page"
      :page-sizes="[5, 10, 15, 20]" :page-size="pager.size" layout="total,
sizes, prev, pager, next, jumper" :total="pager.total">
    </el-pagination>
    <!-- 添加对话框 -->
    <el-dialog title="图书类别添加" :show-close="false" :close-on-click-modal="false" :visible.sync="addDialogFlag">
      <el-form :model="category" :rules="rules" ref="category">
        <el-form-item label="类别名称" prop="catename">
          <el-input v-model="category.catename" placeholder="请输入类别名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog title="图书类别修改" :show-close="false" :close-on-click-modal="false" :visible.sync="editDialogFlag">
      <el-form :model="category" :rules="rules" ref="category">
        <el-form-item label="类别名称" prop="catename">
          <el-input v-model="category.catename" placeholder="请输入类别名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close01">取 消</el-button>
        <el-button type="primary" @click="update">保存</el-button>
      </div>
    </el-dialog>
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
      close(){
        this.addDialogFlag = !this.addDialogFlag;
        this.category.catename = ''
      },
      close01(){
        this.editDialogFlag = !this.editDialogFlag;
        this.category.catename = '';
        this.listPage()
      },
      open(row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          if(res === 'confirm'){
            // this.$message({
            //   type: 'success',
            //   message: '删除成功!',
            //   });
             this.remove(row);
             }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      openAddDialog() {
        this.addDialogFlag = !this.addDialogFlag; //将打开添加对话框标记改成true
      },
      openEditDialog(row) {
        this.category = row;
        this.editDialogFlag = !this.editDialogFlag;
      },
      update() {
        this.$refs['category'].validate(valid => {
            if (valid) {
              this.$http.put('http://127.0.0.1/category/update', this.category)
                .then(res => {
                  if (res.data.code == 200) {
                    this.$message({
                      message: res.data.message,
                      type: 'success'
                    });
                    this.listPage();
                    this.editDialogFlag = !this.editDialogFlag;
                  }
                }).catch(error => {
                  this.$message.error('错了哦，网络异常');
                })
            }
        })
    },
    save() {
      // let parmas = new URLSearchParams();
      // parmas.append("catename", this.category.catename)
      this.$refs['category'].validate(valid => {
        if (valid) {
          this.$http.put('http://127.0.0.1/category/add', this.category)
            .then(res => {
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
                this.listPage();
                this.addDialogFlag = !this.addDialogFlag;
                this.category.catename = ''
              }
            }).catch(error => {
              this.$message.error('错了哦，网络异常');
            })
        }

      })
    },
    remove(row) {
      this.$http.delete('http://127.0.0.1/category/delete?cateid=' + row.cateid)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.message,
              type: 'success'
            });
            this.listPage();
          }
        }).catch(error => {
          //console.log(error)
          this.$message.error('错了哦，网络异常');
        })
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
      this.$http.get('http://127.0.0.1/category/listPage', {
        params: {
          page: this.pager.page,
          size: this.pager.size,
          cname: this.cateName
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
