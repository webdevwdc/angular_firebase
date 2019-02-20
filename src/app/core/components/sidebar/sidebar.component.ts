import { Component, OnInit, Input } from '@angular/core';
import { DrawerService } from '../../services/drawer/drawer.service';
import { MenuItem } from 'primeng/api';
import { Router, NavigationStart } from '@angular/router';
import { StorageService, LoginService } from '../../services';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    isDrawerOpen: boolean;
    public show = false;
    items: MenuItem[];
    loggeduser: any;
    userdisplay: boolean;
    @Input() user: any;

    constructor(private drawerService: DrawerService,
        public router: Router,
        private storageService: StorageService,
        private _service: LoginService) {
        this.userdisplay = true;
    }

    ngOnInit() {
        const roles = this.user['role'];
        const id = this.user['id'];
        if (roles.indexOf('superadmin') > -1) {
            this.items = [
                {
                    label: 'Category',
                    icon: 'fa fa-th-large',
                    routerLink: '/app/category',
                },
                {
                    label: 'Associate Management',
                    icon: 'fa fa-user-circle',
                    routerLink: '/app/associate',
                },
                {
                    label: 'Portal',
                    icon: 'fa fa-product-hunt',
                    routerLink: '/app/portal',
                },
                {
                    label: 'Profile',
                    icon: 'fa fa-user',
                    routerLink: '/app/profile',
                },
                {
                    label: 'Opportunity',
                    icon: 'fa fa-arrows',
                    routerLink: '/app/opportunity',
                },
                {
                    label: 'Team Opportunity',
                    icon: 'fa fa-users',
                    routerLink: '/app/team-opportunity',
                },
                {
                    label: 'Team Contracts',
                    icon: 'fa fa-handshake-o',
                    routerLink: '/app/team-contracts',
                },
                {
                    label: 'Project Type',
                    icon: 'fa fa-list',
                    routerLink: '/app/project-type',
                },
                // {
                //     label: 'Co-Ordinator Management',
                //     icon: 'fa fa-male',
                //     routerLink: '/app/coordinator',
                // },
                // {
                //     label: 'Associate Shift',
                //     icon: 'fa fa-calendar',
                //     routerLink: '/app/shift',
                // }
            ];
        } else if (roles.indexOf('manager') > -1) {
            this.items = [
                {
                    label: 'Associate Shift',
                    icon: 'fa fa-calendar',
                    routerLink: '/app/shift',
                },
                {
                    label: 'My Opportunity',
                    icon: 'fa fa-user-circle',
                    routerLink: '/app/opportunity',
                },
                {
                    label: 'Team Opportunity',
                    icon: 'fa fa-users',
                    routerLink: '/app/team-opportunity',
                },
            ];
        } else if (roles.indexOf('associate') > -1) {
            this.items = [
                {
                    label: 'My Shift',
                    icon: 'fa fa-calendar',
                    routerLink: '/app/shift/myshift/' + id,
                },
                {
                    label: 'My Opportunity',
                    icon: 'fa fa-user-circle',
                    routerLink: '/app/opportunity',
                },
            ];
        }

        // Drawer Service Getting Close and Opening Funcationality
        this.drawerService.getDrawerEmitter().subscribe((isDrawerOpen) => {
            this.isDrawerOpen = !this.isDrawerOpen;
        });

        // Menu Items Json Format
    }
}
