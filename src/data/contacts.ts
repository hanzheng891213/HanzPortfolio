export interface ContactItem {
  icon: string
  label: string
  link: string
  copyValue: string
}

export const contacts: ContactItem[] = [
  {
    icon: 'fa-solid fa-mobile-screen',
    label: '18436682445',
    link: 'tel:18436682445',
    copyValue: '18436682445'
  },
  {
    icon: 'fa-solid fa-envelope',
    label: '1728907574@qq.com',
    link: 'mailto:1728907574@qq.com',
    copyValue: '1728907574@qq.com'
  },
  {
    icon: 'fa-solid fa-location-dot',
    label: '华北水利水电大学',
    link: 'https://www.ncwu.edu.cn',
    copyValue: '华北水利水电大学'
  },
  {
    icon: 'fa-brands fa-weixin',
    label: '微信: EasyGoose',
    link: 'https://weixin.qq.com',
    copyValue: 'EasyGoose'
  },
  {
    icon: 'fa-brands fa-github',
    label: 'GitHub',
    link: 'https://github.com/hanzheng891213',
    copyValue: 'https://github.com/hanzheng891213'
  }
]
