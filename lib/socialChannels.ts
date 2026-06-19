export type SocialChannel = {
  kind: 'wechat' | 'xiaohongshu'
  name: string
  handle?: string
  description?: string
  href?: string
  qrSrc?: string
  qrAlt?: string
}

// Put QR images under public/static/images/social and use paths like
// /static/images/social/wechat-qr.jpg.
const socialChannels: SocialChannel[] = [
  {
    kind: 'wechat',
    name: '公众号',
    handle: '煜研',
    description: '文章同步、技术笔记和长期思考。',
    href: '',
    qrSrc: '/static/images/social/wechat-qr.jpg',
    qrAlt: '公众号二维码',
  },
  {
    kind: 'xiaohongshu',
    name: '小红书',
    handle: 'rednote ID: 972389367',
    description: 'AI 初创公司后端程序员，AI Agent 学习中，持续分享学习经验和实践感悟。',
    href: '',
    qrSrc: '/static/images/social/xiaohongshu-qr.jpg',
    qrAlt: '小红书二维码',
  },
]

export default socialChannels
