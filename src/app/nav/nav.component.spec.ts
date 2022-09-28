import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {RouterTestingModule} from '@angular/router/testing'
import { NavComponent } from './nav.component';
import { By } from '@angular/platform-browser';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const mockedAuthService = jasmine.createSpyObj(
    'AuthService', ['createUser', 'logout'], {isAuthenticated$: of(true)}
  )

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavComponent ],
      imports:[RouterTestingModule],
      providers:[{provide:AuthService, useValue:mockedAuthService}],
      
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', ()=> {
    const logoutLink = fixture.debugElement.query(By.css('li:nth-child(3)'))

    expect(logoutLink).withContext('Not logged in').toBeTruthy()

    logoutLink.triggerEventHandler('click')
    const service = TestBed.inject(AuthService)

    expect(service.logout).withContext('could not click logout link')
    

  })
});
