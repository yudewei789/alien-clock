<script setup lang="ts">
import { ref,onMounted,computed } from 'vue'
import {ADate} from '../ADate.ts'

import { message } from 'ant-design-vue';
import { notification } from 'ant-design-vue';


let intervalRef:any = null;
//默认系统时间
const sysTime = ref<number>(14400000);
const date1 = computed(() => new Date(sysTime.value));
const date2 = computed(() => new ADate(sysTime.value));
//当前时间与设置的系统时间之间的差 设置系统时间的时候固定
let diffMillisecond =  ref<number>(new Date().getTime() - sysTime.value);


function setSysTime(millisecond:number) {
  intervalRef && clearInterval(intervalRef);
  sysTime.value = millisecond;
  diffMillisecond.value =  new Date().getTime() - sysTime.value;
  intervalRef = setInterval(refreshClock, 500);
}

function refreshClock() {
  //根据真实时间 更新 系统时间  保证 长时间运行的 的准确性
  const realTime = new Date().getTime();
  sysTime.value = realTime - diffMillisecond.value;
  //判断闹钟
  if(alarmTime.value>0){
    const ms = alarmTime.value - sysTime.value
    if(ms >=0 && ms <=1000){
      notification.open({
        message: 'alarm',
        description:'alarm!!!!',
        duration: 0,
      });
      alarmTime.value = 0
    }
  }
}

onMounted(() => {
  setSysTime(14400000)
  // setSysTime(new Date().getTime())
});

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}





const open=ref<boolean>(false)
const isAlen=ref<boolean>(false)
const isAddAlarm=ref<boolean>(false)
const alarmTime = ref<number>(0);
const handleOk = () => {
  if(isAddAlarm.value){
    //设置闹钟
    setAlarm()
  }else{
    //配置系统时间
    setConfigTime()
  }
};

function setConfigTime(){
  if(isAlen.value){
    const date = new ADate(sysTime.value);
    try {
      date.setYear(year.value)
      date.setMonth(month.value)
      date.setDay(day.value)
      date.setHour(hour.value)
      date.setMinute(minute.value)
      date.setSecond(second.value)
      const time = date.getTime()
      setSysTime(time);
      open.value = false;
    }catch (e:any) {
      message.error(e.message);
    }
  }else{
    const date = new Date();
    try {
      date.setFullYear(year.value)
      date.setMonth(month.value-1)
      date.setDate(day.value)
      date.setHours(hour.value)
      date.setMinutes(minute.value)
      date.setSeconds(second.value)
      setSysTime(date.getTime());
      open.value = false;
    }catch (e:any) {
      message.error(e.message);
    }
  }
}
function setAlarm(){
  if(isAlen.value){
    const date = new ADate(sysTime.value);
    try {
      date.setYear(year.value)
      date.setMonth(month.value)
      date.setDay(day.value)
      date.setHour(hour.value)
      date.setMinute(minute.value)
      date.setSecond(second.value)
      const time = date.getTime()
      alarmTime.value = time
    }catch (e:any) {
      message.error(e.message);
    }
  }else{
    const date = new Date();
    try {
      date.setFullYear(year.value)
      date.setMonth(month.value-1)
      date.setDate(day.value)
      date.setHours(hour.value)
      date.setMinutes(minute.value)
      date.setSeconds(second.value)
      const time = date.getTime()
      alarmTime.value = time
    }catch (e:any) {
      message.error(e.message);
    }
  }
}

const year = ref<number>(0)
const month = ref<number>(0)
const day = ref<number>(0)
const hour = ref<number>(0)
const minute = ref<number>(0)
const second = ref<number>(0)
const openConfigTime = (type:boolean,addAlarm:boolean) => {
  isAddAlarm.value = addAlarm
  isAlen.value = type
  open.value = !open.value;
  if(isAlen.value){
    year.value = date2.value.getYear()
    month.value = date2.value.getMonth()+1
    day.value = date2.value.getDayOfMouth()
    hour.value = date2.value.getHour()
    minute.value = date2.value.getMinute()
    second.value = date2.value.getSecond()
  }else{
    year.value = date1.value.getFullYear()
    month.value = date1.value.getMonth()+1
    day.value = date1.value.getDate()
    hour.value = date1.value.getHours()
    minute.value = date1.value.getMinutes()
    second.value = date1.value.getSeconds()
  }
};




</script>

