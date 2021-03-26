import Vue from 'vue'
import validate from './validate.vue'

let Validate = Vue.extend(validate)

let formate = {
    style: 'style',
    validate: true
}

export function validateOne(element, msg) {
    let preNode = element.srcElement.parentNode.querySelector('.validate')
    preNode && element.srcElement.parentNode.removeChild(preNode)
    if (msg) {
        let validateElement = new Validate({ data: { msg } }).$mount()
        element.srcElement.parentNode.appendChild(validateElement.$el)
        element.srcElement.style.border = '1px solid red'
    } else {
        element.srcElement.style.border = ''
    }
}

export function validateAll(parentNode) {
    if (!parentNode) return
    clear(parentNode)
    let nodes = parentNode.querySelectorAll('.el-input')
    nodes.forEach(item => {
        item.__vue__.handleBlur({
            isActive: true,
            srcElement: item.querySelector('input.el-input__inner')
        })
    })
}

export function clear(parentNode) {
    if (!parentNode) return
    let nodes = parentNode.querySelectorAll('.el-input')
    nodes.forEach(item => {
        let preNode = item.querySelector('.validate')
        preNode && item.removeChild(preNode)
        let input = item.querySelector('input.el-input__inner')
        input && (input.style.border = '')
    })
}
