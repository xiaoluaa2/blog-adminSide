<template>
  <div class="RightContent">
    <div class="ArticleList">
      <div class="partTitle">本周博客访问量趋势图</div>
      <div id="lineChart" class="lineChart"></div>
      <!--<div id="mapChart" class="lineChart"></div>-->
      <!--表格操作栏-->
      <div class="partTitle">博客访问数据明细</div>
      <el-table :data="blogVisitList" border style="width: 100%;" :header-cell-style="{ background: '#eef1f6' }">
        <!--        <el-table-column prop="fromUrl" label="来源URL"></el-table-column>-->
        <el-table-column prop="clientIp" label="访客ip" width="130"></el-table-column>
        <el-table-column prop="operateType" label="操作类型" width="130"></el-table-column>
        <el-table-column prop="operateContent" label="操作内容" width="130"></el-table-column>
        <el-table-column prop="location" label="访客定位" width="130"></el-table-column>
        <el-table-column prop="fromUrl" label="访客来源"></el-table-column>
        <el-table-column prop="browser" label="浏览器">
          <template slot-scope="scope">
            <div v-html="scope.row.browser"></div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="访问时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="50">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="Delete(scope.row._id)" class="danger-color">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="listTotal > 12">
        <el-pagination layout="prev, pager, next" :total=listTotal :page-size=pageSize @current-change="ChangeCurPage"
          @next-click="NextPage" @prev-click="NextPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data: function () {
    return {
      // 折线图数据
      lineChartOption: {
        title: { text: '' },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          type: 'plain'
        },
        xAxis: { data: [] },
        yAxis: {},
        series: [
          {
            name: '博客访问量(人/天)', type: 'line', data: [],
            itemStyle: {
              normal: {
                color: '#E6A23C',
                label: { show: true },
                lineStyle: { color: '#E6A23C' }
              }
            }
          }, {
            name: '博客访问ip数(个/天)', type: 'line', data: [],
            itemStyle: {
              normal: {
                color: '#67C23A',
                label: { show: true },
                lineStyle: { color: '#67C23A' }
              }
            }
          }
        ]
      },
      // 地图数据
      mapChartOption: {},
      // 访客列表数据
      blogVisitList: [],
      // 访客数据总数
      listTotal: 0,
      // 一页数据条数
      pageSize: 12,
      // 当前页
      MyCurPage: 1,
    }
  },
  methods: {
    // 获取blog访问数据
    getBlogVisitList: function () {
      var That = this;
      That.SQAjax({
        Url: '/api/statistics/getStatisticsList',
        RequestData: {
          Skip: this.MyCurPage,
          Limit: That.pageSize
        },
        Success: function (data) {
          data.data.data.forEach(function (item) {
            if (!item.fromUrl) {
              item.fromUrl = '获取失败';
            } else {
              item.fromUrl = item.fromUrl.split('/')[2];
            }
          });
          That.blogVisitList = data.data.data;
          That.listTotal = data.data.total;
        }
      });
    },
    // 设置线性图
    setLineChart: function () {
      var that = this;
      let lineChart = this.$echarts.init(document.getElementById('lineChart'));

      this.SQAjax({
        Url: '/api/visitCount/foreend',
        RequestData: {
          endTime: this.getSQTime().split(' ')[0],
          dayNum: 7
        },
        Success: function (data) {
          let dates = [], readings = [], ips = [];
          data.dateCountList.forEach(function (item) {
            dates.push(item.time);
            readings.push(item.reading);
            ips.push(item.ipNum);
          });
          that.lineChartOption.xAxis.data = dates.reverse();
          that.lineChartOption.series[0].data = readings.reverse();
          that.lineChartOption.series[1].data = ips.reverse();
          lineChart.setOption(that.lineChartOption);
        }
      });
    },
    // 删除访问记录
    Delete: function (Id) {
      var That = this;

      That.SQAjax({
        Url: '/api/statistics/deleteStatistics',
        RequestData: {
          _id: Id
        },
        Success: function (data) {
          That.$message('删除成功');
          That.getBlogVisitList();
        }
      });
    },
    // 翻页方法
    ChangeCurPage: function (CurPage) {
      this.MyCurPage = CurPage;
      this.getBlogVisitList()
    },
    NextPage: function (CurPage) {
      this.MyCurPage = CurPage;
      this.getBlogVisitList()
    },

  },
  mounted: function () {
    this.getBlogVisitList();
    // this.setLineChart();

    this.bus.$emit('Topbar', {
      MenuHighLight: '0'
    });
  }
}
</script>

<style scoped>
.lineChart {
  width: 100%;
  height: 400px;
}

.partTitle {
  padding: 1rem 0 1rem 0;
  color: rgb(18, 18, 18);
  font-weight: 500;
  font-size: 15px;
}
</style>
