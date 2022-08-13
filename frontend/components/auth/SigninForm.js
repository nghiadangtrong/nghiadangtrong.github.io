import { useState, useEffect } from 'react';
import { getValueFormSubmit } from '@/helper/form';
import AuthAction, { authenticate } from '@/actions/auth';
import { isAuth } from '@/helper/auth';
import Router from 'next/router';

const SigninForm = () => {
  let [form, setForm] = useState({
    email: '',
    password: '',
    loading: false,
    error: null,
    submitSuccess: null,
  })

  // check signin
  useEffect(() => (isAuth() && Router.push('/')), [])

  const onChangeField = (e) => {
    setForm({
      ...form,
      error: null, submitSuccess: null,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = async (eventForm) => {
    eventForm.preventDefault();
    setForm({ ...form, loading: true, error: null, submitSuccess: null })
    let values = getValueFormSubmit({ eventForm, formValues: form })
    let response = await AuthAction.signin(values);
    if(response.error) {
      return setForm({ 
        ...form, loading: false, 
        error: response.error, submitSuccess: null
      })
    }

    authenticate(response.data, () => {
      Router.push('/')
    })
  }

  const renderForm = () => {

    return (
      <form onSubmit={onSubmit}>
        <div className="mt-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email" className="form-control" name="email" id="email" placeholder="Enter Email"
            onChange={onChangeField}
            value={form.email}
            disabled={form.loading}
          />
        </div>
        <div className="mt-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password" className="form-control" name="password" id="password" placeholder="Enter Password"
            onChange={onChangeField}
            value={form.password}
            disabled={form.loading}
          />
        </div>
        <div className="mt-4 d-grid col-12">
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

  const renderError = () => {
    const { error } = form;
    if(!error) { return }

    return (
      <div className="mt-3 alert alert-danger" role="alert">
        {JSON.stringify(error)}
      </div>
    )
  }

  return (
    <>
      { renderError() }
      { renderForm() }
    </>
  )
} 

export default SigninForm
