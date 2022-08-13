import { useState, useEffect } from 'react';
import { getValueFormSubmit } from '@/helper/form';
import AuthActions from '@/actions/auth';
import { isAuth } from '@/helper/auth';
import Link from 'next/Link';
import Router from 'next/router';

const SignUp = () => {
  const [ form, setForm ] = useState({
    name: '',
    email: '',
    password: '',
    loading: false,
    error: null,
    submitSuccess: null,
  })

  // check singin
  useEffect(() => (isAuth() && Router.push('/')), [])

  const onChangeField = (e) => {
    setForm({...form, error: null, submitSuccess: null, [e.target.name]: e.target.value});
  }

  const onSubmit = async (eventForm) => {
    eventForm.preventDefault();
    setForm({ ...form, loading: true })

    let values = getValueFormSubmit({ eventForm, formValues: form });

    let result = await AuthActions.signup(values)
    if(result.error) {
      return setForm({ ...form, loading: false, error: result.error})
    }

    setForm({ 
      name: '',
      email: '',
      password: '',
      loading: false,
      error: null,
      submitSuccess: true,
    })
  }

  const renderForm = () => {
    if(form.submitSuccess) {
      return(
        <div className="alert alert-success" role="alert">
          Sign-up Success, Sig-in <Link href='/signin'>here</Link>
        </div>
      )
    }

    return (
      <form onSubmit={onSubmit}>
        <div className="mt-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input 
            type="text" className="form-control" id="name" name="name" placeholder="Enter Name"
            disabled={form.loading}
            onChange={onChangeField} 
            value={form.name}
          />
        </div>
        <div className="mt-3">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input 
            type="email" className="form-control" id="email" name="email" placeholder="Enter Email"
            disabled={form.loading}
            onChange={onChangeField}
            value={form.email}
          />
        </div>
        <div className="mt-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" className="form-control" 
            id="password" name="password" placeholder="Enter Password" autoComplete="off"
            disabled={form.loading}
            onChange={onChangeField}
            value={form.password}
          />
        </div>

        <div className="mt-4 d-grid gap-2 col-xs-12 mx-auto">
          <button
            type="submit" 
            className="btn btn-primary d-flex justify-content-center align-items-center"
            disabled={form.loading}
          >
            {form.loading && 
              <div className="spinner-border text-info me-3" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            }
            Submit
        </button>
        </div>
      </form>
    )
  }
  
  const renderMessageError = () => {
    if(!form.error) return;

    return (
      <div className="mt-3 alert alert-danger" role="alert">
        {JSON.stringify(form.error)}
      </div>
    )
  }

  return (
    <>
      { renderMessageError() }
      { renderForm() }
    </>
  )
}

export default SignUp;
