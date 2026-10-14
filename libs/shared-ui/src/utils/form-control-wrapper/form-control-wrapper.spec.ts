import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FormControlWrapper } from './form-control-wrapper';

@Component({ selector: 'lib-test-control', template: '' })
class TestControlComponent extends FormControlWrapper {}

describe('FormControlWrapper', () => {
  it('should create an instance', () => {
    const fixture = TestBed.createComponent(TestControlComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.control).toBeTruthy();
  });
});
