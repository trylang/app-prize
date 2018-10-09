import MaInputVue from './maInput.vue'
// 这里是重点
const MaInput = {
    install: function (Vue) {
        Vue.component('MaInput', MaInputVue)
    }
}

// 导出组件
export default MaInput