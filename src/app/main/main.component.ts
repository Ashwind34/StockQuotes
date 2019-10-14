import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FavService } from '../services/fav.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  data;

  quote;

  quoteData;

  token: string;

  userId: string;

  newFavItem = {};

  favList = [];

  favListTickers: string[];

  favListIds: string[];

  favError: string = '';

  ticker: string = '';

  constructor(public api: ApiService, public favServ: FavService) { }

  objTest() {
    console.log(this.favServ.getFavData(this.userId, this.token));
    console.log(this.createFavList(this.userId, this.token));
    this.favServ.getFavData(this.userId, this.token)
    .subscribe(
      response => {
        console.log(response);
      }
    );
  }


  // method to establish current user favorites list
  createFavList(id, token) {
    this.favServ.getFavData(id, token)
      .subscribe((response: any) => {
        this.favList = response;
        console.log(this.favList);
        // this.rawFavData.forEach(element => {
        //   this.favList.push(element.ticker);
        });
        // this.favList = this.uniqueFav(this.favList)
  }

  newFav() {
    this.newFavItem = {
      //NEED TO UPDATE THIS WITH COMPANY NAME INFO LATER
      name: 'Placeholder',
      ticker: this.ticker.toUpperCase(),
      userId: this.userId
    }

    this.addFav(this.userId, this.token, this.newFavItem);

  }

  // method to add a new favorite to the list and return the updated list
  addFav(id, token, fav) {
    const tickerInFavList = this.checkUniqueFav(this.favList, fav.ticker);
    if (!tickerInFavList) {
      this.favError = null;
      this.favServ.addNewFav(id, token, fav)
        .subscribe(
          (response: any) => {
            this.createFavList(id, token)
            this.ticker = '';
          }
        );
    } else {
      this.favError = 'That stock is already in your favorites!';
      this.ticker = '';
    }
  }

  // helper method to check if a ticker is already in the user favorites list
  checkUniqueFav(array, ticker) {
    return array.some(stock => stock.ticker === ticker);
  }

  getQuote(tickerData) {
    let ticker = this.ticker;
    if (tickerData.id) {
      ticker = tickerData.ticker;
    }
    this.api.quoteCall(ticker)
    .subscribe(
      (response: any) => {
        this.quote = response;
        this.quoteData = Object.values(this.quote['Global Quote'])
        this.ticker = '';
      }
    )
  }

  getResults(ticker) {
    this.api.apiCall(ticker)
    .subscribe(
      (response: any) => {
        console.log(response);
        this.data = response;
    });
  }


  ngOnInit() {
    this.token = sessionStorage.getItem('token');
    this.userId = sessionStorage.getItem('userId');
    this.createFavList(this.userId, this.token);
  }
}





