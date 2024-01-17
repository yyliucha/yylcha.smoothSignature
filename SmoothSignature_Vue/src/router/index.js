import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import SmoothSignature from '@/components/smoothSignature'
import HeTong from '@/components/hetong'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/hello',
    name: 'HelloWorld',
    component: HelloWorld
  }, {
    path: '/',
    name: 'hetong',
    component: HeTong
  }]
})
