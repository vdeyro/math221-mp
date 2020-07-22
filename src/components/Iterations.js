import React, { Component } from 'react'
import { Accordion, Icon, Table } from 'semantic-ui-react'
import { connect } from 'react-redux'

class Iteration extends Component {
  state = { activeIndex: null }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  renderRows = (iters) => {
    return iters.map((item, index) => {
      return (<Table.Row key={`regula-row-${index}`} positive={iters.length-1 === index}>
      <Table.Cell>{item.x0}</Table.Cell>
      <Table.Cell>{item.x2}</Table.Cell>
      <Table.Cell>{item.x1}</Table.Cell>
      <Table.Cell>{item.value}</Table.Cell>
      </Table.Row>)
    })
  }
  render() {
    const { activeIndex } = this.state
    console.log(this.props.result)
    return (
      <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          Iterations
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Table celled fixed singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>x0</Table.HeaderCell>
                <Table.HeaderCell>x2</Table.HeaderCell>
                <Table.HeaderCell>x1</Table.HeaderCell>
                <Table.HeaderCell>f(x2)</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.renderRows(this.props.result.iterations)}
            </Table.Body>
          </Table>
        </Accordion.Content>
      </Accordion>
    )
  }
}

const mapStateToProps = state => {
  return { result: state.regulaResult }
}

export default connect(mapStateToProps)(Iteration)