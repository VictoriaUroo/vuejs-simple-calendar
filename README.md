#### 基本说明

基于 vue 和 elementUI 框架写的一个简单日历组件。

支持单选，多选，批量选中星期某日，可选中日期范围，设置禁止选中及不可更改日期。

#### 如何使用

##### 1. 安装
`npm install vuejs-simple-calendar`

##### 2. 注册elementUI
组件表单部分的功能直接用的elementUI组件，所以需要引入elementUI，后期会重写。

具体看https://element.eleme.cn/#/zh-CN/component/quickstart
可以引用全部ElementUI组件，也可以按需引入。

按需引入用到一下组件：
``` javascript
// main.js

...
import { Form, FormItem, Button, ButtonGroup, DatePicker, CheckboxGroup, CheckboxButton, Checkbox, MessageBox, Message } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(DatePicker);
Vue.use(CheckboxGroup);
Vue.use(CheckboxButton);
Vue.use(Checkbox);

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
...
```

##### 2. 全局注册日历组件

``` javascript
// main.js
...
import Calender from "../dist/vuejs-simple-calendar";
...
Vue.use(Calender);
...
```

``` html
// xxx.vue

<template>
    <div class="main">
        <calendar 
            v-model="calendar.selects" 
            :start-date="calendar.startDate" 
            :end-date="calendar.endDate" 
            :type="calendar.type" 
            :disabled-selects="calendar.disabledSelects" 
            :disabled-dates="calendar.disabledDates" 
            :multiple-control="calendar.multipleControl">
        </calendar>
    </div>
</template>

<script>
    export default {
        name: "index",
        data: function() {
            return {
                calendar: {
                    selects: ["2020-03-07"],
                    startDate: new Date("2020-01-01"),
                    endDate: new Date("2020-04-01"),
                    type: "multiple",
                    disabledSelects: ["2020-03-01"],
                    disabledDates: ["2020-03-05"],
                    multipleControl: true
                }
            };
        },
        methods: {},
        created() {},
        mounted() {}
    };
</script>
```

#### Options

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| :--: | :--: | :--: | :--: | :--: |
| v-model | 绑定值 | Array | - | 空数组 |
| type | 日历类型（单选/多选） | String | single/multiple| multiple |
| startDate | 限制可选日期范围的开始时间 | Date | - | null |
| endDate | 限制可选日期范围的结束时间 | Date | - | null ||
| disabledSelects | 禁止点击，但显示已选中高亮状态的日期 | Array | - | 空数组 |
| disabledDates | 禁止点击，并置灰的日期 | Array | - | 空数组 |
| multipleControl | 是否显示批量选中日期控制器 | true/false| - | true |
