import { Component } from '@angular/core';

let selector: Element = window['speedrayPortletRootDiv']('<%= prefix %>-<%= htmlComponentName %>');

@Component({
  selector: selector.tagName,<% if (inlineTemplate) { %>
  template: `
  <h1>
    {{title}}
  </h1><% if (routing) { %>
  <router-outlet></router-outlet><% } %>
  `,<% } else { %>
  templateUrl: './app.component.html',<% } %><% if (inlineStyle) { %>
  styles: []<% } else { %>
  styleUrls: ['./app.component.<%= styleExt %>']<% } %>
})
export class AppComponent {
  title = '<%= prefix %> works!';
}
