import { Component, OnInit } from '@angular/core';
import { Viewer } from 'cesium';
import { DrawLabelsService } from '../draw-labels.service';
import type { Label } from '../types';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css'],
})
export class ViewerComponent implements OnInit {
  labels: Label[] = [
    { text: 'Label #1', position: ['0px', '0px'], display: 'none' },
    { text: 'Label #2', position: ['0px', '0px'], display: 'none' },
  ];

  constructor(private drawLabelsService: DrawLabelsService) {}

  ngOnInit(): void {
    const cesiumElement = document.querySelector('.cesium-viewer');
    const viewer = new Viewer(cesiumElement!);
    this.drawLabelsService.drawLabels(viewer, this.labels);
  }
}
