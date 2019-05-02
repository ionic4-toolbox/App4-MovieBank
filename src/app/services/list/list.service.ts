import { Injectable } from '@angular/core';
import { AccountService } from '../account/account.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserListResponse, ListDetail } from 'src/app/models/user-list';
import { AuthService } from '../auth/auth.service';
import { CoreService } from '../core/core.service';
import { Observable } from 'rxjs';
import { StatusCode, StatusResponse } from 'src/app/models/status';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private http: HttpClient ,private accountService: AccountService, private authService: AuthService, private coreService: CoreService) { }

  getCreatedLists() {
    let accountID = this.accountService.getUser().id;
    let url = '/account/' + accountID + '/lists';

    var queryParams = {
      session_id: localStorage.getItem('sessionID')
    }

    return this.http.get(url, { params: queryParams }).pipe(
      map((response: UserListResponse) => {
        return response.results;
      })
    );

  }

  getListsDetail(listID: number | string): Observable<ListDetail> {
    let isSessionExist = this.authService.checkUserSession();
    if (!isSessionExist) {
      this.coreService.showAlertMessage('You should login to app for add item to your lists!');
      return Observable.create((o: any) => { o.next(false); o.complete(); });
    }
    else {
      let url = `/list/${listID}`;

      return this.http.get(url).pipe(
        map((response: ListDetail) => {
          return response; 
        })
      );
    }
  }

  addMovieToList(listID: string | number, movieID: string | number): Observable<boolean> {

    let isSessionExist = this.authService.checkUserSession();
    if (!isSessionExist) {
      this.coreService.showAlertMessage('You should login to app for add item to your lists!');
      return Observable.create((o: any) => { o.next(false); o.complete(); });
    }
    else {
      let url = `/list/${listID}/add_item`;
      let params = { media_id: movieID };
      let queryParams: any = { session_id: this.authService.getSessionID() }
      return this.http.post(url, params, {params: queryParams}).pipe(
        map((response: StatusResponse) => {
          if (response.status_code == StatusCode.UPDATED) {
            return true;
          }
          else if (response.status_code == StatusCode.DELETED) {
            return false;
          }
        })
      );
    }
  }

  removeMovieFromList(movieID: number | string, listID: number | string) {

    let isSessionExist = this.authService.checkUserSession();
    if (!isSessionExist) {
      this.coreService.showAlertMessage('You should login to app for add item to your lists!');
      return Observable.create((o: any) => { o.next(false); o.complete(); });
    }
    else {
      let url = `/list/${listID}/remove_item`;
      let params = { media_id: movieID };
      let queryParams: any = { session_id: this.authService.getSessionID() }
      return this.http.post(url, params, {params: queryParams}).pipe(
        map((response: any) => {
          if (response.status_code == 13) {
            return true;
          }
          else if (response.status_code == 21) {
            return false;
          }
          else { return false; }
        })
      );
    }


  }

  createList(name: string, description: string) {
    let queryParams: any = {
      session_id: this.authService.getSessionID()
    }
    let requestBody = {
      name: name,
      description: description
    }
    return this.http.post('/list', requestBody, {params: queryParams}).pipe(
      map((response: any) => {
        return true;
      })
    );
  }

  deleteList() {

  }

  clearList() {
    //TODO sonra yapılacak.
  }





}
