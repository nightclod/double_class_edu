export default {
  head: {
    titleTemplate: '%s双师',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '书山府双师教育局后台系统' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Noto+Sans+SC:100,300,400,500,700,900' }
    ]
  },
  server: {
    port: 3070,
    timing: false
  },

  css: [
    'element-ui/lib/theme-chalk/index.css',
    'assets/scss/main.css',
    '@/assets/icon/iconfont.css',
    'overlayscrollbars/css/OverlayScrollbars.css',
    'assets/scss/scrollbar.scss',
  ],
  
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/pubilc.js',
    '@/plugins/axios',
    '@/plugins/echarts.js',
    { src: '@/assets/icon/iconfont.js', mode: 'client' },
    { src: '@/plugins/scrollbar', ssr: false },
  ],

  components: true,

  buildModules: [
  ],

  modules: [
    'cookie-universal-nuxt',
    '@nuxtjs/proxy',
    '@nuxtjs/axios'
  ],

  axios: {
    retry: { retries: 3 },
    proxy: true,
    prefix: '/index', // 表示给请求url加个前缀 /api
  },

  proxy: {
    '/index': {
      target: 'http://192.168.3.87:82/api/bureau', //http://192.168.3.87:82/api/bureau     https://www.incourse.com.cn/api/bureau
      changeOrigin: true, // 表示是否跨域
      pathRewrite: {
        '^/index': '', 
      }
    }
  },

  build: {
    transpile: [/^element-ui/],
  }
}
