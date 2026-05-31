import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/global.css'

/* ===== Font Awesome ===== */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Solid icons
import {
  faGraduationCap,
  faLaptopCode,
  faMobileScreen,
  faEnvelope,
  faLocationDot,
  faComment,
  faChevronLeft,
  faChevronRight,
  faSun,
  faMoon,
  faCode,
  faGears,
  faNetworkWired,
  faEllipsis,
  faPenToSquare,
  faHeart,
  faXmark,
  faCircleUser,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons'

// Brand icons
import {
  faGithub,
  faVuejs,
  faWeixin
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faGraduationCap,
  faLaptopCode,
  faMobileScreen,
  faEnvelope,
  faLocationDot,
  faComment,
  faChevronLeft,
  faChevronRight,
  faSun,
  faMoon,
  faCode,
  faGears,
  faNetworkWired,
  faEllipsis,
  faPenToSquare,
  faHeart,
  faXmark,
  faCircleUser,
  faCircleInfo,
  faGithub,
  faVuejs,
  faWeixin
)

const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.mount('#app')
