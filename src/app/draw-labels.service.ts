import { Injectable } from '@angular/core';
import { COORDS } from './coords';
import { type Viewer, Cartesian3, Cartesian2, SceneTransforms } from 'cesium';
import type { Label } from './types';

@Injectable({
  providedIn: 'root',
})
export class DrawLabelsService {
  constructor() {}

  drawLabels(viewer: Viewer, labels: Label[]) {
    const scratch3dPosition = new Cartesian3();
    const scratch2dPosition = new Cartesian2();

    COORDS.forEach(([lon, lat]) => {
      viewer.entities.add({
        position: Cartesian3.fromDegrees(lon, lat),
      });
    });

    viewer.clock.onTick.addEventListener((clock) => {
      let position3d: Cartesian3 | undefined;
      let position2d: Cartesian2 | undefined;

      viewer.entities.values.forEach((entity, index) => {
        if (entity.position) {
          position3d = entity.position.getValue(
            clock.currentTime,
            scratch3dPosition
          );
        }

        if (position3d) {
          position2d = SceneTransforms.wgs84ToWindowCoordinates(
            viewer.scene,
            position3d,
            scratch2dPosition
          );
        }

        if (position2d) {
          labels[index].position[0] = position2d.y + 'px';
          labels[index].position[1] = position2d.x + 'px';

          if (labels[index].display === 'none') {
            labels[index].display = 'block';
          }
        } else if (labels[index].display === 'block') {
          labels[index].display = 'none';
        }
      });
    });
  }
}
