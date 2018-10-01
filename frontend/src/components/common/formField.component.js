import React from 'react';
import './formField.css'

function FormField(props){
  switch (props.type) {
    case 'textarea':
      return Textarea(props)
    case 'checkbox':
      return CheckboxField(props)
    default:
      return InputField(props)
  }
}

function InputField(props){
  const key = 'form_' + props.name
  const className = props.className ? props.className + ' field form-group' : 'field form-group'
  return (
    <div className={className}>
      <label className='col-2' htmlFor={key}>
        {props.label}
      </label>
      <div className='col-6'>
        <input
          type={props.type}
          id={key}
          name={props.name}
          value={props.value || ''}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          autoCapitalize={props.autoCapitalize}
          autoComplete={props.autoComplete}
          required={props.required}
          disabled={props.disabled}
          onChange={props.onChange || function(){}}
          className={'form-input'}
        />
        {props.instruction && <span className='instruction'>{props.instruction}</span>}
      </div>
    </div>
  )
}

function Textarea(props){
  const key = 'form_' + props.name
  const className = props.className ? props.className + ' field form-group' : 'field form-group'
  return (
    <div className={className}>
      <label className='col-2' htmlFor={key}>
        {props.label}
      </label>
      <div className='col-6'>
        <textarea
          id={key}
          name={props.name}
          value={props.value || ''}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          autoCapitalize={props.autoCapitalize}
          required={props.required}
          disabled={props.disabled}
          onChange={props.onChange || function(){}}
          className={'form-input'}
        />
        {props.instruction && <span className='instruction'>{props.instruction}</span>}
      </div>
    </div>
  )
}

function InfoField(props){
  if (props.optional && !props.value) return null;
  const className = props.className ? props.className + ' field form-group' : 'field form-group'
  return (
    <div className={className}>
      <label className='col-2'>
        {props.label}
      </label>
      <div className='col-6'>
        {props.value || '~'}
      </div>
    </div>
  )
}

function SubmitField(props){
  const key = 'submit'
  let className = 'btn btn-primary'
  if (props.loading) {
    className += ' loading'
  }
  return (
    <div className={'form-group'}>
      <label className='col-2' htmlFor={key}>
      </label>
      <div className='col-6'>
        <input
          type={'submit'}
          id={key}
          name={props.name}
          value={props.label || 'Submit'}
          disabled={props.disabled}
          className={className}
          onClick={props.onClick}
        />
      </div>
    </div>
  )
}

function RadioButton(props) {
  return (
    <label className="form-radio">
      <input
        type="radio"
        name={props.name}
        checked={props.checked}
        onChange={() => props.onChange({ target: props })}
      />
      <i className="form-icon"></i>
      {" " + props.label}
    </label>
  )
}

function Checkbox(props) {
  return (
    <div className="form-group">
      <label className="form-switch">
        <input
          type="checkbox"
          name={props.name}
          checked={props.checked}
          onChange={(e) => props.onChange({ target: { name: props.name, value: e.target.checked } })}
        />
        <i className="form-icon"></i>
        {" "}
        <span className={props.instruction ? "instruction" : ""}>{props.instruction ? props.instruction : props.label}</span>
      </label>
    </div>
  )
}
function CheckboxField(props){
  return (
    <div className="form-group">
      <div className="col-2">{props.label}</div>
      <div className="col-6">
        <Checkbox
          {...props}
        />
      </div>
    </div>
  )
}
function Errors(props){
  if (! props.errors || ! props.errors.length) return null;
  const errors = props.errors.map((msg, i) => (<div key={i}>{msg}</div>))
  return (
    <div className="errors">
      {errors}
    </div>
  );
}

export {
  FormField, InputField, CheckboxField, InfoField, SubmitField,
  RadioButton, Checkbox, Textarea,
  Errors
}