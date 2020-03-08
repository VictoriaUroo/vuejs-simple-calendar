<template>
    <div class="calendar">
        <!-- 日历切换 -->
        <div class="calendar-header">
            <!-- 年切换 -->
            <div class="year-picker">
                <span class="pre" :class="{disabled: disables.yearPre}" @click="currentChange('year', 'pre')">
                    &lt;
                </span>
                <p class="year-info">
                    {{current.year}} 年
                </p>
                <span class="next" :class="{disabled: disables.yearNext}" @click="currentChange('year', 'next')">
                    &gt;
                </span>
            </div>
            <!-- 月切换 -->
            <div class="month-picker">
                <span class="pre" :class="{disabled: disables.monthPre}" @click="currentChange('month', 'pre')">
                    &lt;
                </span>
                <p class="month-info">
                    {{current.month}} 月
                </p>
                <span class="next" :class="{disabled: disables.monthNext}" @click="currentChange('month', 'next')">
                    &gt;
                </span>
            </div>
        </div>
        <div class="calendar-body">
            <!-- 日历 -->
            <table class="calendar-table">
                <!-- 星期 -->
                <thead>
                    <tr>
                        <th v-for="day in days" :key="day.label">
                            {{day.label}}
                        </th>
                    </tr>
                </thead>
                <!-- 天数 -->
                <tbody>
                    <tr v-for="(week, indexW) in months[current.year][current.month]" :key="'week'+indexW">
                        <td v-for="(date, indexD) in week" :key="date.dateStr">
                            <div v-if="date.current" class="calendar-cell calendar-cell-current" :class="{selected : date.selected, disabled: date.disabled, selectedDisabled: date.selectedDisabled, today: date.today}" @click="cellClick(indexW, indexD)">
                                <p>{{date.label}}</p>
                            </div>
                            <div v-else class="calendar-cell calendar-cell-disable">
                                <p>{{date.label}}</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 批量选中日期 -->
        <div v-if="type === 'multiple' && multipleControl" class="calendar-footer">
            <p class="calendar-title">
                批量选择的日期将与已选中日期重合
            </p>
            <el-form :inline="true" :model="insertDateForm" ref="insertDateForm" :rules="rules" size="small">
                <!-- 开始/结束时间选择 -->
                <el-form-item label="日期范围" prop="dateRange">
                    <el-date-picker v-model="insertDateForm.dateRange" type="daterange" :clearable="false" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="Start Date" end-placeholder="End Date">
                    </el-date-picker>
                </el-form-item>
                <!-- 星期选择 -->
                <el-form-item label="星期" prop="checkedDays" class="clearfix">
                    <el-checkbox-group v-model="insertDateForm.checkedDays" style="float:left;" @change="checkedDaysChange">
                        <el-checkbox-button v-for="day in days" :label="day.weekday" :key="day.label">
                            {{day.label}}
                        </el-checkbox-button>
                    </el-checkbox-group>
                    <el-checkbox v-model="daysCheckAll" style="float: left; margin-left: 20px;" @change="daysCheckAllChange">All</el-checkbox>
                </el-form-item>
                <!-- 批量选中按钮 -->
                <el-form-item>
                    <el-button-group>
                        <el-button type="primary" size="small" @click="insertDateFormSubmit">批量选择日期</el-button>
                        <el-button type="info" size="small" @click="resetInsertDateForm">重置</el-button>
                    </el-button-group>
                </el-form-item>
            </el-form>
            <div class="solid-hr"></div>
            <!-- 清除选中按钮 -->
            <el-button type="info" size="small" @click="clearSelectsConfirm">清除所有选中</el-button>
        </div>
    </div>
</template>

