import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Ion } from 'cesium';

import { AppModule } from './app/app.module';

(window as Record<string, any>)['CESIUM_BASE_URL'] = '/assets/cesium/';

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MmExZWM1ZS00NzdiLTQ0MWQtYmYzZi03NjhiZTcyMjYzZWYiLCJpZCI6MjAyOTkzLCJpYXQiOjE3MTA4NDM2ODZ9.ZVD6zPy0a4b6r92-xvsJhSYUqG4ja6Efgf_2uh-Lazs';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
