/* eslint no-use-before-define: 0, camelcase: 0, one-var-declaration-per-line: 0, one-var: 0, quotes: 0, prefer-destructuring: 0, no-alert: 0, no-console: 0, no-multi-assign: 0 */

function loadApp() {
  const result_template = document.querySelector('#result-template').innerHTML
  const results_el = document.querySelector('.results')
  const query_div = document.body.querySelector('.query > div')
  let bounds
  let token, username
  let x, y, mouse_x, mouse_y, dx, dy, box
  let dragging = false
  let cropping = false
  let creating = false
  let did_check = false

  function init() {
    login()
    bind()
    route()
  }
  function bind() {
    window.onpopstate = route
    document.querySelector('[name=img]').addEventListener('change', upload)
    on('click', '.results a', preventDefault)
    on('click', '.search', search)
    on('click', '.panic', panic)
    on('click', '.upload_again', upload_again)
    on('click', '.browse', browse)
    on('click', '.results img', save)
    on('click', '.view_saved', loadSaved)
    on('click', '.create_new_group', createNewGroup)
    on('click', '.reset', reset)
    on('click', '.random', random)
    on('click', '.check', check)
    on('mousedown', '.query img', down)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('keydown', keydown)
  }
  function route() {
    const path = window.location.pathname.split('/')
    // remove initial slash
    path.shift()
    // remove dummy route
    if (path[0] === 'search') path.shift()
    switch (path[0]) {
      case 'fetch':
        search({ target: { url: window.location.search.substr(1).split('=')[1] } })
        break
      case 'view':
        search(path.slice(1))
        break
      case 'q':
        if (path.length === 3) {
          search({ target: { dir: path[1], fn: path[2] } })
        } else {
          browse({ target: { dir: path[1], fn: null } })
        }
        break
      case 'saved':
        loadSaved()
        break
      default:
        break
    }
  }
  function keydown(e) {
    switch (e.keyCode) {
      case 27: // escape
        panic()
        break
      default:
        break
    }
  }

  // load search results
  function loadResults(data) {
    console.log(data)
    if (!data.query.url) return
    // console.log(data)
    document.body.className = 'searching'
    const path = getPathFromImage(data.query.url)
    pushState('searching', "/search/fetch/?url=" + path.url)
    if (path.dir === 'uploaded' && path.fn.match('_filename')) {
      loadMessage(
        "<a href='javascript:history.go(-1)'>&lt; Back</a> | "
      + "Searching subregion, "
      + "found " + data.results.length + " images"
      )
    } else {
      loadMessage(
        "Found " + data.results.length + " images"
      )
    }
    loadQuery(data.query.url)
    if (!data.results.length) {
      results_el.innerHTML = "No results"
      return
    }
    const saved = window.store.get('saved', [])

    results_el.innerHTML = data.results.map(res => {
      const { distance, file, hash, frame, url } = res
      const isSaved = saved.indexOf(url) !== -1
      const { type } = getPathFromImage(url)
      let className = isSaved ? 'saved' : ''
      className += ' ' + type
      let t = result_template
        .replace('{score}', Math.floor(clamp(1 - distance, 0, 1) * 100) + "%")
        .replace('{browse}', '/search/q/' + hash)
        .replace('{search}', '/search/view/' + [file, hash, frame].join('/'))
        .replace('{className}', className)
        .replace('{saved_msg}', isSaved ? 'Saved' : 'Save')
        .replace('{img}', url)
      return t
    }).join('')
  }

  function loadDirectory(data) {
    console.log(data)
    document.body.className = 'browsing'
    pushState('searching', "/search/q/" + data.path)
    loadMessage("Video: <b>" + data.path + "</b>")
    loadQuery("")
    if (!data.results.length) {
      results_el.innerHTML = "No frames found"
      return
    }
    const saved = window.store.get('saved', [])
    results_el.innerHTML = data.results
    .map(result => [parseInt(result.frame, 10), result])
    .sort((a, b) => a[0] - b[0])
    .map(pair => {
      let { file, hash, frame, url } = pair[1]
      const isSaved = saved.indexOf(url) !== -1
      let className = isSaved ? 'saved' : ''
      let t = result_template
        .replace('{img}', url)
        .replace('{browse}', '/search/q/' + hash)
        .replace('{search}', '/search/view/' + [file, hash, frame].join('/'))
        .replace('{className}', className)
        .replace('{saved_msg}', isSaved ? 'Saved' : 'Save')
      return t
    }).join('')
  }
  function loadSaved() {
    document.body.className = 'saving'
    pushState('View saved', "/search/saved")
    const saved = window.store.get('saved', [])
    cropping = false
    loadMessage(saved.length + " saved image" + (saved.length === 1 ? "" : "s"))
    loadQuery('')
    const box_el = document.querySelector('.box')
    if (box_el) box_el.parentNode.removeChild(box_el)
    results_el.innerHTML = saved.map(href => {
      const { url, dir } = getPathFromImage({ src: href })
      let className = 'saved'
      let t = result_template
        .replace('{img}', href)
        .replace('{browse}', '/search/q/' + dir)
        .replace('{search}', '/search/fetch/?url=' + url)
        .replace('{className}', className)
        .replace('{saved_msg}', 'Saved')
      return t
    }).join('')
  }
  function loadQuery(path) {
    if (cropping) return
    const qd = document.querySelector('.query div')
    qd.innerHTML = ''
    if (path.match(/(gif|jpe?g|png)$/)) {
      const img = new Image()
      img.setAttribute('crossorigin', 'anonymous')
      img.src = path.replace('sm', 'md')
      qd.appendChild(img)
    } else {
      qd.innerHTML = path || ""
    }
  }
  function loadMessage(msg) {
    document.querySelector('.query .msg').innerHTML = msg
  }

  // panic button
  function panic() {
    loadMessage('Query cleared')
    loadQuery('')
    results_el.innerHTML = ''
  }

  // adding stuff to localstorage
  function save(e) {
    const { url } = getPathFromImage(e.target)
    const saved = window.store.get('saved', [])
    let newList = saved || []
    if (saved.indexOf(url) !== -1) {
      newList = saved.filter(f => f !== url)
      e.target.parentNode.classList.remove('saved')
    } else {
      newList.push(url)
      e.target.parentNode.classList.add('saved')
    }
    window.store.set('saved', newList)
  }
  function reset() {
    const shouldReset = window.confirm("This will reset the saved images. Are you sure?")
    if (!shouldReset) return
    window.store.set('saved', [])
    loadSaved()
    document.querySelector('[name=title]').value = ''
    window.alert("Reset saved images")
  }

  // submit the new group
  function createNewGroup() {
    const title = document.querySelector('[name=title]').value.trim().replace(/[^-_a-zA-Z0-9 ]/g, "")
    const saved = window.store.get('saved', [])
    const graphic = document.querySelector('[name=graphic]').checked
    if (!title.length) return alert("Please enter a title for this group")
    if (!saved.length) return alert("Please pick some images to save")
    if (!did_check) {
      alert('Automatically checking for duplicates. Please doublecheck your selection.')
      return check()
    }
    if (creating) return null
    creating = true
    return http_post("/api/images/import/new/", {
      title,
      graphic,
      saved
    }).then(res => {
      console.log(res)
      window.store.set('saved', [])
      window.location.href = '/groups/show/' + res.image_group.id
    }).catch(res => {
      alert('Error creating group.  The server response is logged to the console.')
      console.log(res)
      creating = false
    })
  }

  // api queries
  function login() {
    const isLocal = (window.location.hostname === '0.0.0.0')
    try {
      // csrftoken = "test" // getCookie('csrftoken')
      const auth = JSON.parse(window.store.get('persist:root').auth)
      token = auth.token
      username = auth.user.username
      if (!token && !isLocal) {
        window.location.href = '/'
      }
    } catch (e) {
      if (!isLocal) {
        window.location.href = '/'
      }
    }
    document.querySelector('.logged-in .capitalize').innerHTML = username || 'user'
  }

  function upload(e) {
    cropping = false
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files
    let i, f
    for (i = 0, f; i < files.length; i++) {
      f = files[i]
      if (f && f.type.match('image.*')) break
    }
    if (!f) return
    do_upload(f)
  }

  function do_upload(f) {
    const fd = new FormData()
    fd.append('query_img', f)
    document.body.className = 'loading'
    http_post('/search/api/upload', fd).then(loadResults)
  }

  function upload_again() {
    const { files } = document.querySelector('input[type=file]')
    if (!files.length) {
      window.alert('Please upload a file.')
      return
    }
    upload({
      dataTransfer: { files }
    })
  }

  function search(e) {
    if (e.length) return search_by_vector(e)
    const { url } = getPath(e.target)
    cropping = false
    document.body.className = 'loading'
    loadQuery(url)
    loadMessage('Loading results...')
    http_get('/search/api/fetch/?url=' + url).then(loadResults)
  }

  function search_by_vector(e) {
    cropping = false
    document.body.className = 'loading'
    loadQuery('')
    loadMessage('Loading results...')
    http_get('/search/api/search/' + e.join('/')).then(loadResults)
  }

  function browse(e) {
    document.body.className = 'loading'
    cropping = false
    let dir;
    if (e.target.dir) {
      dir = e.target.dir
    }
    else {
      const href = e.target.parentNode.href
      dir = href.split('/')[5]
      console.log(href, dir)
    }
    loadMessage('Listing video...')
    http_get('/search/api/list/' + dir).then(loadDirectory)
  }

  function check() {
    http_post('/api/images/import/search/', {
      saved: window.store.get('saved') || [],
    }).then(res => {
      console.log(res)
      const { good, bad } = res
      did_check = true
      window.store.set('saved', good)
      if (!bad.length) {
        return alert("No duplicates found.")
      }
      bad.forEach(path => {
        const el = document.querySelector('img[src="' + path + '"]')
        if (el) el.parentNode.classList.remove('saved')
      })
      return alert("Untagged " + bad.length + " duplicate" + (bad.length === 1 ? "" : "s") + ".")
    })
  }

  function random() {
    http_get('/search/api/random').then(loadResults)
  }

  // drawing a box
  function down(e) {
    e.preventDefault()
    dragging = true
    bounds = query_div.querySelector('img').getBoundingClientRect()
    mouse_x = e.pageX
    mouse_y = e.pageY
    x = mouse_x - bounds.left
    y = mouse_y - bounds.top
    dx = dy = 0
    box = document.querySelector('.box') || document.createElement('div')
    box.className = 'box'
    box.style.left = x + 'px'
    box.style.top = y + 'px'
    box.style.width = 0 + 'px'
    box.style.height = 0 + 'px'
    query_div.appendChild(box)
  }
  function move(e) {
    if (!dragging) return
    e.preventDefault()
    dx = clamp(e.pageX - mouse_x, 0, bounds.width - x)
    dy = clamp(e.pageY - mouse_y, 0, bounds.height - y)
    box.style.width = dx + 'px'
    box.style.height = dy + 'px'
  }
  function up(e) {
    if (!dragging) return
    dragging = false
    e.preventDefault()
    const img = query_div.querySelector('img')
    const canvas = query_div.querySelector('canvas') || document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const ratio = img.naturalWidth / bounds.width
    canvas.width = dx * ratio
    canvas.height = dy * ratio
    if (dx < 10 || dy < 10) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
      const box_el = document.querySelector('.box')
      if (box_el) box_el.parentNode.removeChild(box_el)
      return
    }
    query_div.appendChild(canvas)
    ctx.drawImage(
      img,
      x * ratio,
      y * ratio,
      dx * ratio,
      dy * ratio,
      0, 0, canvas.width, canvas.height
    )
    cropping = true
    const blob = window.dataUriToBlob(canvas.toDataURL('image/jpeg', 0.9))
    do_upload(blob)
  }

  // utility functions
  function http_get(url) {
    return fetch(url).then(res => res.json())
  }
  function http_post(url, data) {
    let headers
    if (data instanceof FormData) {
      headers = {
        Accept: 'application/json, application/xml, text/play, text/html, *.*',
        Authorization: 'Token ' + token,
      }
    } else {
      headers = {
        Accept: 'application/json, application/xml, text/play, text/html, *.*',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Token ' + token,
      }
      data = JSON.stringify(data)
    }

    // headers['X-CSRFToken'] = csrftoken
    return fetch(url, {
      method: 'POST',
      body: data,
      credentials: 'include',
      headers,
    }).then(res => res.json())
  }
  function on(evt, sel, handler) {
    document.addEventListener(evt, function (event) {
      let t = event.target
      while (t && t !== this) {
        if (t.matches(sel)) {
          handler.call(t, event)
        }
        t = t.parentNode
      }
    })
  }
  function getPathFromImage(el) {
    const url = el.src ? el.src : el
    const partz = url.split('/')
    let type, dir, fn
    if (partz.length === 3) {
      type = 'photo'
      dir = ''
      fn = ''
    }
    if (partz.length === 9) {
      type = 'photo'
      dir = partz[6]
      fn = ''
    } else if (partz.length === 10) {
      type = 'video'
      dir = partz[6]
      fn = partz[7]
    }
    return { type, dir, fn, url }
  }
  function getPath(el) {
    if (el.url) {
      return getPathFromImage(el.url)
    } if (el.dir) {
      return el
    }
    el = el.parentNode.parentNode.parentNode.querySelector('img')
    return getPathFromImage(el)
  }
  function pushState(txt, path) {
    if (window.location.pathname === path) return
      console.log('pushstate', path)
    window.history.pushState({}, txt, path)
  }
  function preventDefault(e) {
    if (e) e.preventDefault()
  }
  function clamp(n, a, b) { return n < a ? a : n < b ? n : b }

  // initialize the app when the DOM is ready
  document.addEventListener('DOMContentLoaded', init)
}

loadApp()
