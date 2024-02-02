import Article from '@/components/Article'
import ArticleDetail from '@/components/ArticleDetail'
import Comment from '@/components/Comment'
import FriendUrlIndex from '@/components/FriendUrlIndex'
import Heartfelt from '@/components/Heartfelt'
import LoginPage from '@/components/LoginPage'
import MessageLeave from '@/components/MessageLeave'
import SnakeScores from '@/components/SnakeScores'
import TagIndex from '@/components/TagIndex'
import TimeLine from '@/components/TimeLine'
import TopBar from '@/components/TopBar'
import WriteArticle from '@/components/WriteArticle'
import index from '@/components/index'
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    }, {
      path: '/Article',
      name: 'Article',
      component: Article
    }, {
      path: '/ArticleDetail/:id',
      name: 'ArticleDetail',
      component: ArticleDetail
    }, {
      path: '/WriteArticle/:id',
      name: 'WriteArticle',
      component: WriteArticle
    }, {
      path: '/TagIndex',
      name: 'TagIndex',
      component: TagIndex
    }, {
      path: '/TopBar',
      name: 'TopBar',
      component: TopBar
    }, {
      path: '/LoginPage',
      name: 'LoginPage',
      component: LoginPage
    }, {
      path: '/TimeLine',
      name: 'TimeLine',
      component: TimeLine
    }, {
      path: '/Heartfelt',
      name: 'Heartfelt',
      component: Heartfelt
    }, {
      path: '/FriendUrlIndex',
      name: 'FriendUrlIndex',
      component: FriendUrlIndex
    }, {
      path: '/MessageLeave',
      name: 'MessageLeave',
      component: MessageLeave
    }, {
      path: '/Comment',
      name: 'Comment',
      component: Comment
    }, {
      path: '/SnakeScores',
      name: 'SnakeScores',
      component: SnakeScores
    }
  ]
})
