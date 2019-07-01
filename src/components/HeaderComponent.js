import React, { Component } from 'react';
import {
    Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem,
    Button, Modal, ModalHeader, ModalBody, Form,
    FormGroup, Input, Label, Col, Row, ButtonDropdown,
    DropdownItem, DropdownToggle, DropdownMenu
} from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import axios from 'axios';
import { baseUrl } from '../shared/baseUrl';
import cookie from '../shared/common';


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
const isNumber = (val) => !isNaN(Number(val));
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

class Header extends Component {

    constructor(props) {
        super(props);
        console.log(`constructor`);
        const userInfo = sessionStorage.getItem('userInfo') || cookie.getCookie('userInfo');
        if (userInfo) {
            this.state = {
                isNavOpen: false,
                isModalSignupOpen: false,
                isModalLoginOpen: false,
                userInfo: JSON.parse(userInfo),
                loggedIn: true,
                isDropDownOpen: false
            };
        } else {
            this.state = {
                isNavOpen: false,
                isModalSignupOpen: false,
                isModalLoginOpen: false,
                userInfo: {},
                loggedIn: false,
                isDropDownOpen: false
            };
        }

        this.toggleSignupModal = this.toggleSignupModal.bind(this);
        this.toggleLoginModal = this.toggleLoginModal.bind(this);
        this.toggleNav = this.toggleNav.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }

    componentWillMount() {
        console.log(`componentWillMount`);

    }
    componentDidMount() {
        console.log(`componentDidMount`);
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleSignupModal() {
        this.setState({
            isModalSignupOpen: !this.state.isModalSignupOpen
        });
    }

    toggleLoginModal() {
        this.setState({
            isModalLoginOpen: !this.state.isModalLoginOpen
        });
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSignup(values) {
        this.toggleSignupModal();
        axios({
            method: 'post',
            url: `${baseUrl}users/signup/`,
            header: { 'Content-Type': 'application/json' },
            data: values
        }).then(response => {
            console.log(response);
        }).catch(err => {
            console.log(err);
        });
    }

    handleLogin(event) {
        this.toggleLoginModal();
        const values = {};
        values['username'] = this.username.value;
        values['password'] = this.password.value;

        axios({
            method: 'post',
            url: `${baseUrl}users/login/`,
            header: { 'Content-Type': 'application/json' },
            data: values
        }).then(response => {
            console.log(response.data.data[0]);
            var res = response.data.data;
            console.log(res.length);
            if (res.length > 0) {
                this.setState({
                    userInfo: res[0],
                    loggedIn: true
                });
            }
            if (this.remember.checked) {
                sessionStorage.setItem('userInfo', JSON.stringify(res[0]));
                console.log(sessionStorage.getItem('userInfo'));
                cookie.setCookie('userInfo', JSON.stringify(res[0]));
                console.log(cookie.getCookie('userInfo'));
            } else {
                sessionStorage.setItem('userInfo', JSON.stringify(res[0]));
                cookie.removeCookie('userInfo');
            }
        }).catch(err => {
            console.log(err);
        });
        event.preventDefault();
    }

    handleSignOut = () => {
        this.setState({
            loggedIn: false,
            userInfo: {}
        });

        sessionStorage.removeItem('userInfo');
        cookie.removeCookie('userInfo');

    }

    toggleDropDown = () => {
        this.setState({
            isDropDownOpen: !this.state.isDropDownOpen
        });
    }
    render() {
        const userInfo = this.state.userInfo;
        return (
            <div>
                <Navbar light expand="md">
                    <div className="container">
                        <NavbarBrand href="/" className="mr-auto">
                            <h3>Todo list</h3>
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggleNav} />
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link" to='/home'><span className="fa fa-home fa-lg"></span> Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/aboutus'><span className="fa fa-info fa-lg"></span> About Us</NavLink>
                                </NavItem>

                                <NavItem>
                                    <NavLink className="nav-link" to='/contactus'><span className="fa fa-address-card fa-lg"></span> Contact Us</NavLink>
                                </NavItem>
                            </Nav>
                            <Nav navbar className="ml-auto">
                                <NavItem className="mr-2" hidden={this.state.loggedIn ? true : false}>
                                    <Button outline onClick={this.toggleSignupModal} className="mb-1">Sign Up</Button>
                                </NavItem>
                                <NavItem hidden={this.state.loggedIn ? true : false}>
                                    <Button outline onClick={this.toggleLoginModal}>Login</Button>
                                </NavItem>
                                <NavItem hidden={this.state.loggedIn ? false : true}>
                                    <ButtonDropdown isOpen={this.state.isDropDownOpen} toggle={this.toggleDropDown}>
                                        <Button id="caret" color="primary">Welcome Back {this.state.userInfo.username}</Button>
                                        <DropdownToggle caret color="primary" />
                                        <DropdownMenu>
                                            <DropdownItem header>Personal</DropdownItem>
                                            <DropdownItem> <Link className="dropdownItem_link" to="/mypage">My List</Link></DropdownItem>
                                            <DropdownItem header>Account</DropdownItem>
                                            <DropdownItem onClick={ this.handleSignOut }>
                                               <Link className="dropdownItem_link" to="/home">Sign Out</Link>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>

                <Modal isOpen={this.state.isModalSignupOpen} toggle={this.toggleSignupModal}>
                    <ModalHeader toggle={this.toggleSignupModal}>Login</ModalHeader>
                    <ModalBody>
                        <LocalForm model="signUp" onSubmit={(values) => this.handleSignup(values)}>
                            <Row className="form-group">
                                <Label htmlFor="username" md={2}>Username</Label>
                                <Col md={10}>
                                    <Control.text model=".username" id="username" name="username"
                                        placeholder="Username"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(20)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".username"
                                        show="touched"
                                        messages={{
                                            required: 'Required ',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 20 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="password" md={2}>Password</Label>
                                <Col md={10}>
                                    <Control.password model=".password" id="password" name="password"
                                        placeholder="Password"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(8)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".password"
                                        show="touched"
                                        messages={{
                                            required: 'Required ',
                                            minLength: 'Must be greater than 8 characters'
                                        }}
                                    />
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Label htmlFor="email" md={2}>Email</Label>
                                <Col md={10}>
                                    <Control.text model=".email" id="email" name="email"
                                        placeholder="Email"
                                        className="form-control"
                                        validators={{
                                            required, validEmail
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".email"
                                        show="touched"
                                        messages={{
                                            required: 'Required ',
                                            validEmail: 'Invalid Email Address'
                                        }}
                                    />
                                </Col>
                            </Row>

                            <Row className="form-group">
                                <Col md={{ size: 10, offset: 2 }}>
                                    <Button type="submit" color="primary">
                                        Sign Up
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.isModalLoginOpen} toggle={this.toggleLoginModal}>
                    <ModalHeader toggle={this.toggleLoginModal}>Login</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                    innerRef={(input) => this.username = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                    innerRef={(input) => this.password = input} />
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input type="checkbox" name="remember"
                                        innerRef={(input) => this.remember = input} />
                                    Remember me
                                </Label>
                            </FormGroup>
                            <Button type="submit" color="primary">Login</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default Header;