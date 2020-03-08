const formatModule = {
    data: function () {
        return {
            days: [{
                label: "六",
                weekday: 0
            },
            {
                label: "一",
                weekday: 1
            },
            {
                label: "二",
                weekday: 2
            },
            {
                label: "三",
                weekday: 3
            },
            {
                label: "四",
                weekday: 4
            },
            {
                label: "五",
                weekday: 5
            },
            {
                label: "日",
                weekday: 6
            }
            ],
            allCheckedDate: [0, 1, 2, 3, 4, 5, 6]
        };
    },
    methods: {
        sortUp (property, isNumber) { // 一维对象数组升序排序
            return function (a, b) {
                if (isNumber === true) {
                    var A = Number(a[property]);
                    var B = Number(b[property]);
                } else {
                    A = a[property];
                    B = b[property];
                }
                if (A < B) {
                    return -1;
                } else if (A > B) {
                    return 1;
                } else {
                    return 0;
                }
            };
        },
        // 初始化选中月份星期数据
        initCurrentMonth (date) {
            const y = date.getFullYear(); const m = date.getMonth();
            const todayDateStr = this.today.dateStr;
            let lastDateOfMonth = new Date(y, m + 1, 0).getDate(); // 当月最后一天 天数

            const startDateStr = this.startDateStr; const endDateStr = this.endDateStr;

            let weeks = []; let week = []; let lastIndex = 1;

            for (let i = 1; i <= lastDateOfMonth; i++) {
                let currentDate = new Date(y, m, i);

                let currentWeekday = currentDate.getDay();
                let currentDateStr = this.formatDateToStr(currentDate);
                let currentDisabled = false;

                if (i === 1) { // 上月日期
                    for (let k = 0, lenk = currentWeekday; k < lenk; k++) {
                        let label = new Date(y, m, i - currentWeekday + k).getDate();
                        week.push({
                            label,
                            current: false
                        });
                    }
                }

                if (startDateStr !== null && currentDateStr < startDateStr) { // 判断prop开始时间外禁选
                    currentDisabled = true;
                }

                if (endDateStr !== null && currentDateStr > endDateStr) { // 判断prop结束时间外禁选
                    currentDisabled = true;
                }

                week.push({
                    weekday: currentWeekday,
                    label: i,
                    current: true,
                    selected: false,
                    disabled: currentDisabled,
                    selectedDisabled: false,
                    today: todayDateStr === currentDateStr,
                    dateStr: currentDateStr
                });

                // 周六则闭合
                if (currentWeekday === 6) {
                    weeks.push(week);
                    week = [];
                } else if (i === lastDateOfMonth) { // 下月日期
                    for (let t = currentWeekday; t < 6; t++) {
                        let label = new Date(y, m, i + lastIndex).getDate();
                        week.push({
                            label,
                            current: false
                        });
                        lastIndex++;
                    }
                    weeks.push(week);
                }
            }

            // 判断有没有6周
            let weeksLen = weeks.length;
            for (let j = 0, lenJ = 6 - weeksLen; j < lenJ; j++) {
                let voidWeek = [];
                for (let n = 0; n < 7; n++) {
                    let label = new Date(y, m, lastDateOfMonth + lastIndex).getDate();
                    voidWeek.push({
                        label,
                        current: false
                    });
                    lastIndex++;
                }
                weeks.push(voidWeek);
            }

            return weeks;
        },
        // 获取月份区间
        getMonthRange (start, end) {
            let startDate = start;
            let endDate = end;
            let months = [];
            while (endDate.getTime() >= startDate.getTime()) {
                let year = startDate.getFullYear();
                let month = startDate.getMonth();
                let monthStr = month + 1;
                monthStr = monthStr < 10 ? ("0" + monthStr) : monthStr;
                months.push(`${year}-${monthStr}`);
                startDate = new Date(year, month, startDate.getDate() + 1); // + 1 天
            }
            months = Array.from(new Set(months));
            return months;
        },
        // 时间转字符串
        formatDateToStr (date) {
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            m = m < 10 ? ("0" + m) : m;
            let d = date.getDate();
            d = d < 10 ? ("0" + d) : d;

            return `${y}-${m}-${d}`;
        }
    }
};

export default formatModule;
