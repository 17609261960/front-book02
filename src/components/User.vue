<template>
  <!-- 卡片组件 -->
  <el-card>
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-input clearable @change="listPage()" v-model="uname" placeholder="请输入用户名称进行查询"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button icon="el-icon-plus" @click="openAddDialog" type="success">添加
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格组件 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="uname" label="用户名称" width="180">
      </el-table-column>
      <el-table-column prop="password" label="密码">
      </el-table-column>
      <el-table-column prop="images" label="头像">
        <template slot-scope="scope">
          <img  :src="scope.row.images" style="width: 40px;height: 40x;" />
        </template>
      </el-table-column>
      <el-table-column prop="stat" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.stat" :active-value="0" :inactive-value="1" active-color="#13ce66"
            inactive-color="#ff4949" @change="changStats(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <el-tooltip content="点击修改" placement="bottom">
            <el-button type="warning" @click="openEditDialog(scope.row)" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip content="点击删除" placement="bottom">
            <el-button type="danger" @click="open(scope.row)" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
          <el-tooltip content="上传头像" placement="bottom">
              <el-button type="primary" circle icon="el-icon-upload" @click="openDialogUpload(scope.row)"></el-button>
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
    <el-dialog title="用户添加" :show-close="false" :close-on-click-modal="false" :visible.sync="addDialogFlag">
      <el-form :model="users" :rules="rules" ref="users">
        <el-form-item label="用户名称" prop="uname">
          <el-input v-model="users.uname" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="users.password" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" prop="images">
          <el-input v-model="users.images" placeholder="请输入用户头像"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog title="用户修改" :show-close="false" :close-on-click-modal="false" :visible.sync="editDialogFlag">
      <el-form :model="users" :rules="rules" ref="users">
        <el-form-item label="用户名称" prop="uname">
          <el-input v-model="users.uname" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="users.password" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" prop="images">
          <el-input v-model="users.images" placeholder="请输入用户头像"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close01">取 消</el-button>
        <el-button type="primary" @click="update">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="头像上传" :visible.sync="uplaodflag">
      <el-upload :limit="1" :before-upload="beforeAvatarUpload" :on-success="successed" name="file" :data="users"
        action="http://127.0.0.1/tbUser/uploadImages" list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>


  </el-card>
</template>
<script>
  export default {
    data() {
      return {
        uname: '',
        rules: {
          uname: [{
            required: true,
            message: '请输入用户名称',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          images: [{
            required: true,
            message: '请输入头像连接地址',
            trigger: 'blur'
          }]
        }, //定义表单验证规则
        editDialogFlag: false, //控制修改对话框显示
        uplaodflag: false, //头像上传对话框标记，默认false表示关闭
        users: { //封装数据
          uid: 0,
          uname: '',
          images: '',
          stat:'',
          password: ''
        },
        addDialogFlag: false, //控制对话框是否显示
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
        this.users={
          uid: '',
          uname: '',
          images: '',
          stat:'',
          password: ''
        }
      },
      close01(){
        this.editDialogFlag = !this.editDialogFlag;
        this.listPage()
      },
       beforeAvatarUpload(file) { //检查头像上传格式
              const isPNG = file.type === 'image/png';
              const isLt2M = file.size / 1024 / 1024 < 2;

              if (!isPNG) {
                this.$message.error('上传头像图片只能是 PNG 格式!');
              }
              if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
              }
              return isPNG && isLt2M;
            },
            successed(flag) { //上传成功后处理
              if (flag) {
                this.uplaodflag = !this.uplaodflag;
                this.listPage()
              }
            },
            openDialogUpload(row) { //打开上传的对话框
              this.users = row;
              this.uplaodflag = !this.uplaodflag;
            },
      open(row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          if(res === 'confirm'){
            this.$message({
              type: 'success',
              message: '删除成功!',
              });
             this.remove(row);
             }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      changStats(row) { //改变用户状态
        this.users = row;
        this.$http.put('http://127.0.0.1/tbUser/changStats', this.users).then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: res.data.message,
              type: 'success'
            });
            this.listPage();
          }
        })
      },
      openAddDialog() {
        this.addDialogFlag = !this.addDialogFlag; //将打开添加对话框标记改成true
      },
      openEditDialog(row) {
        this.users = row;
        this.editDialogFlag = !this.editDialogFlag;
      },
      update() {
        this.$refs['users'].validate(valid => {
          if (valid) {
            this.$http.put('http://127.0.0.1/tbUser/update', this.users)
              .then(res => {
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.message,
                    type: 'success'
                  });
                  this.editDialogFlag = !this.editDialogFlag;
                  this.users={
                    uid: 0,
                    uname: '',
                    images: '',
                    stat:'',
                    password: ''
                  }
                }
                 this.listPage();
              }).catch(error => {
                this.$message.error('错了哦，网络异常');
              })
          }
        })
      },
      save() {
        this.$refs['users'].validate(valid => {
          if (valid) {
            this.$http.put('http://127.0.0.1/tbUser/add', this.users)
              .then(res => {
                if (res.data.code == 200) {
                  this.$message({
                    message: res.data.message,
                    type: 'success'
                  });
                  this.addDialogFlag = !this.addDialogFlag;
                  this.users={
                    uid: '',
                    uname: '',
                    images: '',
                    stat:'',
                    password: ''
                  }
                }
                 this.listPage();
              }).catch(error => {
                this.$message.error('错了哦，网络异常');
              })
          }
        })
      },
      remove(row) {
        this.$http.delete('http://127.0.0.1/tbUser/remove?uid=' + row.uid)
          .then(res => {
            if (res.data.code == 200) {
              // this.$message({
              //   message: res.data.message,
              //   type: 'success'
              // });
              this.listPage();
            }
          }).catch(error => {
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
        this.$http.get('http://127.0.0.1/tbUser/listPage', {
          params: {
            page: this.pager.page,
            size: this.pager.size,
            uname: this.uname
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
