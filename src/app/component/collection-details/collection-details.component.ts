import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-details.component.html',
  styleUrl: './collection-details.component.css'
})
export class CollectionDetailsComponent {
  collectionsMovies: any;
  selectedCollectionTitle: string = '';
  selectedId!: number;
  collections: any;
  selectedCollection: any;
  selectedCollectionIndex!: number;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title) { }
  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: any) => {
        console.log("params:", params);
        this.selectedCollectionTitle = params['title'];
        console.log("selected collection title:", this.selectedCollectionTitle);
      });
    this.titleService.setTitle(`${this.selectedCollectionTitle}`);
    const savedCollections = localStorage.getItem("Collections");
    if (savedCollections) {
      this.collections = JSON.parse(savedCollections);
      console.log("saved collections:", this.collections);
      this.selectedCollection = this.collections.filter((item: any) => item.title === this.selectedCollectionTitle);
      console.log("selected collection:", this.selectedCollection);
      this.selectedCollectionIndex = this.collections.findIndex((item: any) => item.title === this.selectedCollectionTitle);
      console.log("selected collection index:", this.selectedCollectionIndex);
      for (const detail of this.selectedCollection) {
        if (detail.moviesList) {
          this.collectionsMovies = detail.moviesList;
        }
      }
      console.log("collections movies:", this.collectionsMovies);
    }
  }
  moviePage(id: number) {
    console.log('details id:', id);
    this.router.navigate(['movies', id]);
  }
  // onMovieClick(id: number) {
  //   console.log("id collection see:", id);
  //   //option 1 routes
  //   // this.router.navigate(["search", id]);
  //   //option 2 routes
  //   this.router.navigate(["search/movies", id]);
  // }
  removeFromCollection(id: number) {
    this.selectedId = id
    console.log('movie id to remove from collection :', id);
    let selectedMovieIndex = this.collectionsMovies.findIndex((item: any) => item.id === id);
    console.log("index of collection to be deleted:", selectedMovieIndex);
    this.collectionsMovies.splice(selectedMovieIndex, 1); // Remove the object from the array
    console.log("new movies List", this.collectionsMovies);
    for (const detail of this.selectedCollection) {
      detail.moviesList = this.collectionsMovies;
    }
    let selectedCol = this.selectedCollection.find((item: any) => item.title === this.selectedCollectionTitle); //to become object so that can be added to the original collection
    this.collections[this.selectedCollectionIndex] = selectedCol;
    console.log("updated collections:", this.collections);
    console.log("Movie removed successfully!");
    localStorage.setItem("Collections", JSON.stringify(this.collections));
  }
}