import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class CollectionsComponent {
  collections: any;
  selectedCollection: any;
  deletionFlag: boolean = false;
  emptyFlag: boolean = false;
  deletedCollectionTitle?: string;
  deleted: any;
  constructor(private router: Router, private titleService: Title) {
    this.titleService.setTitle('Collections');
  }
  ngOnInit() {
    const savedCollections = localStorage.getItem("Collections");
    if (savedCollections) {
      this.collections = JSON.parse(savedCollections);
      console.log("saved collections:", this.collections);
    }
    console.log("saved collections 2:", this.collections);
    this.deleted = sessionStorage.getItem("deleted");
    console.log("deleted:", this.deleted);
    if (this.deleted === null || this.collections === undefined) {
      sessionStorage.setItem('deleted', 'no');
    }
    if (this.deleted === "yes") {
      this.emptyFlag = true;
      setTimeout(() => {
        this.emptyFlag = false; //timeout to auto dismiss after certain time
      }, 5000);
      console.log("empty flag", this.emptyFlag);
    }
  }
  seeCollection(title: string) {
    this.router.navigate(['collections', title]);
  }
  navigate(path: string) {
    this.router.navigate([`collections/${path}`])
  }
  deleteCollections() {
    localStorage.removeItem("Collections");
    console.log("Collections have been deleted!");
    window.location.reload();
    sessionStorage.setItem('deleted', 'yes');
  }
  removeCollection(title: string) {
    this.deletedCollectionTitle = title;
    this.selectedCollection = this.collections.filter((item: any) => item.title === title);
    console.log("selected collection:", this.selectedCollection);
    const foundIndex = this.collections.findIndex((item: any) => item.title === title);
    console.log("index of collection to be deleted:", foundIndex);
    this.collections.splice(foundIndex, 1); // Remove the object from the array
    console.log("new collections", this.collections);
    console.log("Collection removed successfully!");
    localStorage.setItem("Collections", JSON.stringify(this.collections));
    this.deletionFlag = true;
    setTimeout(() => {
      this.deletionFlag = false; //timeout to auto dismiss after certain time
    }, 5000);
  }
}
