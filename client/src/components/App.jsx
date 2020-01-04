import React from 'react';
import axios from 'axios';
import NavBar from './NavBar.jsx';
import Posts from './Views/Posts.jsx';
import UserPosts from './Views/UserPosts.jsx';
import Neighborhoods from './Views/Neighborhoods.jsx';
import Post from './Views/Post.jsx';
import Typography from '@material-ui/core/Typography';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'posts',
      neighborhood: '',
      posts: [],
      currentPost: {},
      username: '',
      loggedIn: false,
      weather: {},
    };

    this.changeView = this.changeView.bind(this);
    this.updateLogin = this.updateLogin.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.userLogin = this.userLogin.bind(this);
    this.userSignUp = this.userSignUp.bind(this);
    this.createPost = this.createPost.bind(this);
  }

  componentDidMount() {
    // get local weather
    this.getWeather()
      .then(weather => {
        this.setState({
          weather: weather.data.currently,
        });
      })
      .catch(error => {
        console.error('Failed to get weather', error);
      });
    // get all posts from db
    // this.getPosts()
    //   .then(posts => {
    //     console.log(posts);
    //   })
    //   .catch(error => {
    //     console.error('Failed to get posts', error);
    //   });
  }


  // function to get the loacl weather on app startup
  getWeather() {
    return axios.get('/weather')
      .then(response => response.data)
      .catch(error => console.log(error))
  }

  // function to get all posts from db
  getPosts() {
    return axios.get('/posts')
      .then(response => response)
      .catch(error => console.log(error))
  }

  // function to load username from the db and set username state
  userLogin(username) {
    this.setState({
      username: username,
    })
    return axios.get(`users:/${username}`)
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }

  // function to save username to db and set username state
  userSignUp(username) {
    this.setState({
      username: username,
    })
    return axios.post('/signup', {
      'username': `${username}`,
    })
      .then(response => response)
      .catch(error => console.log(error))
  }

  // function to create a new post and save to the db
  createPost(title, body, neighborhood, type) {
    console.log(title, body, neighborhood, type);
    return axios.post('/posts', {
      'title': `${title}`,
      'hoodName': `${neighborhood}`,
      'postType': `${type}`,
      'postBody': `${body}`
    })
      .then(response => response)
      .catch(error => console.log(error))
  }

  // function to pass down to change views
  changeView(option) {
    this.setState({
      view: option,
    });
  }
  
  // function to change loggedIn state to show user posts and sign out button
  updateLogin() {
    this.setState({
      loggedIn: !this.state.loggedIn,
    });
  }
  
  render() {

    const { view } = this.state;
    const { loggedIn } = this.state;
    return (
      <div>
        <NavBar 
          changeView={this.changeView} 
          loggedIn={this.loggedIn} 
          updateLogin={this.updateLogin} 
          loggedIn={this.state.loggedIn}
          weatherIcon={this.state.weather.icon}
          weatherInfo={this.state.weather}
          userLogin={this.userLogin}
          userSignUp={this.userSignUp}
        />
        <br />
        {(() => {
          switch (view) {
            case 'posts':
              return <Posts 
                changeView={this.changeView} 
                neighborhood={this.state.neighborhood} 
                loggedIn={this.state.loggedIn} 
                createPost={this.createPost}
                />;
            case 'userPosts':
              return loggedIn ? <UserPosts changeView={this.changeView} /> 
              : <Typography variant="h4" style={{ fontWeight: "bolder", textAlign: "center", color: "white" }}>
                  Please Login to see your posts!
                </Typography>
            case 'neighborhoods':
              return <Neighborhoods changeView={this.changeView} />;
            case 'post':
              return <Post changeView={this.changeView} />;
            default:
              return <Posts changeView={this.changeView} />;
          }
        })()}
      </div>
    )
  }
}

export default App;