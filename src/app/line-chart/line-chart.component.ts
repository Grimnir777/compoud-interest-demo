import {AfterViewInit, Component, Inject, Input, NgZone, OnChanges, OnDestroy, PLATFORM_ID, SimpleChanges} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnDestroy, AfterViewInit, OnChanges {

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {}
  private chart: am4charts.XYChart;
  private actualYear = new Date().getFullYear();

  @Input() public numberOfYears: number;
  @Input() public startingAmount: number;
  @Input() public monthlyAddingAmount: number;
  @Input() public performance: number;

  private static calculateYearBenefits(startingAmount: number, performance: number): number {
    return startingAmount * performance / 100;
  }

  // Run the function only in the browser
  public browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  public ngAfterViewInit(): void {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      // Create chart instance
      const chart = am4core.create('chartdiv', am4charts.XYChart);
      chart.paddingRight = 20;

      // Add data
      chart.data = this.createData(10, 1000, 50, 7);

      // Create axes
      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'year';

      // Create value axis
      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.baseValue = 0;

      // Create series
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'value';
      series.dataFields.categoryX = 'year';
      series.strokeWidth = 2;

      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color('#fff');

      // chart.cursor = new am4charts.XYCursor();
      const bullethover = bullet.states.create('hover');
      bullethover.properties.scale = 1.3;

      // Make a panning cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = 'panXY';
      chart.cursor.xAxis = categoryAxis;
      chart.cursor.snapToSeries = series;

      this.chart = chart;
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      this.chart.data = this.createData(this.numberOfYears, this.startingAmount, this.monthlyAddingAmount, this.performance);
    }
  }

  private createData(
    numberOfYears: number,
    startingAmount: number,
    monthlyAddedAmount: number,
    performance: number
  ): {date: string, value: number}[] {
    let year = this.actualYear;
    const annualAddedAmount = monthlyAddedAmount * 12;
    const data = [];
    for (let i = 0; i <= numberOfYears; i++) {
      const benefits = LineChartComponent.calculateYearBenefits(startingAmount, performance);
      startingAmount += benefits;
      startingAmount += annualAddedAmount;
      data.push({year: year.toString(10), value: startingAmount.toFixed(2)});
      year += 1;
    }
    return data;
  }

  public ngOnDestroy(): void {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