<script>
    import format from "./format.js";

    export default {
        name: "calendar",
        mixins: [format],
        props: {
            type: { // single | multiple ，日历单选|多选
                type: String,
                default: "multiple"
            },
            startDate: { // 开始时间 Date
                type: Date,
                default: null
            },
            endDate: { // 结束时间 Date
                type: Date,
                default: null
            },
            selects: { // v-model 语法糖 prop
                type: Array,
                default: function() {
                    return [];
                },
                required: true
            },
            disabledSelects: { // 禁点的已选中date
                type: Array,
                default: function() {
                    return [];
                }
            },
            disabledDates: { // 禁止选中的date
                type: Array,
                default: function() {
                    return [];
                }
            },
            multipleControl: { // 是否展示日历多选控制器
                type: Boolean,
                default: true
            }
        },
        data: function() {
            return {
                months: {}, // 年月 对象
                current: { // 当前年月
                    year: "",
                    month: "",
                    monthStr: ""
                },
                today: { // 今日
                    year: "",
                    month: "",
                    dateStr: "",
                    monthStr: ""
                },
                singlePreSelect: { // 单选情况下，上一个选中
                    year: "",
                    month: "",
                    indexW: "",
                    indexD: "",
                    hasVal: false
                },
                insertDateForm: { // 插入选中日期表单
                    dateRange: [],
                    checkedDays: []
                },
                daysCheckAll: false, // 插入选中日期选择 全选
                rules: { // 表单规则
                    dateRange: {
                        required: true,
                        message: "必填项"
                    },
                    checkedDays: {
                        required: true,
                        message: "必填项"
                    }
                },
                disables: { // 日历切换禁用控制
                    yearPre: false,
                    yearNext: false,
                    monthPre: false,
                    monthNext: false
                },
                startDateStr: null, // 开始时间字符串
                endDateStr: null, // 结束时间字符串
                selectsInfo: {} // 记录选中过的日期 indexW indexD
            };
        },
        model: { // v-model 语法糖初始化
            prop: "selects",
            event: "change"
        },
        watch: {
            // v-model 语法糖事件
            selects(val) {
                this.$emit("change", val);
            },
            disabledSelects() {
                this.initDisabledSelects();
            },
            disabledDates() {
                this.initDisable();
            }
        },
        methods: {
            // 初始已选中，禁止修改的日期
            initDisabledSelects() {
                let disabledSelects = this.disabledSelects;
                if (disabledSelects.length > 0) {
                    this.initDate(this.disabledSelects, "disabledSelects");
                }
            },
            // 初始禁止选中日期
            initDisable() {
                let disabledDates = this.disabledDates;
                if (disabledDates.length > 0) {
                    this.initDate(disabledDates, "disabled");
                }
            },
            // 初始已选中
            initSelects() {
                let selects = this.selects;

                if (this.type === "multiple") { // 多选
                    if (selects.length > 0) {
                        this.initDate(selects, "selects");
                    }
                } else { // 单选
                    if (selects.length > 1) {
                        this.$message({
                            message: "单选模式，配置了超过一个选中日期，请检查。",
                            type: "warning"
                        });
                    } else {
                        this.initDate(selects, "selects");
                    }
                }
            },
            // 初始日期状态
            initDate(datas, type) {
                let months = this.months;
                let selectsInfo = this.selectsInfo;

                // 处理当前日期状态
                function cellHandle(cell, date) {
                    if (type === "selects") { // 已选中
                        cell.selected = true;
                    }

                    if (type === "disabledSelects") { // 已选中且禁止点击
                        cell.selectedDisabled = true;
                    }

                    if (type === "disabled") { // 禁止选中
                        cell.disabled = true;
                    }
                }

                datas.forEach(date => {
                    let dateStr = date;

                    let y = dateStr.slice(0, 4);
                    let m = dateStr.slice(5, 7);
                    let monthStr = dateStr.slice(0, 7);
                    let month;

                    // 判断months[y][m]是否存在
                    if (months.hasOwnProperty(y)) {
                        if (months[y].hasOwnProperty(m)) {
                            month = months[y][m];
                        } else {
                            month = this.setNewMonth(y, m, monthStr);
                        }
                    } else {
                        month = this.setNewMonth(y, m, monthStr);
                    }

                    if (selectsInfo.hasOwnProperty(dateStr)) { // 检查日期有没有记录indexW, indexD
                        let selectInfo = selectsInfo[dateStr];
                        let cell = month[selectInfo.indexW][selectInfo.indexD];

                        cellHandle(cell, date);
                    } else { // 没有被记录，遍历查找
                        for (let w = 0; w < month.length; w++) {
                            for (let d = 0; d < month[w].length; d++) {
                                let cell = month[w][d];
                                if (cell.dateStr === dateStr) {
                                    cellHandle(cell, date);

                                    selectsInfo[dateStr] = {
                                        indexW: w,
                                        indexD: d
                                    };

                                    return false; // 找到则跳出查找
                                }
                            }
                        }
                    }
                });
            },
            // 全选检查
            checkedDaysChange(val) {
                this.daysCheckAll = val.length === this.allCheckedDate.length;
            },
            // 全选
            daysCheckAllChange(val) {
                this.insertDateForm.checkedDays = val ? this.allCheckedDate : [];
            },
            // 重置数据
            resetAllDates() {
                this.clearSelects(true);
                this.resetInsertDateForm();
                this.currentTodayMonth();
            },
            // 清除选中确认
            clearSelectsConfirm() {
                this.$confirm("是否确认清除所有选中日期", "警告", {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.clearSelects();
                }).catch(() => {
                    "cancel";
                });
            },
            // 清除选中
            clearSelects(clearText) {
                let months = this.months;
                let selects = this.selects;
                let selectsInfo = this.selectsInfo;

                selects.forEach(select => {
                    let dateStr = select;

                    let y = dateStr.slice(0, 4);
                    let m = dateStr.slice(5, 7);
                    let selectInfo = selectsInfo[dateStr];

                    let currentSelect = months[y][m][selectInfo.indexW][selectInfo.indexD];
                    currentSelect.selected = false;
                });

                selects.splice(0, selects.length);
            },
            // 添加新月份数据到months
            setNewMonth(year, month, monthStr) {
                let months = this.months;
                let weeks;

                if (typeof(months[year]) === "undefined") { // months没有当年的数据，则set新年月数据到数组中
                    let currentDate = new Date(monthStr);
                    weeks = this.initCurrentMonth(currentDate);
                    this.$set(months, year, {});
                    this.$set(months[year], month, weeks);
                } else { // months有当年的数据
                    weeks = this.months[year][month]; // 获取当月数据
                    if (typeof(weeks) === "undefined") { // 没有当月数据
                        let currentDate = new Date(monthStr);
                        weeks = this.initCurrentMonth(currentDate);
                        this.$set(months[year], month, weeks); // set新月数据到数组中
                    }
                }

                return weeks; // 返回当月的星期数据
            },
            // 检查日期切换禁用控制
            checkCurrentChange() {
                let current = this.current;
                let disables = this.disables;
                const startDateStr = this.startDateStr;
                const endDateStr = this.endDateStr;

                if (startDateStr !== null) { // prop 开始时间不为空
                    const start = {
                        year: startDateStr.slice(0, 4),
                        monthStr: startDateStr.slice(0, 7)
                    };

                    let preYear = Number(current.year) - 1;
                    disables.yearPre = `${preYear}-${current.month}` < start.monthStr; // prev year，上一年当月与 prop 开始时间相比
                    disables.monthPre = startDateStr.slice(0, 7) >= current.monthStr; // prev month，上一月与 prop 开始时间相比
                }

                if (endDateStr !== null) { // prop 结束时间不为空
                    const end = {
                        year: endDateStr.slice(0, 4),
                        monthStr: endDateStr.slice(0, 7)
                    };

                    let nextYear = Number(current.year) + 1;
                    disables.yearNext = `${nextYear}-${current.month}` > end.monthStr; // next year，下一年当月与 prop 结束时间相比
                    disables.monthNext = endDateStr.slice(0, 7) <= current.monthStr; // next month，下一月与 prop 结束时间相比
                }
            },
            // 日历批量插入星期
            insertCheckedDate() {
                let self = this;
                const insertDateForm = this.insertDateForm;
                const checkedDays = insertDateForm.checkedDays;

                // 判断全局开始/结束时间
                let startDateStr = insertDateForm.dateRange[0];
                let endDateStr = insertDateForm.dateRange[1];
                let startDate = new Date(startDateStr);
                let endDate = new Date(endDateStr);

                const startDateGloStr = this.startDateStr;
                const endDateGloStr = this.endDateStr;

                if (startDateGloStr > startDateStr) { // 选择的开始时间和 prop 开始时间 作对比
                    startDateStr = startDateGloStr;
                    startDate = this.startDate;
                }

                if (endDateGloStr < endDateStr) { // 选择的结束时间和 prop 结束时间 作对比
                    endDateStr = endDateGloStr;
                    endDate = this.endDate;
                }

                // 获取开始时间和结束时间的年月份区间
                let selectedMonths = this.getMonthRange(startDate, endDate);

                // 遍历年月份区间
                selectedMonths.forEach(month => {
                    let y = month.slice(0, 4);
                    let m = month.slice(5, 7);

                    let weeks = this.setNewMonth(y, m, month);

                    // 处理选中状态
                    weeks.forEach((week, indexW) => {
                        week.forEach((date, indexD) => {
                            let weekday = date.weekday;
                            let current = date.current;
                            if (current && typeof(weekday) !== "undefined" && checkedDays
                                .includes(weekday) && // 是当月数据，并且是选中的星期
                                date.dateStr >= startDateStr && date.dateStr <= endDateStr) {
                                date.selected = true;

                                self.selectsPush(date, indexW, indexD);
                            }
                        });
                    });
                });
            },
            // 批量插入表单规则验证
            insertDateFormSubmit() {
                this.$refs.insertDateForm.validate((valid) => {
                    if (valid) {
                        this.insertCheckedDate();
                    } else {
                        return false;
                    }
                });
            },
            // 重置表单
            resetInsertDateForm() {
                this.$refs.insertDateForm.resetFields();
                this.daysCheckAll = false;
            },
            // 当前年月份变更事件
            currentChange(type, direction) {
                let current = this.current;
                let disables = this.disables;
                const currentDate = new Date(current.monthStr);
                let y = currentDate.getFullYear();
                let m = currentDate.getMonth();

                let newCurrent;
                if (type === "year") {
                    if (direction === "pre") {
                        if (disables.yearPre) {
                            return false;
                        } else {
                            y--;
                        }
                    } else {
                        if (disables.yearNext) {
                            return false;
                        } else {
                            y++;
                        }
                    }
                } else {
                    if (direction === "pre") {
                        if (disables.monthPre) {
                            return false;
                        } else {
                            m--;
                        }
                    } else {
                        if (disables.monthNext) {
                            return false;
                        } else {
                            m++;
                        }
                    }
                }

                newCurrent = new Date(y, m);

                let monthStr = this.formatDateToStr(newCurrent).slice(0, 7);
                current.monthStr = monthStr;
                current.year = monthStr.slice(0, 4);
                current.month = monthStr.slice(5, 7);

                this.setNewMonth(current.year, current.month, monthStr);

                // 检查日期切换禁用控制
                this.checkCurrentChange();
            },
            // table cell 单击事件
            cellClick(indexW, indexD) {
                let selects = this.selects;
                let current = this.current;
                let currentCell = this.months[current.year][current.month][indexW][indexD]; // 当前选中日期

                if (!currentCell.selectedDisabled && !currentCell.disabled) { // 非禁选日期
                    if (this.type === "multiple") { // 多选
                        currentCell.selected = !currentCell.selected;

                        if (currentCell.selected) {
                            this.selectsPush(currentCell, indexW, indexD);
                        } else {
                            let index = selects.findIndex(val => {
                                return val === currentCell.dateStr;
                            });
                            selects.splice(index, 1);
                        }
                    } else { // 单选
                        currentCell.selected = !currentCell.selected;

                        let singlePre = this.singlePreSelect;

                        if (currentCell.selected) { // 从未选中到选中
                            if (typeof(selects[0]) !== "undefined" && singlePre.hasVal) {
                                this.months[singlePre.year][singlePre.month][singlePre.indexW][singlePre.indexD]
                                    .selected = false;
                            }

                            selects.splice(0, selects.length);

                            this.selectsPush(currentCell, indexW, indexD);

                            // 当选的上一个选中日期位置
                            singlePre.year = current.year;
                            singlePre.month = current.month;
                            singlePre.indexW = indexW;
                            singlePre.indexD = indexD;
                            singlePre.hasVal = true;
                        } else { // 从选中到取消
                            selects.splice(0, selects.length);
                            singlePre.hasVal = false;
                        }
                    }
                }
            },
            // 新增选中日期
            selectsPush(date, indexW, indexD) {
                let selects = this.selects;
                let disabledSelects = this.disabledSelects;
                let disabledDates = this.disabledDates;

                if (!selects.includes(date.dateStr) && !disabledSelects.includes(date.dateStr) &&
                    !disabledDates.includes(date.dateStr)) {
                    selects.push(date.dateStr);
                    selects.sort(); // 排序
                }

                this.selectsInfo[date.dateStr] = { // 按日期字符串记录indexW, indexD
                    indexW,
                    indexD
                };
            },
            // reset 显示的month
            currentTodayMonth() {
                let today = this.today;
                let current = this.current;

                current.year = today.year;
                current.month = today.month;
                current.monthStr = today.monthStr;

                this.setNewMonth(current.year, current.month, current.monthStr);
            },
            // 初始化today的数据
            initToday() {
                let now = new Date();
                let todayStr = this.formatDateToStr(now);

                let current = this.current;
                current.year = todayStr.slice(0, 4);
                current.month = todayStr.slice(5, 7);
                current.monthStr = `${current.year}-${current.month}`;

                this.today = {
                    ...current
                };
                this.today.dateStr = todayStr;

                this.setNewMonth(current.year, current.month, current.monthStr);
            },
            // 检查prop Date是否是Date格式
            checkPropDate(type) {
                let date, msg;
                if (type === "start") {
                    date = this.startDate;
                    msg = "开始时间数据类型错误，请使用Date数据类型。";
                } else {
                    date = this.endDate;
                    msg = "结束时间数据类型错误，请使用Date数据类型。";
                }

                if (date !== null) {
                    if (date instanceof Date) {
                        let dateStr = this.formatDateToStr(date);
                        if (type === "start") {
                            this.startDateStr = dateStr;
                        } else {
                            this.endDateStr = dateStr;
                        }
                    } else {
                        date = null;
                        this.$message({
                            message: msg,
                            type: "warning"
                        });
                    }
                }
            },
            // 初始化 props startDate, endDate
            initProps() {
                this.type = this.type !== "single" ? "multiple" : "single";

                this.checkPropDate("start");
                this.checkPropDate("end");
            }
        },
        created() {
            this.initProps(); // 初始化 props startDate, endDate
            this.initToday(); // 初始化today的数据
            this.checkCurrentChange(); // 检查日期切换禁用控制
        },
        mounted() {
            this.initSelects(); // 初始化已选中
            this.initDisabledSelects(); // 初始化已选中且禁止更改
            this.initDisable(); // 初始化禁止选择
        }
    };
