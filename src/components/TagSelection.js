import React, { Component } from "react";
import axios from "axios";
import { Dropdown } from "react-bootstrap";

class TagSelection extends Component {
    state= {
        tags: []
    };
    
    async getArtist(){

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

      // console.log(tags.toptags.tag)
     
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
        <li key={tagsName.tagName} onClick={() => {this.getArtist(tagsName.tagName)}}>
            {tagsName.tagName}
          </li> 
        )
      })
        return (
            <div>  
               <ul>{tagsSelection}</ul>
            </div>

        );
    }
}

export default TagSelection;
