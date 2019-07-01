import React, { Component } from 'react';
import {
    Button, Row, Col, Label, Badge,
    Form, Input, FormGroup, Breadcrumb, BreadcrumbItem
} from 'reactstrap';
import { withRouter } from "react-router-dom";
import { baseUrl } from '../shared/baseUrl';
import cookie from '../shared/common';
import axios from 'axios';
import Datetime from 'react-datetime';
import { Link } from 'react-router-dom';

class MyItemPage extends Component {
    constructor(props) {
        super(props);
        const userInfo = sessionStorage.getItem('userInfo') || cookie.getCookie('userInfo');
        console.log('userInfo: ' + userInfo);
        if (userInfo) {
            this.state = {
                userInfo: userInfo
            }
        } else {
            this.state = {
                selectedDate: new Date()
            }
        }
        this.fromDateChange = this.fromDateChange.bind(this);
        this.fromDateConfirm = this.fromDateConfirm.bind(this);
        this.toDateChange = this.toDateChange.bind(this);
        this.toDateConfirm = this.toDateConfirm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderitem = this.renderitem.bind(this);
    }

    componentDidMount() {
        console.log(this.props.match.params.id);
        let itemId = this.props.match.params.id;
        if (!itemId) {
            return;
        }
        this.setState({
            itemId: this.props.match.params.id
        })
        this.renderitem(itemId);
    }

    renderitem(itemId) {
        axios({
            method: 'get',
            url: `${baseUrl}items/item?id=${itemId}`,
            header: { 'Content-Type': 'application/json' },
        }).then(response => {
            console.log(response);
            let item = response.data.item;
            if (item) {
                if (item.status == 0) {
                    item.statusTxt = 'In Processing'
                } else if (item.status == 1) {
                    item.statusTxt = 'Finished'
                } else {
                    item.statusTxt = 'Expired'
                }
                this.setState({
                    item: item,
                    selectedFrom: item.start_date,
                    selectedTo: item.expired_date
                })
            }

        }).catch(err => {
            console.log(err);
        });
    }
    handleSubmit(event) {
        if (this.state.userInfo && this.state.itemId) {
            var userId = JSON.parse(this.state.userInfo).id;
            var itemId = this.state.itemId;
            console.log(`UserId: ${userId}, ItemId: ${itemId}, Title: ${this.title.value},
        Content: ${this.content.value},
        selectedTo: ${this.state.selectedTo},
        selectedFrom: ${this.state.selectedFrom}, 
        priority: ${this.select.value},
        status: ${this.status.value}`);
            if (!this.title.value) {
                this.title.value = this.state.item.title;
            }

            if (!this.content.value) {
                this.content.value = this.state.item.content;
            }

            let data = {
                'id': this.state.itemId,
                'title': this.title.value,
                'content': this.content.value,
                'status': this.state.item.status,
                'userId': userId,
                'start_date': this.state.selectedFrom,
                'expired_date': this.state.selectedTo,
                'priority': this.select.value,
                'status': this.status.value
            };

            axios({
                method: 'put',
                url: `${baseUrl}items/item/`,
                header: { 'Content-Type': 'application/json' },
                data: data
            }).then(response => {
                console.log(response);
                if (response.data.success) {
                    this.forceUpdate();
                    alert("Update Successful");
                    this.renderitem(this.state.itemId);
                } else {
                    console.log("add fail");
                }
            }).catch(err => {
                console.log(err);
            });
        }
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
        if (this.state.item) {
            let curItem = this.state.item;
            var fromDate = this.state.selectedFrom
            var toValid = function (current) {
                return current.isAfter(fromDate);
            };

            return (

                <Row>
                    <Col>
                        <div>
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/mypage"><h4>return</h4></Link></BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                    </Col>
                    <Col sm="12">
                        <Form onSubmit={(values) => this.handleSubmit(values)}>
                            <FormGroup>
                                <Col><h3><Badge color="success" pill>{this.state.item.statusTxt}</Badge></h3></Col>
                                <Col>
                                    <Label htmlFor="status">Status</Label>
                                    <Input type="select" name="status" id="status" name="status"
                                        innerRef={(input) => this.status = input} defaultValue={this.state.item.status}>
                                        <option>0</option>
                                        <option>1</option>
                                    </Input>
                                </Col>
                                <Col>
                                    <Label htmlFor="title">Title</Label>
                                    <Input type="text" id="title" name="title"
                                        defaultValue={this.state.item.title}
                                        innerRef={
                                            (input) => this.title = input
                                        } />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Label htmlFor="content">Content</Label>
                                    <Input type="textarea" id="content" name="content"
                                        defaultValue={this.state.item.content}
                                        innerRef={(input) => this.content = input} />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Label htmlFor="date">From</Label>
                                    <Datetime isValidDate={this.state.valid} input={true}
                                        onChange={this.fromDateChange}
                                        onBlur={this.fromDateConfirm}
                                        defaultValue={new Date(this.state.item.start_date)} />
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col>
                                    <Label htmlFor="date">To</Label>
                                    <Datetime isValidDate={toValid} input={true}
                                        onChange={this.toDateChange}
                                        onBlur={this.toDateConfirm}
                                        defaultValue={new Date(this.state.item.expired_date)} />
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col>
                                    <Label for="select">Select</Label>
                                    <Input type="select" name="select" id="select" name="select"
                                        innerRef={(input) => this.select = input} defaultValue={this.state.item.priority}>
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
        } else {
            return (
                <p>No Data</p>
            );
        }
    }
}

export default withRouter(MyItemPage);