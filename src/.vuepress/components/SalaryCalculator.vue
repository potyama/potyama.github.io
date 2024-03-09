<template>
  <div class="salary-calculator">
    <h2>給料計算</h2>
    
    <section class="hourly-rates">
      <h3>時給設定</h3>
      <div class="input-group">
        <label for="hourlyRateElementaryMiddle">小中学生時給:</label>
        <input type="number" id="hourlyRateElementaryMiddle" v-model.number="hourlyRates.elementaryMiddle" placeholder="小中学生時給" />
      </div>
      <div class="input-group">
        <label for="hourlyRateHighSchool">高校生時給:</label>
        <input type="number" id="hourlyRateHighSchool" v-model.number="hourlyRates.highSchool" placeholder="高校生時給" />
      </div>
      <div class="input-group">
        <label for="hourlyRateGroup">集団時給:</label>
        <input type="number" id="hourlyRateGroup" v-model.number="hourlyRates.group" placeholder="集団時給" />
      </div>
      <div class="input-group">
        <label for="hourlyRateOffice">事務関連時給:</label>
        <input type="number" id="hourlyRateOffice" v-model.number="hourlyRates.office" placeholder="事務関連時給" />
      </div>
    </section>

    <section class="lesson-counts">
      <h3>通常コマ数</h3>
      <div v-for="(value, key) in NormallessonCounts" :key="key" class="input-group">
        <label :for="'count-' + key">{{ countLabels[key] }}:</label>
        <input type="number" :id="'count-' + key" v-model.number="NormallessonCounts[key]" />
      </div>
    </section>

    <section class="lecture-counts" v-if="showLectureSection">
      <h3>講習コマ数</h3>
      <div v-for="(value, key) in lectureCounts" :key="'lecture' + key" class="input-group">
        <label :for="'lecture-' + key">{{ lectureCountLabels[key] }}:</label>
        <input type="number" :id="'lecture-' + key" v-model.number="lectureCounts[key]" />
      </div>
    </section>
    <div class="toggle-lecture-section">
  <input type="checkbox" id="toggleLecture" v-model="showLectureSection">
  <label for="toggleLecture">講習コマ数を表示</label>
</div>
    <button @click="calculateSalary" class="calculate-btn">計算</button>

    <div v-if="totalSalary !== null">
  <p>45分コマ合計: {{ NormalTotals.fortyFiveMinutesTotal }}円</p>
  <p>60分コマ合計: {{ NormalTotals.sixtyMinutesTotal }}円</p>
  <!-- 各カテゴリーの合計を表示 -->
  <p>小中学生合計: {{ NormalTotals.elementaryMiddleTotal }}円</p>
  <p>高校生合計: {{ NormalTotals.highSchoolTotal }}円</p>
  <p>集団合計: {{ NormalTotals.groupTotal }}円</p>
  <p>HELLO合計: {{ NormalTotals.helloTotal }}円</p>
  <p>前後給合計: {{ NormalTotals.prePostSalaryTotal }}円</p>
  <p>事務給合計: {{ NormalTotals.officeSalaryTotal }}円</p>
  <p>研修費合計: {{ NormalTotals.trainingFeeTotal }}円</p>
  <p><strong>通常給料: {{ NormalTotals.totalNormalSalary }}円</strong></p>
  </div>
  <div v-if="showLectureSection">
  <!-- 講習コマ数の合計表示 -->
  <p>講習小中学生合計: {{ lectureTotals.lectureElementaryMiddleTotal }}円</p>
  <p>講習高校生合計: {{ lectureTotals.lectureHighSchoolTotal }}円</p>
  <p>講習集団合計: {{ lectureTotals.lectureGroupTotal }}円</p>
  <p>講習事務給合計: {{ lectureTotals.lectureOfficeSalaryTotal }}円</p>
  <p>講習研修費合計: {{ lectureTotals.lectureTrainingFeeTotal }}円</p>
  <p>講習前後給合計: {{ lectureTotals.lecturePrePostSalaryTotal }}円</p>
  <p><strong>講習給料: {{ lectureTotals.totalLectureSalary }}円</strong></p>
  <p><h3>合計給料: {{ totalSalary }}円</h3></p>

