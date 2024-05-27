import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-collection',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-collection.component.html',
  styleUrl: './create-collection.component.css'
})
export class CreateCollectionComponent {
  createCollectionForm!: FormGroup;
  showSuccessMessage: boolean = false;
  constructor(private titleService: Title) {
    titleService.setTitle("Create Collection");
  }
  ngOnInit() {
    this.setFormValues();
  }
  setFormValues() {
    this.createCollectionForm = new FormGroup({
      title: new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z0-9 -]*'), Validators.minLength(3)]),
      description: new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z0-9 ()@.,!-]*')])
    });
  }
  onSubmit() {
    // error pattern console.log display 
    // Object.keys(this.createCollectionForm.controls).forEach(controlName => {
    //   const control = this.createCollectionForm.controls[controlName];
    //   console.log(control);
    //   if (control.errors?.['pattern']) {
    //     console.log(control.errors?.['pattern']);
    //   }
    // });
    console.log("input value:", this.createCollectionForm.value);
    const title = this.createCollectionForm.get("title")?.value;
    const description = this.createCollectionForm.get("description")?.value;
    const collections = localStorage.getItem("Collections");
    console.log("colections:", collections);
    const newCollection = { 'title': title, 'description': description, 'moviesList': [] };
    if (collections !== null) {
      const previousCollections = JSON.parse(collections);
      console.log("previous Collections:", previousCollections);
      console.log("new Collection to add:", newCollection);
      previousCollections.push(newCollection);
      let updated = previousCollections;
      console.log("updated Collection:", updated);
      localStorage.setItem("Collections", JSON.stringify(updated));
    } else {
      console.log("1 Collection created:", [newCollection]);
      localStorage.setItem("Collections", JSON.stringify([newCollection]));
    }
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false; //timeout to auto dismiss after certain time
    }, 5000);
    this.createCollectionForm.reset();
  }
  patternDisplay(inputString: string) {
    const part1 = inputString.split('[')[1];
    const pattern = part1.split(']')[0];
    return pattern;
  }
}