import React from 'react';
import { connect } from 'react-redux';
import history from '../history'
import _ from 'lodash';
import { Button, Card, Grid } from 'semantic-ui-react'
import './App.css'

class Home extends React.Component {
  render() {
    return (
    <Grid columns={4} centered>
      <Grid.Column verticalAlign='middle'>
        <Grid.Row verticalAlign='middle' stretched className='all-centered'>
        <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header>Good Day!</Card.Header>
            <Card.Description>
              What method would you like to use?
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button color='green' onClick={() => history.push('/regula-falsi')}>
                Regula-Falsi
              </Button>
              <Button color='blue' onClick={() => history.push('/bairstows')}>
                Bairstow's
              </Button>
            </div>
          </Card.Content>
        </Card>
        </Card.Group>
        </Grid.Row>
      </Grid.Column>
      </Grid>
    );
  }
}

export default connect(null)(Home);