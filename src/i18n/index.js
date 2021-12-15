import Vue from 'vue'
import VueI18n from 'vue-i18n'

// 国际化
Vue.use(VueI18n);

const i18n = new VueI18n({
    silentFallbackWarn: true,
    locale: 'zhcn', // 语言标识
    missing: (lang, key) => { // 如果翻译不到取 最后一个 . 后的字符串
        if (key && key.indexOf('.') >= 0) {
            return key.substring(key.lastIndexOf('.') + 1)
        }
        return key
    }
})

const setLang = (lang, data) => {
    i18n.setLocaleMessage(lang, data)
}

export {
    i18n,
    setLang
}

