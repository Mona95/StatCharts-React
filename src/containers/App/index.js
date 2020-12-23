import React, { Component } from "react";
import "./App.css";
import Charts from "../Charts";

//Material-UI Components
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

//Axios
import axios from "axios";

//Defining the list of countries
const countries = [
  "belarus",
  "brazil",
  "canada",
  "european-union",
  "eurozone",
  "france",
  "germany",
  "greece",
  "india",
  "japan",
  "kazakhstan",
  "mexico",
  "russia",
  "spain",
  "turkey",
  "ukraine",
  "united-kingdom",
  "united-states",
];

class App extends Component {
  state = {
    statData: [], //Array of objects
    countryFilter: [],
  };

  isEmptyArray(array) {
    return !(array.length > 0 && array[0] !== "");
  }

  //Retrieve the data from "StatBureau" according to filters
  componentDidMount() {
    //after mounting the component for the first time, request should
    //get called without any filter and atleast once
    this.callStatRequest();
  }

  //Generate the "StatBureau" urls, according to the selected country
  generateUrls() {
    let baseUrl = "https://www.statbureau.org/get-data-json",
      { countryFilter } = this.state,
      requestedCountryUrls = [];

    debugger;
    //checking the validitiy of countryFilter list
    if (!this.isEmptyArray(countryFilter)) {
      countryFilter.forEach((countryFilter) => {
        //create url for each selected country
        requestedCountryUrls = [
          ...requestedCountryUrls,
          axios.get(`${baseUrl}?country=${countryFilter}`).then((res) => {
            return {
              [countryFilter]: res,
            };
          }),
        ];
      });
      return requestedCountryUrls;
    } else {
      return [axios.get(baseUrl)];
    }
  }

  //To call the "StatBureau" request
  //method needs to be reusable
  callStatRequest = () => {
    let reqPromises = this.generateUrls(),
      { countryFilter } = this.state;

    Promise.all(reqPromises).then((response) => {
      //Having two scenario in order to update the statData state
      // 1 - without any filter, the statData will be a simple array of objects
      // 2 - with filter, we need to create a nested structure for the state object(for each selected country)
      if (this.isEmptyArray(countryFilter)) {
        this.setState({ statData: response[0].data });
      } else {
      }
    });
  };

  //update state.countryFilter based on user's selection
  handleCountryFilterChange = (e, eOpts) => {
    let selectedCountry = eOpts.props.value;

    this.setState((prevState) => {
      return {
        ...prevState,
        countryFilter: [...prevState.countryFilter, selectedCountry],
      };
    });
    debugger;
    setTimeout(() => {
      this.callStatRequest();
    }, 2000);
  };

  render() {
    const { countryFilter } = this.state;
    return (
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper>
              <FormControl>
                <InputLabel>Country</InputLabel>
                <Select
                  labelId="demo-mutiple-checkbox-label"
                  id="demo-mutiple-checkbox"
                  multiple
                  value={countryFilter}
                  onChange={this.handleCountryFilterChange}
                  input={<Input />}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {countries.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper>
              <Charts chartsData={this.state.statData} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default App;
