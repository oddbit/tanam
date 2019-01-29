import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicPageComponent } from './dynamic-page.component';


describe('DynamicPageComponent', () => {
  let component: DynamicPageComponent;
  let fixture: ComponentFixture<DynamicPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
