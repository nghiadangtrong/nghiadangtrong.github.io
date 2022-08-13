import Error from 'next/error';
import Layout from '@/components/Layout/index';
import UserActions from '@/actions/user';
import { makeApiUrl } from '@/helper/utils';
import moment from 'moment';

const ProfileDetail = ({ user }) => {
  if(!user) {
    return <Error statusCode={404}/>
  }

  const renderProfile = () => (
    <div className="card" style={{ width: '100%' }}>
      <div className="row g-0">
        <div className="col-12 col-sm-12 col-md-4">
          <img 
            className="img-fluid rounded-start"
            src={makeApiUrl(['api', 'user', 'photo', user.username])}
            alt={user.username}
            />
        </div>
        <div className="col-12 col-sm-12 col-md-8">
          <dl className="row">
            <dt className="col-sm-3">Username</dt>
            <dd className="col-sm-9">{user.username}</dd>
            <dt className="col-sm-3">Joined</dt>
            <dd className="col-sm-9">{moment(user.createdAt).fromNow()}</dd>
            {user.about ? <>
              <dt className="col-sm-3">About</dt>
              <dd className="col-sm-9">{user.about}</dd>
              </>: null}
          </dl>
        </div>
      </div>
    </div>
  )

  return (
    <Layout>
      <main className="container">
        {renderProfile()}
      </main>
    </Layout>
  )
}

ProfileDetail.getInitialProps = async ({ query }) => {
  let user = await UserActions.getPublicProfile(query.username);
  return { query, user: user.data }
}

export default ProfileDetail;
