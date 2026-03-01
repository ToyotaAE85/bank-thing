import { Routes } from '@angular/router';

import { HomeComponent } from './ui-routes/home/home'
import { ContactComponent } from './ui-routes/contact/contact'

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
	},
	
    {
        path:'home',
        component: HomeComponent,
    },

    {
        path:'contact',
        component: ContactComponent,
    },

	{
		path: '**',
		redirectTo: '/home'
	}
];