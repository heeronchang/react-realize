// import React from "react";
// import ReactDOM from "react-dom";
import React from "./react/react";
import ReactDOM from "./react/react-dom";

class ClassComponent extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {fk: 100};
  // }
  // state = { num: 100 };
  componentDidMount() {
    console.log("componentDidMount-ClassComponent")
    // console.log(this.state)
    // setTimeout(() => {
    //   this.setState({ num: this.state.num + 1 });
    // }, 1000);
  }
  render() {
    return <><ChildCmpt /></>;
    // return <ChildCmpt num={this.state.num} />;
    // return <h1>{this.state.fk}</h1>
  }
}

class ChildCmpt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
    };
  }

  componentWillMount() {
    console.log("componentWillMount-ChildCmpt");
  }

  componentDidMount() {
    // console.log(this.state)
    console.log("componentDidMount-ChildCmpt");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate-ChildCmpt");
    // return nextState.num % 2 === 0;
    return true;
  }

  componentWillUpdate() {
    console.log("componentWillUpdate-ChildCmpt");
  }

  componentDidUpdate() {
    console.log("componentDidUpdate-ChildCmpt");
  }

  changeNum = () => {
    this.setState({ num: this.state.num + 1 });
  };

  render() {
    console.log("render-ChildCmpt");
    return (
      // <>
      //   <h1>prop-num:{this.props.num}</h1>
      //   <h1>num:{this.state.num}</h1>
      //   <button onClick={this.changeNum}>+</button>
      // </>
      <h1>1</h1>
    );
  }
}

const e3 = <ClassComponent name="e3"></ClassComponent>;

// console.log("e3", e3);
ReactDOM.render(e3, document.getElementById("root"));
