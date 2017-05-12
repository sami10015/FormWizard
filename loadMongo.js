// Invoke 'strict' JavaScript mode
'use strict';

var bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose');

var fs = require('fs');

module.exports = require('./public/javascripts/models/Category.js');
module.exports = require('./public/javascripts/models/Form.js');
module.exports = require('./public/javascripts/models/Page.js');
module.exports = require('./public/javascripts/models/Section.js');
module.exports = require('./public/javascripts/models/Group.js');
module.exports = require('./public/javascripts/models/Field.js');
module.exports = require('./public/javascripts/models/Fence.js');

var db = mongoose.connect('mongodb://10.10.7.65/krypton');
var Form = mongoose.model('Form');
var Category = mongoose.model('Category');

// Arrays that store the different objects
var pages = []; // Array used for DUMMY pages
var artifacts = []; // Array used for page 1 for DUMMY data
var artifacts2 = []; // Array used for page 2 for DUMMY data

var realPages = []; // Array used for REAL pages
var realArtifacts = []; // Array used for page 1 for REAL data
var realGroups = []; // Array used for REAL groups data

// Both used for REAL and DUMMY data
var categories = [];
var forms = [];

// Fences that will be later used for PDF Rendering
var fence1 = {
    startX: 145,
    startY: 67,
    endX: 145+7,
    endY: 67+6
};

var fence2 = {
    startX: 225,
    startY: 67,
    endX: 225+7,
    endY: 67+6
};

var fence3 = {
    startX: 322,
    startY: 67,
    endX: 322+7,
    endY: 67+6
};

var fence4 = {
    startX: 403,
    startY: 66,
    endX: 403+7,
    endY: 66+6
};

var fence5 = {
    startX: 143,
    startY: 76,
    endX: 143+7,
    endY: 76+6
};

var fence6 = {
    startX: 199,
    startY: 76,
    endX: 199+7,
    endY: 76+6
};

var fence7 = {
    startX: 238,
    startY: 75,
    endX: 238+7,
    endY: 75+6
};

var fence8 = {
    startX: 276,
    startY: 75,
    endX: 276+7,
    endY: 75+6
};

var fence9 = {
    startX: 349,
    startY: 75,
    endX: 349+7,
    endY: 75+6
};

var fence10 = {
    startX: 405,
    startY: 76,
    endX: 405+7,
    endY: 76+6
};

var fence11 = {
    startX: 101,
    startY: 126,
    endX: 101+198,
    endY: 126+19
};

var fence12 = {
    startX: 388,
    startY: 126,
    endX: 388+163,
    endY: 126+18
};

var fence13 = {
    startX: 49,
    startY: 214,
    endX: 49+115,
    endY: 214+13
};

var fence14 = {
    startX: 180,
    startY: 214,
    endX: 180+24,
    endY: 214+12
};

var fence15 = {
    startX: 211,
    startY: 219,
    endX: 211+6,
    endY: 219+5
};

var fence16 = {
    startX: 233,
    startY: 218,
    endX: 233+6,
    endY: 218+6
};

var fence17 = {
    startX: 254,
    startY: 214,
    endX: 254+45,
    endY: 214+11
};

var fence18 = {
    startX: 309,
    startY: 214,
    endX: 309+45,
    endY: 214+11
};

var fence19 = {
    startX: 367,
    startY: 214,
    endX: 376+131,
    endY: 214+12
};

var fence20 = {
    startX: 517,
    startY: 216,
    endX: 517+48,
    endY: 214+11
};

var fence21 = {
    startX: 49,
    startY: 292,
    endX: 49+115,
    endY: 292+13
};

var fence22 = {
    startX: 178,
    startY: 292,
    endX: 179+26,
    endY: 292+13
};

var fence23 = {
    startX: 210,
    startY: 295,
    endX: 210+7,
    endY: 295+7
};

var fence24 = {
    startX: 232,
    startY: 295,
    endX: 232+7,
    endY: 295+7
};

var fence25 = {
    startX: 254,
    startY: 291,
    endX: 254+43,
    endY: 291+13
};

var fence26 = {
    startX: 309,
    startY: 291,
    endX: 309+43,
    endY: 291+13
};

