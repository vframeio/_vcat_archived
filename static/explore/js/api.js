var api = (function(){

  let token;

  function init(){
    try {
      const storage = JSON.parse(localStorage['persist:root'])
      const auth = JSON.parse(storage['auth'])
      token = auth.token
      login(auth)
    } catch (e) {
      // window.location.href = '/'
    }
  }

  function login(auth){
    const hostname = window.location.hostname
    const isLocal = (hostname === '0.0.0.0' || hostname === 'localhost' || hostname === 'lvh.me' || hostname === '8.k')
    try {
      token = auth.token
      username = auth.user.username
      if (!token && !isLocal) {
//        window.location.href = '/'
      }
    } catch(e) {
      if (!isLocal) {
//        window.location.href = '/'
      }
    }
    document.querySelector('.logged-in .capitalize').innerHTML = username || 'user'
  }

  function getCookie(name) {
    var cookieValue = null;
    var csrfEl = document.querySelector('csrfmiddlewaretoken')
    if (csrfEl) {
      return csrfEl.value
    }
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function load_hierarchy(cb){
    http_get('/api/hierarchy/').then(data => {
      const nodes = {}, children = {}
      data.forEach(el => {
        const id = el.id || 0
        const parent = el.parent || 0
        nodes[id] = el
        children[id] = children[id] || []
        children[parent] = children[parent] || []
        children[parent].push(id)
      })
      const tree = { name: 'vcat', id: 0, children: [] }
      const lookup = { 0: tree }
      Object.keys(nodes).sort((a,b) => a-b).forEach(id => {
        const n = nodes[id]
        const parent = lookup[n.parent || 0]
        const children = parent.children || []
        let name;
        if (n.is_attribute) {
          name = parent._name + ': ' + n.name + ' (' + n.region_count + ')'
        } else {
          name = n.name + ' (' + n.region_count + ')'
        }
        const node = {
          _id: id,
          name: name,
          _name: n.name,
          size: n.region_count+0.01,
        }
        parent.children = children
        parent.children.push(node)
        lookup[id] = node
      })
      cb && cb(tree)
    })
  }
  function http_headers(data){
    let headers;
    if (data instanceof FormData) {
      headers = {
        'Accept': 'application/json, application/xml, text/play, text/html, *.*',
      }
    } else {
      headers = {
        'Accept': 'application/json, application/xml, text/play, text/html, *.*',
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    headers['Authorization'] = 'Token ' + token
    // headers['X-CSRFToken'] = csrftoken
    return headers
  }

  function http_get(url){
    let headers = http_headers()
    return fetch(url, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    }).then(res => res.json())
  }

  function http_post(url, data){
    let headers = http_headers()
    if (! (data instanceof FormData)) {
      data = JSON.stringify(data)
    }
    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: data,
      credentials: 'include',
    }).then(res => res.json())
  }

  return {
    init, get: http_get, post: http_post,
    load_hierarchy,
  }
})()
