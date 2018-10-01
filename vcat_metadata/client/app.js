import React, { Component } from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'

import { Header, Sidebar, Footer } from './common'
import * as Metadata from './metadata'

export default class App extends Component {
  render() {
    return (
      <ConnectedRouter history={this.props.history}>
        <div>
          <Header />
          <div className='app'>
            <Sidebar />
            <div className='body'>
              <Route path="/metadata/:hash/" component={Metadata.Heading} />
              <Switch>
                <Route exact path="/metadata/:hash/summary/" component={Metadata.Summary} />
                <Route exact path="/metadata/:hash/mediaRecord/" component={Metadata.MediaRecord} />
                <Route exact path="/metadata/:hash/mediaInfo/" component={Metadata.MediaInfo} />
                <Route exact path="/metadata/:hash/keyframe/:frame/" component={Metadata.KeyframeSingle} />
                <Route exact path="/metadata/:hash/keyframe/" component={Metadata.KeyframeList} />
                <Route exact path="/metadata/:hash/coco/" component={Metadata.Coco} />
                <Route exact path="/metadata/:hash/places365/" component={Metadata.Places365} />
                <Route exact path="/metadata/:hash/sugarcube/" component={Metadata.Sugarcube} />
                <Route exact path="/metadata/:hash/" component={Metadata.Summary} />
                <Route exact path="/metadata/" render={() => <div class='notFound'><h4>NOT FOUND</h4></div>} />
              </Switch>
            </div>
          </div>
          <Footer />
        </div>
      </ConnectedRouter>
    )
  }
}
