import session from '../session'

export const getSaved = () => {
  console.log('getsaved')
  try {
    return JSON.parse(session('saved')) || {}
  } catch (e) {
    console.log('error getting saved!', e)
    return {}
  }
}

export const setSaved = (saved) => {
  console.log('setsaved', saved)
  try {
    session('saved', JSON.stringify(saved))
  } catch (e) {
    console.log('error setting saved!', e)
  }
}
