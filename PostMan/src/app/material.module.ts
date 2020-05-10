import { NgModule } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { MatAutocompleteModule, MatListModule, MatDividerModule, MatProgressSpinnerModule, MatExpansionModule, MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule } from '@angular/material';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatDividerModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatAutocompleteModule
    ],
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatDividerModule,
        MatListModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule]
})
export class MaterialModule { }
