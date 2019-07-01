import React, { Component } from 'react';
import {
    Button, Row, Col, Label,
    Form, Input, FormGroup
} from 'reactstrap';
import Datetime from 'react-datetime';
import axios from 'axios';
import { baseUrl } from '../shared/baseUrl';
import cookie from '../shared/common';

class OneDay extends Component {
    constructor(props) {
        super(props);
        const userInfo = this.props.userinfo || sessionStorage.getItem('userInfo') || cookie.getCookie('userInfo');
        console.log('userInfo: ' + userInfo);
        if (userInfo) {
            this.state = {
                valid: this.props.valid,
                selectedDate: new Date(),
                userInfo: userInfo
            }
        } else {
            this.state = {
                valid: this.props.valid,
                selectedDate: new Date()
            }
        }
        console.log('state userInfo: ' + this.state.userInfo);
        this.dateChange = this.dateChange.bind(this);
        this.dateConfirm = this.dateConfirm.bind(this);
        this.handleToday = this.handleToday.bind(this);
    }

    handleToday(event) {
        if (this.state.userInfo) {
            var userId = JSON.parse(this.state.userInfo).id;
            console.log(`Title: ${this.title.value},
        Content: ${this.content.value},
        expired_date: ${this.state.selectedDate}, 
        priority: ${this.select.value},
        userInfo: ${this.state.userInfo}`);
            let data = {
                'title': this.title.value,
                'content': this.content.value,
                'status': 0,
                'userId': userId,
                'expired_date': this.state.selectedDate,
                'priority': this.select.value
            };
            console.log(data)
            axios({
                method: 'post',
                url: `${baseUrl}items/list/`,
                header: { 'Content-Type': 'application/json' },
                data: data
            }).then(response => {
                console.log(response);
                if (response.data.success) {
                    this.forceUpdate();
                } else {
                    console.log("add fail");
                }
            }).catch(err => {
                console.log(err);
            });
        }
        window.location.reload();
        event.preventDefault();
    }

    dateChange(value) {
        this.setState({
            selectedDate: value
        })
    }
    dateConfirm(value) {
        this.setState({
            selectedDate: value
        })
    }

    render() {
        return (
            <Row>
                <Col sm="12">
                    <Form onSubmit={(values) => this.handleToday(values)}>
                        <FormGroup>
                            <Col>
                                <Label htmlFor="title">Title</Label>
                                <Input type="text" id="title" name="title"
                                    innerRef={(input) => this.title = input} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col>
                                <Label htmlFor="content">Content</Label>
                                <Input type="textarea" id="content" name="content"
                                    innerRef={(input) => this.content = input} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col>
                                <Label htmlFor="date">Date</Label>
                                <Datetime isValidDate={this.state.valid} input={true}
                                    onChange={this.dateChange}
                                    onBlur={this.dateConfirm} />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col>
                                <Label for="select">Select</Label>
                                <Input type="select" name="select" id="select" name="select"
                                    innerRef={(input) => this.select = input}>
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                </Input>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col>
                                <Button type="submit" color="primary">Submit</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default OneDay;