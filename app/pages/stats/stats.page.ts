import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';

import { Chart } from 'chart.js';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { DogsService } from 'src/app/services/dogs.service';
import { AuthService } from 'src/app/services/auth.service';
import { AddWeightComponent } from './add-weight/add-weight.component';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit, OnDestroy {
  @ViewChild('lineChart', { static: false }) lineChart: ElementRef;
  dogs: any;
  chart: any;
  chartData = null;
  formData: NgForm;
  stats: string;

  constructor(
    private dogsService: DogsService,
    public authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
    ) {}

  ngOnInit() {
    this.stats = 'weights';
  }

  ngOnDestroy(): void {
  }

  onSwitchSeg(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }

  async onShowAddWeightModal() {
    this.modalCtrl
      .create({ component: AddWeightComponent, componentProps: {dogs: this.dogs} })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(async (resultData) => {
        this.formData = resultData.data;
        if (resultData.role === 'addWeight') {
          let dogData = this.formData.value.dog;
          const dogId = dogData.id;
          const date = new Date(this.formData.value.date);
          const weight = this.formData.value.weight;
          const name = dogData.name;
          const color = dogData.color;

          const loading = await this.loadingCtrl.create({
            message: 'Adding new weight record...'
          });

          this.dogsService.addWeightRecord(this.authService.currentUser.uid, dogId, date, weight, name, color)
            .then(() => { this.dogsService.updateWeights(dogId); })
            .then(() => { loading.dismiss(); },
              error => { console.error(error); }
            );
        }
      });
  }

  ionViewDidEnter() {
    this.dogsService.getChartData(this.authService.currentUser.uid).valueChanges().subscribe(result => {
      if (this.chartData) {
        this.updateChart(result);
      } else {
        this.createChart(result);
      }
    });

    // this.createLineChart();
  }

  updateChart(data) {
    // console.log('updating chart....');
    this.chartData = data;
    this.chart.data.datasets = this.getChartData();
    this.chart.update();
  }

  createChart(data) {
    // console.log('creating chart....');

    this.chartData = data;
    let dataToPlot = this.getChartData();

    this.chart = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        datasets: dataToPlot
      },
      options: {
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            // display: false
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                lineHeight: 1,
                fontSize: 10,
                padding: 0,
                display: true,
                labelString: 'Weight (kg)'
              },
              ticks: {
                stepSize: 1
              }
            }],
            xAxes: [
              {
                type: 'time',
                time: {
                  unit: 'month',
                  displayFormats: {
                    month: 'MMM'
                  }
                },
              distribution: 'linear',
            },
          ],
        },
      },
    });
    // console.log(this.chart);
  }

  getChartData() {
    let dataToPlot = [];
    let dataByDog = [];

    for (let dataPoint of this.chartData) {
      if (!dataByDog[dataPoint.dog]) {
        dataByDog[dataPoint.dog] = {
          label: dataPoint.label,
          fill: false,
          borderColor: dataPoint.borderColor,
          data: []
        };
      }
      dataByDog[dataPoint.dog].data.push({x: moment(dataPoint.date.toDate()).format('YYYY-MM-DD'), y: dataPoint.weight});
    }
    for (let key in dataByDog) {
      dataToPlot.push(dataByDog[key]);
    }
    return dataToPlot;
  }

  createLineChart() {
    this.chart = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Bella',
            fill: false,
            borderColor: '#ff00ee',
            data: [
              { x: new Date('2020-01-04'), y: 9.25 },
              { x: new Date('2020-02-01'), y: 9.45 },
              { x: new Date('2020-02-27'), y: 9.45 },
              { x: new Date('2020-05-28'), y: 9.75 },
            ],
          },
          {
            label: 'Finnick',
            fill: false,
            borderColor: '#fd7e14',
            data: [
              { x: new Date('2020-01-04'), y: 13.50 },
              { x: new Date('2020-02-29'), y: 14.00 },
            ],
          },
          {
            label: 'Kylo',
            fill: false,
            borderColor: '#000000',
            data: [
              { x: new Date('2020-01-04'), y: 11.20 },
              { x: new Date('2020-02-01'), y: 11.25 },
              { x: new Date('2020-02-27'), y: 11.65 },
              { x: new Date('2020-05-28'), y: 11.65 },
            ],
          },
          {
            label: 'Lexey',
            fill: false,
            borderColor: '#663399',
            data: [
              { x: new Date('2020-01-04'), y: 12.50 },
              { x: new Date('2020-01-24'), y: 12.65 },
              { x: new Date('2020-02-01'), y: 12.45 },
              { x: new Date('2020-02-29'), y: 12.40 },
            ],
          },
          {
            label: 'Tally',
            fill: false,
            borderColor: '#008000',
            data: [
              { x: new Date('2020-01-04'), y: 11.30 },
              { x: new Date('2020-02-29'), y: 11.75 },
              { x: new Date('2020-05-21'), y: 11.85 },
            ],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          position: 'bottom',
          display: false
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              lineHeight: 1,
              fontSize: 10,
              padding: 0,
              display: true,
              labelString: 'Weight (kg)'
            },
            ticks: {
              stepSize: 1
            }
          }],
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'MMM'
                }
              },
              distribution: 'linear',
            },
          ],
        },
      },
    });
    console.log(this.chart);
  }
}
