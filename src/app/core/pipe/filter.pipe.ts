import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any, filter: any, defaultFilter: boolean): any {

    if (!filter) {
      return items;
    }

    if (!Array.isArray(items)) {
      return items;
    }

    if (filter && Array.isArray(items)) {
      const filterKeys = Object.keys(filter);

      if (defaultFilter) {
        return items.filter(item =>
            filterKeys.reduce((x, keyName) =>
                (x && new RegExp(filter[keyName], 'gi').test(item['data'][keyName])) || filter[keyName] === '', true));
      } else {
        return items.filter(item => {
          return filterKeys.some((keyName) => {
            const keys = keyName.split('.');
            return new RegExp(filter[keyName], 'gi').test(item[keys[0]][keys[1]]) || filter[keyName] === '';
          });
        });
      }
    }
  }
}
