import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public dataForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  public ngOnInit(): void{
    this.dataForm = this.fb.group({
      startingAmount: this.fb.control(1000),
      monthlyAddingAmount: this.fb.control(50),
      numberOfYears: this.fb.control(10),
      performance: this.fb.control(5)
    });
  }



}
