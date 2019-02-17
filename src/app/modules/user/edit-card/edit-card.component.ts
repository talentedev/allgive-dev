import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.css']
})
export class EditCardComponent implements OnInit {

  @Input() card;

  private months = [];
  private years = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public activeModal: NgbActiveModal
  ) { }

  editCardForm = this.fb.group({
    expMonth: [''],
    expYear: [''],
    name: [''],
    address: [''],
    city: [''],
    state: [''],
    zip: ['']
  });

  ngOnInit() {
    this.editCardForm.setValue({
      expMonth: this.card.exp_month,
      expYear: this.card.exp_year,
      name: this.card.name,
      address: this.card.address_line1,
      city: this.card.address_city,
      state: this.card.address_state,
      zip: this.card.address_zip
    });

    this.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    let today = new Date();
    let yyyy = today.getFullYear();
    for (var i = 0; i < 20; ++i) {
      this.years.push(yyyy);
      yyyy++;
    }
  }

  submit() {
    var data = {
      id: this.card.id,
      customer: this.card.customer,
      expMonth: this.editCardForm.value.expMonth,
      expYear: this.editCardForm.value.expYear,
      name: this.editCardForm.value.name,
      address: this.editCardForm.value.address,
      city: this.editCardForm.value.city,
      state: this.editCardForm.value.state,
      zip: this.editCardForm.value.zip
    };

    this.userService.updateCard(data).subscribe(res => {
      this.activeModal.dismiss('success');
    });
  }
}
