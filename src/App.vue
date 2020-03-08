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

<style lang="less" scoped>
    .main {
        width: 1000px;
        margin: 100px auto;
    }
</style>