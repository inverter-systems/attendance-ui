import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FullRegisterComponent } from "./full-register.component";

describe("DashboardComponent", () => {
  let component: FullRegisterComponent;
  let fixture: ComponentFixture<FullRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullRegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FullRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
