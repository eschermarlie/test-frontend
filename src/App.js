import './App.css';
import React from 'react';
import axios from 'axios';
import ResponsiveAppBar from "./ResponsiveAppBar";
import PostingCard from "./PostingCard";
import {Grid, Button, InputBase, Paper} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            currentPage: 1,
            dataPerPage: 8,
            datas: [],
            errors: null,
            searchTags: ''
        };
        this.handleClickPage = this.handleClickPage.bind(this);
        this.handleSearchTagsChange = this.handleSearchTagsChange.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
    }

      getFeeds() {
          axios({
              method: 'post',
              url: 'https://escher.herokuapp.com/getFeedByTag',
              headers: {},
              data: {
                  tags: this.state.searchTags, // This is the body part
              }
          })
            .then(response => {
                console.log('response', response);

                this.setState(
                    {
                        datas: response.data,
                    },
                ).then(()=>{console.log(this.state.datas)});
                }
            )
            .catch(error => this.setState({ error }));
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
        console.log('searching for ', this.state.searchTags);
        this.setState({
            currentPage: 1
        });
        this.getFeeds();
    }

    handleSearchTagsChange(event) {
        this.setState({
           searchTags: event.target.value
        });
    }

  render() {
    const { datas } = this.state;
      const { currentPage, dataPerPage } = this.state;

      // Logic for displaying data
      const indextOfLastData = currentPage * dataPerPage;
      const indextOfFirstData = indextOfLastData - dataPerPage;
      const currentData = datas.slice(indextOfFirstData, indextOfLastData);

      const renderDatas = currentData.map((item, index) => {
          return (
                          <Grid item xs={2} sm={3} md={3} key={item.id} testid="content-shown">
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
                  onClick={this.handleClickPage} sx={{marginX:1}}>{number}</Button>
      );
      });

    return (
          <div>
              <ResponsiveAppBar/>
            <div className="container">
              <div className="col-md-12">
                <div className="alert alert-primary" role="alert">

                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                        <Grid item xs={12} sm={12} md={12} key={"searchBar"} sx={{flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent:'flex-end'}}>
                            <Paper
                                component="form"
                                sx={{ p: '2px 4px 2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search Image Tags"
                                    inputProps={{ 'aria-label': 'search image tags' }}
                                    onChange={this.handleSearchTagsChange}
                                    value={this.state.searchTags}
                                />
                                <IconButton onClick={this.submitSearch} sx={{ p: '10px' }} aria-label="search">
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
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