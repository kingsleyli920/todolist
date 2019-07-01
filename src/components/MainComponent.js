import React, { Component } from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Contact from './ContactusComponent';
import About from './AboutusComponent';
import MyPage from './MyPageComponent';
import MyItemPage from './MyItemPage';
import { Switch, Redirect, withRouter, Route } from 'react-router-dom'

class Main extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <Header />
                <div>
                    <Switch>
                        <Route path='/home' component={() => <Home />} />
                        <Route exact path='/aboutus' component={() => <About />} />
                        <Route exact path='/contactus' component={() => <Contact />} />
                        <Route exact path='/mypage' component={() => <MyPage />} />
                        <Route exact path='/item/:id'  component={() => <MyItemPage />} />
                        <Redirect to="/home" />
                    </Switch>
                </div>
                <Footer />
            </div>
        );
    }

}

export default withRouter(Main);