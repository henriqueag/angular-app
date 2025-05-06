import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterOutlet } from "@angular/router";
import { PoModule, PoNavbarItem } from "@po-ui/ng-components";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterOutlet,
        PoModule
    ],
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    navbarItems: PoNavbarItem[] = [
        {
            label: "Home",
            link: "/home"
        },
        {
            label: "Integrações",
            link: "/integrations"
        }
    ];
}
