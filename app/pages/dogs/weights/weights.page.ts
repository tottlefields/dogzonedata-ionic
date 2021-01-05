import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { Chart } from 'chart.js';
import * as moment from 'moment';

import { Dog } from 'src/app/models/dog.interface';
import { DogsService } from 'src/app/services/dogs.service';
import { AddWeightComponent } from '../../stats/add-weight/add-weight.component';

@Component({
  selector: 'app-weights',
  templateUrl: './weights.page.html',
  styleUrls: ['./weights.page.scss'],
})
export class WeightsPage implements OnInit, OnDestroy {

  @ViewChild('lineChart', { static: false }) lineChart: ElementRef;
  public weights;
  public dog;
  chart: any;
  chartData = null;
  minValue = 100;
  maxValue = 0;
  screen: string;
  formData: NgForm;
  
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private dogsService: DogsService
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('dogId')) {
        this.navCtrl.navigateBack(['/']);
        return;
      }

      this.screen = 'chart';

      this.route.data.subscribe((data: {dog: Dog}) => {
        this.dog = data.dog;
      });

      this.weights = this.dogsService.getAllWeights(paramMap.get('dogId')).valueChanges();
    });
  }

  ngOnDestroy() {
    this.weights = null;
  }

  ionViewDidEnter() {
    // console.log("entering... get chart data");
    this.dogsService.getChartDataByDog(this.dog.id, 12).valueChanges().subscribe(result => {
      if (this.chartData) {
        // this.updateChart(result);
      } else {
        this.createChart(result);
      }
    });
  }

  async onShowAddWeightModal() {
    console.log('adding weight from dog page...');
    this.modalCtrl
      .create({ component: AddWeightComponent, componentProps: { dog: this.dog } })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(async (resultData) => {
        // console.log(resultData);
        this.formData = resultData.data;
        if (resultData.role === 'addWeight') {
          // let dogData = this.formData.value.dog;
          const dogId = this.dog.id;
          const date = new Date(this.formData.value.date);
          const weight = this.formData.value.weight;
          // const name = this.dog.name;
          // const color = this.dog.color;

          const loading = await this.loadingCtrl.create({
            message: 'Adding new weight record...'
          });
          await loading.present();

          this.dogsService.addWeightRecord(dogId, date, weight)
            .then(() => { this.dogsService.updateWeights(dogId); })
            .then(() => { loading.dismiss(); },
              error => { console.error(error); }
            );
        }
      });
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
                stepSize: 0.1,
                suggestedMin: parseFloat(this.minValue.toString()) - parseFloat('0.2'),
                suggestedMax: parseFloat(this.maxValue.toString()) + parseFloat('0.2')
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
        tooltips: {
          callbacks: {
            title: function(tooltipItems, data) {
              let title = tooltipItems[0].label || '';
              if (title) { title = moment(title).format('Do MMM YYYY'); }
              return title;
            },
            label: function(tooltipItem, data) {
              let label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) { label += ': '; }
              label += (Math.round(tooltipItem.value * 100) / 100).toFixed(2);
              label += 'kg';
              return label;
            }
          }
      }
      },
    });
  }

  getChartData() {
    let dataToPlot = [];
    let data = [];

    for (let dataPoint of this.chartData) {
      if (dataPoint.weight > this.maxValue){ this.maxValue = dataPoint.weight; }
      if (dataPoint.weight < this.minValue){ this.minValue = dataPoint.weight; }
      data.push({x: moment(dataPoint.date.toDate()).format('YYYY-MM-DD'), y: dataPoint.weight});
    }
  
    dataToPlot = [{
      label: this.dog.name,
      fill: false,
      borderColor: this.dog.color,
      data: data
    }];

    return dataToPlot;
  }

}
