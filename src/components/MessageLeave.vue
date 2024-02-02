<template>
  <div>
    <div class="RightContent">
      <div class="ArticleList">
        <el-dialog title="管理分类" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="留言者" :label-width="formLabelWidth">
              <el-input v-model="form.MessageLeaveName"></el-input>
            </el-form-item>
            <el-form-item label="留言内容" :label-width="formLabelWidth">
              <el-input v-model="form.MessageText"></el-input>
            </el-form-item>
            <el-form-item label="城市" :label-width="formLabelWidth">
              <el-input v-model="form.LocationCityName"></el-input>
            </el-form-item>
            <el-form-item label="头像编号" :label-width="formLabelWidth">
              <!-- <el-input v-model="form.iconNo"></el-input> -->
              <el-select v-model="form.iconNo" class="m-2" placeholder="Select">
                <el-option v-for="item in headOptions" :key="item.value" :label="item.label" :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    <img class="headImg" :src="require('@/assets/img/' + (item.value) + '.jpeg')" />
                  </span>
                </el-option>

              </el-select>

            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="OnDialogCancel()">取 消</el-button>
            <el-button type="primary" @click="OnDialogSubmit()">确 定</el-button>
          </div>
        </el-dialog>

        <!--表格操作栏-->
        <el-table :data="MessageLeaveList" style="width: 100%" border :header-cell-style="{ background: '#f7f7f7' }">
          <el-table-column prop="userId" label="留言者"></el-table-column>
          <el-table-column prop="content" label="留言内容">
            <template slot-scope="scope">
              <div v-html="scope.row.content"></div>
            </template>
          </el-table-column>
          <!-- this.FormatTime("yyyy-MM-dd", tem.publishdate); -->
          <el-table-column prop="city" label="城市"></el-table-column>
          <el-table-column prop="head" label="头像"></el-table-column>
          <el-table-column prop="publishdate" label="创建时间">
            <template slot-scope="scope">
              <div>{{ FormatTime("yyyy-MM-dd", parseInt(scope.row.publishdate)) }}</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="130">
            <template slot-scope="scope">
              <el-button @click="EditMessageLeave(scope.row)" type="text" size="small"
                class="warning-color">编辑</el-button>
              <el-button @click="DeleteTag(scope.row._id)" type="text" size="small" class="danger-color">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- <div v-if="MessageLeaveTotal > 10">
           -->
        <div>
          <el-pagination layout="prev, pager, next" :total='MessageLeaveTotal' :page-size=PagiSize
            @current-change="ChangeCurPage" @next-click="NextPage" @prev-click="NextPage">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TagIndex",
  data: function () {
    return {
      MessageLeaveList: [],
      MessageLeaveTotal: 0,
      PagiSize: 16,
      dialogFormVisible: false,
      form: {
        MessageLeaveName: "",
        MessageText: "",
        delivery: false,
        LocationCityName: "",
        iconNo: ""
      },
      formLabelWidth: "80px",
      MyCurPage: 1,
      headOptions: [
        {
          label: "默认头像1",
          value: "head0"
        },
        {
          label: "默认头像2",
          value: "head1"
        },
        {
          label: "默认头像3",
          value: "head2"
        },
        {
          label: "默认头像4",
          value: "head3"
        },
        {
          label: "默认头像5",
          value: "head4"
        }
      ]
    };
  },
  methods: {
    /*监听弹框提交*/
    OnDialogSubmit: function () {
      var That = this;
      if (this.form.MessageLeaveName && this.form.MessageText) {
        this.SQAjax({
          Url: "/api/comment/updateComment",
          RequestData: this.form,
          Success: function () {
            That.SkipTo(That.MyCurPage);
          }
        });

        this.dialogFormVisible = false;
      }
    },
    OnDialogCancel: function () {
      if (this.form.TagId) {
        delete this.form.TagId;
      }
      this.dialogFormVisible = false;
    },
    /*渲染标签列表*/
    GetData: function () {
      var That = this;
      this.SQAjax({
        Url: "/api/comment/getCommentList",
        RequestData: {
          PagnationData: {
            Skip: 0,
            Limit: 16
          }
        },
        Success: function (data) {
          console.log("56465456");
          console.log(data.data);
          // if (data.length > 10) {
          //   data.pop();
          //   That.SQAjax({
          //     Url: "/api/getmessagenum",
          //     Success: function(data) {
          //       That.MessageLeaveTotal = data;
          //     }
          //   });
          // }

          console.log("222");
          console.log(data.data);
          That.MessageLeaveList = data.data.data;
          That.MessageLeaveTotal = data.data.total;
        }
      });
    },

    // 翻页方法
    ChangeCurPage: function (CurPage) {
      this.SkipTo(CurPage);
      this.MyCurPage = CurPage;
    },
    NextPage: function (CurPage) {
      this.SkipTo(CurPage);
      this.MyCurPage = CurPage;
    },
    SkipTo: function (CurPage) {
      var That = this;
      console.log(CurPage);
      That.SQAjax({
        Url: "/api/comment/getCommentList",
        RequestData: {
          PagnationData: {
            Skip: (CurPage - 1) * 16,
            Limit: 16
          }
        },
        Success: function (data) {
          That.MessageLeaveList = data.data.data;
          That.MessageLeaveTotal = data.data.total;
        }
      });
    },
    /*删除标签*/
    DeleteTag: function (Id) {
      var That = this;
      this.$confirm('此操作将永久删除评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        That.SQAjax({
          Url: "/api/comment/deleteComment",
          RequestData: {
            _id: Id
          },
          Success: function () {
            That.SkipTo(That.MyCurPage);
            setTimeout(() => {
              That.$message({
                type: 'success',
                message: '删除成功!'
              });
            }, 0);
          }
        });

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    /*编辑标签*/
    EditMessageLeave: function (Row) {
      this.form.MessageLeaveName = Row.userId;
      this.form.MessageText = Row.content;
      this.form.LocationCityName = Row.city;
      this.form._id = Row._id;
      this.form.iconNo = Row.head;
      this.dialogFormVisible = true;
    }
  },
  mounted: function () {
    this.GetData();
    this.bus.$emit("Topbar", {
      MenuHighLight: "6"
    });
  }
};
</script>

<style scoped>
.headImg {
  width: 40px;
  height: 40px;
}
</style>
