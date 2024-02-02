<template>
  <div>
    <div class="RightContent">
      <div class="ArticleList">
        <div style="margin-bottom:10px">
          <el-button type="primary" @click="OnOpenDialog()" plain>新增友链</el-button>
        </div>

        <el-dialog title="管理友链" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="网站名称" :label-width="formLabelWidth">
              <el-input v-model="form.author_name"></el-input>
            </el-form-item>
            <el-form-item label="友链地址" :label-width="formLabelWidth">
              <el-input v-model="form.author_link"></el-input>
            </el-form-item>
            <el-form-item label="图标地址" :label-width="formLabelWidth">
              <el-input v-model="form.author_avatar"></el-input>
            </el-form-item>
            <el-form-item label="个人描述" :label-width="formLabelWidth">
              <el-input v-model="form.author_descr"></el-input>
            </el-form-item>
            <el-form-item label="封面" :label-width="formLabelWidth">
              <el-input v-model="form.author_siteshot"></el-input>
            </el-form-item>
            <el-form-item label="类型" :label-width="formLabelWidth">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="优先级" :label-width="formLabelWidth">
              <el-input v-model="form.rank"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="OnDialogCancel()">取 消</el-button>
            <el-button type="primary" @click="OnDialogSubmit()">确 定</el-button>
          </div>
        </el-dialog>

        <!--表格操作栏-->
        <el-table :data="FriendUrlList" style="width: 100%" border :header-cell-style="{ background: '#f7f7f7' }">
          <el-table-column prop="author_name" label="友链名称"></el-table-column>
          <el-table-column prop="author_link" label="友链地址"></el-table-column>
          <el-table-column prop="author_avatar" label="图标地址" width="300" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="author_descr" label="个人描述"></el-table-column>
          <el-table-column prop="author_siteshot" label="封面"></el-table-column>
          <el-table-column fixed="right" label="操作" width="130">
            <template slot-scope="scope">
              <el-button @click="EditFriendUrl(scope.row)" type="text" size="small" class="warning-color">编辑</el-button>
              <el-button @click="DeleteFriendUrl(scope.row._id)" type="text" size="small"
                class="danger-color">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页器-->
        <div v-if="FriendUrlTotal > 10">
          <el-pagination layout="prev, pager, next" :total=FriendUrlTotal :page-size=PagiSize
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
      FriendUrlList: [],
      dialogFormVisible: false,
      options: [{
        value: '1',
        label: '友链',
      },
      {
        value: '2',
        label: '网站',
      },],
      form: {
        author_name: '',
        author_link: '',
        author_avatar: '',
        author_descr: '',
        author_siteshot: '',
        type: '',
        rank: '',
        _id: '',
      },
      formLabelWidth: '80px',
      FriendUrlTotal: 0,
      PagiSize: 10,
      MyCurPage: 0
    }
  },
  methods: {
    /*监听新增弹框*/
    OnOpenDialog: function () {
      // 清空表单数据
      this.form = {};
      this.dialogFormVisible = true;
    },
    /*监听弹框提交*/
    OnDialogSubmit: function () {
      var That = this;
      if (this.form.author_link) {
        this.SQAjax({
          Url: '/api/link/addLink',
          RequestData: That.form,
          Success: function (data) {
            That.$message.success(data.data.message);
            That.GetData()
          }
        });

        this.dialogFormVisible = false;
      }
    },
    OnDialogCancel: function () {
      if (this.form._id) {
        delete this.form._id;
      }
      this.dialogFormVisible = false;
    },
    /*渲染标签列表*/
    GetData: function () {
      var That = this;
      That.SQAjax({
        Url: '/api/link/linkList',
        RequestData: {
          Skip: this.MyCurPage,
          Limit: 11
        },
        Success: function (data) {
          // if (data.length > 10) {
          //   data.pop();

          //   That.SQAjax({
          //     Url: '/api/getfriendurlnum',
          //     Success: function (data) {
          //       That.FriendUrlTotal = data;
          //     }
          //   });
          // }
          console.log(data.data.data);
          That.FriendUrlList = data.data.data;
          That.FriendUrlTotal = data.data.total;
        }
      });
    },
    /*删除标签*/
    DeleteFriendUrl: function (Id) {
      var That = this;
      That.SQAjax({
        Url: '/api/link/deleteLink',
        RequestData: {
          _id: Id
        },
        Success: function (data) {
          That.$message('删除成功');
          That.GetData()
        }
      });
    },
    /*编辑标签*/
    EditFriendUrl: function (RowData) {
      this.OnOpenDialog();
      this.form = { ...RowData };
    },
    // 翻页方法
    ChangeCurPage: function (CurPage) {
      this.MyCurPage = CurPage - 1;
      this.GetData()
    },
    NextPage: function (CurPage) {
      this.MyCurPage = CurPage - 1;
      this.GetData()
    },

  },
  mounted: function () {
    this.GetData();
    this.bus.$emit('Topbar', {
      MenuHighLight: '5'
    });
  }
}
</script>

<style scoped></style>