<template>





  <a-modal v-model:open="open" title="设置系统时间" @ok="handleOk" style="width: 700px">
    <template v-if="isAlen">
      <a-input-number v-model:value="year" size="small" :min="1" :max="1000000" />年
      <a-input-number v-model:value="month" size="small" :min="1" :max="18" />月
      <a-input-number v-model:value="day" size="small" :min="1" :max="40" />日
      <a-input-number v-model:value="hour" size="small" :min="0" :max="48" />时
      <a-input-number v-model:value="minute" size="small" :min="0" :max="89" />分
      <a-input-number v-model:value="second" size="small" :min="0" :max="89" />秒
    </template>
   <template v-else>
     <a-input-number v-model:value="year" size="small" :min="1" :max="1000000" />年
     <a-input-number v-model:value="month" size="small" :min="1" :max="12" />月
     <a-input-number v-model:value="day" size="small" :min="1" :max="31" />日
     <a-input-number v-model:value="hour" size="small" :min="0" :max="24" />时
     <a-input-number v-model:value="minute" size="small" :min="0" :max="59" />分
     <a-input-number v-model:value="second" size="small" :min="0" :max="59" />秒
   </template>
  </a-modal>

  <a-row>
    <a-col :span="12" :align="'center'">
      <a-button @click="openConfigTime(false,false)" type="primary">设置时钟</a-button>
      <h1>{{formatDate(date1)}}</h1>
    </a-col>
    <a-col :span="12" :align="'center'">
      <a-button @click="openConfigTime(true,false)" type="primary">设置时钟</a-button>
      <h1>{{date2.toString()}}</h1>
    </a-col>
    <a-col :span="12" :align="'center'" >
      <svg xmlns="http://www.w3.org/2000/svg" height="310px" width="310px">
        <circle cx="155" cy="155" r="150" stroke="black" stroke-width="2" fill="Lavender" />
        <line x1="155" y1="155" x2="155" y2="45" stroke="black" stroke-width="5" v-bind:transform="'rotate('+(date1.getHours()+date1.getMinutes()/60)*30 +',155,155)'"  />
        <line x1="155" y1="155" x2="155" y2="25" stroke="black" stroke-width="3" v-bind:transform="'rotate('+date1.getMinutes()*6+',155,155)'" />
        <line x1="155" y1="155" x2="155" y2="15" stroke="red" stroke-width="1" v-bind:transform="'rotate('+date1.getSeconds()*6+',155,155)'" />
        <circle cx="155" cy="155" r="4" stroke="black" stroke-width="2" fill="gray" />
        <g transform="translate(155,155)">
          <g v-for="item in 12" :key="'hour'+item" v-bind:transform="'rotate(' + (item * 30) + ') translate(0, -135) rotate(' + (-item * 30) + ')'" >
            <text x="0" y="0" text-anchor="middle" alignment-baseline="middle" font-size="24" font-family="Arial">
              {{ item }}
            </text>
          </g>
        </g>
      </svg>
    </a-col>
    <a-col :span="12" :align="'center'" >
      <svg xmlns="http://www.w3.org/2000/svg" height="310px" width="310px">
        <circle cx="155" cy="155" r="150" stroke="black" stroke-width="2" fill="Lavender" />
        <line x1="155" y1="155" x2="155" y2="45" stroke="black" stroke-width="5" v-bind:transform="'rotate('+(date2.getHour()+date2.getMinute()/90)*20 +',155,155)'"  />
        <line x1="155" y1="155" x2="155" y2="25" stroke="black" stroke-width="3" v-bind:transform="'rotate('+date2.getMinute()*4+',155,155)'" />
        <line x1="155" y1="155" x2="155" y2="15" stroke="red" stroke-width="1" v-bind:transform="'rotate('+date2.getSecond()*4+',155,155)'" />
        <circle cx="155" cy="155" r="4" stroke="black" stroke-width="2" fill="gray" />
        <g transform="translate(155,155)">
          <g v-for="item in 18" :key="'hour'+item" v-bind:transform="'rotate(' + (item * 20) + ') translate(0, -135) rotate(' + (-item * 20) + ')'" >
            <text x="0" y="0" text-anchor="middle" alignment-baseline="middle" font-size="24" font-family="Arial">
              {{ item }}
            </text>
          </g>
        </g>

      </svg>
    </a-col>
    <a-col :span="12" :align="'center'">
      <a-button @click="openConfigTime(false,true)" type="primary">设置闹钟</a-button>
      <h2 v-if="alarmTime>0">闹钟:{{formatDate(new Date(alarmTime))}}</h2>
    </a-col>
    <a-col :span="12":align="'center'">
      <a-button @click="openConfigTime(true,true)" type="primary">设置闹钟</a-button>
      <h2 v-if="alarmTime>0">闹钟:{{new ADate(alarmTime).toString()}}</h2>
    </a-col>
  </a-row>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
