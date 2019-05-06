import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from 'src/app/models/movie';
import { Observable } from 'rxjs';
import { MovieService } from 'src/app/services/movie/movie.service';
import { Cast } from 'src/app/models/cast';
import { NavController, ModalController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account/account.service';
import { CoreService } from 'src/app/services/core/core.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ListPage } from '../modals/list/list.page';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss']
})
export class MovieDetailPage implements OnInit {

  private movieID: string = "";
  private trailerURL: any = null;
  movie: Movie;
  castList: Cast[] = [];
  similarMovies: Movie[] = [];
  rate: number = 0;
  private isFavorite: boolean = false;
  private isOnWatchlist: boolean = false;

  constructor(private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService,
    private accountService: AccountService,
    private modalController: ModalController,
    private socialSharing: SocialSharing,
    private coreService: CoreService) { }


  ngOnInit() {
    this.movieID = this.activatedRoute.snapshot.paramMap.get('movieID');
    setTimeout(() => {
      this.getMovieDetail();
      this.getMovieCast();
      this.getSimilarMovies();
      this.getMovieTrailer();
      this.getAccountStateForMovie();

    }, 500);
  }

  navigateBack() {
    this.navCtrl.pop();
  }

  async addMovieToList() {
    console.log("asdasd");
    const modal = await this.modalController.create({
      component: ListPage,
      componentProps: {
        movieID: this.movieID
      }
    });

    modal.present();

  }

  likeMovie() {
    this.accountService.markAsFavorite(Number(this.movieID), 'movie', !this.isFavorite).subscribe(d => {
      this.isFavorite = d;
    });
  }

  addMovieToWatchList() {
    this.accountService.addToWatchList(Number(this.movieID), 'movie', !this.isOnWatchlist).subscribe(d => {
      this.isOnWatchlist = d;
    });
  }

  rateMovie(i: any) {
    if (i == this.rate) {
      this.rate = 0;
      this.accountService.deleteRate(this.movieID).subscribe(d => { console.log(d); });
    }
    else {
      this.rate = i;
      this.accountService.rateMovie(this.movieID, this.rate).subscribe(d => {
      });
    }
  }

  showMovieTrailer() {
    this.coreService.showBrowser(this.trailerURL);
  }

  shareMovie() {
    console.log("share Movie ", this.movie);
    let url = `https://www.themoviedb.org/movie/${this.movie.id}`;
    this.socialSharing.share(this.movie.title, this.movie.overview, null, url).then((d) => {
      console.log(d);
      // Sharing via email is possible
    }).catch((err) => {
      // Sharing via email is not possible
      console.log(err);

    });
    
  }

  getMovieDetail() {
    this.movieService.getMovieDetail(this.movieID).subscribe(d => {
      this.movie = d;
    });
  }

  getAccountStateForMovie() {
    this.movieService.getAccountStateForMovie(this.movieID).subscribe(d => {
      this.isOnWatchlist = d.watchlist;
      this.isFavorite = d.favorite;
      this.rate = d.rated == false ? 0 : d.rated.value / 2;
      console.log(this.rate);
    });
  }

  getMovieCast() {
    this.movieService.getMovieCast(this.movieID).subscribe(d => {
      let tmpCastList = d;
      this.castList = tmpCastList.length > 10 ? tmpCastList.slice(0, 10) : tmpCastList;
    });
  }

  getMovieTrailer() {
    this.movieService.getMovieTrailerURL(this.movieID).subscribe(d => {
      this.trailerURL = d;
    });
  }


  getSimilarMovies() {
    this.movieService.getSimilarMovies(this.movieID).subscribe(d => {
      this.similarMovies = d;
    });
  }

}
