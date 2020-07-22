import React from 'react';
import { connect } from 'react-redux';
import history from '../history'
import { Button, Form, Grid, Input, Accordion, Icon, Menu } from 'semantic-ui-react'
import './App.css'
import { Field, reduxForm } from 'redux-form'
import { evaluate, abs, round} from 'mathjs'
import Iteration from '../components/Iterations'
import { saveResult } from '../actions';


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

  renderErrorInput (formProps){
    return (
      <Form.Field inline>
      <Input {...formProps}/>
      </Form.Field>
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
  
  onSubmit = (formValues) => {
    const error = formValues.error ? Number(formValues.error) : 0.0000001
    const decPlaces = Number(formValues.decPlaces)
    console.log(error)
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
      // either f(x2) == 0 or Ea <= error (default is 0.0000001)
      iteration.value != 0 && !( iterations.length > 2 && abs(iterations[iterations.length-2].x2 - iteration.x2) <= error)  )
    
    this.props.saveResult({
      answer: iteration.x2,
      value: iteration.value,
      iterations
    })
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
    results.x2 = decPlaces && decPlaces !=0 ? round(x0 - (x*(x0-x1)/(x-y)), decPlaces) : x0 - (x*(x0-x1)/(x-y))

    // calculate value
    results.value = this.calculate(formula, results.x2, decPlaces)

    // get values for next iteration
    results.next_x0 = results.x0
    results.next_x1 = results.x1
    if (results.value < 0) {
      results.next_x0 = results.x2
      results.next_x1 = results.x1
    }
    return results
  }

  calculate(formula, x, decPlaces) {
    try {
      return decPlaces && decPlaces != 0 ? round(evaluate(formula, {x}), decPlaces): evaluate(formula, {x}) 
    } catch (e) {
      console.log(e)
      return ""
    }
  }

  renderAnswer = () => {
    if (this.props.result.answer) return (
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
                <Field name="error" label="Ea" component={this.renderInitial} placeholder='0.0000001' />
                <Field name="decPlaces" label="Decimal Places" component={this.renderInitial} placeholder='7' />
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
  const inputs = {
    x: 0
  }
  // x0 should not be equal to x1
  const errors = {};
  if (!formValues.formula) {
    errors.formula = 'Enter a formula'
  }
  return errors
}

export default reduxForm({form:'regula', validate})(connect(mapStateToProps, { saveResult } )(RegulaFalsi));