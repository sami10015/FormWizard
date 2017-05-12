/*
 * This controller runs on the web form application
 * This controller was created to render the metadata stored in the mongoDB
 * As you run through each "page" on the web form application, the controller re-renders the page with the next section
 * When you finish the form and click "Generate PDF" a post request from this controller is sent out to render the PDF
 */ 
var app = angular.module('myApp', ['ngRoute', 'ngResource']);

// Simple string function to capitalize first letter in string object
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Controller for main form page
app.controller('formPageCtrl', ['$scope', '$http', '$resource', '$compile', '$parse', '$rootScope', '$window', function ($scope, $http, $resource, $compile, $parse, $rootScope, $window) {
	// Function to create the page based on the collected artifacts and title(Past Initially Landing Page)
	$scope.createFormPage = function(sectionNumber = 0){
		var sectionNum = sectionNumber;
		// If there is user resume information stored in the session storage, render the page where it last left off
		if(sessionStorage.getItem('userResume')){
			var user = JSON.parse(sessionStorage.getItem('userResume'));
			sessionStorage.setItem('resData', JSON.stringify(user.formData));
			sessionStorage.setItem('userData', JSON.stringify(user.userData));
			sectionNum = user.sectionNum;
			sessionStorage.removeItem('userResume');
		}

		$scope.currentSection = sectionNum;
		// JSON data from server
		var resData = sessionStorage.getItem('resData');

		// Gather all the artifacts throughout the pages
		var pageLength = JSON.parse(resData).pages.length;
		var artifactsArray = [];
		for(var i = 0; i < pageLength; i++){
			var artifacts = JSON.parse(resData).pages[i].artifacts;
			for(var j = 0; j < artifacts.length; j++){
				artifactsArray.push(artifacts[j]);
			}
		}
		var artifactsLength = artifactsArray.length;

		// Before parsing the page, must check if there are no more pages to check, or if the user clicked previous on the first page
		if(sectionNum < 0){
			$window.location.href = 'http://127.0.0.1:3000/';
		}else if(sectionNum >= artifactsLength){
			// Parse JSON string information to begin rendering the page
			$scope.title = JSON.parse(resData).title;

			// First, empty everything under the main div
			var mainDiv = document.getElementById('mainContainer');
			angular.element(mainDiv).empty();

			// Second, create progress bar based on what page you are on, and how many pages left(for now, building static progress bar for show)
			var progressPercentage = Math.round((sectionNum/artifactsLength)*100);
			var progressDiv = angular.element('<div class="progress"> </div>')
			var progressBar = angular.element('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:' + progressPercentage + '%"> ' + progressPercentage + '% Complete</div>')
			progressDiv.append(progressBar);
			angular.element(mainDiv).append(progressDiv);

			// Third, render the title of the page
			var titleHeader = angular.element('<h1>' + $scope.title + '</h1>');
			angular.element(mainDiv).append(titleHeader);

			// Fourth, create buttons and gather previous section number for page rendering
			var previousSectionNum;
			for(var i = sectionNum - 1; i >= 0; i--){
				if(artifactsArray[i].section != null){
					previousSectionNum = i;
					break;
				}
			}

			// Last, create buttons to finish the page
			var subContainer = angular.element('<div class = "container"> </div>');
			var buttonContainer = angular.element('<div class = "container"> </div>');
			var saveButton = angular.element('<button type="button" class="btn btn-default">Save & Quit</button>');
			var quitButton = angular.element('<button type="button" class="btn btn-default" onClick = "window.history.back()">Quit</button>');
			// Angular compilation to allow pdfButton to access the post request function
			var pdfButton = angular.element('<button type="button" class="btn btn-primary" ng-click="postUserData()">Generate PDF</button>');
			var compiledPdfButton = $compile(pdfButton);
			newPdfButton = compiledPdfButton($scope);
			// Angular compilation to allow previous button to access this function ng-click function
			var previousButton = angular.element('<button type="button" class="btn btn-default" ng-click="createFormPage(' + previousSectionNum + ')">Previous</button>');
			var compiledPreviousButton = $compile(previousButton);
			var newPreviousButton = compiledPreviousButton($scope);

			// Render buttons onto page
			buttonContainer.append(saveButton);
			buttonContainer.append(quitButton);
			buttonContainer.append(newPreviousButton);
			buttonContainer.append(newPdfButton);
			subContainer.append(buttonContainer);
			angular.element(mainDiv).append(subContainer);
		}else{
			// Parse JSON string information to begin rendering the page
			$scope.title = JSON.parse(resData).title;
			
			// Get the corresponding page's artifacts, and what the next page number will be for buttons below
			$scope.artifacts = artifactsArray
			// Gather next section num and previous section num variables
			var nextSectionNum;
			for(var i = sectionNum + 1; i < $scope.artifacts.length; i++){
				if(i == $scope.artifacts.length - 1){
					nextSectionNum = $scope.artifacts.length
					break;
				}
				else if($scope.artifacts[i].section != null){
					nextSectionNum = i;
					break;
				}
			}
			var previousSectionNum = -1;
			for(var i = sectionNum - 1; i >= 0; i--){
				if(artifactsArray[i].section != null){
					previousSectionNum = i;
					break;
				}
			}

			// First, empty everything under the main div
			var mainDiv = document.getElementById('mainContainer');
			angular.element(mainDiv).empty();

			// Second, create progress bar based on what page you are on, and how many pages left(for now, building static progress bar for show)
			var progressPercentage = Math.round((sectionNum/artifactsLength)*100);
			var progressDiv = angular.element('<div class="progress"> </div>')
			var progressBar = angular.element('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width:' + progressPercentage + '%"> ' + progressPercentage + '% Complete</div>')
			progressDiv.append(progressBar);
			angular.element(mainDiv).append(progressDiv);

			// Third, render the title of the page
			var titleHeader = angular.element('<h1>' + $scope.title + '</h1>');
			angular.element(mainDiv).append(titleHeader);

			// Fourth, create field number scope variable for input ID's(later used with saving info in JSON)
			$scope.fieldId = 0

			// Fifth, loop through all the artifacts and render them under the main div according to their type
			for(var i = sectionNum; i < nextSectionNum; i++){
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
								var radioButton = angular.element('<div class="radio-inline"> <label><input type="radio" name="' + groupFields[j].groupName + '" value="' + groupFields[j].name + '" id = "field' +  $scope.fieldId + '">' + groupFields[j].name + '</label></div>')
								subContainer.append(radioButton);
								// Save the fence information for this field
								sessionStorage.setItem('fieldFence' + $scope.fieldId, JSON.stringify(groupFields[j].fence));
								// Increment field id number
								$scope.fieldId += 1;
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
								var checkBox = angular.element('<label class="checkbox-inline"><input type="checkbox" name="' + groupFields[j].groupName + '" value="' + groupFields[j].name + '" id = "field' +  $scope.fieldId + '">' + groupFields[j].name + '</label>')
								subContainer.append(checkBox);
								// Save the fence information for this field
								sessionStorage.setItem('fieldFence' + $scope.fieldId, JSON.stringify(groupFields[j].fence));
								// Increment field id number
								$scope.fieldId += 1;
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
						// Create this fieldCount integer to store information in HTML Session Storage JSON
						$scope.fieldCount = 0;
						if(type == "Text"){
							var placeHolder = field.name;
							var subContainer = angular.element('<div class = "container"> </div>');
							var inputBox = angular.element('<div class="form-group col-xs-4"> <input type="text" class="form-control" id = "field' + $scope.fieldId + '" placeholder="' + placeHolder + '"> </div>');
							// Save the fence information for this field
							console.log(field.fence);
							sessionStorage.setItem('fieldFence' + $scope.fieldId, JSON.stringify(field.fence));
							// Increment field id number
							$scope.fieldId += 1;
							subContainer.append(inputBox);
							angular.element(mainDiv).append(subContainer);
						}else if(type == "Number"){
							var placeHolder = field.name;
							var subContainer = angular.element('<div class = "container"> </div>');
							var inputBox = angular.element('<div class="form-group col-xs-4"> <input type="number" class="form-control" id = "field' + $scope.fieldId + '" placeholder="' + placeHolder + '"> </div>');
							// Save the fence information for this field
							sessionStorage.setItem('fieldFence' + $scope.fieldId, JSON.stringify(field.fence));
							// Increment field id number
							$scope.fieldId += 1;
							subContainer.append(inputBox);
							angular.element(mainDiv).append(subContainer);
						}else if(type == "Date"){
							var placeHolder = field.name;
							var subContainer = angular.element('<div class = "container"> </div>');
							var inputBox = angular.element('<div class="form-group col-xs-4"> <label for="' + placeHolder + '">' + placeHolder + ':</label> <input type="date" class="form-control" id = "field' + $scope.fieldId + '"> </div>');
							// Save the fence information for this field
							sessionStorage.setItem('fieldFence' + $scope.fieldId, JSON.stringify(field.fence));
							// Increment field id number
							$scope.fieldId += 1;
							subContainer.append(inputBox);
							angular.element(mainDiv).append(subContainer);
						}
					}
				}
			}
			// Last, create buttons to finish the page
			var subContainer = angular.element('<div class = "container"> </div>');
			var buttonContainer = angular.element('<div class = "container"> </div>');
			var quitButton = angular.element('<button type="button" class="btn btn-default" onClick = "window.history.back()">Quit</button>');
			// Angular compilation to allow preivous button to access this function ng-click function
			var previousButton = angular.element('<button type="button" class="btn btn-default" ng-click="createFormPage(' + previousSectionNum + ')">Previous</button>');
			var compiledPreviousButton = $compile(previousButton);
			var newPreviousButton = compiledPreviousButton($scope);
			// Angular compilation to allow next button to access this function ng-click function
			var nextButton = angular.element('<button type="button" class="btn btn-primary" ng-click="saveUserData(' + previousSectionNum + ',' + nextSectionNum + ')">Next</button>');
			var compiledNextButton = $compile(nextButton);
			var newNextButton = compiledNextButton($scope);
			// Angular compilation to allow save button to access this function ng-click function
			var saveButton = angular.element('<button type="button" class="btn btn-default" ng-click="saveAndQuit()">Save & Quit</button>');
			var compiledSaveButton = $compile(saveButton);
			var newSaveButton = compiledSaveButton($scope);

			// Render buttons onto page
			buttonContainer.append(newSaveButton);
			buttonContainer.append(quitButton);
			buttonContainer.append(newPreviousButton);
			buttonContainer.append(newNextButton);
			subContainer.append(buttonContainer);
			angular.element(mainDiv).append(subContainer);

			// Little thing to possibly add later that shows PDF on the screen
			// if(document.getElementById('frame') == null) {
			// 	angular.element(document.getElementById("body")).append(angular.element('<iframe src = "http://127.0.0.1:3000/forms/Central United Life beneficiary change-1.png" align="right" width="600" height="775" id="frame">'))
			// }
		}
	}

	// Function that saves all user input in HTML session storage, and then calls createFormPage()
	$scope.saveUserData = function(previousSectionNum, nextSectionNum){
		// Create an array of JSON objects that will be store all the values/fences info for each section 
		var fieldsInfo = [];
		// Gather all the values of input within the page
		for(var i = 0; i < $scope.fieldId; i++){
			var fence;
			var fieldValue;
			// You need to parse HTML radio buttons/checkboxes differently than text boxes
			if(document.getElementById('field' + i).type == 'radio'){
				if(document.getElementById('field' + i).checked){
					// Notify the server that this is a radio button and needs to be checked
					fieldValue = 'radioButton';
					fence = JSON.parse(sessionStorage.getItem('fieldFence' + i));
					// Create JSON Obj for fieldsInfo array
					var tempFieldObj = {
						'value' : fieldValue,
						'fence' : fence
					};
					fieldsInfo.push(tempFieldObj);
				}
			} else {
				fieldValue = document.getElementById('field' + i).value;
				fence = JSON.parse(sessionStorage.getItem('fieldFence' + i));
				// Create JSON Obj for fieldsInfo array
				var tempFieldObj = {
					'value' : fieldValue,
					'fence' : fence
				};
				fieldsInfo.push(tempFieldObj);
			}
		}

		// If there is no user data, create it...If not, append to it!
		if(sessionStorage.getItem('userData') == null){
			// Create User JSON obj and add it to the session storage
			var userJSON = {};
			// Starts at -1 for initial page, then increments forward...use previous section num
			userJSON['section' + previousSectionNum] = fieldsInfo;
			sessionStorage.setItem('userData', JSON.stringify(userJSON));
			$scope.createFormPage(nextSectionNum);
		} else {
			var userJSON = JSON.parse(sessionStorage.getItem('userData'));
			userJSON['section' + previousSectionNum] = fieldsInfo;
			sessionStorage.setItem('userData', JSON.stringify(userJSON));
			$scope.createFormPage(nextSectionNum);
		}
		console.log(JSON.parse(sessionStorage.getItem('userData')));
	}

	// Function that posts JSON TO EXPRESS
	$scope.postUserData = function(){
		var data = JSON.parse(sessionStorage.getItem('userData'));
		$http.post('pdfCreation', data, {responseType:'arraybuffer'})
			.then(function(res){
				var file = new Blob([res.data], {type: 'application/pdf'});
        		var fileURL = URL.createObjectURL(file);
        		window.open(fileURL);
			}, function(error){
				console.log("Error: " + error);
			})
	}

	// Function that posts all user data to mongo and quits
	$scope.saveAndQuit = function(){
		// Gather the section that the user is currently on, the form the user is working on, and what the user has already filled in
		var userData = JSON.parse(sessionStorage.getItem('userData'));
		var formData = JSON.parse(sessionStorage.getItem('resData'));
		var userJSON = {
			userData : userData,
			formData: formData,
			sectionNum : $scope.currentSection
		}
		console.log(userJSON);
		$http.post('saveAndQuit', userJSON)
			.then(function(res){
				$window.location.href = 'http://127.0.0.1:3000/';
			}, function(error){	
				console.log("Error: " + error);
			})
	}
}])
