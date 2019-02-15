import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.css']
})
export class EditCardComponent implements OnInit {

  @Input() card;

  constructor(
    private fb: FormBuilder
  ) { }

  editCardForm = this.fb.group({
    name: [''],
    address: [''],
    city: [''],
    state: [''],
    zip: ['']
  });

  ngOnInit() {
    this.editCardForm.setValue({
      name: this.card.name,
      address: this.card.address_line1,
      city: this.card.address_city,
      state: this.card.address_state,
      zip: this.card.address_zip
    });
  }

}
