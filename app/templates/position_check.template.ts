export const template: string = `
  <p>City name: {{curentCity.name}}</p>
  <p>Date: {{ date | date: "shortDate"}}</p>
  <p>Temperature: {{curentCity.main.temp | temperature: format}}</p>
`
