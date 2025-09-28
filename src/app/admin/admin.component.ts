import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DataService } from '../admin.service';;
import { MatTableModule } from '@angular/material/table';
// Import the specific Material module for the paginator


import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';



@Component({
    selector: 'app-admin',
    templateUrl: 'admin.component.html',
    imports: [MatIconModule, MatPaginatorModule, MatTableModule, CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatCardModule, ReactiveFormsModule, HttpClientModule],

    providers: [DataService]
})
export class AdminComponent implements OnInit {
    adminForm: FormGroup;

    // Data for the dropdowns
    options: any = {
        laborList: []
    };

    // Data for the table
    displayedColumns: string[] = ['type', 'firstName', 'lastName', 'telephone', 'adharNo', 'address', 'city', 'state', 'pincode', 'experience', 'vehicleNo', 'driver', 'date'];
    dataSource = new MatTableDataSource<any>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private fb: FormBuilder, private dataService: DataService) {
        this.adminForm = this.fb.group({
            type: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            telephone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            adharNo: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
            address: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
            experience: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            vehicleNo: [''],
            driver: [''],
            date: ['']

        });
    }

    ngOnInit(): void {
        this.loadOptions();
        this.loadRecords();
    }

    // Load dropdown options from the API
    loadOptions(): void {
        this.dataService.getOptions().subscribe(
            data => {
                this.options = data;
            },
            error => console.error('Error loading options:', error)
        );
    }

    // Load existing records for the table
    loadRecords(): void {
        this.dataService.getRecords().subscribe(
            records => {
                this.dataSource = new MatTableDataSource(records);
                this.dataSource.paginator = this.paginator;
            },
            error => console.error('Error loading records:', error)
        );
    }

    // Logic to handle the form submission
    onSubmit(): void {
        if (this.adminForm.valid) {
            const formValue = { ...this.adminForm.value, date: new Date().toLocaleDateString() };

            this.dataService.submitRecord(formValue).subscribe(
                response => {
                    console.log(response.message);
                    this.adminForm.reset({ type: '', firstName: '', lastName: '', telephone: '', adharNo: '', address: '', city: '', state: '', pincode: '', experience: '', vehicleNo: '', item: '', driver: '' ,date:''}); // Reset form
                    this.loadRecords(); // Refresh the table
                    alert('Record submitted successfully!');
                },
                error => console.error('Submission failed:', error)
            );
        }
    }
}