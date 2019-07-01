import React, { Component } from 'react';
import {
    Table, Button, Input,
    Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';
import cookie from '../shared/common';
import { withRouter } from "react-router-dom";

class MyList extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.userinfo)
        const userInfo = this.props.userinfo || sessionStorage.getItem('userInfo') || cookie.getCookie('userInfo');

        if (userInfo) {
            this.state = {
                firstPage: 1,
                currentPage: 1,
                prevPage: 0,
                nextPage: 0,
                lastPage: 0,
                pageIdx: [],
                userInfo: userInfo
            };
        } else {
            this.state = {
                firstPage: 1,
                currentPage: 1,
                prevPage: 0,
                nextPage: 0,
                lastPage: 0,
                pageIdx: []
            };
        }
        this.renderItems = this.renderItems.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.RenderListItem = this.RenderListItem.bind(this);
        this.orderChanged = this.orderChanged.bind(this);
    }

    componentDidMount() {
        console.log("did mount")
        this.renderItems();
    }

    RenderListItem({ item }) {
        let itemId = item.id;
        return (
            <tr className="m-2">
                <td className="m-2">{item.title}</td>
                <td className="m-2">{item.content}</td>
                <td className="m-2">{item.start_date.replace('T', ' ').replace('Z', '')}</td>
                <td className="m-2">{item.expired_date.replace('T', ' ').replace('Z', '')}</td>
                <td className="m-2">{item.priority}</td>
                <td className="m-2">{item.status}</td>
                <td className="m-2">
                    <Button color="primary" size="sm">
                        <Link to={`/item/${itemId}`} className="dropdownItem_link text-white">
                            Edit
                       </Link>
                    </Button>
                </td>
                <td className="m-2">
                    <Button color="danger" size="sm" onClick={() => { this.deleteItem({ itemId }) }}>
                        Delete
                    </Button>
                </td>
            </tr>
        );
    }

    deleteItem(itemId) {
        let id = itemId.itemId;
        console.log(id);
        let curList = this.state.renderItems;
        console.log(curList);
        axios({
            method: 'delete',
            url: `${baseUrl}items/list/`,
            data: {
                "id": id
            },
            header: { 'Content-Type': 'application/json' },
        }).then(response => {
            console.log(response);
            if (response.data.success) {
                if (curList.length == 1) {
                    let curPage = this.state.currentPage
                    this.setState({
                        currentPage: curPage - 1
                    })
                    console.log(this.state.currentPage)
                    this.renderItems(this.state.currentPage);
                } else {
                    console.log(this.state.currentPage)
                    this.renderItems(this.state.currentPage);
                }
            } else {
                console.log("Fail");
            }

        }).catch(err => {
            console.log(err);
        });
    }

    renderItems(currentPage = this.state.firstPage, orderOpt = 0) {

        console.log(this.state.userInfo);
        if (this.state.userInfo) {
            let userId = JSON.parse(this.state.userInfo).id;
            axios({
                method: 'get',
                url: `${baseUrl}items/list?page=${currentPage}&userId=${userId}&orderOpt=${orderOpt}`,
                header: { 'Content-Type': 'application/json' },
            }).then(response => {
                console.log(response);
                if (response.data.data.length == 0) {
                    console.log("No Data");
                    this.setState({
                        renderItems: []
                    })
                } else {
                    console.log("No. of Data: " + response.data.data.length);
                    let pageCnt = Math.ceil(response.data.length / 3);
                    console.log(pageCnt);
                    let pageIdx = [];
                    for (var i = 1; i <= pageCnt; i++) {
                        pageIdx.push(i);
                    }
                    console.log(pageIdx);
                    this.setState({
                        renderItems: response.data.data,
                        itemsCnt: response.data.length,
                        lastPage: pageCnt,
                        pageIdx: pageIdx,
                        currentPage: currentPage
                    })

                    if (currentPage == this.state.firstPage) {
                        this.setState({
                            prevPage: 0
                        })
                    } else {
                        this.setState({
                            prevPage: currentPage - 1
                        })
                    }

                    if (currentPage == this.state.lastPage) {
                        this.setState({
                            nextPage: 0
                        })
                    } else {
                        this.setState({
                            nextPage: currentPage + 1
                        })
                    }
                }

            }).catch(err => {
                console.log(err);
            });
        }
    }

    orderChanged() {
        console.log(this.select.value);
        let val = this.select.value;
        let orderOpt = 0;
        switch (val) {
            case 'Default':
                orderOpt = 0;
                break;
            case 'Priority High to Low':
                orderOpt = 1;
                break;
            case 'Priority Low to High':
                orderOpt = 2;
                break;
            case 'Expired Time Early':
                orderOpt = 3;
                break;
            case 'Expired Time Late':
                orderOpt = 4;
                break;
            case 'Start Time Early':
                orderOpt = 5;
                break;
            case 'Start Time Late':
                orderOpt = 6;
                break;
            case 'Status':
                orderOpt = 7;
                break;
            default:
                orderOpt = 0;
                break;
        }
        this.renderItems(this.state.firstPage,orderOpt);
    }

    render() {
        let disableLeft = true;
        let disableRight = false;
        if (this.state.currentPage == this.state.firstPage) {
            disableLeft = true;
            disableRight = false;
        } else if (this.state.currentPage == this.state.lastPage) {
            disableLeft = false;
            disableRight = true;
        } else {
            disableLeft = false;
            disableRight = false;
        }

        let list = (() => {
            return (
                <p>No Data</p>
            );
        });
        if (this.state.renderItems && this.state.renderItems.length > 0) {
            list = this.state.renderItems.map((item) => {
                return (
                    <this.RenderListItem item={item} key={item.id}></this.RenderListItem>
                );

            });
        }

        let pages = (() => {
            return (
                <PaginationItem>
                </PaginationItem>
            );
        });

        if (this.state.pageIdx && this.state.pageIdx.length > 0) {
            pages = this.state.pageIdx.map((idx) => {
                if (idx == this.state.currentPage) {
                    return (
                        <PaginationItem active key={idx}>
                            <PaginationLink onClick={() => { this.renderItems(idx) }}>{idx}</PaginationLink>
                        </PaginationItem>
                    );
                } else
                    return (
                        <PaginationItem key={idx}>
                            <PaginationLink onClick={() => { this.renderItems(idx) }}>{idx}</PaginationLink>
                        </PaginationItem>
                    );
            });
        }



        return (
            <div className="container" >
                <div className="row">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Start Date</th>
                                <th>Expired Date</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th colSpan={2}>
                                    <Input type="select" name="select" id="select" name="select"
                                        innerRef={(input) => this.select = input}
                                        onChange={() => { this.orderChanged(); }}>
                                        <option>Default</option>
                                        <option>Priority High to Low</option>
                                        <option>Priority Low to High</option>
                                        <option>Expired Time Early</option>
                                        <option>Expired Time Late</option>
                                        <option>Start Time Early</option>
                                        <option>Start Time Late</option>
                                        <option>Status</option>
                                    </Input>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {list}
                        </tbody>
                    </Table>
                    <p className="text-warning"> status: 0 => not finish, 1 => finished, 2 => expired</p>
                </div>
                <div className="row">
                    <Pagination aria-label="Page navigation">
                        <PaginationItem disabled={disableLeft}>
                            <PaginationLink first onClick={() => { this.renderItems(this.state.firstPage) }} />
                        </PaginationItem>
                        <PaginationItem disabled={disableLeft}>
                            <PaginationLink previous onClick={() => { this.renderItems(this.state.prevPage) }} />
                        </PaginationItem>
                        {pages}
                        <PaginationItem disabled={disableRight}>
                            <PaginationLink next onClick={() => { this.renderItems(this.state.nextPage) }} />
                        </PaginationItem>
                        <PaginationItem disabled={disableRight}>
                            <PaginationLink last onClick={() => { this.renderItems(this.state.lastPage) }} />
                        </PaginationItem>
                    </Pagination>
                </div>

            </div>
        );
    }
}


export default withRouter(MyList);