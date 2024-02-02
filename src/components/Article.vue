<template>
  <div>
    <div class="RightContent">
      <div style="margin-bottom:10px">
        <el-button type="primary" @click="WriteArticle()" plain>创建文章</el-button>
      </div>

      <el-table border :data="ArticleList" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }">
        <el-table-column prop="Title" label="标题"></el-table-column>
        <el-table-column prop="Summary" label="简介"></el-table-column>
        <el-table-column prop="ArticleTag" label="分类标签"></el-table-column>
        <el-table-column prop="order" label="优先级"></el-table-column>
        <el-table-column prop="CommentNum" label="评论数"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ new Date(scope.row.CreateDate).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="130">
          <template slot-scope="scope">
            <el-button @click="ReadArticle(scope.row._id)" type="text" size="small" class="success-color">查看</el-button>
            <el-button @click="EditArticle(scope.row._id)" type="text" size="small" class="warning-color">编辑</el-button>
            <el-button @click="DeleteArticle(scope.row._id)" type="text" size="small" class="danger-color">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="ArticleTotal > 10">
        <el-pagination layout="prev, pager, next" :total=ArticleTotal :page-size=PagiSize @current-change="ChangeCurPage"
          @next-click="NextPage" @prev-click="NextPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Article",
  data: function () {
    return {
      ArticleList: [],
      ArticleTotal: 0,
      PagiSize: 6,
      MyCurPage: 1
    };
  },
  methods: {
    ReadArticle: function (Id) {
      console.log(Id);
      this.$router.push({ name: "ArticleDetail", params: { id: Id } });
    },
    WriteArticle: function () {
      this.$router.push({ name: "WriteArticle" });
    },
    EditArticle: function (Id) {
      this.$router.push({ name: "WriteArticle", params: { id: Id } });
    },
    DeleteArticle: function (Id) {
      var That = this;
      this.SQAjax({
        Url: "/api/blogs/deleteBlog",
        RequestData: { _id: Id },
        Success: function (data) {
          console.log(data);
          That.$message({
            message: "删除成功",
            type: "success",
            duration: 900
          });
          That.GetData();
          // That.SkipTo(That.MyCurPage);
        }
      });
    },
    GetData: function (that) {
      var That = this;
      this.SQAjax({
        Url: "/api/blogs/getBlogsList",
        RequestData: {
          body: {
            pageNum: this.MyCurPage
          }
        },
        Success: function (data) {
          console.log(data);
          // if (data.length > 10) {
          //   data.pop();

          //   That.SQAjax({
          //     Url: "/api/getarticlenum/foreend",
          //     Success: function(data) {
          //       That.ArticleTotal = data;
          //     }
          //   });
          // }
          That.ArticleList = data.data.list;
          That.ArticleTotal = data.data.total
          console.log(That.ArticleList);
        }
      });
    },
    // 翻页方法
    ChangeCurPage: function (CurPage) {
      this.MyCurPage = CurPage;
      this.GetData();

    },
    NextPage: function (CurPage) {
      this.MyCurPage = CurPage;
      this.GetData();

    },

  },

  mounted: function () {
    this.GetData(this);
    this.bus.$emit("Topbar", {
      MenuHighLight: "1"
    });
  }
};
</script>

<style scoped></style>
