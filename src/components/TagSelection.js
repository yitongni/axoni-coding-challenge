import React, { Component } from "react";
import axios from "axios";
import { Redirect, Link, withRouter } from "react-router-dom";
import styles from "../styles/TagSelection.css";


class TagSelection extends Component {
  constructor() {
    super();
    this.state= {
        tags: [],
        artistTotalListener: [],
        redirect: false
    };
  }
    

  async getTopArtist(tagName){
      this.setState({ artistTotalListener: []}, ()=>{console.log(this.state.artistTotalListener)})
      const API_KEY=process.env.REACT_APP_API_KEY
      let url=`http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${tagName}&api_key=${API_KEY}&format=json`
        
      await axios
      .get(url)
      .then(async res => {
        if(res.data){
          console.log(res.data.topartists.artist)
          let artistAndTheirTotalListener = await res.data.topartists.artist.map(async artistName =>{
    
          const data={limit: 10}
          let url=`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artistName.name}&api_key=${API_KEY}&format=json`

          let artistTop10Tracks = await axios
          .get(url, {params: data})
          .then(res => res.data)
          .catch(error => {
            console.log(error);
          });
          let artistTotalListeners = artistTop10Tracks.toptracks.track.map(tracks => {return parseInt(tracks.listeners)})
          let totalListenersForTop10Tracks=artistTotalListeners.reduce(function (a, b) {return a + b;});
          console.log({name: artistName.name, totalListeners: totalListenersForTop10Tracks})
          let copyState = this.state.artistTotalListener.slice();
          copyState.push({name: artistName.name, totalListeners: totalListenersForTop10Tracks})
          copyState.sort(function(a, b){
            return b.totalListeners-a.totalListeners
          })
          this.setState({ artistTotalListener: copyState}, ()=>{console.log(this.state.artistTotalListener)})

        })
          
         
        }
      })
      .catch(error => {
        console.log(error);
      });
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

    getArtistInfo(artistName){
      this.props.history.push(`/artist/${artistName}`);
      this.setState({redirect: true})
    }

    render(){

      if (this.state.redirect) {
        return <Redirect to="/artist"/>;
      }

      let tagsSelection= this.state.tags.map(tagsName => {
        return(
        <li key={tagsName.tagName} onClick={() => {this.getTopArtist(tagsName.tagName)}}>
            {tagsName.tagName}
          </li> 
        )
      })

      let artist= this.state.artistTotalListener.map(artist=> {
        return(
          <tr key={artist.name} onClick={() => {this.getArtistInfo(artist.name)}}>
            <td>{artist.name}</td>
            <td>{artist.totalListeners}</td>
          </tr>
        )
      })

        return (
            <div style={{display: "flex"}}>
               <ul class="tagUL"><h>Tags/Genre</h>{tagsSelection}</ul>
                <table class="datatable">
                  <thead class="thead-light">
                    <tr>
                      <th>Artist Name</th>
                      <th>Popularity (Total listeners across their top 10 tracks)</th>
                    </tr>
                  </thead>
                  <tbody>{artist}</tbody>
                </table>   
            </div>

        );
    }
}

export default TagSelection;
