import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import dbConnect from "./dbConnect.js";
import fs from "fs";
import CVE from "./Models/cves.js";

dotenv.config();
dbConnect();
const app = express();
const port = 8080;
const baseURL = "https://services.nvd.nist.gov/rest/json/cves/2.0";

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// To Change the timestamp to date format
function formatDate(timestamp){
    var date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    return formattedDate;
}

// Import CVE's to MongoDB
const importData = async() => {
    try{
        const cveData = JSON.parse(fs.readFileSync("cves.json", "utf8"));
        if(Array.isArray(cveData)){
            await CVE.insertMany(cveData);
            console.log("Data Inserted Successfully into MongoDB!");
        }
        else{
            console.log("Data is not in the correct format");
        }
    }
    catch(err){
        console.log(err);
    }
}


// Retrieve the data from the API with/without Results Per Page and Page parameters (Default: Results per page (10), Page (1))
app.get("/cves/list/:pageSize?/:page?", async (req, res) => {
    const pageSize = req.params.pageSize || 10;
    const page = req.params.page || 1;
    try{
        const response = await axios.get(baseURL + `?resultsPerPage=${pageSize}&startIndex=${(page - 1) * pageSize}`);
        const data = response.data;
        data.vulnerabilities.forEach(x => {
            x.cve.published = formatDate(x.cve.published);
            x.cve.lastModified = formatDate(x.cve.lastModified);
        })
        const jsonData = JSON.stringify(data.vulnerabilities, null, 2);
        fs.writeFile('cves.json', jsonData, (err) => {
            if (err) {
                console.error(err);
            }
            else{
                console.log('The file has been saved!');
                importData();
            }
        })
        res.render("cvesList", {data: data.vulnerabilities, totalResults: data.totalResults, pageSize: pageSize, page: page});
    }
    catch(err){
        console.log("Failed to retrieve data: " + err);
    }
});

// Retrieve CVE information given the CVE ID
app.get("/cve", async (req, res) => {
    const cveID = req.query.id;
    try{
        const response = await axios.get(baseURL + `?cveId=${cveID}`);
        const data = response.data.vulnerabilities[0].cve;
        data.published = formatDate(data.published);
        data.lastModified = formatDate(data.lastModified);
        res.render("cvePage", {data: data});
    }
    catch(err){
        console.log(`Failed to retrieve data with ID ${cveID}: ` + err);
    }
})

app.listen(port, ()=> {
    console.log(`Server running on port: ${port}`);
})