import Layout from '@/components/Layout';
import SignUpForm from '@/components/auth/SignupForm';

export default () => {

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <p className="mt-3 h3 text-center">Sign-up</p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xs-12 col-sm-12 col-md-6">
              <SignUpForm />
          </div>
        </div>
      </div>
    </Layout>
  )
}
