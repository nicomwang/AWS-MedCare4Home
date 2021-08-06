import React, { useState, useEffect } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AppContext } from './libs/contextLib';
import { Auth } from 'aws-amplify';
import './App.css';
import Routes from './Routes';
import { useHistory } from 'react-router-dom';
import { onError } from './libs/errorLib';
import { BiHomeHeart } from 'react-icons/bi';

function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);
    history.push('/');
  }

  return (
    !isAuthenticating && (
      <div className='App container py-3'>
        <Navbar collapseOnSelect expand='md' className='mb-3'>
          <BiHomeHeart size={40} className='mr-2'/>
          <br />
          <Navbar.Brand href='/' className='font-weight-bold' >
            MedCare4Home
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className='justify-content-end font-weight-bold'>
            <Nav>
              {isAuthenticated ? (
                <>
                  <LinkContainer to='/documents'>
                    <Nav.Link>Documents</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/symptoms'>
                    <Nav.Link>Symptoms</Nav.Link>
                  </LinkContainer>
                  <NavDropdown title='Account' id='nav-dropdown' >
                    <LinkContainer to='/settings/password'>
                      <NavDropdown.Item eventKey='4.1'>
                        Change Password
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={handleLogout} eventKey='4.2'>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to='/signup'>
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/login'>
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
