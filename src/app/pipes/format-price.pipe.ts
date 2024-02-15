import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'formatPrice',
    standalone: true
})
export class FormatPricePipe implements PipeTransform {

    transform(value: any) {
        return '$ ' + Math.abs(value).toFixed(2);
    }

}