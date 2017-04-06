var app = angular.module('myApp', ['ngRoute', 'ngResource']);

// Simple string function to capitalize first letter in string object
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Controller for main form page
app.controller('mainFormCtrl', ['$scope', '$http', '$resource', '$compile', '$parse', '$rootScope', '$window', function ($scope, $http, $resource, $compile, $parse, $rootScope, $window) {
	
	// Initial request to go to server and get main form types
	$scope.initialRequest = function(){
		$http.get('/formTypes')
		.then(function(res){
			var obj = JSON.parse(res.data);
			var paths = [];
			var mainFormTypes = [];
			// Gather all the different paths
			for(var i = 0; i < obj.length; i++){
				paths.push(obj[i].name);
			}
			// Loop through all the different paths, and get the main path of each, while not copying the same path twice
			for(var i = 0; i < paths.length; i++){
				var path = paths[i];
				var mainFormType = ''
				for(var j = 0; j < path.length; j++){
					if(path.charAt(j) != '/'){
						mainFormType += path.charAt(j);
					}else{
						var duplicated = false;
						// Check if this form type has already been added
						if(mainFormTypes.length != 0){
							for(var x = 0; x < mainFormTypes.length; x++){
								if(mainFormTypes[x].toLowerCase() == mainFormType.toLowerCase()){
									duplicated = true;
									break;
								}
							}
						}

						// If it is duplicated, just loop again...If not, add it to the mainFormTypes array!
						if(duplicated == false){
							mainFormTypes.push(mainFormType.capitalizeFirstLetter());
							break;
						}else{
							break;
						}
					}
				}
			}
			$scope.mainFormTypes = mainFormTypes;
		}, function(error) {
			console.log(error);
		});
	}

	// Function to do an HTTP GET Request on variables, returns -1 if nothing else in path(make button), or string of the scope object for ng-repeat
	$scope.httpGetRequest = function(path, divCount, newContainerId, newFormId, newNgModelId, ngModel, mainDiv){
		$http.get(path)
			.then(function(res){
				// (Need to change this)
				const obj = JSON.parse(res.data);
				var objPaths = obj.paths;
				// If the obj path returned is empty, then you must output buttons because there is nothing left in the path
				if(objPaths == ''){
					$scope.createDiv = -1;
				} else {
					// Create next types through path in JSON obj
					var nextSubType = '';
					var formTypes = [];
					console.log(objPaths);
					console.log(typeof(objPaths));
					
					// If there is only one path under the selection, then you must parse it differently then multiple paths
					if(typeof(objPaths) == 'string'){
						objPathsSplit = objPaths.split('/');
						objPathsSplit.shift();
						var tempPathArrayElem = objPathsSplit[0];
						var pathArrayElem = tempPathArrayElem.replace(/_/g, ' ').capitalizeFirstLetter();
						formTypes.push(pathArrayElem);
					} 
					// If there are multiple, then you must loop through them
					else {
						var tempFormTypes = [];
						// Gather the different sub form types
						for(var i = 0; i < objPaths.length; i++){
							var objPathsSplit = objPaths[i].split('/');
							objPathsSplit.shift();
							var tempPathArrayElem = objPathsSplit[0];
							var pathArrayElem = tempPathArrayElem.replace(/_/g, ' ').capitalizeFirstLetter();
							tempFormTypes.push(pathArrayElem);
						}

						// Remove the duplicate form types
						formTypes = tempFormTypes.filter( function(item, index, inputArray) {
		           			return inputArray.indexOf(item) == index;
		    			});
					}

					// Create a dynamic scope variable based on string
					var stringScopeVariable = 'subFormType' + divCount;

					// Create the model for the dynamic scope variable
					var model = $parse(stringScopeVariable);

					// Assign value to the scope(Need to change this)
					model.assign($scope, formTypes);

					// Use this below to create a div
					$scope.createDiv = 'subFormType in ' + stringScopeVariable;
				}

				// If the createDiv variable is -1, then you need to build buttons, and set scope title and artifacts for the next few pages
				if($scope.createDiv == -1){
					// If there are buttons, delete them
					if(document.getElementById('buttonDiv') != null){
						document.getElementById('buttonDiv').remove();
					}
					var firstDiv = angular.element("<div class='container' id='buttonDiv'> </div>");
					var secondDiv = angular.element("<div class='container'> </div>");
					var cancelButton = angular.element("<button type='button' class='btn btn-default' onClick='window.location.reload()' style = 'margin-right:5px'>Quit</button>");
					var successButton = angular.element("<button type='button' class='btn btn-primary' onClick=\"document.location.href='http://127.0.0.1:3000/fillOutForm.html'\">Begin</button>");
					secondDiv.append(cancelButton);
					secondDiv.append(successButton);
					firstDiv.append(secondDiv)
					angular.element(mainDiv).append(firstDiv);

					// Save to HTML session storage due to scope recreation on page load
					sessionStorage.setItem('resData', res.data);
				}
				// Otherwise, create a new div
				else{					
					var newDiv = angular.element("<div class='container' id='" + newContainerId + "'> </div>");
					var newFormDiv = angular.element("<div class='form-group dropdown col-xs-3'> </div>");
					var newFormLabel = angular.element("<label for='" + newFormId + "'> What type of " + ngModel + " form do you want to complete? </label>");
					
					// To include angular in HTML DOM Element, must compile the string, and then link to the scope
					var newFormSelect = angular.element("<select class='form-control' id='" + newFormId + "' ng-model='" + newNgModelId + "' ng-change=\"createOrDeleteDiv('" + newContainerId + "', '" + newFormId + "', " + newNgModelId + ")\"> <option value='' disabled selected>SELECT</option> </select>");
					var compiledNewFormSelect = $compile(newFormSelect);
					var newFormSelectContent = compiledNewFormSelect($scope);

					// To include angular in HTML DOM Element, must compile the string, and then link to the scope
					var newFormSelectOption = angular.element("<option ng-repeat='" + $scope.createDiv + "'>{{subFormType}}</option>")
					var compiledNewFormSelectOption = $compile(newFormSelectOption);
					var newFormSelectOptionContent = compiledNewFormSelectOption($scope);

					// Append html together, and append to main div on the screen
					newFormSelectContent.append(newFormSelectOptionContent);
					newFormLabel.append(newFormSelectContent);
					newFormDiv.append(newFormLabel);
					newDiv.append(newFormDiv);
					angular.element(mainDiv).append(newDiv);
				}				
			}, function(error){
				console.log("Error:" + error.statusText);
			})
	}	

	// Function to create or delete div based on form selections(Initially landing page)
	$scope.createOrDeleteDiv = function(containerId, formId, ngModel){
		// Get id number
		var idNum = parseInt(formId.charAt(formId.length-1)) + 1;
		// Possible new div container ID
		var newContainerId = "container" + idNum;
		// Possible new select form ID
		const newFormId = "typeFormSel" + idNum;
		// Possible new ngModel ID
		const newNgModelId = "formName" + idNum;

		// If the selected index is blank, delete every div container past it
		if(document.getElementById(formId).selectedIndex == 0){
			// Delete all div containers past this one
			while(true){
				// Stop if there are no more containers
				if(document.getElementById(newContainerId) == null){
					break;
				}
				// Otherwise, delete the container(setting intial value to 0), and increment to the next one
				else {
					document.getElementById(newContainerId).remove();
					idNum += 1;
					newContainerId = "container" + idNum;
				}
			}

			// Delete buttons as well(if they exist)
			if(document.getElementById('buttonDiv') != null){
				document.getElementById('buttonDiv').remove();
			}
		} 
		// Otherwise, create a div using jqLite
		else {
			// Creating new div for drop down using jqLite
			var mainDiv = document.getElementById("fullForm");

			// Somewhere here, you must run another function that does an HTTP GET request, and determines whether or not it needs to build another div, or build a button
			var pathString = '';
			var divCount = 0;

			// Using 100 for now, creating the path string to send to HTTP GET request function
			for(var i = 0; i < 100; i++){
				var selectElem = document.getElementById("typeFormSel" + i);
				if(selectElem == null){
					divCount = i;
					break;
				}else{
					pathString += '/';
					var tempSelectElemText = selectElem.options[selectElem.selectedIndex].text;
					var selectElemText = tempSelectElemText.replace(/ /g, '_');
					pathString += selectElemText;
				}
			}
			console.log(pathString);

			// Call an HTTP GET Request and decide whether to build a new div drop down or create buttons to continue
			$scope.httpGetRequest(pathString, divCount, newContainerId, newFormId, newNgModelId, ngModel, mainDiv);
		}
	}

	// Function to create the page based on the collected artifacts and title(Past Initially Landing Page)
	$scope.createFormPage = function(pageNum = 0){
		var resData = sessionStorage.getItem('resData');
		var pageLength = JSON.parse(resData).pages.length;
		// Before parsing the page, must check if there are no more pages to check, or if the user clicked previous on the first page
		if(pageNum < 0){
			$window.location.href = 'http://127.0.0.1:3000/';
		}else if(pageNum >= pageLength){
			// Parse JSON string information to begin rendering the page
			$scope.title = JSON.parse(resData).title;

			// First, empty everything under the main div
			var mainDiv = document.getElementById('mainContainer');
			angular.element(mainDiv).empty();

			// Second, create progress bar based on what page you are on, and how many pages left(for now, building static progress bar for show)
			var progressPercentage = (pageNum/pageLength)*100;
			var progressDiv = angular.element('<div class="progress"> </div>')
			var progressBar = angular.element('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:' + progressPercentage + '%"> ' + progressPercentage + '% Complete</div>')
			progressDiv.append(progressBar);
			angular.element(mainDiv).append(progressDiv);

			// Third, render the title of the page
			var titleHeader = angular.element('<h1>' + $scope.title + '</h1>');
			angular.element(mainDiv).append(titleHeader);

			// Fourth, create buttons
			var previousPageNum = pageNum - 1;

			// Last, create buttons to finish the page
			var subContainer = angular.element('<div class = "container"> </div>');
			var buttonContainer = angular.element('<div class = "container"> </div>');
			var saveButton = angular.element('<button type="button" class="btn btn-default">Save & Quit</button>');
			var quitButton = angular.element('<button type="button" class="btn btn-default" onClick = "window.history.back()">Quit</button>');
			var pdfButton = angular.element('<button type="button" class="btn btn-primary">Generate PDF</button>');
			// Angular compilation to allow preivous button to access this function ng-click function
			var previousButton = angular.element('<button type="button" class="btn btn-default" ng-click="createFormPage(' + previousPageNum + ')">Previous</button>');
			var compiledPreviousButton = $compile(previousButton);
			var newPreviousButton = compiledPreviousButton($scope);

			// Render buttons onto page
			buttonContainer.append(saveButton);
			buttonContainer.append(quitButton);
			buttonContainer.append(newPreviousButton);
			buttonContainer.append(pdfButton);
			subContainer.append(buttonContainer);
			angular.element(mainDiv).append(subContainer);
		}else{
			// Parse JSON string information to begin rendering the page
			$scope.title = JSON.parse(resData).title;
			
			// Get the corresponding page's artifacts, and what the next page number will be for buttons below
			$scope.page = JSON.parse(resData).pages[pageNum];
			$scope.artifacts = $scope.page.artifacts;
			console.log($scope.artifacts);
			var nextPageNum = pageNum + 1;
			var previousPageNum = pageNum - 1;

			// First, empty everything under the main div
			var mainDiv = document.getElementById('mainContainer');
			angular.element(mainDiv).empty();

			// Second, create progress bar based on what page you are on, and how many pages left(for now, building static progress bar for show)
			var progressPercentage = (pageNum/pageLength)*100;
			var progressDiv = angular.element('<div class="progress"> </div>')
			var progressBar = angular.element('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:' + progressPercentage + '%"> ' + progressPercentage + '% Complete</div>')
			progressDiv.append(progressBar);
			angular.element(mainDiv).append(progressDiv);

			// Third, render the title of the page
			var titleHeader = angular.element('<h1>' + $scope.title + '</h1>');
			angular.element(mainDiv).append(titleHeader);

			// Fourth, loop through all the artifacts and render them under the main div according to their type
			for(var i = 0; i < $scope.artifacts.length; i++){
				var artifactObj = $scope.artifacts[i];
				// First, check if the artifact is a section, if not it is a field
				if(artifactObj.section != null){
					// If it is a section, render the title of the section object as an h2 header in HTML
					var sectionTitle = angular.element('<h2>' + artifactObj.section.title + '<h2>');
					angular.element(mainDiv).append(sectionTitle);
				} else {
					// If it is a field, get its type and/or groupName, and render the artifact accordingly
					var field = artifactObj.field;
					// Check if the field is a part of a group
					if(field.groupName != null){
						// Gather all the fields within the group
						var groupFields = [];
						var newArrayIndex;
						for(x = i; x < $scope.artifacts.length; x++){
							if($scope.artifacts[x].section != null || $scope.artifacts[x].field.groupName == null || $scope.artifacts[x].field.groupName != field.groupName){
								newArrayIndex = x;
								break;
							}else{
								groupFields.push($scope.artifacts[x].field);
							}
							newArrayIndex = x;
						}
						// Render the fields in the group based on whether it is a radio button or check box button
						if(groupFields[0].radio = true){
							var subContainer = angular.element('<div class = "container"> </div>');
							var radioCount = 0;
							for(j = 0; j < groupFields.length; j++){
								var radioButton = angular.element('<div class="radio-inline"> <label><input type="radio" name="' + groupFields[j].groupName + '">' + groupFields[j].name + '</label></div>')
								subContainer.append(radioButton);
								// Renders the radio buttons nicely 
								radioCount += 1;
								if(radioCount % 3 == 0){
									subContainer.append(angular.element('<br>'))
								}
							}
							// Append onto main div
							angular.element(mainDiv).append(subContainer);
						} else {
							var subContainer = angular.element('<div class = "container"> </div>');
							var checkBoxCount = 0;
							for(j = 0; j < groupFields.length; j++){
								var checkBox = angular.element('<label class="checkbox-inline"><input type="checkbox" value="">' + groupFields[j].name + '</label>')
								subContainer.append(checkBox);
								// Renders the radio buttons nicely 
								checkBoxCount += 1;
								if(checkBoxCount % 3 == 0){
									subContainer.append(angular.element('<br>'))
								}
							}
							// Append onto main div
							angular.element(mainDiv).append(subContainer);
						}

						// Change the initial for loop to continue after this group of artifacts
						i = x-1;
					} else {
						var type = field.type;
						if(type == "Text"){
							var placeHolder = field.name;
							var subContainer = angular.element('<div class = "container"> </div>');
							var inputBox = angular.element('<div class="form-group col-xs-4"> <input type="text" class="form-control" id="contractNumber" placeholder="' + placeHolder + '"> </div>');
							subContainer.append(inputBox);
							angular.element(mainDiv).append(subContainer);
						}else if(type == "Number"){
							var placeHolder = field.name;
							var subContainer = angular.element('<div class = "container"> </div>');
							var inputBox = angular.element('<div class="form-group col-xs-4"> <input type="number" class="form-control" id="contractNumber" placeholder="' + placeHolder + '"> </div>');
							subContainer.append(inputBox);
							angular.element(mainDiv).append(subContainer);
						}else if(type == "Date"){
							var placeHolder = field.name;
							var subContainer = angular.element('<div class = "container"> </div>');
							var inputBox = angular.element('<div class="form-group col-xs-4"> <label for="' + placeHolder + '">' + placeHolder + ':</label> <input type="date" class="form-control" id="' + placeHolder + '"> </div>');
							subContainer.append(inputBox);
							angular.element(mainDiv).append(subContainer);
						}
					}
				}
			}
			// Last, create buttons to finish the page
			var subContainer = angular.element('<div class = "container"> </div>');
			var buttonContainer = angular.element('<div class = "container"> </div>');
			var saveButton = angular.element('<button type="button" class="btn btn-default">Save & Quit</button>');
			var quitButton = angular.element('<button type="button" class="btn btn-default" onClick = "window.history.back()">Quit</button>');
			// Angular compilation to allow preivous button to access this function ng-click function
			var previousButton = angular.element('<button type="button" class="btn btn-default" ng-click="createFormPage(' + previousPageNum + ')">Previous</button>');
			var compiledPreviousButton = $compile(previousButton);
			var newPreviousButton = compiledPreviousButton($scope);
			// Angular compilation to allow next button to access this function ng-click function
			var nextButton = angular.element('<button type="button" class="btn btn-primary" ng-click="createFormPage(' + nextPageNum + ')">Next</button>');
			var compiledNextButton = $compile(nextButton);
			var newNextButton = compiledNextButton($scope);

			// Render buttons onto page
			buttonContainer.append(saveButton);
			buttonContainer.append(quitButton);
			buttonContainer.append(newPreviousButton);
			buttonContainer.append(newNextButton);
			subContainer.append(buttonContainer);
			angular.element(mainDiv).append(subContainer);

			// Little thing to possibly add later that shows PDF on the screen 
			//angular.element(document.getElementById("body")).append(angular.element('<iframe src = "http://127.0.0.1:3000/fillOutForm.html" align="right" width="600" height="775">'))
		}
	}
}]);