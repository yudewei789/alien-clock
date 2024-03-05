
export class ADate {
    ZONE_OFFSET_MILLISECOND =  0 - (new Date().getTimezoneOffset())*60
    SECONDS_ONE_MINUTE = 90;
    SECONDS_ONE_HOUR = 90 * 90;
    SECONDS_ONE_DAY = 90 * 90 * 36;
    STEP = 500;
    DAY_PER_MOUTH = [44, 42, 48, 40, 48, 44, 40, 44, 42, 40, 40, 42, 44, 48, 42, 40, 44, 38];
    totalMillisecond = 0;

    year = 0;
    month = 0;
    day = 0;
    hour = 0;
    minute = 0;
    second = 0;

    constructor(time:number) {
        const diffMillisecond =  time - 14400000
        this.totalMillisecond = 314905117605200 + diffMillisecond
        this.totalMillisecond = this.totalMillisecond+this.ZONE_OFFSET_MILLISECOND;
    }
    getSumDaysOfYearByMouth() {
        let dayOfYear = 0;
        for (let i = 0; i < this.month-1; i++) {
            dayOfYear = dayOfYear + this.DAY_PER_MOUTH[i];
        }
        return dayOfYear;
    }
    getTotalMillisecond() {
        //改方法处理 毫秒 单位 1 秒 500毫秒
        this.totalMillisecond = 0;
        this.totalMillisecond =  this.totalMillisecond + this.second * this.STEP;
        this.totalMillisecond =  this.totalMillisecond + this.minute * 90 * this.STEP;;
        this.totalMillisecond =  this.totalMillisecond + this.hour * 90 * 90 * this.STEP;;
        this.totalMillisecond =  this.totalMillisecond + this.day * 90 * 90 * 36 * this.STEP;
        this.totalMillisecond =  this.totalMillisecond + this.getSumDaysOfYearByMouth() * 90 * 90 * 36 * this.STEP;
        this.totalMillisecond =  this.totalMillisecond + this.year * 770 * 90 * 90 * 36 * this.STEP;
        return this.totalMillisecond;
    }
    getTime(){
      return   this.getTotalMillisecond() - 314905117605200 + 14400000 - this.ZONE_OFFSET_MILLISECOND
    }
    setYear(year:number) {
        if(year >=0) {
            this.year = year;
        }else {
            console.warn("year should bigger than 0");
        }
    }
    setMonth(month:number) {
        if(month >=1 && month <= 18) {
            this.month = month;
            if(this.day > this.DAY_PER_MOUTH[this.month-1]) {
                this.day = this.DAY_PER_MOUTH[this.month-1]
            }
        }else{
            console.warn("month should between 1 and 18");
            throw new Error("month should between 1 and 18");
        }
    }
    setDay(day:number) {
        if(day >=1 && day <= this.DAY_PER_MOUTH[this.month-1]) {
            this.day = day;
        }else{
            console.warn("day should between 1 and " + this.DAY_PER_MOUTH[this.month-1]);
            throw new Error("day should between 1 and " + this.DAY_PER_MOUTH[this.month-1]);
        }
    }
    setHour(hour:number) {
        if(hour >=0 && hour <= 35) {
            this.hour = hour;
        }else{
            console.warn("hour should between 0 and 35");
            throw new Error("hour should between 0 and 35");
        }
    }
    setMinute(minute:number) {
        if(minute >=0 && minute <= 89) {
            this.minute = minute;
        }else{
            console.warn("minute should between 0 and 89");
            throw new Error("minute should between 0 and 89");
        }
    }
    setSecond(second:number) {
        if(second >=0 && second <= 89) {
            this.second = second;
        }else{
            console.warn("second should between 0 and 89");
            throw new Error("second should between 0 and 89");
        }
    }
    getYear() {
        const totalSecond = this.totalMillisecond/this.STEP
        return  Math.floor(totalSecond/(this.SECONDS_ONE_DAY * 770))
    }
    getDayOfYear(){
        const totalSecond = this.totalMillisecond/this.STEP
        const  totalDay =  Math.floor(totalSecond/this.SECONDS_ONE_DAY)
        const  dayOfYear = totalDay % 770
        return dayOfYear
    }
    getMonth () {
        const dayOfYear = this.getDayOfYear()
        let sumDay = 0;
        for (let i = 0; i < this.DAY_PER_MOUTH.length; i++) {
            sumDay = sumDay + this.DAY_PER_MOUTH[i];
            if(dayOfYear <= sumDay){
                return i
            }
        }
        return 0
    }
    getDayOfMouth () {
        const dayOfYear = this.getDayOfYear()
        let sumDay = 0;
        for (let i = 0; i < this.DAY_PER_MOUTH.length; i++) {
            sumDay = sumDay + this.DAY_PER_MOUTH[i];
            if(dayOfYear <= sumDay){
                return this.DAY_PER_MOUTH[i] - (sumDay - dayOfYear)
            }
        }
        return 0
    }
    getHour() {
        const low =  (this.totalMillisecond/this.STEP) % this.SECONDS_ONE_DAY;
        return Math.floor(low/this.SECONDS_ONE_HOUR)
    }
    getMinute() {
        const low = (this.totalMillisecond/this.STEP) % this.SECONDS_ONE_HOUR;
        return Math.floor(low/this.SECONDS_ONE_MINUTE)
    }
    getSecond() {
        return  Math.floor(this.totalMillisecond/this.STEP) % this.SECONDS_ONE_MINUTE;
    }
    toString() {
        const year = this.getYear();
        const month = ('0' + (this.getMonth() + 1)).slice(-2);
        const day = ('0' + this.getDayOfMouth()).slice(-2);
        const hours = ('0' + this.getHour()).slice(-2);
        const minutes = ('0' + this.getMinute()).slice(-2);
        const seconds = ('0' + this.getSecond()).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}