</script>

<style lang="less" scoped>
    .calendar {
        user-select: none;

        table,
        table tr th,
        table tr td {
            border: 1px solid #eee;
            padding: 0;
            margin: 0;
        }
    }

    .calendar-header {
        width: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;

        .year-picker,
        .month-picker {
            width: 300px;
            height: 50px;
            display: flex;
            justify-content: space-between;
            margin: 0 60px;
            font-weight: bold;
            font-size: 16px;
            letter-spacing: 1px;
            line-height: 50px;

            .pre,
            .next {
                width: 30px;
                font-family: simsun;
                font-weight: bold;
                transition: all .3;

                &:hover {
                    cursor: pointer;
                    color: #409EFF;
                }

                &.disabled {
                    color: #ccc;
                    cursor: not-allowed;
                }
            }

            .year-info, .month-info {
                margin: 0;
            }
        }
    }

    .calendar-body {
        margin: 10px 0 30px 0;
    }

    .calendar-table {
        table-layout: fixed;
        word-break: break-all;
        width: 100%;
        border-collapse: collapse;

        th {
            height: 50px;
        }

        td {
            height: 80px;
        }

        .calendar-cell {
            height: 100%;
            padding: 5px 10px;
            text-align: right;
        }

        .calendar-cell-current {

            &:hover {
                cursor: pointer;
            }

            &.selected {
                color: #1890ff;
                background-color: #e6f7ff;
            }

            &.today {
                border-top: 2px solid #1890ff;

                .text-block {
                    position: relative;
                    top: -2px;
                }
            }

            &.disabled {
                color: #ccc;
                cursor: not-allowed;
            }

            &.selectedDisabled {
                color: #606266;
                background-color: #e6f7ff;
                cursor: not-allowed;
            }
        }

        .calendar-cell-disable {
            color: #ccc;

            &:hover {
                cursor: not-allowed;
            }
        }
    }

    .calendar-footer {
        .calendar-title {
            margin-bottom: 10px;
        }

        .el-form-item {
            margin-right: 30px;

            &:last-of-type {
                margin-right: 0;
            }
        }

        .el-checkbox {
            margin-right: 0;
        }

        .solid-hr {
            height: 1px;
            width: 100%;
            background-color: #eee;
            margin-bottom: 18px;
        }
    }
</style>