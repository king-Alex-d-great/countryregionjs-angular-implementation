import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import CountryRegion from 'countryregionjs'
import { CountryRegionResponse } from '../models';
import { ApiResponse } from 'src/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  countryForm: FormGroup;
  countryRegion: any = null;

  countries: CountryRegionResponse[] = [];
  states: CountryRegionResponse[] = [];
  lgas: CountryRegionResponse[] = [];

  ONE: number = 1;

  constructor() {
    this.countryForm = new FormGroup({
      country: new FormControl(''),
      state: new FormControl(''),
      lga: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountryRegionInstance = () =>
    this.countryRegion ??= new CountryRegion();

  async getCountries(): Promise<void> {
    try {
      const countries = await this.getCountryRegionInstance()?.getCountries();

      this.countries = countries.map((country: ApiResponse, index: number) => ({
        value: index + this.ONE,
        label: country.name,
      }));

    } catch (error) {
      console.error(error);
    }
  }

  async getStates(): Promise<void> {
    try {
      const country = this.countryForm.get('country')?.value;

      if (country) {
        const states = await this.getCountryRegionInstance()?.getStates(country);
        this.states = states.map((userState: ApiResponse, index: number) => ({
          value: index + this.ONE,
          label: userState?.name
        }));
      }

    } catch (error) {
      console.error(error);
    }
  }

  async getLGAs(): Promise<void> {
    try {
      const country = this.countryForm.get('country')?.value;
      const state = this.countryForm.get('state')?.value;

      if (country && state) {
        const lgas = await this.getCountryRegionInstance()?.getLGAs(country, state);
        this.lgas = lgas?.map((lga: ApiResponse, index: number) => ({
          value: index + this.ONE,
          label: lga?.name
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }

  handleCountryChange(): void {
    this.getStates();
  }

  handleStateChange(): void {
    this.getLGAs();
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
  }
}
