<template>
  <el-card>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <el-tag type="success">库存数量:{{booknum}}册</el-tag>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-tag type="danger">借出数量:{{total}}本</el-tag>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-tag type="warning">热门图书:{{maxnumbook}}</el-tag>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-card>
        <div id="pie" style="width: 100%; height: 400%;">
          图书类别占比图
        </div>
      </el-card>
    </el-row>
    <el-row :gutter="10">
      <el-card>
        <div id="bar" style="width: 100%; height: 350%;">
          图书数量图
        </div>
      </el-card>
    </el-row>
    <el-row :gutter="10">
      <el-card>
        <div id="line" style="width: 100%; height: 350%;">
          借阅图书数量占比图
        </div>
      </el-card>
    </el-row>
  </el-card>
</template>

<script>
  export default {
    name: "Welcaome",
    data() {
      return {
        total: 0,
        booknum: '0',
        maxnumbook: ''
      }
    },
    methods: {
      total03() {
        this.$http.get('http://127.0.0.1/tbBorrow/getmaxsum').then(res => {
          let arr = res.data
          let tbsum = []
          let book = []
          let bname = []
          let max = 0
          for (let i in arr) {
            tbsum.push(arr[i].tbsum)
            book.push(arr[i].book)
          }
          for (let i in book) {
            bname.push(book[i].bname)
          }
          for (let i = 0; i < tbsum.length; i++) {
            if (tbsum[i] > tbsum[max]) {
              max = i
            }
          }
          this.maxnumbook = bname[max]
        })
      },
      total02() {
        this.$http.get('http://127.0.0.1/tbBook/getbooksum').then(res => {
          this.booknum = res.data
        })
      },
      total01() {
        this.$http.get('http://127.0.0.1/tbBorrow/gettotal').then(res => {
          this.total = res.data.data
        })
      },
      showpisc() {
        let mybar = this.$echarts.init(document.getElementById('bar'))
        this.$http.get('http://127.0.0.1/tbBook/findBookList').then(res => {
          let array = res.data;
          let names = [];
          let values = [];
          for (let i in array) {
            names.push(array[i].bname)
            values.push(array[i].quantity)
          }

          let option = {
            xAxis: {
              type: 'category',
              data: names
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: values,
              type: 'bar'
            }]
          };
          mybar.setOption(option)
        })

      },
      showbaer() {
        let mypie = this.$echarts.init(document.getElementById('pie'))
        this.$http.get('http://127.0.0.1/tbBook/getdouble').then(res => {
          let array = res.data;
          let tbsum = [];
          let cate = [];
          for (let i in array) {
            tbsum.push(array[i].tbsum)
            cate.push(array[i].tbCategory)
          }
          let cname = [];
          for (let i in cate) {
            cname.push(cate[i].catename)
          }
          // console.log(tbsum)
          // console.log(cname)
          let data = []
          for (let i = 0; i < tbsum.length; i++) {
            let part = {
              value: tbsum[i],
              name: cname[i]
            }
            data.push(part)
          }
          let option = {
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '5%',
              left: 'center'
            },
            series: [{
              name: '图书类别占比图',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data
            }]
          };

          mypie.setOption(option)
        })
      },
      showline() {
        let myline = this.$echarts.init(document.getElementById('line'))
        this.$http.get('http://127.0.0.1/tbBorrow/getmaxsum').then(res => {
          let arr = res.data
          let tbsum = []
          let book = []
          let bname = []
          for (let i in arr) {
            tbsum.push(arr[i].tbsum)
            book.push(arr[i].book)
          }
          for (let i in book) {
            bname.push(book[i].bname)
          }
          let option = {
            xAxis: {
              type: 'category',
              data: bname
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: tbsum,
              type: 'line',
              smooth: true
            }]
          };
          myline.setOption(option)
        })
      }
    },
    mounted() {
      this.showline(),
        this.showbaer(),
        this.showpisc(),
        this.total01(),
        this.total02(),
        this.total03()
    }
  }
</script>

<style>
  .el-row {
    margin: 15px;
  }
</style>
