import React, { Component } from "react";
import { connect } from 'react-redux';
import { createMemoryHistory } from "history";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link, useMatch, useResolvedPath,
} from "react-router-dom";

import { Navbar, Nav, Col, Container, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
// import fontawesome from '@fortawesome/fontawesome'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCoffee, faCopy, faTag } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast as toastify } from 'react-toastify';
import { setToast, notify } from "./store/toast";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import Admin from "./Admin";
import Pricing from "./Pricing";
import ConnectWeb3 from "./coms/ConnectWeb3";


// fontawesome.library.add(faCopy, faTag);


const MyLink = ({ children, to, ...props }) => {
  let resolved = useResolvedPath(to)
  let match = useMatch({ path: resolved.pathname, end: true })
  const styles = {
    active: {
      borderWidth: 3,
      borderStyle: "solid",
      borderColor: "black",
      borderImage: "linear-gradient(45deg, turquoise, greenyellow) 1 / 1 / 0 stretch",
      boxShadow: "rgb(170 170 170) 3px 3px 8px",
      margin: -4,
    }
  }
  return (
    <Nav.Link href={to} className="active" style={match ? styles.active : {}}
      {...props}> {children}
    </Nav.Link>
  )
}



class App extends Component {
  state = {
  };
  constructor(props) {
    super(props);
  }
  componentDidMount = async () => {
    // console.log("history: ", history);
    this.props.setToast(toastify);
  };

  // notify = (message = '', type = 'error') => {
  //   return toast[type](message);
  // };

  render() {
    return (
      <Container>
        <Navbar bg="primary" variant="dark">
          <Container>
            <Navbar.Brand href="/">FUNIX PRICING CHAIN!</Navbar.Brand>
            <Nav className="me-auto">
              <MyLink to="/pricing">Pricing</MyLink>
              <MyLink to="/admin">Admin</MyLink>
            </Nav>
            <ConnectWeb3 />
          </Container>
        </Navbar>

        <Routes>
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          limit={4}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    )
  }
}
const style = {
}


const mapStateToProps = (state, ownProps) => {
  return {
  }
}
export default connect(mapStateToProps, {
  setToast, notify
})(App);