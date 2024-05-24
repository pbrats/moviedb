import { Component, OnDestroy } from '@angular/core';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modal-container',
  standalone: true,
  imports: [MovieDetailsComponent, RouterOutlet],
  templateUrl: './modal-container.component.html',
  styleUrl: './modal-container.component.css'
})
export class ModalContainerComponent implements OnDestroy {
  destroy = new Subject<any>();
  currentDialog: NgbModalRef | undefined;
  constructor(private modalService: NgbModal, private activatedRoute: ActivatedRoute, private router: Router, private location: Location) {
    activatedRoute.params.pipe(takeUntil(this.destroy)).subscribe(params => {
      if (this.currentDialog) {
        this.currentDialog.close();
      }
      this.currentDialog = this.modalService.open(MovieDetailsComponent, { centered: true });
      this.currentDialog.componentInstance.id = params['id']; // when router navigates on this component it takes the params id and opens up the movie detail modal with that id
      this.currentDialog.result.then(result => {
        //   console.log("the modal was closed");
        //     router.navigateByUrl(''); //naviggates to home page
        // }, reason => {
        //   console.log("the modal reason");
        //     router.navigateByUrl(''); //naviggates to home page
        // });
        if (result !== -1) {
          this.location.back(); // returns one page back
        }
      }, reason => {
        this.location.back(); // returns one page back
      });
    });
  }
  ngOnDestroy() {
    this.destroy.next(undefined);
  }
}

