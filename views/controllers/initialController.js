/*
 * This controller runs on the initial landing page of the formWizard
 * It's main functionality is appending drop down div's to the initial page, and appending buttons when the user reached the end
 * Each drop down div is filled with sub categories to the category that was selected in the previous drop down div
 * For example, if I had a category loaded in called insurance/cob/lincoln and insurance/cob/central_united
 * If I selected insurance in the first initial div, the category cob(change of beneficiary) will be loaded in another appending div
 * Then, if I select cob, the next drop down div will have lincoln and central united loaded...along with buttons because it is the final category!
 * Each time the user selects a category in a drop down div, it does an HTTP get request to the server side script to get the sub categories
*/

var app = angular.module('myApp', ['ngRoute', 'ngResource']);

/* 
 * Simple string function to capitalize first letter in string object
 * This is used for aesthetic purposes when displaying the category of the form in the drop down div
 * For example, insurance will appear as Insurance under a drop down div, making it look nicer
*/ 
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/*
 * The start of creating the controller requires a name for the controller, and all the angularJS services that you are going to use
 * $scope is used to save information in scope to the angular controller
 * $http is used to do GET/POST requests to our server side script, making this a RESTFUL application
 * $compile is used to compile HTML string elements that use angularJS directives, function, etc...
 * $parse is used to create angularJS model variables with a string...very similar to creating a JSON object key with another string variable
 * $window is used to do redirect from an angularJS controller
 * $resource is used for special post requests...not used yet in this app
 * Refer to AngularJS documentation online for more services or more info...
*/ 
app.controller('initialCtrl', ['$scope', '$http', '$resource', '$compile', '$parse', '$window', function ($scope, $http, $resource, $compile, $parse, $window) {
	
	/*
	 * This is the intial GET request to the server side script that runs every time the initial landing page is loaded
	 * It parses all the category path's sent over from the server side script, and puts each main category under the first drop down div(w/o duplication)
	 * It also checks if there is a user object attached with the response JSON object...if there is a resume button will be displayed
	*/
	$scope.initialRequest = function(){
		// Clear the session storage
		sessionStorage.clear();
		// Request intial main form types
		$http.get('/formTypes')
		.then(function(res){
			var obj = JSON.parse(res.data).category;
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

			// Check if any user object was attached along with the response JSON object 
			if(JSON.parse(res.data).user != null){
				$scope.resume = true;
				$scope.user = JSON.parse(res.data).user;
				var resumeButton = angular.element('<button id="resume" type="button" class="btn btn-primary" ng-click="resumeForm()">Resume</button>');
				var compiledResumeButton = $compile(resumeButton);
				var newResumeButton = compiledResumeButton($scope);
				angular.element(document.getElementById('initialDiv')).append(newResumeButton);
			}
		}, function(error) {
			console.log(error);
		});
	}

	/* This function handles http GET requests based on the user input
	 * For example, if they select insurance it will do an http GET request for /insurance
	 * There are a lot of parameters for this function because each drop down div needs to link to the previous and next drop down div
	 * If there is nothing left in the path, buttons are displayed on the screen
	 */ 
	$scope.httpGetRequest = function(path, divCount, newContainerId, newFormId, newNgModelId, ngModel, mainDiv){
		$http.get(path)
			.then(function(res){
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
					if(document.getElementById('resume')){
						document.getElementById('resume').remove();
					}
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
					// Check if resume button has been created, if so delete the previous one and add another one as the page continues
					if($scope.resume){
						var resumeButton = angular.element('<button id="resume" type="button" class="btn btn-primary" ng-click="resumeForm()">Resume</button>');
						var compiledResumeButton = $compile(resumeButton);
						var newResumeButton = compiledResumeButton($scope);
						secondDiv.append(newResumeButton);
					}
					firstDiv.append(secondDiv)
					angular.element(mainDiv).append(firstDiv);

					// Save to HTML session storage due to scope recreation on page load
					sessionStorage.setItem('resData', res.data);
				}
				// Otherwise, create a new dropdown div
				else{					
					var newDiv = angular.element("<div class='container' id='" + newContainerId + "'> </div>");
					var newFormDiv = angular.element("<div class='form-group dropdown col-xs-3'> </div>");
					var newFormLabel = angular.element("<label for='" + newFormId + "'> What type of " + ngModel + " form do you want to complete? </label>");
					
					// To include angular in HTML DOM Element, must compile the string, and then link to the angular scope
					var newFormSelect = angular.element("<select class='form-control' id='" + newFormId + "' ng-model='" + newNgModelId + "' ng-change=\"createOrDeleteDiv('" + newContainerId + "', '" + newFormId + "', " + newNgModelId + ")\"> <option value='' disabled selected>SELECT</option> </select>");
					var compiledNewFormSelect = $compile(newFormSelect);
					var newFormSelectContent = compiledNewFormSelect($scope);

					// To include angular in HTML DOM Element, must compile the string, and then link to the angular scope
					var newFormSelectOption = angular.element("<option ng-repeat='" + $scope.createDiv + "'>{{subFormType}}</option>")
					var compiledNewFormSelectOption = $compile(newFormSelectOption);
					var newFormSelectOptionContent = compiledNewFormSelectOption($scope);

					// Append html together, and append to main div on the screen
					newFormSelectContent.append(newFormSelectOptionContent);
					newFormLabel.append(newFormSelectContent);
					newFormDiv.append(newFormLabel);
					// Check if resume button has been created(which means user data is stored), if so delete the previous one and add another one as the page continues
					if($scope.resume){
						var resumeButton = angular.element('<button id="resume" type="button" class="btn btn-primary" ng-click="resumeForm()">Resume</button>');
						var compiledResumeButton = $compile(resumeButton);
						var newResumeButton = compiledResumeButton($scope);
						newFormDiv.append(newResumeButton);
						document.getElementById('resume').remove();
					}
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

	// Function to set aside session storage for the user information, and to redirect to the next page
	$scope.resumeForm = function(){
		sessionStorage.setItem('userResume', JSON.stringify($scope.user));
		console.log($scope.user);
		$window.location.href = 'http://127.0.0.1:3000/fillOutForm.html';
	}
}]);
