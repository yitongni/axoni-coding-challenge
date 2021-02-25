import React, { Component } from "react";
import axios from "axios";
import { Redirect, Link, withRouter } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

class TagSelection extends Component {
  constructor() {
    super();
    this.state= {
        tags: [],
        artists: []
    };
  }
    
    async getTopArtist(tagName){
      const API_KEY=process.env.REACT_APP_API_KEY
      let url=`http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${tagName}&api_key=${API_KEY}&format=json`
        
      let listofArtist = await axios
        .get(url)
        .then(res => res.data.topartists.artist)
        .catch(error => {
          console.log(error);
        });

        console.log(listofArtist)
     
      let artistList = listofArtist.map(artist => {
          return {artistsName: artist.name}
      })

      this.setState({ artists: artistList}, ()=>{
        console.log(this.state.artists)
      })
      
    }

    async getTags() { 
      const API_KEY=process.env.REACT_APP_API_KEY
      let url=`http://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key=${API_KEY}&format=json`
        
      let listoftags = await axios
        .get(url)
        .then(res => res.data.toptags.tag)
        .catch(error => {
          console.log(error);
        });
     
      let tagList = listoftags.map(tags => {
          return {tagName: tags.name}
      })
      this.setState({ tags: tagList}, ()=>{
        console.log(this.state.tags)
      })


    }


    
    componentDidMount() {
      this.getTags()
    }

    

    render(){
      
      let tagsSelection= this.state.tags.map(tagsName => {
        return(
        <li key={tagsName.tagName} onClick={() => {this.getTopArtist(tagsName.tagName)}}>
            {tagsName.tagName}
          </li> 
        )
      })

      let artist= this.state.artists.map(artistName => {
        return(
        <li key={artistName.artistsName}>
            {artistName.artistsName}
          </li> 
        )
      })
        return (
            <div>  
               <ul>{tagsSelection}</ul>
               <ul>{artist}</ul>
            </div>

        );
    }
}

export default TagSelection;
