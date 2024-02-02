/**
* 此文件实现 评论管理 功能
*/
<template>
  <div>
    <div class="RightContent">
      <div class="ArticleList">
        <!-- <el-button type="primary" >批量删除</el-button> -->
        <el-dialog title="修改评论" :visible.sync="dialogEdit">
          <el-form :model="form">
            <el-form-item label="评论人" :label-width="formLabelWidth">
              <el-input v-model="form.userId"></el-input>
            </el-form-item>
            <el-form-item label="评论内容" :label-width="formLabelWidth">
              <el-input v-model="form.content"></el-input>
            </el-form-item>
            <el-form-item label="评论来源" :label-width="formLabelWidth">
              <el-input v-model="form.city"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="OnDialogCancel()">取 消</el-button>
            <el-button type="primary" @click="OnDialogSubmit()">确 定</el-button>
          </div>
        </el-dialog>

        <!--表格操作栏-->
        <el-table :data="CommentList" style="width: 100%" border :header-cell-style="{ background: '#f7f7f7' }">
          <el-table-column prop="blog" label="评论文章"></el-table-column>
          <el-table-column prop="userId" label="评论人"></el-table-column>
          <el-table-column prop="content" label="评论内容">
            <template slot-scope="scope">
              <div v-html="scope.row.content"></div>
            </template>
          </el-table-column>
          <el-table-column prop="city" label="评论来源"></el-table-column>
          <el-table-column prop="publishdate" label="评论时间">
            <template slot-scope="scope">
              <div>{{ FormatTime("yyyy-MM-dd", parseInt(scope.row.publishdate)) }}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="130">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" size="small" class="warning-color">修改</el-button>
              <el-button @click="DeleteComment(scope.row._id, scope.row.ArticleId)" type="text" size="small"
                class="danger-color">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页器-->
        <div v-if="CommentTotal > 10">
          <el-pagination layout="prev, pager, next" :total=CommentTotal :page-size=PageSize
            @current-change="ChangeCurPage" @next-click="NextPage" @prev-click="NextPage">
          </el-pagination>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  data: function () {
    return {
      CommentList: [],
      dialogEdit: false,
      form: {
        userId: '',
        content: '',
        city: ''
      },
      formLabelWidth: '80px',
      CommentTotal: 0,
      PageSize: 10,

      // 当前分页
      MyCurPage: 1
    }
  },
  methods: {
    // 评论列表
    GetData: function () {
      console.log(51541545);
      var That = this;
      // That.SQAjax({
      //   Url: '/api/CommentRead/foreend',
      //   RequestData: {
      //     PagnationData: {
      //       Skip: 0,
      //       Limit: 11
      //     }
      //   },
      //   Success: function (data) {
      //     if (data.length > 10) {
      //       data.pop();

      //       That.SQAjax({
      //         Url: '/api/getCommentNum',
      //         Success: function (data) {
      //           That.CommentTotal = data;
      //         }
      //       });
      //     }
      //     data.forEach(element => {
      //       element.ArticleCommentDate = new Date(element.ArticleCommentDate).toLocaleString();
      //     });

      //     That.CommentList = data;
      //   }
      // });
      That.SQAjax({
        Url: "/api/blogs/getAllComment",
        RequestData: {
          Skip: (this.MyCurPage - 1) * 11,
          Limit: 11
        },
        Success: function (data) {
          That.CommentList = data.data.commentList;
          That.CommentTotal = data.data.total;
          console.log(That.CommentList);
        }
      });
    },
    /**
     * 删除评论
     * @param CommentId 该条评论的id
     * @param ArticleId 文章id
     * @constructor
     */
    DeleteComment: function (CommentId, ArticleId) {
      var That = this;

      That.SQAjax({
        Url: '/api/blogs/deleteComment',
        RequestData: {
          _id: CommentId
        },
        Success: function (data) {
          That.GetData();
          // That.UpdateArticleCommentNum(ArticleId, 'delete');
        }
      });
    },
    OnDialogCancel: function () {
      if (this.form.TagId) {
        delete this.form.TagId;
      }
      this.dialogEdit = false;
    },
    /*监听弹框提交*/
    OnDialogSubmit: function () {
      var That = this;
      if (this.form.userId && this.form.content) {
        this.SQAjax({
          Url: '/api/blogs/commentUpdate',
          RequestData: this.form,
          Success: function () {
            That.GetData();
            That.dialogEdit = false;
          }
        });
      }
    },
    /**
    * 修改评论
    */
    edit: function (Row) {
      this.form.userId = Row.userId;
      this.form.content = Row.content;
      this.form.city = Row.city;
      this.form._id = Row._id;
      this.dialogEdit = true;
    },

    // 传入文章id，给对应文章评论数减1
    UpdateArticleCommentNum: function (id, type) {
      this.SQAjax({
        Url: '/api/ArticleCommentNumUpdate/backend',
        RequestData: {
          _id: id,
          type: type
        },
        Success: function (data) { }
      });
    },
    // 翻页方法
    ChangeCurPage: function (CurPage) {
      console.log(CurPage);
      this.MyCurPage = CurPage;
      this.GetData();
    },
    NextPage: function (CurPage) {
      console.log(CurPage);
      this.MyCurPage = CurPage;
      this.GetData();
    },
    // SkipTo: function (CurPage) {
    //   var That = this;
    //   That.SQAjax({
    //     Url: '/api/CommentRead/foreend',
    //     RequestData: {
    //       PagnationData: {
    //         Skip: (CurPage - 1) * 10,
    //         Limit: 10
    //       }
    //     },
    //     Success: function (data) {
    //       data.forEach(element => {
    //         element.ArticleCommentDate = new Date(element.ArticleCommentDate).toLocaleString();
    //       });

    //       That.CommentList = data;
    //     }
    //   });
    // }
  },
  mounted() {
    this.GetData();
    this.bus.$emit('Topbar', {
      MenuHighLight: '7'
    });
  }
}
</script>

<style scoped></style>
