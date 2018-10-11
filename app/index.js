import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { ModalContainer, ModalRoute } from 'react-router-modal'
import { Route } from 'react-router-dom'
import { PersistGate } from 'redux-persist/es/integration/react'
// import registerServiceWorker from './registerServiceWorker'

import Auth from './components/auth'
import Dashboard from './components/dashboard'
import Hierarchy from './components/hierarchy'
import Images from './components/images'
import ImageGroup from './components/imageGroup'
import Header from './components/common/header.component'
// import Menu from './components/common/menu.component'
import Editor from './components/editor'
import Test from './components/test'
import Pages from './components/pages'

import { store, persistor, history } from './util/store'

import 'spectre.css'
import './index.css'

ReactDOM.render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <Header />
          <Route exact path="/" component={Dashboard.Index} />
          <Route path="/accounts/login" component={Auth.Login} />
          <Route path="/accounts/logout" component={Auth.Logout} />
          <Route path="/accounts/signup" component={Auth.Signup} />
          <ModalRoute path="/accounts/password_change" component={Auth.PasswordChange} />
          <ModalRoute path="/accounts/password_reset" component={Auth.PasswordReset} />

          <Route exact path="/hierarchy/" component={Hierarchy.View} />
          <Route exact path="/hierarchy/:id/" component={Hierarchy.View} />
          <Route exact path="/hierarchy/:id/new/" component={Hierarchy.Create} />
          <Route exact path="/hierarchy/:id/edit/" component={Hierarchy.Edit} />

          <Route exact path="/categories/" component={Hierarchy.View} />
          <Route exact path="/categories/:id/" component={Hierarchy.View} />
          <Route exact path="/categories/:id/new/" component={Hierarchy.Create} />
          <Route exact path="/categories/:id/edit/" component={Hierarchy.Edit} />

          <Route exact path="/groups/user/" component={ImageGroup.UserGroupBrowser} />
          <Route exact path="/groups/show/:group_id/annotate/:id/" component={Editor.View} />
          <Route exact path="/groups/show/:group_id/" component={ImageGroup.ImageGroupShow} />

          <Route exact path="/images/" component={Images.Index} />
          <Route exact path="/images/user/" component={Images.Index} />
          <Route exact path="/images/new/" component={Images.Create} />
          <Route exact path="/images/show/:id/" component={Images.View} />
          <Route exact path="/images/edit/:id/" component={Images.Edit} />
          <Route exact path="/images/annotate/:id/" component={Editor.View} />

          <Route path="/test/stage/" component={Test.Stage} />
          <Route path="/test/autocomplete/" component={Test.Autocomplete} />
          <Route path="/test/search/" component={Test.Search} />
          <Route path="/editor/image/:id/" component={Editor.View} />

          <Route path="/help/" component={Pages.Guide} />
          <ModalContainer />
        </div>
      </ConnectedRouter>
    </Provider>
  </PersistGate>,
  document.getElementById('root'))
// registerServiceWorker()

          // <Menu />
          // <Route path="/images/:id/" component={Images.View} />
          // <Route path="/images/:id/edit/" component={Images.Edit} />
          // <Route path="/images/:id/annotate/" component={Editor.App} />
