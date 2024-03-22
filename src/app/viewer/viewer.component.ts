import { Component, OnInit } from '@angular/core';
import { Viewer } from 'cesium';
import { DrawLabelsService } from '../draw-labels.service';
import type { Label, Params } from '../types';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
})
export class ViewerComponent implements OnInit {
  // массив объектов с данными отображаемых на карте лейблов
  labels: Label[] = [];

  // параметры создаваемого лейбла (форма под картой)
  params: Params = {
    longitude: -75.59777,
    latitude: 40.03883,
    text: 'Label 1',
    backgroundColor: '#FFFFFF',
    fontColor: '#000000',
  };

  constructor(private drawLabelsService: DrawLabelsService) {}

  /**
   * Добавляет новый лейбл при клике по карте и перерисовывает все лейбы на карте включая новый
   */
  addLabel() {
    this.labels.push({
      text: this.params.text,
      position: ['0px', '0px'],
      display: 'none',
      coords: [Number(this.params.longitude), Number(this.params.latitude)],
      backgroundColor: this.params.backgroundColor,
      fontColor: this.params.fontColor,
    });

    this.drawLabels();
  }

  /**
   * Отрисовывает все лейблы из массива "labels" с помощью сервиса DrawLabels
   */
  drawLabels() {
    this.drawLabelsService.setLabels(this.labels);
    this.drawLabelsService.drawLabels();
  }

  ngOnInit(): void {
    // html-элемент, где будет отрисовываться карта
    const cesiumElement = document.querySelector('.cesium-viewer');

    // создаём Viewer карты и отключаем все кнопки и панели
    const viewer = new Viewer(cesiumElement!, {
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      navigationHelpButton: false,
    });

    // устанавливаем Viewer карты в сервис DrawLabel
    this.drawLabelsService.setViewer(viewer);
  }
}
