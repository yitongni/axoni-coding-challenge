import React, { Component , useState} from "react";
import axios from "axios";
import { Redirect, Link, withRouter } from "react-router-dom";
import ReadMoreReact from 'read-more-react';
import styles from "../styles/Artist.css";
import { Container, Button } from 'react-bootstrap'

class Artist extends Component {
  state= {
        artistName: this.props.match.params.artistName,
        artistBio:  "",
        imageURL:"",
        tags: [],
        similarArtist: [],
        albums: [],
        redirectToAlbum: false,
        redirectToArtist: false,
        expanded: false 
  }

  async componentDidMount(){
    const API_KEY=process.env.REACT_APP_API_KEY

    let url=`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${this.state.artistName}&api_key=${API_KEY}&format=json`
    let artistBio=await axios
      .get(url)
      .then(res => res.data)
      .catch(error => {
        console.log(error);
      });
      console.log(artistBio);

      let similar=artistBio.artist.similar.artist
      similar.length=3
      this.setState({ 
          artistBio: artistBio.artist.bio.content,
          imageURL: artistBio.artist.image[2]["#text"],
          tags: artistBio.artist.tags.tag,
          similarArtist: similar
        }, ()=>{console.log(this.state.imageURL)})
       
        let albumUrl=`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${this.state.artistName}&api_key=${API_KEY}&format=json`
        
        let artistAlbum=await axios
          .get(albumUrl)
          .then(res => res.data)
          .catch(error => {
            console.log(error);
          });
          this.setState({ albums: artistAlbum.topalbums.album}, ()=>{console.log(this.state.albums)})
    }

    getAlbumInfo(album){
        this.props.history.push(`/artist/${this.state.artistName}/${album}`);
        this.setState({redirectToAlbum: true})
    }

    getAnotherArtist(artistName){
      this.props.history.push(`/artist/${artistName}`);
      this.setState({redirectToArtist: true})
      window.location.reload();
    }


    showMore = () => { 
      this.setState({ expanded: !this.state.expanded })
    }

    render(){
        let associatedTags= this.state.tags.map(tagsName => {
            return(
            <li class="associatedTags"key={tagsName.name}>
                {tagsName.name}
              </li> 
            )
          })
        
          let similarArtist= this.state.similarArtist.map(artist => {
            return(
            <li key={artist.name} onClick={() => {this.getAnotherArtist(artist.name)}}>
                {artist.name}
            </li> 
            )
          })

          let artistAlbum= this.state.albums.map(album => {
            return(
            <li key={album.name} onClick={() => {this.getAlbumInfo(album.name)}}>
                {album.name}
              </li> 
            )
          })

         console.log(this.state.artistBio)
         const { expanded } = this.state
        return (
            <div>  
               <h1>{this.state.artistName}</h1>
               <ul class="associatedTags">{associatedTags}</ul>
               {/* <img src={this.state.imageURL}></img> */}
               <div>
                <Container>
                  <Button onClick={this.showMore}>Read Artist Bio</Button>
                    {expanded &&<div>{this.state.artistBio}</div>}
                </Container>
               </div>
               <ul>Similar Artist {similarArtist}</ul>
               <ul>Artist's Album {artistAlbum}</ul>
            </div>

        );
    }
}

export default Artist;
