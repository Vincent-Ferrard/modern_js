import React from 'react'

export default function(ComposedComponent) {

  class RequireAuth extends React.Component {

    // Push to login route if not authenticated on mount
    componentWillMount() {
      const tmp = localStorage.getItem("token");
      if (tmp == null) {
          this.props.history.push("/login");
      }
    }

    // Push to login route if not authenticated on update
    componentWillUpdate(nextProps) {
      const tmp = localStorage.getItem("token");
      if (tmp == null) {
          this.props.history.push("/login");
      }
    }

    // Otherwise render the original component
    render() {
      return <ComposedComponent {...this.props}/>
    }

  }

  return RequireAuth

}