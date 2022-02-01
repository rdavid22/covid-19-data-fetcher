const getDataButton = document.querySelector(".getDataButton");
let chartContainer = document.querySelector("#plotly-container");
let alreadyGotData = false;

getDataButton.addEventListener("click", GetButtonClicked);

function GetButtonClicked(e) {
  e.preventDefault();
  if (alreadyGotData === false) {
    fetchData();
  } else {
    console.log("Already fetched...");
  }
}

function fetchData() {
  const url =
    "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases2_v1/FeatureServer/2/query?where=1%3D1&outFields=Country_Region,Confirmed&outSR=4326&f=json";

  fetch(url)
    .then((response) => {
      if (response.status !== 200) {
        fetchErrorHandler(response.status);
        return;
      }
      response.json().then((data) => {
        alreadyGotData = true;
        viewData(data);
      });
    })

    .catch((error) => {
      return fetchErrorHandler(error);
    });

  function fetchErrorHandler(error) {
    // case 1 : wrong status code -- 503 etc
    // case 2 : network error
    // case 3 : TODO
  }
}

function viewData(data) {

  const countryNames = data.features.map((country) => {
    return country.attributes.Country_Region;
  });

  const confirmedCases = data.features.map((cases) => {
    return cases.attributes.Confirmed;
  });

  let dataSegment = {
    type: "bar",
    x: countryNames,
    y: confirmedCases,
  };

  let chartData = [dataSegment];

  let chartLayout = {
    title: "Newest cases by country",
    showlegend: false,
  };

  var chartConfig = {
    // scrollZoom: true,
    responsive: true,
  };

  Plotly.newPlot(chartContainer, chartData, chartLayout, chartConfig);
}
