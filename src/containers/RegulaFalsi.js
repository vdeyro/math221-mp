import React from 'react';
import { connect } from 'react-redux';
import history from '../history'
import { Button, Form, Grid, Input, Accordion, Icon, Menu, Message, Dimmer, Loader } from 'semantic-ui-react'
import './App.css'
import { Field, reduxForm } from 'redux-form'
import { evaluate, abs, round} from 'mathjs'
import Iteration from '../components/Iterations'
import { saveResultRegula } from '../actions';


class RegulaFalsi extends React.Component {

  state = { activeIndex: null }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  renderFormula (formProps){
    return (
      <>
      <Form.Input {...formProps}/>
      </>
    )
  }

  renderInitial = (formProps) => {
    return (
      <>
      <Form.Field inline>
      <Input {...formProps}/>
      </Form.Field>
      </>
    )
  }
  
  roundoff = (eq,decPlaces) => {
    return decPlaces && decPlaces !== 0 ? round(eq,decPlaces): eq
  }

  onSubmit = (formValues) => {
    try {
      this.props.saveResultRegula({ loading: true })
      const error = formValues.error ? Number(formValues.error) : 0.000001
      const decPlaces = formValues.decPlaces ? Number(formValues.decPlaces) : 6
      let iteration = {
        next_x0: Number(formValues.initial_negative),
        next_x1: Number(formValues.initial_positive)
      }
      let formula = formValues.formula;
      let iterations = []
      do {
    
        // compute iteration
        iteration = this.getIteration(formula, iteration.next_x0, iteration.next_x1, decPlaces)
        // add to result
        iterations.push({...iteration})
      } while ( 
        // terminating condition
        // either f(x2) == 0 or Ea <= error (default is 0.000001)
        iteration.value !== 0 && !( iterations.length > 2 && abs(iterations[iterations.length-2].x2 - iteration.x2) <= error)  )
      this.props.saveResultRegula({
        answer: iteration.x2,
        value: iteration.value,
        iterations
      })
    } catch (e) {
      this.props.saveResultRegula({ error: e.message})
    }
  }

  getIteration(formula, x0, x1, decPlaces) {
    // x2 = c
    // x0 = a
    // x1 = b
    // x2 = c
    // f(x0) = x
    // f(x1) = y
    // c = a - x((b-a)/(x-y))
    const results = {}
    results.x0 = x0
    results.x1 = x1
    // calculate x2
    const x = this.calculate(formula, x0, decPlaces)
    const y = this.calculate(formula, x1, decPlaces)
    results.x2 = this.roundoff(x0 - (x*(x0-x1)/(x-y)), decPlaces)

    // calculate value
    results.value = this.calculate(formula, results.x2, decPlaces)

    // get values for next iteration
    results.next_x0 = results.x0
    results.next_x1 = results.x2
    if (results.value < 0) {
      results.next_x0 = results.x2
      results.next_x1 = results.x1
    }
    return results
  }

  calculate(formula, x, decPlaces) {
    try {
      return this.roundoff(evaluate(formula, {x}), decPlaces) 
    } catch (e) {
      console.log(e)
      return ""
    }
  }

  renderAnswer = () => {
    if (this.props.result.answer || this.props.result.answer === 0) return (
      <Grid columns={1} centered>
        <Grid.Row stretched>
        <Grid.Column>
          <h3>Answer</h3>
          <span><strong>x2:</strong> {this.props.result.answer}</span>
          <span><strong>f(x2):</strong> {this.props.result.value}</span>
          <Iteration/>
        </Grid.Column>
        </Grid.Row>
      </Grid>
    )

    return ""
    
  }

  renderError = () => {
    if (this.props.result.error) return (
      <Message error>
        <Message.Header>Sorry, we didn't anticipate this :(</Message.Header>
        <p>{this.props.result.error}</p>
      </Message>
    )
    return ""
    
  }

  renderLoading = () => {
    if (this.props.result.loading) return (
      <Dimmer active inverted>
        <Loader inverted content='Calculating' />
      </Dimmer>
    )
  }

  render() {
    const { activeIndex } = this.state
    return (
      <>
      <Menu pointing secondary>
          <Menu.Item
            name='Regula Falsi'
            active={true}
          />
          <Menu.Item
            name="Bairstow's"
            onClick={() => history.push('/bairstows')}
          />
      </Menu>
      <Grid columns={2} centered>
        <Grid.Row stretched>
        <Grid.Column verticalAlign='middle'>
          <h3>Input Formula</h3>
          <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <Field name="formula" component={this.renderFormula} placeholder='sin(x)+x^2+e^3'/>
            <Grid columns={2}>
            <Grid.Column>
            <Field name="initial_negative" label="x0" component={this.renderInitial} placeholder='0' />
            </Grid.Column>
            <Grid.Column textAlign='left' verticalAlign='middle'>
            {`Value: ${this.props.values && this.props.values.formula && this.props.values.initial_negative ? this.calculate(this.props.values.formula, Number(this.props.values.initial_negative)) : ""}`}
            </Grid.Column>
            <Grid.Column>
            <Field name="initial_positive" label="x1" component={this.renderInitial} placeholder='1' />
            </Grid.Column>
            <Grid.Column textAlign='left' verticalAlign='middle'>
            {`Value: ${this.props.values && this.props.values.formula && this.props.values.initial_positive ? this.calculate(this.props.values.formula, Number(this.props.values.initial_positive)) : ""}`}
            </Grid.Column>
            <Grid.Column textAlign="left">
            <Accordion>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}><Icon name='dropdown' />Extras</Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                <Field name="error" label="Ea" component={this.renderInitial} placeholder='0.000001' />
                <Field name="decPlaces" label="Decimal Places" component={this.renderInitial} placeholder='6' />
                </Accordion.Content>
            </Accordion>
            </Grid.Column>
            </Grid>
            <br></br>
            <Button className='blue'>Calculate</Button>
          </Form>
        </Grid.Column>
        </Grid.Row>
      </Grid>
      {this.renderAnswer()}
      {this.renderError()}
      {this.renderLoading()}
    </>
    );
  }
}

const mapStateToProps = state => {
  return { 
    values: state.form.regula.values,
    result: state.regulaResult }
}

const validate = (formValues) => {
  // x0 should not be equal to x1
  const errors = {};
  if (!formValues.formula) {
    errors.formula = 'Enter a formula'
  }
  return errors
}

export default reduxForm({form:'regula', validate})(connect(mapStateToProps, { saveResultRegula } )(RegulaFalsi));