var fence27 = {
    startX: 365,
    startY: 291,
    endX: 365+136,
    endY: 291+13
};

var fence28 = {
    startX: 515,
    startY: 294,
    endX: 515+49,
    endY: 294+13
};
// REAL FORM Page 1 fields, sections, and artifacts

// Section 1 - Insurance Company Name
var realSection1 = {
    title: "Please Check Insurance Company's Name",
    secNumber: 1,
    type: "Informational",
    prompt: "Fill out your Contract Information",
};

var realArtifactSection1 = {
    field : null,
    section : realSection1
};
realArtifacts.push(realArtifactSection1);

var realGroup1 = {
    name: "Insurance Company Name",
    radio: true
}
realGroups.push(realGroup1);

var realField1 = {
    fence: fence1,
    name: "Central United Life",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Company Name",
    whatsThis: "This is a check box",
    tip: "Please Check.",
    default: "",
    validation: "",
    groupName: "Insurance Company Name",
    optional: false
};

var realArtifactField1 = {
    field : realField1,
    section: null
}
realArtifacts.push(realArtifactField1);

var realField2 = {
    fence: fence2,
    name: "Investors Consolidated",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Company Name",
    whatsThis: "This is a check box",
    tip: "Please Check.",
    default: "",
    validation: "",
    groupName: "Insurance Company Name",
    optional: false
}

var realArtifactField2 = {
    field : realField2,
    section: null
}
realArtifacts.push(realArtifactField2);

var realField3 = {
    fence: fence3,
    name: "American General",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Company Name",
    whatsThis: "This is a check box",
    tip: "Please Check.",
    default: "",
    validation: "",
    groupName: "Insurance Company Name",
    optional: false
}

var realArtifactField3 = {
    field : realField3,
    section: null
}
realArtifacts.push(realArtifactField3);

var realField4 = {
    fence: fence4,
    name: "Loyal American",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Company Name",
    whatsThis: "This is a check box",
    tip: "Please Check.",
    default: "",
    validation: "",
    groupName: "Insurance Company Name",
    optional: false
}

var realArtifactField4 = {
    field : realField4,
    section: null
}
realArtifacts.push(realArtifactField4);

var realField5 = {
    fence: fence5,
    name: "Gold Cross",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Company Name",
    whatsThis: "This is a check box",
    tip: "Please Check.",
    default: "",
    validation: "",
    groupName: "Insurance Company Name",
    optional: false
}

var realArtifactField5 = {
    field : realField5,
    section: null
}
realArtifacts.push(realArtifactField5);

var realField6 = {
    fence: fence6,
    name: "UniLife",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Company Name",
    whatsThis: "This is a check box",
    tip: "Please Check.",
    default: "",
    validation: "",
    groupName: "Insurance Company Name",
    optional: false
}

var realArtifactField6 = {
    field : realField6,
    section: null
}
realArtifacts.push(realArtifactField6);

var realField7 = {
    fence: fence7,
    name: "Unum",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Company Name",
    whatsThis: "This is a check box",
    tip: "Please Check.",
    default: "",
    validation: "",
    groupName: "Insurance Company Name",
    optional: false
}

var realArtifactField7 = {
    field : realField7,
    section: null
}
realArtifacts.push(realArtifactField7);

var realField8 = {
    fence: fence8,
    name: "American States",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Company Name",
    whatsThis: "This is a check box",
    tip: "Please Check.",
    default: "",
    validation: "",
    groupName: "Insurance Company Name",
    optional: false
}

var realArtifactField8 = {
    field : realField8,
    section: null
}
realArtifacts.push(realArtifactField8);

var realField9 = {
    fence: fence9,
    name: "Family Life",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Company Name",
    whatsThis: "This is a check box",
    tip: "Please Check.",
    default: "",
    validation: "",
    groupName: "Insurance Company Name",
    optional: false
}

var realArtifactField9 = {
    field : realField9,
    section: null
}
realArtifacts.push(realArtifactField9);

var realField10 = {
    fence: fence10,
    name: "Manhattan Life",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Company Name",
    whatsThis: "This is a check box",
    tip: "Please Check.",
    default: "",
    validation: "",
    groupName: "Insurance Company Name",
    optional: false
}
var realArtifactField10 = {
    field : realField10,
    section: null
}
realArtifacts.push(realArtifactField10);

