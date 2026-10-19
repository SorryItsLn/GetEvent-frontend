import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';

import { TAB_BAR_NAVIGATION } from '../consts';

@Component({
  selector: 'app-tab-bar',
  imports: [RouterLink, RouterLinkActive, TuiIcon],
  templateUrl: './tab-bar.component.html',
  styleUrl: './tab-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabBarComponent {
  protected readonly TAB_BAR_NAVIGATION = TAB_BAR_NAVIGATION;
}
