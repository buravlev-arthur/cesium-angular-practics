import { Injectable } from '@angular/core';
import {
  type Viewer,
  Cartesian3,
  Cartesian2,
  SceneTransforms,
  Cartographic,
  Math,
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

  /**
   * Устанавливает объект Viewer объект сервиса DrawLabels
   * @param viewer Viewer-объект карты Cesisum
   */
  setViewer(viewer: Viewer): void {
    this.viewer = viewer;
  }

  /**
   * Устанавливает массив отображаемых на карте лейблов
   * @param labels массив Label-объектов с данными отображаемых на карте лейблов
   */
  setLabels(labels: Label[]): void {
    this.labels = labels;
  }

  /**
   * Удаляет все лейблы с карты и отписывается от события изменения времени
   * @returns void
   */
  removeLabels(): void {
    if (!this.viewer) return;

    this.viewer.clock.onTick.removeEventListener(this.callbackWithContext);
    this.callbackWithContext = () => {};
    this.viewer.entities.values
      .filter(({ name }) => name === 'label')
      .forEach(({ id }) => this.viewer?.entities.removeById(id));
  }

  /**
   * Добавляет лейблы на карту (экземпляры `Entity`) и подписывается на событие изменения времени для динамичной перерисовки лейблов
   * @returns void
   */
  drawLabels(): void {
    if (!this.viewer) return;

    if (this.viewer.entities.values.length > 0) {
      this.removeLabels();
    }

    this.labels.forEach((label) => {
      this.viewer!.entities.add({
        name: 'label',
        position: label.coords,
      });
    });

    this.callbackWithContext = this.callbackFunc.bind(this);
    this.viewer.clock.onTick.addEventListener(this.callbackWithContext);
  }

  /**
   * Переводит долготу и широту в координаты трёхмерной декартовой системы
   * @param lon долгота, число
   * @param lan широта, число
   * @returns Cartesian3-объект, координаты трехмерной декартовой системы
   */
  fromDegress(lon: number, lan: number): Cartesian3 {
    return Cartesian3.fromDegrees(lon, lan);
  }

  /**
   * Переводит координаты трёхмерной декартовой системы в долготу/широту
   * @param position Cartesian3-объект, координаты трехмерной декартовой системы
   * @returns числовой массив [долгота, широта]
   */
  fromCartesian(position: Cartesian3): [number, number] {
    const cartographic = Cartographic.fromCartesian(position);
    const lon = Math.toDegrees(cartographic.longitude);
    const lan = Math.toDegrees(cartographic.latitude);

    return [lon, lan];
  }

  /**
   * Вычисляет координаты трёхмерной декартовой системы на карте по координатам мыши
   * @param x координата курсора по оси x
   * @param y координата курсора по оси y
   * @returns координаты трёхмерной декартовой системы: x, y, z
   */
  normalizePickPosition(x: number, y: number): Cartesian3 | undefined {
    if (!this.viewer) return;

    const cursorPosition = new Cartesian2(x, y);
    let position: Cartesian3 | undefined =
      this.viewer.scene.pickPosition(cursorPosition);
    if (position) {
      let cartographic = Cartographic.fromCartesian(position);
      if (cartographic && cartographic.height < 0) {
        position = this.viewer.camera.pickEllipsoid(cursorPosition);
      }
    } else {
      position = this.viewer.camera.pickEllipsoid(cursorPosition);
    }

    return position;
  }

  /**
   * Callback-метод события изменения времени Cesium, который перерисовывает все отображаемые лейблы на карте
   * @param clock Clock-объект карты Cesium
   */
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
