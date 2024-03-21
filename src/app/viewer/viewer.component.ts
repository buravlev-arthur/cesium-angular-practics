import { Component, OnInit } from '@angular/core';
import { Viewer, Cartesian3, Cartesian2, SceneTransforms } from 'cesium';
import { COORDS } from '../coords';

type Label = {
  text: string;
  position: [string, string];
  display: 'block' | 'none';
};

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

  ngOnInit(): void {
    const cesiumElement = document.querySelector('.cesium-viewer');
    const viewer = new Viewer(cesiumElement!);
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
          this.labels[index].position[0] = position2d.y + 'px';
          this.labels[index].position[1] = position2d.x + 'px';

          if (this.labels[index].display === 'none') {
            this.labels[index].display = 'block';
          }
        } else if (this.labels[index].display === 'block') {
          this.labels[index].display = 'none';
        }
      });
    });
  }
}
