import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

import { AUTH_FEATURES, AUTH_PREVIEW_EVENTS } from '../consts';
import { LogoComponent } from '../logo';

@Component({
  selector: 'app-unauth-layout',
  imports: [RouterOutlet, TuiIcon, LogoComponent],
  templateUrl: './unauth-layout.component.html',
  styleUrl: './unauth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthLayoutComponent {
  protected readonly AUTH_FEATURES = AUTH_FEATURES;
  protected readonly AUTH_PREVIEW_EVENTS = AUTH_PREVIEW_EVENTS;
}
