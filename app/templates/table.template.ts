export const template: string = `
<div class='rx-here'></div>
<div class="table-main">
  <div class="table-toggler">
    <position-check class="table-info" [date]='date' [curentCity]='curentCity' [format]='format'></position-check>
    <button type='button' class='add-item' (click)='addNearestCity()'>+ Add nearest city</button>
    <label for="table-id" class="table-label"  [class.active]="tableVisibility">
      <span>Show table view:</span>
      <input type="checkbox" value="" id="table-id"  (click)="tableToggle()">
    </label>
  </div>
  <table class="table-content animated" [class.fadeInDownBig]='tableVisibility' [class.fadeInUpBig]='!tableVisibility' *ngIf='tableVisibility && weather.list.length'>
      <tr>
        <td>Options:</td>
        <td></td>
        <td>
          <strong class='options' [class.active]="format == 'farengate'" (click)="checkFormat('farengate')">F</strong>
          <strong class='options' [class.active]="format == 'kelven'" (click)="checkFormat('kelven')">K</strong>
          <strong class='options' [class.active]="format == 'celsia'" (click)="checkFormat('celsia')">C</strong>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>City name</td>
        <td>Icon</td>
        <td>Temperature</td>
        <td>Weather</td>
        <td>Clouds</td>
        <td>Pressure</td>
        <td>Humidity</td>
        <td>Wind</td>
        <td>Add to favorite</td>
        <td>Remove</td>
      </tr>
      <tablerow *ngFor="let weather of (weather.list | orderBy: 'favor')" [weather]='weather' [format]='format' (onFavor)='tryToChange($event)' (onDelete)='deleteItem($event)'></tablerow>
    </table>
    <table class="table-content" *ngIf='tableVisibility && !weather.list.length'><tr><td>Nothing here</td></tr></table>
</div>
`
