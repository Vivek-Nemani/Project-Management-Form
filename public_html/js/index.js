/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var proDBName = "PROJECT-TABLE";
var proRelationName = "COLLEGE-DB";
var connToken = "";

$("#proID").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno",lvData.rec_no);
}
function getProIdAsJsonObj(){
    var proID = $("#proID").val();
    var jsonStr = {
        id: proID
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#proName").val(record.proname);
    $("#proemp").val(record.empname);
    $("#prodate").val(record.date);
    $("#deadline").val(record.deadline);
    
}

function resetForm(){
    $("#proID").val("");
    $("#proname").val("");
    $("#proemp").val("");
    $("#prodate").val("");
    $("#deadline").val("");
    $("#proID").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#proID").focus();
}

function validateData(){
    var proID, proname, proemp, prodate, deadline;
    proID = $("#proID").val();
    proname = $("#proname").val();
    proemp = $("#proemp").val();
    prodate = $("#prodate").val();
    deadline = $("#deadline").val();
    
    if(proID === ""){
        alert("Project ID missing");
        $("#proID").focus();
        return"";
    }
    if(proname === ""){
        alert("Project name missing");
        $("#proname").focus();
        return"";
    }
    if(proemp === ""){
        alert("Project employee missing");
        $("#proemp").focus();
        return"";
    }
    if(prodate === ""){
        alert("Project assigned date missing");
        $("#prodate").focus();
        return"";
    }
    if(deadline === ""){
        alert("Project deadline missing");
        $("#deadline").focus();
        return"";
    }
    
    var jsonStrObj = {
        id: proID,
        name: proname,
        proemp: proemp,
        prodate: prodate,
        deadline: deadline
    };
    return JSON.stringify(jsonStrObj);
}
function getPro(){
    var proIDJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, proDBName, proRelationName, proIDJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#proname").focus();
    } else if (resJsonObj.status === 200){
        
        $("#proID").prop("disabled",true);
        fillData(resJsonObj);
        $("#change").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#proname").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, proDBName, proRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
}
function changeData() {
    $("#change").prop("disabled",true);
    jsonChg = validateData();
    var updateRequest = createUPDATETecordRequest(connToken, jsonChg, proDBName, proRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#proID").focus();
}

