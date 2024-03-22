import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { Params } from '../types';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  @Input() params?: Params;
  @Output() createLabel = new EventEmitter();
}
