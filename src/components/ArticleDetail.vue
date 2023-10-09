<template>
  <div>
    <div class="RightContent">
      <div class="ArticleDetail">
        <h1>{{　Article.Title　}}</h1>
        <div v-html="Article.Content">
          <!-- {{ Article.Content }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from "./TopBar";

export default {
  name: "ArticleDetail",
  data: function() {
    return {
      Article: ""
    };
  },
  beforeCreate: function() {
    var that = this;

    this.SQAjax({
      Url: "/api/blogs/detail",
      RequestData: {
        id: this.$route.params.id
      },
      Success: function(data) {
        console.log(data);
        that.Article = data.data;
      }
    });
  },
  mounted: function() {
    this.bus.$emit("Topbar", {
      MenuHighLight: "1"
    });
  },
  components: {
    TopBar: TopBar
  }
};
</script>

<style scoped>
</style>
