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
      let b = item.b.slice(0)
      let c = item.c.slice(0)
      return (
      <Table.Row key={`rows-${index}`} positive={iters.length-1 === index}>
        <Table.Cell>{item.r}</Table.Cell>
        <Table.Cell>{item.s}</Table.Cell>
        <Table.Cell>{b.reverse().join(', ')}</Table.Cell>
        <Table.Cell>{c.reverse().join(', ')}</Table.Cell>
        <Table.Cell>{item.rdiff}</Table.Cell>
        <Table.Cell>{item.sdiff}</Table.Cell>
        <Table.Cell>{item.rstar}</Table.Cell>
        <Table.Cell>{item.sstar}</Table.Cell>
      </Table.Row>)
    })
  }

  renderTable = (iters) => {
    return iters.map((item, index) => {
      if (item.type === "bairstow" ) {
          return (
            <div className="ui container" key={`bairstow-${index}`}>
              <Table celled fixed singleLine >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>r</Table.HeaderCell>
                  <Table.HeaderCell>s</Table.HeaderCell>
                  <Table.HeaderCell>b</Table.HeaderCell>
                  <Table.HeaderCell>c</Table.HeaderCell>
                  <Table.HeaderCell>rdiff</Table.HeaderCell>
                  <Table.HeaderCell>sdiff</Table.HeaderCell>
                  <Table.HeaderCell>rstar</Table.HeaderCell>
                  <Table.HeaderCell>sstar</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.renderRows(item.iteration)}
              </Table.Body>
              </Table>
              <Table celled fixed singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>r</Table.HeaderCell>
                  <Table.HeaderCell>s</Table.HeaderCell>
                  <Table.HeaderCell>root</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row positive={true}>
                  <Table.Cell>{item.iteration[item.iteration.length-1].rstar}</Table.Cell>
                  <Table.Cell>{item.iteration[item.iteration.length-1].sstar}</Table.Cell>
                  <Table.Cell>{item.roots.join(', ')}</Table.Cell>
                </Table.Row>
              </Table.Body>
              </Table>
            </div>
          );
      }
      else {
        let a = item.a.slice(0)
        console.logs(roots)
        return (
            <div className="ui container" key={`direct-${index}`}>
            <h2>Step</h2>
            <Table celled fixed singleLine >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>params</Table.HeaderCell>
                <Table.HeaderCell>roots</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            <Table.Row positive={true}>
              <Table.Cell>{a.reverse().join(', ')}</Table.Cell>
              <Table.Cell>{item.roots.join(', ')}</Table.Cell>
            </Table.Row>
            </Table.Body>
            </Table>
            </div>
        )
      }
    });
  }

  render() {
    const { activeIndex } = this.state
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
          {this.renderTable(this.props.result.iterations)}
        </Accordion.Content>
      </Accordion>
    )
  }
}

const mapStateToProps = state => {
  return { result: state.bairstowResult }
}

export default connect(mapStateToProps)(Iteration)