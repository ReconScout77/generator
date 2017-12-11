import { Component, OnInit, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormsModule } from '@angular/forms';

import { Variable } from './variable';


import * as nerdamer from 'nerdamer';
declare let nerdamer: any;
require('./Solve.js');
require('./Algebra.js');
require('./Calculus.js');
require('./Extra.js');

var x = nerdamer.solve('x-1=-3/2', 'x');
var tries = x.toString().split(",");
console.log(tries[0]);


// declare var $: any;    //declaring jQuery
 declare var Guppy: any;   //declaring Guppy
 declare var GuppyOSK: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewChecked {
  title = 'app';
  guppyBox: any;
  parameterDiv: any;
  variables: any[] = [];
  userInputInJsonFormat: any;

  constructor(private http: Http) {
         // // Make the HTTP request:
         // this.http.get('http://localhost:4200/assets/symbols.json')
         //          .subscribe((data) => {
         //            console.log(data)
         //           });
                   // with map
           // this.http.get("http://localhost:4200/assets/symbols.json")
           //     .map((data) => {
           //       return data.json();
           //     })
           //     .subscribe((success) => {
           //       this.symbols = success;
           //       console.log(this.symbols);
           //     });
                 }

  ngOnInit() {
     Guppy.init_symbols(['/assets/symbols.json']);
  }

  ngAfterViewChecked() {
    // To create the guppy box
    //new Guppy("equationBox");
    this.guppyBox = $('.equation-container');
    if (!this.guppyBox.data('has-guppy')) {
    let guppy = new Guppy('equationBox');
      $(this.guppyBox).data('has-guppy', true);
    }
  }

  /* this is to get the content of the guppy box,
  it also converts the mathematical equation/expression into the desired format type(latex, asciimath, text, ast, eqns, function, xml)*/

  output (type){
    try {
      let content = Guppy.instances['equationBox'].backend.get_content(type);
        let stringifiedUserInput = content.toString();
        let extractedVars = this.extractVariables(content.toString());
        extractedVars = extractedVars.sort();
        console.log(extractedVars);
        /* creating variable instance and pushing each variable instance into the variables array*/
        for (let i = 0; i < extractedVars.length; i++) {
          let varName:string = extractedVars[i];
          let newVar = new Variable(varName);
          this.variables.push(newVar);
        }
        this.solveEquation(extractedVars[0]);
        console.log(this.variables);
        this.parameterDiv = $('.parameter-condition');
     this.parameterDiv.show();
    }catch (e) {
      alert('Parsing error!' + e);
    }
  }

  toFortran(inputString) {
    var output = [];
    for (var i = 0; i < inputString.length; i++) {
      if (inputString[i] == '^') {
        output.push('**');
      }
      else {
        output[i] = inputString[i];
      }
    }

    return output.join('');
  }

  solveEquation(variable) {
    console.log("Latex: "+ Guppy.instances['equationBox'].backend.get_content('latex'));

    var textAnswer = Guppy.instances['equationBox'].backend.get_content('text');
    console.log("Text: " + textAnswer);
    var formatedText = this.toFortran(textAnswer);
    console.log("Fortran Text: " + formatedText);

    console.log("XML: "+ Guppy.instances['equationBox'].backend.get_content('xml'));

    console.log("EQNS: "+ Guppy.instances['equationBox'].backend.get_content('eqns'));
    //console.log("This: " + inputString);
    //let answer = CQ(formatedText).solve(variable);
    //console.log("Answer: " + answer);
  }

  /*this method extracts out the variables from the string input */
  extractVariables(input) {
    let variableArr = [];
    let inputArr = input.split(',');
    for (let i = 0; i < inputArr.length - 1; i++) {
      if (inputArr[i] === 'var') {
        if (variableArr.includes(inputArr[i + 1]) === false) {
         variableArr.push(inputArr[i + 1]);
        }
      }
    }
    return variableArr;
  }

  generate(){
    $('.col-md-7').html('<h1> We are generating your questions!...</h1> <img src="../assets/img/calculatorLoading.gif">')
  }
  onSubmit(formValue) {
    console.log(formValue)
  }

  onScreenKeyboard() {
    var OSK = new GuppyOSK({"goto_tab":"qwerty"});
  }
}
