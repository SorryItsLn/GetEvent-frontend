import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-unauth-layout',
  imports: [RouterOutlet],
  templateUrl: './unauth-layout.component.html',
  styleUrl: './unauth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthLayoutComponent {}