</div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      hourlyRates: {
        basic: 0,
        elementaryMiddle: 0,
        highSchool: 0,
        group: 0,
        office: 0,
      },
      NormallessonCounts: {
        fortyFiveMinutes: 0,
        sixtyMinutes: 0,
        elementaryMiddleCount: 0,
        highSchoolCount: 0,
        groupCount: 0,
        hello: 0,
        prePostSalary: 0,
        officeSalary: 0,
        trainingFee: 0,
      },
      countLabels: {
        fortyFiveMinutes: "45分",
        sixtyMinutes: "60分",
        elementaryMiddleCount: "小中学生",
        highSchoolCount: "高校生",
        groupCount: "集団",
        hello: "HELLO",
        prePostSalary: "前後給",
        officeSalary: "事務給",
        trainingFee: "研修費",
      },
      NormalTotals: {
      fortyFiveMinutesTotal: 0,
      sixtyMinutesTotal: 0,
      elementaryMiddleTotal: 0,
      highSchoolTotal: 0,
      groupTotal: 0,
      helloTotal: 0,
      prePostSalaryTotal: 0,
      officeSalaryTotal: 0,
      trainingFeeTotal: 0,
      totalNormalSalary: 0,
    },
        // 講習コマ数の追加
      lectureCounts: {
      lectureElementaryMiddle: 0,
      lectureHighSchool: 0,
      lectureGroup: 0,
      lectureOfficeSalary: 0,
      lecturePrePostSalary: 0,
      lectureTrainingFee: 0,
    },
    lectureCountLabels: {
      lectureElementaryMiddle: "小中学生(講習)",
      lectureHighSchool: "高校生(講習)",
      lectureGroup: "集団(講習)",
        lectureOfficeSalary: "前後給(講習)",
        lecturePrePostSalary: "事務給(講習)",
        lectureTrainingFee: "研修費(講習)",
      },
    // 講習コマ数合計を格納するためのプロパティ
    lectureTotals: {
      lectureElementaryMiddleTotal: 0,
      lectureHighSchoolTotal: 0,
      lectureGroupTotal: 0,
      lectureOfficeSalaryTotal: 0,
      lectureTrainingFeeTotal: 0,
      lecturePrePostSalaryTotal: 0,
      totalLectureSalary: 0,
    },
    totalSalary: null,
    showLectureSection: false, 
    };
  },
  methods: {
    calculateSalary() {
    let total = 0;

    // 基本時給の1.5倍
    const baseRateMultiplier = 1.5;

    // 各カテゴリーの合計を計算し、繰り上げて各合計プロパティに格納
    this.NormalTotals.fortyFiveMinutesTotal = Math.ceil(this.NormallessonCounts.fortyFiveMinutes * this.hourlyRates.elementaryMiddle * 0.75);
    this.NormalTotals.sixtyMinutesTotal = Math.ceil(this.NormallessonCounts.sixtyMinutes * this.hourlyRates.elementaryMiddle * 1);
    this.NormalTotals.elementaryMiddleTotal = Math.ceil(this.NormallessonCounts.elementaryMiddleCount * this.hourlyRates.elementaryMiddle * 0.84);
    this.NormalTotals.highSchoolTotal = Math.ceil(this.NormallessonCounts.highSchoolCount * this.hourlyRates.highSchool * baseRateMultiplier);
    this.NormalTotals.groupTotal = Math.ceil(this.NormallessonCounts.groupCount * this.hourlyRates.group * 1);
    this.NormalTotals.helloTotal = Math.ceil(this.NormallessonCounts.hello * this.hourlyRates.group * baseRateMultiplier);
    this.NormalTotals.prePostSalaryTotal = Math.round((this.NormallessonCounts.prePostSalary / 60) * this.hourlyRates.office);
    this.NormalTotals.officeSalaryTotal = Math.round((this.NormallessonCounts.officeSalary / 60) * this.hourlyRates.office);
    this.NormalTotals.trainingFeeTotal = Math.round((this.NormallessonCounts.trainingFee / 60) * this.hourlyRates.office);
    this.NormalTotals.totalNormalSalary  = this.NormalTotals.fortyFiveMinutesTotal + this.NormalTotals.sixtyMinutesTotal + this.NormalTotals.elementaryMiddleTotal + this.NormalTotals.highSchoolTotal + this.NormalTotals.groupTotal + this.NormalTotals.helloTotal + this.NormalTotals.prePostSalaryTotal + this.NormalTotals.officeSalaryTotal + this.NormalTotals.trainingFeeTotal;
    
    this.lectureTotals.lectureElementaryMiddleTotal = Math.ceil(this.lectureCounts.lectureElementaryMiddle * this.hourlyRates.elementaryMiddle * baseRateMultiplier);
    this.lectureTotals.lectureHighSchoolTotal = Math.ceil(this.lectureCounts.lectureHighSchool * this.hourlyRates.highSchool * baseRateMultiplier);
    this.lectureTotals.lectureGroupTotal = Math.ceil(this.lectureCounts.lectureGroup * this.hourlyRates.group * 1);
    this.lectureTotals.lecturePrePostSalaryTotal = Math.round(Math.ceil(((this.lectureCounts.lecturePrePostSalary /60)) * this.hourlyRates.office));
    this.lectureTotals.lectureOfficeSalaryTotal = Math.round(Math.ceil(((this.lectureCounts.lectureOfficeSalary /60)) * this.hourlyRates.office));
    this.lectureTotals.lectureTrainingFeeTotal = Math.round(Math.ceil(((this.lectureCounts.lectureTrainingFee /60)) * this.hourlyRates.office));
    this.lectureTotals.totalLectureSalary = this.lectureTotals.lectureElementaryMiddleTotal + this.lectureTotals.lectureHighSchoolTotal + this.lectureTotals.lectureGroupTotal + this.lectureTotals.lectureOfficeSalaryTotal + this.lectureTotals.lecturePrePostSalaryTotal + this.lectureTotals.lectureTrainingFeeTotal;
    this.totalSalary = this.NormalTotals.totalNormalSalary + this.lectureTotals.totalLectureSalary; 
  },
  },
};
</script>
