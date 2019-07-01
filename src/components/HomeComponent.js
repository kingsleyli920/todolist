import React, { Component } from 'react';
import {
    Link
} from 'react-router-dom';
import {
    Button, Jumbotron
} from 'reactstrap';
import cookie from '../shared/common';

class Home extends Component {
    constructor(props) {
        super(props);
        // this.checkAuth = this.checkAuth.bind(this);
        this.test = this.test.bind(this);
    }

    test = () => {
        var values = { test: 'test msg', id: '123aa' };
        // sessionStorage.setItem('userInfo', JSON.stringify(values));
        // console.log(sessionStorage.getItem('userInfo'));
        // sessionStorage.removeItem('userInfo');
        // console.log(sessionStorage.getItem('userInfo'));
        cookie.setCookie('userInfo', JSON.stringify(values));
        console.log(cookie.getCookie('userInfo'));
        cookie.removeCookie('userInfo');
    }
    render() {

        return (
            <div className="container mb-5">
                <div className="row align-items-start">
                    <Jumbotron className="w-100">
                        <div className="row row-header">
                            <div className="col-12 col-sm-6">
                                <h1>Todo List</h1>
                                <p>This is a todo list website, you can create your own schedules by using our website.</p>
                            </div>
                            <div className="col-12 col-sm-6">
                                <Button outline className="mt-5 mr-5 mb-5 w-50"
                                    color="primary" size="lg" onClick={this.test}>Try Cookie</Button>
                            </div>
                        </div>
                    </Jumbotron>
                </div>
                <div className="row align-items-start">
                    <div className="col-12 col-md m-1">

                    </div>
                </div>
            </div>
        );
    }

}

export default Home;