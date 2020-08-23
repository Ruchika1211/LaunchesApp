import { Component, OnInit } from '@angular/core';
import { SpaceServService } from './space-serv.service';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-universal-example';
  filterData;
  launches: Array<any>;
  filters = 'limit=100';
  launchYear: string;
  launchSuccess: string;
  landSuccess: string;
  uniqueF: boolean;

  constructor(private spaceSer: SpaceServService) {

  }

  ngOnInit() {
    const filtersArr = this.spaceSer.getFilters(); // get all filters
    this.fetchDataByFilter(); // Search by saved filter if any
    this.spaceSer.getFilters().subscribe((data) => {
      this.filterData = data['filters'];
    });

  }

  // function to show selected filter
  findActiveClass(key, data) {
    switch (key) {
      case 0:
        if (this.launchYear === data) {
          return true;
        }

        break;
      case 1:
        if (this.launchSuccess === data) {
          return true;
        }

        break;
      case 2:
        if (this.landSuccess === data) {
          return true;
        }
        break;
      default:
        console.log(data);


        return false;
    }
  }

  // function to get launches data from server
  getLaunches(filters) {
    this.spaceSer.getLaunches(filters).subscribe((data: any) => {
      this.launches = data;
    });
  }

  // function to create a filter string combining all filter
  fetchDataByFilter() {
    const prevfilter = this.spaceSer.getItem('filter') ? JSON.parse(this.spaceSer.getItem('filter')) : [];
    let filterString = this.filters;

    prevfilter.map((v, i) => {
      switch (v.key) {
        case 0:
          this.launchYear = v.value;
          filterString = filterString ? `${filterString}&launch_year=${v.value}` : '';
          break;
        case 1:
          this.launchSuccess = v.value;
          filterString = filterString ? `${filterString}&launch_success=${v.value.toLowerCase()}` : '';

          break;
        case 2:
          this.landSuccess = v.value;
          filterString = filterString ? `${filterString}&land_success=${v.value.toLowerCase()}` : '';
          break;
        default:
          console.log('remove filter');

      }
      return v;
    });
    this.getLaunches(filterString);

  }

  // function to save data in localhost
  saveFilter(key, data) {
    const prevfilter = this.spaceSer.getItem('filter') ? JSON.parse(this.spaceSer.getItem('filter')) : [];
    const tempFilter = {};
    if (prevfilter.length > 0) {

      const pos = prevfilter.map((e) => e['key']).indexOf(key);
      if (pos >= 0) {
        prevfilter[pos]['value'] = data;
        prevfilter[pos]['key'] = key;

      }
      else {
        tempFilter['value'] = data;
        tempFilter['key'] = key;
        prevfilter.push(tempFilter);
      }

    }
    else {
      tempFilter['value'] = data;
      tempFilter['key'] = key;
      prevfilter.push(tempFilter);

    }
    this.spaceSer.setItem('filter', JSON.stringify(prevfilter));
    this.fetchDataByFilter();


  }

  // on click of filters
  filterApplied(filterV, filterApplied) {
    this.saveFilter(filterApplied, filterV);
  }


}
