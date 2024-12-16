import express from "express";
import bodyParser from "body-parser";
// To retrieve the data from the API
import axios from "axios";


const app = express();
const port = 8080;
const baseURL = "https://services.nvd.nist.gov/rest/json/cves/2.0";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({express: true}));
app.set('view engine', 'ejs');

// Retrieve the data from the API
app.get("/cves/list", async (req, res) => {
    try{
        const response = await axios.get(baseURL);
        const data = response.data;
        console.log(data);
        res.render("cvesList", {data: data.vulnerabilities, totalResults: data.totalResults});
    }
    catch(err){
        console.log("Failed to retrieve data: " + err);
    }
})

app.listen(port, ()=> {
    console.log(`Server running on port: ${port}`);
})