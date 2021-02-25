import React, { Component } from "react";
import axios from "axios";
import { Redirect, Link, withRouter } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

class Album extends Component {
  state= {

    albumName: this.props.match.params.albumName,
    artistName: this.props.match.params.artistName,
    relateDate: "",
    tracks: [],
    tags: [],
    imgURL: ""
  }
  async componentDidMount(){

      const API_KEY=process.env.REACT_APP_API_KEY
      let albumUrl=` http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${this.state.artistName}&album=${this.state.albumName}&format=json`
              let albummetadata=await axios
                  .get(albumUrl)
                  .then(result => result.data)
                  .catch(error => {
                    console.log(error);
                  });
                  console.log(albummetadata)

        this.setState({ 
          tags: albummetadata.album.tags.tag,
          tracks: albummetadata.album.tracks.track,
          imgURL: albummetadata.album.image[2]["#text"],
            // relateDate: albummetadata.album.wiki.published
                  }, ()=>{console.log(this.state.relateDate)})
        // if(res.data){
            //     console.log(res.data)
            //     let albuminfo = await res.data.topalbums.album.map(async albums =>{
            //         

            //         })
       
    
    }



    render(){
    
      let associatedTags= this.state.tags.map(tagsName => {
        return(
        <li key={tagsName.name}>
            {tagsName.name}
          </li> 
        )
      })

      let associatedTrakcs= this.state.tracks.map(tracks => {
        return(
        <li key={tracks.name}>
            {tracks.name}
          </li> 
        )
      })
        return (
            <div>  
               <h1>HI</h1>
               <p>{this.state.albumName}</p>
               <p>{this.state.artistName}</p>
               <img src={this.state.imgURL}></img>
               <p>{this.state.relateDate}</p>
               <ul>{associatedTags}</ul>
               <ul>{associatedTrakcs}</ul>
            </div>

        );
    }
}

export default Album;