// Section 2

var realSection2 = {
    title: "Please Fill Out",
    secNumber: 1,
    type: "Informational",
    prompt: "Fill Out Information",
}

var realArtifactSection2 = {
    section: realSection2,
    field: null
}
realArtifacts.push(realArtifactSection2);


var realField11 = {
    fence: fence11,
    name: "Policy Number",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "Policy Number",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField11 = {
    field : realField11,
    section: null
}
realArtifacts.push(realArtifactField11);

var realField12 = {
    fence: fence12,
    name: "Insuring the Life of:",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Insuring life of:",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}
var realArtifactField12 = {
    field : realField12,
    section: null
}
realArtifacts.push(realArtifactField12);

// Section 3 - Principal Beneficiary

var realSection3 = {
    title: "Principal Beneficiary",
    secNumber: 1,
    type: "Informational",
    prompt: "Fill Out Information",
}

var realArtifactSection3 = {
    section: realSection3,
    field: null
}
realArtifacts.push(realArtifactSection3);

var realField13 = {
    fence: fence13,
    name: "Name (first, middle initial, last)",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Name",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField13 = {
    field : realField13,
    section: null
}
realArtifacts.push(realArtifactField13);

var realField14 = {
    fence: fence14,
    name: "Percent",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "Percentage",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField14 = {
    field : realField14,
    section: null
}
realArtifacts.push(realArtifactField14);

var realGroup2 = {
    name: "Irrevocable",
    radio: true
}
realGroups.push(realGroup2);

var realField15 = {
    fence: fence15,
    name: "Irrevocable - Yes",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Name",
    whatsThis: "This is a check box",
    tip: "Please Check",
    default: "",
    validation: "",
    groupName: "Irrevocable",
    optional: false
}

var realArtifactField15 = {
    field : realField15,
    section: null
}
realArtifacts.push(realArtifactField15);

var realField16 = {
    fence: fence16,
    name: "Irrevocable - No",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Name",
    whatsThis: "This is a check box",
    tip: "Please Check",
    default: "",
    validation: "",
    groupName: "Irrevocable",
    optional: false
}

var realArtifactField16 = {
    field : realField16,
    section: null
}
realArtifacts.push(realArtifactField16);

var realField17 = {
    fence: fence17,
    name: "Date of Birth",
    type: "Date",
    combo: "",
    radio: false,
    prompt: "Date of birth",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField17 = {
    field : realField17,
    section: null
}
realArtifacts.push(realArtifactField17);

var realField18 = {
    fence: fence18,
    name: "Relationship to Insured",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Relationship Insured",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField18 = {
    field : realField18,
    section: null
}
realArtifacts.push(realArtifactField18);

var realField19 = {
    fence: fence19,
    name: "Present Address",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Address",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField19 = {
    field : realField19,
    section: null
}
realArtifacts.push(realArtifactField19);

var realField20 = {
    fence: fence20,
    name: "Social Security Number",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "SSD",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField20 = {
    field : realField20,
    section: null
}
realArtifacts.push(realArtifactField20);

// Section 4 - Contingent Beneficiary

var realSection4 = {
    title: "Contingent Beneficiary",
    secNumber: 1,
    type: "Informational",
    prompt: "Fill Out Information",
}

var realArtifactSection4 = {
    section: realSection4,
    field: null
}
realArtifacts.push(realArtifactSection4);

var realField21 = {
    fence: fence21,
    name: "Name (first, middle initial, last)",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Name",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField21 = {
    field : realField21,
    section: null
}
realArtifacts.push(realArtifactField21);

var realField22 = {
    fence: fence22,
    name: "Percent",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "Percentage",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField22 = {
    field : realField22,
    section: null
}
realArtifacts.push(realArtifactField22);

var realGroup3 = {
    name: "Irrevocable2",
    radio: true
}
realGroups.push(realGroup3);

var realField23 = {
    fence: fence23,
    name: "Irrevocable - Yes",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Name",
    whatsThis: "This is a check box",
    tip: "Please Check",
    default: "",
    validation: "",
    groupName: "Irrevocable2",
    optional: false
}

var realArtifactField23 = {
    field : realField23,
    section: null
}
realArtifacts.push(realArtifactField23);

var realField24 = {
    fence: fence24,
    name: "Irrevocable - No",
    type: "Check box",
    combo: "",
    radio: true,
    prompt: "Name",
    whatsThis: "This is a check box",
    tip: "Please Check",
    default: "",
    validation: "",
    groupName: "Irrevocable2",
    optional: false
}

var realArtifactField24 = {
    field : realField24,
    section: null
}
realArtifacts.push(realArtifactField24);

var realField25 = {
    fence: fence25,
    name: "Date of Birth",
    type: "Date",
    combo: "",
    radio: false,
    prompt: "Date of birth",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField25 = {
    field : realField25,
    section: null
}
realArtifacts.push(realArtifactField25);

var realField26 = {
    fence: fence26,
    name: "Relationship to Insured",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Relationship Insured",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField26 = {
    field : realField26,
    section: null
}
realArtifacts.push(realArtifactField26);

var realField27 = {
    fence: fence27,
    name: "Present Address",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Address",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField27 = {
    field : realField27,
    section: null
}
realArtifacts.push(realArtifactField27);

var realField28 = {
    fence: fence28,
    name: "Social Security Number",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "SSD",
    whatsThis: "This is a text box",
    tip: "Please Fill Out",
    default: "",
    validation: "",
    optional: false
}

var realArtifactField28 = {
    field : realField28,
    section: null
}
realArtifacts.push(realArtifactField28);

// Img path to our default png file
var imgPath = './public/forms/Central United Life beneficiary change-1.png';

// Page(s) for the Form Object
var realPage = {
    artifacts: realArtifacts,
    template: "Page 1",
    pageNumber: 1,
    image: {data: fs.readFileSync(imgPath), contentType: 'image/png'}
};
realPages.push(realPage);

// REAL Form object that is connected to Category object
var realFormData = {
    category: "change of beneficiary",
    pages: realPages,
    name: "Central United Life Beneficiary Change",
    company: "Central United",
    suffix: 'png'
};

var realForm = new Form(realFormData);

realForm.save(function (err) {
    if (err) {
        console.log("Save form failed");
        return next(err);
    } else {
        console.log("Save form successful");
    }
});

// Overall Category object
var realCategoryData = {
    name: "insurance/change_of_beneficiary/central_united",
    form: realForm._id
};

var realCategory = new Category(realCategoryData);

realCategory.save(function (err) {
    if (err) {
        console.log("Save category failed");
        return next(err);
    } else {
        console.log("Save category successful");
    }
});




// DUMMY FORM Page 1 fields, sections, and artifacts

// Creating section before I start creating fields
var section1 = {
    title: "Contract Information",
    secNumber: 1,
    type: "Informational",
    prompt: "Fill out your Contract Information",
};

var artifactSection1 = {
    field : null,
    section : section1
};
artifacts.push(artifactSection1);

// Creating fields and then storing them in artifact, which then gets pushed into a list
var field1 = {
    fence: fence2,
    name: "Contract Number",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Contract Number",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
};

var artifactField1 = {
    field : field1,
    section : null
};
artifacts.push(artifactField1);

var field2 = {
    fence: fence2,
    name: "Contract Owner's Name",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Contract Owner's Name",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField2 = {
    field : field2,
    section : null
};
artifacts.push(artifactField2);

var field3 = {
    fence: fence2,
    name: "Social Security Number(Last Four Digits)",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "Social Security Number",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField3 = {
    field : field3,
    section : null
};
artifacts.push(artifactField3);

var field4 = {
    fence: fence2,
    name: "Date of Birth",
    type: "Date",
    combo: "",
    radio: false,
    prompt: "Date of Birth",
    whatsThis: "This is a date box.",
    tip: "Please enter date.",
    default: "",
    validation: "",
    optional: false
}

var artifactField4 = {
    field : field4,
    section : null
};
artifacts.push(artifactField4);

var field5 = {
    fence: fence2,
    name: "Telephone Daytime",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "Telephone Daytime",
    whatsThis: "This is a text box.",
    tip: "Please enter telephone number.",
    default: "",
    validation: "",
    optional: false
}

var artifactField5 = {
    field : field5,
    section : null
};
artifacts.push(artifactField5);

var field6 = {
    fence: fence2,
    name: "Telephone Evening",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "Telephone Evening",
    whatsThis: "This is a text box.",
    tip: "Please enter telephone number.",
    default: "",
    validation: "",
    optional: false
}

var artifactField6 = {
    field : field6,
    section : null
};
artifacts.push(artifactField6);

// Page(s) for the Form Object
var page1 = {
    artifacts: artifacts,
    template: "Page 1",
    pageNumber: 1
};

pages.push(page1);

// DUMMY FORM Page 2 fields, sections, and artifacts
var section2 = {
    title: "Beneficiary Designation",
    secNumber: 1,
    type: "Informational",
    prompt: "Fill out your beneficiary Information",
}

var artifactSection2 = {
    field : null,
    section : section2
};
artifacts2.push(artifactSection2);

// Creating fields and then storing them in artifact, which then gets pushed into a list
var field7 = {
    fence: fence2,
    name: "Name",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Beneficiary Name",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
};

var artifactField7 = {
    field : field7,
    section : null
};
artifacts2.push(artifactField7);

var field8 = {
    fence: fence2,
    name: "Relationship",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Beneficiary Relationship",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField8 = {
    field : field8,
    section : null
};
artifacts2.push(artifactField8);

var field9 = {
    fence: fence2,
    name: "Percentage",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "Beneficiary Percentage",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField9 = {
    field : field9,
    section : null
};
artifacts2.push(artifactField9);

var field10 = {
    fence: fence2,
    name: "Social Security/Tax ID",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "Beneficiary SSD/Tax ID",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField10 = {
    field : field10,
    section : null
};
artifacts2.push(artifactField10);

var field11 = {
    fence: fence2,
    name: "Address",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Beneficiary Address",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField11 = {
    field : field11,
    section : null
};
artifacts2.push(artifactField11);

var field12 = {
    fence: fence2,
    name: "City",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Beneficiary City",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField12 = {
    field : field12,
    section : null
};
artifacts2.push(artifactField12);

var field13 = {
    fence: fence2,
    name: "State",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Beneficiary State",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField13 = {
    field : field13,
    section : null
};
artifacts2.push(artifactField13);

var field14 = {
    fence: fence2,
    name: "Zip Code",
    type: "Number",
    combo: "",
    radio: false,
    prompt: "Beneficiary Zip Code",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField14 = {
    field : field14,
    section : null
};
artifacts2.push(artifactField14);

var field15 = {
    fence: fence2,
    name: "Email Address",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Beneficiary Email",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField15 = {
    field : field15,
    section : null
};
artifacts2.push(artifactField15);

var field16 = {
    fence: fence2,
    name: "Telephone Daytime",
    type: "Text",
    combo: "",
    radio: false,
    prompt: "Beneficiary Telephone",
    whatsThis: "This is a text box",
    tip: "Please fill out.",
    default: "",
    validation: "",
    optional: false
}

var artifactField16 = {
    field : field16,
    section : null
};
artifacts2.push(artifactField16);

// Page(s) for the Form Object
var page2 = {
    artifacts: artifacts2,
    template: "Page 2",
    pageNumber: 2
};

pages.push(page2);

// Img path to our default png file
var imgPath = './public/forms/Central United Life beneficiary change-1.png';

// DUMMY Form object that is connected to Category object
var form1 = {
    category: "change of beneficiary",
    pages: pages,
    name: "Lincoln Change of Beneficiary",
    company: "Lincoln",
    suffix: 'png',
    image: {data: fs.readFileSync(imgPath), contentType: 'image/png'}
};
forms.push(form1);

var form = new Form(form1);

form.save(function (err) {
    if (err) {
        console.log("Save form failed");
        return next(err);
    } else {
        console.log("Save form successful");
    }
});

// Overall Category object
var category1 = {
    name: "insurance/change_of_beneficiary/lincoln",
    form: form._id
};
categories.push(category1);

var category = new Category(category1);

category.save(function (err) {
    if (err) {
        console.log("Save category failed");
        return next(err);
    } else {
        console.log("Save category successful");
    }
});
