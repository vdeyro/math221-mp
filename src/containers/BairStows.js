import React from 'react';
import { connect } from 'react-redux';
import history from '../history'
import { Button, Form, Grid, Input, Accordion, Icon, Menu } from 'semantic-ui-react'
import './App.css'
import { Field, reduxForm } from 'redux-form'
import { abs, sqrt, round} from 'mathjs'
import Iteration from '../components/BairstowIteration'
import { saveResultBairstow } from '../actions';


class Bairstow extends React.Component {

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
    console.log(eq)
    return decPlaces ? round(eq,decPlaces): eq
  }
     

  calculateBairstow = (a, r, s, roots, error, decPlaces, iterations, tmp={}) => {
    let D;
    let x1;
    let x2;
    if ( a.length === 1 ) {
      return null
    }
    if ( a.length === 2 && a[1] !== 0) {
      x1 = this.roundoff(-a[0]/a[1], decPlaces)
      roots.push(x1)
      // for display
      tmp.type = 'direct'
      tmp.a = a
      tmp.roots = [x1]
      iterations.push({...tmp})
      return null
    } 

    if ( a.length === 3 ){
       D = (a[1]**2.0)-(4.0)*(a[2])*(a[0])
      if ( D > 0 ) { 
        x1 = this.roundoff((-a[1] - sqrt(D))/(2*a[2]), decPlaces)
        x2 = this.roundoff((-a[1] + sqrt(D))/(2*a[2]), decPlaces)
      } else {
        x1 = String(this.roundoff(((-a[1])/(2*a[2])),decPlaces)) + '-' + this.roundoff(sqrt(abs(D))/(2*a[2]), decPlaces) + 'i'
        x1 = String(this.roundoff(((-a[1])/(2*a[2])),decPlaces)) + '+' + this.roundoff(sqrt(abs(D))/(2*a[2]), decPlaces) + 'i'
      }

      // for display
        tmp.type = 'quadratic'
        tmp.a = a
        tmp.roots = [x1,x2]
        iterations.push({...tmp})
        roots.push(x1)
        roots.push(x2)
      return null
    }

    let n = a.length
    let b = Array.apply(null, Array(n)).map(() => 0 )
    let c = Array.apply(null, Array(n)).map(() => 0 )
    
    b[n-1] = this.roundoff(a[n-1], decPlaces)
    b[n-2] = this.roundoff(a[n-2] + (r*b[n-1]), decPlaces)
    let i = n - 3
    do {
      b[i] = this.roundoff(a[i] + (r*b[i+1]) + (s*b[i+2]),decPlaces)
      i = i - 1
    } while ( i >= 0)
    c[n-1] = this.roundoff(b[n-1], decPlaces)
    c[n-2] = this.roundoff(b[n-2] + (r*c[n-1]), decPlaces)
    i = n - 3
    do {
      c[i] = this.roundoff(b[i] + (r*c[i+1]) + (s*c[i+2]), decPlaces)
      i = i - 1
    } while ( i >= 0)


    let Din = ((c[2]*c[2])-(c[3]*c[1]))**(-1.0)
    let rdiff = this.roundoff((Din)*((c[2])*(-b[1])+(-c[3])*(-b[0])), decPlaces)
    let sdiff = this.roundoff((Din)*((-c[1])*(-b[1])+(c[2])*(-b[0])), decPlaces)

    let rstar = this.roundoff(r + (Din)*((c[2])*(-b[1])+(-c[3])*(-b[0])), decPlaces)
    let sstar = this.roundoff(s + (Din)*((-c[1])*(-b[1])+(c[2])*(-b[0])), decPlaces)

    // for display
    tmp.type = 'bairstow'
    tmp.iteration = tmp.iteration ? tmp.iteration : []
    tmp.iteration.push({
      r,s,a,b,c,rdiff,sdiff,rstar,sstar
    })

    if(this.roundoff(rdiff/rstar, decPlaces) > error || this.roundoff(sdiff/sstar, decPlaces) > error ) {
      return this.calculateBairstow(a,rstar,sstar,roots,error,decPlaces, iterations,tmp)
    }
    if (n >= 3){
      let Dis = ((-rstar)**(2.0))-((4.0)*(1.0)*(-sstar))
      if ( Dis > 0 ) { 
        x1 = this.roundoff((rstar - sqrt(Dis))/(2.0), decPlaces)
        x2 = this.roundoff((rstar + sqrt(Dis))/(2.0), decPlaces)
      } else {
        x1 = String(this.roundoff(((rstar)/(2.0)), decPlaces)) + '-' + this.roundoff(sqrt(abs(Dis))/(2.0), decPlaces) + 'i'
        x2 = String(this.roundoff(((rstar)/(2.0)), decPlaces)) + '+' + this.roundoff(sqrt(abs(Dis))/(2.0), decPlaces) + 'i'
      }
      roots.push(x1)
      roots.push(x2)
      // for display
      tmp.roots = [x1,x2]
      iterations.push({...tmp})

      // go to next
      b.splice(0,2)
      return this.calculateBairstow(b,rstar,sstar,roots,error,decPlaces, iterations)
    }
  }

  onSubmit = (formValues) => {
    const error = formValues.error ? Number(formValues.error)/100 : 0.0001/100
    const decPlaces = formValues.decPlaces ? Number(formValues.decPlaces) : 4
    let root = [];
    let iterations = [];
    this.calculateBairstow(formValues.formula.split(',').reverse().map(item=>Number(item)),0,0,root,error,decPlaces,iterations);

    this.props.saveResultBairstow({
      answer: root,
      iterations
    })
  
  }

  renderAnswer = () => {
    if (this.props.result.answer) return (
      <Grid columns={1} centered>
        <Grid.Row stretched>
        <Grid.Column>
          <h3>Answer</h3>
          {this.props.result.answer.map((item, index) => <span key={`result-${index}`}><strong>x:</strong> {item}</span> )}
          <Iteration/>
        </Grid.Column>
        </Grid.Row>
      </Grid>
    )

    return ""
    
  }

  renderPolynomialFormula = () => {
    const arr = this.props.values.formula.split(',')
    let equation = ""
    arr.forEach((item, index) => { 
      let a = abs(arr.length-index-1)
      let tmp = ''
      if (Number(item) !== 0 ) {
        // logic for adding sign
        // index > 0
        if ( index > 0) {
          tmp = Number(item) > 0 ? '+' : ''
        }
        // logic if shownumber or not
        if ( a === 0 ) {
          tmp = tmp + item
        } else {
          if ( Number(item) === 1 ) {
            tmp = tmp
          } else if ( Number(item) === -1 ) {
            tmp = tmp + '-'
          } else {
            tmp = tmp + item
          }
          // logic for showing x
          tmp = tmp + 'x'
          if ( a !== 1 ) {
            tmp = tmp + '^' + a
          }
        }
      }
      equation = equation + tmp
    })
    //this.calculate(this.props.values.formula, {x: 0}) 
    return equation
  }

  render() {
    const { activeIndex } = this.state
    return (
      <>
      <Menu pointing secondary>
          <Menu.Item
            name='Regula Falsi'
            onClick={() => history.push('/regula-falsi')}
          />
          <Menu.Item
            name="Bairstow's"
            active={true}
          />
      </Menu>
      <Grid columns={2} centered>
        <Grid.Row stretched>
        <Grid.Column verticalAlign='middle'>
          <h3>Input Parameters</h3>
          <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <Field name="formula" component={this.renderFormula} placeholder='1,0,-1'/>
            <em>{`Polynomial Equation: ${this.props.values && this.props.values.formula ? this.renderPolynomialFormula() : ""}`}</em>
            <Grid columns={2}>
            <Grid.Column textAlign="left">
            <Accordion>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}><Icon name='dropdown' />Extras</Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                <Field name="error" label="Ea(%)" component={this.renderInitial} placeholder='0.0001' />
                <Field name="decPlaces" label="Decimal Places" component={this.renderInitial} placeholder='4' />
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
    values: state.form.bairstow.values,
    result: state.bairstowResult }
}

const validate = (formValues) => {
  // x0 should not be equal to x1
  const errors = {};
  if (!formValues.formula) {
    errors.formula = 'Enter a formula'
  }
  return errors
}

export default reduxForm({form:'bairstow', validate})(connect(mapStateToProps, { saveResultBairstow } )(Bairstow));