import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ListService } from 'src/app/services/list/list.service';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.page.html',
  styleUrls: ['./add-list.page.scss'],
})
export class AddListPage implements OnInit {

  title: String = '';
  description: String = '';
  constructor(private modalController: ModalController, private listService: ListService) { }

  ngOnInit() {
  }

  createNewList() {
    console.log(this.title, this.description);
    this.listService.createList(this.title, this.description).subscribe(result => {
      console.log(result);
      if(result) {
        this.closeModal();
      }
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
