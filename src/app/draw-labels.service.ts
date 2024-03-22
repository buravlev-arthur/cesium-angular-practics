import { Injectable } from '@angular/core';
import {
  type Viewer,
  Cartesian3,
  Cartesian2,
  SceneTransforms,
  type Clock,
} from 'cesium';
import type { Label } from './types';

@Injectable({
  providedIn: 'root',
})
export class DrawLabelsService {
  viewer: Viewer | undefined;
  labels: Label[] = [];
  callbackWithContext: (...args: any[]) => void = () => {};
  scratch3dPosition = new Cartesian3();
  scratch2dPosition = new Cartesian2();

  constructor() {}

  setViewer(viewer: Viewer): void {
    this.viewer = viewer;
  }

  setLabels(labels: Label[]): void {
    this.labels = labels;
  }

  removeLabels() {
    if (!this.viewer) return;

    this.viewer.clock.onTick.removeEventListener(this.callbackWithContext);
    this.callbackWithContext = () => {};
    this.viewer.entities.values
      .filter(({ name }) => name === 'label')
      .forEach(({ id }) => this.viewer?.entities.removeById(id));
  }

  drawLabels() {
    if (!this.viewer) return;

    if (this.viewer.entities.values.length > 0) {
      this.removeLabels();
    }

    this.labels.forEach((label) => {
      this.viewer!.entities.add({
        name: 'label',
        position: Cartesian3.fromDegrees(label.coords[0], label.coords[1]),
      });
    });

    this.callbackWithContext = this.callbackFunc.bind(this);
    this.viewer.clock.onTick.addEventListener(this.callbackWithContext);
  }

  callbackFunc(clock: Clock) {
    let position3d: Cartesian3 | undefined;
    let position2d: Cartesian2 | undefined;

    this.viewer!.entities.values.forEach((entity, index) => {
      if (entity.position) {
        position3d = entity.position.getValue(
          clock.currentTime,
          this.scratch3dPosition
        );
      }

      if (position3d) {
        position2d = SceneTransforms.wgs84ToWindowCoordinates(
          this.viewer!.scene,
          position3d,
          this.scratch2dPosition
        );
      }

      if (position2d) {
        this.labels[index].position[0] = position2d.y + 'px';
        this.labels[index].position[1] = position2d.x + 'px';

        if (this.labels[index].display === 'none') {
          this.labels[index].display = 'block';
        }
      } else if (this.labels[index].display === 'block') {
        this.labels[index].display = 'none';
      }
    });
  }
}
