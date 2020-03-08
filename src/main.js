import Vue from "vue";
import App from "./App.vue";

import { Form, FormItem, Button, ButtonGroup, DatePicker, CheckboxGroup, CheckboxButton, Checkbox, MessageBox, Message } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import Calender from "../dist/vuejs-simple-calendar";

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

Vue.use(Calender);

new Vue({
  el: "#app",
  render: h => h(App)
})
