import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubirRecetasPage } from './subir-recetas.page';

describe('SubirRecetasPage', () => {
  let component: SubirRecetasPage;
  let fixture: ComponentFixture<SubirRecetasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirRecetasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
