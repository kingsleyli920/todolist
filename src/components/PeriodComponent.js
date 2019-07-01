import React, { Component } from 'react';
import {
    Button, Row, Col, Label,
    Form, Input, FormGroup
} from 'reactstrap';
import Datetime from 'react-datetime';
import axios from 'axios';
import { baseUrl } from '../shared/baseUrl';
import cookie from '../shared/common';

class Period extends Component {
    constructor(props) {
        super(props);
        const userInfo = this.props.userinfo ||sessionStorage.getItem('userInfo') || cookie.getCookie('userInfo');

        if (userInfo) {
            this.state = {
                valid: this.props.valid,
                selectedFrom: new Date(),
                selectedTo: new Date(),
                userInfo: userInfo
            }
        } else {
            this.state = {
                valid: this.props.valid,
                selectedFrom: new Date(),
                selectedTo: new Date()
            }
        }

        this.fromDateChange = this.fromDateChange.bind(this);
        this.fromDateConfirm = this.fromDateConfirm.bind(this);
        this.toDateChange = this.toDateChange.bind(this);
        this.toDateConfirm = this.toDateConfirm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        if (this.state.userInfo) {
            var userId = JSON.parse(this.state.userInfo).id;
            console.log(`Title: ${this.title.value},
        Content: ${this.content.value},
        selectedTo: ${this.state.selectedTo},
        selectedFrom: ${this.state.selectedFrom}, 
        priority: ${this.select.value}`);
            let data = {
                'title': this.title.value,
                'content': this.content.value,
                'status': 0,
                'userId': userId,
                'start_date': this.state.selectedFrom,
                'expired_date': this.state.selectedTo,
                'priority': this.select.value
            };

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

    fromDateChange(value) {
        this.setState({
            selectedFrom: value
        })
    }

    fromDateConfirm(value) {
        this.setState({
            selectedFrom: value
        })
    }

    toDateChange(value) {
        this.setState({
            selectedTo: value
        })
    }

    toDateConfirm(value) {
        this.setState({
            selectedTo: value
        })
    }

    render() {
        var fromDate = this.state.selectedFrom
        var toValid = function (current) {
            return current.isAfter(fromDate);
        };
        return (
            <Row>
                <Col sm="12">
                    <Form onSubmit={(values) => this.handleSubmit(values)}>
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
                                <Label htmlFor="date">From</Label>
                                <Datetime isValidDate={this.state.valid} input={true}
                                    onChange={this.fromDateChange}
                                    onBlur={this.fromDateConfirm} />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col>
                                <Label htmlFor="date">To</Label>
                                <Datetime isValidDate={toValid} input={true}
                                    onChange={this.toDateChange}
                                    onBlur={this.toDateConfirm} />
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

export default Period;