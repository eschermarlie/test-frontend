import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';
import ResponsiveAppBar from "./ResponsiveAppBar";
import PostingCard from "./PostingCard";
import Box from "@mui/material/Box";
import {Divider, Grid, Stack,Button} from "@mui/material";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            todos: ['a','b','c','d','e','f','g','h','i','j','k'],
            currentPage: 1,
            dataPerPage: 8,
            datas: [],
            isLoading: true,
            errors: null
        };
        this.handleClickPage = this.handleClickPage.bind(this);
    }

  getFeeds(tags) {
    axios
        .post(
            'http://192.168.1.20:3001/getFeed'
        )
        .then(response => {
            console.log('response', response);

            this.setState(
                {
                    datas: response.data,
                    isLoading: false
                },
            ).then(()=>{console.log(this.state.datas)});
            }
        )
        .catch(error => this.setState({ error, isLoading: false }));
  }

  componentDidMount() {
    this.getFeeds();
  }

    handleClickPage(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    submitSearch(event){

    }

  render() {
    const { isLoading, datas } = this.state;
      const { currentPage, dataPerPage } = this.state;

      // Logic for displaying todos
      const indextOfLastData = currentPage * dataPerPage;
      const indextOfFirstData = indextOfLastData - dataPerPage;
      const currentData = datas.slice(indextOfFirstData, indextOfLastData);

      const renderDatas = currentData.map((item, index) => {
          return (
                          <Grid item xs={2} sm={3} md={3} key={item.id}>
                              <PostingCard key={item.id} data={item}/>
                          </Grid>
          )
      });

      // Logic for displaying page numbers
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(datas.length / dataPerPage); i++) {
          pageNumbers.push(i);
      }

      const renderPageNumbers = pageNumbers.map(number => {
          return (
          <Button variant="outlined" key={number}
                  id={number}
                  onClick={this.handleClickPage}>{number}</Button>
      );
      });

    return (
          <div>
              <ResponsiveAppBar/>
            <div className="container">
              <div className="col-md-12">
                <div className="alert alert-primary" role="alert">
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {renderDatas}
                    </Grid>

                    <div className="footer">
                        {renderPageNumbers}
                    </div>
                </div>
              </div>
            </div>
          </div>
    );
  }
}

export default App;