import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css'],
})
export class LabelComponent {
  @Input() text: string = '';
  @Input() display: 'block' | 'none' = 'none';
  @Input() backgroundColor: string = '#ffffff';
  @Input() fontColor: string = '#000000';
  @Input() position: [string, string] = ['0px', '0px'];
}
