import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
    },
    {
        path: "home",
        loadComponent: () => import("./home/home.component").then(c => c.HomeComponent)
    },
    {
        path: "integrations",
        loadComponent: () => import("./integration/integration.component").then(c => c.IntegrationComponent)
    }
];
