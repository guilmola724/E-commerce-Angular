import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/routes-config';
import { AppStateService } from './app/app-state.service';
import { FirebaseService } from './app/firebase/firebase.service';
import { RestService } from './app/http/rest.service';
import { GuardService } from './app/http/guards/guard.service';
import { ErrorsHandlingService } from './app/errors-handling/errors-handling.service';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {

  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    {provide: AppStateService},
    {provide: FirebaseService},
    {provide: RestService},
    {provide: GuardService},
    {provide: ErrorsHandlingService}
  ]
}).catch(err => console.error(err));
